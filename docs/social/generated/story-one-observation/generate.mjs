import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WIDTH = 1080;
const HEIGHT = 1920;

// SVG overlay — transparent background, text only
const overlay = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">

  <!-- Primary text: three lines, vertically centred slightly above middle -->
  <text
    x="${WIDTH / 2}" y="860"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="88"
    font-weight="400"
    fill="#3A2316"
    text-anchor="middle"
    letter-spacing="-0.5"
  >One observation</text>

  <text
    x="${WIDTH / 2}" y="970"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="88"
    font-weight="400"
    fill="#3A2316"
    text-anchor="middle"
    letter-spacing="-0.5"
  >is enough</text>

  <text
    x="${WIDTH / 2}" y="1080"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="88"
    font-weight="400"
    fill="#3A2316"
    text-anchor="middle"
    letter-spacing="-0.5"
  >to start.</text>

  <!-- Warm gold accent rule -->
  <line
    x1="${WIDTH / 2 - 90}" y1="1130"
    x2="${WIDTH / 2 + 90}" y2="1130"
    stroke="#C9A882" stroke-width="2.5" stroke-linecap="round"
  />

  <!-- Handle -->
  <text
    x="${WIDTH / 2}" y="${HEIGHT - 110}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="30"
    font-weight="400"
    fill="#9B7B5E"
    text-anchor="middle"
    letter-spacing="3.5"
  >@wellwithinapp</text>

</svg>
`;

await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: { r: 250, g: 244, b: 236, alpha: 1 },
  },
})
  .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
  .jpeg({ quality: 92 })
  .toFile(join(__dirname, 'story-1.jpg'));

console.log('Done → story-1.jpg');
