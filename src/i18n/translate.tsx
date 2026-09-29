import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
// Кириллические субсеты тех же шрифтов, что и в интерфейсе (Tiny5 — заголовки/
// кнопки, Inter — тело, Press Start 2P — акценты). Приложение подключает только
// latin-субсеты, поэтому русский падал на системный шрифт. Эти @font-face несут
// unicode-range для кириллицы, и браузер сам применяет их к русскому тексту —
// сохраняя пиксельный вид. Его CSS при этом не меняется.
import '@fontsource/tiny5/cyrillic-400.css'
import '@fontsource/press-start-2p/cyrillic-400.css'
import '@fontsource/inter/cyrillic-400.css'
import '@fontsource/inter/cyrillic-600.css'

type Lang = 'en' | 'ru'
const STORAGE_KEY = 'pixed-lang'

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
})

/** Доступ к текущему языку интерфейса (для собственных элементов вроде выхода). */
export function useLang() {
  return useContext(LangContext)
}

/**
 * Рантайм-слой перевода интерфейса EN→RU.
 *
 * Работает поверх готового DOM: обходит текстовые узлы и подменяет английский
 * текст на русский по словарю, а также следит за изменениями через
 * MutationObserver (смена экранов, модалки, ререндеры framer-motion/React).
 * Компоненты приложения не изменяются — поэтому слой не конфликтует с их
 * переписыванием и переиспользует их же CSS-классы, а значит и шрифты.
 *
 * Строки, которых нет в словаре, остаются на английском (безопасный фолбэк),
 * добавить их — это просто новая запись в DICT/RULES ниже.
 */

