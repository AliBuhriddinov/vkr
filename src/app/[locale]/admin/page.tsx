import { getTranslations, setRequestLocale } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/status-badge";
import type { ApplicationStatus } from "@/generated/prisma/enums";

const STATUSES: ApplicationStatus[] = ["NEW", "IN_PROGRESS", "DONE", "REJECTED"];

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.dashboard");
  const ts = await getTranslations("status");
  const tsh = await getTranslations("statusHint");

  const [byStatus, totalApps, services, portfolio, blog] = await Promise.all([
    prisma.application.groupBy({ by: ["status"], _count: true }),
    prisma.application.count(),
    prisma.service.count(),
    prisma.portfolioItem.count(),
    prisma.blogPost.count(),
  ]);

  const counts: Partial<Record<ApplicationStatus, number>> = {};
  for (const row of byStatus) counts[row.status] = row._count;

  const stats = [
    { label: t("totalApplications"), value: totalApps },
    { label: t("services"), value: services },
    { label: t("portfolio"), value: portfolio },
    { label: t("blog"), value: blog },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">{t("title")}</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-3xl font-bold tabular-nums">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-muted-foreground">{t("byStatus")}</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATUSES.map((status) => (
            <div key={status} className="rounded-xl border border-border bg-card p-5">
              <p className="text-3xl font-bold tabular-nums">{counts[status] ?? 0}</p>
              <div className="mt-2">
                <StatusBadge status={status} label={ts(status)} hint={tsh(status)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
