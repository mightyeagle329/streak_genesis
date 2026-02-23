import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/lib/web3-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Streak Genesis - Vampire Attack",
  description: "You traded millions on Prediction Apps and got nothing. Claim your Streak XP.",
  openGraph: {
    title: "Streak Genesis - Vampire Attack",
    description: "Claim your Streak XP for past Prediction Apps volume",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Streak Genesis - Vampire Attack",
    description: "Claim your Streak XP for past Prediction Apps volume",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
