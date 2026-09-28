import { useEffect, useRef } from 'react'
import type Phaser from 'phaser'
import { createPiXedGame } from '../createPiXedGame'
import type { GameBridge } from '../types'

export type PhaserGameProps = {
  bridge?: GameBridge
  className?: string
}

/**
 * React-обёртка над Phaser-игрой.
 *
 * Создаёт экземпляр Phaser.Game при монтировании, монтирует его в собственный
 * контейнер и корректно уничтожает при размонтировании. Это единственная точка,
 * где React владеет жизненным циклом Phaser — сам код игры о React ничего не знает.
 */
export function PhaserGame({ bridge, className }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  // bridge держим в ref, чтобы пересоздание callback'ов не перезапускало игру.
  const bridgeRef = useRef<GameBridge | undefined>(bridge)
  bridgeRef.current = bridge

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const game = createPiXedGame({
      parent: container,
      bridge: {
        onReady: (sceneKey) => bridgeRef.current?.onReady?.(sceneKey),
        onPlayerMove: (position) => bridgeRef.current?.onPlayerMove?.(position),
      },
    })
    gameRef.current = game

    return () => {
      game.destroy(true)
      gameRef.current = null
    }
  }, [])

  return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }} />
}
