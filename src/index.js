/**
 * APEX COMBATE — Ponto de Entrada da Aplicação
 * Plataforma Universal de Gestão de Campeonatos de Artes Marciais
 */

const express = require('express');
const path = require('path');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares para JSON e arquivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ============================================================
// ROTAS DA API
// ============================================================

// 1. LOGIN DE ATLETA (CPF + Data de Nascimento)
app.post('/api/login', async (req, res) => {
  const { cpf, data_nascimento } = req.body;

  if (!cpf || !data_nascimento) {
    return res.status(400).json({ error: 'CPF e Data de Nascimento são obrigatórios.' });
  }

  // Remove formatação (. e -) do CPF enviado
  const cpfLimpo = cpf.replace(/\D/g, '');

  try {
    const queryText = `
      SELECT id_pessoa, nome_completo, cpf, data_nascimento, tipo_perfil, id_organizacao
      FROM pessoas_usuarios
      WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = $1 
        AND data_nascimento = $2
    `;
    
    const result = await db.query(queryText, [cpfLimpo, data_nascimento]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Atleta não encontrado. Verifique seu CPF e Data de Nascimento.' });
    }

    const usuario = result.rows[0];
    return res.json({ message: 'Login realizado com sucesso!', usuario });
  } catch (err) {
    console.error('Erro na rota de login:', err);
    return res.status(500).json({ error: 'Erro interno no servidor de autenticação.' });
  }
});

