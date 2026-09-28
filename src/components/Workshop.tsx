import { Check, Coins, LockKeyhole, Palette, PawPrint, Shirt, Sparkles } from 'lucide-react'
import type { AvatarConfig, PetConfig, PlayerProgress } from '../domain/game'
import { PixelHero, PixelPet } from './PixelCharacter'

const suits = ['#18aeea', '#8b5cf6', '#ef4f91', '#38c875', '#f3a629']
const petColors = ['#6ce7ff', '#ffd25a', '#b987ff', '#ff7f9f', '#81e57b']
const armor: Array<{ id: AvatarConfig['armor']; name: string; price: number; desc: string }> = [
  { id: 'starter', name: 'Зерттеуші', price: 0, desc: 'Сапардың алғашқы жинағы' },
  { id: 'scout', name: 'Бұлт барлаушысы', price: 30, desc: 'Жеңіл плащ және жарық белдігі' },
  { id: 'master', name: 'Маяк шебері', price: 60, desc: 'Цикл аралының салтанатты сауыты' },
]

export function Workshop({ progress, onAvatar, onPet, onBuyArmor }: { progress: PlayerProgress; onAvatar: (patch: Partial<AvatarConfig>) => void; onPet: (patch: Partial<PetConfig>) => void; onBuyArmor: (armor: AvatarConfig['armor'], price: number) => void }) {
  return <main className="page-shell workshop-page">
    <header className="page-title"><span><Shirt /></span><div><small>ЖЕКЕ БЕЙНЕ</small><h1>Шеберхана</h1><p>Бүкіл оқиға бойы бірге жүретін кейіпкер мен питомецті жаса.</p></div></header>
    <div className="workshop-grid">
      <section className="character-preview">
        <div className="preview-glow"><PixelHero avatar={progress.avatar} large /><PixelPet pet={progress.pet} /></div>
        <div><small>ЗЕРТТЕУШІ ЖӘНЕ ПИТОМЕЦ</small><h2>Сенің командаң</h2><p>Киім мен питомецтің түсі сабақтың нәтижесіне әсер етпейді. Олар жетістігіңді көрсетеді.</p></div>
      </section>
      <section className="customizer-panel">
        <div className="custom-section"><h2><Palette /> Кейіпкердің түсі</h2><div className="swatches">{suits.map(color => <button key={color} style={{ background: color }} className={progress.avatar.suit === color ? 'selected' : ''} onClick={() => onAvatar({ suit: color })} aria-label={`Киім түсі ${color}`}>{progress.avatar.suit === color && <Check />}</button>)}</div></div>
        <div className="custom-section"><h2><PawPrint /> Питомец: {progress.pet.name}</h2><label>Аты<input value={progress.pet.name} maxLength={12} onChange={event => onPet({ name: event.target.value || 'Арчи' })}/></label><div className="swatches">{petColors.map(color => <button key={color} style={{ background: color }} className={progress.pet.color === color ? 'selected' : ''} onClick={() => onPet({ color })} aria-label={`Питомец түсі ${color}`}>{progress.pet.color === color && <Check />}</button>)}</div><div className="ear-options"><button className={progress.pet.ears === 'pointed' ? 'active' : ''} onClick={() => onPet({ ears: 'pointed' })}>Үшкір құлақ</button><button className={progress.pet.ears === 'round' ? 'active' : ''} onClick={() => onPet({ ears: 'round' })}>Дөңгелек құлақ</button></div></div>
      </section>
    </div>
    <section className="armor-shop"><header><span><Sparkles /></span><div><small>ЖИНАҚТАР</small><h2>Сауытты жетілдіру</h2></div><b><Coins /> {progress.coins}</b></header><div className="armor-grid">{armor.map(item => {
      const owned = progress.ownedArmor.includes(item.id)
      const equipped = progress.avatar.armor === item.id
      return <article key={item.id} className={equipped ? 'equipped' : ''}><div className={`armor-visual armor-card-${item.id}`}><PixelHero avatar={{ ...progress.avatar, armor: item.id }} large /></div><small>{item.id === 'master' ? 'СИРЕК ЖИНАҚ' : 'ЖИНАҚ'}</small><h3>{item.name}</h3><p>{item.desc}</p><button disabled={!owned && progress.coins < item.price} onClick={() => onBuyArmor(item.id, item.price)}>{equipped ? <><Check /> Таңдалды</> : owned ? 'Кию' : progress.coins >= item.price ? <><Coins /> {item.price}</> : <><LockKeyhole /> {item.price}</>}</button></article>
    })}</div></section>
  </main>
}
