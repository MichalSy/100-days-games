const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('startBtn');
const statusLine = document.getElementById('statusLine');
const helperText = document.getElementById('helperText');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const heartsEl = document.getElementById('hearts');
const tiltEl = document.getElementById('tilt');
const chapterEl = document.getElementById('chapter');
const objectiveEl = document.getElementById('objective');
const stageBadge = document.getElementById('stageBadge');
const progressPips = document.getElementById('progressPips');
const muteBtn = document.getElementById('muteBtn');

const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
const STORAGE_KEY = 'day031-botan-ikebana';

const chapters = [
  {
    name: 'First Peony Line',
    need: 5,
    objective: 'Place 2 line stems and 2 botan blooms, learn balance, and keep freshness above 45%.',
    targetTilt: 42,
    targetFresh: 45,
    roles: { line: 2, bloom: 2, curve: 1 },
    time: 150
  },
  {
    name: 'Moon Bowl Triangle',
    need: 7,
    objective: 'Build a triangular moon-space composition, mist twice, tie one heavy stem, and keep tilt under 38%.',
    targetTilt: 38,
    targetFresh: 50,
    roles: { line: 2, bloom: 3, curve: 2 },
    time: 165
  },
  {
    name: 'Festival Botan Masterwork',
    need: 9,
    objective: 'Finish the asymmetric masterwork with Ma Focus, low tilt, fresh peonies, and preserved empty space.',
    targetTilt: 34,
    targetFresh: 55,
    roles: { line: 3, bloom: 3, curve: 2, accent: 1 },
    time: 180
  }
];

const stemTypes = [
  { key: 'line', label: 'Line grass', color: '#5d7b3a', weight: 5, freshness: 0.25, length: 210, bend: -0.08, score: 115 },
  { key: 'bloom', label: 'Botan bloom', color: '#d94f77', weight: 18, freshness: 0.5, length: 150, bend: 0.04, score: 150 },
  { key: 'curve', label: 'Willow curve', color: '#6b5138', weight: 10, freshness: 0.35, length: 190, bend: 0.22, score: 130 },
  { key: 'accent', label: 'Moss accent', color: '#8aa44d', weight: 7, freshness: 0.28, length: 125, bend: -0.18, score: 110 }
];

const state = {
  running: false,
  paused: false,
  ended: false,
  score: 0,
  best: Number(localStorage.getItem(`${STORAGE_KEY}:best`) || 0),
  hearts: 3,
  tilt: 0,
  freshness: 100,
  combo: 1,
  focus: 0,
  focusActive: 0,
  mistCharge: 2,
  tieCharge: 1,
  recutCharge: 1,
  chapter: 0,
  progress: 0,
  elapsed: 0,
  lastTick: performance.now(),
  grand: false,
  muted: false,
  selectedStem: 0,
  preview: { x: 0, y: 0, angle: -68, length: 210 },
  stems: [],
  particles: [],
  warning: 'Press Start. Preview a stem before committing.'
};

let audio = null;
window.__day031Audio = { ctx: null, enabled: false };

function fitCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(320, Math.floor(rect.width * DPR));
  canvas.height = Math.max(260, Math.floor(rect.height * DPR));
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  resetPreview(false);
}

function stage() {
  const rect = canvas.getBoundingClientRect();
  return { w: rect.width, h: rect.height, cx: rect.width / 2, base: rect.height * 0.76 };
}

function resetPreview(announce = true) {
  const s = stage();
  state.preview.x = s.cx;
  state.preview.y = s.base - 14;
  state.preview.angle = -68;
  state.preview.length = stemTypes[state.selectedStem].length;
  if (announce) setStatus('Preview reset over the kenzan center.');
}

function initAudio() {
  if (audio || state.muted) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctxAudio = new AudioContext();
    const master = ctxAudio.createGain();
    master.gain.value = 0.16;
    master.connect(ctxAudio.destination);
    audio = { ctx: ctxAudio, master };
    window.__day031Audio = { ctx: ctxAudio, enabled: true };
  } catch (error) {
    audio = null;
    window.__day031Audio = { ctx: null, enabled: false, error: String(error) };
  }
}

