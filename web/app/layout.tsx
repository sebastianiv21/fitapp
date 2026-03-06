import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "FitApp - AI-Powered Fitness & Nutrition",
  description: "Personalized diet plans and workout routines powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="fitapp">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
