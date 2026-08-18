# 🥋 Apex Combate — Plataforma Universal de Artes Marciais

> Sistema responsivo e multiplataforma (Web/Mobile/Desktop) para gestão completa de torneios de artes marciais (Karatê, BJJ, Judô, Muay Thai, MMA e mais).

---

## 📌 Sobre o Projeto

O **Apex Combate** foi desenvolvido para centralizar a gestão de campeonatos de artes marciais, desde a inscrição dos atletas até o placar ao vivo e exibição nas quadras/arenas.

* **Projeto de Aplicação & Banco de Dados (PG & DB)**
* **Integrante:** João Mozer
* **Professor Orientador:** Victor Longui

---

## 🗄️ Estrutura do Banco de Dados (Modelo Simplificado - 8 Tabelas)

O banco de dados foi otimizado e unificado em **8 tabelas relacionais chave**:

1. **`pessoas_usuarios`**: Cadastro único de Atletas, Técnicos, Mesários e Admins + dados de login.
2. **`organizacoes_equipes`**: Gestão unificada de Federações, Confederações e Dojos/Academias.
3. **`modalidades`**: Configuração das Artes Marciais (Karatê, BJJ, Judô, Muay Thai, MMA, etc.).
4. **`graduacoes`**: Vínculo de faixas e níveis dos atletas por modalidade.
5. **`campeonatos`**: Eventos e torneios cadastrados.
6. **`areas_competicao`**: Gestão de Tatames, Ringues e Octógonos.
7. **`categorias`**: Divisões de disputa (Idade, Peso, Novos vs Especial, Gi vs No-Gi).
8. **`confrontos_chave`**: Lutas, chaveamento, placar em tempo real e resultado final.

---

## 💻 Compatibilidade e Dispositivos

A aplicação foi planejada para funcionar de forma **responsiva** em qualquer dispositivo:

| Dispositivo | Perfil de Uso |
| :--- | :--- |
| 📱 **Celulares** | Atletas (carteirinha, chamadas) e Técnicos (acompanhamento do dojo). |
| 📑 **Tablets** | Mesários e Árbitros (mesa de pontuação e controle de luta em tempo real). |
| 💻 **PC / Notebook** | Federação e Admins (cadastro de torneios, chaves e emissão de relatórios). |
| 📺 **Telas Grandes / TVs** | Exibição pública dos placares e chamadas de quadra no ginásio. |

---

## 📂 Estrutura de Repositório

```text
Apex-Combate/
├── database/
│   └── schema.sql       # Script de criação das 8 tabelas unificadas
├── README.md            # Documentação principal do projeto
├── .gitignore           # Configurações de arquivos ignorados
└── LICENSE              # Licença Open Source (MIT)
