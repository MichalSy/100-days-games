(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const canvas = $('fold-canvas');
  const ctx = canvas.getContext('2d');
  const storageKey = 'kiri-foldwright-v1';
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const fmtTime = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

  const assets = {
    mascot: new Image(),
    icons: new Image()
  };
  assets.mascot.src = 'assets/kiri-foldwright.png';
  assets.icons.src = 'assets/kiri-icons.png';

  const best = loadBest();
  let raf = 0;
  let toastTimer = 0;

  const authored = [
    {
      name: 'First Crease',
      timeLimit: 90,
      cap: 55,
      text: 'Make 1 valley path, collect 1 coral seal, keep stress under 55%.',
      start: { x: 0.18, y: 0.76 },
      gate: { x: 0.82, y: 0.28 },
      fog: { x: 0.52, y: 0.49, r: 0.06, vx: 0.006 },
      creases: [
        { id: 1, x1: 0.18, y1: 0.72, x2: 0.84, y2: 0.31, angle: -32, region: 'lower left', weak: false, required: 'valley', order: 1 },
        { id: 2, x1: 0.28, y1: 0.25, x2: 0.76, y2: 0.76, angle: 46, region: 'upper right', weak: false, required: null, order: 2 }
      ],
      seals: [{ id: 'A', x: 0.55, y: 0.49, hiddenBy: null, collected: false }],
      required: { valley: 1, mountain: 0, seals: 1 },
      bonus: 760
    },
    {
      name: 'Cedar Bridge',
      timeLimit: 105,
      cap: 62,
      text: 'Fold 2 valley paths and 1 mountain bridge; reveal 2 seals behind flaps.',
      start: { x: 0.16, y: 0.78 },
      gate: { x: 0.83, y: 0.25 },
      fog: { x: 0.66, y: 0.52, r: 0.065, vx: -0.006 },
      creases: [
        { id: 1, x1: 0.16, y1: 0.74, x2: 0.44, y2: 0.53, angle: -38, region: 'west flap', weak: false, required: 'valley', order: 1 },
        { id: 2, x1: 0.42, y1: 0.53, x2: 0.70, y2: 0.50, angle: -5, region: 'center bridge', weak: true, required: 'mountain', order: 2 },
        { id: 3, x1: 0.68, y1: 0.49, x2: 0.84, y2: 0.26, angle: -55, region: 'cedar gate', weak: false, required: 'valley', order: 3 },
        { id: 4, x1: 0.27, y1: 0.30, x2: 0.73, y2: 0.80, angle: 47, region: 'cover flap', weak: true, required: null, order: 4 }
      ],
      seals: [
        { id: 'B', x: 0.36, y: 0.46, hiddenBy: 4, revealWhen: 'unfolded', collected: false },
        { id: 'C', x: 0.72, y: 0.38, hiddenBy: 2, revealWhen: 'mountain', collected: false }
      ],
      required: { valley: 2, mountain: 1, seals: 2 },
      bonus: 980
    },
    {
      name: 'Dawn Crane Flight',
      timeLimit: 118,
      cap: 68,
      text: 'Build ridge + trough route, dodge fog gap, reveal a hidden seal by unfolding.',
      start: { x: 0.17, y: 0.80 },
      gate: { x: 0.83, y: 0.22 },
      fog: { x: 0.50, y: 0.40, r: 0.075, vx: 0.009 },
      creases: [
        { id: 1, x1: 0.17, y1: 0.78, x2: 0.34, y2: 0.62, angle: -43, region: 'launch trough', weak: false, required: 'valley', order: 1 },
        { id: 2, x1: 0.34, y1: 0.62, x2: 0.61, y2: 0.36, angle: -43, region: 'raised ridge', weak: true, required: 'mountain', order: 2 },
        { id: 3, x1: 0.58, y1: 0.37, x2: 0.83, y2: 0.22, angle: -31, region: 'gate trough', weak: false, required: 'valley', order: 3 },
        { id: 4, x1: 0.25, y1: 0.30, x2: 0.77, y2: 0.73, angle: 40, region: 'veil flap', weak: true, required: null, order: 4 },
        { id: 5, x1: 0.50, y1: 0.18, x2: 0.50, y2: 0.82, angle: 90, region: 'spine fold', weak: true, required: null, order: 5 }
      ],
      seals: [
        { id: 'D', x: 0.32, y: 0.60, hiddenBy: null, collected: false },
        { id: 'E', x: 0.55, y: 0.40, hiddenBy: 4, revealWhen: 'unfolded', collected: false },
        { id: 'F', x: 0.75, y: 0.28, hiddenBy: 2, revealWhen: 'mountain', collected: false }
      ],
      required: { valley: 2, mountain: 1, seals: 3 },
      bonus: 1120
    }
  ];

  const state = {
    screen: 'menu',
    score: 0,
    feathers: 3,
    stress: 0,
    combo: 1,
    chapterIndex: 0,
    chapter: null,
    selected: 0,
    folds: new Map(),
    creaseStress: new Map(),
    launched: false,
    launchT: 0,
    launchPath: [],
    crane: { x: 0, y: 0 },
    startTime: 0,
    pausedAt: 0,
    elapsedPaused: 0,
    sealsCollected: 0,
    runSeals: 0,
    perfectStreak: 0,
    longestStreak: best.longestStreak || 0,
    highestEndless: best.highestEndless || 0,
    blessing: false,
    badges: new Set(best.badges || []),
    reinforceCharge: 2,
    commissionDone: false,
    endlessNumber: 0
  };

  function loadBest() {
    try {
      return { bestScore: 0, bestBlessing: null, longestStreak: 0, highestEndless: 0, mostSeals: 0, badges: [], ...JSON.parse(localStorage.getItem(storageKey) || '{}') };
    } catch {
      return { bestScore: 0, bestBlessing: null, longestStreak: 0, highestEndless: 0, mostSeals: 0, badges: [] };
    }
  }

  function saveBest() {
    const out = {
      bestScore: Math.max(best.bestScore || 0, state.score),
      bestBlessing: best.bestBlessing,
      longestStreak: Math.max(best.longestStreak || 0, state.longestStreak),
      highestEndless: Math.max(best.highestEndless || 0, state.highestEndless),
      mostSeals: Math.max(best.mostSeals || 0, state.runSeals),
      badges: Array.from(new Set([...(best.badges || []), ...state.badges]))
    };
    if (state.blessing) {
      const time = Math.floor(elapsed());
      out.bestBlessing = best.bestBlessing ? Math.min(best.bestBlessing, time) : time;
    }
    Object.assign(best, out);
    localStorage.setItem(storageKey, JSON.stringify(out));
  }

  function chapterTemplate(index) {
    if (index < authored.length) return structuredClone(authororedFix(authored[index]));
    const n = index - authored.length + 1;
    const base = structuredClone(authored[2]);
    base.name = `Endless Commission ${n}`;
    base.text = `Endless: ${2 + (n % 2)} valley, ${1 + (n % 2)} mountain, ${3 + (n % 3)} seals, stress under ${Math.max(48, 66 - n)}%.`;
    base.timeLimit = Math.max(62, 112 - n * 5);
    base.cap = Math.max(48, 66 - n);
    base.required = { valley: 2 + (n % 2), mountain: 1 + (n % 2), seals: 3 + (n % 3) };
    base.bonus = 880 + n * 90;
    base.creases = base.creases.concat([
      { id: 6, x1: 0.19, y1: 0.50, x2: 0.80, y2: 0.64, angle: 13, region: 'endless shelf', weak: n % 2 === 0, required: n % 2 ? 'mountain' : 'valley', order: 6 }
    ]);
    base.seals = base.seals.concat([{ id: `X${n}`, x: 0.45 + (n % 3) * 0.08, y: 0.27 + (n % 2) * 0.2, hiddenBy: 6, revealWhen: n % 2 ? 'mountain' : 'valley', collected: false }]);
    return base;
  }

  // structuredClone is strict; this hook is intentionally boring but keeps all chapters detached.
  function authororedFix(chapter) { return chapter; }

  function startRun() {
    state.screen = 'playing';
    state.score = 0;
    state.feathers = 3;
    state.stress = 0;
    state.combo = 1;
    state.chapterIndex = 0;
    state.blessing = false;
    state.badges = new Set(best.badges || []);
    state.runSeals = 0;
    state.sealsCollected = 0;
    state.perfectStreak = 0;
    state.reinforceCharge = 2;
    state.startTime = performance.now();
    state.elapsedPaused = 0;
    state.endlessNumber = 0;
    setChapter(0);
    $('menu').hidden = true;
    $('results').hidden = true;
    $('pause').hidden = true;
    $('game').hidden = false;
    showToast('Select a glowing crease, then make a Valley Fold.');
    updateHud();
    loop();
  }

  function setChapter(index) {
    state.chapterIndex = index;
    state.chapter = chapterTemplate(index);
    state.folds = new Map();
    state.creaseStress = new Map();
    state.selected = 0;
    state.launched = false;
    state.launchT = 0;
    state.launchPath = [];
    state.crane = { ...state.chapter.start };
    state.sealsCollected = 0;
    state.commissionDone = false;
    if (index >= authored.length) state.endlessNumber = index - authored.length + 1;
    if (index === 0) state.stress = 0;
    updateCommission();
    resizeCanvas();
  }

  function elapsed() {
    if (!state.startTime) return 0;
    const now = state.screen === 'paused' ? state.pausedAt : performance.now();
    return Math.max(0, (now - state.startTime - state.elapsedPaused) / 1000);
  }

  function timeRemaining() {
    return state.chapter.timeLimit - (elapsed() % state.chapter.timeLimit);
  }

  function countFolds(type) {
    let n = 0;
    for (const v of state.folds.values()) if (v === type) n++;
    return n;
  }

  function visibleSeal(seal) {
    if (!seal.hiddenBy) return true;
    const fold = state.folds.get(seal.hiddenBy) || 'flat';
    if (seal.revealWhen === 'unfolded') return fold === 'flat';
    return fold === seal.revealWhen;
  }

  function requirementsMet() {
    const req = state.chapter.required;
    return countFolds('valley') >= req.valley && countFolds('mountain') >= req.mountain && state.sealsCollected >= req.seals && state.stress <= state.chapter.cap;
  }

  function applyFold(type) {
    if (state.screen !== 'playing' || state.launched) return;
    const crease = state.chapter.creases[state.selected];
    const prior = state.folds.get(crease.id) || 'flat';
    if (type === 'unfold') {
      if (prior === 'flat') return showToast('That crease is already flat.');
      state.folds.delete(crease.id);
      addStress(crease, 2);
      addScore(20);
      showToast(`Crease ${crease.id} unfolded; hidden layers shift.`);
    } else {
      state.folds.set(crease.id, type);
      const correct = !crease.required || crease.required === type;
      addStress(crease, correct ? (prior === 'flat' ? 5 : 8) : 10);
      if (correct) {
        addScore(65 * state.combo);
        state.combo = clamp(state.combo + 0.25, 1, 4);
        showToast(`${type === 'mountain' ? 'Mountain ridge' : 'Valley trough'} set on Crease ${crease.id}.`);
      } else {
        state.combo = 1;
        showToast('Wrong fold direction: preview turns amber and stress rises.');
      }
    }
    updateHud();
    draw();
  }

  function reinforce() {
    if (state.screen !== 'playing' || state.launched) return;
    const crease = state.chapter.creases[state.selected];
    if (state.reinforceCharge <= 0) return showToast('No rice-paper tabs charged yet.');
    state.reinforceCharge -= 1;
    const before = state.stress;
    state.stress = clamp(state.stress - (crease.weak ? 16 : 10), 0, 100);
    state.creaseStress.set(crease.id, Math.max(0, (state.creaseStress.get(crease.id) || 0) - 14));
    state.combo = Math.max(1, state.combo - 0.35);
    showToast(`Reinforced ${crease.region}; stress ${Math.round(before)}% → ${Math.round(state.stress)}%.`);
    updateHud();
    draw();
  }

  function addStress(crease, amount) {
    const weakBonus = crease.weak ? 4 : 0;
    const local = (state.creaseStress.get(crease.id) || 0) + amount + weakBonus;
    state.creaseStress.set(crease.id, local);
    state.stress = clamp(state.stress + amount + weakBonus + (local > 22 ? 5 : 0), 0, 100);
    if (state.stress >= 100) endRun('The washi tore across a tired grain line.');
  }

  function addScore(points) {
    state.score += Math.round(points);
    if (state.score > (best.bestScore || 0)) best.bestScore = state.score;
  }

  function previewPath() {
    const ch = state.chapter;
    const foldedRequired = ch.creases
      .filter((c) => state.folds.has(c.id))
      .sort((a, b) => a.order - b.order)
      .map((c) => ({ x: (c.x1 + c.x2) / 2, y: (c.y1 + c.y2) / 2, crease: c, type: state.folds.get(c.id) }));
    const core = foldedRequired.length ? foldedRequired : [{ x: lerp(ch.start.x, ch.gate.x, .45), y: lerp(ch.start.y, ch.gate.y, .55), type: 'flat' }];
    return [ch.start, ...core, ch.gate];
  }

  function routeCrossesFog(path) {
    const fog = currentFog();
    for (let i = 0; i < path.length - 1; i++) {
      if (distanceToSegment(fog, path[i], path[i + 1]) < fog.r * 0.82) return true;
    }
    return false;
  }

  function launch() {
    if (state.screen !== 'playing' || state.launched) return;
    state.launchPath = previewPath();
    state.launched = true;
    state.launchT = 0;
    const path = state.launchPath;
    const fogHit = routeCrossesFog(path) && state.chapterIndex >= 2;
    const missing = countFolds('valley') < state.chapter.required.valley || countFolds('mountain') < state.chapter.required.mountain;
    if (missing) showToast('The crane senses an unfolded gap in the route.');
    if (fogHit) showToast('A drifting fog gap crosses the preview route.');
    loop();
  }

  function finishLaunch() {
    const path = state.launchPath;
    let sealsThisLaunch = 0;
    for (const seal of state.chapter.seals) {
      if (!seal.collected && visibleSeal(seal) && path.some((p, i) => i < path.length - 1 && distanceToSegment(seal, p, path[i + 1]) < 0.075)) {
        seal.collected = true;
        state.sealsCollected += 1;
        state.runSeals += 1;
        sealsThisLaunch += 1;
        addScore(120 * state.combo);
      }
    }
    addScore(Math.max(0, path.length - 2) * 70);
    if (sealsThisLaunch >= 3) state.badges.add('Seal Chain');
    best.mostSeals = Math.max(best.mostSeals || 0, sealsThisLaunch);

    const fogHit = routeCrossesFog(path) && state.chapterIndex >= 2;
    const ok = requirementsMet() && !fogHit;
    state.launched = false;
    if (ok) completeCommission(sealsThisLaunch);
    else {
      state.feathers -= 1;
      state.combo = 1;
      state.stress = clamp(state.stress + 12, 0, 100);
      showToast(fogHit ? 'Crane feather lost in the fog gap.' : 'Path incoherent: a feather snapped at an unfolded gap.');
      if (state.feathers <= 0 || state.stress >= 100) endRun('The crane can no longer fly safely.');
    }
    updateHud();
  }

  function completeCommission(sealsThisLaunch) {
    const perfect = state.feathers === 3 && state.stress <= state.chapter.cap;
    addScore(state.chapter.bonus + (perfect ? 480 : 0));
    state.reinforceCharge = clamp(state.reinforceCharge + 1, 0, 4);
    if (state.feathers < 3) state.feathers += 1;
    if (perfect) {
      state.perfectStreak += 1;
      state.longestStreak = Math.max(state.longestStreak, state.perfectStreak);
    } else state.perfectStreak = 0;
    if (state.chapterIndex === 0 && state.stress === 0) state.badges.add('Zero-Stress First Crease');
    if (state.runSeals >= 12) state.badges.add('Twelve Coral Seals');
    if (state.perfectStreak >= 1 && state.reinforceCharge >= 2) state.badges.add('No-Tab Commission');
    if (previewPath().length >= 6) state.badges.add('Four-Feature Flight');
    if (state.chapterIndex >= authored.length && state.feathers === 3) state.badges.add('Endless Full Feathers');
    showToast(`${state.chapter.name} stamped complete! +${state.chapter.bonus}`);
    state.commissionDone = true;

    if (!state.blessing && state.chapterIndex >= 2 && state.score >= 2800) {
      state.blessing = true;
      state.badges.add('Kiri Thousand-Fold Blessing');
      if (elapsed() <= 190) state.badges.add('Sub-190 Dawn Blessing');
      addScore(940);
      triggerBlessing();
    }
    state.highestEndless = Math.max(state.highestEndless, state.endlessNumber);
    saveBest();
    setTimeout(() => {
      if (state.screen === 'playing') setChapter(state.chapterIndex + 1);
      updateHud();
    }, 900);
  }

  function triggerBlessing() {
    const banner = $('blessing');
    banner.hidden = false;
    setTimeout(() => { banner.hidden = true; }, 2200);
  }

  function endRun(reason) {
    state.screen = 'results';
    saveBest();
    $('game').hidden = true;
    $('pause').hidden = true;
    $('results').hidden = false;
    $('result-summary').textContent = `${reason} Final score ${state.score}. Reached ${state.chapter?.name || 'the cutting mat'} with ${state.runSeals} seals and ${state.longestStreak} perfect streak.`;
    const badges = Array.from(state.badges);
    $('badge-list').innerHTML = badges.length ? badges.map((b) => `<span>${escapeHtml(b)}</span>`).join('') : '<span>Practice Foldwright</span>';
    cancelAnimationFrame(raf);
  }

  function currentFog() {
    const f = state.chapter.fog;
    const t = elapsed();
    const drift = Math.sin(t * 0.9) * f.vx * 20;
    return { ...f, x: clamp(f.x + drift, 0.22, 0.78) };
  }

  function updateHud() {
    $('score').textContent = state.score;
    $('best').textContent = best.bestScore || 0;
    $('feathers').textContent = '🪶'.repeat(Math.max(0, state.feathers)) || '0';
    $('stress').textContent = `${Math.round(state.stress)}%`;
    $('chapter').textContent = state.chapter?.name || 'First Crease';
    $('combo').textContent = `x${state.combo.toFixed(2).replace(/\.00$/, '')}`;
    $('time').textContent = fmtTime(elapsed());
    const crease = state.chapter?.creases[state.selected];
    if (crease) {
      const fold = state.folds.get(crease.id) || 'flat';
      $('selected-name').textContent = `Crease ${crease.id}`;
      $('selected-detail').textContent = `${crease.angle}° · ${crease.region} · ${fold} · stress +${crease.weak ? '9-14' : '5-10'} · ${crease.required ? `needs ${crease.required}` : 'optional reveal fold'}`;
    }
    $('reinforce-btn').textContent = `Reinforce (${state.reinforceCharge})`;
    $('launch-btn').textContent = requirementsMet() ? 'Launch Crane ✓' : 'Launch Crane';
    updateCommission();
  }

  function updateCommission() {
    if (!state.chapter) return;
    $('commission-title').textContent = state.chapter.name;
    $('commission-text').textContent = state.chapter.text;
    const req = state.chapter.required;
    const chips = [
      `Valley ${countFolds('valley')}/${req.valley}`,
      `Mountain ${countFolds('mountain')}/${req.mountain}`,
      `Seals ${state.sealsCollected}/${req.seals}`,
      `Stress cap ${Math.round(state.stress)}/${state.chapter.cap}%`,
      `Tabs ${state.reinforceCharge}`
    ];
    $('commission-chips').innerHTML = chips.map((c) => `<span>${escapeHtml(c)}</span>`).join('');
  }

  function showToast(text) {
    const el = $('toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2100);
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.max(600, Math.floor(rect.width * scale));
    canvas.height = Math.max(620, Math.floor(rect.height * scale));
    draw();
  }

  function point(n) {
    const w = canvas.width, h = canvas.height;
    return { x: n.x * w, y: n.y * h };
  }

  function draw() {
    if (!state.chapter) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    drawMat(w, h);
    drawPaper(w, h);
    drawFoldLayers(w, h);
    drawSeals(w, h);
    drawCreases(w, h);
    drawRoute(w, h);
    drawGateAndCrane(w, h);
    drawStressWisps(w, h);
  }

  function drawMat(w, h) {
    ctx.save();
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#4e8a78');
    grad.addColorStop(1, '#234e45');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(245,237,189,.16)';
    ctx.lineWidth = Math.max(1, w * .0015);
    const step = w / 18;
    for (let x = 0; x <= w; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y <= h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.restore();
  }

  function drawPaper(w, h) {
    ctx.save();
    const x = w * .08, y = h * .08, pw = w * .84, ph = h * .80;
    ctx.shadowColor = 'rgba(30,26,16,.28)';
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = 'rgba(255,249,228,.86)';
    roundedRect(x, y, pw, ph, 28);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(90,114,101,.38)';
    ctx.lineWidth = 3;
    ctx.stroke();
    for (let i = 0; i < 40; i++) {
      const gx = x + ((i * 73) % 1000) / 1000 * pw;
      const gy = y + ((i * 151) % 1000) / 1000 * ph;
      ctx.strokeStyle = `rgba(103,119,100,${0.05 + (i % 5) * 0.01})`;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.sin(i) * 90, gy + Math.cos(i * 2) * 55); ctx.stroke();
    }
    ctx.restore();
  }

  function drawFoldLayers(w, h) {
    const folds = state.chapter.creases.filter((c) => state.folds.has(c.id)).sort((a, b) => a.order - b.order);
    folds.forEach((crease, i) => {
      const a = point({ x: crease.x1, y: crease.y1 });
      const b = point({ x: crease.x2, y: crease.y2 });
      const type = state.folds.get(crease.id);
      const nx = -(b.y - a.y), ny = b.x - a.x;
      const len = Math.hypot(nx, ny) || 1;
      const depth = type === 'mountain' ? 34 + i * 6 : -18 - i * 4;
      const ox = nx / len * depth, oy = ny / len * depth;
      ctx.save();
      ctx.globalAlpha = type === 'mountain' ? .66 : .42;
      ctx.fillStyle = type === 'mountain' ? 'rgba(245,246,226,.9)' : 'rgba(205,229,222,.8)';
      ctx.strokeStyle = type === 'mountain' ? 'rgba(195,111,48,.55)' : 'rgba(42,109,147,.56)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(b.x + ox, b.y + oy); ctx.lineTo(a.x + ox, a.y + oy); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.restore();
    });
  }

  function drawSeals(w, h) {
    for (const seal of state.chapter.seals) {
      if (seal.collected || !visibleSeal(seal)) continue;
      const p = point(seal);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = '#d6513d';
      ctx.strokeStyle = 'rgba(255,248,220,.9)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = (i % 2 ? 13 : 18) * (w / 900);
        const a = i * Math.PI / 4;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff8e6';
      ctx.font = `${16 * w / 900}px system-ui`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('印', 0, 1);
      ctx.restore();
    }
  }

  function drawCreases(w, h) {
    state.chapter.creases.forEach((c, i) => {
      const a = point({ x: c.x1, y: c.y1 }), b = point({ x: c.x2, y: c.y2 });
      const selected = i === state.selected;
      const fold = state.folds.get(c.id);
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineWidth = selected ? Math.max(15, w * .018) : Math.max(11, w * .013);
      ctx.strokeStyle = selected ? 'rgba(255,218,98,.74)' : 'rgba(188,255,230,.42)';
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.lineWidth = selected ? Math.max(5, w * .006) : Math.max(4, w * .005);
      ctx.setLineDash(fold === 'mountain' ? [] : [16, 12]);
      ctx.strokeStyle = fold === 'mountain' ? '#c86a32' : fold === 'valley' ? '#216fb8' : '#effff8';
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.setLineDash([]);
      const mid = point({ x: (c.x1 + c.x2) / 2, y: (c.y1 + c.y2) / 2 });
      ctx.fillStyle = selected ? '#20322e' : 'rgba(31,50,46,.78)';
      ctx.beginPath(); ctx.arc(mid.x, mid.y, Math.max(13, w * .015), 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff8e6'; ctx.font = `bold ${14 * w / 900}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(c.id, mid.x, mid.y);
      ctx.restore();
    });
  }

  function drawRoute(w, h) {
    const path = previewPath().map(point);
    ctx.save();
    ctx.lineWidth = Math.max(4, w * .006);
    ctx.setLineDash([8, 12]);
    ctx.strokeStyle = requirementsMet() ? 'rgba(255,255,242,.9)' : 'rgba(255,185,75,.82)';
    ctx.beginPath();
    path.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    ctx.stroke();
    ctx.setLineDash([]);
    for (let i = 1; i < path.length; i++) {
      const a = path[i - 1], b = path[i];
      const t = .66;
      const x = lerp(a.x, b.x, t), y = lerp(a.y, b.y, t);
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
      ctx.fillStyle = 'rgba(255,255,242,.9)';
      ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(-6, -7); ctx.lineTo(-3, 0); ctx.lineTo(-6, 7); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    const fog = point(currentFog());
    const fr = currentFog().r * w;
    ctx.fillStyle = 'rgba(229,240,241,.58)';
    ctx.beginPath(); ctx.arc(fog.x, fog.y, fr, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.72)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
  }

  function drawGateAndCrane(w, h) {
    const s = point(state.chapter.start), g = point(state.chapter.gate);
    ctx.save();
    ctx.fillStyle = '#fff8dc'; ctx.strokeStyle = '#2f6b5d'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(s.x, s.y, 17 * w / 900, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#153c35'; ctx.font = `bold ${13 * w / 900}px system-ui`; ctx.textAlign = 'center'; ctx.fillText('start', s.x, s.y + 34 * w / 900);
    ctx.translate(g.x, g.y);
    ctx.strokeStyle = '#c54434'; ctx.lineWidth = 8 * w / 900; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-24*w/900, 20*w/900); ctx.lineTo(-18*w/900, -20*w/900); ctx.moveTo(24*w/900, 20*w/900); ctx.lineTo(18*w/900, -20*w/900); ctx.moveTo(-34*w/900, -20*w/900); ctx.lineTo(34*w/900, -20*w/900); ctx.moveTo(-28*w/900, -5*w/900); ctx.lineTo(28*w/900, -5*w/900); ctx.stroke();
    ctx.restore();
    const c = point(state.crane);
    drawCrane(c.x, c.y, w / 900);
  }

  function drawCrane(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#fffdf0'; ctx.strokeStyle = '#6b756c'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(18, 7); ctx.lineTo(2, 5); ctx.lineTo(-14, 17); ctx.lineTo(-7, 1); ctx.lineTo(-25, -2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(2, -7); ctx.lineTo(26, -19); ctx.lineTo(12, -1); ctx.stroke();
    ctx.fillStyle = '#d6513d'; ctx.beginPath(); ctx.arc(25, -19, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawStressWisps(w, h) {
    for (const c of state.chapter.creases) {
      const local = state.creaseStress.get(c.id) || 0;
      if (local < 12) continue;
      const mid = point({ x: (c.x1 + c.x2) / 2, y: (c.y1 + c.y2) / 2 });
      ctx.save();
      ctx.strokeStyle = `rgba(164, 48, 38, ${clamp(local / 45, .25, .8)})`;
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(mid.x - 16 + i * 12, mid.y - 20);
        ctx.bezierCurveTo(mid.x - 28 + i * 8, mid.y - 6, mid.x + 22 - i * 6, mid.y + 5, mid.x + i * 8, mid.y + 20);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function roundedRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function loop() {
    cancelAnimationFrame(raf);
    const tick = () => {
      if (state.screen !== 'playing') return;
      if (state.launched) {
        state.launchT += 0.012;
        followLaunch();
      }
      if (timeRemaining() <= 0) return endRun('The dawn bell rang before the commission was finished.');
      draw();
      updateHud();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  function followLaunch() {
    const path = state.launchPath;
    const totalSeg = path.length - 1;
    const raw = clamp(state.launchT * totalSeg, 0, totalSeg);
    const idx = Math.min(totalSeg - 1, Math.floor(raw));
    const t = raw - idx;
    state.crane = { x: lerp(path[idx].x, path[idx + 1].x, t), y: lerp(path[idx].y, path[idx + 1].y, t) };
    if (state.launchT >= 1) finishLaunch();
  }

  function distanceToSegment(p, a, b) {
    const vx = b.x - a.x, vy = b.y - a.y;
    const wx = p.x - a.x, wy = p.y - a.y;
    const c1 = vx * wx + vy * wy;
    if (c1 <= 0) return Math.hypot(p.x - a.x, p.y - a.y);
    const c2 = vx * vx + vy * vy;
    if (c2 <= c1) return Math.hypot(p.x - b.x, p.y - b.y);
    const t = c1 / c2;
    return Math.hypot(p.x - (a.x + t * vx), p.y - (a.y + t * vy));
  }

  function selectAt(clientX, clientY) {
    if (state.screen !== 'playing' || state.launched) return;
    const rect = canvas.getBoundingClientRect();
    const p = { x: (clientX - rect.left) / rect.width, y: (clientY - rect.top) / rect.height };
    let bestIdx = 0, bestDist = Infinity;
    state.chapter.creases.forEach((c, i) => {
      const d = distanceToSegment(p, { x: c.x1, y: c.y1 }, { x: c.x2, y: c.y2 });
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    });
    if (bestDist < 0.075) {
      state.selected = bestIdx;
      showToast(`Selected Crease ${state.chapter.creases[bestIdx].id}.`);
      updateHud(); draw();
    }
  }

  function pause() {
    if (state.screen !== 'playing') return;
    state.screen = 'paused';
    state.pausedAt = performance.now();
    $('pause').hidden = false;
    cancelAnimationFrame(raf);
  }

  function resume() {
    if (state.screen !== 'paused') return;
    state.elapsedPaused += performance.now() - state.pausedAt;
    state.screen = 'playing';
    $('pause').hidden = true;
    loop();
  }

  function restart() { startRun(); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  }

  function wire() {
    $('menu-best').textContent = best.bestScore || 0;
    $('menu-blessing').textContent = best.bestBlessing ? fmtTime(best.bestBlessing) : '—';
    $('start-btn').addEventListener('click', startRun);
    $('resume-btn').addEventListener('click', resume);
    $('pause-restart-btn').addEventListener('click', restart);
    $('results-restart-btn').addEventListener('click', restart);
    $('mountain-btn').addEventListener('click', () => applyFold('mountain'));
    $('valley-btn').addEventListener('click', () => applyFold('valley'));
    $('unfold-btn').addEventListener('click', () => applyFold('unfold'));
    $('reinforce-btn').addEventListener('click', reinforce);
    $('launch-btn').addEventListener('click', launch);
    $('pause-btn').addEventListener('click', pause);
    $('restart-btn').addEventListener('click', restart);
    canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); selectAt(e.clientX, e.clientY); });
    canvas.addEventListener('pointermove', (e) => { if (e.buttons) selectAt(e.clientX, e.clientY); });
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('keydown', (e) => {
      if (e.target && ['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes(e.target.tagName)) return;
      if (state.screen === 'menu' && [' ', 'Enter'].includes(e.key)) { e.preventDefault(); startRun(); return; }
      if (e.key.toLowerCase() === 'p') { state.screen === 'paused' ? resume() : pause(); return; }
      if (e.key.toLowerCase() === 'r') return restart();
      if (state.screen !== 'playing') return;
      if (['ArrowRight', 'ArrowDown', 'd', 's'].includes(e.key)) { state.selected = (state.selected + 1) % state.chapter.creases.length; updateHud(); draw(); }
      if (['ArrowLeft', 'ArrowUp', 'a', 'w'].includes(e.key)) { state.selected = (state.selected - 1 + state.chapter.creases.length) % state.chapter.creases.length; updateHud(); draw(); }
      if (e.key.toLowerCase() === 'm') applyFold('mountain');
      if (e.key.toLowerCase() === 'v') applyFold('valley');
      if (e.key.toLowerCase() === 'u' || e.key === 'Backspace') applyFold('unfold');
      if (e.key.toLowerCase() === 'f') reinforce();
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); launch(); }
    });
  }

  wire();
})();
