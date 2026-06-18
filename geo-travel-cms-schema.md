# TourLink CMS — Content Model (Source of Truth)

> **Стек:** PostgreSQL + Payload CMS 3 (`@payloadcms/db-postgres`)
> **Локали:** `en`, `ru`, `uz` · default `en` · fallback → `en`
> `id`, `createdAt`, `updatedAt` есть у всех коллекций автоматически — не указаны ниже.
> Группы `seo` и `status` (раздел 7) применяются к каждой контентной коллекции, отдельно не повторяются в таблицах.

---

## 1. Текстовая конвенция

| Поле | Тип | Локализация | Обяз. | Назначение |
|---|---|---|---|---|
| `title` | text | ✓ | ✓ | Заголовок |
| `subtitle` | text | ✓ | | Короткий подзаголовок |
| `excerpt` | textarea | ✓ | | Текст карточки / meta description fallback |
| `content` | richText | ✓ | | Полный текст страницы |

---

## 2. Гео-иерархия

### `countries`

| Поле | Тип | Локализация | Обяз. | Описание |
|---|---|---|---|---|
| `slug` | text | ✓ | ✓ | unique |
| `title` / `subtitle` / `excerpt` / `content` | — | ✓ | title ✓ | |
| `mapCenter.latitude` / `.longitude` | number | | | |
| `heroImage` | upload → `media` | | | |
| `gallery` | relationship[] → `media` | | | |
| `badges` | relationship[] → `badges` | | | |
| `blocks` | blocks[] | ✓ | ✓ | `hero` \| `regular` \| `cta` \| `overviewStats` \| `contactInfo` |
| `seo`, status | group | | | |

Join (read-only): `regions`, `routes`, `experiences`

---

### `regions`

| Поле | Тип | Локализация | Обяз. | Описание |
|---|---|---|---|---|
| `slug` | text | ✓ | ✓ | |
| `title` / `subtitle` / `excerpt` / `content` | — | ✓ | title ✓ | |
| `country` | relationship → `countries` | | ✓ | |
| `mapCenter.latitude` / `.longitude` | number | | | |
| `heroImage`, `gallery`, `badges` | | | | |
| `blocks` | blocks[] | ✓ | ✓ | `hero` \| `regular` \| `cta` \| `overviewStats` \| `contactInfo` |
| `seo`, status | | | | |

Join: `cities`
Индексы: `slug`, `country`

---

### `cities`

| Поле | Тип | Локализация | Обяз. | Описание |
|---|---|---|---|---|
| `slug` | text | ✓ | ✓ | |
| `title` / `subtitle` / `excerpt` / `content` | — | ✓ | title ✓ | |
| `country` | relationship → `countries` | | ✓ | |
| `region` | relationship → `regions` | | ✓ | фильтр по `country` |
| `latitude` / `longitude` | number | | ✓ | |
| `heroImage`, `gallery`, `badges` | | | | |
| `blocks` | blocks[] | ✓ | ✓ | `hero` \| `regular` \| `cta` \| `overviewStats` \| `contactInfo` |
| `seo`, status | | | | |

Join: `attractions`, `experiences`, `relatedRoutes`

URL: `/{country}/{region}/{city}`

**Hook (`beforeValidate`):** `region.country === country`

---

### `attractions`

| Поле | Тип | Локализация | Обяз. | Описание |
|---|---|---|---|---|
| `slug` | text | ✓ | ✓ | |
| `title` / `subtitle` / `excerpt` / `content` | — | ✓ | title ✓ | |
| `country` | relationship → `countries` | | ✓ | |
| `region` | relationship → `regions` | | | |
| `city` | relationship → `cities` | | ✓ | |
| `type` | select | | | `AttractionType` |
| `importance` | select | | | `Importance` |
| `latitude` / `longitude` | number | | ✓ | |
| `themes` | relationship[] → `themes` | | | |
| `nearbyAttractions` | relationship[] → `attractions` | | | self-ref, не join |
| `heroImage`, `gallery`, `badges` | | | | |
| `blocks` | blocks[] | ✓ | ✓ | `hero` \| `regular` \| `cta` \| `overviewStats` \| `contactInfo` |
| `seo`, status | | | | |

Join: `experiences`, `relatedRoutes`

URL: `/{country}/{region}/{city}/{attraction}`

**Hook (`beforeValidate`):**
```
region.country === country
city.region === region
city.country === country
```

