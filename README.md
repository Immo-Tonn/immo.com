# Immo — сайт агентства недвижимости (immo-tonn.de)

Полноценное веб-приложение для агентства недвижимости: каталог объектов (квартиры, дома, участки, коммерческая недвижимость), фото/видео галереи, ипотечный калькулятор, формы обратной связи и админ-панель для управления объектами.

## Стек технологий

**Backend (`BE/`)**
- Node.js + Express 5 + TypeScript
- MongoDB + Mongoose
- JWT-авторизация (админ-панель)
- Bunny CDN — хранение и раздача фото/видео
- Nodemailer — отправка писем
- Google reCAPTCHA — защита форм

**Frontend (`FE/`)**
- React 19 + TypeScript + Vite
- MUI (Material UI), Emotion
- Redux Toolkit
- React Router
- Leaflet / React-Leaflet — карты
- GSAP, ScrollMagic, Lottie — анимации
- react-hook-form — формы
- jsPDF — экспорт расчётов ипотечного калькулятора в PDF

**Инфраструктура**
- Docker + docker-compose
- nginx (реверс-прокси + TLS)
- Сервер: Hetzner

## Структура проекта

```
immo/
├── BE/                     # Backend: Express API
│   └── src/
│       ├── config/         # подключение к MongoDB, Bunny CDN, индексы
│       ├── controllers/    # бизнес-логика по сущностям
│       ├── middleware/     # auth, загрузка файлов, обработка ошибок
│       ├── models/         # Mongoose-схемы
│       ├── routes/         # роуты Express
│       └── utils/          # вспомогательные функции (email, CDN и т.д.)
├── FE/                     # Frontend: React SPA
│   └── src/
│       ├── app/            # точка входа, корневой App
│       ├── pages/          # страницы (Home, RealEstate, Auth, Admin и т.д.)
│       ├── widgets/        # крупные блоки UI (Header, Footer, PropertyCard и т.д.)
│       ├── features/       # фичи (контактная форма, ипотечный калькулятор)
│       └── shared/         # переиспользуемые UI-компоненты, типы, стили, ассеты
├── gateway/                # конфиг nginx (реверс-прокси)
├── docker-compose.yml      # оркестрация backend + frontend + nginx
└── .github/workflows/      # CI-заготовки для деплоя (сейчас не используются, см. ниже)
```

## Запуск для разработки

Backend и frontend запускаются отдельно, каждый в своей папке.

### Backend

```bash
cd BE
npm install
npm run dev
```

Перед запуском создать файл `BE/.env` со следующими переменными:

```
MONGO_URI=              # строка подключения к MongoDB
JWT_SECRET=             # секрет для подписи JWT-токенов
PORT=3000
NODE_ENV=development

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
EMAIL_ADMIN=
EMAIL_ADMIN_PASS=

BUNNY_STORAGE_ZONE=
BUNNY_STORAGE_HOST=
BUNNY_ACCESS_KEY=
BUNNY_LIBRARY_ID=
BUNNY_API_KEY=
BUNNY_VIDEO_CDN=
THUMBNAIL_PROJECT_ID=

RECAPTCHA_SECRET_KEY=
```

### Frontend

```bash
cd FE
npm install
npm run dev
```

Перед запуском создать файл `FE/.env` (пример есть в `FE/.env .example`):

```
VITE_RECAPTCHA_SITE_KEY=
VITE_HOST=http://localhost:4000
```

## Полезные npm-скрипты

Есть и в `BE/`, и в `FE/`:
- `npm run dev` — запуск в режиме разработки
- `npm run build` — сборка (BE: `tsc`, FE: `tsc -b && vite build`)
- `npm run format` — форматирование кода Prettier'ом
- `npm run lint` — проверка линтером (только FE)

## Деплой

Проект разворачивается на сервере через Docker Compose:

```bash
docker-compose up -d --build --force-recreate
```

Поднимаются три контейнера:
- `my-backend` — API на порту 3000
- `my-frontend` — статика фронтенда на порту 4000
- `nginx-proxy` — реверс-прокси на 80/443 с TLS-сертификатами Let's Encrypt для `immo-tonn.de`

> В `.github/workflows/` лежат заготовки для автодеплоя через SSH + PM2 (`deploy-backend.yml`, `deploy-frontend.yml`). На данный момент это не рабочий путь деплоя — реальный деплой выполняется вручную через docker-compose выше.
