const Card = ({ title, description, image, price }) => {
    return (
    <div className="card">
        {/* Imagen responsiva */}
        <img src={image} alt={title} className="card-image" />

        {/* Contenido */}
        <div className="card-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <p className="price">Precio: ${price}</p>
        <button >Ver Detalle</button>
        </div>
    </div>
    );
};

export default Card;
