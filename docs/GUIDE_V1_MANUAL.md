# Version 1.0 — полный ручной план для новичка

Этот файл закрывает **все 5 пунктов**, которые нужно сделать вручную:

1. Создать Postgres  
2. Получить Google OAuth credentials  
3. Заполнить `.env.local`  
4. Выполнить `npm run db:migrate`  
5. Задеплоить на **Timeweb** (не Vercel)

Делай **строго по порядку**. Не перескакивай: без базы и Google-ключей вход на проде не заработает.

**Время:** 1–3 вечера в спокойном темпе.  
**Стек:** Timeweb Postgres + Timeweb App Platform (Next.js с SSR) + Google OAuth.

---

## Перед стартом: что должно быть установлено

### A. Node.js и npm

1. Открой https://nodejs.org  
2. Скачай LTS (20 или 22)  
3. Установи с настройками по умолчанию  
4. Открой PowerShell и проверь:

```powershell
node -v
npm -v
```

Должны появиться версии, например `v22.x.x` и `10.x.x`.

### B. Проект запускается локально (гостевой режим)

```powershell
cd "C:\Users\1\Desktop\curse\vibe coding\investment-academy"
npm install
npm run dev
```

Открой http://localhost:3000 — должна открыться главная страница.

Остановить сервер: `Ctrl + C`.

### C. Аккаунты

| Аккаунт | Ссылка | Зачем |
|---------|--------|-------|
| GitHub | https://github.com | код для деплоя |
| Timeweb Cloud | https://timeweb.cloud | Postgres + сайт |
| Google | https://accounts.google.com | вход пользователей |

Заведи простой блокнот (или менеджер паролей) — туда будешь складывать секреты.

---

# ПУНКТ 1. Создать Postgres (Timeweb)

> Раньше в чек-листе писали Neon — можно и Neon, но раз деплой на Timeweb, **удобнее Postgres тоже в Timeweb**: всё в одном кабинете.

## 1.1. Зарегистрируйся / войди в Timeweb Cloud

1. Открой https://timeweb.cloud  
2. Войди в панель: https://timeweb.cloud/my  
3. При необходимости привяжи оплату (облачные услуги платные)

## 1.2. Создай кластер PostgreSQL

1. В левом меню нажми **«Базы данных»**  
2. Нажми **«Добавить»** / **«Создать»**  
3. Заполни:

| Поле | Что выбрать |
|------|-------------|
| Тип СУБД | **PostgreSQL** |
| Версия | 16 или 17 |
| Тариф | минимальный для старта (1 CPU / 1–2 ГБ RAM) |
| Регион | ближайший (Москва / СПб и т.п.) |
| Пароль | сгенерируй в панели **или** придумай сложный |

4. **Сохрани пароль сразу** — потом его могут не показать целиком.  
5. Нажми **«Заказать»** / **«Создать»**  
6. Подожди 1–3 минуты, статус должен стать активным (Running).

Доки Timeweb:

- https://timeweb.cloud/docs/dbaas/dbaas-create  
- https://timeweb.cloud/docs/dbaas/postgresql/connect-to-database  

## 1.3. Возьми реквизиты подключения

Открой созданный кластер → вкладка **«Подключение»** (или **«Дашборд»**).

Выпиши:

- **Хост** (hostname)  
- **Порт** (часто `5432`)  
- **Пользователь**  
- **Пароль**  
- **Имя базы** (часто `default_db`)

## 1.4. Собери `DATABASE_URL`

Формат:

```text
postgres://ПОЛЬЗОВАТЕЛЬ:ПАРОЛЬ@ХОСТ:ПОРТ/ИМЯ_БАЗЫ?sslmode=require
```

Пример (выдуманный):

```text
postgres://gen_user:Ab12Cd34Ef56@xyz123.twc1.net:5432/default_db?sslmode=require
```

### Если в пароле есть спецсимволы

Символы `@ # % / ? &` ломают URL. Либо:

- сделай новый пароль только из букв и цифр,  
- либо закодируй символы (`@` → `%40`, `#` → `%23` и т.д.).

`?sslmode=require` почти всегда нужен для облачного Postgres.

