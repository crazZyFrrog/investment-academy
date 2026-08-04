# Пошаговый план до Version 1.0 на Timeweb (для новичка)

Этот документ — **практическая инструкция**: что делать по порядку, где нажимать, что куда копировать.

Цель в конце:

1. Сайт открывается по HTTPS на Timeweb
2. Можно войти через Google
3. Прогресс уроков синхронизируется через PostgreSQL
4. Гостевой режим тоже работает

**Оценка времени:** 1–3 вечера (если делать спокойно и впервые).

---

## Карта всего процесса

```text
1. GitHub          → код в облаке
2. Timeweb Postgres → база данных
3. Google OAuth     → кнопка «Войти через Google»
4. Локальная проверка с auth
5. Деплой App Platform на Timeweb (Next.js + SSR)
6. Миграции БД
7. Проверка на проде
```

Нельзя сразу «залить сайт». Сначала нужны **база** и **Google-ключи**, иначе вход и sync не заработают.

---

## Что тебе понадобится заранее

| Что | Зачем |
|-----|--------|
| Аккаунт [GitHub](https://github.com) | Хранить код и подключить к Timeweb |
| Аккаунт [Timeweb Cloud](https://timeweb.cloud) | Хостинг приложения + PostgreSQL |
| Аккаунт Google | OAuth-вход пользователей |
| Компьютер с установленным Node.js и `npm` | Локальные команды |
| Банковская карта / оплата Timeweb | Postgres и App Platform платные |

Проверь локально, что проект уже запускается:

```bash
cd "путь/к/investment-academy"
npm install
npm run dev
```

Открой http://localhost:3000 — должна открыться главная.

---

## Этап 0. Закоммить и запушь код на GitHub

Timeweb App Platform деплоит **из репозитория**. Код должен быть на GitHub.

### 0.1. Если репозитория ещё нет

1. Зайди на https://github.com/new
2. Название: `investment-academy` (или любое)
3. **Private** или Public — на твой выбор
4. **Не** ставь галочки «Add README / .gitignore» (у тебя проект уже есть)
5. Create repository

### 0.2. Запушь проект

В терминале (PowerShell), в папке проекта:

```bash
git status
git add -A
git commit -m "Prepare Version 1.0 for Timeweb deploy."
git branch -M main
git remote add origin https://github.com/ТВОЙ_ЛОГИН/investment-academy.git
git push -u origin main
```

Если `remote origin` уже есть — вместо `remote add` сделай:

```bash
git remote -v
git push -u origin main
```

**Важно:** файл `.env.local` **нельзя** пушить в GitHub (там секреты). Он уже в `.gitignore`.

---

## Этап 1. Создай PostgreSQL в Timeweb

### 1.1. Создай кластер

1. Войди в https://timeweb.cloud/my
2. Слева: **«Базы данных»** → **«Добавить»** / **«Создать»**
3. Тип: **PostgreSQL** (версия 16 или 17 — нормально)
4. Тариф: можно минимальный для старта (1 CPU / 1–2 ГБ RAM)
5. Задай **пароль** пользователя — сохрани его в блокнот / менеджер паролей
6. Регион: ближе к тебе (например, Москва / Санкт-Петербург)
7. Закажи / создай

Подожди 1–3 минуты, пока база станет **Running**.

### 1.2. Возьми строку подключения

1. Открой созданный кластер
2. Вкладка **«Подключение»** или **«Дашборд»**
3. Найди:
   - хост
   - порт (обычно `5432`)
   - пользователь
   - пароль
   - имя базы (часто `default_db`)

Собери `DATABASE_URL` так:

```text
postgres://ПОЛЬЗОВАТЕЛЬ:ПАРОЛЬ@ХОСТ:ПОРТ/ИМЯ_БАЗЫ?sslmode=require
```

Пример (выдуманный):

```text
postgres://gen_user:MySecret123@abc123.timeweb.cloud:5432/default_db?sslmode=require
```

Если в пароле есть спецсимволы (`@`, `#`, `%`, `/`), их нужно **URL-encode**  
(например `@` → `%40`). Или сгенерируй пароль только из букв и цифр.

**Сохрани `DATABASE_URL` в блокнот.** Он понадобится локально и на Timeweb.

Официальные доки:

- https://timeweb.cloud/docs/dbaas/dbaas-create
- https://timeweb.cloud/docs/dbaas/postgresql/connect-to-database

---

## Этап 2. Создай Google OAuth (кнопка входа)

### 2.1. Google Cloud проект

1. Открой https://console.cloud.google.com/
2. Сверху выбери проект или **New Project**
3. Имя: `Investment Academy`
4. Create

### 2.2. Экран согласия OAuth

1. Меню: **APIs & Services** → **OAuth consent screen**
2. User Type: **External**
3. App name: `Investment Academy`
4. User support email: твой email
5. Developer contact: твой email
6. Save and Continue
7. Scopes: можно ничего не добавлять вручную → Continue
8. Test users: добавь **свой** Google-аккаунт (пока приложение в режиме Testing)
9. Save

Позже, когда будешь готов к публике, нажмёшь **Publish app**.  
Пока в Testing — войти смогут только test users.

### 2.3. OAuth Client ID

1. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**
2. Application type: **Web application**
3. Name: `Investment Academy Web`
4. **Authorized JavaScript origins:**
   - `http://localhost:3000`
   - позже добавишь `https://ТВОЙ-ДОМЕН` (после деплоя)
5. **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google`
   - позже: `https://ТВОЙ-ДОМЕН/api/auth/callback/google`
6. Create
7. Скопируй:
   - **Client ID** → это `GOOGLE_CLIENT_ID`
   - **Client secret** → это `GOOGLE_CLIENT_SECRET`

Сохрани в блокнот.

---

## Этап 3. Локальный `.env.local` и проверка auth

### 3.1. Создай файл `.env.local`

В корне проекта (рядом с `package.json`) создай файл `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_ENABLED=true

AUTH_URL=http://localhost:3000
AUTH_SECRET=СЮДА_ДЛИННУЮ_СЛУЧАЙНУЮ_СТРОКУ_32_ПЛЮС_СИМВОЛОВ

DATABASE_URL=postgres://...твоя строка из Timeweb...?sslmode=require

GOOGLE_CLIENT_ID=....apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-....
```

### 3.2. Сгенерируй AUTH_SECRET

В PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Скопируй вывод в `AUTH_SECRET`.

### 3.3. Примени миграции к базе Timeweb

Миграции уже лежат в папке `drizzle/`. Нужно один раз накатить их на Postgres:

```bash
npm run db:migrate
```

Команда возьмёт `DATABASE_URL` из окружения. Если не подхватила `.env.local`, задай явно в PowerShell:

```powershell
$env:DATABASE_URL="postgres://...твоя строка...?sslmode=require"
npm run db:migrate
```

Ожидаемый результат: команда завершилась без ошибки.  
Таблицы `users`, `accounts`, `course_progress`, `lesson_progress` и др. созданы.

Проверить можно через **Adminer** в панели Timeweb (кнопка «Веб-интерфейс» у базы).

### 3.4. Запусти локально с auth

```bash
npm run dev
```

Проверь:

1. http://localhost:3000/login → «Войти через Google»
2. Войди своим test user
3. Если был гостевой прогресс — появится предложение объединить
4. Пройди/заверши урок
5. Settings → «Синхронизировать сейчас»
6. `/api/health` → `"status":"ok"` и `"database":"ok"`

Если Google пишет `redirect_uri_mismatch` — в Google Console опечатка в callback URI.  
Должно быть **точно**:

`http://localhost:3000/api/auth/callback/google`

---

## Этап 4. Деплой приложения на Timeweb App Platform

Нам нужен **не статический** сайт: есть API (`/api/auth`, `/api/progress`).  
Поэтому при создании приложения включай **поддержку SSR** (серверный режим Next.js).

Официально:

- https://timeweb.cloud/docs/apps/deploying-frontend-apps/nextjs
- https://timeweb.cloud/tutorials/cloud/kak-razvernut-prilozhenie-na-next-js

### 4.1. Создай приложение

1. Timeweb Cloud → **App Platform** → **Создать**
2. Тип: **Frontend** → **Next.js**
3. Версия Node.js: **20** или **22** (лучше ближе к твоей локальной)
4. **Включи поддержку SSR** (обязательно!)
5. Подключи GitHub (авторизуй Timeweb доступ к репозиторию)
6. Выбери репозиторий `investment-academy`, ветку `main`
7. Автодеплой: включи (удобно — каждый `git push` обновляет сайт)
8. Команда запуска (обычно):

```bash
npm start
```

или, если панель просит явно:

```bash
npm run build && npm start
```

(часто build уже отдельным шагом — смотри поля «Build command» / «Start command»)

Типично:

- **Install:** `npm ci` или `npm install`
- **Build:** `npm run build`
- **Start:** `npm start`

9. Выбери небольшой тариф сервера (SSR = backend-режим, нужна конфигурация CPU/RAM)
10. Закажи / создай

### 4.2. Добавь переменные окружения в App Platform

В настройках приложения найди **Environment variables** / **Переменные окружения** и добавь:

| Ключ | Значение |
|------|----------|
| `NEXT_PUBLIC_AUTH_ENABLED` | `true` |
| `NEXT_PUBLIC_SITE_URL` | пока оставь пустым или поставь временный URL Timeweb после первого деплоя |
| `AUTH_URL` | тот же публичный HTTPS URL |
| `AUTH_SECRET` | тот же, что в `.env.local` |
| `DATABASE_URL` | строка Postgres из Timeweb (`?sslmode=require`) |
| `GOOGLE_CLIENT_ID` | из Google Console |
| `GOOGLE_CLIENT_SECRET` | из Google Console |
| `NODE_ENV` | `production` (если есть поле) |

После первого деплоя Timeweb даст URL вида:

```text
https://something.timeweb.cloud
```

или свой поддомен App Platform.

**Сразу после получения URL:**

1. Обнови в App Platform:
   - `NEXT_PUBLIC_SITE_URL=https://твой-url`
   - `AUTH_URL=https://твой-url`
2. В Google Console добавь:
   - Origin: `https://твой-url`
   - Redirect: `https://твой-url/api/auth/callback/google`
3. Перезапусти / передеплой приложение

### 4.3. Дождись успешного деплоя

На вкладке **«Деплой»** смотри логи.

Частые ошибки:

| Симптом | Что проверить |
|---------|----------------|
| Build failed на `npm run build` | Логи TypeScript/ESLint; локально `npm run build` должен проходить |
| Приложение падает при старте | `AUTH_SECRET` / OAuth / `DATABASE_URL` |
| `Authentication is enabled but no OAuth provider` | Не задан `GOOGLE_CLIENT_ID/SECRET` при `NEXT_PUBLIC_AUTH_ENABLED=true` |
| БД недоступна | `?sslmode=require`, публичный доступ к БД, верный пароль |

---

## Этап 5. Миграции на production (если ещё не делал на эту же БД)

Если на этапе 3 ты уже мигрировал **ту же** Timeweb-базу — повторно не нужно.

Если создал отдельную prod-базу — мигрируй с компа:

```powershell
$env:DATABASE_URL="postgres://...prod...?sslmode=require"
npm run db:migrate
```

---

## Этап 6. Финальная проверка на проде (чек-лист)

Открой свой HTTPS URL и пройди:

- [ ] Главная `/` открывается
- [ ] `/dashboard` работает без входа (гость)
- [ ] `/login` → Google → успешный вход
- [ ] После входа можно объединить гостевой прогресс (если был)
- [ ] Завершить урок
- [ ] Settings → синхронизация
- [ ] Второй браузер / режим инкогнито: войти тем же Google → прогресс урока на месте
- [ ] `/privacy`, `/terms`, `/delete-account` открываются
- [ ] `/api/health` → `status: ok`, `database: ok`

---

## Этап 7. Свой домен (по желанию)

1. В App Platform привяжи домен (например `academy.example.ru`)
2. В DNS домена добавь записи, которые покажет Timeweb (обычно CNAME/A)
3. Дождись HTTPS-сертификата
4. Обнови:
   - `NEXT_PUBLIC_SITE_URL`
   - `AUTH_URL`
   - Google OAuth origins + redirect URI на новый домен
5. Передеплой

---

## Что пока НЕ нужно делать

| Тема | Когда |
|------|--------|
| Подписки / Stripe | после стабильного 1.0 |
| App Store / Google Play | после веб-версии + платежей |
| Apple Sign In | опционально; для веб-1.0 хватит Google |
| Self-service удаление аккаунта | пока достаточно страницы `/delete-account` + email |

---

## Минимальный «рецепт успеха» (коротко)

1. Код на GitHub  
2. Postgres в Timeweb → `DATABASE_URL`  
3. Google OAuth → Client ID/Secret + redirect URIs  
4. Локально `.env.local` + `npm run db:migrate` + проверка входа  
5. App Platform: Next.js **с SSR** + те же env  
6. Прописать production URL в env и Google  
7. Пройти чек-лист этапа 6  

---

## Если совсем застрял — диагностический порядок

1. Локально без auth: `NEXT_PUBLIC_AUTH_ENABLED=false` → сайт должен жить как гость  
2. `/api/health` — видит ли БД  
3. Локально с auth — работает ли Google  
4. Только потом деплой  
5. На проде снова `/api/health`, потом `/login`

Так ты отделяешь проблемы «кода», «базы» и «хостинга».

---

## Полезные ссылки

- Timeweb App Platform (Next.js): https://timeweb.cloud/docs/apps/deploying-frontend-apps/nextjs  
- Туториал Next.js на Timeweb: https://timeweb.cloud/tutorials/cloud/kak-razvernut-prilozhenie-na-next-js  
- Создание БД: https://timeweb.cloud/docs/dbaas/dbaas-create  
- Подключение к Postgres: https://timeweb.cloud/docs/dbaas/postgresql/connect-to-database  
- Google Cloud Credentials: https://console.cloud.google.com/apis/credentials  
- Внутренние доки проекта: [SETUP_V1.md](./SETUP_V1.md), [DEPLOY.md](./DEPLOY.md)
