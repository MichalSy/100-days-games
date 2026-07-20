import * as THREE from './assets/three.module.min.js';

const DAY = '038';
const STORAGE = 'day038-yatai-okonomiyaki';
const canvas = document.getElementById('gameCanvas');
const stageWrap = document.getElementById('stageWrap');
const ui = {
  menu: document.getElementById('menu'), start: document.getElementById('startBtn'), menuBest: document.getElementById('menuBest'), menuTime: document.getElementById('menuTime'),
  score: document.getElementById('score'), best: document.getElementById('best'), hearts: document.getElementById('hearts'), smoke: document.getElementById('smoke'), combo: document.getElementById('combo'), selectedCake: document.getElementById('selectedCake'), tiltState: document.getElementById('tiltState'), focusCharge: document.getElementById('focusCharge'), time: document.getElementById('time'),
  ticketTitle: document.getElementById('ticketTitle'), ticketText: document.getElementById('ticketText'), patienceLabel: document.getElementById('patienceLabel'), patience: document.getElementById('patience'), ticketProgress: document.getElementById('ticketProgress'), progress: document.getElementById('progress'), helperLine: document.getElementById('helperLine'),
  pauseOverlay: document.getElementById('pauseOverlay'), resultOverlay: document.getElementById('resultOverlay'), results: document.getElementById('results'), banner: document.getElementById('grandBanner'), muteBtn: document.getElementById('muteBtn'), ghost: document.getElementById('spatulaGhost')
};

const orders = [
  { name: 'First Sizzle', need: 1, cakes: 1, text: 'Plain cabbage cake — golden both sides, sauce + mayo, plate before patience drops.', toppings: ['sauce','mayo'], smokeTarget: 65, patience: 110, minCook: .62, maxCook: 1.05 },
  { name: 'Lantern Sauce Rush', need: 2, cakes: 2, text: 'Serve pork and shrimp cakes — golden sides, sauce + mayo, topping set, smoke under 58%.', toppings: ['sauce','mayo','pork','shrimp'], smokeTarget: 58, patience: 120, minCook: .70, maxCook: 1.08 },
  { name: 'Grand Matsuri Stack', need: 3, cakes: 3, text: 'Three festival cakes — pork, shrimp, aonori, ginger, bonito; use Chef Focus and keep smoke under 60%.', toppings: ['sauce','mayo','pork','shrimp','aonori','ginger','bonito'], smokeTarget: 60, patience: 135, minCook: .74, maxCook: 1.10 }
];
const tilts = [
  { name: 'Level', x: 0, z: 0 },
  { name: 'Left Lean', x: -1, z: 0 },
  { name: 'Right Lean', x: 1, z: 0 },
  { name: 'Forward Lean', x: 0, z: -1 },
  { name: 'Back Lean', x: 0, z: 1 }
];
const heatZones = [
  { name: 'Cool Prep', x: -2.25, color: 0x4ea7ff, heat: .32 },
  { name: 'Golden Cook', x: 0, color: 0xffc65f, heat: .72 },
  { name: 'Hot Sear', x: 2.25, color: 0xff563f, heat: 1.08 }
];

let renderer, scene, camera, raycaster, pointerPlane, griddle, plate, focusLines = [];
let running = false, paused = false, gameOver = false, grand = false;
let cakes = [], selected = 0, orderIndex = 0, ticketDone = 0, score = 0, combo = 1, hearts = 3, smoke = 0, focus = 45, elapsed = 0, patience = 100, tiltIndex = 0, burned = 0, falls = 0, perfectFlips = 0, saucePerfect = 0;
let audio = { ctx: null, enabled: false, muted: false, master: null, sizzle: null };
let best = JSON.parse(localStorage.getItem(STORAGE) || '{}');
ui.menuBest.textContent = best.score || 0; ui.menuTime.textContent = best.grandTime ? fmtTime(best.grandTime) : '—'; ui.best.textContent = best.score || 0;

