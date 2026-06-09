"use client";

import { useForm, Controller } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneField } from "@/components/ui/phone-field";

type ServiceOption = { id: string; title: string };
type Status = "idle" | "success" | "error";

export function ApplicationForm({
  services,
  user,
}: {
  services: ServiceOption[];
  user?: { name: string; email: string };
}) {
  const t = useTranslations("contact.form");
  const tb = useTranslations("contact.budgets");
  const te = useTranslations("contact.errors");
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: "",
      serviceId: "",
      budgetRange: "",
    },
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
            readOnly={!!user}
            className={user ? "bg-muted/60" : undefined}
          />
        </Field>

        <Field label={t("email")} error={err("email")}>
          <Input
            type="email"
            {...register("email")}
            placeholder={t("emailPlaceholder")}
            aria-invalid={!!errors.email}
            readOnly={!!user}
            className={user ? "bg-muted/60" : undefined}
          />
        </Field>

        <Field label={`${t("phone")} · ${t("optional")}`} error={err("phone")}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneField
                value={field.value || undefined}
                onChange={(v) => field.onChange(v ?? "")}
                placeholder={t("phonePlaceholder")}
                invalid={!!errors.phone}
              />
            )}
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
          <Controller
            name="serviceId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "none"}
                onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("servicePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("servicePlaceholder")}</SelectItem>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field label={`${t("budget")} · ${t("optional")}`}>
          <Controller
            name="budgetRange"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "none"}
                onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("budgetPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("budgetPlaceholder")}</SelectItem>
                  {BUDGET_RANGES.map((b) => (
                    <SelectItem key={b} value={b}>
                      {tb(b)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
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
