# BRD + ТЗ нового билда (Code-First, Confluence-ready)

Версия: `v1.0`  
Дата: `2026-04-23`  
Источник истины: текущий код прототипа (`src/config/tuning.ts`, `src/config/level_segments.ts`, `src/scenes/*`)

---

## 0. Как использовать этот документ

- Этот документ одновременно:
  - `BRD` (бизнес-требования: что должен делать продукт),
  - `ТЗ` (как это реализовано сейчас и как это перенести в новый билд),
  - `Rebuild Blueprint` (пошаговая декомпозиция монолита `GameScene.ts`).
- Подход `code-first`: **фактическое поведение берём из репозитория**.
- Для расхождений с целевыми мокапами/договорённостями есть отдельная матрица `As-is vs Target`.
- Базовый формат для Confluence: Markdown. PDF рекомендуется генерировать из этого же markdown как вторичный артефакт.

---

## 1. Контекст и цели продукта

### 1.1 Продуктовая идея

- Игрок ведёт яхту по вертикальному раннеру к гавани.
- Главная “жизнь” игрока: шкала активов (`assets`), а не шкала щита.
- Щит активов (`shield`) имеет отдельный ресурс (`shield energy`), заполняемый энергией.
- Ран ограничен временем и препятствиями.
- Прогресс уровня: дистанция до гавани и финальная экономическая награда.

### 1.2 Бизнес-требования (ядро)

- Сессия должна быть короткой, читаемой и переигрываемой.
- Игрок должен понимать причинно-следственную связь:
  - что увеличивает/уменьшает портфель;
  - как и когда активируется щит;
  - почему начислены (или не начислены) монеты в конце.
- Результат должен быть прозрачным: разбивка награды по источникам (`яхта`, `портфель`, `колесо`).

### 1.3 Условия успеха/провала ранна (as-is)

- Победа: достижение гавани (`success_harbor_610`).
- Поражение:
  - `assets <= 0` (`assets_empty`),
  - таймер `<= 0` (`out_of_time`).
- Если гавань не достигнута: итоговые монеты = `0`.

Кодовая опора:
- `GameScene.finalizeRunAndOpenResult(...)`  
- `GameScene.finishRunSuccess/finishRunFailure/finishRunOutOfTime(...)`

---

## 2. Core Loop (as-is)

1. `Bootloader` грузит `asset-pack.json`.
2. `Intro` показывает onboarding (`onboarding-window-3`) и ожидает tap.
3. `Game`:
   - запускает интро-кинематику входа яхты;
   - переходит в основной игровой цикл (`update`);
   - считает время, скорость, дистанцию;
   - спавнит объекты по расписанию сегментов;
   - обрабатывает коллизии/бонусы/щит/колесо;
   - при успехе/поражении формирует payload результата.
4. `Result` показывает итог и по кнопке возвращает в `Intro`.
5. Новый ранн стартует повторно через `Intro -> Game`.

Кодовая опора:
- `src/main.ts`
- `src/scenes/BootloaderScene.ts`
- `src/scenes/IntroScene.ts`
- `src/scenes/GameScene.ts`
- `src/scenes/ResultScene.ts`

---

## 3. As-is механики (по коду)

## 3.1 Сцены и orchestration

### Bootloader
- Грузит весь пак ассетов: `this.load.pack("main-pack", "assets/asset-pack.json")`.
- После загрузки: `scene.start("Intro")`.

### Intro
- Фон + затемнение + onboarding-изображение.
- Текст “НАЖМИТЕ ДЛЯ ПРОДОЛЖЕНИЯ” пульсирует по альфе.
- Переход в игру по первому `pointerdown` (`input.once`).
- В `create()` сбрасываются runtime-флаги интро (`isStartingGame`, `continuePulsePhase`), чтобы повторные заходы работали стабильно.

### Game
- Монолитная сцена с полным циклом ранна.
- Явные run flow states:
  - `intro`, `normal`, `death`, `result_pending`.
- В `create()`:
  - reset state,
  - фон/текстуры/HUD/яхта/щит/groups/collisions,
  - построение расписания объектов,
  - старт интро-кинематики.

