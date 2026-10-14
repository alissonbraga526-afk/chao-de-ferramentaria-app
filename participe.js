const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

function valor(id) {
  return document.getElementById(id)?.value?.trim() || "";
}

async function salvarParticipacao(dados) {
  const { error } = await db
    .from("participacoes")
    .insert([dados]);

  if (error) {
    console.error(error);
    alert("Não foi possível enviar. Tente novamente.");
    return false;
  }

  alert("Enviado com sucesso! Obrigado por participar.");
  return true;
}

async function enviarTema() {
  const descricao = valor("tema-desc");

  if (!descricao) {
    alert("Preencha a descrição do tema.");
    return;
  }

  const ok = await salvarParticipacao({
    tipo: "tema",
    nome: valor("tema-nome"),
    empresa_profissao: valor("tema-profissao"),
    titulo: valor("tema-titulo"),
    descricao: descricao,
    contato: valor("tema-contato")
  });

  if (ok) {
    ["tema-nome","tema-profissao","tema-titulo","tema-desc","tema-contato"]
      .forEach(id => document.getElementById(id).value = "");
  }
}

async function enviarEmpresa() {
  const descricao = valor("empresa-desc");

  if (!descricao) {
    alert("Conte por que você indica essa empresa.");
    return;
  }

  const ok = await salvarParticipacao({
    tipo: "empresa",
    nome: valor("empresa-nome"),
    titulo: valor("empresa-titulo"),
    descricao: descricao,
    cidade_estado: valor("empresa-cidade"),
    link: valor("empresa-link"),
    contato: valor("empresa-contato")
  });

  if (ok) {
    ["empresa-nome","empresa-cidade","empresa-titulo","empresa-link","empresa-desc","empresa-contato"]
      .forEach(id => document.getElementById(id).value = "");
  }
}

async function enviarVaga() {
  const descricao = valor("vaga-desc");

  if (!descricao) {
    alert("Preencha a descrição da vaga.");
    return;
  }

  const ok = await salvarParticipacao({
    tipo: "vaga",
    nome: valor("vaga-nome"),
    titulo: valor("vaga-titulo"),
    descricao: descricao,
    cidade_estado: valor("vaga-cidade"),
    link: valor("vaga-link"),
    contato: valor("vaga-contato")
  });

  if (ok) {
    ["vaga-nome","vaga-titulo","vaga-cidade","vaga-desc","vaga-link","vaga-contato"]
      .forEach(id => document.getElementById(id).value = "");
  }
}
