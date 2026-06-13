import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useImagenes } from "../context/ImagenesContext";
import { api } from "../lib/api";
import AppFooter from "../components/Footer";
import ShoppinCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { checkoutSchema } from "../schemas";
import { showError, showSuccess, showWarning } from "../lib/alerts";
import type { User } from "../schemas";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { imagenes } = useImagenes();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") ?? "null") as User | null;

    if (user) {
      setUserData({
        nombre: user.nombre || "",
        direccion: user.direccion || "",
        ciudad: user.ciudad || "",
        email: user.email || "",
      });
    }
  }, [navigate]);

  const totalPrice = cart
    .reduce((total, product) => total + product.precio * product.quantity, 0)
    .toFixed(2);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    try {
      const parsed = checkoutSchema.safeParse(userData);

      if (!parsed.success) {
        await showWarning(
          "Campos incompletos",
          parsed.error.errors[0]?.message ?? "Por favor completa todos los campos.",
        );
        return;
      }

      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }

      const detalle = cart.map((item) => ({
        id_producto: item.id_producto,
        nombre_producto: item.nombre_producto,
        cantidad: item.quantity,
        precio_unitario: parseFloat(String(item.precio)),
      }));

      const orderData = {
        id_usuario: parseInt(userId, 10),
        nombre_cliente: parsed.data.nombre,
        email_cliente: parsed.data.email,
        detalle,
        total: parseFloat(totalPrice),
        estado: "pending",
        direccion: parsed.data.direccion,
      };

      await api.post("/pedidos", orderData);

      clearCart();
      await showSuccess(
        "¡Compra confirmada!",
        "Gracias por tu compra. Recibirás la confirmación en tu correo.",
      );
      navigate("/");
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      await showError(
        "Error en la compra",
        "Hubo un error al procesar tu compra. Por favor, intenta nuevamente.",
      );
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>📦 Checkout</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            maxWidth: "1000px",
            width: "100%",
            marginBottom: "30px",
          }}
        >
          {cart.map((product) => {
            const productoImagen = imagenes?.find(
              (img) => img.id_producto === product.id_producto,
            )?.url;

            return (
              <div
                key={product.id_producto}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "white",
                  textAlign: "center",
                }}
              >
                <img
                  src={productoImagen}
                  alt={product.nombre_producto}
                  style={{
                    width: "100%",
                    maxWidth: "150px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <h4 style={{ margin: "10px 0" }}>{product.nombre_producto}</h4>
                <p style={{ fontSize: "16px", color: "#555" }}>
                  Cantidad: {product.quantity}
                </p>
                <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                  💲{(product.precio * product.quantity).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
            width: "100%",
            maxWidth: "600px",
            marginBottom: "30px",
          }}
        >
          <h4>Información de Envío</h4>
          {(
            [
              { field: "nombre", label: "Nombre" },
              { field: "email", label: "Email" },
              { field: "direccion", label: "Dirección" },
              { field: "ciudad", label: "Ciudad" },
            ] as const
          ).map(({ field, label }) => (
            <div key={field}>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={label}
                value={userData[field]}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                  width: "400px",
                  minWidth: "300px",
                  maxWidth: "600px",
                }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "200px",
            marginBottom: "30px",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          <span>Total</span>
          <span>💲{totalPrice}</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {isEditing ? (
            <button
              type="button"
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                background: "transparent",
                color: "#1F7D53",
                border: "2px solid #1F7D53",
              }}
              onClick={() => setIsEditing(false)}
            >
              <SaveIcon style={{ fontSize: "20px" }} />
              Guardar Cambios
            </button>
          ) : (
            <button
              type="button"
              style={{ display: "flex", gap: "8px", alignItems: "center" }}
              onClick={() => setIsEditing(true)}
            >
              <EditIcon style={{ fontSize: "20px" }} />
              Editar Información
            </button>
          )}

          <button
            type="button"
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
            onClick={handleCheckout}
          >
            <ShoppinCartIcon style={{ fontSize: "20px" }} />
            Confirmar Compra
          </button>
        </div>
        <br />
        <br />
        <button
          type="button"
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            background: "transparent",
            color: "#1F7D53",
            border: "2px solid #1F7D53",
          }}
        >
          <ShoppinCartIcon style={{ fontSize: "20px" }} />
          <Link to="/cart" style={{ color: "#1F7D53", textDecoration: "none" }}>
            Volver al Carrito
          </Link>
        </button>
      </div>
      <AppFooter />
    </>
  );
};

export default CheckoutPage;
