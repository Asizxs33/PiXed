import { useState } from 'react'
import { Check, Crown, Shield, Sparkles, Swords, Target, X } from 'lucide-react'
import { subjectChallenges, type PlayerProgress } from '../domain/game'

const arenaQuestions = [...subjectChallenges.logic.questions, ...subjectChallenges.coding.questions].slice(0, 5)

export function Arena({ progress, onFinish }: { progress: PlayerProgress; onFinish: (won: boolean, correct: number) => void }) {
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)
  const question = arenaQuestions[index]

  const answer = (choice: number) => {
    if (selected !== null) return
    setSelected(choice)
    if (choice === question.answer) setCorrect(value => value + 1)
  }
  const next = () => {
    if (index === arenaQuestions.length - 1) {
      const won = correct >= 3
      setFinished(true)
      onFinish(won, correct)
    } else { setIndex(value => value + 1); setSelected(null) }
  }
  const reset = () => { setStarted(true); setIndex(0); setSelected(null); setCorrect(0); setFinished(false) }

  return <main className="page-shell arena-page">
    <header className="page-title"><span><Swords /></span><div><small>ӘДІЛ БІЛІМ РЕЙТИНГІ</small><h1>Жаттығу аренасы</h1><p>MMR жылдамдыққа емес, дұрыс жауап пен білімді тұрақты қолдануға сүйенеді.</p></div></header>
    <section className="arena-rating"><div><Shield /><span><small>АҒЫМДАҒЫ MMR</small><strong>{progress.arena.mmr}</strong></span></div><div><b>{progress.arena.wins}</b><small>ЖЕҢІС</small></div><div><b>{progress.arena.losses}</b><small>ЖАТТЫҒУ</small></div><div><b>{Math.round((progress.arena.wins / Math.max(1, progress.arena.wins + progress.arena.losses)) * 100)}%</b><small>НӘТИЖЕ</small></div></section>
    {!started ? <section className="arena-lobby"><div className="versus"><span><Crown /></span><i>VS</i><span><Target /></span></div><small>БОТҚА ҚАРСЫ ҚАУІПСІЗ ЖАТТЫҒУ</small><h2>5 сұрақтық білім дуэлі</h2><p>Алдымен жергілікті жаттығуда ережені меңгер. Нақты online матч серверлік аккаунт пен модерация қосылғанда ашылады.</p><ul><li><Check /> Код және логика сұрақтары</li><li><Check /> Жеңіс үшін кемінде 3 дұрыс жауап</li><li><Check /> Жеңіс: +24 MMR, жаттығу: −8 MMR</li></ul><button onClick={() => setStarted(true)}><Swords /> Матчты бастау</button></section> : !finished ? <section className="arena-match"><header><span><b>Сен</b><small>{correct} ұпай</small></span><i>СҰРАҚ {index + 1}/5</i><span><b>PIX-BOT</b><small>{Math.min(index, 3)} ұпай</small></span></header><h2>{question.prompt}</h2><div className="answer-grid">{question.options.map((option, choice) => <button key={option} className={selected !== null ? choice === question.answer ? 'correct' : choice === selected ? 'wrong' : '' : ''} disabled={selected !== null} onClick={() => answer(choice)}><b>{choice + 1}</b>{option}</button>)}</div>{selected !== null && <div className="arena-feedback">{selected === question.answer ? <Check /> : <X />}<p>{question.explanation}</p><button onClick={next}>Жалғастыру</button></div>}</section> : <section className={`arena-result ${correct >= 3 ? 'win' : ''}`}><span>{correct >= 3 ? <Crown /> : <Sparkles />}</span><small>{correct >= 3 ? 'ЖЕҢІС' : 'ЖАТТЫҒУ АЯҚТАЛДЫ'}</small><h2>{correct}/5 дұрыс жауап</h2><p>{correct >= 3 ? '+24 MMR — білімді тұрақты қолдандың.' : '−8 MMR — түсіндірмелерді оқып, тағы бір рет байқап көр.'}</p><button onClick={reset}>Қайта ойнау</button></section>}
  </main>
}
