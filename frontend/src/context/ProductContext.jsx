import { createContext, useState, useEffect } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [productos, setProductos] = useState([]);

    /*useEffect(() => {
        fetch('http://localhost:3000/api/productos')
            .then(response => response.json())
            .then(data => setProductos(data))
            .catch(error => console.error('Error:', error));
        fetch('http://localhost:3000/api/productos/categorias')
            .then(response => response.json())
            .then(data => setProductos(data))
            .catch(error => console.error('Error:', error));
    }
    , []);*/

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener todos los productos
                const resProductos = await fetch("http://localhost:3000/api/productos");
    
                if (!resProductos.ok) throw new Error("Error al cargar los productos");
    
                const productos = await resProductos.json();
    
                if (!Array.isArray(productos)) throw new Error("Formato de productos inválido");
    
                // Obtener las categorías de cada producto en paralelo
                const productosConCategorias = await Promise.all(
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
                );
    
                // Guardar los productos en el estado
                setProductos(productosConCategorias);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };
    
        fetchData();
    }, []);
    

    /*useEffect(() => {
        const fetchData = async () => {
        const resProductos = await fetch("http://localhost:3000/api/productos");
        const resCategorias = await fetch("http://localhost:3000/api/productos/categorias");
    
        const productos = await resProductos.json();
        const categorias = await resCategorias.json(); // [{id_producto, id_categoria}]
    
        // Asociar los productos con sus categorías
        const productosConCategorias = productos.map((producto) => ({
            ...producto,
            categorias: categorias
            .filter((rel) => rel.id_producto === producto.id_producto)
            .map((rel) => rel.id_categoria),
        }));
    
        setProductos(productosConCategorias);
        };
    
        fetchData();
    }, []);*/
    

    return (
        <ProductContext.Provider value={{ productos }}>
            {children}
        </ProductContext.Provider>
    );
};