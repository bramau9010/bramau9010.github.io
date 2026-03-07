"""
Profile Agent — usa GROQ API (preferência) ou OpenAI como fallback para:
1. Gerar descrições profissionais de repos do GitHub
2. Salvar data/projects.json com projetos enriquecidos

Prioridade de API:
  1. GROQ_API_KEY   → llama-3.3-70b-versatile (rápido, gratuito)
  2. OPENAI_API_KEY → gpt-4o-mini (fallback)
"""

import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [profile_agent] %(message)s")
logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).parent.parent / "data"

GROQ_MODEL = "llama-3.3-70b-versatile"
OPENAI_MODEL = "gpt-4o-mini"

# Repos com contexto adicional para enriquecer as descrições
REPO_OVERRIDES = {
    "Estudo_Similaridade_Falas_em_YouTube": {
        "highlight": True,
        "context": "Projeto de MBA USP/CeMEAI — análise de tendências do YouTube no Brasil usando YouTube API v3 e dataset Kaggle (atualizado diariamente desde ago/2020). Orientadora: Maristela Santos.",
    },
    "Trello_Equipe": {
        "highlight": True,
        "context": "Visualizações customizadas do quadro Trello da equipe de analytics, gerando insights sobre fluxo de trabalho e produtividade da equipe.",
    },
    "FrontEnd_Agente_Regulador": {
        "highlight": True,
        "context": "Frontend de um agente regulador inteligente — interface para monitoramento e controle de processos automatizados.",
    },
}


def load_json(path: Path) -> dict:
    if not path.exists():
        raise FileNotFoundError(f"Required file not found: {path}")
    return json.loads(path.read_text())


def build_prompt(repos: list[dict], profile: dict) -> str:
    profile_summary = (
        f"Nome: {profile['name']}\n"
        f"Título: {profile['title']}\n"
        f"Bio: {profile['bio']}\n"
        f"Formação: {', '.join(e['degree'] for e in profile['education'])}\n"
        f"Interesses: {', '.join(profile['interests'])}"
    )

    repos_text = []
    for r in repos:
        override = REPO_OVERRIDES.get(r["name"], {})
        context = override.get("context", "")
        repos_text.append(
            f"- Nome: {r['name']}\n"
            f"  Linguagem: {r['language'] or 'N/A'}\n"
            f"  Descrição GitHub: {r['description'] or '(vazia)'}\n"
            f"  Contexto adicional: {context or '(nenhum)'}\n"
            f"  Stars: {r['stars']} | URL: {r['url']}"
        )

    repos_block = "\n\n".join(repos_text)

    return f"""Você é um especialista em criação de portfólios técnicos para Data Scientists.

## Perfil do Profissional
{profile_summary}

## Repositórios GitHub
{repos_block}

## Tarefa
Para cada repositório acima, gere uma descrição profissional em português (Brasil) que:
1. Seja clara e impactante (2-3 frases)
2. Destaque o valor técnico e de negócio
3. Use linguagem adequada para recrutadores e profissionais de tech
4. Se a descrição do GitHub estiver vazia, inferir o propósito pelo nome e contexto

Retorne APENAS um JSON válido no formato:
{{
  "projects": [
    {{
      "name": "nome_do_repo",
      "description_professional": "descrição profissional gerada",
      "highlight": true/false,
      "tags": ["tag1", "tag2"],
      "language": "linguagem",
      "stars": N,
      "url": "https://..."
    }}
  ]
}}

Marque como highlight=true os projetos mais relevantes para o portfólio."""


def _extract_json(raw: str) -> dict:
    """Extrai JSON da resposta mesmo se vier com markdown code fences."""
    text = raw.strip()
    if "```" in text:
        start = text.find("{")
        end = text.rfind("}") + 1
        text = text[start:end]
    return json.loads(text)


def _call_groq(prompt: str) -> str:
    from groq import Groq
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY não encontrado")

    client = Groq(api_key=api_key)
    logger.info(f"Calling Groq API ({GROQ_MODEL})...")
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        max_tokens=4096,
        temperature=0.3,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content


def _call_openai(prompt: str) -> str:
    from openai import OpenAI
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY não encontrado")

    client = OpenAI(api_key=api_key)
    logger.info(f"Calling OpenAI API ({OPENAI_MODEL})...")
    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        max_tokens=4096,
        temperature=0.3,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content


def generate_projects(repos: list[dict], profile: dict) -> tuple[list[dict], str]:
    """Retorna (projects, provider_used)."""
    prompt = build_prompt(repos, profile)
    raw = None
    provider = None

    # 1ª tentativa: Groq
    if os.environ.get("GROQ_API_KEY"):
        try:
            raw = _call_groq(prompt)
            provider = f"groq/{GROQ_MODEL}"
        except Exception as e:
            logger.warning(f"Groq failed: {e} — trying OpenAI fallback...")

    # 2ª tentativa: OpenAI
    if raw is None:
        if not os.environ.get("OPENAI_API_KEY"):
            raise ValueError("Nenhuma API key disponível (GROQ_API_KEY ou OPENAI_API_KEY)")
        raw = _call_openai(prompt)
        provider = f"openai/{OPENAI_MODEL}"

    logger.info(f"Received {len(raw)} chars from {provider}")
    result = _extract_json(raw)
    return result.get("projects", []), provider


def run() -> dict:
    """Entry point — gera projects.json a partir de github.json + profile.json."""
    github_data = load_json(DATA_DIR / "github.json")
    profile = load_json(DATA_DIR / "profile.json")

    repos = github_data.get("repos", [])
    if not repos:
        logger.warning("github.json has no repos — run github_agent first")
        return {"_meta": {}, "projects": []}

    projects, provider = generate_projects(repos, profile)

    # Garantir highlights definidos manualmente
    for p in projects:
        override = REPO_OVERRIDES.get(p.get("name", ""), {})
        if override.get("highlight"):
            p["highlight"] = True

    output = {
        "_meta": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "source": f"Generated by profile_agent.py using {provider}",
            "total_projects": len(projects),
        },
        "projects": projects,
    }

    output_path = DATA_DIR / "projects.json"
    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2))
    logger.info(f"Saved {len(projects)} projects → {output_path} (via {provider})")
    return output


if __name__ == "__main__":
    result = run()
    print(f"Generated {result['_meta']['total_projects']} projects via {result['_meta']['source']}")
