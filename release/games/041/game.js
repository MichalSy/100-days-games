const DAY = '041';
const STORE_KEY = 'day041KinokoBest';
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const $ = (id) => document.getElementById(id);

const ui = {
  score: $('score'), best: $('best'), hearts: $('hearts'), dew: $('dew'), dry: $('dry'), combo: $('combo'),
  nodeLabel: $('nodeLabel'), colorLabel: $('colorLabel'), beetleRisk: $('beetleRisk'), focusLabel: $('focusLabel'), timeLabel: $('timeLabel'),
  commissionTitle: $('commissionTitle'), commissionText: $('commissionText'), dewMeter: $('dewMeter'), dewTargetText: $('dewTargetText'),
  chorusMeter: $('chorusMeter'), chorusText: $('chorusText'), healthMeter: $('healthMeter'), healthText: $('healthText'), statusText: $('statusText'),
  menu: $('menu'), pause: $('pauseOverlay'), result: $('resultOverlay'), resultTitle: $('resultTitle'), resultText: $('resultText'), badgeList: $('badgeList')
};

const COLORS = {
  blue: '#61ddff', amber: '#ffbf53', violet: '#b46bff', green: '#8effbd', gold: '#ffd76c', danger: '#ff716b', moss: '#183828'
};
const COLOR_ORDER = ['blue', 'amber', 'violet'];

const commissions = [
  { name: 'First Spore Spark', target: ['blue', 'amber', 'violet'], dewTarget: 45, nodes: 7, text: 'Bloom blue, amber, then violet caps. Keep dew above 45% and learn the first clean pulse route.' },
  { name: 'Cedar Root Chorus', target: ['amber', 'blue', 'violet', 'amber'], dewTarget: 42, nodes: 9, text: 'Use Flip Flow and Mist Spores to route amber, blue, violet, amber while beetles threaten the fork.' },
  { name: 'Grand Kinoko Glowring', target: ['violet', 'blue', 'amber', 'violet', 'blue'], dewTarget: 40, nodes: 11, text: 'Complete a split-pulse glowring, protect roots from beetles, and preserve enough dew for Grand Bloom.' }
];

const baseLayouts = [
  [
    [0,.14,.52,'well'], [1,.28,.30,'junction'], [2,.46,.32,'cap','blue'], [3,.46,.58,'junction'], [4,.64,.28,'cap','amber'], [5,.68,.62,'junction'], [6,.83,.48,'cap','violet']
  ],
  [
    [0,.12,.48,'well'], [1,.24,.27,'junction'], [2,.38,.23,'cap','amber'], [3,.36,.50,'junction'], [4,.51,.37,'cap','blue'], [5,.57,.66,'junction'], [6,.72,.25,'cap','violet'], [7,.75,.58,'cap','amber'], [8,.88,.43,'junction']
  ],
  [
    [0,.11,.51,'well'], [1,.22,.28,'junction'], [2,.34,.20,'cap','violet'], [3,.36,.47,'junction'], [4,.50,.31,'cap','blue'], [5,.49,.66,'junction'], [6,.64,.20,'cap','amber'], [7,.66,.48,'junction'], [8,.79,.30,'cap','violet'], [9,.78,.66,'cap','blue'], [10,.89,.50,'junction']
  ]
];

const graphTemplates = [
  [[0,1],[1,2],[1,3],[3,5],[5,6],[3,4]],
  [[0,1],[1,2],[1,3],[3,4],[3,5],[5,7],[4,6],[7,8]],
  [[0,1],[1,2],[1,3],[3,4],[3,5],[5,7],[7,8],[7,9],[4,6],[9,10]]
];

const state = {
  running: false, paused: false, gameOver: false, grand: false,
  score: 0, best: Number(localStorage.getItem(STORE_KEY) || 0), hearts: 3, dew: 100, dry: 0,
  combo: 1, focus: 0, elapsed: 0, commission: 0, progress: 0, selected: 1,
  activeColor: 'blue', nodes: [], edges: [], pulses: [], beetles: [], particles: [], warnings: [],
  lockedEdges: new Set(), focusActive: 0, muted: false, audio: null, lastT: performance.now()
};

