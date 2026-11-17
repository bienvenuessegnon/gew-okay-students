import { displayName, THEME, HASHTAGS } from "./texts.js";
import { drawCroppedPhoto } from "./crop.js";

export const POSTER_SIZE = 1080;

/** Reserved circular photo slot, in poster pixels. */
export const SLOT = {
  cx: 540,
  cy: 506,
  diameter: 420,
};

const COLORS = {
  bg: "#FBF8F2",
  ink: "#0B3A2C",
  name: "#0B3A2C",
  muted: "#3F5C4C",
  green: "#008751",
  greenDeep: "#0B3A2C",
  greenMid: "#0E4F3A",
  gold: "#C4A017",
  goldBright: "#E0B422",
  orange: "#E85D04",
  flagGreen: "#008751",
  flagYellow: "#FCD116",
  flagRed: "#E8112D",
  slotFill: "#E8E3D8",
  slotIcon: "#0B3A2C",
  leaf: "#9FBF8F",
  leafDeep: "#7FA36E",
  leafSoft: "#C5D9B8",
};

export function drawPoster(ctx, W, H, options) {
  const u = W / POSTER_SIZE;
  const student = options.student || {};
  const logos = options.logos || {};
  const photo = options.photo || null;
  const crop = options.crop || { zoom: 1, offsetX: 0, offsetY: 0, viewSize: 280 };
  const slot = {
    cx: SLOT.cx * u,
    cy: SLOT.cy * u,
    diameter: SLOT.diameter * u,
  };

  drawBackground(ctx, W, H);
  drawLeaves(ctx, W, H, slot, u);
  drawBanner(ctx, W, 136 * u, u);
  drawLogoRow(ctx, W, 148 * u, 132 * u, u, logos);
  drawPortrait(ctx, photo, crop, slot.cx, slot.cy, slot.diameter, u);
  const afterIdentity = drawIdentity(ctx, W, u, student);
  drawThemePill(ctx, W, afterIdentity + 26 * u, u);
  drawFooter(ctx, W, H, u);
  drawFlagStripe(ctx, H - 14 * u, 14 * u, W);
}

function drawBackground(ctx, W, H) {
  const grd = ctx.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, "#FFFFFF");
  grd.addColorStop(0.45, COLORS.bg);
  grd.addColorStop(1, "#F4EFE6");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);
}

function drawBanner(ctx, W, h, u) {
  ctx.fillStyle = COLORS.greenDeep;
  ctx.fillRect(0, 0, W, h);
  drawDiamondPattern(ctx, 0, 0, W, h, u);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#FFFFFF";

  const title = "SEMAINE MONDIALE DE L'ENTREPRENEURIAT";
  const dates = "16 AU 23 NOVEMBRE 2026";
  ctx.font = `800 ${28 * u}px Montserrat`;
  fillTextSpaced(ctx, title, W / 2, h * 0.4, 1.4 * u);
  ctx.font = `700 ${20 * u}px Montserrat`;
  fillTextSpaced(ctx, dates, W / 2, h * 0.7, 2.6 * u);

  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(0, h - 2.5 * u, W, 2.5 * u);
}

