import AppRouter from "./router/AppRouter";
import Navbar from './components/Navbar';
import { Layout } from 'antd';
import './App.css';

const { Header, Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        style={{ 
          position: 'fixed', 
          width: '100%', 
          zIndex: 1000,
          padding: 0,
          margin: 0,
          background: '#24D083'
        }}
      >
        <Navbar />
      </Header>
      <Content style={{ 
        marginTop: 64, 
        minHeight: 'calc(100vh - 64px)',
        padding: 0
      }}>
        <AppRouter />
      </Content>
    </Layout>
  );
}

export default App;