// Точный словарь: обрезанный английский текст → русский.
const DICT: Record<string, string> = {
  // — Brand —
  'A little play. A lot of discovery.': 'Немного игры. Много открытий.',
  // — Landing —
  'ENTER THE LEARNING WORLD': 'ВОЙДИ В МИР ЗНАНИЙ',
  'A little wonder.': 'Немного чуда.',
  'A world to learn.': 'Целый мир, чтобы учиться.',
  'Your next adventure starts with curiosity.': 'Твоё следующее приключение начинается с любопытства.',
  'Create your player': 'Создать игрока',
  'Continue my adventure': 'Продолжить приключение',
  'A few questions. Your hero. Your first adventure.': 'Несколько вопросов. Твой герой. Твоё первое приключение.',
  'Your saved party is waiting.': 'Твоя сохранённая команда ждёт.',
  'Double tap to enter': 'Двойное касание, чтобы войти',
  'Your adventure awaits': 'Приключение ждёт',
  'A new chapter awaits': 'Тебя ждёт новая глава',
  // — PlayerWorld: навигация —
  'Home': 'Главная',
  'Games': 'Игры',
  'Quests': 'Задания',
  'Rooms': 'Комнаты',
  'Progress': 'Прогресс',
  'Workshop': 'Мастерская',
  'Profile': 'Профиль',
  'More': 'Ещё',
  'YOUR WORLD': 'ТВОЙ МИР',
  'WELCOME BACK,': 'С ВОЗВРАЩЕНИЕМ,',
  'Your next step': 'Твой следующий шаг',
  'A little practice': 'Немного практики',
  'goes a long way.': 'многое меняет.',
  // — PlayerWorld: каталог/карточки —
  'SMALL STEPS. BIG DISCOVERIES.': 'МАЛЕНЬКИЕ ШАГИ. БОЛЬШИЕ ОТКРЫТИЯ.',
  'Choose your adventure': 'Выбери приключение',
  '6 worlds · solo practice': '6 миров · одиночная практика',
  'All': 'Все',
  'Coding': 'Программирование',
  'Math': 'Математика',
  'Science': 'Наука',
  'Logic': 'Логика',
  'Mastered': 'Пройдено',
  '3 checkpoints': '3 контрольные точки',
  'Play': 'Играть',
  // — PlayerWorld: Home —
  'Ready for a little': 'Готов к небольшому',
  'discovery?': 'открытию?',
  'Your companion is ready. Pick a short adventure and learn something new together.': 'Твой спутник готов. Выбери короткое приключение и узнай что-то новое вместе.',
  'Explore the flag trail': 'Исследовать путь флага',
  'Start your first quest': 'Начать первое задание',
  'View quests': 'Смотреть задания',
  'Discover the six practice worlds': 'Открой шесть тренировочных миров',
  'The quiet bridge · Learn your first loop': 'Тихий мост · Изучи свой первый цикл',
  // — PlayerWorld: Quests —
  'ONE QUEST AT A TIME': 'ПО ОДНОМУ ЗАДАНИЮ',
  'Your learning path': 'Твой путь обучения',
  'Start with a small coding lesson, then explore at your own pace.': 'Начни с небольшого урока программирования, потом исследуй в своём темпе.',
  'The quiet bridge': 'Тихий мост',
  // — PlayerWorld: Rooms —
  'BETTER TOGETHER': 'ВМЕСТЕ ЛУЧШЕ',
  'A place for your party': 'Место для твоей команды',
  'Online rooms are still in development. You can practise the team modes on your own today.': 'Онлайн-комнаты ещё в разработке. Сегодня командные режимы можно потренировать в одиночку.',
  'Prepare for the team adventure': 'Готовься к командному приключению',
  'Team Battle and Capture the Flag currently offer solo practice with immediate explanations. Live invitations, room codes and multiplayer are not connected yet.': 'Битва команд и Захват флага пока дают одиночную практику с мгновенными пояснениями. Живые приглашения, коды комнат и мультиплеер ещё не подключены.',
  'Try Team Battle practice': 'Попробовать тренировку «Битва команд»',
  // — PlayerWorld: Progress —
  'GROW AT YOUR OWN PACE': 'РАСТИ В СВОЁМ ТЕМПЕ',
  'Look how far you’ve come': 'Посмотри, как далеко ты продвинулся',
  'Your own best results, earned through learning. Replaying never removes progress.': 'Твои лучшие результаты, заработанные обучением. Повтор никогда не отнимает прогресс.',
  'Learning XP': 'Опыт обучения',
  'Worlds mastered': 'Миров пройдено',
  'Coins earned + starter gift': 'Заработано монет + стартовый подарок',
  'Your collection': 'Твоя коллекция',
  'Earned, never random': 'Заработано, без случайностей',
  'Personal bests': 'Личные рекорды',
  'Progress is saved in this browser. Global rankings will arrive with online accounts.': 'Прогресс сохраняется в этом браузере. Глобальные рейтинги появятся вместе с онлайн-аккаунтами.',
  'First crossing': 'Первая переправа',
  'Complete the first coding loop.': 'Пройди первый цикл в программировании.',
  'Sharp thinker': 'Острый ум',
  'Finish any adventure with 3/3.': 'Заверши любое приключение на 3/3.',
  'World scholar': 'Знаток миров',
  'Master all six adventures.': 'Освой все шесть приключений.',
  'UNLOCKED': 'ОТКРЫТО',
  'TO DISCOVER': 'ПРЕДСТОИТ ОТКРЫТЬ',
  // — PlayerWorld: Workshop —
  'MAKE IT YOURS': 'СДЕЛАЙ СВОИМ',
  'Your little adventuring party': 'Твоя маленькая команда искателей',
  'Choose your hero, meet your companion and give them a name.': 'Выбери героя, познакомься со спутником и дай ему имя.',
  'YOUR ACTIVE PARTY': 'ТВОЯ АКТИВНАЯ КОМАНДА',
  'Your explorer colors': 'Цвета твоего искателя',
  'Companion name': 'Имя спутника',
  'What should we call your companion?': 'Как назовём твоего спутника?',
  'Saved': 'Сохранено',
  'Save name': 'Сохранить имя',
  'Your companion’s name is saved.': 'Имя твоего спутника сохранено.',
  'Names can be changed whenever you like.': 'Имена можно менять когда угодно.',
  'Choose another hero or pet': 'Выбрать другого героя или питомца',
  'FOUR WAYS TO EXPLORE': 'ЧЕТЫРЕ СПОСОБА ИССЛЕДОВАТЬ',
  'Meet your heroes': 'Познакомься с героями',
  'Switch freely · progress stays': 'Меняй свободно · прогресс остаётся',
  'ALWAYS BY YOUR SIDE': 'ВСЕГДА РЯДОМ',
  'A small friend. A little help.': 'Маленький друг. Небольшая помощь.',
  'In your party': 'В твоей команде',
  'Choose hero': 'Выбрать героя',
  'By your side': 'Рядом с тобой',
  'Choose companion': 'Выбрать спутника',
  'original': 'оригинальный',
  'forest': 'лесной',
  'sunset': 'закатный',
  'ocean': 'океанский',
  // — PlayerWorld: Profile —
  'YOUR PLAYER CARD': 'ТВОЯ КАРТОЧКА ИГРОКА',
  'A place for your interests, your party and your learning journey.': 'Место для твоих интересов, команды и пути обучения.',
  'Your learning style reflects your introductory choices and can change as you explore.': 'Твой стиль обучения отражает начальные ответы и может меняться по мере исследования.',
  'Edit profile & revisit questions': 'Изменить профиль и вернуться к вопросам',
  'Your profile stays on this device': 'Твой профиль остаётся на этом устройстве',
  'This is a local player profile. Email login, account recovery and syncing across devices are not available yet.': 'Это локальный профиль игрока. Вход по почте, восстановление аккаунта и синхронизация между устройствами пока недоступны.',
  'See my progress': 'Смотреть мой прогресс',
  // — PlayerWorld: footer —
  'Learn something. Try something. Become a little more you.': 'Узнай что-то. Попробуй что-то. Стань немного больше собой.',
  // — WelcomeQuest —
  'Close': 'Закрыть',
  'Back': 'Назад',
  'Continue': 'Продолжить',
  'Tell us about you': 'Расскажи о себе',
  'Choose your hero': 'Выбери героя',
  'Choose your pet': 'Выбери питомца',
  'Adventure ready': 'Приключение готово',
  'What should we call you?': 'Как нам тебя называть?',
  'How old are you?': 'Сколько тебе лет?',
  'How do you identify?': 'Кем ты себя ощущаешь?',
  'What sparks your curiosity?': 'Что разжигает твоё любопытство?',
  'A nickname is perfect. This is your adventure.': 'Ник вполне подойдёт. Это твоё приключение.',
  'Choose your age group for your first learning path.': 'Выбери свою возрастную группу для первого пути обучения.',
  'You can also skip this. Every hero is open to everyone.': 'Это можно пропустить. Любой герой доступен каждому.',
  'Pick the subject you would like to explore first.': 'Выбери предмет, который хочешь изучить первым.',
  'Player name': 'Имя игрока',
  'years old': 'лет',
  'Girl': 'Девочка',
  'Boy': 'Мальчик',
  'Another identity': 'Другая идентичность',
  'Prefer not to say': 'Предпочитаю не говорить',
  'Your first interest': 'Твой первый интерес',
  'Begin the mini quest': 'Начать мини-задание',
  'No wrong answers — choose what feels natural.': 'Неправильных ответов нет — выбирай, что ближе.',
  'Meet your hero': 'Познакомься с героем',
  'Next chapter': 'Следующая глава',
  'This is your character in every PiXed world. You can change it later.': 'Это твой персонаж во всех мирах PiXed. Его можно сменить позже.',
  'Back to questions': 'Назад к вопросам',
  'Choose a pet': 'Выбрать питомца',
  'Pick your companion': 'Выбери спутника',
  'Your pet follows you through lessons and celebrates every win.': 'Питомец сопровождает тебя на уроках и радуется каждой победе.',
  'Back to heroes': 'Назад к героям',
  'Build my profile': 'Собрать мой профиль',
  'Open the game world': 'Открыть игровой мир',
  'Open the game world ': 'Открыть игровой мир ',
  'Just change my hero or pet': 'Просто сменить героя или питомца',
  'A little introduction': 'Небольшое знакомство',
  'One step at a time.': 'Шаг за шагом.',
  'Curious Explorer': 'Любопытный Исследователь',
  'Your choices today suggest you enjoy testing ideas and discovering how things work.': 'Твои сегодняшние ответы говорят, что тебе нравится проверять идеи и узнавать, как всё устроено.',
  'Smart Strategist': 'Умный Стратег',
  'Your choices today suggest you like turning big challenges into clear steps.': 'Твои сегодняшние ответы говорят, что тебе нравится превращать большие задачи в понятные шаги.',
  'Bold Creator': 'Смелый Создатель',
  'Your choices today suggest you enjoy inventing answers and building new things.': 'Твои сегодняшние ответы говорят, что тебе нравится придумывать ответы и создавать новое.',
  'Team Guide': 'Командный Наставник',
  'Your choices today suggest you enjoy sharing ideas and helping your team.': 'Твои сегодняшние ответы говорят, что тебе нравится делиться идеями и помогать команде.',
  'A bridge is offline': 'Мост не работает',
  'Your pet is waiting. What do you try first?': 'Твой питомец ждёт. Что попробуешь первым?',
  'Test the controls': 'Проверить управление',
  'Make a clear plan': 'Составить чёткий план',
  'Build a new path': 'Построить новый путь',
  'Ask the team': 'Спросить команду',
  'A robot is stuck': 'Робот застрял',
  'It repeats the wrong move. How do you help?': 'Он повторяет неверное движение. Как поможешь?',
  'Watch what changes': 'Посмотреть, что меняется',
  'Check each code line': 'Проверить каждую строку кода',
  'Write a new command': 'Написать новую команду',
  'Explain the bug': 'Объяснить ошибку',
  'The beacon needs power': 'Маяку нужна энергия',
  'You have one final move. What do you do?': 'У тебя один последний ход. Что сделаешь?',
  'Find a hidden clue': 'Найти скрытую подсказку',
  'Check every condition': 'Проверить каждое условие',
  'Try an original idea': 'Попробовать оригинальную идею',
  'Give everyone a role': 'Дать каждому роль',
  'PIXED PLAYER SETUP': 'НАСТРОЙКА ИГРОКА PIXED',
  'PLAYER READY': 'ИГРОК ГОТОВ',
  // — FirstQuest —
  'A path across the clouds': 'Путь среди облаков',
  'Help your companion cross the bridge with one repeating command.': 'Помоги спутнику перейти мост одной повторяющейся командой.',
  'Number of moves': 'Число шагов',
  'YOUR FIRST LOOP': 'ТВОЙ ПЕРВЫЙ ЦИКЛ',
  'Count the four stepping stones. How many times should your companion move?': 'Посчитай четыре камня-ступеньки. Сколько раз должен шагнуть спутник?',
  'Running your code…': 'Выполняю твой код…',
  'Bridge crossed! repeat(4) runs move() four times. One small loop, one big discovery.': 'Мост пройден! repeat(4) выполняет move() четыре раза. Один маленький цикл — одно большое открытие.',
  'You went one step past the goal. Try one fewer move.': 'Ты прошёл на шаг дальше цели. Убери один шаг.',
  'Run my code': 'Запустить код',
  'Moving…': 'Двигаюсь…',
  'Start': 'Старт',
  'Goal': 'Цель',
  // — AdventureModes: заголовки/чекпоинты —
  'SOLO PRACTICE': 'ОДИНОЧНАЯ ПРАКТИКА',
  'ADVENTURE COMPLETE': 'ПРИКЛЮЧЕНИЕ ЗАВЕРШЕНО',
  'A perfect expedition!': 'Идеальная экспедиция!',
  'Every attempt teaches you.': 'Каждая попытка чему-то учит.',
  'Back to my world': 'Назад в мой мир',
  'Finish adventure': 'Завершить приключение',
  'Next checkpoint': 'Следующая точка',
  'You got it.': 'Верно!',
  'Let’s figure it out.': 'Давай разберёмся.',
  'Capture the Flag': 'Захват флага',
  'Team Battle': 'Битва команд',
  'Base Defense': 'Защита базы',
  'Knowledge Race': 'Гонка знаний',
  'Dungeon Explorer': 'Исследователь подземелий',
  'Survival': 'Выживание',
}

