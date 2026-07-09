# Neon YAML Seed

Инкрементальный seed на Neon из YAML в `content/` через Payload Local API.

Источник данных — только YAML (как `npm run seed`). Локальная БД и `pg_dump` не используются.

## Prerequisites

1. `DATABASE_URI_DIRECT` в `.env` указывает на Neon (direct connection).
2. `PAYLOAD_SECRET` задан.
3. **Схема Payload уже создана** на Neon (однократно вне neon-seed).
4. `PAYLOAD_DB_PUSH=false` во время neon-seed — скрипт **не создаёт схему**.

Если core-таблиц (`badges`, `countries`, `regions`, `cities`, `media`, `themes`, `attractions`, `experiences`, `routes`, `map_points`) нет — скрипт завершится с понятной ошибкой.

## Команды

```bash
npm run seed:neon:dry-run
npm run seed:neon:test -- --limit=10
npm run seed:neon:test -- --abort-after=20
npm run seed:neon:test -- --resume
npm run seed:neon:test -- --no-resume
```

На Windows для передачи флагов через npm используйте `--`:

```bash
npm run seed:neon:test -- --dry-run
```

Или отдельный скрипт `npm run seed:neon:dry-run`.

## Milestone stages

### Milestone 1

```
badges → countries → regions → cities
```

### Milestone 2

```
themes → attractions → experiences → routes → mapPoints → routesHub → experiencesHub → refreshRouteMap*
```

Checkpoint item indices are continuous: M1 ends at item 23, M2 continues from 24.

Routes, themes, attractions, experiences — полная логика из `seed.ts` / `seed-discovery.ts` (deferred relations patch для routes/experiences).

## Checkpoint

Файл: `.dumps/neon-seed-progress.json`

Порядок:

```
payload.create/update success → save checkpoint → next item
```

`--resume` (default) продолжает с последнего успешно завершённого item.

Если документ с таким `slug` уже есть в БД — item пропускается без `update` (идемпотентность на частично заполненной Neon после failed restore).

### Crash test

```bash
npm run seed:neon:test -- --abort-after=20
# 20 items completed, process exited intentionally, checkpoint saved

npm run seed:neon:test -- --resume
# продолжает с item 21, дубли не создаются (slug lookup в seed)
```

## Retry

4 попытки с задержками `2s → 5s → 10s → 30s` для:

- SSL EOF
- ECONNRESET
- connection terminated
- server closed connection

## Архитектура

- **Payload API** — все записи (`create` / `update`, media upload).
- **`pg.Pool` (DATABASE_URI_DIRECT)** — только wake, schema preflight, counts.
- **Нет** raw SQL INSERT в Payload-таблицы.

## Media

Используется существующий `ensureMedia()` из `seed.ts` через `resolveSeedDocument()`:

- preload индекса media из БД;
- skip существующих `sourcePath`;
- retry через neon-seed wrapper.

## A vs B

| | pg_restore | neon-seed |
|---|---|---|
| Источник | local dump | YAML в `content/` |
| Resume | re-wipe + restore | checkpoint JSON |
| Обрывы Neon | SSL EOF | retry + resume |
| Схема | полный клон | требует готовую схему |
