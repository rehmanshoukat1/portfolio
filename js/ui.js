/* UI / UX work page: scroll-driven website showcase, index preview, jump pill, full-page viewer */
(function(){
'use strict';
var D=document,$=function(s,r){return(r||D).querySelector(s)},$$=function(s,r){return[].slice.call((r||D).querySelectorAll(s))};
var rm=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var DV=44;
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function watch(el,cb,th,rmg){if(!('IntersectionObserver' in window)){cb(true);return}new IntersectionObserver(function(es){cb(es[0].isIntersecting)},{threshold:th||0,rootMargin:rmg||'0px'}).observe(el)}
var toast=$('#toast'),toastT=null;
function say(m){if(!toast)return;toast.textContent=m;toast.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){toast.classList.remove('show')},2000)}

/* ================= website sections: each site scrolls by itself, hover to pause ================= */
var secs=[];
$$('.sx').forEach(function(sec){
  var o={sec:sec,fr:$('.sx-fr',sec),win:$('.sx-win',sec),view:$('.sx-view',sec),track:$('.sx-track',sec),imgs:$$('.sx-track img',sec),pages:JSON.parse(sec.getAttribute('data-pages')),
    ring:$('.sx-ring',sec),rn:$('.sx-ring b',sec),sb:$('.sx-sb b',sec),steps:$$('.sx-pg li',sec),
    dist:0,bounds:[0],H:0,W:0,pos:0,mode:'hold2',hold:1.1,vis:false,loaded:false,act:0,pct:-1,hover:false,sh:20,jump:0};
  secs.push(o);
  function load(){if(o.loaded)return;o.loaded=true;o.imgs.forEach(function(im){im.src=im.getAttribute('data-src')})}
  o.load=load;
  watch(sec,function(v){o.vis=v;if(v)load();if(v)sec.classList.add('in')},0,'60% 0px');
  watch(sec,function(v){if(v)sec.classList.add('in')},.18);
  o.win.addEventListener('pointerenter',function(){o.hover=true;o.fr.classList.add('paused')});
  o.win.addEventListener('pointerleave',function(){o.hover=false;o.fr.classList.remove('paused')});
  o.steps.forEach(function(li,j){li.addEventListener('click',function(){o.pos=o.bounds[j];o.mode='down';o.hold=2.6;o.hold0=true;o.apply()})});
  var open=$('[data-open]',sec);open.addEventListener('click',function(){openViewer(o)});
  $$('.sx-pal button',sec).forEach(function(b){b.addEventListener('click',function(){
    var c=b.getAttribute('data-c').toUpperCase();
    function ok(){say(c+' copied')}
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(c).then(ok,function(){say(c)});
    else{var ta=D.createElement('textarea');ta.value=c;D.body.appendChild(ta);ta.select();try{D.execCommand('copy');ok()}catch(e){say(c)}ta.remove()}
  })});
  o.apply=function(){
    var y=Math.round(o.pos);o.track.style.transform='translate3d(0,'+(-y)+'px,0)';
    var p=o.dist>0?o.pos/o.dist:0,pct=Math.round(p*100);
    if(pct!==o.pct){o.pct=pct;o.ring.style.setProperty('--p',pct);o.rn.textContent=pct}
    if(o.sb)o.sb.style.setProperty('--sp',(p*(100-o.sh)).toFixed(1)+'%');
    if(o.steps.length){var a=0;for(var j=0;j<o.bounds.length;j++){if(o.bounds[j]<=o.pos+o.H*.3)a=j}
      if(a!==o.act){o.act=a;o.steps.forEach(function(li,k){li.classList.toggle('on',k===a)})}}
  };
});
function measure(o){
  var W=o.view.clientWidth,H=o.view.clientHeight,y=0;o.bounds=[];
  o.pages.forEach(function(pg,j){if(j>0)y+=DV;o.bounds.push(y);y+=W*pg.h/pg.w});
  o.W=W;o.H=H;o.trackH=y;o.dist=Math.max(0,y-H);
  o.sh=clamp(H/y*100,6,100);if(o.sb)o.sb.style.setProperty('--sh',o.sh.toFixed(1)+'%');
  o.pos=Math.min(o.pos,o.dist);o.apply();
}
function measureAll(){secs.forEach(measure)}
var rt=null;
window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(measureAll,150)});
window.addEventListener('load',measureAll);
measureAll();
if(rm){secs.forEach(function(o){o.view.style.overflowY='auto'})}

