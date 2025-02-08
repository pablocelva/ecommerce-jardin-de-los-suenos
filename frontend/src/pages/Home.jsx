import productos from "../data/productos.json";
import { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import { Layout } from "antd";
import AppFooter from "../components/Footer";

const { Sider, Content } = Layout;

const Home = () => {
  const [data, setData] = useState([]);

  /*let dataFiltrada = data.filter((producto) => {
    return producto.nombre_producto.toLowerCase().includes(search.toLowerCase());
  });

  if (search) {
    setData(dataFiltrada);
  }*/

  useEffect(() => {
    setData(productos);
  }, []);

  return (
    <Layout style={{ minHeight: "calc(100vh)" }}>
    <Layout style={{ minHeight: "calc(100vh - 64px)" }}>
      {/* Sidebar a la izquierda */}
      <Sider className="sider" width={250}>
        <p style={{ color: "#24D083"}}>Categorías</p>
        <p>Plantas de Interior</p>
        <p>Plantas de Exterior</p>
        <p>Suculentas</p>
        <p>Cactus</p>
        <p>Hierbas Aromáticas</p>
        <p>Flores Ornamentales</p>
        <p>Bonsáis</p>
        <p>Orquídeas</p>
        <p>Monsteras</p>
        <p>Helechos</p>
      </Sider>

      {/* Contenido principal */}
      <Layout>
        <Content className="content" style={{marginLeft: "250px"} }>
          <SearchBar />
          <h3 style={{ textAlign: "center", marginBottom: "20px"}}>Lista de Productos</h3>
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
        </Content>
      </Layout>
      </Layout>
      <AppFooter />
    </Layout>
  );
};

export default Home;
