import { json } from 'express';
import { client,dbQuery}from './../database';

export class Produto {

    id: number;
    tamanho: string;
    preco: number;

    public async insert():Promise<Produto|null>{
        let sql = `INSERT INTO "produto" ("id", "tamanho", "preco")
        VALUES ("$1",$2,$3) RETURNING id;`

        let params = [
            this.id,
            this.tamanho,
            this.preco
        ];

        let result = await dbQuery(sql, params);

        if(result.length > 0) {
            
            this.id = result[0].id;
            return this;
        
        }
        
        
        return null;

    }

    public async Update():Promise<Produto|null>{

        let sql = `UPDATE "produto" SET "tamanho" = 1$ "preco" = 2$ WHERE "id" = 3$;`

        let params = [
            this.tamanho,
            this.preco,
            this.id
        ];

        let result = await dbQuery(sql, params);

        if(result) {
            return this;
        }

        return null;
    }

    public async save():Promise<Produto|null>{

        if(this.id){
            return await this.Update();
        }

        return await this.insert() ;
    }

    
    
}

