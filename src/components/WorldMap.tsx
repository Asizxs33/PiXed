import { Check, ChevronRight, LockKeyhole, Map, Play, Sparkles } from 'lucide-react'
import type { PlayerProgress } from '../domain/game'
import { missions } from '../domain/game'

export function WorldMap({ progress, onStart }: { progress: PlayerProgress; onStart: (id: string) => void }) {
  return <main className="page-shell map-page">
    <header className="page-title">
      <span><Map /></span><div><small>АРХИПЕЛАГ ИСКР</small><h1>Циклдер аралы</h1><p>Маякқа апаратын алты жүйені қалпына келтір.</p></div>
    </header>
    <div className="map-layout">
      <section className="island-path" aria-label="Миссиялар картасы">
        {missions.map((mission, index) => {
          const done = progress.completed.includes(mission.id)
          const unlocked = index === 0 || progress.completed.includes(missions[index - 1].id)
          return <article key={mission.id} className={`mission-node tone-${mission.tone} ${done ? 'done' : ''} ${unlocked ? '' : 'locked'}`}>
            <div className="node-orbit"><span>{done ? <Check /> : unlocked ? mission.icon : <LockKeyhole />}</span></div>
            <div className="node-copy"><small>МИССИЯ {mission.chapter}</small><h2>{mission.title}</h2><p>{mission.story}</p>
              <div><span><Sparkles /> {done ? 'Орындалды' : '+75 XP дейін'}</span><button disabled={!unlocked} onClick={() => onStart(mission.id)}>{done ? 'Қайта көру' : unlocked ? 'Бастау' : 'Жабық'} {unlocked && <Play />}</button></div>
            </div>
            {index < missions.length - 1 && <i className="path-line"><ChevronRight /></i>}
          </article>
        })}
      </section>
      <aside className="chapter-panel">
        <small>ТАРАУ МАҚСАТЫ</small><h2>Бір әрекетті көп рет орындау</h2>
        <p>Цикл қайталанатын командаларды қысқа, түсінікті және өзгертуге оңай етеді.</p>
        <div className="chapter-code"><b>repeat</b> (4) {'{'}<br/><span>move()</span><br/>{'}'}</div>
        <dl><div><dt>Аяқталды</dt><dd>{progress.completed.length}/{missions.length}</dd></div><div><dt>Кубок</dt><dd>Цикл шебері</dd></div></dl>
      </aside>
    </div>
  </main>
}
