"""
LinkedIn Agent — esqueleto para sincronização semiautomática.

O LinkedIn não possui API pública para leitura de perfil.
O fluxo recomendado é via Export de Dados do LinkedIn:

## Como exportar seus dados do LinkedIn:
1. Acesse: LinkedIn → Configurações → Privacidade dos dados → Obter uma cópia dos seus dados
2. Selecione: "Connections", "Profile", "Positions", "Education"
3. Aguarde o email com o link para download (até 24h)
4. Extraia o ZIP e localize os arquivos:
   - Positions.csv → experiência profissional
   - Education.csv → formação acadêmica
   - Profile.csv → dados básicos do perfil
5. Coloque os arquivos em: data/linkedin_export/
6. Execute: python agents/linkedin_agent.py

O agente então converte os CSVs para data/linkedin.json e
atualiza data/experience.json e data/profile.json se necessário.

## Frequência recomendada:
- Export manual trimestral (LinkedIn permite apenas 1 export por período)
- Ou sempre que houver mudança significativa de cargo/empresa

## Status atual:
Este agente é um esqueleto documentado. A implementação completa
depende do formato dos arquivos exportados.
"""

import csv
import json
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s [linkedin_agent] %(message)s")
logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).parent.parent / "data"
LINKEDIN_EXPORT_DIR = DATA_DIR / "linkedin_export"


def parse_positions_csv(filepath: Path) -> list[dict]:
    """Converte Positions.csv do LinkedIn para lista de experiências."""
    if not filepath.exists():
        logger.warning(f"Not found: {filepath}")
        return []

    positions = []
    with open(filepath, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            positions.append({
                "company": row.get("Company Name", ""),
                "role": row.get("Title", ""),
                "start": row.get("Started On", ""),
                "end": row.get("Finished On", "") or None,
                "description": row.get("Description", ""),
                "location": row.get("Location", ""),
            })
    logger.info(f"Parsed {len(positions)} positions from CSV")
    return positions


def parse_education_csv(filepath: Path) -> list[dict]:
    """Converte Education.csv do LinkedIn para lista de formações."""
    if not filepath.exists():
        logger.warning(f"Not found: {filepath}")
        return []

    education = []
    with open(filepath, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            education.append({
                "institution": row.get("School Name", ""),
                "degree": row.get("Degree Name", ""),
                "field": row.get("Notes", ""),
                "start": row.get("Start Date", ""),
                "end": row.get("End Date", ""),
            })
    logger.info(f"Parsed {len(education)} education entries from CSV")
    return education


def run() -> dict:
    """Entry point — processa export do LinkedIn se disponível."""
    if not LINKEDIN_EXPORT_DIR.exists():
        logger.warning(
            f"LinkedIn export dir not found: {LINKEDIN_EXPORT_DIR}\n"
            "Coloque os arquivos exportados do LinkedIn em data/linkedin_export/ e rode novamente."
        )
        return {"positions": [], "education": []}

    positions = parse_positions_csv(LINKEDIN_EXPORT_DIR / "Positions.csv")
    education = parse_education_csv(LINKEDIN_EXPORT_DIR / "Education.csv")

    output = {
        "positions": positions,
        "education": education,
    }

    output_path = DATA_DIR / "linkedin.json"
    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2))
    logger.info(f"Saved LinkedIn data → {output_path}")
    return output


if __name__ == "__main__":
    run()
    print("LinkedIn agent completed (check logs for details)")
