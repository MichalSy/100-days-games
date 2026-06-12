import * as THREE from './three.module.js';

const DAY_SEED = 3003;
const canvas = document.getElementById('gameCanvas');
const ui = {
  score: document.getElementById('score'), best: document.getElementById('best'), heat: document.getElementById('heat'), hull: document.getElementById('hull'),
  combo: document.getElementById('combo'), phase: document.getElementById('phase'), sap: document.getElementById('sap'), focus: document.getElementById('focus'),
  overlay: document.getElementById('overlay'), start: document.getElementById('startBtn'), pause: document.getElementById('pauseBtn'), restart: document.getElementById('restartBtn'),
  focusBtn: document.getElementById('focusBtn'), upgrades: document.getElementById('upgrades'), bloom: document.getElementById('bloom'), record: document.getElementById('recordLine')
};
const storeKey = 'day003-neon-bonsai-skyforge';
const records = JSON.parse(localStorage.getItem(storeKey) || '{"best":0,"bloom":null,"upgrades":0}');
ui.best.textContent = records.best || 0;
ui.record.textContent = `Best score ${records.best || 0} · best bloom ${records.bloom ? records.bloom + 's' : '—'}`;

let seed = DAY_SEED; const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x090824, 0.018);
const camera = new THREE.PerspectiveCamera(64, 1, 0.1, 520);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8)); renderer.shadowMap.enabled = true;
const loader = new THREE.TextureLoader();
const assetUrl = (name) => new URL(`./assets/${name}`, import.meta.url).href;
const bgTex = loader.load(assetUrl('neon-bonsai-sky.png')); bgTex.colorSpace = THREE.SRGBColorSpace;
const droneTex = loader.load(assetUrl('forge-drone.png')); droneTex.colorSpace = THREE.SRGBColorSpace;

const bg = new THREE.Mesh(new THREE.PlaneGeometry(92, 138), new THREE.MeshBasicMaterial({ map: bgTex, transparent: true, opacity: .46, depthWrite: false }));
bg.position.set(0, 14, -70); scene.add(bg);
scene.add(new THREE.AmbientLight(0x99ccff, 1.3));
const key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(8,12,6); scene.add(key);
const coreLight = new THREE.PointLight(0xff72df, 4, 90); coreLight.position.set(0,0,-18); scene.add(coreLight);

const player = new THREE.Group();
const body = new THREE.Mesh(new THREE.SphereGeometry(.72, 32, 24), new THREE.MeshPhysicalMaterial({ color: 0x9dfbff, emissive: 0x1078aa, roughness: .18, metalness: .1, transmission: .25, transparent: true, opacity: .9 }));
const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: droneTex, transparent: true, depthTest: true })); sprite.scale.set(1.7,1.7,1);
player.add(body, sprite); scene.add(player);

const route = new THREE.Group(); scene.add(route);
const guideMat = new THREE.LineBasicMaterial({ color: 0x4affff, transparent: true, opacity: .45 });
for (let x of [-4,0,4]) { const pts=[]; for(let z=-10; z>-430; z-=12) pts.push(new THREE.Vector3(x, -3.2, z)); route.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), guideMat)); }

