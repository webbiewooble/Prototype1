const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

// Load Montserrat 900
const fontBuf = fs.readFileSync('./montserrat-900.ttf');
const font = opentype.parse(fontBuf.buffer.slice(fontBuf.byteOffset, fontBuf.byteOffset + fontBuf.byteLength));

// Brand Colors
const TOMATO_RED = '#E10600';
const LEAF_GREEN = '#1E7A34';
const CHARCOAL = '#1A1A1A';
const WARM_WHITE = '#FFF9F2';

// 1. Generate Wordmark paths
// Text: "Tomato"
const fontSize = 100;
const glyphs = font.stringToGlyphs('Tomato');

let currentX = 0;
const pathsData = [];
let firstOBounds = null;
let lastGlyphMaxX = 0;

glyphs.forEach((g, i) => {
  const p = g.getPath(currentX, 100, fontSize);
  const bb = p.getBoundingBox();
  
  if (i === 1) { // first 'o'
    firstOBounds = {
      x1: bb.x1,
      y1: bb.y1,
      x2: bb.x2,
      y2: bb.y2,
      cx: (bb.x1 + bb.x2) / 2,
      cy: (bb.y1 + bb.y2) / 2,
      width: bb.x2 - bb.x1,
      height: bb.y2 - bb.y1
    };
  }
  
  pathsData.push({
    index: i,
    char: g.name,
    d: p.toPathData()
  });
  
  lastGlyphMaxX = bb.x2;
  currentX += g.advanceWidth * (fontSize / font.unitsPerEm);
});

// TM path
const tmPath = font.getPath('TM', lastGlyphMaxX + 5, 48, 22).toPathData();

// Tagline path: "WEAR A BRIGHTER YOU"
// Tracked text across the width of "Tomato"
const taglineText = 'WEAR A BRIGHTER YOU';
const taglineFontSize = 15;
// We can distribute letters or use SVG <text> with letter-spacing for crisp rendering

console.log('firstOBounds:', firstOBounds);

// Leaf coordinates based on center of first 'o'
const { cx, cy } = firstOBounds;

// Create leaf path with smooth bezier curves matching reference image
// The leaf points up-right at ~35-40 degrees with rounded base and pointed tip.
// Base at (cx - 10.5, cy + 9.5), Tip at (cx + 11.5, cy - 10.5)
const leafBaseX = cx - 11;
const leafBaseY = cy + 10;
const leafTipX = cx + 12;
const leafTipY = cy - 11.5;

// Leaf outline: smooth closed curve
const leafPath = `
  M ${leafBaseX} ${leafBaseY}
  C ${cx - 14} ${cy + 1}, ${cx - 8} ${cy - 12}, ${leafTipX} ${leafTipY}
  C ${cx + 7} ${cy - 2}, ${cx + 13} ${cy + 8}, ${leafBaseX} ${leafBaseY}
  Z
`.trim().replace(/\s+/g, ' ');

// White vein running through center of leaf
const veinPath = `
  M ${leafBaseX + 1.5} ${leafBaseY - 1}
  C ${cx - 2} ${cy + 1}, ${cx + 3} ${cy - 4}, ${leafTipX - 2.5} ${leafTipY + 2.5}
`.trim().replace(/\s+/g, ' ');

// Function to generate the full SVG
function generateLogoSVG({ textColor, taglineColor, isDarkBg = false }) {
  const wordmarkPaths = pathsData.map(p => `<path d="${p.d}" fill="${textColor}" />`).join('\n      ');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 145" width="450" height="145" fill="none">
  <defs>
    <filter id="subtle-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.15" />
    </filter>
  </defs>
  <g id="tomato-brand-logo">
    <!-- Main Wordmark -->
    <g id="wordmark">
      ${wordmarkPaths}
      <!-- Trademark Symbol -->
      <path d="${tmPath}" fill="${textColor}" />
    </g>

    <!-- Leaf in first 'o' -->
    <g id="leaf-accent">
      <!-- White border around leaf for contrast against red/dark counter -->
      <path d="${leafPath}" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linejoin="round" />
      <!-- Green Leaf Body -->
      <path d="${leafPath}" fill="${LEAF_GREEN}" />
      <!-- Central Leaf Vein -->
      <path d="${veinPath}" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" />
    </g>

    <!-- Tagline: WEAR A BRIGHTER YOU -->
    <text x="210" y="132" 
          text-anchor="middle" 
          font-family="'Montserrat', 'Inter', -apple-system, sans-serif" 
          font-weight="700" 
          font-size="16" 
          letter-spacing="0.34em" 
          fill="${taglineColor}">WEAR A BRIGHTER YOU</text>
  </g>
</svg>`;
}

// Standalone Tomato Icon (as shown in "ICON ONLY")
function generateIconSVG() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" fill="none">
  <!-- Tomato Fruit Body -->
  <circle cx="50" cy="56" r="34" fill="${TOMATO_RED}" />
  
  <!-- Subtle Highlight on upper-right/crescent -->
  <path d="M 68 40 C 76 47 78 60 72 70" 
        stroke="#FFFFFF" 
        stroke-width="3" 
        stroke-linecap="round" 
        opacity="0.75" 
        fill="none" />

  <!-- Calyx & Leaves (5 leaves spreading out from stem) -->
  <g id="calyx" fill="${LEAF_GREEN}">
    <!-- Center calyx star -->
    <!-- Leaf 1 (Left) -->
    <path d="M 50 25 C 44 26 36 29 30 33 C 37 36 43 33 48 30 Z" />
    <!-- Leaf 2 (Down-Left) -->
    <path d="M 48 29 C 43 34 38 41 38 48 C 44 44 47 38 49 32 Z" />
    <!-- Leaf 3 (Down-Right) -->
    <path d="M 52 29 C 57 34 62 41 62 48 C 56 44 53 38 51 32 Z" />
    <!-- Leaf 4 (Right) -->
    <path d="M 50 25 C 56 26 64 29 70 33 C 63 36 57 33 52 30 Z" />
    <!-- Leaf 5 (Back-Center) -->
    <path d="M 48 27 C 49 22 50 18 50 16 C 51 18 52 22 53 27 Z" />
    
    <!-- Curved Stem -->
    <path d="M 49 25 C 49 19 46 14 41 12 C 43 11 48 12 51 16 C 52 19 51 23 50 25 Z" />
  </g>
</svg>`;
}

// Write files to public/
fs.mkdirSync('./public', { recursive: true });

// 1. Light theme logo: Red wordmark, Charcoal tagline
fs.writeFileSync('./public/tomato-logo.svg', generateLogoSVG({
  textColor: TOMATO_RED,
  taglineColor: CHARCOAL,
  isDarkBg: false
}));

// 2. Dark theme logo (for black / dark headers & footer): Red wordmark, White tagline
fs.writeFileSync('./public/tomato-logo-dark.svg', generateLogoSVG({
  textColor: TOMATO_RED,
  taglineColor: '#FFFFFF',
  isDarkBg: true
}));

// 3. Monochrome / White logo (for header overlay on deep dark): White wordmark, White tagline
fs.writeFileSync('./public/tomato-logo-white.svg', generateLogoSVG({
  textColor: '#FFFFFF',
  taglineColor: '#FFFFFF',
  isDarkBg: true
}));

// 4. Standalone Icon
fs.writeFileSync('./public/tomato-icon.svg', generateIconSVG());

console.log('Successfully generated Tomato logo SVGs in ./public/');
