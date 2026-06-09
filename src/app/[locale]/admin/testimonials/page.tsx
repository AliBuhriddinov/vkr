import { getTranslations, setRequestLocale } from "next-intl/server";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { TestimonialAdminRow } from "@/components/admin/testimonial-admin-row";
import { markSeen } from "@/lib/actions/notifications";
import { deleteTestimonial, toggleTestimonial } from "@/lib/actions/testimonials";
import { AutoRefresh } from "@/components/auto-refresh";

export default async function AdminTestimonialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireRole(locale, ["ADMIN"]);
  const t = await getTranslations("admin.testimonials");
  const tf = await getTranslations("admin.form");

  const [items, me] = await Promise.all([
    prisma.testimonial.findMany({
      orderBy: [{ isPublished: "asc" }, { order: "asc" }],
    }),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { seenTestimonialIds: true },
    }),
  ]);
  const seen = new Set(me?.seenTestimonialIds ?? []);

  return (
    <div>
      <AutoRefresh />
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight">{t("title")}</h1>
        <Button asChild size="sm">
          <Link href="/admin/testimonials/new">
            <Plus className="size-4" />
            {tf("new")}
          </Link>
        </Button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{t("adminHint")}</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">{t("authorName")}</th>
              <th className="px-4 py-3 font-medium">{t("status")}</th>
              <th className="px-4 py-3 font-medium">{t("order")}</th>
              <th className="px-4 py-3 text-right font-medium">{tf("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <TestimonialAdminRow
                key={item.id}
                item={item}
                isNew={!item.isPublished && !seen.has(item.id)}
                toggleAction={toggleTestimonial.bind(null, locale, item.id)}
                deleteAction={deleteTestimonial.bind(null, locale, item.id)}
                viewAction={markSeen.bind(null, locale, "testimonials", item.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
