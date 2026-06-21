(() => {
  'use strict';

  const ROWS = 7;
  const COLS = 6;
  const STORAGE_BEST = 'hana-day011-best-score';
  const STORAGE_TIME = 'hana-day011-best-fitting-time';

  const activeCells = new Set([
    '0,2','0,3',
    '1,1','1,2','1,3','1,4',
    '2,0','2,1','2,2','2,3','2,4','2,5',
    '3,0','3,1','3,2','3,3','3,4','3,5',
    '4,1','4,2','4,3','4,4',
    '5,1','5,2','5,3','5,4',
    '6,1','6,2','6,3','6,4'
  ]);

  const motifs = [
    { id: 'sakura', name: 'Sakura' },
    { id: 'wave', name: 'Wave' },
    { id: 'crane', name: 'Crane' },
    { id: 'plum', name: 'Plum' },
    { id: 'thread', name: 'Thread' }
  ];

  const chapters = [
    {
      name: 'Sakura Lining',
      title: 'Mirror four sakura across the sleeves',
      text: 'Place sakura pairs on both sleeves, then stitch one wave hem. Mirror Guide previews the partner cell.',
      dyeLimit: 76,
      mothEvery: 9500,
      targets: [
        t(2, 1, 'sakura'), t(2, 4, 'sakura'),
        t(3, 1, 'sakura'), t(3, 4, 'sakura'),
        t(6, 2, 'wave'), t(6, 3, 'wave')
      ]
    },
    {
      name: 'Crane Sleeve',
      title: 'Set cranes, plum dots, and a gold thread spine',
      text: 'Crane stamps must face upright, plum dots anchor the sleeves, and gold thread belongs down the center.',
      dyeLimit: 82,
      mothEvery: 7600,
      targets: [
        t(1, 2, 'crane', 0, false), t(1, 3, 'crane', 0, true),
        t(3, 0, 'plum'), t(3, 5, 'plum'),
        t(4, 2, 'thread'), t(5, 2, 'thread'), t(6, 2, 'thread')
      ]
    },
    {
      name: 'Festival Obi',
      title: 'Finish the obi border without flooding the dye',
      text: 'Build a wave border, seal the obi with cranes, and keep enough petals for Hana Grand Fitting.',
      dyeLimit: 88,
      mothEvery: 6100,
      targets: [
        t(4, 1, 'wave'), t(4, 2, 'wave'), t(4, 3, 'wave'), t(4, 4, 'wave'),
        t(5, 1, 'thread'), t(5, 4, 'thread'),
        t(5, 2, 'crane', 90, false), t(5, 3, 'crane', 270, true),
        t(6, 1, 'sakura'), t(6, 4, 'sakura')
      ]
    }
  ];

  function t(row, col, motif, rot = null, flip = null) {
    return { row, col, motif, rot, flip };
  }

  const $ = (id) => document.getElementById(id);
  const els = {
    score: $('score'), best: $('best'), petals: $('petals'), dye: $('dye'), combo: $('combo'),
    chapter: $('chapter'), commissionTitle: $('commissionTitle'), commissionText: $('commissionText'), time: $('time'),
    grid: $('clothGrid'), mothLayer: $('mothLayer'), helperCard: $('helperCard'), selectedLabel: $('selectedLabel'), rotationLabel: $('rotationLabel'), hintLabel: $('hintLabel'),
    tray: $('stampTray'), rotate: $('rotateBtn'), flip: $('flipBtn'), mirror: $('mirrorBtn'), repair: $('repairBtn'), repairs: $('repairs'), pause: $('pauseBtn'), restart: $('restartBtn'),
    menu: $('menuOverlay'), start: $('startBtn'), pauseOverlay: $('pauseOverlay'), resume: $('resumeBtn'), pauseRestart: $('pauseRestartBtn'),
    result: $('resultOverlay'), resultTitle: $('resultTitle'), resultText: $('resultText'), resultKicker: $('resultKicker'), resultRestart: $('resultRestartBtn')
  };

  const state = {
    started: false,
    paused: false,
    over: false,
    score: 0,
    combo: 1,
    petals: 3,
    repairs: 3,
    dye: 0,
    chapterIndex: 0,
    selected: 'sakura',
    rotation: 0,
    flipped: false,
    mirrorUntil: 0,
    elapsed: 0,
    lastTick: 0,
    lastMoth: 0,
    best: Number(localStorage.getItem(STORAGE_BEST) || 0),
    bestTime: localStorage.getItem(STORAGE_TIME) || '',
    cells: [],
    moths: [],
    grandShown: false
  };

  function resetCells() {
    state.cells = Array.from({ length: ROWS }, (_, row) =>
      Array.from({ length: COLS }, (_, col) => activeCells.has(`${row},${col}`) ? { motif: null, rot: 0, flip: false, smudge: false } : null)
    );
  }

  function init() {
    resetCells();
    renderTray();
    renderGrid();
    bind();
    updateUI();
    window.requestAnimationFrame(tick);
  }

  function bind() {
    els.start.addEventListener('click', startGame);
    els.rotate.addEventListener('click', () => { rotateSelected(); updateUI(); });
    els.flip.addEventListener('click', () => { state.flipped = !state.flipped; updateUI(); });
    els.mirror.addEventListener('click', () => { state.mirrorUntil = performance.now() + 5500; renderGrid(); });
    els.repair.addEventListener('click', repairLastSmudge);
    els.pause.addEventListener('click', togglePause);
    els.restart.addEventListener('click', restart);
    els.resume.addEventListener('click', togglePause);
    els.pauseRestart.addEventListener('click', restart);
    els.resultRestart.addEventListener('click', restart);
    window.addEventListener('keydown', onKey);
  }

  function startGame() {
    Object.assign(state, {
      started: true, paused: false, over: false, score: 0, combo: 1, petals: 3, repairs: 3, dye: 0,
      chapterIndex: 0, selected: 'sakura', rotation: 0, flipped: false, mirrorUntil: 0, elapsed: 0,
      lastTick: performance.now(), lastMoth: performance.now(), moths: [], grandShown: false
    });
    resetCells();
    els.menu.classList.add('hidden');
    els.pauseOverlay.classList.add('hidden');
    els.result.classList.add('hidden');
    renderGrid();
    updateUI();
  }

  function restart() {
    els.menu.classList.add('hidden');
    startGame();
  }

  function onKey(event) {
    if (event.key === 'p' || event.key === 'P') togglePause();
    if (event.key === 'r' || event.key === 'R') restart();
    if (!state.started || state.paused || state.over) return;
    const number = Number(event.key);
    if (number >= 1 && number <= motifs.length) selectMotif(motifs[number - 1].id);
    if (event.key === 'q' || event.key === 'Q') { state.rotation = (state.rotation + 270) % 360; updateUI(); }
    if (event.key === 'e' || event.key === 'E') { rotateSelected(); updateUI(); }
    if (event.key === 'f' || event.key === 'F') { state.flipped = !state.flipped; updateUI(); }
    if (event.key === 'm' || event.key === 'M' || event.key === ' ') { state.mirrorUntil = performance.now() + 5500; renderGrid(); }
    if (event.key === 'Backspace' || event.key === 'u' || event.key === 'U') repairLastSmudge();
  }

  function togglePause() {
    if (!state.started || state.over) return;
    state.paused = !state.paused;
    els.pauseOverlay.classList.toggle('hidden', !state.paused);
    if (!state.paused) state.lastTick = performance.now();
    updateUI();
  }

  function rotateSelected() {
    state.rotation = (state.rotation + 90) % 360;
  }

  function selectMotif(id) {
    state.selected = id;
    renderTray();
    updateUI();
  }

  function renderTray() {
    els.tray.innerHTML = '';
    for (const motif of motifs) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = motif.id === state.selected ? 'selected' : '';
      button.setAttribute('aria-label', `Select ${motif.name} motif`);
      button.draggable = true;
      button.innerHTML = `<span class="icon ${motif.id}" aria-hidden="true"></span><span>${motif.name}</span>`;
      button.addEventListener('click', () => selectMotif(motif.id));
      button.addEventListener('dragstart', (event) => {
        selectMotif(motif.id);
        event.dataTransfer?.setData('text/plain', motif.id);
      });
      els.tray.appendChild(button);
    }
  }

  function renderGrid() {
    const chapter = chapters[state.chapterIndex] || chapters.at(-1);
    const targets = new Map(chapter.targets.map((target) => [`${target.row},${target.col}`, target]));
    els.grid.innerHTML = '';
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const data = state.cells[row]?.[col];
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'cell';
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', data ? `Kimono cell row ${row + 1} column ${col + 1}` : 'Inactive kimono cutout');
        if (!data) {
          cell.classList.add('inactive');
        } else {
          const target = targets.get(`${row},${col}`);
          if (target) cell.classList.add('target');
          if (performance.now() < state.mirrorUntil && target && target.motif === state.selected) cell.classList.add('mirror-preview');
          if (data.smudge) cell.classList.add('smudge');
          if (data.motif) {
            const icon = document.createElement('span');
            icon.className = `icon ${data.motif} rot${data.rot}${data.flip ? ' flipped' : ''}`;
            icon.setAttribute('aria-hidden', 'true');
            cell.appendChild(icon);
          }
          cell.addEventListener('click', () => place(row, col));
          cell.addEventListener('dragover', (event) => event.preventDefault());
          cell.addEventListener('drop', (event) => { event.preventDefault(); place(row, col); });
        }
        els.grid.appendChild(cell);
      }
    }
  }

  function place(row, col) {
    if (!state.started || state.paused || state.over) return;
    const data = state.cells[row]?.[col];
    if (!data) return;
    const chapter = chapters[state.chapterIndex];
    const target = chapter.targets.find((item) => item.row === row && item.col === col);
    data.motif = state.selected;
    data.rot = state.rotation;
    data.flip = state.flipped;
    const ok = target && target.motif === state.selected && (target.rot === null || target.rot === state.rotation) && (target.flip === null || target.flip === state.flipped);
    data.smudge = !ok;
    if (ok) {
      state.score += Math.round(45 * state.combo);
      state.combo = Math.min(12, state.combo + 0.25);
      const mirror = mirrorTarget(target, chapter.targets);
      if (mirror && isSatisfied(mirror)) state.score += Math.round(130 * state.combo);
      els.helperCard.classList.add('satisfies');
      state.dye = Math.max(0, state.dye - 1.5);
    } else {
      state.combo = 1;
      state.dye = Math.min(100, state.dye + 8);
      state.score = Math.max(0, state.score - 15);
    }
    if (state.score > state.best) {
      state.best = state.score;
      localStorage.setItem(STORAGE_BEST, String(state.best));
    }
    renderGrid();
    checkCommission();
    updateUI(ok ? 'Stitch accepted.' : 'Smudge! Repair or place the right motif.');
  }

  function mirrorTarget(target, targets) {
    return targets.find((item) => item.row === target.row && item.col === COLS - 1 - target.col && item.motif === target.motif);
  }

  function isSatisfied(target) {
    const data = state.cells[target.row]?.[target.col];
    return Boolean(data && data.motif === target.motif && !data.smudge && (target.rot === null || data.rot === target.rot) && (target.flip === null || data.flip === target.flip));
  }

  function checkCommission() {
    const chapter = chapters[state.chapterIndex];
    const done = chapter.targets.every(isSatisfied);
    if (!done) return;
    state.score += 420 + Math.round(80 * state.combo);
    state.combo = Math.min(14, state.combo + 1);
    state.dye = Math.max(0, state.dye - 18);
    state.repairs = Math.min(3, state.repairs + 1);
    if (state.chapterIndex < chapters.length - 1) {
      state.chapterIndex += 1;
      clearBoard(false);
      updateUI('Commission sealed. New cloth prepared.');
    } else {
      grandFitting();
    }
  }

  function clearBoard(keepScore = true) {
    const score = state.score;
    resetCells();
    if (!keepScore) state.score = score;
    renderGrid();
  }

  function grandFitting() {
    if (state.grandShown) return;
    state.grandShown = true;
    state.score += 880;
    const time = formatTime(state.elapsed);
    const old = Number(localStorage.getItem(STORAGE_TIME_SECONDS) || Infinity);
    if (!Number.isFinite(old) || state.elapsed < old) {
      localStorage.setItem(STORAGE_TIME_SECONDS, String(Math.floor(state.elapsed)));
      localStorage.setItem(STORAGE_TIME, time);
    }
    const banner = document.createElement('div');
    banner.className = 'grand';
    banner.textContent = 'Hana Grand Fitting';
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 2600);
    state.chapterIndex = 0;
    resetCells();
    renderGrid();
  }

  const STORAGE_TIME_SECONDS = 'hana-day011-best-fitting-time-seconds';

  function repairLastSmudge() {
    if (!state.started || state.paused || state.over || state.repairs <= 0) return;
    for (let row = ROWS - 1; row >= 0; row -= 1) {
      for (let col = COLS - 1; col >= 0; col -= 1) {
        const data = state.cells[row]?.[col];
        if (data?.smudge) {
          data.motif = null;
          data.smudge = false;
          state.repairs -= 1;
          state.dye = Math.max(0, state.dye - 5);
          renderGrid();
          updateUI('Smudge repaired.');
          return;
        }
      }
    }
    updateUI('No smudge to repair.');
  }

  function tick(now) {
    if (!state.lastTick) state.lastTick = now;
    const dt = Math.min(0.05, (now - state.lastTick) / 1000);
    state.lastTick = now;
    if (state.started && !state.paused && !state.over) {
      state.elapsed += dt;
      const chapter = chapters[state.chapterIndex] || chapters[0];
      state.dye += dt * (chapter.dyeLimit / 74);
      if (now - state.lastMoth > chapter.mothEvery) spawnMoth(now);
      updateMoths(dt);
      if (state.dye >= chapter.dyeLimit) lose('The dye tray dried before the pattern was finished.');
      if (state.petals <= 0) lose('The last patience petal fell. The atelier closes for tonight.');
      updateUI();
    }
    window.requestAnimationFrame(tick);
  }

  function spawnMoth(now) {
    state.lastMoth = now;
    const moth = { id: `moth-${now}`, x: 12 + Math.random() * 76, y: 18 + Math.random() * 58, life: 4.6 };
    state.moths.push(moth);
    renderMoths();
  }

  function updateMoths(dt) {
    let changed = false;
    for (const moth of state.moths) moth.life -= dt;
    const escaped = state.moths.filter((moth) => moth.life <= 0).length;
    if (escaped) {
      state.petals = Math.max(0, state.petals - escaped);
      state.combo = 1;
      state.dye += escaped * 7;
      changed = true;
    }
    state.moths = state.moths.filter((moth) => moth.life > 0);
    if (changed || state.moths.length) renderMoths();
  }

  function renderMoths() {
    els.mothLayer.innerHTML = '';
    for (const moth of state.moths) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'moth';
      button.style.left = `${moth.x}%`;
      button.style.top = `${moth.y}%`;
      button.setAttribute('aria-label', 'Stop silk moth');
      button.innerHTML = '<span class="icon moth" aria-hidden="true"></span>';
      button.addEventListener('click', () => {
        state.moths = state.moths.filter((item) => item !== moth);
        state.score += Math.round(55 * state.combo);
        state.combo = Math.min(12, state.combo + 0.15);
        renderMoths();
        updateUI('Silk moth stopped.');
      });
      els.mothLayer.appendChild(button);
    }
  }

  function lose(text) {
    state.over = true;
    state.started = false;
    if (state.score > state.best) {
      state.best = state.score;
      localStorage.setItem(STORAGE_BEST, String(state.best));
    }
    els.resultKicker.textContent = 'Atelier results';
    els.resultTitle.textContent = state.grandShown ? 'Grand Fitting complete' : 'Atelier closed';
    els.resultText.textContent = `${text} Final score ${state.score}. Best ${state.best}. Chapter: ${(chapters[state.chapterIndex] || chapters[0]).name}.`;
    els.result.classList.remove('hidden');
    updateUI();
  }

  function updateUI(hint) {
    const chapter = chapters[state.chapterIndex] || chapters[0];
    els.score.textContent = String(state.score);
    els.best.textContent = String(state.best);
    els.petals.textContent = `${state.petals}/3`;
    els.dye.textContent = `${Math.min(100, Math.round(state.dye))}%`;
    els.combo.textContent = `x${Math.max(1, state.combo).toFixed(state.combo % 1 ? 1 : 0)}`;
    els.chapter.textContent = chapter.name;
    els.commissionTitle.textContent = chapter.title;
    els.commissionText.textContent = chapter.text;
    els.time.textContent = formatTime(state.elapsed);
    els.selectedLabel.textContent = motifs.find((motif) => motif.id === state.selected)?.name || 'Stamp';
    els.rotationLabel.textContent = `Rotation ${state.rotation}° · ${state.flipped ? 'flipped' : 'normal'}`;
    els.hintLabel.textContent = hint || (performance.now() < state.mirrorUntil ? 'Mirror Guide is showing matching cells.' : 'Tap a cloth cell to place.');
    els.repairs.textContent = String(state.repairs);
    els.mirror.disabled = performance.now() < state.mirrorUntil;
    els.pause.textContent = state.paused ? 'Resume' : 'Pause';
  }

  function formatTime(seconds) {
    const total = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(total / 60);
    const secs = String(total % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }

  init();
})();
