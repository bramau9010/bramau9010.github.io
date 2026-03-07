"""
Update Pipeline — orquestrador do sistema de atualização do site.

Executa em sequência:
  1. github_agent → atualiza data/github.json
  2. profile_agent → atualiza data/projects.json (requer ANTHROPIC_API_KEY)
  3. Compara hashes dos JSONs para detectar mudanças
  4. Gera log de execução

Uso:
  python pipelines/update_pipeline.py
  python pipelines/update_pipeline.py --skip-profile   # pula Claude API
  python pipelines/update_pipeline.py --github-only    # só coleta GitHub
"""

import argparse
import hashlib
import json
import logging
import sys
from datetime import datetime, timezone
from pathlib import Path

# Adiciona a raiz do projeto ao path para importar agents
sys.path.insert(0, str(Path(__file__).parent.parent))

from agents import github_agent, profile_agent

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [pipeline] %(levelname)s %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
    ],
)
logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).parent.parent / "data"


def file_hash(path: Path) -> str | None:
    """Retorna SHA256 do arquivo ou None se não existir."""
    if not path.exists():
        return None
    return hashlib.sha256(path.read_bytes()).hexdigest()


def snapshot_hashes() -> dict[str, str | None]:
    """Captura hashes dos JSONs de dados antes da atualização."""
    files = ["github.json", "projects.json", "profile.json", "experience.json", "skills.json"]
    return {f: file_hash(DATA_DIR / f) for f in files}


def detect_changes(before: dict, after: dict) -> list[str]:
    """Retorna lista de arquivos que mudaram."""
    changed = []
    for f, hash_before in before.items():
        hash_after = after.get(f)
        if hash_before != hash_after:
            changed.append(f)
    return changed


def run(skip_profile: bool = False, github_only: bool = False) -> dict:
    start_time = datetime.now(timezone.utc)
    logger.info("=" * 60)
    logger.info("Starting update pipeline")
    logger.info(f"Time: {start_time.isoformat()}")
    logger.info("=" * 60)

    hashes_before = snapshot_hashes()
    results = {}

    # Step 1: GitHub Agent
    logger.info("\n[Step 1/2] Running github_agent...")
    try:
        github_result = github_agent.run()
        results["github_agent"] = {
            "status": "success",
            "repos_collected": github_result["_meta"]["total_repos"],
        }
        logger.info(f"github_agent: OK — {github_result['_meta']['total_repos']} repos")
    except Exception as e:
        results["github_agent"] = {"status": "error", "error": str(e)}
        logger.error(f"github_agent FAILED: {e}")
        # GitHub agent failure is critical — abort pipeline
        return _finalize(results, hashes_before, start_time, aborted=True)

    if github_only:
        logger.info("--github-only flag set — skipping profile_agent")
        return _finalize(results, hashes_before, start_time)

    # Step 2: Profile Agent (Claude API)
    if skip_profile:
        logger.info("[Step 2/2] Skipping profile_agent (--skip-profile flag)")
        results["profile_agent"] = {"status": "skipped"}
    else:
        logger.info("\n[Step 2/2] Running profile_agent (Claude API)...")
        try:
            profile_result = profile_agent.run()
            results["profile_agent"] = {
                "status": "success",
                "projects_generated": profile_result["_meta"]["total_projects"],
            }
            logger.info(f"profile_agent: OK — {profile_result['_meta']['total_projects']} projects")
        except ValueError as e:
            # Missing API key — warn but don't abort
            logger.warning(f"profile_agent skipped: {e}")
            results["profile_agent"] = {"status": "skipped", "reason": str(e)}
        except Exception as e:
            results["profile_agent"] = {"status": "error", "error": str(e)}
            logger.error(f"profile_agent FAILED: {e}")

    return _finalize(results, hashes_before, start_time)


def _finalize(results: dict, hashes_before: dict, start_time: datetime, aborted: bool = False) -> dict:
    hashes_after = snapshot_hashes()
    changed_files = detect_changes(hashes_before, hashes_after)

    end_time = datetime.now(timezone.utc)
    duration = (end_time - start_time).total_seconds()

    summary = {
        "run_at": start_time.isoformat(),
        "duration_seconds": round(duration, 2),
        "aborted": aborted,
        "changed_files": changed_files,
        "has_changes": len(changed_files) > 0,
        "agents": results,
    }

    logger.info("\n" + "=" * 60)
    logger.info("Pipeline Summary")
    logger.info(f"Duration: {duration:.1f}s")
    logger.info(f"Changed files: {changed_files or 'none'}")
    logger.info(f"Status: {'ABORTED' if aborted else 'COMPLETED'}")
    logger.info("=" * 60)

    # Print JSON summary for CI/CD consumption
    print("\n--- PIPELINE RESULT ---")
    print(json.dumps(summary, indent=2))

    return summary


def main():
    parser = argparse.ArgumentParser(description="Update pipeline for personal site data")
    parser.add_argument("--skip-profile", action="store_true", help="Skip Claude API call")
    parser.add_argument("--github-only", action="store_true", help="Only run github_agent")
    args = parser.parse_args()

    result = run(skip_profile=args.skip_profile, github_only=args.github_only)
    sys.exit(0 if not result.get("aborted") else 1)


if __name__ == "__main__":
    main()
