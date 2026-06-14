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
| Estilos | CSS Modules + theme Ant + `global.css` |
| Tests | Vitest + Testing Library + jsdom |

## Estructura (feature-first)

```
src/
├── app/                    # Shell: App, providers, router
│   ├── App.tsx
│   ├── providers/AppProviders.tsx
│   ├── router/AppRouter.tsx
│   └── styles/AppShell.module.css
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
│   ├── lib/                # api, queryClient, alerts, cartUtils
│   ├── schemas/            # Contratos Zod
│   └── styles/global.css
├── test/                   # Utilidades y setup de tests
│   ├── setup.ts
│   └── test-utils.tsx
└── theme/
    ├── tokens.ts           # Fuente única de colores y variables CSS
    └── plantTheme.ts       # Theme Ant Design
```

> **Guía de estilos para el equipo:** [`docs/estilos-ant-design.md`](docs/estilos-ant-design.md)

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
pnpm test     # Vitest watch
pnpm test:run # CI — suite completa
pnpm preview
```

## Datos y cache

- **Productos, categorías e imágenes**: TanStack Query (`useCatalog`, `useProductsQuery`, etc.)
- **Carrito**: `CartContext` + `localStorage`
- **Auth**: JWT en `localStorage` vía `AuthContext`
- **Checkout pendiente**: `sessionStorage` vía `checkoutStorage`

Stale time por defecto: 5–10 minutos para catálogo.

## CSS

1. **`theme/tokens.ts`** — fuente única de colores, radios y `--color-*` (inyectados al arrancar)
2. **Ant Design `ConfigProvider`** — theme global (`theme/plantTheme.ts`, importa `tokens.ts`)
3. **CSS Modules** — layout y branding por feature (`*.module.css` con `var(--color-primary)`, etc.)
4. **`shared/styles/global.css`** — reset, fallbacks de variables y estilos base

Documentación completa: [`docs/estilos-ant-design.md`](docs/estilos-ant-design.md)

> La migración desde `App.css` está **completa**. Ya no hay hoja global monolítica por página.

### Módulos CSS por área

| Área | Archivos |
|------|----------|
| App shell | `app/styles/AppShell.module.css` |
| Shared | `Navbar`, `Footer`, `ProductCard`, `Carousel`, `CardCarousel` |
| Home | `Home.module.css` |
| Catalog | `CatalogPage`, `CategoryMenu`, `SearchBar`, `ProductFilters` |
| Product | `ProductPage.module.css` |
| Cart | `CartPage`, `CartDrawer` |
| Checkout | `CheckoutPage`, `PaymentPage` |
| Auth | `auth.module.css`, `ProfilePage.module.css` |
| Blog | `BlogsPage`, `BlogPostPage` |
| Admin | `AdminPanel.module.css` (layout + panel) |

## Tests

Suite con **Vitest** y **Testing Library**. Configuración en `vite.config.ts` (`environment: jsdom`).

### Infraestructura

| Archivo | Rol |
|---------|-----|
| `src/test/setup.ts` | `jest-dom`, mocks de `matchMedia`/`ResizeObserver`, `applyCssVariables()` |
| `src/test/test-utils.tsx` | `renderWithProviders`, `seedCart`, `seedAuthenticatedUser` |

`renderWithProviders` envuelve componentes con `QueryClient`, `ConfigProvider`, `CartProvider` y `MemoryRouter`.

### Cobertura actual (24 tests)

| Archivo | Tipo | Qué valida |
|---------|------|------------|
| `shared/lib/cartUtils.test.ts` | Unitario | Lógica pura del carrito (añadir, quitar, totales) |
| `shared/components/ProductCard.test.tsx` | Componente | Render, descuento, interacciones Ver/Añadir, stock agotado |
| `features/cart/pages/CartPage.test.tsx` | Componente | Carrito vacío, listado, total y cantidades |
| `features/checkout/pages/CheckoutPage.test.tsx` | Integración | Redirección sin sesión, resumen, prellenado, guardado y navegación al pago |

Ejecutar solo un archivo:

```bash
pnpm test:run src/shared/components/ProductCard.test.tsx
```

## Rutas principales

| Ruta | Feature |
|------|---------|
| `/` | Home |
| `/catalogo` | Catalog |
| `/product/:id` | Product |
| `/cart`, `/checkout`, `/checkout/payment` | Cart / Checkout |
| `/login`, `/register`, `/profile` | Auth |
| `/admin` | Admin (rol admin) |
| `/blogs`, `/blogs/:slug` | Blog |

## Próximos pasos sugeridos

- **Tokens en módulos restantes**: reemplazar hex legacy por `var(--color-*)` al tocar cada feature
- **Tests de componentes**: `PaymentPage`, `CartDrawer`, flujos de login/registro
- **Bundle**: `manualChunks` en Vite para reducir el chunk principal (~735 KB)
- **E2E opcional**: Playwright o Cypress para flujo catálogo → carrito → pago
- **Accesibilidad**: auditoría con axe en checkout y catálogo
