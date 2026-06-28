(() => {
  'use strict';

  const DAY_SEED = 17017;
  const layers = [
    { name: 'far', key: 0, color: '#7f93cf', width: 3.4, alpha: 0.54, y: -12 },
    { name: 'mid', key: 1, color: '#dff8ff', width: 4.7, alpha: 0.82, y: 0 },
    { name: 'near', key: 2, color: '#fff4ba', width: 6.2, alpha: 0.96, y: 14 }
  ];
  const types = {
    pearl: { color: '#f9f5ff', stroke: '#b8ecff', cup: '#f5efff', score: 55 },
    blue: { color: '#5ed0ff', stroke: '#d5f8ff', cup: '#47b8ff', score: 70 },
    gold: { color: '#ffd15c', stroke: '#fff3b1', cup: '#ffd45e', score: 92 }
  };
  const chapters = [
    { name: 'First Dew Net', title: 'Catch the first pearls', layerMin: 0, targetPearl: 4, targetBlue: 0, targetGold: 0, lanterns: 1, strands: 2, layerNeed: 'mid', integrity: 62, duration: 95 },
    { name: 'Cedar Moon Bridge', title: 'Bridge blue lanterns', layerMin: 0, targetPearl: 3, targetBlue: 3, targetGold: 0, lanterns: 2, strands: 2, layerNeed: 'far', integrity: 66, duration: 115 },
    { name: 'Starfall Festival', title: 'Festival starfall', layerMin: 0, targetPearl: 4, targetBlue: 3, targetGold: 2, lanterns: 3, strands: 3, layerNeed: 'near', integrity: 70, duration: 135 }
  ];

  const $ = (id) => document.getElementById(id);
  const canvas = $('gameCanvas');
  const ctx = canvas.getContext('2d');
  const dummy = { hidden: true, textContent: '', innerHTML: '', disabled: false, addEventListener() {} };
  const ui = {
    menu: $('menu'), pauseOverlay: $('pauseOverlay'), resultOverlay: $('results'), constellation: dummy,
    score: $('score'), best: $('best'), menuBest: dummy, menuTime: dummy, patience: $('patience'), integrity: $('integrity'), layer: $('layer'), combo: $('combo'), time: $('time'), chapter: $('chapterTitle'), commissionTitle: $('chapterTitle'), commissionText: $('chapterText'), progress: $('chips'), helperTitle: dummy, helperText: $('helper'), stageHint: $('toast'), resultStats: $('resultsText'),
    buttons: {
      startButton: $('start'),
      layerDownButton: $('layerDown'),
      layerUpButton: $('layerUp'),
      weaveButton: $('weave'),
      tightenButton: $('tighten'),
      slackenButton: $('slacken'),
      pluckButton: $('pluck'),
      mendButton: $('mend'),
      pauseButton: $('pause'),
      restartButton: $('restart'),
      resumeButton: $('resume'),
      pauseRestartButton: $('restartPause'),
      resultRestartButton: $('restartResults')
    }
  };

  const storage = {
    best: 'day017.kumo.bestScore',
    bestTime: 'day017.kumo.bestMoonwebTime',
    streak: 'day017.kumo.cleanStreak',
    endless: 'day017.kumo.endlessBest',
    pluck: 'day017.kumo.pluckBest',
    integrity: 'day017.kumo.integrityBest',
    badges: 'day017.kumo.badges',
    fills: 'day017.kumo.lanternFills'
  };

  let rand = mulberry32(DAY_SEED);
  let state = createState();
  let audio = { ctx: null, unlocked: false };
  let lastTime = performance.now();
  let bgImage = new Image();
  bgImage.src = 'assets/kumo-canopy.png';
  let mascotImage = new Image();
  mascotImage.src = 'assets/kumo-webkeeper.png';

  function mulberry32(seed) {
    return function next() {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function createState() {
    const savedBest = Number(localStorage.getItem(storage.best) || 0);
    return {
      status: 'menu', score: 0, best: savedBest, elapsed: 0, commissionElapsed: 0, combo: 1, cleanStreak: 0, bestRunPluck: 0, delivered: 0, filledTotal: Number(localStorage.getItem(storage.fills) || 0), missed: 0,
      integrity: 100, patience: 3, mendCharge: 2, currentLayer: 1, chapterIndex: 0, endlessLevel: 0, constellation: false, constellationTimer: 0, noMendCommission: true,
      anchors: makeAnchors(), strands: [], stars: [], moths: [], particles: [], selectedAnchorA: null, selectedAnchorB: null, selectedStrandId: null, focusIndex: 0,
      nextStarAt: 1.5, nextMothAt: 26, commission: { pearl: 0, blue: 0, gold: 0, lanterns: 0, strands: 0 },
      message: 'Select two anchor knots, choose a layer, then weave.'
    };
  }

  function makeAnchors() {
    const jitter = () => (rand() - 0.5) * 20;
    const raw = [
      ['A', 112, 174, 0], ['B', 310, 136, 1], ['C', 562, 156, 2], ['D', 676, 264, 1],
      ['E', 92, 392, 2], ['F', 252, 356, 0], ['G', 510, 386, 1], ['H', 684, 500, 2],
      ['I', 132, 646, 1], ['J', 354, 606, 2], ['K', 560, 666, 0], ['L', 666, 760, 1]
    ];
    return raw.map(([id, x, y, layer]) => ({ id, x: x + jitter(), y: y + jitter(), layer, radius: 22 }));
  }

  function startRun() {
    ensureAudio();
    rand = mulberry32(DAY_SEED);
    state = createState();
    state.status = 'playing';
    state.strands.push(makeStrand(anchor('E'), anchor('G'), 1, 0.54, true));
    state.strands.push(makeStrand(anchor('B'), anchor('F'), 0, 0.68, true));
    state.message = 'First Dew Net: weave two mid-layer strands and catch pearls.';
    ui.menu.hidden = true;
    ui.resultOverlay.hidden = true;
    ui.pauseOverlay.hidden = true;
    ui.constellation.hidden = true;
    lastTime = performance.now();
    updateUI();
  }

  function anchor(id) { return state.anchors.find(a => a.id === id); }

  function makeStrand(a, b, layer, tension, guide = false) {
    const id = `s${Date.now().toString(36)}${Math.floor(rand() * 99999).toString(36)}`;
    return { id, a: a.id, b: b.id, layer, tension, fray: guide ? 0 : 0.02, held: [], guide, pulse: 0, mended: false };
  }

  function ensureAudio() {
    if (audio.unlocked) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) { audio.unlocked = true; return; }
    try {
      audio.ctx = audio.ctx || new AudioContext();
      if (audio.ctx.state === 'suspended') audio.ctx.resume().catch(() => {});
      audio.unlocked = true;
    } catch (_) { audio.unlocked = true; audio.ctx = null; }
  }

  function tone(kind, value = 0.5) {
    if (!audio.ctx) return;
    const now = audio.ctx.currentTime;
    const gain = audio.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(kind === 'fray' ? 0.08 : 0.14, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === 'constellation' ? 0.9 : 0.26));
    gain.connect(audio.ctx.destination);
    const makeOsc = (freq, type, offset = 0) => {
      const osc = audio.ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + offset);
      if (kind === 'pluck') osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + offset + 0.12);
      osc.connect(gain);
      osc.start(now + offset);
      osc.stop(now + offset + (kind === 'constellation' ? 0.38 : 0.24));
    };
    if (kind === 'chime') { makeOsc(740, 'sine'); makeOsc(1110, 'triangle', 0.03); }
    else if (kind === 'fray') { makeOsc(105 + value * 40, 'square'); }
    else if (kind === 'constellation') { [523, 659, 784, 1046].forEach((f, i) => makeOsc(f, 'triangle', i * 0.12)); }
    else { makeOsc(220 + value * 420, 'triangle'); }
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const w = Math.max(320, Math.floor(rect.width * dpr));
    const h = Math.max(320, Math.floor(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    ctx.setTransform(w / 780, 0, 0, h / 980, 0, 0);
  }

  function loop(now) {
    resizeCanvas();
    const dt = Math.min(0.05, (now - lastTime) / 1000 || 0);
    lastTime = now;
    if (state.status === 'playing') update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  function update(dt) {
    state.elapsed += dt;
    state.commissionElapsed += dt;
    state.nextStarAt -= dt;
    state.nextMothAt -= dt;
    if (state.nextStarAt <= 0) spawnStar();
    if (state.nextMothAt <= 0) spawnMoth();
    updateStars(dt);
    updateMoths(dt);
    updateParticles(dt);
    state.strands.forEach(s => { s.pulse = Math.max(0, s.pulse - dt * 2.2); });
    if (state.constellationTimer > 0) {
      state.constellationTimer -= dt;
      if (state.constellationTimer <= 0) ui.constellation.hidden = true;
    }
    const chapter = currentChapter();
    if (state.commissionElapsed > chapter.duration + state.endlessLevel * 16) {
      damageIntegrity(12, 'Night timer expired for this commission.');
      state.patience -= 1;
      resetCommission(false);
    }
    checkCommission();
    if (state.integrity <= 0 || state.patience <= 0 || state.missed >= 16) endRun('The moonweb faded before the lanterns were filled.');
    updateUI();
  }

  function currentChapter() {
    if (state.chapterIndex < chapters.length) return chapters[state.chapterIndex];
    const n = state.endlessLevel;
    return { name: `Endless Night ${n + 1}`, title: 'Night commission', targetPearl: 3 + n, targetBlue: 3 + Math.floor(n / 2), targetGold: 2 + Math.floor(n / 3), lanterns: 3 + Math.floor(n / 2), strands: 2 + (n % 3), layerNeed: layers[n % 3].name, integrity: Math.min(88, 72 + n * 2), duration: Math.max(90, 125 - n * 3) };
  }

  function spawnStar() {
    const chapter = currentChapter();
    const depthChoices = state.chapterIndex === 0 ? [1, 1, 0] : [0, 1, 2, 1, 2];
    const layer = depthChoices[Math.floor(rand() * depthChoices.length)];
    const typeRoll = rand();
    const type = state.chapterIndex === 0 ? 'pearl' : (typeRoll < 0.48 ? 'pearl' : typeRoll < 0.8 ? 'blue' : 'gold');
    state.stars.push({ id: `d${performance.now()}${rand()}`, x: 96 + rand() * 588, y: -26, vx: (rand() - 0.5) * 36, vy: 68 + state.endlessLevel * 6 + rand() * 22, r: type === 'gold' ? 12 : 10, type, layer, heldBy: null, holdT: 0, usefulRelease: false, trail: [] });
    const pace = Math.max(0.58, 1.55 - state.elapsed / 250 - state.endlessLevel * 0.06);
    state.nextStarAt = pace + rand() * (state.chapterIndex === 0 ? 1.1 : 0.72);
  }

  function spawnMoth() {
    if (state.elapsed < 40 && state.chapterIndex === 0) { state.nextMothAt = 18; return; }
    const layer = Math.floor(rand() * 3);
    const y = 160 + rand() * 570;
    const left = rand() < 0.5;
    state.moths.push({ x: left ? -44 : 824, y, vx: left ? 46 + rand() * 28 : -46 - rand() * 28, layer, wing: rand() * Math.PI, warned: 1.4, hit: new Set() });
    state.nextMothAt = Math.max(8, 22 - state.endlessLevel * 1.3 - state.elapsed / 80) + rand() * 10;
  }

  function updateStars(dt) {
    for (const star of state.stars) {
      star.trail.unshift({ x: star.x, y: star.y, a: 0.5 });
      star.trail = star.trail.slice(0, 8);
      if (star.heldBy) {
        const strand = state.strands.find(s => s.id === star.heldBy);
        if (strand) {
          const point = pointOnStrand(strand, star.holdT);
          star.x += (point.x - star.x) * 0.28;
          star.y += (point.y - 10 - star.y) * 0.28;
          strand.held = Array.from(new Set([...strand.held, star.id]));
          if (strand.held.length >= 5 && strand.tension < 0.36) snapStrand(strand, 'An overloaded slack strand snapped.');
        } else { star.heldBy = null; }
        continue;
      }
      star.vy += 52 * dt;
      star.x += star.vx * dt;
      star.y += star.vy * dt;
      star.vx *= 0.998;
      if (star.x < 28 || star.x > 752) star.vx *= -0.85;
      collideStarWithStrands(star);
      checkLantern(star);
    }
    state.stars = state.stars.filter(star => {
      if (star.y < 1020) return true;
      state.missed += 1; state.combo = 1; state.patience = Math.max(0, state.patience - (state.missed % 5 === 0 ? 1 : 0));
      damageIntegrity(6, 'A dew-star fell below the canopy.');
      return false;
    });
  }

  function collideStarWithStrands(star) {
    for (const strand of state.strands) {
      const layerDelta = Math.abs(star.layer - strand.layer);
      if (layerDelta > 1) continue;
      const hit = closestOnStrand(strand, star.x, star.y);
      const reach = 15 + (1 - layerDelta) * 7 + (1 - strand.tension) * 8;
      if (hit.dist > reach) continue;
      const layerBoost = layerDelta === 0 ? 1 : 0.55;
      strand.pulse = 1;
      addParticles(star.x, star.y, types[star.type].color, 6);
      state.score += Math.round(types[star.type].score * state.combo * layerBoost);
      state.cleanStreak += layerDelta === 0 ? 1 : 0;
      state.combo = Math.min(9, state.combo + 0.08 + (layerDelta === 0 ? 0.08 : 0));
      if (strand.tension < 0.48) {
        star.heldBy = strand.id;
        star.holdT = hit.t;
        star.vx = star.vy = 0;
        state.message = `${layers[strand.layer].name} slack silk caught a ${star.type} star. Pluck when cups align.`;
      } else {
        const a = getAnchor(strand.a), b = getAnchor(strand.b);
        const dx = b.x - a.x, dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len, ny = dx / len;
        const direction = star.x < (a.x + b.x) / 2 ? -1 : 1;
        star.vx += (nx * direction * 105 + dx / len * 64) * strand.tension * layerBoost;
        star.vy = -Math.abs(star.vy) * (0.42 + strand.tension * 0.42) + ny * 90;
        star.y = hit.y - star.r - 4;
        state.message = `${layers[strand.layer].name} tight silk rebounded ${star.type} dew on a diagonal arc.`;
      }
      return;
    }
  }

  function checkLantern(star) {
    for (const cup of lanternCups()) {
      const dx = star.x - cup.x, dy = star.y - cup.y;
      if (Math.hypot(dx, dy) < cup.r + star.r && star.type === cup.type) {
        state.score += 145 * Math.ceil(state.combo);
        state.combo = Math.min(10, state.combo + 0.45);
        state.delivered += 1; state.filledTotal += 1;
        state.commission[star.type] += 1; state.commission.lanterns += 1;
        star.y = 1200;
        addParticles(cup.x, cup.y, types[star.type].color, 18);
        tone('chime');
        state.message = `${star.type} dew lit the ${cup.label} lantern cup.`;
      }
    }
  }

  function updateMoths(dt) {
    for (const moth of state.moths) {
      moth.x += moth.vx * dt;
      moth.wing += dt * 9;
      moth.warned = Math.max(0, moth.warned - dt);
      for (const strand of state.strands) {
        if (moth.hit.has(strand.id) || Math.abs(moth.layer - strand.layer) > 0) continue;
        const near = closestOnStrand(strand, moth.x, moth.y);
        if (near.dist < 28) {
          moth.hit.add(strand.id);
          strand.fray = Math.min(1, strand.fray + 0.38);
          strand.tension = Math.max(0.2, strand.tension - 0.14);
          damageIntegrity(8, 'A moon-moth frayed matching-layer silk.');
          addParticles(moth.x, moth.y, '#d9c2ff', 8);
          tone('fray', strand.fray);
          if (state.selectedStrandId === strand.id) updateHelper();
        }
      }
    }
    state.moths = state.moths.filter(m => m.x > -80 && m.x < 860);
  }

  function updateParticles(dt) {
    state.particles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 16 * dt; p.life -= dt; });
    state.particles = state.particles.filter(p => p.life > 0);
  }

  function addParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) state.particles.push({ x, y, vx: (rand() - 0.5) * 160, vy: -30 - rand() * 110, color, life: 0.45 + rand() * 0.55 });
  }

  function damageIntegrity(amount, message) {
    state.integrity = Math.max(0, state.integrity - amount);
    state.message = message;
  }

  function snapStrand(strand, message) {
    strand.held.forEach(id => { const star = state.stars.find(s => s.id === id); if (star) star.heldBy = null; });
    state.strands = state.strands.filter(s => s.id !== strand.id);
    state.selectedStrandId = null;
    state.combo = 1;
    damageIntegrity(14, message);
  }

  function checkCommission() {
    const c = currentChapter();
    const complete = state.commission.pearl >= c.targetPearl && state.commission.blue >= c.targetBlue && state.commission.gold >= c.targetGold && state.commission.lanterns >= c.lanterns && state.commission.strands >= c.strands && state.integrity >= c.integrity;
    if (!complete) return;
    state.score += 460 + (state.noMendCommission ? 540 : 0);
    state.patience = Math.min(3, state.patience + 1);
    state.mendCharge = Math.min(6, state.mendCharge + 2);
    if (state.noMendCommission) awardBadge('No-Mend Commission');
    if (state.chapterIndex === 0 && state.missed === 0) awardBadge('First Dew Perfect');
    if (state.chapterIndex < chapters.length - 1) {
      state.chapterIndex += 1;
      resetCommission(true);
      state.message = `${chapters[state.chapterIndex].name} unlocked. Diagonal ramps and layer switching matter now.`;
    } else if (state.chapterIndex === chapters.length - 1) {
      state.chapterIndex += 1;
      if (state.score >= 3100) triggerConstellation();
      resetCommission(true);
      state.message = state.constellation ? 'Endless night commissions begin.' : 'Score 3100 to reveal Kumo Moonweb Constellation.';
    } else {
      state.endlessLevel += 1;
      resetCommission(true);
      state.message = `Endless Night ${state.endlessLevel + 1}: denser dew, stricter integrity, same readable controls.`;
    }
  }

  function resetCommission(success) {
    state.commission = { pearl: 0, blue: 0, gold: 0, lanterns: 0, strands: 0 };
    state.commissionElapsed = 0;
    state.noMendCommission = true;
    if (!success) state.combo = 1;
  }

  function triggerConstellation() {
    if (state.constellation) return;
    state.constellation = true;
    state.score += 1000;
    state.constellationTimer = 5.5;
    ui.constellation.hidden = false;
    awardBadge('Kumo Moonweb Constellation');
    if (state.elapsed < 200) awardBadge('Moonweb Under 200s');
    const bestTime = Number(localStorage.getItem(storage.bestTime) || Infinity);
    if (state.elapsed < bestTime) localStorage.setItem(storage.bestTime, String(Math.round(state.elapsed)));
    tone('constellation');
  }

  function awardBadge(name) {
    const badges = new Set(JSON.parse(localStorage.getItem(storage.badges) || '[]'));
    badges.add(name);
    localStorage.setItem(storage.badges, JSON.stringify([...badges]));
  }

  function weaveSelected() {
    ensureAudio();
    if (!state.selectedAnchorA || !state.selectedAnchorB || state.selectedAnchorA === state.selectedAnchorB) {
      state.message = 'Choose two different glowing anchor knots before weaving.'; updateHelper(); return;
    }
    const a = getAnchor(state.selectedAnchorA), b = getAnchor(state.selectedAnchorB);
    const exists = state.strands.some(s => (s.a === a.id && s.b === b.id || s.a === b.id && s.b === a.id) && s.layer === state.currentLayer);
    if (exists) { state.message = 'That anchor pair already carries silk on this layer.'; updateHelper(); return; }
    const strand = makeStrand(a, b, state.currentLayer, 0.58);
    state.strands.push(strand);
    state.selectedStrandId = strand.id;
    state.commission.strands += layers[state.currentLayer].name === currentChapter().layerNeed ? 1 : 0;
    state.score += 35;
    tone('pluck', strand.tension);
    state.message = `Wove ${layers[state.currentLayer].name} silk: ${a.id} → ${b.id}. Tighten for bounce or slacken for catch.`;
    updateHelper();
  }

  function tune(delta) {
    ensureAudio();
    const strand = selectedStrand();
    if (!strand) { state.message = 'Select a silk strand to tune.'; updateHelper(); return; }
    strand.tension = Math.max(0.18, Math.min(0.96, strand.tension + delta));
    strand.pulse = 1;
    state.message = delta > 0 ? 'Tightened silk: sharper rebounds, shorter catch time.' : 'Slackened silk: deeper sag and longer catches, but overload risk rises.';
    tone('pluck', strand.tension);
    updateHelper();
  }

  function pluck() {
    ensureAudio();
    const strand = selectedStrand() || state.strands.find(s => s.held.length);
    if (!strand) { state.message = 'No held dew-stars are ready to pluck.'; updateHelper(); return; }
    const heldStars = state.stars.filter(star => star.heldBy === strand.id);
    if (!heldStars.length) { state.message = 'Selected silk is clear; slack strands catch dew before plucking.'; updateHelper(); return; }
    const cup = nearestCup(pointOnStrand(strand, 0.5));
    heldStars.forEach((star, i) => {
      star.heldBy = null;
      const dx = cup.x - star.x, dy = cup.y - star.y;
      const len = Math.hypot(dx, dy) || 1;
      star.vx = dx / len * (150 + strand.tension * 90) + (i - heldStars.length / 2) * 22;
      star.vy = dy / len * (120 + strand.tension * 80) - 90;
      star.usefulRelease = true;
    });
    strand.held = [];
    strand.pulse = 1;
    state.bestRunPluck = Math.max(state.bestRunPluck, heldStars.length);
    if (heldStars.length >= 3) state.score += 220;
    if (heldStars.length >= 6) awardBadge('Six-Star Pluck');
    state.message = `Plucked ${heldStars.length} held dew-star${heldStars.length === 1 ? '' : 's'} toward ${cup.label}.`;
    tone('pluck', strand.tension);
    updateHelper();
  }

  function mend() {
    ensureAudio();
    let strand = selectedStrand();
    if (!strand || strand.fray < 0.05) strand = state.strands.find(s => s.fray > 0.12);
    if (!strand) { state.message = 'No frayed strand needs mending.'; updateHelper(); return; }
    if (state.mendCharge <= 0) { state.message = 'Moon-thread charge is empty; fill lantern cups to recharge mend.'; updateHelper(); return; }
    strand.fray = Math.max(0, strand.fray - 0.55);
    strand.tension = Math.min(0.82, strand.tension + 0.08);
    strand.mended = true;
    state.mendCharge -= 1;
    state.noMendCommission = false;
    state.score += 45;
    state.message = 'Mended the intended frayed silk with moon-thread charge.';
    addParticles(pointOnStrand(strand, 0.5).x, pointOnStrand(strand, 0.5).y, '#8cf2bf', 14);
    updateHelper();
  }

  function layerStep(delta) {
    ensureAudio();
    state.currentLayer = Math.max(0, Math.min(2, state.currentLayer + delta));
    const strand = selectedStrand();
    if (strand) {
      strand.layer = state.currentLayer;
      strand.pulse = 1;
      state.message = `Moved selected silk to ${layers[state.currentLayer].name}; moth and dew collisions now follow that depth.`;
    } else state.message = `Selected ${layers[state.currentLayer].name} layer for the next weave.`;
    updateHelper();
  }

  function togglePause() {
    ensureAudio();
    if (state.status === 'menu') return;
    if (state.status === 'playing') { state.status = 'paused'; ui.pauseOverlay.hidden = false; }
    else if (state.status === 'paused') { state.status = 'playing'; ui.pauseOverlay.hidden = true; lastTime = performance.now(); }
  }

  function restart() { startRun(); }

  function endRun(reason) {
    state.status = 'over';
    state.message = reason;
    const badges = JSON.parse(localStorage.getItem(storage.badges) || '[]');
    localStorage.setItem(storage.best, String(Math.max(state.best, Math.floor(state.score))));
    localStorage.setItem(storage.streak, String(Math.max(Number(localStorage.getItem(storage.streak) || 0), Math.floor(state.cleanStreak))));
    localStorage.setItem(storage.pluck, String(Math.max(Number(localStorage.getItem(storage.pluck) || 0), state.bestRunPluck)));
    localStorage.setItem(storage.integrity, String(Math.max(Number(localStorage.getItem(storage.integrity) || 0), Math.floor(state.integrity))));
    localStorage.setItem(storage.endless, String(Math.max(Number(localStorage.getItem(storage.endless) || 0), state.endlessLevel)));
    localStorage.setItem(storage.fills, String(state.filledTotal));
    ui.resultStats.innerHTML = `<dl><dt>Final score</dt><dd>${Math.floor(state.score)}</dd><dt>Best score</dt><dd>${Math.max(state.best, Math.floor(state.score))}</dd><dt>Chapter reached</dt><dd>${currentChapter().name}</dd><dt>Moonweb Constellation</dt><dd>${state.constellation ? 'lit' : 'not yet'}</dd><dt>Clean-catch streak</dt><dd>${Math.floor(state.cleanStreak)}</dd><dt>Dew-stars delivered</dt><dd>${state.delivered}</dd><dt>Integrity finish</dt><dd>${Math.floor(state.integrity)}%</dd><dt>Mastery badges</dt><dd>${badges.length ? badges.join(', ') : 'none yet'}</dd></dl>`;
    ui.resultOverlay.hidden = false;
    updateMenuStats();
  }

  function getAnchor(id) { return state.anchors.find(a => a.id === id); }
  function selectedStrand() { return state.strands.find(s => s.id === state.selectedStrandId); }
  function pointOnStrand(strand, t) {
    const a = getAnchor(strand.a), b = getAnchor(strand.b), layer = layers[strand.layer];
    const sag = (1 - strand.tension) * 92 + strand.fray * 32;
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t + Math.sin(Math.PI * t) * sag + layer.y;
    return { x, y };
  }
  function closestOnStrand(strand, x, y) {
    let best = { dist: Infinity, t: 0, x: 0, y: 0 };
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const p = pointOnStrand(strand, t);
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < best.dist) best = { dist: d, t, x: p.x, y: p.y };
    }
    return best;
  }
  function lanternCups() {
    const ch = state.chapterIndex;
    const cups = [{ x: 245, y: 890, r: 32, type: 'pearl', label: 'pearl cup' }];
    if (ch >= 1) cups.push({ x: 505, y: 888, r: 32, type: 'blue', label: 'blue cup' });
    if (ch >= 2) cups.push({ x: 382, y: 812, r: 30, type: 'gold', label: 'gold cup' });
    return cups;
  }
  function nearestCup(p) { return lanternCups().slice().sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[0]; }

  function handlePointer(ev) {
    ensureAudio();
    if (state.status !== 'playing') return;
    const rect = canvas.getBoundingClientRect();
    const x = (ev.clientX - rect.left) / rect.width * 780;
    const y = (ev.clientY - rect.top) / rect.height * 980;
    const hitAnchor = state.anchors.find(a => Math.hypot(a.x - x, a.y - y) < a.radius + 13);
    if (hitAnchor) {
      if (!state.selectedAnchorA || state.selectedAnchorA === hitAnchor.id) { state.selectedAnchorA = hitAnchor.id; state.selectedAnchorB = null; }
      else { state.selectedAnchorB = hitAnchor.id; state.selectedStrandId = null; }
      state.message = state.selectedAnchorB ? `Previewing ${state.selectedAnchorA} → ${state.selectedAnchorB} on ${layers[state.currentLayer].name}. Tap Weave.` : `Anchor ${hitAnchor.id} selected. Choose a second knot.`;
      updateHelper(); return;
    }
    const hitStrand = state.strands.map(s => ({ s, near: closestOnStrand(s, x, y) })).filter(o => o.near.dist < 28).sort((a, b) => a.near.dist - b.near.dist)[0];
    if (hitStrand) {
      state.selectedStrandId = hitStrand.s.id;
      state.currentLayer = hitStrand.s.layer;
      state.selectedAnchorA = hitStrand.s.a;
      state.selectedAnchorB = hitStrand.s.b;
      state.message = `Selected ${layers[hitStrand.s.layer].name} silk ${hitStrand.s.a} → ${hitStrand.s.b}.`;
      updateHelper();
    }
  }

  function updateHelper() {
    const strand = selectedStrand();
    if (strand) {
      const sag = Math.round((1 - strand.tension) * 92 + strand.fray * 32);
      const held = state.stars.filter(star => star.heldBy === strand.id).length;
      const risk = strand.tension < 0.38 ? (held >= 3 ? 'high overload risk' : 'catch-ready') : 'low overload risk';
      ui.helperTitle.textContent = `${layers[strand.layer].name} silk ${strand.a}→${strand.b}`;
      ui.helperText.textContent = `Tension ${Math.round(strand.tension * 100)}%, sag ${sag}px, fray ${Math.round(strand.fray * 100)}%, held dew ${held}, ${risk}. ${strand.tension > 0.5 ? 'Expected effect: sharp bounce along strand angle.' : 'Expected effect: catch and hold until plucked.'}`;
    } else if (state.selectedAnchorA && state.selectedAnchorB) {
      ui.helperTitle.textContent = `Preview ${state.selectedAnchorA}→${state.selectedAnchorB}`;
      ui.helperText.textContent = `${layers[state.currentLayer].name} layer preview. Weave creates a silver strand; then Tighten for rebound or Slacken for holding dew.`;
    } else {
      ui.helperTitle.textContent = 'Selected helper';
      ui.helperText.textContent = state.selectedAnchorA ? `Anchor ${state.selectedAnchorA} selected. Pick a second knot.` : 'No strand selected. Tap two anchors to preview sag and bounce.';
    }
  }

  function updateUI() {
    const ch = currentChapter();
    ui.score.textContent = String(Math.floor(state.score)); ui.best.textContent = String(Math.max(state.best, Math.floor(state.score)));
    ui.patience.textContent = '✦'.repeat(Math.max(0, state.patience)) + '·'.repeat(Math.max(0, 3 - state.patience));
    ui.integrity.textContent = `${Math.floor(state.integrity)}%`; ui.layer.textContent = layers[state.currentLayer].name; ui.combo.textContent = `x${state.combo.toFixed(1)}`; ui.time.textContent = fmt(state.elapsed);
    ui.chapter.textContent = ch.name; ui.commissionTitle.textContent = ch.title;
    ui.commissionText.textContent = `Catch ${ch.targetPearl} pearl, ${ch.targetBlue} blue, ${ch.targetGold} gold; fill ${ch.lanterns} cup${ch.lanterns === 1 ? '' : 's'}; weave ${ch.strands} ${ch.layerNeed} strands; keep integrity above ${ch.integrity}%. Moon-thread ${state.mendCharge}.`;
    const bits = [
      ['Pearl', state.commission.pearl, ch.targetPearl], ['Blue', state.commission.blue, ch.targetBlue], ['Gold', state.commission.gold, ch.targetGold], ['Lantern', state.commission.lanterns, ch.lanterns], [`${ch.layerNeed} silk`, state.commission.strands, ch.strands], ['Integrity', Math.floor(state.integrity), ch.integrity]
    ];
    ui.progress.innerHTML = bits.map(([label, got, need]) => `<span class="${got >= need ? 'done' : ''}">${label}: ${got}/${need}</span>`).join('');
    ui.stageHint.textContent = state.message;
    ui.buttons.mendButton.disabled = state.mendCharge <= 0;
    ui.buttons.weaveButton.disabled = !(state.selectedAnchorA && state.selectedAnchorB);
    updateHelper();
  }

  function updateMenuStats() {
    ui.menuBest.textContent = localStorage.getItem(storage.best) || '0';
    const t = Number(localStorage.getItem(storage.bestTime) || 0);
    ui.menuTime.textContent = t ? fmt(t) : '—';
  }
  function fmt(sec) { sec = Math.max(0, Math.floor(sec)); return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`; }

  function draw() {
    ctx.clearRect(0, 0, 780, 980);
    drawCanopy(); drawDepthVeils(); drawPreview(); drawStrands(); drawCups(); drawStars(); drawMoths(); drawAnchors(); drawMascot(); drawParticles();
  }
  function drawCanopy() {
    const gradient = ctx.createLinearGradient(0, 0, 0, 980);
    gradient.addColorStop(0, 'rgba(7,18,44,0.44)'); gradient.addColorStop(0.55, 'rgba(6,16,36,0.28)'); gradient.addColorStop(1, 'rgba(4,7,17,0.58)');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 780, 980);
    ctx.fillStyle = 'rgba(2,6,18,0.18)'; ctx.fillRect(0, 0, 780, 980);
    ctx.strokeStyle = 'rgba(222,248,255,0.12)'; ctx.lineWidth = 1;
    for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(390, 490, 150 + i * 58, 0, Math.PI * 2); ctx.stroke(); }
  }
  function drawDepthVeils() {
    layers.forEach((l, i) => { ctx.fillStyle = i === 0 ? 'rgba(44,61,121,0.08)' : i === 1 ? 'rgba(139,177,255,0.055)' : 'rgba(255,224,150,0.04)'; ctx.fillRect(0, 80 + i * 20, 780, 820 - i * 30); });
  }
  function drawPreview() {
    if (!state.selectedAnchorA || !state.selectedAnchorB || selectedStrand()) return;
    const temp = { a: state.selectedAnchorA, b: state.selectedAnchorB, layer: state.currentLayer, tension: 0.58, fray: 0 };
    drawStrandPath(temp, true);
  }
  function drawStrands() {
    [...state.strands].sort((a, b) => a.layer - b.layer).forEach(s => drawStrandPath(s, false));
  }
  function drawStrandPath(strand, preview) {
    const l = layers[strand.layer];
    ctx.save();
    ctx.globalAlpha = preview ? 0.58 : l.alpha;
    ctx.lineWidth = preview ? 4 : l.width + strand.pulse * 2;
    ctx.strokeStyle = strand.fray > 0.55 ? '#ff9aa8' : l.color;
    ctx.shadowColor = l.color; ctx.shadowBlur = preview ? 12 : 10 + strand.pulse * 18;
    ctx.setLineDash(preview ? [12, 10] : (strand.fray > 0.45 ? [10, 7] : []));
    ctx.beginPath();
    for (let i = 0; i <= 32; i++) { const p = pointOnStrand(strand, i / 32); if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }
    ctx.stroke();
    if (!preview) {
      const mid = pointOnStrand(strand, 0.5);
      ctx.setLineDash([]); ctx.shadowBlur = 0; ctx.fillStyle = strand.tension > 0.55 ? '#fff5b3' : '#9ee7ff';
      ctx.beginPath(); ctx.arc(mid.x, mid.y, 5 + strand.held.length, 0, Math.PI * 2); ctx.fill();
      if (state.selectedStrandId === strand.id) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); }
    }
    ctx.restore();
  }
  function drawAnchors() {
    state.anchors.forEach(a => {
      const selected = state.selectedAnchorA === a.id || state.selectedAnchorB === a.id;
      const l = layers[a.layer];
      ctx.save(); ctx.translate(a.x, a.y + l.y * 0.4);
      ctx.shadowColor = selected ? '#fff7aa' : l.color; ctx.shadowBlur = selected ? 24 : 13;
      ctx.fillStyle = selected ? '#fff1a0' : '#dff8ff'; ctx.strokeStyle = '#b31f36'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, a.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#071322'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(a.id, 0, 1);
      ctx.fillStyle = l.color; ctx.font = '11px sans-serif'; ctx.fillText(l.name, 0, 34);
      ctx.restore();
    });
  }
  function drawStars() {
    state.stars.forEach(star => {
      star.trail.forEach((p, i) => { ctx.globalAlpha = Math.max(0, 0.32 - i * 0.035); ctx.fillStyle = types[star.type].color; ctx.beginPath(); ctx.arc(p.x, p.y, star.r * (1 - i * 0.07), 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1; ctx.save(); ctx.translate(star.x, star.y); ctx.rotate(state.elapsed * 1.6);
      ctx.shadowColor = types[star.type].color; ctx.shadowBlur = 18; ctx.fillStyle = types[star.type].color; ctx.strokeStyle = types[star.type].stroke; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) { const r = i % 2 ? star.r * 0.48 : star.r; const a = i * Math.PI / 4; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore(); ctx.globalAlpha = 1;
    });
  }
  function drawMoths() {
    state.moths.forEach(m => {
      ctx.save(); ctx.translate(m.x, m.y); ctx.globalAlpha = m.warned > 0 ? 0.42 + Math.sin(state.elapsed * 18) * 0.2 : 0.9; ctx.shadowColor = '#d8baff'; ctx.shadowBlur = 16;
      ctx.fillStyle = layers[m.layer].color; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(layers[m.layer].name.toUpperCase(), 0, -28);
      ctx.scale(m.vx > 0 ? 1 : -1, 1);
      ctx.fillStyle = '#1d1834'; ctx.strokeStyle = '#d8cdfd'; ctx.lineWidth = 2;
      const flap = Math.sin(m.wing) * 8;
      ctx.beginPath(); ctx.ellipse(-12, 0, 18, 9 + flap, -0.45, 0, Math.PI * 2); ctx.ellipse(12, 0, 18, 9 - flap, 0.45, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e8e4ff'; ctx.beginPath(); ctx.ellipse(0, 0, 6, 13, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore(); ctx.globalAlpha = 1;
    });
  }
  function drawCups() {
    lanternCups().forEach(cup => {
      ctx.save(); ctx.translate(cup.x, cup.y); ctx.shadowColor = types[cup.type].cup; ctx.shadowBlur = 22;
      ctx.fillStyle = 'rgba(10,18,35,0.88)'; ctx.strokeStyle = types[cup.type].cup; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(-36, -22, 72, 44, 16); ctx.fill(); ctx.stroke();
      ctx.fillStyle = types[cup.type].cup; ctx.beginPath(); ctx.arc(0, -8, 10 + Math.sin(state.elapsed * 3) * 2, 0, Math.PI * 2); ctx.fill();
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(cup.type, 0, 38); ctx.restore();
    });
  }
  function drawMascot() {
    const x = 690, y = 882, s = 74;
    if (mascotImage.complete) ctx.drawImage(mascotImage, x - s / 2, y - s / 2, s, s);
    else { ctx.fillStyle = '#f7f0ff'; ctx.beginPath(); ctx.arc(x, y, 28, 0, Math.PI * 2); ctx.fill(); }
  }
  function drawParticles() {
    state.particles.forEach(p => { ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 2 + p.life * 4, 0, Math.PI * 2); ctx.fill(); });
    ctx.globalAlpha = 1;
  }

  canvas.addEventListener('pointerdown', handlePointer);
  ui.buttons.startButton.addEventListener('click', startRun);
  ui.buttons.layerDownButton.addEventListener('click', () => layerStep(-1));
  ui.buttons.layerUpButton.addEventListener('click', () => layerStep(1));
  ui.buttons.weaveButton.addEventListener('click', weaveSelected);
  ui.buttons.tightenButton.addEventListener('click', () => tune(0.12));
  ui.buttons.slackenButton.addEventListener('click', () => tune(-0.12));
  ui.buttons.pluckButton.addEventListener('click', pluck);
  ui.buttons.mendButton.addEventListener('click', mend);
  ui.buttons.pauseButton.addEventListener('click', togglePause);
  ui.buttons.restartButton.addEventListener('click', restart);
  ui.buttons.resumeButton.addEventListener('click', togglePause);
  ui.buttons.pauseRestartButton.addEventListener('click', restart);
  ui.buttons.resultRestartButton.addEventListener('click', restart);
  window.addEventListener('keydown', ev => {
    if (ev.key === 'Enter' && state.status === 'menu') { ev.preventDefault(); startRun(); return; }
    if (state.status === 'menu') return;
    const key = ev.key.toLowerCase();
    if ([' ', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(ev.key.toLowerCase())) ev.preventDefault();
    if (key === 'p') togglePause(); if (key === 'r') restart();
    if (state.status !== 'playing') return;
    if (key === '1' || key === 'z') { state.currentLayer = 0; updateUI(); }
    if (key === '2' || key === 'x') { state.currentLayer = 1; updateUI(); }
    if (key === '3' || key === 'c') { state.currentLayer = 2; updateUI(); }
    if (key === 'w') weaveSelected(); if (key === 't') tune(0.12); if (key === 'y') tune(-0.12); if (key === ' ' || key === 'enter') pluck(); if (key === 'm') mend();
    if (key.startsWith('arrow')) moveFocus(key);
  });

  function moveFocus(key) {
    const delta = key === 'arrowright' || key === 'arrowdown' ? 1 : -1;
    state.focusIndex = (state.focusIndex + delta + state.anchors.length) % state.anchors.length;
    const a = state.anchors[state.focusIndex];
    if (!state.selectedAnchorA) state.selectedAnchorA = a.id; else state.selectedAnchorB = a.id;
    state.message = `Keyboard focus anchor ${a.id}.`; updateUI();
  }

  updateMenuStats();
  updateUI();
  requestAnimationFrame(loop);
})();
