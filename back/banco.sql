CREATE DATABASE acai;

CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL
);

CREATE TABLE produto (
  id SERIAL PRIMARY KEY,
  tamanho VARCHAR(255) NOT NULL,
  preco DECIMAL(10, 2) NOT NULL
);

CREATE TABLE adicional (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE pedido (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usurio(id),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