### Result
- Получает payload ранна.
- Считает `reachedHarbor`, отображает заголовок успех/провал.
- Показывает таблицу `Ваша яхта | Ваш портфель | Колесо`.
- Кнопка “ОТЛИЧНО” -> `scene.stop("Game")` + `scene.start("Intro")`.

---

## 3.2 Состояние ранна (ключевые runtime поля)

Фактические основные состояния в `GameScene`:

- Прогресс ранна:
  - `distanceM`, `remainingTimeMs`, `speedKmh`.
- Яхта и активы:
  - `yachtTier` (`1..3`),
  - `assetsValue` (`0..1`, нормализованная текущая заполненность tier-capacity).
- Щит:
  - `shieldEnergyValue` (`0..1`),
  - `shieldActive`,
  - `shieldRemainingMs` (при включённом timer mode).
- Дебаффы:
  - `whirlpoolDebuffUntilMs`, `whirlpoolSpinTurns`,
  - `obstacleSlowdownUntilMs`.
- Колесо:
  - `scheduledWheelEvents`,
  - `activeSkillWheelRewards` (стаки мультипликаторов),
  - `wheelCoinBonusStacks` (для `+10`).
- Спавн:
  - `scheduledObjects`, `scheduledObjectCursor`,
  - `coinsScheduledTotal`.

---

## 3.3 Яхты, скорость, рост, управляемость

### Тиры яхты (`YACHT_TIER_CONFIG`)

- `Y1`: `30 km/h`, `capacity x1.0`, `control x1.0`, `size x0.88`.
- `Y2`: `45 km/h`, `capacity x1.5`, `control x0.82`, `size x1.0`.
- `Y3`: `60 km/h`, `capacity x2.0`, `control x0.64`, `size x1.12`.

### Старт ранна

- `assetsValue = 0.5`, `yachtTier = 1`.
- Стартовая текстура в `createYacht()` и `startIntroCinematic()` берётся от текущих assets:
  - `getShipTextureKeyByAssets(this.assetsValue * 100)`.
- При `assets=50%` для Y1 визуально это `ship-3`.

### Апгрейд tier

- На gain:
  - `normalizedDelta = baseDelta / capacityMultiplier`.
- Если `assetsValue >= 1`:
  - Y1 -> Y2, reset assets до `0.5`.
  - Y2 -> Y3, reset assets до `0.5`.
  - Y3 остаётся Y3 (верхний кап).

### Поражение по активам

- При `assetsValue <= 0` -> `finishRunFailure("assets_empty")`.

### Скорость

- Legacy ramp отключён (`RUN_SPEED_RAMP.legacyDistanceRampEnabled = false`).
- Базовая скорость = скорость текущего tier.
- Временный бонус скорости накладывается поверх tier-speed (`SPEED_BONUS_CONFIG`).

### Управляемость

- Базовая отзывчивость = профиль платформы (`RELATIVE_TOUCH_CONTROL`) * tier multiplier.
- При whirlpool-дебаффе добавочный множитель управления:
  - `controlLerpMultiplier *= WHIRLPOOL_DEBUFF_CONFIG.controlLerpMultiplier`.

---

## 3.4 Шкала активов и шкала щита (развязаны)

### Assets bar (портфель)

- Использует `assetsValue`.
- Визуальная ширина увеличивается по tier:
  - `ASSETS_BAR_UI.widthByTierMultiplier = [1, 1.5, 2]`.
- Цвет заполнения градиентный:
  - low -> mid -> high.

### Shield energy bar

- Использует `shieldEnergyValue`.
- Заполняется сбором энергии (`collectEnergy`).
- Автоактивация щита при `>= fuelReadyThreshold` (сейчас `1.0`).

### Щит (runtime)

- `activation.manualOnly = false` (авто-режим разрешён).
- `runtime.drainEnabled = true`, `drainPerSec = 0.125`.
- Timer-модель выключена (`timerEnabled = false`), щит живёт пока есть энергия.
- При активном щите:
  - работает invulnerability по hazard map,
  - действует attract/repel/pickup magnet.

---

## 3.5 Препятствия и коллизии

### Типы hazard в runtime

- `moneyDown`
- `moneyDownMagnet`
- `dynamicBuoy`
- `whirlpool`

`mine/pirate` как игровые объекты в runtime убраны.

### Урон/эффекты

