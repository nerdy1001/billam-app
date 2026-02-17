// lib/gemini.ts
import { GoogleGenAI } from '@google/genai';
import { prisma } from './prisma';
import { Invoice } from '@/generated/prisma';
import { Medium, Tone } from '@/app/actions/ai.actions';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

type RecommendationSignals = {
  businessName: string
  period: {
    from: string
    to: string
  }
  metrics: {
    totalInvoices: number
    paidInvoices: number
    unpaidInvoices: number
    averagePaymentDelayDays: number
    paymentDelayTrend: "increasing" | "stable" | "decreasing"
  }
  clientInsights: {
    repeatLatePayers: number
  }
}

export interface BusinessRecommendationMetrics {
  totalInvoices: number;
  totalPaidInvoices: number;
  totalOverdueInvoices: number;
  overdueRate: number; // e.g., 0.31 for 31%
  paymentDelayTrend: string;
  monthlyAverageDelays: {
    month: string; // YYYY-MM format
    avgDelay: number; // in days
  }[];
  repeatLatePayersCount: number;
}

export function parseInvoiceFromTextPrompt (text: string) {
  return `
    You are an expert invoice data extraction AI. Analyze the following text and extract the relevant information to create an invoice.
    The output must be a valid JSON object.

    The JSON object MUST have the following structure:
    {
      "clientName": "string"
      "email": "string(if available)"
      "address": "string"(if available)"
      "items": [
        {
          "name": "string"
          "quantity": "number"
          "unitPrice": "number"
        }
      ]
    }
    
    Here is the text to parse:
    --- TEXT START ---
    ${text}
    --- TEXT END ---

    Extract the data and provide ONLY the JSON object.
  `
}

export function buildRecommendationPrompt(input: BusinessRecommendationMetrics) {
  return `
    You are a financial decision assistant for small businesses in Africa. Your job is to provide the best financial assitance to
    small businesses and freelancers based on historical data, advice from the best experts all around the globe and your personal understanding of finance, human pyschology
    and business.

    Given the following invoice payment behavior data:
    ${JSON.stringify(input, null, 2)}

    Generate:
    1. Key risks (if any)
    2. Clear, practical recommendations
    3. Optional policy or automation suggestions
    4. An overall summary of these insights, like a statement of everything that you have understood and found.

    Rules:
    - Be concise
    - Avoid generic advice
    - Focus on cash flow stability
    - Each insight should be encouraging and helpful.
    - Do not just repeat the data.
    - Output JSON only with this shape:

    {
      "overallSummary": string,
      "risks": string[],
      "recommendations": string[],
      "automationIdeas": string[]
    }

  `
}

export function generateReminderPrompt(invoice: Invoice, tone: Tone, medium: Medium) {
  return `
    You are a ${tone} accounting assitant. Your task is to write a ${medium} message to a client about an overdue or upcoming invoice payment.

    Use the following details to personalize the ${medium} message:
    - Client Name: ${invoice.customerName}
    - Invoice Number: ${invoice.invoiceNo}
    - Amount Due: ${invoice.subtotal.toFixed(2)}
    - Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

    The tone should be ${tone} but make sure you keep it clear and most importantly, respectful. Keep it concise.

  `
}

