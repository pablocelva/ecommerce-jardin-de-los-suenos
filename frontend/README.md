# Frontend — Jardín de los Sueños

E-commerce de plantas construido con **React 18**, **TypeScript**, **Vite** y **Ant Design 5**.

## Stack

| Capa | Tecnología |
|------|------------|
| UI | Ant Design + `@ant-design/icons` |
| Estado servidor | TanStack Query v5 |
| Estado cliente | React Context (auth, carrito) |
| Validación | Zod |
| Routing | React Router 7 (lazy routes) |
| Estilos | CSS Modules (componentes) + theme Ant + `App.css` (layout legacy en migración) |

## Estructura (feature-first)

```
src/
├── app/                    # Shell: App, providers, router
│   ├── App.tsx
│   ├── providers/AppProviders.tsx
│   └── router/AppRouter.tsx
├── features/               # Dominios de negocio
│   ├── catalog/            # Catálogo, filtros, API + queries
│   ├── home/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   ├── auth/
│   ├── blog/
│   └── admin/
├── shared/                 # Código reutilizable
│   ├── components/         # ProductCard, Navbar, Footer…
│   ├── context/            # Auth, Cart (solo estado cliente)
│   ├── hooks/
│   ├── lib/                # api, queryClient, alerts
│   ├── schemas/            # Contratos Zod
│   └── styles/global.css
└── theme/plantTheme.ts     # Tokens Ant Design
```

## Alias de imports

Usa `@/` como raíz de `src/`:

```ts
import { useCatalog } from "@/features/catalog/api/catalog.queries";
import ProductCard from "@/shared/components/ProductCard";
```

## Variables de entorno

Copia `.env.example` a `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Scripts

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build
pnpm lint
pnpm preview
```

## Datos y cache

- **Productos, categorías e imágenes**: TanStack Query (`useCatalog`, `useProductsQuery`, etc.)
- **Carrito**: `CartContext` + `localStorage`
- **Auth**: JWT en `localStorage` vía `AuthContext`

Stale time por defecto: 5–10 minutos para catálogo.

## CSS

1. **Ant Design `ConfigProvider`** — colores, tipografía, radios (`theme/plantTheme.ts`)
2. **CSS Modules** — estilos scoped por componente (ej. `ProductCard.module.css`)
3. **`App.css`** — layout de páginas (en migración gradual a modules por feature)
4. **`shared/styles/global.css`** — reset y variables CSS

## Rutas principales

| Ruta | Feature |
|------|---------|
| `/` | Home |
| `/catalogo` | Catalog |
| `/product/:id` | Product |
| `/cart`, checkout | Cart / Checkout |
| `/login`, `/register`, `/profile` | Auth |
| `/admin` | Admin (rol admin) |
| `/blogs` | Blog |

## Próximos pasos sugeridos

- Migrar secciones de `App.css` a `*.module.css` por feature
- Tests con Vitest + Testing Library en cart y checkout
- Code-splitting adicional por feature admin
