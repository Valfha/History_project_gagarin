import { useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  AttributionControl,
} from 'react-leaflet';
import L from 'leaflet';
import { LAUNCH_SITE, LANDING_SITE } from '@/data/vostok';
import { FLIGHT_FACTS } from '@/data/timeline';
import { computeGroundTrack, splitAtAntimeridian } from './orbit-trajectory';

/**
 * Карта наземной трассы Восток-1.
 *
 * Тёмная плитка CARTO Dark Matter (бесплатно, без ключа). Полилиния —
 * результат `computeGroundTrack` (200 точек), разбита на сегменты по
 * 180-му меридиану. Маркеры старта и приземления — кастомные SVG-divIcon-ы
 * в фирменных цветах (красный/золотой), чтобы избежать известных проблем
 * с дефолтными иконками Leaflet при bundler-сборке.
 */

const LAUNCH_SVG = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="#c8102e" stroke="#f4ead5" stroke-width="2"/>
    <circle cx="12" cy="12" r="3" fill="#f4ead5"/>
    <line x1="12" y1="2" x2="12" y2="22" stroke="#f4ead5" stroke-width="1"/>
    <line x1="2" y1="12" x2="22" y2="12" stroke="#f4ead5" stroke-width="1"/>
  </svg>
`;

const LANDING_SVG = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polygon points="12,2 14.6,9.5 22,9.5 16,14.2 18.5,22 12,17.3 5.5,22 8,14.2 2,9.5 9.4,9.5"
             fill="#f0c14b" stroke="#0d1426" stroke-width="1"/>
  </svg>
`;

const launchIcon = L.divIcon({
  html: LAUNCH_SVG,
  className: 'orbit-marker orbit-marker--launch',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -12],
});

const landingIcon = L.divIcon({
  html: LANDING_SVG,
  className: 'orbit-marker orbit-marker--landing',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -12],
});

export default function OrbitMap() {
  // Граунд-трек считается один раз — параметры орбиты фиксированы.
  const segments = useMemo(() => {
    const track = computeGroundTrack({
      startLat: LAUNCH_SITE.lat,
      startLon: LAUNCH_SITE.lon,
      periodMin: FLIGHT_FACTS.orbitalPeriodMin,
      inclinationDeg: FLIGHT_FACTS.inclinationDeg,
      durationSec: FLIGHT_FACTS.durationSec,
      samples: 240,
    });
    return splitAtAntimeridian(track);
  }, []);

  return (
    <div
      className="overflow-hidden rounded-lg border border-white/10 bg-space-deep"
      role="region"
      aria-label="Карта наземной трассы Восток-1"
    >
      <MapContainer
        center={[30, 40]}
        zoom={2}
        minZoom={2}
        maxZoom={6}
        scrollWheelZoom={false}
        attributionControl={false}
        style={{ height: '480px', width: '100%', background: '#0d1426' }}
      >
        {/*
          Отключаем дефолтный AttributionControl (он добавляет флаг 🇺🇦 и
          подпись «Leaflet») и подключаем свой — с prefix={false}, чтобы
          в правом нижнем углу остался только корректный copyright OSM/CARTO
          (это требование лицензии CARTO Dark Matter).
        */}
        <AttributionControl position="bottomright" prefix={false} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &middot; &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
          subdomains={['a', 'b', 'c', 'd']}
        />

        {segments.map((seg, idx) => (
          <Polyline
            key={`seg-${idx}`}
            positions={seg}
            pathOptions={{
              color: '#f0c14b',
              weight: 2,
              opacity: 0.9,
              dashArray: '6 4',
            }}
          />
        ))}

        <Marker position={[LAUNCH_SITE.lat, LAUNCH_SITE.lon]} icon={launchIcon}>
          <Popup>
            <strong>{LAUNCH_SITE.name}</strong>
            <br />
            {LAUNCH_SITE.fullName}
          </Popup>
        </Marker>

        <Marker position={[LANDING_SITE.lat, LANDING_SITE.lon]} icon={landingIcon}>
          <Popup>
            <strong>{LANDING_SITE.name}</strong>
            <br />
            {LANDING_SITE.fullName}
          </Popup>
        </Marker>
      </MapContainer>

      {/* Подпись под картой */}
      <div className="border-t border-white/10 bg-space-mid/60 px-4 py-3 text-xs text-ink-soft">
        <p>
          Жёлтым пунктиром — наземная трасса Восток-1 за{' '}
          <span className="font-mono">{FLIGHT_FACTS.durationSec / 60}</span> мин полёта
          (наклонение&nbsp;<span className="font-mono">{FLIGHT_FACTS.inclinationDeg}°</span>,
          период&nbsp;<span className="font-mono">{FLIGHT_FACTS.orbitalPeriodMin}</span>&nbsp;мин).
          Расчёт — круговая орбита, без учёта J2-возмущений и эллиптичности.
        </p>
      </div>
    </div>
  );
}
