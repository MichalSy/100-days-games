const $ = (id) => document.getElementById(id);
const canvas = $('board');
const ctx = canvas.getContext('2d');
const ASSETS = {
  brigade: './assets/matoi-brigade.png',
  alley: './assets/matoi-alley.png',
  pieces: './assets/matoi-pieces.png',
  icons: './assets/matoi-icons.png',
};
const images = {};
for (const [key, src] of Object.entries(ASSETS)) {
  const img = new Image();
  img.src = src;
  images[key] = img;
}

const dirs = ['NE', 'E', 'SE', 'SW', 'W', 'NW'];
const incidents = [
  { name: 'First Pump Cart', goal: 'Rotate hose toward the near ember, pump water, then swing Matoi before the wind tick.', need: 3 },
  { name: 'Lantern Row Rescue', goal: 'Run a bucket chain around smoke, raise the ladder, rescue the cat, and stamp a firebreak before wind spreads.', need: 4 },
  { name: 'Shrine Gate Firebreak', goal: 'Use Ember Focus, suppress five fronts, rescue the hidden cat, and keep shrine risk below warning.', need: 5 },
];
const bestKey = 'day051-matoi-best';
const timeKey = 'day051-matoi-best-clear';
let audio = null;
let muted = false;
let last = performance.now();
let dragAim = false;
let pointer = null;
const state = newRun();

function newRun() {
  return {
    running: false, paused: false, over: false, won: false,
    score: 0, best: Number(localStorage.getItem(bestKey) || 0), hearts: 3,
    pressure: 82, morale: 100, smoke: 0, shrine: 0, combo: 0, focus: 0,
    tile: { x: 2, y: 3 }, hose: 0, wind: 1, elapsed: 0, windClock: 0,
    incident: 0, progress: 0, protected: 3, rescues: 0, perfectBreaks: 0, efficiency: 100,
    fires: makeFires(0), rescuesOnBoard: [{ x: 3, y: 2, safe: false, saved: false }],
    bucket: [], ladder: null, firebreaks: [], mist: null, matoi: 0, focusActive: 0,
    pulses: [], splashes: [], messages: ['Wet alley ready · tap a tile/fire/rescue to inspect'],
  };
}

function makeFires(level) {
  const base = [
    { x: 2, y: 1, z: 0, hp: 2, heat: 1, id: 'near ember' },
    { x: 4, y: 2, z: 1, hp: 3, heat: 1.2, id: 'roof flare' },
    { x: 1, y: 2, z: 0, hp: 3, heat: 1, id: 'side brazier' },
    { x: 3, y: 0, z: 1, hp: 4, heat: 1.4, id: 'watchtower spark' },
    { x: 0, y: 3, z: 0, hp: 3, heat: 1.1, id: 'cedar stack' },
  ];
  return base.slice(0, 1 + level * 2).map((f, i) => ({ ...f, alive: true, phase: i * 0.8 }));
}

function initAudio() {
  if (audio) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctxA = new Ctx();
    const master = ctxA.createGain();
    master.gain.value = 0.13;
    master.connect(ctxA.destination);
    audio = { ctx: ctxA, master, enabled: true };
    window.__day051Audio = { ctx: ctxA, enabled: true };
  } catch {
    audio = { ctx: null, master: null, enabled: false };
    window.__day051Audio = audio;
  }
}
function beep(type = 'pump') {
  if (!audio || !audio.enabled || muted || !audio.ctx) return;
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  const table = { pump: [130, 0.13, 'square'], water: [520, 0.2, 'sine'], cat: [760, 0.18, 'triangle'], bad: [85, 0.18, 'sawtooth'], matoi: [250, 0.28, 'triangle'], focus: [880, 0.3, 'sine'], win: [660, 0.7, 'triangle'] };
  const [freq, dur, wave] = table[type] || table.pump;
  osc.frequency.setValueAtTime(freq, now);
  osc.type = wave;
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.7, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
  osc.connect(gain); gain.connect(audio.master); osc.start(now); osc.stop(now + dur + 0.03);
}

