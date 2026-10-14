let accessToken=localStorage.getItem("cdf_access_token")||"";let currentType="tecnico";
const loginView=document.getElementById("loginView"),adminView=document.getElementById("adminView"),loginForm=document.getElementById("loginForm"),loginStatus=document.getElementById("loginStatus"),form=document.getElementById("contentForm"),statusEl=document.getElementById("status");
function headers(json=false){const h={apikey:SUPABASE_ANON_KEY,Authorization:`Bearer ${accessToken}`};if(json)h["Content-Type"]="application/json";return h}
function showAdmin(){loginView.style.display="none";adminView.style.display="block";loadAdmin()}function showLogin(msg=""){adminView.style.display="none";loginView.style.display="block";loginStatus.textContent=msg}
async function verify(){if(!accessToken)return showLogin();const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:headers()});if(r.ok)showAdmin();else{localStorage.removeItem("cdf_access_token");accessToken="";showLogin("Sessão expirada.")}}
loginForm.addEventListener("submit",async e=>{e.preventDefault();loginStatus.textContent="Entrando...";const email=document.getElementById("email").value.trim(),password=document.getElementById("password").value;const r=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:SUPABASE_ANON_KEY,"Content-Type":"application/json"},body:JSON.stringify({email,password})});const d=await r.json();if(r.ok&&d.access_token){accessToken=d.access_token;localStorage.setItem("cdf_access_token",accessToken);showAdmin()}else loginStatus.textContent="Confira e-mail e senha."});
document.getElementById("logoutBtn").addEventListener("click",()=>{localStorage.removeItem("cdf_access_token");accessToken="";showLogin("Você saiu.")});
document.querySelectorAll(".tab").forEach(b =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(x =>
      x.classList.remove("active")
    );

    b.classList.add("active");
    currentType = b.dataset.type;

    if (currentType === "participacoes") {
  form.style.display = "none";
  loadParticipacoes();
} else {
  form.style.display = "";
  loadAdmin();
    }
  })
);
form.addEventListener("submit",async e=>{e.preventDefault();const p={tipo:currentType,titulo:document.getElementById("titulo").value.trim(),descricao:document.getElementById("descricao").value.trim(),link:document.getElementById("link").value.trim()||null,data_evento:document.getElementById("data").value||null};statusEl.textContent="Publicando...";const r=await fetch(`${SUPABASE_URL}/rest/v1/conteudos`,{method:"POST",headers:{...headers(true),Prefer:"return=representation"},body:JSON.stringify(p)});if(r.ok){form.reset();statusEl.textContent="Publicado com sucesso.";loadAdmin()}else statusEl.textContent="Erro ao publicar. Verifique o SQL da V6."});
async function loadAdmin(){const el=document.getElementById("admin-list");const r=await fetch(`${SUPABASE_URL}/rest/v1/conteudos?tipo=eq.${currentType}&select=*&order=created_at.desc`,{headers:headers()});if(!r.ok){el.innerHTML='<div class="card"><p>Erro ao carregar.</p></div>';return}const data=await r.json();el.innerHTML=data.map(i=>`<article class="card"><h3>${esc(i.titulo)}</h3><p>${esc(i.descricao)}</p>${i.link?`<a class="link" href="${esc(i.link)}" target="_blank">Abrir link →</a>`:""}<div style="margin-top:12px"><button class="danger-btn" onclick="removeItem('${i.id}')">Excluir</button></div></article>`).join("")||'<div class="card"><p>Nenhum item publicado.</p></div>'}async function loadParticipacoes() {
  const el = document.getElementById("admin-list");

  el.innerHTML = '<div class="card"><p>Carregando participações...</p></div>';

  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/participacoes?select=*&order=created_at.desc`,
    { headers: headers() }
  );

  if (!r.ok) {
    el.innerHTML = '<div class="card"><p>Erro ao carregar participações.</p></div>';
    return;
  }

  const data = await r.json();

  el.innerHTML = data.map(i => {

    const tipo =
      i.tipo === "tema" ? "🎙️ Tema sugerido" :
      i.tipo === "empresa" ? "🏭 Empresa indicada" :
      i.tipo === "vaga" ? "💼 Vaga enviada" :
      "Participação";

    const dataEnvio = i.created_at
      ? new Date(i.created_at).toLocaleString("pt-BR")
      : "";

    return `
      <article class="card">

        <h3>${tipo}</h3>

        ${i.titulo ? `<p><strong>${esc(i.titulo)}</strong></p>` : ""}

        ${i.nome ? `<p><strong>Nome:</strong> ${esc(i.nome)}</p>` : ""}

        ${i.empresa_profissao
          ? `<p><strong>Empresa/Profissão:</strong> ${esc(i.empresa_profissao)}</p>`
          : ""}

        ${i.cidade_estado
          ? `<p><strong>Local:</strong> ${esc(i.cidade_estado)}</p>`
          : ""}

        <p>${esc(i.descricao)}</p>

        ${i.contato
          ? `<p><strong>Contato:</strong> ${esc(i.contato)}</p>`
          : ""}

        ${i.link
          ? `<p><a class="link" href="${esc(i.link)}" target="_blank">Abrir link →</a></p>`
          : ""}

        <p style="opacity:.65;font-size:13px">
          Enviado em ${dataEnvio}
        </p>

      </article>
    `;
  }).join("") || '<div class="card"><p>Nenhuma participação recebida ainda.</p></div>';
}
async function removeItem(id){if(!confirm("Excluir este conteúdo?"))return;const r=await fetch(`${SUPABASE_URL}/rest/v1/conteudos?id=eq.${id}`,{method:"DELETE",headers:headers()});if(r.ok)loadAdmin();else alert("Não foi possível excluir.")}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}verify();
