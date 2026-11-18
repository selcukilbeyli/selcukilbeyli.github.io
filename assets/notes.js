"use strict";
const REPO="selcukilbeyli/selcukilbeyli.github.io";
const list=document.getElementById('noteList');
const detail=document.getElementById('noteDetail');
const search=document.getElementById('search');
const tagbox=document.getElementById('tags');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let notes=[],selectedTag='all';
function dateText(s){const d=new Date(s);return Number.isNaN(d.getTime())?esc(s):new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(d)}
function parseFile(raw, filename){const m=raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);if(!m)throw Error('No frontmatter');const data=jsyaml.load(m[1])||{};if(!data.published)return null;const body=raw.slice(m[0].length);const tags=Array.isArray(data.tags)?data.tags:String(data.tags||'').split(',').map(x=>x.trim()).filter(Boolean);return {title:String(data.title||filename),date:String(data.date||''),tags,summary:String(data.summary||''),body,filename,attachment:String(data.attachment||''),image:String(data.image||'')}}
function tagsRender(){const tags=[...new Set(notes.flatMap(x=>x.tags))].sort();tagbox.innerHTML='<button class="filter '+(selectedTag==='all'?'active':'')+'" data-tag="all">All topics</button>'+tags.map(x=>'<button class="filter '+(selectedTag===x?'active':'')+'" data-tag="'+esc(x)+'">'+esc(x)+'</button>').join('');tagbox.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{selectedTag=b.dataset.tag;tagsRender();renderList();}))}
function renderList(){detail.hidden=true;list.hidden=false;const q=search.value.trim().toLowerCase();const filtered=notes.filter(n=>(selectedTag==='all'||n.tags.includes(selectedTag))&&[n.title,n.summary,n.body,n.tags.join(' ')].join(' ').toLowerCase().includes(q));if(!filtered.length){list.innerHTML='<div class="status-message">'+(notes.length?'No notes match your search.':'No public notes yet. New entries will appear here after publication.')+'</div>';return}list.innerHTML=filtered.map(n=>'<article class="quick-note-item"><div class="note-meta">'+dateText(n.date)+' · '+esc(n.tags.join(' · ')||'Research note')+'</div><h3><a href="#'+encodeURIComponent(n.filename)+'" class="note-link" data-name="'+esc(n.filename)+'">'+esc(n.title)+'</a></h3><p>'+esc(n.summary||'A short mathematical research note.')+'</p><a class="small-link note-link" href="#'+encodeURIComponent(n.filename)+'" data-name="'+esc(n.filename)+'">Read note ↗</a></article>').join('');list.querySelectorAll('.note-link').forEach(a=>a.addEventListener('click',ev=>{ev.preventDefault();location.hash=encodeURIComponent(a.dataset.name);showNote(a.dataset.name)}));}
function safeUrl(url){try{const u=new URL(url,location.origin);if(!['http:','https:'].includes(u.protocol))return null;return u.href}catch{return null}}
function makeAttachment(url,label){const safe=safeUrl(url);if(!safe)return'';let h='<a class="btn secondary" target="_blank" rel="noopener noreferrer" href="'+esc(safe)+'">'+esc(label)+' ↗</a>';const p=new URL(safe).pathname.toLowerCase();if(p.endsWith('.pdf'))h='<iframe loading="lazy" title="Attached PDF" src="'+esc(safe)+'"></iframe><p>'+h+'</p>';return h}
// Preserve LaTeX before Markdown parsing: Marked otherwise strips \\(, \\[ and
// may interpret TeX underscores as Markdown emphasis.
function markdownWithMath(source){
  const expressions=[];
  const sourceText=String(source||'');
  const fenced=/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]+`)/g;
  const reserve=part=>part.replace(/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|(?<!\\)\$([^\$\n]+?)\$/g,(whole,block,bracket,paren,inline)=>{
    const id=expressions.length;
    expressions.push({tex:block??bracket??paren??inline,display:block!==undefined||bracket!==undefined});
    return `MATHNOTEPLACEHOLDER${id}END`;
  });
  let processed='',at=0;
  for(const match of sourceText.matchAll(fenced)){
    processed+=reserve(sourceText.slice(at,match.index))+match[0];
    at=match.index+match[0].length;
  }
  processed+=reserve(sourceText.slice(at));
  let safe=DOMPurify.sanitize(marked.parse(processed,{breaks:true}));
  safe=safe.replace(/MATHNOTEPLACEHOLDER(\d+)END/g,(full,n)=>{
    const id=Number(n);
    return id<expressions.length?`<span class="math-note-placeholder" data-math-index="${id}"></span>`:full;
  });
  return {html:safe,expressions};
}
function typesetNote(container,expressions){
  container.querySelectorAll('.math-note-placeholder').forEach(node=>{
    const expr=expressions[Number(node.dataset.mathIndex)];
    if(!expr)return;
    if(window.katex){
      try{window.katex.render(expr.tex,node,{displayMode:expr.display,throwOnError:false,trust:false,strict:'warn'});return}catch(e){console.warn('Math typesetting failed',e)}
    }
    node.textContent=expr.tex;
  });
}
function showNote(name){const n=notes.find(n=>n.filename===name);if(!n)return;list.hidden=true;detail.hidden=false;const mathContent=markdownWithMath(n.body);const rendered=mathContent.html;detail.innerHTML='<button class="filter" id="backNotes">← All notes</button><p class="note-meta" style="margin-top:25px">'+dateText(n.date)+' · '+esc(n.tags.join(' · '))+'</p><h2>'+esc(n.title)+'</h2><div class="note-body">'+rendered+(n.image&&safeUrl(n.image)?'<p><img src=\"'+esc(safeUrl(n.image))+'\" alt=\"Attached note illustration\" loading=\"lazy\"></p>':'')+(n.attachment?'<div style="margin-top:22px">'+makeAttachment(n.attachment,'Download / open attachment')+'</div>':'')+'</div>';detail.querySelector('#backNotes').onclick=()=>{history.replaceState(null,'',location.pathname);renderList()};typesetNote(detail,mathContent.expressions);if(window.renderMathInElement){renderMathInElement(detail,{delimiters:[{left:'$$',right:'$$',display:true},{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false},{left:'$',right:'$',display:false}],throwOnError:false})}detail.scrollIntoView({behavior:'smooth',block:'start'})}
async function init(){document.getElementById('theme').onclick=()=>{document.body.classList.toggle('light');localStorage.setItem('theme',document.body.classList.contains('light')?'light':'dark')};if(localStorage.getItem('theme')==='light')document.body.classList.add('light');const menu=document.getElementById('menu'),nav=document.getElementById('navLinks');menu.onclick=()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))};nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));search.oninput=renderList;
try{const r=await fetch('https://api.github.com/repos/'+REPO+'/contents/notes',{headers:{Accept:'application/vnd.github+json'},cache:'no-store'});if(r.status===404){list.innerHTML='<div class="status-message">No public notes yet. Publish your first entry from the editor.</div>';return}if(!r.ok)throw Error('GitHub API returned '+r.status);const files=(await r.json()).filter(x=>x.type==='file'&&x.name.endsWith('.md'));const data=await Promise.all(files.map(async f=>{try{const response=await fetch('https://raw.githubusercontent.com/'+REPO+'/main/notes/'+encodeURIComponent(f.name)+'?v='+encodeURIComponent(f.sha),{cache:'no-store'});return parseFile(await response.text(),f.name)}catch(e){return null}}));notes=data.filter(Boolean).sort((a,b)=>new Date(b.date)-new Date(a.date));tagsRender();renderList();if(location.hash){const name=decodeURIComponent(location.hash.slice(1));if(notes.some(n=>n.filename===name))showNote(name)}}catch(e){list.innerHTML='<div class="status-message">Notes could not be loaded right now. Please try again later. '+esc(e.message)+'</div>'}}
init();
