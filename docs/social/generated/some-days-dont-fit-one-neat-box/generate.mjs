import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const sourceDir = join(here, 'source');
const directionsDir = join(here, 'directions');
const qaDir = join(here, 'qa');
const workDir = join(here, '.render');

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const palette = {
  cream: '#F6F3EF',
  card: '#FDFCFB',
  charcoal: '#3F3A36',
  secondary: '#5A5550',
  clay: '#B89A8B',
  rose: '#CF8F90',
};

for (const dir of [directionsDir, qaDir, workDir]) mkdirSync(dir, { recursive: true });

function run(command, args) {
  execFileSync(command, args, { stdio: 'inherit' });
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function textSvg({
  lines,
  width = WIDTH,
  height = HEIGHT,
  x,
  y,
  size,
  lineHeight,
  weight = 600,
  color = palette.charcoal,
  family = 'Avenir Next',
  anchor = 'start',
  letterSpacing = 0,
  italic = false,
}) {
  const tspans = lines.map((line, index) => (
    `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
  )).join('');
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <text x="${x}" y="${y}" text-anchor="${anchor}"
        font-family="${family}" font-size="${size}" font-weight="${weight}"
        font-style="${italic ? 'italic' : 'normal'}" letter-spacing="${letterSpacing}"
        fill="${color}">${tspans}</text>
    </svg>
  `);
}

function roundedMask(width, height, radius) {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="${width}" height="${height}" rx="${radius}" fill="#fff" />
    </svg>
  `);
}

function bottomFadeSvg(opacity = 0.96) {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${palette.cream}" stop-opacity="0" />
          <stop offset="40%" stop-color="${palette.cream}" stop-opacity="0.55" />
          <stop offset="100%" stop-color="${palette.cream}" stop-opacity="${opacity}" />
        </linearGradient>
      </defs>
      <rect y="1320" width="${WIDTH}" height="600" fill="url(#fade)" />
    </svg>
  `);
}

async function cropPhone(path, top = 220) {
  return sharp(path)
    .resize({ width: WIDTH })
    .extract({ left: 0, top, width: WIDTH, height: HEIGHT })
    .png()
    .toBuffer();
}

async function roundedPhonePanel(path, width, top = 0, radius = 58) {
  const resized = await sharp(path).resize({ width }).extract({
    left: 0,
    top,
    width,
    height: Math.round(width * (HEIGHT / WIDTH)),
  }).png().toBuffer();
  return sharp(resized)
    .composite([{ input: roundedMask(width, Math.round(width * (HEIGHT / WIDTH)), radius), blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function brandLockup() {
  const icon = await sharp(join(sourceDir, 'app-icon.png')).resize(64, 64).png().toBuffer();
  const text = textSvg({
    lines: ['WELL WITHIN'], x: 166, y: 135, size: 27, lineHeight: 30,
    weight: 650, color: palette.charcoal, letterSpacing: 3.2,
  });
  return { icon, text };
}

async function renderDirectionOne(selectedFrame) {
  const panel = await roundedPhonePanel(join(sourceDir, 'saved-chart.png'), 790, 80, 56);
  const { icon, text } = await brandLockup();
  const headline = textSvg({
    lines: ['Some days don’t fit', 'one neat box.'],
    x: 82, y: 330, size: 86, lineHeight: 104, weight: 650,
  });
  const accent = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
      <path d="M84 568 H250" stroke="${palette.clay}" stroke-width="8" stroke-linecap="round" />
    </svg>
  `);
  await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: palette.cream } })
    .composite([
      { input: icon, left: 82, top: 85 },
      { input: text, left: 0, top: 0 },
      { input: headline, left: 0, top: 0 },
      { input: accent, left: 0, top: 0 },
      { input: panel, left: 290, top: 650 },
    ])
    .jpeg({ quality: 94, chromaSubsampling: '4:4:4' })
    .toFile(join(directionsDir, 'cover-01-screen-forward.jpg'));
}

async function renderDirectionTwo(selectedFrame) {
  const phone = await cropPhone(selectedFrame, 190);
  const topWash = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
      <defs>
        <linearGradient id="wash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${palette.cream}" stop-opacity="1" />
          <stop offset="70%" stop-color="${palette.cream}" stop-opacity="0.99" />
          <stop offset="100%" stop-color="${palette.cream}" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="${WIDTH}" height="820" fill="url(#wash)" />
    </svg>
  `);
  const eyebrow = textSvg({
    lines: ['FERTILITY CHARTING, IN REAL LIFE'],
    x: 82, y: 138, size: 25, lineHeight: 30, weight: 650,
    color: palette.clay, letterSpacing: 2.6,
  });
  const headline = textSvg({
    lines: ['Some days don’t fit', 'one neat box.'],
    x: 82, y: 305, size: 90, lineHeight: 106, weight: 650,
  });
  await sharp(phone)
    .composite([
      { input: topWash, left: 0, top: 0 },
      { input: eyebrow, left: 0, top: 0 },
      { input: headline, left: 0, top: 0 },
    ])
    .jpeg({ quality: 94, chromaSubsampling: '4:4:4' })
    .toFile(join(directionsDir, 'cover-02-proof-first.jpg'));
}

async function renderDirectionThree(selectedFrame) {
  const panel = await roundedPhonePanel(selectedFrame, 920, 130, 52);
  const { icon, text } = await brandLockup();
  const eyebrow = textSvg({
    lines: ['FERTILITY CHARTING, IN REAL LIFE'],
    x: 82, y: 250, size: 24, lineHeight: 30, weight: 650,
    color: palette.clay, letterSpacing: 2.4,
  });
  const headline = textSvg({
    lines: ['Some days don’t fit', 'one neat box.'],
    x: 82, y: 408, size: 82, lineHeight: 99, weight: 650,
  });
  await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: palette.cream } })
    .composite([
      { input: icon, left: 82, top: 85 },
      { input: text, left: 0, top: 0 },
      { input: eyebrow, left: 0, top: 0 },
      { input: headline, left: 0, top: 0 },
      { input: panel, left: 80, top: 690 },
    ])
    .jpeg({ quality: 94, chromaSubsampling: '4:4:4' })
    .toFile(join(directionsDir, 'cover-03-entry-first.jpg'));
}

async function renderDirectionFour(selectedFrame) {
  const panel = await roundedPhonePanel(join(sourceDir, 'saved-chart.png'), 770, 20, 56);
  const headline = textSvg({
    lines: ['Some days', 'don’t fit', 'one neat box.'],
    x: 82, y: 300, size: 92, lineHeight: 108, weight: 650, color: palette.cream,
  });
  const support = textSvg({
    lines: ['Real observations. Kept together.'],
    x: 84, y: 685, size: 31, lineHeight: 38, weight: 500, color: '#E7E2DE',
  });
  await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: palette.charcoal } })
    .composite([
      { input: headline, left: 0, top: 0 },
      { input: support, left: 0, top: 0 },
      { input: panel, left: 380, top: 790 },
    ])
    .jpeg({ quality: 94, chromaSubsampling: '4:4:4' })
    .toFile(join(directionsDir, 'cover-04-contrast.jpg'));
}

