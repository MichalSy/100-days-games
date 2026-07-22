import * as THREE from './assets/three.module.min.js';

const $ = (...ids) => ids.map((id) => document.getElementById(id)).find(Boolean) || null;
const stage = $('stage', 'threeStage');
const ui = {
  menu: $('menu', 'menuOverlay'), pause: $('pauseOverlay'), result: $('resultOverlay'), banner: $('harmonyBanner', 'starBanner'),
  score: $('score'), hearts: $('hearts'), skin: $('skin'), contamination: $('contamination'), focus: $('focus', 'focusCharge'), gap: $('gap'),
  commissionName: $('commissionName', 'commissionTitle'), commissionText: $('commissionText'), progressPips: $('progressPips', 'commissionProgress'),
  status: $('status', 'statusHelper'), focusOverlay: $('focusOverlay'), bestMenu: $('bestMenu', 'menuBestScore'), resultTitle: $('resultTitle'), resultText: $('resultText')
};
function setVisible(el, visible) {
  if (!el) return;
  el.hidden = !visible;
  el.classList.toggle('hidden', !visible);
}

const commissions = [
  { name: 'First Gold Hairline', text: 'Align 3 base shards, brush one gold seam, keep lacquer skin under 40%.', needed: 3, brush: 1, clamps: 0, dust: 0, score: 1500 },
  { name: 'Moon Bowl Rim', text: 'Snap 5 rim shards, brush clockwise seams, clamp 2 fragile joints, dust one star seam.', needed: 5, brush: 3, clamps: 2, dust: 1, score: 3400 },
  { name: 'Grand Star Kintsugi', text: 'Repair all 7 shards, brush the Grand Star order, clamp red-risk joints, dust 3 gold seams.', needed: 7, brush: 6, clamps: 3, dust: 3, score: 5400 }
];

const state = {
  running: false, paused: false, ended: false, muted: false, startedAt: 0, lastTime: 0,
  score: 0, hearts: 3, skin: 0, contamination: 0, combo: 1, focus: 0, repairIndex: 0,
  active: 0, yawStep: 0, tiltStep: 0, brushed: 0, clamps: 0, dusted: 0, starMend: false,
  audio: null
};

let scene, camera, renderer, raycaster, pointer, trayGroup, ghostGroup, shardGroup, fxGroup;
let shards = [];

function bestScore() { return Number(localStorage.getItem('day040BestScore') || 0); }
function setBestScore(v) { if (v > bestScore()) localStorage.setItem('day040BestScore', String(v)); }
ui.bestMenu.textContent = `Best score: ${bestScore()}`;

function makeAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) { window.__day040Audio = { ctx: null, enabled: false }; return null; }
  const ctx = new AudioCtx();
  const master = ctx.createGain(); master.gain.value = state.muted ? 0 : 0.045; master.connect(ctx.destination);
  const api = { ctx, master, enabled: true };
  window.__day040Audio = { ctx, enabled: true };
  return api;
}

function tone(freq = 440, dur = 0.08, type = 'sine', gain = 0.7) {
  if (!state.audio || state.muted) return;
  const { ctx, master } = state.audio;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  const osc = ctx.createOscillator(); const amp = ctx.createGain();
  osc.type = type; osc.frequency.value = freq;
  amp.gain.setValueAtTime(0.0001, ctx.currentTime);
  amp.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.connect(amp).connect(master); osc.start(); osc.stop(ctx.currentTime + dur + 0.02);
}
function cue(name) {
  const map = {
    select: [520, .045, 'triangle'], rotate: [240, .07, 'sine'], snap: [820, .12, 'triangle'], bad: [130, .18, 'sawtooth'],
    brush: [360, .16, 'sine'], clamp: [610, .06, 'square'], dust: [1100, .11, 'triangle'], focus: [760, .2, 'sine'], win: [980, .35, 'triangle']
  };
  const [f,d,t] = map[name] || map.select; tone(f,d,t);
}

