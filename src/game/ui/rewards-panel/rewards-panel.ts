import * as Phaser from 'phaser';

import {
  BONUS_ICON_KEYS,
  GAP,
  ICON_SIZE,
  LAYOUTS,
  PANEL_DEPTH,
  ROW_Y,
} from './rewards-panel.config';

import type { RewardSlot, VisibleRewardBonus } from './rewards-panel.types';

import { GameState } from '@/game/system/game-state';

export class RewardsPanel {
  private scene: Phaser.Scene;
  private gameState: GameState;
  private container?: Phaser.GameObjects.Container;
  private slots: RewardSlot[] = [];
  private renderKey = '';

  constructor(scene: Phaser.Scene, gameState: GameState) {
    this.scene = scene;
    this.gameState = gameState;
  }

  create() {
    const { width } = this.scene.scale;

    this.slots = [];

    this.container = this.scene.add.container(width * 0.5, ROW_Y);
    this.container.setDepth(PANEL_DEPTH);
    this.container.setVisible(false);

    for (let i = 0; i < 3; i += 1) {
      const slotContainer = this.scene.add.container(0, 0);

      const frame = this.scene.add.graphics();

      const icon = this.scene.add.image(0, 0, BONUS_ICON_KEYS.assets);
      icon.setDisplaySize(ICON_SIZE, ICON_SIZE);

      const amountText = this.scene.add.text(0, 10, '', {
        fontFamily: 'Fascinate',
        fontSize: '26px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      });
      amountText.setOrigin(0.5, 0.5);

      slotContainer.add([frame, icon, amountText]);
      slotContainer.setVisible(false);
      this.container.add(slotContainer);

      this.slots.push({
        container: slotContainer,
        frame,
        icon,
        amountText,
      });
    }

    this.render();
  }

  update() {
    this.render();
  }

  destroy() {
    this.container?.destroy();
    this.slots.forEach(({ container, frame, icon, amountText }) => {
      container.destroy();
      frame.destroy();
      icon.destroy();
      amountText.destroy();
    });

    this.container = undefined;
    this.slots = [];
    this.renderKey = '';
  }

  private render() {
    if (!this.container) {
      return;
    }

    const rewards = this.gameState.skillWheelBonuses.filter(
      (bonus): bonus is { type: VisibleRewardBonus; amount: number } =>
        bonus.type !== 'coins'
    );

    const nextRenderKey = rewards
      .map(({ type, amount }) => `${type}:${amount}`)
      .join('|');

    if (nextRenderKey === this.renderKey) return;
    this.renderKey = nextRenderKey;

    if (!rewards.length) {
      this.container.setVisible(false);
      this.slots.forEach((slot) => slot.container.setVisible(false));
      return;
    }

    this.container.setVisible(true);

    const layout =
      LAYOUTS[rewards.length as 1 | 2 | 3] ??
      rewards.map(
        (_, index) => (index - (rewards.length - 1) * 0.5) * (ICON_SIZE + GAP)
      );

    rewards.forEach((reward, index) => {
      const slot = this.slots[index];

      if (!slot) {
        return;
      }

      slot.container.setVisible(true);
      slot.container.setPosition(layout[index] ?? 0, 0);
      slot.icon.setTexture(BONUS_ICON_KEYS[reward.type]);
      slot.amountText.setText(`x${reward.amount + 1}`);

      this.drawFrame(slot.frame);
    });

    for (let i = rewards.length; i < this.slots.length; i += 1) {
      this.slots[i]?.container.setVisible(false);
    }
  }

  private drawFrame(graphics: Phaser.GameObjects.Graphics) {
    const radius = ICON_SIZE * 0.5 + 2;

    graphics.clear();
    graphics.fillStyle(0x111111, 0.28);
    graphics.fillCircle(0, 0, radius);
    graphics.lineStyle(2, 0x000000, 1);
    graphics.strokeCircle(0, 0, radius);
  }
}
