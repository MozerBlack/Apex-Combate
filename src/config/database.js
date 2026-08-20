/**
 * Configuração e Conexão com o Banco de Dados PostgreSQL
 * Apex Combate
 */

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'apex_combate',
  password: process.env.DB_PASSWORD || 'suasenha',
  port: Number(process.env.DB_PORT) || 5432,
});

// Tratamento de erros assíncronos no pool de conexões
pool.on('error', (err) => {
  console.error('❌ Erro inesperado no cliente do PostgreSQL:', err);
});

// Teste de conexão ao inicializar o serviço
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar no PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conexão com PostgreSQL estabelecida com sucesso!');
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};