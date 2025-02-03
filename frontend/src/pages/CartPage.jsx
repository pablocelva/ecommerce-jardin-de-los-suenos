import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const CartPage = () => {
    const { cart, removeFromCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

/*    useEffect(() => {
    if (!isAuthenticated) {
        navigate("/login");
    }
    }, [isAuthenticated, navigate]);*/

    //const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    return (
        <div>
        <h2>Carrito de Compras</h2>
        {cart.length === 0 ? (
        <p>El carrito está vacío</p>
        ) : (
        cart.map((product) => (
            <div key={product.id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
            <img src="https://via.placeholder.com/150" alt={product.nombre_producto} />
            <h4>{product.nombre_producto}</h4>
            <p>Cantidad: {product.quantity}</p>
            <p>Precio: ${product.precio}</p>
            <button onClick={() => removeFromCart(product.id)}>Eliminar</button>
            </div>
        ))
        )}
    </div>
    );
};
export default CartPage;