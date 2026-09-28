export type View = 'home' | 'map' | 'lesson' | 'workshop' | 'trophies'

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
  version: 2
  xp: number
  coins: number
  completed: string[]
  attempts: Record<string, number>
  trophies: string[]
  avatar: AvatarConfig
  pet: PetConfig
  ownedArmor: Array<AvatarConfig['armor']>
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
  version: 2,
  xp: 0,
  coins: 0,
  completed: [],
  attempts: {},
  trophies: [],
  avatar: { skin: '#d79272', hair: '#221a35', suit: '#18aeea', armor: 'starter' },
  pet: { name: 'Арчи', color: '#6ce7ff', ears: 'pointed' },
  ownedArmor: ['starter'],
}

export function loadProgress(): PlayerProgress {
  try {
    const raw = localStorage.getItem('pixed-progress-v2')
    if (!raw) return defaultProgress
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>
    if (parsed.version !== 2) return defaultProgress
    return { ...defaultProgress, ...parsed }
  } catch {
    return defaultProgress
  }
}

export function levelFor(xp: number) {
  return 1 + Math.floor(xp / 200)
}

export function nextLevelXp(xp: number) {
  return Math.ceil((xp + 1) / 200) * 200
}
