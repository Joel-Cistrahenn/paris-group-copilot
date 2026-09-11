"""API do Paris Group Copilot.

Dois recursos, Projeto e Hipótese, porque são as duas entidades que o
enquadramento exige: um projeto agrupa hipóteses, e a hipótese carrega o
resultado que dá memória ao studio.
"""

import os

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker

from models import Base, Hipotese, Projeto
from schemas import HipoteseCreate, HipoteseOut, ProjetoCreate, ProjetoOut

DATABASE_URL = os.environ.get(
    "DATABASE_URL", "postgresql+psycopg://copilot:copilot@db:5432/copilot"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)

app = FastAPI(
    title="Paris Group Copilot API",
    version="0.1.0",
    description=(
        "Registro de projetos e hipóteses de um venture studio. "
        "Contrato gerado automaticamente pelo FastAPI em /docs."
    ),
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.on_event("startup")
def criar_tabelas() -> None:
    Base.metadata.create_all(engine)


@app.get("/health", tags=["infra"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/projetos", response_model=ProjetoOut, status_code=201, tags=["projetos"])
def criar_projeto(payload: ProjetoCreate, db: Session = Depends(get_db)) -> Projeto:
    projeto = Projeto(**payload.model_dump())
    db.add(projeto)
    db.commit()
    db.refresh(projeto)
    return projeto


@app.get("/projetos", response_model=list[ProjetoOut], tags=["projetos"])
def listar_projetos(db: Session = Depends(get_db)) -> list[Projeto]:
    return list(db.scalars(select(Projeto).order_by(Projeto.id)))


@app.post("/hipoteses", response_model=HipoteseOut, status_code=201, tags=["hipoteses"])
def criar_hipotese(payload: HipoteseCreate, db: Session = Depends(get_db)) -> Hipotese:
    if db.get(Projeto, payload.projeto_id) is None:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    hipotese = Hipotese(**payload.model_dump())
    db.add(hipotese)
    db.commit()
    db.refresh(hipotese)
    return hipotese


@app.get("/hipoteses", response_model=list[HipoteseOut], tags=["hipoteses"])
def listar_hipoteses(
    projeto_id: int | None = None, db: Session = Depends(get_db)
) -> list[Hipotese]:
    stmt = select(Hipotese).order_by(Hipotese.id)
    if projeto_id is not None:
        stmt = stmt.where(Hipotese.projeto_id == projeto_id)
    return list(db.scalars(stmt))
