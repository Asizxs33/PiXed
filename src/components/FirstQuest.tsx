import { useEffect, useRef, useState } from 'react'
import { CompanionSprite } from './PixelCharacters'
import { Play, X } from './PixelIcons'
import type { PetChoice } from './WelcomeQuest'

export function FirstQuest({ pet, onClose }: { pet: PetChoice; onClose: () => void }) {
  const [repeat, setRepeat] = useState(1)
  const [position, setPosition] = useState(0)
  const [running, setRunning] = useState(false)
  const [feedback, setFeedback] = useState('Count the four stepping stones. How many times should your companion move?')
  const timer = useRef<number | undefined>(undefined)
  const panel = useRef<HTMLElement>(null)
  useEffect(() => () => window.clearInterval(timer.current), [])
  useEffect(() => { const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous } }, [])
  const run = () => {
    setPosition(0); setRunning(true); setFeedback('Running your code…')
    let next = 0
    timer.current = window.setInterval(() => {
      next += 1; setPosition(next)
      if (next === repeat) {
        window.clearInterval(timer.current); setRunning(false)
        setFeedback(repeat === 4 ? 'Bridge crossed! repeat(4) runs move() four times. One small loop, one big discovery.' : repeat < 4 ? `You moved ${repeat} ${repeat === 1 ? 'step' : 'steps'}. The goal is four steps away. Add a few more and try again.` : 'You went one step past the goal. Try one fewer move.')
      }
    }, 450)
  }
  return <div className="setup-backdrop" role="dialog" aria-modal="true" aria-labelledby="first-quest-title" onKeyDown={e => { if (e.key === 'Escape') onClose() }}>
    <section className="setup-window" ref={panel} onKeyDown={event => {
      if (event.key !== 'Tab') return
      const nodes = panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), select:not(:disabled)')
      if (!nodes?.length) return
      const first = nodes[0], last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }}><header><span><Play/></span><div><small>CODE QUEST · CHAPTER 01</small><b>The quiet bridge</b></div><button autoFocus onClick={onClose} aria-label="Close lesson"><X/></button></header>
      <div className="setup-body"><small className="step-label">YOUR FIRST LOOP</small><h2 id="first-quest-title">A path across the clouds</h2><p>Help your companion cross the bridge with one repeating command.</p>
        <div className="bridge-board"><div className="bridge-pet" style={{left:`${position * 16.5}%`}}><CompanionSprite choice={pet} large/></div><div className="bridge-stones">{['Start','1','2','3','Goal',''].map((label,i) => <span key={i} className={i === 4 ? 'bridge-goal' : ''}>{label}</span>)}</div></div>
        <label className="loop-control">Number of moves<select disabled={running} value={repeat} onChange={e => setRepeat(Number(e.target.value))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
        <pre className="loop-code">{`repeat(${repeat}) {\n  move()\n}`}</pre><p className="quest-feedback" role="status">{feedback}</p>
        <button className="setup-next" disabled={running} onClick={run}><Play/>{running ? 'Moving…' : 'Run my code'}</button>
      </div>
    </section>
  </div>
}
