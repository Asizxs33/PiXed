import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Bird, Bot, BrainCircuit, Cat, Check, ChevronDown, Code2, Compass, Gamepad2, Lightbulb, Sparkles, Users, WandSparkles, X } from 'lucide-react'

export type LearnerType = 'Explorer' | 'Strategist' | 'Creator' | 'Teammate'
export type AvatarChoice = 'girl' | 'boy'
export type PetChoice = 'fox' | 'bot' | 'owl'
export type LearnerProfile = { name: string; age: string; gender: string; favoriteSubject: string; learnerType: LearnerType; avatar: AvatarChoice; pet: PetChoice; petName: string }
export const learnerProfileKey = 'pixed-player-profile-v3'

export function loadLearnerProfile(): LearnerProfile | null {
  try { const value = localStorage.getItem(learnerProfileKey); return value ? JSON.parse(value) as LearnerProfile : null } catch { return null }
}

export function PlayerAvatar({ choice, large = false }: { choice: AvatarChoice; large?: boolean }) {
  return <span className={`chosen-avatar chosen-avatar--${choice} ${large ? 'chosen-avatar--large' : ''}`} aria-label={`${choice} character`}><i className="chosen-hair"/><i className="chosen-face"/><i className="chosen-body"/><i className="chosen-feet"/></span>
}

const pets = { fox: { name: 'Nova', label: 'Sky Fox', icon: Cat, color: '#4ee8ff' }, bot: { name: 'Byte', label: 'Mini Bot', icon: Bot, color: '#ffd34d' }, owl: { name: 'Orbit', label: 'Star Owl', icon: Bird, color: '#c58cff' } } as const
export function PetAvatar({ choice, large = false }: { choice: PetChoice; large?: boolean }) { const pet = pets[choice]; const Icon = pet.icon; return <span className={`chosen-pet ${large ? 'chosen-pet--large' : ''}`} style={{ '--pet-color': pet.color } as React.CSSProperties} aria-label={pet.label}><Icon /></span> }