## 1.5. Проверка, что база жива (опционально)

В карточке БД нажми **«Веб-интерфейс»** → **Adminer**:

1. Введи хост / пользователя / пароль / имя БД  
2. Войди  
3. Пока таблиц проекта почти нет — это нормально (они появятся после миграций)

## Результат пункта 1

У тебя в блокноте есть готовая строка:

```text
DATABASE_URL=postgres://...
```

---

# ПУНКТ 2. Получить Google OAuth credentials

Нужно, чтобы на сайте работала кнопка **«Войти через Google»**.

## 2.1. Создай проект в Google Cloud

1. Открой https://console.cloud.google.com/  
2. Сверху рядом с «Google Cloud» нажми выбор проекта  
3. **New Project**  
4. Name: `Investment Academy`  
5. Create  
6. Убедись, что выбран именно этот проект

## 2.2. Настрой OAuth consent screen (экран согласия)

1. Меню ☰ → **APIs & Services** → **OAuth consent screen**  
   (иногда путь: **Google Auth platform** → Branding / Audience — смысл тот же)  
2. User type: **External** → Create  
3. Заполни минимум:

| Поле | Пример |
|------|--------|
| App name | Investment Academy |
| User support email | твой Gmail |
| Developer contact email | твой Gmail |

4. Save and Continue  
5. **Scopes** — можно ничего не добавлять → Continue  
6. **Test users** → **Add users** → добавь **свой** Gmail  
7. Save and Continue → Back to dashboard  

Пока приложение в статусе **Testing**, войти смогут только test users.  
Для публичного запуска позже нажмёшь **Publish app**.

## 2.3. Создай OAuth Client ID

1. **APIs & Services** → **Credentials**  
2. **+ Create credentials** → **OAuth client ID**  
3. Application type: **Web application**  
4. Name: `Investment Academy Web`  

### Authorized JavaScript origins

Пока добавь локальный:

```text
http://localhost:3000
```

После деплоя добавишь ещё:

```text
https://ТВОЙ-АДРЕС-НА-TIMEWEB
```

### Authorized redirect URIs

Обязательно точно так (без пробелов, без слэша в конце):

```text
http://localhost:3000/api/auth/callback/google
```

После деплоя добавишь:

```text
https://ТВОЙ-АДРЕС-НА-TIMEWEB/api/auth/callback/google
```

5. **Create**  
6. Скопируй и сохрани:

```text
GOOGLE_CLIENT_ID=.......apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-........
```

## Частые ошибки Google

| Ошибка | Причина |
|--------|---------|
| `redirect_uri_mismatch` | URI в Google ≠ тот, что реально использует сайт |
| `access_denied` / не пускает | твой email не в Test users |
| Кнопка входа ничего не делает | неверный Client ID/Secret в `.env.local` |

## Результат пункта 2

В блокноте есть:

```text
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

# ПУНКТ 3. Заполнить `.env.local`

Это секретный файл **только на твоём компьютере**. В GitHub его пушить нельзя.

## 3.1. Где создать файл

Папка проекта:

```text
C:\Users\1\Desktop\curse\vibe coding\investment-academy\
```

Рядом с `package.json` создай файл с именем:

```text
.env.local
```

В Cursor/VS Code: New File → имя точно `.env.local`.

## 3.2. Сгенерируй AUTH_SECRET

В PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Скопируй длинную строку (64 символа hex) — это `AUTH_SECRET`.

## 3.3. Содержимое `.env.local` для локальной разработки

Вставь и подставь свои значения:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_ENABLED=true

AUTH_URL=http://localhost:3000
AUTH_SECRET=вставь_сгенерированную_строку

DATABASE_URL=postgres://USER:PASS@HOST:5432/DBNAME?sslmode=require

GOOGLE_CLIENT_ID=вставь_из_google
GOOGLE_CLIENT_SECRET=вставь_из_google
```

### Что значит каждая переменная

