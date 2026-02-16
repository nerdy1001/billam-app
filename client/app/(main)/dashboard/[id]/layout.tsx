import Container from "@/app/_components/dashboard/container";
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
      <div className="w-full">
        <div className="sticky top-0 bg-white flex items-center justify-between w-full py-2 px-4 lg:hidden border border-b-gray-300">
          <SidebarTrigger />
          <div className=" bg-[#1E3A8A] text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
            <FileText className='w-4 h-4 text-white' />
          </div>
          <NavUser />
        </div>
        <Container>
          {children}
        </Container>
      </div>
    </SidebarProvider>
  );
}