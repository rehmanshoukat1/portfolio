(function(){
'use strict';
var D=document,H=D.documentElement;
function $(s,c){return (c||D).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||D).querySelectorAll(s))}
var reduce=false;try{reduce=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
var fine=false;try{fine=matchMedia('(hover:hover) and (pointer:fine)').matches}catch(e){}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}

/* ---------- split text (words, keeps <br>/<em>) ---------- */
function splitEl(el){
  var n=0;
  (function walk(node){
    Array.prototype.slice.call(node.childNodes).forEach(function(c){
      if(c.nodeType===3){
        var parts=c.textContent.split(/(\s+)/),frag=D.createDocumentFragment();
        parts.forEach(function(p){
          if(!p)return;
          if(/^\s+$/.test(p)){frag.appendChild(D.createTextNode(' '));return}
          var o=D.createElement('span');o.className='sp';
          var i=D.createElement('span');i.textContent=p;i.style.setProperty('--w',n++);
          o.appendChild(i);frag.appendChild(o);
        });
        node.replaceChild(frag,c);
      }else if(c.nodeType===1&&c.tagName!=='BR'){walk(c)}
    });
  })(el);
}
$$('[data-split]').forEach(splitEl);

/* ---------- reveal observer ---------- */
var io=null;
function setupReveal(){
  var items=$$('[data-reveal],[data-split]');
  if(!('IntersectionObserver' in window)){items.forEach(function(e){e.classList.add('in')});return}
  io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){e.target.classList.add('in');if(e.target.hasAttribute('data-count'))count(e.target);io.unobserve(e.target)}
  })},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
  items.forEach(function(e){io.observe(e)});
  $$('[data-count]').forEach(function(e){
    var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){count(e);o.disconnect()}},{threshold:.6});o.observe(e);
  });
}
function count(el){
  if(el._done)return;el._done=1;
  var to=parseInt(el.getAttribute('data-count'),10)||0,t0=performance.now(),d=1400;
  if(reduce){el.textContent=to;return}
  (function f(t){var p=clamp((t-t0)/d,0,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e);if(p<1)requestAnimationFrame(f)})(t0);
}
setupReveal();

/* ---------- loader ---------- */
var loader=$('#loader'),num=$('#ldNum'),bar=$('#ldBar'),ldLogo=$('#ldLogo');
function finishLoader(){
  H.classList.remove('loading');
  H.classList.add('ready');
  setTimeout(function(){if(loader&&loader.parentNode)loader.parentNode.removeChild(loader)},1600);
}
function flyLogo(done){
  var tgt=$('#brandMark .dbm'),src=$('.load-logo',loader);
  if(!tgt||!src){done();return}
  var a=src.getBoundingClientRect(),b=tgt.getBoundingClientRect();
  var s=b.width/a.width,dx=(b.left+b.width/2)-(a.left+a.width/2),dy=(b.top+b.height/2)-(a.top+a.height/2);
  ldLogo.classList.add('fly');
  ldLogo.style.transform='translate('+dx+'px,'+dy+'px) scale('+s+')';
  setTimeout(done,980);
}
function runLoader(){
  if(!loader){H.classList.add('ready','landed');H.classList.remove('loading');return}
  if(reduce){H.classList.add('landed');finishLoader();return}
  var DUR=3000,t0=performance.now(),fontsOk=false,went=false;
  var fp=(D.fonts&&D.fonts.ready)?D.fonts.ready:Promise.resolve();
  Promise.race([fp,new Promise(function(r){setTimeout(r,1800)})]).then(function(){fontsOk=true});
  (function tick(t){
    var p=clamp((t-t0)/DUR,0,1),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
    if(num)num.textContent=Math.round(e*100);
    if(bar)bar.style.transform='scaleX('+e+')';
    if(p<1||!fontsOk){requestAnimationFrame(tick);return}
    if(went)return;went=true;
    if(num)num.textContent='100';if(bar)bar.style.transform='scaleX(1)';
    loader.classList.add('fin');
    setTimeout(function(){
      flyLogo(function(){
        H.classList.add('landed');
        ldLogo.style.opacity='0';
        loader.classList.add('out');
        setTimeout(function(){H.classList.add('ready');H.classList.remove('loading')},320);
        setTimeout(function(){if(loader&&loader.parentNode)loader.parentNode.removeChild(loader)},1700);
      });
    },380);
  })(t0);
}
if(D.readyState==='complete')runLoader();else{
  var started=false;function go(){if(started)return;started=true;runLoader()}
  D.addEventListener('DOMContentLoaded',go);window.addEventListener('load',go);
}
setTimeout(function(){H.classList.add('landed')},9000);

