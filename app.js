const { useState, useEffect } = React;

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [texto, setTexto] = useState("");
  const [filtro, setFiltro] = useState("todas");

  // Carrega do localStorage
  useEffect(() => {
    const salvas = JSON.parse(localStorage.getItem("tarefas-react")) || [];
    setTarefas(salvas);
  }, []);

  // Salva no localStorage
  useEffect(() => {
    localStorage.setItem("tarefas-react", JSON.stringify(tarefas));
  }, [tarefas]);

  function adicionarTarefa(e) {
    e.preventDefault();
    if (texto.trim() === "") return;

    const nova = {
      id: Date.now(),
      texto: texto,
      concluida: false
    };

    setTarefas([...tarefas, nova]);
    setTexto("");
  }

  function alternar(id) {
    setTarefas(tarefas.map(t =>
      t.id === id ? { ...t, concluida: !t.concluida } : t
    ));
  }

  function excluir(id) {
    setTarefas(tarefas.filter(t => t.id !== id));
  }

  function limparConcluidas() {
    setTarefas(tarefas.filter(t => !t.concluida));
  }

  const filtradas = tarefas.filter(t => {
    if (filtro === "pendentes") return !t.concluida;
    if (filtro === "concluidas") return t.concluida;
    return true;
  });

  const pendentes = tarefas.filter(t => !t.concluida).length;

  return (
    <div className="container">
      <h1>To-Do List (React)</h1>

      <form className="form" onSubmit={adicionarTarefa}>
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite uma nova tarefa..."
        />
        <button type="submit">Adicionar</button>
      </form>

      <div className="filtros">
        <button className={filtro === "todas" ? "ativo" : ""} onClick={() => setFiltro("todas")}>Todas</button>
        <button className={filtro === "pendentes" ? "ativo" : ""} onClick={() => setFiltro("pendentes")}>Pendentes</button>
        <button className={filtro === "concluidas" ? "ativo" : ""} onClick={() => setFiltro("concluidas")}>Concluídas</button>
      </div>

      <ul>
        {filtradas.map(tarefa => (
          <li key={tarefa.id} className={tarefa.concluida ? "concluida" : ""}>
            <span onClick={() => alternar(tarefa.id)}>{tarefa.texto}</span>
            <div className="botoes">
              <button className="btn-check" onClick={() => alternar(tarefa.id)}>✓</button>
              <button className="btn-delete" onClick={() => excluir(tarefa.id)}>✕</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="rodape">
        <span>{pendentes} pendente{pendentes !== 1 ? "s" : ""}</span>
        <button onClick={limparConcluidas}>Limpar concluídas</button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
