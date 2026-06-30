const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ui = {
  score: document.getElementById('score'), best: document.getElementById('best'), carriers: document.getElementById('carriers'),
  energy: document.getElementById('energy'), combo: document.getElementById('combo'), accuracy: document.getElementById('accuracy'), time: document.getElementById('time'),
  actLabel: document.getElementById('actLabel'), objective: document.getElementById('objective'), progressFill: document.getElementById('progressFill'),
  helper: document.getElementById('helper'), focusPct: document.getElementById('focusPct'), menu: document.getElementById('menuOverlay'), pause: document.getElementById('pauseOverlay'),
  result: document.getElementById('resultOverlay'), resultTitle: document.getElementById('resultTitle'), resultSummary: document.getElementById('resultSummary'), muteBtn: document.getElementById('muteBtn')
};

const PAD_INFO = [
  { name: 'Don', key: 'KeyD', color: '#ff5d46', glow: '#ffd18b', freq: 92 },
  { name: 'Ka', key: 'KeyF', color: '#ffb52c', glow: '#fff0a8', freq: 185 },
  { name: 'Hi', key: 'KeyJ', color: '#45ddff', glow: '#ddfeff', freq: 330 },
  { name: 'Ya', key: 'KeyK', color: '#ff58b5', glow: '#ffd9ff', freq: 247 }
];
const ACTS = [
  { name: 'Opening Don', goal: 'Hit 6 Don/Ka beats, route 3 gold lanterns, keep crowd energy above 70%.', threshold: 900, speed: 150, pads: ['Don','Ka'], pattern: ['Don','Ka','Don','Don','Ka','Don','Ka','Don'] },
  { name: 'Fox-Mask Call', goal: 'Repeat call echoes, use all four pads, route pink and gold carriers.', threshold: 2100, speed: 190, pads: ['Don','Ka','Hi','Ya'], pattern: ['Don','Ka','Hi','Don','Ya','Ka','Don','Hi','Ya','Don'] },
  { name: 'Firework Finale', goal: 'Hold Great streaks, route lantern carriers, and reach 3300 for the Grand Encore.', threshold: 3300, speed: 232, pads: ['Don','Ka','Hi','Ya'], pattern: ['Don','Hi','Ka','Don','Ya','Ya','Ka','Hi','Don','Ka','Hi','Ya'] }
];

