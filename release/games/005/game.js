import * as THREE from './assets/three.module.min.js';

(() => {
  const canvas = document.getElementById('railCanvas');
  const $ = (id) => document.getElementById(id);
  const lanes = [-3.2, 0, 3.2];
  const laneNames = ['left', 'center', 'right'];
  const stationNames = ['Moon Platform', 'Paper Crane Bridge', 'Dawn Bell Loop'];
  const stationShort = ['Moon', 'Crane', 'Dawn Bell'];
  const stationDistances = [850, 1780, 2920];
  const bestKey = 'yume-railrunner-best-v1';
  const arrivalKey = 'yume-railrunner-arrival-v1';
  const streakKey = 'yume-railrunner-streak-v1';
  const loopKey = 'yume-railrunner-loop-v1';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const ui = ['score','best','hearts','combo','station','speed','bestTitle','arrivalTitle','streakTitle','loopTitle','finalScore','bestOver','finalStation','finalDawn','finalStreak','resultTitle']
    .reduce((acc, id) => (acc[id] = $(id), acc), {});
  const meters = { sleep: $('sleep'), bell: $('bell') };
  const title = $('titleScreen');
  const pauseOverlay = $('pauseOverlay');
  const resultsOverlay = $('resultsOverlay');
  const forkHint = $('forkHint');
  const dawnBanner = $('dawnBanner');
  const masteryList = $('masteryList');
  const gameWrap = document.querySelector('.game-wrap');

  let best = Number(localStorage.getItem(bestKey) || 0);
  let bestArrival = Number(localStorage.getItem(arrivalKey) || 0);
  let bestStreak = Number(localStorage.getItem(streakKey) || 0);
  let bestLoop = Number(localStorage.getItem(loopKey) || 0);
  let state = 'title';
  let seed = 5005;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const choice = (arr) => arr[Math.floor(rand() * arr.length)];

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x071022, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x071733, 0.021);
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 150);
  camera.position.set(0, 5.6, 10.5);
  camera.lookAt(0, 0.6, -24);

  const loader = new THREE.TextureLoader();
  const tramTexture = loader.load('./assets/lantern-tram.png');
  const skyTexture = loader.load('./assets/dream-rail-sky.png');
  tramTexture.colorSpace = THREE.SRGBColorSpace;
  skyTexture.colorSpace = THREE.SRGBColorSpace;
  skyTexture.minFilter = THREE.LinearFilter;

  const mats = {
    rail: new THREE.MeshStandardMaterial({ color: 0x3d2a20, roughness: .62, metalness: .25 }),
    railGlow: new THREE.MeshStandardMaterial({ color: 0xffd66b, emissive: 0xffb837, emissiveIntensity: .68, roughness: .28 }),
    sleeper: new THREE.MeshStandardMaterial({ color: 0x5a3421, roughness: .8 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xffd66b, emissive: 0xffaa2a, emissiveIntensity: .55, roughness: .22, metalness: .35 }),
    star: new THREE.MeshStandardMaterial({ color: 0xcff4ff, emissive: 0x8ddfff, emissiveIntensity: .9, roughness: .2 }),
    moon: new THREE.MeshStandardMaterial({ color: 0x9edbff, emissive: 0x3388ff, emissiveIntensity: .78, roughness: .22, transparent: true, opacity: .92 }),
    gateGold: new THREE.MeshStandardMaterial({ color: 0xffdf72, emissive: 0xffbc37, emissiveIntensity: .92, roughness: .22 }),
    danger: new THREE.MeshStandardMaterial({ color: 0x1a0b20, emissive: 0x8e1d87, emissiveIntensity: .76, roughness: .7 }),
    safe: new THREE.MeshStandardMaterial({ color: 0x7dffe3, emissive: 0x30ffc7, emissiveIntensity: 1.2, transparent: true, opacity: .75 }),
    tram: new THREE.MeshStandardMaterial({ color: 0x8f2f1a, emissive: 0xff872e, emissiveIntensity: .22, roughness: .4, metalness: .25 })
  };

  scene.add(new THREE.HemisphereLight(0xc6e9ff, 0x160815, 1.6));
  const moonLight = new THREE.DirectionalLight(0xffe6ac, 1.55);
  moonLight.position.set(-5, 9, 6);
  moonLight.castShadow = true;
  scene.add(moonLight);
  const bellLight = new THREE.PointLight(0xffd66b, 1.8, 20);
  bellLight.position.set(0, 2.6, 3.8);
  scene.add(bellLight);

  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(58, 88),
    new THREE.MeshBasicMaterial({ map: skyTexture, color: 0xffffff, depthWrite: false })
  );
  sky.position.set(0, 15, -80);
  scene.add(sky);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(32, 125),
    new THREE.MeshStandardMaterial({ color: 0x071026, roughness: .9, metalness: 0, transparent: true, opacity: .62 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.08;
  floor.position.z = -31;
  scene.add(floor);

  const railSegments = [];
  const sleeperGeom = new THREE.BoxGeometry(1.28, .08, .2);
  const barGeom = new THREE.BoxGeometry(.08, .08, 2.15);
  for (let i = 0; i < 48; i++) {
    const group = new THREE.Group();
    group.position.z = -88 + i * 2.25;
    for (const lx of lanes) {
      const sleeper = new THREE.Mesh(sleeperGeom, mats.sleeper);
      sleeper.position.set(lx, 0, 0);
      group.add(sleeper);
      const left = new THREE.Mesh(barGeom, mats.rail);
      left.position.set(lx - .48, .09, 0);
      const right = new THREE.Mesh(barGeom, mats.rail);
      right.position.set(lx + .48, .09, 0);
      group.add(left, right);
    }
    railSegments.push(group);
    scene.add(group);
  }

  const stars = [];
  const starGeom = new THREE.OctahedronGeometry(.05, 0);
  for (let i = 0; i < 115; i++) {
    const s = new THREE.Mesh(starGeom, mats.star);
    s.position.set((rand() - .5) * 34, 4 + rand() * 23, -8 - rand() * 92);
    s.scale.setScalar(.8 + rand() * 2.2);
    stars.push(s);
    scene.add(s);
  }

  const tram = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.12, .42, 1.55), mats.tram);
  body.castShadow = true;
  body.position.y = .36;
  tram.add(body);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(.82, .62, .82), new THREE.MeshStandardMaterial({ color: 0xffd898, emissive: 0xffb14b, emissiveIntensity: .55, roughness: .35 }));
  cabin.position.set(0, .88, .08);
  tram.add(cabin);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(.24, .62, 4), mats.gateGold);
  nose.rotation.x = -Math.PI / 2;
  nose.position.set(0, .48, -1.02);
  tram.add(nose);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tramTexture, transparent: true, alphaTest: .08, depthWrite: false }));
  sprite.scale.set(1.65, 1.65, 1);
  sprite.position.set(0, 1.15, .34);
  tram.add(sprite);
  const tramGlow = new THREE.PointLight(0xffc65a, 1.9, 7);
  tramGlow.position.set(0, 1.1, .2);
  tram.add(tramGlow);
  tram.position.set(0, 1.15, 4.2);
  tram.scale.setScalar(0.68);
  scene.add(tram);

  const events = [];
  const particles = [];
  let targetLane = 1, lanePos = 1;
  let score = 0, hearts = 3, sleep = 100, combo = 0, cleanStreak = 0, maxRunStreak = 0, bell = 0;
  let station = 0, runTime = 0, distance = 0, spawnClock = 0, invuln = 0, drainBoost = 0, bellTime = 0, dawn = false, dawnTime = 0, endlessLoop = 0;
  let phaseHits = 0, phaseMisses = 0, nextPattern = 0;
  let keyDown = {};
  let touchStart = null;
  let last = 0;

  function setState(next) {
    state = next;
    title.classList.toggle('hidden', next !== 'title');
    pauseOverlay.classList.toggle('hidden', next !== 'pause');
    resultsOverlay.classList.toggle('hidden', next !== 'results');
  }

  function reset() {
    for (const e of events.splice(0)) scene.remove(e.group);
    for (const p of particles.splice(0)) scene.remove(p.mesh);
    seed = 5005;
    score = 0; hearts = 3; sleep = 100; combo = 0; cleanStreak = 0; maxRunStreak = 0; bell = 0;
    station = 0; runTime = 0; distance = 0; spawnClock = .35; invuln = 0; drainBoost = 0; bellTime = 0; dawn = false; dawnTime = 0; endlessLoop = 0;
    phaseHits = 0; phaseMisses = 0; targetLane = 1; lanePos = 1; nextPattern = 0;
    tram.position.x = lanes[1];
    dawnBanner.classList.add('hidden');
    forkHint.classList.add('hidden');
    setState('play');
    updateHud();
  }

  function currentBaseSpeed() {
    const phase = dawn ? 3 + endlessLoop : station;
    return 9.2 + phase * 1.16 + Math.min(2.5, runTime / 75);
  }
  function effectiveSpeed() { return currentBaseSpeed() * (bellTime > 0 ? .46 : 1); }

  function eventLane(preferredSafe = false) {
    if (preferredSafe && rand() < .68) return targetLane;
    return Math.floor(rand() * 3);
  }

  function spawnNextEvent() {
    const phase = dawn ? 3 + endlessLoop : station;
    const pattern = nextPattern++;
    const roll = rand();
    if (pattern % (phase >= 2 ? 7 : 9) === 4) return makeFork();
    if (roll < .24) return makeGate(eventLane(true));
    if (roll < .48) return makeTicket(eventLane(true), rand() < .18 + phase * .02);
    if (roll < .72) return makeHazard(eventLane(false), rand() < .42);
    return makeTicket(eventLane(false), rand() < .28);
  }

  function addLabel(text, color = '#fff3b0') {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 96;
    const cx = c.getContext('2d');
    cx.clearRect(0, 0, c.width, c.height);
    cx.font = '900 34px system-ui, sans-serif';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.lineWidth = 8; cx.strokeStyle = 'rgba(2,5,12,.88)';
    cx.strokeText(text, 128, 48);
    cx.fillStyle = color;
    cx.fillText(text, 128, 48);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sp = new THREE.Sprite(mat);
    sp.scale.set(2.6, .96, 1);
    return sp;
  }

  function makeTicket(lane, star = false) {
    const group = new THREE.Group();
    group.position.set(lanes[lane], star ? 1.15 : .88, -78);
    const mesh = new THREE.Mesh(star ? new THREE.OctahedronGeometry(.42, 0) : new THREE.BoxGeometry(.72, .42, .06), star ? mats.star : mats.gold);
    mesh.rotation.z = star ? .7 : .14;
    mesh.castShadow = true;
    group.add(mesh);
    const label = addLabel(star ? 'STAR' : 'TICKET', star ? '#c6f4ff' : '#ffe6a2');
    label.position.set(0, .72, 0);
    group.add(label);
    scene.add(group);
    events.push({ type: star ? 'star' : 'ticket', lane, group, z: -78, passed: false, spin: rand() * 6 });
  }

  function makeHazard(lane, moth = false) {
    const group = new THREE.Group();
    group.position.set(lanes[lane], .38, -78);
    if (moth) {
      const body = new THREE.Mesh(new THREE.SphereGeometry(.22, 12, 8), mats.danger);
      const wingGeom = new THREE.ConeGeometry(.34, .72, 3);
      const w1 = new THREE.Mesh(wingGeom, mats.danger); w1.rotation.set(0, 0, .86); w1.position.set(-.32, .08, 0);
      const w2 = new THREE.Mesh(wingGeom, mats.danger); w2.rotation.set(0, 0, -.86); w2.position.set(.32, .08, 0);
      group.add(body, w1, w2);
      const label = addLabel('MOTH', '#ff8bcc'); label.position.set(0, .9, 0); group.add(label);
    } else {
      const cracked = new THREE.Mesh(new THREE.BoxGeometry(1.25, .1, 1.45), mats.danger);
      cracked.position.y = -.05;
      group.add(cracked);
      for (let i = 0; i < 5; i++) {
        const crack = new THREE.Mesh(new THREE.BoxGeometry(.08, .08, .76), mats.moon);
        crack.position.set((rand() - .5) * .8, .08, (rand() - .5) * .9);
        crack.rotation.y = (rand() - .5) * 1.7;
        group.add(crack);
      }
      const label = addLabel('CRACK', '#ff8bcc'); label.position.set(0, .85, 0); group.add(label);
    }
    scene.add(group);
    events.push({ type: 'hazard', lane, group, z: -78, passed: false, moth, spin: rand() * 6 });
  }

  function makeGate(lane) {
    const group = new THREE.Group();
    group.position.z = -82;
    for (let i = 0; i < 3; i++) {
      const arch = new THREE.Group();
      arch.position.x = lanes[i];
      const open = i === lane;
      const mat = open ? mats.gateGold : mats.danger;
      const torus = new THREE.Mesh(new THREE.TorusGeometry(.72, .07, 12, 44, Math.PI), mat);
      torus.rotation.z = Math.PI;
      torus.position.y = 1.75;
      const l = new THREE.Mesh(new THREE.BoxGeometry(.12, 1.45, .12), mat); l.position.set(-.72, .78, 0);
      const r = new THREE.Mesh(new THREE.BoxGeometry(.12, 1.45, .12), mat); r.position.set(.72, .78, 0);
      arch.add(torus, l, r);
      const lab = addLabel(open ? 'MOON' : 'CLOSED', open ? '#fff0ad' : '#ff8bcc');
      lab.position.set(0, 2.65, 0); arch.add(lab);
      group.add(arch);
    }
    scene.add(group);
    events.push({ type: 'gate', lane, group, z: -82, passed: false, spin: 0 });
  }

  function makeFork() {
    const safeLane = Math.floor(rand() * 3);
    const group = new THREE.Group();
    group.position.z = -84;
    for (let i = 0; i < 3; i++) {
      const mat = i === safeLane ? mats.safe : mats.danger;
      const rail = new THREE.Mesh(new THREE.BoxGeometry(1.5, .1, 3.2), mat);
      rail.position.set(lanes[i], .08, 0);
      group.add(rail);
      const label = addLabel(i === safeLane ? 'SAFE' : 'NO', i === safeLane ? '#98ffe8' : '#ff8bcc');
      label.position.set(lanes[i], 1.05, 0);
      group.add(label);
    }
    scene.add(group);
    events.push({ type: 'fork', lane: safeLane, group, z: -84, passed: false, spin: 0 });
  }

  function changeLane(dir) {
    if (state === 'title' && dir === 0) return reset();
    if (state !== 'play') return;
    targetLane = clamp(targetLane + dir, 0, 2);
  }

  function useBell() {
    if (state !== 'play' || bell < 100) return;
    bell = 0;
    bellTime = 4.2;
    for (let i = 0; i < 34; i++) spawnParticle(lanes[targetLane], .8, 3.8, i / 34 * Math.PI * 2, 2.2 + rand() * 2, 0x9edbff);
  }

  function spawnParticle(x, y, z, angle, force, color) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(.045 + rand() * .045, 8, 6), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .95 }));
    mesh.position.set(x, y, z);
    scene.add(mesh);
    particles.push({ mesh, vx: Math.cos(angle) * force, vy: Math.sin(angle) * force * .55 + rand() * 1.6, vz: -rand() * force, life: .7 + rand() * .75, max: 1.2 });
  }

  function hitDamage(reason = 'collision') {
    if (invuln > 0) return;
    hearts -= 1; combo = 0; phaseHits++; invuln = 1.45;
    sleep = clamp(sleep - (reason === 'fork' ? 8 : 4), 0, 100);
    for (let i = 0; i < 22; i++) spawnParticle(lanes[targetLane], .65, 4.2, rand() * Math.PI * 2, 1.2 + rand() * 3.3, 0xff5f97);
    if (hearts <= 0) finish('hearts');
  }

  function missGate() {
    combo = 0; phaseMisses++; drainBoost = 5;
    sleep = clamp(sleep - 7, 0, 100);
  }

  function collectEvent(e) {
    if (e.type === 'ticket') { score += 45; bell = clamp(bell + 4, 0, 100); }
    if (e.type === 'star') { score += 120; bell = clamp(bell + 12, 0, 100); }
    e.passed = true;
    for (let i = 0; i < 14; i++) spawnParticle(lanes[e.lane], 1, e.z, rand() * Math.PI * 2, 1.5 + rand() * 2.3, e.type === 'star' ? 0x9edbff : 0xffd66b);
    scene.remove(e.group);
  }

  function passGate(e) {
    if (targetLane === e.lane) {
      combo++; cleanStreak++; maxRunStreak = Math.max(maxRunStreak, cleanStreak);
      score += Math.floor(90 * (1 + Math.min(combo, 18) * .12));
      bell = clamp(bell + 10, 0, 100);
      for (let i = 0; i < 18; i++) spawnParticle(lanes[e.lane], 1.2, e.z, rand() * Math.PI * 2, 1.4 + rand() * 2.5, 0xffd66b);
    } else {
      missGate();
    }
    e.passed = true;
  }

  function clearStation() {
    score += 350;
    if (hearts < 3) hearts += 1;
    if (phaseHits === 0 && phaseMisses === 0) score += 250;
    station++;
    phaseHits = 0; phaseMisses = 0;
    if (station >= 3 && score >= 2600 && !dawn) triggerDawn();
  }

  function triggerDawn() {
    dawn = true; dawnTime = 5; endlessLoop = 1; score += 800;
    dawnBanner.classList.remove('hidden');
    if (!bestArrival || runTime < bestArrival) { bestArrival = runTime; localStorage.setItem(arrivalKey, String(bestArrival)); }
    for (let i = 0; i < 48; i++) spawnParticle(0, 1.4, -2 + rand() * 8, rand() * Math.PI * 2, 2 + rand() * 4, i % 2 ? 0xffd66b : 0x9edbff);
  }

  function finish(reason) {
    best = Math.max(best, Math.floor(score));
    bestStreak = Math.max(bestStreak, maxRunStreak);
    bestLoop = Math.max(bestLoop, endlessLoop);
    localStorage.setItem(bestKey, String(best));
    localStorage.setItem(streakKey, String(bestStreak));
    localStorage.setItem(loopKey, String(bestLoop));
    ui.resultTitle.textContent = reason === 'sleep' ? 'Sleep meter faded to zero' : reason === 'hearts' ? 'Lantern hearts went dark' : 'Dream run complete';
    ui.finalScore.textContent = Math.floor(score);
    ui.bestOver.textContent = best;
    ui.finalStation.textContent = stationNames[Math.min(station, 2)] || 'Endless night-loop';
    ui.finalDawn.textContent = dawn ? `Arrived at ${Math.ceil(runTime)}s` : 'Not yet';
    ui.finalStreak.textContent = maxRunStreak;
    const goals = [dawn && runTime <= 150, maxRunStreak >= 16, phaseHits === 0 && station > 0, dawn && score >= 4200];
    masteryList.innerHTML = `<li>${goals[0] ? '✓' : '○'} Arrive before 150 seconds</li><li>${goals[1] ? '✓' : '○'} 16-gate clean streak</li><li>${goals[2] ? '✓' : '○'} Clear a station without damage</li><li>${goals[3] ? '✓' : '○'} Score 4200 in endless</li>`;
    updateHud();
    setState('results');
  }

  function update(dt) {
    if (state !== 'play') return;
    const spd = effectiveSpeed();
    runTime += dt;
    distance += spd * dt;
    sleep -= dt * (.46 + (dawn ? .08 * endlessLoop : .05 * station)) + (drainBoost > 0 ? dt * 2.15 : 0);
    if (sleep <= 0) { sleep = 0; finish('sleep'); return; }
    if (drainBoost > 0) drainBoost -= dt;
    if (invuln > 0) invuln -= dt;
    if (bellTime > 0) bellTime -= dt;
    if (dawnTime > 0) { dawnTime -= dt; if (dawnTime <= 0) dawnBanner.classList.add('hidden'); }
    if (dawn && distance > stationDistances[2] + endlessLoop * 650) { endlessLoop++; sleep = clamp(sleep + 12, 0, 100); score += 250; }
    if (!dawn && station < 3 && distance >= stationDistances[station]) clearStation();
    if (!dawn && station >= 3 && score >= 2600) triggerDawn();

    spawnClock -= dt;
    if (spawnClock <= 0) {
      spawnNextEvent();
      spawnClock = Math.max(.56, 1.02 - Math.min(.28, (station + endlessLoop) * .045) - rand() * .16);
    }

    lanePos += (targetLane - lanePos) * Math.min(1, dt * 9.5);
    tram.position.x = THREE.MathUtils.lerp(tram.position.x, lanes[targetLane], Math.min(1, dt * 9.5));
    tram.rotation.z = THREE.MathUtils.lerp(tram.rotation.z, (targetLane - lanePos) * -.26, Math.min(1, dt * 8));
    tram.rotation.y = THREE.MathUtils.lerp(tram.rotation.y, (targetLane - lanePos) * .18, Math.min(1, dt * 6));
    tram.position.y = 1.15 + Math.sin(runTime * 7) * .035 + (bellTime > 0 ? Math.sin(runTime * 15) * .03 : 0);
    bellLight.intensity = 1.65 + (bell / 100) * 1.5 + (bellTime > 0 ? 2.2 : 0);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tram.position.x * .18, dt * 2.4);
    camera.lookAt(tram.position.x * .28, .75, -24);

    for (const seg of railSegments) {
      seg.position.z += spd * dt;
      if (seg.position.z > 13) seg.position.z -= 108;
    }
    for (const s of stars) {
      s.rotation.x += dt * .2; s.rotation.y += dt * .3;
      s.position.z += spd * dt * .28;
      if (s.position.z > 10) s.position.z -= 105;
    }

    let activeFork = null;
    for (let i = events.length - 1; i >= 0; i--) {
      const e = events[i];
      e.z += spd * dt;
      e.group.position.z = e.z;
      e.spin += dt;
      e.group.rotation.y = Math.sin(e.spin) * (e.type === 'ticket' || e.type === 'star' ? .8 : .05);
      if (e.type === 'fork' && e.z > -28 && e.z < 4 && !e.passed) activeFork = e;
      if ((e.type === 'ticket' || e.type === 'star') && !e.passed && Math.abs(e.z - 4.2) < .72 && targetLane === e.lane) collectEvent(e);
      if (e.type === 'hazard' && !e.passed && Math.abs(e.z - 4.2) < .68) {
        if (targetLane === e.lane) hitDamage('hazard');
        e.passed = true;
      }
      if (e.type === 'gate' && !e.passed && e.z > 4.2) passGate(e);
      if (e.type === 'fork' && !e.passed && e.z > 4.2) {
        if (targetLane !== e.lane) hitDamage('fork'); else { score += 80; bell = clamp(bell + 8, 0, 100); }
        e.passed = true;
      }
      if (e.z > 15) { scene.remove(e.group); events.splice(i, 1); }
    }
    if (activeFork) {
      forkHint.textContent = `Fork ahead: ${laneNames[activeFork.lane]} rail glows safe`;
      forkHint.classList.remove('hidden');
    } else if (bellTime > 0) {
      const next = events.find(e => (e.type === 'gate' || e.type === 'fork') && !e.passed && e.z < 3);
      if (next) { forkHint.textContent = `Lucid Bell reveals ${laneNames[next.lane]} lane`; forkHint.classList.remove('hidden'); }
      else forkHint.classList.add('hidden');
    } else forkHint.classList.add('hidden');

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      p.vy -= dt * 1.2;
      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y += p.vy * dt;
      p.mesh.position.z += (p.vz + spd * .22) * dt;
      p.mesh.material.opacity = clamp(p.life / p.max, 0, 1);
      if (p.life <= 0) { scene.remove(p.mesh); particles.splice(i, 1); }
    }

    score += dt * (dawn ? 5 + endlessLoop : 2.4);
    bell = clamp(bell + dt * (dawn ? 4.5 : 3.2), 0, 100);
    updateHud();
  }

  function updateHud() {
    ui.score.textContent = Math.floor(score);
    ui.best.textContent = best;
    ui.bestTitle.textContent = best;
    ui.arrivalTitle.textContent = bestArrival ? `${Math.ceil(bestArrival)}s` : '—';
    ui.streakTitle.textContent = bestStreak;
    ui.loopTitle.textContent = bestLoop;
    ui.hearts.textContent = '♥'.repeat(Math.max(0, hearts)) + '♡'.repeat(Math.max(0, 3 - hearts));
    ui.combo.textContent = `x${combo}`;
    ui.station.textContent = dawn ? `Loop ${endlessLoop}` : stationShort[Math.min(station, 2)];
    ui.speed.textContent = effectiveSpeed().toFixed(1);
    meters.sleep.value = Math.floor(sleep);
    meters.bell.value = Math.floor(bell);
  }

  function resize() {
    const w = Math.max(1, gameWrap.clientWidth);
    const h = Math.max(1, gameWrap.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function render(ts) {
    const dt = Math.min(.034, (ts - last) / 1000 || 0);
    last = ts;
    update(dt);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  $('startBtn').onclick = reset;
  $('leftBtn').onclick = () => changeLane(-1);
  $('rightBtn').onclick = () => changeLane(1);
  $('bellBtn').onclick = useBell;
  $('pauseBtn').onclick = () => { if (state === 'play') setState('pause'); else if (state === 'pause') setState('play'); };
  $('resumeBtn').onclick = () => setState('play');
  $('restartQuick').onclick = reset;
  $('restartPauseBtn').onclick = reset;
  $('restartOverBtn').onclick = reset;
  $('titleOverBtn').onclick = () => setState('title');

  window.addEventListener('keydown', (e) => {
    if (keyDown[e.code]) return;
    keyDown[e.code] = true;
    if (['ArrowLeft','KeyA'].includes(e.code)) { e.preventDefault(); changeLane(-1); }
    if (['ArrowRight','KeyD'].includes(e.code)) { e.preventDefault(); changeLane(1); }
    if (['Space','ShiftLeft','ShiftRight'].includes(e.code)) { e.preventDefault(); useBell(); }
    if (e.code === 'KeyP') { if (state === 'play') setState('pause'); else if (state === 'pause') setState('play'); }
    if (e.code === 'KeyR') reset();
    if (e.code === 'Enter' && state === 'title') reset();
  });
  window.addEventListener('keyup', (e) => { keyDown[e.code] = false; });

  canvas.addEventListener('pointerdown', (e) => { touchStart = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  canvas.addEventListener('pointerup', (e) => {
    if (!touchStart) return;
    const dx = e.clientX - touchStart.x;
    const dy = e.clientY - touchStart.y;
    if (Math.abs(dx) > 28 && Math.abs(dx) > Math.abs(dy) * 1.2) changeLane(dx > 0 ? 1 : -1);
    else if (performance.now() - touchStart.t < 260 && touchStart.y > window.innerHeight * .62) changeLane(e.clientX > window.innerWidth / 2 ? 1 : -1);
    touchStart = null;
  });
  canvas.addEventListener('pointercancel', () => { touchStart = null; });

  window.addEventListener('resize', resize);
  resize();
  updateHud();
  setState('title');
  requestAnimationFrame(render);
  window.yumeRailrunner = { reset, useBell, changeLane, getState: () => ({ state, score, hearts, sleep, station, dawn, events: events.length }) };
})();
