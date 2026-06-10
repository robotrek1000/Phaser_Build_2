import { useEffect, useState } from 'react';

import type { LevelId } from '@/game/level-design';

import { type BoosterType } from '@/components/main-screen/components/boosters';
import { BOOSTER_SETTING } from '@/components/main-screen/main-screen.constants';
import { useGame } from '@/contexts/game-context';
import { DEFAULT_GAME_SETTINGS } from '@/game';

export const useMainScreen = () => {
  const game = useGame();

  const [gameSettings, setGameSettings] = useState(DEFAULT_GAME_SETTINGS);

  const [isHowToPlayGuideVisible, setIsHowToPlayGuideVisible] = useState(false);

  const showHowToPlayGuide = () => {
    setIsHowToPlayGuideVisible(true);
  };

  const hideHowToPlayGuide = () => {
    setIsHowToPlayGuideVisible(false);
  };

  const handleLevelChange = (level: LevelId) => {
    setGameSettings({ ...gameSettings, level });
  };

  const boostersState: Record<BoosterType, boolean> = {
    body: gameSettings.isBodyReinforced,
    engine: gameSettings.isEngineImproved,
    shield: gameSettings.isShieldReinforced,
    steeringWheel: gameSettings.isSteeringWheelFast,
  };

  const handleBoosterClick = (booster: BoosterType) => {
    const property = BOOSTER_SETTING[booster];

    setGameSettings({ ...gameSettings, [property]: !gameSettings[property] });
  };

  const toggleSkin = () => {
    setGameSettings({
      ...gameSettings,
      yachtSkin: gameSettings.yachtSkin === 'gold' ? 'normal' : 'gold',
    });
  };

  useEffect(() => {
    game?.setSettings(gameSettings);
  }, [game, gameSettings]);

  return {
    level: gameSettings.level,
    isLevelAvailable: gameSettings.level === 1,
    boostersState,
    isHowToPlayGuideVisible,
    isGoldSkin: gameSettings.yachtSkin === 'gold',
    showHowToPlayGuide,
    hideHowToPlayGuide,
    handleLevelChange,
    handleBoosterClick,
    toggleSkin,
  };
};
