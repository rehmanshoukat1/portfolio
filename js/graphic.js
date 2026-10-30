/* Graphic Work page: mockups, 3D coverflow, devices, street, stories, collection, "lift to front" stage */
(function(){
'use strict';
var D=document,H=D.documentElement;
function $(s,c){return (c||D).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||D).querySelectorAll(s))}
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
var dEl=$('#pdata');if(!dEl)return;
var P=JSON.parse(dEl.textContent),BY={};P.forEach(function(p){BY[p.i]=p});
var CAT={beauty:'Beauty & Care',lighting:'Lighting',tech:'Tech & SaaS',estate:'Real Estate',gaming:'Gaming',creative:'Creative'};
var CAPS={beauty:['Glow that lasts. Shop the range today ✨','Care you can see. Link in bio.','Your daily dose of confidence.'],lighting:['Bright ideas, built to last 💡','Light up every space. Enquire now.','Efficient. Durable. Beautiful.'],tech:['Built for teams that move fast 🚀','Simple tools, serious results.','See it in action — book a demo.'],estate:['Your next address awaits 🏙️','Limited units. Book a viewing today.','Invest in the skyline.'],gaming:['Level up your setup 🎮','Precision in every click.','Play harder. Look sharper.'],creative:['Made with love and a little spice 🔥','Ideas that look as good as they taste.','Fresh from the studio.']};
function pad(i){return i<10?'0'+i:''+i}
function src(p,f){return 'img/posts/p'+pad(p.i)+(f?'f':'')+'.webp'}
function cap(p){var a=CAPS[p.c]||CAPS.creative;return a[p.i%a.length]}
function hnd(p){return p.b.toLowerCase().replace(/[^a-z0-9]+/g,'')}
function likes(p){return (1200+((p.i*2713)%3100)).toLocaleString('en-US')}
var TYPES=['ig','fr','bw','pl','tb','ig','lp','fr','pl','bw','ig','tb'];
function typeOf(p){return TYPES[(p.i-1)%TYPES.length]}
var ASP={ig:2.07,bw:.3,fr:.22,pl:.22,tb:.78,lp:.74};
function aspOf(t,p){var r=p.h/p.w;if(t==='ig')return 2.07;if(t==='fr')return .72*r+.24;if(t==='pl')return .9*r+.24;if(t==='bw')return .9*r+.36;if(t==='tb')return .78;return .74}
var IC={heart:'<svg viewBox="0 0 24 24"><path d="M12 20.5C5.5 16 3 12.6 3 9.4 3 6.9 4.9 5 7.3 5c1.8 0 3.4 1 4.7 3 1.3-2 2.9-3 4.7-3C19.1 5 21 6.9 21 9.4c0 3.2-2.5 6.6-9 11.1z"/></svg>',
cm:'<svg viewBox="0 0 24 24"><path d="M20.5 12a8.5 8.5 0 1 1-3.4-6.8L21 4l-1 3.9A8.4 8.4 0 0 1 20.5 12z"/></svg>',
sd:'<svg viewBox="0 0 24 24"><path d="M21.5 3 9.6 10.6 3 8.4zM21.5 3l-5.6 17.6-6.3-10zM9.6 10.6 21.5 3"/></svg>',
bk:'<svg viewBox="0 0 24 24"><path d="M6 3.5h12v17l-6-4.6-6 4.6z"/></svg>',
hb:'<svg viewBox="0 0 24 24"><path fill="#ff3b5c" d="M12 20.5C5.5 16 3 12.6 3 9.4 3 6.9 4.9 5 7.3 5c1.8 0 3.4 1 4.7 3 1.3-2 2.9-3 4.7-3C19.1 5 21 6.9 21 9.4c0 3.2-2.5 6.6-9 11.1z"/></svg>'};
function img(p,o){o=o||{};return '<img src="'+src(p,o.f)+'" alt="'+p.b+' social media post design" width="'+p.w+'" height="'+p.h+'" decoding="async"'+(o.eager?'':' loading="lazy"')+' draggable="false">'}
function av(p,sk){return '<span class="ig-av'+(sk?' sk':'')+'"><em>'+p.b.charAt(0).toUpperCase()+'</em></span>'}

