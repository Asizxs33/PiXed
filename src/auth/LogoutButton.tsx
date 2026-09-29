import { useEffect, useState } from 'react'
import { useLang } from '../i18n/translate'

/**
 * Пиксельная иконка выхода: дверной проём слева и стрелка наружу справа.
 * Нарисована блоками на сетке 20×20 в том же стиле, что и набор PixelIcons.
 */
function LogoutIcon() {
  return (
    <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true">
      {/* дверной проём (скобка, открытая вправо) */}
      <rect x="3" y="3" width="2" height="14" />
      <rect x="3" y="3" width="6" height="2" />
      <rect x="3" y="15" width="6" height="2" />
      {/* стрелка наружу */}
      <rect x="6" y="9" width="8" height="2" />
      <rect x="12" y="7" width="2" height="2" />
      <rect x="14" y="9" width="2" height="2" />
      <rect x="12" y="11" width="2" height="2" />
    </svg>
  )
}

/**
 * Самостоятельная кнопка «Выйти из аккаунта».
 *
 * Приложение хранит игрока локально (профиль + прогресс в localStorage), поэтому
 * выход = очистить эти ключи и вернуться на стартовый экран (создание игрока).
 * Компонент не трогает компоненты приложения: он лишь чистит хранилище и
 * перезагружает страницу — на старте `loadLearnerProfile()` вернёт null и покажет
 * лендинг. Кнопка видна только когда профиль существует (пользователь «залогинен»).
 */
const PROFILE_KEY = 'pixed-player-profile-v3'
// Ключи, привязанные к локальному игроку. Язык (pixed-lang) намеренно не трогаем.
const CLEAR_KEYS = ['pixed-player-profile-v3', 'pixed-adventures-v1', 'pixed-progress-v3']

export function LogoutButton() {
  const { lang } = useLang()
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    const check = () => {
      try {
        setHasProfile(Boolean(localStorage.getItem(PROFILE_KEY)))
      } catch {
        setHasProfile(false)
      }
    }
    check()
    // Профиль создаётся/меняется внутри приложения (в этой же вкладке), поэтому
    // событие 'storage' не сработает — подстраховываемся лёгким опросом.
    const id = window.setInterval(check, 600)
    window.addEventListener('storage', check)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('storage', check)
    }
  }, [])

  if (!hasProfile) return null

  const copy =
    lang === 'ru'
      ? { label: 'Выйти', confirm: 'Выйти из аккаунта? Локальный профиль и прогресс на этом устройстве будут удалены.' }
      : { label: 'Log out', confirm: 'Log out of your account? Your local profile and progress on this device will be removed.' }

  const logout = () => {
    if (!window.confirm(copy.confirm)) return
    try {
      CLEAR_KEYS.forEach(key => localStorage.removeItem(key))
    } catch {
      /* приватный режим — просто перезагрузим */
    }
    window.location.reload()
  }

  return (
    <button
      type="button"
      data-no-translate
      onClick={logout}
      style={{
        position: 'fixed',
        right: 16,
        bottom: 60,
        zIndex: 1200,
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 10,
        lineHeight: 1,
        color: '#ffb4b4',
        background: '#0b1f3f',
        border: '2px solid #b1495a',
        borderRadius: 8,
        padding: '9px 11px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
      }}
    >
      <LogoutIcon />
      {copy.label}
    </button>
  )
}
