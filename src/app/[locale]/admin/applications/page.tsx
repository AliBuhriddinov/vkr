import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { AutoRefresh } from "@/components/auto-refresh";

export default async function AdminApplicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireRole(locale, ["ADMIN"]);
  const t = await getTranslations("admin.applications");
  const ts = await getTranslations("status");
  const tsh = await getTranslations("statusHint");

  const [applications, me] = await Promise.all([
    prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: { title: true } },
        user: { select: { id: true } },
      },
    }),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { seenApplicationIds: true },
    }),
  ]);
  const seen = new Set(me?.seenApplicationIds ?? []);

  const dateOnly = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <div>
      <AutoRefresh />
      <h1 className="font-display text-2xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>

      {applications.length === 0 ? (
        <p className="mt-10 rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">{t("client")}</th>
                <th className="px-4 py-3 font-medium">{t("service")}</th>
                <th className="px-4 py-3 font-medium">{t("status")}</th>
                <th className="px-4 py-3 font-medium">{t("created")}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {applications.map((app) => {
                const isNew = !seen.has(app.id);
                return (
                <tr
                  key={app.id}
                  className={cn("hover:bg-muted/30", isNew && "bg-primary/5")}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      {isNew ? (
                        <span
                          className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
                          title={t("unseen")}
                          aria-label={t("unseen")}
                        />
                      ) : (
                        <span className="mt-1.5 size-2 shrink-0" aria-hidden />
                      )}
                      <div>
                        <p className={cn("font-medium", isNew && "font-semibold")}>
                          {app.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{app.email}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {app.user ? t("registered") : t("anonymous")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {app.service?.title ?? t("noService")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} label={ts(app.status)} hint={tsh(app.status)} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {dateOnly.format(app.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild variant={isNew ? "default" : "outline"} size="sm">
                      <Link href={`/admin/applications/${app.id}`}>
                        {t("manage")}
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
