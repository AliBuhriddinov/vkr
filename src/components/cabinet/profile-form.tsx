"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { updateName, updatePassword } from "@/lib/actions/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ProfileForm({ initialName }: { initialName: string }) {
  const t = useTranslations("cabinet.profile");
  const te = useTranslations("cabinet.profile.errors");
  const locale = useLocale();
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingName, startName] = useTransition();
  const [savingPassword, startPassword] = useTransition();

  function saveName() {
    setNameError(null);
    startName(async () => {
      const res = await updateName(locale, name);
      if (!res.ok) {
        setNameError(te(res.error));
        return;
      }
      toast.success(t("nameSaved"));
      router.refresh();
    });
  }

  function savePassword() {
    setPasswordError(null);
    startPassword(async () => {
      const res = await updatePassword(locale, current, next);
      if (!res.ok) {
        setPasswordError(te(res.error));
        return;
      }
      setCurrent("");
      setNext("");
      toast.success(t("passwordSaved"));
    });
  }

  return (
    <div>
      <h2 className="font-display text-xl font-semibold">{t("title")}</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <Label>{t("name")}</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          {nameError && (
            <p className="mt-1.5 text-sm text-destructive">{nameError}</p>
          )}
          <Button className="mt-4" onClick={saveName} disabled={savingName}>
            {savingName ? t("saving") : t("saveName")}
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <Label>{t("currentPassword")}</Label>
          <Input
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
          <Label className="mt-3">{t("newPassword")}</Label>
          <Input
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
          {passwordError && (
            <p className="mt-1.5 text-sm text-destructive">{passwordError}</p>
          )}
          <Button className="mt-4" onClick={savePassword} disabled={savingPassword}>
            {savingPassword ? t("saving") : t("savePassword")}
          </Button>
        </div>
      </div>
    </div>
  );
}
