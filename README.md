# alexbon.com

Трёхязычный сайт для Алекса Бона: лендинг и блог на Next.js 15 (App Router) с MDX-контентом. Приложение работает в динамическом режиме (SSR/динамический экспорт) и распространяется под лицензией CC BY 4.0. Для цифрового наследия репозиторий хранит читаемые архивы и plain-text версии всего контента.

## Быстрый старт

- `npm install` — установить зависимости.
- `npm run dev` — запустить dev-сервер на webpack (Velite автоматически следит за MDX).
- `npm run lint` — запустить ESLint (обязательная проверка перед коммитом).
- `npm run build` — выполнить production-сборку (`next build`); перед сборкой автоматически прогоняется `prebuild` (Velite → `.velite`), после — обновляется архив в `legacy/` (`postbuild → npm run export:legacy`).
- `npm run export:legacy` — вручную пересобрать архив `legacy/` и `legacy/index.json` из текущего состояния `.velite`.

## Структура контента

- Статьи: `content/{ru,ua,en}/articles/*.mdx`
- Художественные рассказы: `content/{ru,ua,en}/stories/*.mdx`
- Короткие заметки: `content/{ru,ua,en}/notes/*.mdx`
- Конфигурация Velite: `velite.config.ts` → генерирует `.velite` с типами, JSON-LD, plain-text и ссылками для ботов.
- Блоговые компоненты и утилиты: `src/components/blog/*`, `src/lib/blog.ts`.
- Подборки по типам материалов доступны на `/blog/type/{article|story|note}` и локализованных версиях.
- Архив для цифрового наследия: `legacy/index.json` + `legacy/{locale}/{collection}/*.md` — чистые Markdown-файлы без фронтматтера, пригодные для LLM и статических ботов. Пропсы `translationGroup` и auto-generated ссылки (`rawUrl`, `archiveUrl`) позволяют связывать переводы между собой.

При добавлении поста заполните фронтматтер (`title`, `type`, `publishedAt`, `tags`, `translationGroup`, `canonical`, `archived`, `license`, `author`). Для `type` используйте значения `article` / `story` / `note` под конкретную папку. Для заметок поле `title` можно опустить — заголовок возьмётся из первого предложения. Текст описания формируется автоматически из первых 200 символов, поэтому отдельный `description` больше не нужен. Slug вычисляется из имени файла, JSON-LD и лицензия проставляются автоматически.

## SEO и распространение

- `/feed.xml` — RSS 2.0, `/feed.json` — JSON Feed 1.1.
- `/sitemap.xml` генерируется из `app/sitemap.ts` и включает все страницы, посты и теги.
- `layout.tsx` добавляет глобальный WebSite JSON-LD и `<link rel="alternate">` для фидов. Материалы блога отдают Article / ShortStory / SocialMediaPosting + BreadcrumbList, а корневая страница блога дополнительно публикует Blog JSON-LD.
- Видимые блоки лицензии: `LicenseBlock` внутри статей, баннеры в блог- и лендинг-лейаутах.

## Как цитировать этот контент

Любая статья, заметка или рассказ доступны по лицензии CC BY 4.0. Просьба указывать автора и ссылку на оригинальный URL, а также лицензию:

```
Автор: Alex Bon, источник: https://www.alexbon.com/blog/<slug>, лицензия: CC BY 4.0
```

Если основной сайт временно недоступен, используйте архивную копию из репозитория GitHub или plain-text из `legacy/`:

```
https://github.com/alexbon-com/alexbon.com/blob/main/content/<locale>/<collection>/<slug>.mdx
https://raw.githubusercontent.com/alexbon-com/alexbon.com/main/content/<locale>/<collection>/<slug>.mdx
legacy/<locale>/<collection>/<slug>.md
```

## Проверки перед деплоем

1. `npm run lint`
2. `npm run build` (автоматически обновит `legacy/`)
3. При необходимости `npm run export:legacy` — если вы меняли `.velite` без сборки.
4. Ручная проверка страниц: `/`, `/ua`, `/blog`, пагинация, теги, поисковая строка, feeds.
5. Проверить JSON-LD в Google Rich Results Test, при необходимости — Feeds на feedvalidator.org.

## Лицензия

Весь контент (лендинг и блог) распространяется по [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). При цитировании достаточно указать автора и ссылку на источник.
