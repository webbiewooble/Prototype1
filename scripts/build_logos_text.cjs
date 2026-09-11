const fs = require('fs');

const TOMATO_RED = '#E10600';
const LEAF_GREEN = '#1E7A34';
const CHARCOAL = '#1A1A1A';
const WARM_WHITE = '#FFF9F2';

// Leaf shape
const leafPath = `M -10 10 C -13 1, -7 -12, 12 -12 C 7 -2, 13 8, -10 10 Z`;
const veinPath = `M -8.5 9 C -2 1, 3 -4, 9.5 -9.5`;

function generateLogoSVG({ textColor, taglineColor }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 145" width="450" height="145" fill="none">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&amp;display=swap');
      .wordmark {
        font-family: 'Montserrat', sans-serif;
        font-weight: 900;
        font-size: 100px;
        letter-spacing: -3px;
      }
      .tagline {
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
        font-size: 16px;
        letter-spacing: 5px;
      }
      .tm {
        font-family: 'Montserrat', sans-serif;
        font-weight: 900;
        font-size: 24px;
      }
    </style>
  </defs>

  <g id="tomato-brand-logo">
    <!-- Main Wordmark -->
    <text x="0" y="100" class="wordmark" fill="${textColor}">Tomato</text>
    <text x="408" y="50" class="tm" fill="${textColor}">TM</text>

    <!-- Leaf Accent positioned near the first 'o' -->
    <g transform="translate(108, 48)">
      <path d="${leafPath}" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" />
      <path d="${leafPath}" fill="${LEAF_GREEN}" />
      <path d="${veinPath}" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
    </g>

    <!-- Tagline: WEAR A BRIGHTER YOU -->
    <text x="215" y="132" class="tagline" text-anchor="middle" fill="${taglineColor}">WEAR A BRIGHTER YOU</text>
  </g>
</svg>`;
}

fs.writeFileSync('./public/tomato-logo.svg', generateLogoSVG({
  textColor: TOMATO_RED,
  taglineColor: CHARCOAL
}));

fs.writeFileSync('./public/tomato-logo-dark.svg', generateLogoSVG({
  textColor: TOMATO_RED,
  taglineColor: '#FFFFFF'
}));

fs.writeFileSync('./public/tomato-logo-white.svg', generateLogoSVG({
  textColor: '#FFFFFF',
  taglineColor: '#FFFFFF'
}));

console.log('Regenerated logos successfully.');
