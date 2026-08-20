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
// ROTAS DA API DE AUTENTICAÇÃO E PERFIS
// ============================================================

// 1. LOGIN UNIFICADO (Atleta, Clube, Federação)
app.post('/api/login', async (req, res) => {
  const { cpf, data_nascimento, usuario, senha, perfil } = req.body;

  try {
    // A. LÓGICA DE LOGIN PARA ATLETA
    if (perfil === 'ATLETA' || cpf) {
      if (!cpf || !data_nascimento) {
        return res.status(400).json({ error: 'CPF e Data de Nascimento são obrigatórios.' });
      }

      const cpfLimpo = cpf.replace(/\D/g, '');
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

      return res.json({ message: 'Login realizado com sucesso!', usuario: result.rows[0] });
    }

    // B. LÓGICA DE LOGIN PARA FEDERAÇÃO / PRESIDENTE MASTER (Exige 2FA)
    if (perfil === 'federacao') {
      const queryText = `
        SELECT id_pessoa, nome_completo, tipo_perfil
        FROM pessoas_usuarios
        WHERE (cpf = $1 OR nome_completo ILIKE $1) AND tipo_perfil IN ('PRESIDENTE_MASTER', 'ADMIN')
      `;
      const result = await db.query(queryText, [usuario]);

      if (result.rows.length > 0) {
        // Sinaliza para o Frontend abrir a tela de validação OTP
        return res.json({ status: '2FA_REQUIRED', message: 'Código de validação enviado.' });
      }
      return res.status(401).json({ error: 'Credenciais de administrador inválidas.' });
    }

    // C. LÓGICA DE LOGIN PARA CLUBE / ORGANIZAÇÃO
    if (perfil === 'clube') {
      const queryText = `
        SELECT id_organizacao, nome_organizacao, sigla
        FROM organizacoes_equipes
        WHERE sigla ILIKE $1 OR nome_organizacao ILIKE $1
      `;
      const result = await db.query(queryText, [usuario]);

      if (result.rows.length > 0) {
        return res.json({ message: 'Login do clube realizado!', usuario: result.rows[0] });
      }
      return res.status(401).json({ error: 'Clube não encontrado.' });
    }

    return res.status(400).json({ error: 'Perfil de acesso não reconhecido.' });

  } catch (err) {
    console.error('Erro na rota de login:', err);
    return res.status(500).json({ error: 'Erro interno no servidor de autenticação.' });
  }
});

// 2. SOLICITAÇÃO E VALIDAÇÃO DE CÓDIGO OTP (2FA)
app.post('/api/login/clube/solicitar-codigo', (req, res) => {
  const { usuario } = req.body;
  if (!usuario) {
    return res.status(400).json({ error: 'Informe o usuário ou e-mail.' });
  }
  // Simulação de envio via WhatsApp / SMS / Email
  return res.json({ message: 'Código temporário enviado com sucesso.' });
});

app.post('/api/login/validar-otp', (req, res) => {
  const { codigo } = req.body;
  
  // Aceita código de teste ou qualquer código com 6 dígitos
  if (codigo === '123456' || (codigo && codigo.length === 6)) {
    return res.json({ message: 'Autenticação de 2 fatores aceita!', token: 'apex_session_token' });
  }
  return res.status(400).json({ error: 'Código inválido ou expirado.' });
});

// ============================================================
// ROTAS DE DADOS (PERFIL E PLACAR)
// ============================================================

// 3. DADOS DO PERFIL DO ATLETA
app.get('/api/atleta/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const queryText = `
      SELECT p.id_pessoa, p.nome_completo, p.cpf, p.data_nascimento, o.nome_organizacao, o.sigla
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

// 4. DADOS DO PLACAR AO VIVO
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

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Apex Combate iniciado com sucesso na porta ${PORT}!`);
  console.log(`📱💻 Acesse: http://localhost:${PORT}`);
});