function startGame() {
  initAudio();
  audio?.ctx?.resume?.();
  Object.assign(state, newRun(), { running: true });
  $('menu').hidden = true;
  note('Pump cart awake · rotate hose and pump into the first ember.');
  beep('matoi');
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(320, Math.floor(rect.width * dpr));
  canvas.height = Math.max(250, Math.floor(rect.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeCanvas);

function iso(x, y, z = 0) {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  const tileW = Math.min(w / 5.3, h / 3.7);
  const tileH = tileW * 0.52;
  const originX = w * 0.5;
  const originY = h * 0.31;
  return { x: originX + (x - y) * tileW * 0.5, y: originY + (x + y) * tileH * 0.5 - z * tileH * 0.78, tileW, tileH };
}
function tileName(t = state.tile) {
  const cols = ['L', 'C-L', 'C', 'C-R', 'R'];
  const rows = ['Back', 'B-Mid', 'Mid', 'Front'];
  return `${cols[t.x] ?? 'C'}-${rows[t.y] ?? 'Mid'}`;
}

function draw() {
  resizeCanvas();
  const w = canvas.clientWidth, h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);
  drawBackground(w, h);
  drawBoard(w, h);
  drawEffects();
  drawHudOverlays();
  requestAnimationFrame(loop);
}
function drawBackground(w, h) {
  if (images.alley.complete && images.alley.naturalWidth) {
    const iw = images.alley.naturalWidth, ih = images.alley.naturalHeight;
    const scale = Math.max(w / iw, h / ih);
    ctx.drawImage(images.alley, (w - iw * scale) / 2, (h - ih * scale) / 2, iw * scale, ih * scale);
  }
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, 'rgba(2,6,13,.20)'); g.addColorStop(.55, 'rgba(2,6,13,.36)'); g.addColorStop(1, 'rgba(2,6,13,.70)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
}
function drawBoard(w, h) {
  for (let y = 0; y < 4; y++) for (let x = 0; x < 5; x++) drawTile(x, y, (x + y) % 2 ? '#1d3342' : '#243b47');
  state.firebreaks.forEach(f => drawFirebreak(f));
  state.bucket.forEach((b, i) => drawBucket(b, i));
  state.fires.filter(f => f.alive).forEach(drawFire);
  state.rescuesOnBoard.filter(r => !r.saved).forEach(drawRescue);
  if (state.ladder) drawLadder(state.ladder);
  drawBrigade();
}
function drawTile(x, y, color) {
  const p = iso(x, y, (x + y > 5 ? .3 : 0));
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(p.x, p.y - p.tileH / 2); ctx.lineTo(p.x + p.tileW / 2, p.y); ctx.lineTo(p.x, p.y + p.tileH / 2); ctx.lineTo(p.x - p.tileW / 2, p.y); ctx.closePath();
  const selected = state.tile.x === x && state.tile.y === y;
  ctx.fillStyle = selected ? '#2f7084' : color;
  ctx.strokeStyle = selected ? '#7dd3fc' : 'rgba(246,199,95,.25)';
  ctx.lineWidth = selected ? 3 : 1;
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(7, 12, 20, .35)';
  ctx.beginPath(); ctx.moveTo(p.x - p.tileW / 2, p.y); ctx.lineTo(p.x, p.y + p.tileH / 2); ctx.lineTo(p.x, p.y + p.tileH / 2 + 12); ctx.lineTo(p.x - p.tileW / 2, p.y + 12); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function drawFire(f) {
  const p = iso(f.x, f.y, f.z); const t = performance.now() / 300 + f.phase;
  const r = 16 + Math.sin(t) * 4 + f.hp * 3;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const grad = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, r * 2.2);
  grad.addColorStop(0, '#fff7aa'); grad.addColorStop(.28, '#ff7a2f'); grad.addColorStop(1, 'rgba(127,29,29,0)');
  ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(p.x, p.y, r * 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.ellipse(p.x, p.y - r * .2, r * .45, r * .9, Math.sin(t) * .25, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#fff3cf'; ctx.font = '700 12px system-ui'; ctx.fillText(f.id, p.x + 12, p.y - 10);
}
function drawRescue(r) {
  const p = iso(r.x, r.y, .1);
  ctx.save(); ctx.fillStyle = '#fef3c7'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(p.x, p.y - 10, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#111827'; ctx.font = '24px serif'; ctx.fillText('🐈', p.x - 13, p.y - 2);
  ctx.restore();
}
function drawBucket(b, i) {
  const p = iso(b.x, b.y, 0.1);
  ctx.fillStyle = i % 2 ? '#bfdbfe' : '#fde68a';
  ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
}
function drawLadder(l) {
  const p = iso(l.x, l.y, 1);
  ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(p.x - 18, p.y + 24); ctx.lineTo(p.x + 18, p.y - 44); ctx.stroke();
  ctx.lineWidth = 2; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(p.x - 14 + i*7, p.y + 15 - i*13); ctx.lineTo(p.x + 2 + i*7, p.y + 8 - i*13); ctx.stroke(); }
}
function drawFirebreak(f) {
  const p = iso(f.x, f.y, .15);
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(p.x - 26, p.y + 9); ctx.lineTo(p.x + 26, p.y - 9); ctx.stroke();
}
function drawBrigade() {
  const p = iso(state.tile.x, state.tile.y, .4);
  drawSpray(p);
  if (images.brigade.complete && images.brigade.naturalWidth) ctx.drawImage(images.brigade, p.x - 48, p.y - 100, 96, 96);
  else { ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(p.x, p.y - 30, 24, 0, Math.PI * 2); ctx.fill(); }
  ctx.strokeStyle = state.matoi > 0 ? '#facc15' : '#ef4444'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(p.x, p.y - 50, state.matoi > 0 ? 78 : 38, 0, Math.PI * 2); ctx.stroke();
  const a = dirAngle(); ctx.strokeStyle = '#e0f2fe'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(p.x, p.y - 52); ctx.lineTo(p.x + Math.cos(a)*48, p.y - 52 + Math.sin(a)*32); ctx.stroke();
}
function drawSpray(p) {
  const a = dirAngle(); const end = { x: p.x + Math.cos(a) * 130, y: p.y - 52 + Math.sin(a) * 85 };
  ctx.strokeStyle = 'rgba(125,211,252,.62)'; ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
  ctx.beginPath(); ctx.moveTo(p.x, p.y - 52); ctx.quadraticCurveTo((p.x+end.x)/2, Math.min(p.y, end.y)-40, end.x, end.y); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(72,199,255,.22)'; ctx.beginPath(); ctx.arc(end.x, end.y, 28, 0, Math.PI*2); ctx.fill();
}
function dirAngle() { return [-.85, -.35, .35, 2.35, Math.PI, -2.35][state.hose]; }
function drawEffects() {
  const now = performance.now();
  state.pulses = state.pulses.filter(p => now - p.t < 650);
  state.pulses.forEach(pu => {
    const k = (now - pu.t) / 650; const a = dirAngle(); const p = iso(pu.x, pu.y, .4);
    ctx.strokeStyle = `rgba(72,199,255,${1-k})`; ctx.lineWidth = 9 * (1-k) + 2;
    ctx.beginPath(); ctx.moveTo(p.x, p.y - 52); ctx.lineTo(p.x + Math.cos(a)*130*k, p.y - 52 + Math.sin(a)*85*k); ctx.stroke();
  });
  state.splashes = state.splashes.filter(s => now - s.t < 800);
  state.splashes.forEach(s => { const k=(now-s.t)/800, p=iso(s.x,s.y,s.z); ctx.fillStyle=`rgba(125,211,252,${1-k})`; ctx.beginPath(); ctx.arc(p.x,p.y,20+k*35,0,Math.PI*2); ctx.fill(); });
  if (state.mist) { const p=iso(state.tile.x,state.tile.y,.2); ctx.fillStyle='rgba(190,232,255,.18)'; ctx.beginPath(); ctx.ellipse(p.x+28,p.y-32,110,58,dirAngle(),0,Math.PI*2); ctx.fill(); }
}
function drawHudOverlays() {
  if (state.focusActive > 0) {
    ctx.save(); ctx.strokeStyle = '#facc15'; ctx.fillStyle = 'rgba(250,204,21,.14)'; ctx.lineWidth = 3;
    state.fires.filter(f=>f.alive).forEach(f => { const p=iso(f.x,f.y,f.z); ctx.beginPath(); ctx.arc(p.x,p.y,34,0,Math.PI*2); ctx.fill(); ctx.stroke(); });
    state.rescuesOnBoard.filter(r=>!r.saved).forEach(r => { const p=iso(r.x,r.y,.1); ctx.strokeRect(p.x-26,p.y-36,52,52); });
    ctx.fillStyle = '#fff7c2'; ctx.font = '800 14px system-ui'; ctx.fillText('Ember Focus: wind spread, pressure loss, ladder reach, rescue path', 16, 26);
    ctx.restore();
  }
  if (!state.running) return;
  ctx.fillStyle = 'rgba(3,7,17,.45)'; ctx.fillRect(0,0,canvas.clientWidth,38);
}

function loop(now) {
  const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
  if (state.running && !state.paused && !state.over) update(dt);
  draw();
}
function update(dt) {
  state.elapsed += dt; state.windClock += dt;
  state.matoi = Math.max(0, state.matoi - dt); state.focusActive = Math.max(0, state.focusActive - dt);
  if (state.windClock > 5.2) { windTick(); state.windClock = 0; }
  state.pressure = Math.max(0, state.pressure + dt * 2 - (state.fires.filter(f=>f.alive).length * dt * .9));
  state.smoke = Math.min(100, state.smoke + state.fires.filter(f=>f.alive).length * dt * 0.55 - (state.mist ? dt * 6 : 0));
  state.shrine = Math.min(100, state.shrine + state.fires.filter(f=>f.alive).length * dt * .32 - state.firebreaks.length * dt * .15);
  state.morale = Math.max(0, state.morale - state.smoke * dt * .025 + (state.matoi > 0 ? dt * 4 : 0));
  if (state.smoke >= 100 || state.shrine >= 100 || state.morale <= 0 || state.pressure <= 0) loseHeart('The alley panicked under smoke and pressure loss.');
  maybeProgress(); renderUI();
}
function windTick() {
  const live = state.fires.filter(f=>f.alive);
  if (!live.length) return;
  const blocked = state.firebreaks.length > 0;
  if (blocked) { award(140, 'Perfect Firebreak held the wind tick.'); state.perfectBreaks++; state.firebreaks.shift(); return; }
  state.smoke += 7; state.shrine += 5; state.combo = 0;
  note('Wind tick carried sparks · stamp a firebreak ahead of the next gust.'); beep('bad');
}
function maybeProgress() {
  const live = state.fires.filter(f => f.alive).length;
  const inc = incidents[state.incident];
  if (state.progress >= inc.need || live === 0) {
    award(1200 + state.incident * 200, `${inc.name} sealed with firewatch paper.`);
    state.progress = 0; state.incident++;
    if (state.hearts < 3) state.hearts++;
    if (state.incident >= incidents.length && state.score >= 6500) win();
    else if (state.incident >= incidents.length) { state.incident = incidents.length - 1; spawnEndless(); }
    else nextIncident();
  }
}
function nextIncident() {
  state.fires = makeFires(state.incident); state.rescuesOnBoard = [{ x: 4 - state.incident, y: Math.max(0, 2 - state.incident%2), safe: false, saved: false }];
  state.smoke = Math.max(8, state.smoke * .45); state.pressure = Math.min(100, state.pressure + 22); state.morale = Math.min(100, state.morale + 18);
  note(`${incidents[state.incident].name}: new wind lanes and rescue markers visible.`); beep('matoi');
}
function spawnEndless() { state.fires = makeFires(2).map((f,i)=>({...f,hp:f.hp+i%2,alive:true})); note('Endless ember patrol unlocked · protect the dawn lanes.'); }
function win() {
  state.won = true; state.over = true; state.running = false; award(4100, 'Matoi Dawn All-Clear!');
  $('blessing').hidden = false; setTimeout(() => $('blessing').hidden = true, 2800); showResults(true); beep('win');
  const clear = Math.floor(state.elapsed); const old = Number(localStorage.getItem(timeKey) || 999999); if (clear < old) localStorage.setItem(timeKey, String(clear));
}
function loseHeart(msg) { state.hearts--; state.pressure = 55; state.morale = 72; state.smoke = Math.min(85, state.smoke); note(msg); beep('bad'); if (state.hearts <= 0) { state.over=true; state.running=false; showResults(false); } }

function handle(action) {
  if (action === 'prompt') { location.href = './prompt.html'; return; }
  if (action === 'restart') { restart(); return; }
  if (action === 'pause') { pause(); return; }
  if (action === 'resume') { resume(); return; }
  if (action === 'audio') { initAudio(); muted = !muted; document.querySelectorAll('[data-action="audio"]').forEach(b => b.textContent = muted ? 'Audio: Off' : 'Audio: On'); return; }
  if (!state.running || state.paused || state.over) return;
  const actions = { move, rotate, pump, bucket, ladder, rescue, firebreak, matoi, mist, focus };
  actions[action]?.(); renderUI();
}
function move() {
  const options = [{x:1,y:0},{x:0,y:-1},{x:-1,y:0},{x:0,y:1}]; const o = options[(Math.floor(state.elapsed)+state.combo) % options.length];
  state.tile.x = Math.max(0, Math.min(4, state.tile.x + o.x)); state.tile.y = Math.max(0, Math.min(3, state.tile.y + o.y));
  award(80, `Brigade moved to ${tileName()} · smoke path checked.`); beep('pump');
}
function rotate() { state.hose = (state.hose + 1) % dirs.length; award(40, `Hose rotated ${dirs[state.hose]} · spray preview moved.`); beep('pump'); }
function pump() {
  state.pressure -= 13; state.pulses.push({ x: state.tile.x, y: state.tile.y, t: performance.now() });
  const target = nearestFireInArc();
  if (target) { target.hp--; state.splashes.push({ x: target.x, y: target.y, z: target.z, t: performance.now() }); award(target.hp <= 0 ? 430 : 310, target.hp <= 0 ? 'Water pulse suppressed an ember before wind tick.' : 'Water pulse weakened the ember front.'); if (target.hp <= 0) { target.alive=false; state.progress++; } beep('water'); }
  else { state.combo=0; state.efficiency-=5; note('Spray missed · rotate hose toward the ember halo before pumping.'); beep('bad'); }
}
function bucket() { state.bucket = [{x:state.tile.x,y:state.tile.y},{x:Math.max(0,state.tile.x-1),y:state.tile.y},{x:Math.max(0,state.tile.x-2),y:Math.max(0,state.tile.y-1)}]; state.pressure=Math.min(100,state.pressure+14); award(330,'Bucket Chain bridged a smoky corner and restored pressure.'); beep('water'); }
function ladder() { state.ladder = { x: state.tile.x, y: state.tile.y }; const roof = state.fires.find(f=>f.alive && f.z>0 && Math.abs(f.x-state.tile.x)+Math.abs(f.y-state.tile.y)<=2); if (roof) { roof.hp--; award(360,'Ladder reached an elevated roof marker.'); } else { note('Ladder raised · no roof marker in reach yet.'); } beep('pump'); }
function rescue() { const r = state.rescuesOnBoard.find(r=>!r.saved && Math.abs(r.x-state.tile.x)+Math.abs(r.y-state.tile.y)<=1); if (r && state.smoke < 70) { r.saved=true; state.rescues++; state.morale=Math.min(100,state.morale+18); state.progress++; award(380,'Rescue Cat safe through a cleared route.'); beep('cat'); } else { note('Rescue Cat needs a nearby safe marker and lower smoke. Use Mist Screen first.'); beep('bad'); } }
function firebreak() { const f = { x: state.tile.x, y: state.tile.y, dir: dirs[state.hose] }; state.firebreaks.push(f); state.progress++; award(420,'Wet clay Firebreak visibly blocks the next spread edge.'); beep('pump'); }
function matoi() { state.matoi = 5; state.morale = Math.min(100, state.morale + 14); award(260,'Swing Matoi expanded the morale circle and steadied helpers.'); beep('matoi'); }
function mist() { state.mist = { t: performance.now() }; setTimeout(()=>state.mist=null, 1300); state.smoke=Math.max(0,state.smoke-18); state.rescuesOnBoard.forEach(r=>r.safe=true); award(180,'Mist Screen cleared smoke and revealed rescue paths.'); beep('water'); }
function focus() { if (state.focus < 55) { note('Ember Focus charging · suppress fires, rescue cats, and place clean firebreaks.'); beep('bad'); return; } state.focus=0; state.focusActive=5; award(220,'Ember Focus overlay shows spread, pressure, ladder, rescue, and firebreak paths.'); beep('focus'); }
function nearestFireInArc() {
  const a = dirAngle();
  let best = null, bestScore = 99;
  const p = iso(state.tile.x,state.tile.y,.4);
  for (const f of state.fires.filter(f=>f.alive)) {
    const fp = iso(f.x,f.y,f.z); const ang = Math.atan2((fp.y)-(p.y-52), (fp.x)-p.x); let delta=Math.abs(Math.atan2(Math.sin(ang-a), Math.cos(ang-a)));
    const dist = Math.hypot(fp.x-p.x, fp.y-(p.y-52));
    const score = delta*2 + dist/260;
    if (score < bestScore && delta < .95) { best=f; bestScore=score; }
  }
  return best;
}
function award(points, msg) { state.score += Math.round(points * (1 + Math.min(2.5,state.combo)*.08)); state.combo++; state.focus=Math.min(100,state.focus+9); note(msg); if (state.score > state.best) { state.best=state.score; localStorage.setItem(bestKey,String(state.best)); } }
function note(msg) { state.messages.unshift(msg); state.messages = state.messages.slice(0, 4); $('helper').textContent = msg; $('boardLabel').textContent = msg; }
function pause() { if (!state.running) return; state.paused=true; $('pauseOverlay').hidden=false; }
function resume() { state.paused=false; $('pauseOverlay').hidden=true; }
function restart() { Object.assign(state, newRun(), { running: true }); $('resultOverlay').hidden=true; $('pauseOverlay').hidden=true; $('menu').hidden=true; note('Restarted · First Pump Cart ready.'); renderUI(); }
function showResults(won) { $('resultOverlay').hidden=false; $('resultKicker').textContent = won ? 'DAWN ALL-CLEAR' : 'RUN REPORT'; $('resultText').textContent = `Score ${state.score}, rescues ${state.rescues}, protected houses ${state.protected}, smoke peak ${Math.round(state.smoke)}%, pressure efficiency ${Math.max(0, Math.round(state.efficiency))}%, perfect firebreaks ${state.perfectBreaks}.`; }
function renderUI() {
  const bestClear = Number(localStorage.getItem(timeKey) || 0);
  $('menuBest').textContent = String(state.best);
  $('menuBestTime').textContent = bestClear ? fmt(bestClear) : 'not set';
  $('score').textContent = state.score; $('best').textContent = state.best; $('hearts').textContent = state.hearts;
  $('pressure').textContent = `${Math.round(state.pressure)}%`; $('morale').textContent = `${Math.round(state.morale)}%`; $('smoke').textContent = `${Math.round(state.smoke)}%`; $('shrine').textContent = `${Math.round(state.shrine)}%`; $('combo').textContent = state.combo;
  $('tile').textContent = tileName(); $('wind').textContent = dirs[state.wind]; $('hose').textContent = dirs[state.hose]; $('focus').textContent = `${Math.round(state.focus)}%`; $('time').textContent = fmt(state.elapsed);
  const inc = incidents[Math.min(state.incident, incidents.length-1)]; $('incidentName').textContent = inc.name.toUpperCase(); $('incidentGoal').textContent = inc.goal;
  [...$('progressTicks').children].forEach((tick,i)=>tick.classList.toggle('done', i < Math.min(3,state.progress)));
}
function fmt(t) { const s=Math.floor(t); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }

function boardToTile(evt) {
  const rect = canvas.getBoundingClientRect(); const x = evt.clientX - rect.left, y = evt.clientY - rect.top;
  let best={x:2,y:2,d:1e9};
  for (let yy=0;yy<4;yy++) for (let xx=0;xx<5;xx++) { const p=iso(xx,yy); const d=Math.hypot(p.x-x,p.y-y); if (d<best.d) best={x:xx,y:yy,d}; }
  return best;
}
canvas.addEventListener('pointerdown', (e)=>{ pointer=boardToTile(e); dragAim=true; if (state.running && pointer.d < 80) { state.tile.x=pointer.x; state.tile.y=pointer.y; note(`Selected alley tile ${tileName()} · hose path recalculated.`); renderUI(); } });
canvas.addEventListener('pointermove', (e)=>{ if (!dragAim || !state.running) return; const rect=canvas.getBoundingClientRect(); const x=e.clientX-rect.left, y=e.clientY-rect.top; const p=iso(state.tile.x,state.tile.y,.4); const ang=Math.atan2(y-(p.y-52), x-p.x); let best=0, diff=9; [-.85,-.35,.35,2.35,Math.PI,-2.35].forEach((a,i)=>{const d=Math.abs(Math.atan2(Math.sin(ang-a),Math.cos(ang-a))); if(d<diff){diff=d;best=i;}}); state.hose=best; renderUI(); });
window.addEventListener('pointerup',()=>dragAim=false);
document.addEventListener('click', (e) => { const target = e.target.closest('[data-action]'); if (target) handle(target.dataset.action); });
$('startBtn').addEventListener('click', startGame);
document.addEventListener('keydown', (e)=>{
  const key=e.key.toLowerCase(); const map={arrowup:'move',arrowdown:'move',arrowleft:'move',arrowright:'move',w:'move',a:'move',s:'mist',d:'move',q:'rotate',e:'rotate',' ':'pump',enter:'pump',b:'bucket',l:'ladder',c:'rescue',x:'firebreak',m:'matoi',f:'focus',p:'pause',escape:'pause',r:'restart'};
  if (map[key]) { e.preventDefault(); handle(map[key]); }
});

window.__day051Debug = {
  state,
  forceFocus() { state.focus = 100; renderUI(); },
  forceWin() { state.score = Math.max(state.score, 6600); state.incident = 2; state.progress = 5; win(); renderUI(); },
  forceGameOver() { state.hearts = 1; loseHeart('Debug smoke forced terminal state.'); renderUI(); },
  action: handle,
};

renderUI();
requestAnimationFrame(loop);
