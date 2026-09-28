import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3, Bolt, BookOpen, Castle, ChevronDown, CircleUserRound, Coins,
  Crown, DoorOpen, Flag, Gamepad2, Gauge, Home, Medal, Menu, Play,
  Plus, ScrollText, Shield, Sparkles, Star, Swords, Trophy, Users, X,
} from 'lucide-react'

type GameMode = {
  title: string
  description: string
  tags: string[]
  players: string
  level: 2 | 3 | 4
  icon: typeof Flag
  image: number
}

const games: GameMode[] = [
  { title: 'Захват флага', description: 'Отвечайте правильно, собирайте ресурсы и захватывайте территорию противника.', tags: ['Командная', 'Стратегия', 'Вопросы'], players: '2–8 игроков', level: 3, icon: Flag, image: 0 },
  { title: 'Битва команд', description: 'Правильные ответы дают вашей команде преимущество в магической дуэли.', tags: ['Командная', 'Экшен', 'Вопросы'], players: '2–8 игроков', level: 2, icon: Swords, image: 1 },
  { title: 'Защита базы', description: 'Создайте защиту своей базы, отвечая на вопросы быстрее соперников.', tags: ['Стратегия', 'Командная', 'Вопросы'], players: '2–6 игроков', level: 3, icon: Castle, image: 2 },
  { title: 'Гонка знаний', description: 'Чем больше правильных ответов — тем быстрее движется ваш персонаж.', tags: ['Соло', 'Гонка', 'Вопросы'], players: '1–4 игрока', level: 2, icon: Gauge, image: 3 },
  { title: 'Подземелье', description: 'Исследуйте подземелье и находите сокровища за верные ответы.', tags: ['Соло', 'Приключение', 'Вопросы'], players: '1–4 игрока', level: 3, icon: DoorOpen, image: 4 },
  { title: 'Выживание', description: 'Собирайте энергию и оставайтесь последней командой на арене.', tags: ['Командная', 'Выживание', 'Вопросы'], players: '2–8 игроков', level: 4, icon: Bolt, image: 5 },
]

const players = [
  ['DarkKnight', '28', '2 450', '🧛'], ['Phoenix', '27', '2 310', '🧑🏻'],
  ['SkillMaster', '25', '2 120', '🧑🏼'], ['BrainStorm', '24', '1 980', '🧙'], ['Zhan', '22', '1 750', '🥷'],
]

const navItems = [
  ['Главная', Home], ['Игры', Gamepad2], ['Комнаты', Users], ['Задания', ScrollText], ['Рейтинг', BarChart3],
] as const

function Logo() {
  return <a href="#top" className="flex items-center gap-2.5" aria-label="KNOWPLAY — главная">
    <Gamepad2 className="h-10 w-10 -rotate-6 text-cyan-300 drop-shadow-[0_0_10px_#00cfff]" strokeWidth={3} />
    <span className="font-display text-2xl tracking-[.12em] text-white text-shadow-pixel">KNOW<span className="text-amber-300">PLAY</span></span>
  </a>
}

