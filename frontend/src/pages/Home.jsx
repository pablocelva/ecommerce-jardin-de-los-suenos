import productos from "../data/productos.json";
import { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(productos);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <SearchBar />
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Lista de Productos</h3>
      <Row gutter={[16, 16]} justify="center">
        {data.map((producto) => (
          <Col key={producto.id_producto} xs={24} sm={24} md={12} lg={6}>
            <Link to={`/product/${producto.id_producto}`}>
              <Card
                image={producto.imagen_producto}
                title={producto.nombre_producto}
                description={producto.descripcion}
                price={producto.precio}
              />
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
