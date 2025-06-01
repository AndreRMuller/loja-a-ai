CREATE DATABASE acai;

CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL
);

CREATE TABLE produto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    tamanho VARCHAR(50)
);


CREATE TABLE pedido (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuario(id),
  produto_id INTEGER REFERENCES produto(id),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedido_produto (
    id SERIAL PRIMARY KEY,
    id_pedido INT REFERENCES pedido(id),
    id_produto INT REFERENCES produto(id),
    quantidade INT DEFAULT 1
);

