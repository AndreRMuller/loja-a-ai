//npm install express
//npm install @types/express
//npm install cors
//npm install @types/cors
//npm install pg
//npm install @types/pg
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Usuario } from './modal/Usuario';
import { Produto } from './modal/produto';
import { Pedido } from './modal/pedido';
import { client, dbQuery } from './database';


const port = 3000; // sem `: Number`
const server = express(); // sem `: Express`

server.use(cors());
server.use(express.json());

 server.use((req: Request, res: Response, next: NextFunction) => 
    {
        console.log('[' + (new Date()) + '] ' + req.method + ' ' + req.url);
        console.log('user='+req.get('user'));
        console.log('password='+req.get('password'));
    
        let user = req.get('user');
        let password = req.get('password');
    
        //todo fazer consulta no banco
        //login com sucesso
        if (user == 'bonfa' && password == '123456')
        {
            next();
            return;
        }
    
        let erro = { "id": null, "erro" : "Falha na autenticação" };
    
        return res.status(401).json(erro);
    }); 

server.get('/login', async (req: Request, res: Response) => {
            let resultado = { "id": null, "resultado" : "Login okay" };
        
            return res.status(200).json(resultado);
        });

server.get('/usuario',  async (req: Request, res: Response)  => 
            {
                let usuarios = await Usuario.listAll();
            
                return res.status(200).json(usuarios);
            });

 server.get('/usuario/:id', async (req: Request, res: Response)  => 
                {
                    let id = Number(req.params.id);
                    let usuario = await Usuario.findOneById(id);
                
                    if ( usuario != null)
                    {
                        return res.status(200).json(usuario);
                    }
                
                    let erro = { "id": id, "erro" : "usuario não encontrada." };
                
                    return res.status(400).json(erro);
                });

 server.listen(port, () =>
    {
       console.log('Server iniciado na porta ' + port );
    });


