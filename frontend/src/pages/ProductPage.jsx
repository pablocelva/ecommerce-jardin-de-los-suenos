import { useParams } from "react-router-dom";
import productos from "../data/productos.json";
import { useCart } from "../context/CartContext";
import AppFooter from "../components/Footer";

const ProductPage = () => {
    // Obtener el ID del producto desde la URL
    const { id } = useParams();


    const { addToCart } = useCart();

    // Buscar el producto por su ID
    const producto = productos.find((producto) => producto.id_producto === parseInt(id));

    if (!producto) {
        return <p>Producto no encontrado</p>;
    }

    return (
        <>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h2>{producto.nombre_producto}</h2>
                <img src={producto.imagen_producto} alt={producto.nombre_producto} style={{ width: "100%", maxWidth: "600px", borderRadius: "8px", maxHeight: "400px", objectFit: "cover" }} />
                <p>{producto.descripcion}</p>
                <p><strong>Precio: ${producto.precio}</strong></p>
                <button onClick={() => addToCart(producto)}>Añadir al carrito</button>
            </div>
            <AppFooter />
        </>
    );
};

export default ProductPage;
