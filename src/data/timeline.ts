/**
 * Структурированные данные раздела «Полёт».
 *
 * Время:
 *  - `timestamp_sec` отсчитывается от старта корабля «Восток-1»
 *    (09:07:00 МСК, 06:07:00 UTC). Отрицательные значения — предстарт.
 *  - Длительность полёта: 108 минут = 6480 секунд (от старта до приземления
 *    у дер. Смеловка). Скруббер таймлайна работает в диапазоне 0…6480.
 *
 * Источники: см. `sources.ts`, id 16…25.
 */

/** Позывные переговоров «Кедр–Заря» (УКВ и КВ радиоканалы). */
export type Speaker =
  | 'Кедр' // Гагарин (на КВ — «Кдр»)
  | 'Заря-1' // Байконур (Королёв, Каманин, Руднев, Попович, Галлай)
  | 'Заря-2' // Колпашево
  | 'Заря-3' // Елизово (Камчатка)
  | 'Весна'; // КВ-радиостанции в Хабаровске и Москве (на КВ — «ВСН»)

/** Цветовой акцент карточки события. */
export type EventHighlight = 'success' | 'tension' | 'milestone';

export interface TimelineEvent {
  /** Уникальный технический id. */
  id: string;
  /** T+ в секундах. Отрицательные значения — предстартовые события. */
  timestamp_sec: number;
  /** Московское время для отображения, например '09:07' или '10:25:34'. */
  moscowTime: string;
  /** Краткое название события (отображается в карточке и над скруббером). */
  title: string;
  /** 1–3 предложения описания. */
  description: string;
  /** id источников из sources.ts (для кликабельных сносок). */
  sourceIds: ReadonlyArray<number>;
  /** Ключевые события — крупные точки на шкале, остальные — мелкие. */
  isMajor?: boolean;
  /** Цветовой акцент: успех/напряжение/веха. */
  highlight?: EventHighlight;
  /**
   * Опциональный аудиоклип к этому моменту.
   * Путь относительно `import.meta.env.BASE_URL`, например 'audio/poyekhali.ogg'.
   */
  audio?: string;
}

export interface TranscriptLine {
  /** Уникальный технический id. */
  id: string;
  /** T+ в секундах. */
  timestamp_sec: number;
  /** Позывной говорящего. */
  speaker: Speaker;
  /** Полное имя/должность в скобках, если уместно — для тултипа. */
  speakerFull?: string;
  /** Текст реплики. */
  text: string;
  /** id источников. */
  sourceIds: ReadonlyArray<number>;
}

/** Параметры полёта (для блока «Параметры орбиты» в шапке раздела). */
export const FLIGHT_FACTS = {
  startMoscow: '09:07:00 МСК',
  startUtc: '06:07:00 UTC',
  durationSec: 6480, // 108 минут
  apogeeKm: 327,
  perigeeKm: 181,
  inclinationDeg: 64.95,
  orbitalPeriodMin: 89.34,
  launchSite: 'Байконур, площадка № 1',
  landingSite: 'дер. Смеловка, Энгельсский район, Саратовская обл.',
} as const;