async function renderVideoFrames(selectedFrame) {
  const resultFrame = await cropPhone(join(sourceDir, 'saved-chart.png'), 180);
  const resultText = textSvg({
    lines: ['Both stay visible', 'on your chart.'],
    x: 76, y: 1640, size: 60, lineHeight: 72, weight: 650,
  });
  await sharp(resultFrame)
    .composite([
      { input: bottomFadeSvg(0.98), left: 0, top: 0 },
      { input: resultText, left: 0, top: 0 },
    ])
    .png()
    .toFile(join(workDir, 'result-frame.png'));

  const { icon, text } = await brandLockup();
  const closeText = textSvg({
    lines: ['Record what happened.', 'See it in context.'],
    x: 82, y: 735, size: 86, lineHeight: 108, weight: 650,
  });
  const closeSupport = textSvg({
    lines: ['Observation-based fertility charting'],
    x: 84, y: 1018, size: 31, lineHeight: 38, weight: 500, color: palette.secondary,
  });
  const handle = textSvg({
    lines: ['@wellwithinapp'],
    x: 84, y: 1575, size: 29, lineHeight: 34, weight: 600, color: palette.clay,
  });
  await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: palette.cream } })
    .composite([
      { input: icon, left: 82, top: 85 },
      { input: text, left: 0, top: 0 },
      { input: closeText, left: 0, top: 0 },
      { input: closeSupport, left: 0, top: 0 },
      { input: handle, left: 0, top: 0 },
    ])
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(join(workDir, 'close.jpg'));
}

function encodeStill(input, output, duration) {
  run('ffmpeg', [
    '-y', '-loop', '1', '-i', input,
    '-t', String(duration), '-r', String(FPS),
    '-vf', `scale=${WIDTH}:${HEIGHT}:in_range=pc:out_range=tv,format=yuv420p`,
    '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17',
    '-movflags', '+faststart', output,
  ]);
}