async function resumeAudio() {
  initAudio();
  if (audio?.ctx?.state === 'suspended') await audio.ctx.resume();
}

function tone(kind = 'tap') {
  if (!audio || state.muted) return;
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  const table = {
    tap: [360, 0.05, 'triangle'], pin: [620, 0.08, 'sine'], snip: [790, 0.05, 'square'], mist: [520, 0.18, 'sine'],
    tie: [440, 0.12, 'triangle'], wobble: [120, 0.18, 'sawtooth'], wilt: [180, 0.28, 'triangle'], focus: [880, 0.35, 'sine'], grand: [660, 0.7, 'sine']
  }[kind] || [320, 0.08, 'sine'];
  osc.frequency.setValueAtTime(table[0], now);
  osc.type = table[2];
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(kind === 'wobble' ? 0.16 : 0.28, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + table[1]);
  osc.connect(gain).connect(audio.master);
  osc.start(now);
  osc.stop(now + table[1] + 0.02);
  if (kind === 'grand') {
    [820, 990, 1180].forEach((freq, i) => setTimeout(() => {
      if (!audio || state.muted) return;
      const o = audio.ctx.createOscillator();
      const g = audio.ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.value = 0.11;
      o.connect(g).connect(audio.master);
      o.start(); o.stop(audio.ctx.currentTime + 0.18);
    }, 120 + i * 120));
  }
}

function setStatus(text) {
  state.warning = text;
  statusLine.textContent = text;
  helperText.textContent = text;
}

function currentChapter() { return chapters[Math.min(state.chapter, chapters.length - 1)]; }
function selectedType() { return stemTypes[state.selectedStem]; }

function startGame() {
  resumeAudio();
  Object.assign(state, {
    running: true, paused: false, ended: false, score: 0, hearts: 3, tilt: 0, freshness: 100, combo: 1,
    focus: 0, focusActive: 0, mistCharge: 2, tieCharge: 1, recutCharge: 1, chapter: 0, progress: 0,
    elapsed: 0, lastTick: performance.now(), grand: false, selectedStem: 0, stems: [], particles: []
  });
  resetPreview(false);
  overlay.classList.remove('open');
  setStatus('First Peony Line: place a tall line, then counterweight with botan bloom.');
  tone('tap');
}

function restartGame() { startGame(); }

function pauseGame() {
  if (!state.running || state.ended) return;
  state.paused = !state.paused;
  overlay.classList.toggle('open', state.paused);
  document.getElementById('overlayTitle').textContent = state.paused ? 'Paused — Botan Atelier' : 'Botan Ikebana Balance Atelier';
  startBtn.textContent = state.paused ? 'Resume Arrangement' : 'Start Arrangement';
  setStatus(state.paused ? 'Paused. Resume when the arrangement breathes again.' : 'Resumed. Preserve the moon-space.');
}

function gameOver(reason) {
  state.ended = true;
  state.running = false;
  overlay.classList.add('open');
  document.getElementById('overlayTitle').textContent = 'Arrangement Complete';
  startBtn.textContent = 'Restart Arrangement';
  setStatus(reason);
  if (state.score > state.best) {
    state.best = state.score;
    localStorage.setItem(`${STORAGE_KEY}:best`, String(state.best));
  }
  tone(reason.includes('Grand') ? 'grand' : 'wilt');
}

function score(points, message) {
  const gained = Math.round(points * state.combo);
  state.score += gained;
  state.combo = Math.min(4.5, state.combo + 0.12);
  state.focus = Math.min(100, state.focus + 10);
  spawnPetals(10, selectedType().color);
  setStatus(`${message} +${gained}. Combo x${state.combo.toFixed(1)}.`);
}

