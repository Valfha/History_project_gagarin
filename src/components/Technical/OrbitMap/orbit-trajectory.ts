/**
 * Расчёт наземной трассы (ground track) кругового орбитального движения.
 *
 * Используется в карте орбиты раздела «Восток-1» для отрисовки следа
 * корабля по поверхности Земли в течение всего полёта (108 минут ≈
 * 1.21 витка).
 *
 * Формулы (стандартные, см. Vallado, «Fundamentals of Astrodynamics
 * and Applications», §2.4 «Ground Tracks»):
 *
 *   В инерциальной системе (ECI) спутник на круговой орбите:
 *     u(t) = u₀ + 2π · t / T            // аргумент широты
 *     φ(t) = arcsin( sin(i) · sin(u) )  // геоцентрическая широта
 *     λ_eci(t) = Ω + atan2( cos(i)·sin(u), cos(u) )
 *
 *   В земной (ECEF) системе с учётом вращения Земли:
 *     λ_ecef(t) = λ_eci(t) − ω_E · t,   ω_E = 2π / 86164 s
 *
 * Упрощения для визуализации:
 *  - орбита считается строго круговой (Восток-1 был эллиптической:
 *    апогей 327 / перигей 181 км, e ≈ 0.011 — пренебрежимо для масштаба
 *    карты ~планеты);
 *  - не учитываются возмущения (J2, атмосферное торможение) — за 108 мин
 *    они смещают трассу на доли градуса;
 *  - используется ascending pass при инициализации (Восток-1 стартовал
 *    с азимутом ~73° на северо-восток).
 */

/** Параметры расчёта ground track. */
export interface GroundTrackInput {
  /** Широта старта, градусы (WGS-84). */
  startLat: number;
  /** Долгота старта, градусы (WGS-84). */
  startLon: number;
  /** Период орбиты, мин. */
  periodMin: number;
  /** Наклонение орбиты, градусы. */
  inclinationDeg: number;
  /** Длительность полёта, сек. */
  durationSec: number;
  /**
   * Количество точек выборки (включая начальную и конечную).
   * 200 даёт плавную кривую без визуальных «полок» на масштабе планеты.
   */
  samples?: number;
}

/** Угловая скорость вращения Земли (звёздные сутки 86164 с). */
const OMEGA_E = (2 * Math.PI) / 86164;

const DEG = 180 / Math.PI;
const RAD = Math.PI / 180;

/**
 * Возвращает наземную трассу в виде массива [широта, долгота] в градусах.
 * Долгота нормализована в [-180, 180); разрывы при пересечении 180-го
 * меридиана выявляются на этапе отрисовки (см. `splitAtAntimeridian`).
 */
export function computeGroundTrack(input: GroundTrackInput): Array<[number, number]> {
  const {
    startLat,
    startLon,
    periodMin,
    inclinationDeg,
    durationSec,
    samples = 200,
  } = input;

  const i = inclinationDeg * RAD;
  const T = periodMin * 60; // период в секундах
  const phi0 = startLat * RAD;

  // u₀: аргумент широты в момент старта (ascending pass).
  // sin(u₀) = sin(φ₀) / sin(i). cos(u₀) > 0, поэтому asin даёт правильный знак.
  const sinU0Raw = Math.sin(phi0) / Math.sin(i);
  const sinU0 = Math.max(-1, Math.min(1, sinU0Raw));
  const u0 = Math.asin(sinU0);

  // λ_orbit(t=0) — долгота относительно восходящего узла Ω.
  const lambdaOrbit0 = Math.atan2(Math.cos(i) * Math.sin(u0), Math.cos(u0));

  // Ω выбираем так, чтобы λ_ecef(0) == startLon (и совмещаем ECI≡ECEF в t=0).
  const omegaNode = startLon * RAD - lambdaOrbit0;

  const points: Array<[number, number]> = [];
  for (let s = 0; s <= samples; s++) {
    const t = (s / samples) * durationSec;
    const u = u0 + (2 * Math.PI * t) / T;

    // Geocentric latitude
    const phi = Math.asin(Math.sin(i) * Math.sin(u));

    // ECI longitude (relative to ascending node) + Ω, minus Earth rotation
    const lambdaOrbit = Math.atan2(Math.cos(i) * Math.sin(u), Math.cos(u));
    let lon = omegaNode + lambdaOrbit - OMEGA_E * t;

    // Нормализуем в [-π, π).
    lon = ((((lon + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;

    points.push([phi * DEG, lon * DEG]);
  }

  return points;
}

/**
 * Делит трассу на сегменты при пересечении 180-го меридиана,
 * чтобы Leaflet не рисовал длинную горизонтальную линию через всю карту.
 *
 * Эвристика: если |Δlon| между соседними точками > 180°, считаем, что
 * произошёл wrap, и начинаем новый сегмент.
 */
export function splitAtAntimeridian(
  track: ReadonlyArray<[number, number]>,
): Array<Array<[number, number]>> {
  const segments: Array<Array<[number, number]>> = [];
  let current: Array<[number, number]> = [];

  for (let idx = 0; idx < track.length; idx++) {
    const point = track[idx];
    if (idx === 0) {
      current.push(point);
      continue;
    }
    const prevLon = track[idx - 1][1];
    const lon = point[1];
    if (Math.abs(lon - prevLon) > 180) {
      // Antimeridian crossing — закрываем текущий сегмент и начинаем новый.
      if (current.length > 0) segments.push(current);
      current = [point];
    } else {
      current.push(point);
    }
  }
  if (current.length > 0) segments.push(current);
  return segments;
}
