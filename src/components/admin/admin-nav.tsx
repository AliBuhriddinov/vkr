"use client";

import { useTranslations } from "next-intl";
import {
  FolderKanban,
  Inbox,
  LayoutDashboard,
  type LucideIcon,
  MessageSquareQuote,
  Newspaper,
  Wrench,
} from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const ITEMS: {
  href: string;
  key: string;
  icon: LucideIcon;
  exact?: boolean;
}[] = [
  { href: "/admin", key: "dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/applications", key: "applications", icon: Inbox },
  { href: "/admin/services", key: "services", icon: Wrench },
  { href: "/admin/portfolio", key: "portfolio", icon: FolderKanban },
  { href: "/admin/blog", key: "blog", icon: Newspaper },
  {
    href: "/admin/testimonials",
    key: "testimonials",
    icon: MessageSquareQuote,
  },
];

export function AdminNav({
  badges,
}: {
  badges: { applications: number; testimonials: number };
}) {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();
  const items = ITEMS;

  return (
    <nav className="hidden w-52 shrink-0 md:block md:sticky md:top-20 md:self-start">
      <ul className="space-y-1">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          const count =
            item.key === "applications"
              ? badges.applications
              : item.key === "testimonials"
                ? badges.testimonials
                : 0;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {t(item.key)}
                {count > 0 ? (
                  <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                    {count}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
