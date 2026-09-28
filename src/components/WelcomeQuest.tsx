import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HeroSprite, CompanionSprite } from './PixelCharacters'
import { ArrowRight, BrainCircuit, Check, Code2, Compass, Gamepad2, Lightbulb, Sparkles, Users, WandSparkles, X } from './PixelIcons'

export type LearnerType = 'Explorer' | 'Strategist' | 'Creator' | 'Teammate'
export type AvatarChoice = 'girl' | 'boy'
export type PetChoice = 'fox' | 'bot' | 'owl'
export type LearnerProfile = { name: string; age: string; gender: string; favoriteSubject: string; learnerType: LearnerType; avatar: AvatarChoice; pet: PetChoice; petName: string }
export const learnerProfileKey = 'pixed-player-profile-v3'

export function loadLearnerProfile(): LearnerProfile | null {
  try {
    const raw = localStorage.getItem(learnerProfileKey)
    if (!raw) return null
    const value = JSON.parse(raw) as Partial<LearnerProfile>
    if (typeof value.name !== 'string' || !value.name.trim() || !['girl','boy'].includes(value.avatar ?? '') || !['fox','bot','owl'].includes(value.pet ?? '') || !['Explorer','Strategist','Creator','Teammate'].includes(value.learnerType ?? '') || typeof value.age !== 'string' || typeof value.favoriteSubject !== 'string' || typeof value.petName !== 'string') return null
    return value as LearnerProfile
  } catch { return null }
}

export const PlayerAvatar = HeroSprite
export const PetAvatar = CompanionSprite
const pets = { fox: { name: 'Nova', label: 'Sky Fox' }, bot: { name: 'Byte', label: 'Mini Bot' }, owl: { name: 'Orbit', label: 'Star Owl' } } as const

const resultInfo: Record<LearnerType, { title: string; note: string; icon: typeof Compass; color: string }> = {
  Explorer: { title: 'Curious Explorer', note: 'Your choices today suggest you enjoy testing ideas and discovering how things work.', icon: Compass, color: '#4ee8ff' },
  Strategist: { title: 'Smart Strategist', note: 'Your choices today suggest you like turning big challenges into clear steps.', icon: BrainCircuit, color: '#c58cff' },
  Creator: { title: 'Bold Creator', note: 'Your choices today suggest you enjoy inventing answers and building new things.', icon: WandSparkles, color: '#ffd34d' },
  Teammate: { title: 'Team Guide', note: 'Your choices today suggest you enjoy sharing ideas and helping your team.', icon: Users, color: '#65ff9a' },
}

const questions: Array<{ title: string; text: string; answers: Array<{ label: string; type: LearnerType; icon: typeof Compass }> }> = [
  { title: 'A bridge is offline', text: 'Your pet is waiting. What do you try first?', answers: [{ label: 'Test the controls', type: 'Explorer', icon: Compass }, { label: 'Make a clear plan', type: 'Strategist', icon: BrainCircuit }, { label: 'Build a new path', type: 'Creator', icon: WandSparkles }, { label: 'Ask the team', type: 'Teammate', icon: Users }] },
  { title: 'A robot is stuck', text: 'It repeats the wrong move. How do you help?', answers: [{ label: 'Watch what changes', type: 'Explorer', icon: Compass }, { label: 'Check each code line', type: 'Strategist', icon: BrainCircuit }, { label: 'Write a new command', type: 'Creator', icon: WandSparkles }, { label: 'Explain the bug', type: 'Teammate', icon: Users }] },
  { title: 'The beacon needs power', text: 'You have one final move. What do you do?', answers: [{ label: 'Find a hidden clue', type: 'Explorer', icon: Compass }, { label: 'Check every condition', type: 'Strategist', icon: BrainCircuit }, { label: 'Try an original idea', type: 'Creator', icon: WandSparkles }, { label: 'Give everyone a role', type: 'Teammate', icon: Users }] },
]

type Step = 'profile' | 'quiz' | 'avatar' | 'pet' | 'ready'