function miss(amount, message) {
  state.combo = Math.max(1, state.combo - 0.25);
  state.tilt = Math.min(100, state.tilt + amount);
  if (state.tilt >= 100) {
    state.hearts -= 1;
    state.tilt = 62;
    tone('wobble');
  }
  if (state.hearts <= 0) return gameOver('Studio hearts wilted. Restart and place counterweights earlier.');
  setStatus(message);
}

function moveAnchor(dx, dy) {
  const s = stage();
  const radiusX = Math.min(180, s.w * 0.29);
  state.preview.x = clamp(state.preview.x + dx, s.cx - radiusX, s.cx + radiusX);
  state.preview.y = clamp(state.preview.y + dy, s.base - 72, s.base + 12);
  setStatus(`Anchor moved. Balance preview ${Math.abs(balanceForPreview()).toFixed(0)}%.`);
  tone('tap');
}

function rotate(delta) {
  state.preview.angle = clamp(state.preview.angle + delta, -158, -22);
  setStatus(`Stem angle ${Math.round(state.preview.angle)}°. Watch the empty moon-space.`);
  tone('tap');
}

function trim(delta) {
  state.preview.length = clamp(state.preview.length + delta, 80, 260);
  setStatus(`Stem length ${Math.round(state.preview.length)}. Trim before commit for cleaner balance.`);
  tone('snip');
}

function cycleStem() {
  state.selectedStem = (state.selectedStem + 1) % stemTypes.length;
  state.preview.length = selectedType().length;
  setStatus(`Stem rack: ${selectedType().label}. Preview its weight before committing.`);
  tone('tap');
}

function balanceForPreview() {
  const s = stage();
  const t = selectedType();
  return ((state.preview.x - s.cx) / (s.w * 0.42)) * t.weight + Math.sin((state.preview.angle + 90) * Math.PI / 180) * 4;
}

function previewQuality() {
  const ch = currentChapter();
  const s = stage();
  const t = selectedType();
  const horizontal = (state.preview.x - s.cx) / (s.w * 0.35);
  const angleScore = t.key === 'line' ? (state.preview.angle < -80 ? 1 : 0.55) : t.key === 'bloom' ? (state.preview.angle > -112 && state.preview.angle < -42 ? 1 : .6) : .8;
  const spaceScore = Math.max(0, 1 - Math.abs(horizontal + 0.18) * 0.55 - state.stems.length * 0.035);
  const balanceScore = Math.max(0, 1 - Math.abs(state.tilt + balanceForPreview()) / (ch.targetTilt + 22));
  const freshnessScore = state.freshness > ch.targetFresh ? 1 : 0.55;
  return (angleScore * .28 + spaceScore * .28 + balanceScore * .32 + freshnessScore * .12);
}

function previewStem() {
  const q = previewQuality();
  if (q > .75) {
    setStatus('Preview glows ink-gold: strong balance and breathing moon-space. Commit when ready.');
  } else if (q > .5) {
    setStatus('Preview is workable. Counterweight or trim to protect freshness and empty space.');
  } else {
    setStatus('Preview crowds the arrangement or tilts the suiban. Rotate, trim, or move anchor.');
  }
  tone('tap');
}

function commitStem() {
  if (!state.running || state.paused) return;
  const t = selectedType();
  const q = previewQuality();
  const stem = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    type: t.key,
    label: t.label,
    color: t.color,
    x: state.preview.x,
    y: state.preview.y,
    angle: state.preview.angle,
    length: state.preview.length,
    weight: t.weight,
    bend: t.bend,
    freshness: 100,
    tied: false,
    age: 0
  };
  state.stems.push(stem);
  const balance = Math.abs(balanceForPreview());
  state.tilt = clamp(state.tilt + (balance * (stem.tied ? .25 : .65)) - (q > .75 ? 4 : 0), 0, 100);
  state.progress += q > .55 ? 1 : 0.35;
  if (q > .72) score(t.score + (balance < 8 ? 45 : 0), 'Clean stem pinned into the kenzan');
  else miss(8, 'Stem committed, but the moon-space tightens. Recut or counterweight soon.');
  tone('pin');
  advanceIfReady();
}