- `moneyDown`: `0.2` assets damage.
- `moneyDownMagnet`: `0.2` assets damage.
- `dynamicBuoy.down`: `0.4` assets damage.
- `whirlpool`: не наносит прямой урон, включает дебафф:
  - `durationMs = 5000`,
  - множитель управления `0.32`,
  - spin `1.25 turns/sec`.

### Reef/Rock

- `reef`: slowdown + feedback, без прямого завершения ранна.
- `rock`: solid obstacles с контактным feedback.

### Red magnet buoy (скрытый магнит)

- Спавнится через вероятность внутри `spawnMoneyDown()`:
  - `rareRatio = 0.3`.
- Визуально использует ту же текстуру `money-down`.
- Притяжение к яхте задаётся в `applyRedMagnetBuoyForces`.
- В текущем конфиге `behindPullEnabled = false` (притяжение “снизу вверх” отключено).

---

## 3.6 Пикапы и бонусы

### Зелёный буёк (`moneyUp`)

- Даёт прирост активов:
  - `TUNING.FUEL_PICKUP_VALUE * assetsMultiplier`.

### Dynamic buoy (`up`)

- Даёт прирост активов:
  - `DYNAMIC_BUOY_STATES.up.fuelDelta * assetsMultiplier`.

### Time bonus

- Даёт время:
  - `RUN_TIMER.bonusMs * timeMultiplier`.

### Speed bonus

- Активирует ускорение на `effectDurationMs = 5000`.
- Множитель скорости: `speedMultiplier = 1.5`.

### Energy (в коде группа `coins`)

- Текстура: `energy-bonus`.
- Подбор увеличивает `shieldEnergyValue` на:
  - `SHIELD_ENERGY_CONFIG.pickupNormalizedDelta * energyMultiplier`
  - сейчас `0.025 * multiplier`.

---

## 3.7 Skill Wheel

### Планирование событий

- `guaranteedMeters = [600]`.
- Дополнительные окна:
  - `400..800` с шансом `0.55`,
  - `800..1200` с шансом `0.45`.
- Максимум за ранн: `3` события (1 guaranteed + до 2 extra).

### Island-сегменты под колесо

- После планирования событий запускается `applySkillWheelIslandSegments()`.
- Для каждого события берётся island-template (`length=50`, объект в центре `meterOffset=25`).
- В окне `[event.meter-25, event.meter+25)` все объекты удаляются.
- Затем добавляется ровно 1 island объект (`wheelIsland1/2`).

### Rewards

- Сектора -> reward id:
  - `coin_plus_10`,
  - `assets_mult`,
  - `time_mult`,
  - `energy_mult`.
- Reward stacks:
  - старт мультипликатора с `x2`,
  - рост до `x4` cap,
  - `coin_plus_10` стакается аддитивно (+10 за выпадение).
- Длительности rewards не используются (до конца ранна).

### HUD бонусов

- Вверху показываются только 3 мультипликатора:
  - assets/time/energy.
- `coin_plus_10` в HUD не выводится.
- В слоте показывается текст `x2/x3/x4`.

---

## 3.8 Сегменты и спавн

### Пулы и шаблоны

- Длина пула: `100м`.
- Количество пулов: `12`.
- Диапазон уровня: `0..1200` + финальный сегмент `1200..1250`.
- Каталог шаблонов:
  - `26` templates,
  - `18` сегментов длиной `50м`,
  - `8` сегментов длиной `100м`.
- Специальные сегменты колеса:
  - `2` island template (`wheelIsland1/2`, длина 50).

### Финальный сегмент

- `FINAL_SEGMENT_1200_1250`:
  - `harbor`,
  - `harborGate`,
  - спавн в конце дистанции.

### Правила безопасности/гарантий

- Гарантии на пул:
  - минимумы по `moneyUp`, `moneyDown`, `dynamicBuoy`, `reef`.
- Energy:
  - target `100` на ранн,
  - min gap по метрам `14`,
  - дополнительный x-gap `0.10`.
- Global bonuses:
  - speed/time планируются отдельно от template (`fromSegments=false`),
  - safety-проверки по конфликтующим типам.

---

## 3.9 Экономика результата

Формулы в `GameScene.finalizeRunAndOpenResult(...)`:

