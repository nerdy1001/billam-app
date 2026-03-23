'use client';

import Container from "@/app/_components/dashboard/container";
import EmptyState from "@/app/_components/empty-states/empty";
import InvoiceHeader from "@/app/_components/invoice/invoice-header";
import InvoicePreviewCard from "@/app/_components/invoice/invoice-preview-card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import axios from "axios";
import { Invoice } from "@/generated/prisma";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";

export default function InvoicesPage() {
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState("all-invoices");
  const [invoices, setInvoices] = useState<Array<Invoice>>([]);
  const debouncedSearch = useDebounce(search, 400);

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await axios.get(`/api/invoices/search?q=${debouncedSearch}&status=${status}`);
        setInvoices(res.data.invoices);

        console.log(res.data)
      } catch (error) {
        console.error(error);
      }
    }

    fetchInvoices();
  }, [debouncedSearch, status]);

  return (
    <Container>
      <main className="flex flex-col md:space-y-8 space-y-8 font-sans dark:bg-black">
        <InvoiceHeader />
        <Input placeholder="Search by client or project name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 bg-white" />
        <Tabs 
          defaultValue={"all-invoices"} 
          className="flex flex-col gap-12 overflow-x-auto"
          value={status}
          onValueChange={(val) => setStatus(val)}
        >
          <TabsList variant="line">
            <TabsTrigger value="all-invoices" className="cursor-pointer text-base">All invoices</TabsTrigger>
            <TabsTrigger value="paid" className="cursor-pointer text-base">Paid</TabsTrigger>
            <TabsTrigger value="due" className="cursor-pointer text-base">Due</TabsTrigger>
            <TabsTrigger value="overdue" className="cursor-pointer text-base">Overdue</TabsTrigger>
            <TabsTrigger value="cancelled" className="cursor-pointer text-base">Cancelled</TabsTrigger>
          </TabsList>
          {/* <TabsContent value="all-invoices">
            <InvoicePreviewCard />
          </TabsContent>
          <TabsContent value="paid">
            <EmptyState imgSrc="/undraw_void_wez2.png" title="Nothing to show for now" />
          </TabsContent> */}
        </Tabs>
        {/* 📄 Invoice Results */}
        {invoices.length === 0 ? (
          <div className="w-full">
            <EmptyState imgSrc="/undraw_void_wez2.png" title="Nothing to see here." />
          </div>
        ): (
          <div className="grid xl:md:grid-cols-3 md:grid-cols-2 gap-4 w-full">
            {invoices.map((invoice) => (
              <div key={invoice.id} onClick={() => router.push(`/dashboard/${params.id}/invoices/invoice-details/${invoice.id}`)}>
                <InvoicePreviewCard data={invoice} />
              </div>
            ))}
          </div>
        )}
      </main>
    </Container>
  );
}