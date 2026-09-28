import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BookOpen, BrainCircuit, Check, ChevronDown, Code2, Compass, Gamepad2, Lightbulb, Sparkles, Users, WandSparkles, X } from 'lucide-react'
import type { PlayerProgress, View } from '../domain/game'
import { missions } from '../domain/game'
import { PixelHero, PixelPet } from './PixelCharacter'

type LearnerProfile = { name: string; age: string; gender: string; interest: string; archetype: ArchetypeId }
type ArchetypeId = 'explorer' | 'strategist' | 'creator' | 'teammate'

const profileKey = 'pixed-learner-profile-v1'
const archetypes: Record<ArchetypeId, { title: string; badge: string; description: string; icon: typeof Compass }> = {
  explorer: { title: 'Зерек зерттеуші', badge: 'Бақылау + тәжірибе', description: 'Сен жаңа нәрсені байқап, өзің тексергенді ұнатасың. Саған қысқа тәжірибелер мен жасырын жолдар сай келеді.', icon: Compass },
  strategist: { title: 'Жүйелі стратег', badge: 'Жоспар + логика', description: 'Сен үлкен тапсырманы бөліктерге бөліп, сенімді шешім құрасың. Күрделі алгоритмдер сенің күшің.', icon: BrainCircuit },
  creator: { title: 'Еркін құрастырушы', badge: 'Идея + шығармашылық', description: 'Сен дайын жолмен шектелмей, жаңа шешім ойлап табасың. Ашық тапсырмаларда ерекше нәтиже көрсетесің.', icon: WandSparkles },
  teammate: { title: 'Сенімді серіктес', badge: 'Түсіндіру + команда', description: 'Сен ойыңмен бөлісіп, басқалармен бірге шешім тапқанды ұнатасың. Командалық миссиялар саған жақын.', icon: Users },
}

const questions: Array<{ title: string; text: string; options: Array<{ label: string; trait: ArchetypeId; icon: typeof Compass }> }> = [
  { title: 'Көпір істемей қалды', text: 'Арчи арғы бетте күтіп тұр. Алдымен не істейсің?', options: [
    { label: 'Тетіктерді байқап көремін', trait: 'explorer', icon: Compass }, { label: 'Қадамдарға бөліп жоспарлаймын', trait: 'strategist', icon: BrainCircuit },
    { label: 'Жаңа жол құрастырамын', trait: 'creator', icon: WandSparkles }, { label: 'Командамен ақылдасамын', trait: 'teammate', icon: Users },
  ] },
  { title: 'Робот қате команда алды', text: 'Ол бір әрекетті қайта-қайта орындап тұр. Қай жолды таңдайсың?', options: [
    { label: 'Нәтижені бақылап, себеп іздеймін', trait: 'explorer', icon: Compass }, { label: 'Кодты жол-жол тексеремін', trait: 'strategist', icon: BrainCircuit },
    { label: 'Басқа алгоритм жазамын', trait: 'creator', icon: WandSparkles }, { label: 'Шешімімді досыма түсіндіремін', trait: 'teammate', icon: Users },
  ] },
  { title: 'Маяқты оятатын бір мүмкіндік бар', text: 'Соңғы әрекетің қандай болады?', options: [
    { label: 'Құпия белгілерді зерттеймін', trait: 'explorer', icon: Compass }, { label: 'Барлық шартты қайта санаймын', trait: 'strategist', icon: BrainCircuit },
    { label: 'Ерекше шешім сынаймын', trait: 'creator', icon: WandSparkles }, { label: 'Барлығына рөл бөліп беремін', trait: 'teammate', icon: Users },
  ] },
]

function loadProfile(): LearnerProfile | null {
  try { const raw = localStorage.getItem(profileKey); return raw ? JSON.parse(raw) as LearnerProfile : null } catch { return null }
}