- `tier = yachtTier`
- `assetsFill = clamp(assetsValue, 0..1)`
- `yachtCoins = baseByTier[tier-1]` (`[5,10,15]`)
- `portfolioCoinsRaw = yachtCoins * assetsFill`
- `portfolioCoins = floor/round/ceil` (текущий режим: `floor`)
- `wheelCoins = wheelCoinBonusStacks * wheelCoinBonusPerStack` (`10`)
- `earnedIfSuccess = yachtCoins + portfolioCoins + wheelCoins`
- `totalCoins = reachedHarbor ? earnedIfSuccess : 0`

---

## 3.10 UI экраны (as-is)

### Onboarding (`Intro`)

- Ассет: `onboarding-window-3` (`938x1827` px).
- Позиционирование:
  - `windowYRatio = 0.46`,
  - масштаб в пределах `windowMinScale..windowMaxScale`,
  - fit by width/height ratio.
- Тап в любом месте запускает игру.

### Result (`ResultScene`)

- Адаптивный `uiScale = clamp(min(width/864, height/1536), 0.38, 1)`.
- Таблица из 3 колонок:
  - `Ваша яхта`,
  - `Ваш портфель`,
  - `Колесо`.
- Win/Loss заголовки и условный текст “монеты не начислены”.

---

## 4. Справочник параметров `tuning.ts` (как регулировать)

Ниже перечислены **рабочие блоки параметров** и практические правила их настройки.  
Рекомендуемая последовательность тюнинга: `Core loop -> Hazards -> Rewards -> UI`.

## 4.1 Глобальная физика/фон

| Параметр | Что делает | Если увеличить | Если уменьшить | Безопасный рабочий диапазон |
|---|---|---|---|---|
| `TUNING.FUEL_PICKUP_VALUE` | базовый прирост активов от `moneyUp` | быстрее рост яхты | медленнее рост | `0.03..0.08` |
| `FALL_SPEED.perKmh` | конверсия `speedKmh` в вертикальную скорость объектов | объекты “летят” быстрее | объекты медленнее | `8..14` |
| `WATER_SCROLL.perKmh` | скорость скролла воды относительно скорости яхты | визуально быстрее мир | медленнее фон | `0.005..0.02` |
| `SEA_BACKGROUND_CONFIG.alphaCrossfade.durationMeters` | длина визуального перехода моря | мягче/дольше переход | резче переход | `60..140` |
| `WORLD_OBJECT_DARKENING_CONFIG.*` | затемнение объектов по стадиям моря | выше драматизм, ниже читаемость | чище визуал | intensity per stage `0..0.2` |

## 4.2 UI/HUD

| Параметр | Что делает | Как регулировать |
|---|---|---|
| `ASSETS_BAR_UI` | геометрия и цвета шкалы активов | ширина/мультипликаторы задают рост бара по tier; `fillColor*` меняют читаемость риска |
| `SHIELD_ENERGY_BAR_UI` | геометрия щит-бара | синхронизировать размеры/смещение с assets bar |
| `TOP_PROGRESS_BAR_CONFIG` | дистанционный progress + маркер + флаг | `anchorXRatio`, `bar.width` для конфликтов с верхним HUD |
| `TIME_UI_CONFIG` | панель таймера | уменьшать `width/height/font` на узких экранах |
| `INTRO_ONBOARDING_UI` | позиция/масштаб onboarding и continue text | `windowYRatio`, `windowMax*Ratio`, `continueBottomInsetPx` |
| `RESULT_SCREEN_UI` | адаптив result-экрана | baseline под 864x1536, runtime scale в ResultScene |
| `SKILL_WHEEL_UI_CONFIG` | модалка колеса (геометрия, тексты, секторы) | `rewardBySectorIndex` и `result.iconMax*` критичны для корректных иконок |
| `SKILL_WHEEL_BONUS_HUD_CONFIG` | верхние иконки активных бонусов | `layoutsByCount` и `multiplierText` |
| `HITBOX_DEBUG` | оверлей и perf-метрики | включать только для диагностики |

## 4.3 Core progression