/* ---------- header ---------- */
var hdr=$('#hdr'),pill=$('#pill'),ind=$('#pillInd'),links=$$('#pill a'),burger=$('#burger'),mnav=$('#mnav');
var secIds=['top','about','tools','clients','graphic','uiux','skills','reviews'];
var activeLink=null;
function place(a){
  if(!a||!ind){if(ind)ind.style.opacity=0;return}
  ind.style.opacity=1;ind.style.left=a.offsetLeft+'px';ind.style.width=a.offsetWidth+'px';
}
links.forEach(function(a){
  a.addEventListener('mouseenter',function(){links.forEach(function(l){l.classList.remove('hv')});a.classList.add('hv');place(a)});
});
if(pill)pill.addEventListener('mouseleave',function(){links.forEach(function(l){l.classList.remove('hv')});place(activeLink)});
function setActive(id){
  var a=links.filter(function(l){return l.getAttribute('href')==='#'+id})[0]||null;
  if(a===activeLink)return;
  activeLink=a;links.forEach(function(l){l.classList.toggle('on',l===a)});place(a);
}
window.addEventListener('resize',function(){place(activeLink)});
function goTo(hash){
  var id=hash.replace('#',''),el=id==='top'||!id?D.body:D.getElementById(id);
  if(!el)return;
  var y=id==='top'||!id?0:el.getBoundingClientRect().top+window.pageYOffset;
  window.scrollTo({top:y,behavior:reduce?'auto':'smooth'});
}
D.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[href^="#"]');
  if(!a)return;
  var h=a.getAttribute('href');if(h.length<2&&h!=='#')return;
  e.preventDefault();
  if(mnav&&mnav.classList.contains('open'))toggleMenu(false);
  goTo(h);
});
function toggleMenu(open){
  if(!mnav||!burger)return;
  mnav.classList.toggle('open',open);burger.setAttribute('aria-expanded',open?'true':'false');H.classList.toggle('menu-open',open);
}
if(burger)burger.addEventListener('click',function(){toggleMenu(!mnav.classList.contains('open'))});

/* ---------- scroll loop (light: no layout reads except the visible scrub text) ---------- */
var prog=$('#prog'),scrub=$('#scrub'),sw=scrub?$$('.sw',scrub):[],word=$('#word'),foot=$('.foot');
var lastY=0,ticking=false,scrubOn=false;
if(scrub&&'IntersectionObserver' in window){new IntersectionObserver(function(es){scrubOn=es[0].isIntersecting;if(scrubOn)onScroll()},{rootMargin:'0px 0px 0px 0px'}).observe(scrub)}else scrubOn=true;
function onScroll(){
  var y=window.pageYOffset,h=D.documentElement.scrollHeight-innerHeight;
  if(prog)prog.style.transform='scaleX('+(h>0?y/h:0)+')';
  if(hdr&&!H.classList.contains('menu-open')){
    if(y>lastY+8&&y>260)hdr.classList.add('hide');else if(y<lastY-8||y<120)hdr.classList.remove('hide');
  }
  lastY=y;
  if(scrubOn&&sw.length){
    var r=scrub.getBoundingClientRect(),p=clamp((innerHeight*.82-r.top)/(r.height+innerHeight*.35),0,1),n=Math.round(p*sw.length);
    for(var i=0;i<sw.length;i++){var on=i<n;if(sw[i]._on!==on){sw[i]._on=on;sw[i].classList.toggle('on',on)}}
  }
  ticking=false;
}
window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
onScroll();
/* scroll spy via IntersectionObserver (no per-frame layout reads) */
(function(){
  if(!('IntersectionObserver' in window))return;
  var vis={};
  var io2=new IntersectionObserver(function(es){
    es.forEach(function(e){vis[e.target.getAttribute('data-sec')]=e.isIntersecting});
    var best='top';secIds.forEach(function(id){if(vis[id])best=id});
    setActive(best);
  },{rootMargin:'-40% 0px -59% 0px'});
  secIds.forEach(function(id){var el=id==='top'?$('#hero'):D.getElementById(id);if(el){el.setAttribute('data-sec',id);io2.observe(el)}});
})();