const storageKey = 'day019-matsuri-best';
const state = {
  mode: 'menu', score: 0, best: Number(localStorage.getItem(storageKey) || 0), carriers: 3, energy: 100, combo: 1, hits: 0, attempts: 0,
  greatStreak: 0, bestGreat: 0, routes: 0, act: 0, elapsed: 0, actProgress: 0, cues: [], carriersLane: [0, 2], selectedCarrier: 0,
  nextCueAt: 0.7, patternIndex: 0, lastTime: 0, lastJudgment: 'Ready', focus: 0, focusActive: 0, gatesOpen: [false, false, false, false],
  callPhrase: [], callInput: [], callTimer: 0, grandEncore: false, muted: false, audio: null, bgPulse: 0
};

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(320, Math.floor(rect.width * dpr));
  canvas.height = Math.max(280, Math.floor(rect.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function initAudio() {
  if (state.audio || state.muted) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  state.audio = new AudioContext();
}
function tone(freq, duration = 0.08, type = 'sine', gainValue = 0.055) {
  if (state.muted) return;
  initAudio();
  const ac = state.audio;
  if (!ac) return;
  if (ac.state === 'suspended') ac.resume().catch(() => {});
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime);
  gain.gain.setValueAtTime(0.0001, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(gainValue, ac.currentTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(); osc.stop(ac.currentTime + duration + 0.02);
}
function playPad(name, quality = 'hit') {
  const info = PAD_INFO.find(p => p.name === name) || PAD_INFO[0];
  const mult = quality === 'great' ? 1.08 : quality === 'miss' ? 0.72 : 1;
  tone(info.freq * mult, quality === 'great' ? 0.12 : 0.08, name === 'Ka' ? 'square' : 'sine', quality === 'miss' ? 0.025 : 0.06);
}
function playEncore() {
  [92, 123, 185, 247, 330, 494].forEach((f, i) => setTimeout(() => tone(f, 0.12, 'triangle', 0.05), i * 90));
}

function startGame() {
  initAudio();
  Object.assign(state, { mode: 'running', score: 0, carriers: 3, energy: 100, combo: 1, hits: 0, attempts: 0, greatStreak: 0, bestGreat: 0, routes: 0, act: 0, elapsed: 0, actProgress: 0, cues: [], carriersLane: [0, 2], selectedCarrier: 0, nextCueAt: 0.7, patternIndex: 0, lastJudgment: 'Opening beat!', focus: 0, focusActive: 0, gatesOpen: [false,false,false,false], callPhrase: [], callInput: [], callTimer: 0, grandEncore: false, bgPulse: 0 });
  ui.menu.classList.add('hidden'); ui.result.classList.add('hidden'); ui.pause.classList.add('hidden');
  updateUi();
}
function restart() { startGame(); }
function pauseGame() { if (state.mode === 'running') { state.mode = 'paused'; ui.pause.classList.remove('hidden'); } }
function resumeGame() { if (state.mode === 'paused') { state.mode = 'running'; ui.pause.classList.add('hidden'); state.lastTime = performance.now(); } }
function endGame(reason) {
  state.mode = 'gameover';
  if (state.score > state.best) { state.best = state.score; localStorage.setItem(storageKey, String(state.best)); }
  ui.resultTitle.textContent = state.grandEncore ? 'Grand Encore Complete!' : 'Festival Results';
  ui.resultSummary.textContent = `${reason} Score ${state.score}. Best Great streak ${state.bestGreat}. Routed ${state.routes} carriers. Accuracy ${accuracy()}%.`;
  ui.result.classList.remove('hidden');
  updateUi();
}
function nextAct() {
  if (state.act < ACTS.length - 1) {
    state.act += 1; state.actProgress = 0; state.patternIndex = 0; state.cues = []; state.nextCueAt = state.elapsed + 0.8;
    state.energy = Math.min(100, state.energy + 12); state.carriers = Math.min(3, state.carriers + 1);
    state.lastJudgment = `${ACTS[state.act].name} begins!`;
    [0,1,2,3].forEach((_, i) => setTimeout(() => tone(220 + i * 90, 0.08, 'triangle', 0.04), i * 70));
  } else if (!state.grandEncore && state.score >= 3300) {
    state.grandEncore = true; state.lastJudgment = 'Matsuri Grand Encore! Endless patterns unlocked.'; playEncore(); state.focus = 100;
  }
}

function spawnCue() {
  const act = ACTS[state.act];
  const name = act.pattern[state.patternIndex % act.pattern.length];
  const lane = PAD_INFO.findIndex(p => p.name === name);
  state.cues.push({ name, lane, y: -40, hit: false, id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}` });
  state.patternIndex += 1;
  if (state.patternIndex % 12 === 4 && state.act > 0 && state.callTimer <= 0) {
    state.callPhrase = act.pattern.slice(state.patternIndex % act.pattern.length, state.patternIndex % act.pattern.length + 3);
    while (state.callPhrase.length < 3) state.callPhrase.push(act.pattern[(state.patternIndex + state.callPhrase.length) % act.pattern.length]);
    state.callInput = []; state.callTimer = 6.0;
    state.lastJudgment = `Call echo: ${state.callPhrase.join(' · ')}`;
    state.callPhrase.forEach((p, i) => setTimeout(() => playPad(p, 'good'), i * 220));
  }
}
function hitPad(name) {
  if (state.mode !== 'running') return;
  state.attempts += 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  const hitY = h * 0.72;
  let best = null; let bestDist = Infinity;
  for (const cue of state.cues) {
    if (cue.hit || cue.name !== name) continue;
    const dist = Math.abs(cue.y - hitY);
    if (dist < bestDist) { bestDist = dist; best = cue; }
  }
  let quality = 'miss';
  if (best && bestDist < 68) {
    best.hit = true;
    quality = bestDist < 30 ? 'great' : 'good';
    state.hits += 1;
    const base = quality === 'great' ? 85 : 45;
    state.score += Math.round(base * state.combo);
    state.actProgress += quality === 'great' ? 1.25 : 0.75;
    state.energy = Math.min(100, state.energy + (quality === 'great' ? 2.5 : 1.4));
    state.combo = Math.min(12, state.combo + (quality === 'great' ? 0.35 : 0.18));
    state.focus = Math.min(100, state.focus + (quality === 'great' ? 9 : 5));
    state.gatesOpen[PAD_INFO.findIndex(p => p.name === name)] = true;
    if (quality === 'great') { state.greatStreak += 1; state.bestGreat = Math.max(state.bestGreat, state.greatStreak); }
    else state.greatStreak = 0;
    state.lastJudgment = `${quality === 'great' ? 'Great' : 'Good'} ${name}! Gate ${best.lane + 1} opens.`;
  } else {
    state.combo = 1; state.greatStreak = 0; state.energy = Math.max(0, state.energy - 5); state.lastJudgment = `Off-beat ${name}. Watch the hit band.`;
  }
  if (state.callTimer > 0) {
    state.callInput.push(name);
    const idx = state.callInput.length - 1;
    if (state.callPhrase[idx] !== name) state.callInput = [];
    if (state.callInput.length === state.callPhrase.length) {
      state.score += 360; state.energy = Math.min(100, state.energy + 10); state.actProgress += 2; state.focus = Math.min(100, state.focus + 20);
      state.lastJudgment = 'Perfect call-and-response! Firework bonus ready.';
      state.callInput = []; state.callTimer = 0; playEncore();
    }
  }
  playPad(name, quality);
  flashPad(name);
  updateUi();
}
function routeCarrier(dir) {
  if (state.mode !== 'running') return;
  const idx = state.selectedCarrier;
  state.carriersLane[idx] = Math.max(0, Math.min(3, state.carriersLane[idx] + dir));
  const lane = state.carriersLane[idx];
  if (state.gatesOpen[lane]) {
    state.score += Math.round(160 * state.combo); state.routes += 1; state.actProgress += 1; state.energy = Math.min(100, state.energy + 3);
    state.gatesOpen[lane] = false; state.selectedCarrier = (state.selectedCarrier + 1) % state.carriersLane.length;
    state.lastJudgment = `Lantern carrier routed through lane ${lane + 1}!`;
    tone(520 + lane * 70, 0.1, 'triangle', 0.05);
  } else {
    state.energy = Math.max(0, state.energy - 3); state.lastJudgment = `Lane ${lane + 1} gate needs a matching beat first.`;
  }
  updateUi();
}
function useFocus() {
  if (state.mode !== 'running') return;
  if (state.focus >= 35) { state.focus -= 35; state.focusActive = 4.0; state.lastJudgment = 'Festival Focus slows the parade cues.'; tone(392, 0.18, 'triangle', 0.05); }
  else state.lastJudgment = 'Festival Focus needs more Great hits.';
  updateUi();
}
function flashPad(name) {
  const el = document.querySelector(`[data-pad="${name}"]`);
  if (!el) return;
  el.classList.add('hit'); setTimeout(() => el.classList.remove('hit'), 110);
}

function accuracy() { return state.attempts ? Math.round((state.hits / state.attempts) * 100) : 100; }
function updateUi() {
  ui.score.textContent = String(state.score); ui.best.textContent = String(Math.max(state.best, state.score)); ui.carriers.textContent = `${state.carriers}/3`;
  ui.energy.textContent = `${Math.round(state.energy)}%`; ui.combo.textContent = `×${state.combo.toFixed(1)}`; ui.accuracy.textContent = `${accuracy()}%`;
  ui.time.textContent = `${Math.floor(state.elapsed / 60)}:${String(Math.floor(state.elapsed % 60)).padStart(2, '0')}`;
  const act = ACTS[state.act]; ui.actLabel.textContent = act.name; ui.objective.textContent = act.goal;
  ui.progressFill.style.width = `${Math.min(100, (state.score / 3300) * 100)}%`;
  ui.helper.textContent = `${state.lastJudgment} ${state.callTimer > 0 ? ' Echo: ' + state.callPhrase.join(' · ') + ' → ' + state.callInput.join(' · ') : ''}`;
  ui.focusPct.textContent = `${Math.round(state.focus)}%`; ui.muteBtn.textContent = `Mute: ${state.muted ? 'On' : 'Off'}`;
}

function update(dt) {
  if (state.mode !== 'running') return;
  state.elapsed += dt; state.bgPulse += dt;
  if (state.focusActive > 0) state.focusActive -= dt;
  if (state.callTimer > 0) state.callTimer -= dt;
  const act = ACTS[state.act];
  if (state.elapsed >= state.nextCueAt) {
    spawnCue();
    const interval = Math.max(0.48, 0.95 - state.act * 0.12 - Math.min(0.2, state.elapsed / 700));
    state.nextCueAt = state.elapsed + interval;
  }
  const speed = act.speed * (state.focusActive > 0 ? 0.52 : 1) * (state.grandEncore ? 1.08 : 1);
  const h = canvas.clientHeight, hitY = h * 0.72;
  for (const cue of state.cues) {
    cue.y += speed * dt;
    if (!cue.hit && cue.y > hitY + 92) {
      cue.hit = true; state.attempts += 1; state.energy = Math.max(0, state.energy - 7); state.combo = 1; state.greatStreak = 0; state.lastJudgment = `Missed ${cue.name}. Keep eyes on the hit band.`; playPad(cue.name, 'miss'); updateUi();
    }
  }
  state.cues = state.cues.filter(cue => cue.y < h + 80 && !(cue.hit && cue.y > hitY + 40));
  if (state.score >= ACTS[state.act].threshold) nextAct();
  if (state.energy <= 0) endGame('Crowd energy faded.');
  if (state.elapsed > 360 && !state.grandEncore) endGame('The act timer expired before the Grand Encore.');
}
function draw() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);
  const laneW = w / 4;
  const hitY = h * 0.72;
  const pulse = 0.5 + Math.sin(state.bgPulse * Math.PI * 2) * 0.5;

  ctx.save();
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < 4; i++) {
    const x = i * laneW;
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, `${PAD_INFO[i].color}22`); grad.addColorStop(1, `${PAD_INFO[i].color}07`);
    ctx.fillStyle = grad; ctx.fillRect(x + 6, 8, laneW - 12, h - 16);
    ctx.strokeStyle = state.gatesOpen[i] ? PAD_INFO[i].glow : 'rgba(255,255,255,0.2)';
    ctx.lineWidth = state.gatesOpen[i] ? 5 : 2;
    roundRect(x + 8, 12, laneW - 16, h - 24, 22, false, true);
  }
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = `rgba(255, 241, 191, ${0.58 + pulse * 0.22})`; ctx.lineWidth = 8;
  ctx.setLineDash([18, 10]); ctx.beginPath(); ctx.moveTo(16, hitY); ctx.lineTo(w - 16, hitY); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(8, 4, 24, 0.62)'; roundRect(18, hitY - 28, w - 36, 56, 18, true, false);
  ctx.fillStyle = '#fff8de'; ctx.font = '800 16px system-ui'; ctx.textAlign = 'center'; ctx.fillText('HIT BAND · Good / Great', w / 2, hitY + 6);
  ctx.restore();

  for (const cue of state.cues) drawCue(cue, laneW, hitY);
  drawCarriers(laneW, h);
  drawCall(w, h);

  if (state.grandEncore) {
    ctx.save(); ctx.globalAlpha = 0.72 + pulse * 0.2; ctx.fillStyle = '#ffbf47'; ctx.font = '900 34px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('MATSURI GRAND ENCORE!', w / 2, 54); ctx.restore();
  }
}
function drawCue(cue, laneW, hitY) {
  const info = PAD_INFO[cue.lane]; const x = cue.lane * laneW + laneW / 2; const dist = Math.abs(cue.y - hitY);
  const scale = Math.max(0.75, 1.4 - dist / 280);
  ctx.save(); ctx.translate(x, cue.y); ctx.globalAlpha = cue.hit ? 0.35 : 1;
  ctx.fillStyle = 'rgba(8,4,24,0.68)'; ctx.beginPath(); ctx.arc(0, 0, 32 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = info.glow; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 30 * scale, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = info.color; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(0, 0, 19 * scale, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#fff8de'; ctx.font = `900 ${18 * scale}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(cue.name, 0, 0);
  ctx.restore();
}
function drawCarriers(laneW, h) {
  state.carriersLane.forEach((lane, i) => {
    const x = lane * laneW + laneW / 2 + (i ? 18 : -18); const y = h * 0.84 + i * 22;
    ctx.save(); ctx.fillStyle = i === state.selectedCarrier ? '#ffbf47' : '#ff4e96'; ctx.strokeStyle = '#fff8de'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect?.(x - 24, y - 18, 48, 36, 12) || ctx.rect(x - 24, y - 18, 48, 36); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#17071f'; ctx.font = '900 13px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(i === state.selectedCarrier ? 'ACTIVE' : 'LAMP', x, y);
    ctx.restore();
  });
}
function drawCall(w, h) {
  if (state.callTimer <= 0) return;
  ctx.save(); ctx.fillStyle = 'rgba(10,5,28,0.76)'; roundRect(w * 0.16, 18, w * 0.68, 64, 18, true, false);
  ctx.fillStyle = '#ffbf47'; ctx.font = '900 15px system-ui'; ctx.textAlign = 'center'; ctx.fillText(`CALL ECHO · ${state.callPhrase.join('  ·  ')}`, w / 2, 45);
  ctx.fillStyle = '#fff8de'; ctx.font = '700 12px system-ui'; ctx.fillText(`Repeat now: ${state.callInput.join(' · ') || 'listen / watch'}`, w / 2, 66); ctx.restore();
}
function roundRect(x, y, w, h, r, fill = true, stroke = false) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  if (fill) ctx.fill(); if (stroke) ctx.stroke();
}

function loop(now = performance.now()) {
  const dt = Math.min(0.05, (now - (state.lastTime || now)) / 1000); state.lastTime = now;
  update(dt); draw(); requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
updateUi();

for (const button of document.querySelectorAll('[data-pad]')) button.addEventListener('click', () => hitPad(button.dataset.pad));
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', pauseGame);
document.getElementById('resumeBtn').addEventListener('click', resumeGame);
document.getElementById('restartBtn').addEventListener('click', restart);
document.getElementById('againBtn').addEventListener('click', restart);
document.getElementById('laneLeft').addEventListener('click', () => routeCarrier(-1));
document.getElementById('laneRight').addEventListener('click', () => routeCarrier(1));
document.getElementById('focusBtn').addEventListener('click', useFocus);
document.getElementById('muteBtn').addEventListener('click', () => { state.muted = !state.muted; updateUi(); });
window.addEventListener('keydown', (event) => {
  if (event.repeat) return;
  const pad = PAD_INFO.find(p => p.key === event.code);
  if (pad) { event.preventDefault(); hitPad(pad.name); }
  else if (event.code === 'ArrowLeft' || event.code === 'KeyA') routeCarrier(-1);
  else if (event.code === 'ArrowRight' || event.code === 'KeyL') routeCarrier(1);
  else if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') useFocus();
  else if (event.code === 'KeyP') state.mode === 'paused' ? resumeGame() : pauseGame();
  else if (event.code === 'KeyR') restart();
  else if ((event.code === 'Space' || event.code === 'Enter') && state.mode === 'menu') startGame();
});
