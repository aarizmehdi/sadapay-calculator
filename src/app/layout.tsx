import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://sadapay-calculator.vercel.app";
const SITE_NAME = "SadaPay Banking Calculator";
const DESCRIPTION =
  "Compare USD to PKR conversion fees with SadaPay vs traditional banks. Full fee breakdown including international transaction fees and withholding tax for Pakistani users.";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "SadaPay",
    "USD to PKR",
    "Pakistan banking calculator",
    "currency converter Pakistan",
    "SadaPay fees",
    "international transaction fee Pakistan",
    "PKR conversion",
    "withholding tax calculator",
    "remittance calculator Pakistan",
  ],
  authors: [{ name: "Aariz Mehdi", url: "https://github.com/aarizmehdi" }],
  creator: "Aariz Mehdi",
  publisher: "Aariz Mehdi",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@aarizmehdi",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
  // viewport is now a separate export in Next.js 14+
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#072333",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W4NL14WR57"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W4NL14WR57');
          `}
        </Script>

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: SITE_NAME,
              url: SITE_URL,
              description: DESCRIPTION,
              applicationCategory: "FinanceApplication",
              operatingSystem: "All",
              browserRequirements: "Requires JavaScript",
              author: {
                "@type": "Person",
                name: "Aariz Mehdi",
                url: "https://github.com/aarizmehdi",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