| Переменная | Зачем |
|------------|--------|
| `NEXT_PUBLIC_AUTH_ENABLED=true` | включает вход и sync в приложении |
| `NEXT_PUBLIC_SITE_URL` | публичный адрес сайта (OG/sitemap) |
| `AUTH_URL` | базовый URL для Auth.js |
| `AUTH_SECRET` | подпись сессионных cookie (секрет!) |
| `DATABASE_URL` | подключение к Postgres |
| `GOOGLE_CLIENT_ID/SECRET` | вход через Google |

## 3.4. Проверка, что файл на месте

```powershell
cd "C:\Users\1\Desktop\curse\vibe coding\investment-academy"
dir .env.local
```

Файл должен существовать.  
**Не коммить его.** Проверка:

```powershell
git status
```

`.env.local` не должен быть в списке на коммит (он в `.gitignore`).

## Результат пункта 3

Локальный `.env.local` заполнен, `NEXT_PUBLIC_AUTH_ENABLED=true`.

---

# ПУНКТ 4. `npm run db:migrate`

Миграции создают таблицы в Postgres: пользователи, прогресс, sync и т.д.  
SQL уже лежит в папке `drizzle/` в проекте.

## 4.1. Запусти миграцию

В PowerShell из корня проекта:

```powershell
cd "C:\Users\1\Desktop\curse\vibe coding\investment-academy"
npm run db:migrate
```

Если команда не видит `DATABASE_URL` из `.env.local`, задай явно:

```powershell
$env:DATABASE_URL="postgres://USER:PASS@HOST:5432/DBNAME?sslmode=require"
npm run db:migrate
```

## 4.2. Успех выглядит так

- команда завершилась без красной ошибки  
- в Adminer появились таблицы, например:
  - `users`
  - `accounts`
  - `sessions`
  - `course_progress`
  - `lesson_progress`
  - `sync_events`
  - `subscriptions`
  - `entitlements`

## 4.3. Если ошибка

| Сообщение / симптом | Что делать |
|---------------------|------------|
| connection refused / timeout | проверь хост/порт, доступность БД, firewall |
| password authentication failed | неверный пользователь/пароль |
| SSL / certificate | добавь `?sslmode=require` |
| database does not exist | неверное имя БД (`default_db`?) |
| DATABASE_URL empty | переменная не подставилась — задай `$env:DATABASE_URL=...` |

## 4.4. Локальная проверка auth после миграций

```powershell
npm run dev
```

Проверь:

1. http://localhost:3000/login → «Войти через Google»  
2. Войди своим test user  
3. Открой http://localhost:3000/api/health  
   - ожидай `"status":"ok"` и `"database":"ok"`  
4. Заверши урок → Settings → «Синхронизировать сейчас»

Если это работает локально — база и Google настроены правильно. Можно деплоить.

## Результат пункта 4

Таблицы созданы, локальный вход через Google работает.

---

# ПУНКТ 5. Деплой на Timeweb (вместо Vercel)

Нам нужен **SSR**, потому что есть серверные API: `/api/auth`, `/api/progress`.  
Статический Next.js без SSR для этого проекта **не подойдёт**.

## 5.0. Сначала код должен быть на GitHub

Timeweb App Platform деплоит из git-репозитория.

### Если репозитория ещё нет

1. https://github.com/new  
2. Имя: `investment-academy`  
3. Без авто-README  
4. Create

### Запушь код

```powershell
cd "C:\Users\1\Desktop\curse\vibe coding\investment-academy"
git status
git add -A
git commit -m "Version 1.0 ready for Timeweb deploy."
git branch -M main
git remote add origin https://github.com/ТВОЙ_ЛОГИН/investment-academy.git
git push -u origin main
```

Если `origin` уже есть:

```powershell
git remote -v
git push -u origin main
```

Убедись, что `.env.local` **не** уехал в GitHub.

## 5.1. Создай приложение в App Platform

1. Timeweb Cloud → **App Platform** → **Создать**  
2. Тип: **Frontend** → **Next.js**  
3. Node.js: **20** или **22**  
4. **Включи поддержку SSR** (обязательно)  
5. Подключи GitHub-аккаунт и выбери репозиторий `investment-academy`  
6. Ветка: `main`  
7. Автодеплой: включи (удобно)  

Команды (если спрашивает отдельно):

| Шаг | Команда |
|-----|---------|
| Install | `npm ci` или `npm install` |
| Build | `npm run build` |
| Start | `npm start` |

