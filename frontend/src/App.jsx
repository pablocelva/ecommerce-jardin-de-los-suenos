import AppRouter from "./router/AppRouter";
import Navbar from './components/Navbar';
import AppFooter from './components/Footer';
import { Flex, Layout } from 'antd';
import './App.css';

const { Header, Sider, Content } = Layout;

function App() {
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      {/* Navbar en la parte superior */}
      <Header className="navbar" style={{ padding: 20 }} >
        <Navbar />
      </Header>

      {/* <Layout style={{ height: 'calc(100vh - 64px)' }}> */}
        {/* Sidebar a la izquierda */}
        {/* <Sider className="sider">
          <p>Categorías</p>
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
        </Sider> */}

        {/* Contenido a la derecha del Sider */}
        <Layout>
          <Content className="content">
            <AppRouter /> {/* El contenido de las rutas va aquí */}
          </Content>
          {/* Footer en la parte inferior */}
        </Layout>
        {/* <AppFooter /> */}
      {/* </Layout> */}
    </Layout>
  );
}

export default App;
