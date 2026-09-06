
const PAGE_URLS={
  rules:'pages/rules.html',
  before:'pages/before-join.html',
  first:'pages/first-day.html',
  work:'pages/work-guide.html',
  hotel:'pages/hotel-guide.html',
  manual:'pages/manual.html',
  course:'pages/course-bag.html'
};
const lock=document.getElementById('lock'), portal=document.getElementById('portal');
const view=document.getElementById('view'), framewrap=document.getElementById('framewrap');
const topPage=document.getElementById('topPage'), bottomWrap=document.getElementById('bottomWrap');
let idleTimer=null,currentPage='top'; const IDLE_MS=60*60*1000;

function resetIdle(){
  if(!sessionStorage.getItem('lg-auth')) return;
  clearTimeout(idleTimer);
  sessionStorage.setItem('lg-last-activity',String(Date.now()));
  idleTimer=setTimeout(()=>logout(true),IDLE_MS);
}
function startIdle(){
  const last=Number(sessionStorage.getItem('lg-last-activity')||Date.now());
  const remain=IDLE_MS-(Date.now()-last);
  if(remain<=0) logout(true);
  else { clearTimeout(idleTimer); idleTimer=setTimeout(()=>logout(true),remain); }
}
function updateActive(page){
  const active=page==='course'?'first':page;
  document.querySelectorAll('.nav-btn,.bottom-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===active));
}
function showPage(page){
  currentPage=page; sessionStorage.setItem('lg-page',page); updateActive(page); window.scrollTo(0,0);
  if(page==='top'){
    topPage.classList.add('show'); framewrap.style.display='none'; bottomWrap.style.display='none'; return;
  }
  topPage.classList.remove('show'); framewrap.style.display='block'; bottomWrap.style.display='block';
  view.style.height='300px'; view.src=PAGE_URLS[page] || PAGE_URLS.rules; resetIdle();
}
function setAuth(on){
  if(on){sessionStorage.setItem('lg-auth','1');sessionStorage.setItem('lg-last-activity',String(Date.now()));}
  else {sessionStorage.removeItem('lg-auth');sessionStorage.removeItem('lg-last-activity');}
  lock.style.display=on?'none':'flex'; portal.classList.toggle('show',on); document.body.classList.toggle('locked',!on);
  if(on){showPage(sessionStorage.getItem('lg-page')||'top');startIdle();}
}
function logout(auto=false){
  clearTimeout(idleTimer); setAuth(false); document.getElementById('pw').value='';
  if(auto) document.getElementById('error').textContent='1時間操作がなかったためログアウトしました。';
}
document.getElementById('login').addEventListener('submit',e=>{
  e.preventDefault();
  if(document.getElementById('pw').value==='1206'){document.getElementById('error').textContent='';setAuth(true);}
  else document.getElementById('error').textContent='パスワードが違います。';
});
document.getElementById('lockout').addEventListener('click',()=>logout(false));
document.querySelectorAll('[data-page]').forEach(b=>{if(b.id!=='lockout')b.addEventListener('click',()=>showPage(b.dataset.page));});
addEventListener('message',e=>{
  const d=e.data||{};
  if(d.type==='lg-height' && Number.isFinite(d.height)) view.style.height=Math.max(80,d.height)+'px';
});
['pointerdown','keydown','touchstart','scroll'].forEach(ev=>document.addEventListener(ev,resetIdle,{passive:true}));
setAuth(sessionStorage.getItem('lg-auth')==='1');
