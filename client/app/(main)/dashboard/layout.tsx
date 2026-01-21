export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        Dashboard Layout
        <div>
            {children}
        </div>
    </div>
  );
}