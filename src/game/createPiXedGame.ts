import Phaser from 'phaser'
import { GAME_COLORS, GAME_HEIGHT, GAME_WIDTH } from './constants'
import { BootScene } from './scenes/BootScene'
import { LobbyScene } from './scenes/LobbyScene'
import type { CreatePiXedGameOptions } from './types'

export function createPiXedGame({
  parent,
  width = GAME_WIDTH,
  height = GAME_HEIGHT,
  bridge,
}: CreatePiXedGameOptions) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width,
    height,
    backgroundColor: GAME_COLORS.background,
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    scene: [new BootScene(), new LobbyScene(bridge)],
  })
}
