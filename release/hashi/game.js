const $ = (id) => document.getElementById(id);
const canvas = $('gameCanvas');
const ctx = canvas.getContext('2d');
const bg = new Image(); bg.src = './assets/hashi-river-site.png';
const helper = $('helperMascot');

const STORAGE = 'day035-hashi-best-v1';
const GRAND = 'day035-hashi-grand-v1';
const contracts = [
  { name: 'First Creek Span', span: '8m', beamLimit: 6, ropeGoal: 1, pierGoal: 0, crates: 1, stressTarget: 72, budgetTarget: 84, scoreGate: 900 },
  { name: 'Red Gorge Lantern Run', span: '13m', beamLimit: 8, ropeGoal: 2, pierGoal: 1, crates: 2, stressTarget: 74, budgetTarget: 92, scoreGate: 2550 },
  { name: 'Moon Shrine Load Test', span: '17m', beamLimit: 9, ropeGoal: 3, pierGoal: 1, crates: 3, stressTarget: 75, budgetTarget: 96, scoreGate: 4900 }
];

let audioCtx = null;
let muted = false;
let best = Number(localStorage.getItem(STORAGE) || 0);
let bestGrand = localStorage.getItem(GRAND) || '—';
let running = false;
let paused = false;
let gameOver = false;
let contractIndex = 0;
let score = 0;
let combo = 1;
let hearts = 3;
let budget = 0;
let focus = 28;
let maxStress = 0;
let elapsed = 0;
let last = performance.now();
let material = 'bamboo';
let selectedA = 0;
let selectedB = 1;
let clickPhase = 0;
let test = null;
let focusUntil = 0;
let grandShown = false;
let recent = [];
let warning = 'Choose two deck or bank nodes, then place bamboo to start a triangle.';

const nodes = [
  { x: .08, y: .67, row: 0, bank: true }, { x: .16, y: .56, row: 1, bank: true }, { x: .16, y: .78, row: 2, bank: true },
  { x: .28, y: .62, row: 1 }, { x: .28, y: .80, row: 2 }, { x: .40, y: .57, row: 1 }, { x: .40, y: .78, row: 2 },
  { x: .52, y: .61, row: 1 }, { x: .52, y: .80, row: 2 }, { x: .64, y: .58, row: 1 }, { x: .64, y: .78, row: 2 },
  { x: .78, y: .55, row: 1, bank: true }, { x: .78, y: .76, row: 2, bank: true }, { x: .91, y: .66, row: 0, bank: true },
  { x: .35, y: .88, row: 3, pier: true }, { x: .58, y: .88, row: 3, pier: true }
];
let edges = [];
let piers = [];

function resetRun() {
  running = true; paused = false; gameOver = false; contractIndex = 0; score = 0; combo = 1; hearts = 3; budget = 0; focus = 28; maxStress = 0; elapsed = 0; material = 'bamboo'; selectedA = 0; selectedB = 1; clickPhase = 0; test = null; focusUntil = 0; grandShown = false; edges = []; piers = []; recent = []; warning = 'Start with two bamboo triangles from the banks, then test the crossing.'; last = performance.now();
  $('menu').classList.add('hidden'); $('resultOverlay').classList.add('hidden'); $('pauseOverlay').classList.add('hidden'); $('grandBanner').classList.add('hidden');
  startAudio(); pulse('tick'); updateUi(); requestAnimationFrame(loop);
}

function startAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}
function pulse(kind) {
  if (muted || !audioCtx) return;
  const now = audioCtx.currentTime;
  const gain = audioCtx.createGain();
  const osc = audioCtx.createOscillator();
  const map = { tick: [520, .035, 'sine'], bamboo: [210, .08, 'triangle'], rope: [380, .09, 'sawtooth'], pier: [120, .12, 'triangle'], stress: [90, .18, 'sawtooth'], repair: [680, .06, 'square'], focus: [840, .18, 'sine'], win: [520, .35, 'triangle'] }[kind] || [300, .08, 'sine'];
  osc.type = map[2]; osc.frequency.setValueAtTime(map[0], now); osc.frequency.exponentialRampToValueAtTime(map[0] * 1.6, now + map[1]);
  gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(kind === 'stress' ? 0.075 : 0.045, now + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, now + map[1]);
  osc.connect(gain).connect(audioCtx.destination); osc.start(now); osc.stop(now + map[1] + .02);
}

