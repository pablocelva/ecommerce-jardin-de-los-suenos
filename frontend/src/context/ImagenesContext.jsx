import { use } from 'react';
import { createContext, useState, useEffect, useContext } from 'react';

const ImagenesContext = createContext();

export const useImagenes = () => useContext(ImagenesContext);

export const ImagenesProvider = ({ children }) => {
    const [imagenes, setImagenes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/productos/imagenes')
            .then(res => res.json())
            .then(data => setImagenes(data));
    }, []);
    return (
        <ImagenesContext.Provider value={{ imagenes, setImagenes }}>
        {children}
        </ImagenesContext.Provider>
    );
};

export default ImagenesContext;