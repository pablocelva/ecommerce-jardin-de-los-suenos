import { ProductContext } from "../context/ProductContext";
import { useImagenes } from "../context/ImagenesContext";
import { useState, useEffect, useContext } from "react";
import { Row, Col, Layout } from "antd";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import AppFooter from "../components/Footer";
import Carousel from "../components/Carousel";
import { api } from "../lib/api";
import { productSchema, type Categoria, type Product } from "../schemas";

const { Sider, Content } = Layout;

const Home = () => {
  const { productos, categorias } = useContext(ProductContext);
  const { imagenes } = useImagenes();
  const [data, setData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setData(productos);
    setFilteredData(productos);
  }, [productos]);

  const handleCategoryClick = async (categoria: Categoria | null) => {
    setSelectedCategory(categoria);

    try {
      const path = categoria
        ? `/productos/categorias/${categoria.id_categoria}`
        : "/productos/";
      const responseData = await api.get<unknown>(path);

      if (!Array.isArray(responseData)) {
        console.error("La API no devolvió un array de productos:", responseData);
        setFilteredData([]);
        return;
      }

      const parsed = productSchema.array().parse(responseData);
      setData(parsed);

      if (searchTerm) {
        const filtered = parsed.filter((producto) =>
          producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(parsed);
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      setFilteredData([]);
    }
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);

    if (search) {
      const filtered = data.filter((producto) =>
        producto.nombre_producto.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Layout style={{ flex: 1 }} className="layout-home">
        <Sider className="sider" width={250}>
          <p
            style={{
              cursor: "pointer",
              color: !selectedCategory ? "#24D083" : "white",
            }}
            onClick={() => handleCategoryClick(null)}
          >
            Mostrar todo
          </p>
          {categorias.map((categoria) => (
            <p
              key={categoria.id_categoria}
              style={{
                cursor: "pointer",
                color:
                  selectedCategory?.id_categoria === categoria.id_categoria
                    ? "#24D083"
                    : "white",
              }}
              onClick={() => handleCategoryClick(categoria)}
            >
              {categoria.nombre_categoria}
            </p>
          ))}
        </Sider>

        <Layout>
          <Content className="content" style={{ paddingBottom: "40px" }}>
            <Carousel />
            <SearchBar onSearch={handleSearch} />
            <h3 style={{ textAlign: "center", marginBottom: "4px" }}>
              Catálogo de Productos
            </h3>
            <Row
              gutter={[16, 16]}
              justify="center"
              style={{ minHeight: "calc(100vh - 300px)" }}
              className="card-container"
            >
              {filteredData.length > 0 ? (
                filteredData.map((producto) => {
                  const imagenesProducto = imagenes.filter(
                    (img) => img.id_producto === producto.id_producto,
                  );

                  return (
                    <Col key={producto.id_producto} xs={24} sm={24} md={12} lg={6}>
                      <Link to={`/product/${producto.id_producto}`}>
                        <Card
                          image={imagenesProducto[0]?.url || "default_image.jpg"}
                          title={producto.nombre_producto}
                          description={producto.descripcion}
                          price={producto.precio}
                        />
                      </Link>
                    </Col>
                  );
                })
              ) : (
                <Col span={24} style={{ textAlign: "center", marginTop: "20px" }}>
                  No se encontraron productos
                </Col>
              )}
            </Row>
          </Content>
        </Layout>
      </Layout>
      <AppFooter />
    </Layout>
  );
};

export default Home;
