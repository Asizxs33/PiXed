export type View = 'home' | 'map' | 'lesson' | 'academy' | 'arena' | 'workshop' | 'trophies' | 'profile'
export type SubjectId = 'coding' | 'math' | 'science' | 'logic'

export type Mission = {
  id: string
  chapter: string
  title: string
  shortTitle: string
  story: string
  objective: string
  target: number
  action: string
  worldEffect: string
  icon: string
  tone: 'cyan' | 'violet' | 'gold' | 'green'
}

export type AvatarConfig = {
  skin: string
  hair: string
  suit: string
  armor: 'starter' | 'scout' | 'master'
}

export type PetConfig = {
  name: string
  color: string
  ears: 'pointed' | 'round'
}

export type PlayerProgress = {
  version: 4
  xp: number
  coins: number
  completed: string[]
  attempts: Record<string, number>
  trophies: string[]
  avatar: AvatarConfig
  pet: PetConfig
  ownedArmor: Array<AvatarConfig['armor']>
  subjectMastery: Record<SubjectId, number>
  practiceCompleted: SubjectId[]
  arena: { mmr: number; wins: number; losses: number }
  streak: number
  lastActiveDate: string
  daily: DailyProgress
}

export type DailyProgress = {
  date: string
  lessonDone: boolean
  practiceDone: boolean
  arenaDone: boolean
  claimed: boolean
}

export type DailyActivity = 'lessonDone' | 'practiceDone' | 'arenaDone'

export type PracticeQuestion = {
  prompt: string
  options: string[]
  answer: number
  explanation: string
}

export const subjectChallenges: Record<SubjectId, { title: string; label: string; description: string; questions: PracticeQuestion[] }> = {
  coding: { title: 'Код зертханасы', label: 'Бағдарламалау', description: 'Алгоритм, цикл және қате табу.', questions: [
    { prompt: 'repeat(3) { move() } неше рет орындалады?', options: ['1', '2', '3', '4'], answer: 2, explanation: 'repeat ішіндегі сан әрекеттің қайталану санын көрсетеді.' },
    { prompt: 'Қай код 4 шамды жағады?', options: ['repeat(4) { light() }', 'repeat(2) { light() }', 'light(3)', 'stop()'], answer: 0, explanation: 'Бір light() әрекеті төрт рет қайталанса, төрт шам жанады.' },
    { prompt: 'Циклдің негізгі пайдасы қандай?', options: ['Кодты бояу', 'Қайталауды қысқарту', 'Интернетті қосу', 'Файлды өшіру'], answer: 1, explanation: 'Цикл қайталанатын команданы ықшам және өзгертуге ыңғайлы етеді.' },
  ] },
  math: { title: 'Сандар обсерваториясы', label: 'Математика', description: 'Заңдылық, есептеу және логикалық дәлел.', questions: [
    { prompt: 'Қатарды жалғастыр: 3, 6, 12, 24, ...', options: ['27', '30', '36', '48'], answer: 3, explanation: 'Әр сан алдыңғы саннан екі есе үлкен: 24 × 2 = 48.' },
    { prompt: 'Робот 4 қадамнан 3 рет жүрді. Барлығы неше қадам?', options: ['7', '12', '16', '43'], answer: 1, explanation: '4 қадам × 3 қайталау = 12 қадам.' },
    { prompt: '20 кристалдың 1/4 бөлігі қанша?', options: ['4', '5', '10', '15'], answer: 1, explanation: '20-ны төрт тең бөлікке бөлсек, әр бөлікте 5 кристалл болады.' },
  ] },
  science: { title: 'Энергия бағы', label: 'Жаратылыстану', description: 'Бақылау, себеп және тәжірибе.', questions: [
    { prompt: 'Өсімдік жарыққа қарай бұрылды. Бұл нені көрсетеді?', options: ['Кездейсоқтық', 'Тітіркенуге жауап', 'Ұйқы', 'Булану'], answer: 1, explanation: 'Өсімдік жарық тітіркендіргішіне бағытталған өсу арқылы жауап береді.' },
    { prompt: 'Қайсысы жаңартылатын энергия көзі?', options: ['Көмір', 'Мұнай', 'Күн', 'Газ'], answer: 2, explanation: 'Күн энергиясы табиғи түрде қайта толықтырылады.' },
    { prompt: 'Тәжірибеде бір ғана шартты өзгерту не үшін керек?', options: ['Әдемілік үшін', 'Себепті анықтау үшін', 'Тез бітіру үшін', 'Нәтижені жасыру үшін'], answer: 1, explanation: 'Бір айнымалыны өзгерту нәтижеге нақты ненің әсер еткенін көруге көмектеседі.' },
  ] },
  logic: { title: 'Логика аренасы', label: 'Логика', description: 'Үлгі, шарт және шешім стратегиясы.', questions: [
    { prompt: 'Барлық көк есік ашық. Бұл есік көк. Қандай қорытынды дұрыс?', options: ['Есік жабық', 'Есік ашық', 'Түссіз', 'Белгісіз'], answer: 1, explanation: 'Жалпы ереже көк есіктердің бәріне, соның ішінде осы есікке де қолданылады.' },
    { prompt: 'Егер қуат бар болса, маяк жанады. Маяк жанбады. Не анық?', options: ['Қуат болмады', 'Күн шықты', 'Жел соқты', 'Ештеңе'], answer: 0, explanation: 'Берілген шарт бойынша қуат болғанда маяк міндетті түрде жанар еді.' },
    { prompt: 'A → B, B → C болса, дұрыс байланыс қайсы?', options: ['C → A', 'A → C', 'B → A', 'C → B'], answer: 1, explanation: 'Екі тізбекті шартты біріктірсек, A болғанда C-ге жетеміз.' },
  ] },
}

