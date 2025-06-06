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

//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\


CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(100) NOT NULL
);

-- Tabela produto
CREATE TABLE produto (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  tamanho VARCHAR(50),
  preco NUMERIC(10,2) NOT NULL
);

-- Tabela pedido
CREATE TABLE pedido (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Tabela pedido_produto (tabela associativa)
CREATE TABLE pedido_produto (
  id_pedido INTEGER NOT NULL,
  id_produto INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  PRIMARY KEY (id_pedido, id_produto),
  CONSTRAINT fk_pedido FOREIGN KEY (id_pedido) REFERENCES pedido(id) ON DELETE CASCADE,
  CONSTRAINT fk_produto FOREIGN KEY (id_produto) REFERENCES produto(id)
);