/* ---------- mockup builders ---------- */
function mIg(p,o){
  return '<div class="mk m-ph"><div class="ph"><div class="pscr"><div class="isl"></div><div class="sb"><b>9:41</b><span class="sbi"><i></i><i></i><i></i></span></div>'
  +'<div class="ig-top">'+av(p)+'<div class="ig-nm"><b>'+hnd(p)+'</b><small>Sponsored</small></div><span class="ig-dots"><i></i><i></i><i></i></span></div>'
  +'<div class="ig-img" style="aspect-ratio:'+p.w+'/'+p.h+'">'+img(p,o)+'<span class="ig-heart">'+IC.hb+'</span></div>'
  +'<div class="ig-act"><span class="lk">'+IC.heart+'</span>'+IC.cm+IC.sd+'<span class="bk">'+IC.bk+'</span></div>'
  +'<div class="ig-likes">Liked by <b>studio.lahore</b> and <b>'+likes(p)+' others</b></div>'
  +'<div class="ig-cap"><b>'+hnd(p)+'</b> '+cap(p)+'</div><div class="ig-time">'+(1+p.i%9)+' hours ago</div>'
  +'<div class="ig-next">'+av(p,1)+'<i></i></div><div class="hm"></div></div></div></div>';
}
function mBw(p,o){
  return '<div class="mk m-bw"><div class="bw"><div class="bw-bar"><i></i><i></i><i></i><span>social.com/'+hnd(p)+'</span></div><div class="bw-body"><div class="bw-card"><div class="bw-hd">'+av(p)+'<div><b>'+p.b+'</b><small>Sponsored · '+CAT[p.c]+'</small></div></div>'+img(p,o)+'<div class="bw-rx"><i></i>'+likes(p)+'<span>'+(12+p.i*3)+' comments</span></div></div></div></div></div>';
}
function mFr(p,o){var fc=(o&&o.fc)||['k','w','o'][p.i%3];return '<div class="mk m-fr fc-'+fc+'"><div class="fr"><div class="fr-mat">'+img(p,o)+'</div></div></div>'}
function mPl(p,o){return '<div class="mk m-pl" style="--rot:'+(((p.i%5)-2)*1.3)+'deg"><div class="pl"><i class="pl-t"></i>'+img(p,o)+'<div class="pl-c">'+p.b+'</div></div></div>'}
function mTb(p,o){
  return '<div class="mk m-tb"><div class="tb-body"><div class="tb-scr tb-post"><div class="tbp-img" style="aspect-ratio:'+p.w+'/'+p.h+'">'+img(p,o)+'</div><div class="tbp-side"><div class="tbp-h">'+av(p)+'<div><b>'+hnd(p)+'</b><small>'+CAT[p.c]+'</small></div></div><p>'+cap(p)+'</p><i></i><i></i><i class="s"></i><div class="tbp-a">'+IC.heart+IC.cm+IC.sd+'</div><small>'+likes(p)+' likes</small></div></div></div></div>';
}
function mLp(p,o){
  return '<div class="mk m-lp"><div class="lp-lid"><div class="lp-cam"></div><div class="lp-scr"><div class="lp-bar"><i></i><i></i><i></i><span>studio.com/work/'+hnd(p)+'</span></div><div class="lp-view" style="background-image:url('+src(p)+')"><div class="lp-vb">'+img(p,o)+'</div></div></div></div><div class="lp-base"><i></i></div></div>';
}
function mock(t,p,o){return ({ig:mIg,bw:mBw,fr:mFr,pl:mPl,tb:mTb,lp:mLp})[t](p,o)}

