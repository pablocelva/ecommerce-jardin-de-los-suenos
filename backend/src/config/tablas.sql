CREATE DATABASE ecommerce;
\c ecommerce;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    direccion TEXT,
    telefono VARCHAR(30),
    rol VARCHAR(20) CHECK (rol IN ('admin', 'cliente')) DEFAULT 'cliente',
    imagen_perfil TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar primer usuario (admin)
INSERT INTO usuarios (id_usuario, email, password, nombre, apellido, direccion, telefono, rol, imagen_perfil, fecha_creacion)
VALUES 
(1, 'admin@example.com', 'hashed_password_admin', 'Admin', 'User', '123 Admin St, Ciudad Ejemplo', '+1234567890', 'admin', 'https://example.com/admin-profile.jpg', '2025-01-28T12:00:00');

-- Insertar segundo usuario (cliente1)
INSERT INTO usuarios (id_usuario, email, password, nombre, apellido, direccion, telefono, rol, imagen_perfil, fecha_creacion)
VALUES 
(2, 'cliente1@example.com', 'hashed_password_cliente1', 'Juan', 'Pérez', '456 Cliente Ln, Ciudad Ejemplo', '+9876543210', 'cliente', 'https://example.com/juan-profile.jpg', '2025-01-28T12:01:00');

-- Insertar tercer usuario (cliente2)
INSERT INTO usuarios (id_usuario, email, password, nombre, apellido, direccion, telefono, rol, imagen_perfil, fecha_creacion)
VALUES 
(3, 'cliente2@example.com', 'hashed_password_cliente2', 'Ana', 'Martínez', '789 Calle Ejemplo, Ciudad Ejemplo', '+1122334455', 'cliente', 'https://example.com/ana-profile.jpg', '2025-01-28T12:02:00');

-- Insertar cuarto usuario (cliente3)
INSERT INTO usuarios (id_usuario, email, password, nombre, apellido, direccion, telefono, rol, imagen_perfil, fecha_creacion)
VALUES 
(4, 'cliente3@example.com', 'hashed_password_cliente3', 'Luis', 'Gómez', '101 Cliente Rd, Ciudad Ejemplo', '+5566778899', 'cliente', 'https://example.com/luis-profile.jpg', '2025-01-28T12:03:00');

-- Insertar quinto usuario (cliente4)
INSERT INTO usuarios (id_usuario, email, password, nombre, apellido, direccion, telefono, rol, imagen_perfil, fecha_creacion)
VALUES 
(5, 'cliente4@example.com', 'hashed_password_cliente4', 'María', 'López', '202 Avenida Planta, Ciudad Ejemplo', '+4455667788', 'cliente', 'https://example.com/maria-profile.jpg', '2025-01-28T12:04:00');

-- Tabla de productos
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    stock INT NOT NULL CHECK (stock >= 0),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO productos (nombre_producto, descripcion, precio, stock, fecha_creacion) VALUES
('Monstera Deliciosa', 'Planta de interior popular con hojas grandes y vistosas.', 25.99, 10, '2025-01-28T12:00:00'),
('Suculenta Jade', 'Planta suculenta de bajo mantenimiento.', 12.99, 30, '2025-01-28T12:05:00'),
('Cactus Echinopsis', 'Cactus ornamental con flores vistosas.', 9.99, 50, '2025-01-28T12:10:00'),
('Lavanda', 'Hierba aromática ideal para jardines y decoraciones.', 14.99, 20, '2025-01-28T12:15:00'),
('Hiedra Inglesa', 'Planta trepadora ideal para decoración de interiores y exteriores.', 18.99, 15, '2025-01-28T12:20:00'),
('Rosa Roja', 'Flor ornamental perfecta para regalar.', 7.99, 100, '2025-01-28T12:25:00'),
('Bonsái de Pino', 'Bonsái con estilo japonés tradicional.', 49.99, 5, '2025-01-28T12:30:00'),
('Palma Areca', 'Palma ideal para interiores y decoración.', 29.99, 8, '2025-01-28T12:35:00'),
('Orquídea Phalaenopsis', 'Orquídea ornamental de fácil cuidado.', 19.99, 12, '2025-01-28T12:40:00'),
('Helecho Boston', 'Planta ideal para decoración de interiores.', 15.99, 18, '2025-01-28T12:45:00'),
('Cactus San Pedro', 'Cactus de crecimiento rápido, ideal para exteriores.', 15.99, 25, '2025-01-28T12:50:00'),
('Aloe Vera', 'Planta suculenta medicinal de fácil cuidado.', 10.99, 40, '2025-01-28T12:55:00');

-- Tabla de categorías
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO categorias (id_categoria, nombre_categoria) VALUES
(1, 'Plantas de Interior'),
(2, 'Plantas de Exterior'),
(3, 'Suculentas'),
(4, 'Cactus'),
(5, 'Hierbas Aromáticas'),
(6, 'Plantas Trepadoras'),
(7, 'Flores Ornamentales'),
(8, 'Bonsáis'),
(9, 'Palmas'),
(10, 'Orquídeas'),
(11, 'Monsteras'),
(12, 'Helechos');


