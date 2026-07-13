# UI Content Audit

Реестр пользовательских UI-строк и их целевые CMS globals. Статус: **migrated**.

## Header chrome (`header.uiTexts`)

| Строка | Файл | Было | CMS поле |
|--------|------|------|----------|
| Destinations column titles/subtitles | `destinations-nav-menu.tsx` | `header.json` | `header.uiTexts.public.nav.destinations.columns.*` |
| View all destinations | `destinations-nav-menu.tsx` | `header.json` | `header.uiTexts.public.nav.destinations.viewAll` |
| Routes column title / view all | `routes-nav-menu.tsx` | `header.json` | `header.uiTexts.public.nav.routes.*` |
| Experiences column title / view all | `experiences-nav-menu.tsx` | `header.json` | `header.uiTexts.public.nav.experiences.*` |
| Open menu | `public-mobile-nav-menu.tsx` | `header.json` | `header.uiTexts.public.nav.mobileMenu` |
| Soon badge | `public-nav-menu-item.tsx`, footer sections | `header.json` / `footer.json` | `header.uiTexts.public.nav.comingSoon`, `footer.uiTexts.comingSoon` |
| TourLink (logo alt) | `header.tsx`, `public-mobile-nav-menu.tsx` | hardcoded | `footer.uiTexts.brand.name` |

Nav link labels остаются в `header.navItems[].label` / `footer.columns[].title`.

## Footer (`footer.uiTexts`)

| Строка | Файл | Было | CMS поле |
|--------|------|------|----------|
| Brand name | `footer.tsx` | `footer.json` | `footer.uiTexts.brand.name` |
| Copyright | `footer.tsx` | `footer.json` | `footer.uiTexts.copyright` |

Site-wide meta перенесён в `ui-common.meta` (не `footer.uiTexts`).

## Common (`ui-common`)

| Область | Файлы | CMS global |
|---------|-------|------------|
| actions, table, upload, date picker, multiselect, theme/language toggles | `multiselect.tsx`, `custom-accordion.tsx`, `custom-upload-main-image.tsx`, `date-picker.tsx`, `theme-toggle.tsx`, `language-toggle.tsx` | `ui-common.*` |

## Catalog (`ui-catalog`)

| Область | Файлы | CMS global |
|---------|-------|------------|
| hero, search, recent, popular, blog, offers, destinations, card, toasts | catalog widgets, `search-tours-bar.tsx`, tour cards | `ui-catalog.*` |
| Page metadata | `catalog/page.tsx` | `ui-catalog.meta` |

## Discovery (`ui-discovery`)

| Строка | Файл | CMS поле |
|--------|------|----------|
| Pagination prev/next | `render-widgets.tsx` | `ui-discovery.{blog,routes,experiences,news,tradeFairs}.*` |
| Pagination aria | `render-widgets.tsx` | `ui-discovery.paginationAriaLabel` |
| Destinations breadcrumb | `render-cms-route.tsx` | `ui-discovery.geoBreadcrumbLabel` |

## Widgets (`ui-widgets`)

| Строка | Файл | CMS поле |
|--------|------|----------|
| Route timeline | `route-stops-timeline.tsx` | `ui-widgets.routeTimeline.title` |
| Stop N | `route-stops-timeline.tsx` | `ui-widgets.routeTimeline.stopLabel` |

## Blocks shell

| Строка | Файл | Статус |
|--------|------|--------|
| Main Hero fallback alt | `block-render.tsx` | CMS block data fallback — не UI content |

## Не переносилось (legacy / не используется в public UI)

- `header.json`: `agency.*`, `operator.*`, partners/company/policies/help mega-menu items (labels в `navItems`)
- `footer.json`: `sections.*`, `social.*` (структура в `footer.columns`)