8. Выбери небольшой серверный тариф (для SSR нужна конфигурация)  
9. Создай / закажи приложение  

Доки:

- https://timeweb.cloud/docs/apps/deploying-frontend-apps/nextjs  
- https://timeweb.cloud/tutorials/cloud/kak-razvernut-prilozhenie-na-next-js  

## 5.2. Переменные окружения на Timeweb

В настройках приложения → **Переменные окружения** добавь:

| Ключ | Значение |
|------|----------|
| `NEXT_PUBLIC_AUTH_ENABLED` | `true` |
| `AUTH_SECRET` | тот же, что в `.env.local` |
| `DATABASE_URL` | та же Postgres-строка Timeweb |
| `GOOGLE_CLIENT_ID` | из Google |
| `GOOGLE_CLIENT_SECRET` | из Google |
| `NEXT_PUBLIC_SITE_URL` | временно можно после первого деплоя |
| `AUTH_URL` | то же, что `NEXT_PUBLIC_SITE_URL` |
| `NODE_ENV` | `production` (если есть поле) |

Сохрани и дождись деплоя.

## 5.3. Получи публичный URL

После успешного деплоя Timeweb даст адрес вида:

```text
https://что-то.timeweb.cloud
```

(или другой их поддомен)

### Сразу обнови 3 места

**A. Env на Timeweb**

```text
NEXT_PUBLIC_SITE_URL=https://твой-url
AUTH_URL=https://твой-url
```

Перезапусти / передеплой.

**B. Google Console → Credentials → твой OAuth Client**

Authorized JavaScript origins — добавь:

```text
https://твой-url
```

Authorized redirect URIs — добавь:

```text
https://твой-url/api/auth/callback/google
```

Save.

**C. (Опционально) свой домен позже**

Когда привяжешь домен — снова обнови `AUTH_URL`, `NEXT_PUBLIC_SITE_URL` и Google URIs.

## 5.4. Финальный чек-лист на проде

Открой HTTPS-адрес и проверь:

- [ ] `/` открывается  
- [ ] `/dashboard` работает без входа (гость)  
- [ ] `/login` → Google → успешный вход  
- [ ] предложение объединить гостевой прогресс (если был)  
- [ ] завершить урок  
- [ ] Settings → синхронизация  
- [ ] второй браузер / инкогнито: тот же Google → прогресс на месте  
- [ ] `/privacy`, `/terms`, `/delete-account`  
- [ ] `/api/health` → `status: ok`, `database: ok`  

## Результат пункта 5

Сайт в интернете на Timeweb, вход и sync работают.

---

# Сводная таблица «сделал / не сделал»

| # | Пункт | Готово, когда… |
|---|--------|----------------|
| 1 | Postgres | есть `DATABASE_URL`, база Running |
| 2 | Google OAuth | есть Client ID + Secret, localhost redirect добавлен |
| 3 | `.env.local` | файл заполнен, auth включён |
| 4 | `db:migrate` | таблицы есть, локальный Google-вход работает |
| 5 | Timeweb deploy | HTTPS сайт + prod redirect в Google + health ok |

---

# Чего пока НЕ делать

- Подписки / Stripe  
- App Store / Google Play  
- Apple Sign In (можно позже; для старта хватит Google)  
- Публиковать Google OAuth на весь интернет, пока не проверил test users  

---

# Если застрял — порядок диагностики

1. Гость без auth: поставь `NEXT_PUBLIC_AUTH_ENABLED=false` → сайт должен открываться  
2. `/api/health` — видит ли БД  
3. Локальный Google-вход  
4. Только потом деплой  
5. На проде снова `/api/health`, потом `/login`  

Так отделяются проблемы кода, базы и хостинга.

---

# Куда идти дальше в чате

Рекомендуемый порядок работы со мной:

1. Сначала пункт 1 (Postgres) — пришли скрин/строку без пароля, проверим формат `DATABASE_URL`  
2. Потом пункт 2 (Google)  
3. Потом вместе соберём `.env.local`  
4. Потом миграции  
5. Потом деплой  

Не обязательно делать всё за один вечер.
