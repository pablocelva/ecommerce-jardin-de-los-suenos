import { use } from 'react';
import { createContext, useState, useEffect, useContext } from 'react';
import productosJSON from '../data/productos.json';
const apiURL = import.meta.env.VITE_API_URL;

const ImagenesContext = createContext();

export const useImagenes = () => useContext(ImagenesContext);

export const ImagenesProvider = ({ children }) => {
    const [imagenes, setImagenes] = useState([]);

    useEffect(() => {
        fetch(`${apiURL}/productos/imagenes`)
            .then(res => res.json())
            .then(data => setImagenes(data))
            .catch(error => {
                console.error("Error obteniendo imágenes, usando datos locales:", error);
                // Si hay error en la API, usa el JSON local
                setImagenes(productosJSON.map(producto => ({ id_producto: producto.id_producto,url: producto.imagen_producto })));
            });
    }, []);
    return (
        <ImagenesContext.Provider value={{ imagenes, setImagenes }}>
        {children}
        </ImagenesContext.Provider>
    );
};

export default ImagenesContext;