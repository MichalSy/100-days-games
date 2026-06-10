(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const DIRS = [[0,-1],[1,0],[0,1],[-1,0]];
  const OPP = [2,3,0,1];
  const SHAPES = {
    straight: [[0,2],[1,3]],
    corner: [[0,1],[1,2],[2,3],[3,0]],
    tee: [[0,1,3],[0,1,2],[1,2,3],[0,2,3]],
    cross: [[0,1,2,3],[0,1,2,3],[0,1,2,3],[0,1,2,3]],
    dead: [[0],[1],[2],[3]]
  };
  let state, tickId = 0;
  const els = {
    menu: $('menu'), play: $('play'), board: $('board'), pulse: $('pulse'), overlay: $('overlay'),
    sector: $('sector'), score: $('score'), timer: $('timer'), rotations: $('rotations'), streak: $('streak'), bestScore: $('bestScore'),
    overlayTitle: $('overlayTitle'), overlayText: $('overlayText'), launchBtn: $('launchBtn'), pauseBtn: $('pauseBtn')
  };
  function best(){ return Number(localStorage.getItem('lumenLanesBest') || 0); }
  function setBest(v){ if(v > best()) localStorage.setItem('lumenLanesBest', String(v)); els.bestScore.textContent = String(best()); }
  function rng(seed){ let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function newRun(){
    state = { sector:1, score:0, streak:1, rotations:0, status:'planning', paused:false, seed:1001, grid:[], size:5, time:45, maxTime:45, path:[] };
    els.menu.classList.remove('active'); els.play.classList.add('active'); hideOverlay(); makeSector(); startClock();
  }
  function makeSector(){
    const s = 4 + Math.min(2, Math.ceil(state.sector/2));
    state.size = s; state.maxTime = Math.max(23, 48 - state.sector * 5); state.time = state.maxTime; state.rotations = 0; state.status = 'planning';
    const random = rng(state.seed + state.sector * 997);
    const path = buildPath(s, random); state.path = path;
    const grid = Array.from({length:s*s}, (_, i) => ({i, type: random()>.74?'tee':(random()>.52?'corner':'straight'), rot: Math.floor(random()*4), locked:false, connected:false}));
    for(let p=0;p<path.length;p++){
      const idx = path[p]; const prev = path[p-1]; const next = path[p+1]; const exits=[];
      if(prev !== undefined) exits.push(dirBetween(idx, prev, s));
      if(next !== undefined) exits.push(dirBetween(idx, next, s));
      const tile = tileForExits(exits);
      const locked = p>0 && p<path.length-1 && state.sector>=3 && random()<.18;
      if (!locked && p>0) tile.rot = (tile.rot + 1 + Math.floor(random()*3)) % 4;
      grid[idx] = {...grid[idx], ...tile, locked};
    }
    grid[path[0]].start = true; grid[path[path.length-1]].exit = true;
    state.grid = grid; render(); updateHud();
  }
  function buildPath(s, random){
    const start = Math.floor(random()*s); let x=0,y=start; const path=[y*s+x]; const seen=new Set(path);
    while(x < s-1){
      const options=[]; if(x<s-1) options.push([x+1,y]); if(y>0) options.push([x,y-1]); if(y<s-1) options.push([x,y+1]);
      let next = options.filter(([nx,ny])=>!seen.has(ny*s+nx));
      if(!next.length) next=[[x+1,y]];
      const bias = random()<.56 ? next.find(([nx])=>nx>x) : null;
      const [nx,ny] = bias || next[Math.floor(random()*next.length)]; x=nx; y=ny; const idx=y*s+x; if(!seen.has(idx)){path.push(idx); seen.add(idx);} 
      if(path.length > s*s-2) break;
    }
    return path;
  }
  function dirBetween(a,b,s){ const ax=a%s, ay=Math.floor(a/s), bx=b%s, by=Math.floor(b/s); if(by<ay)return 0; if(bx>ax)return 1; if(by>ay)return 2; return 3; }
  function tileForExits(exits){
    const sorted=[...exits].sort().join('');
    if(sorted==='02') return {type:'straight',rot:0}; if(sorted==='13') return {type:'straight',rot:1};
    const corners = ['01','12','23','03']; const ci=corners.indexOf(sorted); if(ci>=0) return {type:'corner',rot:ci};
    return {type:'cross',rot:0};
  }
  function exits(tile){ return SHAPES[tile.type][tile.rot % SHAPES[tile.type].length]; }
  function render(){
    els.board.style.gridTemplateColumns = `repeat(${state.size}, 1fr)`; els.board.innerHTML='';
    markConnected();
    state.grid.forEach((tile) => {
      const b = document.createElement('button'); b.type='button'; b.className = `tile ${tile.type} r${tile.rot%4} ${tile.type==='straight' ? (tile.rot%2?'ew':'ns') : ''} ${tile.locked?'locked':''} ${tile.connected?'connected':''} ${tile.start?'start':''} ${tile.exit?'exit':''}`;
      b.setAttribute('role','gridcell'); b.setAttribute('aria-label', `${tile.locked?'Locked ':''}${tile.start?'start ':tile.exit?'beacon ':''}${tile.type} lane, tap to rotate`);
      if(tile.start || tile.exit){ const n=document.createElement('span'); n.className='node'; b.appendChild(n); }
      b.addEventListener('click', () => rotate(tile.i)); els.board.appendChild(b);
    });
  }
  function rotate(i){ if(state.status!=='planning' || state.paused) return; const t=state.grid[i]; if(t.locked) return; t.rot=(t.rot+1)%4; state.rotations++; render(); updateHud(); }
  function markConnected(){ state.grid.forEach(t=>t.connected=false); const start=state.path[0]; const q=[start]; state.grid[start].connected=true;
    while(q.length){ const i=q.shift(), t=state.grid[i]; for(const d of exits(t)){ const [dx,dy]=DIRS[d]; const nx=i%state.size+dx, ny=Math.floor(i/state.size)+dy; if(nx<0||ny<0||nx>=state.size||ny>=state.size) continue; const ni=ny*state.size+nx, nt=state.grid[ni]; if(exits(nt).includes(OPP[d])&&!nt.connected){nt.connected=true;q.push(ni);} }} }
  function route(){
    const start=state.path[0], goal=state.path[state.path.length-1], visited=new Set([start]); let i=start, prev=-1, safety=0, order=[start];
    while(i!==goal && safety++<state.size*state.size){ const nexts=exits(state.grid[i]).map(d=>{const [dx,dy]=DIRS[d]; const nx=i%state.size+dx, ny=Math.floor(i/state.size)+dy; return nx<0||ny<0||nx>=state.size||ny>=state.size ? -1 : ny*state.size+nx;}).filter(ni=>ni>=0&&ni!==prev&&exits(state.grid[ni]).includes(OPP[dirBetween(i,ni,state.size)]));
      const ni=nexts.find(n=>!visited.has(n)) ?? nexts[0]; if(ni===undefined || visited.has(ni)) return {ok:false, order}; prev=i; i=ni; visited.add(i); order.push(i); }
    return {ok:i===goal, order};
  }
  function launch(){ if(state.status!=='planning' || state.paused) return; state.status='launching'; els.launchBtn.disabled=true; const r=route(); animate(r.order, () => r.ok ? winSector() : lose('The pulse hit a dead end.')); }
  function animate(order, done){ let k=0; els.pulse.style.opacity='1'; const step=()=>{ const tile=els.board.children[order[k]]; const br=els.board.getBoundingClientRect(), tr=tile.getBoundingClientRect(); els.pulse.style.left=(tr.left-br.left+tr.width/2-10+10)+'px'; els.pulse.style.top=(tr.top-br.top+tr.height/2-10+10)+'px'; if(++k<order.length) setTimeout(step,160); else setTimeout(()=>{els.pulse.style.opacity='0';done();},220);}; step(); }
  function winSector(){ const efficiency=Math.max(0, 18-state.rotations)*15; const gained=Math.round((500 + state.time*20 + efficiency) * state.streak); state.score+=gained; state.streak+=.25; if(state.sector>=5){ setBest(state.score); showOverlay('Run complete!', `Five sectors cleared. Final score ${state.score}. Best score ${best()}.`, true, 'win'); state.status='ended'; stopClock(); } else { state.sector++; showOverlay('Sector clear', `+${gained} points. Next sector is denser and faster.`, true, 'win'); setTimeout(()=>{ if(state.status!=='ended'){ hideOverlay(); makeSector(); }}, 900); } updateHud(); }
  function lose(msg){ state.status='ended'; stopClock(); state.streak=1; showOverlay('Run failed', `${msg} Score ${state.score}. Restart to try the same deterministic run again.`, true, 'lose'); updateHud(); }
  function startClock(){ stopClock(); tickId=setInterval(()=>{ if(!state || state.paused || state.status!=='planning') return; state.time=Math.max(0,state.time-.1); if(state.time<=0) lose('The sector timer reached zero.'); updateHud(); },100); }
  function stopClock(){ if(tickId) clearInterval(tickId); tickId=0; }
  function updateHud(){ els.sector.textContent=`${state.sector}/5`; els.score.textContent=String(state.score); els.timer.textContent=state.time.toFixed(1); els.rotations.textContent=String(state.rotations); els.streak.textContent=`x${state.streak.toFixed(2)}`; els.launchBtn.disabled=state.status!=='planning'; }
  function showOverlay(title,text,buttons=true,klass=''){ els.overlayTitle.textContent=title; els.overlayTitle.className=klass; els.overlayText.textContent=text; els.overlay.classList.add('active'); els.overlay.classList.remove('show-help'); $('resumeBtn').style.display = buttons && state.status!=='ended' ? '' : 'none'; }
  function hideOverlay(){ els.overlay.classList.remove('active','show-help'); if(state) state.paused=false; }
  function pause(help=false){ if(!state || state.status==='ended') return; state.paused=true; showOverlay(help?'Help':'Paused', help?'Use the controls below when ready.':'Planning is frozen while paused.', true); if(help) els.overlay.classList.add('show-help'); }
  function toMenu(){ stopClock(); els.play.classList.remove('active'); els.menu.classList.add('active'); els.overlay.classList.remove('active'); }
  $('startBtn').onclick=newRun; $('launchBtn').onclick=launch; $('pauseBtn').onclick=()=>pause(false); $('helpBtn').onclick=()=>pause(true); $('restartBtn').onclick=newRun; $('resumeBtn').onclick=hideOverlay; $('overlayRestartBtn').onclick=newRun; $('menuBtn').onclick=toMenu;
  document.addEventListener('keydown', e => { if(e.target && ['BUTTON','A','SUMMARY'].includes(e.target.tagName)) return; if(e.code==='Space'){e.preventDefault();launch();} if(e.key.toLowerCase()==='p') state?.paused?hideOverlay():pause(false); if(e.key.toLowerCase()==='r') newRun(); if(e.key.toLowerCase()==='h') pause(true); });
  els.bestScore.textContent=String(best());
})();
