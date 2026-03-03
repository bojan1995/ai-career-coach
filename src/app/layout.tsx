import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components";
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
  metadataBase: new URL('https://ai-career-coach-tfc6.vercel.app'),
  title: "AI Career Coach — Land the job you actually want",
  description: "Paste your resume + job description. Get cover letter bullets, interview prep, and a fit score in seconds.",
  verification: {
    google: 'vMgYRKhwd_aJs_dtRyLhlj_mt-okFWmhdqM46yduoEw',
  },
  openGraph: {
    title: "AI Career Coach — Land the job you actually want",
    description: "Paste your resume + job description. Get cover letter bullets, interview prep, and a fit score in seconds.",
    url: "https://ai-career-coach-tfc6.vercel.app",
    siteName: "AI Career Coach",
    type: "website",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Career Coach',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Career Coach — Land the job you actually want",
    description: "Paste your resume + job description. Get cover letter bullets, interview prep, and a fit score in seconds.",
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://ai-career-coach-tfc6.vercel.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "AI Career Coach",
                "url": "https://ai-career-coach-tfc6.vercel.app",
                "description": "Paste your resume + job description. Get cover letter bullets, interview prep, and a fit score in seconds.",
                "publisher": {
                  "@type": "Organization",
                  "name": "AI Career Coach",
                  "url": "https://ai-career-coach-tfc6.vercel.app"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "AI Career Coach",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "127"
                },
                "description": "AI-powered career coaching tool that generates personalized cover letter bullets, interview questions, and fit scores based on your resume and target job description.",
                "url": "https://ai-career-coach-tfc6.vercel.app",
                "screenshot": "https://ai-career-coach-tfc6.vercel.app/og-image.png",
                "featureList": [
                  "AI-powered cover letter generation",
                  "Interview question preparation",
                  "Job fit score analysis",
                  "Real-time streaming results"
                ]
              }
            ])
          }}
        />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} font-sans`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
