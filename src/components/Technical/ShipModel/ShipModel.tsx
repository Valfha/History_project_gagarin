import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Stars } from '@react-three/drei';

/**
 * 3D-модель корабля Восток-3КА — схематичная, из примитивов R3F.
 *
 * Не претендует на инженерную точность, цель — дать пользователю
 * объёмное представление об основных модулях:
 *  - СА  — спускаемый аппарат, шар диаметром 2.3 м;
 *  - ПО  — приборный отсек, усечённый конус ~2.27 м длиной;
 *  - ТДУ С5.4 — тормозная двигательная установка (КБ Химмаш Исаева);
 *  - 4 штыревые антенны связи на ПО.
 *
 * Размеры — в условных единицах сцены, 1 unit ≈ 1 м, чтобы пропорции
 * соответствовали реальным (см. книгу Чертока «Ракеты и люди» т. 3,
 * РКК «Энергия» о конструкции корабля).
 */

// --- размеры (units = метры) ---
const SA_RADIUS = 1.15;
const PO_HEIGHT = 2.27;
const PO_TOP_RADIUS = 0.9;
const PO_BOTTOM_RADIUS = 0.55;
const ANTENNA_LENGTH = 1.6;
const ANTENNA_RADIUS = 0.04;
const TDU_HEIGHT = 0.45;
const TDU_RADIUS = 0.3;

// --- цвета (близкие к фирменным акцентам сайта) ---
const SILVER = '#c8cdd3';
const BRONZE = '#7a6a52';
const DARK = '#1a2030';

/**
 * Сборка корабля из примитивов. Y=0 — нижняя точка ТДУ.
 * Снизу вверх: сопло ТДУ → ТДУ → ПО → СА.
 */
function Vostok() {
  const tduY = TDU_HEIGHT / 2;
  const poBottomY = TDU_HEIGHT;
  const poCenterY = poBottomY + PO_HEIGHT / 2;
  const poTopY = poBottomY + PO_HEIGHT;
  const saCenterY = poTopY + SA_RADIUS;

  // Центрируем модель по Y, чтобы примерно середина смотрелась в кадр.
  const groupOffsetY = -((saCenterY + SA_RADIUS) / 2);

  return (
    <group position={[0, groupOffsetY, 0]}>
      {/* СА — спускаемый аппарат, серебристый шар */}
      <mesh position={[0, saCenterY, 0]} castShadow receiveShadow>
        <sphereGeometry args={[SA_RADIUS, 48, 48]} />
        <meshStandardMaterial color={SILVER} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* ПО — приборный отсек, усечённый конус сужающийся к ТДУ */}
      <mesh position={[0, poCenterY, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[PO_TOP_RADIUS, PO_BOTTOM_RADIUS, PO_HEIGHT, 48]}
        />
        <meshStandardMaterial color={BRONZE} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* ТДУ С5.4 — короткий цилиндр (КБ Химмаш А.М. Исаева) */}
      <mesh position={[0, tduY, 0]} castShadow>
        <cylinderGeometry
          args={[TDU_RADIUS, TDU_RADIUS * 0.85, TDU_HEIGHT, 24]}
        />
        <meshStandardMaterial color={DARK} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Сопло ТДУ — узкий конус снизу */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <coneGeometry args={[TDU_RADIUS * 0.55, 0.3, 24]} />
        <meshStandardMaterial color={DARK} metalness={0.4} roughness={0.5} />
      </mesh>

      {/* 4 штыревые антенны связи, симметрично по периметру ПО */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => {
        const r = (PO_TOP_RADIUS + PO_BOTTOM_RADIUS) / 2;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        // Антенны слегка отклонены наружу.
        const tilt = 0.25;
        return (
          <mesh
            key={i}
            position={[x, poCenterY + ANTENNA_LENGTH / 2 - 0.2, z]}
            rotation={[Math.sin(angle) * tilt, 0, -Math.cos(angle) * tilt]}
            castShadow
          >
            <cylinderGeometry
              args={[ANTENNA_RADIUS, ANTENNA_RADIUS, ANTENNA_LENGTH, 12]}
            />
            <meshStandardMaterial
              color={SILVER}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * Контейнер с Canvas для 3D-сцены. Размеры зеркалят OrbitMap (480px).
 * OrbitControls — поворот/zoom, без pan, чтобы модель не «уехала» из кадра.
 */
export default function ShipModel() {
  return (
    <div
      className="overflow-hidden rounded-lg border border-white/10 bg-space-deep"
      role="region"
      aria-label="3D-модель Восток-3КА: спускаемый аппарат, приборный отсек, ТДУ и четыре антенны связи"
      style={{ height: 480 }}
    >
      <Canvas
        camera={{ position: [4.5, 1.5, 6], fov: 42 }}
        shadows
        dpr={[1, 2]}
      >
        <color attach="background" args={['#070b18']} />

        <ambientLight intensity={0.35} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* Тёплая советская «золотая» подсветка с фронта */}
        <directionalLight
          position={[-3, 2, 4]}
          intensity={0.35}
          color="#f0c14b"
        />

        <Suspense fallback={null}>
          <Stars radius={50} depth={30} count={1500} factor={3} fade />
          <Vostok />
          <ContactShadows
            position={[0, -2.6, 0]}
            opacity={0.45}
            scale={10}
            blur={2.5}
            far={4}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableDamping
          minDistance={4}
          maxDistance={12}
          maxPolarAngle={Math.PI / 1.85}
        />
      </Canvas>
    </div>
  );
}
