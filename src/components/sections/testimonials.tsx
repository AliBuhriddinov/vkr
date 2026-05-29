import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";

import { Reveal, RevealStagger, RevealItem } from "@/components/motion/reveal";

type Item = { quote: string; name: string; role: string };

export function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as Item[];

  return (
    <section className="relative border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,3.5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em]">
            {t("title")}
          </h2>
        </Reveal>

        <RevealStagger delay={0.1} className="mt-14 grid gap-6 md:grid-cols-2">
          {items.map((item, i) => (
            <RevealItem key={i}>
              <figure className="flex h-full flex-col rounded-xl border border-border bg-card p-8">
                <Quote className="size-8 text-primary/30" />
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