/* ---------- footer wordmark fit ---------- */
function fitWord(){
  if(!word)return;var s=word.firstElementChild,w=word.parentElement.clientWidth*.96;
  word.style.fontSize='100px';var cw=s.getBoundingClientRect().width;
  if(cw>0)word.style.fontSize=(100*w/cw)+'px';
}
fitWord();if(D.fonts&&D.fonts.ready)D.fonts.ready.then(fitWord);window.addEventListener('load',fitWord);

/* ---------- mouse parallax + glow (hero, only while visible & moving) ---------- */
var hero=$('#hero');
if(hero&&fine&&!reduce){
  var layers=$$('[data-depth]',hero).map(function(e){return {e:e,d:parseFloat(e.getAttribute('data-depth'))}});
  var extra=[{e:$('.hero-fig'),d:-10},{e:$('.b1'),d:-40},{e:$('.b2'),d:34},{e:$('.b3'),d:-22},{e:$('.dots'),d:14},{e:$('.s-ring'),d:30},{e:$('.s-plus'),d:-26},{e:$('.s-star'),d:22},{e:$('.s-sq'),d:-34}].filter(function(o){return o.e});
  layers=layers.concat(extra);
  var glow=$('#glow'),tx=0,ty=0,cx=0,cy=0,gx=0,gy=0,run=false,heroIn=true;
  function frame(){
    cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;
    for(var i=0;i<layers.length;i++){var l=layers[i];l.e.style.translate=(cx*l.d).toFixed(2)+'px '+(cy*l.d).toFixed(2)+'px'}
    if(glow)glow.style.transform='translate3d('+gx+'px,'+gy+'px,0)';
    if(heroIn&&(Math.abs(tx-cx)>.0005||Math.abs(ty-cy)>.0005))requestAnimationFrame(frame);else run=false;
  }
  function kick(){if(!run&&heroIn){run=true;requestAnimationFrame(frame)}}
  hero.addEventListener('mousemove',function(ev){var r=hero.getBoundingClientRect();tx=(ev.clientX-r.left)/r.width-.5;ty=(ev.clientY-r.top)/r.height-.5;gx=ev.clientX-r.left;gy=ev.clientY-r.top;if(glow)glow.style.opacity=1;kick()});
  hero.addEventListener('mouseleave',function(){tx=0;ty=0;if(glow)glow.style.opacity=0;kick()});
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){heroIn=es[0].isIntersecting},{}).observe(hero);
}

/* ---------- magnetic ---------- */
if(fine&&!reduce){
  $$('[data-mag]').forEach(function(el){
    el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();el.style.transform='translate('+((e.clientX-r.left-r.width/2)*.28)+'px,'+((e.clientY-r.top-r.height/2)*.35)+'px)'});
    el.addEventListener('mouseleave',function(){el.style.transform='';el.style.transition='transform .6s cubic-bezier(.2,.7,.1,1)';setTimeout(function(){el.style.transition=''},600)});
  });
}

