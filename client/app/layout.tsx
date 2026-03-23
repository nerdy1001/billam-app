import type { Metadata } from "next";
import { Google_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ReactQueryProvider } from "./providers/react-query-provider";
import { ReduxProvider } from "./providers/redux-provider";

const inter = Google_Sans({
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
          <ReduxProvider>
            {children}
            <Toaster richColors />
          </ReduxProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