function drawDiamondPattern(ctx, x, y, w, h, u) {
  const step = 26 * u;
  const size = 6.5 * u;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = Math.max(1, 1.15 * u);
  for (let row = 0, py = y + step * 0.15; py < y + h + step; row++, py += step) {
    const ox = (row % 2) * (step / 2);
    for (let px = x - step + ox; px < x + w + step; px += step) {
      ctx.beginPath();
      ctx.moveTo(px, py - size);
      ctx.lineTo(px + size, py);
      ctx.lineTo(px, py + size);
      ctx.lineTo(px - size, py);
      ctx.closePath();
      ctx.stroke();
    }
  }

  // Soft veil in the center so the title stays crisp
  const veil = ctx.createLinearGradient(x, 0, x + w, 0);
  veil.addColorStop(0, "rgba(11,58,44,0)");
  veil.addColorStop(0.2, "rgba(11,58,44,0.15)");
  veil.addColorStop(0.5, "rgba(11,58,44,0.55)");
  veil.addColorStop(0.8, "rgba(11,58,44,0.15)");
  veil.addColorStop(1, "rgba(11,58,44,0)");
  ctx.fillStyle = veil;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

function drawLogoRow(ctx, W, top, rowH, u, logos) {
  const midY = top + rowH / 2;
  const gew = logos.gew;
  const meb = logos.mebV || logos.meb;
  const okay = logos.okay;

  // Three columns, visually balanced
  if (gew) drawContained(ctx, gew, W * 0.2, midY, 250 * u, 56 * u);
  if (meb) drawContained(ctx, meb, W * 0.5, midY, 176 * u, 136 * u);
  if (okay) drawContained(ctx, okay, W * 0.8, midY, 148 * u, 118 * u);
}

function drawLeaves(ctx, W, H, slot, u) {
  const left = [
    { x: 78, y: 400, len: 230, wid: 74, ang: -0.5, color: COLORS.leafSoft, blur: 7, a: 0.7 },
    { x: 36, y: 490, len: 200, wid: 62, ang: -0.08, color: COLORS.leaf, blur: 3, a: 0.58 },
    { x: 115, y: 555, len: 165, wid: 52, ang: 0.5, color: COLORS.leafDeep, blur: 2, a: 0.5 },
    { x: 18, y: 370, len: 130, wid: 42, ang: -1.1, color: COLORS.leaf, blur: 5, a: 0.4 },
    { x: 155, y: 630, len: 100, wid: 34, ang: 0.95, color: COLORS.leafSoft, blur: 3, a: 0.4 },
    { x: 48, y: 620, len: 80, wid: 28, ang: 0.25, color: COLORS.leafDeep, blur: 2, a: 0.35 },
  ];
  const right = [
    { x: 1002, y: 400, len: 230, wid: 74, ang: Math.PI + 0.5, color: COLORS.leafSoft, blur: 7, a: 0.7 },
    { x: 1044, y: 490, len: 200, wid: 62, ang: Math.PI + 0.08, color: COLORS.leaf, blur: 3, a: 0.58 },
    { x: 965, y: 555, len: 165, wid: 52, ang: Math.PI - 0.5, color: COLORS.leafDeep, blur: 2, a: 0.5 },
    { x: 1062, y: 370, len: 130, wid: 42, ang: Math.PI + 1.1, color: COLORS.leaf, blur: 5, a: 0.4 },
    { x: 925, y: 630, len: 100, wid: 34, ang: Math.PI - 0.95, color: COLORS.leafSoft, blur: 3, a: 0.4 },
    { x: 1032, y: 620, len: 80, wid: 28, ang: Math.PI - 0.25, color: COLORS.leafDeep, blur: 2, a: 0.35 },
  ];

  // Soft watercolor washes first
  for (const blob of [
    { x: 90, y: 530, r: 180, a: 0.26 },
    { x: 990, y: 530, r: 180, a: 0.26 },
    { x: 70, y: 680, r: 120, a: 0.16 },
    { x: 1010, y: 680, r: 120, a: 0.16 },
  ]) {
    ctx.save();
    ctx.filter = `blur(${14 * u}px)`;
    ctx.globalAlpha = blob.a;
    const g = ctx.createRadialGradient(blob.x * u, blob.y * u, 0, blob.x * u, blob.y * u, blob.r * u);
    g.addColorStop(0, COLORS.leafSoft);
    g.addColorStop(1, "rgba(197,217,184,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(blob.x * u, blob.y * u, blob.r * u, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  for (const leaf of [...left, ...right]) {
    drawLeaf(ctx, leaf.x * u, leaf.y * u, leaf.len * u, leaf.wid * u, leaf.ang, leaf.color, leaf.blur * u, leaf.a);
  }
}

function drawLeaf(ctx, x, y, length, width, angle, color, blur, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = alpha;
  if (blur) ctx.filter = `blur(${blur}px)`;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(width, length * 0.22, width * 0.85, length * 0.62, 0, length);
  ctx.bezierCurveTo(-width * 0.85, length * 0.62, -width, length * 0.22, 0, 0);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, 0, 0, length);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.filter = "none";
  ctx.globalAlpha = alpha * 0.55;
  ctx.beginPath();
  ctx.moveTo(0, length * 0.08);
  ctx.quadraticCurveTo(width * 0.08, length * 0.5, 0, length * 0.88);
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = Math.max(1, length * 0.012);
  ctx.stroke();
  ctx.restore();
}

function drawPortrait(ctx, photo, crop, cx, cy, diameter, u) {
  const r = diameter / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy + 6 * u, r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(11, 58, 44, 0.10)";
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = COLORS.slotFill;
  ctx.fill();
  if (photo) {
    ctx.restore();
    drawCroppedPhoto(ctx, photo, crop, cx, cy, diameter);
  } else {
    ctx.clip();
    ctx.fillStyle = COLORS.slotIcon;
    ctx.globalAlpha = 0.35;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `600 ${20 * u}px Montserrat`;
    ctx.fillText("Ajoutez votre photo", cx, cy + 34 * u);
    const cw = 50 * u;
    const ch = 36 * u;
    const x = cx - cw / 2;
    const y = cy - 34 * u;
    ctx.lineWidth = 2.5 * u;
    ctx.strokeStyle = COLORS.slotIcon;
    roundedRect(ctx, x, y, cw, ch, 6 * u);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, y + ch / 2 + 2 * u, 10 * u, 0, Math.PI * 2);
    ctx.stroke();
    roundedRect(ctx, x + 10 * u, y - 6 * u, 14 * u, 8 * u, 2 * u);
    ctx.stroke();
    ctx.restore();
  }

  // Thin dashed gold ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r + 8 * u, 0, Math.PI * 2);
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 2.2 * u;
  ctx.setLineDash([5.5 * u, 4.2 * u]);
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.restore();
}

