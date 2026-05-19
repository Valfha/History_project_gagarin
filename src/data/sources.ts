/**
 * Библиография проекта.
 *
 * Каждый источник имеет числовой `id`, который используется для кликабельных
 * сносок в текстах биографии (рендерятся как [1], [2] и т. д.) и для
 * полного списка на странице/в футере.
 *
 * При добавлении нового источника:
 *   1. Подберите свободный id (плотный 1..N).
 *   2. Заполните title/url/publisher.
 *   3. Кратко опишите, какие факты подкрепляются (`covers`).
 */

export type SourceCategory =
  | 'encyclopedia'
  | 'archive'
  | 'museum'
  | 'media'
  | 'memoir'
  | 'agency';

export interface Source {
  /** Числовой идентификатор сноски (видимый пользователю как [1]). */
  id: number;
  /** Название статьи/книги. */
  title: string;
  /** Издатель / автор / организация. */
  publisher: string;
  /** Прямой URL (ru-ресурсы предпочтительны). */
  url: string;
  /** Категория для группировки в списке. */
  category: SourceCategory;
  /** Что именно подтверждает источник (для прозрачности). */
  covers: string;
}

export const SOURCES: ReadonlyArray<Source> = [
  // --- Энциклопедические и архивные ---
  {
    id: 1,
    title: 'Гагарин, Юрий Алексеевич',
    publisher: 'Википедия (русская)',
    url: 'https://ru.wikipedia.org/wiki/Гагарин,_Юрий_Алексеевич',
    category: 'encyclopedia',
    covers:
      'Биография в целом, даты, даты оккупации Клушино, переезд в Гжатск.',
  },
  {
    id: 2,
    title: 'Гагарин Юрий Алексеевич — биографическая справка',
    publisher: 'Центр подготовки космонавтов им. Ю. А. Гагарина',
    url: 'http://gctc.ru/print.php?id=928',
    category: 'agency',
    covers: 'Официальная биография ЦПК, даты учёбы и службы.',
  },
  {
    id: 3,
    title: 'В 1934 г. родился первый космонавт в мире Юрий Алексеевич Гагарин',
    publisher: 'Центральный музей ВВС',
    url: 'https://cmvvs.ru/muzejnaya-deyatelnost/znamenatelnye-daty/v-1934-g-rodilsya-pervyj-kosmonavt-v-mire-yurij-alekseevich-gagarin.html',
    category: 'museum',
    covers: 'Эпизод с подушкой в Чкаловском ВАУЛ, семейные сведения.',
  },
  {
    id: 4,
    title: "Yuri Gagarin's Klushino: Forgotten home of space legend",
    publisher: 'BBC News (2011)',
    url: 'https://www.bbc.com/news/science-environment-12875848',
    category: 'media',
    covers:
      'Детство в оккупации, землянка, угон брата и сестры, реконструкция дома в Гжатске.',
  },
  {
    id: 5,
    title: 'Yuri Gagarin',
    publisher: 'European Space Agency (ESA)',
    url: 'https://www.esa.int/About_Us/50_years_of_ESA/50_years_of_humans_in_space/Yuri_Gagarin',
    category: 'agency',
    covers: 'Сводная биография, путь от литейщика до лётчика.',
  },

  // --- Период обучения ---
  {
    id: 6,
    title: 'Профессионально-педагогический колледж СГТУ им. Гагарина — История',
    publisher: 'Саратовская областная универсальная научная библиотека',
    url: 'http://www.sounb.ru/gagarin/?ELEMENT_ID=19355',
    category: 'archive',
    covers: 'Заявление 1951 года, оценки, физико-технический кружок.',
  },
  {
    id: 7,
    title: 'Город, определивший судьбу',
    publisher: 'СГТУ им. Ю. А. Гагарина',
    url: 'https://www.sstu.ru/universitet/navstrechu-yubileyu/moy-politekh/gorod-opredelivshiy-sudbu/',
    category: 'archive',
    covers:
      'Подробности учёбы в Саратове, доклад о Циолковском, спорт и общественная жизнь.',
  },
  {
    id: 8,
    title: 'Аэроклуб имени Ю. А. Гагарина',
    publisher: 'Саратовская областная универсальная научная библиотека',
    url: 'http://www.sounb.ru/gagarin/?ELEMENT_ID=19352',
    category: 'archive',
    covers:
      'Зачисление в аэроклуб 26.10.1954, 18.05.1955 первый прыжок, 3.07.1955 первый самостоятельный полёт.',
  },
  {
    id: 9,
    title:
      'Космонавт Юрий Гагарин получил путёвку в небо в Саратовском аэроклубе ДОСААФ',
    publisher: 'ДОСААФ России',
    url: 'http://www.dosaaf.ru/news/kosmonavt-yurij-gagarin-poluchil-putevku-v-nebo-v-saratovskom/',
    category: 'agency',
    covers: '196 полётов и 42 ч 23 мин налёта в аэроклубе.',
  },
  {
    id: 10,
    title: 'Грамота о передаче самолёта Як-18',
    publisher: 'Госкаталог.РФ / Саратовский музей краеведения',
    url: 'https://ar.culture.ru/ru/subject/yua-gagarin-u-samoleta-pered-uchebnym-poletom',
    category: 'museum',
    covers: 'Бортовой № 1166304, передача самолёта в музей в мае 1961.',
  },
  {
    id: 11,
    title: 'Гагарин Юрий Алексеевич — Оренбургский край',
    publisher: 'Оренбургская областная универсальная научная библиотека',
    url: 'https://orenlib.ru/kray/orenkray/a-1847.html',
    category: 'archive',
    covers: 'Учёба в Чкаловском ВАУЛ 1955–1957, инструктор, выпуск, Заполярье.',
  },
  {
    id: 12,
    title: '108 минут и вся жизнь — Оренбург дал мне крылья',
    publisher: 'Оренбургская областная детская библиотека',
    url: 'https://oodb.ru/virtual/gagarin/3k.html',
    category: 'archive',
    covers: 'Оренбургский период: подробности учебной программы.',
  },

  // --- Период отбора и подготовки ---
  {
    id: 13,
    title: 'Первый отряд советских космонавтов: как выбирали лучших',
    publisher: 'РИА Новости (2010)',
    url: 'https://ria.ru/20100307/212419945.html',
    category: 'media',
    covers:
      'Требования Королёва, медкомиссия, шестёрка, утверждение 8.04.1961.',
  },
  {
    id: 14,
    title: 'Первый отряд космонавтов СССР',
    publisher: 'Википедия (русская)',
    url: 'https://ru.wikipedia.org/wiki/Первый_отряд_космонавтов_СССР',
    category: 'encyclopedia',
    covers: 'Состав отряда, замены в шестёрке, назначение командиром.',
  },
  {
    id: 15,
    title: 'Первый космический отряд состоял из 12 военных лётчиков',
    publisher: 'Парламентская газета',
    url: 'https://www.pnp.ru/social/pervyy-kosmicheskiy-otryad-sostoyal-iz-12-voennykh-lyotchikov.html',
    category: 'media',
    covers: 'Директива Вершинина 11.01.1960, начальник ЦПК Е. А. Карпов.',
  },
];

/** Удобный поиск по id — например, для рендера сноски. */
export function getSourceById(id: number): Source | undefined {
  return SOURCES.find((s) => s.id === id);
}