// 2. DADOS DO PERFIL DO ATLETA
app.get('/api/atleta/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const queryText = `
      SELECT p.id_pessoa, p.nome_completo, p.cpf, p.data_nascimento, 
             p.tipo_perfil, p.genero, p.registro_federacao,
             o.nome_organizacao, o.sigla
      FROM pessoas_usuarios p
      LEFT JOIN organizacoes_equipes o ON p.id_organizacao = o.id_organizacao
      WHERE p.id_pessoa = $1
    `;
    const result = await db.query(queryText, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Atleta não encontrado.' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar atleta:', err);
    return res.status(500).json({ error: 'Erro no servidor ao buscar perfil.' });
  }
});

// 3. DADOS DO PLACAR AO VIVO
app.get('/api/confronto/ao-vivo', async (req, res) => {
  try {
    const queryText = `
      SELECT 
        c.id_confronto, c.numero_luta, c.fase, c.placar_red, c.placar_blue, c.status_luta,
        red.nome_completo AS atleta_red, blue.nome_completo AS atleta_blue,
        cat.nome_categoria, area.nome_area
      FROM confrontos_chave c
      LEFT JOIN pessoas_usuarios red ON c.id_atleta_aka_red = red.id_pessoa
      LEFT JOIN pessoas_usuarios blue ON c.id_atleta_ao_blue = blue.id_pessoa
      LEFT JOIN categorias cat ON c.id_categoria = cat.id_categoria
      LEFT JOIN areas_competicao area ON c.id_area = area.id_area
      WHERE c.status_luta = 'EM_ANDAMENTO'
      LIMIT 1
    `;
    const result = await db.query(queryText);

    return res.json(result.rows[0] || {});
  } catch (err) {
    console.error('Erro ao buscar placar ao vivo:', err);
    return res.status(500).json({ error: 'Erro no servidor ao buscar dados do placar.' });
  }
});

// ============================================================
// ROTAS DA DASHBOARD ADMIN
// ============================================================

// 4. ESTATÍSTICAS GERAIS (cards do topo)
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [campeonatos, atletas, equipes, lutas] = await Promise.all([
      db.query('SELECT COUNT(*) AS total FROM campeonatos'),
      db.query(`SELECT COUNT(*) AS total FROM pessoas_usuarios WHERE tipo_perfil = 'ATLETA'`),
      db.query('SELECT COUNT(*) AS total FROM organizacoes_equipes'),
      db.query('SELECT COUNT(*) AS total FROM confrontos_chave'),
    ]);

    return res.json({
      campeonatos: Number(campeonatos.rows[0].total),
      atletas: Number(atletas.rows[0].total),
      equipes: Number(equipes.rows[0].total),
      lutas: Number(lutas.rows[0].total),
    });
  } catch (err) {
    console.error('Erro ao buscar estatísticas:', err);
    return res.status(500).json({ error: 'Erro ao carregar estatísticas da dashboard.' });
  }
});

// 5. PRÓXIMOS CAMPEONATOS
app.get('/api/dashboard/proximos-campeonatos', async (req, res) => {
  try {
    const queryText = `
      SELECT 
        c.id_campeonato,
        c.nome_evento,
        c.data_inicio,
        c.data_fim,
        c.local_ginasio,
        c.cidade_uf,
        o.nome_organizacao,
        o.sigla
      FROM campeonatos c
      LEFT JOIN organizacoes_equipes o ON c.id_organizacao_promotora = o.id_organizacao
      WHERE c.data_inicio >= CURRENT_DATE
      ORDER BY c.data_inicio ASC
      LIMIT 6
    `;
    const result = await db.query(queryText);
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar próximos campeonatos:', err);
    return res.status(500).json({ error: 'Erro ao carregar próximos campeonatos.' });
  }
});

// 6. DISTRIBUIÇÃO DE ATLETAS POR MODALIDADE
app.get('/api/dashboard/distribuicao-atletas', async (req, res) => {
  try {
    const queryText = `
      SELECT 
        m.nome_modalidade,
        m.sigla,
        COUNT(DISTINCT g.id_pessoa) AS total
      FROM modalidades m
      LEFT JOIN graduacoes g ON g.id_modalidade = m.id_modalidade
      GROUP BY m.id_modalidade, m.nome_modalidade, m.sigla
      ORDER BY total DESC
    `;
    const result = await db.query(queryText);

    const totalGeral = result.rows.reduce((acc, row) => acc + Number(row.total), 0);

    const distribuicao = result.rows.map((row) => ({
      modalidade: row.nome_modalidade,
      sigla: row.sigla,
      total: Number(row.total),
      percentual: totalGeral > 0 ? Math.round((Number(row.total) / totalGeral) * 100) : 0,
    }));

    return res.json({
      total: totalGeral,
      distribuicao,
    });
  } catch (err) {
    console.error('Erro ao buscar distribuição de atletas:', err);
    return res.status(500).json({ error: 'Erro ao carregar distribuição de atletas.' });
  }
});

// 7. LISTA DE CONFRONTOS / CHAVES (resumo)
app.get('/api/dashboard/confrontos', async (req, res) => {
  try {
    const queryText = `
      SELECT 
        c.id_confronto,
        c.numero_luta,
        c.fase,
        c.placar_red,
        c.placar_blue,
        c.status_luta,
        red.nome_completo AS atleta_red,
        blue.nome_completo AS atleta_blue,
        cat.nome_categoria,
        area.nome_area
      FROM confrontos_chave c
      LEFT JOIN pessoas_usuarios red ON c.id_atleta_aka_red = red.id_pessoa
      LEFT JOIN pessoas_usuarios blue ON c.id_atleta_ao_blue = blue.id_pessoa
      LEFT JOIN categorias cat ON c.id_categoria = cat.id_categoria
      LEFT JOIN areas_competicao area ON c.id_area = area.id_area
      ORDER BY 
        CASE c.status_luta 
          WHEN 'EM_ANDAMENTO' THEN 1 
          WHEN 'AGUARDANDO' THEN 2 
          ELSE 3 
        END,
        c.id_confronto
      LIMIT 20
    `;
    const result = await db.query(queryText);
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar confrontos:', err);
    return res.status(500).json({ error: 'Erro ao carregar confrontos.' });
  }
});

// 8. LISTA DE ATLETAS (para gestão)
app.get('/api/atletas', async (req, res) => {
  try {
    const queryText = `
      SELECT 
        p.id_pessoa,
        p.nome_completo,
        p.cpf,
        p.data_nascimento,
        p.tipo_perfil,
        p.genero,
        p.registro_federacao,
        o.nome_organizacao,
        o.sigla
      FROM pessoas_usuarios p
      LEFT JOIN organizacoes_equipes o ON p.id_organizacao = o.id_organizacao
      ORDER BY p.nome_completo
    `;
    const result = await db.query(queryText);
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar atletas:', err);
    return res.status(500).json({ error: 'Erro ao listar atletas.' });
  }
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Apex Combate iniciado com sucesso na porta ${PORT}!`);
  console.log(`📱💻 Acesse: http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard.html`);
});