| Параметр | Что делает | Если увеличить | Если уменьшить | Диапазон |
|---|---|---|---|---|
| `RUN_TIMER.initialMs` | стартовое время ранна | проще пройти | выше давление по времени | `60_000..100_000` |
| `RUN_TIMER.bonusMs` | награда за time bonus | бонус сильнее | бонус слабее | `6_000..14_000` |
| `YACHT_TIER_CONFIG.tiers[].speedKmh` | базовая скорость tier | выше темп и сложность | ниже темп | Y1 `<` Y2 `<` Y3 |
| `YACHT_TIER_CONFIG.tiers[].capacityMultiplier` | ёмкость активов tier | медленнее потеря/рост нормализованных активов | более хрупкий tier | `1 / 1.3..1.7 / 1.8..2.4` |
| `YACHT_TIER_CONFIG.tiers[].controlLerpMultiplier` | отзывчивость tier | лучше управление | хуже управление | Y2 `0.7..0.9`, Y3 `0.5..0.75` |
| `ASSETS_SYSTEM_CONFIG.startNormalized` | стартовая заполненность активов | больше запас на старте | старт сложнее | `0.4..0.6` |
| `ASSETS_SYSTEM_CONFIG.upgradeAtNormalized` | порог апгрейда tier | апгрейд позже | апгрейд раньше | обычно `1.0` |
| `ASSETS_SYSTEM_CONFIG.resetOnUpgradeNormalized` | заполнение после апгрейда | безопаснее апгрейд | рискованный апгрейд | `0.4..0.6` |
| `RUN_SPEED_RAMP.legacyDistanceRampEnabled` | legacy автоускорение по дистанции | если `true`, ломает tier-speed модель | если `false`, чистая tier-модель | для новой концепции `false` |

## 4.4 Щит и энергия

| Параметр | Что делает | Если увеличить | Если уменьшить | Диапазон |
|---|---|---|---|---|
| `SHIELD_ENERGY_CONFIG.pickupNormalizedDelta` | сколько энергии даёт 1 energy pickup | щит активируется чаще | нужно больше pickup | `0.015..0.04` |
| `SHIELD_ENERGY_CONFIG.autoActivateAtNormalized` | порог автоактивации | щит реже | щит чаще | обычно `1.0` |
| `ASSET_SHIELD_CONFIG.runtime.drainPerSec` | скорость разряда активного щита | щит короче | щит дольше | `0.08..0.2` |
| `ASSET_SHIELD_CONFIG.magnet.attract.*` | притяжение полезных объектов | сильнее автосбор | меньше помощи | force `2000..8000` |
| `ASSET_SHIELD_CONFIG.magnet.repel.*` | отталкивание опасных объектов | легче “выживать” | выше риск контактов | force `2500..6000` |
| `ASSET_SHIELD_CONFIG.pickupMagnet.*` | магнит пикапов вокруг яхты при щите | меньше промахов | выше точность нужна от игрока | radius `220..380` |

## 4.5 Hazard/obstacle balance

| Параметр | Что делает | Если увеличить | Если уменьшить |
|---|---|---|---|
| `HAZARD_DAMAGE.moneyDown/moneyDownMagnet` | урон от красных буйков | быстрее loss по активам | мягче наказание |
| `DYNAMIC_BUOY_STATES.down.fuelPenalty` | штраф dynamic down | сильный риск от “ошибки” | мягче риск |
| `WHIRLPOOL_DEBUFF_CONFIG.durationMs` | длительность плохого управления | дольше уязвимость | короче окно наказания |
| `WHIRLPOOL_DEBUFF_CONFIG.controlLerpMultiplier` | степень ухудшения управления | ближе к “почти неуправляемо” | мягче debuff |
| `OBSTACLE_SLOWDOWN.dropKmh` | просадка скорости от solid-contact | сильнее тормозит | слабее тормозит |
| `RED_MAGNET_BUOY_CONFIG.rareRatio` | доля магнитных красных | чаще скрытый магнит | реже магнит |
| `RED_MAGNET_BUOY_CONFIG.attractForcePxPerSec` | сила притяжения магнита | опаснее магниты | безопаснее магниты |
| `RED_MAGNET_BUOY_CONFIG.behindPullEnabled` | притяжение из позиции ниже яхты | если `true`, магнит “возвращается” вверх | если `false`, только фронтальное/боковое поведение |

