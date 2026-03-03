import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "AI Career Coach — Land the job you actually want",
  description: "Get cover letter bullets, interview prep, and fit scores powered by AI.",
  openGraph: {
    title: "AI Career Coach — Land the job you actually want",
    description: "Get cover letter bullets, interview prep, and fit scores powered by AI.",
    siteName: "AI Career Coach",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Career Coach — Land the job you actually want",
    description: "Get cover letter bullets, interview prep, and fit scores powered by AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jakarta.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
