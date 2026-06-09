"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { updateReview } from "@/lib/actions/testimonials";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Review = {
  id: string;
  quote: string;
  authorRole: string;
  isPublished: boolean;
};

export function MyReviews({ reviews }: { reviews: Review[] }) {
  const t = useTranslations("review");
  const te = useTranslations("admin.errors");
  const locale = useLocale();
  const router = useRouter();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [quote, setQuote] = useState("");
  const [role, setRole] = useState("");
  const [saving, start] = useTransition();

  function startEdit(review: Review) {
    setEditingId(review.id);
    setQuote(review.quote);
    setRole(review.authorRole);
  }

  function save(id: string) {
    start(async () => {
      const res = await updateReview(locale, id, { quote, authorRole: role });
      if (!res.ok) {
        toast.error(te(res.error));
        return;
      }
      setEditingId(null);
      toast.success(t("updated"));
      router.refresh();
    });
  }

  return (
    <div>
      <h2 className="font-display text-xl font-semibold">{t("myTitle")}</h2>
      <div className="mt-4 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-border bg-card p-5">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                review.isPublished
                  ? "border-teal/30 bg-teal/10 text-teal"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-500",
              )}
            >
              {review.isPublished ? t("published") : t("onModeration")}
            </span>

            {editingId === review.id ? (
              <div className="mt-3 space-y-3">
                <div>
                  <Label>{t("quote")}</Label>
                  <Textarea value={quote} onChange={(e) => setQuote(e.target.value)} />
                </div>
                <div>
                  <Label>{t("role")}</Label>
                  <Input value={role} onChange={(e) => setRole(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => save(review.id)} disabled={saving}>
                    {saving ? t("submitting") : t("saveEdit")}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    {t("cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-3 whitespace-pre-line text-sm text-foreground/80">
                  {review.quote}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{review.authorRole}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => startEdit(review)}
                >
                  {t("edit")}
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