const resultInfo: Record<LearnerType, { title: string; note: string; icon: typeof Compass; color: string }> = {
  Explorer: { title: 'Curious Explorer', note: 'You learn by testing ideas and discovering how things work.', icon: Compass, color: '#4ee8ff' },
  Strategist: { title: 'Smart Strategist', note: 'You turn big challenges into clear, reliable steps.', icon: BrainCircuit, color: '#c58cff' },
  Creator: { title: 'Bold Creator', note: 'You invent fresh answers and enjoy building new things.', icon: WandSparkles, color: '#ffd34d' },
  Teammate: { title: 'Team Guide', note: 'You grow by sharing ideas and making the team stronger.', icon: Users, color: '#65ff9a' },
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
  const progress = step === 'profile' ? 12 : step === 'quiz' ? 27 + question * 14 : step === 'avatar' ? 72 : step === 'pet' ? 88 : 100
  const title = step === 'profile' ? 'Tell us about you' : step === 'quiz' ? `Quick quest ${question + 1}/3` : step === 'avatar' ? 'Choose your hero' : step === 'pet' ? 'Choose your pet' : 'Adventure ready'

  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="setup-backdrop" role="dialog" aria-modal="true" aria-labelledby="setup-title">
    <section className="setup-window">
      <header><span><Gamepad2 /></span><div><small>PIXED PLAYER SETUP</small><b>{title}</b></div><button onClick={onClose} aria-label="Close"><X /></button></header>
      <div className="setup-progress"><i style={{ width: `${progress}%` }} /></div>
      <AnimatePresence mode="wait">
        {step === 'profile' && <motion.div key="profile" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="setup-body profile-step">
          <small className="step-label">STEP 1 OF 4</small><h2 id="setup-title">Create your player</h2><p>Three simple details help us make the first experience feel right for you.</p>
          <label><span>Name</span><input autoFocus maxLength={18} value={name} onChange={event => setName(event.target.value)} placeholder="Your player name" /></label>
          <div className="setup-field-row"><label><span>Age group</span><select value={age} onChange={event => setAge(event.target.value)}><option>7–9</option><option>10–12</option><option>13–15</option><option>16–17</option></select><ChevronDown /></label><label><span>Gender</span><select value={gender} onChange={event => setGender(event.target.value)}><option>Prefer not to say</option><option>Girl</option><option>Boy</option><option>Another identity</option></select><ChevronDown /></label></div>
          <fieldset className="setup-subjects"><legend>Favorite subject</legend>{['Coding','Math','Science','Logic'].map(subject => <button type="button" key={subject} className={subject === favoriteSubject ? 'selected' : ''} onClick={() => setFavoriteSubject(subject)}>{subject === 'Coding' ? <Code2/> : subject === 'Logic' ? <BrainCircuit/> : <Lightbulb/>}{subject}</button>)}</fieldset>
          <button className="setup-next" disabled={!name.trim()} onClick={() => setStep('quiz')}>Play the mini game <ArrowRight /></button>
        </motion.div>}

        {step === 'quiz' && <motion.div key={`quiz-${question}`} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.03 }} className="setup-body quiz-step">
          <div className="effect-scene" aria-hidden="true"><span className="effect-beacon">✦</span>{[0,1,2,3,4,5].map(n => <i key={n} />)}<b>{question + 1}</b></div>
          <small className="step-label">QUESTION {question + 1} OF 3</small><h2 id="setup-title">{questions[question].title}</h2><p>{questions[question].text}</p>
          <div className="setup-answers">{questions[question].answers.map(({ label, type, icon: Icon }) => <button key={type} onClick={() => answer(type)}><Icon/><b>{label}</b><ArrowRight/></button>)}</div><small className="setup-note">No wrong answers — choose what feels natural.</small>
        </motion.div>}

        {step === 'avatar' && <motion.div key="avatar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="setup-body choice-step">
          <small className="step-label">STEP 3 OF 4</small><h2 id="setup-title">Choose your hero</h2><p>This is your character in every PiXed world. You can change it later.</p>
          <div className="avatar-options"><button className={avatar === 'girl' ? 'selected' : ''} onClick={() => setAvatar('girl')}><PlayerAvatar choice="girl" large/><span><b>Nova</b><small>Girl explorer</small></span>{avatar === 'girl' && <Check/>}</button><button className={avatar === 'boy' ? 'selected' : ''} onClick={() => setAvatar('boy')}><PlayerAvatar choice="boy" large/><span><b>Max</b><small>Boy explorer</small></span>{avatar === 'boy' && <Check/>}</button></div>
          <button className="setup-next" onClick={() => setStep('pet')}>Choose a pet <ArrowRight /></button>
        </motion.div>}

        {step === 'pet' && <motion.div key="pet" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="setup-body choice-step">
          <small className="step-label">STEP 4 OF 4</small><h2 id="setup-title">Pick your companion</h2><p>Your pet follows you through lessons and celebrates every win.</p>
          <div className="pet-options">{(Object.entries(pets) as Array<[PetChoice, typeof pets[PetChoice]]>).map(([id, item]) => <button key={id} className={pet === id ? 'selected' : ''} onClick={() => setPet(id)}><PetAvatar choice={id} large/><span><b>{item.name}</b><small>{item.label}</small></span>{pet === id && <Check/>}</button>)}</div>
          <button className="setup-next" onClick={() => setStep('ready')}>Build my profile <Sparkles /></button>
        </motion.div>}

        {step === 'ready' && <motion.div key="ready" initial={{ opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }} className="setup-body ready-step">
          <div className="ready-burst" aria-hidden="true">{[0,1,2,3,4,5,6,7].map(n => <i key={n}/>)}</div><small className="step-label">PLAYER READY</small><div className="ready-party"><PlayerAvatar choice={avatar} large/><PetAvatar choice={pet} large/></div><h2 id="setup-title">{name}, you are a<br/><strong>{resultInfo[learnerType].title}</strong></h2><p>{resultInfo[learnerType].note}</p><div className="ready-tags"><span><Check/> {favoriteSubject}</span><span><Check/> {pets[pet].name} joined you</span></div><button className="setup-next" onClick={() => onComplete(profile)}>Open the game world <ArrowRight /></button>
        </motion.div>}
      </AnimatePresence>
    </section>
  </motion.div>
}
