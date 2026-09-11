"""Entidades do Paris Group Copilot: Projeto e Hipótese.

O enquadramento (docs/enquadramento.md) define o produto como um registro de
hipóteses testadas. Por isso Hipotese carrega `resultado` desde o primeiro dia:
sem resultado registrado, o produto não responde "já testaram isso antes?".
"""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Projeto(Base):
    __tablename__ = "projetos"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(200))
    descricao: Mapped[str] = mapped_column(Text, default="")
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    hipoteses: Mapped[list["Hipotese"]] = relationship(back_populates="projeto")


class Hipotese(Base):
    __tablename__ = "hipoteses"

    id: Mapped[int] = mapped_column(primary_key=True)
    projeto_id: Mapped[int] = mapped_column(ForeignKey("projetos.id"))
    enunciado: Mapped[str] = mapped_column(Text)
    metrica: Mapped[str] = mapped_column(String(300))
    baseline: Mapped[str] = mapped_column(String(200), default="")
    alvo: Mapped[str] = mapped_column(String(200), default="")
    # validada | refutada | em_teste — é este campo que dá memória ao studio.
    resultado: Mapped[str] = mapped_column(String(30), default="em_teste")
    criado_em: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    projeto: Mapped[Projeto] = relationship(back_populates="hipoteses")
