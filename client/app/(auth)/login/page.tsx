'use client'

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <p>
        Login Page
      </p>
      <Button onClick={() => toast.info('login page')}>
        Show toast
      </Button>
    </div>
  );
}