function Onboarding({ onClose, onComplete }: { onClose: () => void; onComplete: (profile: LearnerProfile) => void }) {
  const [step, setStep] = useState(0)
  const [question, setQuestion] = useState(0)
  const [answers, setAnswers] = useState<ArchetypeId[]>([])
  const [name, setName] = useState('')
  const [age, setAge] = useState('10–12')
  const [gender, setGender] = useState('Айтқым келмейді')
  const [interest, setInterest] = useState('Бағдарламалау')
  const archetype = useMemo<ArchetypeId>(() => {
    const score = answers.reduce<Record<ArchetypeId, number>>((all, answer) => ({ ...all, [answer]: all[answer] + 1 }), { explorer: 0, strategist: 0, creator: 0, teammate: 0 })
    return (Object.entries(score).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'explorer') as ArchetypeId
  }, [answers])
  const chooseAnswer = (trait: ArchetypeId) => { setAnswers(current => [...current, trait]); if (question < questions.length - 1) setQuestion(current => current + 1); else setStep(2) }
  const result = archetypes[archetype]
  const ResultIcon = result.icon

  return <div className="onboarding-backdrop" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
    <section className="onboarding-panel">
      <header><span className="onboarding-logo"><Gamepad2 /></span><div><small>PIxED • ЖЕКЕ САПАР</small><b>{step === 0 ? 'Профильді бастау' : step === 1 ? 'Танысу миссиясы' : 'Зерттеуші анықталды'}</b></div><button onClick={onClose} aria-label="Жабу"><X /></button></header>
      <div className="onboarding-meter"><i style={{ width: `${step === 0 ? 22 : step === 1 ? 45 + question * 18 : 100}%` }} /></div>
      {step === 0 && <div className="onboarding-step identity-step">
        <span className="step-kicker">01 • ТАНЫСАЙЫҚ</span><h2 id="onboarding-title">Сапарды өзіңе бейімдейік</h2>
        <p>Бұл мәліметтер тапсырмалардың тілін, күрделілігін және алғашқы бағытын таңдауға көмектеседі.</p>
        <label className="name-field"><span>Ойындағы атың</span><input autoFocus maxLength={18} value={name} onChange={event => setName(event.target.value)} placeholder="Мысалы: Айару" /></label>
        <div className="onboarding-fields">
          <label><span>Жас тобы</span><select value={age} onChange={event => setAge(event.target.value)}><option>7–9</option><option>10–12</option><option>13–15</option><option>16–17</option></select><ChevronDown /></label>
          <label><span>Жынысы</span><select value={gender} onChange={event => setGender(event.target.value)}><option>Айтқым келмейді</option><option>Қыз</option><option>Ұл</option></select><ChevronDown /></label>
        </div>
        <fieldset className="interest-picker"><legend>Қай бағыт қызықты?</legend>{['Бағдарламалау', 'Математика', 'Ғылым', 'Логика'].map(item => <button type="button" key={item} className={interest === item ? 'selected' : ''} onClick={() => setInterest(item)}>{item === 'Бағдарламалау' ? <Code2 /> : item === 'Логика' ? <BrainCircuit /> : <Lightbulb />}{item}</button>)}</fieldset>
        <button className="onboarding-primary" disabled={!name.trim()} onClick={() => setStep(1)}>Мини-ойынды бастау <ArrowRight /></button><small className="privacy-note">Профиль осы құрылғыда ғана сақталады</small>
      </div>}
      {step === 1 && <div className="onboarding-step quest-step">
        <span className="step-kicker">СЫНАҚ {question + 1}/{questions.length}</span><div className="quest-scene" aria-hidden="true"><span className="quest-beacon">✦</span><PixelPet pet={{ name: 'Арчи', color: '#6ce7ff', ears: 'pointed' }} /><i /><i /><i /></div>
        <h2 id="onboarding-title">{questions[question].title}</h2><p>{questions[question].text}</p>
        <div className="quest-options">{questions[question].options.map(({ label, trait, icon: Icon }) => <button key={trait} onClick={() => chooseAnswer(trait)}><Icon /><span>{label}</span><ArrowRight /></button>)}</div>
        <small className="choice-note">Дұрыс немесе қате жауап жоқ — өзіңе жақын жолды таңда</small>
      </div>}
      {step === 2 && <div className="onboarding-step result-step">
        <span className="step-kicker">ПРОФИЛЬ ДАЙЫН</span><div className={`archetype-emblem ${archetype}`}><ResultIcon /></div><small>{name.trim().toUpperCase()} • {age} ЖАС</small><h2 id="onboarding-title">{result.title}</h2><b>{result.badge}</b><p>{result.description}</p>
        <div className="profile-summary"><span><Check /> Бастапқы бағыт: {interest}</span><span><Check /> Тапсырмалар жас тобыңа бейімделеді</span></div>
        <button className="onboarding-primary" onClick={() => onComplete({ name: name.trim(), age, gender, interest, archetype })}>Алғашқы миссияны бастау <ArrowRight /></button>
      </div>}
    </section>
  </div>
}

