import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/hooks/react-query-provider";
import { Toaster } from "@/Components/Common/Toast/toaster";
import Header from "@/Components/Header";
import { Sidebar } from "@/Components/Sidebar";

export const metadata: Metadata = {
  title: "Zealtouch Management System",
  description: "zealtouch management system web app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-full">
        <ReactQueryProvider>
          <div className="flex h-screen w-full">
            <Sidebar />
            <div className="flex flex-col flex-grow">
              <Header />
              <main className="flex-grow p-4">{children}</main>
            </div>
          </div>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
