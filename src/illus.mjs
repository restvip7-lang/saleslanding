// Линейные средиземноморские иллюстрации (inline SVG). Цвета берутся из CSS-переменных, поэтому темы меняются стилями.
const A = 'aria-hidden="true" focusable="false"';

export const cypress = (x = 0, y = 0, s = 1) =>
  `<g class="il-cy" transform="translate(${x} ${y}) scale(${s})"><path d="M0 -70C-14 -40 -16 -12 -12 0H12C16 -12 14 -40 0 -70Z"/><path d="M0 -50V0" class="ln"/></g>`;

export const olive = (x = 0, y = 0, rot = 0, s = 1) =>
  `<g class="il-ol" transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path class="ln" d="M0 0C30 -10 70 -14 110 -4"/>${[0, 1, 2, 3, 4, 5]
    .map((i) => `<ellipse cx="${14 + i * 17}" cy="${-9 - (i % 2) * 2}" rx="11" ry="4" transform="rotate(${-28 + i * 3} ${14 + i * 17} -9)"/><ellipse cx="${20 + i * 17}" cy="${6 + (i % 2)}" rx="11" ry="4" transform="rotate(${26 - i * 3} ${20 + i * 17} 6)"/>`)
    .join('')}</g>`;

const villa = (x = 0, y = 0, s = 1) =>
  `<g class="il-vl" transform="translate(${x} ${y}) scale(${s})"><path class="fill" d="M0 80V30h60V0h60v80z"/><path class="roof" d="M-4 30h68v-6H-4zM56 0h68v-6H56z"/><path class="win" d="M14 70V48a9 9 0 0118 0v22zM74 70V28a10 10 0 0120 0v42z"/><path class="ln" d="M40 56h14M40 62h14"/></g>`;

