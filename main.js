/* Dr NIYO Water Solutions — interactions */
(function(){
'use strict';
var PHONE='918129368559';
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
function wa(msg){return 'https://wa.me/'+PHONE+'?text='+encodeURIComponent(msg)}

/* AOS scroll animations */
if(window.AOS)AOS.init({duration:reduce?0:800,easing:'ease-out-cubic',once:true,offset:80,disable:reduce});

/* WhatsApp links */
$$('[data-wa]').forEach(function(a){a.href=wa(a.dataset.wa);a.target='_blank';a.rel='noopener'});

/* nav: mobile menu, scrolled state, progress bar, back to top, active link */
var nav=$('#nav'),burger=$('#burger'),links=$('#links'),bar=$('#bar'),topBtn=$('#top-btn');
function menu(open){burger.setAttribute('aria-expanded',open);links.classList.toggle('open',open)}
burger.addEventListener('click',function(){menu(burger.getAttribute('aria-expanded')!=='true')});
links.addEventListener('click',function(e){if(e.target.tagName==='A')menu(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')menu(false)});
var secs=$$('section[id],header[id]'),navA=$$('.links a[href^="#"]');
function onScroll(){
  var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  nav.classList.toggle('scrolled',y>30);
  bar.style.width=(h>0?y/h*100:0)+'%';
  topBtn.classList.toggle('show',y>700);
  var cur='';secs.forEach(function(s){if(s.offsetTop-120<=y)cur=s.id});
  navA.forEach(function(a){a.classList.toggle('act',a.getAttribute('href')==='#'+cur)});
  rot();fill();
}
topBtn.addEventListener('click',function(){scrollTo({top:0,behavior:reduce?'auto':'smooth'})});

/* hero bubbles + brand droplets */
function bubbles(host,cls,n){if(reduce)return;for(var i=0;i<n;i++){var d=document.createElement('span');d.className=cls;
  d.style.cssText='--s:'+(6+Math.random()*18)+'px;--d:'+(8+Math.random()*12)+'s;--x:'+(Math.random()*100)+'%;animation-delay:-'+(Math.random()*12)+'s';host.appendChild(d)}}
bubbles($('.hero'),'bubble',14);bubbles($('#brand'),'drop',18);

/* water issues explainer */
var iN=$('#issueNote');
$$('#issues button').forEach(function(b){b.addEventListener('click',function(){
  var on=b.getAttribute('aria-pressed')==='true';
  $$('#issues button').forEach(function(o){o.setAttribute('aria-pressed','false')});
  if(on){iN.classList.remove('show');return}
  b.setAttribute('aria-pressed','true');iN.textContent=b.dataset.t;iN.classList.add('show')})});

/* 3D tilt on category cards */
$$('.tilt').forEach(function(c){
  if(fine&&!reduce){
    c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.transform='perspective(700px) rotateY('+x*12+'deg) rotateX('+-y*12+'deg) translateY(-6px)'});
    c.addEventListener('mouseleave',function(){c.style.transform=''});
  }
  c.addEventListener('click',function(){select(c.dataset.use);$('#finder').scrollIntoView({behavior:reduce?'auto':'smooth'})});
});

/* magnetic buttons */
if(fine&&!reduce)$$('.mag').forEach(function(b){
  b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+(e.clientX-r.left-r.width/2)*.18+'px,'+(e.clientY-r.top-r.height/2)*.28+'px)'});
  b.addEventListener('mouseleave',function(){b.style.transform=''})});

/* product: rotates with scroll and follows the pointer */
var cyl=$('#cyl'),stage=$('#stage'),ptr=0;
function rot(){var r=stage.getBoundingClientRect(),p=(innerHeight-r.top)/(innerHeight+r.height);
  cyl.style.setProperty('--ry',(p*540-120+ptr)+'deg')}
if(fine)stage.addEventListener('mousemove',function(e){var r=stage.getBoundingClientRect();
  ptr=((e.clientX-r.left)/r.width-.5)*70;cyl.style.setProperty('--rx',-((e.clientY-r.top)/r.height-.5)*18+'deg');rot()});
stage.addEventListener('mouseleave',function(){ptr=0;cyl.style.setProperty('--rx','0deg');rot()});

/* number counters */
function fmt(n){return n>=1000?n.toLocaleString('en-IN'):String(n)}
var co=new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting)return;co.unobserve(e.target);
  var el=e.target,end=+el.dataset.count,t0=null;
  if(reduce){el.textContent=fmt(end);return}
  (function f(t){t0=t0||t;var p=Math.min((t-t0)/1400,1);el.textContent=fmt(Math.round(end*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(f)})(performance.now());
})},{threshold:.6});
$$('[data-count]').forEach(function(el){co.observe(el)});

