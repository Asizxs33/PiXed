import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3, Bolt, BookOpen, Castle, ChevronDown, Coins, Crown, DoorOpen,
  Flag, Gamepad2, Gauge, Home, Medal, Play, Plus, ScrollText, Shield,
  Sparkles, Star, Swords, Trophy, Users, UserRound, X,
} from 'lucide-react'
import { WelcomeQuest, learnerProfileKey, loadLearnerProfile, type LearnerProfile } from './components/WelcomeQuest'

type IconType = typeof Flag
type GameMode = {
  title: string; description: string; tags: string[]; players: string
  level: 2 | 3 | 4; icon: IconType; image: number; accent: string
}

const games: GameMode[] = [
  { title: 'Capture the Flag', description: 'Answer questions, collect resources, and capture the rival base.', tags: ['Team', 'Strategy', 'Quiz'], players: '2–8 players', level: 3, icon: Flag, image: 0, accent: '#ffd34d' },
  { title: 'Team Battle', description: 'Correct answers power your team in a fast magic duel.', tags: ['Team', 'Action', 'Quiz'], players: '2–8 players', level: 2, icon: Swords, image: 1, accent: '#ff4f8b' },
  { title: 'Base Defense', description: 'Build defenses by solving questions before your rivals.', tags: ['Strategy', 'Team', 'Quiz'], players: '2–6 players', level: 3, icon: Castle, image: 2, accent: '#4ee8ff' },
  { title: 'Knowledge Race', description: 'Every correct answer moves your hero closer to the finish.', tags: ['Solo', 'Race', 'Quiz'], players: '1–4 players', level: 2, icon: Gauge, image: 3, accent: '#65ff9a' },
  { title: 'Dungeon Quest', description: 'Explore the dungeon and unlock treasure with smart answers.', tags: ['Solo', 'Adventure', 'Quiz'], players: '1–4 players', level: 3, icon: DoorOpen, image: 4, accent: '#ffbd4a' },
  { title: 'Survival', description: 'Collect energy and become the last team standing.', tags: ['Team', 'Survival', 'Quiz'], players: '2–8 players', level: 4, icon: Bolt, image: 5, accent: '#ff477d' },
]

const leaders = [
  ['DarkKnight', '28', '2 450'], ['Phoenix', '27', '2 310'],
  ['SkillMaster', '25', '2 120'], ['BrainStorm', '24', '1 980'], ['Zhan', '22', '1 750'],
]

const navItems = [
  ['Home', Home], ['Games', Gamepad2], ['Rooms', Users],
  ['Quests', ScrollText], ['Ranking', BarChart3], ['Profile', UserRound],
] as const

function PixelIcon({icon: Icon, tone = 'cyan'}:{icon:IconType; tone?:'cyan'|'gold'|'pink'}) {
  return <span className={`pixel-icon pixel-icon--${tone}`}><Icon /></span>
}

function Logo() {
  return <a href="#top" className="logo-lockup" aria-label="PiXed home">
    <span className="logo-controller"><Gamepad2 /></span>
    <span className="brand-pixel">Pi<span>Xed</span></span>
  </a>
}

function PixelAvatar({large = false}:{large?:boolean}) {
  return <span className={`pixel-avatar ${large ? 'pixel-avatar--large' : ''}`} aria-hidden="true"><span className="avatar-head" /></span>
}

function Topbar({active, setActive, profile}:{active:string; setActive:(s:string)=>void; profile:LearnerProfile|null}) {
  const [open, setOpen] = useState(false)
  return <header className="topbar"><div className="topbar-inner">
    <Logo />
    <nav className="main-nav" aria-label="Main navigation">
      {navItems.map(([label, Icon]) => <a key={label} href={label === 'Home' ? '#top' : label === 'Ranking' ? '#rating' : '#games'} onClick={() => setActive(label)} className={active === label ? 'active' : ''}><Icon /><span>{label}</span></a>)}
    </nav>
    <div className="top-hud">
      <div className="hud-chip hud-energy"><Bolt /> <b>85</b><small>ENG</small></div>
      <div className="hud-chip hud-coins"><Coins /> <b>320</b><small>GOLD</small></div>
      <button className="player-chip" onClick={() => setOpen(v => !v)} aria-expanded={open}><PixelAvatar /><span><b>{profile?.name ?? 'New Player'}</b><small>{profile ? profile.learnerType : 'CREATE PROFILE'}</small></span><ChevronDown /></button>
      <AnimatePresence>{open && <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} className="profile-menu"><button>Open profile</button><button>Settings</button></motion.div>}</AnimatePresence>
    </div>
  </div></header>
}

