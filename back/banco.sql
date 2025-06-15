CREATE DATABASE acai;

CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(100) NOT NULL
);

CREATE TABLE produto (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  tamanho VARCHAR(50),
  preco NUMERIC(10,2) NOT NULL
);

CREATE TABLE pedido (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE pedido_produto (
  id_pedido INTEGER NOT NULL,
  id_produto INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  PRIMARY KEY (id_pedido, id_produto),
  CONSTRAINT fk_pedido FOREIGN KEY (id_pedido) REFERENCES pedido(id) ON DELETE CASCADE,
  CONSTRAINT fk_produto FOREIGN KEY (id_produto) REFERENCES produto(id)
);
