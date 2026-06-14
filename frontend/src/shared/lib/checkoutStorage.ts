import type { CartItem } from "@/shared/schemas";

export type PaymentMethod = "stripe" | "khipu";

export interface PendingCheckout {
  id_usuario: number;
  nombre_cliente: string;
  email_cliente: string;
  direccion: string;
  ciudad: string;
  detalle: {
    id_producto: number;
    nombre_producto: string;
    cantidad: number;
    precio_unitario: number;
  }[];
  total: number;
  estado: string;
  cartSnapshot: CartItem[];
}

const STORAGE_KEY = "pendingCheckout";

export function savePendingCheckout(data: PendingCheckout): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getPendingCheckout(): PendingCheckout | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingCheckout;
  } catch {
    return null;
  }
}

export function clearPendingCheckout(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export const PAYMENT_METHODS: {
  id: PaymentMethod;
  name: string;
  description: string;
  badge: string;
}[] = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Tarjeta de crédito o débito internacional (simulado).",
    badge: "Tarjeta",
  },
  {
    id: "khipu",
    name: "Khipu",
    description: "Transferencia bancaria en Chile (simulado).",
    badge: "Transferencia",
  },
];