function Topbar({active, setActive}:{active:string;setActive:(s:string)=>void}) {
  const [open, setOpen] = useState(false)
  return <header className="sticky top-0 z-40 h-16 border-b-2 border-sky-700 bg-[#031024]/95 shadow-[0_5px_22px_#0008] backdrop-blur">
    <div className="mx-auto grid h-full max-w-[1540px] grid-cols-[260px_1fr_auto] items-center px-4 max-[880px]:grid-cols-[1fr_auto]">
      <Logo />
      <nav className="flex h-full justify-center max-[880px]:fixed max-[880px]:inset-x-0 max-[880px]:bottom-0 max-[880px]:z-50 max-[880px]:h-16 max-[880px]:border-t-2 max-[880px]:border-sky-700 max-[880px]:bg-[#04142d]" aria-label="Основная навигация">
        {navItems.map(([label, Icon]) => <a key={label} href={label==='Главная'?'#top':label==='Игры'?'#games':label==='Рейтинг'?'#rating':'#games'} onClick={()=>setActive(label)} className={`group flex min-w-24 items-center justify-center gap-2 border-b-4 px-3 text-sm font-bold transition hover:bg-sky-400/5 hover:text-cyan-300 max-[1060px]:min-w-16 max-[1060px]:px-2 max-[880px]:min-w-0 max-[880px]:flex-1 max-[880px]:flex-col max-[880px]:gap-0.5 max-[880px]:border-b-0 max-[880px]:border-t-4 max-[880px]:text-[10px] ${active===label?'border-cyan-400 text-cyan-300':'border-transparent text-blue-200/80'}`}>
          <Icon className="h-5 w-5" /> <span className="max-[1060px]:hidden max-[880px]:block">{label}</span>
        </a>)}
      </nav>
      <div className="flex h-full items-center">
        <div className="flex h-full items-center gap-2 border-l border-sky-900 px-4 font-black max-[1120px]:hidden"><Bolt className="h-5 text-cyan-300" fill="currentColor"/>85</div>
        <div className="flex h-full items-center gap-2 border-l border-sky-900 px-4 font-black max-[1120px]:hidden"><Coins className="h-5 text-amber-300"/>320</div>
        <button onClick={()=>setOpen(v=>!v)} className="ml-1 flex h-[52px] items-center gap-2 rounded border border-sky-800 bg-[#081b3a] p-1.5 pr-3 transition hover:border-cyan-500" aria-expanded={open}>
          <span className="grid h-10 w-10 place-items-center border-2 border-sky-500 bg-gradient-to-br from-orange-300 to-fuchsia-900 text-xl">🧑🏻</span>
          <span className="text-left text-sm font-bold max-[560px]:hidden">Player_01<small className="block text-[11px] font-medium text-blue-200">Ур. 12</small></span><ChevronDown className="h-4" />
        </button>
        <AnimatePresence>{open&&<motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="absolute right-4 top-[58px] w-44 rounded border border-sky-700 bg-[#071a39] p-2 shadow-2xl"><button className="w-full rounded px-3 py-2 text-left text-sm hover:bg-sky-800">Открыть профиль</button><button className="w-full rounded px-3 py-2 text-left text-sm hover:bg-sky-800">Настройки</button></motion.div>}</AnimatePresence>
      </div>
    </div>
  </header>
}

function Hero({notify}:{notify:(s:string)=>void}) {
  return <section className="hero relative min-h-[360px] overflow-hidden border-b-2 border-sky-700 bg-[#062758]">
    <div className="relative z-10 max-w-[520px] px-12 py-12 max-[560px]:px-5">
      <motion.h1 initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}} transition={{duration:.5}} className="font-display text-[clamp(2.7rem,5vw,4rem)] leading-[1.03] tracking-wide text-white text-shadow-pixel">Учись. Играй.<span className="block text-amber-300 text-shadow-gold">Побеждай.</span></motion.h1>
      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}} className="mt-4 max-w-sm text-base font-bold leading-6 text-blue-100">Отвечай на вопросы, получай ресурсы и соревнуйся с командой.</motion.p>
      <div className="mt-7 flex gap-3 max-[560px]:flex-col"><button onClick={()=>document.querySelector('#games')?.scrollIntoView({behavior:'smooth'})} className="pixel-button primary"><Play className="h-5" fill="currentColor"/>Начать игру</button><button onClick={()=>notify('Комната создана: код KP-2026')} className="pixel-button secondary"><Plus className="h-5"/>Создать комнату</button></div>
    </div>
    <motion.div initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{delay:.35,type:'spring'}} className="absolute right-6 top-20 z-10 w-40 border-2 border-sky-500 bg-[#03152f]/90 p-4 text-center font-black leading-5 shadow-[8px_8px_0_#020d22] max-[750px]:hidden"><Trophy className="mx-auto mb-2 h-9 w-9 text-amber-300"/><span className="text-amber-300">Знания</span> —<br/>твоё главное<br/>оружие!</motion.div>
  </section>
}

