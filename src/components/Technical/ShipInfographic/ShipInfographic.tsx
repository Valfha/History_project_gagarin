import type { KeyboardEvent } from 'react';
import {
  INFOGRAPHIC_HOTSPOTS,
  SHIP_MODULES,
  type InfographicHotspot,
  type ShipModule,
} from '@/data/vostok';

/**
 * Интерактивная SVG-инфографика Восток-3КА (вид сбоку).
 *
 * - Сама схема — флэт-графика собственного авторства, никаких внешних
 *   изображений или фотографий. ViewBox 400×600 (портрет).
 * - Поверх схемы — 6 кружков-hotspot-ов, пронумерованных 1..6 в порядке
 *   `INFOGRAPHIC_HOTSPOTS`. Клик/Enter/Space по любому переключает
 *   состояние во внешнем `selectedId`.
 * - Pure presentational: все стейты приходят пропсами.
 */

// --- Геометрия SVG (в координатах ViewBox) ---
const VIEW_W = 400;
const VIEW_H = 600;

// Корпус
const SA_CX = 200;
const SA_CY = 170;
const SA_R = 88;

const PO_TOP_Y = 248;
const PO_BOT_Y = 450;
const PO_TOP_HALF = 70;
const PO_BOT_HALF = 42;

const TDU_TOP_Y = 450;
const TDU_BOT_Y = 488;
const TDU_HALF = 22;

interface ShipInfographicProps {
  selectedId: string;
  onSelect: (moduleId: string) => void;
}

export default function ShipInfographic({
  selectedId,
  onSelect,
}: ShipInfographicProps) {
  return (
    <div
      className="rounded-lg border border-white/10 bg-space-deep p-2 sm:p-4"
      role="region"
      aria-label="Интерактивная схема корабля Восток-3КА"
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="mx-auto block h-auto w-full max-w-md"
        role="img"
        aria-label="Схематичный вид Восток-3КА сбоку с пронумерованными подсистемами"
      >
        <defs>
          {/* Радиальный градиент для блика на сфере СА */}
          <radialGradient id="sa-gradient" cx="35%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#e5e9ef" />
            <stop offset="55%" stopColor="#a4abb6" />
            <stop offset="100%" stopColor="#5a6271" />
          </radialGradient>
          {/* Линейный градиент для ПО (бронзовый, сверху светлее) */}
          <linearGradient id="po-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9b8763" />
            <stop offset="100%" stopColor="#5a4d36" />
          </linearGradient>
        </defs>

        {/* Декоративные звёзды на фоне */}
        <StarField />

        {/* Антенны (за корпусом) */}
        <AntennaPair />

        {/* СА — сфера спускаемого аппарата */}
        <circle
          cx={SA_CX}
          cy={SA_CY}
          r={SA_R}
          fill="url(#sa-gradient)"
          stroke="#3a4150"
          strokeWidth="1.5"
        />

        {/* Внутри СА — пиктограммы кресла К-21 и космонавта в СК-1 */}
        <ChairAndCosmonaut />

        {/* Соединительный кольцевой шпангоут СА↔ПО */}
        <rect
          x={200 - PO_TOP_HALF}
          y={244}
          width={PO_TOP_HALF * 2}
          height={6}
          fill="#2a2f3a"
        />

        {/* ПО — приборный отсек, усечённый конус */}
        <polygon
          points={`${200 - PO_TOP_HALF},${PO_TOP_Y} ${200 + PO_TOP_HALF},${PO_TOP_Y} ${200 + PO_BOT_HALF},${PO_BOT_Y} ${200 - PO_BOT_HALF},${PO_BOT_Y}`}
          fill="url(#po-gradient)"
          stroke="#2a2418"
          strokeWidth="1.5"
        />
        {/* Декоративные шпангоуты на ПО */}
        {[300, 360, 420].map((y) => {
          const halfAt = lerp(PO_TOP_HALF, PO_BOT_HALF, (y - PO_TOP_Y) / (PO_BOT_Y - PO_TOP_Y));
          return (
            <line
              key={y}
              x1={200 - halfAt}
              y1={y}
              x2={200 + halfAt}
              y2={y}
              stroke="#3a3120"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.7"
            />
          );
        })}

        {/* ТДУ — короткий тёмный цилиндр */}
        <rect
          x={200 - TDU_HALF}
          y={TDU_TOP_Y}
          width={TDU_HALF * 2}
          height={TDU_BOT_Y - TDU_TOP_Y}
          fill="#1a2030"
          stroke="#0a0d18"
          strokeWidth="1"
        />
        {/* Сопло ТДУ — конус снизу */}
        <polygon
          points={`${200 - TDU_HALF + 4},${TDU_BOT_Y} ${200 + TDU_HALF - 4},${TDU_BOT_Y} ${200 + 8},${TDU_BOT_Y + 28} ${200 - 8},${TDU_BOT_Y + 28}`}
          fill="#0d1018"
        />

        {/* Hotspot-ы поверх схемы */}
        {INFOGRAPHIC_HOTSPOTS.map((h, idx) => (
          <Hotspot
            key={h.id}
            hotspot={h}
            number={idx + 1}
            module={SHIP_MODULES.find((m) => m.id === h.moduleId)}
            isSelected={h.moduleId === selectedId}
            onSelect={onSelect}
          />
        ))}
      </svg>

      {/* Подсказка под SVG */}
      <p className="mt-2 text-center text-xs text-ink-soft">
        Нажмите на номер, чтобы прочитать про подсистему. Навигация с
        клавиатуры — Tab/Shift+Tab + Enter.
      </p>
    </div>
  );
}

