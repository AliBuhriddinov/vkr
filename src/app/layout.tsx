import type { Metadata } from "next";
import { Unbounded, Manrope } from "next/font/google";
import { getLocale } from "next-intl/server";

import { ThemeProvider } from "@/components/theme-provider";
import { AppToaster } from "@/components/app-toaster";
import { HeroBackground } from "@/components/hero-background";
import "./globals.css";
import "react-phone-number-input/style.css";

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700"],
  variable: "--font-unbounded",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PixelWave",
    template: "%s · PixelWave",
  },
  description:
    "Проектируем, разрабатываем и сопровождаем веб- и мобильные продукты для бизнеса.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${unbounded.variable} ${manrope.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <HeroBackground className="pointer-events-none fixed inset-0 -z-10 h-full w-full [mask-image:radial-gradient(ellipse_90%_80%_at_50%_25%,black,transparent_92%)]" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