-- Tabla intermedia para la relación productos-categorías (muchos a muchos)
CREATE TABLE categorias_productos (
    id_producto INT REFERENCES productos(id_producto) ON DELETE CASCADE,
    id_categoria INT REFERENCES categorias(id_categoria) ON DELETE CASCADE,
    PRIMARY KEY (id_producto, id_categoria)
);
-- Producto 1: Monstera Deliciosa
INSERT INTO categorias_productos (id_producto, id_categoria) VALUES
(1, 1),  -- interior
(1, 11);  -- monstera

-- Producto 2: Suculenta Jade
INSERT INTO categorias_productos (id_producto, id_categoria) VALUES
(2, 1),  -- interior
(2, 3);  -- suculenta

-- Producto 3: Cactus Echinopsis
INSERT INTO categorias_productos (id_producto, id_categoria) VALUES
(3, 2),  -- exterior
(3, 4);  -- cactus

-- Producto 4: Lavanda
INSERT INTO categorias_productos (id_producto, id_categoria) VALUES
(4, 2),  -- exterior
(4, 5);  -- hierba

-- Producto 5: Hiedra Inglesa
INSERT INTO categorias_productos (id_producto, id_categoria) VALUES
(5, 1),  -- interior
(5, 6);  -- trepadora

-- Producto 6: Rosa Roja
INSERT INTO categorias_productos (id_producto, id_categoria) VALUES
(6, 2),  -- exterior
(6, 7);  -- flor

-- Producto 7: Bonsái de Pino
INSERT INTO categorias_productos (id_producto, id_categoria) VALUES
(7, 1),  -- interior
(7, 8);  -- bonsai

-- Producto 8: Palma Areca
INSERT INTO categorias_productos (id_producto, id_categoria) VALUES
(8, 1),  -- interior
(8, 9);  -- palma

-- Producto 9: Orquídea Phalaenopsis
INSERT INTO categorias_productos (id_producto, id_categoria) VALUES
(9, 1),  -- interior
(9, 10);  -- orquidea

-- Producto 10: Helecho Boston
INSERT INTO categorias_productos (id_producto, id_categoria) VALUES
(10, 1),  -- interior
(10, 12);  -- helechos

-- Producto 11: Cactus San Pedro
INSERT INTO categorias_productos (id_producto, id_categoria) VALUES
(11, 2),  -- exterior
(11, 4);  -- cactus

-- Producto 12: Aloe Vera
INSERT INTO categorias_productos (id_producto, id_categoria) VALUES
(12, 1),  -- interior
(12, 3);  -- suculenta

-- Producto 13: Ruda
INSERT INTO categorias_productos (id_producto, id_categoria) VALUES
(13, 2),  -- exterior
(13, 5);  -- hierba


-- Tabla para imágenes de productos (1 producto puede tener muchas imágenes)
CREATE TABLE imagenes_producto (
    id_imagen SERIAL PRIMARY KEY,
    id_producto INT REFERENCES productos(id_producto) ON DELETE CASCADE,
    url TEXT NOT NULL
);

