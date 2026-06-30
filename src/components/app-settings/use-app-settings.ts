import type { SoundManagerInitArgs } from '@/game/system/sound-manager';

import { useGame } from '@/contexts/game-context';
import { useClientProfile } from '@/hooks/use-client-profile';
import { useUiInteractionSound } from '@/hooks/use-ui-interaction-sound';
import { useUpdateClientSettings } from '@/hooks/use-update-client-settings';
import { debounce } from '@/utils';

export const useAppSettings = () => {
  const game = useGame();

  const { playInteractionSound } = useUiInteractionSound();

  const { data } = useClientProfile();

  const settings = data?.settings;

  const { updateClientSettings } = useUpdateClientSettings(
    true,
    undefined,
    false
  );

  const debouncedUpdateClientSettings = debounce(updateClientSettings);
  const debouncedApplySoundManagerSettings = debounce(
    (settings: SoundManagerInitArgs) =>
      game?.soundManager?.applySettings(settings),
    10
  );

  const handleToggleMusic = (value: boolean) => {
    playInteractionSound();
    game?.soundManager?.applySettings({ isMusicEnabled: value });
    debouncedUpdateClientSettings({ musicEnabled: value });
  };

  const handleToggleSound = (value: boolean) => {
    playInteractionSound();
    debouncedApplySoundManagerSettings({ isSoundEnabled: value });
    debouncedUpdateClientSettings({ soundEnabled: value });
  };

  return {
    musicEnabled: settings?.musicEnabled,
    soundEnabled: settings?.soundEnabled,
    handleToggleMusic,
    handleToggleSound,
  };
};