/* ---------- cursor ---------- */
var cur=$('#cur'),curTxt=$('#curTxt');
if(cur&&fine){
  var mx=0,my=0,px=0,py=0,shown=false;
  D.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;if(!shown){shown=true;cur.classList.add('on');px=mx;py=my}});
  D.addEventListener('mouseleave',function(){cur.classList.remove('on');shown=false});
  (function loop(){px+=(mx-px)*.2;py+=(my-py)*.2;cur.style.transform='translate3d('+px+'px,'+py+'px,0)';requestAnimationFrame(loop)})();
  D.addEventListener('mouseover',function(e){
    var t=e.target.closest&&e.target.closest('[data-cursor]');
    if(t){curTxt.textContent=t.getAttribute('data-cursor');cur.classList.add('big')}else cur.classList.remove('big');
  });
}

/* ---------- testimonials: chatbot flies to the clicked brand ---------- */
(function(){
  var chat=$('#chat'),qd=$('#qdata');if(!chat||!qd)return;
  var data=[];try{data=JSON.parse(qd.textContent)}catch(e){return}
  var chips=$$('.chip-b',chat),body=$('#cwBody'),bot=$('#bot'),num=$('#cwNum'),inp=$('#cwIn'),nextB=$('#cwNext');
  var cur=0,busy=false,pending=null,inView=false,tm=null,userAt=0,bx=0,by=0,ready=false;
  function pad(n){return ('0'+n).slice(-2)}
  function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
  function av(d){return '<span class="mav"><img src="img/clients/'+d.s+'.webp" alt="" width="'+d.w+'" height="'+d.h+'"></span>'}
  function bubble(d){return av(d)+'<div class="mb"><b>'+esc(d.n)+'</b><p>\u201C'+esc(d.q)+'\u201D</p><span class="mst">\u2605\u2605\u2605\u2605\u2605</span></div>'}
  function add(cls,html){
    var m=D.createElement('div');m.className='m '+cls;m.innerHTML=html;body.appendChild(m);
    var all=body.children;while(all.length>5){var o=all[0];body.removeChild(o)}
    return m;
  }
  function chipPos(i){
    var cr=chips[i].getBoundingClientRect(),pr=chat.getBoundingClientRect(),bw=bot.offsetWidth,bh=bot.offsetHeight||bw*1.08;
    return {x:cr.left-pr.left+cr.width/2-bw/2,y:cr.top-pr.top-bh+14};
  }
  function place(i){var p=chipPos(i);bx=p.x;by=p.y;bot.style.transform='translate('+bx+'px,'+by+'px)';ready=true}
  function flyTo(i,cb){
    var p=chipPos(i);
    if(reduce||!bot.animate||!ready){place(i);cb&&cb();return}
    var dx=p.x-bx,dy=p.y-by,dist=Math.hypot(dx,dy),mx=bx+dx*.5,my=Math.min(by,p.y)-Math.min(120,20+dist*.22);
    bot.classList.add('fly');
    var a=bot.animate([
      {transform:'translate('+bx+'px,'+by+'px) scale(1,1)'},
      {transform:'translate('+mx+'px,'+my+'px) rotate('+(dx>0?10:-10)+'deg) scale(.94,1.1)',offset:.5},
      {transform:'translate('+p.x+'px,'+p.y+'px) scale(1.14,.86)',offset:.88},
      {transform:'translate('+p.x+'px,'+p.y+'px) scale(1,1)'}
    ],{duration:Math.max(750,Math.min(1400,dist*1.5)),easing:'cubic-bezier(.45,0,.2,1)',fill:'forwards'});
    a.onfinish=function(){bx=p.x;by=p.y;bot.style.transform='translate('+bx+'px,'+by+'px)';a.cancel();bot.classList.remove('fly');cb&&cb()};
  }
  function ask(i,done){
    var d=data[i];
    add('me','<p>How was working with Rehman'+(d.n==='Valued Client'?'':', '+esc(d.n))+'?</p>');
    if(inp)inp.textContent='\u2026 '+d.n+' is typing';
    setTimeout(function(){
      var t=add('br typing',av(d)+'<div class="mb"><span class="dots"><i></i><i></i><i></i></span></div>');
      setTimeout(function(){
        var m=D.createElement('div');m.className='m br';m.innerHTML=bubble(d);
        if(t.parentNode)body.replaceChild(m,t);else body.appendChild(m);
        if(inp)inp.textContent='Tap a brand to hear their story\u2026';
        done&&done();
      },reduce?200:1100);
    },reduce?100:450);
  }
  function select(i,user){
    i=(i+data.length)%data.length;
    if(user)userAt=Date.now();
    if(busy){pending=i;return}
    busy=true;cur=i;
    chips.forEach(function(c,k){var on=k===i;c.classList.toggle('on',on);c.setAttribute('aria-selected',on?'true':'false')});
    if(num)num.textContent=pad(i+1);
    flyTo(i,function(){ask(i,function(){busy=false;if(pending!==null){var p=pending;pending=null;select(p,true)}else arm()})});
  }
  function arm(){clearTimeout(tm);if(!inView||reduce)return;tm=setTimeout(function(){
    if(Date.now()-userAt<9000){arm();return}
    select(cur+1,false);
  },6500)}
  chips.forEach(function(c,k){c.addEventListener('click',function(){select(k,true)})});
  if(nextB)nextB.addEventListener('click',function(){select(cur+1,true)});
  function init(){place(cur)}
  window.addEventListener('resize',function(){if(!busy)place(cur)});
  window.addEventListener('load',init);if(D.fonts&&D.fonts.ready)D.fonts.ready.then(init);init();
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){inView=es[0].isIntersecting;if(inView){if(!busy)place(cur);arm()}else clearTimeout(tm)},{threshold:.25}).observe(chat);
  }
})();