function fmtTime(seconds) { const s = Math.max(0, Math.floor(seconds)); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function lerp(a,b,t){ return a + (b-a)*t; }
function laneHeat(x) { let best = heatZones[0], d = Infinity; for (const z of heatZones) { const dd = Math.abs(x-z.x); if (dd<d){d=dd; best=z;} } return best.heat; }
function cookColor(v) {
  if (v < .35) return new THREE.Color(0xf0d66a);
  if (v < .68) return new THREE.Color(0xdba24a);
  if (v < 1.03) return new THREE.Color(0xb65b20);
  return new THREE.Color(0x1e0d08).lerp(new THREE.Color(0xff3b1f), Math.min(.35, (v-1.03)*.6));
}

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
  camera.position.set(0, 5.2, 7.2);
  camera.lookAt(0, 0, .35);
  raycaster = new THREE.Raycaster();
  pointerPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  scene.add(new THREE.HemisphereLight(0xffe6b0, 0x220a04, 1.8));
  const lantern = new THREE.PointLight(0xff9b38, 2.7, 18); lantern.position.set(0, 5, 4); scene.add(lantern);
  const rim = new THREE.PointLight(0x6bd7ff, 1.2, 13); rim.position.set(0, 3, -5); scene.add(rim);

  const griddleGeo = new THREE.BoxGeometry(6.9, .18, 5.2);
  const griddleMat = new THREE.MeshStandardMaterial({ color: 0x151311, roughness: .78, metalness: .55 });
  griddle = new THREE.Mesh(griddleGeo, griddleMat); griddle.position.y = -.08; scene.add(griddle);
  const edge = new THREE.Mesh(new THREE.BoxGeometry(7.2,.22,.18), new THREE.MeshStandardMaterial({color:0x7a4a22, roughness:.45, metalness:.2}));
  for (const z of [-2.7,2.7]) { const e = edge.clone(); e.position.set(0,.08,z); scene.add(e); }
  const sideEdge = new THREE.Mesh(new THREE.BoxGeometry(.18,.22,5.5), edge.material);
  for (const x of [-3.65,3.65]) { const e = sideEdge.clone(); e.position.set(x,.08,0); scene.add(e); }
  for (const zone of heatZones) {
    const lane = new THREE.Mesh(new THREE.BoxGeometry(2.04,.026,4.95), new THREE.MeshBasicMaterial({color: zone.color, transparent:true, opacity:.16}));
    lane.position.set(zone.x,.035,0); scene.add(lane);
  }
  plate = new THREE.Mesh(new THREE.CylinderGeometry(.68,.72,.08,64), new THREE.MeshStandardMaterial({ color: 0xfff2c2, roughness:.45, metalness:.05 }));
  plate.rotation.x = Math.PI/2; plate.position.set(0,.12,2.35); scene.add(plate);
  resize();
}

function makeCake(i, x, z) {
  const group = new THREE.Group(); group.position.set(x, .18, z); group.userData.index = i;
  const side = new THREE.Mesh(new THREE.CylinderGeometry(.46,.5,.18,48), new THREE.MeshStandardMaterial({ color: 0xd9a047, roughness:.72 }));
  side.rotation.x = Math.PI/2; group.add(side);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(.475,.475,.032,48), new THREE.MeshStandardMaterial({ color: 0xe0bd57, roughness:.58 }));
  top.rotation.x = Math.PI/2; top.position.y = .105; group.add(top);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.55,.028,8,80), new THREE.MeshBasicMaterial({ color: 0xffe074 }));
  ring.rotation.x = Math.PI/2; ring.position.y = .13; group.add(ring);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(.55,48), new THREE.MeshBasicMaterial({ color: 0x000000, transparent:true, opacity:.24 }));
  shadow.rotation.x = -Math.PI/2; shadow.position.y = -.02; group.add(shadow);
  scene.add(group);
  return { group, top, side, ring, shadow, x, z, vx:0, vz:0, topCook:0, bottomCook:0, topUp:true, sauced:false, mayo:false, toppings:new Set(), flipping:0, flipStart:0, plated:false, burned:false, fallen:false, perfect:false };
}

