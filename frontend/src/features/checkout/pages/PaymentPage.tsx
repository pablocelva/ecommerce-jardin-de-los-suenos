import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Radio,
  Row,
  Spin,
  Tag,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  CreditCardOutlined,
  HomeOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useCart } from "@/shared/context/CartContext";
import AppFooter from "@/shared/components/Footer";
import { api } from "@/shared/lib/api";
import {
  clearPendingCheckout,
  getPendingCheckout,
  PAYMENT_METHODS,
  type PaymentMethod,
} from "@/shared/lib/checkoutStorage";
import { showError, showSuccess } from "@/shared/lib/alerts";
import styles from "./PaymentPage.module.css";

const { Title, Text, Paragraph } = Typography;

const PaymentPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [processing, setProcessing] = useState(false);
  const pending = getPendingCheckout();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId || !pending || cart.length === 0) {
      navigate("/checkout", { replace: true });
    }
  }, [pending, cart.length, navigate]);

  if (!pending || cart.length === 0) {
    return (
      <div className={styles.page}>
        <div className={`${styles.container} ${styles.loading}`}>
          <Spin size="large" tip="Redirigiendo…" />
        </div>
      </div>
    );
  }

  const handleSimulatePayment = async () => {
    setProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const { cartSnapshot: _, ciudad: __, ...orderData } = pending;

      await api.post("/pedidos", {
        ...orderData,
        estado: "pending",
      });

      clearCart();
      clearPendingCheckout();

      await showSuccess(
        "¡Compra confirmada!",
        "Gracias por tu compra. Recibirás la confirmación en tu correo.",
      );
      navigate("/");
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      await showError(
        "Error en el pago",
        "No se pudo completar el pago simulado. Intenta nuevamente.",
      );
    } finally {
      setProcessing(false);
    }
  };

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb
          className={styles.breadcrumb}
          items={[
            {
              title: (
                <Link to="/">
                  <HomeOutlined /> Inicio
                </Link>
              ),
            },
            {
              title: <Link to="/checkout">Checkout</Link>,
            },
            { title: "Pago" },
          ]}
        />

        <Title level={2} className={styles.title}>
          <LockOutlined /> Método de pago
        </Title>
        <Paragraph type="secondary" className={styles.subtitle}>
          Selecciona un proveedor. Este paso simula la integración con Stripe o
          Khipu.
        </Paragraph>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={14}>
            <Card className={styles.card} title="Elige cómo pagar">
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className={styles.methods}
              >
                {PAYMENT_METHODS.map((method) => (
                  <Radio
                    key={method.id}
                    value={method.id}
                    className={styles.methodOption}
                  >
                    <div className={styles.methodContent}>
                      <div className={styles.methodHeader}>
                        <CreditCardOutlined className={styles.methodIcon} />
                        <div>
                          <Text strong>{method.name}</Text>
                          <Tag color="green" className={styles.methodBadge}>
                            {method.badge}
                          </Tag>
                        </div>
                      </div>
                      <Text type="secondary">{method.description}</Text>
                    </div>
                  </Radio>
                ))}
              </Radio.Group>

              <Divider />

              <div className={styles.simulationNote}>
                <SafetyCertificateOutlined />
                <Text type="secondary">
                  Pago simulado — no se realizará ningún cargo real. En
                  producción aquí se redirigiría al checkout de{" "}
                  {selectedMethod?.name}.
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <Card className={styles.summaryCard} title="Resumen">
              <div className={styles.summaryRow}>
                <Text>Cliente</Text>
                <Text>{pending.nombre_cliente}</Text>
              </div>
              <div className={styles.summaryRow}>
                <Text>Productos</Text>
                <Text>{pending.detalle.length}</Text>
              </div>
              <div className={styles.summaryRow}>
                <Text>Método</Text>
                <Text strong>{selectedMethod?.name}</Text>
              </div>

              <Divider />

              <div className={styles.summaryTotal}>
                <Text strong>Total a pagar</Text>
                <Title level={3} className={styles.summaryPrice}>
                  ${pending.total.toFixed(2)}
                </Title>
              </div>

              <Button
                type="primary"
                size="large"
                block
                loading={processing}
                onClick={handleSimulatePayment}
                className={styles.submitBtn}
              >
                {processing
                  ? "Procesando pago…"
                  : `Confirmar pago con ${selectedMethod?.name}`}
              </Button>

              <Link to="/checkout">
                <Button
                  block
                  type="link"
                  icon={<ArrowLeftOutlined />}
                  disabled={processing}
                >
                  Volver al checkout
                </Button>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
      <AppFooter />
    </div>
  );
};

export default PaymentPage;
