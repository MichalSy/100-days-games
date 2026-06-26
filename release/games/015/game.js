(() => {
  'use strict';

  const storageKey = 'midori-bamboo-canal-keeper-v1';
  const dirs = {
    N: { r: -1, c: 0, angle: -Math.PI / 2 },
    E: { r: 0, c: 1, angle: 0 },
    S: { r: 1, c: 0, angle: Math.PI / 2 },
    W: { r: 0, c: -1, angle: Math.PI }
  };
  const order = ['N', 'E', 'S', 'W'];
  const opposite = { N: 'S', E: 'W', S: 'N', W: 'E' };
  const baseOpenings = {
    source: ['S'],
    straight: ['N', 'S'],
    elbow: ['N', 'E'],
    tee: ['N', 'E', 'W'],
    cross: ['N', 'E', 'S', 'W'],
    oneway: ['N', 'S'],
    basin: ['N', 'E', 'S', 'W'],
    lotus: ['N', 'E', 'S', 'W']
  };
  const colorInfo = {
    blue: { label: 'Blue clear', icon: '💧', fill: '#38bdf8' },
    green: { label: 'Green moss', icon: '🌿', fill: '#22c55e' },
    gold: { label: 'Gold koi', icon: '🟠', fill: '#f59e0b' }
  };
  const chapters = [
    {
      name: 'Dew Gate',
      text: 'Water 2 blue basins, lock one route, and keep overflow below 35%.',
      limit: 70,
      droughtRate: 0.018,
      overflowTarget: 35,
      droughtTarget: 55,
      water: ['blue', 'blue', 'green'],
      targets: { blue: 2 },
      koi: 1,
      board: [
        [{ type: 'empty' }, { type: 'empty' }, { type: 'source', rotation: 0 }, { type: 'empty' }, { type: 'empty' }],
        [{ type: 'basin', color: 'blue', label: 'B1' }, { type: 'elbow', rotation: 1 }, { type: 'straight', rotation: 0 }, { type: 'elbow', rotation: 2 }, { type: 'empty' }],
        [{ type: 'empty' }, { type: 'straight', rotation: 1, koi: true }, { type: 'elbow', rotation: 0 }, { type: 'straight', rotation: 0 }, { type: 'basin', color: 'blue', label: 'B2' }],
        [{ type: 'empty' }, { type: 'empty' }, { type: 'straight', rotation: 1 }, { type: 'elbow', rotation: 3 }, { type: 'empty' }],
        [{ type: 'empty' }, { type: 'empty' }, { type: 'lotus', color: 'green', label: 'L' }, { type: 'empty' }, { type: 'empty' }]
      ]
    },
    {
      name: 'Frog Basin',
      text: 'Feed 2 green moss basins, 1 lotus bowl, collect 2 koi beads, and manage the first sun crack.',
      limit: 82,
      droughtRate: 0.04,
      overflowTarget: 32,
      droughtTarget: 65,
      water: ['green', 'blue', 'green', 'gold'],
      targets: { green: 2, blue: 1 },
      koi: 2,
      board: [
        [{ type: 'empty' }, { type: 'basin', color: 'blue', label: 'B' }, { type: 'source', rotation: 0 }, { type: 'empty' }, { type: 'basin', color: 'green', label: 'M1' }],
        [{ type: 'straight', rotation: 1 }, { type: 'tee', rotation: 1 }, { type: 'straight', rotation: 0, cracked: true }, { type: 'elbow', rotation: 2 }, { type: 'straight', rotation: 0 }],
        [{ type: 'empty' }, { type: 'elbow', rotation: 0, koi: true }, { type: 'tee', rotation: 2 }, { type: 'straight', rotation: 1 }, { type: 'basin', color: 'green', label: 'M2' }],
        [{ type: 'lotus', color: 'blue', label: 'Lotus' }, { type: 'straight', rotation: 1 }, { type: 'elbow', rotation: 3 }, { type: 'tee', rotation: 0, koi: true }, { type: 'empty' }],
        [{ type: 'empty' }, { type: 'empty' }, { type: 'basin', color: 'green', label: 'M3' }, { type: 'straight', rotation: 0 }, { type: 'empty' }]
      ]
    },
    {
      name: 'Sunlit Grove',
      text: 'Complete mixed blue/green/gold requests while sunbeam cracks threaten the center lane.',
      limit: 92,
      droughtRate: 0.062,
      overflowTarget: 28,
      droughtTarget: 70,
      water: ['blue', 'green', 'gold', 'green', 'blue'],
      targets: { blue: 2, green: 2, gold: 1 },
      koi: 3,
      board: [
        [{ type: 'basin', color: 'gold', label: 'Koi' }, { type: 'straight', rotation: 1 }, { type: 'source', rotation: 0 }, { type: 'tee', rotation: 2 }, { type: 'basin', color: 'blue', label: 'B1' }],
        [{ type: 'elbow', rotation: 1, cracked: true }, { type: 'tee', rotation: 0 }, { type: 'straight', rotation: 0 }, { type: 'elbow', rotation: 2, koi: true }, { type: 'straight', rotation: 0 }],
        [{ type: 'basin', color: 'green', label: 'M1' }, { type: 'cross', rotation: 0, koi: true }, { type: 'tee', rotation: 3, cracked: true }, { type: 'straight', rotation: 1 }, { type: 'basin', color: 'green', label: 'M2' }],
        [{ type: 'straight', rotation: 0 }, { type: 'elbow', rotation: 3 }, { type: 'straight', rotation: 1 }, { type: 'tee', rotation: 1, koi: true }, { type: 'elbow', rotation: 2 }],
        [{ type: 'lotus', color: 'blue', label: 'Lotus' }, { type: 'empty' }, { type: 'basin', color: 'green', label: 'M3' }, { type: 'straight', rotation: 1, cracked: true }, { type: 'basin', color: 'blue', label: 'B2' }]
      ]
    }
  ];

  const els = {
    canvas: document.getElementById('game-canvas'),
    menu: document.getElementById('menu'),
    start: document.getElementById('start-button'),
    score: document.getElementById('score'),
    best: document.getElementById('best-score'),
    hearts: document.getElementById('hearts'),
    drought: document.getElementById('drought'),
    overflow: document.getElementById('overflow'),
    chapter: document.getElementById('chapter'),
    combo: document.getElementById('combo'),
    elapsed: document.getElementById('elapsed'),
    commissionTitle: document.getElementById('commission-title'),
    commissionText: document.getElementById('commission-text'),
    requestChips: document.getElementById('request-chips'),
    selectedName: document.getElementById('selected-name'),
    selectedDetail: document.getElementById('selected-detail'),
    chargeFill: document.getElementById('charge-fill'),
    chargeText: document.getElementById('charge-text'),
    lock: document.getElementById('lock-button'),
    pulse: document.getElementById('pulse-button'),
    moss: document.getElementById('moss-button'),
    pause: document.getElementById('pause-button'),
    restart: document.getElementById('restart-button'),
    pauseOverlay: document.getElementById('pause-overlay'),
    resume: document.getElementById('resume-button'),
    pauseRestart: document.getElementById('pause-restart-button'),
    resultsOverlay: document.getElementById('results-overlay'),
    resultsBody: document.getElementById('results-body'),
    resultsRestart: document.getElementById('results-restart-button'),
    bloomBanner: document.getElementById('bloom-banner'),
    menuBest: document.getElementById('menu-best'),
    menuBloom: document.getElementById('menu-bloom'),
    menuStreak: document.getElementById('menu-streak')
  };
  const ctx = els.canvas.getContext('2d');
  const keeperImg = new Image();
  keeperImg.src = 'assets/midori-keeper.png';

  let state;
  let lastTick = performance.now();
  let animationId = 0;
  let pointerDownAt = 0;
  let pointerTile = null;

  function loadRecords() {
    try {
      return { best: 0, bloom: null, streak: 0, basins: 0, koi: 0, badges: [], ...JSON.parse(localStorage.getItem(storageKey) || '{}') };
    } catch {
      return { best: 0, bloom: null, streak: 0, basins: 0, koi: 0, badges: [] };
    }
  }
  function saveRecords(next) { localStorage.setItem(storageKey, JSON.stringify(next)); }
  const records = loadRecords();

  function cloneBoard(board) {
    return board.map(row => row.map(cell => ({ ...cell, filled: 0, patched: false })));
  }
  function makeState(chapterIndex = 0, keepScore = 0) {
    const chapter = chapters[Math.min(chapterIndex, chapters.length - 1)];
    return {
      running: true,
      paused: false,
      gameOver: false,
      endless: chapterIndex >= chapters.length,
      chapterIndex,
      chapter,
      board: cloneBoard(chapter.board),
      selected: { r: 1, c: 2 },
      score: keepScore,
      hearts: 3,
      drought: 0,
      overflow: 0,
      combo: 1,
      cleanStreak: 0,
      koiTotal: 0,
      pulseKoi: 0,
      mossCharge: chapterIndex === 0 ? 45 : 100,
      progress: Object.fromEntries(Object.keys(chapter.targets).map(k => [k, 0])),
      koiProgress: 0,
      elapsed: 0,
      commissionElapsed: 0,
      pulseIndex: 0,
      pulseReady: true,
      route: [],
      beads: [],
      messages: [],
      bloom: false,
      bloomTime: null,
      routeEffect: 'Preview the water route before pulsing.'
    };
  }

  function formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }
  function rotateDir(dir, turns) { return order[(order.indexOf(dir) + turns + 4) % 4]; }
  function openings(tile) {
    if (!tile || tile.type === 'empty') return [];
    const base = baseOpenings[tile.type] || [];
    return base.map(dir => rotateDir(dir, tile.rotation || 0));
  }
  function isCanal(tile) { return tile && ['straight', 'elbow', 'tee', 'cross', 'oneway'].includes(tile.type); }
  function isTarget(tile) { return tile && ['basin', 'lotus'].includes(tile.type); }
  function inBounds(r, c) { return r >= 0 && c >= 0 && r < state.board.length && c < state.board[0].length; }
  function tileCenter(r, c, metrics) { return { x: metrics.x + c * metrics.cell + metrics.cell / 2, y: metrics.y + r * metrics.cell + metrics.cell / 2 }; }
  function metrics() {
    const size = Math.min(els.canvas.width, els.canvas.height);
    const pad = size * 0.055;
    const rows = state.board.length;
    const cell = (size - pad * 2) / rows;
    return { size, pad, cell, x: pad, y: pad, rows };
  }
  function sourcePos() {
    for (let r = 0; r < state.board.length; r++) {
      for (let c = 0; c < state.board[r].length; c++) if (state.board[r][c].type === 'source') return { r, c };
    }
    return { r: 0, c: 2 };
  }

  function computeRoute() {
    if (!state) return { steps: [], deliveries: [], deadEnds: 0, cracks: 0, koi: 0, usefulSplit: false };
    const start = sourcePos();
    const waterColor = state.chapter.water[state.pulseIndex % state.chapter.water.length];
    const queue = [{ r: start.r, c: start.c, from: null, path: [`${start.r},${start.c}`] }];
    const seen = new Set();
    const result = { steps: [], deliveries: [], deadEnds: 0, cracks: 0, koi: 0, usefulSplit: false, waterColor };
    let splitUseful = 0;
    while (queue.length && result.steps.length < 80) {
      const cur = queue.shift();
      const key = `${cur.r},${cur.c},${cur.from || 'spring'}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const tile = state.board[cur.r][cur.c];
      result.steps.push({ r: cur.r, c: cur.c, tile });
      if (tile.cracked && !tile.patched && tile.type !== 'source') result.cracks += 1;
      if (tile.koi) result.koi += 1;
      if (isTarget(tile)) {
        result.deliveries.push({ r: cur.r, c: cur.c, tile, correct: tile.color === waterColor });
        if (tile.color === waterColor) splitUseful += 1;
        continue;
      }
      const outs = openings(tile).filter(dir => dir !== cur.from);
      if (outs.length > 1 && tile.type === 'tee') result.usefulSplit = true;
      let advanced = 0;
      for (const dir of outs) {
        const nr = cur.r + dirs[dir].r;
        const nc = cur.c + dirs[dir].c;
        if (!inBounds(nr, nc)) { result.deadEnds++; continue; }
        const next = state.board[nr][nc];
        const nextOpen = openings(next).includes(opposite[dir]);
        if (!nextOpen) { result.deadEnds++; continue; }
        const nk = `${nr},${nc}`;
        if (cur.path.includes(nk) && !isTarget(next)) continue;
        advanced += 1;
        queue.push({ r: nr, c: nc, from: opposite[dir], path: cur.path.concat(nk) });
      }
      if (!advanced && !isTarget(tile)) result.deadEnds++;
    }
    result.usefulSplit = result.usefulSplit && splitUseful >= 2;
    return result;
  }

  function updatePreview() {
    state.route = computeRoute();
    const deliveries = state.route.deliveries.filter(d => d.correct).length;
    const wrong = state.route.deliveries.length - deliveries;
    if (deliveries) state.routeEffect = `${colorInfo[state.route.waterColor].label} water reaches ${deliveries} matching basin${deliveries > 1 ? 's' : ''}.`;
    else if (wrong) state.routeEffect = 'Warning: route reaches a wrong-color basin.';
    else if (state.route.deadEnds) state.routeEffect = 'Warning: preview ends in blocked bamboo and will overflow.';
    else state.routeEffect = 'No basin connected yet; rotate bamboo toward a request.';
  }

  function resizeCanvas() {
    const rect = els.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    els.canvas.width = Math.round(rect.width * dpr);
    els.canvas.height = Math.round(rect.height * dpr);
    draw();
  }

  function drawBambooPath(x1, y1, x2, y2, width) {
    ctx.lineCap = 'round';
    ctx.lineWidth = width;
    ctx.strokeStyle = '#6b8e23';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.lineWidth = width * .68;
    ctx.strokeStyle = '#a3d34f';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.lineWidth = Math.max(2, width * .12);
    ctx.strokeStyle = 'rgba(55, 38, 20, .48)';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  function drawTile(tile, r, c, m) {
    const { x, y } = tileCenter(r, c, m);
    const cell = m.cell;
    const radius = cell * .42;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = (r + c) % 2 ? 'rgba(190, 242, 100, .28)' : 'rgba(187, 247, 208, .28)';
    ctx.strokeStyle = 'rgba(20, 83, 45, .18)';
    ctx.lineWidth = 2;
    roundRect(-cell * .45, -cell * .45, cell * .9, cell * .9, cell * .14, true, true);
    if (tile.type === 'empty') { ctx.restore(); return; }
    if (tile.locked) {
      ctx.fillStyle = 'rgba(245, 158, 11, .18)';
      roundRect(-cell * .45, -cell * .45, cell * .9, cell * .9, cell * .14, true, false);
      ctx.fillStyle = '#92400e';
      ctx.font = `900 ${cell * .18}px sans-serif`;
      ctx.fillText('LOCK', -cell * .25, -cell * .31);
    }
    if (tile.type === 'source') {
      const g = ctx.createRadialGradient(0, 0, 4, 0, 0, radius);
      g.addColorStop(0, '#e0f2fe'); g.addColorStop(1, '#0284c7');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, radius * .56, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f0fdf4';
      ctx.font = `900 ${cell * .18}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('SPRING', 0, cell * .05);
    } else if (isTarget(tile)) {
      ctx.fillStyle = tile.type === 'lotus' ? '#d9f99d' : '#d6d3d1';
      ctx.beginPath(); ctx.ellipse(0, 0, radius * .75, radius * .55, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#57534e'; ctx.lineWidth = cell * .06; ctx.stroke();
      ctx.fillStyle = colorInfo[tile.color].fill;
      ctx.globalAlpha = .35 + Math.min(0.45, tile.filled * .12);
      ctx.beginPath(); ctx.ellipse(0, 0, radius * .54, radius * .36, 0, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#1f2937'; ctx.textAlign = 'center'; ctx.font = `900 ${cell * .16}px sans-serif`;
      ctx.fillText(`${colorInfo[tile.color].icon} ${tile.label || colorInfo[tile.color].label}`, 0, cell * .08);
    } else {
      const opens = openings(tile);
      for (const dir of opens) {
        const d = dirs[dir];
        drawBambooPath(0, 0, d.c * radius, d.r * radius, cell * .25);
      }
      ctx.fillStyle = '#95c943';
      ctx.beginPath(); ctx.arc(0, 0, cell * .18, 0, Math.PI * 2); ctx.fill();
      if (tile.type === 'oneway') {
        ctx.fillStyle = '#0f766e'; ctx.font = `900 ${cell * .25}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('➜', 0, cell * .08);
      }
    }
    if (tile.cracked && !tile.patched) {
      ctx.strokeStyle = 'rgba(194, 65, 12, .95)'; ctx.lineWidth = Math.max(2, cell * .035);
      ctx.beginPath(); ctx.moveTo(-cell * .25, -cell * .27); ctx.lineTo(-cell * .05, -cell * .03); ctx.lineTo(-cell * .16, cell * .23); ctx.stroke();
      ctx.fillStyle = 'rgba(251, 191, 36, .32)'; ctx.beginPath(); ctx.arc(0, 0, cell * .39, 0, Math.PI * 2); ctx.fill();
    } else if (tile.patched) {
      ctx.fillStyle = '#22c55e'; ctx.font = `900 ${cell * .22}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('🌿', cell * .19, -cell * .2);
    }
    if (tile.koi) {
      ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(cell * .25, cell * .25, cell * .09, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff7ed'; ctx.font = `900 ${cell * .1}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText('koi', cell * .25, cell * .285);
    }
    if (state.selected.r === r && state.selected.c === c) {
      ctx.strokeStyle = '#f97316'; ctx.lineWidth = Math.max(3, cell * .04);
      roundRect(-cell * .47, -cell * .47, cell * .94, cell * .94, cell * .16, false, true);
    }
    ctx.restore();
  }
  function roundRect(x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r);
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }
  function drawPreview(m) {
    if (!state.route || !state.route.steps.length) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(125, 211, 252, .82)';
    ctx.lineWidth = Math.max(5, m.cell * .08);
    ctx.lineCap = 'round';
    ctx.setLineDash([m.cell * .13, m.cell * .11]);
    ctx.beginPath();
    let first = true;
    for (const step of state.route.steps) {
      const p = tileCenter(step.r, step.c, m);
      if (first) { ctx.moveTo(p.x, p.y); first = false; } else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke(); ctx.setLineDash([]);
    const water = colorInfo[state.route.waterColor].fill;
    for (const step of state.route.steps) {
      const p = tileCenter(step.r, step.c, m);
      ctx.fillStyle = water;
      ctx.beginPath(); ctx.arc(p.x, p.y, m.cell * .055, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  function drawBeads(m) {
    const now = performance.now();
    state.beads = state.beads.filter(b => now - b.started < b.duration);
    for (const bead of state.beads) {
      const t = (now - bead.started) / bead.duration;
      const idx = Math.min(bead.points.length - 1, Math.floor(t * bead.points.length));
      const p = bead.points[idx];
      if (!p) continue;
      ctx.save();
      ctx.fillStyle = bead.color;
      ctx.shadowColor = bead.color; ctx.shadowBlur = 15;
      ctx.beginPath(); ctx.arc(p.x, p.y, m.cell * (.09 + .03 * Math.sin(t * Math.PI)), 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }
  function drawTanuki(m) {
    const r = Math.min(state.board.length - 1, Math.max(0, state.selected.r));
    const c = Math.min(state.board[0].length - 1, Math.max(0, state.selected.c + 1));
    const p = tileCenter(r, c, m);
    const s = m.cell * .58;
    if (keeperImg.complete) ctx.drawImage(keeperImg, p.x + m.cell * .13, p.y - s * .75, s, s);
  }
  function drawSunbeam(m) {
    const phase = Math.floor((state.elapsed || 0) / 6) % state.board[0].length;
    ctx.save();
    ctx.fillStyle = 'rgba(251, 191, 36, .10)';
    ctx.fillRect(m.x + phase * m.cell, m.y, m.cell, m.cell * state.board.length);
    ctx.strokeStyle = 'rgba(251, 191, 36, .36)'; ctx.lineWidth = 3;
    ctx.strokeRect(m.x + phase * m.cell + 2, m.y + 2, m.cell - 4, m.cell * state.board.length - 4);
    ctx.restore();
  }
  function draw() {
    if (!ctx || !state) return;
    const m = metrics();
    ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
    const g = ctx.createLinearGradient(0, 0, 0, els.canvas.height);
    g.addColorStop(0, '#d9f99d'); g.addColorStop(1, '#65a30d');
    ctx.fillStyle = g; ctx.fillRect(0, 0, els.canvas.width, els.canvas.height);
    drawSunbeam(m);
    for (let r = 0; r < state.board.length; r++) for (let c = 0; c < state.board[r].length; c++) drawTile(state.board[r][c], r, c, m);
    drawPreview(m);
    drawBeads(m);
    drawTanuki(m);
  }

  function tileAtEvent(event) {
    const rect = els.canvas.getBoundingClientRect();
    const scaleX = els.canvas.width / rect.width;
    const scaleY = els.canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    const m = metrics();
    const c = Math.floor((x - m.x) / m.cell);
    const r = Math.floor((y - m.y) / m.cell);
    return inBounds(r, c) ? { r, c } : null;
  }
  function selectTile(r, c) {
    state.selected = { r, c };
    updatePreview(); updateUI(); draw();
  }
  function rotateSelected() {
    const tile = state.board[state.selected.r][state.selected.c];
    if (!isCanal(tile) || tile.locked) return message('Locked or non-rotating tile.');
    tile.rotation = ((tile.rotation || 0) + 1) % 4;
    updatePreview(); updateUI(); draw();
  }
  function toggleLock() {
    const tile = state.board[state.selected.r][state.selected.c];
    if (!isCanal(tile)) return message('Select a bamboo canal tile to lock.');
    tile.locked = !tile.locked;
    message(tile.locked ? 'Canal locked for the next pulse.' : 'Canal unlocked.');
    updatePreview(); updateUI(); draw();
  }
  function useMossPatch() {
    if (state.mossCharge < 100) return message('Moss Patch is still charging.');
    let tile = state.board[state.selected.r][state.selected.c];
    if (!tile.cracked || tile.patched) {
      let found = null;
      for (let r = 0; r < state.board.length; r++) for (let c = 0; c < state.board[r].length; c++) {
        const t = state.board[r][c]; if (t.cracked && !t.patched && !found) found = { r, c, t };
      }
      if (found) { state.selected = { r: found.r, c: found.c }; tile = found.t; }
    }
    if (tile.cracked && !tile.patched) {
      tile.patched = true;
      state.mossCharge = 0;
      state.drought = Math.max(0, state.drought - 8);
      message('Tanuki Moss Patch repaired a sun crack.');
    } else {
      state.mossCharge = 0;
      state.drought = Math.max(0, state.drought - 14);
      message('Moss Patch cooled the grove and slowed drought.');
    }
    updatePreview(); updateUI(); draw();
  }
  function pulseWater() {
    if (!state.pulseReady || state.paused || state.gameOver) return;
    updatePreview();
    const route = state.route;
    const water = colorInfo[route.waterColor];
    const m = metrics();
    const points = route.steps.map(step => tileCenter(step.r, step.c, m));
    state.beads.push({ points, color: water.fill, started: performance.now(), duration: 900 + points.length * 80 });
    let delivered = 0;
    let wrong = 0;
    for (const delivery of route.deliveries) {
      if (delivery.correct) {
        delivered += 1;
        delivery.tile.filled = (delivery.tile.filled || 0) + 1;
        const k = delivery.tile.color;
        if (state.progress[k] < (state.chapter.targets[k] || 0)) state.progress[k] += 1;
      } else wrong += 1;
    }
    const lockedTraversed = route.steps.filter(s => s.tile.locked).length;
    const newKoi = route.steps.filter(s => s.tile.koi).length;
    for (const step of route.steps) if (step.tile.koi) step.tile.koi = false;
    state.koiProgress += newKoi;
    state.koiTotal += newKoi;
    state.pulseKoi = Math.max(state.pulseKoi, newKoi);
    if (delivered) {
      state.score += delivered * 110 * state.combo;
      state.combo = Math.min(9, state.combo + delivered);
      state.cleanStreak += 1;
      state.mossCharge = Math.min(100, state.mossCharge + delivered * 24 + newKoi * 12);
    } else state.combo = 1;
    state.score += lockedTraversed * 25 + newKoi * 90;
    if (route.usefulSplit && delivered >= 2) state.score += 180;
    if (route.deadEnds || wrong) {
      state.overflow = Math.min(100, state.overflow + route.deadEnds * 6 + wrong * 8);
      state.combo = 1;
      state.cleanStreak = 0;
      message('Blocked bamboo splashed overflow.');
    }
    if (route.cracks) {
      state.drought = Math.min(100, state.drought + route.cracks * 4);
      message('Sun cracks evaporated part of the pulse.');
    }
    for (const step of route.steps) if (step.tile.locked) step.tile.locked = false;
    state.pulseIndex += 1;
    if (commissionComplete()) completeCommission();
    if (state.drought >= 100 || state.overflow >= 100) loseHeart('garden stress reached 100%');
    updatePreview(); updateUI(); draw();
  }
  function commissionComplete() {
    return Object.entries(state.chapter.targets).every(([k, v]) => (state.progress[k] || 0) >= v) && state.koiProgress >= state.chapter.koi;
  }
  function completeCommission() {
    const clean = state.overflow <= state.chapter.overflowTarget && state.drought <= state.chapter.droughtTarget;
    state.score += 420 + (clean ? 520 : 0);
    if (state.hearts < 3) state.hearts += 1;
    message(clean ? 'Perfect clean-flow commission!' : 'Commission complete. Moss flowers bloom!');
    if (state.chapterIndex >= 2 && state.score >= 2900 && !state.bloom) triggerBloom();
    const nextIndex = state.chapterIndex + 1;
    const carryScore = state.score;
    const carryKoi = state.koiTotal;
    const carryStreak = state.cleanStreak;
    const carryPulseKoi = state.pulseKoi;
    if (nextIndex < chapters.length) state = { ...makeState(nextIndex, carryScore), hearts: state.hearts, koiTotal: carryKoi, cleanStreak: carryStreak, pulseKoi: carryPulseKoi, elapsed: state.elapsed };
    else {
      state.endless = true;
      const endlessChapter = makeEndlessChapter(nextIndex);
      state.chapterIndex = nextIndex;
      state.chapter = endlessChapter;
      state.board = cloneBoard(endlessChapter.board);
      state.progress = Object.fromEntries(Object.keys(endlessChapter.targets).map(k => [k, 0]));
      state.koiProgress = 0;
      state.commissionElapsed = 0;
      state.overflow = Math.max(0, state.overflow - 18);
      state.drought = Math.max(0, state.drought - 12);
    }
    updatePreview();
  }
  function makeEndlessChapter(index) {
    const copy = JSON.parse(JSON.stringify(chapters[2]));
    copy.name = `Endless Commission ${index - 2}`;
    copy.text = 'Endless irrigation: stricter drought caps and extra mixed basins.';
    copy.limit = Math.max(48, 88 - (index - 3) * 5);
    copy.droughtRate = .07 + (index - 3) * .01;
    copy.targets = index % 2 ? { blue: 2, green: 2, gold: 1 } : { green: 3, gold: 1 };
    copy.koi = 2 + (index % 3);
    copy.water = index % 2 ? ['green', 'gold', 'blue', 'green'] : ['blue', 'green', 'gold'];
    copy.board[1][1].cracked = true;
    copy.board[3][3].koi = true;
    return copy;
  }
  function triggerBloom() {
    state.bloom = true;
    state.bloomTime = state.elapsed;
    state.score += 960;
    els.bloomBanner.hidden = false;
    setTimeout(() => { els.bloomBanner.hidden = true; }, 2600);
    message('Midori Full-Grove Bloom unlocked! Endless commissions continue.');
  }
  function loseHeart(reason) {
    state.hearts -= 1;
    state.drought = Math.max(35, state.drought - 38);
    state.overflow = Math.max(10, state.overflow - 40);
    state.combo = 1;
    if (state.hearts <= 0) endGame(`Three seedling hearts wilted after ${reason}.`);
    else message(`A seedling heart wilted: ${reason}.`);
  }
  function endGame(reason) {
    state.gameOver = true; state.running = false;
    records.best = Math.max(records.best || 0, state.score);
    records.streak = Math.max(records.streak || 0, state.cleanStreak);
    records.basins = Math.max(records.basins || 0, Object.values(state.progress).reduce((a, b) => a + b, 0));
    records.koi = Math.max(records.koi || 0, state.pulseKoi);
    if (state.bloomTime != null) records.bloom = records.bloom ? Math.min(records.bloom, state.bloomTime) : state.bloomTime;
    const badges = new Set(records.badges || []);
    if (state.chapterIndex > 0 && state.overflow === 0) badges.add('Zero-overflow Dew Gate');
    if (state.bloomTime != null && state.bloomTime < 185) badges.add('Swift Full-Grove Bloom');
    if ((records.basins || 0) >= 20) badges.add('Twenty Basin Keeper');
    if ((records.koi || 0) >= 4) badges.add('Koi Spiral Pulse');
    if (state.cleanStreak >= 3) badges.add('Clean Flow Chain');
    if (state.endless && state.hearts === 3) badges.add('Unwilted Endless Seedlings');
    records.badges = [...badges];
    saveRecords(records);
    els.resultsBody.innerHTML = `<p>${reason}</p><ul><li>Final score: <strong>${state.score}</strong></li><li>Chapter reached: <strong>${state.chapter.name}</strong></li><li>Full-Grove Bloom: <strong>${state.bloom ? 'yes' : 'not yet'}</strong></li><li>Clean-flow streak: <strong>${state.cleanStreak}</strong></li><li>Best koi in one pulse: <strong>${state.pulseKoi}</strong></li><li>Mastery badges: <strong>${records.badges.length ? records.badges.join(', ') : 'none yet'}</strong></li></ul>`;
    els.resultsOverlay.classList.add('active');
    updateMenuRecords(); updateUI();
  }
  function message(text) {
    state.messages.push({ text, t: performance.now() });
    state.messages = state.messages.slice(-3);
  }
  function updateUI() {
    if (!state) return;
    els.score.textContent = String(state.score);
    els.best.textContent = String(Math.max(records.best || 0, state.score));
    els.hearts.textContent = '♥'.repeat(state.hearts) + '♡'.repeat(Math.max(0, 3 - state.hearts));
    els.drought.textContent = `${Math.round(state.drought)}%`;
    els.overflow.textContent = `${Math.round(state.overflow)}%`;
    els.chapter.textContent = state.chapter.name;
    els.combo.textContent = `×${state.combo}`;
    els.elapsed.textContent = formatTime(state.elapsed);
    els.commissionTitle.textContent = state.chapter.name;
    const remaining = Math.max(0, state.chapter.limit - state.commissionElapsed);
    els.commissionText.textContent = `${state.chapter.text} ${Math.ceil(remaining)}s left. Next water: ${colorInfo[state.chapter.water[state.pulseIndex % state.chapter.water.length]].icon} ${colorInfo[state.chapter.water[state.pulseIndex % state.chapter.water.length]].label}.`;
    els.requestChips.innerHTML = Object.entries(state.chapter.targets).map(([k, v]) => `<button class="chip ${k} ${(state.progress[k] || 0) >= v ? 'done' : ''}" type="button" title="${colorInfo[k].label} basin request">${colorInfo[k].icon} ${colorInfo[k].label} ${state.progress[k] || 0}/${v}</button>`).join('') + `<button class="chip gold ${state.koiProgress >= state.chapter.koi ? 'done' : ''}" type="button" title="Koi beads collected this commission">🟠 Koi ${state.koiProgress}/${state.chapter.koi}</button>`;
    const tile = state.board[state.selected.r][state.selected.c];
    els.selectedName.textContent = `Row ${state.selected.r + 1}, Col ${state.selected.c + 1}: ${tile.type || 'empty'}${tile.locked ? ' (locked)' : ''}`;
    els.selectedDetail.textContent = `${openings(tile).length ? `Openings ${openings(tile).join(', ')}. ` : ''}${state.routeEffect}${tile.cracked && !tile.patched ? ' Sun-cracked: patch recommended.' : ''}`;
    els.chargeFill.style.width = `${Math.round(state.mossCharge)}%`;
    els.chargeText.textContent = `Moss ${Math.round(state.mossCharge)}%`;
    els.lock.disabled = !isCanal(tile);
    els.moss.disabled = state.mossCharge < 100;
    els.pulse.disabled = state.gameOver || state.paused;
  }
  function updateMenuRecords() {
    els.menuBest.textContent = String(records.best || 0);
    els.menuBloom.textContent = records.bloom ? formatTime(records.bloom) : '—';
    els.menuStreak.textContent = String(records.streak || 0);
  }
  function tick(now) {
    const dt = Math.min(.08, (now - lastTick) / 1000);
    lastTick = now;
    if (state && state.running && !state.paused && !state.gameOver) {
      state.elapsed += dt;
      state.commissionElapsed += dt;
      if (state.chapterIndex > 0 || state.elapsed > 12) state.drought = Math.min(100, state.drought + state.chapter.droughtRate * dt * 10);
      const sunCol = Math.floor(state.elapsed / 6) % state.board[0].length;
      for (let r = 0; r < state.board.length; r++) {
        const tile = state.board[r][sunCol];
        if (tile && tile.cracked && !tile.patched) state.drought = Math.min(100, state.drought + .003);
      }
      if (state.commissionElapsed >= state.chapter.limit) loseHeart('commission timer expired');
      if (state.drought >= 100) loseHeart('drought reached 100%');
      updateUI(); draw();
    }
    animationId = requestAnimationFrame(tick);
  }
  function startGame() {
    state = makeState(0, 0);
    els.menu.classList.remove('active');
    els.resultsOverlay.classList.remove('active');
    els.pauseOverlay.classList.remove('active');
    els.bloomBanner.hidden = true;
    lastTick = performance.now();
    updatePreview(); updateUI(); resizeCanvas();
  }
  function restartGame() { startGame(); }
  function pauseToggle(force) {
    if (!state || state.gameOver) return;
    state.paused = typeof force === 'boolean' ? force : !state.paused;
    els.pauseOverlay.classList.toggle('active', state.paused);
    updateUI();
  }

  els.canvas.addEventListener('pointerdown', (event) => { pointerDownAt = performance.now(); pointerTile = tileAtEvent(event); });
  els.canvas.addEventListener('pointerup', (event) => {
    if (!state || state.paused || state.gameOver) return;
    const tile = tileAtEvent(event);
    if (!tile) return;
    selectTile(tile.r, tile.c);
    if (pointerTile && pointerTile.r === tile.r && pointerTile.c === tile.c) {
      if (performance.now() - pointerDownAt > 460) toggleLock(); else rotateSelected();
    }
  });
  els.start.addEventListener('click', startGame);
  els.lock.addEventListener('click', toggleLock);
  els.pulse.addEventListener('click', pulseWater);
  els.moss.addEventListener('click', useMossPatch);
  els.pause.addEventListener('click', () => pauseToggle());
  els.resume.addEventListener('click', () => pauseToggle(false));
  els.restart.addEventListener('click', restartGame);
  els.pauseRestart.addEventListener('click', restartGame);
  els.resultsRestart.addEventListener('click', restartGame);
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('keydown', (event) => {
    if (!state && (event.key === ' ' || event.key === 'Enter')) startGame();
    if (!state) return;
    const key = event.key.toLowerCase();
    if (key === 'p') pauseToggle();
    if (key === 'r') restartGame();
    if (key === 'm') useMossPatch();
    if (key === 'l') toggleLock();
    if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); if (els.menu.classList.contains('active')) startGame(); else pulseWater(); }
    const move = { arrowup: [-1, 0], w: [-1, 0], arrowdown: [1, 0], s: [1, 0], arrowleft: [0, -1], a: [0, -1], arrowright: [0, 1], d: [0, 1] }[key];
    if (move) {
      event.preventDefault();
      const nr = Math.max(0, Math.min(state.board.length - 1, state.selected.r + move[0]));
      const nc = Math.max(0, Math.min(state.board[0].length - 1, state.selected.c + move[1]));
      selectTile(nr, nc);
    }
  });

  updateMenuRecords();
  state = makeState(0, 0);
  state.running = false;
  updatePreview(); updateUI(); resizeCanvas();
  animationId = requestAnimationFrame(tick);
})();
