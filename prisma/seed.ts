// Сид-скрипт для базы данных PixelWave Web.
//
// Все данные ниже — синтетические, для демонстрации функциональности.
// Реальных клиентов, переписки и персональных данных в наборе нет.
//
// Запуск: pnpm db:seed
// Сид идемпотентен: повторный запуск не плодит дубликаты — upsert по slug/email,
// а заявки и отзывы пересоздаются через deleteMany + create.

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { UserRole, ApplicationStatus, BudgetRange } from "../src/generated/prisma/enums";
import blogContent from "./blog-content.json";

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
    update: { seenApplicationIds: [], seenTestimonialIds: [] },
    create: {
      email: "admin@pixelwave.test",
      passwordHash: await hash("admin123"),
      name: "Администратор Иванов",
      role: UserRole.ADMIN,
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

  console.log(`  Пользователи: ${admin.email}, ${client.email}`);

  
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

  const servicesEn: Record<
    string,
    { titleEn: string; shortDescriptionEn: string; fullDescriptionEn: string }
  > = {
    "web-development": {
      titleEn: "Web Application Development",
      shortDescriptionEn:
        "Modern web applications built with Next.js, React, and TypeScript.",
      fullDescriptionEn:
        "Full-cycle development: architecture design, frontend and backend implementation, integration with third-party services, deployment, and ongoing maintenance. We work with Next.js, TypeScript, and PostgreSQL.",
    },
    "mobile-development": {
      titleEn: "Mobile App Development",
      shortDescriptionEn: "Cross-platform apps built with React Native.",
      fullDescriptionEn:
        "Building mobile apps for iOS and Android from a single codebase. A great fit for MVPs, e-commerce, and corporate services. Publishing to the App Store and Google Play is included in the price.",
    },
    "ui-ux-design": {
      titleEn: "UI/UX Design",
      shortDescriptionEn: "Interface design from research to prototypes.",
      fullDescriptionEn:
        "User research, information architecture, prototyping in Figma, design systems, and usability testing. We hand off ready-to-use, component-based mockups to designers and developers.",
    },
    seo: {
      titleEn: "SEO",
      shortDescriptionEn:
        "Technical audits and content strategy to grow organic traffic.",
      fullDescriptionEn:
        "Technical SEO audits, page speed optimization, site structure refinement, content strategy, and link profile management. Monthly reports with measurable metrics.",
    },
    ads: {
      titleEn: "Paid Search Advertising",
      shortDescriptionEn:
        "Launch and management of ad campaigns on Google Ads and Yandex Direct.",
      fullDescriptionEn:
        "Market analysis, keyword research, ad creation, A/B testing, and optimization of bids and audiences. Transparent reporting focused on cost per conversion.",
    },
    support: {
      titleEn: "Technical Support",
      shortDescriptionEn:
        "Monitoring, updates, incident response, and ongoing development of existing web projects.",
      fullDescriptionEn:
        "Around-the-clock monitoring, regular dependency updates, SLA-based incident response, and planned feature development. Ideal for projects that are already live.",
    },
  };
  for (const s of services) {
    const data = { ...s, ...servicesEn[s.slug] };
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: data,
      create: { ...data, isActive: true },
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

  const portfolioEn: Record<
    string,
    { titleEn: string; summaryEn: string; descriptionEn: string; clientNameEn: string }
  > = {
    "severnyy-put": {
      titleEn: "Severny Put Online Store",
      summaryEn:
        "A B2C marketplace for outdoor gear with integrated payments and logistics.",
      descriptionEn:
        "We built an online store with a catalog of 12,000 SKU, a shopping cart, multi-step checkout, and integrations with payment acquiring and delivery services. We implemented sales-funnel analytics and an admin panel for order management.",
      clientNameEn: "Severny Put LLC",
    },
    arktiktech: {
      titleEn: "ArkticTech Corporate Website",
      summaryEn:
        "A company website for a manufacturer with a multilingual product catalog.",
      descriptionEn:
        "We created a website with a Russian and English interface, a product catalog of 80 items, and a quote request form. Content is managed through a headless CMS, allowing the marketing team to update pages without involving developers.",
      clientNameEn: "ArkticTech JSC",
    },
    gocity: {
      titleEn: "GoCity Mobile App",
      summaryEn:
        "A city app for paying for transit, finding parking, and accessing municipal services.",
      descriptionEn:
        "We developed an app for iOS and Android serving ~50,000 active users. We implemented QR-based fare payment, parking-spot search, push notifications about city events, and a feedback channel with the municipality.",
      clientNameEn: "City Administration",
    },
  };
  for (const p of portfolio) {
    const data = { ...p, ...portfolioEn[p.slug] };
    await prisma.portfolioItem.upsert({
      where: { slug: p.slug },
      update: data,
      create: { ...data, isPublished: true },
    });
  }
  console.log(`  Кейсов портфолио: ${portfolio.length}`);

  
  const blogDates: Record<string, Date> = {
    "delivery-in-6-weeks": new Date("2026-03-10"),
    "5-mistakes-choosing-contractor": new Date("2026-04-05"),
    "headless-cms-vs-wordpress-2026": new Date("2026-05-01"),
    "website-cost-breakdown": new Date("2026-05-20"),
    "why-client-portal": new Date("2026-06-02"),
  };
  for (const article of blogContent) {
    const data = {
      slug: article.slug,
      title: article.titleRu,
      titleEn: article.titleEn,
      excerpt: article.excerptRu,
      excerptEn: article.excerptEn,
      content: article.contentRu,
      contentEn: article.contentEn,
      tags: article.tags,
      publishedAt: blogDates[article.slug] ?? null,
    };
    await prisma.blogPost.upsert({
      where: { slug: article.slug },
      update: data,
      create: { ...data, authorId: admin.id },
    });
  }
  console.log(`  Публикаций блога: ${blogContent.length}`);

  await prisma.testimonial.deleteMany();
  const testimonials = [
    {
      quote:
        "Команда PixelWave перезапустила наш интернет-магазин и за квартал конверсия выросла на 38%. Работали прозрачно, в срок.",
      authorName: "Елена Воронцова",
      authorRole: "Директор по маркетингу, «Северный путь»",
      order: 1,
    },
    {
      quote:
        "Сделали корпоративный портал с личным кабинетом. Отдельно отмечу качество кода и документации — поддерживать легко.",
      authorName: "Дмитрий Лазарев",
      authorRole: "CTO, «Дельта Лаб»",
      order: 2,
    },
    {
      quote:
        "Запустили мобильное приложение за полтора месяца. Команда держала сроки и предлагала решения, а не просто выполняла задачи.",
      authorName: "Марина Котова",
      authorRole: "Продакт-менеджер, «GoCity»",
      order: 3,
    },
    {
      quote:
        "Перевели сайт на современный стек и настроили аналитику. Скорость загрузки выросла вдвое, заявок стало заметно больше.",
      authorName: "Артём Белов",
      authorRole: "Основатель, студия «Лес»",
      order: 4,
    },
  ];
  const testimonialsEn: Record<
    number,
    { quoteEn: string; authorNameEn: string; authorRoleEn: string }
  > = {
    1: {
      authorNameEn: "Elena Vorontsova",
      authorRoleEn: "Marketing Director, Severny Put",
      quoteEn:
        "The PixelWave team relaunched our online store, and within a quarter our conversion rate grew by 38%. They worked transparently and on time.",
    },
    2: {
      authorNameEn: "Dmitry Lazarev",
      authorRoleEn: "CTO, Delta Lab",
      quoteEn:
        "They built us a corporate portal with a client area. I'd especially highlight the quality of the code and documentation — it's easy to maintain.",
    },
    3: {
      authorNameEn: "Marina Kotova",
      authorRoleEn: "Product Manager, GoCity",
      quoteEn:
        "They launched our mobile app in six weeks. The team kept to the schedule and proposed solutions rather than just ticking off tasks.",
    },
    4: {
      authorNameEn: "Artem Belov",
      authorRoleEn: "Founder, Les Studio",
      quoteEn:
        "They moved our site to a modern stack and set up analytics. Load speed doubled, and we're getting noticeably more leads.",
    },
  };
  for (const item of testimonials) {
    await prisma.testimonial.create({
      data: { ...item, ...testimonialsEn[item.order] },
    });
  }
  console.log(`  Отзывов: ${testimonials.length}`);


  // Чистим заявки и историю перед перезаливом — иначе при повторных запусках
  // будут множиться записи (заявки не имеют natural unique ключа).
  await prisma.applicationStatusChange.deleteMany();
  await prisma.application.deleteMany();
  // Роль менеджера упразднена — заявки ведёт администратор.
  await prisma.user.deleteMany({ where: { email: "manager@pixelwave.test" } });

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
      assignedManagerId: admin.id,
      statusHistory: {
        create: [
          {
            fromStatus: null,
            toStatus: ApplicationStatus.NEW,
            changedById: admin.id,
            comment: "Заявка зарегистрирована автоматически.",
            changedAt: new Date("2026-05-15T10:30:00Z"),
          },
          {
            fromStatus: ApplicationStatus.NEW,
            toStatus: ApplicationStatus.IN_PROGRESS,
            changedById: admin.id,
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
      assignedManagerId: admin.id,
      statusHistory: {
        create: [
          {
            fromStatus: null,
            toStatus: ApplicationStatus.NEW,
            changedById: admin.id,
            changedAt: new Date("2026-04-10T09:00:00Z"),
          },
          {
            fromStatus: ApplicationStatus.NEW,
            toStatus: ApplicationStatus.IN_PROGRESS,
            changedById: admin.id,
            comment: "Начали аудит.",
            changedAt: new Date("2026-04-11T11:30:00Z"),
          },
          {
            fromStatus: ApplicationStatus.IN_PROGRESS,
            toStatus: ApplicationStatus.DONE,
            changedById: admin.id,
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
      assignedManagerId: admin.id,
      statusHistory: {
        create: [
          {
            fromStatus: null,
            toStatus: ApplicationStatus.NEW,
            changedById: admin.id,
            changedAt: new Date("2026-05-20T13:00:00Z"),
          },
          {
            fromStatus: ApplicationStatus.NEW,
            toStatus: ApplicationStatus.REJECTED,
            changedById: admin.id,
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