/* ---------- generic coverflow ---------- */
function Cover(root,o){
  var list=o.list,n=list.length,cur=o.start||0,els={},drag=null,moved=false,self={};
  function norm(off){off=((off%n)+n)%n;return off>n/2?off-n:off}
  function widthOf(p){return o.w(p,root.clientWidth,root.clientHeight)}
  function ensure(i){
    if(els[i])return els[i];
    var d=D.createElement('div');d.className='cf-it hid';d.setAttribute('data-k',i);
    d.innerHTML=o.mk(list[i],i);d.style.setProperty('--w',widthOf(list[i])+'px');
    root.appendChild(d);els[i]=d;d._new=true;return d;
  }
  function place(d,off,w,x,collapse){
    var a=Math.abs(off),s=off===0?1:(a===1?.84:(a===2?.68:.56)),sg=off<0?-1:1;
    var z=off===0?70:-150-70*(a-1),ry=off===0?0:-sg*(a===1?34:40);
    var tr='translate(-50%,-50%) translate3d('+(collapse?0:x)+'px,0,'+(collapse?-320:z)+'px) rotateY('+(collapse?0:ry)+'deg) scale('+(collapse?.7:s)+')';
    d.style.transform=tr;d.style.zIndex=String(100-a*10);return tr;
  }
  self.layout=function(collapse){
    var mv=o.maxVis(root.clientWidth),pos={};
    /* cumulative x offsets */
    var xs={0:0};
    for(var side=-1;side<=1;side+=2){
      var prevX=0,prevW=widthOf(list[((cur)%n+n)%n]);
      for(var a=1;a<=mv+1;a++){
        var idx=(((cur+side*a)%n)+n)%n,w=widthOf(list[idx]),s=a===1?.84:(a===2?.68:.56);
        var ps=a===1?1:(a===2?.84:.68);
        prevX=prevX+(prevW*ps/2+w*s/2)*(o.tight||.78);prevW=w;xs[side*a]=side*prevX;
      }
    }
    for(var i=0;i<n;i++){
      var off=norm(i-cur);if(Math.abs(off)>mv+1&&!els[i])continue;
      var d=ensure(i),isNew=d._new;
      var w=widthOf(list[i]);d.style.setProperty('--w',w+'px');
      var vis=Math.abs(off)<=mv;
      if(Math.abs(off)>mv+1){d.classList.add('hid');d.style.transition='opacity .3s';continue}
      if(isNew){d.style.transition='none'}
      place(d,off,w,xs[off]||0,collapse&&off!==0);
      if(collapse&&off!==0)d.style.opacity='0';else d.style.opacity='';
      d.classList.toggle('hid',!vis);d.classList.toggle('on',off===0);
      d.setAttribute('aria-hidden',vis?'false':'true');
      if(isNew){void d.offsetWidth;d.style.transition='';d._new=false}else d.style.transition='';
    }
  };
  self.go=function(by){cur=((cur+by)%n+n)%n;self.layout();o.onChange&&o.onChange(cur,list[cur])};
  self.to=function(i){self.go(norm(i-cur))};
  self.cur=function(){return cur};
  self.el=function(i){return els[i===undefined?cur:i]};
  self.destroy=function(){root.innerHTML='';els={};root.removeEventListener('pointerdown',down);root.removeEventListener('click',click,true)};
  function down(e){if(e.pointerType==='mouse'&&e.button)return;drag={x:e.clientX,y:e.clientY};moved=false;root.classList.add('drag');
    window.addEventListener('pointermove',mv2);window.addEventListener('pointerup',up,{once:true});window.addEventListener('pointercancel',up,{once:true})}
  function mv2(e){if(!drag)return;var dx=e.clientX-drag.x;if(Math.abs(dx)>(o.step||56)&&Math.abs(dx)>Math.abs(e.clientY-drag.y)){moved=true;self.go(dx<0?1:-1);drag.x=e.clientX}}
  function up(){drag=null;root.classList.remove('drag');window.removeEventListener('pointermove',mv2);setTimeout(function(){moved=false},30)}
  function click(e){
    if(moved){e.stopPropagation();e.preventDefault();return}
    var it=e.target.closest&&e.target.closest('.cf-it');if(!it||!root.contains(it))return;
    var k=+it.getAttribute('data-k'),off=norm(k-cur);
    if(off===0){o.onActivate&&o.onActivate(list[k],it)}else{e.stopPropagation();self.go(off)}
  }
  root.addEventListener('pointerdown',down);root.addEventListener('click',click,true);
  self.layout(o.collapse);
  if(o.collapse)requestAnimationFrame(function(){requestAnimationFrame(function(){self.layout()})});
  self.resize=function(){Object.keys(els).forEach(function(k){els[k]._new=false});self.layout()};
  return self;
}

/* ---------- fill [data-mk] ---------- */
$$('[data-mk]').forEach(function(el){
  var p=BY[el.getAttribute('data-post')];if(!p)return;
  el.innerHTML=mock(el.getAttribute('data-mk'),p,{eager:el.classList.contains('hp'),fc:el.getAttribute('data-fc')});
  if(el.hasAttribute('data-open'))el.addEventListener('click',function(){openStage(p.i,P,$('.mk',el))});
  el.setAttribute('data-cursor','View');
});

