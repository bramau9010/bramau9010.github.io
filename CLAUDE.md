# CLAUDE.md — Agente de Presença Digital

## Contexto do Projeto
Sistema automatizado que mantém o site pessoal profissional de **Brayan Mauricio Rodriguez Garzón** sempre atualizado.

- **Owner:** Brayan Mauricio Rodriguez Garzón
- **GitHub:** https://github.com/bramau9010
- **LinkedIn:** https://www.linkedin.com/in/brayan-mauricio-rodriguez-garzon/

## Arquitetura
```
├── data/          # JSONs versionados — fonte de verdade do perfil
├── agents/        # Agentes Python (GitHub API + Claude API)
├── pipelines/     # Orquestrador do pipeline de atualização
├── site/          # Next.js 14 com export estático → GitHub Pages
└── .github/       # GitHub Actions (cron mensal + deploy automático)
```

## Stack
- **Backend/Agentes:** Python 3.11 + Anthropic SDK + requests
- **Frontend:** Next.js 14 + Tailwind CSS + Framer Motion
- **Deploy:** GitHub Pages via GitHub Actions
- **Dados:** JSON versionados no repositório

## Comandos Essenciais

### Pipeline Python
```bash
# Instalar dependências
pip install -r requirements.txt

# Rodar pipeline completo (requer ANTHROPIC_API_KEY)
python pipelines/update_pipeline.py

# Só coletar GitHub (sem Claude API)
python pipelines/update_pipeline.py --github-only

# Coletar GitHub + pular Claude
python pipelines/update_pipeline.py --skip-profile

# Rodar agentes individualmente
python agents/github_agent.py
python agents/profile_agent.py
python agents/linkedin_agent.py
```

### Site Next.js
```bash
cd site

# Instalar dependências
npm install

# Dev server (localhost:3000)
npm run dev

# Build de produção (gera site/)
npm run build

# Verificar pasta de output
ls out/
```

## Variáveis de Ambiente
- Copie `.env.example` para `.env`
- **GROQ_API_KEY** — preferido (gratuito, rápido, modelo `llama-3.3-70b-versatile`)
- **OPENAI_API_KEY** — fallback automático se Groq falhar (`gpt-4o-mini`)
- No GitHub Actions: adicionar ambos como Secrets → Settings → Secrets

## Dados (data/)
| Arquivo | Descrição | Atualização |
|---|---|---|
| `profile.json` | Perfil base (nome, bio, formação, contatos) | Manual |
| `experience.json` | Experiência profissional com bullets | Manual |
| `skills.json` | Stack tecnológico categorizado | Manual |
| `github.json` | Repos do GitHub | Automático (github_agent) |
| `projects.json` | Projetos com descrições profissionais | Automático (profile_agent + Claude) |

## Deploy (GitHub Pages)
1. Crie o repositório no GitHub (ex: `bramau9010.github.io`)
2. Adicione o Secret `ANTHROPIC_API_KEY` em Settings → Secrets
3. Habilite GitHub Pages em Settings → Pages → Source: GitHub Actions
4. Faça push do código → o workflow roda automaticamente
5. Para deploy manual: GitHub Actions tab → "Update Data & Deploy Site" → Run workflow

## Configuração do basePath
Se o repositório NÃO for `username.github.io`, descomente e ajuste em `site/next.config.js`:
```js
basePath: '/nome-do-repositorio',
```

## LLM Usado
- **Groq** (preferido): `llama-3.3-70b-versatile` — gratuito, ~500 tokens/s
- **OpenAI** (fallback): `gpt-4o-mini` — usado se GROQ_API_KEY falhar
- Lógica de fallback automática em `agents/profile_agent.py`

## Estrutura dos Agentes
- **github_agent.py** — Coleta repos públicos via GitHub API (sem auth)
- **profile_agent.py** — Usa Claude para gerar descrições profissionais dos repos
- **linkedin_agent.py** — Esqueleto para processar export manual do LinkedIn
- **update_pipeline.py** — Orquestrador: roda agentes → detecta mudanças → loga

## Notas Importantes
- O site é **estático** (Next.js export) — sem servidor backend
- O `data/` directory é lido em **build time** via `getStaticProps()`
- O pipeline roda **mensalmente** via cron (dia 1, 6h UTC) + manual via workflow_dispatch
- Mudanças nos JSONs são commitadas automaticamente pelo GitHub Actions
