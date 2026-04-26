from __future__ import annotations

import json

from app.llm.ollama_client import llm_available, ollama_generate_json


class KPIExtractor:
    async def run(self, text: str, institution_name: str) -> dict:
        if not text.strip():
            return {}

        if not await llm_available():
            raise RuntimeError("LLM backend unavailable for KPI extraction")

        prompt = f"""
Extract institutional KPIs from the text for institution "{institution_name}".
Return ONLY valid JSON using this shape:
{{
  "academic": {{"success_rate": number|null, "dropout_rate": number|null}},
  "finance": {{"budget_execution_rate": number|null}},
  "hr": {{"absenteeism_rate": number|null}}
}}
If a KPI cannot be inferred, set it to null.

TEXT:
{text[:4000]}
""".strip()

        response = await ollama_generate_json(
            prompt,
            timeout=120.0,
            num_predict=768,
        )
        parsed = json.loads(response)
        if not isinstance(parsed, dict):
            raise ValueError("kpi_extractor returned non-object JSON")
        return parsed
