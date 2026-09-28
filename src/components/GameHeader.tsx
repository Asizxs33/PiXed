import { Atom, BookOpen, Coins, Gamepad2, Home, Map, Medal, Shirt, Sparkles, Swords, UserRound } from 'lucide-react'
import type { PlayerProgress, View } from '../domain/game'
import { levelFor } from '../domain/game'
import { PixelHero } from './PixelCharacter'

const items: Array<{ id: View; label: string; icon: typeof Home }> = [
  { id: 'home', label: 'Басты бет', icon: Home },
  { id: 'map', label: 'Оқиға', icon: Map },
  { id: 'academy', label: 'Пәндер', icon: Atom },
  { id: 'arena', label: 'Арена', icon: Swords },
  { id: 'workshop', label: 'Шеберхана', icon: Shirt },
  { id: 'trophies', label: 'Кубоктар', icon: Medal },
  { id: 'profile', label: 'Профиль', icon: UserRound },
]

export function GameHeader({ progress, view, onNavigate }: { progress: PlayerProgress; view: View; onNavigate: (view: View) => void }) {
  return (
    <header className="game-header">
      <button className="brand" onClick={() => onNavigate('home')} aria-label="PiXed басты беті">
        <span><Gamepad2 /></span><b>Pi<span>Xed</span></b><small>LEARN • BUILD • PLAY</small>
      </button>
      <nav aria-label="Негізгі навигация">
        {items.map(({ id, label, icon: Icon }) => (
          <button key={id} className={view === id ? 'active' : ''} onClick={() => onNavigate(id)}>
            <Icon /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="header-progress">
        <span title="Тәжірибе"><Sparkles />{progress.xp}<small>XP</small></span>
        <span title="Монета"><Coins />{progress.coins}</span>
        <button className="mini-profile" onClick={() => onNavigate('profile')}>
          <PixelHero avatar={progress.avatar} />
          <i><b>Зерттеуші</b><small>{levelFor(progress.xp)} ДЕҢГЕЙ</small></i>
        </button>
      </div>
      <div className="mobile-lesson-label"><BookOpen /> Оқу RPG</div>
    </header>
  )
}
