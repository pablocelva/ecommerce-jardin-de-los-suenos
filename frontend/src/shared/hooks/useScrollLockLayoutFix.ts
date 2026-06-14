import { useLayoutEffect } from "react";

/** Atributo que rc-util usa en la etiqueta `<style>` inyectada al bloquear scroll. */
const LOCKER_ATTR = "rc-util-key";
const LOCKER_KEY_PREFIX = "rc-util-locker-";

const WIDTH_CALC_PATTERN = /\s*width:\s*calc\([^)]+\)\s*;?/g;

function getScrollLockerStyles(): HTMLStyleElement[] {
  return Array.from(
    document.querySelectorAll<HTMLStyleElement>(
      `style[${LOCKER_ATTR}^="${LOCKER_KEY_PREFIX}"]`,
    ),
  );
}

/** Quita el width: calc(...) redundante cuando html ya usa scrollbar-gutter: stable. */
function stripRedundantWidthFromLockers() {
  getScrollLockerStyles().forEach((styleEl) => {
    const css = styleEl.textContent;
    if (!css?.includes("width: calc")) return;
    styleEl.textContent = css.replace(WIDTH_CALC_PATTERN, "");
  });
}

function syncScrollLockLayoutFix() {
  const locked = getScrollLockerStyles().length > 0;

  if (locked) {
    stripRedundantWidthFromLockers();
    document.body.style.width = "100%";
    document.body.style.maxWidth = "none";
    return;
  }

  document.body.style.removeProperty("width");
  document.body.style.removeProperty("max-width");
}

/**
 * Evita el layout shift cuando Ant/rc-util bloquea el scroll del body.
 * rc-util inyecta `width: calc(100% - scrollbar)`; con scrollbar-gutter: stable
 * eso comprime el layout. Este hook neutraliza ese ancho sin usar !important.
 */
export function useScrollLockLayoutFix() {
  useLayoutEffect(() => {
    syncScrollLockLayoutFix();

    const observer = new MutationObserver(syncScrollLockLayoutFix);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [LOCKER_ATTR],
    });

    return () => {
      observer.disconnect();
      document.body.style.removeProperty("width");
      document.body.style.removeProperty("max-width");
    };
  }, []);
}
