(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const canvas = $('board');
  const ctx = canvas.getContext('2d');
  const img = {
    helper: new Image(), room: new Image(), pieces: new Image(), icons: new Image()
  };
  img.helper.src = './assets/tatami-helper.png';
  img.room.src = './assets/tatami-room.png';
  img.pieces.src = './assets/tatami-pieces.png';
  img.icons.src = './assets/tatami-icons.png';

  const els = {
    menu: $('menu'), pauseOverlay: $('pauseOverlay'), resultOverlay: $('resultOverlay'),
    score: $('score'), bestScore: $('bestScore'), hearts: $('hearts'), incense: $('incense'), combo: $('combo'), activeMatLabel: $('activeMatLabel'), violations: $('violations'), focus: $('focus'), time: $('time'),
    commissionName: $('commissionName'), commissionText: $('commissionText'), incenseMeter: $('incenseMeter'), pathMeter: $('pathMeter'), moonMeter: $('moonMeter'), statusText: $('statusText'),
    maFocus: $('maFocus'), audioToggle: $('audioToggle'), bestMenu: $('bestMenu'), resultTitle: $('resultTitle'), resultText: $('resultText')
  };

  const storageKey = 'day039-tatami-moonroom';
  const best = JSON.parse(localStorage.getItem(storageKey) || '{"score":0,"time":null,"badges":[]}');
  const missions = [
    { name: 'First Moon Mat', need: 4, text: 'Lay three full mats and one half mat. Keep seams calm and leave a guest route to the cushion.', minPath: 55, maxViolations: 1, moon: 1, time: 105 },
    { name: 'Tea Guest Flow', need: 5, text: 'Align two grain arrows with moonbeams, place cushion/table anchors, preview a smooth shoji-to-seat route, and calm the cat.', minPath: 72, maxViolations: 0, moon: 2, time: 100 },
    { name: 'Grand Tokonoma Room', need: 6, text: 'Solve the irregular alcove with full and half mats, zero four-corner seams, table centered, and Ma Focus preview before incense fades.', minPath: 82, maxViolations: 0, moon: 3, time: 95 }
  ];

  const state = {
    running: false, paused: false, gameOver: false, startedAt: 0, lastTick: performance.now(), elapsed: 0,
    score: 0, hearts: 3, combo: 1, incense: 100, focus: 35, mission: 0, progress: 0,
    selected: 0, matMode: 'full', pathScore: 0, moonScore: 0, violations: 0, message: 'Select a mat, rotate its grain, and fill the moonlit room without four-corner seams.',
    cat: { x: 4, y: 4, calm: 0, warn: 0 }, focusUntil: 0, audioEnabled: true,
    board: { cols: 6, rows: 6, x: 58, y: 70, cell: 86 },
    cushion: { x: 4, y: 4 }, table: { x: 3, y: 3 }, door: { x: 0, y: 2 }, moonbeams: [1, 4],
    mats: []
  };

  let audio = { ctx: null, enabled: true };
  window.__day039Audio = { ctx: null, enabled: false };

  function resetMats() {
    state.mats = [
      { id: 1, x: 0, y: 0, w: 2, h: 1, rot: 0, locked: false, placed: true },
      { id: 2, x: 2, y: 0, w: 2, h: 1, rot: 0, locked: false, placed: true },
      { id: 3, x: 0, y: 1, w: 1, h: 2, rot: 1, locked: false, placed: true },
      { id: 4, x: 2, y: 2, w: 1, h: 1, rot: 0, locked: false, placed: false },
      { id: 5, x: 4, y: 0, w: 2, h: 1, rot: 0, locked: false, placed: false },
      { id: 6, x: 4, y: 2, w: 1, h: 1, rot: 0, locked: false, placed: false }
    ];
    state.selected = 0;
  }

  function startGame() {
    els.menu.classList.add('hidden');
    state.running = true; state.paused = false; state.gameOver = false; state.startedAt = performance.now(); state.lastTick = performance.now();
    state.elapsed = 0; state.score = 0; state.hearts = 3; state.combo = 1; state.incense = 100; state.focus = 35; state.mission = 0; state.progress = 0;
    state.cat = { x: 4, y: 4, calm: 0, warn: 0 }; state.cushion = { x: 4, y: 4 }; state.table = { x: 3, y: 3 }; state.pathScore = 0; state.moonScore = 0; state.violations = 0;
    resetMats(); initAudio(); setMessage('Drag a mat into the moonbeam, rotate its grain, then Preview Walk.'); updateHud(); beep('start'); requestAnimationFrame(loop);
  }

  function initAudio() {
    if (audio.ctx || !state.audioEnabled) {
      window.__day039Audio = { ctx: audio.ctx, enabled: Boolean(audio.ctx && state.audioEnabled) };
      return;
    }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) throw new Error('no AudioContext');
      audio.ctx = new AC();
      audio.ctx.resume?.();
      audio.enabled = true;
      window.__day039Audio = { ctx: audio.ctx, enabled: true };
    } catch {
      audio.enabled = false;
      window.__day039Audio = { ctx: null, enabled: false };
    }
  }

  function beep(kind='click') {
    if (!state.audioEnabled || !audio.ctx) return;
    const ctxA = audio.ctx;
    const o = ctxA.createOscillator();
    const g = ctxA.createGain();
    const now = ctxA.currentTime;
    const map = { click: [440, .045], place: [620, .07], warn: [180, .1], focus: [880, .18], cat: [520, .12], win: [660, .22], start: [330, .09] };
    const [freq, dur] = map[kind] || map.click;
    o.type = kind === 'warn' ? 'sawtooth' : 'sine';
    o.frequency.setValueAtTime(freq, now);
    o.frequency.exponentialRampToValueAtTime(freq * (kind === 'win' ? 1.5 : 1.08), now + dur);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.05, now + .01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g).connect(ctxA.destination); o.start(now); o.stop(now + dur + .02);
  }

  function matCells(m) {
    const w = m.rot ? m.h : m.w;
    const h = m.rot ? m.w : m.h;
    const cells = [];
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) cells.push([m.x + xx, m.y + yy]);
    return cells;
  }
  function footprint(m) { return { w: m.rot ? m.h : m.w, h: m.rot ? m.w : m.h }; }
  function inBounds(m) {
    return matCells(m).every(([x,y]) => x >= 0 && y >= 0 && x < state.board.cols && y < state.board.rows && !(state.mission >= 2 && x === 5 && y < 2));
  }
  function overlaps(test) {
    const used = new Set();
    for (const m of state.mats) {
      if (!m.placed && m !== test) continue;
      for (const c of matCells(m)) {
        const key = c.join(',');
        if (used.has(key)) return true;
        used.add(key);
      }
    }
    return false;
  }
  function validMat(m) { return m.placed && inBounds(m) && !overlaps(m); }

  function computeStats() {
    let placed = state.mats.filter((m) => m.placed && inBounds(m)).length;
    let corner = new Map();
    let moon = 0;
    for (const m of state.mats.filter((mm) => mm.placed)) {
      const fp = footprint(m);
      for (const [cx, cy] of [[m.x,m.y],[m.x+fp.w,m.y],[m.x,m.y+fp.h],[m.x+fp.w,m.y+fp.h]]) corner.set(`${cx},${cy}`, (corner.get(`${cx},${cy}`)||0)+1);
      if (state.moonbeams.includes(m.y) && m.rot === 0) moon++;
    }
    state.violations = [...corner.values()].filter((n) => n >= 4).length;
    state.moonScore = Math.min(100, moon * 34);
    state.pathScore = pathScore(false);
    return { placed, moon };
  }

  function pathScore(draw) {
    const blocked = new Set();
    for (const m of state.mats.filter((mm) => mm.placed && !inBounds(mm))) for (const c of matCells(m)) blocked.add(c.join(','));
    const target = state.cushion;
    const q = [{ x: state.door.x, y: state.door.y, d: 0, prev: null }];
    const seen = new Set([`${state.door.x},${state.door.y}`]);
    let found = null;
    for (let i = 0; i < q.length; i++) {
      const n = q[i];
      if (n.x === target.x && n.y === target.y) { found = n; break; }
      for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const x=n.x+dx,y=n.y+dy,k=`${x},${y}`;
        if (x<0||y<0||x>=state.board.cols||y>=state.board.rows||seen.has(k)||blocked.has(k)) continue;
        seen.add(k); q.push({x,y,d:n.d+1,prev:n});
      }
    }
    let score = found ? Math.max(35, 100 - found.d * 7 - state.violations * 18) : 0;
    if (state.table.x === target.x && state.table.y === target.y) score -= 20;
    return Math.max(0, Math.min(100, score));
  }

  function setMessage(text) { state.message = text; els.statusText.textContent = text; }
  function addScore(n) { state.score += Math.round(n * state.combo); state.combo = Math.min(5, state.combo + .08); state.focus = Math.min(100, state.focus + 6); }
  function penalize(text) { state.hearts--; state.combo = 1; state.incense = Math.max(0, state.incense - 8); setMessage(text); beep('warn'); if (state.hearts <= 0) endGame(false, 'Harmony hearts broke. The room needs another quiet attempt.'); }

  function selectedMat() { return state.mats[state.selected]; }
  function cycleMat(dir) { state.selected = (state.selected + dir + state.mats.length) % state.mats.length; setMessage(`Selected mat ${state.selected + 1}.`); beep('click'); updateHud(); draw(); }
  function moveMat(dx, dy) {
    const m = selectedMat(); if (m.locked) return setMessage('Locked mat is protected; unlock before moving.');
    const old = { x:m.x, y:m.y }; m.x += dx; m.y += dy; m.placed = true;
    if (!inBounds(m) || overlaps(m)) { m.x=old.x; m.y=old.y; penalize('That footprint overlaps or hits the tokonoma alcove.'); }
    else { addScore(80); setMessage('Mat snapped into a calm cell.'); beep('place'); }
    updateHud(); draw();
  }
  function rotateMat() {
    const m = selectedMat(); if (m.locked) return setMessage('Locked mat keeps its grain direction.');
    m.rot = m.rot ? 0 : 1; addScore(90); setMessage(m.rot ? 'Grain now runs north–south.' : 'Grain now runs east–west.'); beep('place'); updateHud(); draw();
  }
  function swapMat() {
    const m = selectedMat(); if (m.locked) return setMessage('Unlock before swapping full/half size.');
    if (m.w === 1 && m.h === 1) { m.w = 2; m.h = 1; state.matMode = 'full'; }
    else { m.w = 1; m.h = 1; state.matMode = 'half'; }
    addScore(65); setMessage(`Swapped to ${state.matMode} mat.`); beep('click'); updateHud(); draw();
  }
  function lockMat() { const m = selectedMat(); m.locked = !m.locked; addScore(m.locked ? 45 : -20); setMessage(m.locked ? 'Mat locked against cat paws.' : 'Mat unlocked.'); beep('click'); updateHud(); draw(); }
  function placeAnchor(type) {
    const m = selectedMat(); const cells = matCells(m); const c = cells[Math.floor(cells.length/2)] || [m.x,m.y];
    state[type].x = Math.max(0, Math.min(state.board.cols-1, c[0])); state[type].y = Math.max(0, Math.min(state.board.rows-1, c[1]));
    addScore(85); setMessage(`${type === 'cushion' ? 'Cushion' : 'Low table'} rests on mat ${m.id}.`); beep('place'); updateHud(); draw();
  }
  function calmCat() { state.cat.calm = 14; state.cat.warn = 0; state.cat.x = Math.max(0, (state.cat.x + 1) % state.board.cols); addScore(150); setMessage('The calico helper curls away from the active footprint.'); beep('cat'); updateHud(); draw(); }
  function useFocus() { if (state.focus < 100) return; state.focus = 0; state.focusUntil = performance.now() + 6000; addScore(240); setMessage('Ma Focus reveals seam risks, grain flow, and the best guest path.'); beep('focus'); updateHud(); draw(); }

  function previewWalk() {
    computeStats();
    const mission = missions[state.mission];
    const stats = computeStats();
    if (state.violations > mission.maxViolations) return penalize('Four-corner seam warning: rotate or offset a mat before completing.');
    if (state.pathScore < mission.minPath) { setMessage(`Guest path only ${state.pathScore}%. Move cushion/table or clear the route.`); beep('warn'); return; }
    if (stats.placed < mission.need) { setMessage(`Need ${mission.need} placed mats; currently ${stats.placed}.`); beep('warn'); return; }
    if (stats.moon < mission.moon) { setMessage(`Need ${mission.moon} moonbeam grain bonuses; rotate mats under blue light.`); beep('warn'); return; }
    completeMission();
  }

  function completeMission() {
    const mission = missions[state.mission];
    state.progress++; addScore(980 + state.pathScore * 8 + (state.violations === 0 ? 900 : 0)); beep('win');
    setMessage(`${mission.name} complete: room seal stamped, incense smoke forms a calm moon crest.`);
    if (state.hearts < 3) state.hearts++;
    if (state.mission < missions.length - 1) {
      state.mission++; state.incense = 100; state.focus = Math.min(100, state.focus + 25); addRoomComplexity();
    } else if (!state.harmony) {
      state.harmony = true; state.score += 2900; saveBest(true); setMessage('Tatami Moonroom Harmony! Endless commissions continue.');
    } else {
      state.incense = 100; randomizeEndless();
    }
    updateHud(); draw();
  }

  function addRoomComplexity() {
    const m = state.mission;
    if (m === 1) { state.mats[4].placed = true; state.cat = { x: 3, y: 2, calm: 0, warn: 8 }; state.cushion = { x: 4, y: 4 }; state.table = { x: 2, y: 3 }; }
    if (m === 2) { state.mats[5].placed = true; state.door = { x: 0, y: 4 }; state.moonbeams = [0,3,4]; state.cat = { x: 5, y: 3, calm: 0, warn: 10 }; }
  }
  function randomizeEndless() { state.mission = 1 + Math.floor(Math.random()*2); state.moonbeams = [Math.floor(Math.random()*6), Math.floor(Math.random()*6)]; state.cat.warn = 9; }

  function updateHud() {
    const mission = missions[state.mission] || missions[2]; computeStats();
    els.score.textContent = state.score; els.bestScore.textContent = best.score || 0; els.hearts.textContent = '♥'.repeat(Math.max(0,state.hearts)); els.incense.textContent = `${Math.round(state.incense)}%`; els.combo.textContent = `x${state.combo.toFixed(1)}`; els.activeMatLabel.textContent = `${state.selected+1}/${state.mats.length}`; els.violations.textContent = state.violations; els.focus.textContent = `${Math.round(state.focus)}%`; els.time.textContent = fmt(state.elapsed);
    els.incenseMeter.value = state.incense; els.pathMeter.value = state.pathScore; els.moonMeter.value = state.moonScore;
    els.commissionName.textContent = `${mission.name} ${state.progress}/${missions.length}`; els.commissionText.textContent = mission.text;
    els.maFocus.textContent = `Ma Focus ${Math.round(state.focus)}%`; els.maFocus.disabled = state.focus < 100;
    els.bestMenu.textContent = `Best: ${best.score || 0} · Harmony time: ${best.time ? fmt(best.time) : '—'}`;
  }
  function fmt(sec) { sec = Math.floor(sec); return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`; }

  function loop(now) {
    if (!state.running || state.gameOver) return;
    const dt = Math.min(0.08, (now - state.lastTick)/1000); state.lastTick = now;
    if (!state.paused) {
      state.elapsed += dt;
      const mission = missions[state.mission] || missions[2];
      state.incense -= dt * (100 / mission.time) * (state.focusUntil > now ? .45 : 1);
      if (state.cat.calm > 0) state.cat.calm -= dt;
      else if (state.cat.warn > 0) { state.cat.warn -= dt; if (state.cat.warn <= 0) catDisrupt(); }
      if (state.incense <= 0) endGame(false, 'The incense burned out before the room settled.');
      updateHud();
    }
    draw(); requestAnimationFrame(loop);
  }

  function catDisrupt() {
    const candidates = state.mats.filter((m) => m.placed && !m.locked);
    if (candidates.length) { const m = candidates[(state.selected + 1) % candidates.length]; m.placed = false; penalize('The sleepy cat pawed an unlocked mat away. Calm Cat next time.'); }
    state.cat.warn = 10 + Math.random()*8;
  }

  function endGame(win, text) {
    state.gameOver = true; state.running = false; saveBest(win); els.resultTitle.textContent = win ? 'Tatami Moonroom Harmony' : 'Room quiets'; els.resultText.textContent = `${text} Final score ${state.score}. Path ${Math.round(state.pathScore)}%, seam violations ${state.violations}.`; els.resultOverlay.classList.remove('hidden'); updateHud();
  }
  function saveBest(harmony=false) {
    if (state.score > (best.score || 0)) best.score = state.score;
    if (harmony && (!best.time || state.elapsed < best.time)) best.time = state.elapsed;
    localStorage.setItem(storageKey, JSON.stringify(best));
  }

  function draw() {
    const dpr = Math.min(2, window.devicePixelRatio || 1); const rect = canvas.getBoundingClientRect(); const w = Math.max(320, Math.floor(rect.width*dpr)); const h = Math.max(260, Math.floor(rect.height*dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    ctx.save(); ctx.scale(dpr,dpr); const cw = canvas.width/dpr, ch = canvas.height/dpr; ctx.clearRect(0,0,cw,ch);
    const boardSize = Math.min(cw - 34, ch - 42); const cell = Math.floor(boardSize / 6); state.board.cell = cell; state.board.x = Math.floor((cw - cell*6)/2); state.board.y = Math.floor((ch - cell*6)/2) + 8;
    drawRoom(cw,ch); drawBoard(); drawMats(); drawPath(); drawAnchors(); drawCat(); drawFocus(); ctx.restore();
  }
  function drawRoom(cw,ch) {
    const grad = ctx.createLinearGradient(0,0,0,ch); grad.addColorStop(0,'rgba(13,28,21,.15)'); grad.addColorStop(1,'rgba(4,10,8,.58)'); ctx.fillStyle=grad; ctx.fillRect(0,0,cw,ch);
    for (let i=0;i<4;i++) { ctx.fillStyle=`rgba(155,202,255,${.06+i*.015})`; ctx.beginPath(); ctx.moveTo(state.board.x + state.board.cell*(state.moonbeams[i%state.moonbeams.length]||1), state.board.y-45); ctx.lineTo(state.board.x + state.board.cell*(state.moonbeams[i%state.moonbeams.length]||1)+70, state.board.y+state.board.cell*6+30); ctx.lineTo(state.board.x + state.board.cell*(state.moonbeams[i%state.moonbeams.length]||1)+120, state.board.y+state.board.cell*6+30); ctx.lineTo(state.board.x + state.board.cell*(state.moonbeams[i%state.moonbeams.length]||1)+36, state.board.y-45); ctx.closePath(); ctx.fill(); }
  }
  function drawBoard() {
    const {x,y,cell,cols,rows}=state.board;
    ctx.fillStyle='rgba(11,28,20,.82)'; roundRect(x-14,y-14,cell*cols+28,cell*rows+28,24,true,false);
    ctx.strokeStyle='rgba(241,202,115,.8)'; ctx.lineWidth=2; roundRect(x-14,y-14,cell*cols+28,cell*rows+28,24,false,true);
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
      const moon = state.moonbeams.includes(r); const alcove = state.mission>=2 && c===5 && r<2;
      ctx.fillStyle = alcove ? 'rgba(90,55,38,.58)' : moon ? 'rgba(126,174,255,.16)' : 'rgba(219,197,112,.14)'; ctx.fillRect(x+c*cell,y+r*cell,cell-2,cell-2);
      ctx.strokeStyle='rgba(222,198,118,.25)'; ctx.strokeRect(x+c*cell,y+r*cell,cell,cell);
      if (moon) { ctx.fillStyle='rgba(167,207,255,.18)'; ctx.fillRect(x+c*cell+4,y+r*cell+4,cell-10,cell-10); }
    }
    ctx.fillStyle='#ffdf8f'; ctx.font='900 13px system-ui'; ctx.fillText('SHOJI', x+5, y+state.door.y*cell+18);
  }
  function drawMats() {
    for (let i=0;i<state.mats.length;i++) {
      const m=state.mats[i]; if(!m.placed) { drawInventoryChip(m,i); continue; }
      const fp=footprint(m); const px=state.board.x+m.x*state.board.cell, py=state.board.y+m.y*state.board.cell, w=fp.w*state.board.cell-6, h=fp.h*state.board.cell-6;
      const valid=inBounds(m)&&!overlaps(m); ctx.save(); ctx.translate(px+3,py+3);
      const g=ctx.createLinearGradient(0,0,m.rot?0:w,m.rot?h:0); g.addColorStop(0,'#d8ca78'); g.addColorStop(.5,'#a8a860'); g.addColorStop(1,'#e0d18a'); ctx.fillStyle=g; roundRect(0,0,w,h,10,true,false);
      ctx.lineWidth=Math.max(5, state.board.cell*.08); ctx.strokeStyle=m.locked?'#9adfff':'#355a2e'; roundRect(4,4,w-8,h-8,8,false,true);
      ctx.strokeStyle='rgba(54,74,39,.42)'; ctx.lineWidth=1; for(let k=10;k<(m.rot?h:w);k+=9){ ctx.beginPath(); if(m.rot){ctx.moveTo(8,k);ctx.lineTo(w-8,k);} else {ctx.moveTo(k,8);ctx.lineTo(k,h-8);} ctx.stroke(); }
      if(i===state.selected){ ctx.strokeStyle='#ffe98e'; ctx.lineWidth=4; roundRect(-3,-3,w+6,h+6,14,false,true); }
      if(!valid){ ctx.fillStyle='rgba(240,111,87,.32)'; roundRect(0,0,w,h,10,true,false); }
      ctx.fillStyle=m.rot?'#245c9b':'#244f2c'; ctx.font='900 13px system-ui'; ctx.fillText(m.locked?'LOCK':'GRAIN', 10, 20);
      ctx.restore();
    }
  }
  function drawInventoryChip(m,i){ const x=state.board.x+(i%6)*state.board.cell+8, y=state.board.y+state.board.rows*state.board.cell+10; ctx.fillStyle='rgba(0,0,0,.44)'; roundRect(x,y,56,24,10,true,false); ctx.fillStyle=i===state.selected?'#ffe98e':'#d6cda8'; ctx.font='800 12px system-ui'; ctx.fillText(`Mat ${i+1}`,x+8,y+16); }
  function drawAnchors(){ const {x,y,cell}=state.board; drawMarker(state.cushion.x,state.cushion.y,'CUSH','#7c5fb8'); drawMarker(state.table.x,state.table.y,'TABLE','#8d5324'); function drawMarker(cx,cy,t,col){ ctx.fillStyle=col; ctx.strokeStyle='#ffe6aa'; ctx.lineWidth=2; roundRect(x+cx*cell+cell*.18,y+cy*cell+cell*.24,cell*.64,cell*.52,12,true,true); ctx.fillStyle='#fff4d6'; ctx.font='900 11px system-ui'; ctx.textAlign='center'; ctx.fillText(t,x+cx*cell+cell/2,y+cy*cell+cell*.55); ctx.textAlign='left'; }}
  function drawCat(){ const {x,y,cell}=state.board; const px=x+state.cat.x*cell+cell*.12, py=y+state.cat.y*cell+cell*.08; ctx.fillStyle=state.cat.warn>0?'rgba(255,190,91,.95)':'rgba(255,244,214,.9)'; roundRect(px,py,cell*.76,cell*.42,16,true,false); ctx.fillStyle='#1b140c'; ctx.font='900 12px system-ui'; ctx.fillText(state.cat.calm>0?'calm':'cat',px+8,py+cell*.26); }
  function drawPath(){ if (state.pathScore<=0 && state.focusUntil<performance.now()) return; const {x,y,cell}=state.board; ctx.save(); ctx.strokeStyle=state.pathScore>70?'#8effc1':'#ffdf79'; ctx.lineWidth=5; ctx.setLineDash([10,9]); ctx.beginPath(); ctx.moveTo(x+state.door.x*cell+cell/2,y+state.door.y*cell+cell/2); ctx.lineTo(x+state.cushion.x*cell+cell/2,y+state.door.y*cell+cell/2); ctx.lineTo(x+state.cushion.x*cell+cell/2,y+state.cushion.y*cell+cell/2); ctx.stroke(); ctx.restore(); }
  function drawFocus(){ if(state.focusUntil<performance.now()) return; const {x,y,cell}=state.board; ctx.fillStyle='rgba(160,220,255,.18)'; for(const r of state.moonbeams) ctx.fillRect(x,y+r*cell,cell*6,cell); ctx.fillStyle='#baf7ff'; ctx.font='900 16px system-ui'; ctx.fillText('MA FOCUS: seam risks + moonbeam grain visible', x+12, y-20); }
  function roundRect(x,y,w,h,r,fill,stroke){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); if(fill)ctx.fill(); if(stroke)ctx.stroke(); }

  let dragging=false;
  function pointerCell(ev){ const rect=canvas.getBoundingClientRect(); const px=(ev.clientX-rect.left), py=(ev.clientY-rect.top); const c=Math.floor((px-state.board.x)/state.board.cell), r=Math.floor((py-state.board.y)/state.board.cell); return {c,r}; }
  canvas.addEventListener('pointerdown', (ev)=>{ if(!state.running||state.paused)return; canvas.setPointerCapture(ev.pointerId); dragging=true; const {c,r}=pointerCell(ev); for(let i=state.mats.length-1;i>=0;i--){ const m=state.mats[i]; if(m.placed&&matCells(m).some(([x,y])=>x===c&&y===r)){state.selected=i;setMessage(`Selected mat ${i+1}.`);break;} } updateHud(); draw(); });
  canvas.addEventListener('pointermove', (ev)=>{ if(!dragging||!state.running||state.paused)return; const {c,r}=pointerCell(ev); const m=selectedMat(); if(m.locked)return; const fp=footprint(m); if(c!==m.x||r!==m.y){m.x=Math.max(0,Math.min(state.board.cols-fp.w,c));m.y=Math.max(0,Math.min(state.board.rows-fp.h,r));m.placed=true; computeStats(); updateHud(); draw(); }});
  canvas.addEventListener('pointerup', ()=>{ if(dragging){dragging=false; addScore(55); beep('place'); previewValidityMessage(); updateHud(); draw();} });
  function previewValidityMessage(){ computeStats(); if(state.violations>0) setMessage('Four-corner seam risk detected; offset a mat or use half mat.'); else setMessage('Placement settled. Preview Walk when cushion/table and grain goals look calm.'); }

  const bind = (id, fn) => $(id).addEventListener('click', fn);
  bind('startButton', startGame); bind('prevMat',()=>cycleMat(-1)); bind('nextMat',()=>cycleMat(1)); bind('slideUp',()=>moveMat(0,-1)); bind('slideDown',()=>moveMat(0,1)); bind('slideLeft',()=>moveMat(-1,0)); bind('slideRight',()=>moveMat(1,0)); bind('rotateMat',rotateMat); bind('swapMat',swapMat); bind('lockMat',lockMat); bind('placeCushion',()=>placeAnchor('cushion')); bind('placeTable',()=>placeAnchor('table')); bind('previewWalk',previewWalk); bind('calmCat',calmCat); bind('maFocus',useFocus);
  bind('pauseButton',()=>{ if(!state.running)return; state.paused=true; els.pauseOverlay.classList.remove('hidden'); beep('click'); }); bind('resumeButton',()=>{ state.paused=false; state.lastTick=performance.now(); els.pauseOverlay.classList.add('hidden'); requestAnimationFrame(loop); }); bind('restartButton',startGame); bind('pauseRestartButton',()=>{els.pauseOverlay.classList.add('hidden');startGame();}); bind('resultRestartButton',()=>{els.resultOverlay.classList.add('hidden');startGame();});
  bind('audioToggle',()=>{ state.audioEnabled=!state.audioEnabled; els.audioToggle.textContent=`Audio: ${state.audioEnabled?'On':'Off'}`; if(state.audioEnabled)initAudio(); window.__day039Audio={ctx:audio.ctx,enabled:Boolean(audio.ctx&&state.audioEnabled)}; });
  window.addEventListener('keydown',(e)=>{ if(!state.running)return; const k=e.key.toLowerCase(); if(k==='p')$('pauseButton').click(); if(k==='r')startGame(); if(state.paused)return; if(k==='arrowup'||k==='w')moveMat(0,-1); if(k==='arrowdown'||k==='s')moveMat(0,1); if(k==='arrowleft'||k==='a')moveMat(-1,0); if(k==='arrowright'||k==='d')moveMat(1,0); if(k===' '||k==='q'||k==='e')rotateMat(); if(k==='h')swapMat(); if(k==='l')lockMat(); if(k==='c')placeAnchor('cushion'); if(k==='t')placeAnchor('table'); if(k==='g')calmCat(); if(k==='m'||k==='shift')useFocus(); });
  window.addEventListener('resize', draw);
  resetMats(); updateHud(); draw();
})();