function nodePx(i) { const n = nodes[i]; return { x: n.x * canvas.width, y: n.y * canvas.height }; }
function distNodes(a, b) { const A = nodePx(a), B = nodePx(b); return Math.hypot(A.x - B.x, A.y - B.y) / canvas.width; }
function edgeKey(a,b) { return [Math.min(a,b), Math.max(a,b)].join('-'); }
function hasEdge(a,b) { const k = edgeKey(a,b); return edges.some(e => edgeKey(e.a,e.b) === k); }
function connectedAcross() {
  const graph = new Map(nodes.map((_, i) => [i, []]));
  for (const e of edges) { graph.get(e.a).push(e.b); graph.get(e.b).push(e.a); }
  for (const p of piers) { for (let i = 0; i < nodes.length; i++) if (i !== p && distNodes(i,p) < .16) { graph.get(p).push(i); graph.get(i).push(p); } }
  const q = [0,1,2], seen = new Set(q);
  while (q.length) { const n = q.shift(); if ([11,12,13].includes(n)) return true; for (const m of graph.get(n)) if (!seen.has(m)) { seen.add(m); q.push(m); } }
  return false;
}
function triangleBonus(edge) {
  let bonus = 0;
  for (let i = 0; i < nodes.length; i++) if (i !== edge.a && i !== edge.b && hasEdge(edge.a, i) && hasEdge(edge.b, i)) bonus += 1;
  return bonus;
}
function calcStress(t = 0) {
  const current = currentStrength();
  const deckContinuity = connectedAcross() ? -15 : 20;
  const contract = contracts[contractIndex];
  const load = test ? (contract.crates * 9 + 8 + Math.sin(test.progress * Math.PI) * 9) : 0;
  let total = Math.max(0, budget * .22 + current * .32 + load + deckContinuity);
  for (const e of edges) {
    const len = distNodes(e.a, e.b);
    const tri = triangleBonus(e);
    let s = len * 112 + current * (e.type === 'rope' ? .28 : .18) + load * .23 - tri * 18;
    if (e.type === 'rope') s += len > .24 ? 18 : -10;
    if (e.type === 'bamboo' && Math.abs(nodes[e.a].y - nodes[e.b].y) < .045 && len > .18) s += 22;
    if (piers.includes(e.a) || piers.includes(e.b)) s -= 14;
    e.stress = Math.max(4, Math.min(100, s + Math.sin(t * 2 + e.a) * 4));
    total = Math.max(total, e.stress);
  }
  for (const p of piers) total = Math.max(total, 22 + current * .5 - 12);
  maxStress = Math.max(maxStress, Math.round(total));
  return Math.round(Math.min(100, total));
}
function currentStrength() { return Math.round(18 + contractIndex * 10 + Math.sin(elapsed * 1.4) * (8 + contractIndex * 4)); }
function clampSelection() { if (selectedA === selectedB) selectedB = (selectedB + 1) % nodes.length; }

