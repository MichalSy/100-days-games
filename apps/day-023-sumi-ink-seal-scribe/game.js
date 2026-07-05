(() => {
  const $ = (id) => document.getElementById(id);
  const canvas = $('gameCanvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  const chapters = [
    { name: 'First Moon Stroke', strokes: 3, blotLimit: 18, seal: { x: .82, y: .76 }, target: 900, desc: 'Trace 3 moon strokes in order, keep blot below 18%, and place one vermilion seal.' },
    { name: 'Crane Poem Margin', strokes: 4, blotLimit: 24, seal: { x: .16, y: .22 }, target: 2200, desc: 'Trace 4 crane-margin strokes, alternate brush modes, dab early, and stamp the left seal.' },
    { name: 'Vermilion Festival Scroll', strokes: 5, blotLimit: 30, seal: { x: .78, y: .18 }, target: 3700, desc: 'Trace 5 compact festival strokes, keep ink controlled, and land the Master Seal.' },
  ];

  const state = {
    running: false,
    paused: false,
    gameOver: false,
    startedAt: 0,
    elapsed: 0,
    score: 0,
    best: Number(localStorage.getItem('day023-best') || 0),
    hearts: 3,
    combo: 1,
    blot: 0,
    brush: 'fine',
    wetness: 58,
    breath: 0,
    breathActive: 0,
    dabs: 3,
    chapterIndex: 0,
    strokeIndex: 0,
    strokes: [],
    particles: [],
    blots: [],
    sealPlaced: false,
    sealMode: false,
    drawing: false,
    currentStroke: null,
    message: 'Ready ink. Start with stroke 1 using Fine Brush.',
    perfectCards: 0,
    cleanChain: 0,
    seals: 0,
    audioEnabled: true,
  };

  const ui = {
    score: $('score'), best: $('best'), hearts: $('hearts'), blot: $('blot'), combo: $('combo'), brushMode: $('brushMode'), time: $('time'),
    chapter: $('chapter'), objective: $('objective'), strokeGoal: $('strokeGoal'), sealGoal: $('sealGoal'), blotGoal: $('blotGoal'), breathGoal: $('breathGoal'), helper: $('helper'),
    menuOverlay: $('menuOverlay'), pauseOverlay: $('pauseOverlay'), resultOverlay: $('resultOverlay'), resultText: $('resultText'), badges: $('badges'), bestLine: $('bestLine'), resultKicker: $('resultKicker'),
    fineBtn: $('fineBtn'), loadedBtn: $('loadedBtn'), breathBtn: $('breathBtn'), muteBtn: $('muteBtn'),
  };

  let audio = { ctx: null, enabled: false, muted: false };
  window.__day023Audio = audio;

  function initAudio() {
    if (!audio.ctx) audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (audio.ctx.state === 'suspended') audio.ctx.resume();
    audio.enabled = audio.ctx.state === 'running' || audio.ctx.state === 'suspended';
    window.__day023Audio = audio;
  }

  function tone(freq = 440, dur = .08, type = 'sine', gain = .045) {
    if (!audio.ctx || audio.muted) return;
    const now = audio.ctx.currentTime;
    const osc = audio.ctx.createOscillator();
    const g = audio.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(gain, now + .015);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(g).connect(audio.ctx.destination);
    osc.start(now); osc.stop(now + dur + .02);
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * DPR));
    canvas.height = Math.max(1, Math.floor(rect.height * DPR));
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function rand(seed) {
    let t = seed + 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  function chapter() { return chapters[state.chapterIndex]; }

  function makeTargets() {
    const c = chapter();
    const w = canvas.clientWidth || 920;
    const h = canvas.clientHeight || 580;
    const marginX = w * .14;
    const marginY = h * .18;
    const usableW = w - marginX * 2;
    const usableH = h - marginY * 2;
    const targets = [];
    for (let i = 0; i < c.strokes; i++) {
      const r1 = rand(23023 + state.chapterIndex * 47 + i * 13);
      const r2 = rand(9103 + state.chapterIndex * 89 + i * 19);
      const cx = marginX + usableW * (0.16 + (i / Math.max(1, c.strokes - 1)) * 0.68 + (r1 - .5) * .12);
      const cy = marginY + usableH * (0.28 + (i % 2) * .28 + (r2 - .5) * .14);
      const len = Math.min(w, h) * (0.18 + .035 * (i % 3));
      const angle = [-0.12, 0.74, -0.58, 0.18, -0.92][(i + state.chapterIndex) % 5];
      const curve = (rand(1000 + i + state.chapterIndex * 11) - .5) * .35;
      targets.push({
        id: i,
        x1: cx - Math.cos(angle) * len / 2,
        y1: cy - Math.sin(angle) * len / 2,
        x2: cx + Math.cos(angle) * len / 2,
        y2: cy + Math.sin(angle) * len / 2,
        cx, cy, len, angle, curve,
      });
    }
    return targets;
  }

  let targets = [];

  function resetRun() {
    Object.assign(state, {
      running: true, paused: false, gameOver: false, startedAt: performance.now(), elapsed: 0, score: 0, hearts: 3, combo: 1, blot: 0,
      brush: 'fine', wetness: 58, breath: 0, breathActive: 0, dabs: 3, chapterIndex: 0, strokeIndex: 0, strokes: [], particles: [], blots: [], sealPlaced: false, sealMode: false,
      drawing: false, currentStroke: null, message: 'Trace stroke 1. Drag through the ghost ink line.', perfectCards: 0, cleanChain: 0, seals: 0,
    });
    targets = makeTargets();
    updateUI();
  }

  function setBrush(mode) {
    state.brush = mode;
    state.sealMode = false;
    state.message = mode === 'fine' ? 'Fine Brush: precise, safer ink.' : 'Loaded Brush: bold coverage, higher blot risk.';
    tone(mode === 'fine' ? 390 : 250, .06, 'triangle', .025);
    updateUI();
  }

  function canvasPoint(evt) {
    const rect = canvas.getBoundingClientRect();
    const t = evt.touches?.[0] || evt.changedTouches?.[0] || evt;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  }

  function startStroke(evt) {
    if (!state.running || state.paused || state.gameOver) return;
    initAudio();
    const p = canvasPoint(evt);
    if (state.sealMode) return stampSeal(p);
    state.drawing = true;
    state.currentStroke = { points: [p], brush: state.brush, targetIndex: state.strokeIndex, width: state.brush === 'fine' ? 7 : 14, wet: state.wetness };
    tone(state.brush === 'fine' ? 520 : 320, .045, 'sine', .022);
    evt.preventDefault();
  }

  function moveStroke(evt) {
    if (!state.drawing || !state.currentStroke || state.paused) return;
    const p = canvasPoint(evt);
    const pts = state.currentStroke.points;
    const last = pts[pts.length - 1];
    const dx = p.x - last.x, dy = p.y - last.y;
    if (dx * dx + dy * dy > 16) {
      pts.push(p);
      state.wetness = Math.max(0, state.wetness - (state.brush === 'fine' ? .35 : .62));
      if (pts.length % 8 === 0 && Math.random() < .55) addParticle(p.x, p.y, '#1b120d');
    }
    evt.preventDefault();
  }

  function endStroke(evt) {
    if (!state.drawing || !state.currentStroke) return;
    const stroke = state.currentStroke;
    state.drawing = false;
    state.currentStroke = null;
    evaluateStroke(stroke);
    evt?.preventDefault?.();
  }

  function distToSegment(p, a, b) {
    const vx = b.x - a.x, vy = b.y - a.y;
    const wx = p.x - a.x, wy = p.y - a.y;
    const c1 = vx * wx + vy * wy;
    if (c1 <= 0) return Math.hypot(p.x - a.x, p.y - a.y);
    const c2 = vx * vx + vy * vy;
    if (c2 <= c1) return Math.hypot(p.x - b.x, p.y - b.y);
    const t = c1 / c2;
    return Math.hypot(p.x - (a.x + t * vx), p.y - (a.y + t * vy));
  }

  function evaluateStroke(stroke) {
    const target = targets[state.strokeIndex];
    if (!target || stroke.points.length < 3) {
      state.message = 'Stroke too short. Drag through the ghost mark.';
      return updateUI();
    }
    const a = { x: target.x1, y: target.y1 }, b = { x: target.x2, y: target.y2 };
    const coverageHits = stroke.points.filter((p) => distToSegment(p, a, b) < 42).length;
    const coverage = coverageHits / stroke.points.length;
    const start = stroke.points[0], end = stroke.points[stroke.points.length - 1];
    const drawnAngle = Math.atan2(end.y - start.y, end.x - start.x);
    let angleDiff = Math.abs(Math.atan2(Math.sin(drawnAngle - target.angle), Math.cos(drawnAngle - target.angle)));
    const orderOk = stroke.targetIndex === state.strokeIndex;
    const length = stroke.points.reduce((sum, p, i, arr) => i ? sum + Math.hypot(p.x - arr[i-1].x, p.y - arr[i-1].y) : 0, 0);
    const tooWet = stroke.brush === 'loaded' && state.wetness > 38 && coverage < .52;
    let quality = 0;
    if (coverage > .46) quality += 1;
    if (coverage > .68) quality += 1;
    if (angleDiff < .62) quality += 1;
    if (length > target.len * .55 && length < target.len * 1.75) quality += 1;
    if (orderOk) quality += 1;

    state.strokes.push({ ...stroke, quality, ok: quality >= 3, target });
    if (quality >= 3) {
      const bonus = quality >= 5 ? 70 : 25;
      state.score += Math.round((115 + bonus + (stroke.brush === 'loaded' ? 24 : 0)) * state.combo);
      state.combo = Math.min(4, state.combo + .18);
      state.strokeIndex += 1;
      state.cleanChain += 1;
      state.breath = Math.min(100, state.breath + 22 + quality * 2);
      state.message = quality >= 5 ? 'Excellent stroke: clean angle, strong ink, perfect order.' : 'Stroke accepted. Lift or continue before wetness pools.';
      tone(620 + quality * 35, .08, 'triangle', .035);
    } else {
      state.combo = Math.max(1, state.combo - .35);
      state.blot = Math.min(100, state.blot + 5 + (tooWet ? 8 : 2));
      state.message = 'Rough stroke. Match the ghost direction and avoid over-wet patches.';
      tone(180, .12, 'sawtooth', .025);
      addBlot(end.x, end.y, tooWet ? 34 : 22);
    }
    if (tooWet || state.wetness > 72) addBlot(end.x, end.y, 22 + Math.random() * 18);
    state.wetness = Math.min(92, state.wetness + (stroke.brush === 'loaded' ? 18 : 9));
    checkFailure();
    updateUI();
  }

  function liftDry() {
    if (!state.running || state.paused) return;
    initAudio();
    state.wetness = Math.max(8, state.wetness - 24);
    state.blot = Math.max(0, state.blot - 1.5);
    state.message = 'Brush lifted. Wet shine calms and the paper breathes.';
    tone(460, .07, 'sine', .025);
    updateUI();
  }

  function dab() {
    if (!state.running || state.paused || state.dabs <= 0) return;
    initAudio();
    state.dabs -= 1;
    state.blot = Math.max(0, state.blot - 9);
    if (state.blots.length) state.blots.sort((a, b) => b.r - a.r)[0].r *= .42;
    state.score += Math.round(90 * state.combo);
    state.message = `Rice Paper Dab used. ${state.dabs} left.`;
    tone(300, .05, 'triangle', .025);
    updateUI();
  }

  function enableSeal() {
    if (!state.running || state.paused) return;
    initAudio();
    state.sealMode = true;
    state.message = state.strokeIndex >= chapter().strokes ? 'Seal mode: tap inside the red target corner.' : 'Complete all ghost strokes before stamping the seal.';
    tone(260, .08, 'square', .02);
    updateUI();
  }

  function stampSeal(p) {
    const c = chapter();
    if (state.strokeIndex < c.strokes) {
      state.message = 'The seal waits. Finish the requested strokes first.';
      state.sealMode = false;
      state.blot = Math.min(100, state.blot + 3);
      return updateUI();
    }
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const sx = c.seal.x * w, sy = c.seal.y * h;
    const d = Math.hypot(p.x - sx, p.y - sy);
    if (d < Math.min(w, h) * .12) {
      state.sealPlaced = true;
      state.seals += 1;
      state.score += Math.round((260 + Math.max(0, c.blotLimit - state.blot) * 10) * state.combo);
      state.message = 'Vermilion seal landed cleanly. Commission banked.';
      tone(180, .06, 'square', .035); setTimeout(() => tone(360, .09, 'triangle', .03), 80);
      completeChapter();
    } else {
      state.blot = Math.min(100, state.blot + 8);
      state.combo = Math.max(1, state.combo - .4);
      state.message = 'Seal missed the red target. Align with the glowing corner.';
      tone(140, .1, 'sawtooth', .02);
    }
    state.sealMode = false;
    checkFailure();
    updateUI();
  }

  function calmBreath() {
    if (!state.running || state.paused || state.breath < 100) return;
    initAudio();
    state.breath = 0;
    state.breathActive = 5.5;
    state.message = 'Calm Breath: blot spread slows and stroke-order hints glow.';
    tone(520, .12, 'sine', .026); setTimeout(() => tone(780, .16, 'sine', .022), 90);
    updateUI();
  }

  function completeChapter() {
    const c = chapter();
    const belowTarget = state.blot <= c.blotLimit;
    if (belowTarget) state.score += 610;
    if (state.blot < 2) { state.score += 760; state.perfectCards += 1; }
    if (state.hearts < 3 && belowTarget) state.hearts += 1;
    if (state.score > state.best) {
      state.best = state.score;
      localStorage.setItem('day023-best', String(state.best));
    }
    if (state.chapterIndex < chapters.length - 1) {
      state.chapterIndex += 1;
      state.strokeIndex = 0;
      state.strokes = [];
      state.blots = [];
      state.blot = Math.max(0, state.blot * .32);
      state.wetness = 52;
      state.dabs = Math.min(3, state.dabs + 1);
      state.sealPlaced = false;
      targets = makeTargets();
      state.message = `${chapter().name}: new ghost strokes loaded.`;
      return;
    }
    if (state.score >= 3700) return winGame();
    state.message = 'Master Seal needs 3700 points. Endless scroll begins.';
    state.chapterIndex = 1;
    state.strokeIndex = 0;
    state.strokes = [];
    state.blots = [];
    state.blot = Math.max(0, state.blot * .38);
    state.sealPlaced = false;
    targets = makeTargets();
  }

  function winGame() {
    state.running = false;
    state.gameOver = true;
    if (state.score > state.best) {
      state.best = state.score;
      localStorage.setItem('day023-best', String(state.best));
    }
    localStorage.setItem('day023-master-time', String(Math.round(state.elapsed)));
    tone(420, .12, 'triangle', .04); setTimeout(() => tone(560, .12, 'triangle', .04), 120); setTimeout(() => tone(760, .22, 'sine', .035), 260);
    showResults(true);
  }

  function checkFailure() {
    const c = chapter();
    if (state.blot > c.blotLimit + 14) {
      state.hearts -= 1;
      state.blot = Math.max(8, c.blotLimit * .55);
      state.combo = 1;
      state.message = 'A blot crossed the margin. One paper heart tore.';
      tone(120, .18, 'sawtooth', .035);
    }
    if (state.hearts <= 0 || state.blot >= 100) {
      state.running = false;
      state.gameOver = true;
      showResults(false);
    }
  }

  function showResults(won) {
    ui.resultOverlay.classList.add('show');
    ui.resultKicker.textContent = won ? 'Sumi Master Seal' : 'Scroll ended';
    ui.resultText.textContent = `Score ${state.score}. Clean stroke chain ${state.cleanChain}. Seals ${state.seals}. Blot finish ${Math.round(state.blot)}%. ${won ? 'Endless scroll commissions unlocked.' : 'Try drying earlier and stamping only when the seal target glows.'}`;
    const badges = [];
    if (won) badges.push('Master Seal');
    if (state.cleanChain >= 12) badges.push('Clean chain');
    if (state.perfectCards) badges.push('No-blot card');
    if (state.seals >= 3) badges.push('Seal scribe');
    if (state.blot < 8) badges.push('Dry paper finish');
    ui.badges.innerHTML = badges.map((b) => `<span>${b}</span>`).join('') || '<span>Practice scroll</span>';
  }

  function addParticle(x, y, color) {
    state.particles.push({ x, y, vx: (Math.random() - .5) * 1.8, vy: (Math.random() - .8) * 1.8, life: 1, color });
  }
  function addBlot(x, y, r) { state.blots.push({ x, y, r, life: 1 }); }

  function drawPaper(w, h) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#fff0ca'); g.addColorStop(.55, '#eed2a0'); g.addColorStop(1, '#f8e5b8');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = .18;
    ctx.strokeStyle = '#8f693e'; ctx.lineWidth = 1;
    for (let y = 18; y < h; y += 18) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 28) {
        const yy = y + Math.sin((x + y) * .02) * 2;
        x ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(91, 43, 23, .2)'; ctx.lineWidth = 16;
    ctx.strokeRect(10, 10, w - 20, h - 20);
  }

  function drawTarget(t, idx) {
    const done = idx < state.strokeIndex;
    const active = idx === state.strokeIndex;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = done ? 'rgba(177, 53, 35, .38)' : active ? 'rgba(25, 16, 10, .42)' : 'rgba(25, 16, 10, .22)';
    ctx.lineWidth = active ? 18 : 13;
    ctx.setLineDash(active && state.breathActive > 0 ? [10, 8] : []);
    ctx.beginPath();
    const cx = (t.x1 + t.x2) / 2 + Math.sin(t.curve) * 36;
    const cy = (t.y1 + t.y2) / 2 + Math.cos(t.curve) * 18;
    ctx.moveTo(t.x1, t.y1); ctx.quadraticCurveTo(cx, cy, t.x2, t.y2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = active ? '#ba3a25' : 'rgba(36, 18, 9, .45)';
    ctx.beginPath(); ctx.arc(t.x1, t.y1, active ? 15 : 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff2d0'; ctx.font = '900 15px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(idx + 1), t.x1, t.y1);
    ctx.restore();
  }

  function drawStroke(stroke) {
    const pts = stroke.points;
    if (pts.length < 2) return;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = stroke.ok ? 'rgba(17, 12, 9, .92)' : 'rgba(42, 27, 19, .72)';
    ctx.lineWidth = stroke.width;
    ctx.shadowColor = 'rgba(0,0,0,.16)'; ctx.shadowBlur = 3;
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      const mid = { x: (pts[i].x + pts[i+1].x) / 2, y: (pts[i].y + pts[i+1].y) / 2 };
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, mid.x, mid.y);
    }
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y); ctx.stroke();
    ctx.restore();
  }

  function drawSeal(w, h) {
    const c = chapter();
    const x = c.seal.x * w, y = c.seal.y * h;
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = state.sealMode ? '#e13d27' : 'rgba(190, 52, 34, .72)';
    ctx.lineWidth = 4;
    ctx.setLineDash(state.sealMode ? [8, 5] : []);
    ctx.strokeRect(-38, -38, 76, 76);
    ctx.setLineDash([]);
    ctx.fillStyle = state.sealPlaced ? 'rgba(190, 52, 34, .86)' : 'rgba(190, 52, 34, .16)';
    ctx.fillRect(-30, -30, 60, 60);
    ctx.strokeStyle = '#8a1c12'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-18, -12); ctx.lineTo(16, -12); ctx.moveTo(0, -24); ctx.lineTo(0, 23); ctx.moveTo(-18, 15); ctx.quadraticCurveTo(0, 25, 18, 13); ctx.stroke();
    ctx.restore();
  }

  function render() {
    const w = canvas.clientWidth || 920, h = canvas.clientHeight || 580;
    ctx.clearRect(0, 0, w, h);
    drawPaper(w, h);
    targets.forEach(drawTarget);
    state.strokes.forEach(drawStroke);
    if (state.currentStroke) drawStroke({ ...state.currentStroke, ok: true });
    for (const b of state.blots) {
      ctx.save();
      const rg = ctx.createRadialGradient(b.x, b.y, 2, b.x, b.y, b.r);
      rg.addColorStop(0, `rgba(12, 8, 6, ${.62 * b.life})`);
      rg.addColorStop(.65, `rgba(23, 15, 11, ${.26 * b.life})`);
      rg.addColorStop(1, 'rgba(23, 15, 11, 0)');
      ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    drawSeal(w, h);
    for (const p of state.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    const c = chapter();
    const wetX = 24, wetY = h - 26;
    ctx.fillStyle = 'rgba(36, 18, 9, .84)'; ctx.fillRect(wetX, wetY - 18, 164, 12);
    ctx.fillStyle = state.wetness > 70 ? '#bb3926' : state.wetness > 42 ? '#d89036' : '#4e6d38'; ctx.fillRect(wetX, wetY - 18, 164 * state.wetness / 100, 12);
    ctx.fillStyle = '#28150c'; ctx.font = '900 12px system-ui'; ctx.fillText(`wetness ${Math.round(state.wetness)}% · dabs ${state.dabs}`, wetX, wetY + 8);
    if (state.breathActive > 0) {
      ctx.fillStyle = 'rgba(116, 86, 167, .16)'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#6b3aa4'; ctx.font = '900 16px system-ui'; ctx.fillText('Calm Breath active', w - 178, 34);
    }
    if (state.strokeIndex >= c.strokes && !state.sealPlaced) {
      ctx.fillStyle = '#9d2418'; ctx.font = '900 18px system-ui'; ctx.fillText('Stamp the red seal target', w * .5 - 100, 34);
    }
  }

  function update(dt) {
    if (!state.running || state.paused || state.gameOver) return;
    state.elapsed = (performance.now() - state.startedAt) / 1000;
    state.wetness = Math.min(100, state.wetness + dt * (state.brush === 'loaded' ? 3.6 : 2.1));
    if (state.wetness > 76) state.blot = Math.min(100, state.blot + dt * (state.breathActive > 0 ? .18 : .42));
    for (const b of state.blots) b.r += dt * (state.breathActive > 0 ? 1.2 : 4.5);
    for (const p of state.particles) { p.x += p.vx; p.y += p.vy; p.life -= dt * 1.8; }
    state.particles = state.particles.filter((p) => p.life > 0);
    if (state.breathActive > 0) state.breathActive = Math.max(0, state.breathActive - dt);
    if (state.elapsed > 260 && state.chapterIndex < 2) {
      state.hearts = 0; showResults(false);
    }
    checkFailure();
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000);
    last = now;
    update(dt); render(); updateUI(false);
    requestAnimationFrame(frame);
  }

  function updateUI(full = true) {
    ui.score.textContent = String(state.score);
    ui.best.textContent = String(state.best);
    ui.hearts.textContent = '◆'.repeat(state.hearts) + '◇'.repeat(Math.max(0, 3 - state.hearts));
    ui.blot.textContent = `${Math.round(state.blot)}%`;
    ui.combo.textContent = `×${state.combo.toFixed(1)}`;
    ui.brushMode.textContent = state.brush === 'fine' ? 'Fine' : 'Loaded';
    ui.time.textContent = `${Math.floor(state.elapsed / 60)}:${String(Math.floor(state.elapsed % 60)).padStart(2, '0')}`;
    const c = chapter();
    ui.chapter.textContent = c.name;
    ui.objective.textContent = c.desc;
    ui.strokeGoal.textContent = `${Math.min(state.strokeIndex, c.strokes)}/${c.strokes} strokes`;
    ui.sealGoal.textContent = state.sealPlaced ? 'seal placed' : state.strokeIndex >= c.strokes ? 'seal ready' : 'seal waiting';
    ui.blotGoal.textContent = `blot ≤ ${c.blotLimit}%`;
    ui.breathGoal.textContent = `Calm Breath ${Math.round(state.breath)}%`;
    ui.helper.textContent = `${state.message} · Wetness ${Math.round(state.wetness)}% · ${state.dabs} dabs left.`;
    ui.fineBtn.classList.toggle('selected', state.brush === 'fine' && !state.sealMode);
    ui.loadedBtn.classList.toggle('selected', state.brush === 'loaded' && !state.sealMode);
    ui.breathBtn.textContent = `Calm Breath ${Math.round(state.breath)}% Shift`;
    ui.bestLine.textContent = `Best score: ${state.best}`;
    if (full) render();
  }

  function pauseToggle(force) {
    if (!state.running || state.gameOver) return;
    state.paused = typeof force === 'boolean' ? force : !state.paused;
    ui.pauseOverlay.classList.toggle('show', state.paused);
    state.message = state.paused ? 'Paused.' : 'Ink moving again.';
    updateUI();
  }

  function start() {
    initAudio();
    ui.menuOverlay.classList.remove('show');
    ui.resultOverlay.classList.remove('show');
    ui.pauseOverlay.classList.remove('show');
    resetRun();
    tone(330, .08, 'triangle', .035); setTimeout(() => tone(500, .1, 'sine', .03), 90);
  }

  canvas.addEventListener('pointerdown', startStroke);
  canvas.addEventListener('pointermove', moveStroke);
  canvas.addEventListener('pointerup', endStroke);
  canvas.addEventListener('pointercancel', endStroke);
  canvas.addEventListener('touchstart', startStroke, { passive: false });
  canvas.addEventListener('touchmove', moveStroke, { passive: false });
  canvas.addEventListener('touchend', endStroke, { passive: false });

  $('startBtn').addEventListener('click', start);
  $('againBtn').addEventListener('click', start);
  $('restartBtn').addEventListener('click', start);
  $('fineBtn').addEventListener('click', () => setBrush('fine'));
  $('loadedBtn').addEventListener('click', () => setBrush('loaded'));
  $('dryBtn').addEventListener('click', liftDry);
  $('dabBtn').addEventListener('click', dab);
  $('sealBtn').addEventListener('click', enableSeal);
  $('breathBtn').addEventListener('click', calmBreath);
  $('pauseBtn').addEventListener('click', () => pauseToggle());
  $('resumeBtn').addEventListener('click', () => pauseToggle(false));
  $('muteBtn').addEventListener('click', () => { audio.muted = !audio.muted; $('muteBtn').textContent = audio.muted ? 'Unmute Audio' : 'Mute Audio'; });

  window.addEventListener('keydown', (event) => {
    if (event.key === '1') setBrush('fine');
    if (event.key === '2') setBrush('loaded');
    if (event.key.toLowerCase() === 'd') dab();
    if (event.key.toLowerCase() === 's') enableSeal();
    if (event.key === ' ' || event.key === 'Enter') { if (!state.running) start(); else liftDry(); event.preventDefault(); }
    if (event.key === 'Shift' || event.key.toLowerCase() === 'b') calmBreath();
    if (event.key.toLowerCase() === 'p') pauseToggle();
    if (event.key.toLowerCase() === 'r') start();
  });

  window.addEventListener('resize', () => { resizeCanvas(); targets = makeTargets(); render(); });
  resizeCanvas(); targets = makeTargets(); updateUI(); requestAnimationFrame(frame);
})();
