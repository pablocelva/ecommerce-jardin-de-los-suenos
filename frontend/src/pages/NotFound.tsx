import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2>Page Not Found</h2>
            <Link to="/">Volver a la página de inicio</Link>
        </div>
    )
};

export default NotFound;