"""Schemas de request/response. São eles que viram o contrato OpenAPI em /docs."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Resultado = Literal["em_teste", "validada", "refutada"]


class ProjetoCreate(BaseModel):
    nome: str = Field(min_length=1, max_length=200, examples=["Paris Group Copilot"])
    descricao: str = Field(default="", examples=["Registro de hipóteses testadas pelo studio"])


class ProjetoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str
    descricao: str
    criado_em: datetime


class HipoteseCreate(BaseModel):
    projeto_id: int = Field(examples=[1])
    enunciado: str = Field(
        min_length=1,
        examples=[
            "Se o Copilot mostrar hipóteses já testadas, então a Marina não repetirá "
            "caminhos que já falharam, porque a decisão vem do histórico."
        ],
    )
    metrica: str = Field(examples=["Dias perdidos re-testando abordagens descartadas"])
    baseline: str = Field(default="", examples=["2 a 4 dias por ocorrência"])
    alvo: str = Field(default="", examples=["menos de 1 dia"])
    resultado: Resultado = "em_teste"


class HipoteseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    projeto_id: int
    enunciado: str
    metrica: str
    baseline: str
    alvo: str
    resultado: Resultado
    criado_em: datetime
