import { useEffect, useState } from 'react'
import { PhaserGame } from './PhaserGame'
import type { PlayerPosition } from '../types'

export type GameLauncherProps = {
  open: boolean
  title?: string
  onClose: () => void
}

/**
 * Полноэкранный оверлей, который запускает Phaser-сцену поверх React-интерфейса.
 *
 * Компонент изолирован в игровой зоне и использует только inline-стили, поэтому
 * не затрагивает общую дизайн-систему (`src/styles.css`). Взаимодействие с игрой
 * идёт через `GameBridge`: сюда приходит позиция игрока и событие готовности сцены.
 */
export function GameLauncher({ open, title, onClose }: GameLauncherProps) {
  const [ready, setReady] = useState(false)
  const [position, setPosition] = useState<PlayerPosition | null>(null)

  // Сброс состояния при каждом новом запуске и закрытие по Escape.
  useEffect(() => {
    if (!open) {
      setReady(false)
      setPosition(null)
      return
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-label={title ?? 'Игровая сцена'}>
      <div style={frameStyle}>
        <header style={headerStyle}>
          <div style={titleGroupStyle}>
            <span style={titleStyle}>{title ?? 'PiXed'}</span>
            <span style={statusStyle}>
              {ready ? 'СЦЕНА ГОТОВА' : 'ЗАГРУЗКА…'}
              {position ? ` • X:${position.x} Y:${position.y}` : ''}
            </span>
          </div>
          <button type="button" onClick={onClose} style={closeStyle} aria-label="Закрыть игру">
            ✕ ВЫХОД
          </button>
        </header>

        <div style={stageStyle}>
          <PhaserGame
            bridge={{
              onReady: () => setReady(true),
              onPlayerMove: setPosition,
            }}
          />
        </div>

        <p style={hintStyle}>Управление: WASD или стрелки • Escape — выход</p>
      </div>
    </div>
  )
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'grid',
  placeItems: 'center',
  padding: '24px',
  background: 'rgba(2, 8, 23, 0.86)',
  backdropFilter: 'blur(6px)',
}

const frameStyle: React.CSSProperties = {
  width: 'min(1000px, 100%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '16px',
  borderRadius: '14px',
  border: '3px solid #1677d2',
  boxShadow: '0 0 0 2px #43efff inset, 0 24px 60px rgba(0, 0, 0, 0.55)',
  background: '#040d1f',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
}

const titleGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
}

const titleStyle: React.CSSProperties = {
  fontFamily: 'Tiny5, monospace',
  fontSize: '20px',
  color: '#f6f8ff',
  letterSpacing: '1px',
}

const statusStyle: React.CSSProperties = {
  fontFamily: '"Press Start 2P", monospace',
  fontSize: '10px',
  color: '#43efff',
}

const closeStyle: React.CSSProperties = {
  fontFamily: '"Press Start 2P", monospace',
  fontSize: '10px',
  color: '#f6f8ff',
  background: '#0b1f3f',
  border: '2px solid #1677d2',
  borderRadius: '8px',
  padding: '10px 12px',
  cursor: 'pointer',
}

const stageStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: '10px',
  overflow: 'hidden',
  background: '#020817',
}

const hintStyle: React.CSSProperties = {
  margin: 0,
  textAlign: 'center',
  fontFamily: 'Tiny5, monospace',
  fontSize: '14px',
  color: '#8fb4e8',
}
