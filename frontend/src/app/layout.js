import "./globals.css";
import { GeistSans } from "geist/font/sans";
import AnimatedBackground from "@/components/AnimatedBackground";

export const metadata = {
  title: "QuickAI — AI Productivity Tools",
  description:
    "QuickAI is an all-in-one AI SaaS platform offering text generation, writing, summarizing and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="font-sans antialiased">
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