// ============================================================
// СОБЫТИЯ ПОЛЁТА (20 шт.)
// ============================================================
export const TIMELINE_EVENTS: ReadonlyArray<TimelineEvent> = [
  // --- Предстарт (timestamp_sec < 0) ---
  {
    id: 'wakeup',
    timestamp_sec: -5400, // T-1:30
    moscowTime: '07:37',
    title: 'Подъём космонавтов',
    description:
      'Гагарина и его дублёра Германа Титова разбудили в их домике на Байконуре. Завтрак в тюбике, медосмотр, надевание скафандра СК-1.',
    sourceIds: [16, 17, 18],
  },
  {
    id: 'transport-to-pad',
    timestamp_sec: -3600, // T-1:00
    moscowTime: '08:07',
    title: 'Доставка на стартовую площадку',
    description:
      'Автобус ЛАЗ доставил космонавтов к ракете Р-7 на 1-й площадке Байконура. В 07:11 Гагарин занял место в кресле спускаемого аппарата.',
    sourceIds: [16, 17],
  },
  {
    id: 'state-commission',
    timestamp_sec: -1800, // T-0:30
    moscowTime: '08:37',
    title: 'Заседание Госкомиссии',
    description:
      'Государственная комиссия под председательством К. Н. Руднева утвердила запуск. Подписано полётное задание Космонавту № 1.',
    sourceIds: [16],
    highlight: 'milestone',
  },
  {
    id: 'minute-readiness',
    timestamp_sec: -60, // T-0:01
    moscowTime: '09:06',
    title: 'Минутная готовность',
    description:
      'Подаётся минутная готовность. Связь с «Заря-1» (Королёв, Каманин). Все системы корабля штатно.',
    sourceIds: [17, 18, 26],
    audio: 'audio/korolev_gagarin_launch.mp3',
  },

  // --- СТАРТ И ВЫВЕДЕНИЕ ---
  {
    id: 'launch',
    timestamp_sec: 0,
    moscowTime: '09:07:00',
    title: 'СТАРТ. «Поехали!»',
    description:
      'Включение зажигания, отрыв ракеты-носителя от стартового стола. Гагарин произносит ставшее крылатым «Поехали!». Перегрузка нарастает.',
    sourceIds: [16, 17, 18, 25],
    isMajor: true,
    highlight: 'success',
    audio: 'audio/poyekhali.ogg',
  },
  {
    id: 'first-stage-separation',
    timestamp_sec: 118, // T+1:58
    moscowTime: '09:09',
    title: 'Отделение 1-й ступени',
    description:
      'Отделяются 4 боковых блока ракеты-носителя Р-7. Корабль продолжает движение на центральном блоке.',
    sourceIds: [16, 19],
  },
  {
    id: 'shroud-jettison',
    timestamp_sec: 156, // T+2:36
    moscowTime: '09:09:36',
    title: 'Сброс головного обтекателя',
    description:
      'Открывается окно с прибором ориентации «Взор». Гагарин впервые видит Землю с орбитальной высоты: «Красота-то какая!»',
    sourceIds: [16, 18, 19, 26],
    isMajor: true,
    highlight: 'milestone',
    audio: 'audio/gagarin_what_he_sees.mp3',
  },
  {
    id: 'second-stage-separation',
    timestamp_sec: 300, // T+5:00
    moscowTime: '09:12',
    title: 'Отделение 2-й ступени',
    description:
      'Заканчивается работа центрального блока — он отделяется. Включается третья ступень (блок «Е») для довывода на орбиту.',
    sourceIds: [16, 17, 19],
  },
  {
    id: 'orbit-insertion',
    timestamp_sec: 676, // T+11:16
    moscowTime: '09:18:16',
    title: 'Выход на орбиту',
    description:
      'Корабль отделяется от блока «Е». Параметры орбиты: апогей 327 км, перигей 181 км, наклонение 64.95°, период 89.34 мин.',
    sourceIds: [16, 17],
    isMajor: true,
    highlight: 'success',
  },

  // --- ОРБИТАЛЬНЫЙ ПОЛЁТ ---
  {
    id: 'weightlessness',
    timestamp_sec: 840, // T+14:00
    moscowTime: '09:21',
    title: 'Состояние невесомости',
    description:
      'Гагарин докладывает о наступлении невесомости. Это был первый в истории эксперимент по влиянию длительной невесомости на человека.',
    sourceIds: [17, 18, 26],
    isMajor: true,
    highlight: 'milestone',
    audio: 'audio/gagarin_feels_great.mp3',
  },
  {
    id: 'khabarovsk-pass',
    timestamp_sec: 1440, // T+24:00
    moscowTime: '09:31',
    title: 'Сеанс связи с Хабаровском',
    description:
      'УКВ-связь с Колпашевом и Хабаровском (позывные «Заря-2», «Заря-3», «Весна»). Гагарин докладывает: «Самочувствие отличное».',
    sourceIds: [16, 18, 22, 26],
    audio: 'audio/gagarin_intermediate_comm.mp3',
  },
  {
    id: 'earth-shadow-entry',
    timestamp_sec: 2520, // T+42:00
    moscowTime: '09:49',
    title: 'Вход в тень Земли',
    description:
      'Корабль пересекает экватор около 170° з. д. и входит в земную тень над Южной частью Тихого океана.',
    sourceIds: [17, 18],
  },
  {
    id: 'over-america',
    timestamp_sec: 3000, // T+50:00
    moscowTime: '09:57',
    title: 'Пролёт над Америкой',
    description:
      'Корабль проходит над Южной Америкой. В этот же момент в эфире выходит сообщение ТАСС о запуске первого пилотируемого корабля (голос Ю. Б. Левитана).',
    sourceIds: [17, 26],
    audio: 'audio/levitan_tass.mp3',
  },
  {
    id: 'earth-shadow-exit',
    timestamp_sec: 3720, // T+62:00
    moscowTime: '10:09',
    title: 'Выход из тени Земли',
    description:
      'Корабль выходит на освещённую сторону. Гагарин наблюдает восход Солнца с орбиты — явление, которого не видел до него ни один человек.',
    sourceIds: [17],
    highlight: 'milestone',
  },
  {
    id: 'over-africa',
    timestamp_sec: 4080, // T+68:00
    moscowTime: '10:15',
    title: 'Пролёт над Африкой',
    description:
      'Корабль движется над африканским континентом, приближается к финальной части витка.',
    sourceIds: [17],
  },

  // --- СПУСК ---
  {
    id: 'retrofire',
    timestamp_sec: 4714, // T+78:34
    moscowTime: '10:25:34',
    title: 'Включение ТДУ',
    description:
      'Тормозная двигательная установка конструктора А. М. Исаева работает успешно, но отключается на ~1 с раньше из-за исчерпания топлива. Автоматика выдаёт запрет на штатное разделение отсеков.',
    sourceIds: [16, 17],
    isMajor: true,
    highlight: 'tension',
  },
  {
    id: 'spinning',
    timestamp_sec: 5160, // T+86:00
    moscowTime: '10:33',
    title: 'Аварийное вращение',
    description:
      'Спускаемый аппарат и приборный отсек не разделяются штатно. Корабль вращается ~1 оборот в секунду в течение 10 минут — до прогара кабелей в плотных слоях атмосферы.',
    sourceIds: [16, 17],
    highlight: 'tension',
  },
  {
    id: 'ejection',
    timestamp_sec: 5760, // T+96:00
    moscowTime: '10:43',
    title: 'Катапультирование',
    description:
      'На высоте около 7 км Гагарин катапультируется из спускаемого аппарата — штатная схема приземления для «Востока-1».',
    sourceIds: [16, 17],
    isMajor: true,
    highlight: 'tension',
  },
  {
    id: 'landing',
    timestamp_sec: 6480, // T+108:00
    moscowTime: '10:55',
    title: 'Приземление',
    description:
      'Гагарин приземляется на парашюте у деревни Смеловка Энгельсского района Саратовской области. Его встречает Анна Тахтарова с внучкой Ритой. «Сынок, неужели из космоса?» — «Представьте себе, да!»',
    sourceIds: [16, 17],
    isMajor: true,
    highlight: 'success',
  },
];

