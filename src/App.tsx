import { useEffect, useState } from 'react'
import { GameHeader } from './components/GameHeader'
import { HomePage } from './components/HomePage'
import { LessonScene } from './components/LessonScene'
import { Academy } from './components/Academy'
import { Arena } from './components/Arena'
import { TrophyHall } from './components/TrophyHall'
import { Workshop } from './components/Workshop'
import { WorldMap } from './components/WorldMap'
import { defaultProgress, loadProgress, missions, type AvatarConfig, type Mission, type PetConfig, type PlayerProgress, type SubjectId, type View } from './domain/game'

function App() {
  const [view, setView] = useState<View>('home')
  const [missionId, setMissionId] = useState(missions[0].id)
  const [progress, setProgress] = useState<PlayerProgress>(loadProgress)

  useEffect(() => {
    localStorage.setItem('pixed-progress-v3', JSON.stringify(progress))
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

  const completePractice = (subject: SubjectId, score: number) => setProgress(current => {
    const mastery = Math.round((score / 3) * 100)
    const firstCompletion = !current.practiceCompleted.includes(subject)
    return {
      ...current,
      xp: current.xp + (firstCompletion ? 20 : 0),
      coins: current.coins + (firstCompletion ? 5 : 0),
      practiceCompleted: firstCompletion ? [...current.practiceCompleted, subject] : current.practiceCompleted,
      subjectMastery: { ...current.subjectMastery, [subject]: Math.max(current.subjectMastery[subject], mastery) },
    }
  })

  const finishArena = (won: boolean, correct: number) => setProgress(current => ({
    ...current,
    xp: current.xp + (won ? 12 : 4),
    arena: {
      mmr: Math.max(800, current.arena.mmr + (won ? 24 : -8)),
      wins: current.arena.wins + (won ? 1 : 0),
      losses: current.arena.losses + (won ? 0 : 1),
    },
    subjectMastery: { ...current.subjectMastery, logic: Math.max(current.subjectMastery.logic, Math.round((correct / 5) * 100)) },
  }))

  const activeMission = missions.find(mission => mission.id === missionId) ?? missions[0]

  return <div className="app-shell">
    {view !== 'lesson' && <GameHeader progress={progress} view={view} onNavigate={navigate} />}
    {view === 'home' && <HomePage progress={progress} onNavigate={navigate} onStartMission={startMission} />}
    {view === 'map' && <WorldMap progress={progress} onStart={startMission} />}
    {view === 'lesson' && <LessonScene mission={activeMission} progress={progress} onBack={() => navigate('map')} onComplete={completeMission} />}
    {view === 'academy' && <Academy progress={progress} onComplete={completePractice} />}
    {view === 'arena' && <Arena progress={progress} onFinish={finishArena} />}
    {view === 'workshop' && <Workshop progress={progress} onAvatar={updateAvatar} onPet={updatePet} onBuyArmor={buyArmor} />}
    {view === 'trophies' && <TrophyHall progress={progress} />}
    <button className="reset-progress" onClick={() => { if (window.confirm('Барлық жергілікті прогресті өшіру керек пе?')) { setProgress(defaultProgress); navigate('home') } }}>Прогресті жаңарту</button>
  </div>
}

export default App
