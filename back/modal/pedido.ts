import { json } from 'express';
import { client,dbQuery}from './../database';
import { Usuario } from './Usuario';
import { Produto } from './produto';


export class Pedido {

    id: number;
    id_usuario: number;
    id_produto: number;
    data_criacaoata: Date;

    public async insert():Promise<Pedido|null>{
        let sql = `INSERT INTO "pedido" ("id", "id_usuario", "id_produto", "data_criacaoata")
        VALUES ($1,$2, $3, $4) RETURNING id;`

        let params = [
            this.id,
            this.id_usuario,
            this.id_produto,
            this.data_criacaoata
        ];

        let result = await dbQuery(sql, params);

        if(result.length > 0) {
            
            this.id = result[0].id;
            return this;
        
        }
        
        
        return null;

    }


    
}