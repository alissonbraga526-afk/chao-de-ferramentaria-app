const apiHeaders = () => ({
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
});

const entered = prompt("Senha do painel administrativo:");
if (entered !== ADMIN_PASSWORD) {
  document.body.innerHTML = '<main class="section"><div class="card"><h2>Acesso negado</h2><p>Senha incorreta.</p><a class="secondary-btn" href="index.html">Voltar</a></div></main>';
  throw new Error("Senha incorreta");
}

let currentType = "tecnico";
const form = document.getElementById("contentForm");
const statusEl = document.getElementById("status");

document.querySelectorAll(".tab").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    currentType = btn.dataset.type;
    document.getElementById("tipo").value = currentType;
    loadAdmin();
  });
});

form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  if (SUPABASE_URL.includes("COLE_AQUI")) {
    statusEl.textContent = "Configure o Supabase em config.js antes de publicar.";
    return;
  }
  const payload = {
    tipo: currentType,
    titulo: document.getElementById("titulo").value.trim(),
    descricao: document.getElementById("descricao").value.trim(),
    link: document.getElementById("link").value.trim() || null,
    data_evento: document.getElementById("data").value || null
  };
  statusEl.textContent = "Publicando...";
  const res = await fetch(`${SUPABASE_URL}/rest/v1/conteudos`, {
    method:"POST", headers:apiHeaders(), body:JSON.stringify(payload)
  });
  if (res.ok) {
    form.reset();
    document.getElementById("tipo").value = currentType;
    statusEl.textContent = "Publicado com sucesso.";
    loadAdmin();
  } else {
    statusEl.textContent = "Erro ao publicar. Verifique a configuração.";
  }
});

async function loadAdmin(){
  const el=document.getElementById("admin-list");
  if (SUPABASE_URL.includes("COLE_AQUI")) {
    el.innerHTML='<div class="card"><p>Configure o Supabase em config.js.</p></div>';
    return;
  }
  const res=await fetch(`${SUPABASE_URL}/rest/v1/conteudos?tipo=eq.${currentType}&select=*&order=created_at.desc`,{headers:apiHeaders()});
  const data=await res.json();
  el.innerHTML=data.map(item=>`
    <article class="card">
      <h3>${escapeHtml(item.titulo)}</h3>
      <p>${escapeHtml(item.descricao)}</p>
      <button class="danger-btn" onclick="removeItem('${item.id}')">Excluir</button>
    </article>`).join("") || '<div class="card"><p>Nenhum item publicado.</p></div>';
}

async function removeItem(id){
  if(!confirm("Excluir este conteúdo?")) return;
  const res=await fetch(`${SUPABASE_URL}/rest/v1/conteudos?id=eq.${id}`,{method:"DELETE",headers:apiHeaders()});
  if(res.ok) loadAdmin();
}

function escapeHtml(s=""){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}
loadAdmin();
