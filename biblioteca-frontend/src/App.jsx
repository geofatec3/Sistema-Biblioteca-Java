import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api';

function formatarData(data) {
  if (!data) return '-';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function App() {
  const [pagina, setPagina] = useState('dashboard');

  const [livros, setLivros] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);

  const [pesquisa, setPesquisa] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [registroEditando, setRegistroEditando] = useState(null);

  const [novoLivro, setNovoLivro] = useState({
    titulo: '', isbn: '', autor: '', editora: '',
    ano_publicacao: '', categoria: '', quantidade: 0,
  });

  const [novoCliente, setNovoCliente] = useState({
    nome: '', email: '', telefone: '',
    data_cadastro: new Date().toISOString().split('T')[0],
  });

  const [novoEmprestimo, setNovoEmprestimo] = useState({
    livro_id: '', cliente_id: '',
    funcionario_id: 1,
    data_emprestimo: new Date().toISOString().split('T')[0],
    data_prevista_devolucao: '',
    data_devolucao: '',
    status: 'EM_ANDAMENTO',
  });

  // Carrega todos os dados do Spring Boot ao abrir a página
  async function carregarDados() {
    try {
      const [resLivros, resClientes, resEmprestimos] = await Promise.all([
        fetch(`${API_URL}/livros`),
        fetch(`${API_URL}/clientes`),
        fetch(`${API_URL}/emprestimos`),
      ]);

      if (resLivros.ok) setLivros(await resLivros.json());
      if (resClientes.ok) {
        const listaClientes = await resClientes.json();
        // Mapeia dataCadastro (Java) para data_cadastro (React)
        setClientes(listaClientes.map(c => ({
          ...c,
          data_cadastro: c.dataCadastro || c.data_cadastro
        })));
      }
      if (resEmprestimos.ok) {
        const listaEmprestimos = await resEmprestimos.json();
        // Adapta os campos do EmprestimoResponseDTO para o layout da tabela
        setEmprestimos(listaEmprestimos.map(e => ({
          ...e,
          data_emprestimo: e.dataEmprestimo,
          data_prevista_devolucao: e.dataPrevistaDevolucao,
          data_devolucao: e.dataDevolucao,
        })));
      }
    } catch (erro) {
      console.error('Erro ao conectar com o backend:', erro);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const livrosFiltrados = livros.filter((livro) =>
    livro.titulo?.toLowerCase().includes(pesquisa.toLowerCase()) ||
    livro.autor?.toLowerCase().includes(pesquisa.toLowerCase()) ||
    (livro.isbn && livro.isbn.includes(pesquisa))
  );

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
    (cliente.email && cliente.email.toLowerCase().includes(pesquisa.toLowerCase())) ||
    (cliente.telefone && cliente.telefone.includes(pesquisa))
  );

  const emprestimosFiltrados = emprestimos.filter((emprestimo) => {
    return (
      emprestimo.livroTitulo?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      emprestimo.clienteNome?.toLowerCase().includes(pesquisa.toLowerCase())
    );
  });

  // --- CRUD LIVROS ---
  async function salvarLivro(e) {
    e.preventDefault();

    if (!novoLivro.titulo.trim()) return alert('Informe o título do livro.');
    if (!novoLivro.autor.trim()) return alert('Informe o autor do livro.');

    if (
      novoLivro.isbn?.trim() &&
      livros.some((l) => l.isbn === novoLivro.isbn.trim() && l.id !== registroEditando)
    ) {
      return alert('Este ISBN já está cadastrado.');
    }

    if (
      novoLivro.quantidade === '' ||
      Number(novoLivro.quantidade) < 0 ||
      !Number.isInteger(Number(novoLivro.quantidade))
    ) {
      return alert('Informe uma quantidade válida de exemplares.');
    }

const payload = {
  titulo: novoLivro.titulo,
  isbn: novoLivro.isbn || null,
  autor: novoLivro.autor,
  editora: novoLivro.editora || null,
  anoPublicacao: novoLivro.ano_publicacao ? Number(novoLivro.ano_publicacao) : null,
  categoria: novoLivro.categoria || null,
  quantidade: Number(novoLivro.quantidade),
};

    try {
      const url = registroEditando ? `${API_URL}/livros/${registroEditando}` : `${API_URL}/livros`;
      const method = registroEditando ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erro ao salvar livro no servidor.');

      await carregarDados();
      cancelarFormulario();
    } catch (erro) {
      alert(erro.message);
    }
  }

  async function excluirLivro(id) {
    if (!window.confirm('Deseja excluir este livro?')) return;

    try {
      const res = await fetch(`${API_URL}/livros/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Não foi possível excluir o livro (verifique se há empréstimos vinculados).');
      await carregarDados();
    } catch (erro) {
      alert(erro.message);
    }
  }

  // --- CRUD CLIENTES ---
  async function salvarCliente(e) {
    e.preventDefault();

    if (!novoCliente.nome.trim()) return alert('Informe o nome do cliente.');

    if (
      novoCliente.email?.trim() &&
      clientes.some(
        (c) => c.email?.toLowerCase() === novoCliente.email.trim().toLowerCase() && c.id !== registroEditando
      )
    ) {
      return alert('Este e-mail já está cadastrado para outro cliente.');
    }

    const payload = {
      nome: novoCliente.nome,
      email: novoCliente.email || null,
      telefone: novoCliente.telefone || null,
      dataCadastro: novoCliente.data_cadastro,
    };

    try {
      const url = registroEditando ? `${API_URL}/clientes/${registroEditando}` : `${API_URL}/clientes`;
      const method = registroEditando ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erro ao salvar cliente no servidor.');

      await carregarDados();
      cancelarFormulario();
    } catch (erro) {
      alert(erro.message);
    }
  }

  async function excluirCliente(id) {
    if (!window.confirm('Deseja excluir este cliente?')) return;

    try {
      const res = await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Não foi possível excluir o cliente (verifique se há empréstimos vinculados).');
      await carregarDados();
    } catch (erro) {
      alert(erro.message);
    }
  }

  // --- CRUD EMPRÉSTIMOS E DEVOLUÇÕES ---
  async function salvarEmprestimo(e) {
    e.preventDefault();

    const livroId = Number(novoEmprestimo.livro_id);
    const clienteId = Number(novoEmprestimo.cliente_id);

    if (!livroId || !clienteId) return alert('Selecione um livro e um cliente.');

    const payload = {
      livroId,
      clienteId,
      funcionarioId: Number(novoEmprestimo.funcionario_id) || 1,
    };

    try {
      const res = await fetch(`${API_URL}/emprestimos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const erroTexto = await res.text();
        throw new Error(erroTexto || 'Erro ao registrar empréstimo.');
      }

      await carregarDados();
      cancelarFormulario();
    } catch (erro) {
      alert(erro.message);
    }
  }

  async function registrarDevolucao(emprestimoId) {
    try {
      const res = await fetch(`${API_URL}/emprestimos/${emprestimoId}/devolucao`, {
        method: 'PATCH',
      });

      if (!res.ok) throw new Error('Erro ao registrar devolução.');

      await carregarDados();
    } catch (erro) {
      alert(erro.message);
    }
  }

  async function excluirEmprestimo(emprestimo) {
    if (!window.confirm('Deseja excluir este empréstimo?')) return;

    try {
      const res = await fetch(`${API_URL}/emprestimos/${emprestimo.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir empréstimo.');
      await carregarDados();
    } catch (erro) {
      alert(erro.message);
    }
  }

  function editarLivro(livro) {
    setNovoLivro(livro);
    setRegistroEditando(livro.id);
    setMostrarFormulario(true);
  }

  function editarCliente(cliente) {
    setNovoCliente(cliente);
    setRegistroEditando(cliente.id);
    setMostrarFormulario(true);
  }

  function cancelarFormulario() {
    setMostrarFormulario(false);
    setRegistroEditando(null);

    setNovoLivro({
      titulo: '', isbn: '', autor: '', editora: '',
      ano_publicacao: '', categoria: '', quantidade: 0,
    });

    setNovoCliente({
      nome: '', email: '', telefone: '',
      data_cadastro: new Date().toISOString().split('T')[0],
    });

    setNovoEmprestimo({
      livro_id: '', cliente_id: '', funcionario_id: 1,
      data_emprestimo: new Date().toISOString().split('T')[0],
      data_prevista_devolucao: '', data_devolucao: '',
      status: 'EM_ANDAMENTO',
    });
  }

  function alternarFormulario() {
    if (mostrarFormulario) {
      cancelarFormulario();
    } else {
      cancelarFormulario();
      setMostrarFormulario(true);
    }
  }

  const totalExemplares = livros.reduce((total, livro) => total + Number(livro.quantidade), 0);
  const hoje = new Date().toISOString().split('T')[0];

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Biblioteca</h2>
        <nav>
          <a href="#" onClick={() => { setPagina('dashboard'); cancelarFormulario(); }}>Dashboard</a>
          <a href="#" onClick={() => { setPagina('livros'); cancelarFormulario(); }}>Livros</a>
          <a href="#" onClick={() => { setPagina('clientes'); cancelarFormulario(); }}>Clientes</a>
          <a href="#" onClick={() => { setPagina('emprestimos'); cancelarFormulario(); }}>Empréstimos</a>
          <a href="#" onClick={() => { setPagina('devolucoes'); cancelarFormulario(); }}>Devoluções</a>
        </nav>
      </aside>

      <main className="content">
        {pagina === 'dashboard' && (
          <>
            <h1 className="dashboard-titulo">Dashboard</h1>
            <p className="dashboard-subtitulo">Visão geral da biblioteca</p>

            <div className="dashboard-cards">
              <div className="dashboard-card card-azul">
                <div className="dashboard-card-icone">📚</div>
                <div>
                  <span>Total de livros</span>
                  <h2>{livros.length}</h2>
                </div>
              </div>

              <div className="dashboard-card card-verde">
                <div className="dashboard-card-icone">📖</div>
                <div>
                  <span>Exemplares disponíveis</span>
                  <h2>{totalExemplares}</h2>
                </div>
              </div>

              <div className="dashboard-card card-roxo">
                <div className="dashboard-card-icone">👥</div>
                <div>
                  <span>Clientes cadastrados</span>
                  <h2>{clientes.length}</h2>
                </div>
              </div>

              <div className="dashboard-card card-laranja">
                <div className="dashboard-card-icone">📋</div>
                <div>
                  <span>Empréstimos ativos</span>
                  <h2>{emprestimos.filter(e => e.status !== 'DEVOLVIDO').length}</h2>
                </div>
              </div>

              <div className="dashboard-card card-verde">
                <div className="dashboard-card-icone">✅</div>
                <div>
                  <span>Devoluções realizadas</span>
                  <h2>{emprestimos.filter(e => e.status === 'DEVOLVIDO').length}</h2>
                </div>
              </div>

              <div className="dashboard-card card-vermelho">
                <div className="dashboard-card-icone">⚠️</div>
                <div>
                  <span>Empréstimos atrasados</span>
                  <h2>
                    {emprestimos.filter(e =>
                      e.status !== 'DEVOLVIDO' &&
                      e.data_prevista_devolucao &&
                      e.data_prevista_devolucao < hoje
                    ).length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="dashboard-recentes">
              <h2>Empréstimos recentes</h2>
              <div className="tabela-container">
                <table className="tabela-livros">
                  <thead>
                    <tr>
                      <th>Livro</th>
                      <th>Cliente</th>
                      <th>Data do empréstimo</th>
                      <th>Previsão de devolução</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...emprestimos].reverse().slice(0, 5).map(emprestimo => {
                      const atrasado =
                        emprestimo.status !== 'DEVOLVIDO' &&
                        emprestimo.data_prevista_devolucao &&
                        emprestimo.data_prevista_devolucao < hoje;

                      return (
                        <tr key={emprestimo.id}>
                          <td>{emprestimo.livroTitulo || 'Livro removido'}</td>
                          <td>{emprestimo.clienteNome || 'Cliente removido'}</td>
                          <td>{formatarData(emprestimo.data_emprestimo)}</td>
                          <td>{formatarData(emprestimo.data_prevista_devolucao)}</td>
                          <td>
                            {emprestimo.status === 'DEVOLVIDO'
                              ? 'Devolvido'
                              : atrasado
                                ? 'Atrasado'
                                : 'Em andamento'}
                          </td>
                        </tr>
                      );
                    })}

                    {emprestimos.length === 0 && (
                      <tr>
                        <td colSpan="5">Nenhum empréstimo registrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {pagina === 'livros' && (
          <>
            <h1>Livros</h1>
            <div className="livros-toolbar">
              <input
                type="text"
                placeholder="Pesquisar livro..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
              />
              <button className="btn-novo" onClick={alternarFormulario}>
                {mostrarFormulario ? 'Fechar formulário' : 'Novo Livro'}
              </button>
            </div>

            {mostrarFormulario && (
              <form className="form-livro" onSubmit={salvarLivro}>
                <h2>{registroEditando ? 'Editar Livro' : 'Cadastrar Livro'}</h2>
                <input placeholder="Título" required value={novoLivro.titulo}
                  onChange={(e) => setNovoLivro({ ...novoLivro, titulo: e.target.value })} />
                <input placeholder="ISBN" value={novoLivro.isbn || ''}
                  onChange={(e) => setNovoLivro({ ...novoLivro, isbn: e.target.value })} />
                <input placeholder="Autor" required value={novoLivro.autor}
                  onChange={(e) => setNovoLivro({ ...novoLivro, autor: e.target.value })} />
                <input placeholder="Editora" value={novoLivro.editora || ''}
                  onChange={(e) => setNovoLivro({ ...novoLivro, editora: e.target.value })} />
                <input type="number" placeholder="Ano" value={novoLivro.ano_publicacao || ''}
                  onChange={(e) => setNovoLivro({ ...novoLivro, ano_publicacao: e.target.value })} />
                <input placeholder="Categoria" value={novoLivro.categoria || ''}
                  onChange={(e) => setNovoLivro({ ...novoLivro, categoria: e.target.value })} />
                <input type="number" min="0" placeholder="Quantidade" required value={novoLivro.quantidade}
                  onChange={(e) => setNovoLivro({ ...novoLivro, quantidade: Number(e.target.value) })} />

                <div className="form-acoes">
                  <button type="submit" className="btn-novo">Salvar</button>
                  <button type="button" className="btn-cancelar" onClick={cancelarFormulario}>Cancelar</button>
                </div>
              </form>
            )}

            <div className="tabela-container">
              <table className="tabela-livros">
                <thead>
                  <tr>
                    <th>Título</th><th>Autor</th><th>Categoria</th><th>Quantidade</th><th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {livrosFiltrados.map((livro) => (
                    <tr key={livro.id}>
                      <td>{livro.titulo}</td><td>{livro.autor}</td><td>{livro.categoria}</td><td>{livro.quantidade}</td>
                      <td>
                        <button className="btn-editar" onClick={() => editarLivro(livro)}>Editar</button>
                        <button className="btn-excluir" onClick={() => excluirLivro(livro.id)}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {pagina === 'clientes' && (
          <>
            <h1>Clientes</h1>
            <div className="livros-toolbar">
              <input placeholder="Pesquisar cliente..." value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)} />
              <button className="btn-novo" onClick={alternarFormulario}>
                {mostrarFormulario ? 'Fechar formulário' : 'Novo Cliente'}
              </button>
            </div>

            {mostrarFormulario && (
              <form className="form-livro" onSubmit={salvarCliente}>
                <h2>{registroEditando ? 'Editar Cliente' : 'Cadastrar Cliente'}</h2>
                <input placeholder="Nome" required value={novoCliente.nome}
                  onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })} />
                <input type="email" placeholder="Email" value={novoCliente.email || ''}
                  onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })} />
                <input placeholder="Telefone" value={novoCliente.telefone || ''}
                  onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })} />
                <label>Data de cadastro</label>
                <input type="date" required value={novoCliente.data_cadastro || ''}
                  onChange={(e) => setNovoCliente({ ...novoCliente, data_cadastro: e.target.value })} />

                <div className="form-acoes">
                  <button type="submit" className="btn-novo">Salvar</button>
                  <button type="button" className="btn-cancelar" onClick={cancelarFormulario}>Cancelar</button>
                </div>
              </form>
            )}

            <div className="tabela-container">
              <table className="tabela-livros">
                <thead>
                  <tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Ações</th></tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.nome}</td><td>{cliente.email}</td><td>{cliente.telefone}</td>
                      <td>
                        <button className="btn-editar" onClick={() => editarCliente(cliente)}>Editar</button>
                        <button className="btn-excluir" onClick={() => excluirCliente(cliente.id)}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {pagina === 'emprestimos' && (
          <>
            <h1>Empréstimos</h1>
            <div className="livros-toolbar">
              <input placeholder="Pesquisar por livro ou cliente..." value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)} />
              <button className="btn-novo" onClick={alternarFormulario}>
                {mostrarFormulario ? 'Fechar formulário' : 'Novo Empréstimo'}
              </button>
            </div>

            {mostrarFormulario && (
              <form className="form-livro" onSubmit={salvarEmprestimo}>
                <h2>Registrar Empréstimo</h2>

                <label>Livro</label>
                <select required value={novoEmprestimo.livro_id}
                  onChange={(e) => setNovoEmprestimo({ ...novoEmprestimo, livro_id: e.target.value })}>
                  <option value="">Selecione um livro</option>
                  {livros.map((livro) => (
                    <option key={livro.id} value={livro.id}>
                      {livro.titulo} ({livro.quantidade} disponíveis)
                    </option>
                  ))}
                </select>

                <label>Cliente</label>
                <select required value={novoEmprestimo.cliente_id}
                  onChange={(e) => setNovoEmprestimo({ ...novoEmprestimo, cliente_id: e.target.value })}>
                  <option value="">Selecione um cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                  ))}
                </select>

                <label>ID do Funcionário Responsável</label>
                <input type="number" min="1" required value={novoEmprestimo.funcionario_id}
                  onChange={(e) => setNovoEmprestimo({ ...novoEmprestimo, funcionario_id: e.target.value })} />

                <div className="form-acoes">
                  <button type="submit" className="btn-novo">Salvar</button>
                  <button type="button" className="btn-cancelar" onClick={cancelarFormulario}>Cancelar</button>
                </div>
              </form>
            )}

            <div className="tabela-container">
              <table className="tabela-livros">
                <thead>
                  <tr>
                    <th>Livro</th><th>Cliente</th><th>Empréstimo</th>
                    <th>Prev. devolução</th><th>Status</th><th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {emprestimosFiltrados.map((emprestimo) => (
                    <tr key={emprestimo.id}>
                      <td>{emprestimo.livroTitulo || 'Livro removido'}</td>
                      <td>{emprestimo.clienteNome || 'Cliente removido'}</td>
                      <td>{formatarData(emprestimo.data_emprestimo)}</td>
                      <td>{formatarData(emprestimo.data_prevista_devolucao)}</td>
                      <td>
                        <span className={`status-badge status-${
                          emprestimo.status === 'DEVOLVIDO'
                            ? 'devolvido'
                            : emprestimo.data_prevista_devolucao < hoje
                              ? 'atrasado'
                              : 'andamento'
                        }`}>
                          {emprestimo.status === 'DEVOLVIDO'
                            ? 'Devolvido'
                            : emprestimo.data_prevista_devolucao < hoje
                              ? 'Atrasado'
                              : 'Em andamento'}
                        </span>
                      </td>
                      <td>
                        <button className="btn-excluir" onClick={() => excluirEmprestimo(emprestimo)}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {pagina === 'devolucoes' && (
          <>
            <h1>Devoluções</h1>
            <h2 style={{ marginTop: '20px' }}>Empréstimos em andamento</h2>
            <p>Registre aqui a devolução dos livros emprestados.</p>

            <div className="tabela-container">
              <table className="tabela-livros">
                <thead>
                  <tr>
                    <th>Livro</th>
                    <th>Cliente</th>
                    <th>Previsão de devolução</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {emprestimos.filter(e => e.status !== 'DEVOLVIDO').map(emprestimo => {
                    const atrasado = emprestimo.data_prevista_devolucao < hoje;

                    return (
                      <tr key={emprestimo.id}>
                        <td>{emprestimo.livroTitulo || 'Livro removido'}</td>
                        <td>{emprestimo.clienteNome || 'Cliente removido'}</td>
                        <td>{formatarData(emprestimo.data_prevista_devolucao)}</td>
                        <td>
                          <span className={`status-badge ${atrasado ? 'status-atrasado' : 'status-andamento'}`}>
                            {atrasado ? 'Atrasado' : 'Em andamento'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-novo"
                            onClick={() => registrarDevolucao(emprestimo.id)}
                          >
                            Registrar devolução
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {emprestimos.filter(e => e.status !== 'DEVOLVIDO').length === 0 && (
                    <tr>
                      <td colSpan="5">Nenhum empréstimo em andamento.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <h2 style={{ marginTop: '36px' }}>Histórico de devoluções</h2>
            <p>Consulte abaixo todos os livros que já foram devolvidos.</p>

            <div className="tabela-container">
              <table className="tabela-livros">
                <thead>
                  <tr>
                    <th>Livro</th>
                    <th>Cliente</th>
                    <th>Data do empréstimo</th>
                    <th>Data da devolução</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {emprestimos.filter(e => e.status === 'DEVOLVIDO').map(emprestimo => (
                    <tr key={emprestimo.id}>
                      <td>{emprestimo.livroTitulo || 'Livro removido'}</td>
                      <td>{emprestimo.clienteNome || 'Cliente removido'}</td>
                      <td>{formatarData(emprestimo.data_emprestimo)}</td>
                      <td>{formatarData(emprestimo.data_devolucao)}</td>
                      <td>
                        <span className="status-badge status-devolvido">Devolvido</span>
                      </td>
                    </tr>
                  ))}

                  {emprestimos.filter(e => e.status === 'DEVOLVIDO').length === 0 && (
                    <tr>
                      <td colSpan="5">Nenhuma devolução registrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;