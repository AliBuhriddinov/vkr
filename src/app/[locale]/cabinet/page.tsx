import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReviewForm } from "@/components/cabinet/review-form";
import { ProfileForm } from "@/components/cabinet/profile-form";
import { MyReviews } from "@/components/cabinet/my-reviews";
import { AutoRefresh } from "@/components/auto-refresh";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cabinet" });
  return { title: t("title") };
}

export default async function CabinetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireUser(locale);

  const t = await getTranslations("cabinet");
  const ts = await getTranslations("status");
  const tsh = await getTranslations("statusHint");
  const tb = await getTranslations("contact.budgets");

  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      service: { select: { title: true } },
      statusHistory: { orderBy: { changedAt: "asc" } },
    },
  });

  const [dbUser, myReviews] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id }, select: { name: true } }),
    prisma.testimonial.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, quote: true, authorRole: true, isPublished: true },
    }),
  ]);

  const dateOnly = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const dateTime = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <>
      <AutoRefresh />
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-sm text-muted-foreground">
            {t("greeting", { name: dbUser?.name ?? user.email ?? "" })}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>

          {applications.length === 0 ? (
            <div className="mt-10 rounded-xl border border-border bg-card p-10 text-center">
              <p className="text-muted-foreground">{t("empty")}</p>
              <Button asChild className="mt-6">
                <a href={`/${locale}#contacts`}>
                  {t("emptyCta")}
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          ) : (
            <div className="mt-10 space-y-6">
              {applications.map((app) => (
                <article
                  key={app.id}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-medium">
                        {app.service?.title ?? t("noService")}
                      </h2>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {t("created")}: {dateOnly.format(app.createdAt)}
                        {app.budgetRange ? ` · ${tb(app.budgetRange)}` : ""}
                      </p>
                    </div>
                    <StatusBadge status={app.status} label={ts(app.status)} hint={tsh(app.status)} />
                  </div>

                  <p className="mt-4 whitespace-pre-line text-sm text-foreground/90">
                    {app.message}
                  </p>

                  {app.managerComment && (
                    <div className="mt-4 rounded-md border border-border bg-muted/40 p-3 text-sm">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {t("managerComment")}
                      </p>
                      <p className="mt-1">{app.managerComment}</p>
                    </div>
                  )}

                  {app.statusHistory.length > 0 && (
                    <div className="mt-5 border-t border-border pt-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {t("history")}
                      </p>
                      <ol className="mt-3 space-y-3">
                        {app.statusHistory.map((change) => (
                          <li key={change.id} className="flex items-start gap-3 text-sm">
                            <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <StatusBadge
                                  status={change.toStatus}
                                  label={ts(change.toStatus)}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {dateTime.format(change.changedAt)}
                                </span>
                              </div>
                              {change.comment && (
                                <p className="mt-1 text-muted-foreground">
                                  {change.comment}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          <div className="mt-14 border-t border-border pt-10">
            <ProfileForm initialName={dbUser?.name ?? ""} />
          </div>

          <div className="mt-14 border-t border-border pt-10">
            {myReviews.length > 0 && (
              <div className="mb-8">
                <MyReviews reviews={myReviews} />
              </div>
            )}
            <ReviewForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
