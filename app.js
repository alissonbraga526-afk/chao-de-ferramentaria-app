const headers = () => ({
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
});

async function loadType(tipo, elementId) {
  const el = document.getElementById(elementId);
  try {
    if (SUPABASE_URL.includes("COLE_AQUI")) throw new Error("Supabase não configurado");
    const url = `${SUPABASE_URL}/rest/v1/conteudos?tipo=eq.${tipo}&select=*&order=created_at.desc`;
    const res = await fetch(url, {headers: headers()});
    if (!res.ok) throw new Error("Falha ao carregar");
    const data = await res.json();
    if (!data.length) {
      el.innerHTML = `<div class="card"><p>Nenhum conteúdo publicado ainda.</p></div>`;
      return;
    }
    el.innerHTML = data.map(item => `
      <article class="card">
        <h3>${escapeHtml(item.titulo)}</h3>
        ${item.data_evento ? `<div class="date">📅 ${formatDate(item.data_evento)}</div>` : ""}
        <p>${escapeHtml(item.descricao)}</p>
        ${item.link ? `<a class="link" href="${item.link}" target="_blank" rel="noopener">Abrir link →</a>` : ""}
      </article>
    `).join("");
  } catch (e) {
    el.innerHTML = `<div class="card"><p>Configure o Supabase para carregar conteúdos atualizados.</p></div>`;
  }
}

function escapeHtml(s=""){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}
function formatDate(v){const [y,m,d]=v.split("-");return `${d}/${m}/${y}`;}

document.querySelectorAll(".quick").forEach(btn => btn.addEventListener("click",()=>document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:"smooth"})));

loadType("tecnico","tecnico-list");
loadType("eventos","eventos-list");
loadType("episodios","episodios-list");
loadType("parceiros","parceiros-list");

if ("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js"));