## 4.6 Сегменты и спавн

| Параметр | Что делает | Рекомендации |
|---|---|---|
| `SEGMENT_PATTERN_RULES.requiredPerPool` | минимумы объектов по пулу | главный рычаг средней сложности на 100м |
| `SEGMENT_PICKUP_RULES.energy.totalCount` | целевое количество energy за ранн | держать синхронно с `pickupNormalizedDelta` |
| `SEGMENT_PICKUP_RULES.energy.minGapMeters` | дистанция между energy | против наложений/склеек |
| `SEGMENT_PICKUP_RULES.energy.minDeltaXRatio` | боковой разнос energy | уменьшает визуальное пересечение |
| `SEGMENT_GLOBAL_BONUS_SPAWN.rulesByType.*` | частота speed/time бонусов | тюнинг “ритма спасательных бонусов” |
| `SEGMENT_GLOBAL_BONUS_SPAWN.safety.*` | безопасное расстояние бонусов от hazards | снижает “несправедливые” спавны |

## 4.7 Skill Wheel

| Параметр | Что делает | Рекомендации |
|---|---|---|
| `SKILL_WHEEL_EVENT_CONFIG.guaranteedMeters` | гарантированные точки колеса | минимум 1 событие для стабильности core loop |
| `SKILL_WHEEL_EVENT_CONFIG.extra.windows` | дополнительные окна и шанс | покрывать нужный диапазон дистанций |
| `SKILL_WHEEL_EVENT_CONFIG.maxEventsPerRun` | лимит событий | чаще всего `3` для UX без перегруза |
| `SKILL_WHEEL_EVENT_CONFIG.islandSpawn.minGapMeters` | дистанция между island-событиями | защищает от слишком частых модалок |
| `SKILL_WHEEL_STACK_CONFIG.multiplierMin/max` | диапазон стаков мультипликаторов | текущая модель `x2..x4` |
| `SKILL_WHEEL_REWARD_CONFIG.rewards.*` | иконки/тексты/мультипликаторы | `resultKey` должен ссылаться на корректный ассет |

---

## 5. Сегменты и спавн (`level_segments.ts`) — детально

## 5.1 Объектные типы сегментов

`SegmentObjectType`:

- hazards/obstacles: `moneyDown`, `moneyDownMagnet`, `dynamicBuoy`, `whirlpool`, `rock1/2/3`, `reef1`
- pickups/bonuses: `moneyUp`, `energy`, `speedBonus`, `timeBonus`
- landmarks/events: `wheelIsland1/2`, `harbor`, `harborGate`

## 5.2 Каталог шаблонов

- `SEGMENT_TEMPLATE_CATALOG`: 26 шаблонов.
- Длины:
  - 50м: 18,
  - 100м: 8.
- Шаблоны имеют:
  - `baseWeight`,
  - `weightByPoolStage`,
  - `poolWindow`,
  - `maxPoolsPerRun`,
  - `objects`.

## 5.3 Пайплайн построения расписания в GameScene

1. Итерируем каждый pool (`1..12`), заполняем до `pool.endMeter`.
2. Выбираем template по весам и ограничениям.
3. Добавляем template-объекты (`appendTemplateObjects`).
4. Пытаемся добавить energy (если one-per-segment включён; сейчас выключен).
5. Гарантируем минимумы по пулу (`ensurePoolObjectRequirements`).
6. Добавляем финальный harbor сегмент (`1200..1250`).
7. Добиваем energy до target (`appendMissingEnergiesInFinalWindow`).
8. Планируем global bonuses (`speedBonus`, `timeBonus`).
9. Планируем skill-wheel events.
10. Вставляем island-сегменты (строгая очистка 50м окна события).
11. Сортируем `scheduledObjects` по `spawnMeter`.

## 5.4 Ограничения безопасности

- Energy не спавнится слишком близко друг к другу и к hazard-блокирующим объектам.
- Global bonuses имеют собственный safety filter.
- Для skill-wheel island сегмента окно полностью очищается от других спавнов.

---

## 6. As-is vs Target Matrix (апрель 2026)