async function renderVideo() {
  const cover = join(directionsDir, 'cover-02-proof-first.jpg');
  const source = join(sourceDir, 'simulator-recording.mov');
  const resultFrame = join(workDir, 'result-frame.png');
  const close = join(workDir, 'close.jpg');
  const coverSegment = join(workDir, '01-cover.mp4');
  const clipSegment = join(workDir, '02-entry.mp4');
  const resultSegment = join(workDir, '03-result.mp4');
  const closeSegment = join(workDir, '04-close.mp4');
  const silent = join(workDir, 'silent-master.mp4');
  const audio = join(workDir, 'original-audio.m4a');
  const final = join(here, 'reel.mp4');

  encodeStill(cover, coverSegment, 1.5);

  run('ffmpeg', [
    '-y', '-i', source,
    '-filter_complex',
    `[0:v]trim=start=3.7:end=15.1,setpts=0.28*(PTS-STARTPTS),fps=${FPS},scale=${WIDTH}:-2,crop=${WIDTH}:${HEIGHT}:0:210,format=yuv420p[out]`,
    '-map', '[out]', '-t', '3.2', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17',
    '-movflags', '+faststart', clipSegment,
  ]);

  run('ffmpeg', [
    '-y', '-loop', '1', '-i', resultFrame,
    '-t', '2.7', '-r', String(FPS),
    '-vf', `zoompan=z='min(zoom+0.00045,1.04)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=81:s=${WIDTH}x${HEIGHT}:fps=${FPS},scale=in_range=pc:out_range=tv,format=yuv420p`,
    '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17',
    '-movflags', '+faststart', resultSegment,
  ]);

  encodeStill(close, closeSegment, 1.6);

  const concatList = [coverSegment, clipSegment, resultSegment, closeSegment]
    .map((path) => `file '${path.replaceAll("'", "'\\''")}'`).join('\n');
  writeFileSync(join(workDir, 'concat.txt'), `${concatList}\n`);
  run('ffmpeg', [
    '-y', '-f', 'concat', '-safe', '0', '-i', join(workDir, 'concat.txt'),
    '-c', 'copy', silent,
  ]);

  run('ffmpeg', [
    '-y',
    '-f', 'lavfi', '-i', 'sine=frequency=220:sample_rate=48000:duration=9',
    '-f', 'lavfi', '-i', 'sine=frequency=277.18:sample_rate=48000:duration=9',
    '-f', 'lavfi', '-i', 'sine=frequency=329.63:sample_rate=48000:duration=9',
    '-f', 'lavfi', '-i', 'sine=frequency=1040:sample_rate=48000:duration=0.035',
    '-f', 'lavfi', '-i', 'sine=frequency=880:sample_rate=48000:duration=0.05',
    '-filter_complex',
    '[0:a]volume=0.050,afade=t=in:st=0:d=1.1,afade=t=out:st=7.7:d=1.3[a0];' +
    '[1:a]volume=0.035,afade=t=in:st=0:d=1.1,afade=t=out:st=7.7:d=1.3[a1];' +
    '[2:a]volume=0.025,afade=t=in:st=0:d=1.1,afade=t=out:st=7.7:d=1.3[a2];' +
    '[3:a]volume=0.200,adelay=2100|2100[a3];' +
    '[4:a]volume=0.140,adelay=3600|3600[a4];' +
    '[a0][a1][a2][a3][a4]amix=inputs=5:normalize=0,alimiter=limit=0.8[aout]',
    '-map', '[aout]', '-t', '9', '-c:a', 'aac', '-b:a', '160k', audio,
  ]);

  run('ffmpeg', [
    '-y', '-i', silent, '-i', audio,
    '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-c:a', 'copy',
    '-shortest', '-movflags', '+faststart', final,
  ]);

  await sharp(cover)
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(join(here, 'cover.jpg'));
}

function renderQa() {
  const final = join(here, 'reel.mp4');
  const checkpoints = ['0', '1.4', '1.6', '2.0', '2.2', '2.5', '3.5', '4.6', '5.8', '7.0', '8.3'];

  for (const checkpoint of checkpoints) {
    run('ffmpeg', [
      '-y', '-ss', checkpoint, '-i', final,
      '-frames:v', '1', '-update', '1', join(qaDir, `frame-${checkpoint}.jpg`),
    ]);
  }

  run('ffmpeg', [
    '-y', '-i', final,
    '-vf',
    "select='eq(n,0)+eq(n,42)+eq(n,54)+eq(n,66)+eq(n,90)+eq(n,138)+eq(n,174)+eq(n,210)+eq(n,249)'," +
      'scale=270:480,tile=3x3',
    '-frames:v', '1', '-update', '1', join(qaDir, 'contact-sheet.jpg'),
  ]);
}

async function main() {
  const selectedFrame = join(workDir, 'selected-entry.png');
  run('ffmpeg', [
    '-y', '-ss', '14.5', '-i', join(sourceDir, 'simulator-recording.mov'),
    '-frames:v', '1', selectedFrame,
  ]);

  await renderDirectionOne(selectedFrame);
  await renderDirectionTwo(selectedFrame);
  await renderDirectionThree(selectedFrame);
  await renderDirectionFour(selectedFrame);
  await renderVideoFrames(selectedFrame);
  await renderVideo();
  renderQa();
}

await main();
