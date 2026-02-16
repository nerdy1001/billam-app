"use server"

import { GoogleGenAI } from '@google/genai';
import { prisma } from "@/lib/prisma";
import { buildRecommendationPrompt, generateReminderPrompt, parseInvoiceFromTextPrompt } from '@/lib/gemini';
import { differenceInDays } from "date-fns";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateContent (prompt: string) {
    return await ai.models.generateContent({
        model: "gemini-2.5-pro",
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

export async function parseInvoiceFromTextAction(text: string) {
    if (!text) {
        return { error: "Text is required" };
    }

    try {

        const prompt = await parseInvoiceFromTextPrompt(text);

        const response = await generateContent(prompt);

        const responseText = response.text;

        const cleanedJSON = responseText?.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsedInvoice = JSON.parse(cleanedJSON!);

        return { parsedInvoice }
        
    } catch (error) {
        console.log(error)
        return { error: "Failed to parse error from text" }
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

export async function getDashboardInvoiceAnalyticsSummary(userId: string) {
    try {
        const business = await prisma.business.findFirst({
            where: {
                ownerId: userId
            }
        });

        if (!business) {
            return { error: "No business exists for this user" }
        }

        /**
         * 1️⃣ Fetch invoices + payments
        */
        const invoices = await prisma.invoice.findMany({
            where: { 
                businessId: business.id
            },
            include: {
                payments: true,
                customer: true,
            },
        });

        if (invoices.length === 0) {
            return {
                metrics: null,
                recommendations: [],
                error: "Not enough data to generate insights",
            };
        };

        /**
         * 2️⃣ Compute metrics
        */

        let totalPaidInvoices = 0;
        let totalOverdueInvoices = 0;

        const delayByMonth: Record<string, number[]> = {};
        const latePaymentsByCustomer: Record<string, number> = {};

        for (const invoice of invoices) {
            if (invoice.status === "PAID" && invoice.payments.length > 0) {
                totalPaidInvoices++;

                const paidAt = invoice.payments[0].paidAt;
                const delay = differenceInDays(paidAt, invoice.dueDate);

                if (delay > 0) {
                    // Track late payers
                    latePaymentsByCustomer[invoice.customerId] =
                    (latePaymentsByCustomer[invoice.customerId] || 0) + 1;
                }

                // Group delay by month
                const monthKey = paidAt.toISOString().slice(0, 7); // YYYY-MM
                delayByMonth[monthKey] = delayByMonth[monthKey] || [];
                delayByMonth[monthKey].push(Math.max(delay, 0));
            }

            if (invoice.status === "OVERDUE") {
                totalOverdueInvoices++;
            }
        }

        /**
        * 3️⃣ paymentDelayTrend
        */
        const months = Object.keys(delayByMonth).sort();

        const monthlyAverages = months.map((month) => {
            const delays = delayByMonth[month];
            const avg =
            delays.reduce((sum, d) => sum + d, 0) / Math.max(delays.length, 1);
            return { month, avgDelay: Number(avg.toFixed(2)) };
        });

        const recent = monthlyAverages.slice(-2);
        const paymentDelayTrend =
            recent.length === 2
            ? recent[1].avgDelay > recent[0].avgDelay
                ? "WORSENING"
                : recent[1].avgDelay < recent[0].avgDelay
                ? "IMPROVING"
                : "STABLE"
            : "INSUFFICIENT_DATA";

        /**
        * 4️⃣ repeatLatePayers
        */
        const repeatLatePayers = Object.entries(latePaymentsByCustomer)
            .filter(([, count]) => count >= 3)
            .map(([customerId]) => customerId);

        /**
        * 5️⃣ Build AI context (important)
        */
        const context = {
            totalInvoices: invoices.length,
            totalPaidInvoices,
            totalOverdueInvoices,
            overdueRate:
            invoices.length > 0
                ? Number((totalOverdueInvoices / invoices.length).toFixed(2))
                : 0,
            paymentDelayTrend,
            monthlyAverageDelays: monthlyAverages,
            repeatLatePayersCount: repeatLatePayers.length,
        };

        const prompt = buildRecommendationPrompt(context);

        const response = await generateContent(prompt);

        const responseText = response.text;

        if (!responseText) {
            return { error: "Failed to get analytics summary from Gemini"}
        }

        let aiOutput;
        try {
            aiOutput = JSON.parse(responseText!);
        } catch {
            aiOutput = {
            risks: [],
            recommendations: [],
            automationIdeas: [],
            };
        }

        /**
        * 7️⃣ Final response
        */
        return {
            metrics: context,
            insights: aiOutput,
        };

    } catch (error) {
        console.log(error)
        return { error: "Failed to get invoice insights" }
    }
}