// Сид-скрипт для базы данных PixelWave Web.
//
// ВНИМАНИЕ: все данные ниже — синтетические, специально сгенерированные для
// демонстрации функциональности веб-представительства.
// Реальных клиентов, проектов, переписки и персональных данных в наборе нет.
// Имена, email, телефоны, названия компаний и любые иные сведения — вымышленные.
//
// Запуск: pnpm db:seed
// Сид идемпотентен: повторный запуск не создаёт дубликатов (используются upsert
// по уникальным slug/email).

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { UserRole, ApplicationStatus, BudgetRange } from "../src/generated/prisma/enums";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in environment");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main(): Promise<void> {
  console.log("Сидинг тестовых данных PixelWave Web...");




  const admin = await prisma.user.upsert({
    where: { email: "admin@pixelwave.test" },
    update: {},
    create: {
      email: "admin@pixelwave.test",
      passwordHash: await hash("admin123"),
      name: "Администратор Иванов",
      role: UserRole.ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@pixelwave.test" },
    update: {},
    create: {
      email: "manager@pixelwave.test",
      passwordHash: await hash("manager123"),
      name: "Менеджер Петрова",
      role: UserRole.MANAGER,
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "client@pixelwave.test" },
    update: {},
    create: {
      email: "client@pixelwave.test",
      passwordHash: await hash("client123"),
      name: "Клиент Сидоров",
      role: UserRole.CLIENT,
    },
  });

  console.log(`  Пользователи: ${admin.email}, ${manager.email}, ${client.email}`);


  

  const services = [
    {
      slug: "web-development",
      title: "Разработка веб-приложений",
      shortDescription: "Современные веб-приложения на Next.js, React и TypeScript.",
      fullDescription:
        "Полный цикл разработки: проектирование архитектуры, реализация frontend и backend, интеграция с внешними сервисами, развёртывание и сопровождение. Используем Next.js, TypeScript, PostgreSQL.",
      iconKey: "code",
      priceFrom: 500000,
      order: 1,
    },
    {
      slug: "mobile-development",
      title: "Разработка мобильных приложений",
      shortDescription: "Кроссплатформенные приложения на React Native.",
      fullDescription:
        "Создание мобильных приложений для iOS и Android из единой кодовой базы. Подходит для MVP, e-commerce, корпоративных сервисов. Публикация в App Store и Google Play включена в стоимость.",
      iconKey: "smartphone",
      priceFrom: 800000,
      order: 2,
    },
    {
      slug: "ui-ux-design",
      title: "UI/UX-дизайн",
      shortDescription: "Проектирование интерфейсов от исследований до прототипов.",
      fullDescription:
        "Исследование пользователей, информационная архитектура, прототипирование в Figma, дизайн-системы, юзабилити-тестирование. Передаём дизайнерам и разработчикам готовые макеты с компонентами.",
      iconKey: "palette",
      priceFrom: 200000,
      order: 3,
    },
    {
      slug: "seo",
      title: "SEO-продвижение",
      shortDescription: "Технический аудит и контент-стратегия для роста органического трафика.",
      fullDescription:
        "Технический SEO-аудит, оптимизация скорости загрузки, проработка структуры сайта, контент-стратегия, работа со ссылочным профилем. Ежемесячные отчёты с измеримыми метриками.",
      iconKey: "trending-up",
      priceFrom: 80000,
      order: 4,
    },
    {
      slug: "ads",
      title: "Контекстная реклама",
      shortDescription: "Запуск и сопровождение рекламных кампаний в Google Ads и Яндекс.Директ.",
      fullDescription:
        "Анализ ниши, подбор семантики, создание объявлений, A/B-тестирование, оптимизация ставок и аудиторий. Прозрачная отчётность с фокусом на стоимость целевого действия.",
      iconKey: "megaphone",
      priceFrom: 50000,
      order: 5,
    },
    {
      slug: "support",
      title: "Техническая поддержка",
      shortDescription: "Мониторинг, обновления, инциденты и развитие готовых веб-проектов.",
      fullDescription:
        "Круглосуточный мониторинг, регулярные обновления зависимостей, реакция на инциденты по SLA, плановое развитие функциональности. Подходит для уже запущенных проектов.",
      iconKey: "wrench",
      priceFrom: 30000,
      order: 6,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: { ...s, isActive: true },
    });
  }
  console.log(`  Услуг: ${services.length}`);

  const webDev = await prisma.service.findUniqueOrThrow({ where: { slug: "web-development" } });
  const seo = await prisma.service.findUniqueOrThrow({ where: { slug: "seo" } });
  const uiux = await prisma.service.findUniqueOrThrow({ where: { slug: "ui-ux-design" } });
  const support = await prisma.service.findUniqueOrThrow({ where: { slug: "support" } });




  const portfolio = [
    {
      slug: "severnyy-put",
      title: "Интернет-магазин «Северный путь»",
      summary: "B2C-маркетплейс товаров для активного отдыха с интеграцией платежей и логистики.",
      description:
        "Разработали интернет-магазин с каталогом из 12 000 SKU, корзиной, многоэтапным оформлением заказа, интеграцией с эквайрингом и службами доставки. Реализована аналитика воронки продаж и админ-панель управления заказами.",
      clientName: "ООО «Северный путь»",
      projectUrl: null,
      technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Vercel"],
      completedAt: new Date("2025-09-15"),
      order: 1,
    },
    {
      slug: "arktiktech",
      title: "Корпоративный сайт «АрктикТех»",
      summary: "Сайт-визитка производственной компании с многоязычным каталогом продукции.",
      description:
        "Создали сайт с русским и английским интерфейсом, каталогом продукции на 80 позиций, формой запроса коммерческого предложения. Контент управляется через headless-CMS, что позволило отделу маркетинга обновлять страницы без участия разработчиков.",
      clientName: "АО «АрктикТех»",
      projectUrl: null,
      technologies: ["Astro", "Sanity CMS", "Tailwind CSS", "Vercel"],
      completedAt: new Date("2024-11-30"),
      order: 2,
    },
    {
      slug: "gocity",
      title: "Мобильное приложение «GoCity»",
      summary: "Городское приложение для оплаты транспорта, поиска парковок и муниципальных услуг.",
      description:
        "Разработали приложение для iOS и Android, обслуживающее ~50 000 активных пользователей. Реализованы оплата проезда по QR, поиск парковочных мест, push-уведомления о городских событиях, обратная связь с муниципалитетом.",
      clientName: "Городская администрация",
      projectUrl: null,
      technologies: ["React Native", "Expo", "Supabase", "Firebase Cloud Messaging"],
      completedAt: new Date("2025-04-20"),
      order: 3,
    },
  ];

  for (const p of portfolio) {
    await prisma.portfolioItem.upsert({
      where: { slug: p.slug },
      update: p,
      create: { ...p, isPublished: true },
    });
  }
  console.log(`  Кейсов портфолио: ${portfolio.length}`);


  

  const posts = [
    {
      slug: "delivery-in-6-weeks",
      title: "Как мы делаем веб-приложения за 6 недель",
      excerpt:
        "Рассказываем о методологии, инструментах и контрольных точках, которые позволяют запускать MVP за полтора месяца без потери качества.",
      content:
        "## Введение\n\nКлассический срок разработки MVP — 3–4 месяца. Мы умеем укладываться в 6 недель за счёт жёсткого scope-менеджмента, библиотеки готовых компонентов и автоматизации развёртывания...\n\n## Контрольные точки\n\n1. Неделя 1: исследования и прототип\n2. Неделя 2–3: схема БД и API\n3. Неделя 4–5: UI и интеграции\n4. Неделя 6: тестирование и запуск",
      tags: ["методология", "MVP", "управление проектами"],
      publishedAt: new Date("2026-03-10"),
    },
    {
      slug: "5-mistakes-choosing-contractor",
      title: "5 ошибок при выборе подрядчика на разработку",
      excerpt:
        "Что проверить перед подписанием договора, чтобы не получить незавершённый продукт и переплату.",
      content:
        "## 1. Отсутствие чёткого ТЗ\n\nЕсли подрядчик готов начать без подробного брифа — это красный флаг.\n\n## 2. Фиксированная цена без фиксированного объёма\n\n## 3. Отсутствие промежуточных демо\n\n## 4. Закрытый исходный код\n\n## 5. Отсутствие документации",
      tags: ["заказ разработки", "договор", "управление рисками"],
      publishedAt: new Date("2026-04-05"),
    },
    {
      slug: "headless-cms-vs-wordpress-2026",
      title: "Headless CMS vs WordPress: что выбрать в 2026",
      excerpt:
        "Сравниваем подходы по производительности, стоимости владения и удобству редактирования контента.",
      content:
        "В 2026 году выбор CMS уже не сводится к «брать WordPress по умолчанию». Headless-решения (Sanity, Strapi, Payload) выигрывают по скорости и масштабируемости...",
      tags: ["CMS", "архитектура", "сравнение"],
      publishedAt: new Date("2026-05-01"),
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: { ...post, authorId: admin.id },
    });
  }
  console.log(`  Публикаций блога: ${posts.length}`);




  // Чистим заявки и историю перед перезаливом — иначе при повторных запусках
  // будут множиться записи (заявки не имеют natural unique ключа).
  await prisma.applicationStatusChange.deleteMany();
  await prisma.application.deleteMany();

  // Заявка 1: анонимная, новая
  await prisma.application.create({
    data: {
      name: "Пётр Сидоренко",
      email: "petr.sidorenko@example.com",
      phone: "+7 900 100-20-30",
      company: "ИП Сидоренко",
      message: "Нужен лендинг под рекламную кампанию. Срок 3 недели.",
      budgetRange: BudgetRange.FROM_100K_TO_500K,
      status: ApplicationStatus.NEW,
      serviceId: uiux.id,
    },
  });

  // Заявка 2: от зарегистрированного клиента, в работе, с историей
  await prisma.application.create({
    data: {
      name: client.name ?? "Клиент Сидоров",
      email: client.email,
      phone: "+7 911 200-30-40",
      company: "ООО «Дельта Лаб»",
      message: "Заинтересованы в разработке корпоративного портала с личным кабинетом сотрудника.",
      budgetRange: BudgetRange.FROM_500K_TO_1M,
      status: ApplicationStatus.IN_PROGRESS,
      managerComment: "Связался, ждём бриф. Назначен звонок на следующую неделю.",
      userId: client.id,
      serviceId: webDev.id,
      assignedManagerId: manager.id,
      statusHistory: {
        create: [
          {
            fromStatus: null,
            toStatus: ApplicationStatus.NEW,
            changedById: manager.id,
            comment: "Заявка зарегистрирована автоматически.",
            changedAt: new Date("2026-05-15T10:30:00Z"),
          },
          {
            fromStatus: ApplicationStatus.NEW,
            toStatus: ApplicationStatus.IN_PROGRESS,
            changedById: manager.id,
            comment: "Связался с клиентом, договорились о созвоне.",
            changedAt: new Date("2026-05-16T14:15:00Z"),
          },
        ],
      },
    },
  });

  // Заявка 3: от того же клиента, выполнена (полный цикл NEW → IN_PROGRESS → DONE)
  await prisma.application.create({
    data: {
      name: client.name ?? "Клиент Сидоров",
      email: client.email,
      message: "Нужен SEO-аудит существующего сайта и план продвижения на 3 месяца.",
      budgetRange: BudgetRange.UNDER_100K,
      status: ApplicationStatus.DONE,
      managerComment: "Аудит выполнен, отчёт отправлен на email. Клиент перешёл на абонентское обслуживание.",
      userId: client.id,
      serviceId: seo.id,
      assignedManagerId: manager.id,
      statusHistory: {
        create: [
          {
            fromStatus: null,
            toStatus: ApplicationStatus.NEW,
            changedById: manager.id,
            changedAt: new Date("2026-04-10T09:00:00Z"),
          },
          {
            fromStatus: ApplicationStatus.NEW,
            toStatus: ApplicationStatus.IN_PROGRESS,
            changedById: manager.id,
            comment: "Начали аудит.",
            changedAt: new Date("2026-04-11T11:30:00Z"),
          },
          {
            fromStatus: ApplicationStatus.IN_PROGRESS,
            toStatus: ApplicationStatus.DONE,
            changedById: manager.id,
            comment: "Отчёт по аудиту отправлен.",
            changedAt: new Date("2026-04-25T16:00:00Z"),
          },
        ],
      },
    },
  });

  // Заявка 4: анонимная, новая, тех. поддержка
  await prisma.application.create({
    data: {
      name: "Анна Морозова",
      email: "a.morozova@example.com",
      phone: "+7 921 555-44-33",
      company: "Студия «Лес»",
      message:
        "Наш сайт работает на старом WordPress 5.x, периодически падает. Нужна техподдержка и план перехода на современный стек.",
      budgetRange: BudgetRange.UNDER_100K,
      status: ApplicationStatus.NEW,
      serviceId: support.id,
    },
  });

  // Заявка 5: отклонённая (не профильная), с историей
  await prisma.application.create({
    data: {
      name: "Игорь Кузнецов",
      email: "i.kuznetsov@example.com",
      message: "Нужна разработка десктопного бухгалтерского ПО под Windows.",
      status: ApplicationStatus.REJECTED,
      managerComment: "Не наш профиль (десктоп, бухучёт). Передал контакт партнёру.",
      assignedManagerId: manager.id,
      statusHistory: {
        create: [
          {
            fromStatus: null,
            toStatus: ApplicationStatus.NEW,
            changedById: manager.id,
            changedAt: new Date("2026-05-20T13:00:00Z"),
          },
          {
            fromStatus: ApplicationStatus.NEW,
            toStatus: ApplicationStatus.REJECTED,
            changedById: manager.id,
            comment: "Не профильная задача.",
            changedAt: new Date("2026-05-20T13:45:00Z"),
          },
        ],
      },
    },
  });

  const total = await prisma.application.count();
  console.log(`  Заявок: ${total}`);

  console.log("Готово.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