/* ---------- other skills: highlight cycle + timecode ---------- */
(function(){
  var items=$$('.sk-list li');if(!items.length)return;
  var k=0,tm=null,inV=false,hold=false;
  function set(i){k=i;items.forEach(function(e,j){e.classList.toggle('on',j===i)})}
  items.forEach(function(e,i){e.addEventListener('mouseenter',function(){hold=true;set(i)});e.addEventListener('mouseleave',function(){hold=false})});
  function loop(){clearTimeout(tm);tm=setTimeout(function(){if(inV&&!hold)set((k+1)%items.length);loop()},3800)}
  loop();
  var sk=$('#skills');if(sk&&'IntersectionObserver' in window)new IntersectionObserver(function(es){inV=es[0].isIntersecting},{}).observe(sk);else inV=true;
  var tc=$('#tc');
  if(tc&&!reduce){
    var f=0;setInterval(function(){if(!inV)return;f++;var fr=f%24,s=Math.floor(f/24)%60,m=Math.floor(f/1440);tc.textContent='00:'+('0'+m).slice(-2)+':'+('0'+s).slice(-2)+':'+('0'+fr).slice(-2)},1000/24*2)
  }
})();

/* ---------- footer characters: eyes follow the pointer ---------- */
(function(){
  var chs=$$('.ch,.bot,.pet');if(!chs.length||!fine)return;
  var mx=0,my=0,raf=0;
  function upd(){
    raf=0;
    chs.forEach(function(c){
      var r=c.getBoundingClientRect();if(r.bottom<-200||r.top>innerHeight+200)return;
      var cx=r.left+r.width/2,cy=r.top+r.height*.42,dx=mx-cx,dy=my-cy,d=Math.hypot(dx,dy)||1,k=Math.min(1,d/260)*7;
      c.style.setProperty('--ex',(dx/d*k).toFixed(2));c.style.setProperty('--ey',(dy/d*k).toFixed(2));
    });
  }
  D.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;if(!raf)raf=requestAnimationFrame(upd)});
})();