function init3d() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x100c12, 7, 15);
  camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
  camera.position.set(0, 5.8, 6.8); camera.lookAt(0, 0, 0);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.appendChild(renderer.domElement);
  raycaster = new THREE.Raycaster(); pointer = new THREE.Vector2();

  const hemi = new THREE.HemisphereLight(0xffefd0, 0x182138, 1.6); scene.add(hemi);
  const lamp = new THREE.PointLight(0xffd38b, 2.4, 15); lamp.position.set(2.8, 5.5, 3.2); scene.add(lamp);
  const cool = new THREE.DirectionalLight(0x8bbcff, 0.8); cool.position.set(-3, 4, -2); scene.add(cool);
  trayGroup = new THREE.Group(); ghostGroup = new THREE.Group(); shardGroup = new THREE.Group(); fxGroup = new THREE.Group();
  scene.add(trayGroup, ghostGroup, shardGroup, fxGroup);

  const tray = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.35, 0.16, 96), new THREE.MeshStandardMaterial({ color: 0x211816, roughness: .74, metalness: .12 }));
  tray.scale.z = 0.74; tray.position.y = -0.15; trayGroup.add(tray);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(3.26, 0.035, 12, 120), new THREE.MeshStandardMaterial({ color: 0xffd76a, roughness: .42, metalness: .45, transparent: true, opacity: .55 }));
  rim.scale.z = .58; rim.rotation.x = Math.PI / 2; rim.position.y = .05; ghostGroup.add(rim);
  for (let i=0;i<12;i++) {
    const a = i / 12 * Math.PI * 2;
    const star = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: i%3===0 ? 0x8ee6a7 : 0xffd76a }));
    star.position.set(Math.cos(a)*3.28, .11, Math.sin(a)*1.9); ghostGroup.add(star);
  }
  createShards(); resize();
  window.addEventListener('resize', resize);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
}

function shardShape(i) {
  const shape = new THREE.Shape();
  const r = 0.55 + (i % 3) * 0.08;
  const pts = [];
  for (let k=0;k<7;k++) {
    const a = (k/7)*Math.PI*2 + 0.2 * Math.sin(i+k);
    const rr = r * (0.78 + 0.28 * Math.sin(i*2.1 + k*1.7));
    pts.push([Math.cos(a)*rr, Math.sin(a)*rr*0.7]);
  }
  shape.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(p=>shape.lineTo(p[0], p[1])); shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

function createShards() {
  shardGroup.clear(); fxGroup.clear(); shards = [];
  const targets = [
    [-1.65, -0.85, -.18], [0, -1.05, .05], [1.65, -.85, .25], [-2.2, .38, .42], [-.75, .64, -.36], [.75, .64, .2], [2.2, .38, -.44]
  ];
  for (let i=0;i<7;i++) {
    const geom = shardShape(i);
    const mat = new THREE.MeshStandardMaterial({ color: i%2 ? 0xc87828 : 0xf2ead7, roughness: .48, metalness: .08, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geom, mat);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geom), new THREE.LineBasicMaterial({ color: 0xffd76a, transparent: true, opacity: .82 }));
    const group = new THREE.Group(); group.add(mesh, edge);
    group.position.set(-3.0 + (i%4)*2.0, .26 + i*.015, 2.3 - Math.floor(i/4)*1.0);
    group.rotation.set(-Math.PI/2 + 0.12, 0.35 - i*0.12, i*.32);
    group.userData.index = i;
    shardGroup.add(group);
    shards.push({ group, target: new THREE.Vector3(targets[i][0], .34 + i*.012, targets[i][1]), targetYaw: targets[i][2], pitch: .12, roll: i*.32, snapped:false, brushed:false, clamped:false, dusted:false, gap: 99 });
  }
  selectShard(0);
}

function resize() {
  if (!renderer) return;
  const rect = stage.getBoundingClientRect();
  renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
  camera.aspect = rect.width / Math.max(1, rect.height); camera.updateProjectionMatrix();
}

function resetGame() {
  state.running = true; state.paused = false; state.ended = false; state.startedAt = performance.now(); state.lastTime = state.startedAt;
  Object.assign(state, { score:0, hearts:3, skin:0, contamination:0, combo:1, focus:0, repairIndex:0, active:0, yawStep:0, tiltStep:0, brushed:0, clamps:0, dusted:0, starMend:false });
  setVisible(ui.menu, false); setVisible(ui.pause, false); setVisible(ui.result, false); setVisible(ui.banner, false); setVisible(ui.focusOverlay, false);
  if (!renderer) init3d(); else createShards();
  updateStatus('Select a shard, slide it toward the ghost bowl, then Rotate Yaw / Tilt until Gap turns gold.');
  updateUI(); cue('select');
}

function selectShard(i) {
  state.active = (i + shards.length) % shards.length;
  shards.forEach((s, idx) => {
    const selected = idx === state.active;
    s.group.scale.setScalar(selected ? 1.13 : 1);
    s.group.children[1].material.color.set(selected ? 0x8ee6a7 : 0xffd76a);
  });
  cue('select'); updateUI();
}