function GameCard({game,index,onPlay}:{game:GameMode;index:number;onPlay:(g:GameMode)=>void}) {
  const Icon=game.icon
  const positions=['0% 0%','50% 0%','100% 0%','0% 100%','50% 100%','100% 100%']
  return <motion.article initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{delay:(index%3)*.08}} whileHover={{y:-4}} className="overflow-hidden rounded border border-sky-700 bg-gradient-to-br from-[#082653] to-[#04152f] shadow-panel hover:border-cyan-400">
    <div className="mode-thumb h-28 border-b border-sky-700" style={{backgroundPosition:positions[game.image]}} />
    <div className="p-3.5"><div className="flex items-center gap-2.5"><Icon className="h-6 w-6 text-amber-300"/><h3 className="text-lg font-black">{game.title}</h3></div><p className="mt-1.5 min-h-10 text-xs leading-[1.45] text-blue-100/90">{game.description}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">{game.tags.map(t=><span key={t} className="rounded-full bg-blue-800/80 px-2.5 py-1 text-[10px] text-blue-50">{t}</span>)}</div>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-blue-200"><Users className="h-3.5"/>{game.players}<div className="ml-auto flex gap-1" aria-label={`Сложность: ${game.level} из 4`}>{[1,2,3,4].map(n=><i key={n} className={`h-3 w-1.5 ${n<=game.level?(game.level===4?'bg-pink-500':game.level===2?'bg-emerald-400':'bg-amber-300'):'bg-blue-950'}`}/>)}</div><button onClick={()=>onPlay(game)} className="ml-1 rounded border-2 border-cyan-300 bg-blue-600 px-4 py-1.5 font-black text-white shadow-[0_3px_0_#003d85] transition hover:brightness-125">Играть</button></div>
    </div>
  </motion.article>
}

function ProgressSidebar({notify}:{notify:(s:string)=>void}) {
  return <aside className="flex flex-col gap-3.5 bg-gradient-to-b from-[#06142d] to-[#031126] p-3.5 max-[880px]:grid max-[880px]:grid-cols-2 max-[560px]:block">
    <section className="panel max-[880px]:col-span-2"><PanelTitle>Твой прогресс</PanelTitle><div className="flex items-center gap-3"><span className="grid h-14 w-14 place-items-center border-2 border-sky-500 bg-gradient-to-br from-orange-300 to-fuchsia-900 text-3xl">🧑🏻</span><div className="flex-1 text-sm font-black">Player_01<small className="my-1 block font-medium text-blue-200">Ур. 12</small><div className="h-2.5 overflow-hidden rounded-full border border-sky-500 bg-[#020e25]"><motion.span initial={{width:0}} animate={{width:'72%'}} transition={{delay:.5,duration:.8}} className="block h-full bg-gradient-to-r from-cyan-300 to-blue-600 shadow-[0_0_9px_#00d8ff]"/></div></div></div>
      <div className="mt-3 divide-y divide-sky-900 text-sm"><Stat icon={<Bolt/>} label="Энергия" value="85"/><Stat icon={<Coins/>} label="Монеты" value="320"/><Stat icon={<Star/>} label="Уровень" value="12"/></div></section>
    <section className="panel"><PanelTitle>Быстрые действия</PanelTitle>{[[ScrollText,'Мои задания'],[Trophy,'Рейтинг'],[CircleUserRound,'Профиль']].map(([Icon,label])=><button key={label as string} onClick={()=>notify(`${label} — раздел скоро откроется`)} className="mb-1 flex w-full items-center gap-2 rounded border border-sky-800 bg-[#092049] px-3 py-2 text-left text-xs hover:border-sky-500 hover:bg-blue-900"><Icon className="h-4 w-4 text-blue-200"/>{label as string}</button>)}</section>
    <section className="panel"><PanelTitle>Последние события</PanelTitle>{[['🎮','Игрок_X создал комнату','2 мин назад'],['⚑','Синие захватили флаг!','5 мин назад'],['✓','Player_01 ответил на вопрос','7 мин назад'],['✖','Красные победили!','12 мин назад']].map(([icon,text,time])=><div key={text} className="grid grid-cols-[28px_1fr] gap-2 border-b border-sky-900 py-1.5 text-[11px] last:border-0"><span className="grid h-7 w-7 place-items-center rounded bg-blue-700">{icon}</span><span>{text}<small className="block text-blue-300/70">{time}</small></span></div>)}</section>
    <section id="rating" className="panel"><PanelTitle>Топ игроков</PanelTitle>{players.map(([name,level,score,face],i)=><div key={name} className="grid grid-cols-[20px_28px_1fr_auto] items-center gap-2 py-1 text-[11px]"><b className={`text-base ${i===0?'text-amber-300':'text-blue-100'}`}>{i+1}</b><span className="grid h-7 w-7 place-items-center border border-sky-600 bg-blue-900">{face}</span><span><strong>{name}</strong><small className="block text-blue-300">Ур. {level}</small></span><span className="text-blue-200">♕ {score}</span></div>)}</section>
  </aside>
}

