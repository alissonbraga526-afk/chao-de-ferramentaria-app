
const typeMeta={
  tecnico:{title:"Conteúdo técnico",page:"tecnico.html"},
  eventos:{title:"Eventos e feiras",page:"eventos.html"},
  episodios:{title:"Episódios",page:"episodios.html"},
  parceiros:{title:"Parceiros e patrocinadores",page:"parceiros.html"},
  empresas:{title:"Empresas",page:"empresas.html"},
  vagas:{title:"Vagas",page:"vagas.html"}
};
async function getConteudos(tipo,limit=null){
  let url=`${SUPABASE_URL}/rest/v1/conteudos?tipo=eq.${tipo}&select=*&order=created_at.desc`;
  if(limit) url+=`&limit=${limit}`;
  const r=await fetch(url,{headers:{apikey:SUPABASE_ANON_KEY}});
  if(!r.ok) throw new Error("Falha");
  return await r.json();
}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function fmt(v){if(!v)return"";const[y,m,d]=v.split("-");return`${d}/${m}/${y}`}
function cardHTML(i,tipo=""){
  const extra=tipo==="vagas"?'<span class="job-badge">Oportunidade</span>':"";
  return `<article class="card ${tipo==="empresas"?"company-card":""} ${tipo==="vagas"?"job-card":""}">
    ${extra}<h3>${esc(i.titulo)}</h3>
    ${i.data_evento?`<div class="date">📅 ${fmt(i.data_evento)}</div>`:""}
    <p>${esc(i.descricao)}</p>
    ${i.link?`<a class="link" href="${esc(i.link)}" target="_blank" rel="noopener">Abrir link →</a>`:""}
  </article>`;
}
async function renderSectionPage(){
  const tipo=document.body.dataset.section;if(!tipo)return;
  const list=document.getElementById("content-list");
  try{const data=await getConteudos(tipo);list.innerHTML=data.length?data.map(i=>cardHTML(i,tipo)).join(""):`<div class="card"><p class="empty">Nenhum conteúdo publicado ainda.</p></div>`}
  catch{list.innerHTML=`<div class="card"><p class="empty">Não foi possível carregar agora.</p></div>`}
}
async function renderHome(){
  const container=document.getElementById("home-latest");if(!container)return;
  let html="";
  for(const tipo of ["episodios","eventos","tecnico","vagas","empresas"]){
    try{
      const data=await getConteudos(tipo,1),m=typeMeta[tipo];
      html+=`<section class="section"><div class="section-head"><h2>${m.title}</h2><a class="tag" href="${m.page}">Ver tudo</a></div><div class="cards">${data.length?cardHTML(data[0],tipo):`<div class="card"><p class="empty">Nenhum conteúdo publicado ainda.</p></div>`}</div></section>`;
    }catch{}
  }
  try{
    const sponsors=await getConteudos("parceiros",1);
    html+=`<section class="section"><div class="section-head"><h2>Patrocinadores</h2><a class="tag" href="parceiros.html">Ver todos</a></div><div class="cards">${sponsors.length?`<article class="card sponsor-feature"><span class="sponsor-label">DESTAQUE</span><h3>${esc(sponsors[0].titulo)}</h3><p>${esc(sponsors[0].descricao)}</p>${sponsors[0].link?`<a class="link" href="${esc(sponsors[0].link)}" target="_blank">Conhecer parceiro →</a>`:""}</article>`:`<div class="card"><p class="empty">Nenhum patrocinador publicado ainda.</p></div>`}</div></section>`;
  }catch{}
  container.innerHTML=html;
}
renderSectionPage();renderHome();