function makeNodes(index) {
  const layout = baseLayouts[index];
  return layout.map(([id,x,y,type,color]) => ({
    id, x, y, type, color, angle: (id % 4) * Math.PI / 2, flow: 1, wet: 1, bloom: 0, harvested: false, locked: false
  }));
}
function makeEdges(index) {
  return graphTemplates[index].map(([a,b], i) => ({ a, b, open: i < 2 || i % 2 === 0, angle: i % 4, wet: 1, bitten: 0, locked: false }));
}
function resetRun() {
  state.running = false; state.paused = false; state.gameOver = false; state.grand = false;
  state.score = 0; state.hearts = 3; state.dew = 100; state.dry = 0; state.combo = 1; state.focus = 0; state.elapsed = 0;
  state.commission = 0; state.progress = 0; state.selected = 1; state.activeColor = 'blue';
  state.nodes = makeNodes(0); state.edges = makeEdges(0); state.pulses = []; state.beetles = []; state.particles = [];
  state.lockedEdges = new Set(); state.focusActive = 0; state.lastT = performance.now();
  ui.pause.classList.add('hidden'); ui.result.classList.add('hidden');
  setStatus('Rotate the first root toward the blue cap, then Pulse Nutrients.');
  updateUI();
}
function startRun() {
  resetRun(); state.running = true; ui.menu.classList.add('hidden'); initAudio(); sound('start');
  setStatus('The grove wakes. Rotate Branch opens routes; Pulse Nutrients sends the active color.');
}

function initAudio() {
  if (state.audio) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctxA = new Ctx();
    const gain = ctxA.createGain(); gain.gain.value = state.muted ? 0 : 0.045; gain.connect(ctxA.destination);
    state.audio = { ctx: ctxA, gain, enabled: true };
    ctxA.resume?.();
    window.__day041Audio = { ctx: ctxA, enabled: true };
  } catch { window.__day041Audio = { ctx: null, enabled: false }; }
}
function sound(kind='tap') {
  const a = state.audio; if (!a || state.muted) return;
  const now = a.ctx.currentTime;
  const osc = a.ctx.createOscillator(); const g = a.ctx.createGain();
  const table = { tap: [380,.05], rotate: [260,.07], pulse: [520,.12], bloom: [760,.16], miss: [120,.12], mist: [440,.09], beetle: [210,.08], focus: [620,.25], start: [330,.2], grand: [880,.5] };
  const [freq, dur] = table[kind] || table.tap;
  osc.type = kind === 'miss' ? 'sawtooth' : (kind === 'mist' ? 'triangle' : 'sine');
  osc.frequency.setValueAtTime(freq, now); osc.frequency.exponentialRampToValueAtTime(Math.max(80, freq * (kind === 'grand' ? 1.5 : .72)), now + dur);
  g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.6, now + .01); g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g).connect(a.gain); osc.start(now); osc.stop(now + dur + .02);
}

function setStatus(text) { ui.statusText.textContent = text; }
function addScore(points) { state.score += Math.round(points * state.combo); state.combo = Math.min(5, +(state.combo + .12).toFixed(2)); state.focus = Math.min(100, state.focus + Math.max(5, points / 80)); }
function hurt(reason) { state.hearts -= 1; state.combo = 1; sound('miss'); setStatus(reason); if (state.hearts <= 0) endGame('The grove hearts withered.'); }
function currentCommission() { return commissions[state.commission]; }
function selectedNode() { return state.nodes.find(n => n.id === state.selected) || state.nodes[0]; }
function nodeById(id) { return state.nodes.find(n => n.id === id); }

