(() => {
  'use strict';

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const $ = (id) => document.getElementById(id);
  const ui = {
    score: $('score'), best: $('best'), harmony: $('harmony'), turbulence: $('turbulence'), combo: $('combo'), tool: $('tool'), time: $('time'),
    stage: $('commissionStage'), objective: $('objective'), chips: $('goalChips'), helper: $('helper'), bellCharge: $('bellCharge'), stillCharge: $('stillCharge'),
    title: $('titleOverlay'), pause: $('pauseOverlay'), result: $('resultOverlay'), resultTitle: $('resultTitle'), resultText: $('resultText'), resultKicker: $('resultKicker'), mute: $('muteButton')
  };

  const bg = new Image(); bg.src = './assets/aki-garden.png';
  const icons = new Image(); icons.src = './assets/aki-icons.png';
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const dirs = {
    ne: { label: 'Rake ↗', x: 0.92, y: -0.62 },
    se: { label: 'Rake ↘', x: 0.92, y: 0.62 },
    sw: { label: 'Rake ↙', x: -0.92, y: 0.62 },
    nw: { label: 'Rake ↖', x: -0.92, y: -0.62 }
  };
  const commissions = [
    { name: 'First Rake Circle', target: ['red','red','red'], basin: 'Moon Basin A', maxTurb: 35, need: 3, text: 'Guide 3 red leaves into Moon Basin A, preserve the moss, and keep turbulence under 35%.' },
    { name: 'Crane Stone Crossing', target: ['gold','white','gold','red'], basin: 'Crane Basin B', maxTurb: 48, need: 4, text: 'Rotate crane stones, guide 4 mixed leaves, and cross the moss island without scraping it.' },
    { name: 'Moon Basin Reflection', target: ['white','red','gold','white','red'], basin: 'Moon Basin C', maxTurb: 58, need: 5, text: 'Use Still Garden and Basin Bell to complete the final moon reflection route.' }
  ];

  let W = 1120, H = 760, scale = 1;
  let tool = 'ne', selectedStone = 0, drawing = false, lastStrokeAt = 0;
  let audio = null;
  let state;

  function defaultState() {
    return {
      started: false, paused: false, over: false, won: false,
      score: 0, best: Number(localStorage.getItem('day021-best') || 0), harmony: 3, turbulence: 0, combo: 1, startTime: 0, elapsed: 0,
      commission: 0, delivered: 0, cleanChain: 0, mossTouches: 0, perfectDeliveries: 0,
      bell: 0, still: 0, stillTimer: 0, gust: 0,
      ripples: [], particles: [], warnings: [],
      stones: [
        { x: .33, y: .40, r: .10, angle: -0.45, kind: 'standing' },
        { x: .58, y: .34, r: .08, angle: 0.75, kind: 'crane' },
        { x: .45, y: .67, r: .07, angle: 0.1, kind: 'standing' }
      ],
      moss: [
        { x: .22, y: .26, rx: .13, ry: .09 },
        { x: .76, y: .24, rx: .14, ry: .08 },
        { x: .24, y: .72, rx: .16, ry: .10 },
        { x: .82, y: .70, rx: .15, ry: .11 }
      ],
      basins: [
        { x: .78, y: .44, r: .07, name: 'A' },
        { x: .65, y: .70, r: .075, name: 'B' },
        { x: .43, y: .24, r: .07, name: 'C' }
      ],
      leaves: []
    };
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(320, Math.floor(rect.width));
    H = Math.max(380, Math.floor(rect.height));
    canvas.width = Math.floor(W * DPR); canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    scale = Math.min(W / 1120, H / 760);
  }

  function boardRect() {
    const marginX = Math.max(18, W * 0.055);
    const top = Math.max(20, H * 0.045);
    const bottom = Math.max(70, H * 0.14);
    return { x: marginX, y: top, w: W - marginX * 2, h: H - top - bottom };
  }
  function toScreen(p) { const b = boardRect(); return { x: b.x + p.x * b.w, y: b.y + p.y * b.h }; }
  function fromScreen(x, y) { const b = boardRect(); return { x: (x - b.x) / b.w, y: (y - b.y) / b.h }; }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function initAudio() {
    if (audio) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctxAudio = new AC();
      audio = { ctx: ctxAudio, enabled: true, muted: false };
      window.__day021Audio = audio;
      playTone(330, .05, 'sine', .025);
    } catch { audio = { enabled: false, muted: true }; window.__day021Audio = audio; }
  }
  function playTone(freq, dur = .08, type = 'sine', gain = .035) {
    if (!audio || !audio.enabled || audio.muted || !audio.ctx) return;
    const now = audio.ctx.currentTime;
    const osc = audio.ctx.createOscillator();
    const g = audio.ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(gain, now + .012);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(g).connect(audio.ctx.destination); osc.start(now); osc.stop(now + dur + .02);
  }
  function chime(base = 520) { playTone(base, .12, 'triangle', .04); setTimeout(() => playTone(base * 1.5, .12, 'sine', .028), 65); }

  function start() {
    initAudio(); if (audio?.ctx?.state === 'suspended') audio.ctx.resume();
    state.started = true; state.paused = false; state.over = false; state.startTime = performance.now() - state.elapsed * 1000;
    ui.title.classList.add('hidden'); ui.pause.classList.add('hidden'); ui.result.classList.add('hidden');
    ui.helper.textContent = 'Garden started: rake two calm strokes, rotate a stone if needed, then release the first maple leaves.';
    chime(420);
  }
  function restart() {
    const best = state?.best || Number(localStorage.getItem('day021-best') || 0);
    state = defaultState(); state.best = best;
    selectedStone = 0; tool = 'ne'; setTool(tool); start();
  }
  function pause(show = true) {
    if (!state.started || state.over) return;
    state.paused = show; ui.pause.classList.toggle('hidden', !show);
    if (!show) state.startTime = performance.now() - state.elapsed * 1000;
  }
  function setTool(next) {
    tool = next; ui.tool.textContent = dirs[tool].label;
    document.querySelectorAll('.toolButton').forEach(btn => btn.classList.toggle('active', btn.dataset.tool === tool));
  }

  function addRipple(x, y, force = 1) {
    if (!state.started || state.paused || state.over) return;
    const p = { x: clamp(x, .04, .96), y: clamp(y, .06, .94) };
    for (const m of state.moss) {
      const dx = (p.x - m.x) / m.rx, dy = (p.y - m.y) / m.ry;
      if (dx*dx + dy*dy < 1) {
        damage('Moss scraped by rake: harmony seal cracked.', 8);
        return;
      }
    }
    const d = dirs[tool];
    state.ripples.push({ x: p.x, y: p.y, dx: d.x, dy: d.y, life: 11, age: 0, force });
    state.turbulence = clamp(state.turbulence + Math.max(0, state.ripples.length - 16) * .25, 0, 100);
    ui.helper.textContent = `${dirs[tool].label} ripple set. Release leaves when the predicted corridor avoids moss.`;
    playTone(190 + state.ripples.length * 8, .055, 'triangle', .018);
  }
  function rotateStone(delta = 1) {
    const s = state.stones[selectedStone % state.stones.length];
    s.angle += delta * Math.PI / 7;
    state.bell = clamp(state.bell + 6, 0, 100);
    ui.helper.textContent = `Stone ${selectedStone + 1} rotated: its shadow now bends nearby leaves differently.`;
    playTone(150, .08, 'square', .025);
  }
  function tamp() {
    state.turbulence = clamp(state.turbulence - 14, 0, 100);
    state.ripples = state.ripples.slice(-11);
    ui.helper.textContent = 'Tamp Sand calmed noisy ridges and lowered turbulence.';
    playTone(110, .09, 'triangle', .03);
  }
  function useBell() {
    if (state.bell < 35) { ui.helper.textContent = 'Basin Bell needs clean deliveries or stone bends to charge.'; return; }
    const c = currentCommission(); const basin = activeBasin(c);
    let nearest = null, nd = Infinity;
    for (const leaf of state.leaves) if (!leaf.done) { const d = dist(leaf, basin); if (d < nd) { nd = d; nearest = leaf; } }
    if (nearest) { nearest.vx += (basin.x - nearest.x) * .035; nearest.vy += (basin.y - nearest.y) * .035; }
    state.bell = clamp(state.bell - 35, 0, 100);
    ui.helper.textContent = 'Basin Bell rang: the nearest active leaf bends toward the correct basin.';
    chime(620);
  }
  function useStill() {
    if (state.still < 70) { ui.helper.textContent = 'Still Garden needs more clean basin deliveries to charge.'; return; }
    state.still = 0; state.stillTimer = 5.2;
    ui.helper.textContent = 'Still Garden active: gusts freeze and the route preview glows brighter.';
    chime(360);
  }
  function releaseLeaves() {
    if (!state.started || state.paused || state.over) return;
    const c = currentCommission();
    const colors = c.target.slice(0, Math.min(c.target.length, c.need));
    state.leaves = colors.map((color, i) => ({ x: .11 + i * .035, y: .51 + (i - colors.length/2) * .06, vx: .018 + i*.001, vy: -.002 + i*.001, color, done: false, age: 0, trail: [] }));
    ui.helper.textContent = `Released ${state.leaves.length} leaves. Watch ripple arrows, stone bends, and moss risk.`;
    playTone(260, .07, 'sawtooth', .025); setTimeout(() => playTone(340, .07, 'triangle', .02), 70);
  }
  function currentCommission() { return commissions[Math.min(state.commission, commissions.length - 1)]; }
  function activeBasin(c = currentCommission()) { return state.basins[Math.min(state.commission, state.basins.length - 1)]; }

  function damage(msg, turb = 10) {
    state.turbulence = clamp(state.turbulence + turb, 0, 100);
    state.combo = 1; state.mossTouches += 1;
    if (state.turbulence >= 100 || state.mossTouches % 2 === 0) state.harmony = Math.max(0, state.harmony - 1);
    state.warnings.push({ text: msg, life: 2.1 });
    ui.helper.textContent = msg;
    playTone(90, .14, 'sawtooth', .026);
    if (state.harmony <= 0) finish(false, 'Harmony seals cracked', 'Too many moss scrapes and turbulent ripples broke the quiet garden.');
  }

  function deliver(leaf, basin) {
    leaf.done = true;
    state.delivered += 1; state.cleanChain += 1; state.perfectDeliveries += 1;
    state.combo = clamp(state.combo + .16, 1, 4.2);
    const add = Math.round(100 * state.combo + (state.turbulence < currentCommission().maxTurb ? 45 : 0));
    state.score += add;
    state.bell = clamp(state.bell + 24, 0, 100); state.still = clamp(state.still + 18, 0, 100);
    state.particles.push({ x: basin.x, y: basin.y, text: `+${add}`, life: 1.2, color: '#ffe08b' });
    chime(520 + state.delivered * 35);
    if (state.delivered >= currentCommission().need) completeCommission();
  }
  function completeCommission() {
    const c = currentCommission();
    let bonus = state.turbulence <= c.maxTurb ? 560 : 250;
    if (state.mossTouches === 0) bonus += 720;
    state.score += bonus;
    state.particles.push({ x: .50, y: .50, text: `Commission +${bonus}`, life: 1.8, color: '#f8e8bc' });
    if (state.commission >= commissions.length - 1 && state.score >= 3500) {
      finish(true, 'Aki Golden Stillness', 'Maple leaves settle into a golden spiral; endless commissions are unlocked.');
    } else if (state.commission >= commissions.length - 1) {
      state.score += 1300;
      finish(true, 'Aki Golden Stillness', 'The final moon reflection is complete and the dry garden rests in warm silence.');
    } else {
      state.commission += 1; state.delivered = 0; state.leaves = []; state.ripples = state.ripples.slice(-5); state.turbulence = clamp(state.turbulence - 18, 0, 100);
      state.harmony = Math.min(3, state.harmony + 1);
      ui.helper.textContent = `${currentCommission().name}: new basin order, stronger gusts, and a calmer path to discover.`;
      chime(700);
    }
  }
  function finish(won, title, text) {
    state.over = true; state.won = won;
    if (state.score > state.best) { state.best = state.score; localStorage.setItem('day021-best', String(state.best)); }
    ui.resultKicker.textContent = won ? 'Golden stillness' : 'Garden unsettled';
    ui.resultTitle.textContent = title; ui.resultText.textContent = `${text} Final score: ${state.score}. Clean chain: ${state.cleanChain}. Moss touches: ${state.mossTouches}.`;
    ui.result.classList.remove('hidden');
    if (won) { chime(460); setTimeout(() => chime(650), 140); }
  }

  function update(dt) {
    if (!state.started || state.paused || state.over) return;
    state.elapsed = (performance.now() - state.startTime) / 1000;
    state.gust += dt * (state.stillTimer > 0 ? .08 : 1);
    state.stillTimer = Math.max(0, state.stillTimer - dt);
    state.turbulence = clamp(state.turbulence + dt * (0.25 + state.commission * .18) - (state.leaves.length ? 0 : dt*.12), 0, 100);
    for (const r of state.ripples) r.age += dt;
    state.ripples = state.ripples.filter(r => r.age < r.life);
    for (const w of state.warnings) w.life -= dt; state.warnings = state.warnings.filter(w => w.life > 0);
    for (const p of state.particles) p.life -= dt; state.particles = state.particles.filter(p => p.life > 0);

    const basin = activeBasin();
    for (const leaf of state.leaves) {
      if (leaf.done) continue;
      leaf.age += dt;
      let ax = 0.004, ay = 0;
      for (const r of state.ripples) {
        const dd = Math.hypot(leaf.x - r.x, leaf.y - r.y);
        if (dd < .28) { const f = (1 - dd / .28) * .018 * r.force; ax += r.dx * f; ay += r.dy * f; }
      }
      for (const s of state.stones) {
        const dd = Math.hypot(leaf.x - s.x, leaf.y - s.y);
        if (dd < s.r * 1.55) {
          const bend = Math.atan2(leaf.y - s.y, leaf.x - s.x) + Math.PI / 2 + s.angle * .28;
          ax += Math.cos(bend) * .025; ay += Math.sin(bend) * .025;
          state.bell = clamp(state.bell + dt * 8, 0, 100);
        }
      }
      if (state.stillTimer <= 0) { ax += Math.sin(state.gust * 1.7 + leaf.y * 8) * .004 * (state.commission + 1); ay += Math.cos(state.gust * 1.2) * .002; }
      leaf.vx = clamp((leaf.vx + ax * dt) * .992, -.055, .075);
      leaf.vy = clamp((leaf.vy + ay * dt) * .992, -.06, .06);
      leaf.x += leaf.vx * dt * 42; leaf.y += leaf.vy * dt * 42;
      leaf.trail.push({ x: leaf.x, y: leaf.y }); if (leaf.trail.length > 18) leaf.trail.shift();
      for (const m of state.moss) {
        const dx = (leaf.x - m.x) / m.rx, dy = (leaf.y - m.y) / m.ry;
        if (dx*dx + dy*dy < 1 && !leaf.hitMoss) { leaf.hitMoss = true; damage('A leaf scraped moss: reroute with a stone or tamp the ridge.', 12); }
      }
      if (dist(leaf, basin) < basin.r * 1.15) deliver(leaf, basin);
      if (leaf.x > 1.04 || leaf.y < -.06 || leaf.y > 1.06) { leaf.done = true; damage('A leaf drifted out of the garden path.', 7); }
    }
    if (state.elapsed > 260 + state.commission * 25) finish(false, 'The moon-view timer faded', 'The commission took too long and the garden lanterns dimmed.');
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawBackdrop(); drawBoard(); drawMoss(); drawRipples(); drawBasins(); drawStones(); drawPreview(); drawLeaves(); drawParticles(); drawWarnings();
  }
  function drawBackdrop() {
    if (bg.complete) ctx.drawImage(bg, 0, 0, W, H);
    ctx.fillStyle = 'rgba(36, 18, 7, .38)'; ctx.fillRect(0,0,W,H);
    const g = ctx.createRadialGradient(W*.5,H*.18,20,W*.5,H*.45,H*.72);
    g.addColorStop(0,'rgba(255,220,128,.23)'); g.addColorStop(1,'rgba(24,12,6,.62)'); ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  }
  function drawBoard() {
    const b = boardRect();
    roundRect(b.x, b.y, b.w, b.h, 28); ctx.fillStyle = 'rgba(250, 226, 172, .88)'; ctx.fill();
    ctx.strokeStyle = 'rgba(88,52,22,.45)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.save(); ctx.beginPath(); roundRect(b.x, b.y, b.w, b.h, 28); ctx.clip();
    for (let i=0;i<34;i++) {
      const y = b.y + (i/33)*b.h;
      ctx.beginPath();
      for (let x=0;x<=b.w;x+=18) {
        const yy = y + Math.sin(x*.018 + i*.55 + state.gust*.15)*8*scale;
        if (x===0) ctx.moveTo(b.x+x, yy); else ctx.lineTo(b.x+x, yy);
      }
      ctx.strokeStyle = i%3===0 ? 'rgba(138,98,48,.22)' : 'rgba(138,98,48,.12)'; ctx.lineWidth = 1.2; ctx.stroke();
    }
    ctx.restore();
  }
  function drawMoss() { for (const m of state.moss) { const p=toScreen(m); ctx.beginPath(); ctx.ellipse(p.x,p.y,m.rx*boardRect().w,m.ry*boardRect().h,0,0,Math.PI*2); ctx.fillStyle='rgba(71,94,34,.93)'; ctx.fill(); ctx.strokeStyle='rgba(28,46,18,.55)'; ctx.lineWidth=3; ctx.stroke(); } }
  function drawRipples() { const b=boardRect(); for (const r of state.ripples) { const p=toScreen(r); const a=1-r.age/r.life; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(Math.atan2(r.dy,r.dx)); for(let i=-2;i<=2;i++){ ctx.beginPath(); ctx.moveTo(-34*scale, i*11*scale); ctx.quadraticCurveTo(0, i*11*scale-7*scale, 42*scale, i*11*scale); ctx.strokeStyle=`rgba(118,76,31,${.16*a})`; ctx.lineWidth=5*scale; ctx.stroke(); ctx.strokeStyle=`rgba(255,244,207,${.20*a})`; ctx.lineWidth=1.4*scale; ctx.stroke(); } ctx.fillStyle=`rgba(139,82,24,${.65*a})`; arrow(46*scale,0,10*scale); ctx.restore(); } }
  function drawBasins() { for (const [i, basin] of state.basins.entries()) { const p=toScreen(basin); const active=i===Math.min(state.commission,2); ctx.beginPath(); ctx.arc(p.x,p.y,basin.r*boardRect().w,0,Math.PI*2); ctx.fillStyle=active?'rgba(116,78,37,.96)':'rgba(80,64,45,.62)'; ctx.fill(); ctx.strokeStyle=active?'#ffe08b':'rgba(255,255,255,.22)'; ctx.lineWidth=active?4:2; ctx.stroke(); ctx.fillStyle='#fff7df'; ctx.font=`900 ${14*scale+8}px system-ui`; ctx.textAlign='center'; ctx.fillText(basin.name,p.x,p.y+7); } }
  function drawStones() { for (const [i,s] of state.stones.entries()) { const p=toScreen(s); ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(s.angle); ctx.beginPath(); ctx.ellipse(0,0,s.r*boardRect().w*.55,s.r*boardRect().h*.9,0,0,Math.PI*2); ctx.fillStyle=i===selectedStone?'#4b4740':'#37342f'; ctx.fill(); ctx.strokeStyle=i===selectedStone?'#ffe08b':'rgba(255,255,255,.22)'; ctx.lineWidth=i===selectedStone?4:2; ctx.stroke(); ctx.restore(); } }
  function drawPreview() { if (!state.started) return; const basin=activeBasin(); const start={x:.11,y:.51}; const bp=toScreen(basin); ctx.save(); ctx.setLineDash([8,8]); ctx.strokeStyle=state.stillTimer>0?'rgba(255,224,139,.92)':'rgba(255,224,139,.42)'; ctx.lineWidth=3; ctx.beginPath(); const sp=toScreen(start); ctx.moveTo(sp.x,sp.y); ctx.quadraticCurveTo(W*.45,H*.35,bp.x,bp.y); ctx.stroke(); ctx.restore(); }
  function leafColor(c) { return c==='red'?'#c8451f':c==='gold'?'#e5a92e':'#f7f1d8'; }
  function drawLeaves() { for (const leaf of state.leaves) { for (let i=1;i<leaf.trail.length;i++) { const p=toScreen(leaf.trail[i]); ctx.fillStyle=`rgba(222,117,35,${i/leaf.trail.length*.22})`; ctx.beginPath(); ctx.arc(p.x,p.y,3+i*.08,0,Math.PI*2); ctx.fill(); } if (leaf.done) continue; const p=toScreen(leaf); ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(Math.atan2(leaf.vy,leaf.vx)+Math.PI/5); ctx.fillStyle=leafColor(leaf.color); maple(0,0,13*scale+7); ctx.restore(); } }
  function drawParticles() { ctx.textAlign='center'; ctx.font=`900 ${18*scale+8}px system-ui`; for (const p of state.particles) { const sp=toScreen(p); ctx.globalAlpha=Math.max(0,p.life/1.8); ctx.fillStyle=p.color; ctx.fillText(p.text, sp.x, sp.y - (1.8-p.life)*28); ctx.globalAlpha=1; } }
  function drawWarnings() { if (!state.warnings.length) return; ctx.fillStyle='rgba(59, 16, 8, .82)'; roundRect(20,H-74,W-40,48,14); ctx.fill(); ctx.fillStyle='#fff2cf'; ctx.font=`900 ${16*scale+8}px system-ui`; ctx.textAlign='left'; ctx.fillText(state.warnings.at(-1).text, 36, H-43); }
  function arrow(x,y,s){ ctx.beginPath(); ctx.moveTo(x+s,y); ctx.lineTo(x-s,y-s*.7); ctx.lineTo(x-s*.45,y); ctx.lineTo(x-s,y+s*.7); ctx.closePath(); ctx.fill(); }
  function maple(x,y,s){ ctx.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5; const r=i%2? s*.45:s; ctx.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r); } ctx.closePath(); ctx.fill(); ctx.strokeStyle='rgba(90,42,12,.45)'; ctx.lineWidth=1; ctx.stroke(); }
  function roundRect(x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }

  function syncUi() {
    const c=currentCommission();
    ui.score.textContent=String(state.score); ui.best.textContent=String(Math.max(state.best,state.score));
    ui.harmony.textContent='◆'.repeat(state.harmony)+'◇'.repeat(3-state.harmony);
    ui.turbulence.textContent=`${Math.round(state.turbulence)}%`; ui.combo.textContent=`×${state.combo.toFixed(1)}`;
    ui.time.textContent=`${Math.floor(state.elapsed/60)}:${String(Math.floor(state.elapsed%60)).padStart(2,'0')}`;
    ui.stage.textContent=c.name; ui.objective.textContent=c.text;
    ui.chips.innerHTML=`<span>🍁 ${state.delivered}/${c.need} leaves</span><span>◯ ${c.basin}</span><span>turb ≤ ${c.maxTurb}%</span><span>${state.stillTimer>0?'Still active':'moss safe'}</span>`;
    ui.bellCharge.textContent=`${Math.round(state.bell)}%`; ui.stillCharge.textContent=`${Math.round(state.still)}%`;
  }

  function pointerPos(e) { const r=canvas.getBoundingClientRect(); const t=e.touches?.[0]||e; return fromScreen(t.clientX-r.left,t.clientY-r.top); }
  canvas.addEventListener('pointerdown', e => { if (!state.started) return; drawing=true; lastStrokeAt=0; const p=pointerPos(e); addRipple(p.x,p.y,1.2); });
  canvas.addEventListener('pointermove', e => { if (!drawing) return; const now=performance.now(); if (now-lastStrokeAt<130) return; lastStrokeAt=now; const p=pointerPos(e); addRipple(p.x,p.y,.85); });
  window.addEventListener('pointerup', () => drawing=false);

  document.addEventListener('click', e => {
    const toolBtn=e.target.closest('[data-tool]'); if (toolBtn) setTool(toolBtn.dataset.tool);
    const action=e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    if (action==='rotate') rotateStone(1); if (action==='release') releaseLeaves(); if (action==='tamp') tamp(); if (action==='bell') useBell(); if (action==='still') useStill(); if (action==='pause') pause(true); if (action==='resume') pause(false); if (action==='restart') restart();
    if (action==='mute' && audio) { audio.muted=!audio.muted; ui.mute.textContent=audio.muted?'Unmute audio':'Mute audio'; }
  });
  $('startButton').addEventListener('click', start);
  window.addEventListener('keydown', e => {
    if (e.key==='1') setTool('ne'); if (e.key==='2') setTool('se'); if (e.key==='3') setTool('sw'); if (e.key==='4') setTool('nw');
    if (e.key===' ' || e.key==='Enter') { e.preventDefault(); state.started?releaseLeaves():start(); }
    if (e.key==='q'||e.key==='Q') rotateStone(-1); if (e.key==='e'||e.key==='E') rotateStone(1); if (e.key==='t'||e.key==='T') tamp(); if (e.key==='b'||e.key==='B') useBell();
    if (e.key==='Shift') useStill(); if (e.key==='p'||e.key==='P') pause(!state.paused); if (e.key==='r'||e.key==='R') restart();
    if (['ArrowLeft','a','A'].includes(e.key)) selectedStone=(selectedStone+state.stones.length-1)%state.stones.length;
    if (['ArrowRight','d','D'].includes(e.key)) selectedStone=(selectedStone+1)%state.stones.length;
  });
  window.addEventListener('resize', resize);

  state=defaultState(); setTool('ne'); resize(); syncUi();
  let last=performance.now();
  function loop(now){ const dt=Math.min(.05,(now-last)/1000); last=now; update(dt); draw(); syncUi(); requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
})();