function Hero({notify,onStart}:{notify:(s:string)=>void;onStart:()=>void}) {
  return <section className="hero">
    <video className="hero-film" autoPlay muted loop playsInline preload="auto" poster="/assets/archipelago-campaign.png" aria-hidden="true"><source src="/assets/archipelago-loop.mp4" type="video/mp4" /></video>
    <div className="hero-film-shade" />
    <div className="hero-copy">
      <motion.div initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}} transition={{duration:.45}}>
        <span className="hero-kicker"><Sparkles /> Learning RPG</span>
        <h1>Learn. Play.<strong>Grow.</strong></h1>
      </motion.div>
      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.18}}>Learn through quests, earn rewards,<br/>and grow with every challenge.</motion.p>
      <div className="hero-actions"><button onClick={onStart} className="pixel-button primary"><Play />Start adventure</button><button onClick={() => notify('Room created: code PX-2026')} className="pixel-button secondary"><Plus />Create room</button></div>
    </div>
    <motion.div initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{delay:.32,type:'spring'}} className="knowledge-panel"><div className="panel-runes">✦ ᚱ ✦</div><Trophy /><b>Knowledge is</b><span>your greatest<br/>power!</span></motion.div>
    <div className="hero-bottom-pixels" />
  </section>
}

function Difficulty({level}:{level:number}) {
  return <div className="difficulty" aria-label={`Difficulty: ${level} of 4`}>{[1,2,3,4].map(n => <i key={n} className={n <= level ? 'filled' : ''} />)}</div>
}

function GameCard({game,index,onPlay}:{game:GameMode; index:number; onPlay:(g:GameMode)=>void}) {
  const Icon = game.icon
  const positions = ['0% 0%','50% 0%','100% 0%','0% 100%','50% 100%','100% 100%']
  return <motion.article initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{delay:(index%3)*.06}} whileHover={{y:-5}} className="game-card" style={{'--accent':game.accent} as React.CSSProperties}>
    <div className="mode-thumb" style={{backgroundPosition:positions[game.image]}}><span className="mode-number">0{index+1}</span><span className="online-dot">Online</span></div>
    <div className="card-body"><div className="game-title"><span><Icon /></span><h3>{game.title}</h3></div><p>{game.description}</p><div className="tag-row">{game.tags.map(t => <span key={t}>{t}</span>)}</div><div className="card-footer"><span className="players-count"><Users /> {game.players}</span><Difficulty level={game.level}/><button onClick={() => onPlay(game)}>Play <Play /></button></div></div>
  </motion.article>
}

function PanelTitle({icon:Icon, children, gold=false}:{icon:IconType; children:React.ReactNode; gold?:boolean}) {
  return <h2 className="panel-title"><PixelIcon icon={Icon} tone={gold?'gold':'cyan'}/><span>{children}</span></h2>
}

function Stat({icon:Icon,label,value,tone}:{icon:IconType;label:string;value:string;tone:string}) {
  return <div className="stat-row"><Icon style={{color:tone}}/><span>{label}</span><b style={{color:tone}}>{value}</b></div>
}

