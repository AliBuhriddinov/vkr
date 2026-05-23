# ER-диаграмма базы данных

Источник истины — `prisma/schema.prisma`. Диаграмма в формате Mermaid отображается на GitHub автоматически.

## Состав сущностей

| Сущность | Назначение |
|---|---|
| **User** | Пользователь системы (клиент, менеджер, администратор). Уникальный email, хеш пароля, роль. |
| **Service** | Услуга в каталоге веб-представительства. Уникальный slug, заголовок, краткое и полное описание, опциональная цена «от X», порядок отображения, признак активности. |
| **Application** | Клиентская заявка. Может быть отправлена анонимно (`userId = null`) или из личного кабинета. Привязка к конкретной услуге опциональна. Поле `status` — текущий статус, `statusHistory` — полная история смены. |
| **ApplicationStatusChange** | Запись истории смены статуса заявки. Фиксирует, кто и когда изменил статус, с каким комментарием. |
| **PortfolioItem** | Кейс портфолио. Содержит описание реализованного проекта, технологии, ссылку на проект (опционально). |
| **BlogPost** | Публикация блога. Markdown-контент, теги, дата публикации (null = черновик), автор. |

## Перечисления

- **UserRole** — `CLIENT`, `MANAGER`, `ADMIN`.
- **ApplicationStatus** — `NEW`, `IN_PROGRESS`, `DONE`, `REJECTED`. Жизненный цикл: `NEW → IN_PROGRESS → {DONE, REJECTED}`.
- **BudgetRange** — `UNDER_100K`, `FROM_100K_TO_500K`, `FROM_500K_TO_1M`, `OVER_1M`.

## Связи

| Связь | Тип | Поведение при удалении |
|---|---|---|
| `User` → `Application` (клиент) | 1 : N | `SetNull` (заявка остаётся как анонимная) |
| `User` → `Application` (менеджер) | 1 : N | `SetNull` (заявка остаётся без назначенного менеджера) |
| `User` → `ApplicationStatusChange` (изменил) | 1 : N | `Restrict` (нельзя удалить пользователя с историей изменений) |
| `User` → `BlogPost` (автор) | 1 : N | `Restrict` (нельзя удалить автора публикации) |
| `Service` → `Application` | 1 : N | `SetNull` (заявка переживает удаление услуги) |
| `Application` → `ApplicationStatusChange` | 1 : N | `Cascade` (история удаляется вместе с заявкой) |

## Диаграмма

```mermaid
erDiagram
    User ||--o{ Application : "клиент"
    User ||--o{ Application : "менеджер"
    User ||--o{ ApplicationStatusChange : "изменил"
    User ||--o{ BlogPost : "автор"
    Service ||--o{ Application : "услуга"
    Application ||--o{ ApplicationStatusChange : "история"

    User {
        string id PK
        string email UK
        string passwordHash
        string name
        UserRole role
        DateTime createdAt
        DateTime updatedAt
    }

    Service {
        string id PK
        string slug UK
        string title
        string shortDescription
        string fullDescription
        string iconKey
        int priceFrom
        int order
        boolean isActive
        DateTime createdAt
        DateTime updatedAt
    }

    Application {
        string id PK
        string name
        string email
        string phone
        string company
        string message
        BudgetRange budgetRange
        ApplicationStatus status
        string managerComment
        string userId FK
        string serviceId FK
        string assignedManagerId FK
        DateTime createdAt
        DateTime updatedAt
    }

    ApplicationStatusChange {
        string id PK
        string applicationId FK
        ApplicationStatus fromStatus
        ApplicationStatus toStatus
        string changedById FK
        string comment
        DateTime changedAt
    }

    PortfolioItem {
        string id PK
        string slug UK
        string title
        string summary
        string description
        string coverImageUrl
        string clientName
        string projectUrl
        string_array technologies
        DateTime completedAt
        int order
        boolean isPublished
        DateTime createdAt
        DateTime updatedAt
    }

    BlogPost {
        string id PK
        string slug UK
        string title
        string excerpt
        string content
        string coverImageUrl
        string_array tags
        DateTime publishedAt
        string authorId FK
        DateTime createdAt
        DateTime updatedAt
    }
```

## Индексы

| Таблица | Индекс | Назначение |
|---|---|---|
| `User` | `(role)` | Быстрый отбор пользователей по роли (для админки) |
| `Service` | `(isActive, order)` | Сортированный список активных услуг для каталога |
| `Application` | `(status, createdAt)` | Сортированный список заявок по статусу для админки |
| `Application` | `(userId)` | Заявки конкретного клиента в его кабинете |
| `Application` | `(assignedManagerId)` | Заявки конкретного менеджера |
| `ApplicationStatusChange` | `(applicationId, changedAt)` | История заявки в хронологическом порядке |
| `PortfolioItem` | `(isPublished, order)` | Сортированный список опубликованных кейсов |
| `BlogPost` | `(publishedAt)` | Сортировка по дате публикации |
| `BlogPost` | `(authorId)` | Список публикаций автора |
