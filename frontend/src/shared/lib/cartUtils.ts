import type { CartItem, Product } from "@/shared/schemas";

export function calculateCartTotal(cart: CartItem[]): number {
  return cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);
}

export function getCartItemCount(cart: CartItem[]): number {
  return cart.reduce((acc, item) => acc + item.quantity, 0);
}

export function addProductToCart(
  cart: CartItem[],
  product: Product,
): CartItem[] {
  const existingIndex = cart.findIndex(
    (item) => item.id_producto === product.id_producto,
  );

  if (existingIndex >= 0) {
    return cart.map((item, index) =>
      index === existingIndex
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    );
  }

  return [...cart, { ...product, quantity: 1 }];
}

export function removeProductFromCart(
  cart: CartItem[],
  productId: number,
): CartItem[] {
  return cart.filter((item) => item.id_producto !== productId);
}

export function updateProductQuantity(
  cart: CartItem[],
  productId: number,
  quantity: number,
): CartItem[] {
  if (quantity < 1) {
    return removeProductFromCart(cart, productId);
  }

  return cart.map((item) =>
    item.id_producto === productId ? { ...item, quantity } : item,
  );
}

export function changeProductQuantity(
  cart: CartItem[],
  productId: number,
  delta: number,
): CartItem[] {
  const item = cart.find((entry) => entry.id_producto === productId);
  if (!item) return cart;

  return updateProductQuantity(cart, productId, item.quantity + delta);
}
