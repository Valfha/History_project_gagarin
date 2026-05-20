/**
 * Скрипт скачивания аудиофайлов для раздела «Полёт».
 *
 * Поддерживает два источника:
 *   - 'wikimedia': берёт файл через `Special:FilePath/<commonsName>`.
 *   - 'voicebot' : прямая ссылка на voicebot.su (data-audio_url из HTML).
 *     Лицензия страницы — educational use only; исходные записи 1961 г.
 *     РГАНТД — Public Domain в РФ.
 *
 * Запускать:  node scripts/download-audio.mjs
 * Идемпотентный: пропускает уже скачанные файлы.
 */

import { mkdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const TARGET_DIR = join(PROJECT_ROOT, 'public', 'audio');

/**
 * @typedef {Object} WikimediaFile
 * @property {'wikimedia'} source
 * @property {string} slot
 * @property {string} filename
 * @property {string} commonsName
 * @property {string} license
 *
 * @typedef {Object} VoicebotFile
 * @property {'voicebot'} source
 * @property {string} slot
 * @property {string} filename
 * @property {string} url          Прямой URL к mp3 на voicebot.su.
 * @property {string} pageUrl      URL страницы клипа (для атрибуции).
 * @property {string} license
 *
 * @typedef {WikimediaFile | VoicebotFile} AudioFile
 */

/** @type {Array<AudioFile>} */
const FILES = [
  // --- Wikimedia Commons (PD) ---
  {
    source: 'wikimedia',
    slot: 'poyekhali',
    filename: 'poyekhali.ogg',
    commonsName: 'Gagarin-Poyekhali.ogg',
    license: 'Public Domain',
  },

  // --- voicebot.su (educational use, источник РГАНТД 1961, PD в РФ) ---
  {
    source: 'voicebot',
    slot: 'korolev-gagarin-launch',
    filename: 'korolev_gagarin_launch.mp3',
    url: 'https://voicebot.su/uploads/sounds/61/60505/60505.mp3',
    pageUrl:
      'https://voicebot.su/en/sound/sound-clip-of-the-dialogue-between-korolev-and-gagarin-during-the-rocket-launch/',
    license: 'PD (РГАНТД, 1961) via voicebot.su [educational]',
  },
  {
    source: 'voicebot',
    slot: 'gagarin-what-he-sees',
    filename: 'gagarin_what_he_sees.mp3',
    url: 'https://voicebot.su/uploads/sounds/61/60500/60500.mp3',
    pageUrl:
      'https://voicebot.su/en/sound/sound-of-gagarin-talking-about-what-he-sees-during-his-flight-into-space/',
    license: 'PD (РГАНТД, 1961) via voicebot.su [educational]',
  },
  {
    source: 'voicebot',
    slot: 'gagarin-feels-great',
    filename: 'gagarin_feels_great.mp3',
    url: 'https://voicebot.su/uploads/sounds/61/60504/60504.mp3',
    pageUrl:
      'https://voicebot.su/en/sound/sound-clip-of-yuri-gagarin-saying-he-feels-great/',
    license: 'PD (РГАНТД, 1961) via voicebot.su [educational]',
  },
  {
    source: 'voicebot',
    slot: 'gagarin-intermediate-comm',
    filename: 'gagarin_intermediate_comm.mp3',
    url: 'https://voicebot.su/uploads/sounds/61/60495/60495.mp3',
    pageUrl:
      'https://voicebot.su/en/sound/sound-of-yuri-gagarins-intermediate-communication-during-space-flight/',
    license: 'PD (РГАНТД, 1961) via voicebot.su [educational]',
  },
  {
    source: 'voicebot',
    slot: 'levitan-tass',
    filename: 'levitan_tass.mp3',
    url: 'https://voicebot.su/uploads/sounds/61/60498/60498.mp3',
    pageUrl:
      'https://voicebot.su/en/sound/radio-broadcast-announcing-that-yuri-gagarin-has-flown-into-space-levitans-voice/',
    license: 'PD (Гостелерадиофонд, 1961) via voicebot.su [educational]',
  },
];

async function exists(path) {
  try {
    const s = await stat(path);
    return s.isFile() && s.size > 1024;
  } catch {
    return false;
  }
}

/**
 * Проверяет «магию» аудиофайла:
 *  - ogg: 'OggS' (4F 67 67 53)
 *  - mp3: 'ID3' (49 44 33) или начало MPEG frame (FF Ex/Fx)
 * Возвращает строку с диагностикой или null если всё ок.
 */
function checkMagic(filename, buf) {
  if (buf.length < 4) return 'file too small (<4 bytes)';
  const b0 = buf[0];
  const b1 = buf[1];
  const b2 = buf[2];
  const b3 = buf[3];
  if (filename.endsWith('.ogg')) {
    if (b0 === 0x4f && b1 === 0x67 && b2 === 0x67 && b3 === 0x53) return null;
    return `expected 'OggS', got ${[b0, b1, b2, b3].map((b) => b.toString(16).padStart(2, '0')).join(' ')}`;
  }
  if (filename.endsWith('.mp3')) {
    // ID3v2 tag
    if (b0 === 0x49 && b1 === 0x44 && b2 === 0x33) return null;
    // MPEG audio frame sync (11 bits set)
    if (b0 === 0xff && (b1 & 0xe0) === 0xe0) return null;
    return `expected ID3 or 0xFFEx, got ${[b0, b1, b2, b3].map((b) => b.toString(16).padStart(2, '0')).join(' ')}`;
  }
  return null;
}

async function downloadOne(file) {
  const out = join(TARGET_DIR, file.filename);
  if (await exists(out)) {
    console.log(`  ✓ ${file.filename} (already exists, skipping)`);
    return { slot: file.slot, filename: file.filename, status: 'skipped' };
  }

  let url;
  let headers;

  if (file.source === 'wikimedia') {
    url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
      file.commonsName,
    )}`;
    headers = {
      'User-Agent':
        'history-project-gagarin/0.1 (educational; https://github.com/Valfha/History_project_gagarin)',
      Accept: 'audio/ogg,audio/*,*/*;q=0.8',
    };
  } else {
    url = file.url;
    headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'audio/mpeg,audio/*,*/*;q=0.8',
      Referer: file.pageUrl,
    };
  }

  console.log(`  ↓ ${file.filename}  [${file.license}] ...`);

  const res = await fetch(url, { headers, redirect: 'follow' });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${file.filename}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1024) {
    throw new Error(`response too small (${buf.length} bytes) for ${file.filename}`);
  }

  const magicErr = checkMagic(file.filename, buf);
  if (magicErr) {
    throw new Error(`magic check failed for ${file.filename}: ${magicErr}`);
  }

  await writeFile(out, buf);
  const kb = (buf.length / 1024).toFixed(1);
  console.log(`  ✓ ${file.filename} (${kb} KB)`);
  return { slot: file.slot, filename: file.filename, status: 'downloaded', size: buf.length };
}

async function main() {
  console.log(`Downloading ${FILES.length} audio file(s) to ${TARGET_DIR}`);
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
    const size = r.size ? ` (${(r.size / 1024).toFixed(1)} KB)` : '';
    console.log(`  ${r.status.padEnd(10)} ${r.filename}${size}`);
  }

  const failed = results.filter((r) => r.status === 'failed').length;
  process.exit(failed > 0 ? 1 : 0);
}

main();
