(() => {
  const canvas = document.getElementById('pond');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const $ = (id) => document.getElementById(id);
  const img = (src) => { const i = new Image(); i.src = src; return i; };
  const assets = { koi: img('../games/001/assets/koi.png'), pond: img('../games/001/assets/pond.png'), sparks: img('../games/001/assets/lantern-sparks.png') };
  const bestKey = 'koi-lantern-drift-best-v1';
  let best = Number(localStorage.getItem(bestKey) || 0);
  let state = 'title', last = 0, waveTimer = 0, currentTimer = 0, bloomTimer = 0;
  let keys = {}, pointer = null, focus = false;
  const ui = ['score','best','bestTitle','combo','time','phase','finalScore','bestOver'].reduce((a,id)=>(a[id]=$(id),a),{});
  const flameMeter = $('flame');
  const title = $('titleScreen'), pause = $('pauseOverlay'), over = $('gameOverOverlay'), bloom = $('bloom');
  const masteryList = $('masteryList');
  const phases = ['Dawn calm','Lantern pull','Moon current','Reed rush','Midnight surge'];
  let koi, sparks, hazards, petals, score, flame, combo, runTime, current, bloomShown, waveKind, waveRemaining;

  function reset() {
    koi = { x: W * .5, y: H * .55, vx: 0, vy: 0, r: 24, a: -Math.PI / 2 };
    sparks = []; hazards = []; petals = [];
    score = 0; flame = 100; combo = 0; runTime = 0; waveTimer = 0; currentTimer = 0; bloomTimer = 0;
    current = { x: .18, y: -.05 }; bloomShown = false; waveKind = 0; waveRemaining = 0;
    spawnWave(); updateHud();
  }
  function setState(next) {
    state = next;
    title.classList.toggle('hidden', state !== 'title');
    pause.classList.toggle('hidden', state !== 'pause');
    over.classList.toggle('hidden', state !== 'over');
  }
  function start() { reset(); setState('play'); }
  function gameOver() {
    state = 'over';
    best = Math.max(best, Math.floor(score)); localStorage.setItem(bestKey, String(best));
    ui.finalScore.textContent = Math.floor(score); ui.bestOver.textContent = best;
    const goals = [score >= 1200, combo >= 10, runTime >= 90];
    masteryList.innerHTML = `<li>${goals[0]?'✓':'○'} Reach 1200 score</li><li>${goals[1]?'✓':'○'} Reach 10x combo</li><li>${goals[2]?'✓':'○'} Survive 90 seconds</li>`;
    updateHud(); setState('over');
  }
  function phaseIndex() { return Math.min(4, Math.floor(runTime / 30)); }
  function spawnWave() {
    const kind = waveKind++ % 4; waveRemaining = 0;
    const add = (x,y) => { sparks.push({x,y,r:16,t:0,life:9 - Math.min(3, phaseIndex()*.7)}); waveRemaining++; };
    if (kind === 0) for (let i=0;i<10;i++){ const a=i/10*Math.PI*2; add(W/2+Math.cos(a)*220,H/2+Math.sin(a)*145); }
    if (kind === 1) for (let i=0;i<12;i++) add(150+i*90, 150+i*34%430);
    if (kind === 2) for (let i=0;i<13;i++){ const a=i*.78, r=35+i*18; add(W/2+Math.cos(a)*r,H/2+Math.sin(a)*r*.72); }
    if (kind === 3) for (let i=0;i<14;i++) add(100+Math.random()*(W-200), 120+Math.random()*(H-200));
  }
  function spawnHazard() {
    const edge = Math.floor(Math.random()*4), p = Math.random();
    let x = edge<2 ? p*W : (edge===2 ? -30 : W+30), y = edge<2 ? (edge===0?-30:H+30) : p*H;
    const isReed = Math.random() < .45;
    hazards.push({x,y,r:isReed?30:25, reed:isReed, vx:(W/2-x)/(230+Math.random()*240), vy:(H/2-y)/(230+Math.random()*240), hit:false});
  }
  function shiftCurrent() {
    const a = Math.random()*Math.PI*2, s = .18 + phaseIndex()*.09;
    current = {x:Math.cos(a)*s, y:Math.sin(a)*s};
    for(let i=0;i<8;i++) petals.push({x:W/2,y:H/2,vx:Math.cos(a)*(80+Math.random()*120),vy:Math.sin(a)*(80+Math.random()*120),life:2+Math.random()*1.5});
  }
  function collide(a,b) { return Math.hypot(a.x-b.x,a.y-b.y) < a.r + b.r; }
  function update(dt) {
    if (state !== 'play') return;
    runTime += dt; waveTimer += dt; currentTimer += dt; flame -= dt * (1.8 + phaseIndex()*.45);
    if (waveTimer > 8.5) { flame -= 6; combo = 0; sparks = []; spawnWave(); waveTimer = 0; }
    if (currentTimer > 20) { shiftCurrent(); currentTimer = 0; }
    if (Math.random() < dt * (.45 + phaseIndex()*.18)) spawnHazard();
    const speed = focus ? 240 : 390, damp = Math.pow(.07, dt);
    let ax = 0, ay = 0;
    if (keys.ArrowLeft||keys.KeyA) ax--; if (keys.ArrowRight||keys.KeyD) ax++; if (keys.ArrowUp||keys.KeyW) ay--; if (keys.ArrowDown||keys.KeyS) ay++;
    if (pointer) { const dx=pointer.x-koi.x, dy=pointer.y-koi.y, d=Math.hypot(dx,dy)||1; ax += dx/d; ay += dy/d; }
    const len = Math.hypot(ax, ay) || 1;
    koi.vx = koi.vx*damp + ((ax/len)*speed + current.x*150) * (1-damp);
    koi.vy = koi.vy*damp + ((ay/len)*speed + current.y*150) * (1-damp);
    koi.x += koi.vx*dt; koi.y += koi.vy*dt;
    koi.x = Math.max(45, Math.min(W-45, koi.x)); koi.y = Math.max(82, Math.min(H-45, koi.y));
    if (Math.hypot(koi.vx,koi.vy)>20) koi.a = Math.atan2(koi.vy,koi.vx) + Math.PI/2;
    for (const h of hazards) { h.x += h.vx*dt*60; h.y += h.vy*dt*60; if (!h.hit && collide(koi,h)) { h.hit=true; flame -= h.reed?16:12; combo=0; petals.push({x:koi.x,y:koi.y,vx:0,vy:-30,life:1.1,dark:true}); } }
    hazards = hazards.filter(h => h.x>-80&&h.x<W+80&&h.y>-80&&h.y<H+80&&!h.hit);
    for (const s of sparks) s.t += dt;
    for (let i=sparks.length-1;i>=0;i--) {
      const s = sparks[i];
      if (s.t > s.life) { sparks.splice(i,1); waveRemaining--; flame -= 2.5; combo=0; continue; }
      if (collide(koi,s)) { sparks.splice(i,1); waveRemaining--; combo++; const mult = combo>=15?5:combo>=10?4:combo>=6?3:combo>=3?2:1; score += 50*mult*(focus?.5:1); flame=Math.min(100,flame+7); for(let p=0;p<5;p++) petals.push({x:s.x,y:s.y,vx:(Math.random()-.5)*130,vy:(Math.random()-.5)*130,life:.8+Math.random()*.6}); }
    }
    if (!sparks.length && waveRemaining<=0) { score += 250; spawnWave(); waveTimer = 0; }
    score += dt*10;
    if (!bloomShown && score >= 1200) { bloomShown = true; bloomTimer = 3.5; bloom.classList.remove('hidden'); for(let i=0;i<60;i++) petals.push({x:W/2,y:H/2,vx:(Math.random()-.5)*420,vy:(Math.random()-.5)*300,life:2+Math.random()*2}); }
    if (bloomTimer > 0) { bloomTimer -= dt; if (bloomTimer <= 0) bloom.classList.add('hidden'); }
    for (const p of petals) { p.x+=p.vx*dt; p.y+=p.vy*dt; p.life-=dt; }
    petals = petals.filter(p=>p.life>0);
    if (flame <= 0) gameOver();
    updateHud();
  }
  function updateHud() {
    ui.score.textContent = Math.floor(score||0); ui.best.textContent = best; ui.bestTitle.textContent = best;
    ui.combo.textContent = 'x' + (combo>=15?5:combo>=10?4:combo>=6?3:combo>=3?2:1) + ` (${combo||0})`;
    ui.time.textContent = Math.floor(runTime||0) + 's'; ui.phase.textContent = phases[phaseIndex()] || phases[0]; flameMeter.value = Math.max(0, flame||100);
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    if (assets.pond.complete) ctx.drawImage(assets.pond,0,0,W,H); else { const g=ctx.createLinearGradient(0,0,W,H); g.addColorStop(0,'#071936'); g.addColorStop(1,'#0d3a4d'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); }
    ctx.save(); ctx.globalAlpha=.45; ctx.strokeStyle='#9de7ff'; ctx.lineWidth=2; for(let y=95;y<H;y+=70){ctx.beginPath(); for(let x=0;x<W;x+=30){ctx.lineTo(x,y+Math.sin(x*.012+performance.now()*.0008+y)*9)} ctx.stroke();} ctx.restore();
    ctx.save(); ctx.translate(W/2,H/2); ctx.fillStyle='rgba(255,190,78,.18)'; ctx.beginPath(); ctx.arc(0,0,58+Math.sin(performance.now()/400)*5,0,Math.PI*2); ctx.fill(); ctx.fillStyle='rgba(255,207,96,.75)'; ctx.beginPath(); ctx.arc(0,0,24,0,Math.PI*2); ctx.fill(); ctx.restore();
    for (const s of sparks) { const pulse=1+Math.sin((s.t*7))* .14; ctx.save(); ctx.translate(s.x,s.y); ctx.globalAlpha=Math.max(.25,1-s.t/s.life*.65); ctx.shadowColor='#ffd66b'; ctx.shadowBlur=18; if (assets.sparks.complete) ctx.drawImage(assets.sparks,0,0,256,256,-18*pulse,-18*pulse,36*pulse,36*pulse); else {ctx.fillStyle='#ffd66b';ctx.beginPath();ctx.arc(0,0,12*pulse,0,7);ctx.fill();} ctx.restore(); }
    for (const h of hazards) { ctx.save(); ctx.translate(h.x,h.y); if(h.reed){ctx.strokeStyle='#1c4034';ctx.lineWidth=8;ctx.lineCap='round';for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(i*10,22);ctx.quadraticCurveTo(i*4,-8,i*18,-32);ctx.stroke();}} else {ctx.strokeStyle='rgba(47,18,69,.9)';ctx.lineWidth=8;ctx.beginPath();ctx.arc(0,0,h.r,0,7);ctx.stroke();ctx.strokeStyle='rgba(15,5,33,.75)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,h.r*1.45,0,7);ctx.stroke();} ctx.restore(); }
    for(const p of petals){ctx.globalAlpha=Math.max(0,p.life/2);ctx.fillStyle=p.dark?'#331029':'#ffcf76';ctx.beginPath();ctx.ellipse(p.x,p.y,5,2,Math.atan2(p.vy,p.vx),0,7);ctx.fill();ctx.globalAlpha=1;}
    ctx.save(); ctx.translate(koi.x,koi.y); ctx.rotate(koi.a); ctx.shadowColor='#fff0a8'; ctx.shadowBlur=20; if (assets.koi.complete) ctx.drawImage(assets.koi,-34,-42,68,84); else {ctx.fillStyle='#fff4dd';ctx.beginPath();ctx.ellipse(0,0,22,36,0,0,7);ctx.fill();ctx.fillStyle='#f47b31';ctx.beginPath();ctx.arc(0,-8,14,0,7);ctx.fill();} ctx.restore();
    if (state === 'title') { ctx.fillStyle='rgba(255,211,106,.08)'; ctx.fillRect(0,0,W,H); }
    requestAnimationFrame(loop);
  }
  function loop(ts){ const dt=Math.min(.033,(ts-last)/1000||0); last=ts; update(dt); draw(); }
  function canvasPoint(e){ const r=canvas.getBoundingClientRect(); const t=e.touches?e.touches[0]:e; return {x:(t.clientX-r.left)*W/r.width,y:(t.clientY-r.top)*H/r.height}; }
  window.addEventListener('keydown',e=>{ keys[e.code]=true; if(e.code==='Space') focus=true; if(e.code==='Enter'&&state==='title')start(); if(e.code==='KeyP'){ if(state==='play')setState('pause'); else if(state==='pause')setState('play'); } if(e.code==='KeyR'&&state!=='title')start(); });
  window.addEventListener('keyup',e=>{ keys[e.code]=false; if(e.code==='Space')focus=false; });
  canvas.addEventListener('pointerdown',e=>{ if(state==='title') return start(); pointer=canvasPoint(e); canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove',e=>{ if(pointer) pointer=canvasPoint(e); });
  canvas.addEventListener('pointerup',()=>{ pointer=null; }); canvas.addEventListener('pointercancel',()=>{ pointer=null; });
  $('startBtn').onclick=start; $('resumeBtn').onclick=()=>setState('play'); $('pauseBtn').onclick=()=> state==='play'?setState('pause'):state==='pause'?setState('play'):null;
  $('restartQuick').onclick=()=>{ if(state!=='title') start(); }; $('restartPauseBtn').onclick=start; $('restartOverBtn').onclick=start;
  const focusBtn=$('focusBtn'); ['pointerdown','touchstart'].forEach(ev=>focusBtn.addEventListener(ev,e=>{e.preventDefault();focus=true;focusBtn.classList.add('held')})); ['pointerup','pointerleave','touchend','touchcancel'].forEach(ev=>focusBtn.addEventListener(ev,()=>{focus=false;focusBtn.classList.remove('held')}));
  reset(); setState('title'); requestAnimationFrame(loop);
})();