// ============================================================
// РЕПЛИКИ ПЕРЕГОВОРОВ (10 шт.)
// ============================================================
export const TRANSCRIPT_LINES: ReadonlyArray<TranscriptLine> = [
  {
    id: 'launch-poyekhali',
    timestamp_sec: 0,
    speaker: 'Кедр',
    speakerFull: 'Кедр (Ю. А. Гагарин)',
    text: 'Поехали! Всё проходит нормально.',
    sourceIds: [16, 17, 18, 25],
  },
  {
    id: 'ascent-status',
    timestamp_sec: 50,
    speaker: 'Кедр',
    text: '…Самочувствие хорошее. Вижу горизонт. Перегрузки растут.',
    sourceIds: [17, 18],
  },
  {
    id: 'shroud-earth',
    timestamp_sec: 156,
    speaker: 'Кедр',
    text: 'Вижу Землю… Красота-то какая! Слышимость отличная. Самочувствие хорошее, бодрое. Машина идёт нормально.',
    sourceIds: [17, 18, 19],
  },
  {
    id: 'orbit-report',
    timestamp_sec: 680, // T+11:20
    speaker: 'Кедр',
    text: 'Произошло разделение с носителем в 9 ч 18 мин 07 с согласно заданию. Самочувствие хорошее. Параметры кабины: давление единица, влажность 65, температура 20 °C.',
    sourceIds: [22],
  },
  {
    id: 'weightlessness-report',
    timestamp_sec: 840,
    speaker: 'Кедр',
    text: '«Весна», я «Кедр». Наступило состояние невесомости. Чувствую себя хорошо, всё проходит нормально.',
    sourceIds: [17, 18],
  },
  {
    id: 'khabarovsk-1',
    timestamp_sec: 1440,
    speaker: 'Кедр',
    text: '«Весна», я «Кедр». Самочувствие отлично, очень, очень, очень. Дайте мне результаты по полёту!',
    sourceIds: [18],
  },
  {
    id: 'khabarovsk-2',
    timestamp_sec: 1460,
    speaker: 'Весна',
    text: 'Повторите, я вас слышу плохо.',
    sourceIds: [18],
  },
  {
    id: 'dark-side',
    timestamp_sec: 3000,
    speaker: 'Кедр',
    text: 'Прохожу тёмную сторону Земли. Звёзды видны очень ярко.',
    sourceIds: [17],
  },
  {
    id: 'sunrise',
    timestamp_sec: 3720,
    speaker: 'Кедр',
    text: 'Выхожу на освещённую часть Земли. Идёт восход Солнца. Очень красиво.',
    sourceIds: [17],
  },
  {
    id: 'retrofire-report',
    timestamp_sec: 4714,
    speaker: 'Кедр',
    text: '«Весна», я «Кедр». Включился «Спуск-1». Подвижный индекс ПКРС движется ко второму положению. Все окошки ПКРС горят. Самочувствие хорошее. Настроение бодрое.',
    sourceIds: [22],
  },
];

/**
 * Форматирует timestamp_sec в строку 'T+H:MM:SS' / 'T-H:MM:SS' / 'T+MM:SS'.
 */
export function formatTPlus(timestamp_sec: number): string {
  const sign = timestamp_sec < 0 ? 'T-' : 'T+';
  const abs = Math.abs(timestamp_sec);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  if (h > 0) {
    return `${sign}${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${sign}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
