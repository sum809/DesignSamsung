const q = (s,c=document) => c.querySelector(s);
const qa = (s,c=document) => [...c.querySelectorAll(s)];

const header = q('[data-header]');
let lastY=0;addEventListener('scroll',()=>{
  const y=scrollY;
  header.classList.toggle('is-hidden',y>lastY&&y>120);lastY=y
});

const menuBtn = q('.menu-toggle'), mobileMenu = q('.mobile-menu');
menuBtn.addEventListener('click',()=>{
  const open=mobileMenu.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow=open?'hidden':''
});
qa('.mobile-menu a').forEach(
  a=>a.addEventListener('click',()=>{
  mobileMenu.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded','false');
  document.body.style.overflow=''
})
);

const searchPanel=q('.search-panel');
q('.search-open')?.addEventListener('click',()=>{
  searchPanel.classList.add('is-open');
  searchPanel.setAttribute('aria-hidden','false');
  q('#site-search').focus()});
  q('.search-close').addEventListener('click',closeSearch);
  function closeSearch(){
    searchPanel.classList.remove('is-open');
    searchPanel.setAttribute('aria-hidden','true')
  }
  addEventListener('keydown',e=>{
    if(e.key==='Escape')closeSearch()
    });
  q('.search-form').addEventListener('submit',e=>{
    e.preventDefault();closeSearch()
  });

const slides = qa('.hero-slide'), progress=q('.hero-progress i');
let heroIndex = 0,heroTimer;
function showHero(i){
  heroIndex = (i+slides.length)%slides.length;
  slides.forEach((s,n)=>s.classList.toggle('is-active',n===heroIndex));
  progress.style.transform=`translateX(${heroIndex*100}%)`
}

function autoHero(){
  clearInterval(heroTimer);
  heroTimer=setInterval(()=>showHero(heroIndex+1), 5200)
}

q ('.hero-prev').addEventListener('click',()=>{
  showHero(heroIndex-1);autoHero()
});
q ('.hero-next').addEventListener('click',()=>{
  showHero(heroIndex+1);autoHero()
});
q ('.hero').addEventListener('mouseenter',()=>clearInterval(heroTimer));
q ('.hero').addEventListener('mouseleave',autoHero); autoHero();

const revealObserver = new IntersectionObserver(entries => entries.forEach(e=>{
  if(e.isIntersecting){
    e.target.classList.add('is-visible');
    revealObserver.unobserve(e.target)
  }
}), {threshold:.14});
qa('.reveal').forEach(el=>revealObserver.observe(el));

const newsTrack = q('.news-track'),
newsItems=qa('.news-track article'),
newsBar=q('.news-controls i');

let newsIndex = 0;
function visibleNews(){
  return innerWidth <= 640?1:innerWidth<=1023?2:3
}
function moveNews(dir){
  const max=Math.max(0,newsItems.length-visibleNews());
  newsIndex=Math.min(max,Math.max(0,newsIndex+dir));
  const gap=22;
  const itemWidth=newsItems[0].getBoundingClientRect().width;
  newsTrack.style.transform=`translateX(-${newsIndex*(itemWidth+gap)}px)`;
  newsBar.style.transform=`translateX(${max?newsIndex/max*200:0}%)`
}
q('.news-prev').addEventListener('click',()=>moveNews(-1));
q('.news-next').addEventListener('click',()=>moveNews(1));
addEventListener('resize',()=>{newsIndex=0;moveNews(0)});
