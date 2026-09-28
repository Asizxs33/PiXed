import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Sparkles } from './components/PixelIcons'
import { OutfitContext } from './components/PixelCharacters'
import { Brand } from './components/Brand'
import { PlayerWorld } from './components/PlayerWorld'
import { WelcomeQuest, learnerProfileKey, loadLearnerProfile, type LearnerProfile } from './components/WelcomeQuest'



function Landing({ onStart, returning }: { onStart: () => void; returning: boolean }) {
  const lastTap = useRef(0)
  const tap = () => { const now = Date.now(); if (now - lastTap.current < 450) onStart(); lastTap.current = now }
  return <main className="landing" onPointerUp={tap} onDoubleClick={onStart}>
    <div className="landing-brand"><Brand/></div>
    <section className="landing-copy">
      <small><Sparkles /> ENTER THE LEARNING WORLD</small>
      <h1>A little wonder.<br/><strong>A world to learn.</strong></h1>
      <p>Your next adventure starts with curiosity.</p><button className="landing-create" onPointerUp={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();onStart()}}>{returning ? "Continue my adventure" : "Create your player"}<Sparkles/></button><span className="landing-explainer">{returning ? "Your saved party is waiting." : "A few questions. Your hero. Your first adventure."}</span>
    </section>
    <section className="landing-world" aria-label="Animated PiXed world">
      <video autoPlay muted loop playsInline preload="auto" poster="/assets/archipelago-campaign.png"><source src="/assets/archipelago-loop.mp4" type="video/mp4" /></video>
      <div className="world-shade" /><div className="world-wind"><i/><i/><i/></div>
    </section>
    <button className="enter-prompt" aria-label="Enter PiXed: double tap or press Enter" onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onStart() } }}><span><i/><i/></span><b>Double tap to enter</b><small>Your adventure awaits</small></button>
  </main>
}

function PortalTransition() {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .4 }} className="world-transition" role="status" aria-label="Entering the archipelago"><div className="stone-gate"><i/><i/><i/><div className="gate-world"/><span>✧</span></div><p>A new chapter awaits</p><div className="gate-mist"/></motion.div>
}

function App() {
  const [profile, setProfile] = useState<LearnerProfile | null>(loadLearnerProfile)
  const [showSetup, setShowSetup] = useState(false)
  const [showHub, setShowHub] = useState(false)
  const [portal, setPortal] = useState(false)
  const portalTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(portalTimer.current), [])
  const openPortal = () => {
    if (portalTimer.current !== undefined) return
    setPortal(true)
    portalTimer.current = window.setTimeout(() => {
      portalTimer.current = undefined
      setPortal(false)
      if (profile) setShowHub(true)
      else setShowSetup(true)
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 250 : 1900)
  }
  const completeSetup = (nextProfile: LearnerProfile) => {
    localStorage.setItem(learnerProfileKey, JSON.stringify(nextProfile))
    setProfile(nextProfile)
    setShowSetup(false)
    setShowHub(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return <MotionConfig reducedMotion="user"><OutfitContext.Provider value={profile?.outfit ?? 'original'}>
    {showHub && profile ? <PlayerWorld profile={profile} onEdit={() => setShowSetup(true)} onUpdate={completeSetup} onExit={()=>setShowHub(false)}/> : <Landing onStart={openPortal} returning={!!profile}/>}
    <AnimatePresence>{portal && <PortalTransition />}</AnimatePresence>
    <AnimatePresence>{showSetup && <WelcomeQuest initialProfile={profile} onClose={() => setShowSetup(false)} onComplete={completeSetup} />}</AnimatePresence>
  </OutfitContext.Provider></MotionConfig>
}

export default App