function resetGame() {
  for (const c of cakes) scene.remove(c.group);
  for (const line of focusLines) scene.remove(line);
  focusLines = [];
  cakes = [];
  selected = 0; orderIndex = 0; ticketDone = 0; score = 0; combo = 1; hearts = 3; smoke = 0; focus = 45; elapsed = 0; tiltIndex = 0; burned = 0; falls = 0; perfectFlips = 0; saucePerfect = 0; grand = false; gameOver = false; paused = false;
  spawnForOrder();
  hide(ui.resultOverlay); hide(ui.pauseOverlay); hide(ui.banner);
  updateUI('Slide the first cake into Golden Cook, then flip in the golden window.');
}
function spawnForOrder() {
  for (const c of cakes) scene.remove(c.group);
  cakes = [];
  const order = orders[Math.min(orderIndex, orders.length-1)];
  patience = order.patience;
  for (let i=0; i<order.cakes; i++) cakes.push(makeCake(i, -1.8 + i*1.2, -1.2 + (i%2)*.62));
  selected = 0; ticketDone = 0;
  updateUI(`Ticket ${order.name}: cook ${order.need} cake${order.need>1?'s':''}.`);
}

function beginAudio() {
  if (audio.ctx) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audio.ctx = new Ctx();
    audio.master = audio.ctx.createGain(); audio.master.gain.value = audio.muted ? 0 : .18; audio.master.connect(audio.ctx.destination);
    const osc = audio.ctx.createOscillator(); const gain = audio.ctx.createGain();
    osc.type = 'sawtooth'; osc.frequency.value = 72; gain.gain.value = .012; osc.connect(gain).connect(audio.master); osc.start();
    audio.sizzle = { osc, gain }; audio.enabled = true;
    window.__day038Audio = { ctx: audio.ctx, enabled: true };
  } catch (err) { window.__day038Audio = { ctx: null, enabled: false }; }
}
function beep(freq=440, dur=.08, type='sine', gain=.22) {
  if (!audio.ctx || audio.muted) return;
  const now = audio.ctx.currentTime;
  const o = audio.ctx.createOscillator(); const g = audio.ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, now); o.frequency.exponentialRampToValueAtTime(Math.max(60, freq*.62), now+dur);
  g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(gain, now+.012); g.gain.exponentialRampToValueAtTime(0.0001, now+dur);
  o.connect(g).connect(audio.master); o.start(now); o.stop(now+dur+.03);
}
function setMuted(next) { audio.muted = next ?? !audio.muted; if (audio.master) audio.master.gain.value = audio.muted ? 0 : .18; ui.muteBtn.textContent = `Audio: ${audio.muted ? 'Muted' : 'On'}`; }

