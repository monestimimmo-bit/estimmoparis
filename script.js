function initReveal(root){
  const els=root.querySelectorAll('.box,.steps li,.arr-grid li,.card,details,.chips,section h2,.cta-band,form,.article>p,.article>ul');
  const show=e=>{e.classList.add('in');setTimeout(()=>{e.style.transitionDelay=''},1000)};
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){els.forEach(e=>e.classList.add('reveal','in'));return}
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){show(x.target);io.unobserve(x.target)}}),{threshold:.1});
  els.forEach((e,i)=>{if(e.classList.contains('reveal'))return;e.classList.add('reveal');e.style.transitionDelay=((i%4)*80)+'ms';io.observe(e)});
}
initReveal(document);
const hd=document.querySelector('header');
addEventListener('scroll',()=>hd.classList.toggle('scrolled',scrollY>8),{passive:true});
const f=document.getElementById('estimation');
if(f){
  f.noValidate=true;
  const NAMES={arrondissement:'Arrondissement',type:'Type de bien',adresse:'Adresse du bien',surface:'Surface',projet:'Votre projet',nom:'Nom et prénom',tel:'Téléphone',email:'E-mail',consentement:'Consentement'};
  const MSG={arrondissement:'Choisissez votre arrondissement.',type:'Choisissez le type de bien.',adresse:'Indiquez l’adresse du bien.',surface:'Indiquez la surface du bien.',projet:'Choisissez votre projet.',nom:'Indiquez votre nom et prénom.',tel:'Indiquez votre numéro de téléphone.',email:'Indiquez votre adresse e-mail.',consentement:'Vous devez accepter la transmission de vos données pour être recontacté(e).'};
  // astérisques, note « champs obligatoires » et zone de message
  f.querySelectorAll('[required]').forEach(el=>{
    const l=el.closest('label');if(!l||l.querySelector('.req'))return;
    const st=document.createElement('span');st.className='req';st.setAttribute('aria-hidden','true');st.textContent=' *';
    const w=document.createElement('span');w.className='lt';
    if(el.type==='checkbox'){let n=el.nextSibling;while(n){const nx=n.nextSibling;w.appendChild(n);n=nx}l.appendChild(w)}
    else{const t=[...l.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());if(t){l.insertBefore(w,t);w.appendChild(t)}else l.insertBefore(w,el)}
    w.appendChild(st);
  });
  const note=document.createElement('p');note.className='req-note';note.innerHTML='<span class="req">*</span> Champs obligatoires';f.prepend(note);
  const err=document.createElement('p');err.id='err';err.className='msg err';err.setAttribute('role','alert');err.tabIndex=-1;err.hidden=true;
  f.insertBefore(err,f.querySelector('button[type=submit]'));
  const problem=el=>{
    const raw=el.type==='checkbox'?el.checked:el.value.trim();
    if(!raw)return MSG[el.name]||'Ce champ est obligatoire.';
    if(el.name==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()))return 'Cette adresse e-mail ne semble pas valide.';
    if(el.name==='tel'){const d=el.value.replace(/\D/g,'');if(!/^[+0-9 .()-]+$/.test(el.value.trim())||d.length<9||d.length>15)return 'Ce numéro de téléphone ne semble pas valide.'}
    if(el.name==='surface'&&!(parseFloat(el.value)>0))return 'La surface doit être un nombre supérieur à 0.';
    return '';
  };
  const show=(el,msg)=>{
    const l=el.closest('label');let m=l.querySelector('.fe');
    if(!msg){if(m)m.remove();el.removeAttribute('aria-invalid');el.removeAttribute('aria-describedby');return}
    if(!m){m=document.createElement('span');m.className='fe';m.id='fe-'+el.name;l.appendChild(m)}
    m.textContent=msg;el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby',m.id);
  };
  f.querySelectorAll('[required]').forEach(el=>{
    const ev=el.type==='checkbox'||el.tagName==='SELECT'?'change':'blur';
    el.addEventListener(ev,()=>show(el,problem(el)));
    el.addEventListener('input',()=>{if(el.getAttribute('aria-invalid'))show(el,problem(el))});
  });
  const a=new URLSearchParams(location.search).get('arr');
  if(a&&/^([1-9]|1[0-9]|20)$/.test(a)){f.arrondissement.value='750'+a.padStart(2,'0')}
  f.addEventListener('submit',async e=>{
    e.preventDefault();
    const ok=document.getElementById('ok'),ko=document.getElementById('ko');
    ok.hidden=ko.hidden=err.hidden=true;
    const bad=[];
    f.querySelectorAll('[required]').forEach(el=>{const m=problem(el);show(el,m);if(m)bad.push(el)});
    if(bad.length){
      err.textContent='Merci de compléter ou de corriger : '+bad.map(el=>NAMES[el.name]||el.name).join(', ')+'.';
      err.hidden=false;bad[0].focus();return;
    }
    if(f.action.includes('VOTRE_ID')){ko.textContent='Le formulaire n’est pas encore relié : l’identifiant Formspree (VOTRE_ID) n’a pas été remplacé dans la page.';ko.hidden=false;return}
    try{
      const r=await fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}});
      if(!r.ok){
        let m='';
        try{const d=await r.json();m=(d.errors||[]).map(x=>x.message).join(', ')||d.error||''}catch{}
        throw new Error((m||'Erreur')+' (code '+r.status+')');
      }
      f.reset();ok.hidden=false;ok.focus();
    }catch(er){
      ko.textContent=er instanceof TypeError?'L’envoi a échoué. Vérifiez votre connexion et réessayez.':'L’envoi a échoué : '+er.message;
      ko.hidden=false;
    }
  });
}
