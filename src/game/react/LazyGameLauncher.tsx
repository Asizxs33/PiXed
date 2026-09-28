import { Suspense, lazy } from 'react'
import type { GameLauncherProps } from './GameLauncher'

// Phaser весит ~1.4 МБ, а игра нужна только при запуске сцены. Поэтому весь
// игровой модуль грузится динамически и не попадает в начальный бандл страницы.
const GameLauncherView = lazy(() =>
  import('./GameLauncher').then((module) => ({ default: module.GameLauncher })),
)

/**
 * Ленивая обёртка над `GameLauncher`: подгружает Phaser-код только когда игрок
 * действительно запускает игру (`open === true`), сохраняя лёгким первый рендер.
 */
export function LazyGameLauncher(props: GameLauncherProps) {
  if (!props.open) return null

  return (
    <Suspense fallback={null}>
      <GameLauncherView {...props} />
    </Suspense>
  )
}
