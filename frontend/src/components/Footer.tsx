import { Layout } from "antd";
//import "./App.css";
import { Typography, Space } from "antd";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';


const { Footer } = Layout;

const AppFooter = () => {
return (
    <Footer className="AppFooter">
        <Space>
            <Typography.Link href="tel:+56222333444" style={{ color: "white", display: "flex", gap: "2px", alignItems: "center" }}>
                <WhatsAppIcon style={{ fontSize: "20px" }} />
                {/* WhastApp */}
                </Typography.Link>
            <Typography.Link href="mailto:jardindelosuenos@gmail.com"
            style={{ color: "white", display: "flex", gap: "2px", alignItems: "center" }}>
                <EmailIcon style={{ fontSize: "20px" }} />
                {/* Email */}
                </Typography.Link>

            <Typography.Link href="https://www.instagram.com/jardindelosuenos/"
            style={{ color: "white", display: "flex", gap: "2px", alignItems: "center" }}>
                <InstagramIcon style={{ fontSize: "20px" }} />
                {/* Instagram */}
                </Typography.Link>
            <Typography.Link href="https://www.twitter.com/jardindelosuenos"
            style={{ color: "white", display: "flex", gap: "2px", alignItems: "center" }}>
                <TwitterIcon style={{ fontSize: "20px" }} />
                {/* Twitter */}
                </Typography.Link>
            <Typography.Link href="https://www.facebook.com/jardindelosuenos"
            style={{ color: "white", display: "flex", gap: "2px", alignItems: "center" }}>
                <FacebookIcon style={{ fontSize: "20px" }} />
                {/* Facebook */}
                </Typography.Link>
        </Space>
        <Space>
            <Typography.Link href="https://www.twitter.com/jardindelosuenos">Políticas de Privacidad</Typography.Link>
            <Typography.Link href="https://www.facebook.com/jardindelosuenos">Términos y Condiciones</Typography.Link>
        </Space>
    {/* <p>&copy; {new Date().getFullYear()} Tu Tienda de Plantas. Todos los derechos reservados.</p> */}
    </Footer>
);
};

export default AppFooter;