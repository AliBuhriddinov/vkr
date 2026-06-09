"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole, requireUser } from "@/lib/auth";
import { testimonialSchema } from "@/lib/validations/testimonial";

type Result = { ok: true } | { ok: false; error: string };

function parse(v: Record<string, unknown>) {
  return {
    quote: String(v.quote ?? "").trim(),
    authorName: String(v.authorName ?? "").trim(),
    authorRole: String(v.authorRole ?? "").trim(),
    order: Number(v.order ?? 0) || 0,
    isPublished: v.isPublished === true || v.isPublished === "on",
  };
}

// Отзывы видны на главной (обе локали) — обновляем список в админке и главные страницы.
function revalidate(locale: string) {
  revalidatePath(`/${locale}/admin/testimonials`);
  revalidatePath(`/${locale}/cabinet`);
  revalidatePath("/ru");
  revalidatePath("/en");
}

// Любое действие админа над отзывом считаем просмотром — иначе при возврате
// в «на модерации» (снятие с карусели) он снова помечался бы как новый.
async function markSeenByAdmin(userId: string, id: string): Promise<void> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { seenTestimonialIds: true },
  });
  if (u && !u.seenTestimonialIds.includes(id)) {
    await prisma.user.update({
      where: { id: userId },
      data: { seenTestimonialIds: { push: id } },
    });
  }
}

// Админ добавляет отзыв вручную (сразу опубликован, если отмечено).
export async function createTestimonial(
  locale: string,
  values: Record<string, unknown>,
): Promise<Result> {
  const user = await requireRole(locale, ["ADMIN"]);
  const parsed = testimonialSchema.safeParse(parse(values));
  if (!parsed.success) return { ok: false, error: "invalid" };
  const created = await prisma.testimonial.create({
    data: parsed.data,
    select: { id: true },
  });
  await markSeenByAdmin(user.id, created.id);
  revalidate(locale);
  return { ok: true };
}

// Клиент оставляет отзыв из кабинета — сохраняется на модерацию (не опубликован).
// Имя берём из сессии, а не из формы — нельзя выдать себя за другого.
export async function submitReview(
  locale: string,
  values: Record<string, unknown>,
): Promise<Result> {
  const user = await requireUser(locale);
  const data = {
    quote: String(values.quote ?? "").trim(),
    authorName: user.name ?? user.email ?? "",
    authorRole: String(values.authorRole ?? "").trim(),
    order: 0,
    isPublished: false,
  };
  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "invalid" };
  await prisma.testimonial.create({ data: { ...parsed.data, userId: user.id } });
  revalidate(locale);
  return { ok: true };
}

// Клиент редактирует свой отзыв — он снова уходит на модерацию.
export async function updateReview(
  locale: string,
  id: string,
  values: Record<string, unknown>,
): Promise<Result> {
  const user = await requireUser(locale);
  const existing = await prisma.testimonial.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing || existing.userId !== user.id) return { ok: false, error: "invalid" };

  const quote = String(values.quote ?? "").trim();
  const authorRole = String(values.authorRole ?? "").trim();
  if (!quote || !authorRole) return { ok: false, error: "required" };

  await prisma.testimonial.update({
    where: { id },
    data: { quote, authorRole, isPublished: false, order: 0 },
  });
  revalidate(locale);
  return { ok: true };
}

// Админ отмечает/снимает отзыв для карусели.
export async function toggleTestimonial(
  locale: string,
  id: string,
): Promise<void> {
  const user = await requireRole(locale, ["ADMIN"]);
  const current = await prisma.testimonial.findUnique({
    where: { id },
    select: { isPublished: true },
  });
  if (!current) return;
  await prisma.testimonial.update({
    where: { id },
    data: { isPublished: !current.isPublished },
  });
  await markSeenByAdmin(user.id, id);
  revalidate(locale);
}

export async function deleteTestimonial(
  locale: string,
  id: string,
): Promise<void> {
  await requireRole(locale, ["ADMIN"]);
  await prisma.testimonial.delete({ where: { id } });
  // Перенумеровываем только опубликованные — у них есть позиция в карусели;
  // отзывы на модерации (order 0) не трогаем.
  const rest = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    select: { id: true },
  });
  await prisma.$transaction(
    rest.map((row, i) =>
      prisma.testimonial.update({
        where: { id: row.id },
        data: { order: i + 1 },
      }),
    ),
  );
  revalidate(locale);
}