function place(type) {
  if (!running || gameOver) return;
  startAudio(); material = type;
  const contract = contracts[contractIndex];
  if (type === 'pier') {
    const p = selectedB;
    if (!nodes[p].pier && nodes[p].row !== 2) { warning = 'Stone piers must sit in lower stream sockets.'; pulse('stress'); return updateUi(); }
    if (piers.includes(p)) { warning = 'That stone pier is already planted.'; return updateUi(); }
    piers.push(p); budget += 13; score += Math.round(160 * combo); focus = Math.min(100, focus + 9); recent.push({ kind: 'pier', p }); warning = 'Stone pier planted under the load path.'; pulse('pier');
  } else {
    const len = distNodes(selectedA, selectedB);
    if (len > (type === 'rope' ? .34 : .27)) { warning = `${type === 'rope' ? 'Rope' : 'Bamboo'} span is too long; pick closer nodes.`; pulse('stress'); return updateUi(); }
    if (hasEdge(selectedA, selectedB)) { warning = 'That member already exists; choose a new pair.'; return updateUi(); }
    const e = { a: selectedA, b: selectedB, type, stress: 0, broken: false };
    edges.push(e); budget += type === 'rope' ? 8 : 10; const tri = triangleBonus(e); combo = Math.min(5, combo + (tri ? .25 : .08)); score += Math.round((type === 'rope' ? 135 : 120) * combo + tri * 80); focus = Math.min(100, focus + 7 + tri * 4); recent.push({ kind: 'edge', e }); warning = tri ? 'Strong triangle formed — load path bonus.' : `${type === 'rope' ? 'Rope brace' : 'Bamboo beam'} placed. Add triangles to reduce sag.`; pulse(type === 'rope' ? 'rope' : 'bamboo');
  }
  updateUi();
}
function removeRecent() {
  const r = recent.pop(); if (!r) { warning = 'No recent part to remove.'; return updateUi(); }
  if (r.kind === 'edge') edges = edges.filter(e => e !== r.e); else piers = piers.filter(p => p !== r.p);
  budget = Math.max(0, budget - 5); combo = 1; warning = 'Recent part removed; combo reset but collapse risk lowered.'; pulse('repair'); updateUi();
}
function repairWeak() {
  if (!edges.length) { warning = 'No bridge members to repair yet.'; return updateUi(); }
  const e = [...edges].sort((a,b) => b.stress - a.stress)[0];
  e.stress = Math.max(0, e.stress - 32); budget += 6; score += 90; focus = Math.min(100, focus + 4); warning = 'Repair mallet lowered the weakest red creak.'; pulse('repair'); updateUi();
}
function startTest() {
  if (!connectedAcross()) { warning = 'The deck does not reach the right bank yet. Complete a load path before testing.'; pulse('stress'); return updateUi(); }
  test = { progress: 0, finished: false, porterBob: 0 }; warning = 'Tanuki porters are crossing — watch red stress and repair early.'; pulse('tick'); updateUi();
}
function useFocus() {
  if (focus < 45) { warning = 'Survey Focus needs more charge from efficient triangles.'; return updateUi(); }
  focus -= 45; focusUntil = elapsed + 5.2; warning = 'Survey Focus active: weak knots, current push, and load paths are highlighted.'; pulse('focus'); updateUi();
}
function advanceContract() {
  const c = contracts[contractIndex]; const stress = calcStress(elapsed);
  const under = stress <= c.stressTarget; const ropeCount = edges.filter(e => e.type === 'rope').length; const pierCount = piers.length;
  const bonus = (under ? 900 : 420) + Math.max(0, c.budgetTarget - budget) * 8 + ropeCount * 80 + pierCount * 110;
  score += Math.round(bonus * combo); focus = Math.min(100, focus + 25); combo = Math.min(5, combo + .5);
  if (!under) hearts -= 1;
  if (contractIndex < contracts.length - 1) { contractIndex++; warning = `${c.name} sealed. New contract: ${contracts[contractIndex].name}.`; test = null; edges = []; piers = []; recent = []; budget = 0; maxStress = 0; selectedA = 0; selectedB = 1; pulse('win'); }
  else {
    if (score >= 4900 && !grandShown) { grandShown = true; $('grandBanner').classList.remove('hidden'); setTimeout(() => $('grandBanner').classList.add('hidden'), 4200); const grandTime = formatTime(elapsed); localStorage.setItem(GRAND, grandTime); bestGrand = grandTime; pulse('win'); }
    contractIndex = Math.min(contractIndex + 1, contracts.length - 1); warning = 'Hashi Grand Crossing complete. Endless contracts continue with stricter loads.'; test = null; edges = []; piers = []; recent = []; budget = Math.min(40, budget); maxStress = 0;
  }
  updateBest(); updateUi();
}
function failBridge(reason) {
  hearts -= 1; combo = 1; test = null; maxStress = 100; pulse('stress'); warning = reason;
  if (hearts <= 0) return endRun('Bridge hearts collapsed. The tanuki crew will rebuild after tea.');
  updateUi();
}
function endRun(text) {
  gameOver = true; running = false; updateBest(); $('resultTitle').textContent = grandShown ? 'Hashi Grand Crossing!' : 'Crossing Results'; $('resultText').textContent = `${text} Final score ${score}. Max stress ${maxStress}%. Budget ${budget}%.`; $('badgeList').innerHTML = badges().map(b => `<span>${b}</span>`).join(''); $('resultOverlay').classList.remove('hidden');
}
function badges() { const out = []; if (grandShown) out.push('Grand Crossing'); if (maxStress < 35) out.push('Gentle Load'); if (budget < 65) out.push('Under Budget'); if (hearts === 3) out.push('No Falls'); if (focus >= 80) out.push('Survey Master'); return out.length ? out : ['Apprentice Bridgewright']; }
function updateBest() { if (score > best) { best = score; localStorage.setItem(STORAGE, String(best)); } }
function formatTime(s) { const m = Math.floor(s / 60); const sec = Math.floor(s % 60).toString().padStart(2, '0'); return `${m}:${sec}`; }

