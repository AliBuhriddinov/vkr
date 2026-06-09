"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

type Result = { ok: true } | { ok: false; error: string };

export async function updateName(locale: string, name: string): Promise<Result> {
  const user = await requireUser(locale);
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 100) return { ok: false, error: "name_invalid" };
  await prisma.user.update({ where: { id: user.id }, data: { name: trimmed } });
  revalidatePath(`/${locale}/cabinet`);
  return { ok: true };
}

export async function updatePassword(
  locale: string,
  currentPassword: string,
  newPassword: string,
): Promise<Result> {
  const user = await requireUser(locale);
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });
  if (!dbUser) return { ok: false, error: "server" };

  const matches = await bcrypt.compare(currentPassword, dbUser.passwordHash);
  if (!matches) return { ok: false, error: "wrong_password" };

  if (newPassword.length < 8 || new TextEncoder().encode(newPassword).length > 72) {
    return { ok: false, error: "password_invalid" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  return { ok: true };
}
