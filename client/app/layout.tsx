import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ReactQueryProvider } from "./providers/react-query-provider";

const inter = Inter({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Billam",
  description: "AI powered business management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} tracking-tight antialiased text-[#3c3c3c]`}
      >
        <ReactQueryProvider>
          {children}
          <Toaster richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
