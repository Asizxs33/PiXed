import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LazyGameLauncher as GameLauncher } from './game/react/LazyGameLauncher'
import {
  BarChart3, Bolt, BookOpen, Castle, ChevronDown, Coins, Crown, DoorOpen,
  Flag, Gamepad2, Gauge, Home, Medal, Play, Plus, ScrollText, Shield,
  Sparkles, Star, Swords, Trophy, Users, UserRound, X,
} from 'lucide-react'

type IconType = typeof Flag
type GameMode = {
  title: string; description: string; tags: string[]; players: string
  level: 2 | 3 | 4; icon: IconType; image: number; accent: string
}

const games: GameMode[] = [
  { title: 'Захват флага', description: 'Отвечайте правильно, собирайте ресурсы и захватывайте территорию противника.', tags: ['Командная', 'Стратегия', 'Вопросы'], players: '2–8 игроков', level: 3, icon: Flag, image: 0, accent: '#ffd34d' },
  { title: 'Битва команд', description: 'Правильные ответы дают вашей команде преимущество в магической дуэли.', tags: ['Командная', 'Экшен', 'Вопросы'], players: '2–8 игроков', level: 2, icon: Swords, image: 1, accent: '#ff4f8b' },
  { title: 'Защита базы', description: 'Создайте защиту своей базы, отвечая на вопросы быстрее соперников.', tags: ['Стратегия', 'Командная', 'Вопросы'], players: '2–6 игроков', level: 3, icon: Castle, image: 2, accent: '#4ee8ff' },
  { title: 'Гонка знаний', description: 'Чем больше правильных ответов — тем быстрее движется ваш персонаж.', tags: ['Соло', 'Гонка', 'Вопросы'], players: '1–4 игрока', level: 2, icon: Gauge, image: 3, accent: '#65ff9a' },
  { title: 'Подземелье', description: 'Исследуйте подземелье и находите сокровища за верные ответы.', tags: ['Соло', 'Приключение', 'Вопросы'], players: '1–4 игрока', level: 3, icon: DoorOpen, image: 4, accent: '#ffbd4a' },
  { title: 'Выживание', description: 'Собирайте энергию и оставайтесь последней командой на арене.', tags: ['Командная', 'Выживание', 'Вопросы'], players: '2–8 игроков', level: 4, icon: Bolt, image: 5, accent: '#ff477d' },
]

const leaders = [
  ['DarkKnight', '28', '2 450'], ['Phoenix', '27', '2 310'],
  ['SkillMaster', '25', '2 120'], ['BrainStorm', '24', '1 980'], ['Zhan', '22', '1 750'],
]

const navItems = [
  ['Главная', Home], ['Игры', Gamepad2], ['Комнаты', Users],
  ['Задания', ScrollText], ['Рейтинг', BarChart3], ['Профиль', UserRound],
] as const

function PixelIcon({icon: Icon, tone = 'cyan'}:{icon:IconType; tone?:'cyan'|'gold'|'pink'}) {
  return <span className={`pixel-icon pixel-icon--${tone}`}><Icon /></span>
}

function Logo() {
  return <a href="#top" className="logo-lockup" aria-label="PiXed — главная">
    <span className="logo-controller"><Gamepad2 /></span>
    <span className="brand-pixel">Pi<span>Xed</span></span>
  </a>
}

function PixelAvatar({large = false}:{large?:boolean}) {
  return <span className={`pixel-avatar ${large ? 'pixel-avatar--large' : ''}`} aria-hidden="true"><span className="avatar-head" /></span>
}

function Topbar({active, setActive}:{active:string; setActive:(s:string)=>void}) {
  const [open, setOpen] = useState(false)
  return <header className="topbar"><div className="topbar-inner">
    <Logo />
    <nav className="main-nav" aria-label="Основная навигация">
      {navItems.map(([label, Icon]) => <a key={label} href={label === 'Главная' ? '#top' : label === 'Рейтинг' ? '#rating' : '#games'} onClick={() => setActive(label)} className={active === label ? 'active' : ''}><Icon /><span>{label}</span></a>)}
    </nav>
    <div className="top-hud">
      <div className="hud-chip hud-energy"><Bolt /> <b>85</b><small>ENG</small></div>
      <div className="hud-chip hud-coins"><Coins /> <b>320</b><small>GOLD</small></div>
      <button className="player-chip" onClick={() => setOpen(v => !v)} aria-expanded={open}><PixelAvatar /><span><b>Player_01</b><small>УР. 12</small></span><ChevronDown /></button>
      <AnimatePresence>{open && <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} className="profile-menu"><button>Открыть профиль</button><button>Настройки</button></motion.div>}</AnimatePresence>
    </div>
  </div></header>
}