-- Insertar imagen para el producto 1
INSERT INTO imagenes_producto (id_producto, url)
VALUES (1, 'https://images.unsplash.com/photo-1530049478161-0780526964f4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Insertar imagen para el producto 2
INSERT INTO imagenes_producto (id_producto, url)
VALUES (2, 'https://images.unsplash.com/photo-1594336874658-6110582818bd?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Insertar imagen para el producto 3
INSERT INTO imagenes_producto (id_producto, url)
VALUES (3, 'https://images.unsplash.com/photo-1628748243729-d4c0cd38b70c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Insertar imagen para el producto 4
INSERT INTO imagenes_producto (id_producto, url)
VALUES (4, 'https://images.unsplash.com/photo-1627976435198-05d4fce10b4f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Insertar imagen para el producto 5
INSERT INTO imagenes_producto (id_producto, url)
VALUES (5, 'https://images.unsplash.com/photo-1648212947389-06dd0acf060a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Insertar imagen para el producto 6
INSERT INTO imagenes_producto (id_producto, url)
VALUES (6, 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?q=80&w=1001&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Insertar imagen para el producto 7
INSERT INTO imagenes_producto (id_producto, url)
VALUES (7, 'https://images.unsplash.com/photo-1526397751294-331021109fbd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Insertar imagen para el producto 8
INSERT INTO imagenes_producto (id_producto, url)
VALUES (8, 'https://plus.unsplash.com/premium_photo-1681256187605-2d66160926a2?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Insertar imagen para el producto 9
INSERT INTO imagenes_producto (id_producto, url)
VALUES (9, 'https://images.unsplash.com/photo-1561120560-94e54f4f68b0?q=80&w=1138&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Insertar imagen para el producto 10
INSERT INTO imagenes_producto (id_producto, url)
VALUES (10, 'https://images.unsplash.com/photo-1727636914828-9c7288d0a3b9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Insertar imagen para el producto 11
INSERT INTO imagenes_producto (id_producto, url)
VALUES (11, 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Insertar imagen para el producto 12
INSERT INTO imagenes_producto (id_producto, url)
VALUES (12, 'https://images.unsplash.com/photo-1569745358610-b01866003860?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Insertar imagen para el producto 13
INSERT INTO imagenes_producto (id_producto, url)
VALUES (13, 'https://entresemillas.com/2238-large_default/ruda-planta.jpg');
-- Insertar imagen para el producto 14
INSERT INTO imagenes_producto (id_producto, url)
VALUES (14, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSY3eA8AQP5XbbYkA2CyDw9XhBwokCXqyPfrrqzm1orEw5Voz2yUr8o75cVFoIGjxr8fJUV6UCGMG3eFVCfEcOID90VBZnzrbO1WKZvhdRXHZKk02gN6YSb&usqp=CAE');
-- Insertar imagen para el producto 15
INSERT INTO imagenes_producto (id_producto, url)
VALUES (15, 'https://images.unsplash.com/photo-1722554086475-f11257a9eb6d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Tabla de órdenes (pedidos)
CREATE TABLE orders (
    id_compra SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    precio_total DECIMAL(10, 2) NOT NULL CHECK (precio_total >= 0),
    detalle JSONB NOT NULL,
    direccion TEXT NOT NULL,
    estado VARCHAR(50) CHECK (estado IN ('pending', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_envio TIMESTAMP 
);

-- Insertar primer pedido
INSERT INTO orders (id_compra, id_usuario, precio_total, detalle, direccion, estado, fecha_compra)
VALUES 
(1, 2, 64.97, 
'[
    {"id_producto": 1, "nombre_producto": "Monstera Deliciosa", "cantidad": 2, "precio_unitario": 25.99, "subtotal": 51.98},
    {"id_producto": 2, "nombre_producto": "Suculenta Jade", "cantidad": 1, "precio_unitario": 12.99, "subtotal": 12.99}
]', 
'Dirección de Ana Martínez', 
'pending', 
'2025-01-28T14:00:00');

-- Insertar segundo pedido
INSERT INTO orders (id_compra, id_usuario, precio_total, detalle, direccion, estado, fecha_compra)
VALUES 
(2, 3, 84.92, 
'[
    {"id_producto": 4, "nombre_producto": "Lavanda", "cantidad": 3, "precio_unitario": 14.99, "subtotal": 44.97},
    {"id_producto": 6, "nombre_producto": "Rosa Roja", "cantidad": 5, "precio_unitario": 7.99, "subtotal": 39.95}
]', 
'Dirección de Carlos Rodríguez', 
'shipped', 
'2025-01-28T14:30:00');

-- Insertar tercer pedido
INSERT INTO orders (id_compra, id_usuario, precio_total, detalle, direccion, estado, fecha_compra)
VALUES 
(3, 4, 105.93, 
'[
    {"id_producto": 8, "nombre_producto": "Palma Areca", "cantidad": 1, "precio_unitario": 29.99, "subtotal": 29.99},
    {"id_producto": 10, "nombre_producto": "Helecho Boston", "cantidad": 2, "precio_unitario": 15.99, "subtotal": 31.98},
    {"id_producto": 12, "nombre_producto": "Aloe Vera", "cantidad": 4, "precio_unitario": 10.99, "subtotal": 43.96}
]', 
'Dirección de María Fernández', 
'pending', 
'2025-01-28T15:00:00');

-- Insertar cuarto pedido
INSERT INTO orders (id_compra, id_usuario, precio_total, detalle, direccion, estado, fecha_compra)
VALUES 
(4, 5, 59.94, 
'[
    {"id_producto": 3, "nombre_producto": "Cactus Echinopsis", "cantidad": 6, "precio_unitario": 9.99, "subtotal": 59.94}
]', 
'Dirección de Luis Gómez', 
'cancelled', 
'2025-01-28T15:30:00');

-- Insertar quinto pedido
INSERT INTO orders (id_compra, id_usuario, precio_total, detalle, direccion, estado, fecha_compra)
VALUES 
(5, 2, 89.97, 
'[
    {"id_producto": 7, "nombre_producto": "Bonsái de Pino", "cantidad": 1, "precio_unitario": 49.99, "subtotal": 49.99},
    {"id_producto": 9, "nombre_producto": "Orquídea Phalaenopsis", "cantidad": 2, "precio_unitario": 19.99, "subtotal": 39.98}
]', 
'Dirección de Laura Sánchez', 
'shipped', 
'2025-01-28T16:00:00');