function nextCommission() {
  state.commission += 1; state.progress = 0;
  if (state.commission >= commissions.length) {
    if (!state.grand && state.score >= 5500) triggerGrand();
    state.commission = commissions.length - 1;
    commissions[2].target = COLOR_ORDER.map((_,i)=>COLOR_ORDER[(i + Math.floor(state.elapsed/20)) % 3]).concat(['violet']);
  }
  state.nodes = makeNodes(Math.min(state.commission, 2)); state.edges = makeEdges(Math.min(state.commission, 2));
  state.selected = 1; state.activeColor = currentCommission().target[0]; state.beetles = [];
  addScore(980); state.dew = Math.min(100, state.dew + 12); state.hearts = Math.min(3, state.hearts + 1);
  setStatus(`${currentCommission().name} begins. Bloom ${currentCommission().target.join(' → ')}.`);
}
function triggerGrand() {
  state.grand = true; addScore(3100); sound('grand');
  for (let i=0;i<80;i++) state.particles.push({x:Math.random(), y:Math.random(), vx:(Math.random()-.5)*.08, vy:-Math.random()*.14, life:1, color:COLOR_ORDER[i%3]});
  setStatus('Kinoko Grand Mycelium Bloom! Endless grove commissions continue.');
}
function endGame(reason) {
  state.gameOver = true; state.running = false;
  if (state.score > state.best) { state.best = state.score; localStorage.setItem(STORE_KEY, String(state.best)); }
  ui.resultTitle.textContent = state.grand ? 'Grand Mycelium Bloom!' : 'Grove Resting';
  ui.resultText.textContent = `${reason} Final score ${state.score}. Bloom chain ${state.progress}/${currentCommission().target.length}, dew ${Math.round(state.dew)}%.`;
  ui.badgeList.innerHTML = '';
  const badges = [];
  if (state.grand) badges.push('Grand Bloom');
  if (state.dew > 55) badges.push('Dew Saver');
  if (state.hearts === 3) badges.push('No Wither');
  if (state.score > state.best - 1) badges.push('Best Score');
  badges.forEach(b => { const s=document.createElement('span'); s.textContent=b; ui.badgeList.appendChild(s); });
  ui.result.classList.remove('hidden');
}

