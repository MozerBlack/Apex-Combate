-- ============================================================
-- APEX COMBATE — BANCO DE DADOS UNIFICADO (8 TABELAS)
-- ============================================================

-- 1. PESSOAS E USUÁRIOS (Unifica Atletas, Técnicos, Mesários e Admins + Logins)
CREATE TABLE pessoas_usuarios (
    id_pessoa SERIAL PRIMARY KEY,
    nome_completo VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_perfil VARCHAR(30) CHECK (tipo_perfil IN ('ATLETA', 'TECNICO', 'MESARIO', 'ADMIN')),
    id_organizacao INT,
    data_nascimento DATE,
    genero VARCHAR(10),
    registro_federacao VARCHAR(30),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ORGANIZAÇÕES E EQUIPES (Unifica Federações, Confederações e Dojos)
CREATE TABLE organizacoes_equipes (
    id_organizacao SERIAL PRIMARY KEY,
    nome_organizacao VARCHAR(100) NOT NULL,
    sigla VARCHAR(20),
    tipo_organizacao VARCHAR(20) CHECK (tipo_organizacao IN ('FEDERACAO', 'DOJO')),
    tecnico_responsavel VARCHAR(100),
    cidade_uf VARCHAR(50)
);

-- 3. MODALIDADES DE ARTES MARCIAIS
CREATE TABLE modalidades (
    id_modalidade SERIAL PRIMARY KEY,
    nome_modalidade VARCHAR(50) NOT NULL,
    sigla VARCHAR(10),
    tipo_pontuacao VARCHAR(30),
    tipo_area_padrao VARCHAR(20)
);

-- 4. GRADUAÇÕES E FAIXAS
CREATE TABLE graduacoes (
    id_graduacao SERIAL PRIMARY KEY,
    id_pessoa INT REFERENCES pessoas_usuarios(id_pessoa),
    id_modalidade INT REFERENCES modalidades(id_modalidade),
    nome_faixa VARCHAR(50) NOT NULL,
    divisao_nivel VARCHAR(20) CHECK (divisao_nivel IN ('NOVOS', 'ESPECIAL'))
);

-- 5. CAMPEONATOS E EVENTOS
CREATE TABLE campeonatos (
    id_campeonato SERIAL PRIMARY KEY,
    id_organizacao_promotora INT REFERENCES organizacoes_equipes(id_organizacao),
    nome_evento VARCHAR(150) NOT NULL,
    data_inicio DATE,
    data_fim DATE,
    local_ginasio VARCHAR(100),
    cidade_uf VARCHAR(50)
);

-- 6. ÁREAS DE COMPETIÇÃO (Tatames, Ringues, Octógonos)
CREATE TABLE areas_competicao (
    id_area SERIAL PRIMARY KEY,
    id_campeonato INT REFERENCES campeonatos(id_campeonato),
    nome_area VARCHAR(30) NOT NULL,
    tipo_area VARCHAR(20) CHECK (tipo_area IN ('Tatame', 'Ringue', 'Octogono'))
);

-- 7. CATEGORIAS DE DISPUTA
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    id_campeonato INT REFERENCES campeonatos(id_campeonato),
    id_modalidade INT REFERENCES modalidades(id_modalidade),
    nome_categoria VARCHAR(100) NOT NULL,
    divisao VARCHAR(20),
    genero VARCHAR(10),
    idade_min INT,
    idade_max INT,
    peso_min DECIMAL(5,2),
    peso_max DECIMAL(5,2),
    usar_kimono_gi BOOLEAN DEFAULT TRUE
);

-- 8. CONFRONTOS, CHAVES E PLACAR EM TEMPO REAL
CREATE TABLE confrontos_chave (
    id_confronto SERIAL PRIMARY KEY,
    id_categoria INT REFERENCES categorias(id_categoria),
    id_area INT REFERENCES areas_competicao(id_area),
    numero_luta VARCHAR(10),
    fase VARCHAR(30),
    id_atleta_aka_red INT REFERENCES pessoas_usuarios(id_pessoa),
    id_atleta_ao_blue INT REFERENCES pessoas_usuarios(id_pessoa),
    placar_red VARCHAR(50) DEFAULT '0',
    placar_blue VARCHAR(50) DEFAULT '0',
    status_luta VARCHAR(25) DEFAULT 'AGUARDANDO',
    id_vencedor INT REFERENCES pessoas_usuarios(id_pessoa),
    metodo_vitoria VARCHAR(30)
);