function action(name) {
  if (name === 'resume') { paused = false; hide(ui.pauseOverlay); updateUI('Back to the griddle.'); return; }
  if (name === 'restart') { resetGame(); running = true; hide(ui.menu); return; }
  if (name === 'pause') { if (!running || gameOver) return; paused = true; show(ui.pauseOverlay); return; }
  if (name === 'mute') { setMuted(); return; }
  if (!running || paused || gameOver) return;
  const c = cakes[selected];
  if (!c || c.plated || c.fallen) return;
  if (name === 'prevCake') { selected = (selected + cakes.length - 1) % cakes.length; updateUI('Selected previous cake.'); beep(220,.05,'square'); }
  if (name === 'nextCake') { selected = (selected + 1) % cakes.length; updateUI('Selected next cake.'); beep(250,.05,'square'); }
  if (name === 'slideUp') slide(c, 0, -.32);
  if (name === 'slideDown') slide(c, 0, .32);
  if (name === 'slideLeft') slide(c, -.32, 0);
  if (name === 'slideRight') slide(c, .32, 0);
  if (name === 'tilt') { tiltIndex = (tiltIndex + 1) % tilts.length; updateUI(`Tilt Griddle: ${tilts[tiltIndex].name}; cakes drift ${tilts[tiltIndex].name === 'Level' ? 'calmly' : 'with the lean'}.`); beep(160,.08,'triangle'); }
  if (name === 'flip') flip(c);
  if (name === 'sauce') finish(c, 'sauce');
  if (name === 'mayo') finish(c, 'mayo');
  if (name === 'topping') cycleTopping(c);
  if (name === 'plate') plateCake(c);
  if (name === 'fan') { smoke = clamp(smoke - 17, 0, 100); focus = clamp(focus + 3, 0, 100); updateUI('Fan Steam clears smoke and briefly reveals underside color.'); showFocusPreview(900); beep(320,.12,'sine'); }
  if (name === 'focus') chefFocus();
  updateUI();
}
function slide(c, dx, dz) { c.vx += dx*1.35; c.vz += dz*1.35; updateUI('Spatula slide: steer cakes between Cool Prep, Golden Cook, and Hot Sear.'); beep(180,.04,'square',.12); }
function flip(c) {
  if (c.flipping) return;
  const underside = c.topUp ? c.bottomCook : c.topCook;
  const order = orders[Math.min(orderIndex, orders.length-1)];
  const perfect = underside >= order.minCook && underside <= order.maxCook;
  c.flipping = .72; c.flipStart = performance.now()/1000; c.perfect = c.perfect || perfect;
  c.topUp = !c.topUp;
  if (perfect) { score += Math.floor(230*combo); combo = Math.min(9.9, combo+.25); focus = clamp(focus+18,0,100); perfectFlips++; updateUI('Perfect Flip Cake: golden underside, combo up.'); beep(720,.16,'triangle'); }
  else { smoke = clamp(smoke+8,0,100); combo = 1; updateUI(underside < order.minCook ? 'Early Flip: still raw; use Golden Cook longer.' : 'Late Flip: burned edge smoke spike.'); beep(130,.18,'sawtooth'); }
}
function finish(c, kind) {
  const visibleCook = c.topUp ? c.topCook : c.bottomCook;
  if (visibleCook < .52) { updateUI('Finish after more cooking; toppings slide on raw batter.'); combo = 1; beep(110,.11,'sawtooth'); return; }
  if (kind === 'sauce') { c.sauced = true; addStripe(c, 0x7b2112, 'sauce'); score += Math.floor(170*combo); saucePerfect++; updateUI('Sauce Brush adds glossy coverage.'); beep(360,.1,'sine'); }
  if (kind === 'mayo') { c.mayo = true; addStripe(c, 0xfff0bd, 'mayo'); score += Math.floor(120*combo); updateUI('Mayo Ribbon complete.'); beep(520,.08,'sine'); }
}
function cycleTopping(c) {
  const order = orders[Math.min(orderIndex, orders.length-1)];
  const options = ['pork','shrimp','aonori','ginger','bonito'];
  const next = options.find(t => !c.toppings.has(t) && order.toppings.includes(t)) || options.find(t => !c.toppings.has(t)) || 'bonito';
  c.toppings.add(next); addTopping(c, next); score += Math.floor(185*combo); focus = clamp(focus+6,0,100); updateUI(`Toppings: added ${next}.`); beep(620,.09,'triangle');
}
function plateCake(c) {
  const order = orders[Math.min(orderIndex, orders.length-1)];
  const a = c.topCook, b = c.bottomCook;
  const cooked = a >= order.minCook && a <= order.maxCook && b >= order.minCook && b <= order.maxCook;
  const needed = order.toppings.every(t => (t === 'sauce' ? c.sauced : t === 'mayo' ? c.mayo : c.toppings.has(t)));
  if (!cooked || !needed) {
    combo = 1; patience = clamp(patience-22,0,order.patience); smoke = clamp(smoke+5,0,100);
    updateUI(!cooked ? 'Plate blocked: both sides must be golden, not raw/burned.' : 'Plate blocked: finish the requested sauce/mayo/topping checklist.'); beep(120,.16,'sawtooth'); return;
  }
  c.plated = true; c.group.position.set(1.2 - ticketDone*.55, .22, 2.35); c.group.scale.setScalar(.75); ticketDone++;
  score += Math.floor(980*combo + (smoke < order.smokeTarget ? 720 : 0)); combo = Math.min(9.9, combo+.35); focus = clamp(focus+12,0,100); patience = clamp(patience+16,0,order.patience);
  updateUI('Plate Order accepted: ticket seal stamped.'); beep(880,.18,'triangle');
  if (ticketDone >= order.need) completeTicket();
}
function chefFocus() {
  if (focus < 100) { updateUI('Chef Focus is still charging; perfect flips and clean toppings charge it.'); return; }
  focus = 0; showFocusPreview(4200); smoke = clamp(smoke-8,0,100); updateUI('Chef Focus: heat lanes, underside rings, and plate-match cues are visible.'); beep(940,.26,'sine');
}
function completeTicket() {
  score += 520 + orderIndex*260;
  orderIndex++;
  if (hearts < 3) hearts++;
  if (orderIndex >= orders.length && score >= 5200 && !grand) {
    grand = true; best.grandTime = best.grandTime ? Math.min(best.grandTime, elapsed) : elapsed; show(ui.banner); setTimeout(()=>hide(ui.banner), 3600); updateUI('Yatai Grand Service! Endless tickets now continue.'); beep(1040,.35,'triangle');
  }
  if (orderIndex >= orders.length) {
    // Endless: reuse Grand Matsuri with hotter pace.
    orderIndex = orders.length - 1;
  }
  spawnForOrder();
}
function loseHeart(reason) {
  hearts--; combo = 1; updateUI(reason); beep(92,.22,'sawtooth');
  if (hearts <= 0) endGame(reason);
}
function endGame(reason) {
  gameOver = true; running = false;
  best.score = Math.max(best.score || 0, score);
  localStorage.setItem(STORAGE, JSON.stringify(best));
  ui.results.innerHTML = `<p><b>${reason}</b></p><p>Final score ${score}. Perfect flips ${perfectFlips}, burned/fallen cakes ${burned+falls}, sauce-perfect actions ${saucePerfect}, smoke ${Math.round(smoke)}%.</p><p>${grand ? 'Yatai Grand Service reached.' : 'Grand Service not reached yet.'}</p>`;
  show(ui.resultOverlay); updateUI(reason);
}

