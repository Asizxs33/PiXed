import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BrainCircuit, Code2, Coins, Gamepad2, Home, LockKeyhole, Play, Sparkles, Star, UserRound } from 'lucide-react'
import { PlayerAvatar, PetAvatar, WelcomeQuest, learnerProfileKey, loadLearnerProfile, type LearnerProfile } from './components/WelcomeQuest'

type GameCard = { title: string; subject: string; description: string; status: string; image: string; accent: string; icon: typeof Code2 }

const games: GameCard[] = [
  { title: 'Code Quest', subject: 'CODING', description: 'Write short commands and bring a sleeping island back to life.', status: 'PLAYABLE', image: '0% 0%', accent: '#4ee8ff', icon: Code2 },
  { title: 'Math Run', subject: 'MATHEMATICS', description: 'Solve patterns to power your runner through a pixel world.', status: 'COMING NEXT', image: '50% 100%', accent: '#ffd34d', icon: Sparkles },
  { title: 'Logic Arena', subject: 'LOGIC', description: 'Choose the best move, explain it, and outsmart the arena bot.', status: 'COMING NEXT', image: '50% 0%', accent: '#c58cff', icon: BrainCircuit },
]

function Landing({ onStart }: { onStart: () => void }) {
  const lastTap = useRef(0)
  const tap = () => { const now = Date.now(); if (now - lastTap.current < 450) onStart(); lastTap.current = now }
  return <main className="landing" onPointerUp={tap} onDoubleClick={onStart}>
    <div className="landing-brand"><span><Gamepad2 /></span><b>Pi<i>Xed</i></b></div>
    <section className="landing-copy">
      <small><Sparkles /> ENTER THE LEARNING WORLD</small>
      <h1>Learn.<br/><strong>Play.</strong><br/>Grow.</h1>
      <p>Knowledge opens every path.</p>
    </section>
    <section className="landing-world" aria-label="Animated PiXed world">
      <video autoPlay muted loop playsInline preload="auto" poster="/assets/archipelago-campaign.png"><source src="/assets/archipelago-loop.mp4" type="video/mp4" /></video>
      <div className="world-shade" /><div className="world-wind"><i/><i/><i/></div>
    </section>
    <div className="enter-prompt" aria-label="Double tap to enter"><span><i/><i/></span><b>Double tap to enter</b><small>Open the portal</small></div>
  </main>
}

function PortalTransition() {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="portal-transition" aria-label="Opening portal"><div className="portal-core"><i/><i/><i/><span><Gamepad2 /></span></div><p>Opening PiXed world…</p><div className="portal-flash" /></motion.div>
}

function GameHub({ profile, onEdit }: { profile: LearnerProfile; onEdit: () => void }) {
  const [tab, setTab] = useState<'home' | 'games' | 'profile'>('home')
  const scrollToGames = () => { setTab('games'); document.querySelector('#game-list')?.scrollIntoView({ behavior: 'smooth' }) }
  return <div className="game-hub">
    <header className="hub-header">
      <button className="hub-logo" onClick={() => setTab('home')}><Gamepad2 /><b>Pi<span>Xed</span></b></button>
      <nav aria-label="Game navigation">
        <button className={tab === 'home' ? 'active' : ''} onClick={() => setTab('home')}><Home />Home</button>
        <button className={tab === 'games' ? 'active' : ''} onClick={scrollToGames}><Gamepad2 />Games</button>
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => { setTab('profile'); document.querySelector('#player-profile')?.scrollIntoView({ behavior: 'smooth' }) }}><UserRound />Profile</button>
      </nav>
      <div className="hub-player"><span><Coins />20</span><span><Star />LV. 1</span><PlayerAvatar choice={profile.avatar} /></div>
    </header>

    <main>
      <section className="hub-welcome">
        <div className="hub-welcome-copy"><small>WELCOME TO PIXED, {profile.name.toUpperCase()}</small><h1>Your adventure<br/>starts here.</h1><p>Your first path matches your <b>{profile.learnerType}</b> play style and your interest in <b>{profile.favoriteSubject}</b>.</p><button onClick={scrollToGames}><Play /> Choose a game <ArrowRight /></button></div>
        <div className="party-card"><div className="party-stage"><PlayerAvatar choice={profile.avatar} large /><PetAvatar choice={profile.pet} large /></div><span><small>YOUR PARTY</small><b>{profile.name} + {profile.petName}</b></span></div>
      </section>

      <section id="game-list" className="game-list">
        <header><div><small>CHOOSE ONE PATH</small><h2>Games</h2></div><p>Start with one clear mission. More worlds unlock as the platform grows.</p></header>
        <div className="simple-game-grid">{games.map((game, index) => { const Icon = game.icon; const playable = index === 0; return <motion.article whileHover={playable ? { y: -5 } : {}} key={game.title} style={{ '--game-accent': game.accent } as React.CSSProperties}>
          <div className="simple-game-art" style={{ backgroundPosition: game.image }}><span>0{index + 1}</span><small>{game.status}</small></div>
          <div className="simple-game-copy"><span><Icon /></span><small>{game.subject}</small><h3>{game.title}</h3><p>{game.description}</p><button disabled={!playable}>{playable ? <><Play />Start game</> : <><LockKeyhole />Locked</>}</button></div>
        </motion.article>})}</div>
      </section>

      <section id="player-profile" className="clean-profile">
        <div className="profile-party"><PlayerAvatar choice={profile.avatar} large /><PetAvatar choice={profile.pet} /></div>
        <div><small>PLAYER PROFILE</small><h2>{profile.name}</h2><p>{profile.learnerType} • {profile.favoriteSubject} • Age {profile.age}</p></div>
        <dl><div><dt>Level</dt><dd>1</dd></div><div><dt>XP</dt><dd>0 / 200</dd></div><div><dt>Coins</dt><dd>20</dd></div></dl>
        <button onClick={onEdit}>Edit character</button>
      </section>
    </main>
  </div>
}

function App() {
  const [profile, setProfile] = useState<LearnerProfile | null>(loadLearnerProfile)
  const [showSetup, setShowSetup] = useState(false)
  const [showHub, setShowHub] = useState(false)
  const [portal, setPortal] = useState(false)
  const openPortal = () => {
    if (portal) return
    setPortal(true)
    window.setTimeout(() => {
      setPortal(false)
      if (profile) setShowHub(true)
      else setShowSetup(true)
    }, 1450)
  }
  const completeSetup = (nextProfile: LearnerProfile) => {
    localStorage.setItem(learnerProfileKey, JSON.stringify(nextProfile))
    setProfile(nextProfile)
    setShowSetup(false)
    setShowHub(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return <>
    {showHub && profile ? <GameHub profile={profile} onEdit={() => setShowSetup(true)} /> : <Landing onStart={openPortal} />}
    <AnimatePresence>{portal && <PortalTransition />}</AnimatePresence>
    <AnimatePresence>{showSetup && <WelcomeQuest initialProfile={profile} onClose={() => setShowSetup(false)} onComplete={completeSetup} />}</AnimatePresence>
  </>
}

export default App
