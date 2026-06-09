import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { StatusBadge } from "@/components/status-badge";
import { StatusChangeForm } from "@/components/admin/status-change-form";
import { SeenItem } from "@/components/admin/seen-item";
import { Link } from "@/i18n/navigation";

export default async function AdminApplicationDetail({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  await requireRole(locale, ["ADMIN"]);
  const t = await getTranslations("admin.applications");
  const ts = await getTranslations("status");
  const tsh = await getTranslations("statusHint");
  const tb = await getTranslations("contact.budgets");

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      service: { select: { title: true } },
      assignedManager: { select: { name: true, email: true } },
      statusHistory: { orderBy: { changedAt: "asc" } },
    },
  });
  if (!application) notFound();

  const dateTime = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="max-w-3xl">
      <SeenItem kind="applications" id={application.id} />
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("back")}
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {t("detailTitle")}
        </h1>
        <StatusBadge
          status={application.status}
          label={ts(application.status)}
          hint={tsh(application.status)}
        />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
            {t("contact")}
          </h2>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{t("client")}</dt>
              <dd className="text-right font-medium">{application.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="text-right">{application.email}</dd>
            </div>
            {application.phone && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="text-right">{application.phone}</dd>
              </div>
            )}
            {application.company && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Company</dt>
                <dd className="text-right">{application.company}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{t("service")}</dt>
              <dd className="text-right">{application.service?.title ?? t("noService")}</dd>
            </div>
            {application.budgetRange && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Budget</dt>
                <dd className="text-right">{tb(application.budgetRange)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{t("manager")}</dt>
              <dd className="text-right">
                {application.assignedManager?.name ??
                  application.assignedManager?.email ??
                  t("unassigned")}
              </dd>
            </div>
          </dl>

          <h2 className="mt-5 text-xs uppercase tracking-wide text-muted-foreground">
            {t("message")}
          </h2>
          <p className="mt-2 whitespace-pre-line text-sm text-foreground/90">
            {application.message}
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-medium">{t("changeStatus")}</h2>
          <div className="mt-4">
            <StatusChangeForm
              locale={locale}
              applicationId={application.id}
              currentStatus={application.status}
            />
          </div>
        </section>
      </div>

      {application.statusHistory.length > 0 && (
        <section className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
            {t("history")}
          </h2>
          <ol className="mt-3 space-y-3">
            {application.statusHistory.map((change) => (
              <li key={change.id} className="flex items-start gap-3 text-sm">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={change.toStatus} label={ts(change.toStatus)} />
                    <span className="text-xs text-muted-foreground">
                      {dateTime.format(change.changedAt)}
                    </span>
                  </div>
                  {change.comment && (
                    <p className="mt-1 text-muted-foreground">{change.comment}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
