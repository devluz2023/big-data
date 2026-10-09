import { useEffect, useState } from 'react';
import axios from 'axios';

// Interface mapeando o modelo do backend
interface ClassificacaoOrcamentaria {
  id?: number;
  codigo: string;
  nome: string;
  tipo: string;
}

// Configuração do cliente Axios apontando para a sua API LoopBack
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export function App() {
  const [classificacoes, setClassificacoes] = useState<ClassificacaoOrcamentaria[]>([]);
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Despesa');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // Função para buscar os dados cadastrados no banco
  async function carregarDados() {
    try {
      const response = await api.get('/classificacoes-orcamentarias');
      setClassificacoes(response.data);
      setErro('');
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setErro('Não foi possível conectar à API. Verifique se o back-end está rodando.');
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // Função para enviar os dados preenchidos para o servidor (POST)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!codigo || !nome) return;

    setLoading(true);
    try {
      await api.post('/classificacoes-orcamentarias', {
        codigo,
        nome,
        tipo,
      });

      // Limpa os campos do formulário e recarrega a lista
      setCodigo('');
      setNome('');
      setTipo('Despesa');
      carregarDados();
    } catch (err) {
      console.error('Erro ao cadastrar:', err);
      setErro('Erro ao salvar o registro no servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '20px' }}>
      <h2 style={{ color: '#333', borderBottom: '2px solid #0070f3', paddingBottom: '10px' }}>
        Gestão Orçamentária 📊
      </h2>

      {erro && (
        <div style={{ background: '#fce8e6', color: '#c5221f', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
          {erro}
        </div>
      )}

      {/* Formulário de Envio */}
      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#444' }}>Nova Classificação Orçamentária</h3>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Código:</label>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ex: 3.1.01.02"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Nome da Classificação:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Manutenção de Equipamentos"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Tipo:</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ background: '#0070f3', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
        >
          {loading ? 'Salvando...' : 'Salvar no Banco (MySQL)'}
        </button>
      </form>

      {/* Listagem dos Dados */}
      <h3 style={{ fontSize: '18px', color: '#444' }}>Classificações Cadastradas</h3>
      {classificacoes.length === 0 ? (
        <p style={{ color: '#777', fontStyle: 'italic' }}>Nenhum registro encontrado.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {classificacoes.map((item) => (
            <li key={item.id} style={{ background: '#fff', border: '1px solid #e1e4e8', padding: '15px', marginBottom: '10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div>
                <span style={{ fontFamily: 'monospace', background: '#f1f8ff', padding: '3px 6px', borderRadius: '4px', fontWeight: 'bold', color: '#0366d6' }}>
                  {item.codigo}
                </span>
                <span style={{ marginLeft: '12px', fontWeight: 500, color: '#333' }}>{item.nome}</span>
              </div>
              <span style={{ background: item.tipo === 'Receita' ? '#e6f4ea' : '#fce8e6', color: item.tipo === 'Receita' ? '#137333' : '#c5221f', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                {item.tipo}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;