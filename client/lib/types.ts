export type BusinessRecommendationMetrics = {
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

export type BusinessRecommendationInsights = {
  overallSummary?: string;  
  risks: string[];            // Highlighted problems
  recommendations: string[];  // Actionable advice
  automationIdeas: string[];  // Things Billam could automate
}

export type BusinessRecommendations = {
  metrics?: BusinessRecommendationMetrics | null;
  insights?: BusinessRecommendationInsights | null;
  error?: string;
}

export type InvoiceItem = {
  description: string;
  units: string;
  price: string;
};

export type PaymentTerm = {
  term: string;
};

export type PaymentMethod = "mobile_money" | "orange_money" | "credit_card";

export type Invoice = {
  // Sender
  name: string;
  email: string;
  phoneNumber: string;
  logo?: string;

  // Client
  clientName: string;
  clientEmail?: string;
  clientPhone: string;
  clientAddress: string;

  // Project
  projectName: string;
  issueDate: Date;
  dueDate: Date;

  // Invoice Details
  items: InvoiceItem[];
  paymentTerms: PaymentTerm[];
  paymentMethods: PaymentMethod[];

  // Conditional Payment Fields
  mobileMoneyNumber?: string;
  orangeMoneyNumber?: string;
  cardNumber?: string;

  notes?: string;
};

