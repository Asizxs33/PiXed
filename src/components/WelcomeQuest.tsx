import { useMemo, useState } from 'react'
import { ArrowRight, BrainCircuit, Check, ChevronDown, Code2, Compass, Gamepad2, Lightbulb, Users, WandSparkles, X } from 'lucide-react'

export type LearnerType = 'Explorer' | 'Strategist' | 'Creator' | 'Teammate'
export type LearnerProfile = {
  name: string
  age: string
  gender: string
  favoriteSubject: string
  learnerType: LearnerType
}

export const learnerProfileKey = 'pixed-player-profile-v2'

export function loadLearnerProfile(): LearnerProfile | null {
  try {
    const stored = localStorage.getItem(learnerProfileKey)
    return stored ? JSON.parse(stored) as LearnerProfile : null
  } catch {
    return null
  }
}

const results: Record<LearnerType, { title: string; note: string; icon: typeof Compass; color: string }> = {
  Explorer: { title: 'Curious Explorer', note: 'You learn best by testing ideas, noticing details, and discovering how things work.', icon: Compass, color: '#4ee8ff' },
  Strategist: { title: 'Smart Strategist', note: 'You break big challenges into clear steps and build reliable solutions.', icon: BrainCircuit, color: '#c58cff' },
  Creator: { title: 'Bold Creator', note: 'You enjoy inventing fresh answers and turning unusual ideas into something real.', icon: WandSparkles, color: '#ffd34d' },
  Teammate: { title: 'Team Guide', note: 'You learn by sharing ideas, helping others, and making the whole team stronger.', icon: Users, color: '#65ff9a' },
}

const questions: Array<{ title: string; text: string; answers: Array<{ label: string; type: LearnerType; icon: typeof Compass }> }> = [
  { title: 'The bridge is offline', text: 'Your pet is waiting on the other side. What do you try first?', answers: [
    { label: 'Test the controls', type: 'Explorer', icon: Compass }, { label: 'Make a step-by-step plan', type: 'Strategist', icon: BrainCircuit },
    { label: 'Build a new path', type: 'Creator', icon: WandSparkles }, { label: 'Ask the team for ideas', type: 'Teammate', icon: Users },
  ] },
  { title: 'The robot is stuck', text: 'It repeats the wrong move. How do you solve it?', answers: [
    { label: 'Watch what changes', type: 'Explorer', icon: Compass }, { label: 'Check every code line', type: 'Strategist', icon: BrainCircuit },
    { label: 'Write a different command', type: 'Creator', icon: WandSparkles }, { label: 'Explain the bug to a friend', type: 'Teammate', icon: Users },
  ] },
  { title: 'One chance to light the beacon', text: 'The island is counting on you. What is your final move?', answers: [
    { label: 'Search for a hidden clue', type: 'Explorer', icon: Compass }, { label: 'Check every condition', type: 'Strategist', icon: BrainCircuit },
    { label: 'Try an original solution', type: 'Creator', icon: WandSparkles }, { label: 'Give everyone a role', type: 'Teammate', icon: Users },
  ] },
]

export function WelcomeQuest({ onClose, onComplete }: { onClose: () => void; onComplete: (profile: LearnerProfile) => void }) {
  const [screen, setScreen] = useState<'profile' | 'quiz' | 'result'>('profile')
  const [question, setQuestion] = useState(0)
  const [answers, setAnswers] = useState<LearnerType[]>([])
  const [name, setName] = useState('')
  const [age, setAge] = useState('10–12')
  const [gender, setGender] = useState('Prefer not to say')
  const [favoriteSubject, setFavoriteSubject] = useState('Coding')

  const learnerType = useMemo<LearnerType>(() => {
    const score = answers.reduce<Record<LearnerType, number>>((all, value) => ({ ...all, [value]: all[value] + 1 }), { Explorer: 0, Strategist: 0, Creator: 0, Teammate: 0 })
    return (Object.entries(score).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Explorer') as LearnerType
  }, [answers])

  const answer = (type: LearnerType) => {
    setAnswers(current => [...current, type])
    if (question === questions.length - 1) setScreen('result')
    else setQuestion(current => current + 1)
  }

  const profile: LearnerProfile = { name: name.trim(), age, gender, favoriteSubject, learnerType }
  const result = results[learnerType]
  const ResultIcon = result.icon
  const progress = screen === 'profile' ? 20 : screen === 'quiz' ? 42 + question * 20 : 100

  return <div className="welcome-backdrop" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
    <section className="welcome-window">
      <header><span><Gamepad2 /></span><div><small>PIXED • NEW PLAYER</small><b>{screen === 'profile' ? 'Create your profile' : screen === 'quiz' ? 'Discovery quest' : 'Profile complete'}</b></div><button onClick={onClose} aria-label="Close"><X /></button></header>
      <div className="welcome-progress"><i style={{ width: `${progress}%` }} /></div>

      {screen === 'profile' && <div className="welcome-body profile-form">
        <small className="window-kicker">STEP 1 • ABOUT YOU</small><h2 id="welcome-title">Build your player card</h2><p>We use this to make your first quests clear, friendly, and the right level for you.</p>
        <label><span>Player name</span><input autoFocus maxLength={18} value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Alex" /></label>
        <div className="field-row">
          <label><span>Age group</span><select value={age} onChange={event => setAge(event.target.value)}><option>7–9</option><option>10–12</option><option>13–15</option><option>16–17</option></select><ChevronDown /></label>
          <label><span>Gender</span><select value={gender} onChange={event => setGender(event.target.value)}><option>Prefer not to say</option><option>Girl</option><option>Boy</option><option>Another identity</option></select><ChevronDown /></label>
        </div>
        <fieldset className="subject-pick"><legend>What sounds most fun?</legend>{['Coding', 'Math', 'Science', 'Logic'].map(subject => <button type="button" key={subject} className={favoriteSubject === subject ? 'selected' : ''} onClick={() => setFavoriteSubject(subject)}>{subject === 'Coding' ? <Code2 /> : subject === 'Logic' ? <BrainCircuit /> : <Lightbulb />}{subject}</button>)}</fieldset>
        <button className="welcome-primary" disabled={!name.trim()} onClick={() => setScreen('quiz')}>Play 3-question quest <ArrowRight /></button><small className="local-note">Saved only on this device</small>
      </div>}

      {screen === 'quiz' && <div className="welcome-body quiz-body">
        <small className="window-kicker">QUESTION {question + 1} OF 3</small><div className="mini-scene" aria-hidden="true"><span>✦</span><i /><i /><i /></div>
        <h2 id="welcome-title">{questions[question].title}</h2><p>{questions[question].text}</p>
        <div className="answer-list">{questions[question].answers.map(({ label, type, icon: Icon }) => <button key={type} onClick={() => answer(type)}><Icon /><b>{label}</b><ArrowRight /></button>)}</div>
        <small className="local-note">There is no wrong answer. Pick what feels natural.</small>
      </div>}

      {screen === 'result' && <div className="welcome-body result-body">
        <small className="window-kicker">YOUR PLAYER STYLE</small><div className="result-icon" style={{ '--result-color': result.color } as React.CSSProperties}><ResultIcon /></div>
        <small>{profile.name.toUpperCase()} • AGE {profile.age}</small><h2 id="welcome-title">{result.title}</h2><b>{learnerType} path</b><p>{result.note}</p>
        <div className="result-facts"><span><Check /> First subject: {favoriteSubject}</span><span><Check /> Quests fit your age group</span></div>
        <button className="welcome-primary" onClick={() => onComplete(profile)}>Enter PiXed <ArrowRight /></button>
      </div>}
    </section>
  </div>
}
