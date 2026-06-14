import { describe, expect, it } from "vitest";
import type { CartItem, Product } from "@/shared/schemas";
import {
  addProductToCart,
  calculateCartTotal,
  changeProductQuantity,
  getCartItemCount,
  removeProductFromCart,
  updateProductQuantity,
} from "./cartUtils";

const mockProduct: Product = {
  id_producto: 1,
  nombre_producto: "Monstera",
  descripcion: "Planta de interior",
  precio: 25.5,
  stock: 10,
};

const mockCartItem: CartItem = { ...mockProduct, quantity: 2 };

describe("cartUtils", () => {
  it("addProductToCart agrega un producto nuevo", () => {
    const cart = addProductToCart([], mockProduct);
    expect(cart).toHaveLength(1);
    expect(cart[0]?.quantity).toBe(1);
  });

  it("addProductToCart incrementa cantidad si ya existe", () => {
    const cart = addProductToCart([mockCartItem], mockProduct);
    expect(cart[0]?.quantity).toBe(3);
  });

  it("removeProductFromCart elimina por id", () => {
    const cart = removeProductFromCart([mockCartItem], 1);
    expect(cart).toHaveLength(0);
  });

  it("updateProductQuantity actualiza cantidad", () => {
    const cart = updateProductQuantity([mockCartItem], 1, 5);
    expect(cart[0]?.quantity).toBe(5);
  });

  it("updateProductQuantity elimina si cantidad es menor a 1", () => {
    const cart = updateProductQuantity([mockCartItem], 1, 0);
    expect(cart).toHaveLength(0);
  });

  it("changeProductQuantity aplica delta", () => {
    const cart = changeProductQuantity([mockCartItem], 1, -1);
    expect(cart[0]?.quantity).toBe(1);
  });

  it("calculateCartTotal suma precio * cantidad", () => {
    expect(calculateCartTotal([mockCartItem])).toBe(51);
  });

  it("getCartItemCount suma unidades totales", () => {
    expect(getCartItemCount([mockCartItem])).toBe(2);
  });
});