// Правила для строк с подстановкой (имя игрока/питомца, числа и т.п.).
const RULES: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
  [/^WELCOME BACK, (.+)$/, m => `С ВОЗВРАЩЕНИЕМ, ${m[1]}`],
  [/^Hello, (.+)\.$/, m => `Привет, ${m[1]}.`],
  [/^Say hello to (.+)$/, m => `Поздоровайся с ${m[1]}`],
  [/^(.+) is happy to see you!$/, m => `${m[1]} рад тебя видеть!`],
  [/^(.+) & (.+)$/, m => `${m[1]} и ${m[2]}`],
  [/^(.+) joined you$/, m => `${m[1]} присоединился к тебе`],
  [/^Play (.+)$/, m => `Играть: ${m[1]}`],
  [/^Quick quest (\d+)\/(\d+)$/, m => `Быстрое задание ${m[1]}/${m[2]}`],
  [/^QUESTION (\d+) OF (\d+)$/, m => `ВОПРОС ${m[1]} ИЗ ${m[2]}`],
  [/^CHECKPOINT (\d+) OF (\d+)$/, m => `ТОЧКА ${m[1]} ИЗ ${m[2]}`],
  [/^STEP (\d+) OF (\d+)$/, m => `ШАГ ${m[1]} ИЗ ${m[2]}`],
  [/^ABOUT YOU · (\d+) \/ (\d+)$/, m => `О ТЕБЕ · ${m[1]} / ${m[2]}`],
  [/^(\d+) of 3 correct\. Your best result is saved\. Replay whenever you want to practise\.$/, m => `${m[1]} из 3 верно. Твой лучший результат сохранён. Повторяй, когда захочешь потренироваться.`],
]

