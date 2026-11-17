import { displayName, THEME, HASHTAGS } from "./texts.js";
import { drawCroppedPhoto } from "./crop.js";

export const POSTER_SIZE = 1080;

/** Reserved circular photo slot, in poster pixels. */
export const SLOT = {
  cx: 540,
  cy: 448,
  diameter: 400,
};

const COLORS = {
  bg: "#F7F3EA",
  bg2: "#EFE8D8",
  ink: "#14261E",
  name: "#0B3A2C",
  muted: "#3E5A4C",
  green: "#008751",
  gold: "#C4A017",
  goldBright: "#FCD116",
  orange: "#E85D04",
  flagGreen: "#008751",
  flagYellow: "#FCD116",
  flagRed: "#E8112D",
  slotFill: "#E6E0D2",
  slotIcon: "#0B3A2C",
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

  drawBackground(ctx, W, H, u);
  drawFlagStripe(ctx, 0, 10 * u, W);

  // ---- Header ----
  const gewH = 58 * u;
  if (logos.gew) {
    const ratio = logos.gew.width / logos.gew.height;
    const gewW = gewH * ratio;
    ctx.drawImage(logos.gew, (W - gewW) / 2, 22 * u, gewW, gewH);
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = COLORS.green;
  ctx.font = `600 ${17 * u}px Montserrat`;
  fillTextSpaced(ctx, "16  –  23  novembre  2026", W / 2, 86 * u, 1.6 * u);

  ctx.fillStyle = COLORS.ink;
  ctx.font = `700 ${36 * u}px Poppins`;
  ctx.fillText("Semaine mondiale", W / 2, 114 * u);
  ctx.fillText("de l'Entrepreneuriat", W / 2, 154 * u);

  ctx.fillStyle = COLORS.gold;
  const ruleW = 72 * u;
  ctx.fillRect(W / 2 - ruleW / 2, 202 * u, ruleW, 2.5 * u);

  // ---- Side logos ----
  if (logos.okay) {
    drawContained(ctx, logos.okay, 154 * u, slot.cy, 210 * u, 270 * u);
  }
  if (logos.mebV || logos.meb) {
    drawContained(ctx, logos.mebV || logos.meb, 926 * u, slot.cy, 240 * u, 330 * u);
  }

  // ---- Photo slot ----
  drawPortrait(ctx, photo, crop, slot.cx, slot.cy, slot.diameter, u);

  // ---- Identity, fixed block under the photo ----
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

  const contentW = 860 * u;
  let y = 670 * u;

  const nameSize = 46 * u;
  ctx.font = `800 ${nameSize}px Poppins`;
  const nameLines = wrapText(ctx, nameText, contentW).slice(0, 2);
  ctx.fillStyle = nameIsPlaceholder ? "rgba(11,58,44,0.38)" : COLORS.name;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (const line of nameLines) {
    ctx.fillText(line, W / 2, y);
    y += nameSize * 1.12;
  }

  y += 6 * u;
  const metaSize = 20 * u;
  ctx.font = `500 ${metaSize}px Poppins`;
  ctx.fillStyle = metaIsPlaceholder ? "rgba(62,90,76,0.5)" : COLORS.muted;
  const metaLines = wrapText(ctx, metaText, contentW).slice(0, 2);
  for (const line of metaLines) {
    ctx.fillText(line, W / 2, y);
    y += metaSize * 1.3;
  }

  y += 10 * u;
  ctx.fillStyle = COLORS.orange;
  ctx.font = `600 ${21 * u}px Poppins`;
  ctx.fillText("Fier.e membre de OKAY Students", W / 2, y);

  // Theme — fixed near the bottom
  const themeSize = 18 * u;
  ctx.font = `500 italic ${themeSize}px Montserrat`;
  const themeLines = wrapQuoted(ctx, THEME, 800 * u);
  const themeTop = 900 * u;
  const boxH = themeLines.length * themeSize * 1.35 + 28 * u;
  const boxW = 860 * u;
  const boxX = (W - boxW) / 2;
  roundedRect(ctx, boxX, themeTop, boxW, boxH, 12 * u);
  ctx.fillStyle = "rgba(0, 135, 81, 0.08)";
  ctx.fill();
  ctx.fillStyle = COLORS.green;
  ctx.fillRect(boxX, themeTop + 10 * u, 4 * u, boxH - 20 * u);

  ctx.fillStyle = COLORS.ink;
  ctx.font = `500 italic ${themeSize}px Montserrat`;
  let ty = themeTop + 14 * u;
  for (const line of themeLines) {
    ctx.fillText(line, W / 2, ty);
    ty += themeSize * 1.35;
  }

  ctx.fillStyle = COLORS.muted;
  ctx.font = `600 ${14 * u}px Montserrat`;
  ctx.textBaseline = "middle";
  fillTextSpaced(ctx, HASHTAGS.replace(/ /g, "    "), W / 2, 1036 * u, 0.3 * u);

  drawFlagStripe(ctx, H - 8 * u, 8 * u, W);
}

function drawBackground(ctx, W, H, u) {
  const grd = ctx.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, COLORS.bg);
  grd.addColorStop(1, COLORS.bg2);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);
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

function drawPortrait(ctx, photo, crop, cx, cy, diameter, u) {
  const r = diameter / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy + 5 * u, r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(11, 58, 44, 0.12)";
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = COLORS.slotFill;
  ctx.fill();
  ctx.clip();
  if (photo) {
    ctx.restore();
    drawCroppedPhoto(ctx, photo, crop, cx, cy, diameter);
  } else {
    ctx.fillStyle = COLORS.slotIcon;
    ctx.globalAlpha = 0.35;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `600 ${22 * u}px Poppins`;
    ctx.fillText("Ajoutez votre photo", cx, cy + 36 * u);
    // simple camera glyph
    const cw = 54 * u;
    const ch = 38 * u;
    const x = cx - cw / 2;
    const y = cy - 36 * u;
    ctx.lineWidth = 3 * u;
    ctx.strokeStyle = COLORS.slotIcon;
    ctx.fillStyle = COLORS.slotIcon;
    roundedRect(ctx, x, y, cw, ch, 6 * u);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, y + ch / 2 + 2 * u, 11 * u, 0, Math.PI * 2);
    ctx.stroke();
    roundedRect(ctx, x + 10 * u, y - 7 * u, 16 * u, 9 * u, 2 * u);
    ctx.stroke();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, r + 5 * u, 0, Math.PI * 2);
  ctx.strokeStyle = COLORS.green;
  ctx.lineWidth = 7 * u;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, r + 12 * u, 0, Math.PI * 2);
  ctx.strokeStyle = COLORS.goldBright;
  ctx.lineWidth = 2.5 * u;
  ctx.stroke();
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
    "500 italic 16px Montserrat",
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
