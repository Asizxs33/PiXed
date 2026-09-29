import Phaser from 'phaser'
import { GAME_COLORS, GAME_HEIGHT, GAME_WIDTH } from '../constants'
import type { GameBridge, PlayerPosition } from '../types'

type MovementKeys = {
  up: Phaser.Input.Keyboard.Key
  down: Phaser.Input.Keyboard.Key
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
  w: Phaser.Input.Keyboard.Key
  a: Phaser.Input.Keyboard.Key
  s: Phaser.Input.Keyboard.Key
  d: Phaser.Input.Keyboard.Key
}

export class LobbyScene extends Phaser.Scene {
  static readonly key = 'LobbyScene'

  private readonly bridge?: GameBridge
  private player!: Phaser.Physics.Arcade.Sprite
  private keys!: MovementKeys
  private lastReportedPosition: PlayerPosition = { x: -1, y: -1 }

  constructor(bridge?: GameBridge) {
    super(LobbyScene.key)
    this.bridge = bridge
  }

  create() {
    this.createPixelWorld()
    this.createHud()
    this.createPlayer()
    this.createControls()
    this.bridge?.onReady?.(LobbyScene.key)
  }

  update() {
    const speed = 190
    const left = this.keys.left.isDown || this.keys.a.isDown
    const right = this.keys.right.isDown || this.keys.d.isDown
    const up = this.keys.up.isDown || this.keys.w.isDown
    const down = this.keys.down.isDown || this.keys.s.isDown

    this.player.setVelocity(0)

    if (left) this.player.setVelocityX(-speed)
    if (right) this.player.setVelocityX(speed)
    if (up) this.player.setVelocityY(-speed)
    if (down) this.player.setVelocityY(speed)

    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.velocity.normalize().scale(speed)
    this.reportPosition()
  }

  private createPixelWorld() {
    this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'lobby-tile').setOrigin(0)

    const frame = this.add.graphics()
    frame.lineStyle(6, GAME_COLORS.blue).strokeRect(18, 18, GAME_WIDTH - 36, GAME_HEIGHT - 36)
    frame.lineStyle(2, GAME_COLORS.cyan).strokeRect(25, 25, GAME_WIDTH - 50, GAME_HEIGHT - 50)

    for (let index = 0; index < 7; index += 1) {
      const x = 88 + index * 132
      const height = 70 + (index % 3) * 28
      this.add.rectangle(x, GAME_HEIGHT - 58 - height / 2, 76, height, 0x09234b)
        .setStrokeStyle(3, index % 2 ? GAME_COLORS.purple : GAME_COLORS.blue)
    }
  }

  private createHud() {
    this.add.text(52, 47, 'PIXED // GAME CORE', {
      fontFamily: 'Tiny5, monospace',
      fontSize: '30px',
      color: '#f6f8ff',
      stroke: '#001027',
      strokeThickness: 5,
    })

    this.add.text(54, 87, 'ТЕСТОВАЯ СЦЕНА • WASD / СТРЕЛКИ', {
      fontFamily: 'Tiny5, monospace',
      fontSize: '16px',
      color: '#43efff',
    })

    this.add.text(GAME_WIDTH - 55, 50, 'ONLINE', {
      fontFamily: 'Press Start 2P, monospace',
      fontSize: '10px',
      color: '#72ff9d',
      backgroundColor: '#031027',
      padding: { x: 10, y: 8 },
    }).setOrigin(1, 0)
  }

  private createPlayer() {
    this.player = this.physics.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'player-adventurer')
    this.player.setScale(2)
    this.player.setCollideWorldBounds(true)
    this.player.setDepth(10)
  }

  private createControls() {
    const keyboard = this.input.keyboard

    if (!keyboard) {
      throw new Error('Keyboard input is unavailable in the current Phaser environment.')
    }

    const cursors = keyboard.createCursorKeys()
    const wasd = keyboard.addKeys('W,A,S,D') as Record<'W'|'A'|'S'|'D', Phaser.Input.Keyboard.Key>

    // Гасим стандартное поведение браузера (прокрутку страницы стрелками),
    // пока игрок управляет персонажем. Захват активен только на время жизни
    // сцены — при закрытии оверлея игра уничтожается вместе с ним.
    keyboard.addCapture(['UP', 'DOWN', 'LEFT', 'RIGHT', 'W', 'A', 'S', 'D'])

    this.keys = {
      up: cursors.up,
      down: cursors.down,
      left: cursors.left,
      right: cursors.right,
      w: wasd.W,
      a: wasd.A,
      s: wasd.S,
      d: wasd.D,
    }
  }

  private reportPosition() {
    const position = {
      x: Math.round(this.player.x),
      y: Math.round(this.player.y),
    }

    if (position.x === this.lastReportedPosition.x && position.y === this.lastReportedPosition.y) return

    this.lastReportedPosition = position
    this.bridge?.onPlayerMove?.(position)
  }
}