#### enum `AttractionType`
`LANDMARK` | `MUSEUM` | `MOSQUE` | `MADRASA` | `MAUSOLEUM` | `FORTRESS` | `PALACE` | `BAZAAR` | `PARK` | `GARDEN` | `SQUARE` | `LAKE` | `MOUNTAIN` | `VIEWPOINT` | `CULTURAL_SITE` | `NATURAL_SITE` | `RELIGIOUS_SITE`

#### enum `Importance`
`MUST_SEE` | `RECOMMENDED` | `OPTIONAL`

---

## 3. Тематический слой

### `routes`

| Поле | Тип | Локализация | Обяз. | Описание |
|---|---|---|---|---|
| `slug` | text | ✓ | ✓ | |
| `title` / `subtitle` / `excerpt` / `content` | — | ✓ | title ✓ | |
| `countries` | relationship[] → `countries` | | ✓ | |
| `cities` | relationship[] → `cities` | | | |
| `attractions` | relationship[] → `attractions` | | | |
| `experiences` | relationship[] → `experiences` | | | |
| `themes` | relationship[] → `themes` | | | |
| `durationDays` | number | | | |
| `heroImage`, `gallery`, `badges` | | | | |
| `blocks` | blocks[] | ✓ | ✓ | `hero` \| `regular` \| `cta` \| `overviewStats` \| `contactInfo` |
| `seo`, status | | | | |

Join: `mapPoints` (sort: `order`)

URL: `/routes/{routeSlug}`

---

### `map-points`

| Поле | Тип | Локализация | Обяз. | Описание |
|---|---|---|---|---|
| `route` | relationship → `routes` | | ✓ | |
| `order` | number | | ✓ | |
| `type` | select | | ✓ | `MapPointType` |
| `city` | relationship → `cities` | | | |
| `attraction` | relationship → `attractions` | | | |
| `latitude` / `longitude` | number | | ✓ | |
| `title` | text | ✓ | | |

Drafts/Versions: ✗

#### enum `MapPointType`
`CITY` | `ATTRACTION` | `OVERNIGHT` | `BORDER` | `AIRPORT` | `WAYPOINT`

---

## 4. Experience-слой

### `themes`

| Поле | Тип | Локализация | Обяз. | Описание |
|---|---|---|---|---|
| `slug` | text | ✓ | ✓ | |
| `title` | text | ✓ | ✓ | |
| `icon` | text | | | string key |
| `description` | textarea | ✓ | | |
| `blocks` | blocks[] | ✓ | ✓ | `hero` \| `regular` \| `cta` \| `overviewStats` \| `contactInfo` |
| `seo` | group | | | |

Join: `routes`, `experiences`, `attractions`

URL: `/themes/{themeSlug}` — единственный canonical URL темы.

**Рендер `/themes/{slug}`:** секции `Experiences` / `Routes` / `Attractions` (каждая показывается только если непуста).

**Рендер `/experiences`:** индекс всех Experience; фильтр-чипы = `themes`, у которых join `experiences` не пуст (`?theme={slug}` — query-параметр, не отдельный canonical URL).

---

### `experiences`

| Поле | Тип | Локализация | Обяз. | Описание |
|---|---|---|---|---|
| `slug` | text | ✓ | ✓ | |
| `title` / `subtitle` / `excerpt` / `content` | — | ✓ | title ✓ | |
| `type` | select | | | `ExperienceType` |
| `themes` | relationship[] → `themes` | | | |
| `country` | relationship → `countries` | | ✓ | |
| `region` | relationship → `regions` | | | |
| `city` | relationship → `cities` | | | |
| `attraction` | relationship → `attractions` | | | |
| `duration` | text | | | напр. `"2 hours"` |
| `heroImage`, `gallery`, `badges` | | | | |
| `blocks` | blocks[] | ✓ | ✓ | `hero` \| `regular` \| `cta` \| `overviewStats` \| `contactInfo` |
| `seo`, status | | | | |

Join: `relatedRoutes`

URL: `/experiences/{experienceSlug}`

**Hook (`beforeValidate`):**
```
region.country === country
city.region === region
city.country === country
attraction.city === city (если указан attraction)
```

#### enum `ExperienceType`
`WORKSHOP` | `MASTERCLASS` | `TASTING` | `GUIDED_TOUR` | `FOOD_EXPERIENCE` | `CULTURAL_EVENT` | `PERFORMANCE` | `OUTDOOR_ACTIVITY` | `ADVENTURE_ACTIVITY` | `WELLNESS_ACTIVITY` | `STAY_EXPERIENCE`

