import { json } from 'express';
import { client,dbQuery}from './../database';
import { Usuario } from './Usuario';
import { Produto } from './produto';


export class Pedido {

    id: number;
    id_usuario: number;
    id_produto: number;
    data_criacao: Date;

    public async insert():Promise<Pedido|null>{
        let sql = `INSERT INTO "pedido" ("id_usuario", "id_produto", "data_criacao")
        VALUES ($1,$2, $3) RETURNING id;`

        let params = [
            
            this.id_usuario,
            this.id_produto,
            this.data_criacao
        ];

        let result = await dbQuery(sql, params);

        if(result.length > 0) {
            
            this.id = result[0].id;
            return this;
        
        }
        
        return null;

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
    

    static async listAll():Promise<Pedido[]>{

        let sql = `SELECT * FROM "pedido" ORDER BY id`;
        let result = await dbQuery(sql);
        let pedidos : Pedido[] = [];

        for(let i = 0; i < result.length; i++){
            let pedido = new Pedido();
            Object.assign(pedido, result[i]);
            pedidos.push(pedido);

        }

        return pedidos;

    }
    
};