/* ---------- 01 feed coverflow ---------- */
var FEED=[26,13,3,22,9,45,38,29,5].map(function(i){return BY[i]});
var feedRoot=$('#feedCf'),feedCf=null,dots=$('#feedDots'),feedT=null,feedHover=false,feedIn=false;
function feedW(p,W){var b=W<640?W*.56:Math.max(200,Math.min(W*.23,300));return Math.round(b)}
function popHeart(i){setTimeout(function(){if(!feedCf)return;var d=feedCf.el(i);var m=d&&$('.mk',d);if(m){m.classList.remove('pop');void m.offsetWidth;m.classList.add('pop')}},760)}
if(feedRoot){
  FEED.forEach(function(p,i){var b=D.createElement('i');b.addEventListener('click',function(){feedCf&&feedCf.to(i)});dots.appendChild(b)});
  var dts=$$('i',dots);
  function setDots(c){dts.forEach(function(d,i){d.classList.toggle('on',i===c)})}
  feedCf=Cover(feedRoot,{list:FEED,start:2,w:feedW,maxVis:function(W){return W<640?1:3},tight:.8,
    mk:function(p){return mIg(p,{f:1,eager:1})},
    onChange:function(c){setDots(c);popHeart(c)},
    onActivate:function(p,it){openStage(p.i,P,$('.mk',it))}});
  setDots(2);
  $('#feedPrev').addEventListener('click',function(){feedCf.go(-1)});$('#feedNext').addEventListener('click',function(){feedCf.go(1)});
  feedRoot.addEventListener('mouseenter',function(){feedHover=true});feedRoot.addEventListener('mouseleave',function(){feedHover=false});
  function feedTick(){if(feedIn&&!feedHover&&!stageOn&&!reduce)feedCf.go(1)}
  new IntersectionObserver(function(es){feedIn=es[0].isIntersecting;if(feedIn){popHeart(feedCf.cur());if(!feedT)feedT=setInterval(feedTick,3600)}else{clearInterval(feedT);feedT=null}},{threshold:.35}).observe(feedRoot);
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){feedCf.resize()},150)});
}

/* ---------- 02 devices ---------- */
(function(){
  var lp=$('#lpTrack'),tb=$('#tbGrid'),ex=$('#exGrid'),dev=$('#dev');if(!dev)return;
  var L=[26,13,3,22,9,16].map(function(i){return BY[i]});
  function lc(p){return '<div class="lc"><div class="lc-h">'+av(p)+'<span>'+p.b+'</span></div><img src="'+src(p)+'" alt="" width="'+p.w+'" height="'+p.h+'" decoding="async" loading="lazy" draggable="false"><div class="lc-f"><i></i><i></i>'+likes(p)+' likes</div></div>'}
  var h=L.map(lc).join('');lp.innerHTML=h+h;
  tb.innerHTML=[3,16,22,26,13,45,38,5,1].map(function(i,k){var p=BY[i];return '<span style="--k:'+k+'"><img src="'+src(p)+'" alt="" width="'+p.w+'" height="'+p.h+'" loading="lazy" decoding="async" draggable="false"></span>'}).join('');
  ex.innerHTML=[26,9,5,38,16,3,45,29].map(function(i,k){var p=BY[i];return '<span class="'+(k===0?'big':'')+'" style="--k:'+k+'"><img src="'+src(p)+'" alt="" width="'+p.w+'" height="'+p.h+'" loading="lazy" decoding="async" draggable="false"></span>'}).join('');
  $$('.dv',dev).forEach(function(d){d.addEventListener('click',function(){openStage(+d.getAttribute('data-open-post'),P,$('.dv-in',d))});d.setAttribute('data-cursor','View')});
  if(fine&&!reduce){
    var raf=0,tx=0,ty=0;
    dev.addEventListener('pointermove',function(e){var r=dev.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5;if(!raf)raf=requestAnimationFrame(function(){raf=0;dev.style.setProperty('--mx',tx.toFixed(3));dev.style.setProperty('--my',ty.toFixed(3))})});
    dev.addEventListener('pointerleave',function(){dev.style.setProperty('--mx',0);dev.style.setProperty('--my',0)});
  }
})();

