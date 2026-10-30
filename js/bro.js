/* Brochure / company-profile sections: auto-flipping 3D book, standing cover, fanned pages, thumbnail strip, robot-opened reader */
(function(){
'use strict';
var D=document,H=D.documentElement;
function $(s,c){return (c||D).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||D).querySelectorAll(s))}
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var secs=$$('.bro[data-bro]');
var ARR={l:'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',r:'<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',x:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',bk:'<svg viewBox="0 0 24 24"><path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/></svg>'};
function pad(n){return n<10?'0'+n:''+n}
function pg(b,n){return b.dir+pad(n)+'.webp'}
function th(b,n){return b.dir+'t'+pad(n)+'.webp'}

/* ---------- reader (shared) ---------- */
var rd=null,RB=null,rsi=0,rBusy=false;
function narrow(){return innerWidth<760}
function spreadsOf(b){var L=b.n/2,a=[[1]];for(var k=1;k<L;k++)a.push([2*k,2*k+1]);a.push([b.n]);return a}
function pagesAt(i){
  if(narrow())return [i+1];
  return RB.sp[i];
}
function countAt(){return narrow()?RB.n:RB.sp.length}
function idxOfPage(p){
  if(narrow())return p-1;
  for(var i=0;i<RB.sp.length;i++)if(RB.sp[i].indexOf(p)>-1)return i;return 0;
}
function buildReader(){
  rd=D.createElement('div');rd.className='rd';rd.id='rd';rd.setAttribute('aria-hidden','true');rd.setAttribute('role','dialog');
  rd.innerHTML='<div class="rd-bg"></div><div class="rd-top"><div class="rd-t"><span id="rdT"></span><small id="rdS"></small></div><span class="rd-n" id="rdN"></span><button class="rd-x" id="rdX" aria-label="Close">'+ARR.x+'</button></div>'
   +'<div class="rd-stage"><button class="rd-p" id="rdP" aria-label="Previous">'+ARR.l+'</button><div class="rd-sp" id="rdSp"></div><button class="rd-nx" id="rdNx" aria-label="Next">'+ARR.r+'</button></div>'
   +'<div class="rd-th" id="rdTh"></div><div class="rd-zm" id="rdZm"><button class="rd-x rd-zx" id="rdZx" aria-label="Close zoom">'+ARR.x+'</button><img alt=""></div>';
  D.body.appendChild(rd);
  $('#rdX').addEventListener('click',closeReader);$('.rd-bg',rd).addEventListener('click',closeReader);
  $('#rdP').addEventListener('click',function(){go(-1)});$('#rdNx').addEventListener('click',function(){go(1)});
  $('#rdZm').addEventListener('click',function(){this.classList.remove('on')});
  $('#rdSp').addEventListener('click',function(e){var f=e.target.closest('figure');if(!f)return;var z=$('#rdZm');$('img',z).src=f.getAttribute('data-src');z.scrollTop=0;z.classList.add('on')});
  var sx=0,sy=0;
  rd.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
  rd.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4&&!$('#rdZm').classList.contains('on'))go(dx<0?1:-1)},{passive:true});
  D.addEventListener('keydown',function(e){
    if(!rd.classList.contains('on'))return;
    if(e.key==='Escape'){var z=$('#rdZm');if(z.classList.contains('on'))z.classList.remove('on');else closeReader()}
    else if(e.key==='ArrowRight')go(1);else if(e.key==='ArrowLeft')go(-1);
  });
  addEventListener('resize',function(){if(rd.classList.contains('on')){var cur=pagesAt(Math.min(rsi,countAt()-1))[0];rsi=idxOfPage(cur);show(0,true)}});
}
function show(dir,quick){
  var sp=$('#rdSp'),ps=pagesAt(rsi),one=ps.length===1;
  function paint(){
    sp.className='rd-sp'+(narrow()?' one':'');
    sp.innerHTML=ps.map(function(p,k){
      var cls=ps.length===2?(k===0?'rd-l':'rd-r'):(ps[0]===1?'rd-r':(ps[0]===RB.n?'rd-l':'rd-r'));
      return '<figure class="'+cls+'" data-src="'+pg(RB,p)+'"><img src="'+pg(RB,p)+'" alt="'+RB.name+' — page '+p+'" draggable="false"></figure>';
    }).join('');
  }
  var labels=ps.length===2?ps[0]+'–'+ps[1]:ps[0];
  $('#rdN').textContent='Page '+labels+' / '+RB.n;
  $$('#rdTh button').forEach(function(b){b.classList.toggle('on',ps.indexOf(+b.getAttribute('data-p'))>-1)});
  var on=$('#rdTh button.on');if(on&&on.scrollIntoView)try{on.scrollIntoView({inline:'center',block:'nearest',behavior:quick?'auto':'smooth'})}catch(e){}
  if(quick||reduce||!sp.animate||!sp.firstChild){paint();return}
  rBusy=true;
  var o=sp.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateX('+(-dir*40)+'px) scale(.97)'}],{duration:170,easing:'ease-in',fill:'forwards'});
  o.onfinish=function(){paint();o.cancel();sp.animate([{opacity:0,transform:'translateX('+(dir*40)+'px) scale(.97)'},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.2,.7,.1,1)'}).onfinish=function(){rBusy=false}};
}
function go(d){
  if(rBusy)return;var n=rsi+d,N=countAt();if(n<0||n>=N)return;rsi=n;show(d>0?1:-1);
}
function openReader(b,page,origin){
  if(!rd)buildReader();
  RB=b;rsi=idxOfPage(page||1);
  $('#rdT').firstChild&&0;
  $('#rdT').textContent=b.name;$('#rdS').textContent=b.kind;
  $('#rdTh').innerHTML=Array.apply(null,{length:b.n}).map(function(_,i){return '<button data-p="'+(i+1)+'" aria-label="Page '+(i+1)+'"><img src="'+th(b,i+1)+'" alt="" loading="lazy" draggable="false"></button>'}).join('');
  $$('#rdTh button').forEach(function(bt){bt.addEventListener('click',function(){var ni=idxOfPage(+bt.getAttribute('data-p'));var d=ni>rsi?1:-1;if(ni===rsi)return;rsi=ni;show(d)})});
  $('#rdZm').classList.remove('on');
  show(0,true);
  H.classList.add('stg-open');rd.classList.add('on');rd.setAttribute('aria-hidden','false');
  var sp=$('#rdSp');
  if(sp.animate&&!reduce){
    var r=origin&&origin.getBoundingClientRect(),sr=sp.getBoundingClientRect();
    var dx=r?(r.left+r.width/2)-(sr.left+sr.width/2):0,dy=r?(r.top+r.height/2)-(sr.top+sr.height/2):40,s=r?Math.max(.25,Math.min(.9,r.width/Math.max(sr.width,1))):.8;
    sp.animate([{transform:'translate('+dx+'px,'+dy+'px) scale('+s+') rotateX(18deg)',opacity:0},{transform:'none',opacity:1}],{duration:620,easing:'cubic-bezier(.2,.8,.15,1)'});
  }
  $('#rdX').focus({preventScroll:true});
}
function closeReader(){
  if(!rd)return;rd.classList.remove('on');rd.setAttribute('aria-hidden','true');H.classList.remove('stg-open');
}
function viaBot(el,fn){if(window.dbPetOpen&&el&&!reduce)window.dbPetOpen(el,fn);else fn()}

/* ---------- one brochure section ---------- */
secs.forEach(function(sec){
  var b={tag:sec.getAttribute('data-bro'),n:+sec.getAttribute('data-pages'),dir:sec.getAttribute('data-dir'),name:sec.getAttribute('data-name'),kind:sec.getAttribute('data-kind')};
  b.sp=spreadsOf(b);
  var L=b.n/2,stage=$('.bro-stage',sec),bk=$('.bk',sec),bkin=$('.bk-in',sec),cur=0,timer=null,vis=false,hover=false,hold=0,playing=!reduce,busy=false,settleT={};
  /* leaves: front = page 2k+1, back = page 2k+2 */
  var leaves=[];
  for(var k=0;k<L;k++){
    var lf=D.createElement('div');lf.className='lf';
    lf.innerHTML='<div class="fc"><img src="'+pg(b,2*k+1)+'" alt="'+b.name+' page '+(2*k+1)+'" loading="lazy" decoding="async" draggable="false"></div><div class="bc"><img src="'+pg(b,2*k+2)+'" alt="'+b.name+' page '+(2*k+2)+'" loading="lazy" decoding="async" draggable="false"></div>';
    bkin.appendChild(lf);leaves.push(lf);
  }
  function zOf(k){return k<cur?(k+1)*.5:(L-k)*.5}
  function paint(){
    leaves.forEach(function(lf,k){if(settleT[k])return;lf.style.transform='translateZ('+zOf(k)+'px) rotateY('+(k<cur?-180:0)+'deg)'});
    stage.setAttribute('data-st',cur===0?'c0':(cur===L?'c1':'op'));
    var lab=cur===0?'Cover':(cur===L?'Back cover':'Pages '+(2*cur)+'–'+(2*cur+1));
    $('.bk-pg',sec).innerHTML='<b>'+lab+'</b> &nbsp;·&nbsp; '+b.n+' pages';
    $$('.bro-dots i',sec).forEach(function(d,i){d.classList.toggle('on',i===cur)});
  }
  function flipTo(n,quick){
    n=Math.max(0,Math.min(L,n));if(n===cur)return;
    var dir=n>cur?1:-1,from=cur,steps=Math.abs(n-cur);
    function one(){
      var k=dir>0?cur:cur-1,lf=leaves[k];
      lf.style.transform='translateZ('+((L+2)*.5)+'px) rotateY('+(dir>0?-180:0)+'deg)';
      clearTimeout(settleT[k]);settleT[k]=setTimeout(function(){delete settleT[k];lf.style.transform='translateZ('+zOf(k)+'px) rotateY('+(k<cur?-180:0)+'deg)'},1300);
      cur+=dir;
      stage.setAttribute('data-st',cur===0?'c0':(cur===L?'c1':'op'));
      var lab=cur===0?'Cover':(cur===L?'Back cover':'Pages '+(2*cur)+'–'+(2*cur+1));
      $('.bk-pg',sec).innerHTML='<b>'+lab+'</b> &nbsp;·&nbsp; '+b.n+' pages';
      $$('.bro-dots i',sec).forEach(function(d,i){d.classList.toggle('on',i===cur)});
    }
    var i=0;(function next(){if(i>=steps)return;one();i++;if(i<steps)setTimeout(next,quick?70:150)})();
  }
  /* controls */
  var dots=$('.bro-dots',sec);dots.innerHTML=Array.apply(null,{length:L+1}).map(function(){return '<i></i>'}).join('');
  $$('i',dots).forEach(function(d,i){d.addEventListener('click',function(){pause(9000);flipTo(i,true)})});
  $('.bro-prev',sec).innerHTML=ARR.l;$('.bro-next',sec).innerHTML=ARR.r;
  $('.bro-prev',sec).addEventListener('click',function(){pause(9000);flipTo(cur-1)});
  $('.bro-next',sec).addEventListener('click',function(){pause(9000);flipTo(cur+1)});
  function readerPage(){return cur===0?1:(cur===L?b.n:2*cur)}
  var rbtn=$('.bro-read',sec);rbtn.innerHTML=ARR.bk+'<span>Read the '+(b.tag==='gl'?'profile':'brochure')+'</span>';
  rbtn.setAttribute('data-bot','');
  rbtn.addEventListener('click',function(){var p=readerPage();pause(12000);viaBot(bk,function(){openReader(b,p,bk)})});
  bk.setAttribute('data-bot','');bk.setAttribute('data-cursor','Open');
  bk.addEventListener('click',function(){var p=readerPage();pause(12000);viaBot(bk,function(){openReader(b,p,bk)})});
  bk.addEventListener('mouseenter',function(){hover=true});bk.addEventListener('mouseleave',function(){hover=false});
  /* standing closed cover + fanned pages + strip */
  var cl=$('.bro-closed',sec);
  cl.innerHTML='<div class="bc3"><div class="c-f"><img src="'+pg(b,1)+'" alt="'+b.name+' cover" loading="lazy" decoding="async" draggable="false"></div><div class="c-s"></div><div class="c-p"></div></div><span class="cap">Cover</span>';
  cl.setAttribute('data-bot','');cl.setAttribute('data-cursor','Open');
  cl.addEventListener('click',function(){pause(12000);viaBot(cl,function(){openReader(b,1,cl)})});
  var fan=$('.bro-fan',sec),FP=[b.n>12?9:7,b.n>12?7:5,b.n>12?5:3,b.n>12?3:2],RS=[-17,-6,5,16];
  fan.innerHTML=FP.map(function(p,i){return '<div class="fp" style="--r:'+RS[i]+'deg;z-index:'+(i+1)+'"><img src="'+pg(b,p)+'" alt="'+b.name+' page '+p+'" loading="lazy" decoding="async" draggable="false"></div>'}).join('')+'<span class="cap">Inside pages</span>';
  fan.setAttribute('data-bot','');fan.setAttribute('data-cursor','Open');
  fan.addEventListener('click',function(){pause(12000);viaBot(fan,function(){openReader(b,FP[2],fan)})});
  var tr=$('.bro-tr',sec),tiles='';
  for(var p=1;p<=b.n;p++)tiles+='<button data-p="'+p+'" data-bot aria-label="Open page '+p+'"><img src="'+th(b,p)+'" alt="" loading="lazy" decoding="async" draggable="false"></button>';
  tr.innerHTML=tiles+tiles;
  tr.addEventListener('click',function(e){var t=e.target.closest('button');if(!t)return;pause(12000);viaBot(t,function(){openReader(b,+t.getAttribute('data-p'),t)})});
  /* autoplay: flip forward every few seconds, close, pause, restart */
  function pause(ms){hold=Date.now()+ms}
  function tick(){
    if(!vis||!playing||hover||Date.now()<hold||(rd&&rd.classList.contains('on')))return;
    if(cur>=L){flipTo(0,true);return}
    flipTo(cur+1);
  }
  function start(){if(timer||reduce)return;timer=setInterval(tick,3000)}
  function stop(){clearInterval(timer);timer=null}
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){
    vis=es[0].isIntersecting;sec.classList.toggle('off',!vis);
    if(vis){start();if(cur===0&&!reduce)setTimeout(function(){if(vis&&cur===0&&Date.now()>=hold)flipTo(1)},900)}else stop();
  },{threshold:.25}).observe(stage);
  else{vis=true;start()}
  paint();
  if(reduce)flipTo(1,true);
});