function mist() {
  if (state.mistCharge <= 0) return setStatus('Mist Brush is empty. Commit clean stems to refresh the sprayer.');
  state.mistCharge -= 1;
  state.freshness = Math.min(100, state.freshness + 22);
  state.stems.forEach((stem) => { stem.freshness = Math.min(100, stem.freshness + 28); });
  score(state.freshness < 78 ? 130 : 60, state.freshness < 78 ? 'Mist restored thirsty peonies' : 'Early mist adds a little shimmer');
  tone('mist');
}

function tie() {
  if (state.tieCharge <= 0) return setStatus('Support Tie is recharging. Save it for a drooping heavy bloom.');
  const candidate = [...state.stems].reverse().find((stem) => !stem.tied && (stem.weight > 12 || Math.abs(stem.angle + 90) > 42));
  if (!candidate) return setStatus('No drooping heavy stem needs a tie yet.');
  state.tieCharge -= 1;
  candidate.tied = true;
  state.tilt = Math.max(0, state.tilt - 14);
  score(150, 'Support Tie stabilized a heavy stem');
  tone('tie');
}

function recut() {
  if (state.recutCharge <= 0) return setStatus('Recut is spent for this commission.');
  const removed = state.stems.pop();
  if (!removed) return setStatus('No committed stem to recut yet.');
  state.recutCharge -= 1;
  state.progress = Math.max(0, state.progress - .6);
  state.tilt = Math.max(0, state.tilt - removed.weight * .7);
  state.combo = Math.max(1, state.combo - .4);
  setStatus(`Recut ${removed.label}. Composition breathes again, but combo softened.`);
  tone('snip');
}

function focus() {
  if (state.focus < 100) return setStatus(`Ma Focus ${Math.round(state.focus)}%. Preserve clean asymmetry to charge it.`);
  state.focus = 0;
  state.focusActive = 7;
  score(90, 'Ma Focus reveals balance lines and negative-space moon');
  tone('focus');
}

function advanceIfReady() {
  const ch = currentChapter();
  if (state.progress < ch.need) return;
  const bonus = state.tilt <= ch.targetTilt && state.freshness >= ch.targetFresh ? 820 : 420;
  state.score += bonus;
  state.chapter += 1;
  state.progress = 0;
  state.mistCharge = Math.min(3, state.mistCharge + 2);
  state.tieCharge = Math.min(2, state.tieCharge + 1);
  state.recutCharge = 1;
  state.hearts = Math.min(3, state.hearts + 1);
  if (state.chapter >= chapters.length && !state.grand && state.score >= 4500) {
    state.grand = true;
    state.focusActive = 8;
    state.score += 2100;
    spawnPetals(70, '#d94f77');
    gameOver('Botan Grand Arrangement complete. Endless commissions are ready for another run.');
    return;
  }
  if (state.chapter >= chapters.length) state.chapter = chapters.length - 1;
  setStatus(`${ch.name} sealed. Next commission: ${currentChapter().name}. +${bonus}`);
  tone('grand');
}

function handleAction(action) {
  if (action !== 'pause' && action !== 'restart') resumeAudio();
  if (!state.running && action !== 'restart') {
    if (action === 'pause') return;
    startGame();
    return;
  }
  if (state.paused && !['pause', 'restart'].includes(action)) return;
  const step = 18;
  switch (action) {
    case 'anchor-left': moveAnchor(-step, 0); break;
    case 'anchor-right': moveAnchor(step, 0); break;
    case 'anchor-up': moveAnchor(0, -step); break;
    case 'anchor-down': moveAnchor(0, step); break;
    case 'rotate-left': rotate(-8); break;
    case 'rotate-right': rotate(8); break;
    case 'trim-down': trim(-12); break;
    case 'trim-up': trim(12); break;
    case 'preview': previewStem(); break;
    case 'commit': commitStem(); break;
    case 'stem': cycleStem(); break;
    case 'mist': mist(); break;
    case 'tie': tie(); break;
    case 'recut': recut(); break;
    case 'focus': focus(); break;
    case 'pause': pauseGame(); break;
    case 'restart': restartGame(); break;
  }
}

