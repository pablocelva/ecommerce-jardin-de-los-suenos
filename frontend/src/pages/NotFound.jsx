import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div>
            <h2>Page Not Found</h2>
            <Link to="/">Volver a la página de inicio</Link>
        </div>
    )
};

export default NotFound;