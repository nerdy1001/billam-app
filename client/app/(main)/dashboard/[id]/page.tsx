import Container from "@/app/_components/dashboard/container";
import InsightsSummaryCard from "@/app/_components/dashboard/insights-summary-card";
import Intro from "@/app/_components/dashboard/intro";
import InvoiceStatCard from "@/app/_components/invoice/invoice-stat-card";
import OverdueInvoiceCard from "@/app/_components/invoice/overdue-invoice-card";
import InvoicePreviewCard from "@/app/_components/invoice/invoice-preview-card";
import { DasboardInvoiceStats } from "@/app/utils/data.util";
import { getOverdueInvoices, getFirstThreeRecentInvoices } from "@/app/actions/invoice.actions";
import { getServerSession } from "@/app/utils/server-session.util";
import { redirect } from "next/navigation";


export default async function DashboardPage() {

  const session = await getServerSession();

  if (!session) redirect("/auth/login");
  const overdueRes = await getOverdueInvoices();
  const recentRes = await getFirstThreeRecentInvoices();
  return (
    <Container>
      <main className="flex flex-col md:space-y-8 space-y-8 font-sans dark:bg-black">
        <Intro />
        <InsightsSummaryCard />
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-2xl">
              Overdue Invoice Alert
            </h1>
            <p className="text-gray-400 text-md font-medium">
              Some clients are falling behind. Review overdue invoices and take action immediately.
            </p>
          </div>
            <div className="md:grid md:grid-cols-3 flex flex-col gap-4">
              {overdueRes.success && overdueRes?.invoices?.length ? (
                overdueRes.invoices.map((inv) => (
                  <div key={inv.id}>
                      <OverdueInvoiceCard
                        invoiceNumber={inv.invoiceNo}
                        amountOverdue={inv.items?.reduce((sum: number, it: any) => sum + ((it.units ?? it.quantity ?? 0) * (it.price ?? it.unitPrice ?? 0)), 0) ?? 0}
                        daysOverdue={inv.dueDate ? Math.max(0, Math.floor((Date.now() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24))) : 0}
                        supposedPaymentDate={inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'N/A'}
                        issueDate={inv.issueDate ? new Date(inv.issueDate).toLocaleDateString() : 'N/A'}
                        clientName={inv.clientName}
                      />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No overdue invoices</p>
              )}
            </div>
        </div>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <h1 className="font-bold text-2xl">Recent invoices</h1>
              <p className="text-gray-400 text-md font-medium">Latest invoices from your business.</p>
            </div>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
              {recentRes.success && recentRes.invoices?.length ? (
                recentRes.invoices.map((inv) => (
                  <InvoicePreviewCard key={inv.id} data={inv} />
                ))
              ) : (
                <p className="text-sm text-gray-400">No recent invoices</p>
              )}
            </div>
          </div>
      </main>
    </Container>
  );
}