# UI Content Guide

Payload CMS — единственное хранилище UI-текстов. Добавление новой строки:

1. Добавить поле в Payload global schema (`src/cms/globals/ui-*.ts` или расширить `header`/`footer` `uiTexts`)
2. `npm run generate:types`
3. Добавить поле в `src/shared/ui-content/ui-content.types.ts`
4. Обновить mapper при необходимости (`ui-content.mapper.ts`)
5. Добавить seed-значение в `scripts/seed-ui-content.ts` для `en` / `ru` / `uz`
6. Использовать в UI: `useUiContent()` или props из layout

**Запрещено:** новые `messages/*.json`, `useTranslations()` / `getTranslations()` для UI, hardcoded JSX strings.

## navItems vs uiTexts

- Текст ссылки навигации → `header.navItems` / `footer.columns`
- Chrome вокруг nav (mega-menu titles, badges, aria) → `header.uiTexts` / `footer.uiTexts`

## Locale availability

Хранится в `ui-common.localeAvailability` (не localized). Читается в layout через `getLocaleAvailability()`. Disabled locale → `notFound()`.
