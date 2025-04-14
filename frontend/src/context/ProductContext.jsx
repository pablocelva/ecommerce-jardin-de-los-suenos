import { createContext, useState, useEffect } from "react";
import productosJSON from "../data/productos.json";
import categoriasJSON from "../data/categorias.json";
const apiURL = import.meta.env.VITE_API_URL;

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener todos los productos
                const resProductos = await fetch(`${apiURL}/productos`);
                if (!resProductos.ok) throw new Error("Error al cargar los productos");
    
                const productos = await resProductos.json();
                if (!Array.isArray(productos)) throw new Error("Formato de productos inválido");
    
                // Obtener las categorías de cada producto en paralelo
                /*const productosConCategorias = await Promise.all(
                    productos.map(async (producto) => {
                        const resCategorias = await fetch(`http://localhost:3000/api/productos/categorias/${producto.id_producto}`);
    
                        if (!resCategorias.ok) {
                            console.error(`Error al cargar categorías de producto ${producto.id_producto}`);
                            return { ...producto, categorias: [] }; // Si falla, asignamos un array vacío
                        }
    
                        const categorias = await resCategorias.json();
    
                        return {
                            ...producto,
                            categorias: Array.isArray(categorias) ? categorias.map((c) => c.id_categoria) : [],
                        };
                    })
                );*/

                // Obtener categorías
                //const resCategorias = await fetch("http://localhost:3000/api/productos/categorias");
                const resCategorias = await fetch(`${apiURL}/productos/categorias`);
                if (!resCategorias.ok) throw new Error("Error al cargar las categorías");

                const categorias = await resCategorias.json();
                if (!Array.isArray(categorias)) throw new Error("Formato de categorías inválido");

    
                // Guardar los productos en el estado
                //setProductos(productosConCategorias);
                setProductos(productos);
                setCategorias(categorias);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
                //setProductos(productosJSON);
                //setCategorias(categoriasJSON);
            }
        };
    
        fetchData();
    }, []);
    
    return (
        <ProductContext.Provider value={{ productos, categorias }}>
            {children}
        </ProductContext.Provider>
    );
};



