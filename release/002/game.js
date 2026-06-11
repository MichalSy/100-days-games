(() => {
  const canvas = document.getElementById('sky');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const $ = (id) => document.getElementById(id);
  const img = (src) => { const i = new Image(); i.src = src; return i; };
  const assets = { courier: img('./assets/courier.png'), bg: img('./assets/sky-islands.png'), icons: img('./assets/courier-icons.png') };
  const diffs = {
    easy: { label: 'Easy Dispatch', short: 'Easy', time: 75, count: 3, hazards: .55, wind: .75 },
    busy: { label: 'Busy Skies', short: 'Busy', time: 90, count: 4, hazards: .85, wind: 1.0 },
    rush: { label: 'Clockrush', short: 'Rush', time: 105, count: 5, hazards: 1.1, wind: 1.25 }
  };
  const towerPool = [
    {x:154,y:156},{x:356,y:106},{x:650,y:122},{x:1040,y:156},{x:1120,y:408},{x:900,y:596},{x:592,y:570},{x:214,y:506}
  ];
  const lanes = [
    {x:210,y:210,w:390,h:82,a:.18},{x:610,y:185,w:440,h:82,a:-.14},{x:330,y:455,w:430,h:86,a:-.2},{x:748,y:438,w:355,h:82,a:.16}
  ];
  const bestKey = 'clockwork-cloud-courier-best-v1', starsKey = 'clockwork-cloud-courier-stars-v1';
  let best = Number(localStorage.getItem(bestKey) || 0), bestStars = Number(localStorage.getItem(starsKey) || 0);
  let state = 'title', selected = 'easy', last = 0, pointer = null, keys = {}, boostHeld = false, overtime = 0;
  let courier, route, nextIndex, timer, score, hull, boost, hazards, rings, clouds, combo, comboBank, deliveryClock, hits, goldenShown, goldenTimer, completed, win;
  const ui = ['score','best','timer','progress','destination','combo','difficultyHud','stars','bestTitle','bestStars','pauseDiff','finalScore','finalStars','finalDeliveries','bestOver','resultTitle'].reduce((a,id)=>(a[id]=$(id),a),{});
  const hullMeter = $('hull'), boostMeter = $('boost'), masteryList = $('masteryList');
  const title = $('titleScreen'), pause = $('pauseOverlay'), results = $('resultsOverlay'), golden = $('golden');
  function seededShuffle(arr) {
    const a = arr.slice(); let seed = 2002 + Date.UTC(2026,5,12) / 86400000 + Math.floor(Math.random()*997) + overtime*17;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i=a.length-1;i>0;i--) { const j=Math.floor(rnd()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }
  function setState(next) { state = next; title.classList.toggle('hidden', state !== 'title'); pause.classList.toggle('hidden', state !== 'pause'); results.classList.toggle('hidden', state !== 'results'); }
  function choose(diff) { selected = diff; document.querySelectorAll('.card').forEach(b => b.classList.toggle('selected', b.dataset.diff === diff)); ui.pauseDiff.textContent = diffs[diff].label; updateHud(); }
  function reset(chain=false) {
    const d = diffs[selected]; if (!chain) overtime = 0;
    courier = {x:W/2,y:H/2,vx:0,vy:0,a:-Math.PI/2,r:22};
    route = seededShuffle(towerPool).slice(0, d.count).map((t,i)=>({...t,num:i+1,done:false}));
    nextIndex = 0; timer = Math.max(42, d.time * Math.pow(.92, overtime)); score = 0; hull = 3; boost = 100; hazards = []; rings = []; clouds = [];
    combo = 0; comboBank = 0; deliveryClock = 0; hits = 0; goldenShown = false; goldenTimer = 0; completed = false; win = false;
    for (let i=0;i<7+d.count;i++) spawnRing(); for (let i=0;i<6;i++) spawnHazard(true); for (let i=0;i<45;i++) clouds.push({x:Math.random()*W,y:Math.random()*H,r:18+Math.random()*50,s:.04+Math.random()*.12});
    updateHud(); setState('play');
  }
  function currentTower() { return route && route.length ? route[Math.min(nextIndex, route.length-1)] : null; }
  function collide(a,b,extra=0) { return Math.hypot(a.x-b.x,a.y-b.y) < a.r + (b.r||28) + extra; }
  function inLane(l) { const ca=Math.cos(l.a), sa=Math.sin(l.a), dx=courier.x-l.x, dy=courier.y-l.y; const rx=dx*ca+dy*sa, ry=-dx*sa+dy*ca; return Math.abs(rx)<l.w/2 && Math.abs(ry)<l.h/2; }
  function spawnRing() { rings.push({x:120+Math.random()*(W-240),y:105+Math.random()*(H-210),r:23,pulse:Math.random()*6}); }
  function spawnHazard(initial=false) { const d=diffs[selected], edge=Math.floor(Math.random()*4), p=Math.random(); let x=edge<2?p*W:(edge===2?-40:W+40), y=edge<2?(edge===0?-40:H+40):p*H; if(initial){x=120+Math.random()*(W-240);y=120+Math.random()*(H-240);} const a=Math.atan2(H/2-y,W/2-x)+(Math.random()-.5)*1.8; hazards.push({x,y,r:24+Math.random()*9,vx:Math.cos(a)*(22+30*d.hazards+overtime*5),vy:Math.sin(a)*(22+30*d.hazards+overtime*5),spin:Math.random()*6,gear:Math.random()<.38}); }
  function pauseGame() { if (state === 'play') setState('pause'); else if (state === 'pause') setState('play'); }
  function finish(didWin) {
    win = didWin; completed = true; state = 'results';
    if (didWin) { if (hits === 0) score += 300; score += Math.floor(Math.max(0,timer)*8); }
    const stars = starCount(); best = Math.max(best, Math.floor(score)); bestStars = Math.max(bestStars, stars); localStorage.setItem(bestKey, String(best)); localStorage.setItem(starsKey, String(bestStars));
    ui.resultTitle.textContent = didWin ? 'Route complete!' : (hull <= 0 ? 'Courier grounded!' : 'Clockwork day ended!');
    ui.finalScore.textContent = Math.floor(score); ui.finalStars.textContent = '★'.repeat(stars)+'☆'.repeat(3-stars); ui.finalDeliveries.textContent = `${nextIndex}/${route.length}`; ui.bestOver.textContent = best;
    const goals = [didWin, stars>=3, score>=1800, hits===0 && didWin];
    masteryList.innerHTML = `<li>${goals[0]?'✓':'○'} Win a route</li><li>${goals[1]?'✓':'○'} Earn 3 stars</li><li>${goals[2]?'✓':'○'} Score 1800</li><li>${goals[3]?'✓':'○'} Complete a no-crash route</li>`;
    updateHud(); setState('results');
  }
  function starCount() { if (!win) return 0; const d=diffs[selected], left=timer/d.time; return left>=.40 && hits<=1 ? 3 : left>=.25 ? 2 : 1; }
  function update(dt) {
    if (state !== 'play') return; timer -= dt; deliveryClock += dt; if (timer <= 0) return finish(false);
    if (Math.random() < dt * (.28 + diffs[selected].hazards*.22 + overtime*.08)) spawnHazard();
    let ax=0, ay=0; if(keys.ArrowLeft||keys.KeyA) ax--; if(keys.ArrowRight||keys.KeyD) ax++; if(keys.ArrowUp||keys.KeyW) ay--; if(keys.ArrowDown||keys.KeyS) ay++;
    if(pointer){ const dx=pointer.x-courier.x, dy=pointer.y-courier.y, m=Math.hypot(dx,dy)||1; ax+=dx/m; ay+=dy/m; }
    const len=Math.hypot(ax,ay)||1, boosting=(boostHeld||keys.Space||keys.ShiftLeft||keys.ShiftRight)&&boost>2; let speed=boosting?520:330; if(boosting) boost=Math.max(0,boost-dt*42); else boost=Math.min(100,boost+dt*16);
    let windX=0, windY=0, riding=false; for(const l of lanes) if(inLane(l)){ riding=true; windX+=Math.cos(l.a)*145*diffs[selected].wind; windY+=Math.sin(l.a)*145*diffs[selected].wind; }
    if(riding){ combo+=dt; comboBank+=dt; score+=dt*25; } else combo=Math.max(0,combo-dt*1.6);
    const damp=Math.pow(.05,dt); courier.vx=courier.vx*damp+((ax/len)*speed+windX)*(1-damp); courier.vy=courier.vy*damp+((ay/len)*speed+windY)*(1-damp); courier.x+=courier.vx*dt; courier.y+=courier.vy*dt; courier.x=Math.max(40,Math.min(W-40,courier.x)); courier.y=Math.max(86,Math.min(H-42,courier.y)); if(Math.hypot(courier.vx,courier.vy)>20) courier.a=Math.atan2(courier.vy,courier.vx)+Math.PI/2;
    for(const h of hazards){ h.x+=h.vx*dt; h.y+=h.vy*dt; h.spin+=dt*5; if(!h.hit && collide(courier,h,5)){ h.hit=true; hull--; timer=Math.max(0,timer-5); hits++; combo=0; if(hull<=0) return finish(false); } }
    hazards=hazards.filter(h=>h.x>-80&&h.x<W+80&&h.y>-80&&h.y<H+80&&!h.hit);
    for(let i=rings.length-1;i>=0;i--){ const r=rings[i]; r.pulse+=dt*5; if(collide(courier,r,7)){ rings.splice(i,1); boost=100; score+=50; timer+=1.2; spawnRing(); } }
    const t=currentTower(); if(t && collide(courier,{...t,r:42},0)){ t.done=true; nextIndex++; const fast=Math.max(0,180-deliveryClock*12); score += 250 + fast + Math.min(175, Math.floor(comboBank*8)); deliveryClock=0; comboBank=0; if(nextIndex>=route.length) return finish(true); }
    if(!goldenShown && score>=1800){ goldenShown=true; goldenTimer=3.5; golden.classList.remove('hidden'); }
    if(goldenTimer>0){ goldenTimer-=dt; if(goldenTimer<=0) golden.classList.add('hidden'); }
    updateHud();
  }
  function updateHud(){ ui.score.textContent=Math.floor(score||0); ui.best.textContent=best; ui.bestTitle.textContent=best; ui.bestStars.textContent='★'.repeat(bestStars)+'☆'.repeat(3-bestStars); ui.timer.textContent=Math.ceil(timer||diffs[selected].time)+'s'; hullMeter.value=hull||3; boostMeter.value=Math.floor(boost||0); ui.progress.textContent=`${nextIndex||0}/${route?.length||diffs[selected].count}`; const t=currentTower(); ui.destination.textContent=t?`Tower ${t.num}`:'Depot'; ui.combo.textContent=`${Math.floor(combo||0)}s`; ui.difficultyHud.textContent=diffs[selected].short; const sc=starCount(); ui.stars.textContent='★'.repeat(sc)+'☆'.repeat(3-sc); }
  function draw() {
    ctx.clearRect(0,0,W,H); if(assets.bg.complete) ctx.drawImage(assets.bg,0,0,W,H); else { const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#8ee3ff'); g.addColorStop(1,'#4e83c3'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); }
    for(const c of (clouds||[])){ ctx.globalAlpha=.12; ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(c.x,c.y,c.r,0,7); ctx.fill(); c.x+=c.s; if(c.x>W+70)c.x=-70; } ctx.globalAlpha=1;
    for(const l of lanes){ ctx.save(); ctx.translate(l.x,l.y); ctx.rotate(l.a); const gr=ctx.createLinearGradient(-l.w/2,0,l.w/2,0); gr.addColorStop(0,'rgba(255,218,98,0)'); gr.addColorStop(.5,'rgba(255,218,98,.34)'); gr.addColorStop(1,'rgba(255,218,98,0)'); ctx.fillStyle=gr; roundRect(-l.w/2,-l.h/2,l.w,l.h,40); ctx.fill(); ctx.fillStyle='rgba(255,247,198,.8)'; for(let x=-l.w/2+35;x<l.w/2;x+=70){ ctx.beginPath(); ctx.moveTo(x,-13); ctx.lineTo(x+26,0); ctx.lineTo(x,13); ctx.fill(); } ctx.restore(); }
    drawDepot(); for(const t of (route||[])) drawTower(t); for(const r of (rings||[])) drawRing(r); for(const h of (hazards||[])) drawHazard(h); drawArrow(); drawCourier(); requestAnimationFrame(draw);
  }
  function roundRect(x,y,w,h,r){ ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x,y,w,h,r) : ctx.rect(x,y,w,h); }
  function drawDepot(){ ctx.fillStyle='rgba(255,245,206,.85)'; ctx.beginPath(); ctx.arc(W/2,H/2,58,0,7); ctx.fill(); ctx.strokeStyle='#ad7b27'; ctx.lineWidth=5; ctx.stroke(); ctx.fillStyle='#5e3a18'; ctx.font='900 22px system-ui'; ctx.textAlign='center'; ctx.fillText('DEPOT',W/2,H/2+7); }
  function drawTower(t){ const active = route && t === currentTower(); ctx.save(); ctx.translate(t.x,t.y); ctx.fillStyle=active?'#ffe775':'#f8f0cf'; ctx.beginPath(); ctx.arc(0,0,42,0,7); ctx.fill(); ctx.strokeStyle=active?'#ff9e23':'#9f7330'; ctx.lineWidth=active?7:4; ctx.stroke(); ctx.fillStyle='#82521d'; ctx.fillRect(-16,-18,32,39); ctx.fillStyle='#fff6c9'; ctx.fillRect(-8,-8,16,10); ctx.fillStyle='#1d3555'; ctx.font='900 25px system-ui'; ctx.textAlign='center'; ctx.fillText(t.num,0,9); if(t.done){ ctx.fillStyle='rgba(44,156,87,.85)'; ctx.beginPath(); ctx.arc(25,-25,15,0,7); ctx.fill(); ctx.fillStyle='white'; ctx.fillText('✓',25,-17); } ctx.restore(); }
  function drawRing(r){ ctx.save(); ctx.translate(r.x,r.y); ctx.rotate(r.pulse*.25); ctx.strokeStyle='#ffdb63'; ctx.lineWidth=7; ctx.beginPath(); ctx.arc(0,0,r.r+Math.sin(r.pulse)*3,0,7); ctx.stroke(); ctx.strokeStyle='rgba(255,255,255,.8)'; ctx.lineWidth=2; ctx.stroke(); ctx.restore(); }
  function drawHazard(h){ ctx.save(); ctx.translate(h.x,h.y); ctx.rotate(h.spin); ctx.fillStyle=h.gear?'rgba(77,55,75,.86)':'rgba(74,37,91,.72)'; ctx.beginPath(); for(let i=0;i<10;i++){ const a=i/10*7, rr=h.r*(i%2?0.65:1.1); ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr); } ctx.closePath(); ctx.fill(); ctx.strokeStyle='rgba(255,218,98,.45)'; ctx.stroke(); ctx.restore(); }
  function drawArrow(){ const t=currentTower(); if(!t||state!=='play')return; const a=Math.atan2(t.y-courier.y,t.x-courier.x); ctx.save(); ctx.translate(courier.x+Math.cos(a)*62,courier.y+Math.sin(a)*62); ctx.rotate(a); ctx.fillStyle='#fff3a7'; ctx.strokeStyle='#7d4b0d'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(24,0); ctx.lineTo(-12,-13); ctx.lineTo(-6,0); ctx.lineTo(-12,13); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
  function drawCourier(){ if(!courier)return; ctx.save(); ctx.translate(courier.x,courier.y); ctx.rotate(courier.a); if(assets.courier.complete) ctx.drawImage(assets.courier,-40,-40,80,80); else { ctx.fillStyle='#c88d2d'; ctx.beginPath(); ctx.moveTo(0,-34);ctx.lineTo(38,20);ctx.lineTo(0,8);ctx.lineTo(-38,20);ctx.closePath();ctx.fill(); ctx.fillStyle='#c82030';ctx.fillRect(-11,4,22,19); } ctx.restore(); }
  function pointerPos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H}; }
  document.querySelectorAll('.card').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.diff))); $('startBtn').onclick=()=>reset(false); $('pauseBtn').onclick=pauseGame; $('resumeBtn').onclick=pauseGame; $('restartQuick').onclick=()=>reset(false); $('restartPauseBtn').onclick=()=>reset(false); $('restartOverBtn').onclick=()=>reset(false); $('selectDiffBtn').onclick=()=>setState('title'); $('overtimeBtn').onclick=()=>{ overtime++; reset(true); }; $('boostBtn').onpointerdown=()=>{boostHeld=true;$('boostBtn').classList.add('held')}; window.addEventListener('pointerup',()=>{boostHeld=false;$('boostBtn').classList.remove('held')}); canvas.addEventListener('pointerdown',e=>{pointer=pointerPos(e)}); canvas.addEventListener('pointermove',e=>{if(e.buttons||e.pointerType==='touch')pointer=pointerPos(e)}); canvas.addEventListener('pointerup',()=>pointer=null); window.addEventListener('keydown',e=>{ keys[e.code]=true; if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault(); if(e.code==='Digit1')choose('easy'); if(e.code==='Digit2')choose('busy'); if(e.code==='Digit3')choose('rush'); if(e.code==='Enter'&&state==='title')reset(false); if(e.code==='KeyP')pauseGame(); if(e.code==='KeyR')reset(false); }); window.addEventListener('keyup',e=>{keys[e.code]=false});
  function loop(ts){ const dt=Math.min(.033,(ts-last)/1000||0); last=ts; update(dt); requestAnimationFrame(loop); }
  choose('easy'); updateHud(); requestAnimationFrame(loop); requestAnimationFrame(draw);
})();
