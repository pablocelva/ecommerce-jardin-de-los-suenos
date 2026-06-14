# Guía de estilos — Ant Design + CSS Modules

Documento de referencia para el equipo frontend de **Jardín de los Sueños**.

## Resumen

El proyecto usa **dos capas complementarias**, no competidoras:

| Capa | Responsabilidad | Ubicación |
|------|-----------------|-----------|
| **Ant Design** | UI funcional: componentes, formularios, tablas, modales, accesibilidad básica, estados (loading, disabled) | JSX: `<Button>`, `<Form>`, `<Card>`, etc. |
| **`plantTheme`** | Design system global de Ant: color primario, radios, tipografía, overrides de Layout/Menu/Card | `src/theme/plantTheme.ts` |
| **`tokens.ts`** | Fuente única de valores (colores, radios, fuente) compartida por Ant y CSS | `src/theme/tokens.ts` |
| **CSS Modules** | Layout de página, branding por feature, hover/animaciones, ajustes puntuales al DOM de Ant | `*.module.css` junto al componente |
| **`global.css`** | Reset, tipografía base y referencias a variables CSS | `src/shared/styles/global.css` |

---

## Reglas del equipo

### 1. Ant Design primero para UI interactiva

Usar Ant Design cuando necesites:

- Formularios con validación (`Form`, `Input`, `Select`)
- Tablas, paginación, modales, drawers, spinners
- Componentes con comportamiento ya resuelto (breadcrumb, empty, tags)

**No reimplementar** inputs, modales ni tablas a mano salvo caso excepcional.

### 2. CSS Modules para layout y marca

Usar CSS Modules cuando necesites:

- Estructura de página (grid, secciones, hero, sidebar)
- Espaciados y tamaños específicos del negocio
- Efectos visuales (hover de cards, overlays, carruseles)
- Responsive por feature

Cada página o componente visualmente distintivo tiene su `Nombre.module.css` **en la misma carpeta** que el `.tsx`.

### 3. Tokens antes que hex sueltos

**Fuente única:** `src/theme/tokens.ts`

- Los colores y radios de `plantTheme.ts` importan desde `tokens.ts`.
- Al arrancar la app, `applyCssVariables()` inyecta `--color-*` y `--radius-*` en `:root`.
- En CSS Modules, preferir `var(--color-primary)` en lugar de `#2d6a4f`.

```css
/* ✅ Correcto */
.card {
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

/* ❌ Evitar en código nuevo */
.card {
  border: 1px solid #e9f5ee;
}
```

Si añades un color de marca nuevo, agrégalo primero en `tokens.ts` y en `cssVariables`.

### 4. Personalizar Ant: orden de preferencia

1. **`plantTheme.ts`** — cambios globales (color primario, border-radius de todos los botones)
2. **Props del componente** — `type`, `size`, `danger`, `block`
3. **CSS Module con `:global(.ant-…)`** — solo dentro del contenedor scoped del módulo
4. **`!important`** — último recurso, documentar por qué si es inevitable (especificidad de Ant)

```css
/* Ajustar Card de Ant solo dentro de ProductCard */
.card :global(.ant-card-body) {
  padding: 14px 16px;
}
```

**No** volver a un `App.css` global monolítico.

### 5. Sin estilos inline salvo excepción

Evitar `style={{ … }}` en JSX. Preferir clases del módulo.

Excepciones aceptables:

- Valores dinámicos (`backgroundImage: url(...)` en hero de blog)
- Props de Ant que exigen objeto (`styles` / `classNames` del Drawer cuando no hay alternativa limpia — preferir `classNames` del módulo)

### 6. Estructura de archivos

```
features/checkout/pages/
├── CheckoutPage.tsx
└── CheckoutPage.module.css   ← estilos solo de checkout

shared/components/
├── ProductCard.tsx
└── ProductCard.module.css    ← estilos solo de la card
```

No mezclar estilos de varias features en un solo módulo.

### 7. Variables CSS disponibles

Definidas en `tokens.ts` → inyectadas como:

| Variable | Uso típico |
|----------|------------|
| `--color-primary` | Botones, enlaces, precios |
| `--color-primary-dark` | Títulos, fondos oscuros |
| `--color-primary-hover` | Hover de botones legacy |
| `--color-navbar` | Barra superior |
| `--color-surface` | Fondo de página |
| `--color-border` | Bordes de cards y paneles |
| `--color-accent` / `--color-accent-light` | Iconos, footer, acentos |
| `--color-text-primary` | Texto principal |
| `--color-text-secondary` | Párrafos |
| `--color-text-muted` | Texto secundario |
| `--radius-card` | Cards |
| `--radius-button` | Botones |
| `--font-family-base` | Tipografía (alineada con Ant) |

Lista completa en `src/theme/tokens.ts`.

---

## Flujo de decisión rápido

```
¿Es un input, tabla, modal o flujo con validación?
  → Ant Design (+ plantTheme si aplica a todo el sitio)

¿Es layout de página, grid, hero o animación?
  → CSS Module del feature

¿Cambia el verde primario en toda la app?
  → tokens.ts + plantTheme.ts

¿Hay que retocar padding de .ant-card dentro de MI componente?
  → CSS Module con :global(.ant-…) en el contenedor padre
```

---

## Convivencia en la práctica

```tsx
// App.tsx — Ant envuelve; el módulo maqueta el shell
<ConfigProvider theme={plantTheme} locale={esES}>
  <Layout className={styles.layout}>
    <Content className={styles.content}>
      <CheckoutPage />
    </Content>
  </Layout>
</ConfigProvider>
```

```tsx
// ProductCard.tsx — Ant provee Card/Button; el módulo define look & feel
<Card className={styles.card} cover={<div className={styles.cover}>…</div>}>
  <Button className={styles.actionBtn}>Añadir</Button>
</Card>
```

---

## Tests y estilos

Los tests usan jsdom. `applyCssVariables()` se ejecuta en `src/test/setup.ts` para que `var(--color-*)` funcione en CSS Modules durante Vitest.

---

## Deuda técnica conocida

| Área | Estado | Acción |
|------|--------|--------|
| Tokens unificados | ✅ Implementado | Mantener `tokens.ts` como fuente única |
| Migración CSS Modules | ✅ Completa | No reintroducir CSS global por página |
| Módulos con hex legacy | 🔄 En progreso | Ir reemplazando por `var(--color-*)` al tocar archivos |
| AdminPanel | 🔄 Mejorado | Layout en módulo; seguir migrando secciones |
| Bundle principal (~735 KB) | Pendiente | `manualChunks` en Vite |

---

## Referencias

- [Ant Design Theme](https://ant.design/docs/react/customize-theme)
- [CSS Modules (Vite)](https://vite.dev/guide/features#css-modules)
- README frontend: sección **CSS** y **Tests**