export function HomePage({ progress, onNavigate: _onNavigate, onStartMission }: { progress: PlayerProgress; onNavigate: (view: View) => void; onStartMission: (id: string) => void }) {
  const nextMission = missions.find(mission => !progress.completed.includes(mission.id)) ?? missions[missions.length - 1]
  const completePercent = Math.round((progress.completed.length / missions.length) * 100)
  const [reduceMotion, setReduceMotion] = useState(true)
  const [profile, setProfile] = useState<LearnerProfile | null>(loadProfile)
  const [showOnboarding, setShowOnboarding] = useState(false)
  useEffect(() => { const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduceMotion(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update) }, [])
  const begin = () => profile ? onStartMission(nextMission.id) : setShowOnboarding(true)
  const completeOnboarding = (nextProfile: LearnerProfile) => { localStorage.setItem(profileKey, JSON.stringify(nextProfile)); setProfile(nextProfile); setShowOnboarding(false); onStartMission(nextMission.id) }

  return <main className="home-page">
    <section className="campaign-hero campaign-hero--focused">
      {!reduceMotion && <video className="campaign-film" autoPlay muted loop playsInline preload="auto" poster="/assets/archipelago-campaign.png" aria-hidden="true"><source src="/assets/archipelago-loop.mp4" type="video/mp4" /></video>}
      <div className="campaign-clouds" aria-hidden="true"><i /><i /><i /></div><div className="campaign-wind" aria-hidden="true"><i /><i /><i /><i /><i /></div><div className="campaign-water" aria-hidden="true"><i /><i /><i /></div><div className="campaign-light" aria-hidden="true" /><div className="campaign-scrim" />
      <div className="campaign-copy">
        <span className="eyebrow"><Sparkles /> {profile ? `${profile.name}, сапарыңды жалғастыр` : 'Біліммен әлемді өзгерт'}</span>
        <h1>Оқы. Құр.<br/><em>Әлемді оят.</em></h1><p>Код жазып, жұмбақ шеш. Әр жаңа білімің Архипелагты тірілтеді.</p>
        <button className="primary-cta hero-main-cta" onClick={begin}><Gamepad2 />Ойынды бастау <ArrowRight /></button>
        <article className="current-mission"><span className="mission-index">{nextMission.chapter}</span><div><small>ҚАЗІРГІ МИССИЯ</small><b>{nextMission.title}</b><p>{nextMission.objective}</p></div><strong>{progress.completed.length}/{missions.length}</strong><i><u style={{ width: `${completePercent}%` }} /></i></article>
      </div>
      <div className="hero-party" aria-hidden="true"><PixelHero avatar={progress.avatar} large /><PixelPet pet={progress.pet} /></div><div className="hero-scroll-cue" aria-hidden="true"><ChevronDown /></div>
    </section>
    <section className="learning-route" aria-label="Оқу жолы"><header><span>БІР МИССИЯ • БІР ЖАҢА ДАҒДЫ</span><h2>Білгенің бірден іске айналады</h2></header><ol>
      <li><span>01</span><div><b>Түсін</b><small>Қысқа әрі анық мысал</small></div></li><li><span>02</span><div><b>Қолданып көр</b><small>Кодпен әлемді басқар</small></div></li><li><span>03</span><div><b>Нәтижесін көр</b><small>Миссияны аяқтап, әлемді өзгерт</small></div></li>
    </ol><p><BookOpen /> Сабақ ойынның ішінде өтеді. Әр әрекет оқу мақсатына қызмет етеді.</p></section>
    {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} onComplete={completeOnboarding} />}
  </main>
}
