import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { serviceIcon } from "@/lib/service-icons";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion/reveal";

export async function Services() {
  const t = await getTranslations("services");
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <section id="services" className="relative border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,3.5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em]">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">{t("lead")}</p>
        </Reveal>

        <RevealStagger
          delay={0.1}
          className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, i) => {
            const Icon = serviceIcon(service.iconKey);
            return (
              <RevealItem key={service.id}>
                <a
                  href={`#contacts`}
                  className="group flex h-full flex-col bg-card p-8 transition-colors hover:bg-accent/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-mono text-sm text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.shortDescription}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    {t("more")}
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </a>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