const ringMats = { gold: new THREE.MeshBasicMaterial({color:0xffd86b}), green: new THREE.MeshBasicMaterial({color:0x68ffad}) };
const sapMats = { root: new THREE.MeshBasicMaterial({color:0xff4f64}), branch: new THREE.MeshBasicMaterial({color:0x56a7ff}), blossom: new THREE.MeshBasicMaterial({color:0xff72df}) };
const hazardMat = new THREE.MeshStandardMaterial({ color:0xff6b3d, emissive:0x5c1304, roughness:.45 });
const thornMat = new THREE.MeshStandardMaterial({ color:0x36154a, emissive:0x24002f });
let objects = [];
function phaseName(t){ return t < 35 ? 'Root Spiral' : t < 85 ? 'Branch Weave' : 'Blossom Gate'; }
function pathAt(z){ const t = Math.abs(z)*.025; return { x: Math.sin(t*.9)*3.1 + Math.sin(t*2.1)*.9, y: Math.cos(t*.7)*1.7 + Math.sin(t*1.3)*.8 }; }
function addGlow(mesh, color, scale=1.18){ const clone = mesh.clone(); clone.material = new THREE.MeshBasicMaterial({color, transparent:true, opacity:.16, side:THREE.BackSide}); clone.scale.multiplyScalar(scale); mesh.add(clone); }
function makeRing(z, type){ const p=pathAt(z); const geom=new THREE.TorusGeometry(2.45, .11, 12, 64); const m=new THREE.Mesh(geom, ringMats[type]); m.position.set(p.x, p.y, z); m.rotation.y = Math.sin(z*.04)*.25; addGlow(m, type==='green'?0x68ffad:0xffd86b,1.08); route.add(m); objects.push({kind:'ring', type, mesh:m, z, hit:false, r:2.35}); }
function makeSap(z, type, off){ const p=pathAt(z); const m=new THREE.Mesh(new THREE.IcosahedronGeometry(.38,1), sapMats[type]); m.position.set(p.x+off[0], p.y+off[1], z+off[2]); addGlow(m, sapMats[type].color,1.45); route.add(m); objects.push({kind:'sap', type, mesh:m, z, hit:false, r:.8}); }
function makeHazard(z, i){ const p=pathAt(z); const m=new THREE.Group(); const lantern=new THREE.Mesh(new THREE.OctahedronGeometry(.75,0), hazardMat); const thorn=new THREE.Mesh(new THREE.ConeGeometry(.22,1.3,7), thornMat); thorn.position.y=.15; thorn.rotation.x=Math.PI; m.add(lantern, thorn); m.position.set(p.x+(i%2?3.2:-3.2)+Math.sin(z)*.6, p.y+Math.cos(z*.07)*1.4, z); route.add(m); objects.push({kind:'hazard', mesh:m, z, hit:false, r:1.05}); }
function makeCore(z){ const p=pathAt(z); const m=new THREE.Group(); const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.28,.5,2.4,8), new THREE.MeshStandardMaterial({color:0x5d2f20, emissive:0x41110b})); const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.7,2), new THREE.MeshBasicMaterial({color:0xff62d4, transparent:true, opacity:.62})); crown.position.y=1.5; m.add(trunk,crown); m.position.set(p.x,p.y-1,z); route.add(m); objects.push({kind:'core', mesh:m, z, hit:false, r:3.2}); }
function buildRoute(){ seed=DAY_SEED; objects.forEach(o=>route.remove(o.mesh)); objects=[]; for(let i=1;i<90;i++){ const z=-14-i*8; makeRing(z, i%4===0?'green':'gold'); const types=['root','branch','blossom']; if(i%2===0) makeSap(z-3, types[i%3], [(rand()-.5)*4,(rand()-.5)*2,0]); if(i>8 && i%5===0) makeHazard(z-5,i); if(i%18===0) makeCore(z-8); } }
buildRoute();

