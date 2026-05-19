/**
 * Скрипт скачивания изображений с Wikimedia Commons.
 *
 * Использует endpoint `Special:FilePath/<имя файла>` — он стабильно редиректит
 * на актуальный URL `upload.wikimedia.org`, поэтому нам не нужно знать хеш-путь
 * файла заранее. Для приличного качества при небольшом весе запрашиваем
 * thumbnail width=1600.
 *
 * Запуск:
 *   node scripts/download-images.mjs
 *
 * Скрипт идемпотентный: если файл уже есть и непустой — пропускает.
 */

import { mkdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const TARGET_DIR = join(PROJECT_ROOT, 'public', 'images', 'biography');

/** @type {Array<{ slot: string; filename: string; commonsName: string; }>} */
const FILES = [
  // --- Round 1 (уже скачано, скрипт пропустит) ---
  {
    slot: 'gzhatsk-house',
    filename: 'gzhatsk-house.jpg',
    commonsName: 'Gagarin town - Gagarin Memorial Museum 03.jpg',
  },
  {
    slot: 'yak-18',
    filename: 'yak-18.jpg',
    commonsName:
      'Yakovlev Yak-18 Yakovlev Yak-18 Yakovlev Museum Moscow Sep93 1 (16963304418).jpg',
  },
  {
    slot: 'cosmonaut-team',
    filename: 'cosmonaut-team.jpg',
    commonsName:
      'RIAN archive 628703 Soviet cosmonauts, Heroes of the Soviet Union Pavel Popovich, Yuri Gagarin, and Valentina Tereshkova.jpg',
  },
  // --- Round 2 (новые) ---
  {
    slot: 'gagarin-cadet',
    filename: 'gagarin-cadet.jpg',
    commonsName: 'Yuri Gagarin with awards.jpg',
  },
  {
    slot: 'mig-15',
    filename: 'mig-15.jpg',
    commonsName: 'Soviet MiG-15s taking off 1950s.jpg',
  },
  {
    slot: 'sochi-six',
    filename: 'sochi-six.jpg',
    commonsName: 'First group of cosmonauts 01.jpg',
  },
  {
    slot: 'centrifuge',
    filename: 'centrifuge.jpg',
    commonsName: 'Gagarin Cosmonauts Training Center (14133798790).jpg',
  },
  {
    slot: 'family-young-yuri',
    filename: 'family-young-yuri.jpg',
    commonsName: 'Matveev 2.jpg',
  },
  {
    slot: 'childhood-klushino',
    filename: 'childhood-klushino.jpg',
    commonsName: 'Yuri Gagarin parents Home.jpg',
  },
];

const WIDTH = 1600;

async function exists(path) {
  try {
    const s = await stat(path);
    return s.isFile() && s.size > 1024;
  } catch {
    return false;
  }
}

async function downloadOne({ slot, filename, commonsName }) {
  const out = join(TARGET_DIR, filename);
  if (await exists(out)) {
    console.log(`  ✓ ${filename} (already exists, skipping)`);
    return { slot, filename, status: 'skipped' };
  }

  // Special:FilePath принимает «человеческое» имя файла и сам редиректит.
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    commonsName,
  )}?width=${WIDTH}`;

  console.log(`  ↓ ${filename} ...`);

  const res = await fetch(url, {
    headers: {
      // Wikimedia требует User-Agent с контактной информацией для bots.
      'User-Agent':
        'history-project-gagarin/0.1 (educational; https://github.com/Valfha/History_project_gagarin)',
      Accept: 'image/jpeg,image/png,image/*,*/*;q=0.8',
    },
    redirect: 'follow',
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${commonsName}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(out, buf);
  const kb = (buf.length / 1024).toFixed(1);
  console.log(`  ✓ ${filename} (${kb} KB)`);
  return { slot, filename, status: 'downloaded', size: buf.length };
}

async function main() {
  console.log(`Downloading ${FILES.length} files to ${TARGET_DIR}`);
  await mkdir(TARGET_DIR, { recursive: true });

  const results = [];
  for (const f of FILES) {
    try {
      results.push(await downloadOne(f));
    } catch (err) {
      console.error(`  ✗ ${f.filename}: ${err.message}`);
      results.push({ slot: f.slot, filename: f.filename, status: 'failed' });
    }
  }

  console.log('\nSummary:');
  for (const r of results) {
    console.log(`  ${r.status.padEnd(10)} ${r.filename}`);
  }

  const failed = results.filter((r) => r.status === 'failed').length;
  process.exit(failed > 0 ? 1 : 0);
}

main();
