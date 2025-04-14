import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { message } from "antd";
import { ProductContext } from "../context/ProductContext";
import ImagenesContext from "../context/ImagenesContext"; // Contexto para obtener imágenes
import { useCart } from "../context/CartContext";
import AppFooter from "../components/Footer";

const ProductPage = () => {
    const { productos } = useContext(ProductContext);
    const { imagenes } = useContext(ImagenesContext); // Obtener imágenes desde el contexto
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const producto = productos.find((producto) => producto.id_producto === parseInt(id));

    if (!producto) {
        return <p style={{ textAlign: "center", fontSize: "18px", marginTop: "20px" }}>Producto no encontrado</p>;
    }

    // Filtrar imágenes asociadas al producto
    const imagenesProducto = imagenes.filter(img => img.id_producto === parseInt(id));

    return (
        <>
            <div style={{
                padding: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "40px",
                flexWrap: "wrap",
                maxWidth: "1000px",
                margin: "auto",
                height: "calc(100vh - 128px)"
            }}>
                {/* Carrusel de imágenes del producto */}
                <div style={{ flex: "1", maxWidth: "400px" }}>
                    {imagenesProducto.length > 1 ? (
                        <div style={{ display: "flex", overflowX: "auto", gap: "10px" }}>
                            {imagenesProducto.map((img) => (
                                <img
                                    key={img.id_imagen}
                                    src={img.url}
                                    alt={`Imagen de ${producto.nombre_producto}`}
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "2px",
                                        cursor: "pointer",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <img 
                            src={imagenesProducto[0]?.url || "placeholder.jpg"} 
                            alt={producto.nombre_producto} 
                            style={{ 
                                width: "100%", 
                                borderRadius: "2px",
                                maxHeight: "400px", 
                                objectFit: "cover",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                            }} 
                        />
                    )}
                </div>

                {/* Información del producto */}
                <div style={{ flex: "1", maxWidth: "500px" }}>
                    <h2 style={{ fontSize: "28px", marginBottom: "10px" }}>{producto.nombre_producto}</h2>
                    <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#555", marginBottom: "20px" }}>
                        {producto.descripcion}
                    </p>
                    {/* <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#555", marginBottom: "20px" }}>
                        Cuidados: {producto.cuidado}
                    </p> */}

                    <p style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
                        Precio: ${producto.precio}
                    </p>
                    <br />
                    <button 
                        onClick={() => navigate(-1)}
                        style={{ padding: "12px 20px", fontSize: "16px", background: "transparent", color: "#1F7D53", border: "#1F7D53 solid 2px", borderRadius: "0", cursor: "pointer", transition: "background 0.3s", marginRight: "10px" }}
                    >
                        ⬅ Volver
                    </button>
                    <button 
                        onClick={() => {
                            addToCart(producto);
                            message.success(`🛒 Agregado al carrito: ${producto.nombre_producto}`);
                        }}
                        style={{ transition: "background 0.3s", marginRight: "10px" }}
                        
                    >
                        🛒 Añadir al carrito
                    </button>
        
                    {/* <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#555", marginBottom: "20px" }}>
                        Tags: {producto.tags}
                    </p> */}
                </div>
            </div>
            
            <AppFooter />
        </>
    );
};

export default ProductPage;
