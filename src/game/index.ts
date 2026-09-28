export { createPiXedGame } from './createPiXedGame'
export { GAME_HEIGHT, GAME_WIDTH } from './constants'
export type { CreatePiXedGameOptions, GameBridge, PlayerPosition } from './types'
export { PhaserGame } from './react/PhaserGame'
export type { PhaserGameProps } from './react/PhaserGame'
export type { GameLauncherProps } from './react/GameLauncher'
// Публичная точка входа для React — ленивая, чтобы Phaser не попадал в
// начальный бандл. Сам `GameLauncher` доступен внутри игровой зоны напрямую.
export { LazyGameLauncher as GameLauncher } from './react/LazyGameLauncher'