function tick(now) {
  const dt = Math.min(0.05, (now - state.lastTick) / 1000);
  state.lastTick = now;
  if (state.running && !state.paused && !state.ended) {
    const slow = state.focusActive > 0 ? 0.45 : 1;
    state.elapsed += dt * slow;
    state.focusActive = Math.max(0, state.focusActive - dt);
    state.freshness = Math.max(0, state.freshness - dt * slow * (0.95 + state.stems.length * 0.045));
    state.tilt = clamp(state.tilt + dt * slow * Math.max(0, state.stems.length - 2) * 0.24, 0, 100);
    state.stems.forEach((stem) => { stem.age += dt * slow; stem.freshness = Math.max(0, stem.freshness - dt * slow * (6 + stem.weight * .12)); });
    if (state.freshness < 28 && Math.floor(state.elapsed * 2) % 2 === 0) tone('wilt');
    if (state.freshness <= 0) {
      state.hearts -= 1;
      state.freshness = 38;
      if (state.hearts <= 0) gameOver('Flowers wilted before the composition could breathe.');
      else setStatus('A bloom wilted. Mist earlier and trim heavy stems.');
    }
    if (state.tilt >= 94) tone('wobble');
    if (state.elapsed > currentChapter().time) gameOver('The studio bell rang before the commission was complete.');
  }
  state.particles = state.particles.filter((p) => (p.life -= dt) > 0).map((p) => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt, rot: p.rot + dt * p.spin }));
  draw();
  updateHud();
  requestAnimationFrame(tick);
}

function updateHud() {
  scoreEl.textContent = String(state.score);
  bestEl.textContent = String(Math.max(state.best, state.score));
  heartsEl.textContent = '♥'.repeat(Math.max(0, state.hearts)) + '♡'.repeat(Math.max(0, 3 - state.hearts));
  tiltEl.textContent = `${Math.round(state.tilt)}%`;
  muteBtn.textContent = state.muted ? 'Audio Off' : 'Audio On';
  chapterEl.textContent = currentChapter().name;
  objectiveEl.textContent = currentChapter().objective + ` Progress ${Math.floor(state.progress)}/${currentChapter().need} · Fresh ${Math.round(state.freshness)}% · Focus ${Math.round(state.focus)}%`;
  stageBadge.textContent = `Anchor ${Math.round(state.preview.x - stage().cx)} · ${selectedType().label} · angle ${Math.round(state.preview.angle)}°`;
  progressPips.innerHTML = '';
  const total = Math.max(6, currentChapter().need);
  for (let i = 0; i < total; i += 1) {
    const pip = document.createElement('i');
    if (i < state.progress) pip.className = 'done';
    progressPips.appendChild(pip);
  }
}

function draw() {
  const s = stage();
  ctx.clearRect(0, 0, s.w, s.h);
  drawBackground(s);
  drawTarget(s);
  drawSuiban(s);
  state.stems.forEach((stem) => drawStem(stem, false));
  drawPreview();
  drawMeters(s);
  drawParticles();
}

