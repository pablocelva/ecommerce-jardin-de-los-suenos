const Card = ({ title, description, image, price }) => {
    const shortDescription = description.length > 50 ? description.slice(0, 50) + '...' : description;

    return (
    <div className="card">
        {/* Imagen responsiva */}
        <img src={image} alt={title} className="card-image" />

        {/* Contenido */}
        <div className="card-content">
        <h2>{title}</h2>
        <p>{shortDescription}</p>
        <p className="price">Precio: ${price}</p>
        <button >Ver Detalle</button>
        </div>
    </div>
    );
};

export default Card;
