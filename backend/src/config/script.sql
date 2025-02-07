CREATE DATABASE softjobs;
\c softjobs;

CREATE TABLE usuarios ( 
    id SERIAL, 
    email VARCHAR(50) NOT NULL, 
    password VARCHAR(60) NOT NULL, 
    rol VARCHAR(25), 
    lenguage VARCHAR(20) 
);

--INSERT INTO usuarios values
--(DEFAULT, 'admin@softjobs.com', '123456', 'admin', 'Inglés'),
--(DEFAULT, 'manager@softjobs.com', 'abcdefg', 'manager', 'Inglés');

{
    "email": "admin@softjobs.com",
    "password": "123456",
    "rol": "admin",
    "lenguage": "english"
}
{
    "email": "manager@softjobs.com",
    "password": "abcdeg",
    "rol": "manager",
    "lenguage": "spanish"
}

SELECT * FROM usuarios;