| Подсистема | As-is (по коду) | Target (финальные договорённости) | Gap | Приоритет | Риск |
|---|---|---|---|---|---|
| Развязка `Assets` и `Shield` | Реализовано: отдельные `assetsValue` и `shieldEnergyValue` | Должно быть раздельно | Нет | High (done) | Low |
| 3 яхты + апгрейд | Реализовано (`30/45/60`, reset 50%) | Соответствует | Нет | High (done) | Low |
| Старт Y1-стадии | Стартовая текстура от текущих assets, при 50% это `ship-3` | Должно быть без “лишнего перескока” после интро | Нет | High (done) | Low |
| Mine/Pirate в runtime | Убраны из hazard union и спавна | Должны отсутствовать | Нет | High (done) | Low |
| Red magnet buoy | Есть отдельный тип + скрытая визуализация | Должен притягивать сильнее обычного red buoy | Частично: `behindPullEnabled=false` в конфиге | High | Medium |
| Whirlpool | Дебафф управления + спин 5с | Должен быть серьёзным penalty без insta-fail | Частично: степень penalty возможно ещё мягкая для некоторых сценариев | High | Medium |
| Монеты в ранне | На уровне используется `energy` (группа `coins`) | Монеты только на result/harbor | Логика ок, но naming legacy (`coins`) | Medium | Low |
| Wheel rewards | `assets/time/energy` мультипликаторы + `coin+10`, стаки до x4 | До конца ранна, stack x2..x4 | Нет | High (done) | Low |
| Верхний HUD бонусов | Только 3 мультипликатора, без duration bars, без `+10` | Должно быть так | Нет | High (done) | Low |
| Skill wheel island segment | Строгое 50м окно, 1 остров, очистка других объектов | Должно быть так | Нет | High (done) | Low |
| Onboarding UX | Tap anywhere, пульс текста, `onboarding-window-3` | Соответствие мокапу по позиции/масштабу | Возможна дополнительная доводка per-device | Medium | Medium |
| Result typography/layout | Адаптивный `uiScale` + fallback font stack | Должно быть близко к мокапу на мобильных | Возможна дополнительная визуальная калибровка | Medium | Medium |
| Монолитность GameScene | Один большой класс с множеством обязанностей | Новый билд должен быть модульным | Крупный structural gap | Critical | High |
| Legacy-константы/нейминг | Есть исторические имена (`FUEL_*`, `coins`, старые patternId) | Чистый терминологический слой нового билда | Нужна нормализация в rebuild | Medium | Low |

---

## 7. Rebuild Blueprint (для нового программиста)

Цель: переписать новый билд без монолита `GameScene`, сохранив текущие механики и параметры.

## 7.1 Целевая модульная декомпозиция

Рекомендуемая структура:

- `domain/run-state.ts`
  - единый state и pure reducers.
- `domain/types.ts`
  - `RunState`, `SpawnObject`, `WheelRewardState`, `ResultPayload`, enum-типизация.
- `systems/spawn/segment-planner.ts`
  - построение расписания сегментов, гарантий, бонусов, islands.
- `systems/spawn/spawn-runtime.ts`
  - трансляция `SpawnObject` -> Phaser объекты.
- `systems/collision/collision-system.ts`
  - контактные правила, cooldowns, damage/debuff.
- `systems/shield/shield-system.ts`
  - энергия, auto-activation, drain, magnet/repel.
- `systems/wheel/wheel-system.ts`
  - scheduling, modal state machine, reward stacks.
- `systems/progression/yacht-progression.ts`
  - tiers, assets gain/damage, upgrade rules, speed base.
- `systems/ui/*`
  - onboarding, HUD bars, top progress, bonus HUD, result presenter.
- `adapters/phaser/*`
  - thin wrappers для sprite creation/tweens/groups/input.

## 7.2 Целевые внутренние контракты

```ts
type RunState = {
  timeMs: number;
  distanceM: number;
  tier: 1 | 2 | 3;
  assetsNorm: number;
  shieldEnergyNorm: number;
  shieldActive: boolean;
  activeDebuffs: {
    whirlpoolUntilMs: number;
    obstacleSlowdownUntilMs: number;
  };
  rewardStacks: Record<"assets_mult" | "time_mult" | "energy_mult", number>;
  wheelCoinBonusStacks: number;
};
```

