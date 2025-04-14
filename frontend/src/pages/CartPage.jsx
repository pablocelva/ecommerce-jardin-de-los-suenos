import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ImagenesContext from "../context/ImagenesContext";
import { useImagenes } from "../context/ImagenesContext";
import AppFooter from "../components/Footer";
import ShoppinCartIcon from '@mui/icons-material/ShoppingCart';

const CartPage = () => {
    const { cart, removeFromCart, updateCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { imagenes } = useImagenes();
    const navigate = useNavigate();

    // Función para aumentar la cantidad
    const increaseQuantity = (productId) => {
        const updatedCart = cart.map((product) => {
            if (product.id_producto === productId) {
                return { 
                    ...product, 
                    quantity: product.quantity + 1 
                };
            }
            return product;
        });
        updateCart(updatedCart);  // Actualiza el carrito en el contexto y localStorage
    };

    // Función para disminuir la cantidad
    const decreaseQuantity = (productId) => {
        const updatedCart = cart.map((product) => {
            if (product.id_producto === productId && product.quantity > 1) {
                return { 
                    ...product, 
                    quantity: product.quantity - 1 
                };
            }
            return product;
        });
        updateCart(updatedCart);  // Actualiza el carrito en el contexto y localStorage
    };

    // Calcular precio total
    const totalPrice = cart.reduce((acc, product) => acc + product.precio * product.quantity, 0);

    return (
        <>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", alignItems: "center", padding: "40px", overflow: "auto" }}>
            <h2 style={{ fontSize: "28px" }}>🛒 Carrito de Compras</h2>

            {cart.length === 0 ? (
                <p style={{ fontSize: "18px", color: "#666" }}>El carrito está vacío</p>
            ) : (
                <div style={{ width: "100%", maxWidth: "1200px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                        {cart.map((product) => {
                                //const productoImagen = imagenes?.[product.id_producto -1].url;
                                const productoImagen = imagenes?.find(img => img.id_producto === product.id_producto)?.url;

                                //console.log(productoImagen);
                                

                                return (
                                    <tr key={product.id_producto} style={{ borderBottom: "1px solid #ddd" }}>
                                        <td style={{ padding: "10px", textAlign: "center" }}>
                                            {productoImagen ? (
                                                <img src={productoImagen} alt={product.nombre_producto} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }} />
                                            ) : (
                                                <p>No disponible</p>
                                            )}
                                            <p>{product.nombre_producto}</p>
                                        </td>
                                        <td style={{ padding: "10px", textAlign: "center" }}>
                                            <button onClick={() => decreaseQuantity(product.id_producto)} style={buttonStyle}>-</button>
                                            {product.quantity}
                                            <button onClick={() => increaseQuantity(product.id_producto)} style={buttonStyle}>+</button>
                                        </td>
                                        <td style={{ padding: "10px", textAlign: "center" }}>💲{product.precio}</td>
                                        <td style={{ padding: "10px", textAlign: "center" }}>💲{(product.precio * product.quantity).toFixed(2)}</td>
                                        <td style={{ padding: "10px", textAlign: "center" }}>
                                            <button onClick={() => removeFromCart(product.id_producto)} style={removeButtonStyle}>🗑 Eliminar</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div style={{ marginTop: "20px", fontSize: "20px", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p>Total: 💲{totalPrice.toFixed(2)}</p>
                        <button onClick={() => navigate("/checkout")} style={{ display: "flex", gap: "8px", alignItems: "center", padding: "12px 24px 12px 12px", justifyContent: "center", color: "white"  }}>
                            <ShoppinCartIcon style={{ fontSize: "20px" }} />
                            Proceder a Pago</button>
                    </div>
                </div>
            )}

            {/* Botón de volver a la tienda */}
            <br />
            <br />
            <button onClick={() => navigate("/")} >⬅ Volver a la Tienda</button>
        </div>
        <AppFooter />
        </>
    );
};

// Estilos en línea para los botones
const buttonStyle = {
    padding: "4px 8px",
    //background: "#ffc107",
    color: "white",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    transition: "background 0.3s"
};

const removeButtonStyle = {
    padding: "8px 12px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    transition: "background 0.3s"
};

const checkoutButtonStyle = {
    padding: "12px 20px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.3s",
    display: "flex",
    gap: "4px",
    alignItems: "center", 
};

const backButtonStyle = {
    marginTop: "30px",
    padding: "12px 20px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.3s"
};

export default CartPage;
