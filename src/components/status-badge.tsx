import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/generated/prisma/enums";

const STYLES: Record<ApplicationStatus, string> = {
  NEW: "border-primary/30 bg-primary/10 text-primary",
  IN_PROGRESS: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  DONE: "border-teal/30 bg-teal/10 text-teal",
  REJECTED: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function StatusBadge({
  status,
  label,
  hint,
}: {
  status: ApplicationStatus;
  label: string;
  hint?: string;
}) {
  return (
    <span
      title={hint}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        hint && "cursor-help",
        STYLES[status],
      )}
    >
      {label}
    </span>
  );
}
