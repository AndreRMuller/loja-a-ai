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

async function buscarLogin(user, password) {
  const response = await fetch(apiUrl + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, password }),
  });

  const resultado = await response.json();

  if (resultado.resultado === "Login okay") {
    return true;
  }
  return false;
}

async function login() {
  let user = document.getElementById("user").value;
  let password = document.getElementById("password").value;

  const response = await fetch(apiUrl + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, password }),
  });

  const resultado = await response.json();

  if (resultado.resultado === "Login okay") {
    localStorage.setItem("user", user);
    localStorage.setItem("password", password);
    localStorage.setItem("usuario_id", resultado.id);
  } else {
    alert("Falha no login!");
  }
}

async function listarUsuario() {
  const headers = new Headers();
  headers.append('user', user);
  headers.append('password', password);

  const response = await fetch(apiUrl + "/usuario", {
    method: "GET",
    headers: headers
  });

  const usuarios = await response.json();

  let html = "";

  usuarios.forEach(u => {
    html += `
      <tr>
        <td>
          <button onclick="excluirUsuario(${u.id})">Excluir</button>
          <button onclick="editarUsuario(${u.id})">Editar</button>
        </td>
        <td>${u.nome}</td>
        <td>${u.email}</td>
      </tr>
    `;
  });

  document.getElementById('tbody-pessoas').innerHTML = html;
}

async function gravarUsuario() {
  let id = pegarParametro('id');
  let method = id ? 'PUT' : 'POST';
  let url = id ? `/usuario/${id}` : '/usuario';

  let usuario = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value
  };

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append('user', user);
  headers.append('password', password);

  const options = {
    method: method,
    body: JSON.stringify(usuario),
    headers: headers
  };

  const response = await fetch(apiUrl + url, options);
  const data = await response.json();

  if (data.nome) {
    alert("Usuário salvo com sucesso!");
    window.location = "index.html";
  } else {
    alert("Erro ao salvar usuário: " + (data.erros ? data.erros.join(', ') : 'Erro desconhecido'));
  }
}



async function excluirUsuario(id) {
  if (!confirm("Deseja realmente excluir?")) return;

  const headers = new Headers();
  headers.append('user', user);
  headers.append('password', password);

  const response = await fetch(apiUrl + "/usuario/" + id, {
    method: "DELETE",
    headers: headers
  });

  const result = await response.json();

  if (result.okay) {
    alert("Usuário excluído!");
    listarUsuario(); 
  } else {
    alert("Erro ao excluir usuário!");
  }
}

function editarUsuario(id) {
  window.location = "usuario.html?id=" + id;
}

function pegarParametro(parametro) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(parametro);
}

async function carregarUsuario() {
  let id = pegarParametro('id');
  if (!id) return;

  const headers = new Headers();
  headers.append('user', user);
  headers.append('password', password);

  const options = {
    method: "GET",
    headers: headers
  };

  const response = await fetch(apiUrl + `/usuario/${id}`, options);
  const usuario = await response.json();

  if (usuario.nome) {
    document.getElementById('nome').value = usuario.nome;
    document.getElementById('email').value = usuario.email;
    document.getElementById('senha').value = usuario.senha;
  }
}

window.onload = () => {
  carregarUsuario();
};

async function criarPedido(usuario_id) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const body = {
    usuario_id: usuario_id,
    data_criacao: new Date().toISOString()
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  };

  const response = await fetch(apiUrl + "/pedido", options);
  const pedido = await response.json();

  if (pedido.id) {
    alert("Pedido criado com sucesso! ID: " + pedido.id);

  } else {
    alert("Erro ao criar pedido.");
  }
}

async function adicionarProdutoAoPedido(pedido_id, produto_id, quantidade) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const body = {
    produto_id,
    quantidade
  };

  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  };

  const response = await fetch(`${apiUrl}/pedido/${pedido_id}/produto`, options);
  const result = await response.json();

  if (result.okay) {
    alert("Produto adicionado com sucesso!");
  } else {
    alert("Erro ao adicionar produto!");
  }
}