function activeShard() { return shards[state.active]; }
function calcGap(s = activeShard()) {
  const dist = s.group.position.distanceTo(s.target);
  const yaw = Math.abs(THREE.MathUtils.euclideanModulo(s.group.rotation.y - s.targetYaw + Math.PI, Math.PI*2) - Math.PI);
  const tilt = Math.abs(s.pitch) + Math.abs(s.roll % .7) * .35;
  s.gap = Math.round(Math.min(99, (dist * 17) + yaw * 22 + tilt * 10));
  return s.gap;
}

function updateUI() {
  ui.score.textContent = state.score.toString();
  ui.hearts.textContent = '♡'.repeat(Math.max(0,state.hearts)) + '·'.repeat(Math.max(0,3-state.hearts));
  ui.skin.textContent = `${Math.round(state.skin)}%`; ui.contamination.textContent = `${Math.round(state.contamination)}%`; ui.focus.textContent = `${Math.round(state.focus)}%`;
  ui.gap.textContent = shards.length ? `${calcGap()}%` : '--';
  const c = commissions[state.repairIndex] || commissions.at(-1);
  ui.commissionName.textContent = c.name; ui.commissionText.textContent = c.text;
  ui.progressPips.innerHTML = '';
  for (let i=0;i<c.needed;i++) { const p=document.createElement('span'); if (shards[i]?.snapped) p.className='done'; ui.progressPips.appendChild(p); }
}

function updateStatus(text) { ui.status.textContent = text; }
function addScore(n) { state.score += Math.round(n * state.combo); state.combo = Math.min(6, state.combo + .2); state.focus = Math.min(100, state.focus + n/45); }
function damage(text) { state.hearts -= 1; state.combo = 1; cue('bad'); updateStatus(text); if (state.hearts <= 0) endGame(false, 'Too many porcelain hearts cracked.'); }

function move(dx, dz) {
  const s = activeShard(); if (!s || s.snapped) return updateStatus('This shard is snapped; choose another shard or brush/clamp it.');
  s.group.position.x = THREE.MathUtils.clamp(s.group.position.x + dx, -3.7, 3.7);
  s.group.position.z = THREE.MathUtils.clamp(s.group.position.z + dz, -2.7, 2.7);
  const gap = calcGap(s); updateStatus(gap < 22 ? 'Gold preview: seam is close enough for a careful Snap Shard.' : `Slide preview: seam gap ${gap}%. Move toward the ghost bowl.`); cue('select'); updateUI();
}
function rotateYaw() { const s=activeShard(); if (!s || s.snapped) return; s.group.rotation.y += .22; updateStatus(`Rotate Yaw changed shard normal. Seam gap now ${calcGap(s)}%.`); cue('rotate'); updateUI(); }
function tilt() { const s=activeShard(); if (!s || s.snapped) return; state.tiltStep=(state.tiltStep+1)%4; const vals=[[.12,0],[-.08,.18],[.06,-.22],[0,.34]][state.tiltStep]; s.pitch=vals[0]; s.roll=vals[1]; s.group.rotation.x=-Math.PI/2+s.pitch; s.group.rotation.z=s.roll; updateStatus(`Tilt Pitch/Roll set. Curvature match gap ${calcGap(s)}%.`); cue('rotate'); updateUI(); }

