
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://catering.thekhaugalli.com"),
  title: "Khau Galli Catering | Build Your Event Menu",
  description: "Choose a Khau Galli catering package, customise the menu, add live counters and prepare a WhatsApp enquiry for your event.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