function PanelTitle({children}:{children:React.ReactNode}){return <h2 className="mb-2.5 border-b border-sky-900 pb-2 text-sm font-black text-blue-50">{children}</h2>}
function Stat({icon,label,value}:{icon:React.ReactElement;label:string;value:string}){return <div className="flex items-center gap-2 py-2 text-blue-200"><span className="[&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-cyan-300">{icon}</span>{label}<b className="ml-auto text-cyan-300">{value}</b></div>}

function App() {
  const [active,setActive]=useState('Главная')
  const [selected,setSelected]=useState<GameMode|null>(null)
  const [toast,setToast]=useState('')
  const notify=(text:string)=>setToast(text)
  useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(''),2300);return()=>clearTimeout(id)},[toast])
  return <div id="top" className="min-h-screen bg-[radial-gradient(circle_at_50%_-20%,#0a3470_0,#06152e_32%,#030b1b_75%)] text-white">
    <Topbar active={active} setActive={setActive}/>
    <div className="mx-auto grid max-w-[1540px] grid-cols-[minmax(0,1fr)_320px] border-x border-sky-950 max-[880px]:block">
      <main className="min-w-0 border-r border-sky-900 max-[880px]:border-0"><Hero notify={notify}/><section id="games" className="px-9 py-5 max-[560px]:px-4"><h2 className="mb-4 flex items-center gap-3 text-2xl font-black text-shadow-soft"><Gamepad2 className="text-blue-200"/>Выберите игру</h2><div className="grid grid-cols-3 gap-4 max-[1200px]:grid-cols-2 max-[560px]:grid-cols-1">{games.map((g,i)=><GameCard key={g.title} game={g} index={i} onPlay={setSelected}/>)}</div></section></main>
      <ProgressSidebar notify={notify}/>
      <footer className="col-span-2 grid min-h-20 grid-cols-4 border-t-2 border-sky-800 bg-gradient-to-r from-[#051634] via-[#0a2858] to-[#051634] max-[760px]:hidden">{[[Gamepad2,'6+','игровых режимов'],[BookOpen,'50+','учебных предметов'],[Medal,'1000+','интересных вопросов'],[Crown,'Стань лучшим','вместе с нами!']].map(([Icon,b,s])=><div key={b as string} className="flex items-center justify-center gap-3"><Icon className="h-8 w-8 text-amber-300"/><span><b className="block text-base">{b as string}</b><small className="text-blue-200">{s as string}</small></span></div>)}</footer>
    </div>
    <AnimatePresence>{toast&&<motion.div initial={{y:90,opacity:0}} animate={{y:0,opacity:1}} exit={{y:90,opacity:0}} className="fixed bottom-20 left-1/2 z-[70] -translate-x-1/2 rounded border-2 border-cyan-300 bg-[#0a2e5c] px-5 py-3 font-bold shadow-[0_0_20px_#00c8ff77] min-[881px]:bottom-6" role="status">{toast}</motion.div>}</AnimatePresence>
    <AnimatePresence>{selected&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelected(null)} className="fixed inset-0 z-[60] grid place-items-center bg-[#010816]/90 p-4"><motion.div initial={{scale:.85,y:20}} animate={{scale:1,y:0}} exit={{scale:.85,y:20}} onClick={e=>e.stopPropagation()} className="w-full max-w-md border-2 border-cyan-300 bg-gradient-to-br from-[#0b2a59] to-[#06152f] p-6 text-center shadow-[10px_10px_0_#010713,0_0_35px_#00bfff44]"><button onClick={()=>setSelected(null)} className="float-right text-blue-200" aria-label="Закрыть"><X/></button><Sparkles className="mx-auto h-12 w-12 text-amber-300"/><h2 className="mt-2 text-2xl font-black">{selected.title}</h2><p className="my-3 text-blue-100">Режим готов. Собирайте команду и проверьте свои знания!</p><button onClick={()=>{setSelected(null);notify('Подбираем соперников…')}} className="pixel-button primary w-full"><Shield className="h-5"/>В бой!</button></motion.div></motion.div>}</AnimatePresence>
  </div>
}

export default App
