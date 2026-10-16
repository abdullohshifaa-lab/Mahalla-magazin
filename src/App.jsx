import {useState,useEffect,useRef,useMemo} from 'react'

const INFO={name:'Mahalla Market',addr:"Toshkent sh., Chilonzor tumani, Bunyodkor ko'chasi 12-uy",tel:['+998 90 123 45 67','+998 71 200 11 22'],hours:[['Dushanba – Shanba','07:00 – 23:00'],['Yakshanba','08:00 – 22:00']]}
const CATS=['Mevalar','Sabzavotlar','Sut mahsulotlari','Non va un','Ichimliklar','Shirinliklar','Boshqa']
const UNITS=['kg','dona','litr','pachka']
const LOW=5
const HERO='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=80'
const SEED=[
['Qizil olma','Mevalar',14000,40,'kg','🍎',1],['Pomidor','Sabzavotlar',12000,3,'kg','🍅',1],['Sut 1 litr','Sut mahsulotlari',11000,24,'dona','🥛',1],
['Non (patir)','Non va un',5000,30,'dona','🥖',1],['Banan','Mevalar',22000,0,'kg','🍌',0],['Shokolad','Shirinliklar',16000,18,'dona','🍫',0],
['Sharbat 1 litr','Ichimliklar',13000,4,'dona','🧃',0],['Sabzi','Sabzavotlar',7000,35,'kg','🥕',0]
].map(([name,cat,price,qty,unit,emoji,daily],i)=>({id:'s'+i,name,cat,price,qty,unit,emoji,daily:!!daily,img:''}))

const fmt=n=>new Intl.NumberFormat('ru-RU').format(Math.round(n||0))+" so'm"
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6)
const today=()=>new Date().toISOString().slice(0,10)
function useLS(k,d){
  const[v,s]=useState(()=>{try{const x=localStorage.getItem(k);return x?JSON.parse(x):d}catch{return d}})
  useEffect(()=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}},[k,v])
  return[v,s]
}

