
const typeMeta = {
  tecnico:{title:"Conteúdo técnico", emoji:"⚙️", page:"tecnico.html"},
  eventos:{title:"Eventos e feiras", emoji:"📅", page:"eventos.html"},
  episodios:{title:"Episódios", emoji:"🎙️", page:"episodios.html"},
  parceiros:{title:"Parceiros", emoji:"🤝", page:"parceiros.html"}
};

async function getConteudos(tipo, limit=null){
  let url = `${SUPABASE_URL}/rest/v1/conteudos?tipo=eq.${tipo}&select=*&order=created_at.desc`;
  if(limit) url += `&limit=${limit}`;
  const r = await fetch(url,{headers:{apikey:SUPABASE_ANON_KEY}});
  if(!r.ok) throw new Error("Falha ao carregar");
  return await r.json();
}

function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function formatDate(v){if(!v)return "";const [y,m,d]=v.split("-");return `${d}/${m}/${y}`}
function cardHTML(i){
  return `<article class="card">
    <h3>${esc(i.titulo)}</h3>
    ${i.data_evento?`<div class="date">📅 ${formatDate(i.data_evento)}</div>`:""}
    <p>${esc(i.descricao)}</p>
    ${i.link?`<a class="link" href="${esc(i.link)}" target="_blank" rel="noopener">Abrir link →</a>`:""}
  </article>`;
}

async function renderSectionPage(){
  const tipo=document.body.dataset.section;
  if(!tipo) return;
  const list=document.getElementById("content-list");
  try{
    const data=await getConteudos(tipo);
    list.innerHTML=data.length?data.map(cardHTML).join(""):`<div class="card"><p class="empty">Nenhum conteúdo publicado ainda.</p></div>`;
  }catch{
    list.innerHTML=`<div class="card"><p class="empty">Não foi possível carregar agora.</p></div>`;
  }
}

async function renderHome(){
  const container=document.getElementById("home-latest");
  if(!container) return;
  const tipos=["episodios","eventos","tecnico","parceiros"];
  let html="";
  for(const tipo of tipos){
    try{
      const data=await getConteudos(tipo,1);
      const m=typeMeta[tipo];
      html += `<section class="section">
        <div class="section-head"><h2>${m.title}</h2><a class="tag" href="${m.page}">Ver tudo</a></div>
        <div class="cards">${data.length?cardHTML(data[0]):`<div class="card"><p class="empty">Nenhum conteúdo publicado ainda.</p></div>`}</div>
      </section>`;
    }catch{}
  }
  container.innerHTML=html;
}

renderSectionPage();
renderHome();
