import { useEffect, useState } from 'react'
import { useLang } from '../i18n/translate'

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
      }}
    >
      ⎋ {copy.label}
    </button>
  )
}
