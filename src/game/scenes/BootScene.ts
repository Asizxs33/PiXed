import Phaser from 'phaser'
import { GAME_COLORS } from '../constants'

export class BootScene extends Phaser.Scene {
  static readonly key = 'BootScene'

  constructor() {
    super(BootScene.key)
  }

  create() {
    this.createPlayerTexture()
    this.createTileTexture()
    this.scene.start('LobbyScene')
  }

  private createPlayerTexture() {
    const graphics = this.make.graphics({ x: 0, y: 0 })

    graphics.fillStyle(0x25162f).fillRect(8, 0, 16, 5)
    graphics.fillStyle(0x25162f).fillRect(4, 5, 24, 7)
    graphics.fillStyle(0xef9f78).fillRect(7, 12, 18, 12)
    graphics.fillStyle(0x151025).fillRect(10, 16, 3, 3)
    graphics.fillStyle(0x151025).fillRect(20, 16, 3, 3)
    graphics.fillStyle(GAME_COLORS.blue).fillRect(5, 24, 22, 19)
    graphics.fillStyle(GAME_COLORS.cyan).fillRect(8, 27, 16, 4)
    graphics.fillStyle(0x091329).fillRect(7, 43, 7, 5)
    graphics.fillStyle(0x091329).fillRect(19, 43, 7, 5)
    graphics.generateTexture('player-adventurer', 32, 48)
    graphics.destroy()
  }

  private createTileTexture() {
    const graphics = this.make.graphics({ x: 0, y: 0 })

    graphics.fillStyle(GAME_COLORS.floor).fillRect(0, 0, 32, 32)
    graphics.lineStyle(1, GAME_COLORS.grid, 0.65).strokeRect(0, 0, 32, 32)
    graphics.fillStyle(0x0c2a51).fillRect(4, 4, 3, 3)
    graphics.fillStyle(0x031027).fillRect(23, 21, 4, 4)
    graphics.generateTexture('lobby-tile', 32, 32)
    graphics.destroy()
  }
}