/* ---------- graphic stack: cards shuffle ---------- */
(function(){
  var st=$('#gstack');if(!st)return;
  var cards=[].slice.call(st.children),n=cards.length,off=0,vis=true,hov=false;
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  if('IntersectionObserver' in window)new IntersectionObserver(function(en){vis=en[0].isIntersecting},{threshold:.2}).observe(st);
  function set(){cards.forEach(function(c,i){c.setAttribute('data-p',(i-off+n)%n)})}
  st.addEventListener('mouseenter',function(){hov=true});st.addEventListener('mouseleave',function(){hov=false});
  setInterval(function(){if(!vis||hov||D.hidden)return;off=(off+1)%n;set()},3400);
})();

/* ---------- little robot: flies to wherever you click / tap ---------- */
(function(){
  var pet=$('#pet');if(!pet||!pet.animate)return;
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){pet.style.display='none';return}
  var inner=pet.querySelector('.pet-in'),cur={x:0,y:0},anim=null,backT=null,popT=null,W=function(){return pet.offsetWidth||48};
  function tr(p){return 'translate3d('+Math.round(p.x)+'px,'+Math.round(p.y)+'px,0)'}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  function home(){var w=W();return {x:12,y:innerHeight-w-16}}
  function put(p){cur=p;pet.style.transform=tr(p)}
  function pos(){var r=pet.getBoundingClientRect();return {x:r.left,y:r.top}}
  put(home());
  addEventListener('resize',function(){if(!anim&&pet.classList.contains('home'))put(home())});
  pet.classList.add('home');
  function fly(to,done){
    var from=pos();if(anim){anim.cancel();anim=null}
    var dx=to.x-from.x,dy=to.y-from.y,d=Math.hypot(dx,dy);
    if(d<6){put(to);done&&done();return}
    var dur=clamp(d*1.05,520,1150),arc=Math.min(110,d*.28),tilt=clamp(dx/16,-20,20);
    pet.classList.remove('home','pop');pet.classList.add('fly');
    anim=pet.animate([{transform:tr(from)},{transform:tr({x:from.x+dx*.5,y:from.y+dy*.5-arc}),offset:.5},{transform:tr(to)}],{duration:dur,easing:'cubic-bezier(.45,.05,.2,1)',fill:'forwards'});
    inner.animate([{transform:'rotate(0) scale(1,1)'},{transform:'rotate('+tilt+'deg) scale(.9,1.1)',offset:.28},{transform:'rotate('+(tilt*.6)+'deg) scale(.94,1.06)',offset:.7},{transform:'rotate(0) scale(1.14,.86)',offset:.93},{transform:'rotate(0) scale(1,1)'}],{duration:dur,easing:'ease-in-out'});
    var a=anim;a.onfinish=function(){if(anim!==a)return;put(to);a.cancel();anim=null;pet.classList.remove('fly');done&&done()};
  }
  function rip(x,y){var r=D.createElement('i');r.className='rip';r.style.left=x+'px';r.style.top=y+'px';D.body.appendChild(r);setTimeout(function(){r.remove()},800)}
  D.addEventListener('click',function(e){
    if(D.documentElement.classList.contains('loading'))return;
    if(e.target.closest&&e.target.closest('#chat'))return;
    var x=e.clientX,y=e.clientY;if(!x&&!y)return;
    rip(x,y);
    var w=W(),to={x:clamp(x-w/2+(x>innerWidth*.5?-w*.55:w*.55),6,innerWidth-w-6),y:clamp(y-w-4,6,innerHeight-w-6)};
    clearTimeout(backT);clearTimeout(popT);
    fly(to,function(){
      pet.classList.add('pop');
      backT=setTimeout(function(){pet.classList.remove('pop');fly(home(),function(){pet.classList.add('home')})},3000);
    });
  },true);
})();

