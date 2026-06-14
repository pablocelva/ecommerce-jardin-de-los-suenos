import AppRouter from "@/app/router/AppRouter";
import Navbar from "@/shared/components/Navbar";
import ScrollToTop from "@/shared/components/ScrollToTop";
import { ConfigProvider, Layout } from "antd";
import esES from "antd/locale/es_ES";
import { plantTheme } from "@/theme/plantTheme";
import "@/shared/styles/global.css";
import styles from "@/app/styles/AppShell.module.css";

const { Content } = Layout;

function App() {
  return (
    <ConfigProvider theme={plantTheme} locale={esES}>
      <Layout className={styles.layout}>
        <ScrollToTop />
        <Navbar />
        <Content className={styles.content}>
          <AppRouter />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