export function WelcomeQuest({ initialProfile, onClose, onComplete }: { initialProfile?: LearnerProfile | null; onClose: () => void; onComplete: (profile: LearnerProfile) => void }) {
  const [step, setStep] = useState<Step>(initialProfile ? 'avatar' : 'profile')
  const [question, setQuestion] = useState(0)
  const [detail, setDetail] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<LearnerType | null>(null)
  const panel = useRef<HTMLElement>(null)
  useEffect(() => { panel.current?.focus() }, [step, detail, question])
  useEffect(() => { const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous } }, [])
  const [answers, setAnswers] = useState<LearnerType[]>(initialProfile ? [initialProfile.learnerType] : [])
  const [name, setName] = useState(initialProfile?.name ?? '')
  const [age, setAge] = useState(initialProfile?.age ?? '10–12')
  const [gender, setGender] = useState(initialProfile?.gender ?? 'Prefer not to say')
  const [favoriteSubject, setFavoriteSubject] = useState(initialProfile?.favoriteSubject ?? 'Coding')
  const [avatar, setAvatar] = useState<AvatarChoice>(initialProfile?.avatar ?? 'girl')
  const [pet, setPet] = useState<PetChoice>(initialProfile?.pet ?? 'fox')

  const learnerType = useMemo<LearnerType>(() => {
    const score = answers.reduce<Record<LearnerType, number>>((all, value) => ({ ...all, [value]: all[value] + 1 }), { Explorer: 0, Strategist: 0, Creator: 0, Teammate: 0 })
    return (Object.entries(score).sort((a, b) => b[1] - a[1])[0]?.[0] ?? initialProfile?.learnerType ?? 'Explorer') as LearnerType
  }, [answers, initialProfile])
  const answer = (type: LearnerType) => { setAnswers(current => [...current, type]); if (question === 2) setStep('avatar'); else setQuestion(current => current + 1) }
  const profile: LearnerProfile = { name: name.trim(), age, gender, favoriteSubject, learnerType, avatar, pet, petName: pets[pet].name }
  const progress = step === 'profile' ? 5 + detail * 6 : step === 'quiz' ? 27 + question * 14 : step === 'avatar' ? 72 : step === 'pet' ? 88 : 100
  const title = step === 'profile' ? 'Tell us about you' : step === 'quiz' ? `Quick quest ${question + 1}/3` : step === 'avatar' ? 'Choose your hero' : step === 'pet' ? 'Choose your pet' : 'Adventure ready'

  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="setup-backdrop" role="dialog" aria-modal="true" aria-labelledby="setup-title">
    <section className="setup-window" ref={panel} tabIndex={-1} onKeyDown={event => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const nodes = panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, [tabindex="0"]')
        if (!nodes?.length) return
        const first = nodes[0], last = nodes[nodes.length - 1]
        if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }}>
      <header><span><Gamepad2 /></span><div><small>PIXED PLAYER SETUP</small><b>{title}</b></div><button onClick={onClose} aria-label="Close"><X /></button></header>
      <div className="setup-progress"><i style={{ width: `${progress}%` }} /></div>
      <AnimatePresence mode="wait">
        {step === 'profile' && <motion.form key={`profile-${detail}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="setup-body profile-step" onSubmit={event => { event.preventDefault(); if (!name.trim()) return; if (detail < 3) setDetail(detail + 1); else setStep('quiz') }}>
          <div className="step-companion"><PetAvatar choice="fox" large/><span>A little introduction<br/><b>One step at a time.</b></span></div>
          <small className="step-label">ABOUT YOU · {detail + 1} / 4</small>
          <h2 id="setup-title">{['What should we call you?', 'How old are you?', 'How do you identify?', 'What sparks your curiosity?'][detail]}</h2>
          <p>{['A nickname is perfect. This is your adventure.', 'Choose your age group for your first learning path.', 'You can also skip this. Every hero is open to everyone.', 'Pick the subject you would like to explore first.'][detail]}</p>
          {detail === 0 && <label><span>Player name</span><input autoFocus required maxLength={18} value={name} onChange={event => setName(event.target.value)} placeholder="Your nickname" autoComplete="off" /></label>}
          {detail === 1 && <div className="detail-options">{['7–9','10–12','13–15','16–17'].map(value => <button type="button" aria-pressed={age === value} className={age === value ? 'selected' : ''} key={value} onClick={() => setAge(value)}>{value}<small>years old</small></button>)}</div>}
          {detail === 2 && <div className="detail-options">{['Girl','Boy','Another identity','Prefer not to say'].map(value => <button type="button" aria-pressed={gender === value} className={gender === value ? 'selected' : ''} key={value} onClick={() => setGender(value)}>{value}</button>)}</div>}
          {detail === 3 && <fieldset className="setup-subjects"><legend>Your first interest</legend>{['Coding','Math','Science','Logic'].map(subject => <button type="button" aria-pressed={subject === favoriteSubject} key={subject} className={subject === favoriteSubject ? 'selected' : ''} onClick={() => setFavoriteSubject(subject)}>{subject === 'Coding' ? <Code2/> : subject === 'Logic' ? <BrainCircuit/> : <Lightbulb/>}{subject}</button>)}</fieldset>}
          <div className="step-controls">{detail > 0 && <button type="button" className="step-back" onClick={() => setDetail(detail - 1)}>Back</button>}<button type="submit" className="setup-next" disabled={!name.trim()}>{detail === 3 ? 'Begin the mini quest' : 'Continue'} <ArrowRight /></button></div>
        </motion.form>}

        {step === 'quiz' && <motion.div key={`quiz-${question}`} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.03 }} className="setup-body quiz-step">
          <div className={`quest-vignette quest-vignette-${question}`} aria-hidden="true"><PlayerAvatar choice={avatar} large/><div className="quest-landmark">{["⌘","⚙","✧"][question]}</div><PetAvatar choice={question === 1 ? "bot" : "fox"} large/></div>
          <small className="step-label">QUESTION {question + 1} OF 3</small><h2 id="setup-title">{questions[question].title}</h2><p>{questions[question].text}</p>
          <div className="setup-answers">{questions[question].answers.map(({ label, type, icon: Icon }) => <button key={type} aria-pressed={selectedAnswer === type} className={selectedAnswer === type ? "selected" : ""} onClick={() => setSelectedAnswer(type)}><Icon/><b>{label}</b><ArrowRight/></button>)}</div><small className="setup-note">No wrong answers — choose what feels natural.</small><button className="setup-next" disabled={!selectedAnswer} onClick={() => { if (selectedAnswer) { answer(selectedAnswer); setSelectedAnswer(null) } }}>{question === 2 ? "Meet your hero" : "Next chapter"}<ArrowRight/></button>
        </motion.div>}

        {step === 'avatar' && <motion.div key="avatar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="setup-body choice-step">
          <small className="step-label">STEP 3 OF 4</small><h2 id="setup-title">Choose your hero</h2><p>This is your character in every PiXed world. You can change it later.</p>
          <div className="avatar-options"><button className={avatar === 'girl' ? 'selected' : ''} aria-pressed={avatar === 'girl'} onClick={() => setAvatar('girl')}><PlayerAvatar choice="girl" large/><span><b>Luna</b><small>Girl explorer · curious & brave</small></span>{avatar === 'girl' && <Check/>}</button><button className={avatar === 'boy' ? 'selected' : ''} aria-pressed={avatar === 'boy'} onClick={() => setAvatar('boy')}><PlayerAvatar choice="boy" large/><span><b>Max</b><small>Boy explorer · kind & inventive</small></span>{avatar === 'boy' && <Check/>}</button></div>
          <button className="setup-next" onClick={() => setStep('pet')}>Choose a pet <ArrowRight /></button>
        </motion.div>}

        {step === 'pet' && <motion.div key="pet" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="setup-body choice-step">
          <small className="step-label">STEP 4 OF 4</small><h2 id="setup-title">Pick your companion</h2><p>Your pet follows you through lessons and celebrates every win.</p>
          <div className="pet-options">{(Object.entries(pets) as Array<[PetChoice, typeof pets[PetChoice]]>).map(([id, item]) => <button key={id} className={pet === id ? 'selected' : ''} aria-pressed={pet === id} onClick={() => setPet(id)}><PetAvatar choice={id} large/><span><b>{item.name}</b><small>{item.label}</small></span>{pet === id && <Check/>}</button>)}</div>
          <button className="setup-next" onClick={() => setStep('ready')}>Build my profile <Sparkles /></button>
        </motion.div>}

        {step === 'ready' && <motion.div key="ready" initial={{ opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }} className="setup-body ready-step">
          <div className="ready-burst" aria-hidden="true">{[0,1,2,3,4,5,6,7].map(n => <i key={n}/>)}</div><small className="step-label">PLAYER READY</small><div className="ready-party"><PlayerAvatar choice={avatar} large/><PetAvatar choice={pet} large/></div><h2 id="setup-title">{name}, you are a<br/><strong>{resultInfo[learnerType].title}</strong></h2><p>{resultInfo[learnerType].note}</p><div className="ready-tags"><span><Check/> {favoriteSubject}</span><span><Check/> {pets[pet].name} joined you</span></div><button className="setup-next" onClick={() => onComplete(profile)}>Open the game world <ArrowRight /></button>
        </motion.div>}
      </AnimatePresence>
    </section>
  </motion.div>
}
