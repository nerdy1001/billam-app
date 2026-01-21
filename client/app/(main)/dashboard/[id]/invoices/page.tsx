'use client'

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function InvoicesPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <p>
        Invoices Page
      </p>
      <Button onClick={() => toast.info('landing page')}>
        Show toast
      </Button>
    </div>
  );
}