function rotateBranch() {
  const n = selectedNode(); n.angle += Math.PI / 2;
  const incident = state.edges.filter(e => e.a === n.id || e.b === n.id);
  if (incident.length) {
    const idx = Math.abs(Math.round(n.angle / (Math.PI/2))) % incident.length;
    incident.forEach((e,i)=> e.open = e.locked || i === idx || (state.focusActive > 0 && i < 2));
  }
  addScore(140); sound('rotate'); setStatus(`Rotate Branch changed node ${n.id + 1}; gold paths show the open route.`); updateUI();
}
function flipFlow() {
  const n = selectedNode(); n.flow *= -1; addScore(80); sound('rotate');
  setStatus(`Flip Flow reversed arrows at node ${n.id + 1}. Wrong-way pulses now bounce less often.`); updateUI();
}
function cycleNode(delta) {
  let ids = state.nodes.filter(n=>n.type !== 'well').map(n=>n.id); let i = ids.indexOf(state.selected);
  state.selected = ids[(i + delta + ids.length) % ids.length]; sound('tap'); setStatus(`Selected node ${state.selected + 1}.`); updateUI();
}
function lockRoute() {
  const n = selectedNode(); const e = state.edges.find(e => e.open && (e.a === n.id || e.b === n.id));
  if (!e) { setStatus('No open branch here to lock.'); return; }
  e.locked = !e.locked; if (e.locked) addScore(90); sound('tap'); setStatus(e.locked ? 'Lock Route protects this branch for the current chain.' : 'Route unlocked.');
}
function mistSpores() {
  const n = selectedNode(); let restored = 0;
  for (const e of state.edges) if (e.a === n.id || e.b === n.id) { e.wet = Math.min(1, e.wet + .55); restored++; }
  n.wet = 1; state.dew = Math.max(0, state.dew - 4); state.dry = Math.max(0, state.dry - restored); addScore(170); sound('mist');
  setStatus('Mist Spores restored nearby wetness and slowed beetles, but spent a little dew.'); updateUI();
}
function shooBeetles() {
  if (!state.beetles.length) { setStatus('No beetles on the active route yet.'); sound('beetle'); return; }
  for (const b of state.beetles) b.scared = 1.8;
  addScore(160); sound('beetle'); setStatus('Shoo Beetles pushed the chew line away from the glowing roots.'); updateUI();
}
function harvestGlow() {
  const caps = state.nodes.filter(n => n.type === 'cap' && n.bloom >= 1 && !n.harvested);
  if (!caps.length) { setStatus('Harvest Glow is best after a cap fully blooms.'); return; }
  caps.forEach(c => { c.harvested = true; c.bloom = .65; addScore(210); });
  sound('bloom'); setStatus(`Harvested ${caps.length} glow cap${caps.length>1?'s':''}; Bloom Focus charged.`); updateUI();
}
function bloomFocus() {
  if (state.focus < 100 && state.focusActive <= 0) { setStatus('Bloom Focus needs a full charge from clean pulses and harvests.'); return; }
  state.focus = Math.max(0, state.focus - 100); state.focusActive = 8; sound('focus'); setStatus('Bloom Focus previews pulse paths, dry risks, beetles, and matching caps.'); updateUI();
}
function togglePause(force) {
  if (!state.running && force !== false) return;
  state.paused = force ?? !state.paused;
  ui.pause.classList.toggle('hidden', !state.paused); setStatus(state.paused ? 'Paused. Review controls, resume, restart, mute, or open the prompt.' : 'Back to the glowing grove.');
}
function toggleAudio() {
  initAudio(); state.muted = !state.muted;
  if (state.audio) state.audio.gain.gain.value = state.muted ? 0 : 0.045;
  document.querySelectorAll('[data-action="audio"]').forEach(b=>b.textContent = state.muted ? 'Audio: Off' : 'Audio: On');
  setStatus(state.muted ? 'Audio muted; visual cues stay active.' : 'Audio on after user gesture.');
}

function pulseNutrients() {
  const c = currentCommission(); state.activeColor = c.target[state.progress % c.target.length];
  const path = findPathToColor(state.activeColor);
  if (!path.length) { state.dew = Math.max(0, state.dew - 7); state.combo = 1; sound('miss'); setStatus(`No open wet route to a ${state.activeColor} cap. Rotate Branch or Mist Spores first.`); return; }
  state.pulses.push({ path, t: 0, color: state.activeColor, hit: false });
  state.dew = Math.max(0, state.dew - 2.4); sound('pulse'); setStatus(`${state.activeColor} nutrient pulse launched through ${path.length - 1} branches.`); updateUI();
}
function findPathToColor(color) {
  const start = state.nodes.find(n => n.type === 'well')?.id ?? 0;
  const q = [[start, [start]]]; const seen = new Set([start]);
  while (q.length) {
    const [id, path] = q.shift(); const n = nodeById(id);
    if (n.type === 'cap' && n.color === color && n.bloom < 1.05) return path;
    const nextEdges = state.edges.filter(e => e.open && e.wet > .18 && (e.a === id || e.b === id));
    for (const e of nextEdges) {
      const next = e.a === id ? e.b : e.a;
      const here = nodeById(id);
      if (here?.flow < 0 && e.a === id && !e.locked) continue;
      if (!seen.has(next)) { seen.add(next); q.push([next, [...path, next]]); }
    }
  }
  return [];
}