let state='menu', clock=new THREE.Clock(), elapsed=0, routeZ=0, speed=9, score=0, heat=8, hull=3, combo=1, clean=0, focus=100, bloom=false, checkpoint=false;
let sap={root:0,branch:0,blossom:0}, upgrades={root:false,branch:false,blossom:false}, mastery={streak:false,nocrash:true,score3600:false};
let target = new THREE.Vector2(0,0), keys = new Set(), pointer=false;
function resize(){ const w=innerWidth,h=innerHeight; renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
function updateHUD(){ ui.score.textContent=Math.floor(score); ui.best.textContent=Math.max(records.best||0,Math.floor(score)); ui.heat.value=heat; ui.hull.textContent='✿'.repeat(Math.max(0,hull)) || '—'; ui.combo.textContent=combo+'x'; ui.phase.textContent=phaseName(elapsed); ui.sap.textContent=`R${sap.root} B${sap.branch} P${sap.blossom}`; ui.focus.value=focus; }
function start(){ state='play'; ui.overlay.classList.add('hidden'); reset(); }
function reset(){ elapsed=0; routeZ=0; speed=9; score=0; heat=8; hull=3; combo=1; clean=0; focus=100; bloom=false; checkpoint=false; target.set(0,0); sap={root:0,branch:0,blossom:0}; upgrades={root:false,branch:false,blossom:false}; mastery={streak:false,nocrash:true,score3600:false}; buildRoute(); ui.upgrades.classList.add('hidden'); ui.bloom.classList.add('hidden'); updateHUD(); }
function showOverlay(title, text){ state='menu'; ui.overlay.classList.remove('hidden'); ui.overlay.querySelector('h1').textContent=title; ui.overlay.querySelector('.lede').textContent=text; ui.start.textContent='Start again'; ui.record.textContent=`Final ${Math.floor(score)} · best ${records.best||0} · upgrades ${Object.values(upgrades).filter(Boolean).length}/3`; }
function pause(){ if(state==='play'){ state='pause'; ui.overlay.classList.remove('hidden'); ui.overlay.querySelector('h1').textContent='Paused'; ui.overlay.querySelector('.lede').textContent='Resume, restart, or review the compact tutorial. P also resumes.'; ui.start.textContent='Resume'; } else if(state==='pause'){ state='play'; ui.overlay.classList.add('hidden'); } }
function bank(which){ if(!checkpoint || upgrades[which]) return; const need = which==='root'?'root':which==='branch'?'branch':'blossom'; if(sap[need] < 2) return; sap[need]-=2; upgrades[which]=true; score+=250; checkpoint=false; ui.upgrades.classList.add('hidden'); if(which==='root') hull=Math.min(4,hull+1); }
function crash(){ if(upgrades.root){ upgrades.root=false; return; } hull--; heat+=10; combo=1; clean=0; mastery.nocrash=false; if(hull<=0) gameOver('Hull petals scattered'); }
function gameOver(reason){ records.best=Math.max(records.best||0,Math.floor(score)); records.upgrades=Math.max(records.upgrades||0,Object.values(upgrades).filter(Boolean).length); localStorage.setItem(storeKey,JSON.stringify(records)); showOverlay('Run complete', reason); }
function maybeBloom(){ if(!bloom && score>=2400 && Object.values(upgrades).every(Boolean)){ bloom=true; score+=800; records.bloom = records.bloom ? Math.min(records.bloom, Math.floor(elapsed)) : Math.floor(elapsed); ui.bloom.classList.remove('hidden'); setTimeout(()=>ui.bloom.classList.add('hidden'),2800); } }
function collect(o){ if(o.hit) return; o.hit=true; o.mesh.visible=false; if(o.kind==='ring'){ clean++; combo=Math.min(5, 1+Math.floor(clean/3)); if(clean>=12) mastery.streak=true; score += (o.type==='gold'?120:80)*combo*(upgrades.blossom?1.25:1); if(o.type==='green') heat=Math.max(0,heat-12); }
 if(o.kind==='sap'){ sap[o.type]++; score+=35*combo; clean++; }
 if(o.kind==='hazard') crash(); if(o.kind==='core'){ checkpoint=true; ui.upgrades.classList.remove('hidden'); } maybeBloom(); }
function steer(dt){ let dx=(keys.has('ArrowRight')||keys.has('d')?1:0)-(keys.has('ArrowLeft')||keys.has('a')?1:0); let dy=(keys.has('ArrowUp')||keys.has('w')?1:0)-(keys.has('ArrowDown')||keys.has('s')?1:0); if(dx||dy){ target.x += dx*dt*8; target.y += dy*dt*6; } target.x=THREE.MathUtils.clamp(target.x,-5.2,5.2); target.y=THREE.MathUtils.clamp(target.y,-3.2,4.3); const focusing = keys.has(' ')||keys.has('Shift')||ui.focusBtn.matches(':active'); const glide = focusing && focus>0; if(glide) focus=Math.max(0,focus-dt*35); else focus=Math.min(100,focus+dt*18); player.position.x += (target.x-player.position.x)*dt*(glide?3:6); player.position.y += (target.y-player.position.y)*dt*(glide?3:6); player.rotation.z = -(target.x-player.position.x)*.12; player.rotation.x = (target.y-player.position.y)*.08; }
function animate(){ requestAnimationFrame(animate); const dt=Math.min(.033,clock.getDelta()); if(state==='play'){ elapsed+=dt; speed=9+elapsed*.035+(bloom?elapsed*.02:0); routeZ += speed*dt; route.position.z=routeZ; const focusHeld = keys.has(' ') || keys.has('Shift') || ui.focusBtn.matches(':active'); heat += dt * (bloom ? 3.2 : 2.2) * (focusHeld && focus > 0 ? .6 : 1); steer(dt); for(const o of objects){ const worldZ=o.z+routeZ; if(worldZ>4 && !o.hit && o.kind==='ring'){ o.hit=true; heat+=7; combo=1; clean=0; } if(!o.hit && Math.abs(worldZ)<1.35){ const dx=o.mesh.position.x-player.position.x, dy=o.mesh.position.y-player.position.y; const dist=Math.hypot(dx,dy); if(o.kind==='ring' && dist<o.r) collect(o); else if(o.kind!=='ring' && dist<o.r) collect(o); } if(o.kind==='sap' && upgrades.branch && !o.hit && Math.abs(worldZ)<5){ o.mesh.position.x += (player.position.x-o.mesh.position.x)*dt*1.8; o.mesh.position.y += (player.position.y-o.mesh.position.y)*dt*1.8; } o.mesh.rotation.y += dt*(o.kind==='hazard'?1.8:.9); o.mesh.rotation.z += dt*.35; }
 if(heat>=100) gameOver('Forge heat reached 100%'); if(score>=3600) mastery.score3600=true; updateHUD(); }
 camera.position.set(player.position.x*.35, player.position.y+3.2, 8.5); camera.lookAt(player.position.x*.35, player.position.y*.3, -18); bg.position.z=-70+routeZ*.08; renderer.render(scene,camera); }
animate(); updateHUD();

addEventListener('keydown', e=>{ keys.add(e.key); if(e.key==='p'||e.key==='P') pause(); if(e.key==='r'||e.key==='R'){ reset(); state='play'; ui.overlay.classList.add('hidden'); } if(['1','2','3'].includes(e.key)) bank(e.key==='1'?'root':e.key==='2'?'branch':'blossom'); });
addEventListener('keyup', e=>keys.delete(e.key));
canvas.addEventListener('pointerdown', e=>{ pointer=true; canvas.setPointerCapture(e.pointerId); drag(e); });
canvas.addEventListener('pointermove', e=>{ if(pointer) drag(e); }); canvas.addEventListener('pointerup',()=>pointer=false);
function drag(e){ const r=canvas.getBoundingClientRect(); target.x=((e.clientX-r.left)/r.width-.5)*10.4; target.y=(.55-(e.clientY-r.top)/r.height)*7.5; }
ui.start.addEventListener('click',()=> state==='pause'?pause():start()); ui.pause.addEventListener('click',pause); ui.restart.addEventListener('click',()=>{ reset(); state='play'; ui.overlay.classList.add('hidden'); }); ui.upgrades.addEventListener('click',e=>{ const b=e.target.closest('button[data-upgrade]'); if(b) bank(b.dataset.upgrade); });
