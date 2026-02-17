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
