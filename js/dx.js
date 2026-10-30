/* Device scene: cycles real website screens inside a modern laptop, app screens on the phone */
(function(){
'use strict';
var D=document,sc=D.querySelector('[data-dx]');if(!sc)return;
var $$=function(s,r){return[].slice.call((r||D).querySelectorAll(s))};
var rm=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var sl=$$('.dx-sl',sc),dots=$$('.dx-dots button',sc),ph=$$('.dx-ps img',sc),num=$$('.dx-sw',sc)[0],nm=$$('.dx-nt b',sc)[0],ur=$$('.dx-nt em',sc)[0];
var CY=6200,cur=0,t=null,vis=false;
sc.style.setProperty('--cy',(CY/1000)+'s');
function go(n){
  var prev=cur;cur=(n+sl.length)%sl.length;
  sl.forEach(function(s,k){
    if(k===cur){s.classList.remove('out');s.classList.add('on')}
    else if(k===prev&&prev!==cur){s.classList.remove('on');s.classList.add('out');(function(x){setTimeout(function(){if(!x.classList.contains('on'))x.classList.remove('out')},900)})(s)}
    else{s.classList.remove('on','out')}
  });
  var s=sl[cur];sc.style.setProperty('--ac',s.getAttribute('data-ac'));
  num.textContent=s.getAttribute('data-n');nm.textContent=s.getAttribute('data-name');ur.textContent=s.getAttribute('data-url');
  dots.forEach(function(d,k){d.classList.remove('on');if(k===cur){void d.offsetWidth;d.classList.add('on')}});
  ph.forEach(function(p,k){p.classList.toggle('on',k===cur%ph.length)});
  sc.classList.remove('cyc');void sc.offsetWidth;if(!rm)sc.classList.add('cyc');
}
function stop(){if(t){clearTimeout(t);t=null}}
function sched(){stop();if(rm||!vis)return;t=setTimeout(function(){if(!D.hidden)go(cur+1);sched()},CY)}
dots.forEach(function(d,k){d.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();go(k);sched()})});
if('IntersectionObserver' in window){
  new IntersectionObserver(function(es){var v=es[0].isIntersecting;if(v&&!vis){vis=true;go(cur);sched()}else if(!v){vis=false;stop()}},{threshold:.25}).observe(sc);
}else{vis=true;go(0);sched()}
if(!rm&&window.matchMedia('(hover:hover)').matches){
  var host=sc.parentNode;
  host.addEventListener('pointermove',function(e){var r=host.getBoundingClientRect();sc.style.setProperty('--px',((e.clientX-r.left)/r.width-.5).toFixed(3));sc.style.setProperty('--py',((e.clientY-r.top)/r.height-.5).toFixed(3))});
  host.addEventListener('pointerleave',function(){sc.style.setProperty('--px',0);sc.style.setProperty('--py',0)});
}
})();