function snapShard() {
  const s = activeShard(); if (!s || s.snapped) return updateStatus('Already snapped. Brush Lacquer, clamp, dust, or choose another shard.');
  const gap = calcGap(s);
  if (gap <= 30) {
    s.snapped = true; s.group.position.copy(s.target); s.group.rotation.y = s.targetYaw; s.group.rotation.x = -Math.PI/2; s.group.rotation.z = 0;
    s.group.children[0].material.emissive = new THREE.Color(0x2a1700); addScore(gap <= 14 ? 260 : 160); cue('snap');
    updateStatus(gap <= 14 ? 'Clean gold snap: shard edge fits the bowl armature.' : 'Acceptable snap: seam needs careful lacquer brushing.');
    maybeAdvance(); selectNextLoose();
  } else damage(`Bad snap at ${gap}% gap cracked a porcelain heart. Use Star Focus before snapping.`);
  updateUI();
}
function brushLacquer() {
  const s=activeShard(); if (!s?.snapped) return updateStatus('Brush Lacquer works after Snap Shard locks a piece into the bowl.');
  if (s.brushed) return updateStatus('That seam is already lacquered; Dust Gold or choose another shard.');
  s.brushed = true; state.brushed++; addScore(220); cue('brush'); createGoldSeam(s); updateStatus('Smooth brush swish: gold lacquer fills the seam in star order.'); maybeAdvance(); updateUI();
}
function createGoldSeam(s) {
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-.36,.04,-.12), new THREE.Vector3(0,.07,.1), new THREE.Vector3(.36,.04,.18)]);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 18, .025, 8), new THREE.MeshStandardMaterial({ color:0xffd76a, emissive:0x8a4f00, roughness:.25, metalness:.65 }));
  tube.position.copy(s.group.position); tube.rotation.copy(s.group.rotation); fxGroup.add(tube);
}
function placeClamp() { const s=activeShard(); if (!s?.snapped) return updateStatus('Place Clamp after snapping a fragile shard.'); if (s.clamped) return updateStatus('Clamp already stabilizes this seam.'); s.clamped=true; state.clamps++; addScore(170); cue('clamp'); const clamp = new THREE.Mesh(new THREE.TorusGeometry(.36,.025,8,40), new THREE.MeshStandardMaterial({color:0xe6e0ca, roughness:.5})); clamp.position.copy(s.group.position); clamp.position.y += .08; clamp.rotation.x=Math.PI/2; fxGroup.add(clamp); updateStatus('Silk clamp placed: fragile seam risk is protected.'); maybeAdvance(); updateUI(); }
function dustGold() { const s=activeShard(); if (!s?.brushed) return updateStatus('Dust Gold only after a seam is freshly lacquered.'); if (s.dusted) return updateStatus('This seam already sparkles with gold dust.'); s.dusted=true; state.dusted++; state.contamination=Math.max(0,state.contamination-5); addScore(260); cue('dust'); for(let i=0;i<16;i++){ const dot=new THREE.Mesh(new THREE.SphereGeometry(.018,6,6), new THREE.MeshBasicMaterial({color:0xffef99})); dot.position.copy(s.group.position); dot.position.x+=(Math.random()-.5)*.7; dot.position.y+=.16+Math.random()*.25; dot.position.z+=(Math.random()-.5)*.55; fxGroup.add(dot); } updateStatus('Gold dust shimmer: star seam bonus secured.'); maybeAdvance(); updateUI(); }
function warmLamp() { state.skin=Math.min(98,state.skin+4); state.contamination=Math.max(0,state.contamination-6); addScore(45); tone(190,.08,'sine'); updateStatus('Warm Lamp thins lacquer: flow improves, but skin timer rises slightly.'); updateUI(); }
function coolTray() { state.skin=Math.max(0,state.skin-8); state.contamination=Math.min(100,state.contamination+2); tone(420,.05,'triangle'); updateStatus('Cool Tray slows skin formation and bubbles.'); updateUI(); }
function starFocus() { if (state.focus < 45) return updateStatus('Star Focus needs more clean snaps or brushing to charge.'); state.focus = Math.max(0, state.focus - 45); setVisible(ui.focusOverlay, true); setTimeout(()=>{ if(!state.paused) setVisible(ui.focusOverlay, false); }, 3500); cue('focus'); updateStatus(`Star Focus overlays the safest shard: target gap ${calcGap()}%, brush direction, clamp risk, and dust-ready seams.`); updateUI(); }
function selectNextLoose() { const next = shards.findIndex((s,i)=>!s.snapped && i!==state.active); if (next >= 0) selectShard(next); }

function maybeAdvance() {
  const c = commissions[state.repairIndex];
  const snapped = shards.filter(s=>s.snapped).length;
  if (snapped >= c.needed && state.brushed >= c.brush && state.clamps >= c.clamps && state.dusted >= c.dust) {
    addScore(980 + state.repairIndex*180);
    state.repairIndex++;
    state.hearts = Math.min(3, state.hearts + 1);
    if (state.repairIndex >= commissions.length && state.score >= 5400 && !state.starMend) {
      state.starMend = true; setVisible(ui.banner, true); cue('win'); addScore(3000); setTimeout(()=> setVisible(ui.banner, false), 4200); updateStatus('Kohaku Star Mend complete — endless museum repairs are now open.');
    } else if (state.repairIndex < commissions.length) updateStatus(`Repair seal stamped. Next commission: ${commissions[state.repairIndex].name}.`);
  }
}
function endGame(win=false, reason='') { state.ended=true; state.running=false; setBestScore(state.score); ui.resultTitle.textContent = win ? 'Kohaku Star Mend complete' : 'Repair run ended'; ui.resultText.textContent = `${reason} Final score ${state.score}. Best score ${bestScore()}. Clean snaps ${shards.filter(s=>s.snapped).length}, lacquered seams ${state.brushed}, clamps ${state.clamps}, dust stars ${state.dusted}.`; setVisible(ui.result, true); updateUI(); }
function togglePause() { if (!state.running || state.ended) return; state.paused=!state.paused; setVisible(ui.pause, state.paused); updateStatus(state.paused ? 'Paused.' : 'Repair resumed.'); }