/* ----------- Внутренние компоненты схемы ----------- */

function StarField() {
  // Зерно фиксированное, чтобы при ре-рендерах звёзды не «бегали».
  const stars: ReadonlyArray<readonly [number, number, number]> = [
    [40, 60, 1.2], [330, 90, 0.8], [380, 200, 1.1], [20, 220, 0.9],
    [60, 310, 0.7], [350, 320, 1.0], [25, 420, 0.8], [375, 480, 1.2],
    [50, 540, 0.7], [340, 560, 0.9], [300, 30, 0.6], [80, 10, 0.7],
    [12, 120, 0.5], [395, 410, 0.9],
  ];
  return (
    <g aria-hidden="true">
      {stars.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#f4ead5" opacity="0.5" />
      ))}
    </g>
  );
}

function AntennaPair() {
  // Левая и правая антенны (две из четырёх — две другие скрыты за корпусом).
  return (
    <g aria-hidden="true">
      {/* Левая */}
      <line x1={140} y1={258} x2={102} y2={104} stroke="#b8bdc6" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={102} cy={104} r={3.5} fill="#f0c14b" />
      {/* Правая */}
      <line x1={260} y1={258} x2={304} y2={108} stroke="#b8bdc6" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={304} cy={108} r={3.5} fill="#f0c14b" />
    </g>
  );
}

function ChairAndCosmonaut() {
  return (
    <g aria-hidden="true">
      {/* Кресло К-21 — спинка */}
      <rect x={178} y={140} width={44} height={66} rx={3} fill="#2a2f3a" />
      {/* Подголовник */}
      <rect x={184} y={130} width={32} height={14} rx={2} fill="#2a2f3a" />
      {/* Сиденье */}
      <rect x={170} y={200} width={60} height={10} rx={2} fill="#2a2f3a" />

      {/* Космонавт в СК-1 — фигура */}
      {/* Шлем */}
      <circle cx={200} cy={158} r={14} fill="#e08438" stroke="#7a3a14" strokeWidth="1.2" />
      {/* Визор */}
      <rect x={190} y={154} width={20} height={8} rx={1} fill="#0d1426" opacity="0.85" />
      {/* Корпус скафандра */}
      <path
        d="M 184 174 Q 184 168 192 168 L 208 168 Q 216 168 216 174 L 218 200 Q 200 206 182 200 Z"
        fill="#e08438"
        stroke="#7a3a14"
        strokeWidth="1.2"
      />
      {/* Шланги жизнеобеспечения */}
      <path d="M 188 178 Q 178 184 178 192" stroke="#7a3a14" strokeWidth="1.5" fill="none" />
    </g>
  );
}

interface HotspotProps {
  hotspot: InfographicHotspot;
  number: number;
  module: ShipModule | undefined;
  isSelected: boolean;
  onSelect: (moduleId: string) => void;
}

function Hotspot({
  hotspot,
  number,
  module,
  isSelected,
  onSelect,
}: HotspotProps) {
  const cx = (hotspot.xPct / 100) * VIEW_W;
  const cy = (hotspot.yPct / 100) * VIEW_H;
  const r = isSelected ? 16 : 13;
  const fill = isSelected ? '#c8102e' : '#0d1426';
  const textColor = isSelected ? '#ffffff' : '#f0c14b';

  const handleKey = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(hotspot.moduleId);
    }
  };

  const label = module
    ? `Подсистема ${number}: ${module.name}${module.abbr ? ` (${module.abbr})` : ''}. ${module.shortDescription}`
    : `Подсистема ${number}`;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={isSelected}
      onClick={() => onSelect(hotspot.moduleId)}
      onKeyDown={handleKey}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      {/* Внешний светящийся бордюр у выбранного — для подсветки */}
      {isSelected && (
        <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#f0c14b" strokeWidth={1} opacity={0.5} />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        stroke="#f0c14b"
        strokeWidth={isSelected ? 2.5 : 2}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="13"
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        fontWeight="bold"
        fill={textColor}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {number}
      </text>
    </g>
  );
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
