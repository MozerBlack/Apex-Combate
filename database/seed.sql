-- ============================================================
-- DADOS INICIAIS DE TESTE (SEED) - APEX COMBATE
-- ============================================================

-- 1. ORGANIZAÇÕES E EQUIPES
INSERT INTO organizacoes_equipes (nome_organizacao, sigla, tipo_organizacao, tecnico_responsavel, cidade_uf) VALUES
('Confederação Brasileira de Karatê', 'CBK', 'FEDERACAO', 'Presidente CBK', 'Brasília/DF'),
('Dojo Apex Combate', 'APEX', 'DOJO', 'Mestre Ryusaki', 'Curitiba/PR'),
('Associação Shoto-Kan', 'ASK', 'DOJO', 'Sensei Tanaka', 'São Paulo/SP');

-- 2. MODALIDADES
INSERT INTO modalidades (nome_modalidade, sigla, tipo_pontuacao, tipo_area_padrao) VALUES
('Karatê', 'KRT', 'Pontos_Diretos', 'Tatame'),
('Jiu-Jitsu', 'BJJ', 'Pontos_Submissao', 'Tatame'),
('Judô', 'JUD', 'Ippon_Wazaari', 'Tatame'),
('Muay Thai', 'MT', 'Rounds_Decisao_KO', 'Ringue'),
('MMA', 'MMA', 'Rounds_Submissao_KO', 'Octogono');

-- 3. PESSOAS / USUÁRIOS (Atletas possuem CPF e Data de Nascimento obrigatórios)
INSERT INTO pessoas_usuarios (nome_completo, cpf, data_nascimento, email, senha_hash, tipo_perfil, id_organizacao, genero, registro_federacao) VALUES
('João Mozer', '12345678900', '2000-05-15', 'joao.mozer@email.com', NULL, 'ATLETA', 2, 'Masculino', 'CBK-45892'),
('Danilo Emanuel', '98765432100', '1998-10-20', NULL, NULL, 'ATLETA', 3, 'Masculino', 'CBK-99821'),
('Mestre Ryusaki', '23456789011', '1980-03-22', 'ryusaki@apexdojo.com', '$2b$12$hash...exemplo', 'TECNICO', 2, 'Masculino', 'COACH-2026'),
('Carlos Silva', '34567890122', '1992-08-10', 'carlos.mesario@cbk.org.br', '$2b$12$hash...exemplo', 'MESARIO', 1, 'Masculino', 'REF-0091'),
('Admin CBK', '45678901233', '1975-11-05', 'admin@cbk.org.br', '$2b$12$hash...exemplo', 'ADMIN', 1, 'Masculino', 'FED-0001');

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