"use server"

import { GoogleGenAI } from '@google/genai';
import { prisma } from "@/lib/prisma";
import { buildRecommendationPrompt, generateReminderPrompt, parseInvoiceFromTextPrompt } from '@/lib/gemini';
import { differenceInDays } from "date-fns";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateContent (prompt: string) {
    return await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt 
    })
}

export enum Tone {
  FRIENDLY = 'FRIENDLY',
  PROFESSIONAL = 'PROFESSIONAL',
  FIRM = 'FIRM',
  LEGAL_LEANING = 'LEGAL_LEANING'
}

export enum Medium {
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL'
}

export type ParseInvoiceResponse =
  | { success: true; invoice: any }
  | { error: true; message: string };

export async function parseInvoiceFromTextAction(
  text: string
): Promise<ParseInvoiceResponse> {
  if (!text || !text.trim()) {
    return { error: true, message: "Input text must not be empty." };
  }

  try {
    // build prompt using shared util
    const prompt = await parseInvoiceFromTextPrompt(text);

    if (!prompt) {
      return { error: true, message: "Failed to construct AI prompt." };
    }

    const response = await generateContent(prompt);

    console.log("Raw AI response for invoice parsing:", response.text);

    if (!response || typeof response.text !== "string") {
      console.error("AI response missing text field", response);
      return { error: true, message: "Unexpected AI response format." };
    }

    // sometimes the model wraps JSON in markdown fences
    const cleaned = response.text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("JSON parse failed for AI output", { cleaned, parseErr });
      return {
        error: true,
        message: "Unable to parse invoice data from AI output.",
      };
    }

    // basic sanity check -- require at least one known property
    if (typeof parsed !== "object" || !parsed) {
      return {
        error: true,
        message: "Parsed invoice is not an object.",
      };
    }

    return { success: true, invoice: parsed };
  } catch (err) {
    console.error("Error in parseInvoiceFromTextAction:", err);
    return {
      error: true,
      message: "An unexpected error occurred while parsing invoice text.",
    };
  }
}

export async function generateReminder(tone: Tone, medium: Medium, invoiceId: string) {
   try {
        if (!invoiceId) {
          return { error: "Invoice ID is required"}
        }
        if (!tone) {
          return { error: "Please set a tone you want for the reminder"}
        }
        if (!medium) {
          return { error: "Please set a medium through which you want to send the reminder"}
        }

        const invoice = await prisma.invoice.findUnique({
          where: {
            id: invoiceId
          },
          include: {
            items: true
          }
        });

        if (!invoice) {
            return { error: "Invoice does not exist" }
        }

        const prompt = generateReminderPrompt(invoice, tone, medium);

        const response = await generateContent(prompt);

        return { reminder: response }
    } catch (error) {
        console.log(error)
        return { error: " " }
    }
}

export type DashboardAnalyticsResponse =
  | { success: true; metrics: any; insights: any }
  | { error: true; message: string };

export async function getDashboardInvoiceAnalyticsSummary(
  userId: string
): Promise<DashboardAnalyticsResponse> {
  // Input validation
  if (!userId || typeof userId !== 'string') {
    return { error: true, message: 'Valid user ID is required.' };
  }

  try {
    // Fetch business for the user
    const business = await prisma.business.findFirst({
      where: { ownerId: userId },
    });

    if (!business) {
      return { error: true, message: 'No business found for the specified user.' };
    }

    // Fetch invoices with related data
    const invoices = await prisma.invoice.findMany({
      where: { businessId: business.id },
      include: {
        payments: true,
        client: true,
      },
    });

    if (invoices.length === 0) {
      return {
        success: true,
        metrics: null,
        insights: { risks: [], recommendations: [], automationIdeas: [] },
      };
    }

    // Compute metrics
    let totalPaidInvoices = 0;
    let totalOverdueInvoices = 0;
    const today = new Date();
    const delayByMonth: Record<string, number[]> = {};
    const latePaymentsByCustomer: Record<string, number> = {};

    for (const invoice of invoices) {
      if (invoice.status === 'PAID' && invoice.payments.length > 0) {
        totalPaidInvoices++;
        const paidAt = invoice.payments[0].paidAt;
        const delay = differenceInDays(paidAt, invoice.dueDate);

        if (delay > 0) {
          latePaymentsByCustomer[invoice.clientId] =
            (latePaymentsByCustomer[invoice.clientId] || 0) + 1;
        }

        const monthKey = paidAt.toISOString().slice(0, 7);
        delayByMonth[monthKey] = delayByMonth[monthKey] || [];
        delayByMonth[monthKey].push(Math.max(delay, 0));
      }

      // Treat an invoice as overdue either if its status is explicitly OVERDUE
      // or if it's marked DUE but the dueDate has already passed.
      const isOverdue =
        invoice.status === 'OVERDUE' ||
        (invoice.status === 'DUE' && invoice.dueDate && invoice.dueDate.getTime() < today.getTime());

      if (isOverdue) {
        totalOverdueInvoices++;
      }
    }

    // Payment delay trend
    const months = Object.keys(delayByMonth).sort();
    const monthlyAverages = months.map((month) => {
      const delays = delayByMonth[month];
      const avg = delays.reduce((sum, d) => sum + d, 0) / Math.max(delays.length, 1);
      return { month, avgDelay: Number(avg.toFixed(2)) };
    });

    const recent = monthlyAverages.slice(-2);
    const paymentDelayTrend =
      recent.length === 2
        ? recent[1].avgDelay > recent[0].avgDelay
          ? 'WORSENING'
          : recent[1].avgDelay < recent[0].avgDelay
          ? 'IMPROVING'
          : 'STABLE'
        : 'INSUFFICIENT_DATA';

    // Repeat late payers
    const repeatLatePayers = Object.entries(latePaymentsByCustomer)
      .filter(([, count]) => count >= 3)
      .map(([clientId]) => clientId);

    // Build context for AI
    const context = {
      totalInvoices: invoices.length,
      totalPaidInvoices,
      totalOverdueInvoices,
      overdueRate: invoices.length > 0 ? Number((totalOverdueInvoices / invoices.length).toFixed(2)) : 0,
      paymentDelayTrend,
      monthlyAverageDelays: monthlyAverages,
      repeatLatePayersCount: repeatLatePayers.length,
    };

    // Generate AI recommendations
    const prompt = buildRecommendationPrompt(context);
    if (!prompt) {
      console.error('Failed to build AI prompt for analytics');
      return { error: true, message: 'Failed to prepare analytics request.' };
    }

    const response = await generateContent(prompt);
    if (!response || !response.text) {
      console.error('AI response missing or empty', response);
      return { error: true, message: 'Failed to generate analytics insights.' };
    }

    // Parse AI output - handle markdown code blocks
    let aiOutput;
    try {
      // Extract JSON from markdown code blocks if present
      const text = response.text.trim();
      let jsonString = text;

      // Check if it starts with ```json and ends with ```
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
      if (jsonMatch) {
        jsonString = jsonMatch[1].trim();
      } else {
        // Fallback: remove any remaining markdown fences
        jsonString = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      }

      aiOutput = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON', { responseText: response.text, parseError });
      aiOutput = { risks: [], recommendations: [], automationIdeas: [] };
    }

    return {
      success: true,
      metrics: context,
      insights: aiOutput,
    };
  } catch (error) {
    console.error('Error in getDashboardInvoiceAnalyticsSummary:', error);
    return {
      error: true,
      message: 'An unexpected error occurred while generating invoice analytics. Please try again later.',
    };
  }
}