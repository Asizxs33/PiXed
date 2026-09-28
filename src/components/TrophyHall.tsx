import { Check, Crown, LockKeyhole, Medal, Sparkles, Trophy } from 'lucide-react'
import type { PlayerProgress } from '../domain/game'
import { missions } from '../domain/game'

const trophyDefinitions = [
  { id: 'first-light', rarity: 'ЕСТЕЛІК', title: 'Алғашқы қадам', desc: 'Бірінші миссияны аяқта.', target: 1, icon: Sparkles },
  { id: 'island-helper', rarity: 'СИРЕК', title: 'Арал көмекшісі', desc: 'Үш түрлі цикл миссиясын орында.', target: 3, icon: Medal },
  { id: 'loop-master', rarity: 'ЭПИКАЛЫҚ', title: 'Цикл шебері', desc: 'Тараудың алты миссиясын толық аяқта.', target: 6, icon: Trophy },
]

export function TrophyHall({ progress }: { progress: PlayerProgress }) {
  return <main className="page-shell trophy-page"><header className="page-title"><span><Crown /></span><div><small>ЖЕТІСТІКТЕР</small><h1>Кубоктар залы</h1><p>Кубоктар уақыт үшін емес, дәлелденген білім мен жобалар үшін беріледі.</p></div></header>
    <section className="trophy-summary"><div><strong>{progress.trophies.length}</strong><span><b>Жиналған кубок</b><small>3 кубоктың ішінен</small></span></div><i><u style={{ width: `${(progress.trophies.length / 3) * 100}%` }} /></i><p>Келесі мақсат: {progress.completed.length < 3 ? '3 миссияны аяқтау' : progress.completed.length < 6 ? 'барлық цикл миссиясын аяқтау' : 'Келесі тарауды күту'}</p></section>
    <section className="trophy-grid">{trophyDefinitions.map(definition => {
      const unlocked = progress.trophies.includes(definition.id)
      const amount = Math.min(progress.completed.length, definition.target)
      const Icon = definition.icon
      return <article key={definition.id} className={unlocked ? 'unlocked' : ''}><div className="trophy-emblem">{unlocked ? <Icon /> : <LockKeyhole />}</div><small>{definition.rarity}</small><h2>{definition.title}</h2><p>{definition.desc}</p><div><span>{unlocked ? <><Check /> Ашылды</> : `${amount}/${definition.target}`}</span><i><u style={{ width: `${(amount / definition.target) * 100}%` }} /></i></div></article>
    })}</section>
    <section className="future-trophy"><span>?</span><div><small>КЕЛЕСІ ТАРАУ</small><h2>Архитектор кубогы</h2><p>Цикл, шарт және функцияны біріктіріп, өз механизміңді құр.</p></div></section>
  </main>
}
