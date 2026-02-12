from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path


@dataclass(slots=True)
class AgentConfig:
    service_name: str
    endpoint: str
    auth_token: str = ""
    db_options: dict[str, bool] = field(default_factory=dict)


def load_config(path: str | Path = "config.json") -> AgentConfig:
    raw = json.loads(Path(path).read_text(encoding="utf-8"))
    return AgentConfig(
        service_name=raw.get("serviceName", "python-service"),
        endpoint=raw.get("endpoint", "http://localhost:8888"),
        auth_token=raw.get("authToken", ""),
        db_options=raw.get("dbOptions", {}),
    )
