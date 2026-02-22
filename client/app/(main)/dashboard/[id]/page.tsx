import Container from "@/app/_components/dashboard/container";
import InsightsSummaryCard from "@/app/_components/dashboard/insights-summary-card";
import Intro from "@/app/_components/dashboard/intro";
import InvoiceStatCard from "@/app/_components/dashboard/invoice-stat-card";
import OverdueInvoiceCard from "@/app/_components/dashboard/overdue-invoice-card";
import { DasboardInvoiceStats, dashboardInsights, overdueInvoices } from "@/app/utils/data.util";
import { getServerSession } from "@/app/utils/server-session.util";
import { redirect } from "next/navigation";


export default async function DashboardPage() {

  const session = await getServerSession();

  if (!session) redirect("/auth/login");

  // const dashboardInsights: BusinessRecommendations = await getDashboardInvoiceAnalyticsSummary(session.user.id);

  // if (dashboardInsights.error === 'No business exists for this user') {
  //   return (
  //     <main className="flex flex-col space-y-8 font-sans dark:bg-black">
  //       <Intro />
  //       <EmptyState 
  //         imgSrc="/blank-canvas.png" 
  //         title="No business yet" 
  //         description="Register your business and start sending invoices to your clients" 
  //         buttonText="Register business" 
  //         onButtonClick={() => {}} 
  //       />
  //     </main>
  //   )
  // }

  return (
    <Container>
      <main className="flex flex-col md:space-y-8 space-y-8 font-sans dark:bg-black">
        <Intro />
        <InsightsSummaryCard insights={dashboardInsights.insights} />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {DasboardInvoiceStats.map((stat, index) => (
            <div key={index}>
              <InvoiceStatCard 
                title={stat.title} 
                value={stat.value} 
                icon={stat.icon} 
                className={stat.className} 
              />
            </div>
          ))}
        </div>
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
            {overdueInvoices.map((invoice, index) => (
              <div key={index}>
                <OverdueInvoiceCard 
                  invoiceNumber={invoice.invoiceNumber} 
                  amountOverdue={invoice.amountOverdue} 
                  daysOverdue={invoice.daysOverdue}
                  supposedPaymentDate={invoice.supposedPaymentDate}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </Container>
  );
}