function drawIdentity(ctx, W, u, student) {
  const name = displayName(student);
  const nameIsPlaceholder = !name;
  const nameText = name || "Votre nom";
  const metaParts = [student.filiere, student.annee, student.universite]
    .map((s) => (s || "").trim())
    .filter(Boolean);
  const metaIsPlaceholder = metaParts.length === 0;
  const metaText = metaIsPlaceholder
    ? "Filière  ·  Année  ·  Université"
    : metaParts.join("  ·  ");

  const contentW = 920 * u;
  let y = 738 * u;

  // Name: prefer a single line, shrink, wrap only if needed
  const nameMax = 50 * u;
  const nameMin = 28 * u;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = nameIsPlaceholder ? "rgba(11,58,44,0.38)" : COLORS.name;

  const nameFit = fitSingleLine(ctx, nameText, contentW, nameMax, nameMin, 900, "Montserrat");
  let nameLines;
  let nameSize;
  if (nameFit.fits) {
    nameSize = nameFit.size;
    nameLines = [nameText];
  } else {
    nameSize = Math.max(nameMin, 34 * u);
    ctx.font = `900 ${nameSize}px Montserrat`;
    nameLines = wrapText(ctx, nameText, contentW).slice(0, 2);
  }
  ctx.font = `900 ${nameSize}px Montserrat`;
  const nameTrack = nameLines.length === 1 && nameSize > nameMax * 0.84
    ? nameSize * 0.02
    : 0;
  for (const line of nameLines) {
    fillTextSpaced(ctx, line, W / 2, y, nameTrack);
    y += nameSize * 1.08;
  }

  y += 10 * u;
  const metaMax = 19 * u;
  const metaMin = 14 * u;
  ctx.fillStyle = metaIsPlaceholder ? "rgba(63,92,76,0.5)" : COLORS.muted;
  const metaFit = fitSingleLine(ctx, metaText, contentW, metaMax, metaMin, 500, "Montserrat");
  let metaLines;
  let metaSize;
  if (metaFit.fits) {
    metaSize = metaFit.size;
    metaLines = [metaText];
  } else {
    metaSize = 16.5 * u;
    ctx.font = `500 ${metaSize}px Montserrat`;
    metaLines = wrapText(ctx, metaText, contentW).slice(0, 2);
  }
  ctx.font = `500 ${metaSize}px Montserrat`;
  for (const line of metaLines) {
    ctx.fillText(line, W / 2, y);
    y += metaSize * 1.28;
  }

  y += 10 * u;
  ctx.fillStyle = COLORS.orange;
  ctx.font = `700 ${20 * u}px Montserrat`;
  ctx.fillText("Membre de OKAY Students", W / 2, y);
  return y + 22 * u;
}

function drawThemePill(ctx, W, top, u) {
  const padX = 78 * u;
  const boxX = padX;
  const boxW = W - padX * 2;
  const themeSize = 17 * u;
  ctx.font = `600 italic ${themeSize}px Montserrat`;
  const lines = wrapQuotedBalanced(ctx, THEME, Math.min(700 * u, boxW - 100 * u));
  const boxH = lines.length * themeSize * 1.32 + 28 * u;
  const cap = 16 * u;
  const r = boxH / 2;

  // Orange / red end caps
  roundedRect(ctx, boxX, top, boxW, boxH, r);
  const capGrad = ctx.createLinearGradient(boxX, 0, boxX + boxW, 0);
  capGrad.addColorStop(0, COLORS.orange);
  capGrad.addColorStop(0.08, COLORS.orange);
  capGrad.addColorStop(0.08, COLORS.greenDeep);
  capGrad.addColorStop(0.92, COLORS.green);
  capGrad.addColorStop(0.92, COLORS.flagRed);
  capGrad.addColorStop(1, COLORS.flagRed);
  ctx.fillStyle = capGrad;
  ctx.fill();

  // Green body inset so the caps stay as slim accents
  const inset = cap;
  roundedRect(ctx, boxX + inset, top, boxW - inset * 2, boxH, r);
  const body = ctx.createLinearGradient(boxX, 0, boxX + boxW, 0);
  body.addColorStop(0, COLORS.greenDeep);
  body.addColorStop(0.5, "#0F5A3E");
  body.addColorStop(1, COLORS.green);
  ctx.fillStyle = body;
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `600 italic ${themeSize}px Montserrat`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  let ty = top + 14 * u;
  for (const line of lines) {
    ctx.fillText(line, W / 2, ty);
    ty += themeSize * 1.32;
  }
}

