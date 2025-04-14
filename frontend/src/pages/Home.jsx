import productosJSON from "../data/productos.json";
import { ProductContext } from "../context/ProductContext";
import ImagenesContext from "../context/ImagenesContext";
import categorias from "../data/categorias.json";
import { useState, useEffect, useContext } from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import { Layout } from "antd";
import AppFooter from "../components/Footer";
import GrassIcon from "@mui/icons-material/Grass";
import Carousel from "../components/Carousel";
const apiURL = import.meta.env.VITE_API_URL;

const { Sider, Content } = Layout;

const Home = () => {
  const { productos, categorias } = useContext(ProductContext);
  const { imagenes } = useContext(ImagenesContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setData(productos);
    setFilteredData(productos);
  }, [productos]);

  const handleCategoryClick = async (categoria) => {
    setSelectedCategory(categoria);
    
    //let url = "http://localhost:3000/api/productos/";
    let url = `${apiURL}/productos/`;
    
    if (categoria) {
      //url = `http://localhost:3000/api/productos/categorias/${categoria.id_categoria}`;
      url = `${apiURL}/productos/categorias/${categoria.id_categoria}`;
    }
    
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error("La API no devolvió un array de productos:", data);
        setFilteredData([]);
        return;
      }
      
      // Guardamos los datos de la categoría
      setData(data);
      
      // Aplicamos el término de búsqueda actual si existe
      if (searchTerm) {
        const filtered = data.filter((producto) =>
          producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }

    } catch (error) {
      console.error("Error al obtener los productos:", error);
      setFilteredData([]);
    }
  };
  
  const handleSearch = (search) => {
    setSearchTerm(search);
    
    if (search) {
      const filtered = data.filter((producto) =>
        producto.nombre_producto.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  } else {
    setFilteredData(data);
  }
};

//console.log("Categorías en el Sider:", categorias);
return (
  <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Layout style={{ flex: 1 }}>
        {/* Sidebar con categorías */}
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

        {/* Contenido principal */}
        <Layout>
          <Content className="content" style={{ marginLeft: "250px", paddingBottom: "40px" }}>
            <Carousel />
            <SearchBar onSearch={handleSearch} />
            <h3 style={{ textAlign: "center", marginBottom: "4px" }}>
              Catálogo de Productos
            </h3>
            <Row 
              gutter={[16, 16]} 
              justify="center" 
              style={{ minHeight: 'calc(100vh - 300px)' }}
            >
              {filteredData.length > 0 ? (
                filteredData.map((producto) => {
                  const imagenesProducto = imagenes.filter(
                    (img) => img.id_producto === producto.id_producto
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
                <Col span={24} style={{ textAlign: 'center', marginTop: '20px' }}>
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