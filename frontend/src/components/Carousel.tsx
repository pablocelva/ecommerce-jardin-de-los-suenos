import { Carousel } from 'antd';

const contenido = [
    {
        imagen: 'https://plus.unsplash.com/premium_photo-1663962158789-0ab624c4f17d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        titulo: ' ¡Bienvenido!',
        descripcion: '¡Disfruta de nuestra colección de plantas y decoración 🌿!',
    },
    {
        imagen: 'https://plus.unsplash.com/premium_photo-1678382341022-0d8a8765f141?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        titulo: 'Jardin de los Sueños',
        descripcion: 'Llena tu hogar de vida y frescura 🌿',
    },
    {
        imagen: 'https://images.unsplash.com/photo-1463554050456-f2ed7d3fec09?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        titulo: 'Decoración viva',
        descripcion: 'Crea espacios naturales con nuestras plantas ✨',
    },
];

const BannerCarruselAntd = () => {
    return (
        <Carousel autoplay effect="fade">
        {contenido.map((item, index) => (
            <div key={index} className="banner-slide">
            <img src={item.imagen} alt={item.titulo} className="banner-img" />
            <div className="banner-text">
                <h2>{item.titulo}</h2>
                <p>{item.descripcion}</p>
            </div>
            </div>
        ))}
        </Carousel>
    );
};

export default BannerCarruselAntd;