/* ---------- 03 street ---------- */
(function(){
  var tri=$('#bbTri'),sh=$('#shBox'),street=$('#street');if(!tri)return;
  var BB=[5,25,36,16,9,44,14,30,23,3,39,45].map(function(i){return BY[i]}),panels=[];
  for(var k=0;k<3;k++){
    (function(k){
      var d=D.createElement('div');d.className='bp';d.setAttribute('data-cursor','View');
      var a=BB[k*4%BB.length],b=BB[(k*4+1)%BB.length];
      d.innerHTML='<div class="bp-in"><div class="bp-f a">'+img(a,{eager:1})+'</div><div class="bp-f b">'+img(b,{})+'</div></div>';
      tri.appendChild(d);
      var st={d:d,in:$('.bp-in',d),i:k*4%BB.length,rot:0};panels.push(st);
      d.addEventListener('click',function(){openStage(BB[st.i].i,P,d)});
    })(k);
  }
  var tick=0,bbT=null;
  function flip(){
    var st=panels[tick%3];tick++;
    var nxt=(st.i+3+tick%2)%BB.length;if(nxt===st.i)nxt=(nxt+1)%BB.length;
    var hid=(st.rot/180)%2===0?'.bp-f.b img':'.bp-f.a img';
    var im=$(hid,st.d);im.src=src(BB[nxt]);im.width=BB[nxt].w;im.height=BB[nxt].h;
    st.rot+=180;st.i=nxt;st.in.style.transform='rotateX('+st.rot+'deg)';
  }
  /* shelter poster + bus ad */
  var SH=[26,29,13,45].map(function(i){return BY[i]}),si=0;
  sh.innerHTML='<img src="'+src(SH[0],0)+'" alt="Bus shelter poster" width="520" height="650" decoding="async" style="transition:opacity .5s">';
  var shImg=$('img',sh);
  $$('.bus',street).forEach(function(b){var ids=b.getAttribute('data-posts').split(',');$$('.bsw',b).forEach(function(w,k){var p=BY[+ids[k%ids.length]];if(p)w.innerHTML=img(p,{})})});
  function shNext(){si=(si+1)%SH.length;shImg.style.opacity=0;setTimeout(function(){shImg.src=src(SH[si]);shImg.style.opacity=1},500)}
  var shT=null;
  $('.shelter',street).addEventListener('click',function(){openStage(SH[si].i,P,sh)});$('.shelter',street).setAttribute('data-cursor','View');
  var bbW=null;
  new IntersectionObserver(function(es){
    if(es[0].isIntersecting){if(!bbT&&!reduce){bbT=setInterval(flip,1700);shT=setInterval(shNext,6200)}}
    else{clearInterval(bbT);clearInterval(shT);bbT=shT=null}
  },{threshold:.2}).observe(street);
  /* gallery wall entrance */
})();

/* ---------- 04 stories ---------- */
(function(){
  var root=$('#storiesRow');if(!root)return;
  var S=[{i:22,k:'poll',a:'Soft or glam?',o:['Soft','Glam'],pc:['62%','38%']},{i:26,k:'slide',a:'Rate this look'},{i:16,k:'count'},{i:45,k:'link'},{i:29,k:'poll',a:'Dark or light UI?',o:['Dark','Light'],pc:['71%','29%']}];
  root.innerHTML=S.map(function(s,n){
    var p=BY[s.i],stk='';
    if(s.k==='poll')stk='<div class="stk poll" style="--r:'+(n%2?3:-3)+'deg"><p>'+s.a+'</p><div class="o" style="--p:'+s.pc[0]+'"><span>'+s.o[0]+'</span><span>'+s.pc[0]+'</span></div><div class="o" style="--p:'+s.pc[1]+'"><span>'+s.o[1]+'</span><span>'+s.pc[1]+'</span></div></div>';
    if(s.k==='slide')stk='<div class="stk slide"><span>'+s.a+'</span><div class="tr"></div></div>';
    if(s.k==='count')stk='<div class="stk count">Launching in<b>02 : 14 : 09</b></div>';
    if(s.k==='link')stk='<div class="stk link">shop.'+hnd(p)+'.com</div>';
    var fl=[0,1,2].map(function(j){return '<span class="st-fl" style="left:'+(62+j*10)+'%;animation-delay:'+(j*1.3+n*.4)+'s">'+['❤️','🔥','😍'][(j+n)%3]+'</span>'}).join('');
    return '<div class="stw" data-i="'+p.i+'" data-cursor="View" style="--t:'+(7+n*.7)+'s;--dl:-'+(n*1.4)+'s"><div class="mk m-ph"><div class="ph"><div class="pscr st"><div class="st-bg" style="background-image:url('+src(p)+')"></div><div class="isl"></div>'
    +'<div class="st-bars"><i></i><i></i><i></i></div><div class="st-hd">'+av(p)+'<b>'+hnd(p)+'</b><small>'+(n+1)+'h</small><span class="x">×</span></div>'
    +'<div class="st-card">'+img(p,{})+'</div>'+stk+'<div class="st-ft"><span>Send message</span>'+IC.heart+IC.sd+'</div>'+fl+'<div class="hm" style="background:#fff"></div></div></div></div></div>';
  }).join('');
  $$('.stw',root).forEach(function(d){d.addEventListener('click',function(){openStage(+d.getAttribute('data-i'),P,$('.mk',d))})});
})();