```ts
type SpawnObject = {
  type: SegmentObjectType;
  spawnMeter: number;
  xRatio?: number;
  xOffsetPx?: number;
  source: "segment" | "global_bonus" | "skill_wheel_island" | "final_harbor";
};

type SegmentPlan = {
  objects: SpawnObject[];
  wheelEvents: Array<{
    meter: number;
    islandType: "wheelIsland1" | "wheelIsland2";
    source: "guaranteed" | "extra";
  }>;
};
```

```ts
type WheelRewardState = {
  id: "assets_mult" | "time_mult" | "energy_mult" | "coin_plus_10";
  stack?: number; // только для multiplier rewards
  cap?: number;   // x4
  persistentUntilRunEnd: true;
};
```

```ts
type ResultPayload = {
  reachedHarbor: boolean;
  tier: 1 | 2 | 3;
  assetsFill: number;
  yachtCoins: number;
  portfolioCoins: number;
  wheelCoins: number;
  totalCoins: number;
  reason: "success_harbor_610" | "assets_empty" | "out_of_time";
  distanceM: number;
};
```

## 7.3 Порядок миграции (итеративно)

1. `Foundation`
  - выделить типы/интерфейсы и read-only config layer.
  - обеспечить совместимость payload Result.
2. `Core mechanics`
  - вынести progression + damage + speed/timer.
  - интегрировать tiers/assets/shield без изменения поведения.
3. `Spawn planner`
  - вынести планирование сегментов и wheel islands в pure module.
4. `Wheel + rewards`
  - state machine модалки + stacks + coin bonus.
5. `UI surfaces`
  - intro/hud/result как отдельные presenter-компоненты.
6. `Balancing + cleanup`
  - унификация нейминга (assets/energy вместо legacy fuel/coin terms),
  - удаление дублирующихся/исторических веток.
7. `QA gate`
  - сравнение старого и нового ранна по контрольным сценариям.

---

## 8. Чек-лист приёмки нового билда

## 8.1 Функциональные сценарии

- Старт: Y1, `assets=50%`, интро-кинематика без перескоков текстуры.
- Рост:
  - Y1 full -> Y2 (assets reset 50%),
  - Y2 full -> Y3 (assets reset 50%).
- Поражение:
  - `assets=0`,
  - `time=0`.
- Победа:
  - достижение harbor, корректный переход в Result.

## 8.2 Балансные сценарии

- В ранне нет mine/pirate.
- Есть red magnet buoy (редко) с ожидаемой силой притяжения.
- Whirlpool даёт заметный debuff управления на 5s.
- Energy распределена часто (порядка target), без наложений.

## 8.3 Skill wheel сценарии

- Есть guaranteed event ~600м.
- Не больше 3 событий за ранн.
- Для каждого wheel-event: 50м “чистый” island сегмент.
- Rewards:
  - стеки `x2 -> x3 -> x4`,
  - `coin_plus_10` суммируется.
- HUD показывает только multiplier rewards.

## 8.4 Result/экономика

- Формула монет соответствует:
  - `yacht + portfolio + wheel`, либо `0` при недостижении гавани.
- Таблица и тексты читаемы на мобильных разрешениях.

## 8.5 Технические проверки

- `npm run build` без ошибок.
- Нет missing texture ошибок.
- Нет ошибок переходов сцен (`Intro -> Game -> Result -> Intro`) при многократных циклах.

---

## 9. Карта кодовых источников (трассируемость)

- Основной игровой цикл и механики: `src/scenes/GameScene.ts`
- Onboarding: `src/scenes/IntroScene.ts`
- Result payload/UI: `src/scenes/ResultScene.ts`
- Bootstrap и scene order: `src/main.ts`, `src/scenes/BootloaderScene.ts`
- Тюнинг параметров: `src/config/tuning.ts`
- Сегменты/шаблоны: `src/config/level_segments.ts`
- Ассеты и ключи: `public/assets/asset-pack.json`

---

## 10. Рекомендация по формату артефактов

- **Основной артефакт:** этот `Markdown` (лучше для версионирования и быстрых правок).
- **Для Confluence:** вставка markdown секциями (таблицы и заголовки совместимы).
- **Вторичный артефакт:** PDF-экспорт из markdown (для “замороженной” передачи внешним подрядчикам).

