
import Container from "@/app/_components/dashboard/container";
import InvoiceHeader from "@/app/_components/dashboard/invoice-header";
import InvoiceStatCard from "@/app/_components/dashboard/invoice-stat-card";
import { DasboardInvoiceStats } from "@/app/utils/data.util";

export default function InvoicesPage() {
  return (
    <Container>
      <main className="flex flex-col md:space-y-8 space-y-8 font-sans dark:bg-black min-w-fit">
        <InvoiceHeader />
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
      </main>
    </Container>
  );
}