export const ILL = {
  house: `<svg viewBox="0 0 320 220" class="il il-house" ${A}>
    <path class="sea" d="M0 150H320V220H0z"/>
    ${cypress(250, 160, 1.5)}
    <g class="il-vl"><path class="fill" d="M40 170V92h92V60h92v110z"/><path class="roof" d="M34 92h104V84H34zM126 60h104v-8H126z"/>
    <path class="win" d="M62 170V120a14 14 0 0128 0v50zM160 170V96a15 15 0 0130 0v74z"/><path class="ln" d="M100 126h20M100 134h20M100 142h20"/></g>
    <g class="il-cal" transform="translate(90 110) rotate(-4)"><rect class="card" x="0" y="0" width="140" height="92" rx="8"/><path class="ln" d="M0 22h140M28 0v-10M56 0v-10M84 0v-10M112 0v-10"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<path class="ln" d="M${14 + i * 21} 22V92"/>`).join('')}${[0, 1, 2].map((i) => `<path class="ln" d="M0 ${40 + i * 18}H140"/>`).join('')}
      <circle class="acc" cx="100" cy="66" r="13"/><path class="chk" d="M93 66l5 5 9-10"/></g>
    ${olive(10, 190, -20, 1)}
  </svg>`,
  doc: `<svg viewBox="0 0 220 150" class="il il-doc" ${A}>
    <circle class="sun" cx="86" cy="76" r="54"/>
    <rect class="card" x="40" y="12" width="104" height="122" rx="6" transform="rotate(-4 92 73)"/>
    <g class="ln" transform="rotate(-4 92 73)"><path d="M56 36h60M56 48h72M56 60h72M56 72h60M56 84h40"/><path class="sig" d="M58 112q8-14 14 0t12 -4 12 4"/></g>
    <path class="shield" d="M150 52l34 12v30c0 20-14 34-34 42-20-8-34-22-34-42V64z" transform="translate(6 0)"/>
    <path class="chk acc-s" d="M140 96l10 10 20-24"/>
    ${olive(176, 126, -70, .8)}
  </svg>`,
  key: `<svg viewBox="0 0 220 150" class="il il-key" ${A}>
    <circle class="sun" cx="76" cy="58" r="22"/>
    <g class="il-vl" transform="translate(100 36)"><path class="fill" d="M0 100V42h54V14h46v86z"/><path class="roof" d="M-4 42h62v-6H-4zM52 14h54v-6H52z"/><path class="win" d="M12 100V68a10 10 0 0120 0v32zM66 100V50a9 9 0 0118 0v50z"/></g>
    ${cypress(194, 136, 1.1)}
    <g class="il-k" transform="rotate(-38 70 76)"><circle class="keyb" cx="52" cy="48" r="22"/><circle class="hole" cx="52" cy="48" r="8"/><path class="keyb-l" d="M52 70v66M52 100h14M52 118h14"/></g>
    ${olive(104, 140, -10, .7)}
  </svg>`,
  chat: `<svg viewBox="0 0 180 120" class="il il-chat" ${A}>
    <path class="card" d="M26 14h126a8 8 0 018 8v58a8 8 0 01-8 8H70L44 108V88H26a8 8 0 01-8-8V22a8 8 0 018-8z"/>
    <path class="ln" d="M40 38h86M40 52h98M40 66h56"/><circle class="dot" cx="158" cy="16" r="8"/>
    ${olive(0, 112, -40, .8)}
  </svg>`,
  show: `<svg viewBox="0 0 200 130" class="il il-show" ${A}>
    <circle class="sun" cx="150" cy="40" r="28"/>
    ${cypress(66, 86, .9)}
    <g class="il-vl" transform="translate(76 30)"><path class="fill" d="M0 62V26h42V4h46v58z"/><path class="roof" d="M-3 26h48v-5H-3zM40 4h52v-5H40z"/><path class="win" d="M10 62V42a7 7 0 0114 0v20zM56 62V22a8 8 0 0116 0v40z"/></g>
    <rect class="card" x="82" y="68" width="100" height="56" rx="5"/><path class="play" d="M122 82l22 14-22 14z"/>
    ${olive(14, 120, -30, .8)}
  </svg>`,
  check: `<svg viewBox="0 0 190 130" class="il il-check" ${A}>
    <rect class="card" x="40" y="12" width="100" height="116" rx="5" transform="rotate(-6 90 70)"/>
    <rect class="card" x="58" y="6" width="100" height="116" rx="5"/>
    <path class="ln" d="M74 30h56M74 42h66M74 54h66M74 66h40"/>
    <circle class="lens" cx="132" cy="84" r="24"/><path class="lens-h" d="M150 102l22 22"/>
    ${olive(0, 116, -30, .8)}
  </svg>`,
  keysm: `<svg viewBox="0 0 200 130" class="il il-keysm" ${A}>
    <circle class="sun" cx="140" cy="44" r="30"/>
    <g class="il-vl" transform="translate(132 54)"><path class="fill" d="M0 60V26h36V8h34v52z"/><path class="roof" d="M-3 26h42v-5H-3zM33 8h40V3H33z"/></g>
    <path class="hills" d="M0 100q40-14 80-4t120-6V130H0z"/>
    <g transform="rotate(-36 66 66)"><circle class="keyb" cx="46" cy="44" r="20"/><circle class="hole" cx="46" cy="44" r="7"/><path class="keyb-l" d="M46 64v56M46 92h12M46 108h12"/></g>
    ${cypress(184, 118, .9)}
  </svg>`,
  scene: `<svg viewBox="0 0 520 140" class="il il-scene" preserveAspectRatio="xMaxYMid slice" ${A}>
    <path class="mtn" d="M0 96l60-26 40 14 60-30 60 30 70-14 60 20 80-10 90 16V140H0z"/>
    <path class="sea" d="M0 104H520V140H0z"/>
    ${cypress(432, 112, 1.2)}${cypress(458, 118, .9)}
    <g class="il-vl" transform="translate(470 38)"><path class="fill" d="M0 80V34h40V12h40v68z"/><path class="roof" d="M-3 34h46v-5H-3zM37 12h46v-5H37z"/><path class="win" d="M8 80V56a8 8 0 0116 0v24zM52 80V32a9 9 0 0118 0v48z"/></g>
    ${olive(380, 128, -14, .9)}
  </svg>`,
  hero: `<svg viewBox="0 0 340 180" class="il il-hero" ${A}>
    <circle class="sun" cx="120" cy="54" r="46"/>
    <path class="mtn" d="M0 70l50-14 40-16 60 20 40-8 52 14 98-10V110H0z"/>
    <path class="sea" d="M0 70H340V110H0z" opacity=".5"/>
    ${cypress(210, 120, 1.1)}${cypress(232, 124, .8)}${cypress(48, 126, 1)}
    <g class="il-vl" transform="translate(236 26)"><path class="fill" d="M0 120V70h46V44h52v76z"/><path class="roof" d="M-3 70h52v-5H-3zM44 44h58v-5H44z"/><path class="win" d="M10 120V90a8 8 0 0116 0v30zM58 120V58a9 9 0 0118 0v62z"/></g>
    <g class="il-vl" transform="translate(112 62)"><path class="fill" d="M0 100V60h40V40h44v60z"/><path class="roof" d="M-3 60h46v-5H-3zM36 40h52v-5H36z"/><path class="win" d="M8 100V78a8 8 0 0116 0v22zM50 100V54a8 8 0 0116 0v46z"/></g>
    <path class="stair" d="M0 164h340v16H0z"/>
    ${olive(8, 170, -30, 1)}
  </svg>`,
  sprig: `<svg viewBox="0 0 220 110" class="il il-sprig" ${A}>${olive(6, 70, -18, 1.8)}</svg>`,
};

export const IG = {
  expand: `<svg viewBox="0 0 64 64" class="ig-i" ${A}><rect x="6" y="6" width="52" height="52" rx="3" class="ln2"/><path class="ln2" d="M18 46L46 18M30 18h16v16M34 46H18V30"/></svg>`,
  bed: `<svg viewBox="0 0 80 64" class="ig-i acc" ${A}><path class="ln2" d="M6 14v36M6 36h56v14M6 50h56M14 36V26a6 6 0 016-6h12a6 6 0 016 6v10M44 36V30a4 4 0 014-4h10a4 4 0 014 4v6"/><path class="ln2" d="M72 14v30M68 44h8M70 14h4"/></svg>`,
  sofa: `<svg viewBox="0 0 140 64" class="ig-sofa" ${A}><path d="M20 24V16a8 8 0 018-8h84a8 8 0 018 8v8M8 44V30a8 8 0 0116 0v6h92v-6a8 8 0 0116 0v14a6 6 0 01-6 6H14a6 6 0 01-6-6zM22 56v6M118 56v6" fill="none"/></svg>`,
  toilet: `<svg viewBox="0 0 56 64" class="ig-i2" ${A}><path class="ln2" d="M10 8h6a6 6 0 016 6v10M10 8v8M26 28h24c0 12-6 18-14 20v8h-8v-8c-6-2-8-6-10-12zM18 60h22"/><path class="ln2" d="M6 18v.5M10 22v.5M14 18v.5M6 26v.5M14 26v.5"/></svg>`,
  sea: `<svg viewBox="0 0 64 48" class="ig-v sea" ${A}><path d="M4 10q7-8 14 0t14 0 14 0 14 0M4 24q7-8 14 0t14 0 14 0 14 0M4 38q7-8 14 0t14 0 14 0 14 0" fill="none"/></svg>`,
  mount: `<svg viewBox="0 0 72 48" class="ig-v mt" ${A}><path d="M4 44L26 8l14 22 8-10 20 24zM26 8l8 14-6 4-6-6" fill="none"/></svg>`,
  city: `<svg viewBox="0 0 64 64" class="ig-v ct" ${A}><path d="M6 58V30h18V58M24 58V6h22v52M46 58V24h14v34M2 58h60M30 14h4M38 14h4M30 24h4M38 24h4M30 34h4M38 34h4M30 44h4M38 44h4M12 38h4M12 46h4M50 32h4M50 40h4" fill="none"/></svg>`,
  building: `<svg viewBox="0 0 280 110" class="ig-bd" ${A}><g class="bd"><rect x="70" y="30" width="62" height="70"/><rect x="132" y="14" width="46" height="86"/><rect x="178" y="40" width="40" height="60"/>
    ${[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => `<rect class="w" x="${78 + c * 18}" y="${38 + r * 16}" width="9" height="10"/>`).join('')).join('')}
    ${[0, 1, 2, 3, 4].map((r) => [0, 1].map((c) => `<rect class="w" x="${140 + c * 18}" y="${22 + r * 15}" width="9" height="10"/>`).join('')).join('')}
    ${[0, 1, 2].map((r) => [0, 1].map((c) => `<rect class="w" x="${186 + c * 14}" y="${48 + r * 16}" width="8" height="10"/>`).join('')).join('')}</g>
    <g class="tr"><circle cx="40" cy="78" r="14"/><path d="M40 92v8"/><circle cx="246" cy="76" r="14"/><path d="M246 90v10"/></g><path class="gr" d="M10 100h260"/></svg>`,
  scene: `<svg viewBox="0 0 560 330" class="ig-scene" preserveAspectRatio="xMidYMax slice" ${A}>
    <circle class="moon" cx="440" cy="84" r="24"/>
    <path class="bird" d="M330 98q10-12 20 0q10-12 20 0M390 74q8-9 16 0q8-9 16 0"/>
    <path class="m1" d="M120 250l90-70 70 40 80-60 110 70 90-30V330H120z"/>
    <path class="sea" d="M0 262H560V330H0z"/>
    <path class="hill" d="M0 330V296q60-48 150-36t120 46V330z"/>
    <path class="house" d="M52 272v-30l24-16 24 16v30z"/><path class="door" d="M70 272v-14h12v14z"/>
    <path class="route" d="M120 282q80-26 180 -4t170-20"/>
    <g class="wv"><path d="M430 280q10-12 20 0t20 0 20 0M430 298q10-12 20 0t20 0 20 0M430 316q10-12 20 0t20 0 20 0"/></g>
  </svg>`,
  compass: (dirs) => {
    const arm = (k, rot, lx, ly) => `<g class="cp${dirs.includes(k) ? ' on' : ''}"><path d="M60 60L50 40 60 10 70 40z" transform="rotate(${rot} 60 60)"/><text x="${lx}" y="${ly}" text-anchor="middle">${k}</text></g>`;
    return `<svg viewBox="0 0 150 150" class="ig-cmp2" ${A}><g transform="translate(15 15)"><circle cx="60" cy="60" r="58" class="rng"/>${arm('С', 0, 60, -2)}${arm('В', 90, 126, 66)}${arm('Ю', 180, 60, 130)}${arm('З', 270, -6, 66)}<circle cx="60" cy="60" r="6" class="hub"/></g></svg>`;
  },
};
