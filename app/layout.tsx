import type { Metadata } from "next";
import { Inter, Alegreya } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Matches globals.css
  display: "swap",
});

const alegreya = Alegreya({
  subsets: ["latin"],
  variable: "--font-alegreya", // Matches globals.css
  display: "swap",
});

export const metadata: Metadata = {
  title: "Easemed | Procurement Operating System",
  description: "B2B Medical Supply Chain Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* We add the font variables to the body or html tag.
         Tailwind v4 reads them via the var(--font-...) mapping we did in globals.css.
      */}
      <body className={`${inter.variable} ${alegreya.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
