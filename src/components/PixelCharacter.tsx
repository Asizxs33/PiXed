import type { AvatarConfig, PetConfig } from '../domain/game'

export function PixelHero({ avatar, large = false }: { avatar: AvatarConfig; large?: boolean }) {
  return (
    <div className={`pixel-hero ${large ? 'pixel-hero--large' : ''}`} aria-label="Ойын кейіпкері">
      <i className="hero-hair" style={{ background: avatar.hair, color: avatar.hair }} />
      <i className="hero-face" style={{ background: avatar.skin }} />
      <i className={`hero-body armor-${avatar.armor}`} style={{ '--suit': avatar.suit } as React.CSSProperties} />
      <i className="hero-feet" />
    </div>
  )
}

export function PixelPet({ pet, moving = false }: { pet: PetConfig; moving?: boolean }) {
  return (
    <div className={`pixel-pet ears-${pet.ears} ${moving ? 'is-moving' : ''}`} aria-label={`${pet.name} питомеці`}>
      <i className="pet-ear pet-ear--left" style={{ borderBottomColor: pet.color, color: pet.color }} />
      <i className="pet-ear pet-ear--right" style={{ borderBottomColor: pet.color, color: pet.color }} />
      <i className="pet-head" style={{ background: pet.color }} />
      <i className="pet-body" style={{ background: pet.color }} />
      <i className="pet-tail" style={{ background: pet.color }} />
    </div>
  )
}