---

## 5. Контент

### `journal-entries`

| Поле | Тип | Локализация | Обяз. | Описание |
|---|---|---|---|---|
| `slug` | text | ✓ | ✓ | |
| `title` / `subtitle` / `excerpt` / `content` | — | ✓ | title ✓ | |
| `coverImage` | upload → `media` | | | |
| `tags` | array of text | | | |
| `badges` | relationship[] → `badges` | | | |
| `relatedCountries` | relationship[] → `countries` | | | |
| `relatedCities` | relationship[] → `cities` | | | |
| `relatedRoutes` | relationship[] → `routes` | | | |
| `blocks` | blocks[] | ✓ | ✓ | `hero` \| `regular` \| `cta` \| `overviewStats` \| `contactInfo` |
| `seo`, status | | | | |

URL: `/journal/{slug}`

---

### `trade-fairs`

| Поле | Тип | Локализация | Обяз. | Описание |
|---|---|---|---|---|
| `slug` | text | ✓ | ✓ | |
| `title` / `excerpt` / `content` | — | ✓ | title ✓ | |
| `startDate` / `endDate` | date | | | |
| `cityRelation` | relationship → `cities` | | | опционально |
| `cityName` | text | ✓ | | |
| `countryName` | text | ✓ | | |
| `website` | text | | | |
| `gallery`, `badges` | | | | |
| `blocks` | blocks[] | ✓ | ✓ | `hero` \| `regular` \| `cta` \| `overviewStats` \| `contactInfo` |
| `seo`, status | | | | |

URL: `/trade-fairs/{slug}`

---

### `pages`

| Поле | Тип | Локализация | Обяз. | Описание |
|---|---|---|---|---|
| `slug` | text | ✓ | ✓ | |
| `title` | text | ✓ | ✓ | |
| `seo` | group | | | |
| `blocks` | blocks[] | ✓ | ✓ | `hero` \| `regular` \| `cta` \| `overviewStats` \| `contactInfo` |
| `showInNav` | checkbox | | | |
| `navLabel` | text | ✓ | | |
| `navOrder` | number | | | |
| status | | | | |

URL: `/{pageSlug}`

---

## 6. Тэги

### `badges`

| Поле | Тип | Локализация | Обяз. | Описание |
|---|---|---|---|---|
| `slug` | text | | ✓ | unique, не локализован |
| `title` | text | ✓ | ✓ | |
| `color` | text | | | |
| `icon` | text | | | string key |

Значения: `UNESCO`, `TOP_PICK`, `MUST_SEE`, `EDITOR_CHOICE`, `POPULAR`, `HIDDEN_GEM`, `NEW`, `TRENDING`, `FEATURED`

---

## 7. Переиспользуемые группы

### `seo`

| Поле | Тип | Локализация |
|---|---|---|
| `metaTitle` | text | ✓ |
| `metaDescription` | textarea | ✓ |
| `canonicalOverride` | text | |
| `ogTitle` | text | ✓ |
| `ogDescription` | textarea | ✓ |
| `ogImage` | upload → `media` | |
| `robotsNoindex` | checkbox | |
| `structuredDataType` | select | `WebPage` \| `TouristDestination` \| `TouristAttraction` \| `TouristTrip` \| `Article` |

### `status`

| Поле | Тип | Default |
|---|---|---|
| `_status` | `draft` \| `published` | — |
| `noindex` | checkbox | false |
| `hideFromNavigation` | checkbox | false |
| `showInSitemap` | checkbox | true |
| `publishedAt` | date | |

Access: публичное чтение только `published`.

---

## 8. Join Fields

| Коллекция | Join-поле | Источник |
|---|---|---|
| `countries` | `regions` | `regions.country` |
| `countries` | `routes` | `routes.countries[]` |
| `countries` | `experiences` | `experiences.country` |
| `regions` | `cities` | `cities.region` |
| `cities` | `attractions` | `attractions.city` |
| `cities` | `experiences` | `experiences.city` |
| `cities` | `relatedRoutes` | `routes.cities[]` |
| `attractions` | `experiences` | `experiences.attraction` |
| `attractions` | `relatedRoutes` | `routes.attractions[]` |
| `experiences` | `relatedRoutes` | `routes.experiences[]` |
| `themes` | `routes` | `routes.themes[]` |
| `themes` | `experiences` | `experiences.themes[]` |
| `themes` | `attractions` | `attractions.themes[]` |
| `routes` | `mapPoints` | `map-points.route` |

