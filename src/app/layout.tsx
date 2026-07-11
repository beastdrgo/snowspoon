import type { Metadata } from "next";
import { Poppins, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Snow Spoon — Scoops of Joy in Every Bite",
    template: "%s · Snow Spoon",
  },
  description:
    "Premium sundaes, thick shakes, kulfi and desserts — freshly prepared with premium ingredients and served with love. Explore the Snow Spoon menu.",
  keywords: [
    "Snow Spoon",
    "ice cream",
    "sundaes",
    "thick shakes",
    "kulfi",
    "desserts",
    "Bengaluru dessert menu",
  ],
  openGraph: {
    type: "website",
    title: "Snow Spoon — Scoops of Joy in Every Bite",
    description:
      "Premium sundaes, thick shakes, kulfi and desserts, made fresh and served with love.",
    siteName: "Snow Spoon",
    url: siteUrl,
    images: [{ url: "/images/dessert-platter.jpeg", width: 1200, height: 800 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snow Spoon — Scoops of Joy in Every Bite",
    description:
      "Premium sundaes, thick shakes, kulfi and desserts, made fresh and served with love.",
    images: ["/images/dessert-platter.jpeg"],
  },
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
