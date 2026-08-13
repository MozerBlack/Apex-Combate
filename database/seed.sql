-- ============================================================
-- DADOS INICIAIS DE TESTE (SEED) - APEX COMBATE
-- ============================================================

-- 1. INSERINDO ORGANIZAÇÕES E EQUIPES
INSERT INTO organizacoes_equipes (nome_organizacao, sigla, tipo_organizacao, tecnico_responsavel, cidade_uf) VALUES
('Confederação Brasileira de Karatê', 'CBK', 'FEDERACAO', 'Presidente CBK', 'Brasília/DF'),
('Dojo Apex Combate', 'APEX', 'DOJO', 'Mestre Ryusaki', 'Curitiba/PR'),
('Associação Shoto-Kan', 'ASK', 'DOJO', 'Sensei Tanaka', 'São Paulo/SP');

-- 2. INSERINDO MODALIDADES
INSERT INTO modalidades (nome_modalidade, sigla, tipo_pontuacao, tipo_area_padrao) VALUES
('Karatê', 'KRT', 'Pontos_Diretos', 'Tatame'),
('Jiu-Jitsu', 'BJJ', 'Pontos_Submissao', 'Tatame'),
('Judô', 'JUD', 'Ippon_Wazaari', 'Tatame'),
('Muay Thai', 'MT', 'Rounds_Decisao_KO', 'Ringue'),
('MMA', 'MMA', 'Rounds_Submissao_KO', 'Octogono');

-- 3. INSERINDO PESSOAS / USUÁRIOS
INSERT INTO pessoas_usuarios (nome_completo, cpf, email, senha_hash, tipo_perfil, id_organizacao, data_nascimento, genero, registro_federacao) VALUES
('João Mozer', '123.456.789-00', 'joao.mozer@email.com', '$2b$12$hash...exemplo', 'ATLETA', 2, '2000-05-15', 'Masculino', 'CBK-45892'),
('Mestre Ryusaki', '234.567.890-11', 'ryusaki@apexdojo.com', '$2b$12$hash...exemplo', 'TECNICO', 2, '1980-03-22', 'Masculino', 'COACH-2026'),
('Carlos Silva', '345.678.901-22', 'carlos.mesario@cbk.org.br', '$2b$12$hash...exemplo', 'MESARIO', 1, '1992-08-10', 'Masculino', 'REF-0091'),
('Admin CBK', '456.789.012-33', 'admin@cbk.org.br', '$2b$12$hash...exemplo', 'ADMIN', 1, '1975-11-05', 'Masculino', 'FED-0001');

-- 4. INSERINDO GRADUAÇÕES DOS ATLETAS
INSERT INTO graduacoes (id_pessoa, id_modalidade, nome_faixa, divisao_nivel) VALUES
(1, 1, '3º Kyu (Roxa)', 'NOVOS'),
(1, 2, 'Faixa Azul', 'NOVOS'),
(2, 1, '1º Dan (Preta)', 'ESPECIAL');

-- 5. INSERINDO CAMPEONATO
INSERT INTO campeonatos (id_organizacao_promotora, nome_evento, data_inicio, data_fim, local_ginasio, cidade_uf) VALUES
(1, 'Open Internacional Apex Combate 2026', '2026-09-15', '2026-09-17', 'Ginásio do Tarumã', 'Curitiba/PR');

-- 6. INSERINDO ÁREAS DE COMPETIÇÃO
INSERT INTO areas_competicao (id_campeonato, nome_area, tipo_area) VALUES
(1, 'Quadra 1 / Tatame A', 'Tatame'),
(1, 'Quadra 2 / Tatame B', 'Tatame'),
(1, 'Ringue Principal', 'Ringue');

-- 7. INSERINDO CATEGORIAS
INSERT INTO categorias (id_campeonato, id_modalidade, nome_categoria, divisao, genero, idade_min, idade_max, peso_min, peso_max, usar_kimono_gi) VALUES
(1, 1, 'Senior Masculino -75kg NOVOS', 'NOVOS', 'Masculino', 18, 34, 68.00, 75.00, TRUE),
(1, 2, 'Adulto Azul Absoluto No-Gi', 'ESPECIAL', 'Masculino', 18, 29, NULL, NULL, FALSE);

-- 8. INSERINDO CONFRONTO / CHAVE DE EXEMPLO
INSERT INTO confrontos_chave (id_categoria, id_area, numero_luta, fase, id_atleta_aka_red, id_atleta_ao_blue, placar_red, placar_blue, status_luta, id_vencedor, metodo_vitoria) VALUES
(1, 1, 'Luta 1', 'Quartas de Final', 1, 1, '3', '1', 'FINALIZADO', 1, 'Pontos');
