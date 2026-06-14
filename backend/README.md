# Backend — Jardín de los Sueños

API REST para e-commerce de plantas: **Node.js**, **Express**, **TypeScript**, **PostgreSQL**, **Drizzle ORM**.

## Stack

| Capa | Tecnología |
|------|------------|
| Runtime | Node.js + TypeScript (ESM) |
| HTTP | Express 4 |
| ORM | Drizzle |
| Validación | Zod |
| Auth | JWT + bcrypt |
| Docs | Swagger UI (`/api/docs`) |
| Tests | Vitest + Supertest |

## Estructura (feature-first)

```
src/
├── app.ts                  # Express app, middlewares globales
├── index.ts                # Entry point
├── config/                 # env, database
├── database/schema/        # Drizzle schemas
├── modules/
│   ├── auth/
│   ├── products/
│   └── orders/
├── routes/index.ts         # Montaje /api
├── shared/
│   ├── errors/
│   ├── lib/                # jwt, password
│   └── middlewares/
└── docs/                   # OpenAPI / Swagger TS

data/backup/                # JSON estáticos de respaldo (no runtime)
tests/                      # Vitest (unit + integration)
logs/                       # Logs runtime (gitignored)
```

## Variables de entorno

Copia `.env.example` a `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=...
DB_NAME=jardin_suenos
JWT_SECRET=...
DB_SSL=false
```

## Scripts

```bash
pnpm install
pnpm dev           # tsx watch con .env
pnpm build && pnpm start
pnpm test          # watch
pnpm test:run      # CI
pnpm db:generate   # Drizzle migrations
pnpm db:migrate
pnpm db:studio
```

## API

Base URL: `http://localhost:3000/api`

| Módulo | Prefijo | Descripción |
|--------|---------|-------------|
| Auth | `/auth` | login, register, usuarios |
| Products | `/productos` | CRUD productos, categorías, imágenes |
| Orders | `/pedidos` | pedidos por usuario / admin |

Documentación interactiva: **http://localhost:3000/api/docs**

## Respaldo de datos (`data/backup/`)

JSON del dataset inicial del bootcamp. **No los consume la app**; PostgreSQL es la fuente de verdad. Úsalos como referencia para seeds o repoblado manual.

## Logs

El middleware `query-logger` escribe consultas en `backend/logs/consultas.log`. La carpeta está en `.gitignore`.

## Tests

```bash
pnpm test:run
```

Incluye tests de servicios (`tests/modules/`) e integración HTTP (`tests/integration/`).

## Decisiones de diseño

- **Errores tipados** con `AppError` y middleware centralizado
- **Validación de entrada** con Zod en controllers/routes
- **Separación** repository → service → controller por módulo
- **TypeScript estricto** en todo `src/`
