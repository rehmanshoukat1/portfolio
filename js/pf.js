/* Portfolio sections: illustration, brand board + packs, venue standees, compare, zoom */
(function(){
var D=document,$=function(s,r){return(r||D).querySelector(s)},$$=function(s,r){return[].slice.call((r||D).querySelectorAll(s))};
var rm=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
/* ---- reveal ---- */
var vis=new Map();
function watch(el,cb,th){if(!('IntersectionObserver' in window)){cb(true);return}new IntersectionObserver(function(es){cb(es[0].isIntersecting)},{threshold:th||.2}).observe(el)}
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  $$('[data-pf]').forEach(function(e){io.observe(e)});
}else $$('[data-pf]').forEach(function(e){e.classList.add('in')});
/* ---- zoom lightbox ---- */
var fx=D.createElement('div');fx.className='pfx';fx.innerHTML='<img alt=""><button type="button" aria-label="Close">&times;</button>';D.body.appendChild(fx);
var fxi=fx.querySelector('img');
function zoom(src){fxi.src=src;fx.classList.add('on')}
fx.addEventListener('click',function(){fx.classList.remove('on')});
D.addEventListener('keydown',function(e){if(e.key==='Escape')fx.classList.remove('on')});
D.addEventListener('click',function(e){var z=e.target.closest('[data-zoom]');if(z&&!e.target.closest('.bs-pal'))zoom(z.getAttribute('data-zoom'))});
/* ---- illustration ---- */
(function(){
  var sec=$('#illus');if(!sec)return;
  var hs=$$('.hs',sec),tip=$('#ilTip'),ti=0,hv=false,imgs=$$('#ilFrame>img'),tabs=$$('#ilTabs button'),cap=$('#ilCap'),si=0;
  var caps=['On the table — coaster & napkin ring','On a wooden hanging sign','On a round shop-front sign'];
  function setH(i){ti=i;hs.forEach(function(h,k){h.classList.toggle('on',k===i)});var t=hs[i].getAttribute('data-t');tip.firstChild.textContent=('0'+(i+1)).slice(-2);var s=tip.querySelector('span');s.style.opacity=0;setTimeout(function(){s.textContent=t;s.style.opacity=1},160)}
  function setS(i){si=i;imgs.forEach(function(m,k){m.classList.toggle('on',k===i)});tabs.forEach(function(t,k){t.classList.toggle('on',k===i)});cap.textContent=caps[i]}
  hs.forEach(function(h,i){h.addEventListener('mouseenter',function(){hv=true;setH(i)});h.addEventListener('mouseleave',function(){hv=false});h.addEventListener('click',function(){setH(i)})});
  tabs.forEach(function(t,i){t.addEventListener('click',function(){setS(i);clearInterval(ts);ts=setInterval(nx,4200)})});
  function nx(){if(vv&&!D.hidden)setS((si+1)%3)}
  var vv=false,ts=setInterval(nx,4200);watch(sec,function(v){vv=v},.2);
  setInterval(function(){if(vv&&!hv&&!D.hidden)setH((ti+1)%hs.length)},2600);
})();
/* ---- brand board: copy HEX ---- */
$$('.bs-pal button').forEach(function(b){b.addEventListener('click',function(){var h=b.getAttribute('data-hex');try{navigator.clipboard&&navigator.clipboard.writeText(h)}catch(e){}b.classList.remove('cp');void b.offsetWidth;b.classList.add('cp');var t=$('#toast');if(t){t.textContent=h+' copied';t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(function(){t.classList.remove('show')},1800)}})});
/* ---- photo mockups: two stages, pick a design ---- */
(function(){
  var m=$('#mkx'),pick=$('#mkxPick');if(!m||!pick)return;
  var N=['Perimflow','Visioedge','360 SafeOps','360 SafeOps'],K=['peri','edge','a360','b360'];
  var st=$$('.mkx-st',m),cur=0,vv=false,hov=false,user=0;
  function show(s,d,anim){
    var im=$$('.mkx-i',s),nx=im[d],old=$('.mkx-i.on',s);if(old===nx)return;
    im.forEach(function(x){x.classList.remove('prev')});
    if(old){old.classList.remove('on','go');old.classList.add('prev')}
    nx.classList.remove('go');nx.classList.add('on');
    var sc=$('.mkx-scan',s);sc.classList.remove('go');
    if(anim&&!rm){void nx.offsetWidth;nx.classList.add('go');sc.classList.add('go')}
    $('.mkx-tag em',s).textContent=N[d];s.setAttribute('data-zoom','img/pf/mk-'+s.getAttribute('data-place')+'-'+K[d]+'.webp');
    setTimeout(function(){if(!nx.classList.contains('on'))return;im.forEach(function(x){x.classList.remove('prev')})},1300);
  }
  function go(i,anim){cur=i;$$('button',pick).forEach(function(b,k){b.classList.toggle('on',k===i)});show(st[0],i,anim);show(st[1],(i+2)%4,anim)}
  $$('button',pick).forEach(function(b,i){b.addEventListener('click',function(){user=Date.now();go(i,true)})});
  watch(m,function(v){vv=v},.35);
  m.addEventListener('mouseenter',function(){hov=true});m.addEventListener('mouseleave',function(){hov=false});
  if(!rm)setInterval(function(){if(!vv||hov||D.hidden||Date.now()-user<9000)return;go((cur+1)%4,true)},4200);
})();
/* ---- file to floor ---- */
(function(){
  var f=$('#ff');if(!f)return;
  var S=$('#ffStage'),B=$('#ffB'),Dd=$('#ffD'),File=$('#ffFile'),Nm=$('#ffName'),Tag=$('#ffTag'),des=$('#ffDes');
  var K=['peri','edge','a360','b360'],A=['peri','edge','360a','360b'],N=['Perimflow','Visioedge','360 SafeOps 1','360 SafeOps 2'],P='expo',d=0;
  var PL={expo:'Expo hall',sem:'Seminar hall',street:'Glass storefront'};
  function apply(){
    B.src='img/pf/mk-'+P+'-blank.webp';Dd.src='img/pf/mk-'+P+'-'+K[d]+'.webp';File.src='img/pf/sd-'+A[d]+'.webp';Nm.textContent=N[d];
    S.setAttribute('data-zoom','img/pf/mk-'+P+'-'+K[d]+'.webp');$('.ff-file figure',f).setAttribute('data-zoom','img/pf/sd-'+A[d]+'.webp');
    Tag.innerHTML='<b>Live</b>'+PL[P];
    [Dd,$('.ff-scan',S)].forEach(function(e){e.style.animation='none';void e.offsetWidth;e.style.animation=''});
  }
  $$('#ffLoc button').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();P=b.getAttribute('data-p');$$('#ffLoc button').forEach(function(x){x.classList.toggle('on',x===b)});apply()})});
  $$('button',des).forEach(function(b){b.addEventListener('click',function(){d=+b.getAttribute('data-d');$$('button',des).forEach(function(x){x.classList.toggle('on',x===b)});apply()})});
})();
})();