function Hero({notify}:{notify:(s:string)=>void}) {
  return <section className="hero">
    <div className="hero-copy">
      <motion.div initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}} transition={{duration:.45}}>
        <span className="hero-kicker"><Sparkles /> Образовательная RPG</span>
        <h1>Учись. Играй.<strong>Побеждай.</strong></h1>
      </motion.div>
      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.18}}>Отвечай на вопросы, получай ресурсы<br/>и соревнуйся с командой.</motion.p>
      <div className="hero-actions"><button onClick={() => document.querySelector('#games')?.scrollIntoView({behavior:'smooth'})} className="pixel-button primary"><Play />Начать игру</button><button onClick={() => notify('Комната создана: код KP-2026')} className="pixel-button secondary"><Plus />Создать комнату</button></div>
    </div>
    <motion.div initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{delay:.32,type:'spring'}} className="knowledge-panel"><div className="panel-runes">✦ ᚱ ✦</div><Trophy /><b>Знания —</b><span>твоё главное<br/>оружие!</span></motion.div>
    <div className="hero-bottom-pixels" />
  </section>
}

function Difficulty({level}:{level:number}) {
  return <div className="difficulty" aria-label={`Сложность: ${level} из 4`}>{[1,2,3,4].map(n => <i key={n} className={n <= level ? 'filled' : ''} />)}</div>
}

function GameCard({game,index,onPlay}:{game:GameMode; index:number; onPlay:(g:GameMode)=>void}) {
  const Icon = game.icon
  const positions = ['0% 0%','50% 0%','100% 0%','0% 100%','50% 100%','100% 100%']
  return <motion.article initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{delay:(index%3)*.06}} whileHover={{y:-5}} className="game-card" style={{'--accent':game.accent} as React.CSSProperties}>
    <div className="mode-thumb" style={{backgroundPosition:positions[game.image]}}><span className="mode-number">0{index+1}</span><span className="online-dot">Online</span></div>
    <div className="card-body"><div className="game-title"><span><Icon /></span><h3>{game.title}</h3></div><p>{game.description}</p><div className="tag-row">{game.tags.map(t => <span key={t}>{t}</span>)}</div><div className="card-footer"><span className="players-count"><Users /> {game.players}</span><Difficulty level={game.level}/><button onClick={() => onPlay(game)}>Играть <Play /></button></div></div>
  </motion.article>
}

function PanelTitle({icon:Icon, children, gold=false}:{icon:IconType; children:React.ReactNode; gold?:boolean}) {
  return <h2 className="panel-title"><PixelIcon icon={Icon} tone={gold?'gold':'cyan'}/><span>{children}</span></h2>
}

function Stat({icon:Icon,label,value,tone}:{icon:IconType;label:string;value:string;tone:string}) {
  return <div className="stat-row"><Icon style={{color:tone}}/><span>{label}</span><b style={{color:tone}}>{value}</b></div>
}