function drawBackground(s) {
  const grad = ctx.createLinearGradient(0, 0, 0, s.h);
  grad.addColorStop(0, '#fff8e9');
  grad.addColorStop(0.48, '#f8dfe5');
  grad.addColorStop(1, '#f2dfbd');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, s.w, s.h);
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = '#7d8b4c';
  for (let i = 0; i < 10; i += 1) {
    const x = (i * 97 + 40) % s.w;
    ctx.beginPath(); ctx.ellipse(x, s.h * .15 + Math.sin(i) * 22, 80, 12, -0.5 + i * .14, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawTarget(s) {
  ctx.save();
  ctx.translate(s.cx, s.h * .24);
  ctx.strokeStyle = state.focusActive > 0 ? 'rgba(217,79,119,.8)' : 'rgba(64,82,41,.28)';
  ctx.lineWidth = state.focusActive > 0 ? 4 : 2;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.arc(-55, 0, Math.min(88, s.w * .11), -1.25, 1.3);
  ctx.arc(55, 0, Math.min(120, s.w * .16), 1.8, 4.65);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(43,25,18,.68)';
  ctx.font = '800 14px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('negative-space moon', 0, -105);
  ctx.restore();
}

function drawSuiban(s) {
  ctx.save();
  ctx.translate(s.cx, s.base + 15);
  ctx.fillStyle = 'rgba(70, 45, 26, .16)';
  ctx.beginPath(); ctx.ellipse(0, 34, s.w * .31, 30, 0, 0, Math.PI * 2); ctx.fill();
  const bowl = ctx.createLinearGradient(0, -35, 0, 55);
  bowl.addColorStop(0, '#f3f0e7'); bowl.addColorStop(.55, '#9db1b5'); bowl.addColorStop(1, '#566f77');
  ctx.fillStyle = bowl;
  ctx.beginPath(); ctx.ellipse(0, 0, s.w * .25, 42, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(129, 183, 212, .68)';
  ctx.beginPath(); ctx.ellipse(0, -9, s.w * .22, 24, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#b78b32';
  ctx.beginPath(); ctx.ellipse(0, -12, 62, 26, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(72, 48, 18, .32)'; ctx.lineWidth = 1;
  for (let x = -45; x <= 45; x += 15) for (let y = -24; y <= 0; y += 8) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 2, y - 15); ctx.stroke();
  }
  ctx.restore();
}

function stemEnd(stem) {
  const rad = stem.angle * Math.PI / 180;
  const bend = stem.bend * stem.length;
  return {
    x: stem.x + Math.cos(rad) * stem.length + Math.sin(rad) * bend,
    y: stem.y + Math.sin(rad) * stem.length - Math.cos(rad) * bend
  };
}

function drawStem(stem, ghost) {
  const end = stemEnd(stem);
  ctx.save();
  ctx.globalAlpha = ghost ? 0.58 : 1;
  ctx.lineCap = 'round';
  ctx.lineWidth = stem.type === 'bloom' ? 7 : 5;
  ctx.strokeStyle = ghost ? (previewQuality() > .68 ? '#d6a747' : '#c94d4d') : stem.color;
  const cpx = (stem.x + end.x) / 2 + stem.bend * 90;
  const cpy = (stem.y + end.y) / 2 - Math.abs(stem.bend) * 35;
  ctx.beginPath(); ctx.moveTo(stem.x, stem.y); ctx.quadraticCurveTo(cpx, cpy, end.x, end.y); ctx.stroke();
  ctx.fillStyle = stem.tied ? '#c9b075' : '#9aa56c';
  if (stem.tied) { ctx.beginPath(); ctx.ellipse((stem.x + end.x) / 2, (stem.y + end.y) / 2, 12, 6, .6, 0, Math.PI * 2); ctx.fill(); }
  if (stem.type === 'bloom') drawBloom(end.x, end.y, ghost ? 0.72 : 1, stem.freshness);
  else if (stem.type === 'curve') drawLeaves(end.x, end.y, stem.color, ghost);
  else drawBlade(end.x, end.y, stem.color, ghost);
  ctx.restore();
}

function drawPreview() {
  const t = selectedType();
  drawStem({ ...state.preview, type: t.key, color: t.color, weight: t.weight, bend: t.bend, freshness: 100, tied: false }, true);
  if (state.focusActive > 0) {
    ctx.save();
    ctx.strokeStyle = 'rgba(217,79,119,.5)'; ctx.lineWidth = 2; ctx.setLineDash([5, 7]);
    const s = stage();
    ctx.beginPath(); ctx.moveTo(state.preview.x, state.preview.y); ctx.lineTo(s.cx, s.base); ctx.stroke();
    ctx.restore();
  }
}

function drawBloom(x, y, alpha, freshness) {
  ctx.save(); ctx.globalAlpha *= alpha;
  const wilt = freshness < 35 ? .55 : 1;
  for (let i = 0; i < 10; i += 1) {
    const a = (i / 10) * Math.PI * 2;
    ctx.fillStyle = i % 2 ? '#f7adc2' : '#d94f77';
    ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 11, y + Math.sin(a) * 8, 14 * wilt, 8 * wilt, a, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#d6a747'; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawLeaves(x, y, color, ghost) {
  ctx.save(); ctx.fillStyle = ghost ? 'rgba(107,81,56,.6)' : color;
  for (let i = -2; i <= 2; i += 1) { ctx.beginPath(); ctx.ellipse(x + i * 10, y + Math.abs(i) * 5, 12, 4, i * .7, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
function drawBlade(x, y, color, ghost) { ctx.save(); ctx.strokeStyle = ghost ? 'rgba(93,123,58,.6)' : color; ctx.lineWidth = 3; for (let i=-2;i<=2;i++) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x+i*10, y-30, x+i*18, y-60); ctx.stroke(); } ctx.restore(); }

function drawMeters(s) {
  const bars = [
    ['Tilt', state.tilt, '#c94d4d'], ['Fresh', state.freshness, '#82b7d4'], ['Ma', state.focus, '#667b39']
  ];
  bars.forEach((b, i) => {
    const x = 16, y = s.h - 78 + i * 22, w = Math.min(220, s.w * .28);
    ctx.fillStyle = 'rgba(255,255,255,.72)'; ctx.fillRect(x, y, w, 12);
    ctx.fillStyle = b[2]; ctx.fillRect(x, y, w * b[1] / 100, 12);
    ctx.fillStyle = '#2b1912'; ctx.font = '800 11px system-ui'; ctx.fillText(`${b[0]} ${Math.round(b[1])}%`, x + 6, y + 10);
  });
}

function spawnPetals(count, color) {
  const s = stage();
  for (let i = 0; i < count; i += 1) state.particles.push({ x: s.cx + (Math.random() - .5) * 160, y: s.h * .35, vx: (Math.random() - .5) * 90, vy: 30 + Math.random() * 90, life: .7 + Math.random() * 1.3, color, rot: 0, spin: (Math.random() - .5) * 6 });
}

function drawParticles() {
  ctx.save();
  state.particles.forEach((p) => { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color; ctx.beginPath(); ctx.ellipse(p.x, p.y, 7, 3, p.rot, 0, Math.PI * 2); ctx.fill(); });
  ctx.restore();
}

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

canvas.addEventListener('pointerdown', (event) => {
  const rect = canvas.getBoundingClientRect();
  state.preview.x = clamp(event.clientX - rect.left, stage().cx - stage().w * .3, stage().cx + stage().w * .3);
  state.preview.y = clamp(event.clientY - rect.top, stage().base - 85, stage().base + 10);
  previewStem();
});

document.querySelectorAll('[data-action]').forEach((el) => el.addEventListener('click', () => handleAction(el.dataset.action)));
startBtn.addEventListener('click', () => { if (state.paused) pauseGame(); else startGame(); });
muteBtn.addEventListener('click', () => { state.muted = !state.muted; if (!state.muted) resumeAudio(); });

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const map = { arrowleft:'anchor-left', a:'anchor-left', arrowright:'anchor-right', d:'anchor-right', arrowup:'anchor-up', w:'anchor-up', arrowdown:'anchor-down', s:'anchor-down', q:'rotate-left', e:'rotate-right', z:'trim-down', x:'trim-up', ' ':'preview', enter:'commit', m:'mist', t:'tie', backspace:'recut', shift:'focus', p:'pause', r:'restart', '1':'stem', '2':'stem', '3':'stem', '4':'stem' };
  const action = map[key];
  if (action) { event.preventDefault(); handleAction(action); }
});

window.addEventListener('resize', fitCanvas);
fitCanvas();
updateHud();
requestAnimationFrame(tick);
