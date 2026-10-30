/* Logo folio: brand board - reveal, filter, spotlight, copy HEX */
(function(){
var g=document.getElementById('lgGrid');if(!g)return;
var cards=[].slice.call(g.querySelectorAll('.lgc'));
var btns=[].slice.call(document.querySelectorAll('[data-lff]'));
var hov=false,vis=false,spotI=-1;
if('IntersectionObserver' in window){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -4% 0px'});
 cards.forEach(function(c){io.observe(c)});
 new IntersectionObserver(function(es){vis=es[0].isIntersecting},{threshold:.15}).observe(g);
}else{cards.forEach(function(c){c.classList.add('in')});vis=true}
function lum(h){var r=parseInt(h.substr(1,2),16),gg=parseInt(h.substr(3,2),16),b=parseInt(h.substr(5,2),16);return(.299*r+.587*gg+.114*b)/255}
g.addEventListener('click',function(e){
 var li=e.target.closest('.lgc-pal li');if(!li)return;
 var hex=li.getAttribute('data-hex');try{navigator.clipboard&&navigator.clipboard.writeText(hex)}catch(x){}
 li.classList.remove('cp');void li.offsetWidth;li.classList.add('cp');clearTimeout(li._c);li._c=setTimeout(function(){li.classList.remove('cp')},1200);
});
g.addEventListener('mouseenter',function(){hov=true;clearSpot()});g.addEventListener('mouseleave',function(){hov=false});
function clearSpot(){cards.forEach(function(c){c.classList.remove('spot')})}
function filt(f){
 btns.forEach(function(b){b.classList.toggle('on',+b.getAttribute('data-lff')===f)});
 clearSpot();
 var show=[],hide=[];
 cards.forEach(function(c){var ok=f<0||+c.getAttribute('data-g')===f;(ok?show:hide).push(c)});
 hide.forEach(function(c){c.classList.add('off')});
 setTimeout(function(){
  hide.forEach(function(c){c.hidden=true});
  show.forEach(function(c,i){c.hidden=false;c.classList.add('in');c.style.setProperty('--i',i);c.classList.add('off')});
  void g.offsetWidth;
  show.forEach(function(c){c.classList.remove('off')});
 },300);
}
btns.forEach(function(b){b.addEventListener('click',function(){filt(+b.getAttribute('data-lff'))})});
setInterval(function(){
 if(!vis||hov||document.hidden)return;
 var list=cards.filter(function(c){return !c.hidden&&c.classList.contains('in')&&!c.classList.contains('lgc-cta')});if(!list.length)return;
 clearSpot();spotI=(spotI+1)%list.length;list[spotI].classList.add('spot');
},2600);
})();
