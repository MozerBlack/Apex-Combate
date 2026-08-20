-- ============================================================
-- DADOS INICIAIS DE TESTE (SEED) - APEX COMBATE
-- ============================================================

-- 1. ORGANIZAÇÕES E EQUIPES (Incluindo logins e dados de contato dos Clubes)
INSERT INTO organizacoes_equipes (nome_organizacao, sigla, tipo_organizacao, tecnico_responsavel, cidade_uf, usuario, email, telefone, senha_hash) VALUES
('Confederação Brasileira de Karatê', 'CBK', 'FEDERACAO', 'Presidente CBK', 'Brasília/DF', 'cbk_master', 'contato@cbk.org.br', '5561999990000', '$2b$12$hash...exemplo'),
('Dojo Apex Combate', 'APEX', 'DOJO', 'Mestre Ryusaki', 'Curitiba/PR', 'clube.apex', 'contato@apexdojo.com', '5541988881111', '$2b$12$hash...exemplo'),
('Associação Shoto-Kan', 'ASK', 'DOJO', 'Sensei Tanaka', 'São Paulo/SP', 'clube.shotokan', 'contato@shotokan.com', '5511977772222', '$2b$12$hash...exemplo');

-- 2. MODALIDADES
INSERT INTO modalidades (nome_modalidade, sigla, tipo_pontuacao, tipo_area_padrao) VALUES
('Karatê', 'KRT', 'Pontos_Diretos', 'Tatame'),
('Jiu-Jitsu', 'BJJ', 'Pontos_Submissao', 'Tatame'),
('Judô', 'JUD', 'Ippon_Wazaari', 'Tatame'),
('Muay Thai', 'MT', 'Rounds_Decisao_KO', 'Ringue'),
('MMA', 'MMA', 'Rounds_Submissao_KO', 'Octogono');

-- 3. PESSOAS / USUÁRIOS
-- Atletas: CPF (login) + Data Nasc (senha). 
-- Federação: Presidente (PRES-01 com 2FA) e Admin (admin@federacao).
INSERT INTO pessoas_usuarios (nome_completo, cpf, data_nascimento, email, telefone, identificador_master, senha_hash, tipo_perfil, id_organizacao, genero, registro_federacao) VALUES
('João Mozer', '12345678900', '2000-05-15', 'joao.mozer@email.com', '5541999991111', NULL, NULL, 'ATLETA', 2, 'Masculino', 'CBK-45892'),
('Danilo Emanuel', '98765432100', '1998-10-20', 'danilo@email.com', '5541999992222', NULL, NULL, 'ATLETA', 3, 'Masculino', 'CBK-99821'),
('Mestre Ryusaki', '23456789011', '1980-03-22', 'ryusaki@apexdojo.com', '5541988881111', NULL, '$2b$12$hash...exemplo', 'TECNICO', 2, 'Masculino', 'COACH-2026'),
('Carlos Silva', '34567890122', '1992-08-10', 'carlos.mesario@cbk.org.br', '5561999993333', NULL, '$2b$12$hash...exemplo', 'MESARIO', 1, 'Masculino', 'REF-0091'),
('Equipe Operacional Admin', '45678901233', '1990-01-01', 'admin@federacao.com', '5561988884444', 'admin@federacao', '$2b$12$hash...exemplo', 'ADMIN', 1, 'Masculino', 'FED-ADMIN'),
('Presidente Apex Master', '56789012344', '1975-11-05', 'presidente@federacao.com', '5561999995555', 'PRES-01', '$2b$12$hash...exemplo', 'PRESIDENTE', 1, 'Masculino', 'FED-PRES');

-- 4. GRADUAÇÕES DOS ATLETAS
INSERT INTO graduacoes (id_pessoa, id_modalidade, nome_faixa, divisao_nivel) VALUES
(1, 1, '3º Kyu (Roxa)', 'NOVOS'),
(1, 2, 'Faixa Azul', 'NOVOS'),
(2, 1, '2º Kyu (Marrom)', 'NOVOS'),
(3, 1, '1º Dan (Preta)', 'ESPECIAL');

-- 5. CAMPEONATO
INSERT INTO campeonatos (id_organizacao_promotora, nome_evento, data_inicio, data_fim, local_ginasio, cidade_uf) VALUES
(1, 'Open Internacional Apex Combate 2026', '2026-09-15', '2026-09-17', 'Ginásio do Tarumã', 'Curitiba/PR');

-- 6. ÁREAS DE COMPETIÇÃO
INSERT INTO areas_competicao (id_campeonato, nome_area, tipo_area) VALUES
(1, 'Quadra 1 / Tatame A', 'Tatame'),
(1, 'Quadra 2 / Tatame B', 'Tatame'),
(1, 'Ringue Principal', 'Ringue');

-- 7. CATEGORIAS DE DISPUTA
INSERT INTO categorias (id_campeonato, id_modalidade, nome_categoria, divisao, genero, idade_min, idade_max, peso_min, peso_max, usar_kimono_gi) VALUES
(1, 1, 'Senior Masculino -75kg NOVOS', 'NOVOS', 'Masculino', 18, 34, 68.00, 75.00, TRUE),
(1, 2, 'Adulto Azul Absoluto No-Gi', 'ESPECIAL', 'Masculino', 18, 29, NULL, NULL, FALSE);

-- 8. CONFRONTOS, CHAVES E PLACAR EM TEMPO REAL
INSERT INTO confrontos_chave (id_categoria, id_area, numero_luta, fase, id_atleta_aka_red, id_atleta_ao_blue, placar_red, placar_blue, status_luta, id_vencedor, metodo_vitoria) VALUES
(1, 2, 'Luta 3', 'Quartas de Final', 2, 1, '4', '2', 'EM_ANDAMENTO', NULL, NULL);