function update(dt) {
  if (!state.running || state.paused || state.gameOver) return;
  state.elapsed += dt;
  state.dew -= dt * (state.commission === 0 ? .9 : state.commission === 1 ? 1.25 : 1.55);
  state.focusActive = Math.max(0, state.focusActive - dt);
  for (const e of state.edges) { e.wet = Math.max(0, e.wet - dt * (e.locked ? .012 : .025)); }
  state.dry = state.edges.filter(e => e.wet < .22).length;
  if (state.dew <= 0) return endGame('Night dew evaporated.');
  if (state.dry >= 5) return hurt('Too many key branches dried out. Mist before pulsing.');
  spawnBeetles(dt); updateBeetles(dt); updatePulses(dt); updateParticles(dt);
  updateUI();
}
function spawnBeetles(dt) {
  const target = state.commission === 0 ? 0.035 : state.commission === 1 ? 0.07 : 0.105;
  if (Math.random() < target * dt && state.beetles.length < 3 + state.commission) {
    const e = state.edges[Math.floor(Math.random() * state.edges.length)];
    state.beetles.push({ edge: e, t: Math.random(), dir: Math.random()>.5?1:-1, scared: 0, chew: 0 });
  }
}
function updateBeetles(dt) {
  for (const b of state.beetles) {
    b.scared = Math.max(0, b.scared - dt);
    b.t += b.dir * dt * (b.scared ? -.10 : .065);
    if (b.t < 0 || b.t > 1) b.dir *= -1;
    b.t = Math.max(0, Math.min(1, b.t));
    if (!b.scared && b.edge.open) { b.chew += dt; b.edge.bitten = Math.min(1, b.edge.bitten + dt*.18); }
    if (b.chew > 6) { b.chew = -999; b.edge.open = false; b.edge.wet = .05; hurt('A beetle chewed through an active route.'); }
  }
  state.beetles = state.beetles.filter(b => b.chew > -900);
}
function updatePulses(dt) {
  for (const p of state.pulses) {
    p.t += dt * .42;
    if (p.t >= 1 && !p.hit) {
      p.hit = true; const end = nodeById(p.path.at(-1));
      if (end?.type === 'cap' && end.color === p.color) {
        end.bloom = 1.2; state.progress++; addScore(p.path.length > 3 ? 420 : 260); sound('bloom');
        burst(end.x, end.y, p.color, 24);
        setStatus(`${p.color} cap bloomed in chorus order ${state.progress}/${currentCommission().target.length}. Harvest Glow when it shines.`);
        if (state.progress >= currentCommission().target.length) nextCommission();
      } else { state.combo = 1; sound('miss'); setStatus('The nutrient pulse faded before a matching cap.'); }
    }
  }
  state.pulses = state.pulses.filter(p => p.t < 1.35);
}
function burst(x,y,color,count) { for(let i=0;i<count;i++) state.particles.push({x,y,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,life:1,color}); }
function updateParticles(dt) { for (const p of state.particles) { p.x += p.vx*dt; p.y += p.vy*dt; p.vy += .015*dt; p.life -= dt*.75; } state.particles = state.particles.filter(p=>p.life>0); }

function updateUI() {
  ui.score.textContent = state.score; ui.best.textContent = Math.max(state.best, state.score);
  ui.hearts.textContent = '♥'.repeat(Math.max(0,state.hearts)) + '♡'.repeat(Math.max(0,3-state.hearts));
  ui.dew.textContent = `${Math.max(0, Math.round(state.dew))}%`; ui.dry.textContent = String(state.dry);
  ui.combo.textContent = `${state.combo.toFixed(1)}x`; ui.nodeLabel.textContent = `${state.selected + 1}/${state.nodes.length}`;
  ui.colorLabel.textContent = state.activeColor; ui.beetleRisk.textContent = state.beetles.length > 1 ? 'high' : state.beetles.length ? 'watch' : 'low';
  ui.focusLabel.textContent = state.focusActive > 0 ? 'ACTIVE' : `${Math.round(state.focus)}%`;
  const m = Math.floor(state.elapsed / 60), s = Math.floor(state.elapsed % 60).toString().padStart(2,'0'); ui.timeLabel.textContent = `${m}:${s}`;
  const c = currentCommission(); ui.commissionTitle.textContent = `${c.name} ${state.progress}/${c.target.length}`; ui.commissionText.textContent = c.text;
  ui.dewTargetText.textContent = `${c.dewTarget}%`; ui.dewMeter.value = Math.max(0,state.dew); ui.chorusMeter.max = c.target.length; ui.chorusMeter.value = state.progress; ui.chorusText.textContent = `${state.progress}/${c.target.length}`;
  ui.healthMeter.value = Math.max(0, 100 - state.dry*18 - state.beetles.length*8); ui.healthText.textContent = state.dry ? `${state.dry} dry` : 'clean';
}

