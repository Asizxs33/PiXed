import { useState } from 'react'
import { ArrowRight, Atom, BrainCircuit, Check, Code2, FlaskConical, RotateCcw, Sigma, Sparkles } from 'lucide-react'
import { subjectChallenges, type PlayerProgress, type SubjectId } from '../domain/game'

const subjects: Array<{ id: SubjectId; icon: typeof Code2; tone: string }> = [
  { id: 'coding', icon: Code2, tone: 'cyan' },
  { id: 'math', icon: Sigma, tone: 'violet' },
  { id: 'science', icon: FlaskConical, tone: 'green' },
  { id: 'logic', icon: BrainCircuit, tone: 'gold' },
]

export function Academy({ progress, onComplete }: { progress: PlayerProgress; onComplete: (subject: SubjectId, score: number) => void }) {
  const [subject, setSubject] = useState<SubjectId>('coding')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [rewardEarned, setRewardEarned] = useState(false)
  const challenge = subjectChallenges[subject]
  const question = challenge.questions[questionIndex]

  const chooseSubject = (next: SubjectId) => {
    setSubject(next); setQuestionIndex(0); setSelected(null); setScore(0); setFinished(false); setRewardEarned(false)
  }

  const chooseAnswer = (answer: number) => {
    if (selected !== null) return
    setSelected(answer)
    if (answer === question.answer) setScore(current => current + 1)
  }

  const next = () => {
    const finalScore = score + (selected === question.answer ? 0 : 0)
    if (questionIndex === challenge.questions.length - 1) {
      setRewardEarned(!progress.practiceCompleted.includes(subject))
      setFinished(true)
      onComplete(subject, finalScore)
      return
    }
    setQuestionIndex(index => index + 1)
    setSelected(null)
  }

  return <main className="page-shell academy-page">
    <header className="page-title"><span><Atom /></span><div><small>ПӘНДЕР АРХИПЕЛАГЫ</small><h1>Білім зертханасы</h1><p>Қысқа сабақ емес: жауап бер, түсіндірмені оқы және шеберлігіңді өсір.</p></div></header>
    <section className="subject-tabs" aria-label="Пән таңдау">
      {subjects.map(({ id, icon: Icon, tone }) => <button key={id} className={`${subject === id ? 'active' : ''} tone-${tone}`} onClick={() => chooseSubject(id)}><Icon /><span>{subjectChallenges[id].label}<small>{progress.subjectMastery[id]}% шеберлік</small></span></button>)}
    </section>
    <div className="academy-layout">
      <section className="practice-card">
        {!finished ? <>
          <header><span>{challenge.title}</span><b>{questionIndex + 1}/{challenge.questions.length}</b></header>
          <div className="practice-progress"><i style={{ width: `${((questionIndex + 1) / challenge.questions.length) * 100}%` }} /></div>
          <small>ЗЕРТТЕУ СҰРАҒЫ</small><h2>{question.prompt}</h2>
          <div className="answer-grid">{question.options.map((option, index) => {
            const answered = selected !== null
            const state = answered ? index === question.answer ? 'correct' : index === selected ? 'wrong' : '' : ''
            return <button key={option} className={state} onClick={() => chooseAnswer(index)} disabled={answered}><b>{String.fromCharCode(65 + index)}</b>{option}{state === 'correct' && <Check />}</button>
          })}</div>
          {selected !== null && <div className={`explanation ${selected === question.answer ? 'correct' : 'wrong'}`}><b>{selected === question.answer ? 'Дұрыс шешім' : 'Қайта ойлануға себеп'}</b><p>{question.explanation}</p><button onClick={next}>{questionIndex === challenge.questions.length - 1 ? 'Нәтижені көру' : 'Келесі сұрақ'} <ArrowRight /></button></div>}
        </> : <div className="practice-result"><span><Sparkles /></span><small>ЗЕРТХАНА АЯҚТАЛДЫ</small><h2>{score}/{challenge.questions.length} дұрыс жауап</h2><p>{score === 3 ? 'Тамаша! Білімді жаңа жағдайда қолдана алдың.' : 'Түсіндірмелерді қарап шықтың. Енді қайта орындап, нәтижеңді жақсарт.'}</p><div>{rewardEarned ? <><b>+20 XP</b><b>+5 монета</b></> : <b>Шеберлік жаңартылды</b>}</div><button onClick={() => chooseSubject(subject)}><RotateCcw /> Қайта жаттығу</button></div>}
      </section>
      <aside className="mastery-panel"><small>ШЕБЕРЛІК КАРТАСЫ</small><h2>Жалпы прогресс</h2><p>Әр пәндегі нәтиже бір профильде сақталады. Марапат тек алғашқы толық аяқтауда беріледі.</p>{subjects.map(({ id, icon: Icon }) => <div key={id}><Icon /><span><b>{subjectChallenges[id].label}</b><i><u style={{ width: `${progress.subjectMastery[id]}%` }} /></i></span><strong>{progress.subjectMastery[id]}%</strong></div>)}</aside>
    </div>
  </main>
}
