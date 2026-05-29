import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion/reveal";

const COVERS = [
  "from-[#3344e0] via-[#1b2c52] to-[#0b0e14]",
  "from-[#0e7c8c] via-[#16324a] to-[#0b0e14]",
  "from-[#6e8cff] via-[#3344e0] to-[#161d29]",
  "from-[#54c9d8] via-[#1b3a9e] to-[#0b0e14]",
];

export async function Cases() {
  const t = await getTranslations("cases");
  const items = await prisma.portfolioItem.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    take: 4,
  });

  return (
    <section id="cases" className="relative border-t border-border py-24">
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

        <RevealStagger delay={0.1} className="mt-14 grid gap-6 md:grid-cols-2">
          {items.map((item, i) => (
            <RevealItem key={item.id}>
              <a
                href="#contacts"
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-ring hover:shadow-xl hover:shadow-primary/5"
              >
                <div
                  className={`relative flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-border bg-gradient-to-br ${COVERS[i % COVERS.length]}`}
                >
                  <div className="grain absolute inset-0 opacity-[0.12] mix-blend-overlay" />
                  <div className="dotgrid absolute inset-0 opacity-[0.15]" />
                  <span className="relative font-display text-7xl font-bold text-white/90 drop-shadow-lg transition-transform duration-500 group-hover:scale-105">
                    {item.title.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-medium text-teal"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    {t("view")}
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>
              </a>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
