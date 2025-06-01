import { json } from 'express';
import { client,dbQuery}from './../database';

export class Produto {

    id: number;
    nome: string;
    tamanho: string;
    preco: number;

    public async insert():Promise<Produto|null>{
        let sql = `INSERT INTO "produto" ("nome","tamanho", "preco")
        VALUES ($1,$2,$3) RETURNING id;`

        let params = [
            
            this.nome,
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

    public async update():Promise<Produto|null>{

        let sql = `UPDATE "produto" SET "nome" = $1, "tamanho" = $2, "preco" = $3 WHERE "id" = $4;`

        let params = [
            this.nome,
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
            return await this.update();
        }

        return await this.insert() ;
    }

    public async delete():Promise<Produto|null>{
    
            let sql = `DELETE FROM "produto" WHERE "id" = $1 RETURNING id;`
    
            let resultado = await dbQuery(sql,[this.id]);
    
            if(resultado.length > 0) {
                this.id = resultado[0].id;
                return this;
            }
            return null;
        }

        static async findOneById(id:number):Promise<Produto|null>{

            let sql = `SELECT * FROM "produto" WHERE "id" = $1 LIMIT 1;`
    
            let result = await dbQuery(sql,[id]);
    
            if(result.length > 0) {
    
                let produto = new Produto();
                Object.assign(produto, result[0]);
                produto.id = result[0].id;
                return produto;
            }
            return null;
        }

        static async listAll():Promise<Produto[]>{

            let sql = `SELECT * FROM "produto" ORDER BY id`;
            let result = await dbQuery(sql);
            let produtos : Produto[] = [];
    
            for(let i = 0; i < result.length; i++){
                let produto = new Produto();
                Object.assign(produto,result[i]);
                produtos.push(produto);
    
            }
    
            return produtos;
    
        }

    
    
}

