/**
 * Node modules
 */
import type { Metadata } from "next";
import { Kumbh_Sans } from "next/font/google";
import { ViewTransition } from "react";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import NextTopLoader from "nextjs-toploader";

/**
 * Custom modules
 */
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Components
 */
import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

/**
 * Constants
 */
import { SETTING_SITE } from "@/constants";

/**
 * Assets
 */
import { Favicon } from "@/assets/images";
import "@/assets/css/styles.css";

/**
 * Static Params && Meta tags
 */
export const generateStaticParams = () => routing.locales.map((locale) => ({locale}));

export async function generateMetadata({
  params
}: {
  params: Promise<{
    locale: string;
  }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const metadataBase = new URL(process.env.NEXT_PUBLIC_DOMAIN_NAME || "http://localhost:3000");
  const pathname = `/${locale}/`;
  const siteName = SETTING_SITE.siteName;
  const title = "Notekeeper - Your Everyday Notes | Effortless Note-Taking";
  const description = SETTING_SITE.description;

  return {
    metadataBase,
    alternates: {
      canonical: pathname,
      languages: {
        "en": "/en",
        "ar": "/ar",
      },
    },
    icons: {
      icon: Favicon.src,
      shortcut: Favicon.src,
      apple: Favicon.src,
      other: {
        rel: "apple-touch-icon-precomposed",
        url: Favicon.src
      }
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    },
    title: {
      template: `%s | ${siteName}`,
      default: siteName
    },
    description,
    referrer: "origin-when-cross-origin",
    openGraph: {
      title,
      description,
      url: pathname,
      siteName,
      locale,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    },
  };
}

/**
 * Google font
 */
const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-kumbh",
});

/**
 * Types
 */
type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};
 
export default async function LocaleLayout({
  children, 
  params
}: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();
 
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={cn(kumbhSans.variable)}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader
            color="var(--primary)"
            showSpinner={false}
          />
          <NextIntlClientProvider>
            <ViewTransition>
              <TooltipProvider>
                {children}
                <Toaster />
              </TooltipProvider>
            </ViewTransition>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