/* ---------- 05 collection ---------- */
var grid=$('#mgrid'),gis=[],curCat='all';
if(grid){
  P.forEach(function(p,n){
    var t=typeOf(p),d=D.createElement('div');d.className='gi';d.setAttribute('data-t',t);d.setAttribute('data-c',p.c);d.setAttribute('data-i',p.i);d.style.setProperty('--d',((n%4)*.08)+'s');
    d.innerHTML='<div class="gi-t" data-cursor="View">'+mock(t,p,{})+'</div><div class="gi-l">'+p.b+(p.b===CAT[p.c]?'':' <i>·</i> '+CAT[p.c])+'</div>';
    grid.appendChild(d);gis.push(d);
  });
  var gio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');gio.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -4% 0px'});
  gis.forEach(function(d){gio.observe(d)});
  function curList(){return P.filter(function(p){return curCat==='all'||p.c===curCat})}
  grid.addEventListener('click',function(e){var t=e.target.closest('.gi-t');if(!t)return;var i=+t.parentNode.getAttribute('data-i');openStage(i,curList(),$('.mk',t))});
  if(fine&&!reduce){
    var traf=0,tt=null,ex=0,ey=0;
    grid.addEventListener('pointermove',function(e){var t=e.target.closest&&e.target.closest('.gi-t');if(!t){return}tt=t;ex=e.clientX;ey=e.clientY;if(!traf)traf=requestAnimationFrame(function(){traf=0;var r=tt.getBoundingClientRect(),x=(ex-r.left)/r.width,y=(ey-r.top)/r.height;tt.style.setProperty('--ry',((x-.5)*13).toFixed(2)+'deg');tt.style.setProperty('--rx',(-(y-.5)*13).toFixed(2)+'deg');tt.style.setProperty('--gx',(x*100).toFixed(1)+'%');tt.style.setProperty('--gy',(y*100).toFixed(1)+'%')})});
    grid.addEventListener('pointerout',function(e){var t=e.target.closest&&e.target.closest('.gi-t');if(t&&!t.contains(e.relatedTarget)){t.style.setProperty('--rx','0deg');t.style.setProperty('--ry','0deg')}});
  }
  var chips=$('#socChips');
  if(chips)chips.addEventListener('click',function(e){
    var b=e.target.closest('.sc');if(!b)return;
    curCat=b.getAttribute('data-c');$$('.sc',chips).forEach(function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-selected',on?'true':'false')});
    var k=0;gis.forEach(function(d){var show=curCat==='all'||d.getAttribute('data-c')===curCat;d.classList.toggle('hide',!show);if(show){d.classList.add('in');d.classList.remove('pulse');void d.offsetWidth;d.style.animationDelay=(k++*35)+'ms';d.classList.add('pulse')}});
  });
}

