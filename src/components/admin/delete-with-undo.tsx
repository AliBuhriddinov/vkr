"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteWithUndo({
  action,
  name,
}: {
  action: () => Promise<void>;
  name: string;
}) {
  const t = useTranslations("admin.confirmDelete");
  const router = useRouter();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  function confirmDelete() {
    const row = wrapRef.current?.closest("tr");
    if (row instanceof HTMLElement) row.style.display = "none";

    let undone = false;
    let settled = false;
    // Удаление привязано к реальному закрытию тоста (а не к отдельному таймеру),
    // поэтому при наведении тост и удаление паузятся вместе — отмена работает,
    // пока тост виден.
    const finalize = async () => {
      if (settled) return;
      settled = true;
      if (undone) return;
      await action();
      router.refresh();
    };

    toast(t("done", { name }), {
      duration: 3000,
      action: {
        label: t("undo"),
        onClick: () => {
          undone = true;
          if (row instanceof HTMLElement) row.style.display = "";
        },
      },
      onAutoClose: finalize,
      onDismiss: finalize,
    });
  }

  return (
    <span ref={wrapRef} className="inline-flex">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            aria-label={t("confirm")}
          >
            <Trash2 className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("message", { name })}</AlertDialogDescription>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialogCancel asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={confirmDelete}>
                {t("confirm")}
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </span>
  );
}
