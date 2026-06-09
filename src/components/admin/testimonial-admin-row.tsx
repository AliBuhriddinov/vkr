"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DeleteWithUndo } from "@/components/admin/delete-with-undo";

type Item = {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  order: number;
  isPublished: boolean;
};

export function TestimonialAdminRow({
  item,
  isNew,
  toggleAction,
  deleteAction,
  viewAction,
}: {
  item: Item;
  isNew: boolean;
  toggleAction: () => Promise<void>;
  deleteAction: () => Promise<void>;
  viewAction: () => Promise<void>;
}) {
  const t = useTranslations("admin.testimonials");
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [pending, startTransition] = useTransition();
  const viewedRef = useRef(false);

  function toggle() {
    startTransition(async () => {
      await toggleAction();
      router.refresh();
      toast.success(
        item.isPublished ? t("removedFromCarousel") : t("addedToCarousel"),
      );
    });
  }

  function view() {
    setExpanded((v) => !v);
    if (!viewedRef.current) {
      viewedRef.current = true;
      startTransition(async () => {
        await viewAction();
        router.refresh();
      });
    }
  }

  return (
    <tr className={cn("align-top hover:bg-muted/30", isNew && "bg-primary/5")}>
      <td className="px-4 py-3">
        <div className="flex items-start gap-2">
          {isNew ? (
            <span
              className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
              title={t("unseen")}
              aria-label={t("unseen")}
            />
          ) : (
            <span className="mt-1.5 size-2 shrink-0" aria-hidden />
          )}
          <div>
            <p className={cn("font-medium", isNew && "font-semibold")}>
              {item.authorName}
            </p>
            <p className="text-xs text-muted-foreground">{item.authorRole}</p>
          </div>
        </div>
        {expanded && (
          <p className="mt-2 max-w-md whitespace-pre-line text-sm text-foreground/80">
            {item.quote}
          </p>
        )}
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
            item.isPublished
              ? "border-teal/30 bg-teal/10 text-teal"
              : "border-amber-500/30 bg-amber-500/10 text-amber-500",
          )}
        >
          {item.isPublished ? t("statusPublished") : t("statusPending")}
        </span>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {item.isPublished ? item.order : "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={view}
            aria-label={t("view")}
          >
            {expanded ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
          <Button
            variant={item.isPublished ? "outline" : "default"}
            size="sm"
            disabled={pending}
            onClick={toggle}
          >
            {item.isPublished ? t("removeFromCarousel") : t("addToCarousel")}
          </Button>
          <DeleteWithUndo action={deleteAction} name={item.authorName} />
        </div>
      </td>
    </tr>
  );
}
