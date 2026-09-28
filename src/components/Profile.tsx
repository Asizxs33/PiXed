import { BookOpen, Check, Circle, Coins, Flame, Gamepad2, Medal, Shield, Sparkles, Target } from 'lucide-react'
import { levelFor, missions, nextLevelXp, subjectChallenges, type PlayerProgress, type SubjectId, type View } from '../domain/game'
import { PixelHero, PixelPet } from './PixelCharacter'

const subjectIds: SubjectId[] = ['coding', 'math', 'science', 'logic']

export function Profile({ progress, onClaim, onNavigate }: { progress: PlayerProgress; onClaim: () => void; onNavigate: (view: View) => void }) {
  const dailyItems = [
    { label: 'Сюжеттік миссия орында', done: progress.daily.lessonDone, icon: BookOpen },
    { label: 'Пәндік зертхана аяқта', done: progress.daily.practiceDone, icon: Sparkles },
    { label: 'Арена матчын аяқта', done: progress.daily.arenaDone, icon: Gamepad2 },
  ]
  const dailyDone = dailyItems.filter(item => item.done).length
  const dailyReady = dailyDone === dailyItems.length
  const level = levelFor(progress.xp)
  const levelStart = (level - 1) * 200
  const levelEnd = nextLevelXp(progress.xp)
  const levelPercent = Math.min(100, ((progress.xp - levelStart) / Math.max(1, levelEnd - levelStart)) * 100)
  const strongest = subjectIds.reduce((best, id) => progress.subjectMastery[id] > progress.subjectMastery[best] ? id : best, 'coding' as SubjectId)
  const nextSubject = subjectIds.find(id => progress.subjectMastery[id] < 70) ?? 'logic'

  return <main className="page-shell profile-page">
    <header className="page-title"><span><Target /></span><div><small>БІРЫҢҒАЙ ОҚУ ПРОФИЛІ</small><h1>Зерттеуші панелі</h1><p>Сюжет, пәндер, арена және кейіпкер дамуы бір жерде көрінеді.</p></div></header>
    <section className="profile-overview">
      <div className="profile-party"><PixelHero avatar={progress.avatar} large /><PixelPet pet={progress.pet} /></div>
      <div className="profile-level"><small>{level} ДЕҢГЕЙ</small><h2>Архипелаг зерттеушісі</h2><p>{progress.pet.name} екеуің білім арқылы өшкен маяктарды қайта оятып жүрсіңдер.</p><div><i><u style={{ width: `${levelPercent}%` }} /></i><span>{progress.xp}/{levelEnd} XP</span></div></div>
      <div className="profile-stat"><Flame /><strong>{progress.streak}</strong><small>КҮНДІК STREAK</small></div>
      <div className="profile-stat"><Shield /><strong>{progress.arena.mmr}</strong><small>ARENA MMR</small></div>
    </section>
    <div className="profile-grid">
      <section className="daily-panel"><header><div><small>БҮГІНГІ МАРШРУТ</small><h2>Күнделікті экспедиция</h2></div><span>{dailyDone}/3</span></header><p>Үш түрлі әрекет оқу мен ойынның тепе-теңдігін сақтайды.</p>{dailyItems.map(({ label, done, icon: Icon }) => <div key={label} className={done ? 'done' : ''}><span>{done ? <Check /> : <Icon />}</span><b>{label}</b><small>{done ? 'Орындалды' : 'Күтіп тұр'}</small></div>)}<button disabled={!dailyReady || progress.daily.claimed} onClick={onClaim}>{progress.daily.claimed ? 'Марапат алынды' : dailyReady ? '40 XP + 25 монета алу' : 'Үш тапсырманы орында'}</button></section>
      <section className="insight-panel"><small>ЖЕКЕ ҰСЫНЫС</small><h2>Келесі тиімді қадам</h2><div className="insight-hero"><Sparkles /><span><b>{subjectChallenges[nextSubject].label}</b><p>{progress.subjectMastery[nextSubject]}% → келесі мақсат 70%</p></span></div><p>Ең мықты бағытың: <b>{subjectChallenges[strongest].label}</b>. Енді әлсіздеу бағытты бір қысқа жаттығумен теңестір.</p><button onClick={() => onNavigate('academy')}>Зертханаға өту</button></section>
      <section className="profile-mastery"><header><small>ПӘНДІК ШЕБЕРЛІК</small><h2>Білім картасы</h2></header>{subjectIds.map(id => <div key={id}><span><b>{subjectChallenges[id].label}</b><small>{progress.subjectMastery[id] >= 70 ? 'Тұрақты білім' : progress.subjectMastery[id] > 0 ? 'Дамып жатыр' : 'Басталмады'}</small></span><i><u style={{ width: `${progress.subjectMastery[id]}%` }} /></i><strong>{progress.subjectMastery[id]}%</strong></div>)}</section>
      <section className="collection-panel"><small>КОЛЛЕКЦИЯ</small><h2>Жинақталған прогресс</h2><div><Medal /><span><strong>{progress.trophies.length}</strong><small>Кубок</small></span></div><div><Coins /><span><strong>{progress.coins}</strong><small>Монета</small></span></div><div><BookOpen /><span><strong>{progress.completed.length}/{missions.length}</strong><small>Миссия</small></span></div><button onClick={() => onNavigate('trophies')}>Кубоктарды қарау</button></section>
    </div>
    <section className="parent-note"><Circle /><div><small>АТА-АНА МЕН МҰҒАЛІМГЕ</small><p>Прогресс тек ойын уақытымен өлшенбейді: миссия аяқтау, жаңа жағдайда дұрыс жауап беру және түсіндірмені оқу бірге есептеледі.</p></div></section>
  </main>
}
