import { client,dbQuery}from './../database';

export class Usuario {

    id: number;
    nome: string;
    email: string;
    senha: string;

    public async insert():Promise<Usuario|null>{
        let sql = `INSERT INTO "usuarios" ("id" , "nome" , "email" , "senha")
         VALUES("$1",$2,$3,$4) RETURNING id`;

        let params = [
            this.id,
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

};