function ProgressSidebar({notify,profile}:{notify:(s:string)=>void;profile:LearnerProfile|null}) {
  return <aside className="sidebar">
    <section className="rpg-panel progress-panel"><PanelTitle icon={Crown} gold>Your progress</PanelTitle><div className="character-line"><PixelAvatar large/><div><b className="player-name">{profile?.name ?? 'New Player'}</b><small>{profile ? `${profile.learnerType} • ${profile.favoriteSubject}` : 'Create a profile to begin'}</small></div></div><div className="xp-label"><span>Experience</span><b>{profile ? '0 / 200 XP' : 'PROFILE REQUIRED'}</b></div><div className="xp-bar"><motion.i initial={{width:0}} animate={{width:profile?'8%':'0%'}} transition={{delay:.45,duration:.8}} /></div><div className="stats"><Stat icon={Bolt} label="Energy" value={profile?'100':'—'} tone="#4ee8ff"/><Stat icon={Coins} label="Coins" value={profile?'20':'—'} tone="#ffd34d"/><Stat icon={Star} label="Level" value={profile?'1':'—'} tone="#c58cff"/></div></section>
    <section className="rpg-panel quick-panel"><PanelTitle icon={Sparkles}>Quick actions</PanelTitle>{[[ScrollText,'My quests'],[Trophy,'Ranking'],[UserRound,'Profile']].map(([Icon,label]) => <button key={label as string} onClick={() => notify(`${label} is coming soon`)}><Icon /><span>{label as string}</span><b>›</b></button>)}</section>
    <section className="rpg-panel event-panel"><PanelTitle icon={ScrollText}>Recent activity</PanelTitle>{[[Gamepad2,'Player_X created a room','2 min ago'],[Flag,'Blue team captured the flag!','5 min ago'],[ScrollText,'Player_01 answered correctly','7 min ago'],[Swords,'Red team won!','12 min ago']].map(([Icon,text,time],i) => <div className="event-row" key={text as string}><span className={`event-icon event-${i}`}><Icon /></span><p>{text as string}<small>{time as string}</small></p></div>)}</section>
    <section id="rating" className="rpg-panel leaderboard"><PanelTitle icon={Trophy} gold>Top players</PanelTitle>{leaders.map(([name,level,score],i) => <div className={`leader-row rank-${i+1}`} key={name}><b className="rank">{i+1}</b><span className="leader-avatar"><Medal /></span><span><strong>{name}</strong><small>LV. {level}</small></span><em>{score}</em></div>)}</section>
  </aside>
}

function App() {
  const [active,setActive] = useState('Home')
  const [selected,setSelected] = useState<GameMode|null>(null)
  const [toast,setToast] = useState('')
  const [profile,setProfile] = useState<LearnerProfile|null>(loadLearnerProfile)
  const [showWelcome,setShowWelcome] = useState(false)
  const notify = (text:string) => setToast(text)
  const startAdventure = () => profile ? document.querySelector('#games')?.scrollIntoView({behavior:'smooth'}) : setShowWelcome(true)
  const completeProfile = (nextProfile:LearnerProfile) => {
    localStorage.setItem(learnerProfileKey,JSON.stringify(nextProfile))
    setProfile(nextProfile)
    setShowWelcome(false)
    setToast(`Welcome, ${nextProfile.name}! Your first quest is ready.`)
    window.setTimeout(() => document.querySelector('#games')?.scrollIntoView({behavior:'smooth'}),120)
  }
  useEffect(() => { if(!toast) return; const id=setTimeout(()=>setToast(''),2300); return()=>clearTimeout(id) },[toast])
  return <div id="top" className="app-shell">
    <Topbar active={active} setActive={setActive} profile={profile}/>
    <div className="dashboard"><main><Hero notify={notify} onStart={startAdventure}/><section id="games" className="games-section"><div className="section-heading"><PixelIcon icon={Gamepad2}/><div><span>PLAY & LEARN</span><h2>Choose your quest</h2></div><div className="section-rule"><i/><i/><i/></div></div><div className="game-grid">{games.map((g,i) => <GameCard key={g.title} game={g} index={i} onPlay={setSelected}/>)}</div></section></main><ProgressSidebar notify={notify} profile={profile}/>
      <footer>{[[Gamepad2,'6+','game modes'],[BookOpen,'50+','learning topics'],[Medal,'1000+','smart challenges'],[Crown,'Grow together','one quest at a time']].map(([Icon,b,s]) => <div key={b as string}><PixelIcon icon={Icon as IconType} tone="gold"/><span><b>{b as string}</b><small>{s as string}</small></span></div>)}</footer>
    </div>
    <AnimatePresence>{toast && <motion.div initial={{y:90,opacity:0}} animate={{y:0,opacity:1}} exit={{y:90,opacity:0}} className="toast" role="status">{toast}</motion.div>}</AnimatePresence>
    <AnimatePresence>{selected && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setSelected(null)} className="modal-backdrop"><motion.div initial={{scale:.85,y:20}} animate={{scale:1,y:0}} exit={{scale:.85,y:20}} onClick={e => e.stopPropagation()} className="battle-modal"><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close"><X/></button><Shield/><small>Quest ready</small><h2>{selected.title}</h2><p>Bring your team and put your knowledge into action!</p><button onClick={() => {setSelected(null);notify('Finding a match…')}} className="pixel-button primary"><Swords/>Start quest</button></motion.div></motion.div>}</AnimatePresence>
    <AnimatePresence>{showWelcome && <WelcomeQuest onClose={() => setShowWelcome(false)} onComplete={completeProfile} />}</AnimatePresence>
  </div>
}

export default App
