import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "../schemas";

interface CartContextValue {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCart: (updatedCart: CartItem[]) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") ?? "[]") as CartItem[];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.id_producto === product.id_producto,
      );

      if (existingProductIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 1;
        return updatedCart;
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) =>
      prevCart.filter((product) => product.id_producto !== productId),
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
};