var last=performance.now();
function frame(now){
  var dt=Math.min(.05,(now-last)/1000);last=now;
  if(!D.hidden){
    var vh=innerHeight;
    for(var i=0;i<secs.length;i++){
      var o=secs[i];if(!o.vis)continue;
      var r=o.sec.getBoundingClientRect();
      o.sec.style.setProperty('--q',clamp((vh-r.top)/(vh+r.height),0,1).toFixed(3));
      if(rm||o.hover||o.dist<=0)continue;
      if(o.mode==='down'){var v=clamp(o.W*.15,80,170);o.pos+=v*dt;if(o.pos>=o.dist){o.pos=o.dist;o.mode='hold1';o.hold=1.6}}
      else if(o.mode==='hold1'||o.mode==='hold2'){o.hold-=dt;if(o.hold<=0)o.mode=o.mode==='hold1'?'up':'down'}
      else if(o.mode==='up'){var u=Math.max(700,o.pos*.9);o.pos-=u*dt;if(o.pos<=0){o.pos=0;o.mode='hold2';o.hold=1.2}}
      o.apply();
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ================= index: floating preview ================= */
(function(){
  var pv=$('#ixPv'),rows=$$('.ix-r');if(!pv||!rows.length||!window.matchMedia('(hover:hover)').matches)return;
  var im=$('img',pv),tx=0,ty=0,cx=0,cy=0,on=false,run=false;
  function step(){cx+=(tx-cx)*.16;cy+=(ty-cy)*.16;pv.style.translate=Math.round(cx+28)+'px '+Math.round(cy-90)+'px';if(on||Math.abs(tx-cx)>.5)requestAnimationFrame(step);else run=false}
  rows.forEach(function(r){
    r.addEventListener('pointerenter',function(e){im.src=r.getAttribute('data-pv');on=true;pv.classList.add('on');tx=cx=e.clientX;ty=cy=e.clientY;if(!run){run=true;requestAnimationFrame(step)}});
    r.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY});
    r.addEventListener('pointerleave',function(){on=false;pv.classList.remove('on')});
  });
})();

/* ================= jump pill ================= */
(function(){
  var uj=$('#uj'),list=secs.map(function(o){return o.sec});if(!uj||!list.length)return;
  var dots=$$('.uj-dots button',uj),num=$('#ujNum'),nm=$('#ujName'),cur=-1,end=$('#uend');
  function setCur(i){
    if(i===cur)return;cur=i;var s=list[i];uj.style.setProperty('--ac',s.style.getPropertyValue('--ac'));
    num.textContent=('0'+(i+1)).slice(-2);nm.textContent=s.getAttribute('data-name');
    dots.forEach(function(d,k){d.classList.toggle('on',k===i)});
  }
  function jump(i){i=clamp(i,0,list.length-1);var r=list[i].getBoundingClientRect();window.scrollTo({top:r.top+scrollY,behavior:rm?'auto':'smooth'})}
  dots.forEach(function(d,k){d.addEventListener('click',function(){jump(k)})});
  $$('.uj-a',uj).forEach(function(b){b.addEventListener('click',function(){jump(cur+(+b.getAttribute('data-d')))})});
  var tk=false;
  function upd(){
    tk=false;
    var f=list[0].getBoundingClientRect(),e=end.getBoundingClientRect();
    uj.classList.toggle('on',f.top<innerHeight*.5&&e.top>innerHeight*.7);
    var best=0;list.forEach(function(s,i){var r=s.getBoundingClientRect();if(r.top<=innerHeight*.5)best=i});
    setCur(best);
  }
  window.addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});
  upd();
})();

/* ================= full-page viewer ================= */
var V=null;
function buildViewer(){
  var v=D.createElement('div');v.className='uv';v.setAttribute('role','dialog');v.setAttribute('aria-modal','true');v.setAttribute('aria-label','Full page viewer');
  v.innerHTML='<div class="uv-f"><div class="uv-h"><div class="uv-t"><i></i><span class="uv-n"></span></div><div class="uv-pg"></div><span class="uv-sp"></span><button type="button" class="uv-x" aria-label="Close">&times;</button></div><div class="uv-s"><img alt="" draggable="false"></div></div>';
  D.body.appendChild(v);
  var st={o:null,pi:0},img=$('.uv-s img',v),sc=$('.uv-s',v);
  function show(){img.src='img/ui/'+st.o.pages[st.pi].k+'-fin.webp'}
  function close(){v.classList.remove('on');D.documentElement.classList.remove('uv-open')}
  $('.uv-x',v).addEventListener('click',close);
  v.addEventListener('click',function(e){if(e.target===v)close()});
  D.addEventListener('keydown',function(e){if(e.key==='Escape'&&v.classList.contains('on'))close()});
  v.open=function(o){
    st.o=o;st.pi=o.act||0;
    v.style.setProperty('--ac',o.sec.style.getPropertyValue('--ac')||'');
    $('.uv-n',v).textContent=o.sec.getAttribute('data-name');
    var pg=$('.uv-pg',v);pg.innerHTML='';
    if(o.pages.length>1){pg.style.display='';o.pages.forEach(function(p,i){var b=D.createElement('button');b.type='button';b.textContent=p.n;if(i===st.pi)b.className='on';b.addEventListener('click',function(){st.pi=i;$$('button',pg).forEach(function(x){x.classList.toggle('on',x===b)});sc.scrollTop=0;show()});pg.appendChild(b)})}else pg.style.display='none';
    sc.scrollTop=0;show();v.classList.add('on');D.documentElement.classList.add('uv-open');
  };
  return v;
}
function openViewer(o){if(!V)V=buildViewer();V.open(o)}

/* back to top */
var ot=$('#outTop');if(ot)ot.addEventListener('click',function(e){e.preventDefault();window.scrollTo({top:0,behavior:rm?'auto':'smooth'})});
})();
