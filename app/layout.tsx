import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Avatar Generator",
  description: "Generate AI image avatars using Google Gemini",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