function addStripe(c, color, label) {
  const mat = new THREE.MeshBasicMaterial({ color, transparent:true, opacity:.92 });
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(.72,.018,.055), mat);
  stripe.position.set(0,.15 + Math.random()*0.006, label==='mayo' ? .08 : -.08); stripe.rotation.y = label==='mayo' ? -.36 : .34; c.group.add(stripe);
}
function addTopping(c, type) {
  const colors = { pork:0xff8975, shrimp:0xffb36e, aonori:0x42b849, ginger:0xff4e47, bonito:0xf0b36a };
  for (let i=0;i<5;i++) {
    const bit = new THREE.Mesh(new THREE.CylinderGeometry(.035,.04,.018,8), new THREE.MeshBasicMaterial({color: colors[type] || 0xffffff}));
    bit.rotation.x = Math.PI/2; bit.position.set((Math.random()-.5)*.55, .175+i*.001, (Math.random()-.5)*.55); c.group.add(bit);
  }
}
function showFocusPreview(ms=1400) {
  for (const line of focusLines) scene.remove(line); focusLines = [];
  const mat = new THREE.LineBasicMaterial({ color: 0x61d5ff, transparent:true, opacity:.9 });
  for (const zone of heatZones) {
    const pts = [new THREE.Vector3(zone.x,-.01,-2.3), new THREE.Vector3(zone.x,.04,2.1)];
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat); scene.add(line); focusLines.push(line);
  }
  setTimeout(() => { for (const line of focusLines) scene.remove(line); focusLines = []; }, ms);
}