function drawFooter(ctx, W, H, u) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = COLORS.muted;
  ctx.font = `600 ${12.5 * u}px Montserrat`;
  fillTextSpaced(
    ctx,
    "Semaine mondiale de l'Entrepreneuriat  ·  Bénin 2026",
    W / 2,
    H - 44 * u,
    0.8 * u
  );
  ctx.font = `600 ${11 * u}px Montserrat`;
  ctx.globalAlpha = 0.85;
  fillTextSpaced(ctx, HASHTAGS.replace(/ /g, "    "), W / 2, H - 26 * u, 0.4 * u);
  ctx.globalAlpha = 1;
}

function drawFlagStripe(ctx, y, h, W) {
  const third = Math.round(W / 3);
  ctx.fillStyle = COLORS.flagGreen;
  ctx.fillRect(0, y, third, h);
  ctx.fillStyle = COLORS.flagYellow;
  ctx.fillRect(third, y, third, h);
  ctx.fillStyle = COLORS.flagRed;
  ctx.fillRect(third * 2, y, W - third * 2, h);
}

function drawContained(ctx, img, cx, cy, maxW, maxH) {
  const scale = Math.min(maxW / img.width, maxH / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
}

function fitSingleLine(ctx, text, maxWidth, maxSize, minSize, weight, family) {
  for (let size = maxSize; size >= minSize - 0.01; size -= 0.5) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) {
      return { size, fits: true };
    }
  }
  return { size: minSize, fits: false };
}


export function wrapQuotedBalanced(ctx, inner, maxWidth) {
  const open = "« ";
  const close = " »";
  const one = open + inner + close;
  if (ctx.measureText(one).width <= maxWidth * 0.92) return [one];
  const words = inner.split(/\s+/).filter(Boolean);
  let best = null;
  let bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = open + words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ") + close;
    const wa = ctx.measureText(a).width;
    const wb = ctx.measureText(b).width;
    if (wa > maxWidth || wb > maxWidth) continue;
    const score = Math.abs(wa - wb);
    if (score < bestScore) {
      bestScore = score;
      best = [a, b];
    }
  }
  return best || wrapQuoted(ctx, inner, maxWidth);
}

export function wrapQuoted(ctx, inner, maxWidth) {
  const open = "« ";
  const close = " »";
  const one = open + inner + close;
  if (ctx.measureText(one).width <= maxWidth) return [one];
  const lines = wrapText(ctx, inner, maxWidth - ctx.measureText(open).width);
  lines[0] = open + lines[0];
  lines[lines.length - 1] = lines[lines.length - 1] + close;
  return lines;
}

export function wrapText(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      if (ctx.measureText(word).width > maxWidth) {
        lines.push(...breakLongWord(ctx, word, maxWidth));
        line = "";
      } else {
        line = word;
      }
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function breakLongWord(ctx, word, maxWidth) {
  const lines = [];
  let current = "";
  for (const char of word) {
    const test = current + char;
    if (ctx.measureText(test).width <= maxWidth) current = test;
    else {
      if (current) lines.push(current);
      current = char;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function fillTextSpaced(ctx, text, cx, y, spacing) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total =
    widths.reduce((a, b) => a + b, 0) + spacing * Math.max(0, chars.length - 1);
  let x = cx - total / 2;
  const prev = ctx.textAlign;
  ctx.textAlign = "left";
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], x, y);
    x += widths[i] + spacing;
  }
  ctx.textAlign = prev;
}

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export async function waitForFonts() {
  if (!document.fonts || !document.fonts.ready) return;
  await document.fonts.ready;
  const samples = [
    "400 16px Poppins",
    "500 16px Poppins",
    "600 16px Poppins",
    "700 16px Poppins",
    "800 16px Poppins",
    "500 16px Montserrat",
    "600 16px Montserrat",
    "700 16px Montserrat",
    "800 16px Montserrat",
    "900 16px Montserrat",
    "500 italic 16px Montserrat",
    "600 italic 16px Montserrat",
  ];
  await Promise.all(samples.map((s) => document.fonts.load(s)));
}

export function loadLogo(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Logo introuvable : ${src}`));
    img.src = src;
  });
}