export const missions: Mission[] = [
  {
    id: 'bridge', chapter: '01', title: 'Цикл көпірі', shortTitle: 'Көпір',
    story: 'Арчи питомеці сынған көпірдің әр бөлігіне қуат беруі керек.',
    objective: 'move() командасын 4 рет қайталатып, Арчиді маякқа жеткіз.',
    target: 4, action: 'move()', worldEffect: 'Көпір іске қосылып, алғашқы жол ашылды.', icon: '▦', tone: 'cyan',
  },
  {
    id: 'lanterns', chapter: '02', title: 'Жарық тізбегі', shortTitle: 'Шамдар',
    story: 'Ауыл қараңғыда қалды. Арчи көшедегі барлық шамды жағуы керек.',
    objective: 'light() командасын 5 рет қайтала.',
    target: 5, action: 'light()', worldEffect: 'Шеберлер ауылы қайта жарықтанды.', icon: '✦', tone: 'gold',
  },
  {
    id: 'garden', chapter: '03', title: 'Бұлт бағы', shortTitle: 'Бақ',
    story: 'Жел аралындағы жас көшеттерге су жетпей жатыр.',
    objective: 'water() әрекетін 6 көшетке қолдан.',
    target: 6, action: 'water()', worldEffect: 'Бұлт бағы гүлдей бастады.', icon: '♧', tone: 'green',
  },
  {
    id: 'signals', chapter: '04', title: 'Құпия сигнал', shortTitle: 'Сигнал',
    story: 'Зертхана есігі импульстердің дәл санын күтеді.',
    objective: 'signal() командасын 3 рет орында.',
    target: 3, action: 'signal()', worldEffect: 'Ескі зертхана есігі ашылды.', icon: '⌁', tone: 'violet',
  },
  {
    id: 'crystals', chapter: '05', title: 'Кристалл өзегі', shortTitle: 'Өзек',
    story: 'Маякқа қуат беру үшін төрт кристалды синхрондау керек.',
    objective: 'charge() әрекетін 4 рет қайтала.',
    target: 4, action: 'charge()', worldEffect: 'Кристалл өзегі тұрақты жұмыс істеді.', icon: '◆', tone: 'cyan',
  },
  {
    id: 'lighthouse', chapter: '06', title: 'Бірінші маяк', shortTitle: 'Маяк',
    story: 'Барлық жүйе дайын. Соңғы алты модульді бір циклмен іске қос.',
    objective: 'launch() командасын 6 рет қайталап, маякты оят.',
    target: 6, action: 'launch()', worldEffect: 'Бірінші маяк жанды. Архипелаг қайта байланысқа шықты!', icon: '▲', tone: 'gold',
  },
]

export const defaultProgress: PlayerProgress = {
  version: 4,
  xp: 0,
  coins: 0,
  completed: [],
  attempts: {},
  trophies: [],
  avatar: { skin: '#d79272', hair: '#221a35', suit: '#18aeea', armor: 'starter' },
  pet: { name: 'Арчи', color: '#6ce7ff', ears: 'pointed' },
  ownedArmor: ['starter'],
  subjectMastery: { coding: 0, math: 0, science: 0, logic: 0 },
  practiceCompleted: [],
  arena: { mmr: 1000, wins: 0, losses: 0 },
  streak: 0,
  lastActiveDate: '',
  daily: { date: todayKey(), lessonDone: false, practiceDone: false, arenaDone: false, claimed: false },
}

export function loadProgress(): PlayerProgress {
  try {
    const raw = localStorage.getItem('pixed-progress-v4') ?? localStorage.getItem('pixed-progress-v3') ?? localStorage.getItem('pixed-progress-v2')
    if (!raw) return defaultProgress
    const parsed = JSON.parse(raw) as Partial<Omit<PlayerProgress, 'version'>> & { version?: number }
    if (parsed.version !== 2 && parsed.version !== 3 && parsed.version !== 4) return defaultProgress
    const daily = parsed.daily?.date === todayKey() ? { ...defaultProgress.daily, ...parsed.daily } : defaultProgress.daily
    return { ...defaultProgress, ...parsed, version: 4, daily, subjectMastery: { ...defaultProgress.subjectMastery, ...parsed.subjectMastery }, arena: { ...defaultProgress.arena, ...parsed.arena } }
  } catch {
    return defaultProgress
  }
}

export function todayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function recordActivity(progress: PlayerProgress, activity: DailyActivity): PlayerProgress {
  const today = todayKey()
  const daily = progress.daily.date === today ? progress.daily : { ...defaultProgress.daily, date: today }
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const newDay = progress.lastActiveDate !== today
  const streak = newDay ? (progress.lastActiveDate === todayKey(yesterday) ? progress.streak + 1 : 1) : progress.streak
  return { ...progress, streak, lastActiveDate: today, daily: { ...daily, [activity]: true } }
}

export function levelFor(xp: number) {
  return 1 + Math.floor(xp / 200)
}

export function nextLevelXp(xp: number) {
  return Math.ceil((xp + 1) / 200) * 200
}
