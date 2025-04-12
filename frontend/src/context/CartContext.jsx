import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Cargar carrito desde localStorage al iniciar
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        //console.log("Carrito cargado desde localStorage:", storedCart);
        setCart(storedCart);
    }, []);

    // Guardar carrito en localStorage cada vez que cambie
    useEffect(() => {
        //console.log("Carrito guardado en localStorage:", cart);
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Agregar producto al carrito
    const addToCart = (product) => {
        // Verifica si el producto ya está en el carrito
        const existingProductIndex = cart.findIndex(item => item.id_producto === product.id_producto);
        
        if (existingProductIndex >= 0) {
            // Si existe, incrementa la cantidad
            const updatedCart = [...cart];
            updatedCart[existingProductIndex].quantity += 1;
            setCart(updatedCart);  // Actualiza el carrito
        } else {
            // Si no existe, agrégalo al carrito con una cantidad inicial de 1
            setCart([...cart, { ...product, quantity: 1 }]);  // Agrega el nuevo producto
        }
    
        // Guarda el carrito actualizado en localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
    };
    
        // Actualiza el carrito en el estado y en localStorage
        const updateCart = (updatedCart) => {
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        };
    // Eliminar producto del carrito
    const removeFromCart = (productId) => {
        console.log("Eliminando producto con id:", productId);
        setCart((prevCart) =>
            prevCart.filter((product) => product.id_producto !== productId)
        );
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