---

## 9. Globals

### `homepage`

| Поле | Тип | Локализация |
|---|---|---|
| `seo` | group | ✓ |
| `blocks` | blocks[] | ✓ |

Drafts/Versions: ✗

### `site-settings`

| Группа | Поле | Тип | Локализация |
|---|---|---|---|
| `contact` | `phoneDisplay` | text | |
| | `phoneE164` | text | |
| | `whatsappHref` | text | |
| | `defaultEmail` | text | |
| | `telegramNote` | text | ✓ |
| `legal` | `legalName` | text | |
| | `brandName` | text | |
| | `inn` | text | |
| | `oked` | text | |
| | `director` | text | ✓ |
| | `city` | text | ✓ |
| | `country` | text | ✓ |
| | `timezone` | text | |
| | `taxStatus` | text | ✓ |

Drafts/Versions: ✗

### `header`

| Поле | Тип | Локализация |
|---|---|---|
| `logo` | upload → `media` | |
| `navItems[]` | array `{ label, href }` | label ✓ |
| `ctaAction` | group (Action: `type`, `href`, `title`, `variant`) | title ✓ |

Drafts/Versions: ✗

### `footer`

| Поле | Тип | Локализация |
|---|---|---|
| `columns[]` | array `{ title, links: [{ label, href }] }` | title/label ✓ |
| `socialLinks[]` | array `{ platform, url }` | |
| `copyrightText` | text | ✓ |

Drafts/Versions: ✗

---

## 10. Локализация

```ts
localization: {
  locales: ['en', 'ru', 'uz'],
  defaultLocale: 'en',
  fallback: true,
}
```

Локализуется: `title`/`subtitle`/`excerpt`/`content`, `slug`, `seo.*` (кроме `canonicalOverride`), `Theme.title`/`description`, `Badge.title`, media captions, `header.navItems.label`, `footer.columns.title`/`links.label`.

Не локализуется: координаты, relationships/join, upload-ID, `Badge.icon`/`slug`.

---

## 11. URL-структура

```text
/{countrySlug}
/{countrySlug}/{regionSlug}
/{countrySlug}/{regionSlug}/{citySlug}
/{countrySlug}/{regionSlug}/{citySlug}/{attractionSlug}

/routes/{routeSlug}
/experiences
/experiences/{experienceSlug}
/themes/{themeSlug}
/journal/{slug}
/trade-fairs/{slug}
/{pageSlug}
```

`/experiences?theme={slug}` — query-фильтр, не отдельный canonical URL.

---

## 12. Бизнес-правила (hooks)

| Коллекция | Хук | Правило |
|---|---|---|
| `cities` | `beforeValidate` | `region.country === country` |
| `attractions` | `beforeValidate` | `region.country === country`; `city.region === region`; `city.country === country` |
| `experiences` | `beforeValidate` | `region.country === country`; `city.region === region`; `city.country === country`; `attraction.city === city` (если указан `attraction`) |

---

## 13. Версионирование

| Коллекция | Drafts/Versions |
|---|---|
| `countries`, `regions`, `cities`, `attractions`, `routes`, `experiences`, `themes`, `journal-entries`, `trade-fairs`, `pages` | ✓ |
| `map-points`, `media`, `badges`, `users` | ✗ |
| Globals (`homepage`, `site-settings`, `header`, `footer`) | ✗ |

---

## 14. Источники в репозитории

| Файл | Назначение |
|---|---|
| `payload.config.ts` | Регистрация collections + globals |
| `src/cms/collections/` | Схемы коллекций |
| `src/cms/globals/` | Схемы globals |
| `src/cms/blocks/` | Схемы CMS-блоков |
| `src/cms/fields/` | Переиспользуемые группы (`seo`, `status`) |
| `src/cms/hooks/` | beforeValidate-хуки (раздел 12) |
| `content/cms/` | Seed-данные |
| `scripts/seed-*.ts` | Скрипты наполнения БД |

---

## 15. Переменные окружения

| Переменная | Назначение |
|---|---|
| `DATABASE_URI` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Секрет Payload |
| `PAYLOAD_DB_PUSH` | `false` — отключить auto-push схемы |