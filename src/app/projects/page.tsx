import { redirect } from "next/navigation";

/**
 * Apelido em inglês para a rota canônica `/projeto`.
 *
 * O produto é escrito em português — entidades, rotas e schema. Este alias existe
 * para links externos e documentação em inglês não quebrarem. Redireciona em vez
 * de duplicar a página: uma fonte de verdade só.
 */
export default function ProjectsAlias() {
  redirect("/projeto");
}
