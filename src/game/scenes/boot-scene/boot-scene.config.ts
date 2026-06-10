export const BOOT_SCENE_NAME = 'BootScene' as const;

export const PROGRESS_BAR = {
  height: 18,
  backgroundColor: 0x4a4a4a,
  progressColor: 0xc6c6c6,
} as const;

export const LOADER_TEXT = {
  text: 'Загрузка...',
  style: {
    fontFamily: 'Arial',
    fontSize: '18px',
    color: '#e0e0e0',
  },
} as const;
