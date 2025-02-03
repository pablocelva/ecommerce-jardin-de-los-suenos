import { useParams } from "react-router-dom";
import productos from "../data/productos.json";

const ProductPage = () => {
    // Obtener el ID del producto desde la URL
    const { id } = useParams();

    // Buscar el producto por su ID
    const producto = productos.find((producto) => producto.id_producto === parseInt(id));

    if (!producto) {
        return <p>Producto no encontrado</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
        <h2>{producto.nombre_producto}</h2>
        <img src={producto.imagen_producto} alt={producto.nombre_producto} style={{ width: "100%", maxWidth: "600px" }} />
        <p>{producto.descripcion}</p>
        <p><strong>Precio: ${producto.precio}</strong></p>
        <button>Comprar</button>
        </div>
    );
};

export default ProductPage;
