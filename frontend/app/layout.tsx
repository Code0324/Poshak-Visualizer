import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FabricToModel — AI Virtual Try-On for South Asian Fashion",
  description:
    "Transform unstitched fabric or stitched dress images into stunning model wear photos with AI. Get styling suggestions for shalwar kameez, lehenga, 2-piece & 3-piece suits.",
  keywords: [
    "virtual try-on",
    "South Asian fashion",
    "shalwar kameez",
    "lehenga",
    "AI fashion",
    "fabric to model",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "Inter, system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
