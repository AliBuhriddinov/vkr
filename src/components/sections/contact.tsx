import { getLocale, getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/content";
import { ApplicationForm } from "@/components/application-form";
import { Reveal } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export async function Contact() {
  const t = await getTranslations("contact");
  const locale = await getLocale();
  const session = await auth();
  const rows = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: { id: true, title: true, titleEn: true },
  });
  const services = rows.map((row) => ({
    id: row.id,
    title: localize(row, "title", locale),
  }));

  return (
    <section
      id="contacts"
      className="relative overflow-hidden border-t border-border bg-[#0b0e14] py-24 text-[#e8ebf2]"
    >
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div
        className="pointer-events-none absolute left-1/4 top-0 h-[28rem] w-[40rem] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #6e8cff 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#6e8cff]">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,3.5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em]">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-md text-[#9aa6bd]">{t("lead")}</p>

          <ul className="mt-10 space-y-5">
            <ContactItem icon={<Mail className="size-5" />} label={t("email")}>
              <a href="mailto:hello@pixelwave.dev" className="hover:text-[#6e8cff]">
                hello@pixelwave.dev
              </a>
            </ContactItem>
            <ContactItem icon={<Phone className="size-5" />} label={t("phone")}>
              <span className="tabular-nums">+7 495 000-00-00</span>
            </ContactItem>
            <ContactItem icon={<MapPin className="size-5" />} label={t("address")}>
              {t("addressValue")}
            </ContactItem>
          </ul>

          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#6e78a0]/40 px-4 py-2 text-sm text-[#9aa6bd]">
            <Clock className="size-4 text-teal" />
            {t("responseTime")}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="text-foreground">
          {session?.user ? (
            <ApplicationForm
              services={services}
              user={{
                name: session.user.name ?? "",
                email: session.user.email ?? "",
              }}
            />
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <h3 className="font-display text-xl font-semibold">
                {t("authRequired.title")}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("authRequired.text")}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/sign-up">{t("authRequired.signUp")}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/sign-in">{t("authRequired.signIn")}</Link>
                </Button>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/5 text-[#6e8cff]">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-[0.12em] text-[#9aa6bd]">
          {label}
        </p>
        <p className="mt-0.5 font-medium">{children}</p>
      </div>
    </li>
  );
}
