"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

import {
  applicationSchema,
  type ApplicationInput,
  BUDGET_RANGES,
} from "@/lib/validations/application";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type ServiceOption = { id: string; title: string };
type Status = "idle" | "success" | "error";

export function ApplicationForm({ services }: { services: ServiceOption[] }) {
  const t = useTranslations("contact.form");
  const tb = useTranslations("contact.budgets");
  const te = useTranslations("contact.errors");
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
  });

  async function onSubmit(values: ApplicationInput) {
    setStatus("idle");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("request failed");
      reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const err = (key: keyof ApplicationInput) =>
    errors[key]?.message ? te(errors[key]!.message as string) : undefined;

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="size-12 text-teal" />
        <h3 className="mt-4 text-xl font-semibold">{t("successTitle")}</h3>
        <p className="mt-2 text-muted-foreground">{t("successText")}</p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          {t("again")}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("name")} error={err("name")}>
          <Input
            {...register("name")}
            placeholder={t("namePlaceholder")}
            aria-invalid={!!errors.name}
          />
        </Field>

        <Field label={t("email")} error={err("email")}>
          <Input
            type="email"
            {...register("email")}
            placeholder={t("emailPlaceholder")}
            aria-invalid={!!errors.email}
          />
        </Field>

        <Field label={`${t("phone")} · ${t("optional")}`} error={err("phone")}>
          <Input
            {...register("phone")}
            placeholder={t("phonePlaceholder")}
            aria-invalid={!!errors.phone}
          />
        </Field>

        <Field
          label={`${t("company")} · ${t("optional")}`}
          error={err("company")}
        >
          <Input
            {...register("company")}
            placeholder={t("companyPlaceholder")}
            aria-invalid={!!errors.company}
          />
        </Field>

        <Field label={`${t("service")} · ${t("optional")}`}>
          <select
            {...register("serviceId")}
            className="h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            defaultValue=""
          >
            <option value="">{t("servicePlaceholder")}</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label={`${t("budget")} · ${t("optional")}`}>
          <select
            {...register("budgetRange")}
            className="h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            defaultValue=""
          >
            <option value="">{t("budgetPlaceholder")}</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>
                {tb(b)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label={t("message")} error={err("message")}>
          <Textarea
            {...register("message")}
            placeholder={t("messagePlaceholder")}
            aria-invalid={!!errors.message}
          />
        </Field>
      </div>

      {status === "error" && (
        <div className="mt-5 flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
          <div>
            <p className="font-medium">{t("errorTitle")}</p>
            <p className="text-muted-foreground">{t("errorText")}</p>
          </div>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}
