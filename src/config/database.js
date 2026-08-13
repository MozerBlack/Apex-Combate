/**
 * Configuração de Conexão com o Banco de Dados PostgreSQL
 * Apex Combate
 */

const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'apex_combate',
    password: process.env.DB_PASSWORD || 'suasenha',
    port: process.env.DB_PORT || 5432,
};

module.exports = dbConfig;
