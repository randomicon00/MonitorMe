from fastapi import FastAPI

from monitorme_server_agent_py import load_config, setup_fastapi

app = FastAPI()
setup_fastapi(app, load_config("config.example.json"))


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