function Rv({children,className='',d=0}){
  const r=useRef()
  useEffect(()=>{const el=r.current;const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('in');o.disconnect()}},{threshold:.12});o.observe(el);return()=>o.disconnect()},[])
  return <div ref={r} style={{transitionDelay:d+'ms'}} className={'rv '+className}>{children}</div>
}
function Tilt({children,className=''}){
  const r=useRef()
  const mv=e=>{const b=r.current.getBoundingClientRect();const x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5
    r.current.style.transform=`perspective(800px) rotateY(${x*14}deg) rotateX(${-y*14}deg) translateZ(10px)`}
  return <div ref={r} onPointerMove={mv} onPointerLeave={()=>r.current.style.transform=''} className={'transition-transform duration-200 will-change-transform '+className}>{children}</div>
}
function Modal({title,onClose,children}){
  useEffect(()=>{const k=e=>e.key==='Escape'&&onClose();addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[onClose])
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-g/60 p-3 backdrop-blur-sm sm:items-center" onClick={onClose}>
    <div className="pop max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-cream p-6 shadow-2xl" onClick={e=>e.stopPropagation()}>
      <div className="mb-4 flex items-center justify-between"><h3 className="font-display text-2xl font-extrabold">{title}</h3>
        <button onClick={onClose} className="text-2xl leading-none" aria-label="Yopish">×</button></div>{children}</div></div>
}
const F=({l,children})=><label className="mb-3 block text-sm font-semibold">{l}<div className="mt-1 font-normal">{children}</div></label>

function Hero({seller}){
  useEffect(()=>{
    let t=0
    const f=()=>{t=0;const y=scrollY;if(y>1600)return
      document.querySelectorAll('[data-sp]').forEach(e=>e.style.transform=`translate3d(0,${y*e.dataset.sp}px,0) scale(${1+y*(e.dataset.z||0)})`)}
    const h=()=>{t=t||requestAnimationFrame(f)}
    addEventListener('scroll',h,{passive:true});return()=>removeEventListener('scroll',h)
  },[])
  return <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-g">
    <div data-sp=".35" data-z=".0009" className="absolute inset-0 will-change-transform">
      <img src={HERO} alt="" onError={e=>e.target.remove()} className="h-full w-full object-cover opacity-60"/></div>
    <div className="absolute inset-0 bg-gradient-to-b from-g/50 via-g/30 to-g"/>
    {[['🍎','left-[8%] top-[22%] text-6xl','.55'],['🥕','right-[10%] top-[30%] text-7xl','-.1'],['🥛','left-[22%] bottom-[18%] text-5xl','.25'],['🍅','right-[24%] bottom-[22%] text-6xl','.7']].map(([e,c,s],i)=>
      <div key={i} data-sp={s} className={'absolute will-change-transform '+c}><span className="fl inline-block drop-shadow-2xl" style={{animationDelay:i*.8+'s'}}>{e}</span></div>)}
    <div data-sp=".15" className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-5 text-center text-cream">
      <p className="mb-3 rounded-full border border-cream/30 px-4 py-1 text-sm">Mahallangizdagi ishonchli do'kon</p>
      <h1 className="font-display text-5xl font-extrabold leading-tight sm:text-7xl">Har kuni yangi,<br/>har kuni arzon</h1>
      <p className="mt-5 max-w-xl text-lg text-cream/80">Meva, sabzavot, sut va non — hovlingiz yonida, ko'rib va narxini bilib oling.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href="#/mahsulotlar" className="rounded-full bg-gold px-6 py-3 font-bold text-g transition hover:-translate-y-1 hover:shadow-2xl">Katalogni ko'rish</a>
        <a href="#/haqida" className="rounded-full border border-cream/40 px-6 py-3 font-semibold transition hover:bg-cream hover:text-g">Manzil va ish vaqti</a></div>
      {seller&&<p className="mt-6 text-sm text-gold">Sotuvchi paneli pastda ↓</p>}
    </div></section>
}

function Dashboard({products,debts}){
  const rem=d=>d.amount-d.paid
  const low=products.filter(p=>p.qty<=LOW)
  const toMe=debts.filter(d=>d.type!=='olingan').reduce((a,d)=>a+rem(d),0)
  const iOwe=debts.filter(d=>d.type==='olingan').reduce((a,d)=>a+rem(d),0)
  const debtors=useMemo(()=>{const m={};debts.filter(d=>d.type!=='olingan'&&rem(d)>0).forEach(d=>m[d.name]=(m[d.name]||0)+rem(d));return Object.entries(m).sort((a,b)=>b[1]-a[1])},[debts])
  const stats=[['Jami mahsulot',products.length,''],['Tugayotgan',low.length,low.length?'text-red-700':''],['Menga qaytishi kerak',fmt(toMe),''],['Men qarzdorman',fmt(iOwe),'']]
  return <section className="mx-auto max-w-6xl px-4 py-16">
    <Rv><h2 className="mb-6 font-display text-3xl font-extrabold">Sotuvchi paneli</h2></Rv>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{stats.map(([l,v,c],i)=><Rv key={l} d={i*80}><Tilt className="card h-full"><p className="text-sm opacity-70">{l}</p><p className={'mt-2 font-display text-2xl font-extrabold '+c}>{v}</p></Tilt></Rv>)}</div>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <Rv><div className="card"><h3 className="mb-3 font-bold">⚠️ Tugayotgan mahsulotlar</h3>
        {low.length?low.map(p=><div key={p.id} className="flex justify-between border-b border-g/10 py-1.5"><span>{p.emoji} {p.name}</span><b className={p.qty?'text-amber-700':'text-red-700'}>{p.qty?p.qty+' '+p.unit:'tugagan'}</b></div>):<p className="opacity-60">Hammasi yetarli.</p>}</div></Rv>
      <Rv d={100}><div className="card"><h3 className="mb-3 font-bold">Kim qancha qarzdor</h3>
        {debtors.length?debtors.map(([n,s])=><div key={n} className="flex justify-between border-b border-g/10 py-1.5"><span>{n}</span><b>{fmt(s)}</b></div>):<p className="opacity-60">Qarzdorlar yo'q.</p>}</div></Rv></div>
  </section>
}

function ProductForm({init,onSave,onClose}){
  const[f,setF]=useState(init||{name:'',cat:CATS[0],price:'',qty:'',unit:'kg',emoji:'🛒',img:'',daily:false})
  const set=(k,v)=>setF(o=>({...o,[k]:v}))
  const go=()=>{
    if(!f.name.trim())return alert('Mahsulot nomini kiriting')
    if(f.price===''||+f.price<0||f.qty===''||+f.qty<0)return alert("Narx va miqdorni to'g'ri kiriting")
    onSave({...f,name:f.name.trim(),price:+f.price,qty:+f.qty,id:f.id||uid()})}
  return <Modal title={init?'Mahsulotni tahrirlash':"Yangi mahsulot"} onClose={onClose}>
    <F l="Nomi"><input className="inp" value={f.name} onChange={e=>set('name',e.target.value)}/></F>
    <div className="grid grid-cols-2 gap-3">
      <F l="Kategoriya"><select className="inp" value={f.cat} onChange={e=>set('cat',e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select></F>
      <F l="Birlik"><select className="inp" value={f.unit} onChange={e=>set('unit',e.target.value)}>{UNITS.map(c=><option key={c}>{c}</option>)}</select></F>
      <F l="Narxi (so'm)"><input type="number" min="0" className="inp" value={f.price} onChange={e=>set('price',e.target.value)}/></F>
      <F l="Qolgan miqdor"><input type="number" min="0" step="any" className="inp" value={f.qty} onChange={e=>set('qty',e.target.value)}/></F></div>
    <F l="Emoji"><input className="inp" value={f.emoji} onChange={e=>set('emoji',e.target.value)}/></F>
    <F l="Rasm havolasi (ixtiyoriy)"><input className="inp" placeholder="https://..." value={f.img} onChange={e=>set('img',e.target.value)}/></F>
    <label className="mb-4 flex items-center gap-2 font-semibold"><input type="checkbox" checked={f.daily} onChange={e=>set('daily',e.target.checked)}/>Kunlik mahsulot (bosh sahifada)</label>
    <button className="btn w-full" onClick={go}>Saqlash</button></Modal>
}

function PCard({p,seller,onEdit,onDel,onQty}){
  const st=p.qty<=0?['Tugagan','bg-red-100 text-red-800']:p.qty<=LOW?['Tugayapti','bg-amber-100 text-amber-800']:['Mavjud','bg-green-100 text-green-800']
  return <Tilt className="card overflow-hidden !p-0">
    <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-g2 to-g text-6xl">
      {p.img?<img src={p.img} alt={p.name} loading="lazy" onError={e=>e.target.remove()} className="absolute inset-0 h-full w-full object-cover"/>:null}
      <span className="fl drop-shadow-xl">{p.emoji}</span>
      <span className={'absolute right-3 top-3 rounded-full px-3 py-0.5 text-xs font-bold '+st[1]}>{st[0]}</span></div>
    <div className="p-4"><p className="text-xs opacity-60">{p.cat}</p><h3 className="font-display text-xl font-extrabold">{p.name}</h3>
      <p className="mt-1 text-lg font-bold">{fmt(p.price)} <span className="text-sm font-normal opacity-60">/ {p.unit}</span></p>
      <p className="text-sm">Qoldi: <b>{p.qty} {p.unit}</b></p>
      {seller&&<div className="mt-3 flex flex-wrap items-center gap-2">
        <button className="btn2 !px-3 !py-1" onClick={()=>onQty(p.id,-1)} aria-label="Kamaytirish">−</button>
        <button className="btn2 !px-3 !py-1" onClick={()=>onQty(p.id,1)} aria-label="Ko'paytirish">+</button>
        <button className="btn2 !py-1" onClick={()=>onEdit(p)}>Tahrir</button>
        <button className="btn2 !py-1 !text-red-700" onClick={()=>onDel(p)}>O'chirish</button></div>}
    </div></Tilt>
}

function Products({products,setProducts,seller}){
  const[q,setQ]=useState('');const[cat,setCat]=useState('Hammasi');const[ed,setEd]=useState(null)
  const list=products.filter(p=>(cat==='Hammasi'||p.cat===cat)&&p.name.toLowerCase().includes(q.trim().toLowerCase()))
  const save=p=>{setProducts(a=>a.some(x=>x.id===p.id)?a.map(x=>x.id===p.id?p:x):[p,...a]);setEd(null)}
  const del=p=>confirm(`"${p.name}" o'chirilsinmi?`)&&setProducts(a=>a.filter(x=>x.id!==p.id))
  const qty=(id,d)=>setProducts(a=>a.map(x=>x.id===id?{...x,qty:Math.max(0,+(x.qty+d).toFixed(2))}:x))
  return <section className="mx-auto max-w-6xl px-4 pb-16 pt-28">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="font-display text-4xl font-extrabold">Mahsulotlar</h1>
      <p className="opacity-70">{seller?"Qo'shing, tahrirlang, qoldiqni yangilang.":"Narxlar va mavjudlikni ko'ring."}</p></div>
      {seller&&<button className="btn" onClick={()=>setEd({})}>+ Mahsulot qo'shish</button>}</div>
    <input className="inp mb-3" placeholder="🔍 Mahsulot qidirish..." value={q} onChange={e=>setQ(e.target.value)}/>
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">{['Hammasi',...CATS].map(c=><button key={c} onClick={()=>setCat(c)} className={'whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition '+(cat===c?'bg-g text-cream':'bg-white/60 hover:bg-cream2')}>{c}</button>)}</div>
    {list.length?<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{list.map(p=><Rv key={p.id}><PCard p={p} seller={seller} onEdit={setEd} onDel={del} onQty={qty}/></Rv>)}</div>
      :<p className="card text-center">Hech narsa topilmadi. Qidiruv yoki kategoriyani o'zgartiring.</p>}
    {ed&&<ProductForm init={ed.id?ed:null} onSave={save} onClose={()=>setEd(null)}/>}
  </section>
}

const TYPES={olgan:'Qarzga mahsulot olganlar',berilgan:'Pul qarz berilganlar',olingan:'Men qarz olganlarim'}
function Debts({debts,setDebts}){
  const[tab,setTab]=useState('olgan');const[ed,setEd]=useState(null);const[pay,setPay]=useState(null);const[pv,setPv]=useState('')
  const rem=d=>d.amount-d.paid
  const list=debts.filter(d=>d.type===tab)
  const sum=t=>debts.filter(d=>d.type===t).reduce((a,d)=>a+rem(d),0)
  const save=()=>{
    if(!ed.name.trim()||!(+ed.amount>0))return alert("Ism va summani to'g'ri kiriting")
    const d={...ed,name:ed.name.trim(),amount:+ed.amount,paid:Math.min(+ed.paid||0,+ed.amount),id:ed.id||uid()}
    setDebts(a=>a.some(x=>x.id===d.id)?a.map(x=>x.id===d.id?d:x):[d,...a]);setEd(null)}
  const doPay=full=>{
    const v=full?rem(pay):+pv
    if(!(v>0))return alert("To'lov summasini kiriting")
    setDebts(a=>a.map(x=>x.id===pay.id?{...x,paid:Math.min(x.amount,x.paid+v)}:x));setPay(null);setPv('')}
  const status=d=>d.paid>=d.amount?["To'langan",'bg-green-100 text-green-800']:d.paid>0?['Qisman','bg-amber-100 text-amber-800']:["To'lanmagan",'bg-red-100 text-red-800']
  return <section className="mx-auto max-w-5xl px-4 pb-16 pt-28">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="font-display text-4xl font-extrabold">Qarzlar</h1>
      <button className="btn" onClick={()=>setEd({type:tab,name:'',amount:'',paid:0,date:today(),note:''})}>+ Qarz qo'shish</button></div>
    <div className="mb-5 grid gap-3 sm:grid-cols-3">{Object.entries(TYPES).map(([k,l])=><button key={k} onClick={()=>setTab(k)} className={'rounded-2xl p-4 text-left transition hover:-translate-y-1 '+(tab===k?'bg-g text-cream shadow-xl':'bg-white/60')}>
      <p className="text-sm opacity-80">{l}</p><p className="font-display text-xl font-extrabold">{fmt(sum(k))}</p></button>)}</div>
    <div className="space-y-3">{list.length?list.map(d=>{const s=status(d);return <Rv key={d.id}><div className="card">
      <div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="text-lg font-extrabold">{d.name}</h3><p className="text-sm opacity-60">{d.date}</p></div>
        <span className={'rounded-full px-3 py-1 text-xs font-bold '+s[1]}>{s[0]}</span></div>
      <p className="mt-2">Jami: <b>{fmt(d.amount)}</b> · To'langan: <b>{fmt(d.paid)}</b> · Qoldi: <b>{fmt(rem(d))}</b></p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-g/10"><div className="h-full bg-g2 transition-all duration-700" style={{width:Math.min(100,d.paid/d.amount*100)+'%'}}/></div>
      {d.note&&<p className="mt-2 text-sm italic opacity-70">{d.note}</p>}
      <div className="mt-3 flex flex-wrap gap-2">{rem(d)>0&&<button className="btn !py-1.5" onClick={()=>{setPay(d);setPv('')}}>To'lov</button>}
        <button className="btn2 !py-1.5" onClick={()=>setEd(d)}>Tahrir</button>
        <button className="btn2 !py-1.5 !text-red-700" onClick={()=>confirm(`${d.name} qarzi o'chirilsinmi?`)&&setDebts(a=>a.filter(x=>x.id!==d.id))}>O'chirish</button></div></div></Rv>}):<p className="card text-center">Bu ro'yxat bo'sh. "Qarz qo'shish" tugmasini bosing.</p>}</div>
    {ed&&<Modal title={ed.id?'Qarzni tahrirlash':"Yangi qarz"} onClose={()=>setEd(null)}>
      <F l="Turi"><select className="inp" value={ed.type} onChange={e=>setEd({...ed,type:e.target.value})}>{Object.entries(TYPES).map(([k,l])=><option key={k} value={k}>{l}</option>)}</select></F>
      <F l="Ism"><input className="inp" value={ed.name} onChange={e=>setEd({...ed,name:e.target.value})}/></F>
      <div className="grid grid-cols-2 gap-3"><F l="Summa (so'm)"><input type="number" min="0" className="inp" value={ed.amount} onChange={e=>setEd({...ed,amount:e.target.value})}/></F>
        <F l="Sana"><input type="date" className="inp" value={ed.date} onChange={e=>setEd({...ed,date:e.target.value})}/></F></div>
      <F l="Izoh"><textarea className="inp" rows="2" value={ed.note} onChange={e=>setEd({...ed,note:e.target.value})}/></F>
      <button className="btn w-full" onClick={save}>Saqlash</button></Modal>}
    {pay&&<Modal title={`${pay.name}: to'lov`} onClose={()=>setPay(null)}>
      <p className="mb-3">Qolgan qarz: <b>{fmt(rem(pay))}</b></p>
      <F l="To'lanayotgan summa"><input type="number" min="0" className="inp" value={pv} onChange={e=>setPv(e.target.value)}/></F>
      <div className="flex gap-2"><button className="btn flex-1" onClick={()=>doPay(false)}>Qisman to'lash</button><button className="btn2 flex-1" onClick={()=>doPay(true)}>To'liq to'landi</button></div></Modal>}
  </section>
}

function About(){
  return <section className="mx-auto max-w-4xl px-4 pb-16 pt-28"><h1 className="mb-6 font-display text-4xl font-extrabold">Magazin haqida</h1>
    <div className="grid gap-5 md:grid-cols-3">
      <Rv><Tilt className="card h-full"><p className="text-3xl">📍</p><h3 className="font-bold">Manzil</h3><p className="mt-1">{INFO.addr}</p></Tilt></Rv>
      <Rv d={100}><Tilt className="card h-full"><p className="text-3xl">📞</p><h3 className="font-bold">Telefon</h3>{INFO.tel.map(t=><p key={t}><a className="underline" href={'tel:'+t.replace(/\s/g,'')}>{t}</a></p>)}</Tilt></Rv>
      <Rv d={200}><Tilt className="card h-full"><p className="text-3xl">🕒</p><h3 className="font-bold">Ish vaqti</h3>{INFO.hours.map(([a,b])=><p key={a}>{a}: <b>{b}</b></p>)}</Tilt></Rv></div>
    <Rv><p className="card mt-6">{INFO.name} — mahalla odamlari uchun yangi va sifatli mahsulotlarni halol narxda sotadigan oilaviy do'kon.</p></Rv></section>
}

function Home({products,debts,seller}){
  const daily=products.filter(p=>p.daily)
  return <>
    <Hero seller={seller}/>
    {seller&&<Dashboard products={products} debts={debts}/>}
    <section className="mx-auto max-w-6xl px-4 py-16">
      <Rv><h2 className="font-display text-3xl font-extrabold">Magazin haqida</h2><p className="mt-2 max-w-2xl opacity-80">Biz har kuni ertalab yangi mahsulot olib kelamiz. Narxlar ochiq, qarz daftari esa halol yuritiladi.</p></Rv>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">{[['🌿','Yangi mahsulot','Har kuni ertalab keltiriladi'],['💸','Hamyonbop narx','Bozor narxidan qimmat emas'],['🤝','Ishonch','Mahalladoshlarga qulay shartlar']].map(([e,t,s],i)=>
        <Rv key={t} d={i*100}><Tilt className="card h-full"><p className="text-4xl">{e}</p><h3 className="mt-2 font-bold">{t}</h3><p className="text-sm opacity-70">{s}</p></Tilt></Rv>)}</div></section>
    <section className="bg-g py-16 text-cream"><div className="mx-auto max-w-6xl px-4">
      <Rv><h2 className="font-display text-3xl font-extrabold">Kunlik mahsulotlar</h2></Rv>
      {daily.length?<div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{daily.map(p=><Rv key={p.id}><Tilt className="rounded-3xl bg-cream p-5 text-g shadow-2xl"><p className="fl text-center text-6xl">{p.emoji}</p><h3 className="mt-3 font-display text-xl font-extrabold">{p.name}</h3><p className="font-bold">{fmt(p.price)} / {p.unit}</p><p className="text-sm opacity-70">{p.qty>0?`Qoldi: ${p.qty} ${p.unit}`:'Hozircha tugagan'}</p></Tilt></Rv>)}</div>
        :<p className="mt-4 opacity-70">Hozircha kunlik mahsulot belgilanmagan.</p>}
      <a href="#/mahsulotlar" className="mt-8 inline-block rounded-full bg-gold px-6 py-3 font-bold text-g">Hamma mahsulotlar</a></div></section>
  </>
}

export default function App(){
  const[products,setProducts]=useLS('mm_products',SEED)
  const[debts,setDebts]=useLS('mm_debts',[])
  const[seller,setSeller]=useState(()=>sessionStorage.getItem('mm_seller')==='1')
  const[login,setLogin]=useState(false);const[pin,setPin]=useState('')
  const[hash,setHash]=useState(location.hash||'#/')
  useEffect(()=>{const h=()=>{setHash(location.hash||'#/');scrollTo(0,0)};addEventListener('hashchange',h);return()=>removeEventListener('hashchange',h)},[])
  const page=hash.replace('#/','')
  const realPin=()=>localStorage.getItem('mm_pin')||'1234'
  const doLogin=()=>{if(pin===realPin()){sessionStorage.setItem('mm_seller','1');setSeller(true);setLogin(false);setPin('')}else alert("PIN noto'g'ri")}
  const logout=()=>{sessionStorage.removeItem('mm_seller');setSeller(false);if(page==='qarzlar')location.hash='#/'}
  const changePin=()=>{const n=prompt("Yangi PIN (kamida 4 belgi):");if(n&&n.length>=4){localStorage.setItem('mm_pin',n);alert('PIN yangilandi')}else if(n)alert('PIN juda qisqa')}
  const links=[['','Bosh sahifa'],['mahsulotlar','Mahsulotlar'],...(seller?[['qarzlar','Qarzlar']]:[]),['haqida','Magazin haqida']]
  return <div className="min-h-screen">
    <header className="fixed inset-x-0 top-0 z-40 border-b border-cream/10 bg-g/90 text-cream backdrop-blur"><div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
      <a href="#/" className="font-display text-xl font-extrabold">🥬 {INFO.name}</a>
      <nav className="ml-auto flex gap-1 overflow-x-auto text-sm font-semibold">{links.map(([h,l])=><a key={h} href={'#/'+h} className={'whitespace-nowrap rounded-full px-3 py-1.5 transition '+(page===h?'bg-cream text-g':'hover:bg-cream/15')}>{l}</a>)}</nav>
      {seller?<div className="flex gap-1"><button onClick={changePin} className="hidden text-xs underline sm:block">PIN</button><button onClick={logout} className="whitespace-nowrap rounded-full border border-gold px-3 py-1 text-sm text-gold">Chiqish</button></div>
        :<button onClick={()=>setLogin(true)} className="whitespace-nowrap rounded-full bg-gold px-3 py-1.5 text-sm font-bold text-g">Sotuvchi</button>}</div></header>
    <main>
      {page===''&&<Home products={products} debts={debts} seller={seller}/>}
      {page==='mahsulotlar'&&<Products products={products} setProducts={setProducts} seller={seller}/>}
      {page==='qarzlar'&&(seller?<Debts debts={debts} setDebts={setDebts}/>:<section className="mx-auto max-w-md px-4 pt-32"><div className="card text-center"><p className="text-4xl">🔒</p><p className="my-3">Bu sahifa faqat sotuvchi uchun.</p><button className="btn" onClick={()=>setLogin(true)}>Sotuvchi sifatida kirish</button></div></section>)}
      {page==='haqida'&&<About/>}
      {!['','mahsulotlar','qarzlar','haqida'].includes(page)&&<section className="px-4 pt-32 text-center"><p>Sahifa topilmadi. <a className="underline" href="#/">Bosh sahifaga qaytish</a></p></section>}
    </main>
    <footer className="bg-g py-6 text-center text-sm text-cream/70">© {new Date().getFullYear()} {INFO.name}</footer>
    {login&&<Modal title="Sotuvchi kirishi" onClose={()=>setLogin(false)}>
      <F l="PIN-kod"><input type="password" autoFocus className="inp" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doLogin()}/></F>
      <p className="mb-3 text-xs opacity-60">Boshlang'ich PIN: 1234 (kirgach «PIN» tugmasi bilan o'zgartiring).</p>
      <button className="btn w-full" onClick={doLogin}>Kirish</button></Modal>}
  </div>
}
