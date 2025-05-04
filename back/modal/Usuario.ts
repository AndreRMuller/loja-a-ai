import { json } from 'express';
import { client,dbQuery}from './../database';

export class Usuario {

    id: number;
    nome: string;
    email: string;
    senha: string;

    validate() : string[] {

        let errors:string[] = [];

        if ( this.nome.length == 0)
            {
                errors.push("Nome é obrigatório.");
            }

        if ( this.email.length == 0)
            {
                errors.push("Nome é obrigatório.");
            }
        if ( this.senha.length == 0)
            {
                errors.push("Nome é obrigatório.");
            }
         
        return errors;
      
    }

    public async insert():Promise<Usuario|null>{
        let sql = `INSERT INTO "usuario" ( "nome" , "email" , "senha")
         VALUES($1,$2,$3) RETURNING id;`;

        let params = [
         
            this.nome,
            this.email,
            this.senha
        ];

        let result = await dbQuery(sql, params);

        if(result.length > 0) {
            
            this.id = result[0].id;
            return this;
        
        }

         return null;

    }

    public async update():Promise<Usuario|null>{

        let sql = `UPDATE "usuario" SET "nome" = $1, "senha" = $2 WHERE "id" = $3 ;`

        let params = [
            this.nome,
            this.senha,
            this.id
        ];

        let result = await dbQuery(sql, params);

        if(result) {
            return this;
        }

        return null;
    }

    public async save():Promise<Usuario|null>{

        if(this.id){
            return await this.update();
        }

        return await this.insert() ;
    }


    public async delete():Promise<Usuario|null>{

        let sql = `DELETE FROM "usuario" WHERE "id" = $1 RETURNING id;`

        let resultado = await dbQuery(sql,[this.id]);

        if(resultado.length > 0) {
            this.id = resultado[0].id;
            return this;
        }
        return null;
    }

    static async findOneById(id:number):Promise<Usuario|null>{

        let sql = `SELECT * FROM "usuario" WHERE "id" = $1 LIMIT 1;`

        let result = await dbQuery(sql,[id]);

        if(result.length > 0) {

            let usuario = new Usuario();
            Object.assign(usuario, result[0]);
            usuario.id = result[0].id;
            return usuario;
        }
        return null;
    }
    static async listAll():Promise<Usuario[]>{

        let sql = `SELECT * FROM "usuario" ORDER BY id`;
        let result = await dbQuery(sql);
        let usuarios : Usuario[] = [];

        for(let i = 0; i < result.length; i++){
            let usuario = new Usuario();
            Object.assign(usuario, json);
            usuarios.push(usuario);

        }

        return usuarios;

    }

    
    

};