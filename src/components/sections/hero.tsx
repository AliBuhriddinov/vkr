"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/motion/count-up";

const STATS = [
  { value: 150, suffix: "+", key: "projects" },
  { value: 10, suffix: "", key: "years" },
  { value: 40, suffix: "+", key: "specialists" },
  { value: 71, suffix: "", key: "nps" },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const t = useTranslations("hero");
  const reduce = useReducedMotion();

  const titleWords = t("titleMain").split(" ");
  const accentWords = t("titleAccent").split(" ");

  const wordVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : "0.5em" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay: 0.15 + i * 0.06, ease: EASE },
    }),
  };

  return (
    <section className="relative overflow-hidden">

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 md:py-32 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center rounded-md border border-border bg-card/60 px-3 py-1.5 font-mono text-sm tracking-wide backdrop-blur-sm"
          >
            <span className="text-muted-foreground">&gt;&nbsp;</span>
            <span className="text-teal">{t("badge")}</span>
            <motion.span
              aria-hidden
              className="ml-1.5 inline-block h-[0.95em] w-[0.5em] translate-y-[0.08em] bg-teal"
              animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
              transition={{
                duration: 1.1,
                times: [0, 0.49, 0.5, 1],
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.span>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
            className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-primary"
          >
            {t("eyebrow")}
          </motion.p>

          <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.02em]">
            <span className="block overflow-hidden">
              {titleWords.map((word, i) => (
                <motion.span
                  key={`m-${i}`}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={wordVariants}
                  className="mr-[0.25em] inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden">
              {accentWords.map((word, i) => (
                <motion.span
                  key={`a-${i}`}
                  custom={titleWords.length + i}
                  initial="hidden"
                  animate="visible"
                  variants={wordVariants}
                  className="mr-[0.25em] inline-block bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
            className="mt-6 max-w-xl text-[clamp(1.05rem,1.3vw,1.2rem)] leading-relaxed text-muted-foreground"
          >
            {t("lead")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.62, ease: EASE }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg" className="group">
              <a href="#contacts">
                {t("ctaPrimary")}
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href="#cases">{t("ctaSecondary")}</a>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.78 }}
            className="mt-5 text-sm text-muted-foreground"
          >
            {t("riskReducer")}
          </motion.p>
        </div>

        <HeroVisual reduce={!!reduce} />
      </div>

      <div className="relative border-t border-border">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-10 px-6 py-12 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
            >
              <dt className="font-display text-[clamp(2.25rem,3.5vw,3rem)] font-bold leading-none">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dt>
              <dd className="mt-2 text-sm text-muted-foreground">
                {t(`stats.${stat.key}`)}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function HeroVisual({ reduce }: { reduce: boolean }) {
  const t = useTranslations("hero.visual");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      <div className="relative rounded-2xl border border-border bg-card/80 p-6 shadow-2xl shadow-primary/10 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              {t("metric")}
            </p>
            <p className="mt-2 font-display text-4xl font-bold">
              <CountUp value={38} suffix="%" />
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-teal/15 px-3 py-1 text-sm font-medium text-teal">
            <TrendingUp className="size-4" />
            {t("growth")}
          </span>
        </div>

        <div className="mt-6 flex h-28 items-end gap-2">
          {[40, 55, 48, 70, 62, 85, 78, 100].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{
                duration: reduce ? 0 : 0.8,
                delay: reduce ? 0 : 0.6 + i * 0.08,
                ease: EASE,
              }}
              className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary"
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
        className="absolute -bottom-6 -left-6 hidden sm:block"
      >
        <motion.div
          animate={reduce ? undefined : { x: [0, 7, 0, -7, 0], y: [0, -4, 0, 4, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-xl border border-border bg-card/90 p-4 shadow-xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
              <Sparkles className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">
                <CountUp value={12} /> {t("requests")}
              </p>
              <p className="text-xs text-muted-foreground">{t("live")}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
