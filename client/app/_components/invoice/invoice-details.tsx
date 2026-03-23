'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { InvoiceFormValues, invoiceSchema } from "@/lib/validations/invoice.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar1Icon, Info, Loader2, Plus, PlusCircle, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { ImageDropzone } from "@/app/_components/dashboard/image-dropzone";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { updateInvoiceAction } from "@/app/actions/invoice.actions";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InvoicePreview from "@/app/_components/invoice/invoice-preview";
import { Invoice, InvoiceItem, PaymentTerm } from "@/generated/prisma";

interface InvoiceDetailsProps {
    invoice: Invoice & {
        items: InvoiceItem[],
        paymentTerms: PaymentTerm[]
    }
}

export default function InvoiceDetails({
    invoice
}: InvoiceDetailsProps) {

    const params = useParams();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const invoiceDetailsForm = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {

            clientName: "",
            clientEmail: "",
            clientPhone: "",
            clientAddress: "",

            projectName: "",
            issueDate: new Date(),
            dueDate: new Date(),

            items: [
                {
                    description: "",
                    units: 1,
                    price: 0,
                },
            ],

            paymentTerms: [
                {
                    term: ""
                }
            ],
            notes: "",
        },
    })

    useEffect(() => {
        invoiceDetailsForm.reset({
            clientName: invoice.clientName ?? undefined,
            clientEmail: invoice.clientEmail ?? undefined,
            clientPhone: invoice.clientPhone ?? undefined,
            clientAddress: invoice.clientAddress ?? undefined,
            projectName: invoice.projectName,
            issueDate: invoice.issueDate,
            dueDate: invoice.dueDate,
            items: invoice.items,
            paymentTerms: invoice.paymentTerms,
            notes: invoice.notes ?? undefined
        })
    }, [invoice])

    const itemsFieldArray = useFieldArray({
        control: invoiceDetailsForm.control,
        name: "items",
    });

    const paymentTermsFieldArray = useFieldArray({
        control: invoiceDetailsForm.control,
        name: "paymentTerms"
    })

    // Watch the payment method to show/hide fields
    // const selectedMethod = form.watch("paymentMethods") || [];
    const watchItems = invoiceDetailsForm.watch("items");

    const total = watchItems?.reduce(
        (acc, item) => acc + Number(item.units) * Number(item.price),
        0
    );

    const hasData = Object.values(invoiceDetailsForm.watch()).some((value) => {
        if (Array.isArray(value)) return value.length > 0;

        return !!value
    });

    const onSubmitInvoiceDetails = async (invoiceData: InvoiceFormValues) => {
        setIsLoading(true);

        try {
            const result = await updateInvoiceAction(invoiceData, params.invoiceid as string);

            if (result.error) {
                toast.error(result.error);
            }

            toast.success(result.message);
            setIsLoading(false);

            router.push(`/dashboard/${params.id}/invoices`)

        } catch (error: any) {
            console.log(error)
        }
    }

    return (
        <div className="flex xl:flex-row flex-col xl:gap-0 gap-8 h-screen w-full xl:overflow-hidden bg-background">
            <div className="xl:w-2/5 w-full border-r xl:p-12 lg:px-24 lg:py-16 md:p-12 p-4 space-y-6 xl:overflow-y-auto no-scrollbar">
                <h1 className="text-3xl font-bold xl:mt-0 mt-2">
                   Invoice Details
                </h1>
                <Separator />
                <Form {...invoiceDetailsForm}>
                    <form className="flex flex-col space-y-4" onSubmit={invoiceDetailsForm.handleSubmit(onSubmitInvoiceDetails)}>
                        {/* Business Details
                        <Accordion type="single" collapsible defaultValue="personal">
                            <AccordionItem value="business">
                                <AccordionTrigger className="font-semibold cursor-pointer text-base underline">
                                    Business Details
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 mt-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Business Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="h-10" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Business Email
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="email" className="h-10" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                   Business Phone Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="text" className="h-10" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="logo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Business Logo
                                                </FormLabel>
                                                <ImageDropzone

                                                />
                                            </FormItem>
                                        )}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion> */}
                        {/* Client Details */}
                        <Accordion type="single" collapsible defaultValue="personal">
                            <AccordionItem value="business">
                                <AccordionTrigger className="font-semibold items-center cursor-pointer text-lg underline text-[#1E3A8A]">
                                    Client Details
                                </AccordionTrigger>
                                <AccordionContent className="space-y-8 mt-2">
                                    <FormField
                                        control={invoiceDetailsForm.control}
                                        name="clientName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Client Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="h-12" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={invoiceDetailsForm.control}
                                        name="clientEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Client Email
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="email" className="h-12" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={invoiceDetailsForm.control}
                                        name="clientPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                   Client Phone Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="text" className="h-12" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={invoiceDetailsForm.control}
                                        name="clientAddress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                   Client Address
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="text" className="h-12" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        {/* INVOICE DETAILS */}
                        <Accordion type="single" collapsible defaultValue="invoice">
                            <AccordionItem value="invoice">
                                <AccordionTrigger className="text-lg items-center font-semibold cursor-pointer underline text-[#1E3A8A]">
                                    Invoice Details
                                </AccordionTrigger>
                                <AccordionContent className="space-y-8 mt-2">
                                    <FormField
                                        control={invoiceDetailsForm.control}
                                        name="projectName"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Name</FormLabel>
                                            <FormControl>
                                            <Input {...field} className="h-12" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    {/* Issue Date */}
                                    <div className="flex items-center gap-2 w-full">
                                        <FormField
                                            control={invoiceDetailsForm.control}
                                            name="issueDate"
                                            render={({ field }) => (
                                            <FormItem className="flex flex-col w-full">
                                                <FormLabel>Issue Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                        <Button
                                                            variant="outline"
                                                                className={cn(
                                                                "pl-3 text-left font-normal h-12",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                            format(field.value, "PPP")
                                                            ) : (
                                                            <span>Pick date</span>
                                                            )}
                                                            <Calendar1Icon className="ml-auto h-4 w-4" />
                                                        </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent align="start">
                                                        <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={invoiceDetailsForm.control}
                                            name="dueDate"
                                            render={({ field }) => (
                                            <FormItem className="flex flex-col w-full">
                                                <FormLabel>Due Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "pl-3 text-left font-normal h-12",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                format(field.value, "PPP")
                                                                ) : (
                                                                <span>Pick date</span>
                                                                )}
                                                                <Calendar1Icon className="ml-auto h-4 w-4" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                    </div>
                                    {/* ITEMS */}
                                    <Card className="space-y-0 gap-2 py-0 border-none shadow-none w-full">
                                        <h1 className="">
                                            Items
                                        </h1>
                                        {itemsFieldArray.fields.map((field, index) => (
                                            <div key={field.id} className="space-y-4 bg-gray-50 p-4 rounded-md">
                                                <FormField
                                                    control={invoiceDetailsForm.control}
                                                    name={`items.${index}.description`}
                                                    render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="bg-white h-12" />
                                                        </FormControl>
                                                    </FormItem>
                                                    )}
                                                />
                                                <div className="flex gap-2">
                                                    <FormField
                                                        control={invoiceDetailsForm.control}
                                                        name={`items.${index}.units`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full">
                                                                <FormLabel>Units</FormLabel>
                                                                <FormControl>
                                                                    <Input type="number" {...field} className="bg-white h-12" />
                                                                </FormControl>
                                                            </FormItem>
                                                    )}
                                                    />
                                                    <FormField
                                                        control={invoiceDetailsForm.control}
                                                        name={`items.${index}.price`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full">
                                                                <FormLabel>Price</FormLabel>
                                                                <FormControl>
                                                                    <Input type="number" {...field} className="bg-white h-12" />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                {itemsFieldArray.fields.length > 1 && (
                                                    <div className="flex items-center justify-end">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size={'icon'}
                                                            onClick={() => itemsFieldArray.remove(index)}
                                                            className="text-destructive hover:text-destructive h-8 bg-destructive/10 hover:bg-destructive/20 cursor-pointer"
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <div className="p-2 border border-[#1E3A8A] text-[#1E3A8A] hover:bg-muted cursor-pointer mt-2 rounded-md items-center justify-center" onClick={() => itemsFieldArray.append({ description: "", units: 1, price: 0 })}>
                                            <div className="flex items-center gap-1 justify-center">
                                                <Plus />
                                                <p className="text-sm font-semibold">
                                                    Add item
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        {/* PAYMENT TERMS */}
                        <Accordion type="single" collapsible defaultValue="paymentTerms">
                            <AccordionItem value="paymentTerms">
                                <AccordionTrigger className="text-lg items-center font-semibold cursor-pointer underline text-[#1E3A8A]">
                                    Payment Terms
                                </AccordionTrigger>
                                <AccordionContent className="space-y-8 mt-2">
                                    {/* ITEMS */}
                                    <Card className="space-y-0 gap-2 py-0 border-none shadow-none">
                                        {paymentTermsFieldArray.fields.map((field, index) => (
                                            <div key={field.id} className="space-y-4 bg-gray-50 p-4 rounded-md">

                                                <FormField
                                                    control={invoiceDetailsForm.control}
                                                    name={`paymentTerms.${index}.term`}
                                                    render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Term { index + 1 }</FormLabel>
                                                        <FormControl>
                                                            <Textarea rows={10} {...field} placeholder="Enter your payment term here" className="bg-white rounded-sm" />
                                                        </FormControl>
                                                    </FormItem>
                                                    )}
                                                />
                                                {paymentTermsFieldArray.fields.length > 1 && (
                                                    <div className="flex items-center justify-end">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size={'icon'}
                                                            onClick={() => paymentTermsFieldArray.remove(index)}
                                                            className="text-destructive hover:text-destructive h-8 bg-destructive/10 hover:bg-destructive/20 cursor-pointer"
                                                        >
                                                            <Trash2 className="h-8 w-8" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <div className="p-2 border border-[#1E3A8A] text-[#1E3A8A] hover:bg-muted cursor-pointer mt-2 rounded-md items-center justify-center" onClick={() => paymentTermsFieldArray.append({ term: "" })}>
                                            <div className="flex items-center gap-1 justify-center">
                                                <Plus />
                                                <p className="text-sm font-semibold">
                                                    Add term
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        {/* <Accordion type="single" collapsible defaultValue={''} className="w-full">
                            <AccordionItem value="payment">
                                <AccordionTrigger className="font-semibold text-base cursor-pointer underline">
                                    Payment Details
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 mt-2">
                                    <FormField
                                    control={form.control}
                                    name="paymentMethods"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                        <FormLabel>Select payment methods</FormLabel>
                                        <FormControl>
                                            <div className="grid md:grid-cols-3 grid-cols-2 gap-3">
                                            <div 
                                                onClick={() => {
                                                    const current = field.value || [];

                                                    const exists = current.includes("mobile_money");

                                                    const newValue = exists
                                                    ? current.filter((v) => v !== "mobile_money")
                                                    : [...current, "mobile_money"];

                                                    field.onChange(newValue);
                                                }}
                                                className={
                                                    cn(
                                                        "cursor-pointer p-6 border rounded-sm flex flex-col items-center gap-2 transition-all",
                                                        field.value?.includes("mobile_money")
                                                            ? 'border-blue-600 border-2 bg-blue-50' 
                                                            : 'bg-white border-gray-200'
                                                    )
                                                }
                                            >
                                                <img src="/mnos-mtn.png" className="h-6 w-auto" alt="MoMo" />
                                                <span className="text-xs font-semibold">Mobile Money</span>
                                            </div>
                                            <div 
                                                onClick={() => {
                                                    const current = field.value || [];

                                                    const exists = current.includes("orange_money");

                                                    const newValue = exists
                                                    ? current.filter((v) => v !== "orange_money")
                                                    : [...current, "orange_money"];

                                                    field.onChange(newValue);
                                                }}
                                                className={
                                                    cn(
                                                        "cursor-pointer p-6 border rounded-sm flex flex-col items-center gap-2 transition-all",
                                                        field.value?.includes("orange_money")
                                                            ? 'border-blue-600 border-2 bg-blue-50' 
                                                            : 'bg-white border-gray-200'
                                                    )
                                                }
                                            >
                                                <img src="/orangemoney.png" className="h-6 w-auto" alt="orange-money" />
                                                <span className="text-xs font-semibold">Orange Money</span>
                                            </div>
                                            <div 
                                                onClick={() => {
                                                    const current = field.value || [];

                                                    const exists = current.includes("credit_card");

                                                    const newValue = exists
                                                    ? current.filter((v) => v !== "credit_card")
                                                    : [...current, "credit_card"];

                                                    field.onChange(newValue);
                                                }}
                                                className={
                                                    cn(
                                                        "cursor-pointer p-6 border rounded-sm flex flex-col items-center gap-2 transition-all",
                                                        field.value?.includes("credit_card") 
                                                            ? 'border-blue-600 border-2 bg-blue-50' 
                                                            : 'bg-white border-gray-200'
                                                    )
                                                }
                                            >
                                                <img src="/credit-card.png" className="h-6 w-auto" alt="credit-card" />
                                                <span className="text-xs font-semibold">Credit Card</span>
                                            </div>
                                            </div>
                                        </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                    <Separator />
                                    {selectedMethod.includes("mobile_money") && (
                                    <FormField
                                        control={form.control}
                                        name="mobileMoneyNumber"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mobile Money number</FormLabel>
                                            <FormControl>
                                            <Input placeholder="(+237) 6..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    )}
                                    {selectedMethod.includes("orange_money") && (
                                    <FormField
                                        control={form.control}
                                        name="orangeMoneyNumber"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Orange Money number</FormLabel>
                                            <FormControl>
                                            <Input placeholder="(+237) 6..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    )}
                                    {selectedMethod.includes("credit_card") && (
                                    <FormField
                                        control={form.control}
                                        name="cardNumber"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Card Number</FormLabel>
                                            <FormControl>
                                            <Input placeholder="4242 ...." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion> */}
                        <Accordion type="single" collapsible defaultValue="notes">
                            <AccordionItem value="notes">
                                <AccordionTrigger className="font-semibold items-center cursor-pointer text-lg underline text-[#1E3A8A]">
                                    Additional notes
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 mt-2">
                                    <FormField
                                        control={invoiceDetailsForm.control}
                                        name="notes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Note
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea rows={10} placeholder="Enter your note here" {...field} className="rounded-md" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <div className="flex items-center gap-2 my-8">
                            {isLoading ? (
                                <Button className="bg-[#1E3A8A] rounded-sm cursor-pointer w-25" type="submit" disabled={isLoading}>
                                    <Loader2 className="animate-spin" />
                                </Button>
                            ): (
                                <Button className="bg-[#1E3A8A] rounded-sm cursor-pointer w-28" type="submit" disabled={isLoading}>
                                    Save changes
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </div>
            <div className="hidden xl:flex xl:w-3/5 h-screen items-center justify-center bg-gray-50/50 overflow-y-auto no-scrollbar py-16">
                <div className="min-w-3xl p-8 border bg-white shadow-md h-fit my-auto">
                    {hasData ? (
                       <InvoicePreview
                            clientName={invoiceDetailsForm.watch("clientName")}
                            clientEmail={invoiceDetailsForm.watch("clientEmail")}
                            clientAddress={invoiceDetailsForm.watch("clientAddress")}
                            clientPhoneNumber={invoiceDetailsForm.watch("clientPhone")}
                            projectName={invoiceDetailsForm.watch("projectName")}
                            issueDate={invoiceDetailsForm.watch("issueDate")}
                            dueDate={invoiceDetailsForm.watch("dueDate")}
                            paymentTerms={invoiceDetailsForm.watch("paymentTerms")}
                            items={invoiceDetailsForm.watch("items")}
                            notes={invoiceDetailsForm.watch("notes")}
                        />
                    ): (
                        <div className="border-dashed rounded-xl">
                            <p className="text-muted-foreground font-medium">
                                Live Preview Area
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Your invoice will appear here as you type.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {/* Mobile/Tablet Preview container */}
            <div className="xl:hidden w-full lg:py-16 md:py-12 py-8 h-screen bg-gray-50/50">
                <div className="w-full lg:max-w-3xl md:max-w-2xl max-w-xl mx-auto bg-white shadow-lg md:p-6 px-4 py-8">
                    {hasData ? (
                        <InvoicePreview
                            clientName={invoiceDetailsForm.watch("clientName")}
                            clientEmail={invoiceDetailsForm.watch("clientEmail")}
                            clientAddress={invoiceDetailsForm.watch("clientAddress")}
                            clientPhoneNumber={invoiceDetailsForm.watch("clientPhone")}
                            projectName={invoiceDetailsForm.watch("projectName")}
                            issueDate={invoiceDetailsForm.watch("issueDate")}
                            dueDate={invoiceDetailsForm.watch("dueDate")}
                            paymentTerms={invoiceDetailsForm.watch("paymentTerms")}
                            items={invoiceDetailsForm.watch("items")}
                            notes={invoiceDetailsForm.watch("notes")}
                        />
                    ): (
                        <div className="border-dashed rounded-xl">
                            <p className="text-muted-foreground font-medium">
                                Live Preview Area
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Your invoice will appear here as you type.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}