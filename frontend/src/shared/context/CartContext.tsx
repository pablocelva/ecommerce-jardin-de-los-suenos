import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/shared/schemas";
import {
  addProductToCart,
  removeProductFromCart,
} from "@/shared/lib/cartUtils";

interface CartContextValue {
  cart: CartItem[];
  cartDrawerOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCart: (updatedCart: CartItem[]) => void;
  clearCart: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") ?? "[]") as CartItem[];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => addProductToCart(prevCart, product));
  };

  const updateCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => removeProductFromCart(prevCart, productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const openCartDrawer = () => setCartDrawerOpen(true);
  const closeCartDrawer = () => setCartDrawerOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartDrawerOpen,
        addToCart,
        removeFromCart,
        updateCart,
        clearCart,
        openCartDrawer,
        closeCartDrawer,
      }}
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
