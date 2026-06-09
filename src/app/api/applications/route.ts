import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validations/application";
import { ApplicationStatus } from "@/generated/prisma/enums";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "auth_required" }, { status: 401 });
  }
  const emptyToNull = (v?: string) => (v && v.length > 0 ? v : null);

  // Привязываем услугу только если такой id реально есть в каталоге.
  let serviceId: string | null = emptyToNull(data.serviceId);
  if (serviceId) {
    const exists = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true },
    });
    if (!exists) serviceId = null;
  }

  try {
    const application = await prisma.application.create({
      data: {
        name: data.name,
        email: data.email,
        phone: emptyToNull(data.phone),
        company: emptyToNull(data.company),
        message: data.message,
        budgetRange: data.budgetRange ? data.budgetRange : null,
        serviceId,
        userId: session.user.id,
        status: ApplicationStatus.NEW,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: application.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