function update(dt) {
  if (!running || paused || gameOver) return;
  const slow = focusLines.length ? .42 : 1;
  elapsed += dt*slow;
  const order = orders[Math.min(orderIndex, orders.length-1)];
  patience -= dt * (grand ? 8.5 : 6.2) * slow;
  if (patience <= 0) { loseHeart('Ticket patience hit zero; the lantern line groans.'); patience = order.patience; }
  const tilt = tilts[tiltIndex];
  let activeSmoke = 0;
  cakes.forEach((c, idx) => {
    if (c.plated || c.fallen) return;
    c.vx += tilt.x * dt * .22; c.vz += tilt.z * dt * .22;
    c.vx *= Math.pow(.2, dt); c.vz *= Math.pow(.2, dt);
    c.x = clamp(c.x + c.vx*dt, -3.05, 3.05); c.z = clamp(c.z + c.vz*dt, -2.1, 2.1);
    c.group.position.x = c.x; c.group.position.z = c.z;
    const heat = laneHeat(c.x) * (1 + (grand ? .10 : 0));
    const cookRate = dt * heat * .13 * slow;
    if (c.topUp) c.bottomCook += cookRate; else c.topCook += cookRate;
    const downCook = c.topUp ? c.bottomCook : c.topCook;
    if (downCook > .98) activeSmoke += (downCook-.98)*dt*9;
    if (!c.burned && (c.topCook > 1.24 || c.bottomCook > 1.24)) { c.burned = true; burned++; smoke = clamp(smoke+18,0,100); loseHeart('Burned cake: Fan Steam or move to Cool Prep sooner.'); }
    if (Math.abs(c.x) > 2.96 && Math.abs(c.vx) > .7) { c.fallen = true; falls++; c.group.visible = false; loseHeart('A cake slid off the griddle edge. Use Tilt gently.'); }
    const shownCook = c.topUp ? c.topCook : c.bottomCook;
    c.top.material.color.copy(cookColor(shownCook));
    c.side.material.color.copy(cookColor(Math.max(c.topCook,c.bottomCook)*.85));
    const selectedGlow = idx === selected ? 1 : .45;
    c.ring.material.color.set((downCook > order.minCook && downCook < order.maxCook) ? 0x8be28f : downCook > order.maxCook ? 0xff685f : 0xffd25f);
    c.ring.material.opacity = selectedGlow;
    c.ring.scale.setScalar(idx === selected ? 1.12 + Math.sin(performance.now()/150)*.025 : 1);
    if (c.flipping > 0) { c.flipping -= dt; const t = 1 - c.flipping/.72; c.group.position.y = .18 + Math.sin(t*Math.PI)*1.1; c.group.rotation.z = t*Math.PI*2; if (c.flipping <= 0) { c.group.position.y=.18; c.group.rotation.z=0; } }
  });
  smoke = clamp(smoke + activeSmoke - dt*1.1, 0, 100);
  if (smoke >= 100) { loseHeart('Smoke redlined the yatai; Fan Steam before it hits 100%.'); smoke = 62; }
}
function draw() { renderer.render(scene, camera); }
function tick(last=performance.now()) {
  const now = performance.now(); const dt = Math.min(.045, (now-last)/1000);
  update(dt); updateUI(); draw(); requestAnimationFrame(() => tick(now));
}

let lastHelper = '';
function updateUI(message) {
  if (message) lastHelper = message;
  const order = orders[Math.min(orderIndex, orders.length-1)];
  ui.score.textContent = Math.floor(score); ui.best.textContent = best.score || 0; ui.hearts.textContent = '♥'.repeat(Math.max(0,hearts)) + '♡'.repeat(Math.max(0,3-hearts)); ui.smoke.textContent = `${Math.round(smoke)}%`; ui.combo.textContent = `${combo.toFixed(1)}x`; ui.selectedCake.textContent = `${Math.min(selected+1,cakes.length)}/${cakes.length || 1}`; ui.tiltState.textContent = tilts[tiltIndex].name; ui.focusCharge.textContent = `${Math.round(focus)}%`; ui.time.textContent = fmtTime(elapsed);
  ui.ticketTitle.textContent = `${order.name} ${ticketDone}/${order.need}`; ui.ticketText.textContent = order.text; ui.patience.max = order.patience; ui.patience.value = patience; ui.patienceLabel.textContent = `${Math.round(patience/order.patience*100)}%`; ui.progress.max = order.need; ui.progress.value = ticketDone; ui.ticketProgress.textContent = `${ticketDone}/${order.need}`;
  ui.helperLine.textContent = lastHelper || 'Cook both sides golden, finish toppings, and plate exact tickets.';
  document.querySelectorAll('[data-action="tilt"]').forEach(b => b.textContent = `Tilt Griddle: ${tilts[tiltIndex].name}`);
  document.querySelectorAll('[data-action="focus"]').forEach(b => { b.disabled = focus < 100; b.textContent = focus >= 100 ? 'Chef Focus' : `Chef Focus ${Math.round(focus)}%`; });
}
function show(el){ el.classList.remove('hidden'); }
function hide(el){ el.classList.add('hidden'); }

