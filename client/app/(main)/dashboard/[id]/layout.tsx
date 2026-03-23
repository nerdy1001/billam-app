import CreateInvoiceWithAiModal from "@/app/_components/modals/create-invoice-with-ai-modal";
import PasswordModal from "@/app/_components/modals/password-modal";
import PhoneNumberModal from "@/app/_components/modals/phone-number-modal";
import UsernameModal from "@/app/_components/modals/username-modal";
import { AppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/nav-user";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FileText } from "lucide-react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <CreateInvoiceWithAiModal />
      <PhoneNumberModal />
      <PasswordModal />
      <UsernameModal />
      <div className="w-full">
        <div className="sticky top-0 z-10 bg-white flex items-center justify-between w-full py-2 px-4 xl:hidden border border-b-gray-300">
          <SidebarTrigger />
          <div className=" bg-[#1E3A8A] text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
            <FileText className='w-4 h-4 text-white' />
          </div>
          <NavUser />
        </div>
        {children}
      </div>
    </SidebarProvider>
  );
}