function loop(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (running && !paused && !gameOver) {
    elapsed += dt * (elapsed < focusUntil ? .42 : 1);
    if (test) {
      test.progress += dt * (elapsed < focusUntil ? .18 : .28);
      const stress = calcStress(elapsed);
      if (stress > 95) failBridge('Catastrophic red stress lingered too long — repair before testing again.');
      else if (test.progress >= 1) advanceContract();
    } else calcStress(elapsed);
    if (budget >= 100) failBridge('Budget debt reached 100%. Remove parts or build leaner next run.');
  }
  draw(); updateUi(false); requestAnimationFrame(loop);
}

function draw() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const rect = canvas.getBoundingClientRect();
  if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) { canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr); }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); const w = rect.width, h = rect.height;
  ctx.clearRect(0,0,w,h);
  if (bg.complete) { const scale = Math.max(w/bg.width, h/bg.height); const bw = bg.width*scale, bh = bg.height*scale; ctx.drawImage(bg, (w-bw)/2, (h-bh)/2, bw, bh); }
  ctx.fillStyle = 'rgba(8,18,35,.42)'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = 'rgba(126,197,231,.55)'; ctx.lineWidth = 2; for (let i=0;i<7;i++){ const y=h*(.66+i*.045)+Math.sin(elapsed*1.3+i)*5; ctx.beginPath(); ctx.moveTo(w*.08,y); ctx.bezierCurveTo(w*.3,y+16,w*.58,y-18,w*.92,y+8); ctx.stroke(); }
  // ghost span
  const A = point(selectedA,w,h), B = point(selectedB,w,h); ctx.setLineDash([8,6]); ctx.lineWidth = 4; ctx.strokeStyle = material==='rope'?'rgba(245,205,124,.8)':material==='pier'?'rgba(180,190,190,.8)':'rgba(137,190,99,.85)'; ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.stroke(); ctx.setLineDash([]);
  for (const p of piers) drawPier(point(p,w,h));
  for (const e of edges) drawEdge(e,w,h);
  if (test) drawPorter(w,h);
  for (let i=0;i<nodes.length;i++) drawNode(i,w,h);
  if (elapsed < focusUntil) drawFocus(w,h);
}
function point(i,w,h){ const n=nodes[i]; return { x:n.x*w, y:n.y*h }; }
function stressColor(s){ if (s>82) return '#df4a39'; if (s>58) return '#f0bd58'; return '#8ec36a'; }
function drawEdge(e,w,h){ const A=point(e.a,w,h), B=point(e.b,w,h); ctx.lineCap='round'; ctx.lineWidth=e.type==='rope'?5:9; ctx.strokeStyle=stressColor(e.stress); ctx.beginPath(); ctx.moveTo(A.x,A.y); const sag=(e.stress/100)*14; ctx.quadraticCurveTo((A.x+B.x)/2,(A.y+B.y)/2+sag,B.x,B.y); ctx.stroke(); ctx.lineWidth=e.type==='rope'?2:3; ctx.strokeStyle=e.type==='rope'?'#7a4c24':'#315f2e'; ctx.stroke(); }
function drawPier(P){ ctx.fillStyle='#777f7e'; ctx.strokeStyle='#d9d0be'; ctx.lineWidth=2; ctx.fillRect(P.x-14,P.y-46,28,48); ctx.strokeRect(P.x-14,P.y-46,28,48); }
function drawNode(i,w,h){ const P=point(i,w,h); const sel=i===selectedA||i===selectedB; ctx.fillStyle=sel?'#ffe074':nodes[i].pier?'#b7b2a8':'#f8ead0'; ctx.strokeStyle=i===selectedA?'#80d1ff':i===selectedB?'#f08c58':'rgba(32,48,68,.85)'; ctx.lineWidth=sel?4:2; ctx.beginPath(); ctx.arc(P.x,P.y, sel?9:7,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.fillStyle='#14233d'; ctx.font='700 11px system-ui'; ctx.textAlign='center'; ctx.fillText(String(i+1),P.x,P.y-12); }
function drawPorter(w,h){ const x=w*(.08 + .84*test.progress); const y=h*(.61 + Math.sin(test.progress*Math.PI)*.06); ctx.fillStyle='rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x,y+28,24,8,0,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#a96532'; ctx.beginPath(); ctx.arc(x,y,15,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#2f1f18'; ctx.fillRect(x-17,y-1,34,12); ctx.fillStyle='#f4c55f'; ctx.fillRect(x-7,y-25,18,18); ctx.strokeStyle='#fff4bf'; ctx.lineWidth=2; ctx.strokeRect(x-7,y-25,18,18); }
function drawFocus(w,h){ ctx.fillStyle='rgba(128,210,255,.13)'; ctx.fillRect(0,0,w,h); ctx.strokeStyle='rgba(150,230,255,.8)'; ctx.lineWidth=2; ctx.setLineDash([4,8]); for (const e of edges.filter(e=>e.stress>55)){ const A=point(e.a,w,h),B=point(e.b,w,h); ctx.beginPath(); ctx.moveTo(A.x,A.y-12); ctx.lineTo(B.x,B.y-12); ctx.stroke(); } ctx.setLineDash([]); ctx.fillStyle='#e9fbff'; ctx.font='900 14px system-ui'; ctx.textAlign='left'; ctx.fillText('Survey Focus: load paths + repair windows visible',18,26); }

function updateUi(full=true) {
  const c = contracts[contractIndex]; const stress = calcStress(elapsed);
  $('scoreText').textContent = score; $('bestText').textContent = best; $('heartText').textContent = '♥'.repeat(Math.max(0,hearts)) + '♡'.repeat(Math.max(0,3-hearts)); $('budgetText').textContent = `${Math.round(budget)}%`; $('stressText').textContent = `${stress}%`; $('comboText').textContent = `x${combo.toFixed(1)}`; $('focusText').textContent = `${Math.round(focus)}%`; $('timeText').textContent = formatTime(elapsed); $('contractName').textContent = c.name; $('contractProgress').textContent = `${Math.min(contractIndex+1,3)} / 3`; $('contractGoals').textContent = `Span ${c.span}, use ≤ ${c.beamLimit} bamboo beams, add ${c.ropeGoal} rope brace${c.ropeGoal===1?'':'s'}, keep stress under ${c.stressTarget}%, deliver ${c.crates} lantern crate${c.crates===1?'':'s'}.`; $('selectedText').textContent = `Nodes ${selectedA+1}→${selectedB+1}`; $('materialText').textContent = `Tool: ${material === 'pier' ? 'Stone Pier' : material[0].toUpperCase()+material.slice(1)}`; $('currentText').textContent = `Current: ${currentStrength()}%`; $('statusText').textContent = warning;
  $('menuBest').textContent = best; $('menuGrand').textContent = bestGrand; $('muteButton').textContent = muted ? 'Muted' : 'Audio On';
  for (const [id, type] of [['bambooButton','bamboo'],['ropeButton','rope'],['pierButton','pier']]) $(id).classList.toggle('selected', material===type);
}

function cycleNode(delta){ selectedB=(selectedB+delta+nodes.length)%nodes.length; clampSelection(); warning=`Selected node pair ${selectedA+1} to ${selectedB+1}.`; pulse('tick'); updateUi(); }
function cycleRow(delta){ const target=(nodes[selectedB].row+delta+4)%4; const idx=nodes.findIndex((n,i)=>n.row===target&&i!==selectedA); if(idx>=0) selectedB=idx; clampSelection(); warning=`Row changed; selected node ${selectedB+1}.`; pulse('tick'); updateUi(); }
function togglePause(){ if(!running||gameOver)return; paused=!paused; $('pauseOverlay').classList.toggle('hidden',!paused); pulse('tick'); }
function restart(){ resetRun(); }
function setMuted(v=!muted){ muted=v; $('muteButton').textContent=muted?'Muted':'Audio On'; }

$('startButton').addEventListener('click', resetRun); $('restartButton').addEventListener('click', restart); $('pauseRestartButton').addEventListener('click', restart); $('resultRestartButton').addEventListener('click', restart); $('pauseButton').addEventListener('click', togglePause); $('resumeButton').addEventListener('click', togglePause); $('muteButton').addEventListener('click', () => setMuted()); $('pauseMuteButton').addEventListener('click', () => setMuted());
$('nodePrev').addEventListener('click',()=>cycleNode(-1)); $('nodeNext').addEventListener('click',()=>cycleNode(1)); $('rowPrev').addEventListener('click',()=>cycleRow(-1)); $('rowNext').addEventListener('click',()=>cycleRow(1));
$('bambooButton').addEventListener('click',()=>place('bamboo')); $('ropeButton').addEventListener('click',()=>place('rope')); $('pierButton').addEventListener('click',()=>place('pier')); $('removeButton').addEventListener('click',removeRecent); $('repairButton').addEventListener('click',repairWeak); $('testButton').addEventListener('click',startTest); $('focusButton').addEventListener('click',useFocus);
canvas.addEventListener('pointerdown', (ev)=>{ const r=canvas.getBoundingClientRect(); const x=(ev.clientX-r.left)/r.width, y=(ev.clientY-r.top)/r.height; let bestI=0,bestD=99; nodes.forEach((n,i)=>{ const d=Math.hypot(n.x-x,n.y-y); if(d<bestD){bestD=d; bestI=i;} }); if(bestD<.09){ if(clickPhase%2===0) selectedA=bestI; else selectedB=bestI; clickPhase++; clampSelection(); warning=`Tapped build socket ${bestI+1}. Pair ${selectedA+1}→${selectedB+1}.`; pulse('tick'); updateUi(); } });
window.addEventListener('keydown',(ev)=>{ if(ev.target && ['INPUT','TEXTAREA'].includes(ev.target.tagName)) return; const k=ev.key.toLowerCase(); if(k==='arrowleft'||k==='a') cycleNode(-1); else if(k==='arrowright'||k==='d') cycleNode(1); else if(k==='arrowup'||k==='w') cycleRow(-1); else if(k==='arrowdown'||k==='s') cycleRow(1); else if(k==='1') material='bamboo', updateUi(); else if(k==='2') material='rope', updateUi(); else if(k==='3') material='pier', updateUi(); else if(k===' '||k==='enter') place(material); else if(k==='x'||k==='backspace') removeRecent(); else if(k==='h') repairWeak(); else if(k==='f'||k==='shift') useFocus(); else if(k==='t') startTest(); else if(k==='p') togglePause(); else if(k==='r') restart(); });

updateUi(); draw();
