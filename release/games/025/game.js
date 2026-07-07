(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const canvas = $('gameCanvas');
  const ctx = canvas.getContext('2d');
  const W = 390;
  const H = 620;
  const LS_BEST = 'day025-neko-best-score';
  const LS_GRAND = 'day025-neko-best-grand-fortune';

  const assets = {
    helper: new Image(),
    cabinet: new Image(),
    icons: new Image(),
  };
  assets.helper.src = 'assets/neko-helper.png';
  assets.cabinet.src = 'assets/neko-cabinet.png';
  assets.icons.src = 'assets/neko-icons.png';

  const els = {
    score: $('scoreValue'), best: $('bestValue'), luck: $('luckValue'), misfortune: $('misfortuneValue'), combo: $('comboValue'), slot: $('slotValue'), time: $('timeValue'),
    commissionName: $('commissionName'), requestLine: $('requestLine'), bellMeter: $('bellMeter'), bellText: $('bellText'), focusMeter: $('focusMeter'), focusText: $('focusText'), helper: $('statusHelper'),
    titleOverlay: $('titleOverlay'), pauseOverlay: $('pauseOverlay'), resultsOverlay: $('resultsOverlay'), resultsBody: $('resultsBody'), grandBanner: $('grandBanner'),
    menuBest: $('menuBest'), menuGrand: $('menuGrand'), muteBtn: $('muteBtn'),
  };

  const buttons = ['slotLeftBtn','slotRightBtn','dropBtn','rotateBtn','gateBtn','bellBtn','nudgeBtn','focusBtn','pauseBtn','restartBtn','startBtn','resumeBtn','pauseRestartBtn','resultsRestartBtn']
    .reduce((acc, id) => (acc[id] = $(id), acc), {});

  const coinTypes = {
    gold: { fill: '#f7c84b', stroke: '#7a3d06', label: 'Gold' },
    silver: { fill: '#e9eef1', stroke: '#66727b', label: 'Silver' },
    copper: { fill: '#d67833', stroke: '#6d2f13', label: 'Copper' },
  };

  const commissions = [
    { name: 'First Paw Chime', request: 'Bank 3 gold koban into Tray A. Ring 1 bell and keep misfortune under 30%.', type: 'gold', tray: 'A', need: 3, bellNeed: 1, limit: 30, score: 900 },
    { name: 'Lantern Coin Spiral', request: 'Bank 2 gold and 2 silver coins into Tray B. Ring 3 bells and keep misfortune under 45%.', type: 'silver', tray: 'B', need: 4, bellNeed: 3, limit: 45, score: 2200 },
    { name: 'Golden Maneki Offering', request: 'Sort 6 mixed koban into the flashing tray order. Finish below 60% misfortune.', type: 'mixed', tray: 'C', need: 6, bellNeed: 5, limit: 60, score: 3900 },
  ];

  const state = {
    mode: 'menu', score: 0, best: Number(localStorage.getItem(LS_BEST) || 0), grandBest: localStorage.getItem(LS_GRAND) || '—',
    startTime: 0, elapsed: 0, luck: 3, misfortune: 0, combo: 1, slot: 2, selectedBumper: 0, selectedGate: 0,
    bell: 0, focus: 0, focusUntil: 0, muted: false, grand: false, ended: false,
    commission: 0, delivered: 0, bells: 0, wrong: 0, gutters: 0, nudges: 0, chain: 0, bestChain: 0,
    coins: [], particles: [], last: performance.now(), audio: null, runningAudio: false,
  };

  const slots = [58, 126, 195, 264, 332];
  const trays = [
    { id: 'A', x: 35, y: 560, w: 92, h: 44, color: '#11756f' },
    { id: 'B', x: 149, y: 560, w: 92, h: 44, color: '#a72b1e' },
    { id: 'C', x: 263, y: 560, w: 92, h: 44, color: '#7b4ab5' },
  ];
  const pegs = [];
  for (let r = 0; r < 7; r++) {
    const count = r % 2 ? 5 : 4;
    const start = r % 2 ? 70 : 104;
    for (let c = 0; c < count; c++) pegs.push({ x: start + c * 63, y: 118 + r * 55, r: 7 });
  }
  const bumpers = [
    { x: 90, y: 220, len: 70, angle: -0.25 },
    { x: 200, y: 304, len: 78, angle: 0.3 },
    { x: 300, y: 222, len: 70, angle: 0.25 },
    { x: 112, y: 418, len: 74, angle: 0.25 },
    { x: 284, y: 420, len: 74, angle: -0.25 },
  ];
  const gates = [
    { x: 75, y: 355, w: 58, open: true },
    { x: 257, y: 355, w: 58, open: false },
  ];
  const bells = [
    { x: 195, y: 176, r: 16, cooldown: 0 },
    { x: 67, y: 474, r: 15, cooldown: 0 },
    { x: 324, y: 474, r: 15, cooldown: 0 },
  ];

  function resetRun() {
    state.score = 0; state.elapsed = 0; state.luck = 3; state.misfortune = 0; state.combo = 1; state.slot = 2; state.selectedBumper = 0; state.selectedGate = 0;
    state.bell = 0; state.focus = 0; state.focusUntil = 0; state.grand = false; state.ended = false; state.commission = 0; state.delivered = 0; state.bells = 0;
    state.wrong = 0; state.gutters = 0; state.nudges = 0; state.chain = 0; state.bestChain = 0; state.coins = []; state.particles = [];
    bumpers.forEach((b, i) => b.angle = [-0.25, 0.3, 0.25, 0.25, -0.25][i]);
    gates[0].open = true; gates[1].open = false;
    state.startTime = performance.now(); state.mode = 'running';
    els.grandBanner.hidden = true;
    updateHud();
  }

  function ensureAudio() {
    if (state.audio || state.muted) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    state.audio = new AudioContext();
  }
  function beep(freq = 440, dur = 0.08, type = 'sine', gain = 0.04) {
    if (state.muted) return;
    ensureAudio();
    if (!state.audio) return;
    if (state.audio.state === 'suspended') state.audio.resume().catch(() => {});
    const now = state.audio.currentTime;
    const osc = state.audio.createOscillator();
    const amp = state.audio.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, now);
    amp.gain.setValueAtTime(0, now); amp.gain.linearRampToValueAtTime(gain, now + 0.01); amp.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(amp); amp.connect(state.audio.destination); osc.start(now); osc.stop(now + dur + 0.02);
  }
  function chord(base) { beep(base, 0.11, 'triangle', 0.035); setTimeout(() => beep(base * 1.5, 0.12, 'sine', 0.028), 70); }

  function activeCommission() { return commissions[Math.min(state.commission, commissions.length - 1)]; }
  function coinTypeForDrop() {
    const c = activeCommission();
    if (c.type === 'mixed') return ['gold','silver','copper'][(state.delivered + state.coins.length) % 3];
    return c.type;
  }

  function startGame() {
    ensureAudio(); beep(520, 0.08, 'triangle');
    els.titleOverlay.classList.remove('show'); els.titleOverlay.hidden = true; els.resultsOverlay.hidden = true; els.pauseOverlay.hidden = true;
    resetRun();
  }
  function dropCoin() {
    if (state.mode !== 'running') return;
    const x = slots[state.slot];
    const type = coinTypeForDrop();
    state.coins.push({ x, y: 42, vx: (state.slot - 2) * 12, vy: 30, r: 10, type, life: 0, rescued: false });
    addParticles(x, 42, coinTypes[type].fill, 10);
    beep(type === 'gold' ? 780 : type === 'silver' ? 670 : 560, 0.08, 'square', 0.025);
    setHelper(`Dropped ${coinTypes[type].label} koban from slot ${state.slot + 1}.`);
  }
  function rotateBumper(dir = 1) {
    if (state.mode !== 'running') return;
    const b = bumpers[state.selectedBumper];
    b.angle += dir * Math.PI / 4;
    beep(280, 0.08, 'triangle', 0.03);
    setHelper(`Rotated Paw ${state.selectedBumper + 1}. Watch the preview dots bend toward trays.`);
  }
  function toggleGate() {
    if (state.mode !== 'running') return;
    const g = gates[state.selectedGate];
    const blocked = state.coins.some(c => Math.abs(c.x - g.x) < g.w / 2 + c.r && Math.abs(c.y - g.y) < 16 + c.r);
    if (blocked) { setHelper('Gate is blocked by an active coin. Wait a beat.'); beep(150, 0.1, 'sawtooth', 0.02); return; }
    g.open = !g.open; beep(430, 0.06, 'square', 0.025); setHelper(`${g.open ? 'Opened' : 'Closed'} charm gate ${state.selectedGate + 1}.`);
  }
  function useBell() {
    if (state.mode !== 'running' || state.bell < 100 || !state.coins.length) return;
    state.bell = 0;
    const targetTray = trays.find(t => t.id === activeCommission().tray) || trays[0];
    for (const coin of state.coins) {
      coin.vx += Math.sign((targetTray.x + targetTray.w / 2) - coin.x) * 55;
      coin.vy += 18; coin.rescued = true;
    }
    chord(660); addParticles(targetTray.x + targetTray.w / 2, targetTray.y, '#ffe071', 24);
    setHelper('Fortune Bell pulled active coins toward the requested tray.');
  }
  function nudge() {
    if (state.mode !== 'running') return;
    const dir = state.slot < 2 ? 1 : state.slot > 2 ? -1 : (Math.random() > 0.5 ? 1 : -1);
    state.coins.forEach(c => c.vx += dir * 52);
    state.nudges++; state.misfortune = Math.min(100, state.misfortune + 4 + Math.max(0, state.nudges - 3) * 2);
    beep(120, 0.1, 'triangle', 0.035); setHelper('Cabinet nudged. Useful rescue, but misfortune rises if you overuse it.');
    if (state.nudges > 6 && state.nudges % 2 === 0) damageLuck('over-nudge crack');
  }
  function useFocus() {
    if (state.mode !== 'running' || state.focus < 100) return;
    state.focus = 0; state.focusUntil = performance.now() + 4200; chord(880); setHelper('Lucky Paw active: slower coins and brighter path preview.');
  }

  function update(dt) {
    if (state.mode !== 'running') return;
    state.elapsed = (performance.now() - state.startTime) / 1000;
    const slow = performance.now() < state.focusUntil ? 0.45 : 1;
    for (const bell of bells) bell.cooldown = Math.max(0, bell.cooldown - dt);
    for (const coin of state.coins) {
      coin.life += dt; coin.vy += 420 * dt * slow; coin.x += coin.vx * dt * slow; coin.y += coin.vy * dt * slow;
      if (coin.x < 18) { coin.x = 18; coin.vx = Math.abs(coin.vx) * 0.72; }
      if (coin.x > W - 18) { coin.x = W - 18; coin.vx = -Math.abs(coin.vx) * 0.72; }
      for (const peg of pegs) collideCircle(coin, peg.x, peg.y, peg.r, 0.82);
      for (const bell of bells) {
        if (collideCircle(coin, bell.x, bell.y, bell.r, 0.9) && bell.cooldown <= 0) {
          bell.cooldown = 0.55; state.bells++; state.bell = Math.min(100, state.bell + 22); state.focus = Math.min(100, state.focus + 12); state.score += Math.round(85 * state.combo);
          addParticles(bell.x, bell.y, '#ffd76e', 18); beep(680 + state.bells * 12, 0.1, 'sine', 0.035);
        }
      }
      for (const bumper of bumpers) collideLine(coin, bumper);
      for (const gate of gates) if (!gate.open) collideGate(coin, gate);
      coin.vx *= 0.998; coin.vy *= 0.999;
    }
    for (let i = state.coins.length - 1; i >= 0; i--) {
      const coin = state.coins[i];
      if (coin.y > H - 78) {
        const tray = trays.find(t => coin.x > t.x && coin.x < t.x + t.w);
        if (tray) bankCoin(coin, tray); else gutterCoin(coin);
        state.coins.splice(i, 1);
      } else if (coin.y > H + 60) {
        gutterCoin(coin); state.coins.splice(i, 1);
      }
    }
    updateParticles(dt);
    if (state.elapsed > 260 && state.commission < 3) damageLuck('timer pressure');
    if (state.luck <= 0 || state.misfortune >= 100) finishRun(false);
    updateHud();
  }

  function collideCircle(coin, x, y, r, bounce) {
    const dx = coin.x - x, dy = coin.y - y; const dist = Math.hypot(dx, dy); const min = coin.r + r;
    if (dist > 0 && dist < min) {
      const nx = dx / dist, ny = dy / dist; const overlap = min - dist;
      coin.x += nx * overlap; coin.y += ny * overlap;
      const dot = coin.vx * nx + coin.vy * ny;
      coin.vx -= (1 + bounce) * dot * nx; coin.vy -= (1 + bounce) * dot * ny;
      coin.vx += nx * 8; coin.vy += ny * 8;
      return true;
    }
    return false;
  }
  function collideLine(coin, bumper) {
    const ax = bumper.x - Math.cos(bumper.angle) * bumper.len / 2;
    const ay = bumper.y - Math.sin(bumper.angle) * bumper.len / 2;
    const bx = bumper.x + Math.cos(bumper.angle) * bumper.len / 2;
    const by = bumper.y + Math.sin(bumper.angle) * bumper.len / 2;
    const abx = bx - ax, aby = by - ay;
    const t = Math.max(0, Math.min(1, ((coin.x - ax) * abx + (coin.y - ay) * aby) / (abx * abx + aby * aby)));
    const px = ax + abx * t, py = ay + aby * t;
    if (collideCircle(coin, px, py, 8, 1.0)) {
      coin.vx += Math.cos(bumper.angle - Math.PI / 2) * 20;
      coin.vy += Math.sin(bumper.angle - Math.PI / 2) * 20;
      state.focus = Math.min(100, state.focus + 3);
    }
  }
  function collideGate(coin, gate) {
    const left = gate.x - gate.w / 2, right = gate.x + gate.w / 2, top = gate.y - 5, bottom = gate.y + 5;
    if (coin.x > left - coin.r && coin.x < right + coin.r && coin.y > top - coin.r && coin.y < bottom + coin.r) {
      coin.y = top - coin.r; coin.vy = -Math.abs(coin.vy) * 0.62; coin.vx += (coin.x - gate.x) * 0.8; beep(210, 0.04, 'square', 0.018);
    }
  }
  function bankCoin(coin, tray) {
    const c = activeCommission();
    const typeOk = c.type === 'mixed' || coin.type === c.type;
    const trayOk = tray.id === c.tray;
    if (typeOk && trayOk) {
      state.delivered++; state.chain++; state.bestChain = Math.max(state.bestChain, state.chain); state.combo = Math.min(5, state.combo + 0.2);
      const bonus = coin.rescued ? 260 : 120;
      state.score += Math.round(bonus * state.combo); state.bell = Math.min(100, state.bell + 14); state.focus = Math.min(100, state.focus + 18);
      addParticles(coin.x, tray.y, coinTypes[coin.type].fill, 26); chord(560 + state.chain * 14); setHelper(`Lucky bank! ${state.delivered}/${c.need} requested coins in Tray ${tray.id}.`);
      if (state.delivered >= c.need && state.bells >= c.bellNeed && state.misfortune <= c.limit) completeCommission();
    } else {
      state.wrong++; state.chain = 0; state.combo = 1; state.misfortune = Math.min(100, state.misfortune + 8); state.score += 35;
      addParticles(coin.x, tray.y, '#8b1d16', 12); beep(160, 0.11, 'sawtooth', 0.02); setHelper(`Wrong tray/type. Requested ${c.type === 'mixed' ? 'mixed order' : c.type} into Tray ${c.tray}.`);
    }
  }
  function gutterCoin(coin) {
    state.gutters++; state.chain = 0; state.combo = 1; state.misfortune = Math.min(100, state.misfortune + 14); addParticles(coin.x, H - 46, '#35100c', 18); beep(95, 0.18, 'sawtooth', 0.025);
    if (state.gutters % 2 === 0) damageLuck('gutter drop'); else setHelper('A koban hit the misfortune gutter. Rotate paw bumpers before the next drop.');
  }
  function completeCommission() {
    const c = activeCommission();
    state.score += Math.round((650 + state.commission * 120) * state.combo); state.commission++; state.delivered = 0; state.bells = 0; state.bell = Math.min(100, state.bell + 20); state.focus = Math.min(100, state.focus + 24);
    if (state.luck < 3) state.luck++;
    addParticles(W / 2, H / 2, '#ffe071', 60); chord(740); setHelper(`${c.name} complete! Ceramic cat lit; next fortune opens.`);
    if (state.score >= 3900 && state.commission >= 3 && !state.grand) triggerGrand();
  }
  function triggerGrand() {
    state.grand = true; state.score += 1500; els.grandBanner.hidden = false; chord(930); setTimeout(() => { els.grandBanner.hidden = true; }, 3200);
    const t = formatTime(state.elapsed); if (state.grandBest === '—' || state.elapsed < parseTime(state.grandBest)) { state.grandBest = t; localStorage.setItem(LS_GRAND, t); }
    setHelper('Neko Grand Fortune! Endless fortune commissions now continue.');
  }
  function damageLuck(reason) {
    state.luck--; state.misfortune = Math.min(100, state.misfortune + 8); beep(120, 0.18, 'sawtooth', 0.035); setHelper(`Luck bell cracked from ${reason}.`);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawPreview();
    drawBoard();
    drawCoins();
    drawParticles();
    if (state.mode !== 'running') drawDimHint();
  }
  function drawBackground() {
    const img = assets.cabinet;
    if (img.complete && img.naturalWidth) ctx.drawImage(img, 0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(116,28,16,0.30)'); grad.addColorStop(0.55, 'rgba(56,11,7,0.12)'); grad.addColorStop(1, 'rgba(32,6,4,0.52)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    roundRect(20, 26, W - 40, H - 62, 28, 'rgba(92,22,13,0.36)', 'rgba(255,214,111,0.34)', 2);
  }
  function drawPreview() {
    const focused = performance.now() < state.focusUntil || state.focus >= 100;
    if (!focused && state.mode === 'running') return;
    ctx.save(); ctx.globalAlpha = focused ? 0.75 : 0.35; ctx.setLineDash([6, 9]); ctx.lineWidth = 3; ctx.strokeStyle = '#ffe071';
    ctx.beginPath(); const x = slots[state.slot]; ctx.moveTo(x, 44);
    let px = x, py = 44, vx = (state.slot - 2) * 9, vy = 28;
    for (let i = 0; i < 70; i++) { vy += 7; px += vx * 0.08; py += vy * 0.08; vx += Math.sin(i * 0.8) * 0.15; if (py > H - 76) break; ctx.lineTo(px, py); }
    ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  }
  function drawBoard() {
    // drop rail
    ctx.fillStyle = 'rgba(255,230,167,0.18)'; roundRect(34, 28, W - 68, 36, 18, 'rgba(42,8,5,0.58)', 'rgba(255,218,137,0.32)', 1);
    for (let i = 0; i < slots.length; i++) {
      ctx.beginPath(); ctx.arc(slots[i], 46, i === state.slot ? 13 : 9, 0, Math.PI * 2); ctx.fillStyle = i === state.slot ? '#ffd55d' : '#a44b22'; ctx.fill(); ctx.strokeStyle = '#3b0b06'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#2b0804'; ctx.font = '900 11px system-ui'; ctx.textAlign = 'center'; ctx.fillText(String(i + 1), slots[i], 50);
    }
    for (const peg of pegs) { ctx.beginPath(); ctx.arc(peg.x, peg.y, peg.r, 0, Math.PI * 2); ctx.fillStyle = '#d99d42'; ctx.fill(); ctx.strokeStyle = '#4d170a'; ctx.lineWidth = 2; ctx.stroke(); }
    bumpers.forEach((b, i) => {
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.angle); roundRect(-b.len/2, -8, b.len, 16, 8, i === state.selectedBumper ? '#ffe071' : '#fff0bd', '#6d210d', 3); ctx.fillStyle = '#e8574f'; ctx.font = '900 14px system-ui'; ctx.textAlign = 'center'; ctx.fillText('🐾', 0, 5); ctx.restore();
    });
    gates.forEach((g, i) => {
      ctx.save(); ctx.translate(g.x, g.y); ctx.strokeStyle = i === state.selectedGate ? '#ffe071' : '#ffb66d'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath();
      if (g.open) { ctx.moveTo(-g.w/2, -10); ctx.lineTo(-8, 8); ctx.moveTo(8, 8); ctx.lineTo(g.w/2, -10); }
      else { ctx.moveTo(-g.w/2, 0); ctx.lineTo(g.w/2, 0); }
      ctx.stroke(); ctx.fillStyle = '#ffe39c'; ctx.font = '800 10px system-ui'; ctx.textAlign = 'center'; ctx.fillText(g.open ? 'OPEN' : 'GATE', 0, -14); ctx.restore();
    });
    bells.forEach((b) => { ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fillStyle = b.cooldown > 0 ? '#fff2b0' : '#d89d30'; ctx.fill(); ctx.strokeStyle = '#5a1b0b'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = '#341008'; ctx.font = '900 12px system-ui'; ctx.textAlign = 'center'; ctx.fillText('🔔', b.x, b.y + 5); });
    trays.forEach(t => { roundRect(t.x, t.y, t.w, t.h, 14, t.color, activeCommission().tray === t.id ? '#ffe071' : '#5a1b0b', activeCommission().tray === t.id ? 4 : 2); ctx.fillStyle = '#fff4d6'; ctx.font = '950 20px system-ui'; ctx.textAlign = 'center'; ctx.fillText(`Tray ${t.id}`, t.x + t.w/2, t.y + 29); });
    // gutters
    roundRect(3, H - 70, 28, 55, 12, '#220705', '#7b2d1b', 2); roundRect(W - 31, H - 70, 28, 55, 12, '#220705', '#7b2d1b', 2);
    ctx.fillStyle = '#ffd99a'; ctx.font = '850 10px system-ui'; ctx.textAlign = 'center'; ctx.save(); ctx.translate(17, H - 42); ctx.rotate(-Math.PI/2); ctx.fillText('GUTTER', 0, 0); ctx.restore(); ctx.save(); ctx.translate(W - 17, H - 42); ctx.rotate(Math.PI/2); ctx.fillText('GUTTER', 0, 0); ctx.restore();
    const helper = assets.helper; if (helper.complete && helper.naturalWidth) ctx.drawImage(helper, W - 90, 72, 70, 70);
  }
  function drawCoins() {
    for (const c of state.coins) {
      const style = coinTypes[c.type]; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fillStyle = style.fill; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = style.stroke; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.arc(c.x - 3, c.y - 4, 3, 0, Math.PI * 2); ctx.fill();
    }
  }
  function drawParticles() {
    for (const p of state.particles) { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI*2); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  function drawDimHint() {
    if (state.mode === 'menu') return;
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(0,0,W,H);
  }

  function addParticles(x, y, color, count) { for (let i=0;i<count;i++) state.particles.push({ x, y, vx:(Math.random()-0.5)*130, vy:(Math.random()-0.8)*120, r: 2 + Math.random()*3, color, life: 1 }); }
  function updateParticles(dt) { for (const p of state.particles) { p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 180*dt; p.life -= dt*1.4; } state.particles = state.particles.filter(p => p.life > 0); }
  function roundRect(x,y,w,h,r,fill,stroke,lw=1) { ctx.beginPath(); ctx.roundRect(x,y,w,h,r); if (fill) { ctx.fillStyle=fill; ctx.fill(); } if (stroke) { ctx.strokeStyle=stroke; ctx.lineWidth=lw; ctx.stroke(); } }

  function updateHud() {
    const bestNow = Math.max(state.best, state.score); els.score.textContent = String(Math.floor(state.score)); els.best.textContent = String(Math.floor(bestNow)); els.luck.textContent = '🔔'.repeat(Math.max(0,state.luck)) + '◇'.repeat(Math.max(0,3-state.luck));
    els.misfortune.textContent = `${Math.floor(state.misfortune)}%`; els.combo.textContent = `x${state.combo.toFixed(1)}`; els.slot.textContent = String(state.slot + 1); els.time.textContent = formatTime(state.elapsed);
    const c = activeCommission(); els.commissionName.textContent = c.name; els.requestLine.textContent = `${c.request} Progress: ${state.delivered}/${c.need} coins · ${state.bells}/${c.bellNeed} bells.`;
    els.bellMeter.value = state.bell; els.bellText.textContent = `${Math.floor(state.bell)}%`; els.focusMeter.value = state.focus; els.focusText.textContent = `${Math.floor(state.focus)}%`;
    buttons.bellBtn.disabled = state.bell < 100; buttons.focusBtn.disabled = state.focus < 100;
  }
  function setHelper(text) { els.helper.textContent = text; }
  function formatTime(sec) { sec = Math.max(0, Math.floor(sec)); return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`; }
  function parseTime(text) { const [m,s] = text.split(':').map(Number); return (m||0)*60 + (s||0); }

  function finishRun(manual = false) {
    if (state.ended) return; state.ended = true; state.mode = 'gameover';
    if (state.score > state.best) { state.best = Math.floor(state.score); localStorage.setItem(LS_BEST, String(state.best)); }
    els.resultsBody.innerHTML = `
      <p><b>Final score:</b> ${Math.floor(state.score)} · <b>Best:</b> ${state.best}</p>
      <p><b>Commission reached:</b> ${activeCommission().name} · <b>Grand Fortune:</b> ${state.grand ? 'triggered' : 'not yet'}</p>
      <p><b>Lucky chain:</b> ${state.bestChain} · <b>Gutters:</b> ${state.gutters} · <b>Wrong trays:</b> ${state.wrong} · <b>Nudges:</b> ${state.nudges}</p>
      <p>${manual ? 'Run restarted manually.' : 'Luck ran out. Rotate before dropping and keep nudges as rescue moves.'}</p>`;
    els.resultsOverlay.hidden = false; els.resultsOverlay.classList.add('show'); updateMenuStats();
  }
  function pause() { if (state.mode !== 'running') return; state.mode = 'paused'; els.pauseOverlay.hidden = false; els.pauseOverlay.classList.add('show'); }
  function resume() { if (state.mode !== 'paused') return; state.mode = 'running'; els.pauseOverlay.hidden = true; els.pauseOverlay.classList.remove('show'); state.startTime = performance.now() - state.elapsed * 1000; }
  function restart() { els.resultsOverlay.hidden = true; els.resultsOverlay.classList.remove('show'); els.pauseOverlay.hidden = true; els.pauseOverlay.classList.remove('show'); startGame(); }
  function updateMenuStats() { els.menuBest.textContent = String(state.best); els.menuGrand.textContent = state.grandBest; els.best.textContent = String(state.best); }

  function pointerPos(evt) { const rect = canvas.getBoundingClientRect(); const p = evt.touches ? evt.touches[0] : evt; return { x: (p.clientX - rect.left) * W / rect.width, y: (p.clientY - rect.top) * H / rect.height }; }
  function handleCanvasDown(evt) {
    if (state.mode !== 'running') return; const p = pointerPos(evt); evt.preventDefault();
    let closestB = -1, db = 999; bumpers.forEach((b,i)=>{ const d=Math.hypot(p.x-b.x,p.y-b.y); if(d<db){db=d; closestB=i;} });
    if (db < 44) { state.selectedBumper = closestB; setHelper(`Selected Paw ${closestB+1}. Press Rotate Paw.`); return; }
    let closestG = -1, dg = 999; gates.forEach((g,i)=>{ const d=Math.hypot(p.x-g.x,p.y-g.y); if(d<dg){dg=d; closestG=i;} });
    if (dg < 44) { state.selectedGate = closestG; setHelper(`Selected charm gate ${closestG+1}. Press Toggle Gate.`); return; }
    const slot = slots.reduce((best,x,i)=> Math.abs(p.x-x)<Math.abs(p.x-slots[best]) ? i : best, 0); if (p.y < 90) { state.slot = slot; setHelper(`Selected drop slot ${slot+1}.`); updateHud(); }
  }

  buttons.startBtn.addEventListener('click', startGame);
  buttons.dropBtn.addEventListener('click', dropCoin);
  buttons.slotLeftBtn.addEventListener('click', () => { state.slot = Math.max(0, state.slot - 1); beep(350,0.04,'triangle',0.018); updateHud(); });
  buttons.slotRightBtn.addEventListener('click', () => { state.slot = Math.min(slots.length - 1, state.slot + 1); beep(390,0.04,'triangle',0.018); updateHud(); });
  buttons.rotateBtn.addEventListener('click', () => rotateBumper(1));
  buttons.gateBtn.addEventListener('click', toggleGate);
  buttons.bellBtn.addEventListener('click', useBell);
  buttons.nudgeBtn.addEventListener('click', nudge);
  buttons.focusBtn.addEventListener('click', useFocus);
  buttons.pauseBtn.addEventListener('click', pause);
  buttons.resumeBtn.addEventListener('click', resume);
  buttons.restartBtn.addEventListener('click', () => finishRun(true));
  buttons.pauseRestartBtn.addEventListener('click', restart);
  buttons.resultsRestartBtn.addEventListener('click', restart);
  els.muteBtn.addEventListener('click', () => { state.muted = !state.muted; els.muteBtn.textContent = `Mute: ${state.muted ? 'On' : 'Off'}`; });
  canvas.addEventListener('pointerdown', handleCanvasDown);
  window.addEventListener('keydown', (evt) => {
    if (evt.key === 'p' || evt.key === 'P') { state.mode === 'paused' ? resume() : pause(); }
    if (evt.key === 'r' || evt.key === 'R') finishRun(true);
    if (state.mode !== 'running') { if (evt.key === 'Enter' || evt.key === ' ') startGame(); return; }
    if (evt.key === 'ArrowLeft' || evt.key === 'a' || evt.key === 'A') state.slot = Math.max(0, state.slot - 1);
    if (evt.key === 'ArrowRight' || evt.key === 'd' || evt.key === 'D') state.slot = Math.min(slots.length - 1, state.slot + 1);
    if (evt.key === 'q' || evt.key === 'Q') rotateBumper(-1);
    if (evt.key === 'e' || evt.key === 'E') rotateBumper(1);
    if (evt.key === 'g' || evt.key === 'G') toggleGate();
    if (evt.key === 'b' || evt.key === 'B') useBell();
    if (evt.key === 'n' || evt.key === 'N') nudge();
    if (evt.key === 'Shift' || evt.key === 'l' || evt.key === 'L') useFocus();
    if (evt.key === ' ' || evt.key === 'Enter') { evt.preventDefault(); dropCoin(); }
    updateHud();
  });

  function loop(now) {
    const dt = Math.min(0.033, (now - state.last) / 1000); state.last = now;
    update(dt); draw(); requestAnimationFrame(loop);
  }
  updateMenuStats(); updateHud(); requestAnimationFrame(loop);
})();
