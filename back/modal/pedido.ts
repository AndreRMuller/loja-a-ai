import { json } from 'express';
import { client,dbQuery}from '../database';
import { Usuario } from './Usuario';
import { Produto } from './Produto';


export class Pedido {

 id: number;
  usuario_id: number;
  data_criacao: Date;
  produtos: { id: number; nome: string; preco: number; quantidade: number }[];

  static async listByUsuario(usuario_id: number): Promise<Pedido[]> {
    let sql = `
      SELECT 
        p.id AS pedido_id,
        p.data_criacao,
        pr.id AS produto_id,
        pr.nome,
        pr.preco,
        pp.quantidade
      FROM pedido p
      JOIN pedido_produto pp ON p.id = pp.id_pedido
      JOIN produto pr ON pr.id = pp.id_produto
      WHERE p.usuario_id = $1
      ORDER BY p.data_criacao DESC;
    `;

    let result = await dbQuery(sql, [usuario_id]);

    let pedidosMap = new Map<number, Pedido>();

    for (let row of result) {
      let pedido = pedidosMap.get(row.pedido_id);
      if (!pedido) {
        pedido = new Pedido();
        pedido.id = row.pedido_id;
        pedido.usuario_id = usuario_id;
        pedido.data_criacao = row.data_criacao;
        pedido.produtos = [];
        pedidosMap.set(row.pedido_id, pedido);
      }
      pedido.produtos.push({
        id: row.produto_id,
        nome: row.nome,
        preco: row.preco,
        quantidade: row.quantidade,
      });
    }

    return Array.from(pedidosMap.values());
  }


   public async delete():Promise<Pedido|null>{

        let sql = `DELETE FROM "pedido" WHERE "id" = $1 RETURNING id;`

        let resultado = await dbQuery(sql,[this.id]);

        if(resultado.length > 0) {
            this.id = resultado[0].id;
            return this;
        }
        return null;
    }


    static async findOneById(id:number):Promise<Pedido|null>{

        let sql = `SELECT * FROM "pedido" WHERE "id" = $1 LIMIT 1;`

        let result = await dbQuery(sql,[id]);

        if(result.length > 0) {

            let pedido = new Pedido();
            Object.assign(pedido, result[0]);
            pedido.id = result[0].id;
            return pedido;
        }
        return null;
    }
    

    static async listAll(): Promise<Pedido[]> {
  const sql = `
    SELECT
      p.id AS pedido_id,
      p.usuario_id,
      p.data_criacao,
      pr.id AS produto_id,
      pr.nome,
      pr.preco,
      pp.quantidade
    FROM pedido p
    LEFT JOIN pedido_produto pp ON p.id = pp.id_pedido
    LEFT JOIN produto pr ON pp.id_produto = pr.id
    ORDER BY p.id, pr.nome;
  `;

  const result = await dbQuery(sql);

  const pedidosMap = new Map<number, Pedido>();

  for (const row of result) {
    let pedido = pedidosMap.get(row.pedido_id);
    if (!pedido) {
      pedido = new Pedido();
      pedido.id = row.pedido_id;
      pedido.usuario_id = row.usuario_id; 
      pedido.data_criacao = row.data_criacao;
      pedido.produtos = [];
      pedidosMap.set(row.pedido_id, pedido);
    }

    if (row.produto_id) {
      pedido.produtos.push({
        id: row.produto_id,
        nome: row.nome,
        preco: row.preco,
        quantidade: row.quantidade,
      });
    }
  }

  return Array.from(pedidosMap.values());
}
public async insert(): Promise<Pedido | null> {
  const sql = `INSERT INTO pedido (usuario_id, data_criacao) VALUES ($1, $2) RETURNING id;`;
  const params = [this.usuario_id, this.data_criacao];

  const result = await dbQuery(sql, params);

  if (result.length > 0) {
    this.id = result[0].id;
    return this;
  }
  return null;
}

public async addProduto(produto_id: number, quantidade: number): Promise<void> {
  const sql = `
    INSERT INTO pedido_produto (id_pedido, id_produto, quantidade)
    VALUES ($1, $2, $3)
    ON CONFLICT (id_pedido, id_produto)
    DO UPDATE SET quantidade = pedido_produto.quantidade + EXCLUDED.quantidade;
  `;
  await dbQuery(sql, [this.id, produto_id, quantidade]);
}

static async buscarProdutos(id_pedido: number) {
  const sql = `
    SELECT p.id, p.nome, p.preco, pp.quantidade
    FROM pedido_produto pp
    JOIN produto p ON p.id = pp.id_produto
    WHERE pp.id_pedido = $1
  `;
  const rows = await dbQuery(sql, [id_pedido]);
  return rows;
}

static async criar(usuario_id: number): Promise<Pedido | null> {
  const sql = `INSERT INTO pedido (usuario_id) VALUES ($1) RETURNING *;`;
  const result = await dbQuery(sql, [usuario_id]);

  if (result.length > 0) {
    const pedido = new Pedido();
    Object.assign(pedido, result[0]);
    return pedido;
  }

  return null;
}
    
};