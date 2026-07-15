import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Well Within",
    template: "%s | Well Within",
  },
  description:
    "Support and privacy information for Well Within cycle charting.",
  openGraph: {
    type: "website",
    siteName: "Well Within",
    title: "Well Within",
    description: "Support and privacy, made clear.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Well Within",
    description: "Support and privacy, made clear.",
  },
  icons: {
    icon: "/well-within-icon.png",
    apple: "/well-within-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={geist.variable}>{children}</body>
    </html>
  );
}
