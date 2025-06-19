const apiUrl = "http://localhost:3000";
let user = localStorage.getItem('user');
let password = localStorage.getItem('password');

async function verificaLogin()
{
    let resultado = await buscarLogin(user, password);

    if (!resultado)
    {
        window.location = 'login.html';
    }
}

async function buscarLogin(user, password)
{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('user', user);
    myHeaders.append('password', password);

    const options = {
        method: 'GET',
        headers: myHeaders
    };

    let result = await fetch(apiUrl+"/login", options);
    let resultado = await result.json();
    console.log(resultado);

    if (resultado.resultado == 'Login okay')
    {
        return true;
    }

    return false;
}

async function login()
{
    let user = document.getElementById('user').value;
    let password = document.getElementById('password').value;

    console.log('user='+user);
    console.log('password='+password);
    
    let resultado = await buscarLogin(user, password);

    if (resultado)
    {
        window.location = 'index.html';
        localStorage.setItem('user', user);
        localStorage.setItem('password', password);
    }
    else
    {
        alert("Falha no login!");
    }
}

async function listarUsuario()
{
    const myHeaders = new Headers();
    myHeaders.append('user', user);
    myHeaders.append('password', password);

    const options = {
        headers: myHeaders,
        method: "GET",
        redirect: "follow"
    };
      
    let result = await fetch(apiUrl+"/usuario", options);
    let pessoas = await result.json();
    let html = '';

    for (let i=0; i < pessoas.length; i++)
    {
        let pessoa = pessoas[i];

        if (!pessoa)
        {
            continue;
        }

        let excluir = `<button onclick="excluirUsuario(${pessoa.id})">Excluir</button>`;
        let editar = `<button onclick="editarUsuario(${pessoa.id})">Editar</button>`;
        let viagemBtn = `<button onclick="addViagem(${pessoa.id})">Add viagem</button>`;
        let viagens = usuario.viagens;
        let viagensHtml = "";

        for (let x= 0; x < viagens.length ; x ++)
        {
            let viagem = viagens[x];
            viagensHtml += `<div style="font-size:80%">
            <b>Partida:</b> ${viagem.dataHoraPartida} </br>
            <b>Chegada:</b> ${viagem.dataHoraChegada} </br>
            <b>Destino:</b> ${viagem.destino} </br>
            <button onclick="removerViagem(${pessoa.id},${viagem.id})">Excluir viagem</button> </br>
            </br>
            </div>`;
        }

        html += `
        <tr>
            <td>${excluir}<br/>${editar}<br/>${viagemBtn}</td>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${pessoa.idade}</td>
            <td>${pessoa.cidade}</td>
            <td>${pessoa.siglaUf}</td>
            <td>${viagensHtml}</td>
        </tr>
        `;
    }

    document.getElementById('tbody-pessoas').innerHTML = html;
}

async function gravarUsuario()
{
    let id = pegarParametro('id');
    let method = id == null ? 'POST' : 'PUT';
    let url = id == null ? "/usuario" : "/usuario/"+id;

    let pessoa = {
        "nome": document.getElementById('nome').value,
        "cpf": document.getElementById('cpf').value,
        "idade": document.getElementById('idade').value,
        "cidade": document.getElementById('cidade').value,
        "siglaUf": document.getElementById('siglaUf').value
    };
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('user', user);
    myHeaders.append('password', password);

    const options = {
        method: method,
        body: JSON.stringify(usuario),
        headers: myHeaders,
        redirect: "follow"
    };

    let result = await fetch(apiUrl+url, options);
    let pessoaResult = await result.json();
    console.log(pessoaResult);

    if (pessoaResult.nome)
    {
        alert("Usuario cadastrado com sucesso!");
        window.location = "index.html"
    }
    else
    {
        //pessoaResult.erros
        alert("Erro ao cadastrar usuario!");
    }

    console.log(usuario);
}

function pressEnter()
{
    if (event.key === 'Enter')
    {
        gravarPessoa();
    } 
}

async function excluirUsuario(id)
{
    if (confirm("Deseja realmente excluir?"))
    {
        const myHeaders = new Headers();
        myHeaders.append('user', user);
        myHeaders.append('password', password);
        
        const options = {
            method: "DELETE",
            redirect: "follow",
            headers: myHeaders
        };
        
        let result = await fetch(apiUrl+"/usuario/"+id, options)
        let json = await result.json();

        console.log(json);

        if (json.okay = true)
        {
            alert("Usuario excluído com sucesso!");
            window.location.reload();
        }
        else
        {
            alert("Problemas em excluir o usuario!");
        }

        console.log(json);
    }
}

async function editarUsuario(id)
{
    window.location = "usuario.html?id="+id;
}

function pegarParametro(parametro)
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(parametro)
}

async function carregarUsuario()
{
    let id = pegarParametro('id');

    if (id != null)
    {
        document.getElementById('h1').innerHTML = 'Editar usuario';

        const myHeaders = new Headers();
        myHeaders.append('user', user);
        myHeaders.append('password', password);

        const options = {
            method: "GET",
            headers: myHeaders
        };

        let result = await fetch(apiUrl+"/usuario/"+id, options);
        let pessoa = await result.json();

        document.getElementById('nome').value = usuario.nome;
        document.getElementById('cpf').value = usuario.cpf;
        document.getElementById('idade').value = usuario.idade;
        document.getElementById('cidade').value = usuario.cidade;
        setSelectValue('siglaUf', usuario.siglaUf);
    }
}

function setSelectValue(id, inVal)
{
    let dl = document.getElementById(id);
    let el = 0;

    for (let i=0; i<dl.options.length; i++)
    {
        console.log(dl.options[i])
        if (dl.options[i].value == inVal)
        {
            el=i;
            break;
        }
    }
    console.log(el);
    dl.selectedIndex = el;
}

async function carregarEstados()
{
    const url = "https://brasilapi.com.br/api/ibge/uf/v1";
    let resultado = await fetch(url);
    let estados = await resultado.json();
    let html = '';
    
    for (let i=0; i<estados.length; i++)
    {
        let estado = estados[i];
        
        html += `<option value="${estado.sigla}">
            ${estado.nome}
            </option>`;
    }

    document.getElementById('siglaUf').innerHTML = html;
}

function addViagem(id)
{
    window.location = 'viagem.html?id='+id;
}

async function gravarViagem()
{
    let id = pegarParametro('id');
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('user', user);
    myHeaders.append('password', password);

    const raw = {
        "destino": document.getElementById('destino').value,
        "dataHoraPartida": document.getElementById('partida').value,
        "dataHoraChegada": document.getElementById('chegada').value
    };

    console.log(raw);
    
    const options = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: "follow"
    };

    let result = await fetch(apiUrl+"/usuario/"+id+"/adicionarviagem", options)
    let json = await result.json();

    if ( json.nome )
    {
        alert("Viagem adicionada com sucesso!");
        window.location = "index.html";
    }
    else
    {
        alert("Deu problema filhote!");
    }
}

async function removerViagem(id, idViagem)
{
    const myHeaders = new Headers();
    myHeaders.append('user', user);
    myHeaders.append('password', password);

    const options = {
        method: "POST",
        redirect: "follow",
        headers: myHeaders
    };

    let result = await fetch(apiUrl+"/usuario/"+id+"/removerviagem/"+idViagem, options)
    let json = await result.json();

    console.log(json);

    if ( json.okay = true )
    {
        alert("Viagem removida com sucesso!");
        window.location = "index.html";
    }
    else
    {
        alert("Deu problema filhote!");
    }
}

