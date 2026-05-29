import { z } from "zod";

export const BUDGET_RANGES = [
  "UNDER_100K",
  "FROM_100K_TO_500K",
  "FROM_500K_TO_1M",
  "OVER_1M",
] as const;

const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

export const applicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "name_min" })
    .max(100, { message: "name_max" }),
  email: z.string().trim().email({ message: "email_invalid" }),
  phone: z
    .string()
    .trim()
    .max(30, { message: "phone_max" })
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .trim()
    .max(120, { message: "company_max" })
    .optional()
    .or(z.literal("")),
  serviceId: z.string().trim().optional().or(z.literal("")),
  budgetRange: z.preprocess(
    emptyToUndefined,
    z.enum(BUDGET_RANGES).optional(),
  ),
  message: z
    .string()
    .trim()
    .min(10, { message: "message_min" })
    .max(2000, { message: "message_max" }),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
