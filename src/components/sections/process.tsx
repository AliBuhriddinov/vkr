import { useTranslations } from "next-intl";

import { Reveal, RevealStagger, RevealItem } from "@/components/motion/reveal";

type Step = { title: string; text: string };

export function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as Step[];

  return (
    <section id="process" className="relative border-t border-border py-24">
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

        <RevealStagger delay={0.1} className="mt-14 grid gap-8 md:grid-cols-4">
          {steps.map((step, i) => (
            <RevealItem key={i} className="relative">
              <span className="font-display text-5xl font-bold text-primary/20">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
