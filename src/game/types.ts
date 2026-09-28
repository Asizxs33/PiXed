export type GameParent = string | HTMLElement

export type PlayerPosition = {
  x: number
  y: number
}

export type GameBridge = {
  onReady?: (sceneKey: string) => void
  onPlayerMove?: (position: PlayerPosition) => void
}

export type CreatePiXedGameOptions = {
  parent: GameParent
  width?: number
  height?: number
  bridge?: GameBridge
}
