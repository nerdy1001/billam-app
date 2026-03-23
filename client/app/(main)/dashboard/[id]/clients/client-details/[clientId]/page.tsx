import ClientDetails from "@/app/_components/clients/client-details";
import ClientHeader from "@/app/_components/clients/client-header";
import ClientStatCard from "@/app/_components/clients/client-stat-card";
import Container from "@/app/_components/dashboard/container";
import EmptyState from "@/app/_components/empty-states/empty";
import InvoicePreviewCard from "@/app/_components/invoice/invoice-preview-card";
import { getClient } from "@/app/actions/client.actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notFound, redirect } from "next/navigation";

type PageProps = {
    params: {
        clientId: string
    }
}

export default async function ClientDetailsPage({ params }: PageProps) {

    const { clientId } = await params;

    const result = await getClient(clientId);

    console.log(result)

    if (!result.success) {
        if (result.status === 401) redirect("/login");
        if (result.status === 404) notFound();
        // 403 or 500
        throw new Error(result.error);
    }

    const { client } = result;

    return (
        <Container>
            <main className="w-full mx-auto flex flex-col space-y-8 relative">
                <ClientHeader
                    clientPhone={client.phone!}
                    clientName={client.name}
                    clientEmail={client.email}
                    clientAddress={client.address}
                    createdAt={client.createdAt}
                />
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
                    <ClientStatCard
                        label="Lifetime value"
                        value={`XAF ${client.lifetimeValue.value.toLocaleString()}`}
                        subtitle={client.lifetimeValue.subtitle}
                    />
                    <ClientStatCard
                        label="Outstanding"
                        value={`XAF ${client.outstanding.value.toLocaleString()}`}
                        subtitle={client.outstanding.subtitle}
                    />
                    <ClientStatCard
                        label="Avg pay time"
                        value={
                            client.avgPayTimeDays.value !== null
                            ? `${client.avgPayTimeDays.value}d`
                            : "—"
                        }
                        subtitle={client.avgPayTimeDays.subtitle}
                    />
                    <ClientStatCard
                        label="Total invoices"
                        value={client.totalInvoices.value}
                        subtitle={client.totalInvoices.subtitle}
                    />
                </div>
                <Tabs 
                    defaultValue={"client-details"} 
                    className="flex flex-col space-y-12"
                >
                    <TabsList variant="line" className="md:flex grid grid-cols-3 gap-4">
                        <TabsTrigger value="client-details" className="cursor-pointer text-base">
                            Client details
                        </TabsTrigger>
                        <TabsTrigger value="invoice-history" className="cursor-pointer text-base">
                            Invoice history
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="client-details">
                        <ClientDetails initialData={client} />
                    </TabsContent>
                    <TabsContent value="invoice-history">
                        {client.invoices.length === 0 ? (
                            <div className="w-full">
                                <EmptyState imgSrc="/undraw_void_wez2.png" title="Nothing to see here." />
                            </div>
                        ): (
                        <div className="grid xl:md:grid-cols-3 md:grid-cols-2 gap-4 w-full">
                            {client.invoices.map((invoice) => (
                            <div key={invoice.id}>
                                <InvoicePreviewCard data={invoice} />
                            </div>
                            ))}
                        </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
        </Container>
    )
}