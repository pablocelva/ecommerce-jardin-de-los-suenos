interface CardProps {
  title: string;
  description: string;
  image: string;
  price: number;
}

const Card = ({ title, description, image, price }: CardProps) => {
  const shortDescription =
    description.length > 50 ? `${description.slice(0, 50)}...` : description;

  return (
    <div className="card">
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h2>{title}</h2>
        <p>{shortDescription}</p>
        <p className="price">Precio: ${price}</p>
        <button type="button">Ver Detalle</button>
      </div>
    </div>
  );
};

export default Card;
