import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

//export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Cargar carrito desde localStorage al iniciar
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    // Guardar carrito en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Agregar producto al carrito
    const addToCart = (product) => {
        setCart((prevCart) => {
        const existingProduct = prevCart.find((p) => p.id === product.id);
        if (existingProduct) {
            return prevCart.map((p) =>
            p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
            );
        }
        return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    // Eliminar producto del carrito
    const removeFromCart = (productId) => {
        setCart((prevCart) =>
        prevCart.filter((product) => product.id !== productId)
        );
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
        {children}
        </CartContext.Provider>
    );
};
export const useCart = () => useContext(CartContext);