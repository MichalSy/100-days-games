(() => {
  const canvas = document.getElementById('garden');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const $ = (id) => document.getElementById(id);
  const image = (src) => { const img = new Image(); img.src = src; return img; };
  const assets = {
    bg: image('./assets/moon-garden.png'),
    keeper: image('./assets/firefly-keeper.png'),
    icons: image('./assets/hikari-icons.png')
  };

  const colors = {
    red: { label: 'Red ◇', fill: '#ff565e', glow: 'rgba(255,86,94,.62)' },
    blue: { label: 'Blue ○', fill: '#55b9ff', glow: 'rgba(85,185,255,.62)' },
    gold: { label: 'Gold ✦', fill: '#ffd65f', glow: 'rgba(255,214,95,.7)' },
    violet: { label: 'Violet △', fill: '#c884ff', glow: 'rgba(200,132,255,.65)' },
    rainbow: { label: 'Rainbow ★', fill: '#ffffff', glow: 'rgba(255,255,255,.78)' }
  };
  const phasePlans = [
    { name: 'Lantern Triangle', seconds: 180, lanterns: [
      { x: 206, y: 452, request: ['gold'] },
      { x: 690, y: 486, request: ['blue'] },
      { x: 450, y: 770, request: ['red'] }
    ]},
    { name: 'River Bridge', seconds: 150, lanterns: [
      { x: 176, y: 675, request: ['blue','gold'] },
      { x: 720, y: 705, request: ['red','blue'] }
    ]},
    { name: 'Dawn Spiral', seconds: 125, lanterns: [
      { x: 452, y: 492, request: ['violet','gold'] },
      { x: 246, y: 890, request: ['red','violet'] },
      { x: 668, y: 930, request: ['blue','gold','red'] }
    ]}
  ];
  const groves = [{x:112,y:1030},{x:780,y:1030},{x:142,y:590},{x:758,y:610}];
  const bestKey = 'hikari-firefly-best-v1';
  const fastKey = 'hikari-firefly-fastest-v1';
  const streakKey = 'hikari-firefly-streak-v1';
  const waveKey = 'hikari-firefly-wave-v1';
  let best = Number(localStorage.getItem(bestKey) || 0);
  let fastest = Number(localStorage.getItem(fastKey) || 0);
  let bestStreak = Number(localStorage.getItem(streakKey) || 0);
  let bestWave = Number(localStorage.getItem(waveKey) || 0);
  let seed = 4004;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const randBetween = (a,b) => a + rand() * (b-a);
  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
  const dist = (a,b) => Math.hypot(a.x-b.x, a.y-b.y);

  let state = 'title', last = 0, pointer = null, keyDown = {};
  let fireflies = [], strokes = [], particles = [], shadows = [], winds = [], puddles = [], lanterns = [];
  let phaseIndex = 0, completedPhases = 0, score = 0, timer = 180, ink = 100, shadowMeter = 0, combo = 0, cleanStreak = 0;
  let pulse = 100, pulseTime = 0, spawnClock = 0, dawnMap = false, dawnBannerTime = 0, endlessWave = 0, runClock = 0, inkSpentPhase = 0, phaseLosses = 0;
  const ui = ['score','best','timer','combo','phase','request','bestTitle','fastestTitle','waveTitle','finalScore','bestOver','finalPhases','finalDawn','resultTitle'].reduce((a,id)=>(a[id]=$(id),a),{});
  const meters = { ink: $('ink'), shadow: $('shadow'), pulse: $('pulse') };
  const title = $('titleScreen'), pauseOverlay = $('pauseOverlay'), resultsOverlay = $('resultsOverlay'), dawnBanner = $('dawnBanner'), masteryList = $('masteryList');

  function setState(next) {
    state = next;
    title.classList.toggle('hidden', next !== 'title');
    pauseOverlay.classList.toggle('hidden', next !== 'pause');
    resultsOverlay.classList.toggle('hidden', next !== 'results');
  }

  function reset() {
    seed = 4004;
    fireflies = []; strokes = []; particles = []; shadows = []; winds = []; puddles = [];
    phaseIndex = 0; completedPhases = 0; score = 0; timer = 180; ink = 100; shadowMeter = 0; combo = 0; cleanStreak = 0;
    pulse = 100; pulseTime = 0; spawnClock = 0; dawnMap = false; dawnBannerTime = 0; endlessWave = 0; runClock = 0; inkSpentPhase = 0; phaseLosses = 0;
    startPhase(0);
    for (let i=0;i<10;i++) spawnFirefly(true);
    setState('play');
    updateHud();
  }

  function startPhase(index) {
    const plan = index < phasePlans.length ? phasePlans[index] : makeEndlessPlan(index - phasePlans.length + 1);
    phaseIndex = index;
    lanterns = plan.lanterns.map((l,i) => ({...l, id: i, progress: 0, done: false, pulse: rand()*6}));
    timer = dawnMap ? Math.max(55, 95 - endlessWave * 4) : Math.max(70, plan.seconds - completedPhases * 10);
    ink = clamp(ink + 24, 0, 100);
    inkSpentPhase = 0; phaseLosses = 0;
    makeHazards();
  }

  function makeEndlessPlan(wave) {
    endlessWave = wave;
    const palette = ['red','blue','gold','violet'];
    const count = clamp(2 + Math.floor(wave/2), 2, 4);
    const lanternPool = [{x:190,y:470},{x:700,y:500},{x:178,y:820},{x:718,y:860},{x:450,y:650},{x:450,y:990}];
    const picked = [];
    for(let i=0;i<count;i++) {
      const base = lanternPool[(i*2 + wave) % lanternPool.length];
      const len = clamp(2 + Math.floor((wave+i)/3), 2, 4);
      const req = Array.from({length: len}, (_,j) => palette[(i+j+wave) % palette.length]);
      picked.push({x: base.x + randBetween(-34,34), y: base.y + randBetween(-34,34), request: req});
    }
    return { name: `Endless Wave ${wave}`, seconds: Math.max(55, 95-wave*4), lanterns: picked };
  }

  function makeHazards() {
    const scale = dawnMap ? 1 + endlessWave * .18 : 1 + phaseIndex * .3;
    shadows = [{x:120,y:350,vx:80*scale,vy:0,r:34,mode:0,phase:rand()*6}];
    if (phaseIndex >= 1 || dawnMap) winds = [{x:700,y:720,r:54,a:0,s:1.4*scale}]; else winds = [];
    if (phaseIndex >= 2 || dawnMap) puddles = [{x:230,y:955,r:54,p:rand()*6},{x:670,y:1080,r:48,p:rand()*6}]; else puddles = [];
    if (dawnMap && endlessWave > 1) shadows.push({x:760,y:390,vx:-95*scale,vy:0,r:32,mode:1,phase:rand()*6});
  }

  function spawnFirefly(initial=false) {
    const g = groves[Math.floor(rand()*groves.length)];
    const palette = phaseIndex < 1 ? ['red','blue','gold'] : phaseIndex < 2 ? ['red','blue','gold'] : ['red','blue','gold','violet'];
    const rainbowChance = dawnMap ? .05 : .025;
    const c = rand() < rainbowChance ? 'rainbow' : palette[Math.floor(rand()*palette.length)];
    fireflies.push({
      x: initial ? randBetween(160,740) : g.x + randBetween(-36,36),
      y: initial ? randBetween(560,1030) : g.y + randBetween(-36,36),
      vx: randBetween(-24,24), vy: randBetween(-24,24), color: c, age: rand()*5, r: 11, scared: 0, delivered: false
    });
  }

  function pointerPos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX-r.left)/r.width*W, y: (e.clientY-r.top)/r.height*H };
  }

  function beginDraw(e) {
    if (state !== 'play') return;
    pointer = pointerPos(e);
    addStrokePoint(pointer, true);
    try { canvas.setPointerCapture(e.pointerId); } catch {}
  }
  function moveDraw(e) {
    if (state !== 'play' || !pointer) return;
    const p = pointerPos(e);
    const d = Math.hypot(p.x-pointer.x, p.y-pointer.y);
    if (d > 4) addStrokePoint(p, false, d);
    pointer = p;
  }
  function endDraw() { pointer = null; }

  function addStrokePoint(p, start=false, d=0) {
    if (ink <= 0) return;
    if (start || !strokes.length || strokes[strokes.length-1].dead) strokes.push({points:[p], life: 4.7, age: 0, dead:false});
    else {
      const s = strokes[strokes.length-1];
      s.points.push(p);
      if (s.points.length > 24) s.points.shift();
    }
    const cost = start ? .35 : d * .035;
    ink = clamp(ink - cost, 0, 100);
    inkSpentPhase += cost;
  }

  function usePulse() {
    if (state !== 'play' || pulse < 100) return;
    pulse = 0; pulseTime = 3.0;
    for (let i=0;i<36;i++) particles.push({x:W/2,y:H*.53,vx:Math.cos(i/36*Math.PI*2)*randBetween(60,260),vy:Math.sin(i/36*Math.PI*2)*randBetween(60,260),life:1.2,c:'#a8ddff'});
  }

  function activeLantern() {
    return lanterns.find(l => !l.done) || lanterns[lanterns.length-1];
  }
  function matches(fly, need) { return fly.color === need || fly.color === 'rainbow'; }

  function deliver(f, l) {
    const need = l.request[l.progress];
    if (matches(f, need)) {
      f.delivered = true;
      l.progress++;
      combo++; cleanStreak++;
      score += 80 + Math.min(300, combo*12);
      ink = clamp(ink + 9, 0, 100);
      pulse = clamp(pulse + 9, 0, 100);
      for (let i=0;i<12;i++) particles.push({x:l.x,y:l.y,vx:randBetween(-90,90),vy:randBetween(-120,80),life:randBetween(.45,1.1),c:colors[f.color].fill});
      if (l.progress >= l.request.length) {
        l.done = true;
        score += 220;
        ink = clamp(ink + 20, 0, 100);
        pulse = clamp(pulse + 14, 0, 100);
        if (phaseLosses === 0) score += 80;
        if (cleanStreak >= 10) score += 60;
        if (lanterns.every(x => x.done)) completePhase();
      }
    } else {
      score = Math.max(0, score - 35);
      combo = 0;
      f.scared = 1.3;
      const a = Math.atan2(f.y-l.y, f.x-l.x);
      f.vx += Math.cos(a)*170; f.vy += Math.sin(a)*170;
    }
  }

  function completePhase() {
    completedPhases++;
    const efficient = inkSpentPhase < 42;
    if (efficient) score += 150;
    score += Math.max(0, Math.floor(timer * 2));
    if (!dawnMap && completedPhases >= 3 && score >= 1800) {
      dawnMap = true;
      score += 700;
      dawnBannerTime = 4.2;
      dawnBanner.classList.remove('hidden');
      if (!fastest || runClock < fastest) { fastest = runClock; localStorage.setItem(fastKey, String(fastest)); }
      startPhase(phasePlans.length);
    } else {
      startPhase(dawnMap ? phasePlans.length + endlessWave : completedPhases);
    }
  }

  function finish(reason) {
    best = Math.max(best, Math.floor(score));
    bestStreak = Math.max(bestStreak, cleanStreak);
    bestWave = Math.max(bestWave, endlessWave);
    localStorage.setItem(bestKey, String(best));
    localStorage.setItem(streakKey, String(bestStreak));
    localStorage.setItem(waveKey, String(bestWave));
    ui.resultTitle.textContent = reason === 'shadow' ? 'Garden shadows filled the map' : reason === 'dawn' ? 'Dawn arrived too soon' : 'Run complete';
    ui.finalScore.textContent = Math.floor(score);
    ui.bestOver.textContent = best;
    ui.finalPhases.textContent = String(completedPhases);
    ui.finalDawn.textContent = dawnMap ? 'Completed' : 'Not completed';
    const under150 = dawnMap && fastest && fastest <= 150;
    const goals = [completedPhases >= 1 && phaseLosses === 0, cleanStreak >= 10, under150, score >= 3000];
    masteryList.innerHTML = `<li>${goals[0]?'✓':'○'} Clean constellation: no firefly lost in a phase</li><li>${goals[1]?'✓':'○'} 10-delivery streak</li><li>${goals[2]?'✓':'○'} Hikari Dawn Map under 150 seconds</li><li>${goals[3]?'✓':'○'} 3000 score in endless chase</li>`;
    updateHud();
    setState('results');
  }

  function update(dt) {
    if (state !== 'play') return;
    runClock += dt;
    timer -= dt;
    if (timer <= 0) return finish('dawn');
    pulse = clamp(pulse + dt * (dawnMap ? 7 : 10), 0, 100);
    if (pulseTime > 0) pulseTime -= dt;
    if (dawnBannerTime > 0) { dawnBannerTime -= dt; if (dawnBannerTime <= 0) dawnBanner.classList.add('hidden'); }
    spawnClock -= dt;
    if (spawnClock <= 0) { spawnFirefly(false); spawnClock = randBetween(.75,1.3) * (dawnMap ? .82 : 1); }

    for (const s of strokes) { s.age += dt; s.life -= dt; if (s.life <= 0) s.dead = true; }
    strokes = strokes.filter(s => !s.dead && s.points.length > 1);

    for (const sh of shadows) {
      if (pulseTime <= 0) { sh.phase += dt; sh.x += sh.vx * dt; sh.y += Math.sin(sh.phase*1.4)*25*dt; }
      if (sh.x < 80 || sh.x > W-80) sh.vx *= -1;
    }
    for (const w of winds) {
      if (pulseTime <= 0) w.a += dt*w.s;
      for (const s of strokes) {
        if (s.points.some(p => Math.hypot(p.x-w.x,p.y-w.y) < w.r)) s.life -= dt*2.7;
      }
    }
    for (const p of puddles) {
      p.p += dt;
      for (const s of strokes) if (s.points.some(pt => Math.hypot(pt.x-p.x,pt.y-p.y) < p.r)) s.life -= dt*3.8;
    }

    for (const f of fireflies) {
      f.age += dt;
      if (f.scared > 0) f.scared -= dt;
      let ax = Math.sin(f.age*1.7)*18, ay = Math.cos(f.age*1.2)*14;
      const route = nearestRouteVector(f);
      if (route && f.scared <= 0) { ax += route.dx * 460; ay += route.dy * 460; }
      if (pulseTime > 0 && strokes.length) {
        const target = nearestStrokePoint(f);
        if (target) { const a = Math.atan2(target.y-f.y,target.x-f.x); ax += Math.cos(a)*260; ay += Math.sin(a)*260; }
      }
      f.vx = f.vx * Math.pow(.05,dt) + ax * dt;
      f.vy = f.vy * Math.pow(.05,dt) + ay * dt;
      const max = f.scared > 0 ? 260 : 150;
      const m = Math.hypot(f.vx,f.vy); if (m > max) { f.vx = f.vx/m*max; f.vy = f.vy/m*max; }
      f.x += f.vx * dt; f.y += f.vy * dt;
      if (f.x < 35 || f.x > W-35) f.vx *= -1;
      if (f.y < 190 || f.y > H-90) f.vy *= -1;
      f.x = clamp(f.x,35,W-35); f.y = clamp(f.y,190,H-90);
      for (const sh of shadows) if (dist(f,sh) < sh.r + 12 && f.scared <= 0) loseFirefly(f, sh);
      for (const l of lanterns) if (!f.delivered && !l.done && dist(f,l) < 42) deliver(f,l);
    }
    fireflies = fireflies.filter(f => !f.delivered && f.y < H+120);
    while (fireflies.length < 8) spawnFirefly(false);

    for (const p of particles) { p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 30*dt; p.life -= dt; }
    particles = particles.filter(p => p.life > 0);
    updateHud();
  }

  function loseFirefly(f, sh) {
    f.delivered = true;
    shadowMeter = clamp(shadowMeter + 12, 0, 100);
    combo = 0; phaseLosses++;
    for (let i=0;i<10;i++) particles.push({x:f.x,y:f.y,vx:randBetween(-100,100),vy:randBetween(-100,100),life:.7,c:'#5b356c'});
    if (shadowMeter >= 100) finish('shadow');
  }

  function nearestStrokePoint(f) {
    let bestP = null, bestD = 9999;
    for (const s of strokes) for (const p of s.points) { const d = Math.hypot(f.x-p.x,f.y-p.y); if (d < bestD) { bestD = d; bestP = p; } }
    return bestD < 150 ? bestP : null;
  }

  function nearestRouteVector(f) {
    let best = null;
    for (const s of strokes) {
      for (let i=1;i<s.points.length;i++) {
        const a=s.points[i-1], b=s.points[i], dx=b.x-a.x, dy=b.y-a.y, len=Math.hypot(dx,dy)||1;
        const t=clamp(((f.x-a.x)*dx+(f.y-a.y)*dy)/(len*len),0,1);
        const px=a.x+dx*t, py=a.y+dy*t, d=Math.hypot(f.x-px,f.y-py);
        if (d < 82 && (!best || d < best.d)) best = {d, dx:dx/len, dy:dy/len};
      }
    }
    return best;
  }

  function updateHud() {
    ui.score.textContent = Math.floor(score);
    ui.best.textContent = best;
    ui.bestTitle.textContent = best;
    ui.fastestTitle.textContent = fastest ? `${Math.ceil(fastest)}s` : '—';
    ui.waveTitle.textContent = bestWave;
    ui.timer.textContent = `${Math.max(0,Math.ceil(timer))}s`;
    ui.combo.textContent = `x${combo}`;
    const planName = dawnMap ? `Endless ${Math.max(1,endlessWave)}` : (phasePlans[phaseIndex]?.name || 'Dawn Map');
    ui.phase.textContent = planName.replace('Lantern ','').replace('River ','').replace('Dawn ','');
    const l = activeLantern();
    ui.request.textContent = l && !l.done ? l.request.map((c,i) => (i < l.progress ? '✓' : colors[c].label.split(' ')[0])).join('›') : '—';
    meters.ink.value = Math.floor(ink);
    meters.shadow.value = Math.floor(shadowMeter);
    meters.pulse.value = Math.floor(pulse);
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    if (assets.bg.complete) ctx.drawImage(assets.bg, 0, 0, W, H); else drawFallbackBg();
    ctx.fillStyle = 'rgba(2,8,20,.18)'; ctx.fillRect(0,0,W,H);
    drawMapLines();
    drawGroves();
    for (const p of puddles) drawPuddle(p);
    for (const s of strokes) drawStroke(s);
    for (const l of lanterns) drawLantern(l);
    for (const w of winds) drawWind(w);
    for (const sh of shadows) drawShadow(sh);
    for (const f of fireflies) drawFirefly(f);
    for (const p of particles) drawParticle(p);
    drawKeeper();
    requestAnimationFrame(draw);
  }

  function drawFallbackBg(){ const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#123e78'); g.addColorStop(1,'#071022'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); }
  function drawMapLines(){ ctx.save(); ctx.globalAlpha=.32; ctx.strokeStyle='#ffd66b'; ctx.lineWidth=2; ctx.setLineDash([8,14]); ctx.beginPath(); for(const l of lanterns){ctx.moveTo(W/2,760);ctx.lineTo(l.x,l.y);} ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
  function drawGroves(){ for(const g of groves){ const grd=ctx.createRadialGradient(g.x,g.y,10,g.x,g.y,92); grd.addColorStop(0,'rgba(255,214,95,.18)'); grd.addColorStop(1,'rgba(60,120,80,0)'); ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(g.x,g.y,92,0,7); ctx.fill(); } }
  function drawStroke(s){ ctx.save(); const alpha=clamp(s.life/4.7,0,1); ctx.lineCap='round'; ctx.lineJoin='round'; ctx.shadowColor='rgba(255,224,117,.9)'; ctx.shadowBlur=18; ctx.strokeStyle=`rgba(255,220,92,${.72*alpha})`; ctx.lineWidth=15; ctx.beginPath(); s.points.forEach((p,i)=> i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)); ctx.stroke(); ctx.shadowBlur=0; ctx.strokeStyle=`rgba(255,255,231,${.8*alpha})`; ctx.lineWidth=4; ctx.stroke(); ctx.restore(); }
  function drawLantern(l){ const need = l.request[l.progress] || l.request[l.request.length-1]; const c = colors[need] || colors.gold; l.pulse += .035; ctx.save(); ctx.translate(l.x,l.y); ctx.shadowColor=c.glow; ctx.shadowBlur=26 + Math.sin(l.pulse)*5; ctx.fillStyle = l.done ? 'rgba(255,238,178,.55)' : c.fill; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-30,-36,60,72,22) : ctx.rect(-30,-36,60,72); ctx.fill(); ctx.shadowBlur=0; ctx.strokeStyle=l.done?'#fff5c7':'#381d08'; ctx.lineWidth=4; ctx.stroke(); ctx.fillStyle='#281608'; ctx.font='900 17px system-ui'; ctx.textAlign='center'; ctx.fillText(l.done?'✓':`${l.progress+1}/${l.request.length}`,0,7); ctx.fillStyle='#fff8d3'; ctx.font='800 13px system-ui'; ctx.fillText(l.request.map((x,i)=>i<l.progress?'✓':x[0].toUpperCase()).join(''),0,54); ctx.restore(); }
  function drawFirefly(f){ const c=colors[f.color]; ctx.save(); ctx.translate(f.x,f.y); const a=Math.atan2(f.vy,f.vx); ctx.rotate(a); ctx.globalAlpha=f.scared>0?.55:1; if(f.color==='rainbow'){ const grad=ctx.createLinearGradient(-16,0,16,0); grad.addColorStop(0,'#ff4d6d');grad.addColorStop(.25,'#ffd65f');grad.addColorStop(.5,'#72ffb6');grad.addColorStop(.75,'#55b9ff');grad.addColorStop(1,'#c884ff'); ctx.fillStyle=grad; } else ctx.fillStyle=c.fill; ctx.shadowColor=c.glow; ctx.shadowBlur=18; ctx.beginPath(); ctx.ellipse(0,0,13,9,0,0,7); ctx.fill(); ctx.fillStyle='rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(-4,-8,13,6,-.6,0,7); ctx.ellipse(-4,8,13,6,.6,0,7); ctx.fill(); ctx.fillStyle='#111522'; ctx.beginPath(); ctx.arc(8,-2,2,0,7); ctx.arc(8,3,2,0,7); ctx.fill(); ctx.restore(); }
  function drawShadow(sh){ ctx.save(); ctx.translate(sh.x,sh.y); ctx.scale(sh.vx<0?-1:1,1); ctx.globalAlpha=pulseTime>0?.42:.86; ctx.fillStyle='rgba(24,8,35,.92)'; ctx.shadowColor='rgba(116,49,168,.75)'; ctx.shadowBlur=18; ctx.beginPath(); ctx.ellipse(0,8,sh.r*1.15,sh.r*.78,0,0,7); ctx.fill(); ctx.beginPath(); ctx.arc(-12,-14,sh.r*.55,0,7); ctx.fill(); ctx.beginPath(); ctx.moveTo(-26,-37);ctx.lineTo(-15,-20);ctx.lineTo(-5,-37);ctx.fill(); ctx.beginPath(); ctx.moveTo(0,-35);ctx.lineTo(10,-18);ctx.lineTo(18,-34);ctx.fill(); ctx.strokeStyle='rgba(180,88,255,.6)'; ctx.lineWidth=5; ctx.beginPath(); ctx.arc(22,5,24,-1.1,1.6); ctx.stroke(); ctx.restore(); }
  function drawWind(w){ ctx.save(); ctx.translate(w.x,w.y); ctx.rotate(w.a); ctx.strokeStyle='rgba(161,226,255,.7)'; ctx.lineWidth=6; ctx.shadowColor='rgba(161,226,255,.65)'; ctx.shadowBlur=12; for(let i=0;i<3;i++){ ctx.beginPath(); ctx.arc(0,0,w.r-i*16,Math.PI*.1,Math.PI*1.55); ctx.stroke(); } ctx.restore(); }
  function drawPuddle(p){ ctx.save(); ctx.translate(p.x,p.y); ctx.fillStyle='rgba(15,7,30,.76)'; ctx.strokeStyle='rgba(189,114,255,.7)'; ctx.lineWidth=3; ctx.beginPath(); ctx.ellipse(0,0,p.r*1.22,p.r*.62,Math.sin(p.p)*.2,0,7); ctx.fill(); ctx.stroke(); ctx.restore(); }
  function drawParticle(p){ ctx.save(); ctx.globalAlpha=clamp(p.life,0,1); ctx.fillStyle=p.c; ctx.shadowColor=p.c; ctx.shadowBlur=12; ctx.beginPath(); ctx.arc(p.x,p.y,3+p.life*3,0,7); ctx.fill(); ctx.restore(); }
  function drawKeeper(){ if(!assets.keeper.complete) return; ctx.save(); ctx.globalAlpha=.78; ctx.drawImage(assets.keeper, 18, H-138, 112, 112); ctx.restore(); }

  function pauseGame(){ if(state==='play') setState('pause'); else if(state==='pause') setState('play'); }
  $('startBtn').onclick = reset;
  $('pulseBtn').onclick = usePulse;
  $('pauseBtn').onclick = pauseGame;
  $('resumeBtn').onclick = pauseGame;
  $('restartQuick').onclick = reset;
  $('restartPauseBtn').onclick = reset;
  $('restartOverBtn').onclick = reset;
  $('titleOverBtn').onclick = () => setState('title');
  canvas.addEventListener('pointerdown', beginDraw);
  canvas.addEventListener('pointermove', moveDraw);
  canvas.addEventListener('pointerup', endDraw);
  canvas.addEventListener('pointercancel', endDraw);
  window.addEventListener('keydown', (e) => {
    keyDown[e.code]=true;
    if(e.code==='Space'){ e.preventDefault(); usePulse(); }
    if(e.code==='KeyP') pauseGame();
    if(e.code==='KeyR') reset();
    if(e.code==='Enter' && state==='title') reset();
  });
  window.addEventListener('keyup', (e) => { keyDown[e.code]=false; });
  function loop(ts){ const dt=Math.min(.033,(ts-last)/1000||0); last=ts; update(dt); requestAnimationFrame(loop); }
  updateHud(); setState('title'); requestAnimationFrame(loop); requestAnimationFrame(draw);
})();
