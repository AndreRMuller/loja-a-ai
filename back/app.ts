//npm install express
//npm install @types/express
//npm install cors
//npm install @types/cors
//npm install pg
//npm install @types/pg
import express, { Express, Request, Response, NextFunction, request, response } from 'express';
import cors from 'cors';
import { Usuario } from './modal/Usuario';
import { Produto } from './modal/Produto';
import { Pedido } from './modal/Pedido';
import { client, dbQuery } from './database';

const usuarios = [
  { nome: 'bonfa', senha: '123456' }
];

const port = 3000; 
const server = express(); 

server.use(cors());
server.use(express.json());


server.post('/login', (req: Request, res: Response) => {
  const { user, password } = req.body;

  if (user === 'bonfa' && password === '123456') {
    return res.status(200).json({ id: 1, resultado: 'Login okay' });
  }

  return res.status(401).json({ id: null, erro: 'Falha na autenticação' });
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
        produto.nome = req.body.nome;
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

    produto.nome = req.body.nome;
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

server.get('/pedido', async (req: Request, res: Response): Promise<Response> => {

  const pedidos = await Pedido.listAll();

  return res.status(200).json(pedidos);
});

server.get('/pedido/usuario/:id', async (req: Request, res: Response): Promise<Response> => {

  const id_usuario = Number(req.params.id);

  const pedidos = await Pedido.listByUsuario(id_usuario);

   for (let pedido of pedidos) {
    pedido.produtos = await Pedido.buscarProdutos(pedido.id);
  }

  return res.status(200).json(pedidos);
});

server.get('/pedido/:id', async (req: Request, res: Response): Promise<Response> => {

     let id = Number(req.params.id);
    let pedido = await Pedido.findOneById(id);

    if ( pedido != null)
    {
        return res.status(200).json(pedido);
    }

    let erro = { "id": id, "erro" : "pedido não encontrada." };

    return res.status(400).json(erro);

});

server.post('/pedido', async (req: Request, res: Response): Promise<Response> => {
  const { usuario_id } = req.body;

  const pedido = await Pedido.criar(usuario_id);

  if (pedido && pedido.id) {
    return res.status(200).json(pedido);
  }

  return res.status(400).json({ erro: 'Erro ao criar pedido' });
});

server.delete('/pedido/:id', async (req: Request, res: Response): Promise<Response> => {
  
    let id = Number(req.params.id);
    let pedido = await Pedido.findOneById(id);

    await pedido?.delete();

    let retorno = {"okay" : true };
    return res.status(200).json(pedido);

});

server.post('/pedido/:id/produto', async (req: Request, res: Response) => {
  const pedido_id = Number(req.params.id);
  const { produto_id, quantidade } = req.body;

  const pedido = await Pedido.findOneById(pedido_id);
  if (!pedido) {
    return res.status(404).json({ erro: 'Pedido não encontrado' });
  }

  await pedido.addProduto(produto_id, quantidade);
  return res.status(200).json({ okay: true });
});


 server.listen(port, () =>
    {
       console.log('Server iniciado na porta ' + port );
    });


