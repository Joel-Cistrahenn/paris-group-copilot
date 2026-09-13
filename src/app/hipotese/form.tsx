"use client";

import { useState } from "react";
import { criarHipotese, type NovaHipotese, type Projeto } from "@/lib/api";

const campo = { display: "block", width: "100%", padding: 8, marginBottom: 12 };

export default function FormHipotese({ projetos }: { projetos: Projeto[] }) {
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function enviar(dados: FormData) {
    setErro(null);
    setOk(false);
    setEnviando(true);

    const payload: NovaHipotese = {
      projeto_id: Number(dados.get("projeto_id")),
      enunciado: String(dados.get("enunciado")),
      metrica: String(dados.get("metrica")),
      baseline: String(dados.get("baseline")),
      alvo: String(dados.get("alvo")),
      resultado: "em_teste",
    };

    const r = await criarHipotese(payload);
    if (r.ok) setOk(true);
    else setErro(r.erro);
    setEnviando(false);
  }

  return (
    <form action={enviar}>
      <label>
        Projeto
        <select name="projeto_id" required style={campo} defaultValue={projetos[0].id}>
          {projetos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
      </label>

      <label>
        Enunciado â Se [X], então [Y], porque [Z]
        <textarea name="enunciado" required rows={4} style={campo} />
      </label>

      <label>
        Métrica
        <input name="metrica" required style={campo} />
      </label>

      <label>
        Baseline (o número de hoje)
        <input name="baseline" required style={campo} />
      </label>

      <label>
        Alvo
        <input name="alvo" required style={campo} />
      </label>

      <button type="submit" disabled={enviando} style={{ padding: "8px 16px" }}>
        {enviando ? "Salvando…" : "Registrar hipótese"}
      </button>

      {erro && <p style={{ color: "#e5484d", marginTop: 12 }}>Erro: {erro}</p>}
      {ok && <p style={{ color: "#30a46c", marginTop: 12 }}>Hipótese registrada.</p>}
    </form>
  );
}