function action(name) {
  const aliases = { prevShard:'prev', nextShard:'next', slideUp:'up', slideDown:'down', slideLeft:'left', slideRight:'right', rotateYaw:'yaw' };
  name = aliases[name] || name;
  if (name === 'restart') return resetGame();
  if (name === 'resume') return togglePause();
  if (name === 'pause') return togglePause();
  if (name === 'audio') { state.muted=!state.muted; if(state.audio) state.audio.master.gain.value=state.muted?0:.045; updateStatus(state.muted?'Audio muted; visual cues remain active.':'Audio enabled after user gesture.'); return; }
  if (!state.running || state.paused || state.ended) return updateStatus('Press Start to begin the repair.');
  const step = .32;
  ({ prev:()=>selectShard(state.active-1), next:()=>selectShard(state.active+1), up:()=>move(0,-step), down:()=>move(0,step), left:()=>move(-step,0), right:()=>move(step,0), yaw:rotateYaw, tilt, snap:snapShard, brush:brushLacquer, clamp:placeClamp, dust:dustGold, warm:warmLamp, cool:coolTray, focus:starFocus }[name] || (()=>{}))();
}

document.addEventListener('click', (event) => {
  const actionName = event.target?.dataset?.action;
  if (actionName) action(actionName);
});
$('startButton').addEventListener('click', async () => { state.audio = state.audio || makeAudio(); if (state.audio?.ctx?.state === 'suspended') await state.audio.ctx.resume().catch(()=>{}); resetGame(); });

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const map = { arrowup:'up', w:'up', arrowdown:'down', s:'cool', arrowleft:'left', a:'left', arrowright:'right', d:'dust', q:'yaw', e:'yaw', z:'tilt', x:'tilt', ' ':'snap', enter:'snap', b:'brush', c:'clamp', f:'focus', shift:'focus', p:'pause', r:'restart' };
  if (map[key]) { event.preventDefault(); action(map[key]); }
});

function onPointerDown(event) { pickOrDrag(event, true); }
function onPointerMove(event) { if (event.buttons) pickOrDrag(event, false); }
function pickOrDrag(event, select) {
  if (!state.running || state.paused || state.ended) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  if (select) {
    const hits = raycaster.intersectObjects(shardGroup.children, true);
    const hit = hits.find(h => h.object.parent?.userData?.index !== undefined || h.object.parent?.parent?.userData?.index !== undefined);
    const idx = hit?.object.parent?.userData?.index ?? hit?.object.parent?.parent?.userData?.index;
    if (idx !== undefined) { selectShard(idx); updateStatus(`Selected shard ${idx+1}. Slide, Rotate Yaw, and Tilt before snapping.`); return; }
  }
  const plane = new THREE.Plane(new THREE.Vector3(0,1,0), -.32); const point = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, point);
  const s = activeShard(); if (s && !s.snapped) { s.group.position.x = THREE.MathUtils.clamp(point.x, -3.7, 3.7); s.group.position.z = THREE.MathUtils.clamp(point.z - .18, -2.7, 2.7); updateStatus(`Direct drag: seam gap ${calcGap(s)}%.`); updateUI(); }
}

function animate(now = performance.now()) {
  requestAnimationFrame(animate);
  if (!renderer) return;
  const dt = Math.min(.05, (now - (state.lastTime || now))/1000); state.lastTime = now;
  if (state.running && !state.paused && !state.ended) {
    state.skin = Math.min(100, state.skin + dt * (1.8 + state.repairIndex * .42));
    state.contamination = Math.min(100, state.contamination + dt * (0.32 + Math.max(0,state.brushed-state.dusted)*.08));
    if (state.skin >= 100) endGame(false, 'Lacquer skinned over before the repair was sealed.');
    if (state.contamination >= 100) endGame(false, 'Gold dust contamination spread across the tray.');
    shardGroup.children.forEach((g,i)=>{ if(!shards[i].snapped) g.position.y = .26 + Math.sin(now*.002 + i)*.035; });
    ghostGroup.rotation.y = Math.sin(now*.00055)*.045; fxGroup.children.forEach((o,i)=>{ if(o.geometry?.type === 'SphereGeometry') o.position.y += dt*.12; });
    updateUI();
  }
  renderer.render(scene, camera);
}
animate();