function translate(text: string): string | null {
  const trimmed = text.trim()
  if (!trimmed) return null
  if (DICT[trimmed]) return text.replace(trimmed, DICT[trimmed])
  for (const [re, fn] of RULES) {
    const match = trimmed.match(re)
    if (match) return text.replace(trimmed, fn(match))
  }
  return null
}

const englishByNode = new WeakMap<Text, string>()

function isTranslatable(node: Text): boolean {
  const parent = node.parentElement
  if (!parent) return false
  const tag = parent.tagName
  if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') return false
  if (parent.closest('[data-no-translate]')) return false
  return true
}

function applyTranslation(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  while (walker.nextNode()) nodes.push(walker.currentNode as Text)
  for (const node of nodes) {
    if (!isTranslatable(node)) continue
    const source = node.nodeValue ?? ''
    const translated = translate(source)
    if (translated !== null && translated !== source) {
      englishByNode.set(node, source)
      node.nodeValue = translated
    }
  }
}

function restoreEnglish() {
  // Проходим по DOM и возвращаем исходный английский там, где подменяли.
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  while (walker.nextNode()) nodes.push(walker.currentNode as Text)
  for (const node of nodes) {
    const original = englishByNode.get(node)
    if (original !== undefined && node.nodeValue !== original) node.nodeValue = original
  }
}

