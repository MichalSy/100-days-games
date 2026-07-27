(() => {
  'use strict';

  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const ui = Object.fromEntries([
    'scoreChip','bestChip','heartsChip','lanternChip','balanceChip','tensionChip','comboChip','targetChip','windowChip','focusChip','timeChip','cardName','cardGoal','progressTicks','judgeNote','helperTitle','helperText','menuOverlay','pauseOverlay','resultOverlay','resultSummary','ceremonyBanner'
  ].map((id) => [id, document.getElementById(id)]));

  const orders = [
    {
      name: 'First Cup Clack', required: 3, stars: 1,
      text: 'Swing into Big Cup, hold balance 1.2s, catch one paper star, then keep the lantern bright.',
      targets: ['Big Cup', 'Big Cup', 'Small Cup'], baseWindow: 78
    },
    {
      name: 'Lantern Orbit', required: 3, stars: 1,
      text: 'Catch Big Cup → Small Cup, Toss Release once, Balance Hold, and avoid high string tension.',
      targets: ['Big Cup', 'Small Cup', 'Base Cup'], baseWindow: 62
    },
    {
      name: 'Grand Star Spike', required: 3, stars: 2,
      text: 'Set up from Base Cup, collect two stars, then line up the final Spike Catch before the lantern dims.',
      targets: ['Base Cup', 'Big Cup', 'Spike'], baseWindow: 48
    }
  ];
  const targetNames = ['Big Cup', 'Small Cup', 'Base Cup', 'Spike'];
  const bestKey = 'day045-kendama-best';
  const bestTimeKey = 'day045-kendama-best-time';

  const state = {
    running: false, paused: false, ended: false, won: false, muted: false,
    score: 0, best: Number(localStorage.getItem(bestKey) || 0), hearts: 3,
    lantern: 100, balance: 0, tension: 16, combo: 1, focus: 42, elapsed: 0,
    orderIndex: 0, step: 0, stars: 0, activeTarget: 0, lastCatch: null,
    handleTilt: 0, targetTilt: 0, ballAngle: -0.82, ballVel: 0.016, stringLength: 165,
    ballCaught: false, caughtTarget: null, catchHold: 0, pullPulse: 0, swingPulse: 0, tossPulse: 0,
    focusOn: false, focusTimer: 0, message: 'Tilt the handle, swing gently, pull near the upward phase, then Cup Catch when the halo glows.',
    flash: [], floorDrops: 0, tensionWarnings: 0, spikeStreak: 0, longestBalance: 0,
    starsWorld: [], particles: [], graceMissUsed: false, lastTime: 0, ceremonyTimer: 0
  };

  let audioCtx = null;
  let audioEnabled = false;
  window.__day045Audio = { ctx: null, enabled: false };

  function ensureAudio() {
    if (state.muted) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      audioEnabled = true;
      window.__day045Audio = { ctx: audioCtx, enabled: true };
    } catch {
      audioEnabled = false;
      window.__day045Audio = { ctx: audioCtx, enabled: false };
    }
  }

  function tone(freq = 440, dur = 0.08, type = 'sine', gain = 0.045, slide = 1) {
    if (state.muted) return;
    ensureAudio();
    if (!audioCtx || !audioEnabled) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(audioCtx.destination);
    osc.start(t); osc.stop(t + dur + 0.02);
  }

  function startGame() {
    ensureAudio();
    Object.assign(state, {
      running: true, paused: false, ended: false, won: false,
      score: 0, hearts: 3, lantern: 100, balance: 0, tension: 16, combo: 1, focus: 42, elapsed: 0,
      orderIndex: 0, step: 0, stars: 0, activeTarget: 0, lastCatch: null,
      handleTilt: 0, targetTilt: 0, ballAngle: -0.82, ballVel: 0.018, stringLength: 165,
      ballCaught: false, caughtTarget: null, catchHold: 0, pullPulse: 0, swingPulse: 0, tossPulse: 0,
      focusOn: false, focusTimer: 0, flash: [], floorDrops: 0, tensionWarnings: 0, spikeStreak: 0,
      longestBalance: 0, graceMissUsed: false, ceremonyTimer: 0,
      message: 'First trick begins. Swing Ball, Pull String near the upward phase, then Cup Catch Big Cup.'
    });
    spawnStars();
    ui.menuOverlay.classList.remove('show');
    ui.pauseOverlay.classList.remove('show');
    ui.resultOverlay.classList.remove('show');
    ui.ceremonyBanner.classList.remove('show');
    tone(392, .08, 'triangle', .05, 1.25);
    updateUI();
  }

  function spawnStars() {
    const o = orders[state.orderIndex];
    state.starsWorld = Array.from({ length: Math.max(1, o.stars) }, (_, i) => ({
      x: 0.30 + 0.40 * (i / Math.max(1, o.stars - 1 || 1)) + (i ? .04 : -.04),
      y: 0.25 + 0.13 * i,
      taken: false,
      drift: i * 1.7
    }));
  }

  function currentOrder() { return orders[Math.min(state.orderIndex, orders.length - 1)]; }
  function currentRequiredTarget() { return currentOrder().targets[Math.min(state.step, currentOrder().targets.length - 1)]; }

  function addScore(points, msg, sound = true) {
    const gained = Math.round(points * state.combo);
    state.score += gained;
    state.combo = Math.min(6, +(state.combo + 0.18).toFixed(2));
    state.focus = Math.min(100, state.focus + Math.max(5, Math.round(points / 70)));
    state.message = `${msg} +${gained}`;
    if (sound) tone(520 + Math.min(500, points), .07, 'triangle', .045, 1.35);
    state.flash.push({ text: `+${gained}`, life: 1, color: '#ffe47a' });
  }

  function penalty(msg, severity = 1) {
    if (!state.graceMissUsed && state.orderIndex === 0) {
      state.graceMissUsed = true;
      state.message = `${msg} Tutorial grace: no heart lost.`;
      tone(160, .08, 'sine', .035, .75);
      return;
    }
    state.hearts = Math.max(0, state.hearts - severity);
    state.combo = 1;
    state.balance = Math.min(100, state.balance + 12 * severity);
    state.lantern = Math.max(0, state.lantern - 5 * severity);
    state.message = msg;
    tone(146, .12, 'sawtooth', .035, .55);
    if (state.hearts <= 0) endGame(false, 'Focus hearts spent. The fox judge rings the retry bell.');
  }

  function geometry() {
    const w = canvas.width, h = canvas.height;
    const pivot = { x: w * 0.50, y: h * 0.70 };
    const tilt = state.handleTilt;
    const cupOffset = Math.cos(tilt) * 82;
    const cupUp = Math.sin(tilt) * 32;
    const targets = {
      'Small Cup': { x: pivot.x - cupOffset, y: pivot.y - 118 - cupUp, r: 44, kind: 'cup' },
      'Big Cup': { x: pivot.x + cupOffset, y: pivot.y - 118 + cupUp, r: 55, kind: 'cup' },
      'Base Cup': { x: pivot.x, y: pivot.y + 66, r: 48, kind: 'cup' },
      'Spike': { x: pivot.x, y: pivot.y - 202, r: 27, kind: 'spike' }
    };
    let ball;
    if (state.ballCaught) {
      const t = targets[state.caughtTarget || targetNames[state.activeTarget]];
      ball = { x: t.x, y: t.y - (t.kind === 'spike' ? 18 : 22) + Math.sin(state.catchHold * 8) * Math.min(7, state.balance / 16) };
    } else {
      const len = state.stringLength - state.pullPulse * 48 + state.tossPulse * 14;
      const a = state.ballAngle + tilt * 0.55;
      ball = { x: pivot.x + Math.sin(a) * len, y: pivot.y - 188 + Math.cos(a) * len };
    }
    return { w, h, pivot, targets, ball };
  }

  function setTarget(target) {
    state.activeTarget = Math.max(0, targetNames.indexOf(target));
  }

  function tryCupCatch() {
    if (!state.running || state.paused || state.ended) return;
    if (targetNames[state.activeTarget] === 'Spike') { trySpikeCatch(); return; }
    const g = geometry();
    const name = targetNames[state.activeTarget];
    const t = g.targets[name];
    const dist = Math.hypot(g.ball.x - t.x, g.ball.y - t.y);
    const phaseBonus = Math.abs(state.ballVel) < 0.08 ? 16 : 0;
    const allowed = currentOrder().baseWindow + phaseBonus - state.tension * 0.16;
    const correct = name === currentRequiredTarget();
    if (!state.ballCaught && dist < allowed) {
      state.ballCaught = true;
      state.caughtTarget = name;
      state.catchHold = 0;
      state.balance = Math.max(0, state.balance - 16);
      state.stringLength = 142;
      tone(420, .05, 'square', .05, 1.6);
      if (correct) advanceStep(`Clean ${name} wood clack.`);
      else penalty(`Wrong cup: ${name} caught, but trick wants ${currentRequiredTarget()}.`, 1);
    } else {
      state.floorDrops += 1;
      penalty(`Cup Catch missed the ${name} window. Swing steadier before pulling.`, 1);
    }
    updateUI();
  }

  function trySpikeCatch() {
    const g = geometry();
    const t = g.targets.Spike;
    const dist = Math.hypot(g.ball.x - t.x, g.ball.y - t.y);
    const sideways = Math.abs(Math.sin(state.ballAngle + state.handleTilt));
    const correct = currentRequiredTarget() === 'Spike' || state.orderIndex >= 2;
    if (!state.ballCaught && dist < 52 && sideways < 0.70 && state.tension < 82) {
      state.ballCaught = true;
      state.caughtTarget = 'Spike';
      state.catchHold = 0;
      state.spikeStreak += 1;
      tone(770, .08, 'triangle', .055, 1.7);
      if (correct) advanceStep('Sharp Spike Catch aligned with the star cup.');
      else addScore(260, 'Bonus spike caught early', false);
    } else {
      state.floorDrops += 1;
      state.spikeStreak = 0;
      penalty('Spike Catch missed: align the spike and slow sideways speed first.', 1);
    }
    updateUI();
  }

  function advanceStep(msg) {
    state.step += 1;
    addScore(state.caughtTarget === 'Spike' ? 520 : 260, msg, false);
    if (state.step >= currentOrder().required) completeOrder();
  }

  function completeOrder() {
    const name = currentOrder().name;
    addScore(1040 + state.stars * 190, `${name} ticket stamped.`, false);
    state.flash.push({ text: 'TICKET!', life: 1.4, color: '#c9362b' });
    state.hearts = Math.min(3, state.hearts + 1);
    state.orderIndex += 1;
    state.step = 0;
    state.stars = 0;
    state.ballCaught = false;
    state.caughtTarget = null;
    state.balance = Math.max(0, state.balance - 25);
    state.tension = Math.max(12, state.tension - 18);
    state.focus = Math.min(100, state.focus + 24);
    spawnStars();
    tone(660, .08, 'triangle', .05, 1.4); setTimeout(() => tone(880, .08, 'triangle', .04, 1.2), 90);
    if (state.orderIndex >= orders.length && state.score >= 5900) triggerWin();
    else if (state.orderIndex >= orders.length) {
      state.orderIndex = orders.length - 1;
      state.step = 0;
      currentOrder().required = 3;
      state.message = 'Endless trick chain unlocked: keep chaining cups for score.';
    }
  }

  function triggerWin() {
    if (state.won) return;
    state.won = true;
    state.ceremonyTimer = 5;
    ui.ceremonyBanner.classList.add('show');
    addScore(3500, 'Kendama Star Cup Ceremony!', false);
    const bestTime = Number(localStorage.getItem(bestTimeKey) || 9999);
    if (state.elapsed < bestTime) localStorage.setItem(bestTimeKey, String(Math.round(state.elapsed)));
    tone(620, .09, 'triangle', .05, 1.25); setTimeout(() => tone(930, .1, 'triangle', .045, 1.35), 110);
  }

  function endGame(win, reason) {
    state.ended = true; state.running = false;
    if (state.score > state.best) {
      state.best = state.score;
      localStorage.setItem(bestKey, String(state.best));
    }
    ui.resultSummary.innerHTML = `
      <div class="result-item"><strong>Final score</strong><br>${state.score}</div>
      <div class="result-item"><strong>Stars</strong><br>${state.stars}</div>
      <div class="result-item"><strong>Floor drops</strong><br>${state.floorDrops}</div>
      <div class="result-item"><strong>Spike streak</strong><br>${state.spikeStreak}</div>
      <div class="result-item"><strong>Balance</strong><br>${state.longestBalance.toFixed(1)}s</div>
      <div class="result-item"><strong>Status</strong><br>${reason}</div>
    `;
    ui.resultOverlay.classList.add('show');
    updateUI();
  }

  function doAction(action) {
    if (action !== 'audio') ensureAudio();
    if (action === 'resume') { state.paused = false; ui.pauseOverlay.classList.remove('show'); updateUI(); return; }
    if (action === 'restart') { startGame(); return; }
    if (action === 'pause') { if (!state.running) return; state.paused = true; ui.pauseOverlay.classList.add('show'); updateUI(); return; }
    if (action === 'audio') { state.muted = !state.muted; document.querySelectorAll('[data-action="audio"], #audioBtn, #pauseAudioBtn').forEach(b => b.textContent = `Audio: ${state.muted ? 'Off' : 'On'}`); ensureAudio(); updateUI(); return; }
    if (!state.running || state.paused || state.ended) return;
    switch (action) {
      case 'tiltLeft': state.targetTilt = Math.max(-0.62, state.targetTilt - 0.18); state.message = 'Tilt Left: cup window shifted left.'; tone(260, .04, 'triangle', .025, .95); break;
      case 'tiltRight': state.targetTilt = Math.min(0.62, state.targetTilt + 0.18); state.message = 'Tilt Right: cup window shifted right.'; tone(300, .04, 'triangle', .025, 1.05); break;
      case 'swing':
        state.ballCaught = false; state.caughtTarget = null;
        state.ballVel += state.ballAngle < 0 ? 0.055 : -0.055;
        state.swingPulse = 0.35; state.tension = Math.min(100, state.tension + 8);
        state.message = 'Swing Ball: momentum rises; pull near the upward phase.'; tone(330, .07, 'sine', .035, 1.45); break;
      case 'pull':
        state.pullPulse = 1; state.ballVel *= 0.82; state.stringLength = Math.max(118, state.stringLength - 12); state.tension = Math.min(100, state.tension + 12);
        state.message = 'Pull String: ball lifts and the catch arc tightens.'; tone(470, .05, 'triangle', .04, 1.8); break;
      case 'cup': tryCupCatch(); return;
      case 'spike': trySpikeCatch(); return;
      case 'toss':
        if (state.ballCaught) {
          state.ballCaught = false; state.caughtTarget = null; state.tossPulse = 1; state.ballVel = -0.12 + state.handleTilt * 0.03; state.ballAngle = -0.30 + state.handleTilt;
          state.tension = Math.min(100, state.tension + 10); addScore(240, 'Toss Release popped the ball into a transition arc.'); tone(520,.06,'triangle',.04,1.3);
        } else state.message = 'Toss Release needs a caught ball first.';
        break;
      case 'balance':
        if (state.ballCaught) { state.balance = Math.max(0, state.balance - 20); state.catchHold += 0.5; state.longestBalance = Math.max(state.longestBalance, state.catchHold); addScore(320, 'Balance Hold steadied the wobble.'); tone(245,.08,'sine',.035,.85); }
        else state.message = 'Balance Hold works after a Cup Catch or Spike Catch.';
        break;
      case 'swap':
        state.activeTarget = (state.activeTarget + 1) % targetNames.length;
        state.message = `Swap Cup: active target is ${targetNames[state.activeTarget]}.`;
        tone(380,.05,'square',.03,1.2); break;
      case 'focus':
        if (state.focus >= 40) { state.focus -= 40; state.focusOn = true; state.focusTimer = 4.2; state.message = 'Star Focus: chalk arc, catch windows, tension, and star lanes are visible.'; tone(820,.1,'triangle',.045,1.55); }
        else state.message = 'Star Focus needs more clean catches or balance.';
        break;
    }
    updateUI();
  }

  function collectStars(g) {
    for (const s of state.starsWorld) {
      if (s.taken) continue;
      const sx = s.x * g.w + Math.sin(state.elapsed * 1.4 + s.drift) * 16;
      const sy = s.y * g.h;
      if (Math.hypot(g.ball.x - sx, g.ball.y - sy) < 34) {
        s.taken = true; state.stars += 1; addScore(190, 'Paper star charm caught on the swing path.'); tone(920,.07,'triangle',.04,1.35);
      }
    }
  }

  function update(dt) {
    if (!state.running || state.paused || state.ended) return;
    state.elapsed += dt;
    state.lantern = Math.max(0, state.lantern - dt * (0.50 + state.orderIndex * 0.16));
    state.handleTilt += (state.targetTilt - state.handleTilt) * Math.min(1, dt * 8);
    if (state.ballCaught) {
      state.catchHold += dt;
      const wobble = Math.abs(state.handleTilt) * 7 + state.orderIndex * 2.5 + (state.caughtTarget === 'Spike' ? 1.5 : 0);
      state.balance = Math.min(100, state.balance + dt * wobble);
      state.longestBalance = Math.max(state.longestBalance, state.catchHold);
      if (state.balance > 84) { state.ballCaught = false; state.caughtTarget = null; state.ballVel = 0.08 * (state.handleTilt >= 0 ? 1 : -1); penalty('Balance overload spilled the ball. Use Balance Hold sooner.', 1); }
    } else {
      const gravity = -Math.sin(state.ballAngle) * 0.72;
      const tiltForce = state.handleTilt * 0.23;
      state.ballVel += (gravity + tiltForce) * dt;
      state.ballVel *= Math.pow(0.985, dt * 60);
      state.ballAngle += state.ballVel * dt * 10.5;
      if (state.ballAngle > 1.35 || state.ballAngle < -1.35) {
        state.ballVel *= -0.42; state.ballAngle = Math.max(-1.35, Math.min(1.35, state.ballAngle));
        state.floorDrops += 1; penalty('Floor bounce warning: the ball hit the counter edge.', 1);
      }
      state.stringLength += (165 - state.stringLength) * dt * 1.5;
    }
    state.pullPulse = Math.max(0, state.pullPulse - dt * 2.7);
    state.swingPulse = Math.max(0, state.swingPulse - dt * 1.7);
    state.tossPulse = Math.max(0, state.tossPulse - dt * 1.9);
    state.tension = Math.max(8, state.tension + (Math.abs(state.ballVel) * 18 + Math.abs(state.handleTilt) * 7 - 9) * dt);
    if (state.tension > 92) { state.tensionWarnings++; penalty('String tension snapped into a tangle. Slow the rhythm.', 1); state.tension = 48; }
    if (state.lantern <= 0) endGame(false, 'Lantern timer faded before the trick card was complete.');
    if (state.balance >= 100) endGame(false, 'Balance overload reached 100%.');
    if (state.focusOn) { state.focusTimer -= dt; if (state.focusTimer <= 0) state.focusOn = false; }
    if (state.ceremonyTimer > 0) { state.ceremonyTimer -= dt; if (state.ceremonyTimer <= 0) ui.ceremonyBanner.classList.remove('show'); }
    state.flash.forEach(f => f.life -= dt); state.flash = state.flash.filter(f => f.life > 0);
    state.particles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }); state.particles = state.particles.filter(p => p.life > 0);
    collectStars(geometry());
    updateUI();
  }

  function updateUI() {
    ui.scoreChip.textContent = `${state.score}`;
    ui.bestChip.textContent = `${Math.max(state.best, state.score)}`;
    ui.heartsChip.textContent = `${'♥'.repeat(state.hearts)}${'♡'.repeat(3 - state.hearts)}`;
    ui.lanternChip.textContent = `${Math.round(state.lantern)}%`;
    ui.balanceChip.textContent = `${Math.round(state.balance)}%`;
    ui.tensionChip.textContent = `${Math.round(state.tension)}%`;
    ui.comboChip.textContent = `x${state.combo.toFixed(1)}`;
    ui.targetChip.textContent = `${targetNames[state.activeTarget]}`;
    const wide = currentOrder().baseWindow - state.tension * 0.16;
    ui.windowChip.textContent = `${wide > 68 ? 'Wide' : wide > 52 ? 'Fair' : 'Tight'}`;
    ui.focusChip.textContent = `${Math.round(state.focus)}%`;
    const m = Math.floor(state.elapsed / 60), s = Math.floor(state.elapsed % 60).toString().padStart(2, '0');
    ui.timeChip.textContent = `${m}:${s}`;
    const o = currentOrder();
    ui.cardName.textContent = `${o.name} ${Math.min(state.step, o.required)}/${o.required}`;
    ui.cardGoal.textContent = o.text;
    ui.progressTicks.innerHTML = Array.from({ length: o.required }, (_, i) => `<span class="tick ${i < state.step ? 'done' : ''}" aria-label="step ${i + 1}"></span>`).join('');
    ui.judgeNote.textContent = `Fox judge: ${state.stars}/${Math.max(1, o.stars)} star charms • next ${currentRequiredTarget()} • balance ${Math.round(state.balance)}%`;
    ui.helperTitle.textContent = state.focusOn ? 'Star Focus active' : (state.ballCaught ? `${state.caughtTarget} balanced` : 'Ready for wood-clack timing');
    ui.helperText.textContent = state.message;
  }

  function drawStar(x, y, r, fill = '#f6c644') {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5;
      const rr = i % 2 ? r * 0.46 : r;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = '#7a4717'; ctx.lineWidth = 2; ctx.stroke();
  }

  function render() {
    const g = geometry();
    ctx.clearRect(0,0,g.w,g.h);
    const grad = ctx.createLinearGradient(0,0,0,g.h);
    grad.addColorStop(0, '#fff4ce'); grad.addColorStop(.55, '#f4be60'); grad.addColorStop(1, '#774019');
    ctx.fillStyle = grad; ctx.fillRect(0,0,g.w,g.h);
    ctx.globalAlpha = .30;
    ctx.drawImagePattern?.();
    for (let i=0;i<18;i++) {
      ctx.fillStyle = i % 2 ? '#7d3f1a' : '#ffe18c';
      ctx.globalAlpha = .05;
      ctx.beginPath(); ctx.arc((i*79 + 40) % g.w, 50 + (i*43) % (g.h-70), 70 + i*2, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Focus / predicted arc
    if (state.focusOn || state.pullPulse > 0.2) {
      ctx.save(); ctx.setLineDash([12, 10]); ctx.lineWidth = 4; ctx.strokeStyle = '#fff7cf'; ctx.globalAlpha = state.focusOn ? .95 : .55;
      ctx.beginPath();
      const p = g.pivot;
      for (let i = -26; i <= 26; i++) {
        const a = state.handleTilt + i / 26 * 0.95;
        const x = p.x + Math.sin(a) * (state.stringLength - 35);
        const y = p.y - 188 + Math.cos(a) * (state.stringLength - 35);
        if (i === -26) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.stroke(); ctx.restore();
    }

    // Stars
    state.starsWorld.forEach(s => {
      if (s.taken) return;
      const sx = s.x * g.w + Math.sin(state.elapsed * 1.4 + s.drift) * 16;
      const sy = s.y * g.h;
      drawStar(sx, sy, 17 + Math.sin(state.elapsed*3+s.drift)*2);
    });

    // String
    ctx.strokeStyle = state.tension > 80 ? '#c9362b' : '#263f70';
    ctx.lineWidth = state.tension > 80 ? 5 : 3;
    ctx.beginPath(); ctx.moveTo(g.pivot.x, g.pivot.y - 166); ctx.lineTo(g.ball.x, g.ball.y); ctx.stroke();

    // Kendama handle
    ctx.save(); ctx.translate(g.pivot.x, g.pivot.y); ctx.rotate(state.handleTilt);
    ctx.fillStyle = '#8c4c1f'; ctx.strokeStyle = '#542b13'; ctx.lineWidth = 6;
    roundRect(-26, -144, 52, 268, 20, true, true);
    ctx.fillStyle = '#b97934'; roundRect(-118, -150, 236, 56, 26, true, true);
    ctx.fillStyle = '#e1ad5e'; roundRect(-104, -141, 74, 38, 20, true, false); roundRect(30, -141, 74, 38, 20, true, false);
    ctx.fillStyle = '#d09b52'; roundRect(-62, 78, 124, 48, 22, true, true);
    ctx.beginPath(); ctx.moveTo(0, -220); ctx.lineTo(20, -156); ctx.lineTo(-20, -156); ctx.closePath(); ctx.fillStyle = '#d6a15b'; ctx.fill(); ctx.stroke();
    ctx.restore();

    // Target halos
    const req = currentRequiredTarget();
    for (const [name, t] of Object.entries(g.targets)) {
      const active = targetNames[state.activeTarget] === name;
      const wanted = req === name;
      ctx.save(); ctx.globalAlpha = active || wanted || state.focusOn ? 1 : .45;
      ctx.strokeStyle = active ? '#c9362b' : wanted ? '#f7d35a' : '#315d5e'; ctx.lineWidth = active ? 5 : 3;
      ctx.setLineDash(wanted && !active ? [8, 6] : []);
      ctx.beginPath(); ctx.arc(t.x, t.y - (t.kind === 'cup' ? 18 : 0), t.r, 0, Math.PI*2); ctx.stroke();
      ctx.fillStyle = active ? '#c9362b' : '#123338'; ctx.font = 'bold 16px Trebuchet MS'; ctx.textAlign = 'center';
      ctx.fillText(name, t.x, t.y + t.r + 18);
      ctx.restore();
    }

    // Ball
    const br = 30 + state.swingPulse * 4;
    const bgrad = ctx.createRadialGradient(g.ball.x - 10, g.ball.y - 12, 6, g.ball.x, g.ball.y, br);
    bgrad.addColorStop(0, '#fff1c8'); bgrad.addColorStop(.18, '#e9483b'); bgrad.addColorStop(1, '#8e1412');
    ctx.fillStyle = bgrad; ctx.beginPath(); ctx.arc(g.ball.x, g.ball.y, br, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#4e160e'; ctx.lineWidth = 4; ctx.stroke();
    if (state.ballCaught) { ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.arc(g.ball.x + 7, g.ball.y - 8, 7, 0, Math.PI*2); ctx.fill(); }

    // Floor warning
    if (!state.ballCaught && g.ball.y > g.h - 95) {
      ctx.fillStyle = 'rgba(201,54,43,.18)'; ctx.fillRect(0, g.h-80, g.w, 80);
      ctx.fillStyle = '#fff2be'; ctx.font = '900 18px Trebuchet MS'; ctx.textAlign = 'center'; ctx.fillText('Floor warning: catch or pull now', g.w/2, g.h-45);
    }

    // Meters inside stage
    meter(20, 18, 180, 'Tension', state.tension, '#263f70');
    meter(g.w - 220, 18, 200, 'Balance', state.balance, '#c9362b');
    if (state.focusOn) {
      ctx.fillStyle = 'rgba(255,246,160,.22)'; ctx.fillRect(0,0,g.w,g.h);
      ctx.fillStyle = '#17302c'; ctx.font = '900 20px Trebuchet MS'; ctx.textAlign = 'center';
      ctx.fillText(`Star Focus: next ${req} • pull phase ${(Math.abs(state.ballVel) < .06) ? 'SAFE' : 'FAST'} • tension ${Math.round(state.tension)}%`, g.w/2, 54);
    }
    state.flash.forEach((f, i) => { ctx.globalAlpha = Math.max(0, f.life); ctx.fillStyle = f.color; ctx.font = '900 34px Trebuchet MS'; ctx.textAlign = 'center'; ctx.fillText(f.text, g.w/2, 112 + i*34); ctx.globalAlpha = 1; });

    requestAnimationFrame(render);
  }

  function meter(x,y,w,label,value,color) {
    ctx.fillStyle = 'rgba(20,48,45,.74)'; roundRect(x,y,w,30,15,true,false);
    ctx.fillStyle = color; roundRect(x+4,y+4,(w-8)*Math.min(1,value/100),22,11,true,false);
    ctx.fillStyle = '#fff7cf'; ctx.font = '900 14px Trebuchet MS'; ctx.textAlign = 'center'; ctx.fillText(`${label} ${Math.round(value)}%`, x+w/2, y+20);
  }

  function roundRect(x, y, w, h, r, fill, stroke) {
    const rr = Math.min(r, w/2, h/2);
    ctx.beginPath(); ctx.moveTo(x+rr,y); ctx.arcTo(x+w,y,x+w,y+h,rr); ctx.arcTo(x+w,y+h,x,y+h,rr); ctx.arcTo(x,y+h,x,y,rr); ctx.arcTo(x,y,x+w,y,rr); ctx.closePath();
    if (fill) ctx.fill(); if (stroke) ctx.stroke();
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(640, Math.round(rect.width * dpr));
    canvas.height = Math.max(360, Math.round(rect.height * dpr));
    ctx.setTransform(dpr,0,0,dpr,0,0);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
  }

  function loop(t) {
    if (!state.lastTime) state.lastTime = t;
    const dt = Math.min(0.05, (t - state.lastTime) / 1000);
    state.lastTime = t;
    update(dt);
    requestAnimationFrame(loop);
  }

  let dragging = false;
  function pointer(e) {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    state.targetTilt = Math.max(-0.68, Math.min(0.68, (x - 0.5) * 1.45));
    if (y < .42) state.pullPulse = Math.max(state.pullPulse, .45);
    state.message = 'Drag stage: tilt handle and preview pendulum timing.';
  }
  canvas.addEventListener('pointerdown', (e) => { dragging = true; canvas.setPointerCapture(e.pointerId); ensureAudio(); pointer(e); });
  canvas.addEventListener('pointermove', (e) => { if (dragging) pointer(e); });
  canvas.addEventListener('pointerup', () => { dragging = false; });

  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('pauseBtn')?.addEventListener('click', () => doAction('pause'));
  document.getElementById('restartBtn')?.addEventListener('click', () => doAction('restart'));
  document.getElementById('audioBtn')?.addEventListener('click', () => doAction('audio'));
  document.getElementById('resumeBtn')?.addEventListener('click', () => doAction('resume'));
  document.getElementById('pauseRestartBtn')?.addEventListener('click', () => doAction('restart'));
  document.getElementById('pauseAudioBtn')?.addEventListener('click', () => doAction('audio'));
  document.getElementById('resultRestartBtn')?.addEventListener('click', () => doAction('restart'));
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (el) doAction(el.dataset.action);
  });
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    const map = { arrowleft:'tiltLeft', a:'tiltLeft', arrowright:'tiltRight', d:'tiltRight', x:'swing', z:'pull', ' ':'cup', enter:'cup', shift:'spike', k:'spike', t:'toss', b:'balance', c:'swap', f:'focus', p:'pause', r:'restart', escape:'pause' };
    if (map[k]) { e.preventDefault(); doAction(map[k]); }
  });
  window.addEventListener('resize', resizeCanvas);

  window.__day045Debug = {
    state,
    action: doAction,
    start: startGame,
    forceWin() { state.score = Math.max(state.score, 6000); state.orderIndex = 2; state.step = 2; state.activeTarget = 3; state.ballCaught = false; state.focus = 100; triggerWin(); updateUI(); },
    metrics() { return { ...geometry(), state: { score: state.score, target: targetNames[state.activeTarget], step: state.step, order: state.orderIndex, tension: state.tension, balance: state.balance, focusOn: state.focusOn, running: state.running } }; }
  };

  resizeCanvas(); updateUI(); requestAnimationFrame(render); requestAnimationFrame(loop);
})();