/* solution finder */
var qs=$$('#fd [data-q]'),res=$('#res'),prog=$('#prog'),rst=$('#fdReset'),ans={};
function setP(){prog.style.width=(Object.keys(ans).length/3*100)+'%'}
function pick(i,val){
  var q=qs[i];ans[q.dataset.q]=val;
  $$('button',q).forEach(function(o){o.setAttribute('aria-pressed',o.textContent===val)});
  qs.forEach(function(x,j){if(j>i){delete ans[x.dataset.q];$$('button',x).forEach(function(o){o.removeAttribute('aria-pressed')})}});
  res.hidden=true;
  qs.forEach(function(x,j){x.hidden=j>i+1});
  setP();rst.hidden=false;
  if(i===2)recommend();
}
function select(use){pick(0,use);qs[1].hidden=false}
function recommend(){
  var u=ans.use,n=ans.ppl,s=ans.src,t,k;
  if(u==='Home'){t='Residential RO Purifier';k=0}
  else if(u==='Industrial'||(n==='100+'&&u!=='Hostel')){t='Industrial RO System';k=3}
  else if(u==='Hostel'||n==='26–100'){t='Hostel RO + Storage System';k=2}
  else{t='Commercial RO + Storage System';k=1}
  var x=(s==='Borewell'||s==='Well')?' Borewell and well water often carry high TDS and sediments, so we add pre-filtration.':'';
  res.innerHTML='<p style="margin:0 0 6px">Recommended for you:</p><h3>'+t+'</h3><p>For '+u.toLowerCase()+' use, '+n+' people, '+s.toLowerCase()+' water.'+x+'</p><a class="btn" style="background:#061a33;color:#fff" target="_blank" rel="noopener" href="'+wa('Hi, I need a '+t+' ('+u+', '+n+' people, '+s+' water)')+'">Get my recommendation</a>';
  res.hidden=false;cmpSel(k,false);
}
qs.forEach(function(q,i){$$('button',q).forEach(function(b){b.addEventListener('click',function(){pick(i,b.textContent)})})});
rst.addEventListener('click',function(){ans={};qs.forEach(function(q,i){q.hidden=i>0;$$('button',q).forEach(function(o){o.removeAttribute('aria-pressed')})});res.hidden=true;rst.hidden=true;setP();cmpSel(-1)});

/* water test form -> WhatsApp */
var form=$('#wtForm');
form.addEventListener('submit',function(e){
  e.preventDefault();
  var n=$('#n').value.trim(),p=$('#p').value.replace(/[\s+\-]/g,'').replace(/^91(?=\d{10}$)/,''),l=$('#l').value,ok=/^[6-9]\d{9}$/.test(p);
  $('#p').classList.toggle('bad',!ok);$('#pErr').classList.toggle('show',!ok);
  if(!ok){$('#p').focus();return}
  open(wa('Hi, I’d like to book a free water test.\nName: '+(n||'-')+'\nPhone: '+p+'\nLocation: '+l),'_blank');
});

/* timeline: fills as you scroll */
var steps=$('#steps'),lis=$$('li',steps);
function fill(){var r=steps.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight*.65-r.top)/r.height));
  steps.style.setProperty('--fill',p*100+'%');
  lis.forEach(function(li,i){li.classList.toggle('on',p>=i/lis.length+.02)})}

/* comparison: tabs highlight rows */
var rows=$$('#cmp tr').slice(1),tabs=$$('#cmpTabs button'),cNote=$('#cmpNote');
var cInfo=['Compact systems sized for a family, best when daily use is modest.','Medium to high capacity for offices and shops with steady daily demand.','High capacity built for many users drinking at the same time.','Very high capacity systems for specialized, large-scale requirements.'];
$$('.bars').forEach(function(b){for(var i=0;i<5;i++){var s=document.createElement('i');if(i<+b.dataset.n)s.className='f';b.appendChild(s)}});
function cmpSel(k,scroll){
  rows.forEach(function(r,i){r.classList.toggle('hl',i===k)});
  tabs.forEach(function(t,i){t.setAttribute('aria-selected',i===k)});
  cNote.textContent=k>=0?cInfo[k]:'';cNote.classList.toggle('show',k>=0);
}
tabs.forEach(function(t,i){t.addEventListener('click',function(){cmpSel(i)})});
rows.forEach(function(r,i){r.style.cursor='pointer';r.addEventListener('click',function(){cmpSel(i)})});

/* reviews carousel */
var rv=$('#rv');
function slide(d){var c=$('.card',rv);rv.scrollBy({left:d*(c.offsetWidth+16),behavior:reduce?'auto':'smooth'})}
$('#rvPrev').addEventListener('click',function(){slide(-1)});$('#rvNext').addEventListener('click',function(){slide(1)});

/* service area checker */
var aN=$('#areaNote');
$$('#areas button').forEach(function(b){b.addEventListener('click',function(){
  $$('#areas button').forEach(function(o){o.setAttribute('aria-pressed',o===b)});
  var other=/Other/.test(b.textContent);
  aN.innerHTML=other?'Not on the list? Message us your location and we’ll confirm.':'<strong>'+b.textContent+'</strong> is one of our highlighted service areas. Book a free water test to get started.';
  aN.classList.add('show')})});

/* FAQ: one open at a time */
var fq=$$('.faq details');
fq.forEach(function(d){d.addEventListener('toggle',function(){if(d.open)fq.forEach(function(o){if(o!==d)o.open=false})})});

addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
})();
