import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { AiChatWindow } from "@/components/ai-chat-window";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CelebrAI — Intelligent Event Planning",
    template: "%s | CelebrAI",
  },
  description:
    "AI-powered event planning with smart budgeting, timeline management, vendor coordination, and creative concept ideation.",
  keywords: ["event planning", "AI", "wedding", "corporate events", "budget", "vendors"],
  openGraph: {
    title: "CelebrAI — Intelligent Event Planning",
    description: "Plan unforgettable events with the power of AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-slate-50 font-sans antialiased text-slate-900">
        <Navbar />
        <div className="flex-1">{children}</div>
        <AiChatWindow />
      </body>
    </html>
  );
}
