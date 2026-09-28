import { useEffect, useState } from 'react'
import { GameHeader } from './components/GameHeader'
import { HomePage } from './components/HomePage'
import { LessonScene } from './components/LessonScene'
import { Academy } from './components/Academy'
import { Arena } from './components/Arena'
import { Profile } from './components/Profile'
import { TrophyHall } from './components/TrophyHall'
import { Workshop } from './components/Workshop'
import { WorldMap } from './components/WorldMap'
import { defaultProgress, loadProgress, missions, recordActivity, type AvatarConfig, type Mission, type PetConfig, type PlayerProgress, type SubjectId, type View } from './domain/game'

function App() {
  const [view, setView] = useState<View>('home')
  const [missionId, setMissionId] = useState(missions[0].id)
  const [progress, setProgress] = useState<PlayerProgress>(loadProgress)

  useEffect(() => {
    localStorage.setItem('pixed-progress-v4', JSON.stringify(progress))
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
      const active = recordActivity(current, 'lessonDone')
      const attempts = { ...active.attempts, [mission.id]: (active.attempts[mission.id] ?? 0) + 1 }
      if (active.completed.includes(mission.id)) return { ...active, attempts }
      const completed = [...active.completed, mission.id]
      const trophies = [...active.trophies]
      if (completed.length >= 1 && !trophies.includes('first-light')) trophies.push('first-light')
      if (completed.length >= 3 && !trophies.includes('island-helper')) trophies.push('island-helper')
      if (completed.length >= 6 && !trophies.includes('loop-master')) trophies.push('loop-master')
      return { ...active, attempts, completed, trophies, xp: active.xp + 30, coins: active.coins + 10 }
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
    const active = recordActivity(current, 'practiceDone')
    const mastery = Math.round((score / 3) * 100)
    const firstCompletion = !active.practiceCompleted.includes(subject)
    return {
      ...active,
      xp: active.xp + (firstCompletion ? 20 : 0),
      coins: active.coins + (firstCompletion ? 5 : 0),
      practiceCompleted: firstCompletion ? [...active.practiceCompleted, subject] : active.practiceCompleted,
      subjectMastery: { ...active.subjectMastery, [subject]: Math.max(active.subjectMastery[subject], mastery) },
    }
  })

  const finishArena = (won: boolean, correct: number) => setProgress(current => {
    const active = recordActivity(current, 'arenaDone')
    return {
    ...active,
    xp: active.xp + (won ? 12 : 4),
    arena: {
      mmr: Math.max(800, active.arena.mmr + (won ? 24 : -8)),
      wins: active.arena.wins + (won ? 1 : 0),
      losses: active.arena.losses + (won ? 0 : 1),
    },
    subjectMastery: { ...active.subjectMastery, logic: Math.max(active.subjectMastery.logic, Math.round((correct / 5) * 100)) },
  }})

  const claimDaily = () => setProgress(current => {
    const ready = current.daily.lessonDone && current.daily.practiceDone && current.daily.arenaDone
    if (!ready || current.daily.claimed) return current
    return { ...current, xp: current.xp + 40, coins: current.coins + 25, daily: { ...current.daily, claimed: true } }
  })

  const activeMission = missions.find(mission => mission.id === missionId) ?? missions[0]

  return <div className="app-shell">
    {view !== 'lesson' && <GameHeader progress={progress} view={view} onNavigate={navigate} />}
    {view === 'home' && <HomePage progress={progress} onNavigate={navigate} onStartMission={startMission} />}
    {view === 'map' && <WorldMap progress={progress} onStart={startMission} />}
    {view === 'lesson' && <LessonScene mission={activeMission} progress={progress} onBack={() => navigate('map')} onComplete={completeMission} />}
    {view === 'academy' && <Academy progress={progress} onComplete={completePractice} />}
    {view === 'arena' && <Arena progress={progress} onFinish={finishArena} />}
    {view === 'profile' && <Profile progress={progress} onClaim={claimDaily} onNavigate={navigate} />}
    {view === 'workshop' && <Workshop progress={progress} onAvatar={updateAvatar} onPet={updatePet} onBuyArmor={buyArmor} />}
    {view === 'trophies' && <TrophyHall progress={progress} />}
    <button className="reset-progress" onClick={() => { if (window.confirm('Барлық жергілікті прогресті өшіру керек пе?')) { setProgress(defaultProgress); navigate('home') } }}>Прогресті жаңарту</button>
  </div>
}

export default App
