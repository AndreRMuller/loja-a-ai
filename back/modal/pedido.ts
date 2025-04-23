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


    
}