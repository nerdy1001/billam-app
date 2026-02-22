'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { InvoiceFormValues, invoiceSchema } from "@/lib/validations/invoice.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar1Icon, Info, PlusCircle, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { ImageDropzone } from "@/app/_components/dashboard/image-dropzone";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function NewInvoicePage() {

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            logo: "",

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
                    units: "1",
                    price: "0",
                },
            ],

            paymentTerms: [
                {
                    term: ""
                }
            ],

            paymentMethods: [],

            mobileMoneyNumber: "",
            orangeMoneyNumber: "",
            cardNumber: "",
            notes: "",
        },
    })

    const itemsFieldArray = useFieldArray({
        control: form.control,
        name: "items",
    });

    const paymentTermsFieldArray = useFieldArray({
        control: form.control,
        name: "paymentTerms"
    })

    // Watch the payment method to show/hide fields
    const selectedMethod = form.watch("paymentMethods") || [];
    const watchItems = form.watch("items");

    const total = watchItems?.reduce(
        (acc, item) => acc + Number(item.units) * Number(item.price),
        0
    );

    const onSubmitInvoiceDetails = (invoiceData: InvoiceFormValues) => {
        console.log({...invoiceData, total})
    }

    return (
        <div className="flex h-screen w-full xl:overflow-hidden bg-background">
            <div className="xl:w-2/5 w-full border-r xl:p-12 lg:px-24 lg:py-16 md:p-12 p-4 space-y-6 xl:overflow-y-auto xl:custom-scrollbar">
                <h1 className="text-3xl font-bold xl:mt-0 mt-2">
                   Create Invoice
                </h1>
                <Separator />
                <div className="flex flex-col space-y-1">
                    <h1 className="text-lg font-semibold">
                        Fill in invoice details
                    </h1>
                    <span className="flex items-center space-x-2">
                        <Info size={20} className="text-gray-400" />
                        <p className="text-gray-400 font-normal text-base">
                            You can save invoices as draft and complete later.
                        </p>
                    </span>
                </div>
                <Form {...form}>
                    <form className="flex flex-col space-y-4" onSubmit={form.handleSubmit(onSubmitInvoiceDetails)}>
                        {/* Business Details */}
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
                        </Accordion>
                        {/* Client Details */}
                        <Accordion type="single" collapsible defaultValue="personal">
                            <AccordionItem value="business">
                                <AccordionTrigger className="font-semibold cursor-pointer text-base underline">
                                    Client Details
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 mt-2">
                                    <FormField
                                        control={form.control}
                                        name="clientName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Client Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="h-10" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="clientEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Client Email
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="email" className="h-10" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="clientPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                   Client Phone Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="text" className="h-10" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="clientAddress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                   Client Address
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="text" className="h-10" />
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
                                <AccordionTrigger className="text-base font-semibold cursor-pointer underline">
                                    Invoice Details
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 mt-2">
                                    <FormField
                                        control={form.control}
                                        name="projectName"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Name</FormLabel>
                                            <FormControl>
                                            <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    {/* Issue Date */}
                                    <div className="flex items-center gap-2 w-full">
                                    <FormField
                                        control={form.control}
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
                                                        "pl-3 text-left font-normal",
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
                                        control={form.control}
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
                                                            "pl-3 text-left font-normal",
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
                                    <Card className="space-y-0 gap-2 py-0 border-none shadow-none">
                                        <h1 className="">
                                            Items
                                        </h1>
                                        {itemsFieldArray.fields.map((field, index) => (
                                            <div key={field.id} className="space-y-4 bg-gray-50 p-4 rounded-md">

                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.description`}
                                                    render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl>
                                                        <Input {...field} className="bg-white" />
                                                        </FormControl>
                                                    </FormItem>
                                                    )}
                                                />
                                                <div className="flex gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.units`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                            <FormLabel>Units</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" {...field} className="bg-white" />
                                                            </FormControl>
                                                            </FormItem>
                                                    )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.price`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                            <FormLabel>Price</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" {...field} className="bg-white" />
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
                                                        className="text-destructive hover:text-destructive bg-destructive/10 hover:bg-destructive/20 cursor-pointer"
                                                        >
                                                        <Trash2 />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <span
                                            className="text-[#1E3A8A] font-semibold text-base cursor-pointer flex items-center gap-1 underline mt-2"
                                            onClick={() => itemsFieldArray.append({ description: "", units: "1", price: "0"})}
                                        >
                                            <PlusCircle size={15} />
                                            Add Item
                                        </span>
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        {/* PAYMENT TERMS */}
                        <Accordion type="single" collapsible defaultValue="paymentTerms">
                            <AccordionItem value="paymentTerms">
                                <AccordionTrigger className="text-base font-semibold cursor-pointer underline">
                                    Payment Terms
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 mt-2">
                                    {/* ITEMS */}
                                    <Card className="space-y-0 gap-2 py-0 border-none shadow-none">
                                        {paymentTermsFieldArray.fields.map((field, index) => (
                                            <div key={field.id} className="space-y-4 bg-gray-50 p-4 rounded-md">

                                                <FormField
                                                    control={form.control}
                                                    name={`paymentTerms.${index}.term`}
                                                    render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Term { index + 1 }</FormLabel>
                                                        <FormControl>
                                                        <Textarea rows={5} {...field} className="bg-white rounded-sm" />
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
                                                        className="text-destructive hover:text-destructive bg-destructive/10 hover:bg-destructive/20 cursor-pointer"
                                                        >
                                                        <Trash2 />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <span
                                            className="text-[#1E3A8A] font-semibold text-base cursor-pointer flex items-center gap-1 underline mt-2"
                                            onClick={() => paymentTermsFieldArray.append({ term: "" })}
                                        >
                                            <PlusCircle size={15} />
                                            Add Term
                                        </span>
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <Accordion type="single" collapsible defaultValue={''} className="w-full">
                            {/* ... My Details, Client Details, Invoice Details ... */}
                            <AccordionItem value="payment">
                                <AccordionTrigger className="font-semibold text-base cursor-pointer underline">
                                    Payment Details
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 mt-2">
                                    
                                    {/* Payment Method Selection Cards */}
                                    <FormField
                                    control={form.control}
                                    name="paymentMethods"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                        <FormLabel>Select payment methods</FormLabel>
                                        <FormControl>
                                            <div className="grid md:grid-cols-3 grid-cols-2 gap-3">
                                            {/* Mobile Money Card */}
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
                                            {/* ... Repeat for Orange and Card ... */}
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

                                    {/* Conditional Fields */}
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

                                    {/* Conditional Fields */}
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
                        </Accordion>
                        <Accordion type="single" collapsible defaultValue="notes">
                            <AccordionItem value="notes">
                                <AccordionTrigger className="font-semibold cursor-pointer text-base underline">
                                    Additional notes
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 mt-2">
                                    <FormField
                                        control={form.control}
                                        name="notes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Note
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea rows={5} {...field} className="rounded-md" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <div className="flex items-center gap-2 my-8">
                            <Button variant={"ghost"} className="border rounded-sm" type="submit">
                                Save as draft
                            </Button>
                            <Button className="bg-[#1E3A8A] rounded-sm" type="submit">
                                Create Invoice
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="hidden xl:flex xl:w-3/5 h-full items-center justify-center bg-gray-50/50">
                <div className="text-center p-8 border-2 border-dashed rounded-xl">
                    <p className="text-muted-foreground font-medium">
                        Live Preview Area
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        Your invoice will appear here as you type.
                    </p>
                </div>
            </div>
        </div>
    )
}