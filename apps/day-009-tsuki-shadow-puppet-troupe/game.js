(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const stage = $('stage');
  const ctx = stage.getContext('2d');
  const beatCanvas = $('beatCanvas');
  const beatCtx = beatCanvas.getContext('2d');

  const storageKey = 'day009-tsuki-records-v1';
  const lanes = [
    { id: 'far', label: 'FAR', y: 0.27, scale: 0.78, alpha: 0.58, blur: 1.1, color: '#9c8dff', offset: 0.09 },
    { id: 'mid', label: 'MID', y: 0.49, scale: 0.95, alpha: 0.78, blur: 0.45, color: '#a9d5ff', offset: 0.03 },
    { id: 'near', label: 'NEAR', y: 0.72, scale: 1.16, alpha: 1, blur: 0, color: '#ffe0a3', offset: 0 }
  ];
  const poseNames = ['Fox', 'Crane', 'Moon'];
  const poseGlyphs = ['狐', '鶴', '月'];
  const actNames = ['Candle Prologue', 'Fox-Moon Chase', 'Silver Curtain Finale', 'Endless Encore'];
  const puppetNames = ['Kitsune', 'Tsuru', 'Tsuki'];
  const positionLabels = ['left', 'center', 'right'];

  const assets = {
    bg: new Image(), lead: new Image(), icons: new Image()
  };
  assets.bg.src = 'assets/tsuki-theater.png';
  assets.lead.src = 'assets/tsuki-lead-puppet.png';
  assets.icons.src = 'assets/tsuki-icons.png';

  const initialPuppets = () => [
    { name: 'Kitsune', x: 0.28, lane: 1, pose: 0, selected: true, stunned: 0, color: '#10090a' },
    { name: 'Tsuru', x: 0.50, lane: 0, pose: 1, selected: false, stunned: 0, color: '#050812' },
    { name: 'Tsuki', x: 0.72, lane: 2, pose: 2, selected: false, stunned: 0, color: '#0b0712' }
  ];

  let records = loadRecords();
  let state;
  let dragging = null;
  let lastTime = 0;
  let toastTimer = 0;
  let loopStarted = false;

  function loadRecords() {
    try {
      return Object.assign({ bestScore: 0, bestOvation: null, bestStreak: 0, bestEncore: 0, charms: 0, stamps: [] }, JSON.parse(localStorage.getItem(storageKey) || '{}'));
    } catch {
      return { bestScore: 0, bestOvation: null, bestStreak: 0, bestEncore: 0, charms: 0, stamps: [] };
    }
  }

  function saveRecords() {
    localStorage.setItem(storageKey, JSON.stringify(records));
    refreshTitleRecords();
  }

  function createState() {
    return {
      status: 'title',
      running: false,
      score: 0,
      lanterns: 3,
      focus: 100,
      combo: 1,
      streak: 0,
      bestRunStreak: 0,
      perfectCues: 0,
      act: 0,
      actCueCount: 0,
      elapsed: 0,
      freeze: 0,
      freezeActive: 0,
      ovation: false,
      ovationBanner: 0,
      charmsCollected: 0,
      encoreAct: 0,
      targetIndex: 0,
      targetTimer: 0,
      targetDuration: 7.2,
      beatPeriod: 2.65,
      target: null,
      hazards: [],
      charms: [],
      particles: [],
      puppets: initialPuppets(),
      tangleLane: -1,
      tangleTimer: 0,
      seed: 9009
    };
  }

  function seeded() {
    state.seed = (state.seed * 1664525 + 1013904223) >>> 0;
    return state.seed / 4294967296;
  }

  function startGame() {
    state = createState();
    state.status = 'playing';
    state.running = true;
    $('titleScreen').classList.add('hidden');
    $('pauseOverlay').classList.add('hidden');
    $('resultOverlay').classList.add('hidden');
    createTarget(true);
    toast('Candle Prologue begins: select, slide, pose, cue!');
    if (!loopStarted) {
      loopStarted = true;
      requestAnimationFrame(frame);
    }
  }

  function createTarget(opening = false) {
    const act = state.act;
    const count = opening || (act === 0 && state.actCueCount < 3) ? 2 : 3;
    const tempo = Math.max(1.35, 2.65 - act * 0.28 - state.encoreAct * 0.08);
    const duration = Math.max(4.1, 7.4 - act * 0.85 - state.encoreAct * 0.22);
    const req = [];
    const order = [0, 1, 2].sort(() => seeded() - 0.5);
    for (let i = 0; i < count; i += 1) {
      const puppet = opening ? i : order[i];
      const lane = opening ? (i === 0 ? 1 : 0) : Math.floor(seeded() * 3);
      const pose = opening ? i : Math.floor(seeded() * 3);
      const pos = opening ? i : Math.floor(seeded() * 3);
      req.push({ puppet, lane, pose, pos });
    }
    if (act >= 2 && req.length === 3) {
      req[0].lane = 2;
      req[1].lane = 1;
      req[2].lane = 0;
    }
    state.target = {
      name: actNames[Math.min(act, 3)],
      req,
      orderText: req.slice().sort((a, b) => b.lane - a.lane).map((r) => `${lanes[r.lane].label}:${puppetNames[r.puppet]}`).join(' › '),
      serial: state.targetIndex++
    };
    state.targetDuration = duration;
    state.beatPeriod = tempo;
    state.targetTimer = 0;
    updateTargetUI();
  }

  function updateTargetUI() {
    $('targetAct').textContent = state.target ? state.target.name : 'Target';
    const recipe = $('targetRecipe');
    recipe.innerHTML = '';
    if (!state.target) return;
    state.target.req.forEach((r) => {
      const chip = document.createElement('span');
      chip.className = `chip need depth-${lanes[r.lane].id}`;
      chip.textContent = `${puppetNames[r.puppet]} ${poseGlyphs[r.pose]} ${lanes[r.lane].label} ${positionLabels[r.pos]}`;
      recipe.appendChild(chip);
    });
    $('helperText').textContent = `Depth order front-to-back: ${state.target.orderText}. ${state.freezeActive > 0 ? 'Moon Freeze active: silver order is highlighted.' : 'Cue when the ring touches silver.'}`;
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000 || 0);
    lastTime = now;
    if (state && state.status === 'playing' && state.running) update(dt);
    draw();
    requestAnimationFrame(frame);
  }

  function update(dt) {
    const slow = state.freezeActive > 0 ? 0.45 : 1;
    state.elapsed += dt;
    state.targetTimer += dt * slow;
    state.focus = Math.max(0, state.focus - dt * (state.act >= 2 ? 1.2 : 0.45) * (state.freezeActive > 0 ? 0.25 : 1));
    state.puppets.forEach((p) => { p.stunned = Math.max(0, p.stunned - dt); });
    if (state.freezeActive > 0) state.freezeActive = Math.max(0, state.freezeActive - dt);
    if (state.tangleTimer > 0) state.tangleTimer = Math.max(0, state.tangleTimer - dt); else state.tangleLane = -1;

    if (state.targetTimer > state.targetDuration) missCue('missed cue window');
    updateHazards(dt * slow);
    updateCharms(dt * slow);
    updateParticles(dt);
    maybeSpawn(dt);
    if (state.focus <= 0 || state.lanterns <= 0) endGame(false);
    updateHUD();
  }

  function maybeSpawn(dt) {
    const hazardRate = state.act === 0 ? 0.10 : state.act === 1 ? 0.32 : 0.46 + state.encoreAct * 0.04;
    if (state.elapsed > 20 && state.freezeActive <= 0 && seeded() < hazardRate * dt) {
      const lane = Math.floor(seeded() * 3);
      state.hazards.push({ lane, x: 0.12 + seeded() * 0.76, timer: 1.55, max: 1.55, type: seeded() < 0.76 ? 'ink' : 'tangle' });
    }
    const charmRate = 0.21 + state.act * 0.05;
    if (seeded() < charmRate * dt) {
      const lane = Math.floor(seeded() * 3);
      state.charms.push({ lane, x: seeded() < 0.5 ? -0.08 : 1.08, y: lanes[lane].y - 0.05 + seeded() * 0.1, vx: (seeded() < 0.5 ? 1 : -1) * (0.045 + state.act * 0.01), phase: seeded() * 6.28 });
    }
  }

  function updateHazards(dt) {
    for (let i = state.hazards.length - 1; i >= 0; i -= 1) {
      const h = state.hazards[i];
      h.timer -= dt;
      if (h.timer <= 0.35 && !h.struck) {
        h.struck = true;
        const hit = state.puppets.find((p) => p.lane === h.lane && Math.abs(p.x - h.x) < 0.15);
        if (hit) {
          if (h.type === 'ink') {
            hit.stunned = 1.15;
            state.focus = Math.max(0, state.focus - 18);
            state.combo = 1;
            burst(hit.x, lanes[hit.lane].y, '#050507', 15);
            toast(`Ink blot struck ${hit.name}!`);
          } else {
            state.tangleLane = h.lane;
            state.tangleTimer = 2.25;
            toast(`${lanes[h.lane].label} strings tangled: depth swap blocked.`);
          }
        }
      }
      if (h.timer <= 0) state.hazards.splice(i, 1);
    }
  }

  function updateCharms(dt) {
    for (let i = state.charms.length - 1; i >= 0; i -= 1) {
      const c = state.charms[i];
      const gust = state.act >= 2 ? Math.sin(state.elapsed * 1.8 + c.phase) * 0.018 : 0;
      c.x += c.vx + gust * dt;
      c.y += Math.sin(state.elapsed * 2 + c.phase) * 0.0007;
      const collector = state.puppets.find((p) => p.lane === c.lane && Math.abs(p.x - c.x) < 0.08 && Math.abs(lanes[p.lane].y - c.y) < 0.09);
      if (collector) {
        const aligned = targetScore().matched >= Math.max(1, state.target.req.length - 1);
        state.score += aligned ? 90 : 35;
        state.freeze = Math.min(100, state.freeze + (aligned ? 12 : 6));
        state.charmsCollected += 1;
        records.charms = Math.max(records.charms || 0, state.charmsCollected);
        burst(c.x, c.y, '#f8dfaa', 12);
        state.charms.splice(i, 1);
      } else if (c.x < -0.18 || c.x > 1.18) {
        state.charms.splice(i, 1);
      }
    }
  }

  function updateParticles(dt) {
    for (let i = state.particles.length - 1; i >= 0; i -= 1) {
      const p = state.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += dt * 0.08;
      if (p.life <= 0) state.particles.splice(i, 1);
    }
  }

  function targetScore() {
    let matched = 0;
    let perfect = 0;
    const details = [];
    state.target.req.forEach((r) => {
      const p = state.puppets[r.puppet];
      const pos = p.x < 0.38 ? 0 : p.x > 0.62 ? 2 : 1;
      const poseOk = p.pose === r.pose;
      const laneOk = p.lane === r.lane;
      const posOk = Math.abs(pos - r.pos) === 0 || Math.abs(p.x - [0.28, 0.5, 0.72][r.pos]) < 0.14;
      const ok = poseOk && laneOk && posOk && p.stunned <= 0;
      if (ok) matched += 1;
      if (ok && Math.abs(p.x - [0.28, 0.5, 0.72][r.pos]) < 0.07) perfect += 1;
      details.push({ ok, poseOk, laneOk, posOk });
    });
    return { matched, perfect, details };
  }

  function beatPhase() {
    const laneOffset = lanes[state.puppets.find((p) => p.selected)?.lane || 1].offset;
    return ((state.targetTimer + laneOffset) % state.beatPeriod) / state.beatPeriod;
  }

  function inCueWindow() {
    const phase = beatPhase();
    const width = state.act === 0 ? 0.17 : state.act === 1 ? 0.13 : 0.105;
    return Math.min(Math.abs(phase - 0.83), Math.abs(phase + 0.17)) <= width;
  }

  function cueScene() {
    if (!state || state.status !== 'playing' || !state.running) return;
    const timing = inCueWindow();
    const score = targetScore();
    const needed = state.target.req.length;
    const all = score.matched === needed;
    const exact = all && score.perfect === needed && timing;
    if (all && timing) {
      const comboTier = Math.min(5, state.combo);
      const gained = (exact ? 210 : 110) * comboTier + 45 * needed;
      state.score += gained;
      state.combo = Math.min(9, state.combo + 1);
      state.streak += 1;
      state.bestRunStreak = Math.max(state.bestRunStreak, state.streak);
      if (exact) state.perfectCues += 1;
      state.freeze = Math.min(100, state.freeze + (exact ? 14 : 8));
      state.actCueCount += 1;
      burst(0.5, 0.45, exact ? '#d9efff' : '#ffbd5c', exact ? 35 : 20);
      toast(`${exact ? 'Perfect' : 'Good'} scene +${gained}!`);
      advanceActIfReady();
      createTarget(false);
    } else if (score.matched >= Math.max(1, needed - 1) && timing) {
      state.score += 110;
      state.combo = 1;
      state.focus = Math.max(0, state.focus - 5);
      burst(0.5, 0.45, '#a9d5ff', 12);
      toast('Partial silhouette held. +110, but combo reset.');
      createTarget(false);
    } else {
      missCue(timing ? 'silhouette mismatch' : 'off-beat cue');
    }
    updateTargetUI();
  }

  function missCue(reason) {
    state.lanterns -= 1;
    state.focus = Math.max(0, state.focus - 10);
    state.combo = 1;
    state.streak = 0;
    burst(0.5, 0.45, '#df5645', 16);
    toast(`Audience lantern dims: ${reason}.`);
    createTarget(false);
  }

  function advanceActIfReady() {
    const thresholds = [5, 7, 8];
    if (state.act < 3 && state.actCueCount >= thresholds[state.act]) {
      state.score += 380;
      state.lanterns = Math.min(3, state.lanterns + 1);
      state.act += 1;
      state.actCueCount = 0;
      if (state.act < 3) toast(`${actNames[state.act]} opens! +380`);
    }
    if (!state.ovation && state.act >= 3 && state.score >= 2500) {
      state.ovation = true;
      state.ovationBanner = 4.0;
      state.score += 850;
      records.bestOvation = records.bestOvation ? Math.min(records.bestOvation, state.elapsed) : state.elapsed;
      toast('Tsuki Full-Moon Ovation! Endless encore continues.');
    }
    if (state.act >= 3 && state.actCueCount >= 6) {
      state.encoreAct += 1;
      state.actCueCount = 0;
      state.score += 380;
      records.bestEncore = Math.max(records.bestEncore || 0, state.encoreAct);
      toast(`Encore act ${state.encoreAct}! +380`);
    }
  }

  function activateFreeze() {
    if (!state || state.status !== 'playing' || state.freeze < 100) return;
    state.freeze = 0;
    state.freezeActive = 5.2;
    state.hazards.length = 0;
    burst(0.5, 0.28, '#d9efff', 42);
    toast('Moon Freeze: timing slowed, ink suspended, depth order revealed.');
    updateTargetUI();
  }

  function endGame(won) {
    state.status = 'over';
    state.running = false;
    records.bestScore = Math.max(records.bestScore || 0, state.score);
    records.bestStreak = Math.max(records.bestStreak || 0, state.bestRunStreak);
    const stamps = new Set(records.stamps || []);
    if (state.act > 0 && state.lanterns === 3) stamps.add('Lantern Keeper');
    if (state.perfectCues >= 15) stamps.add('Fifteen Perfect Cues');
    if (state.ovation && state.elapsed < 175) stamps.add('Swift Full Moon');
    if (state.charmsCollected >= 30) stamps.add('Charm Collector');
    if (state.act >= 1 && state.streak >= 5) stamps.add('Candle Clean Run');
    records.stamps = Array.from(stamps);
    saveRecords();
    $('resultTitle').textContent = won || state.ovation ? 'Tsuki Curtain Call' : 'Lanterns Fade';
    $('resultStats').innerHTML = [
      ['Final score', state.score],
      ['Best score', records.bestScore],
      ['Act reached', actNames[Math.min(state.act, 3)]],
      ['Ovation', state.ovation ? formatTime(state.elapsed) : 'not yet'],
      ['Perfect streak', state.bestRunStreak],
      ['Charms', state.charmsCollected]
    ].map(([k, v]) => `<div><strong>${k}</strong><br>${v}</div>`).join('');
    $('badgesEarned').innerHTML = records.stamps.length ? records.stamps.map((s) => `<span>${s}</span>`).join('') : '<span>Practice stamp: First Curtain</span>';
    $('resultOverlay').classList.remove('hidden');
  }

  function updateHUD() {
    $('score').textContent = String(Math.floor(state.score));
    $('bestScore').textContent = String(records.bestScore || 0);
    $('lanterns').textContent = '🏮'.repeat(Math.max(0, state.lanterns)) + '◦'.repeat(Math.max(0, 3 - state.lanterns));
    $('actName').textContent = state.act >= 3 ? `Encore ${state.encoreAct}` : actNames[state.act];
    $('combo').textContent = `x${state.combo}`;
    $('focus').textContent = `${Math.round(state.focus)}%`;
    $('elapsed').textContent = formatTime(state.elapsed);
    $('freezeMeter').textContent = state.freezeActive > 0 ? 'FREEZE' : `${Math.round(state.freeze)}%`;
    $('freezeBtn').disabled = state.freeze < 100 && state.freezeActive <= 0;
    $('beatText').textContent = inCueWindow() ? 'CUE NOW' : 'wait for silver';
    if (state.ovationBanner > 0) state.ovationBanner = Math.max(0, state.ovationBanner - 1 / 60);
  }

  function refreshTitleRecords() {
    $('bestScoreTitle').textContent = String(records.bestScore || 0);
    $('bestOvationTitle').textContent = records.bestOvation ? formatTime(records.bestOvation) : '--';
  }

  function formatTime(sec) {
    const s = Math.max(0, Math.floor(sec));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  function toast(text) {
    const el = $('toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  function burst(x, y, color, n) {
    for (let i = 0; i < n; i += 1) {
      state.particles.push({ x, y, color, life: 0.45 + seeded() * 0.55, vx: (seeded() - 0.5) * 0.42, vy: (seeded() - 0.7) * 0.42, size: 3 + seeded() * 8 });
    }
  }

  function selectPuppet(index) {
    state.puppets.forEach((p, i) => { p.selected = i === index; });
  }
  function selectedIndex() { return Math.max(0, state.puppets.findIndex((p) => p.selected)); }
  function selectedPuppet() { return state.puppets[selectedIndex()]; }

  function moveSelected(dx) {
    const p = selectedPuppet();
    p.x = Math.max(0.12, Math.min(0.88, p.x + dx));
  }

  function setPose(deltaOrPose, absolute = false) {
    const p = selectedPuppet();
    p.pose = absolute ? deltaOrPose : (p.pose + deltaOrPose + 3) % 3;
    toast(`${p.name} pose: ${poseNames[p.pose]}`);
    updateTargetUI();
  }

  function shiftDepth(dir) {
    const p = selectedPuppet();
    const next = Math.max(0, Math.min(2, p.lane + dir));
    if (next === p.lane) return;
    if (state.tangleLane === p.lane || state.tangleLane === next) {
      toast('Tangled strings block that depth swap.');
      return;
    }
    p.lane = next;
    toast(`${p.name} moved to ${lanes[p.lane].label}.`);
    updateTargetUI();
  }

  function canvasPoint(evt) {
    const r = stage.getBoundingClientRect();
    const client = evt.touches ? evt.touches[0] : evt;
    return { x: (client.clientX - r.left) / r.width, y: (client.clientY - r.top) / r.height };
  }

  function pointerDown(evt) {
    if (!state || state.status !== 'playing') return;
    const pt = canvasPoint(evt);
    let best = -1;
    let dist = Infinity;
    state.puppets.forEach((p, i) => {
      const d = Math.hypot(pt.x - p.x, pt.y - (lanes[p.lane].y + 0.085));
      if (d < dist) { dist = d; best = i; }
    });
    if (best >= 0 && dist < 0.16) {
      selectPuppet(best);
      dragging = best;
      stage.classList.add('dragging');
      evt.preventDefault();
    }
  }

  function pointerMove(evt) {
    if (dragging == null || !state) return;
    const pt = canvasPoint(evt);
    state.puppets[dragging].x = Math.max(0.12, Math.min(0.88, pt.x));
    evt.preventDefault();
  }

  function pointerUp() {
    dragging = null;
    stage.classList.remove('dragging');
  }

  function pauseToggle(force) {
    if (!state || state.status !== 'playing') return;
    const pause = force === undefined ? state.running : force;
    state.running = !pause;
    $('pauseOverlay').classList.toggle('hidden', state.running);
  }

  function draw() {
    const w = stage.width;
    const h = stage.height;
    ctx.clearRect(0, 0, w, h);
    drawBackground(w, h);
    if (!state) return;
    drawTargetGhosts(w, h);
    drawHazards(w, h);
    drawCharms(w, h);
    const sorted = state.puppets.map((p, i) => ({ p, i })).sort((a, b) => a.p.lane - b.p.lane);
    sorted.forEach(({ p, i }) => drawPuppet(p, i, w, h));
    drawParticles(w, h);
    drawCurtainEffects(w, h);
    drawBeat();
  }

  function drawBackground(w, h) {
    if (assets.bg.complete && assets.bg.naturalWidth) {
      const img = assets.bg;
      const scale = Math.max(w / img.width, h / img.height);
      const iw = img.width * scale;
      const ih = img.height * scale;
      ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#0b1235'); g.addColorStop(.45, '#e8d0a9'); g.addColorStop(1, '#08091b');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }
    ctx.fillStyle = 'rgba(3,5,15,.28)';
    ctx.fillRect(0, 0, w, h);
    lanes.forEach((lane) => {
      const y = lane.y * h;
      ctx.save();
      ctx.globalAlpha = 0.58;
      ctx.strokeStyle = lane.color;
      ctx.lineWidth = 7 * lane.scale;
      ctx.shadowColor = lane.color;
      ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.moveTo(w * .07, y); ctx.lineTo(w * .93, y); ctx.stroke();
      ctx.restore();
    });
    ctx.fillStyle = 'rgba(6,8,25,.38)';
    ctx.fillRect(0, h * .02, w, h * .07);
  }

  function drawTargetGhosts(w, h) {
    if (!state.target) return;
    ctx.save();
    ctx.globalAlpha = state.freezeActive > 0 ? .42 : .22;
    state.target.req.forEach((r) => {
      const x = [0.28, 0.5, 0.72][r.pos] * w;
      const y = lanes[r.lane].y * h - 46 * lanes[r.lane].scale;
      ctx.strokeStyle = lanes[r.lane].color;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 7]);
      ctx.beginPath(); ctx.arc(x, y, 33 * lanes[r.lane].scale, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = lanes[r.lane].color;
      ctx.font = `900 ${24 * lanes[r.lane].scale}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(poseGlyphs[r.pose], x, y);
    });
    ctx.restore();
  }

  function drawPuppet(p, index, w, h) {
    const lane = lanes[p.lane];
    const x = p.x * w;
    const y = lane.y * h;
    const s = lane.scale;
    ctx.save();
    ctx.globalAlpha = lane.alpha * (p.stunned > 0 ? 0.55 : 1);
    ctx.filter = lane.blur ? `blur(${lane.blur}px)` : 'none';
    ctx.strokeStyle = '#6b421d';
    ctx.lineWidth = 5 * s;
    ctx.beginPath(); ctx.moveTo(x, y + 15 * s); ctx.lineTo(x - 18 * s, y + 102 * s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 8 * s, y + 7 * s); ctx.lineTo(x + 26 * s, y + 105 * s); ctx.stroke();
    ctx.fillStyle = p.color;
    ctx.shadowColor = '#000'; ctx.shadowBlur = 18 * s;
    drawPoseShape(ctx, p.pose, x, y - 36 * s, 42 * s, lane.color);
    ctx.filter = 'none';
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.fillStyle = p.selected ? '#ffbd5c' : '#1b1730';
    ctx.strokeStyle = p.selected ? '#fff2c5' : lane.color;
    ctx.lineWidth = p.selected ? 4 : 2;
    roundRect(ctx, x - 39 * s, y + 78 * s, 78 * s, 44 * s, 16 * s);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = p.selected ? '#1a0d06' : '#f3dfbd';
    ctx.font = `900 ${12 * s}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`${p.name}`, x, y + 94 * s);
    ctx.fillText(`${poseGlyphs[p.pose]} ${lane.label}`, x, y + 109 * s);
    if (p.stunned > 0) {
      ctx.fillStyle = '#df5645';
      ctx.font = `900 ${18 * s}px sans-serif`;
      ctx.fillText('STUN', x, y - 88 * s);
    }
    ctx.restore();
  }

  function drawPoseShape(c, pose, x, y, r, accent) {
    c.save();
    c.fillStyle = '#050505';
    c.strokeStyle = accent;
    c.lineWidth = Math.max(2, r * 0.07);
    c.beginPath();
    if (pose === 0) {
      c.moveTo(x - r * .7, y + r * .25); c.quadraticCurveTo(x - r * .45, y - r * .9, x + r * .45, y - r * .45); c.lineTo(x + r * .72, y - r * .72); c.lineTo(x + r * .65, y - r * .28); c.quadraticCurveTo(x + r * .95, y + r * .15, x + r * .33, y + r * .45); c.quadraticCurveTo(x - r * .15, y + r * .66, x - r * .7, y + r * .25);
    } else if (pose === 1) {
      c.moveTo(x - r * .9, y + r * .1); c.quadraticCurveTo(x - r * .25, y - r, x + r * .78, y - r * .2); c.quadraticCurveTo(x + r * .05, y - r * .15, x + r * .55, y + r * .75); c.quadraticCurveTo(x, y + r * .35, x - r * .55, y + r * .72); c.quadraticCurveTo(x - r * .25, y + r * .18, x - r * .9, y + r * .1);
    } else {
      c.arc(x, y, r * .58, 0, Math.PI * 2);
      c.moveTo(x - r * .05, y - r * .82); c.lineTo(x + r * .22, y - r * .23); c.lineTo(x - r * .25, y - r * .23); c.lineTo(x + r * .07, y + r * .72);
    }
    c.closePath(); c.fill(); c.stroke();
    c.fillStyle = accent;
    c.font = `900 ${r * .48}px serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(poseGlyphs[pose], x, y);
    c.restore();
  }

  function drawHazards(w, h) {
    state.hazards.forEach((haz) => {
      const lane = lanes[haz.lane];
      const x = haz.x * w;
      const y = lane.y * h - 42 * lane.scale;
      const pulse = 1 + Math.sin(haz.timer * 18) * 0.08;
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = haz.type === 'ink' ? '#050505' : '#220a1a';
      ctx.strokeStyle = haz.type === 'ink' ? '#df5645' : '#ffbd5c';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, y, 26 * lane.scale * pulse, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f3dfbd'; ctx.font = `900 ${11 * lane.scale}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(haz.type === 'ink' ? 'INK' : 'TANGLE', x, y);
      ctx.restore();
    });
  }

  function drawCharms(w, h) {
    state.charms.forEach((c) => {
      ctx.save();
      ctx.translate(c.x * w, c.y * h);
      ctx.rotate(Math.sin(state.elapsed * 3 + c.phase) * 0.18);
      ctx.fillStyle = '#f6e7bd'; ctx.strokeStyle = '#df5645'; ctx.lineWidth = 2;
      roundRect(ctx, -11, -15, 22, 30, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#df5645'; ctx.font = '900 12px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('福', 0, 1);
      ctx.restore();
    });
  }

  function drawParticles(w, h) {
    state.particles.forEach((p) => {
      ctx.save(); ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    });
  }

  function drawCurtainEffects(w, h) {
    if (state.freezeActive > 0) {
      ctx.save(); ctx.globalAlpha = .22 + Math.sin(state.elapsed * 8) * .05; ctx.fillStyle = '#d9efff'; ctx.fillRect(0, 0, w, h); ctx.restore();
    }
    if (state.ovationBanner > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, state.ovationBanner / 1.2);
      ctx.fillStyle = 'rgba(4,6,18,.45)'; ctx.fillRect(0, 0, w, h);
      const g = ctx.createRadialGradient(w/2, h*.31, 10, w/2, h*.31, w*.38);
      g.addColorStop(0, '#fff9d0'); g.addColorStop(1, 'rgba(217,239,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(w/2, h*.31, w*.38, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff4cf'; ctx.font = `900 ${Math.max(28, w*.065)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Tsuki Full-Moon Ovation!', w/2, h*.32);
      ctx.restore();
    }
  }

  function drawBeat() {
    const w = beatCanvas.width, h = beatCanvas.height, r = 35;
    beatCtx.clearRect(0, 0, w, h);
    beatCtx.save(); beatCtx.translate(w/2, h/2);
    beatCtx.strokeStyle = 'rgba(243,223,189,.24)'; beatCtx.lineWidth = 8; beatCtx.beginPath(); beatCtx.arc(0,0,r,0,Math.PI*2); beatCtx.stroke();
    beatCtx.strokeStyle = '#d9efff'; beatCtx.lineWidth = 10; beatCtx.beginPath(); beatCtx.arc(0,0,r,-Math.PI*.44,Math.PI*.04); beatCtx.stroke();
    const phase = state ? beatPhase() : 0;
    beatCtx.rotate(phase * Math.PI * 2 - Math.PI/2);
    beatCtx.fillStyle = inCueWindow() ? '#ffbd5c' : '#f3dfbd';
    beatCtx.beginPath(); beatCtx.arc(r,0,8,0,Math.PI*2); beatCtx.fill();
    beatCtx.restore();
    beatCtx.fillStyle = inCueWindow() ? '#ffbd5c' : '#d9efff'; beatCtx.font = '900 13px sans-serif'; beatCtx.textAlign = 'center'; beatCtx.textBaseline = 'middle'; beatCtx.fillText(inCueWindow() ? 'CUE' : 'BEAT', w/2, h/2);
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r); c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h); c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r); c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
  }

  $('startBtn').addEventListener('click', startGame);
  $('posePrevBtn').addEventListener('click', () => setPose(-1));
  $('poseNextBtn').addEventListener('click', () => setPose(1));
  $('farBtn').addEventListener('click', () => shiftDepth(-1));
  $('nearBtn').addEventListener('click', () => shiftDepth(1));
  $('cueBtn').addEventListener('click', cueScene);
  $('freezeBtn').addEventListener('click', activateFreeze);
  $('pauseBtn').addEventListener('click', () => pauseToggle());
  $('resumeBtn').addEventListener('click', () => pauseToggle(false));
  $('restartBtn').addEventListener('click', startGame);
  $('restartPauseBtn').addEventListener('click', startGame);
  $('restartResultBtn').addEventListener('click', startGame);
  stage.addEventListener('pointerdown', pointerDown);
  stage.addEventListener('pointermove', pointerMove);
  stage.addEventListener('pointerup', pointerUp);
  stage.addEventListener('pointercancel', pointerUp);
  window.addEventListener('keydown', (evt) => {
    if (!state || state.status !== 'playing') return;
    const k = evt.key.toLowerCase();
    if ([' ', 'enter'].includes(k)) { evt.preventDefault(); cueScene(); }
    else if (k === 'p') pauseToggle();
    else if (k === 'r') startGame();
    else if (k === 'a' || k === 'arrowleft') moveSelected(-0.035);
    else if (k === 'd' || k === 'arrowright') moveSelected(0.035);
    else if (k === 'w' || k === 'arrowup') shiftDepth(-1);
    else if (k === 's' || k === 'arrowdown') shiftDepth(1);
    else if (k === 'q') selectPuppet((selectedIndex() + 2) % 3);
    else if (k === 'e') selectPuppet((selectedIndex() + 1) % 3);
    else if (k === 'z' || k === '1') setPose(0, true);
    else if (k === 'x' || k === '2') setPose(1, true);
    else if (k === 'c' || k === '3') setPose(2, true);
    else if (k === 'shift' || k === 'm') activateFreeze();
  });

  refreshTitleRecords();
  state = createState();
  updateHUD();
  draw();
})();
