import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaundryEase - Christ University Hostel",
  description: "Digital laundry management system for Christ University hostel students",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}