function ProgressSidebar({notify}:{notify:(s:string)=>void}) {
  return <aside className="sidebar">
    <section className="rpg-panel progress-panel"><PanelTitle icon={Crown} gold>Твой прогресс</PanelTitle><div className="character-line"><PixelAvatar large/><div><b className="player-name">Player_01</b><small>Класс: Учёный • Ур. 12</small></div></div><div className="xp-label"><span>Опыт</span><b>7 240 / 10 000 XP</b></div><div className="xp-bar"><motion.i initial={{width:0}} animate={{width:'72%'}} transition={{delay:.45,duration:.8}} /></div><div className="stats"><Stat icon={Bolt} label="Энергия" value="85" tone="#4ee8ff"/><Stat icon={Coins} label="Монеты" value="320" tone="#ffd34d"/><Stat icon={Star} label="Уровень" value="12" tone="#c58cff"/></div></section>
    <section className="rpg-panel quick-panel"><PanelTitle icon={Sparkles}>Быстрые действия</PanelTitle>{[[ScrollText,'Мои задания'],[Trophy,'Рейтинг'],[UserRound,'Профиль']].map(([Icon,label]) => <button key={label as string} onClick={() => notify(`${label} — раздел скоро откроется`)}><Icon /><span>{label as string}</span><b>›</b></button>)}</section>
    <section className="rpg-panel event-panel"><PanelTitle icon={ScrollText}>Последние события</PanelTitle>{[[Gamepad2,'Игрок_X создал комнату','2 мин назад'],[Flag,'Синие захватили флаг!','5 мин назад'],[ScrollText,'Player_01 ответил верно','7 мин назад'],[Swords,'Красные победили!','12 мин назад']].map(([Icon,text,time],i) => <div className="event-row" key={text as string}><span className={`event-icon event-${i}`}><Icon /></span><p>{text as string}<small>{time as string}</small></p></div>)}</section>
    <section id="rating" className="rpg-panel leaderboard"><PanelTitle icon={Trophy} gold>Топ игроков</PanelTitle>{leaders.map(([name,level,score],i) => <div className={`leader-row rank-${i+1}`} key={name}><b className="rank">{i+1}</b><span className="leader-avatar"><Medal /></span><span><strong>{name}</strong><small>УР. {level}</small></span><em>{score}</em></div>)}</section>
  </aside>
}

function App() {
  const [active,setActive] = useState('Главная')
  const [selected,setSelected] = useState<GameMode|null>(null)
  const [launched,setLaunched] = useState<GameMode|null>(null)
  const [toast,setToast] = useState('')
  const notify = (text:string) => setToast(text)
  useEffect(() => { if(!toast) return; const id=setTimeout(()=>setToast(''),2300); return()=>clearTimeout(id) },[toast])
  return <div id="top" className="app-shell">
    <Topbar active={active} setActive={setActive}/>
    <div className="dashboard"><main><Hero notify={notify}/><section id="games" className="games-section"><div className="section-heading"><PixelIcon icon={Gamepad2}/><div><span>Доступные режимы</span><h2>Выберите игру</h2></div><div className="section-rule"><i/><i/><i/></div></div><div className="game-grid">{games.map((g,i) => <GameCard key={g.title} game={g} index={i} onPlay={setSelected}/>)}</div></section></main><ProgressSidebar notify={notify}/>
      <footer>{[[Gamepad2,'6+','игровых режимов'],[BookOpen,'50+','учебных предметов'],[Medal,'1000+','интересных вопросов'],[Crown,'Стань лучшим','вместе с нами!']].map(([Icon,b,s]) => <div key={b as string}><PixelIcon icon={Icon as IconType} tone="gold"/><span><b>{b as string}</b><small>{s as string}</small></span></div>)}</footer>
    </div>
    <AnimatePresence>{toast && <motion.div initial={{y:90,opacity:0}} animate={{y:0,opacity:1}} exit={{y:90,opacity:0}} className="toast" role="status">{toast}</motion.div>}</AnimatePresence>
    <AnimatePresence>{selected && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setSelected(null)} className="modal-backdrop"><motion.div initial={{scale:.85,y:20}} animate={{scale:1,y:0}} exit={{scale:.85,y:20}} onClick={e => e.stopPropagation()} className="battle-modal"><button className="modal-close" onClick={() => setSelected(null)} aria-label="Закрыть"><X/></button><Shield/><small>Режим готов</small><h2>{selected.title}</h2><p>Собирайте команду и проверьте свои знания!</p><button onClick={() => {setLaunched(selected);setSelected(null)}} className="pixel-button primary"><Swords/>В бой!</button></motion.div></motion.div>}</AnimatePresence>
    <GameLauncher open={launched !== null} title={launched?.title} onClose={() => setLaunched(null)} />
  </div>
}

export default App