function draw() {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  const grd = ctx.createRadialGradient(w*.5,h*.5,10,w*.5,h*.5,w*.7);
  grd.addColorStop(0,'rgba(15,70,48,.72)'); grd.addColorStop(1,'rgba(1,10,9,.92)'); ctx.fillStyle = grd; ctx.fillRect(0,0,w,h);
  drawMoss(w,h); drawEdges(w,h); drawPulses(w,h); drawNodes(w,h); drawBeetles(w,h); drawParticles(w,h); drawFocus(w,h);
}
function sx(x,w=canvas.width){return x*w;} function sy(y,h=canvas.height){return y*h;}
function drawMoss(w,h) {
  ctx.save(); ctx.globalAlpha=.22; ctx.strokeStyle='#a5ffcf'; ctx.lineWidth=1;
  for(let i=0;i<28;i++){ const x=(i*73%w), y=(i*137%h); ctx.beginPath(); ctx.arc(x,y,18+(i%5)*8,0,Math.PI*2); ctx.stroke(); }
  ctx.restore();
}
function drawEdges(w,h) {
  for (const e of state.edges) {
    const a=nodeById(e.a), b=nodeById(e.b); if(!a||!b) continue;
    const wet=e.wet; ctx.save(); ctx.lineCap='round'; ctx.lineWidth = e.open ? 10 : 5;
    ctx.strokeStyle = e.open ? `rgba(160,255,210,${.22 + wet*.55})` : `rgba(255,115,100,${.18 + (1-wet)*.36})`;
    if (e.locked) ctx.strokeStyle='rgba(255,217,106,.78)';
    ctx.beginPath(); ctx.moveTo(sx(a.x,w),sy(a.y,h));
    const cx=(sx(a.x,w)+sx(b.x,w))/2, cy=(sy(a.y,h)+sy(b.y,h))/2 - 18*Math.sin((a.id+b.id));
    ctx.quadraticCurveTo(cx,cy,sx(b.x,w),sy(b.y,h)); ctx.stroke();
    ctx.lineWidth=2; ctx.strokeStyle=e.open?'rgba(255,255,255,.42)':'rgba(255,130,120,.32)'; ctx.stroke();
    if (wet < .25) { ctx.strokeStyle='rgba(255,120,95,.82)'; ctx.setLineDash([7,7]); ctx.lineWidth=3; ctx.stroke(); ctx.setLineDash([]); }
    const mx=(sx(a.x,w)+sx(b.x,w))/2, my=(sy(a.y,h)+sy(b.y,h))/2;
    ctx.fillStyle=e.open?'rgba(255,215,106,.9)':'rgba(255,115,100,.75)'; ctx.beginPath(); ctx.arc(mx,my,3.5,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
}
function drawNodes(w,h) {
  for (const n of state.nodes) {
    const x=sx(n.x,w), y=sy(n.y,h), selected=n.id===state.selected;
    ctx.save(); ctx.translate(x,y);
    ctx.shadowColor = n.type==='cap' ? COLORS[n.color] : COLORS.green; ctx.shadowBlur = selected ? 24 : 11;
    if (n.type==='well') { ctx.fillStyle='#6be9ff'; ctx.beginPath(); ctx.arc(0,0,24,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#102b2a'; ctx.beginPath(); ctx.arc(0,0,13,0,Math.PI*2); ctx.fill(); }
    else if (n.type==='cap') { drawMushroom(n, selected); }
    else { ctx.rotate(n.angle); ctx.fillStyle = selected ? '#f5da74' : '#e8f3cd'; roundRect(-18,-18,36,36,10,true); ctx.strokeStyle='rgba(20,50,33,.9)'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(-22,0); ctx.lineTo(22,0); ctx.moveTo(0,-22); ctx.lineTo(0,22); ctx.stroke(); }
    if (selected) { ctx.strokeStyle=COLORS.gold; ctx.lineWidth=4; ctx.setLineDash([8,5]); ctx.beginPath(); ctx.arc(0,0,34,0,Math.PI*2); ctx.stroke(); }
    if (n.flow < 0) { ctx.fillStyle=COLORS.violet; ctx.font='900 18px system-ui'; ctx.fillText('↶',14,-16); }
    ctx.restore();
  }
}
function drawMushroom(n, selected) {
  const col = COLORS[n.color]; ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0,-6,27,18,0,Math.PI,0); ctx.fill();
  ctx.fillStyle='#fff4d6'; roundRect(-8,-6,16,28,8,true); ctx.strokeStyle='rgba(255,255,255,.55)'; ctx.lineWidth=2; ctx.stroke();
  if (n.bloom>0) { ctx.globalAlpha=Math.min(1,n.bloom); ctx.strokeStyle=col; ctx.lineWidth=5; ctx.beginPath(); ctx.arc(0,0,35,0,Math.PI*2); ctx.stroke(); ctx.globalAlpha=1; }
  if (selected) { ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(-8,-14,3,0,Math.PI*2); ctx.arc(8,-13,3,0,Math.PI*2); ctx.fill(); }
}
function roundRect(x,y,w,h,r,fill){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); fill ? ctx.fill() : ctx.stroke(); }
function drawPulses(w,h) {
  for (const p of state.pulses) {
    const f = Math.min(.999, p.t); const segs = p.path.length - 1; if (segs<=0) continue;
    const seg = Math.min(segs-1, Math.floor(f*segs)); const local = f*segs - seg;
    const a=nodeById(p.path[seg]), b=nodeById(p.path[seg+1]); if(!a||!b) continue;
    const x=sx(a.x,w)+(sx(b.x,w)-sx(a.x,w))*local, y=sy(a.y,h)+(sy(b.y,h)-sy(a.y,h))*local;
    ctx.save(); ctx.shadowColor=COLORS[p.color]; ctx.shadowBlur=26; ctx.fillStyle=COLORS[p.color]; ctx.beginPath(); ctx.arc(x,y,12+Math.sin(performance.now()/80)*3,0,Math.PI*2); ctx.fill(); ctx.restore();
  }
}
function drawBeetles(w,h) {
  for (const b of state.beetles) {
    const a=nodeById(b.edge.a), c=nodeById(b.edge.b); if(!a||!c) continue;
    const x=sx(a.x,w)+(sx(c.x,w)-sx(a.x,w))*b.t, y=sy(a.y,h)+(sy(c.y,h)-sy(a.y,h))*b.t;
    ctx.save(); ctx.translate(x,y); ctx.fillStyle=b.scared?'#bdff94':'#10100d'; ctx.strokeStyle=COLORS.danger; ctx.lineWidth=2; ctx.beginPath(); ctx.ellipse(0,0,11,8,0,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.strokeStyle='#111'; for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(-7,i*4);ctx.lineTo(-17,i*7);ctx.moveTo(7,i*4);ctx.lineTo(17,i*7);ctx.stroke();} ctx.restore();
  }
}
function drawParticles(w,h) { for(const p of state.particles){ ctx.save(); ctx.globalAlpha=Math.max(0,p.life); ctx.fillStyle=COLORS[p.color]||COLORS.gold; ctx.beginPath(); ctx.arc(sx(p.x,w),sy(p.y,h),3+p.life*5,0,Math.PI*2); ctx.fill(); ctx.restore(); } }
function drawFocus(w,h) {
  if (state.focusActive <= 0) return;
  const path = findPathToColor(currentCommission().target[state.progress % currentCommission().target.length]);
  if (path.length>1) { ctx.save(); ctx.strokeStyle='rgba(255,245,130,.92)'; ctx.lineWidth=4; ctx.setLineDash([12,8]); ctx.beginPath(); path.forEach((id,i)=>{ const n=nodeById(id); i?ctx.lineTo(sx(n.x,w),sy(n.y,h)):ctx.moveTo(sx(n.x,w),sy(n.y,h)); }); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
  ctx.save(); ctx.fillStyle='rgba(255,245,130,.9)'; ctx.font='900 16px system-ui'; ctx.fillText('Bloom Focus path preview active', 16, 28); ctx.restore();
}

function resizeCanvasForDpr() {
  const rect = canvas.getBoundingClientRect(); const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.max(320, Math.floor(rect.width * dpr)); canvas.height = Math.max(240, Math.floor(rect.height * dpr));
  ctx.setTransform(dpr,0,0,dpr,0,0); canvas.width = Math.floor(rect.width); canvas.height = Math.floor(rect.height);
}
function pointerToNode(evt) {
  const r=canvas.getBoundingClientRect(), x=(evt.clientX-r.left)/r.width, y=(evt.clientY-r.top)/r.height;
  let best=null, bd=999; for(const n of state.nodes){ const d=Math.hypot(n.x-x,n.y-y); if(d<bd){bd=d; best=n;} }
  if (best && bd < .1) { state.selected=best.id; sound('tap'); setStatus(`Selected node ${best.id + 1}.`); updateUI(); }
}
canvas.addEventListener('pointerdown', (e)=>{ if(state.running && !state.paused) pointerToNode(e); });
canvas.addEventListener('pointermove', (e)=>{ if(e.buttons && state.running && !state.paused) pointerToNode(e); });

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const action = el.dataset.action;
  if (action === 'prevNode') cycleNode(-1);
  if (action === 'nextNode') cycleNode(1);
  if (action === 'rotate') rotateBranch();
  if (action === 'flip') flipFlow();
  if (action === 'pulse') pulseNutrients();
  if (action === 'mist') mistSpores();
  if (action === 'beetle') shooBeetles();
  if (action === 'lock') lockRoute();
  if (action === 'harvest') harvestGlow();
  if (action === 'focus') bloomFocus();
  if (action === 'pause') togglePause(true);
  if (action === 'resume') togglePause(false);
  if (action === 'restart') { resetRun(); startRun(); }
  if (action === 'audio') toggleAudio();
});
$('startButton').addEventListener('click', startRun);
document.addEventListener('keydown', (e)=>{
  if (ui.menu.classList.contains('hidden') === false && (e.key === 'Enter' || e.key === ' ')) startRun();
  if (e.key === 'ArrowLeft' || e.key.toLowerCase()==='a') cycleNode(-1);
  if (e.key === 'ArrowRight' || e.key.toLowerCase()==='d') cycleNode(1);
  if (e.key === 'ArrowUp' || e.key.toLowerCase()==='w') rotateBranch();
  if (e.key.toLowerCase()==='q' || e.key.toLowerCase()==='e' || e.key === ' ') rotateBranch();
  if (e.key.toLowerCase()==='f') flipFlow();
  if (e.key === 'Enter') pulseNutrients();
  if (e.key.toLowerCase()==='m') mistSpores();
  if (e.key.toLowerCase()==='b') shooBeetles();
  if (e.key.toLowerCase()==='l') lockRoute();
  if (e.key.toLowerCase()==='h') harvestGlow();
  if (e.key.toLowerCase()==='g' || e.key === 'Shift') bloomFocus();
  if (e.key.toLowerCase()==='p') togglePause();
  if (e.key.toLowerCase()==='r') { resetRun(); startRun(); }
});

function loop(t) { const dt=Math.min(.05,(t-state.lastT)/1000); state.lastT=t; update(dt); draw(); requestAnimationFrame(loop); }
window.addEventListener('resize', resizeCanvasForDpr);
resetRun(); resizeCanvasForDpr(); requestAnimationFrame(loop);
