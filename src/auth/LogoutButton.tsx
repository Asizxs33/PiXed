import { useEffect, useState } from 'react'
import { useLang } from '../i18n/translate'

/**
 * Пиксельная иконка выхода: дверной проём слева и стрелка наружу справа.
 * Рисуется чанки-блоками на сетке 16×16 и рендерится 1:1 (16px), поэтому края
 * остаются резкими и глиф читается как пиксель-арт — в стиле набора PixelIcons.
 */
function LogoutIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true">
      {/* дверной проём (скобка, открытая вправо) */}
      <rect x="2" y="2" width="2" height="12" />
      <rect x="2" y="2" width="5" height="2" />
      <rect x="2" y="12" width="5" height="2" />
      {/* стрелка наружу */}
      <rect x="6" y="7" width="6" height="2" />
      <rect x="10" y="5" width="2" height="2" />
      <rect x="12" y="7" width="2" height="2" />
      <rect x="10" y="9" width="2" height="2" />
    </svg>
  )
}

/**
 * Кнопка «Выйти из аккаунта».
 *
 * Приложение хранит игрока локально (профиль + прогресс в localStorage), поэтому
 * выход = очистить эти ключи и вернуться на стартовый экран (создание игрока).
 * Показывается ТОЛЬКО когда открыта страница профиля (в DOM есть блок
 * `.profile-summary`), а не поверх всех экранов. Компоненты приложения не
 * редактируются — определяем страницу по DOM и чистим хранилище.
 */
const PROFILE_KEY = 'pixed-player-profile-v3'
// Ключи, привязанные к локальному игроку. Язык (pixed-lang) намеренно не трогаем.
const CLEAR_KEYS = ['pixed-player-profile-v3', 'pixed-adventures-v1', 'pixed-progress-v3']

export function LogoutButton() {
  const { lang } = useLang()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const check = () => {
      let ok = false
      try {
        // Кнопка нужна только на странице профиля залогиненного игрока.
        ok = Boolean(localStorage.getItem(PROFILE_KEY)) && Boolean(document.querySelector('.profile-summary'))
      } catch {
        ok = false
      }
      setVisible(ok)
    }
    check()
    // Страница профиля появляется/исчезает при навигации внутри приложения —
    // следим за DOM и подстраховываемся лёгким опросом.
    const observer = new MutationObserver(check)
    observer.observe(document.body, { childList: true, subtree: true })
    const id = window.setInterval(check, 600)
    return () => {
      observer.disconnect()
      window.clearInterval(id)
    }
  }, [])

  if (!visible) return null

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
