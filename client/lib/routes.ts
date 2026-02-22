export const dashboardRoutes = {
  base: (id: string) => `/dashboard/${id}`,
  invoices: (id: string) => `/dashboard/${id}/invoices`,
  clients: (id: string) => `/dashboard/${id}/clients`,
  settings: (id: string) => `/dashboard/${id}/settings`,
  aiInsights: (id: string) => `/dashboard/${id}/ai-insights`,
};