/* ---------- section 3: two rows of ready-made brochure mockups (auto-scrolling cards) ---------- */
(function(){
  var box=$('#bmq');if(!box)return;
  var GR=[['prof','Company profile',0,16],['char','Charity brochure',16,3],['ev','Event brochure',19,14],['re','Real estate brochure',33,22]];
  var ALL=[];GR.forEach(function(g){for(var i=0;i<g[3];i++)ALL.push({g:g[0],gn:g[1],n:i+1,t:g[3],src:'img/bro/mk/'+(g[2]+i<10?'0':'')+(g[2]+i)+'.webp'})});
  /* interleave the four projects so each row keeps varying */
  var q={},order=[];GR.forEach(function(g){q[g[0]]=ALL.filter(function(x){return x.g===g[0]})});
  for(var r=0;order.length<ALL.length;r++)GR.forEach(function(g){var x=q[g[0]][r];if(x)order.push(x)});
  var list=order,mv=null,mi=0,vis=false;
  var rows=$$('.bmq-row',box);
  rows.forEach(function(row,ri){
    var mine=list.filter(function(_,i){return i%2===ri}),h='';
    for(var pass=0;pass<2;pass++)mine.forEach(function(it){h+='<div class="bmq-c"><img src="'+it.src+'" alt="'+it.gn+' mockup '+it.n+'" loading="lazy" decoding="async" draggable="false"></div>'});
    row.innerHTML=h;
  });
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;box.parentNode.classList.toggle('off',!vis)},{threshold:.1}).observe(box);
  /* viewer */
  var mv=null,mi=0;
  function openMv(k){
    if(!mv){
      mv=D.createElement('div');mv.className='rd mv';mv.setAttribute('aria-hidden','true');mv.setAttribute('role','dialog');
      mv.innerHTML='<div class="rd-bg"></div><div class="rd-top"><div class="rd-t"><span id="mvT"></span><small>Brochure mockup</small></div><span class="rd-n" id="mvN"></span><button class="rd-x" id="mvX" aria-label="Close">'+ARR.x+'</button></div><div class="mv-st"><button class="rd-p" id="mvP" aria-label="Previous">'+ARR.l+'</button><img class="mv-im" id="mvI" alt=""><button class="rd-nx" id="mvNx" aria-label="Next">'+ARR.r+'</button></div><div class="mv-cp" id="mvC"></div>';
      D.body.appendChild(mv);
      $('#mvX').addEventListener('click',closeMv);$('.rd-bg',mv).addEventListener('click',closeMv);
      $('#mvP').addEventListener('click',function(){mgo(-1)});$('#mvNx').addEventListener('click',function(){mgo(1)});
      var x0=0;mv.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
      mv.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)mgo(dx<0?1:-1)},{passive:true});
      D.addEventListener('keydown',function(e){if(!mv.classList.contains('on'))return;if(e.key==='Escape')closeMv();else if(e.key==='ArrowRight')mgo(1);else if(e.key==='ArrowLeft')mgo(-1)});
    }
    mi=k;mshow(0,true);H.classList.add('stg-open');mv.classList.add('on');mv.setAttribute('aria-hidden','false');
    var im=$('#mvI');if(im.animate&&!reduce)im.animate([{transform:'scale(.7) rotateX(14deg)',opacity:0},{transform:'none',opacity:1}],{duration:600,easing:'cubic-bezier(.2,.8,.15,1)'});
    $('#mvX').focus({preventScroll:true});
  }
  function mshow(dir,quick){
    var it=list[mi],im=$('#mvI');
    function paint(){im.src=it.src;im.alt=it.gn+' mockup '+it.n;$('#mvT').textContent=it.gn;$('#mvN').textContent=(mi+1)+' / '+list.length;$('#mvC').textContent=it.gn+' · '+it.n+' of '+it.t}
    if(quick||reduce||!im.animate){paint();return}
    var o=im.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateX('+(-dir*40)+'px)'}],{duration:160,fill:'forwards'});
    o.onfinish=function(){paint();o.cancel();im.animate([{opacity:0,transform:'translateX('+(dir*40)+'px)'},{opacity:1,transform:'none'}],{duration:300,easing:'cubic-bezier(.2,.7,.1,1)'})};
  }
  function mgo(d){var N=list.length;mi=(mi+d+N)%N;mshow(d)}
  function closeMv(){mv.classList.remove('on');mv.setAttribute('aria-hidden','true');H.classList.remove('stg-open')}
})();
})();
