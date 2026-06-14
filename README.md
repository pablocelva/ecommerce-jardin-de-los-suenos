# E-commerce Jardín de los Sueños

Monorepo full stack: tienda online de plantas con catálogo, carrito, checkout simulado, panel admin y blog.

## Demo local

```bash
# Backend
cd backend && cp .env.example .env   # configurar PostgreSQL
pnpm install && pnpm dev

# Frontend (otra terminal)
cd frontend && cp .env.example .env
pnpm install && pnpm dev
```

- Frontend: http://localhost:5173  
- API: http://localhost:3000/api  
- Swagger: http://localhost:3000/api/docs  

## Tecnologías

| Frontend | Backend |
|----------|---------|
| React 18 + TypeScript | Node.js + Express + TypeScript |
| Vite | Drizzle ORM + PostgreSQL |
| Ant Design 5 | JWT + Zod |
| TanStack Query | Vitest + Swagger |

## Arquitectura

```
ecommerce-jardin-de-los-sueños/
├── frontend/     → SPA feature-first (ver frontend/README.md)
├── backend/      → API REST modular (ver backend/README.md)
└── README.md     → Este archivo
```

### Frontend (resumen)

- Organización **por features** (`catalog`, `cart`, `auth`…)
- **TanStack Query** para productos/categorías/imágenes
- **Context** solo para auth y carrito
- **Lazy loading** de rutas
- **CSS Modules** + theme Ant Design

### Backend (resumen)

- Módulos `auth`, `products`, `orders`
- Drizzle + migraciones
- Tests automatizados
- JSON de respaldo en `backend/data/backup/` (no runtime)

## Diseño

Figma: https://www.figma.com/design/BVufRRcJUoDPX1a4NmrxDu/Marketplace-Web?node-id=0-1

## Documentación detallada

- [Frontend](./frontend/README.md)
- [Backend](./backend/README.md)

## Portafolio — puntos destacables

1. TypeScript end-to-end con validación Zod en el cliente
2. Separación clara server state vs client state
3. API documentada con OpenAPI
4. Estructura escalable feature-first en frontend y backend
5. Tests en backend; build estricto en frontend
