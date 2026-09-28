import { useEffect, useState } from 'react'
import { GameHeader } from './components/GameHeader'
import { HomePage } from './components/HomePage'
import { LessonScene } from './components/LessonScene'
import { TrophyHall } from './components/TrophyHall'
import { Workshop } from './components/Workshop'
import { WorldMap } from './components/WorldMap'
import { defaultProgress, loadProgress, missions, type AvatarConfig, type Mission, type PetConfig, type PlayerProgress, type View } from './domain/game'

function App() {
  const [view, setView] = useState<View>('home')
  const [missionId, setMissionId] = useState(missions[0].id)
  const [progress, setProgress] = useState<PlayerProgress>(loadProgress)

  useEffect(() => {
    localStorage.setItem('pixed-progress-v2', JSON.stringify(progress))
  }, [progress])

  const navigate = (next: View) => {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startMission = (id: string) => {
    setMissionId(id)
    navigate('lesson')
  }

  const completeMission = (mission: Mission) => {
    setProgress(current => {
      const attempts = { ...current.attempts, [mission.id]: (current.attempts[mission.id] ?? 0) + 1 }
      if (current.completed.includes(mission.id)) return { ...current, attempts }
      const completed = [...current.completed, mission.id]
      const trophies = [...current.trophies]
      if (completed.length >= 1 && !trophies.includes('first-light')) trophies.push('first-light')
      if (completed.length >= 3 && !trophies.includes('island-helper')) trophies.push('island-helper')
      if (completed.length >= 6 && !trophies.includes('loop-master')) trophies.push('loop-master')
      return { ...current, attempts, completed, trophies, xp: current.xp + 30, coins: current.coins + 10 }
    })
  }

  const updateAvatar = (patch: Partial<AvatarConfig>) => setProgress(current => ({ ...current, avatar: { ...current.avatar, ...patch } }))
  const updatePet = (patch: Partial<PetConfig>) => setProgress(current => ({ ...current, pet: { ...current.pet, ...patch } }))
  const buyArmor = (armor: AvatarConfig['armor'], price: number) => setProgress(current => {
    if (current.ownedArmor.includes(armor)) return { ...current, avatar: { ...current.avatar, armor } }
    if (current.coins < price) return current
    return { ...current, coins: current.coins - price, ownedArmor: [...current.ownedArmor, armor], avatar: { ...current.avatar, armor } }
  })

  const activeMission = missions.find(mission => mission.id === missionId) ?? missions[0]

  return <div className="app-shell">
    {view !== 'lesson' && <GameHeader progress={progress} view={view} onNavigate={navigate} />}
    {view === 'home' && <HomePage progress={progress} onNavigate={navigate} onStartMission={startMission} />}
    {view === 'map' && <WorldMap progress={progress} onStart={startMission} />}
    {view === 'lesson' && <LessonScene mission={activeMission} progress={progress} onBack={() => navigate('map')} onComplete={completeMission} />}
    {view === 'workshop' && <Workshop progress={progress} onAvatar={updateAvatar} onPet={updatePet} onBuyArmor={buyArmor} />}
    {view === 'trophies' && <TrophyHall progress={progress} />}
    <button className="reset-progress" onClick={() => { if (window.confirm('Барлық жергілікті прогресті өшіру керек пе?')) { setProgress(defaultProgress); navigate('home') } }}>Прогресті жаңарту</button>
  </div>
}

export default App
