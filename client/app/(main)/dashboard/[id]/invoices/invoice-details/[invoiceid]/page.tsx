import InvoiceDetails from "@/app/_components/invoice/invoice-details";
import { getInvoice } from "@/app/actions/invoice.actions";
import { notFound } from "next/navigation";
import Error from "./error";


type PageProps = {
    params: {
        invoiceid: string
        id: string
    }
}

export default async function InvoiceDetailsPage({ params }: PageProps) {
    try {

       const { id, invoiceid } = await params;

        const invoice = await getInvoice(invoiceid);
        
        if (!invoice) {
            notFound(); // triggers Next.js 404 page
        }

        return <InvoiceDetails invoice={invoice}  />

    } catch (error: any) {
        console.error("Failed to load Invoice", error)
        return <Error error={error} />
    }
}