/* ---------- stage: lift the mockup to the front, neighbours fan out behind ---------- */
var stg=$('#stg'),stgCf=$('#stgCf'),stageOn=false,stage=null,stageList=null,lastOrigin=null;
function stW(p,W,Hh){
  var t=typeOf(p),a=aspOf(t,p),mob=innerWidth<700;
  var wMax=mob?W*.74:Math.min(W*.3,450),w=Math.min(wMax,(Hh*(mob?.7:.74))/a);
  return Math.round(Math.max(mob?170:220,w));
}
function setCap(p,i,n){$('#stgBrand').textContent=p.b;$('#stgCat').textContent=CAT[p.c];$('#stgNum').textContent=(i+1)+' / '+n}
function openStage(i,list,origin){
  if(!stg||stageOn||stageBusy)return;
  if(window.dbPetOpen&&origin&&!reduce){stageBusy=true;window.dbPetOpen(origin,function(){stageBusy=false;openStage2(i,list,origin)});return}
  openStage2(i,list,origin);
}
var stageBusy=false;
function openStage2(i,list,origin){
  if(!stg||stageOn)return;
  list=list&&list.length?list:P;stageList=list;stageOn=true;lastOrigin=origin||null;
  var start=0;list.forEach(function(p,k){if(p.i===i)start=k});
  H.classList.add('stg-open');stg.classList.add('on');stg.setAttribute('aria-hidden','false');
  stage=Cover(stgCf,{list:list,start:start,w:stW,maxVis:function(W){return W<700?1:2},tight:.84,collapse:!reduce,step:50,
    mk:function(p){return mock(typeOf(p),p,{f:1,eager:1})},
    onChange:function(c,p){setCap(p,c,list.length);var d=stage.el(c),m=d&&$('.mk',d);if(m&&m.querySelector('.ig-heart')){setTimeout(function(){m.classList.remove('pop');void m.offsetWidth;m.classList.add('pop')},500)}},
    onActivate:function(){}});
  setCap(list[start],start,list.length);
  var c=stage.el(start);
  if(origin&&c&&!reduce&&c.animate){
    var r=origin.getBoundingClientRect(),cr=c.getBoundingClientRect(),fin=c.style.transform;
    if(r.width>10&&cr.width>10){
      var dx=(r.left+r.width/2)-(cr.left+cr.width/2),dy=(r.top+r.height/2)-(cr.top+cr.height/2),s=Math.max(.15,r.width/cr.width);
      c.animate([{transform:'translate(-50%,-50%) translate3d('+dx+'px,'+dy+'px,0) scale('+s+')'},{transform:fin}],{duration:760,easing:'cubic-bezier(.2,.8,.15,1)'});
    }
  }
  setTimeout(function(){var m=stage&&stage.el(start)&&$('.mk',stage.el(start));if(m&&m.querySelector('.ig-heart')){m.classList.add('pop')}},700);
  $('#stgX').focus({preventScroll:true});
}
function closeStage(){
  if(!stageOn)return;stageOn=false;
  var c=stage&&stage.el(stage.cur());
  if(c&&lastOrigin&&!reduce&&c.animate&&D.body.contains(lastOrigin)){
    var r=lastOrigin.getBoundingClientRect(),cr=c.getBoundingClientRect();
    if(r.width>10&&r.bottom>0&&r.top<innerHeight){
      var dx=(r.left+r.width/2)-(cr.left+cr.width/2),dy=(r.top+r.height/2)-(cr.top+cr.height/2),s=Math.max(.15,r.width/cr.width);
      c.style.transition='transform .55s cubic-bezier(.5,0,.2,1)';c.style.transform='translate(-50%,-50%) translate3d('+dx+'px,'+dy+'px,0) scale('+s+')';
    }
  }
  stg.classList.remove('on');stg.setAttribute('aria-hidden','true');H.classList.remove('stg-open');
  setTimeout(function(){if(!stageOn&&stage){stage.destroy();stage=null}},520);
}
if(stg){
  $('#stgX').addEventListener('click',closeStage);$('#stgBg').addEventListener('click',closeStage);
  $('#stgP').addEventListener('click',function(){stage&&stage.go(-1)});$('#stgN').addEventListener('click',function(){stage&&stage.go(1)});
  stgCf.addEventListener('click',function(e){if(e.target===stgCf)closeStage()});
  window.addEventListener('keydown',function(e){if(!stageOn)return;if(e.key==='Escape')closeStage();else if(e.key==='ArrowRight')stage.go(1);else if(e.key==='ArrowLeft')stage.go(-1)});
  var srt;window.addEventListener('resize',function(){clearTimeout(srt);srt=setTimeout(function(){if(stageOn&&stage)stage.resize()},150)});
}

/* ---------- pause off-screen animations ---------- */
if('IntersectionObserver' in window){
  var so=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('off',!e.isIntersecting)})},{rootMargin:'200px 0px'});
  $$('.gsec,.gph').forEach(function(s){so.observe(s)});
}
})();
