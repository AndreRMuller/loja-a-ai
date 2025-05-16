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

server.post('/usuario', async (req: Request, res: Response): Promise<Response> => 
    {
        let usuario = new Usuario();
        usuario.nome = req.body.nome;
        usuario.email = req.body.email;
        usuario.senha = req.body.senha;
        
    
        let erros : string[] = usuario.validate();
    
        if (erros.length > 0)
        {
            let json = {"erros":erros};
            return res.status(400).json(json);
        }
    
        await usuario.insert();
    
        if (usuario.id)
        {
            return res.status(200).json(usuario);    
        }
    
        let erro = { "id": null, "erro" : "Erro ao inserir usuario." };
    
        return res.status(400).json(erro);
    });

    server.put('/usuario/:id', async (req: Request, res: Response): Promise<Response> => 
        {
            let id = Number(req.params.id);
            let usuario = await Usuario.findOneById(id);
        
            if (usuario == null)
            {
                let erro = { "id": id, "erro" : "usuario não encontrada." };
                return res.status(400).json(erro);
            }
        
            usuario.nome = req.body.nome;
            usuario.email = req.body.email;
            usuario.senha = req.body.senha;
            
            
            console.log(usuario);
        
            let erros : string[] = usuario.validate();
        
            if (erros.length > 0)
            {
                let json = {"erros":erros};
                return res.status(400).json(json);
            }
        
            usuario.update();

if ( usuario.id)
{
    return res.status(200).json(usuario);    
}

let erro = { "id": id, "erro" : "Erro ao editar usuario." };
return res.status(400).json(erro);
});

server.delete('/usuario/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let usuario = await Usuario.findOneById(id);

    await usuario?.delete();

    let retorno = {"okay" : true };
    return res.status(200).json(usuario);
});


server.get('/produto/', async (req: Request, res: Response): Promise<Response> => {
    const produtos = await Produto.listAll();
    return res.status(200).json(produtos);
});

server.get('/produto/:id', async(req: Request, res: Response): Promise<Response> => {
    let id = Number(req.params.id);
    let produto = await Produto.findOneById(id);

    if ( produto != null)
    {
        return res.status(200).json(produto);
    }

    let erro = { "id": id, "erro" : "produto não encontrada." };

    return res.status(400).json(erro);

});

server.post('/produto', async (req: Request, res: Response): Promise<Response> => 
    {
        let produto = new Produto();
        produto.tamanho = req.body.tamanho;
        produto.preco = req.body.preco;
        
        await produto.insert();
    
        if (produto.id)
        {
            return res.status(200).json(produto);    
        }
    
        let erro = { "id": null, "erro" : "Erro ao inserir produto." };
    
        return res.status(400).json(erro);
    });

server.put('/produto/:id', async (req: Request, res: Response): Promise<Response> => {

    let id = Number(req.params.id);
    let produto = await Produto.findOneById(id);

    if (produto == null)
    {
        let erro = { "id": id, "erro" : "produto não encontrada." };
        return res.status(400).json(erro);
    }

    produto.tamanho = req.body.tamanho;
    produto.preco = req.body.preco;
    
    console.log(produto);

    produto.update();

        if ( produto.id)
        {
            return res.status(200).json(produto);    
        }

    let erro = { "id": id, "erro" : "Erro ao editar produto." };
    return res.status(400).json(erro);
});    

server.delete('/produto/:id', async (req: Request, res: Response): Promise<Response> => 
{
    let id = Number(req.params.id);
    let produto = await Produto.findOneById(id);

    await produto?.delete();

    let retorno = {"okay" : true };
    return res.status(200).json(produto);
});

 


 server.listen(port, () =>
    {
       console.log('Server iniciado na porta ' + port );
    });