function resize() {
  if (!renderer) return;
  const box = stageWrap.getBoundingClientRect();
  const w = Math.max(320, Math.floor(box.width)); const h = Math.max(260, Math.floor(box.height));
  renderer.setSize(w,h,false); camera.aspect = w/h; camera.updateProjectionMatrix();
}
function pointerToStage(e) {
  const rect = canvas.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  raycaster.setFromCamera({x,y}, camera);
  const hit = new THREE.Vector3(); raycaster.ray.intersectPlane(pointerPlane, hit);
  return hit;
}
function selectFromPointer(e) {
  const rect = canvas.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  raycaster.setFromCamera({x,y}, camera);
  const hits = raycaster.intersectObjects(cakes.map(c=>c.group), true);
  if (hits.length) {
    let g = hits[0].object; while (g.parent && !Number.isInteger(g.userData.index)) g = g.parent;
    if (Number.isInteger(g.userData.index)) selected = g.userData.index;
  }
}
let dragging = false;
canvas.addEventListener('pointerdown', e => { if (!running || paused) return; canvas.setPointerCapture(e.pointerId); selectFromPointer(e); dragging = true; const p=pointerToStage(e); ui.ghost.style.display='block'; ui.ghost.style.left=`${e.clientX-canvas.getBoundingClientRect().left}px`; ui.ghost.style.top=`${e.clientY-canvas.getBoundingClientRect().top-28}px`; updateUI('Drag the spatula ghost to slide the selected cake.'); });
canvas.addEventListener('pointermove', e => { if (!dragging || !running || paused) return; const c = cakes[selected]; if (!c) return; const p = pointerToStage(e); c.vx += clamp(p.x - c.x, -1, 1) * .18; c.vz += clamp(p.z - c.z, -1, 1) * .18; ui.ghost.style.left=`${e.clientX-canvas.getBoundingClientRect().left}px`; ui.ghost.style.top=`${e.clientY-canvas.getBoundingClientRect().top-28}px`; });
canvas.addEventListener('pointerup', () => { dragging = false; ui.ghost.style.display='none'; });
window.addEventListener('resize', resize);
document.addEventListener('click', e => { const target = e.target.closest('[data-action]'); if (target) action(target.dataset.action); });
ui.start.addEventListener('click', async () => { beginAudio(); if (audio.ctx?.state === 'suspended') await audio.ctx.resume(); window.__day038Audio = { ctx: audio.ctx, enabled: !!audio.enabled }; hide(ui.menu); resetGame(); running = true; beep(540,.14,'triangle'); updateUI('Welcome to the yatai. Slide, flip, sauce, and plate the first cake.'); });
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'p') action('pause');
  if (e.key.toLowerCase() === 'r') action('restart');
  if (!running || paused) return;
  const k = e.key.toLowerCase();
  if (k === 'arrowleft' || k === 'a') action('slideLeft');
  if (k === 'arrowright' || k === 'd') action('slideRight');
  if (k === 'arrowup' || k === 'w') action('slideUp');
  if (k === 'arrowdown' || k === 's') action(k === 's' ? 'sauce' : 'slideDown');
  if (k === 'q' || k === 'e') action('tilt');
  if (k === ' ' || k === 'enter') action('flip');
  if (k === 'm') action('mayo');
  if (k === 't') action('topping');
  if (k === 'f') action('fan');
  if (k === 'c' || k === 'shift') action('focus');
});

initThree(); resetGame(); running = false; show(ui.menu); tick();