/* ---------- theme (light / dark) ---------- */
var themeBtn=$('#theme');
function curTheme(){
  var a=H.getAttribute('data-theme');if(a==='dark'||a==='light')return a;
  try{return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){return 'light'}
}
function applyTheme(t){
  H.setAttribute('data-theme',t);
  try{localStorage.setItem('db-theme',t)}catch(e){}
}
if(themeBtn){
  themeBtn.addEventListener('click',function(ev){
    var next=curTheme()==='dark'?'light':'dark';
    var r=themeBtn.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
    if(D.startViewTransition&&!reduce){
      var rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
      var vt=D.startViewTransition(function(){applyTheme(next)});
      vt.ready.then(function(){
        H.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+rad+'px at '+x+'px '+y+'px)']},{duration:750,easing:'cubic-bezier(.4,0,.2,1)',pseudoElement:'::view-transition-new(root)'});
      }).catch(function(){});
    }else applyTheme(next);
  });
}

/* ---------- footer rotating word ---------- */
var rot=$('#rot');
if(rot){
  var rw=$$('span',rot),ri=0;
  function sizeRot(){var a=rw[ri];if(a)rot.style.width=a.getBoundingClientRect().width+'px'}
  var fh=rot.closest('.foot-h');
  function lockH(){ /* reserve the tallest heading height so rotating words never shift the page */
    if(!fh)return;fh.style.minHeight='';rot.style.transition='none';var keep=rot.style.width,mx=0;
    rw.forEach(function(w){rot.style.width=w.getBoundingClientRect().width+'px';mx=Math.max(mx,fh.getBoundingClientRect().height)});
    fh.style.minHeight=mx+'px';rot.style.width=keep;void rot.offsetWidth;rot.style.transition='';
  }
  function sizeAll(){sizeRot();lockH();sizeRot()}
  sizeAll();if(D.fonts&&D.fonts.ready)D.fonts.ready.then(sizeAll);window.addEventListener('resize',sizeAll);window.addEventListener('load',sizeAll);
  if(!reduce)setInterval(function(){
    var old=rw[ri];ri=(ri+1)%rw.length;var nw=rw[ri];
    old.classList.remove('on');old.classList.add('out');
    nw.classList.remove('out');nw.classList.add('on');
    sizeRot();
    setTimeout(function(){old.classList.remove('out');old.style.transition='none';void old.offsetWidth;old.style.transition=''},800);
  },2200);
}

/* ---------- footer: particles, copy, year ---------- */
var fd=$('#fdots');
if(fd){
  var cols=['#FF5E21','#2B52FF','#fff','#FFB88F','#5B7BFF'];
  for(var i=0;i<26;i++){
    var d=D.createElement('i'),s=3+Math.random()*9;
    d.style.cssText='left:'+(Math.random()*100)+'%;top:'+(Math.random()*100)+'%;width:'+s+'px;height:'+s+'px;--c:'+cols[i%cols.length]+';--dur:'+(8+Math.random()*10)+'s;--x:'+((Math.random()-.5)*80)+'px;--y:'+((Math.random()-.8)*120)+'px;animation-delay:-'+(Math.random()*10)+'s';
    fd.appendChild(d);
  }
}
var toast=$('#toast'),toastT=null;
function say(msg){if(!toast)return;toast.textContent=msg;toast.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){toast.classList.remove('show')},2200)}
function copyMail(e){
  e.preventDefault();e.stopPropagation();
  var m='rehmanshoukat2006@gmail.com';
  function fb(){var t=D.createElement('textarea');t.value=m;t.style.cssText='position:fixed;opacity:0';D.body.appendChild(t);t.select();try{D.execCommand('copy')}catch(x){}D.body.removeChild(t)}
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(m).catch(fb)}else fb()}catch(x){fb()}
  say('Email copied');
}
['#copyMail','#say'].forEach(function(s){var el=$(s);if(el)el.addEventListener('click',copyMail,true)});
$$('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear()});
})();