// В RU-режиме делаем весь интерфейс пиксельным: в дизайне часть текста (тело,
// лейблы, eyebrow вроде «ВОЙДИ В МИР») набрана Inter — обычным шрифтом. Здесь
// принудительно ставим пиксельный Tiny5 (с кириллицей) на весь текст, кроме
// нашего собственного тумблера. Активно только когда выбран русский.
const RU_FONT_STYLE_ID = 'pixed-ru-pixel-font'
const RU_FONT_CSS = `
:root[data-lang="ru"] :where(body,h1,h2,h3,h4,h5,h6,p,span,small,b,strong,em,i,u,li,a,button,label,input,select,textarea,legend,figcaption,summary,blockquote,th,td){font-family:"Tiny5","Press Start 2P",monospace !important}
:root[data-lang="ru"] [data-no-translate] button{font-family:"Press Start 2P",monospace !important}
`

function ensureRuFontStyle() {
  if (document.getElementById(RU_FONT_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = RU_FONT_STYLE_ID
  style.textContent = RU_FONT_CSS
  document.head.appendChild(style)
}

function loadLang(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'ru' ? 'ru' : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang)

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* приватный режим — просто не сохраняем */
    }
  }

  useEffect(() => {
    if (lang !== 'ru') {
      document.documentElement.removeAttribute('data-lang')
      restoreEnglish()
      return
    }
    // Пиксельный шрифт для всего RU-текста + перевод.
    ensureRuFontStyle()
    document.documentElement.setAttribute('data-lang', 'ru')
    // Первичный проход + наблюдение за изменениями DOM (смена экранов, модалки).
    applyTranslation(document.body)
    let scheduled = false
    const observer = new MutationObserver(() => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => {
        scheduled = false
        applyTranslation(document.body)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [lang])

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

/** Плавающий тумблер EN / RU. Пиксельный шрифт совпадает с интерфейсом. */
export function LanguageToggle() {
  const { lang, setLang } = useContext(LangContext)
  const base: React.CSSProperties = {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 10,
    lineHeight: 1,
    padding: '8px 9px',
    border: 'none',
    background: 'transparent',
    color: '#8fb4e8',
    cursor: 'pointer',
  }
  const active: React.CSSProperties = { ...base, color: '#f6f8ff', background: '#1677d2' }
  return (
    <div
      data-no-translate
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 1200,
        display: 'flex',
        overflow: 'hidden',
        borderRadius: 8,
        border: '2px solid #1677d2',
        background: '#0b1f3f',
      }}
      role="group"
      aria-label="Language / Язык"
    >
      <button type="button" style={lang === 'en' ? active : base} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
        EN
      </button>
      <button type="button" style={lang === 'ru' ? active : base} aria-pressed={lang === 'ru'} onClick={() => setLang('ru')}>
        RU
      </button>
    </div>
  )
}
