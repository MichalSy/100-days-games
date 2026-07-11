(() => {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const canvas = $('#gameCanvas');
  const ctx = canvas.getContext('2d');
  const helperImg = new Image();
  helperImg.src = './assets/hinoki-helper.png';

  const storageKey = 'day029HinokiKumikoStats';
  const orientations = [0, 45, 90, 135];
  const grainNames = ['along', 'cross', 'diagonal', 'reverse'];
  const commissions = [
    {
      name: 'First Asa-no-ha Panel',
      timer: 125,
      stressLimit: 45,
      required: 8,
      clampGoal: 4,
      burrLimit: 5,
      symmetryTarget: 82,
      text: 'Complete 8 blueprint cells, clamp 4 clean intersections, keep stress under 45%, and learn your first notch.'
    },
    {
      name: 'Sakura Hex Screen',
      timer: 150,
      stressLimit: 40,
      required: 10,
      clampGoal: 6,
      burrLimit: 5,
      symmetryTarget: 90,
      text: 'Add hex diagonals: finish 10 cells, clamp 6 joints, plane burrs, and hold 90% symmetry.'
    },
    {
      name: 'Festival Shoji Masterwork',
      timer: 175,
      stressLimit: 35,
      required: 12,
      clampGoal: 8,
      burrLimit: 5,
      symmetryTarget: 92,
      text: 'Dense mixed lattice: use Calm Measure, keep stress under 35%, and finish the master screen.'
    }
  ];

  const authoredGuides = [
    [
      { x: 3, y: 1, o: 90, len: 5 }, { x: 1, y: 3, o: 0, len: 5 }, { x: 2, y: 2, o: 45, len: 3 }, { x: 4, y: 2, o: 135, len: 3 },
      { x: 2, y: 4, o: 135, len: 3 }, { x: 4, y: 4, o: 45, len: 3 }, { x: 3, y: 3, o: 0, len: 3 }, { x: 3, y: 3, o: 90, len: 3 },
      { x: 1, y: 5, o: 0, len: 5 }, { x: 5, y: 3, o: 90, len: 3 }
    ],
    [
      { x: 3, y: 1, o: 90, len: 5 }, { x: 1, y: 3, o: 0, len: 5 }, { x: 2, y: 2, o: 45, len: 4 }, { x: 4, y: 2, o: 135, len: 4 },
      { x: 2, y: 4, o: 135, len: 4 }, { x: 4, y: 4, o: 45, len: 4 }, { x: 3, y: 5, o: 0, len: 5 }, { x: 1, y: 1, o: 45, len: 3 },
      { x: 5, y: 1, o: 135, len: 3 }, { x: 1, y: 5, o: 135, len: 3 }, { x: 5, y: 5, o: 45, len: 3 }, { x: 3, y: 3, o: 90, len: 5 }
    ],
    [
      { x: 3, y: 1, o: 90, len: 6 }, { x: 1, y: 2, o: 0, len: 5 }, { x: 1, y: 4, o: 0, len: 5 }, { x: 1, y: 6, o: 0, len: 5 },
      { x: 1, y: 1, o: 45, len: 5 }, { x: 5, y: 1, o: 135, len: 5 }, { x: 1, y: 5, o: 135, len: 5 }, { x: 5, y: 5, o: 45, len: 5 },
      { x: 2, y: 3, o: 45, len: 4 }, { x: 4, y: 3, o: 135, len: 4 }, { x: 2, y: 5, o: 135, len: 4 }, { x: 4, y: 5, o: 45, len: 4 },
      { x: 3, y: 3, o: 90, len: 5 }, { x: 3, y: 3, o: 0, len: 5 }
    ]
  ];

  const ui = {
    app: $('#app'), title: $('#titleOverlay'), pause: $('#pauseOverlay'), results: $('#resultsOverlay'), banner: $('#masterBanner'),
    score: $('#scoreValue'), best: $('#bestValue'), hearts: $('#heartValue'), stress: $('#stressValue'), combo: $('#comboValue'), focus: $('#focusValue'), strip: $('#stripValue'), grain: $('#grainValue'), time: $('#timeValue'),
    commissionName: $('#commissionName'), commissionText: $('#commissionText'), progressRow: $('#progressRow'), helper: $('#statusHelper'), menuBest: $('#menuBest'), menuBestTime: $('#menuBestTime'), resultsTitle: $('#resultsTitle'), resultsText: $('#resultsText'), start: $('#startButton')
  };

  let audio = null;
  let muted = false;
  let lastTick = performance.now();
  let rafId = 0;
  let panel = { x: 80, y: 120, w: 620, h: 720, cell: 82, gx: 0, gy: 0 };

  const defaultStats = { best: 0, bestMasterTime: null, cleanChain: 0, endless: 0, lowestStress: null, perfectClamps: 0, badges: [] };
  let stats = loadStats();

  const state = {
    screen: 'title', score: 0, combo: 1, hearts: 3, stress: 0, elapsed: 0, commissionTime: 0, commissionIndex: 0,
    endlessLevel: 0, guides: [], placed: [], clamps: [], notches: [], burrs: [], slips: [], sawdust: [], current: null,
    rackIndex: 0, rack: [], dryFit: { status: 'neutral', guide: null, stress: 0 }, focusCharge: 0, focusTime: 0, master: false,
    cleanChain: 0, bestCleanChain: 0, cracks: 0, burrsPlaned: 0, perfectClamps: 0, overPlanes: 0, symmetry: 0, warning: 'Welcome to the hinoki atelier.'
  };

  function loadStats() {
    try { return { ...defaultStats, ...JSON.parse(localStorage.getItem(storageKey) || '{}') }; }
    catch { return { ...defaultStats }; }
  }
  function saveStats() { localStorage.setItem(storageKey, JSON.stringify(stats)); }
  function fmtTime(s) { const m = Math.floor(s / 60); const r = Math.floor(s % 60).toString().padStart(2, '0'); return `${m}:${r}`; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function orientVec(o) {
    if (o === 0) return { dx: 1, dy: 0 };
    if (o === 90) return { dx: 0, dy: 1 };
    if (o === 45) return { dx: 1, dy: 1 };
    return { dx: -1, dy: 1 };
  }
  function segmentEnds(seg) {
    const v = orientVec(seg.o); const half = (seg.len - 1) / 2;
    return { ax: seg.x - v.dx * half, ay: seg.y - v.dy * half, bx: seg.x + v.dx * half, by: seg.y + v.dy * half };
  }
  function cellsFor(seg) {
    const v = orientVec(seg.o); const half = (seg.len - 1) / 2; const cells = [];
    for (let i = 0; i < seg.len; i++) cells.push({ x: Math.round(seg.x + v.dx * (i - half)), y: Math.round(seg.y + v.dy * (i - half)) });
    return cells.filter(c => c.x >= 0 && c.x <= 6 && c.y >= 0 && c.y <= 8);
  }
  function sameGuide(a, b) { return a && b && a.x === b.x && a.y === b.y && a.o === b.o && a.len === b.len; }
  function isGuidePlaced(g) { return state.placed.some(p => sameGuide(p.guide, g)); }
  function gridToCanvas(x, y) { return { x: panel.gx + x * panel.cell, y: panel.gy + y * panel.cell }; }
  function canvasToGrid(px, py) { return { x: clamp(Math.round((px - panel.gx) / panel.cell), 0, 6), y: clamp(Math.round((py - panel.gy) / panel.cell), 0, 8) }; }

  function makeRack() {
    return [
      { len: 3, grain: 0 }, { len: 3, grain: 2 }, { len: 4, grain: 1 }, { len: 5, grain: 0 }, { len: 4, grain: 3 }, { len: 6, grain: 2 }
    ];
  }

  function makeEndlessGuides(level) {
    const guides = [];
    const base = authoredGuides[2].slice(0, 10 + (level % 4));
    base.forEach((g, i) => guides.push({ ...g, len: clamp(g.len + ((i + level) % 3 === 0 ? 1 : 0), 3, 6) }));
    guides.push({ x: 1 + (level % 5), y: 2 + (level % 4), o: orientations[level % orientations.length], len: 3 + (level % 3) });
    guides.push({ x: 5 - (level % 4), y: 6 - (level % 5), o: orientations[(level + 2) % orientations.length], len: 3 + ((level + 1) % 3) });
    return guides;
  }

  function resetRun() {
    Object.assign(state, {
      screen: 'playing', score: 0, combo: 1, hearts: 3, stress: 0, elapsed: 0, commissionIndex: 0, endlessLevel: 0,
      placed: [], clamps: [], notches: [], burrs: [], slips: [], sawdust: [], rackIndex: 0, rack: makeRack(), dryFit: { status: 'neutral', guide: null, stress: 0 }, focusCharge: 0, focusTime: 0,
      master: false, cleanChain: 0, bestCleanChain: 0, cracks: 0, burrsPlaned: 0, perfectClamps: 0, overPlanes: 0, symmetry: 0, warning: 'First strip ready. Dry-fit it over a warm blueprint guide.'
    });
    startCommission(0);
    hideOverlays();
    setCurrentFromRack();
    lastTick = performance.now();
    updateUI();
    play('tap');
  }

  function startCommission(index) {
    state.commissionIndex = index;
    state.commissionTime = 0;
    state.placed = []; state.clamps = []; state.notches = []; state.burrs = []; state.slips = []; state.sawdust = [];
    state.guides = index < commissions.length ? authoredGuides[index].map(g => ({ ...g })) : makeEndlessGuides(state.endlessLevel);
    state.symmetry = 0;
    state.warning = index < commissions.length ? `${commissions[index].name}: broad blueprint guides are ready.` : `Endless custom lattice ${state.endlessLevel + 1}: denser joinery, same careful hands.`;
  }

  function setCurrentFromRack() {
    const r = state.rack[state.rackIndex % state.rack.length];
    state.current = { x: 3, y: 4, o: 0, len: r.len, grain: r.grain, notched: false, committed: false };
    evaluateDryFit(false);
  }

  function hideOverlays() {
    ui.title.hidden = true; ui.pause.hidden = true; ui.results.hidden = true;
    ui.app.dataset.state = state.screen;
  }

  function initAudio() {
    if (audio || muted) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audio = new AC();
  }
  function play(kind) {
    if (muted || !audio) return;
    if (audio.state === 'suspended') audio.resume().catch(() => {});
    const now = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const cfg = {
      tap: [240, 0.05, 'triangle'], notch: [760, 0.07, 'square'], clamp: [440, 0.08, 'triangle'], plane: [180, 0.18, 'sawtooth'], crack: [95, 0.16, 'sawtooth'], shimmer: [980, 0.22, 'sine'], focus: [650, 0.28, 'sine'], master: [520, 0.55, 'triangle']
    }[kind] || [260, 0.06, 'sine'];
    osc.type = cfg[2]; osc.frequency.setValueAtTime(cfg[0], now);
    if (kind === 'master') osc.frequency.exponentialRampToValueAtTime(980, now + cfg[1]);
    if (kind === 'plane') osc.frequency.exponentialRampToValueAtTime(130, now + cfg[1]);
    gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, now + cfg[1]);
    osc.connect(gain).connect(audio.destination); osc.start(now); osc.stop(now + cfg[1] + 0.03);
  }

  function currentCommission() {
    return state.commissionIndex < commissions.length ? commissions[state.commissionIndex] : {
      name: `Endless Hinoki Commission ${state.endlessLevel + 1}`, timer: 150 - clamp(state.endlessLevel * 4, 0, 45), stressLimit: 32, required: Math.min(14, 10 + state.endlessLevel), clampGoal: 7, burrLimit: 5, symmetryTarget: 90, text: 'Endless custom lattice: denser guide geometry, stricter stress, and clean mobile-safe controls.'
    };
  }

  function step(dx, dy) {
    if (!canAct()) return;
    state.current.x = clamp(state.current.x + dx, 0, 6);
    state.current.y = clamp(state.current.y + dy, 0, 8);
    state.current.notched = false;
    evaluateDryFit(true);
    addSawdust(state.current.x, state.current.y, '#f5d78f');
    play('tap');
  }
  function rotate(dir) {
    if (!canAct()) return;
    let i = orientations.indexOf(state.current.o);
    i = (i + dir + orientations.length) % orientations.length;
    state.current.o = orientations[i];
    state.current.notched = false;
    evaluateDryFit(true);
    play('tap');
  }
  function swapStrip() {
    if (!canAct()) return;
    state.rackIndex = (state.rackIndex + 1) % state.rack.length;
    setCurrentFromRack();
    state.warning = `Swapped to ${state.current.len}-cell strip with ${grainNames[state.current.grain]} grain.`;
    play('tap'); updateUI();
  }
  function canAct() { return state.screen === 'playing'; }

  function evaluateDryFit(announce = true) {
    const c = state.current;
    let best = null; let bestScore = Infinity;
    for (const g of state.guides) {
      if (isGuidePlaced(g)) continue;
      const score = Math.abs(g.x - c.x) + Math.abs(g.y - c.y) + (g.o === c.o ? 0 : 4) + Math.abs(g.len - c.len) * 0.8;
      if (score < bestScore) { bestScore = score; best = g; }
    }
    const aligned = best && best.x === c.x && best.y === c.y && best.o === c.o && Math.abs(best.len - c.len) <= 1;
    const exact = aligned && best.len === c.len;
    const grainPenalty = (c.grain === 1 && (c.o === 90 || c.o === 45)) ? 5 : (c.grain === 2 && (c.o === 0 || c.o === 90) ? 3 : 0);
    state.dryFit = { status: exact ? 'valid' : aligned ? 'near' : 'invalid', guide: best, stress: exact ? Math.max(0, grainPenalty - 2) : aligned ? 4 + grainPenalty : 8 + grainPenalty };
    if (announce) state.warning = exact ? 'Dry-fit glows warm gold: commit after trimming crossing notches.' : aligned ? 'Nearly aligned: length mismatch may raise stress, but it can be committed carefully.' : 'Red preview: off-blueprint commit will raise grain stress.';
    updateUI();
  }

  function dryFitAction() {
    if (!canAct()) return;
    evaluateDryFit(true);
    state.focusCharge = clamp(state.focusCharge + (state.dryFit.status === 'valid' ? 6 : 2), 0, 100);
    play(state.dryFit.status === 'invalid' ? 'crack' : 'tap');
  }

  function commitStrip() {
    if (!canAct()) return;
    evaluateDryFit(false);
    const fit = state.dryFit;
    const guide = fit.status === 'invalid' ? null : fit.guide;
    const placement = { ...state.current, guide: guide ? { ...guide } : null, id: Date.now() + Math.random(), clean: fit.status === 'valid' };
    state.placed.push(placement);
    if (fit.status === 'valid') {
      const pts = 110 * state.combo;
      state.score += pts; state.combo = Math.min(9, state.combo + 1); state.focusCharge = clamp(state.focusCharge + 16, 0, 100);
      state.cleanChain += 1; state.bestCleanChain = Math.max(state.bestCleanChain, state.cleanChain);
      state.warning = `Clean committed strip +${pts}. Clamp intersections before they slip.`;
      addSawdust(state.current.x, state.current.y, '#ffe6a3', 16); play('clamp');
    } else if (fit.status === 'near') {
      state.score += 65; state.stress = clamp(state.stress + fit.stress, 0, 100); state.combo = Math.max(1, state.combo); state.focusCharge = clamp(state.focusCharge + 7, 0, 100);
      spawnBurrNear(state.current); state.warning = 'Near fit committed: a raised burr appeared. Plane it soon.'; play('tap');
    } else {
      state.stress = clamp(state.stress + 8, 0, 100); state.combo = 1; state.cleanChain = 0; state.slips.push({ x: state.current.x, y: state.current.y, life: 7 }); spawnBurrNear(state.current);
      state.warning = 'Invalid commit: red slip marker and stress +8%. Dry-fit before the next strip.'; play('crack');
    }
    checkStressDamage();
    maybeCompleteCommission();
    state.rackIndex = (state.rackIndex + 1) % state.rack.length;
    setCurrentFromRack(); updateUI();
  }

  function intersectionsFor(seg, placedOnly = true) {
    const currentCells = cellsFor(seg);
    const points = [];
    const others = placedOnly ? state.placed : state.guides.map(g => ({ ...g, guide: g }));
    for (const other of others) {
      if (other.id === seg.id) continue;
      const ocells = cellsFor(other);
      for (const a of currentCells) for (const b of ocells) {
        if (a.x === b.x && a.y === b.y && other.o !== seg.o) points.push({ x: a.x, y: a.y, other });
      }
    }
    return points;
  }

  function trimNotch() {
    if (!canAct()) return;
    const pts = intersectionsFor(state.current, true);
    if (pts.length) {
      const p = pts.sort((a, b) => dist(a, state.current) - dist(b, state.current))[0];
      state.notches.push({ x: p.x, y: p.y, life: 12, clean: state.dryFit.status !== 'invalid' });
      state.current.notched = true; state.score += 130 * state.combo; state.focusCharge = clamp(state.focusCharge + 12, 0, 100);
      state.warning = 'Chisel tick: notch trimmed at the crossing. Clamp this joint cleanly.';
      addSawdust(p.x, p.y, '#f6d28c', 18); play('notch');
    } else {
      state.stress = clamp(state.stress + 3, 0, 100); state.warning = 'No crossing under the strip: a shallow practice notch adds slight stress.'; play('crack');
    }
    updateUI();
  }

  function clampJoint() {
    if (!canAct()) return;
    const recent = state.placed[state.placed.length - 1];
    const targetSeg = recent || state.current;
    const pts = intersectionsFor(targetSeg, true).filter(p => !state.clamps.some(c => c.x === p.x && c.y === p.y));
    const notched = pts.find(p => state.notches.some(n => n.x === p.x && n.y === p.y));
    if (notched) {
      state.clamps.push({ x: notched.x, y: notched.y, life: 18, perfect: true });
      state.score += 150 * state.combo; state.combo = Math.min(9, state.combo + 1); state.focusCharge = clamp(state.focusCharge + 15, 0, 100); state.perfectClamps += 1;
      state.warning = 'Warm clamp click: perfect notched intersection locked.'; addSawdust(notched.x, notched.y, '#fff0aa', 10); play('clamp');
    } else if (pts.length) {
      const p = pts[0]; state.clamps.push({ x: p.x, y: p.y, life: 9, perfect: false }); state.stress = clamp(state.stress + 6, 0, 100); spawnBurrNear(p);
      state.warning = 'Clamp bit into an unnotched joint: stress splinter and burr created.'; play('crack');
    } else {
      state.stress = clamp(state.stress + 4, 0, 100); state.warning = 'No intersection ready for the clamp. Align a crossing first.'; play('crack');
    }
    checkStressDamage(); maybeCompleteCommission(); updateUI();
  }

  function planeBurr() {
    if (!canAct()) return;
    if (state.burrs.length) {
      let best = state.burrs[0]; let d = Infinity;
      for (const b of state.burrs) { const bd = dist(b, state.current); if (bd < d) { best = b; d = bd; } }
      state.burrs = state.burrs.filter(b => b !== best);
      const relief = d <= 2 ? 7 : 3;
      state.stress = clamp(state.stress - relief, 0, 100); state.score += 120; state.burrsPlaned += 1;
      state.warning = `Smooth plane scrape: burr removed and stress -${relief}%.`; addSawdust(best.x, best.y, '#f7d68d', 22); play('plane');
    } else {
      state.stress = clamp(state.stress - 2, 0, 100); state.score = Math.max(0, state.score - 35); state.overPlanes += 1;
      state.warning = 'Over-planing thinned a strip: tiny stress relief, lower finish score.'; play('plane');
    }
    updateUI();
  }

  function activateFocus() {
    if (!canAct()) return;
    if (state.focusCharge >= 100) {
      state.focusCharge = 0; state.focusTime = 8; state.warning = 'Calm Measure active: timer slows and valid notch/stress heat is overlaid.'; play('focus');
    } else {
      state.warning = `Calm Measure needs ${100 - Math.floor(state.focusCharge)}% more charge.`; play('tap');
    }
    updateUI();
  }

  function spawnBurrNear(seg) {
    const cells = cellsFor(seg); const c = cells[Math.floor(cells.length / 2)] || { x: seg.x, y: seg.y };
    state.burrs.push({ x: clamp(c.x + (state.burrs.length % 2 ? 1 : 0), 0, 6), y: clamp(c.y, 0, 8), life: 18 });
  }
  function addSawdust(x, y, color, count = 8) {
    const p = gridToCanvas(x, y);
    for (let i = 0; i < count; i++) state.sawdust.push({ x: p.x, y: p.y, vx: (Math.random() - .5) * 90, vy: (Math.random() - .8) * 90, life: .6 + Math.random() * .6, color });
  }
  function checkStressDamage() {
    if (state.stress >= 100) return endGame('Grain stress reached 100% and the screen cracked.');
    if (state.stress >= 66 && state.hearts > 0 && state.stress - 14 * state.cracks >= 66) {
      state.hearts -= 1; state.cracks += 1; state.stress = clamp(state.stress + 14, 0, 100); state.combo = 1; state.cleanChain = 0; state.warning = 'Tiny splinter crack: craft heart lost. Plane burrs and use safer strips.'; play('crack');
      if (state.hearts <= 0) endGame('All three craft hearts cracked.');
    }
  }

  function updateSymmetry() {
    if (!state.placed.length) { state.symmetry = 0; return; }
    let mirrored = 0;
    for (const p of state.placed) {
      const mx = 6 - p.x;
      if (state.placed.some(q => Math.abs(q.x - mx) <= 1 && Math.abs(q.y - p.y) <= 1 && q.o === (p.o === 45 ? 135 : p.o === 135 ? 45 : p.o))) mirrored += 1;
    }
    state.symmetry = Math.round((mirrored / state.placed.length) * 100);
  }

  function maybeCompleteCommission() {
    updateSymmetry();
    const c = currentCommission();
    const cleanPlaced = state.placed.filter(p => p.clean).length;
    const cleanClamps = state.clamps.filter(cl => cl.perfect).length;
    if (cleanPlaced >= c.required && cleanClamps >= c.clampGoal && state.burrs.length < c.burrLimit && state.stress <= c.stressLimit + 20) {
      const lowStress = state.stress <= c.stressLimit;
      const bonus = 760 + (lowStress ? 980 : 0) + (state.symmetry >= c.symmetryTarget ? 240 : 0);
      state.score += bonus; state.hearts = Math.min(3, state.hearts + (lowStress ? 1 : 0)); state.focusCharge = clamp(state.focusCharge + 35, 0, 100);
      state.warning = `${c.name} complete +${bonus}. Shoji paper glows behind the lattice.`;
      play('shimmer');
      if (state.commissionIndex < 2) {
        startCommission(state.commissionIndex + 1); setCurrentFromRack();
      } else if (state.commissionIndex === 2) {
        state.commissionIndex = 3; startCommission(3); setCurrentFromRack();
      } else {
        state.endlessLevel += 1; stats.endless = Math.max(stats.endless, state.endlessLevel); startCommission(3 + state.endlessLevel); setCurrentFromRack();
      }
    }
    if (!state.master && state.commissionIndex >= 3 && state.score >= 4300) triggerMaster();
  }

  function triggerMaster() {
    state.master = true; state.score += 1900; ui.banner.hidden = false; state.warning = 'Hinoki Master Screen! Gold paper glow, perfect border clamps, and endless commissions continue.'; play('master');
    setTimeout(() => { ui.banner.hidden = true; }, 3600);
    if (!stats.bestMasterTime || state.elapsed < stats.bestMasterTime) stats.bestMasterTime = Math.round(state.elapsed);
    if (!stats.badges.includes('Hinoki Master Screen')) stats.badges.push('Hinoki Master Screen');
    saveStats();
  }

  function endGame(reason) {
    if (state.screen === 'gameover') return;
    state.screen = 'gameover';
    stats.best = Math.max(stats.best, state.score);
    stats.cleanChain = Math.max(stats.cleanChain, state.bestCleanChain);
    stats.perfectClamps = Math.max(stats.perfectClamps, state.perfectClamps);
    stats.lowestStress = stats.lowestStress == null ? Math.round(state.stress) : Math.min(stats.lowestStress, Math.round(state.stress));
    if (state.cracks === 0 && !stats.badges.includes('No-crack panel craft')) stats.badges.push('No-crack panel craft');
    if (state.bestCleanChain >= 29 && !stats.badges.includes('29 clean joints')) stats.badges.push('29 clean joints');
    saveStats();
    ui.resultsTitle.textContent = state.master ? 'Hinoki Master Results' : 'Workshop Results';
    ui.resultsText.innerHTML = [
      reason, `Final score: ${state.score} (best ${stats.best})`, `Commission reached: ${currentCommission().name}`, `Master Screen: ${state.master ? 'achieved' : 'not yet'}`,
      `Clean-joint chain: ${state.bestCleanChain}`, `Symmetry: ${state.symmetry}%`, `Cracks: ${state.cracks}`, `Burrs planed: ${state.burrsPlaned}`, `Stress finish: ${Math.round(state.stress)}%`,
      `Mastery badges: ${stats.badges.length ? stats.badges.join(', ') : 'none yet'}`
    ].map(t => `<div>${escapeHtml(t)}</div>`).join('');
    ui.results.hidden = false; ui.app.dataset.state = 'gameover';
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); }

  function pauseGame() { if (state.screen !== 'playing') return; state.screen = 'paused'; ui.pause.hidden = false; ui.app.dataset.state = 'paused'; }
  function resumeGame() { if (state.screen !== 'paused') return; state.screen = 'playing'; ui.pause.hidden = true; ui.app.dataset.state = 'playing'; lastTick = performance.now(); }

  function update(dt) {
    if (state.screen === 'playing') {
      const slow = state.focusTime > 0 ? 0.42 : 1;
      state.elapsed += dt * slow; state.commissionTime += dt * slow;
      if (state.focusTime > 0) state.focusTime = Math.max(0, state.focusTime - dt);
      if (state.burrs.length) state.stress = clamp(state.stress + dt * 0.45 * state.burrs.length * slow, 0, 100);
      if (state.slips.length) state.stress = clamp(state.stress + dt * 0.35 * state.slips.length * slow, 0, 100);
      state.sawdust.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 80 * dt; p.life -= dt; });
      state.sawdust = state.sawdust.filter(p => p.life > 0);
      state.slips.forEach(s => s.life -= dt); state.slips = state.slips.filter(s => s.life > 0);
      if (state.commissionTime > currentCommission().timer) endGame('Commission timer expired before the screen was finished.');
      if (state.burrs.length >= 5) endGame('Five unplaned burrs raised the panel beyond repair.');
      checkStressDamage();
      updateUI();
    }
  }

  function updateUI() {
    ui.score.textContent = String(Math.floor(state.score)); ui.best.textContent = String(Math.max(stats.best, state.score)); ui.hearts.textContent = '♥'.repeat(Math.max(0, state.hearts)) + '♡'.repeat(Math.max(0, 3 - state.hearts)); ui.stress.textContent = `${Math.round(state.stress)}%`;
    ui.combo.textContent = `x${state.combo}`; ui.focus.textContent = state.focusTime > 0 ? 'active' : `${Math.floor(state.focusCharge)}%`;
    if (state.current) { ui.strip.textContent = `L${state.current.len} · ${state.current.o}°`; ui.grain.textContent = grainNames[state.current.grain]; }
    ui.time.textContent = fmtTime(state.elapsed);
    const c = currentCommission(); ui.commissionName.textContent = c.name; ui.commissionText.textContent = c.text + ` Progress ${state.placed.filter(p => p.clean).length}/${c.required}, clamps ${state.clamps.filter(cl => cl.perfect).length}/${c.clampGoal}, burrs ${state.burrs.length}/${c.burrLimit}, symmetry ${state.symmetry}%.`;
    const total = Math.max(c.required, 10); ui.progressRow.innerHTML = '';
    for (let i = 0; i < Math.min(14, total); i++) { const t = document.createElement('span'); t.className = 'tick' + (i < state.placed.filter(p => p.clean).length ? ' done' : ''); ui.progressRow.appendChild(t); }
    ui.helper.textContent = state.warning;
    ui.menuBest.textContent = String(stats.best); ui.menuBestTime.textContent = stats.bestMasterTime ? fmtTime(stats.bestMasterTime) : '—';
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(360, Math.floor(rect.width * dpr)); canvas.height = Math.max(320, Math.floor(rect.height * dpr)); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    computePanel(rect.width, rect.height);
  }
  function computePanel(w, h) {
    const margin = Math.max(16, Math.min(w, h) * 0.045);
    panel.w = w - margin * 2; panel.h = h - margin * 2; panel.x = margin; panel.y = margin;
    panel.cell = Math.min(panel.w / 7.2, panel.h / 9.3);
    panel.gx = panel.x + (panel.w - panel.cell * 6) / 2;
    panel.gy = panel.y + (panel.h - panel.cell * 8) / 2;
  }

  function draw() {
    const rect = canvas.getBoundingClientRect(); const w = rect.width; const h = rect.height;
    ctx.clearRect(0, 0, w, h);
    drawWorkbench(w, h); drawPanel(); drawGuides(); drawPlaced(); drawCurrent(); drawMarkers(); drawHelperArt(w, h); drawOverlayText(w, h);
  }
  function drawWorkbench(w, h) {
    const grad = ctx.createLinearGradient(0, 0, w, h); grad.addColorStop(0, '#f6dc9a'); grad.addColorStop(.55, '#e8bd71'); grad.addColorStop(1, '#b87635'); ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = .18; ctx.strokeStyle = '#77451c'; ctx.lineWidth = 1;
    for (let y = 18; y < h; y += 32) { ctx.beginPath(); ctx.moveTo(0, y + Math.sin(y) * 3); ctx.bezierCurveTo(w*.3, y-8, w*.7, y+8, w, y); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function drawPanel() {
    roundRect(panel.x, panel.y, panel.w, panel.h, 22); ctx.fillStyle = '#fff2cf'; ctx.fill(); ctx.lineWidth = 13; ctx.strokeStyle = '#8b5529'; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = '#d3a154'; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.32)'; roundRect(panel.x + 16, panel.y + 16, panel.w - 32, panel.h - 32, 14); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 64, 42, .18)'; ctx.lineWidth = 1;
    for (let x = 0; x <= 6; x++) { const p = gridToCanvas(x, 0); const q = gridToCanvas(x, 8); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
    for (let y = 0; y <= 8; y++) { const p = gridToCanvas(0, y); const q = gridToCanvas(6, y); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
  }
  function drawGuides() {
    for (const g of state.guides) {
      if (isGuidePlaced(g)) continue;
      drawSegment(g, state.focusTime > 0 ? 'rgba(39, 78, 112, .7)' : 'rgba(31, 70, 104, .38)', 8, true);
    }
  }
  function drawPlaced() {
    for (const p of state.placed) drawSegment(p, p.clean ? '#d9a158' : '#b8754d', 17, false, p.clean ? '#fff1b9' : '#8a2f27');
  }
  function drawCurrent() {
    if (!state.current || state.screen === 'title') return;
    const fit = state.dryFit.status; const color = fit === 'valid' ? '#ffd46b' : fit === 'near' ? '#8ec7df' : '#ce473b';
    ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = 18; drawSegment(state.current, color, 19, false, '#7a4b22'); ctx.restore();
    const end = segmentEnds(state.current); const a = gridToCanvas(end.ax, end.ay); const b = gridToCanvas(end.bx, end.by);
    ctx.strokeStyle = '#5d3517'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a.x, a.y - 7); ctx.lineTo(b.x, b.y - 7); ctx.stroke();
  }
  function drawSegment(seg, color, width, dashed = false, edge = null) {
    const e = segmentEnds(seg); const a = gridToCanvas(e.ax, e.ay); const b = gridToCanvas(e.bx, e.by);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (dashed) ctx.setLineDash([12, 8]);
    if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = width + 5; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha = .35; ctx.strokeStyle = '#fff8d8'; ctx.lineWidth = Math.max(2, width * .16); ctx.beginPath(); ctx.moveTo(a.x, a.y - 2); ctx.lineTo(b.x, b.y - 2); ctx.stroke(); ctx.restore();
  }
  function drawMarkers() {
    for (const n of state.notches) { const p = gridToCanvas(n.x, n.y); ctx.fillStyle = n.clean ? '#4d2f16' : '#b33a2d'; ctx.beginPath(); ctx.moveTo(p.x - 9, p.y); ctx.lineTo(p.x, p.y - 9); ctx.lineTo(p.x + 9, p.y); ctx.lineTo(p.x, p.y + 9); ctx.closePath(); ctx.fill(); }
    for (const c of state.clamps) { const p = gridToCanvas(c.x, c.y); ctx.strokeStyle = c.perfect ? '#d99a2f' : '#b33a2d'; ctx.lineWidth = 5; ctx.strokeRect(p.x - 14, p.y - 14, 28, 28); ctx.fillStyle = '#fff0b7'; ctx.fillRect(p.x - 4, p.y - 17, 8, 34); }
    for (const b of state.burrs) { const p = gridToCanvas(b.x, b.y); ctx.fillStyle = '#d47d32'; ctx.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 8 : 15; const a = -Math.PI / 2 + i * Math.PI / 4; ctx.lineTo(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#7a3418'; ctx.stroke(); }
    for (const s of state.slips) { const p = gridToCanvas(s.x, s.y); ctx.strokeStyle = '#b5241f'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(p.x - 16, p.y - 16); ctx.lineTo(p.x + 16, p.y + 16); ctx.moveTo(p.x + 14, p.y - 12); ctx.lineTo(p.x - 10, p.y + 18); ctx.stroke(); }
    if (state.focusTime > 0) drawFocusOverlay();
    for (const dust of state.sawdust) { ctx.globalAlpha = clamp(dust.life, 0, 1); ctx.fillStyle = dust.color; ctx.beginPath(); ctx.arc(dust.x, dust.y, 2.8, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
  }
  function drawFocusOverlay() {
    for (const g of state.guides) if (!isGuidePlaced(g)) { const pts = intersectionsFor(g, false); for (const p of pts) { const q = gridToCanvas(p.x, p.y); ctx.strokeStyle = '#715bd7'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(q.x, q.y, 17, 0, Math.PI * 2); ctx.stroke(); } }
    ctx.fillStyle = `rgba(181, 53, 42, ${Math.min(.28, state.stress / 280)})`; roundRect(panel.x + 12, panel.y + 12, panel.w - 24, panel.h - 24, 15); ctx.fill();
  }
  function drawHelperArt(w, h) {
    const size = Math.min(74, w * .16); const x = w - size - 16; const y = h - size - 18;
    ctx.save(); ctx.globalAlpha = .93; ctx.beginPath(); ctx.arc(x + size/2, y + size/2, size/2 + 5, 0, Math.PI*2); ctx.fillStyle = '#f8d58b'; ctx.fill(); if (helperImg.complete) ctx.drawImage(helperImg, x, y, size, size); ctx.restore();
  }
  function drawOverlayText(w, h) {
    const c = currentCommission(); const remaining = Math.max(0, c.timer - state.commissionTime);
    ctx.fillStyle = 'rgba(52, 29, 12, .78)'; roundRect(14, 14, Math.min(w - 28, 330), 58, 14); ctx.fill();
    ctx.fillStyle = '#fff5d6'; ctx.font = '800 14px system-ui'; ctx.fillText(`${c.name}`, 26, 38); ctx.font = '700 12px system-ui'; ctx.fillText(`Timer ${fmtTime(remaining)} · Symmetry ${state.symmetry}% · ${state.dryFit.status} fit`, 26, 58);
  }

  function loop(now) {
    const dt = Math.min(0.05, (now - lastTick) / 1000); lastTick = now; update(dt); draw(); rafId = requestAnimationFrame(loop);
  }

  function action(name) {
    if (name === 'step-up') step(0, -1); else if (name === 'step-down') step(0, 1); else if (name === 'step-left') step(-1, 0); else if (name === 'step-right') step(1, 0);
    else if (name === 'rotate-left') rotate(-1); else if (name === 'rotate-right') rotate(1); else if (name === 'dry-fit') dryFitAction(); else if (name === 'commit') commitStrip();
    else if (name === 'trim') trimNotch(); else if (name === 'clamp') clampJoint(); else if (name === 'plane') planeBurr(); else if (name === 'swap') swapStrip(); else if (name === 'focus') activateFocus();
    else if (name === 'pause') pauseGame(); else if (name === 'resume') resumeGame(); else if (name === 'restart') { initAudio(); resetRun(); } else if (name === 'mute') { muted = !muted; if (muted && audio) audio.suspend().catch(() => {}); else if (audio) audio.resume().catch(() => {}); }
  }

  document.addEventListener('click', (ev) => { const el = ev.target.closest('[data-action]'); if (el) action(el.dataset.action); });
  ui.start.addEventListener('click', () => { initAudio(); resetRun(); });
  document.addEventListener('keydown', (ev) => {
    if (ev.target && /input|textarea|select/i.test(ev.target.tagName)) return;
    const k = ev.key.toLowerCase();
    if (k === 'arrowup' || k === 'w') { ev.preventDefault(); step(0, -1); } else if (k === 'arrowdown' || k === 's') { ev.preventDefault(); step(0, 1); } else if (k === 'arrowleft' || k === 'a') { ev.preventDefault(); step(-1, 0); } else if (k === 'arrowright' || k === 'd') { ev.preventDefault(); step(1, 0); }
    else if (k === 'q') rotate(-1); else if (k === 'e') rotate(1); else if (k === ' ' || k === 'enter') { ev.preventDefault(); state.dryFit.status === 'valid' ? commitStrip() : dryFitAction(); }
    else if (k === '1') trimNotch(); else if (k === '2') clampJoint(); else if (k === '3') planeBurr(); else if (k === '4') swapStrip(); else if (k === 'shift' || k === 'm') activateFocus(); else if (k === 'p') state.screen === 'paused' ? resumeGame() : pauseGame(); else if (k === 'r') resetRun();
  });

  let dragging = false;
  canvas.addEventListener('pointerdown', (ev) => { if (!canAct()) return; dragging = true; canvas.setPointerCapture(ev.pointerId); dragTo(ev); });
  canvas.addEventListener('pointermove', (ev) => { if (dragging) dragTo(ev); });
  canvas.addEventListener('pointerup', (ev) => { dragging = false; try { canvas.releasePointerCapture(ev.pointerId); } catch {} evaluateDryFit(true); play('tap'); });
  function dragTo(ev) {
    const r = canvas.getBoundingClientRect(); const g = canvasToGrid(ev.clientX - r.left, ev.clientY - r.top); state.current.x = g.x; state.current.y = g.y; state.current.notched = false; evaluateDryFit(false);
  }

  window.addEventListener('resize', resizeCanvas);
  helperImg.addEventListener('load', draw);
  resizeCanvas(); startCommission(0); state.rack = makeRack(); setCurrentFromRack(); updateUI(); rafId = requestAnimationFrame(loop);
})();
