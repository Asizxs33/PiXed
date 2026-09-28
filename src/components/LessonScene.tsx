import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Lightbulb, Play, RotateCcw, Sparkles } from 'lucide-react'
import type { Mission, PlayerProgress } from '../domain/game'
import { PixelPet } from './PixelCharacter'

type Result = 'idle' | 'running' | 'short' | 'long' | 'explain' | 'success'

export function LessonScene({ mission, progress, onBack, onComplete }: { mission: Mission; progress: PlayerProgress; onBack: () => void; onComplete: (mission: Mission) => void }) {
  const [repeat, setRepeat] = useState(1)
  const [position, setPosition] = useState(0)
  const [result, setResult] = useState<Result>('idle')
  const [hint, setHint] = useState(0)
  const runId = useRef(0)
  const alreadyDone = progress.completed.includes(mission.id)

  useEffect(() => () => { runId.current += 1 }, [])

  useEffect(() => {
    if (result !== 'explain' && result !== 'success') return
    const closeModal = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (result === 'success') onBack()
      else setResult('idle')
    }
    window.addEventListener('keydown', closeModal)
    return () => window.removeEventListener('keydown', closeModal)
  }, [onBack, result])

  const run = async () => {
    const currentRun = ++runId.current
    setPosition(0)
    setResult('running')
    const steps = Math.min(repeat, mission.target + 1)
    for (let step = 1; step <= steps; step += 1) {
      await new Promise(resolve => window.setTimeout(resolve, 360))
      if (runId.current !== currentRun) return
      setPosition(step)
    }
    if (repeat === mission.target) setResult('explain')
    else setResult(repeat < mission.target ? 'short' : 'long')
  }

  const reset = () => {
    runId.current += 1
    setPosition(0)
    setResult('idle')
  }

  const finish = () => {
    setResult('success')
    if (!alreadyDone) onComplete(mission)
  }

  const feedback = result === 'short'
    ? `${mission.target - repeat} қадам жетпей қалды. repeat санын үлкейт.`
    : result === 'long'
      ? `${repeat - mission.target} артық әрекет бар. Дәл ${mission.target} рет орындап көр.`
      : 'Кодты іске қосып, нәтижесін бақыла.'

  return <main className="lesson-page">
    <header className="lesson-header">
      <button onClick={onBack}><ArrowLeft /> Картаға қайту</button>
      <span><small>МИССИЯ {mission.chapter}</small><b>{mission.title}</b></span>
      <div><i><u style={{ width: `${((Number(mission.chapter) - 1) / 6) * 100}%` }} /></i><small>{mission.chapter}/06</small></div>
    </header>
    <div className="lesson-grid">
      <section className="mission-brief">
        <span className="npc-avatar">⚙</span><div><small>ШЕБЕР АЙЛИН</small><h1>{mission.story}</h1><p>{mission.objective}</p></div>
        <div className="learning-goal"><Sparkles /><span><small>БҮГІНГІ ДАҒДЫ</small><b>Цикл арқылы әрекетті қайталау</b></span></div>
        <button className="hint-button" onClick={() => setHint(value => Math.min(2, value + 1))}><Lightbulb /> Көмек алу <span>{hint}/2</span></button>
        {hint > 0 && <div className="hint-box">{hint === 1 ? `Мақсатқа дейін ${mission.target} бөлік бар. Бір бөлікке бір ${mission.action} керек.` : `repeat ішіндегі сан ${mission.target} болуы керек.`}</div>}
      </section>

      <section className="game-stage">
        <div className={`stage-sky tone-${mission.tone}`}><span className="pixel-cloud cloud-a"/><span className="pixel-cloud cloud-b"/><div className="distant-island"/></div>
        <div className="stage-goal"><span>{mission.icon}</span><small>МАҚСАТ</small></div>
        <div className="bridge-track">
          {Array.from({ length: mission.target }, (_, index) => <i key={index} className={position > index ? 'powered' : ''}><span>{index + 1}</span></i>)}
          <div className="pet-runner" style={{ '--position': Math.min(position, mission.target) / mission.target } as React.CSSProperties}><PixelPet pet={progress.pet} moving={result === 'running'} /></div>
        </div>
        <div className="stage-status"><b>{result === 'running' ? `${mission.action} орындалуда…` : position === mission.target ? 'Мақсатқа жетті!' : `${position} / ${mission.target} қадам`}</b><span>{progress.pet.name}</span></div>
      </section>

      <section className="code-panel">
        <header><span><i/><i/><i/></span><b>PIXED CODE</b><small>ЦИКЛ</small></header>
        <div className="code-editor">
          <span className="line-number">1</span><code><em>repeat</em> (<strong>{repeat}</strong>) {'{'}</code>
          <span className="line-number">2</span><code className="indent">{mission.action}</code>
          <span className="line-number">3</span><code>{'}'}</code>
        </div>
        <div className="repeat-control"><span><small>ҚАЙТАЛАУ САНЫ</small><b>{repeat}</b></span><div><button onClick={() => setRepeat(value => Math.min(9, value + 1))} aria-label="Бірге арттыру"><ChevronUp /></button><button onClick={() => setRepeat(value => Math.max(0, value - 1))} aria-label="Бірге азайту"><ChevronDown /></button></div></div>
        <div className="code-actions"><button className="run-code" onClick={run} disabled={result === 'running'}><Play /> Кодты іске қос</button><button onClick={reset} aria-label="Қайта бастау"><RotateCcw /></button></div>
        {result !== 'explain' && result !== 'success' && <p className={`run-feedback ${result === 'short' || result === 'long' ? 'error' : ''}`}>{feedback}</p>}
      </section>
    </div>

    {result === 'explain' && <div className="lesson-modal-backdrop"><section className="explain-modal" role="dialog" aria-modal="true" aria-labelledby="explain-title"><span className="modal-rune">?</span><small>БІЛІМДІ БЕКІТ</small><h2 id="explain-title">Неліктен repeat({mission.target}) дұрыс?</h2><p>Дұрыс түсіндірмені таңда.</p><button autoFocus onClick={finish}>Әр бөлікке бір әрекет керек, барлығы {mission.target} бөлік.</button><button onClick={() => setResult('idle')}>Цикл компьютерді жылдамдатады.</button></section></div>}
    {result === 'success' && <div className="lesson-modal-backdrop"><section className="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title"><span><CheckCircle2 /></span><small>МИССИЯ ОРЫНДАЛДЫ</small><h2 id="success-title">{mission.worldEffect}</h2><div><b>{alreadyDone ? 'ҚАЙТА ӨТУ' : '+30 XP'}</b><b>{alreadyDone ? 'МАРАПАТСЫЗ' : '+10 монета'}</b></div><p>{alreadyDone ? 'Бұл миссия бұрын орындалған, сондықтан марапат қайта берілмейді.' : 'Сен циклдің қайталану санын дұрыс таңдадың және шешіміңді түсіндірдің.'}</p><button autoFocus onClick={onBack}>Картаға оралу</button></section></div>}
  </main>
}
