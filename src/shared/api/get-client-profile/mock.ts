import type { ClientProfile } from '@/shared/types';

export const CLIENT_PROFILE_RESPONSE: ClientProfile = {
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    tutorialComplete: false,
  },
  yachts: [
    {
      id: '3fa85f64-5717-4562-b3fc-210123456789',
      type: 'Normal',
      title: 'Обычная',
      description:
        'Ваша первая яхта\nдля покорения любых вод поможет пройти через самые сложные испытания',
      isAvailable: true,
      isSelected: true,
    },
    {
      id: '3fa85f64-5717-4562-b3fc-219876543210',
      type: 'Gold',
      title: 'Золотая',
      description:
        'Уникальная яхта\nиз чистого золота для настоящих ценителей роскоши и богатства',
      isAvailable: true,
      unavailableDescription: 'Откройте все улучшения, чтобы разблокировать',
      isSelected: false,
    },
  ],
  yachtImprovements: [
    {
      id: '3fa85f64-5717-4562-b3fc-210123498765',
      type: 'Wheel',
      subTitle: 'Быстрый',
      title: 'Штурвал',
      description: 'Улучшает управляемость\nяхтой',
      taskDescription:
        'Чтобы активировать - зайдите\nв раздел "Задания" и выполните задание "Покупка акции голубая фишка"',
      isReceived: false,
    },
    {
      id: '3fa85f64-5717-4562-b3fc-219876501234',
      type: 'Frame',
      subTitle: 'Крепкий',
      title: 'Корпус',
      description: 'Делает яхту устойчивой\nк замедлению от препятствий',
      taskDescription:
        'Чтобы активировать - зайдите\nв раздел "Задания" и выполните задание "Увеличить портфель\nна 5 000 Р"',
      isReceived: false,
    },
    {
      id: '3fa85f64-5717-4562-b3fc-219876501236',
      type: 'Engine',
      subTitle: 'улучшенный',
      title: 'Мотор',
      description: 'Препятствия больше\nне замедляют яхту',
      taskDescription:
        'Чтобы активировать - зайдите\nв раздел "Задания" и выполните задание "Покупка акции роста"',
      isReceived: false,
    },
    {
      id: '3fa85f64-5717-4562-b3fc-219876501237',
      type: 'Shield',
      subTitle: 'МОЩНЫЙ',
      title: 'Щит',
      description: 'Продлевает время действия\nщита активов',
      taskDescription:
        'Чтобы активировать - зайдите\nв раздел "Задания" и выполните задание "Покупка корпоративной облигации".',
      isReceived: false,
    },
  ],
  levels: [
    {
      id: '3fa85f64-5717-4562-b3fc-219876577777',
      number: 1,
      title: 'Море',
      isAvailable: true,
    },
    {
      id: '3fa85f64-5717-4562-b3fc-219876522222',
      number: 2,
      title: 'Джунгли',
      isAvailable: false,
    },
    {
      id: '3fa85f64-5717-4562-b3fc-219876522223',
      number: 3,
      title: 'Арктика',
      isAvailable: false,
    },
  ],
  attempts: {
    freeAttempts: 1,
    attemptRefresh: '2026-06-25T01:00:00.000Z',
    paidAttemptIsAvailable: true,
    paidAttemptPrice: {
      goldCoins: 20,
      diamonds: 0,
    },
  },
  currencies: {
    goldCoins: 400,
    diamonds: 123,
  },
};
