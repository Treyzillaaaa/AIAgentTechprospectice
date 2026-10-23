/* TechProspective Pokédex: read-only roster projection + explicit station assignment.
   No simulated business telemetry; this UI never creates or executes agents. */
'use strict';
const TechPokedex = (() => {
  const businesses = [
    { id:'all', name:'All businesses' },
    { id:'fore-and-pour', name:'Fore & Pour' },
    { id:'byte-me', name:'Byte Me' },
    { id:'techprospective-solutions', name:'TechProspective Solutions' },
    { id:'swat-productions', name:'SWAT Productions' }
  ];
  const stations = [
    ['league','Pokémon League','Executive coordination','♛'],
    ['center','Pokémon Center','Operations and support','✚'],
    ['mart','Poké Mart','Sales and inventory','▣'],
    ['gym','Pokémon Gym','KPIs and performance','★'],
    ['trading-center','Trading Center','Partners and vendors','⇄'],
    ['lab',"Professor's Lab",'Research and development','⚗'],
    ['silph','Silph Co.','IT and automation','⌘'],
    ['safari','Safari Zone','Lead generation','⌕'],
    ['game-corner','Game Corner','Marketing','◇'],
    ['storage','Storage PC','Knowledge management','▤'],
    ['day-care','Day Care','Training','☀'],
    ['tower','Pokémon Tower','Risk and archives','⚑'],
    ['elite-four','Elite Four','Specialist review','♜']
  ];
  const KEY='techprospective.pokedex.assignments.v1';
  let assignments={};
  let selected='all';
  let root;
  function load() {
    try { const value=JSON.parse(localStorage.getItem(KEY)); if(value && typeof value==='object' && !Array.isArray(value)) assignments=value; }
    catch (_) { assignments={}; }
  }
  const escape=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key=(business,station)=>business+':'+station;
  const crew=()=> { try { return typeof App!=='undefined' && App.agents ? App.agents() : []; } catch (_) { return []; } };
  function paint() {
    if(!root || root.hidden) return;
    const agents=crew(), known=new Map(agents.map(a=>[String(a.id),a]));
    const contexts=selected==='all'?businesses.slice(1):businesses.filter(b=>b.id===selected);
    const linked=contexts.flatMap(b=>stations.map(s=>({business:b,station:s,agent:known.get(assignments[key(b.id,s[0])])})));
    const connected=linked.filter(x=>x.agent).length;
    const pick=businesses.map(b=>'<option value="'+escape(b.id)+'"'+(selected===b.id?' selected':'')+'>'+escape(b.name)+'</option>').join('');
    root.innerHTML='<div class="tp-head"><div><small>TECHPROSPECTIVE ENTERPRISES · COMMAND CENTER</small><h2>POKÉDEX <span>AGENT NETWORK</span></h2><p>Live StarNet crew, assigned to business stations. Unassigned stations are not running agents.</p></div><button class="tp-close" type="button" data-close aria-label="Close Pokédex">×</button></div>'+
      '<div class="tp-controls"><label>BUSINESS <select id="tp-business">'+pick+'</select></label><button type="button" data-refresh>↻ Refresh roster</button><span class="tp-live">'+agents.length+' real crew members · '+connected+'/'+linked.length+' station assignments filled</span></div>'+
      '<div class="tp-cards">'+linked.map(({business:b,station:s,agent:a})=>{
        const id=key(b.id,s[0]),assigned=assignments[id]||'',options='<option value="">Unassigned</option>'+agents.map(x=>'<option value="'+escape(x.id)+'"'+(String(x.id)===assigned?' selected':'')+'>'+escape(x.name||x.id)+'</option>').join('');
        return '<article class="tp-card"><div class="tp-card-top"><span class="tp-symbol">'+s[3]+'</span><div><small>'+escape(b.name)+'</small><h3>'+escape(s[1])+'</h3></div><span class="tp-state '+(a?'tp-bound':'')+'">'+(a?'LINKED':'UNASSIGNED')+'</span></div><p>'+escape(s[2])+'</p><label>STARnet AGENT<select data-assign="'+escape(id)+'">'+options+'</select></label><div class="tp-card-foot">'+(a?'<span>'+escape(a.name||a.id)+' · '+escape(a.role||'crew')+'</span><button type="button" data-open="'+escape(a.id)+'">Open agent →</button>':'<span>Assign an existing agent to activate this identifier</span>')+'</div></article>';
      }).join('')+'</div><footer>Assignments are local to this browser. They do not change StarNet agent permissions, prompts, schedules, or access rights. Sensitive actions still require approval.</footer>';
  }
  function open() { if(!root) return; root.hidden=false; paint(); }
  function close() { if(root) root.hidden=true; }
  function init() {
    load();
    const button=document.createElement('button');button.type='button';button.id='tp-launch';button.textContent='▦ POKÉDEX';button.title='Open TechProspective AI command center';button.onclick=open;
    root=document.createElement('section');root.id='tp-pokedex';root.hidden=true;root.setAttribute('aria-label','TechProspective Pokédex agent dashboard');root.setAttribute('role','dialog');
    root.addEventListener('click',e=>{
      if(e.target.closest('[data-close]')) return close();
      if(e.target.closest('[data-refresh]')) return paint();
      const target=e.target.closest('[data-open]');
      if(target && typeof App!=='undefined' && App.selectAgent){App.selectAgent(target.dataset.open);close();}
    });
    root.addEventListener('change',e=>{
      if(e.target.id==='tp-business'){selected=e.target.value;paint();return;}
      if(e.target.matches('[data-assign]')){
        const id=e.target.dataset.assign, value=e.target.value;
        if(value)assignments[id]=value;else delete assignments[id];
        try{localStorage.setItem(KEY,JSON.stringify(assignments));}catch(_){window.alert('Assignments could not be saved in this browser.');}
        paint();
      }
    });
    document.body.append(button,root);
    document.addEventListener('keydown',e=>{if(e.key==='Escape' && root && !root.hidden)close();});
  }
  if(typeof document!=='undefined') { if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init(); }
  return {open,close,stations,businesses};
})();
