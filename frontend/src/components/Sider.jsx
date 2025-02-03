import { Layout } from 'antd';

const { Sider } = Layout;

const App = () => {
    return (
        <Layout>
            <Sider>
                <h2>Sider de Ant Design</h2>
                <p>Plantas de Interior</p>
                <p>Plantas de Exterior</p>
                <p>Suculentas</p>
                <p>Cactus</p>
                <p>Hierbas Armoáticas</p>
                <p>Flores Ornamentales</p>
                <p>Bonsáis</p>
                <p>Orquídeas</p>
            </Sider>
        </Layout>
    );
};

export default App;
