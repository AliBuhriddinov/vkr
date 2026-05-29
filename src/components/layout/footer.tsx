import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

const NAV_ITEMS = [
  { key: "services", href: "#services" },
  { key: "cases", href: "#cases" },
  { key: "process", href: "#process" },
  { key: "about", href: "#about" },
  { key: "contacts", href: "#contacts" },
] as const;

export function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const year = 2026;

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href="/" className="font-display text-lg font-bold tracking-tight">
            Pixel<span className="text-primary">Wave</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {tf("tagline")}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {tf("nav")}
          </h3>
          <ul className="mt-4 space-y-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  className="text-sm text-foreground/80 transition-colors hover:text-primary"
                >
                  {t(item.key)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {tf("contactsTitle")}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-foreground/80">
            <li>
              <a
                href="mailto:hello@pixelwave.dev"
                className="transition-colors hover:text-primary"
              >
                hello@pixelwave.dev
              </a>
            </li>
            <li className="tabular-nums">+7 495 000-00-00</li>
            <li className="text-muted-foreground">Россия · Владивосток</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-5 text-xs text-muted-foreground">
          <span>
            © {year} PixelWave. {tf("rights")}
          </span>
        </div>
      </div>
    </footer>
  );
}
