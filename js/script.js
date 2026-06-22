(function(){
'use strict';

let isMobile, isSmallScreen;
isMobile = window.matchMedia('(pointer: coarse)').matches;
isSmallScreen = window.innerWidth < 768;

// LOADER
const loader = document.getElementById('loader');
const bar = document.getElementById('loader-bar');
const pct = document.getElementById('loader-pct');
const logs = document.getElementById('log-lines');
const asciiEl = document.getElementById('term-ascii');
const promptText = document.getElementById('prompt-text');

const asciiArt = `   ╔══════════════════════════════════╗
   ║  _    ____  ____   ___   __    ║
   ║ / \\  |  _ \\|  _ \\ / _ \\ / /_   ║
   ║/ _ \\ | |_) | |_) | | | | \'_ \\  ║
   ║/ ___ \\|  _ <|  _ <| |_| | (_) | ║
   ║/_/   \\_\\_| \\_\\_| \\_\\\\___/ \\___/ ║
   ╚══════════════════════════════════╝`;

const logsData = [
  { text: 'Initializing AI inference engine...', tag: 'OK', type: 'success' },
  { text: 'Calibrating neural network weights...', tag: 'OK', type: 'success' },
  { text: 'Connecting to DevOps orchestration...', tag: 'OK', type: 'success' },
  { text: 'Mounting containerized portfolio...', tag: 'OK', type: 'success' },
  { text: 'Establishing secure tunnel (wss://arr.dev)...', tag: 'OK', type: 'success' },
  { text: 'Rendering 3D interface layers...', tag: 'DONE', type: 'success' },
  { text: 'System ready — welcome, world.', tag: '', type: 'welcome' }
];

// Matrix rain — RAF with time accumulator for silky 60fps
(function() {
  const c = document.getElementById('loader-matrix');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, cols, drops, lastDrop = 0, dropInterval = 0;
  function resize() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
    cols = Math.floor(W / 16);
    drops = Array(cols).fill(1);
    dropInterval = 55;
  }
  resize();
  window.addEventListener('resize', resize);
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789:;.';
  function drawMatrix(now) {
    if (!lastDrop) lastDrop = now;
    const delta = now - lastDrop;
    if (delta < dropInterval) return;
    lastDrop = now - (delta % dropInterval);
    ctx.fillStyle = 'rgba(2,2,9,0.08)';
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < drops.length; i++) {
      const cc = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = `hsla(270, 80%, ${60 + Math.random() * 30}%, 0.6)`;
      ctx.font = '13px monospace';
      ctx.fillText(cc, i * 16, drops[i] * 16);
      if (drops[i] * 16 > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  function matrixRaf(now) { drawMatrix(now); if (!matrixStopped) requestAnimationFrame(matrixRaf); }
  let matrixStopped = false;
  const obs = new MutationObserver(() => {
    if (loader.classList.contains('hidden')) { matrixStopped = true; obs.disconnect(); }
  });
  obs.observe(loader, { attributes: true, attributeFilter: ['class'] });
  requestAnimationFrame(matrixRaf);
})();

let logIdx = 0;
let progress = 0;

function typeText(el, text, speed, cb) {
  let i = 0;
  function tick() {
    if (i < text.length) {
      el.textContent = text.substring(0, i + 1);
      i++;
      setTimeout(tick, speed);
    } else if (cb) cb();
  }
  tick();
}

function addLog() {
  if (logIdx >= logsData.length) return;
  const d = logsData[logIdx];
  const line = document.createElement('div');
  line.className = 'log-line';
  const label = d.tag ? `<span style="color:var(--accent-cyan);opacity:0.5">[</span><span style="color:var(--accent-green)">${d.tag}</span><span style="color:var(--accent-cyan);opacity:0.5">]</span> ` : '';
  line.innerHTML = `> ${label}`;
  logs.appendChild(line);

  const txtSpan = document.createElement('span');
  txtSpan.style.opacity = '0.7';
  line.appendChild(txtSpan);

  let i = 0;
  function typeLine() {
    if (i < d.text.length) {
      txtSpan.textContent = d.text.substring(0, i + 1);
      i++;
      setTimeout(typeLine, 18 + Math.random() * 12);
    } else {
      requestAnimationFrame(() => {
        line.classList.add('done');
        if (d.type === 'success') line.classList.add('success');
        if (d.type === 'welcome') {
          line.classList.add('welcome');
          line.innerHTML = '> <span style="color:var(--accent-cyan)">' + d.text + '</span>';
        }
      });
      logIdx++;
    }
  }
  typeLine();
}

// Show ASCII art
setTimeout(() => { asciiEl.textContent = asciiArt; asciiEl.classList.add('show'); }, 200);

// Type out prompt line
setTimeout(() => {
  typeText(promptText, 'system init — arrafi_nur_hafiz.portfolio v2.4.1', 28, () => {
    setTimeout(() => { document.querySelector('.term-prompt .cursor-blink').style.display = 'none'; }, 600);
  });
}, 700);

let loadStart = performance.now();
(function smoothLoad(now) {
  const elapsed = now - loadStart;
  const duration = 3200;
  const raw = Math.min(elapsed / duration, 1);
  progress = raw < 1 ? raw * raw * (3 - 2 * raw) * 100 : 100;
  bar.style.width = progress + '%';
  pct.textContent = String(Math.round(progress)).padStart(3, '0');
  if (progress >= Math.round((logIdx + 1) * (100 / logsData.length))) addLog();
  if (progress >= 100) {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initParticles();
      initReveal();
      initTilt();
      initCounters();
      initTyping();
      initMagnetic();
      initScrollColors();
    }, 600);
    return;
  }
  requestAnimationFrame(smoothLoad);
})();

document.body.style.overflow = 'hidden';

// THREE.JS 3D SCENE — PER-SECTION OBJECTS
let mouse3d = { x: 0, y: 0 };
let scene, camera, renderer, torusKnot, particles3d, particleLines, constellation;
let meshes = [];
let orbitData = [];
let scrollY3d = 0, currentSectionIdx = 0;
let sceneColors = { hue: 0.75, sat: 0.8, light: 0.5 };
let targetColors = { hue: 0.75, sat: 0.8, light: 0.5 };

const sectionOrder = ['hero', 'skills', 'projects', 'experience', 'contact'];

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  isMobile = window.matchMedia('(pointer: coarse)').matches;
  isSmallScreen = window.innerWidth < 768;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = isMobile ? 400 : 300;

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // LIGHTS
  const ambient = new THREE.AmbientLight(0x222244, 0.6);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0x7c3aed, 1.2);
  dirLight.position.set(200, 300, 400);
  scene.add(dirLight);
  const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 0.6);
  dirLight2.position.set(-300, -100, 200);
  scene.add(dirLight2);
  const pointLight = new THREE.PointLight(0xec4899, 0.8, 800);
  pointLight.position.set(0, 0, 100);
  scene.add(pointLight);

  // SHAPES — each => GROUP with solid + wireframe + edge glow + orbit ring
  const shapes = [
    { geo: new THREE.TorusKnotGeometry(65, 22, 200, 26), color: 0x7c3aed, emissive: 0x3b0a8c, label: 'hero', orbitR: 0, ringR: 90 },
    { geo: new THREE.IcosahedronGeometry(30, 0), color: 0x10b981, emissive: 0x065f46, label: 'skills', orbitR: 160, ringR: 45 },
    { geo: new THREE.OctahedronGeometry(28, 0), color: 0xf59e0b, emissive: 0x78350f, label: 'skills', orbitR: 140, ringR: 42 },
    { geo: new THREE.TorusKnotGeometry(24, 8, 80, 12), color: 0x06b6d4, emissive: 0x055a6e, label: 'projects', orbitR: 200, ringR: 36 },
    { geo: new THREE.DodecahedronGeometry(20, 0), color: 0xec4899, emissive: 0x831843, label: 'experience', orbitR: 180, ringR: 30 },
    { geo: new THREE.SphereGeometry(18, 20, 20), color: 0x8b5cf6, emissive: 0x4c1d95, label: 'contact', orbitR: 220, ringR: 28 },
  ];

  meshes = [];
  shapes.forEach(s => {
    const group = new THREE.Group();
    const sectionIdx = sectionOrder.indexOf(s.label);
    const baseScale = 0.8 + Math.random() * 0.4;

    // 1) SOLID CORE
    const solidMat = new THREE.MeshPhongMaterial({
      color: s.color, emissive: s.emissive, emissiveIntensity: 0.7,
      transparent: true, opacity: 0.35, shininess: 100, specular: 0x8888cc,
    });
    const solid = new THREE.Mesh(s.geo, solidMat);
    solid.userData = { type: 'solid' };
    group.add(solid);

    // 2) WIREFRAME CAGE (slightly larger)
    const wireMat = new THREE.MeshBasicMaterial({
      color: s.color, wireframe: true, transparent: true, opacity: 0.35,
    });
    const wire = new THREE.Mesh(s.geo.clone(), wireMat);
    wire.scale.set(1.08, 1.08, 1.08);
    wire.userData = { type: 'wire' };
    group.add(wire);

    // 3) EDGE GLOW LINES
    const edges = new THREE.EdgesGeometry(s.geo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.12,
    });
    const edgeLines = new THREE.LineSegments(edges, edgeMat);
    edgeLines.scale.set(1.04, 1.04, 1.04);
    edgeLines.userData = { type: 'edge' };
    group.add(edgeLines);

    // 4) ORBITING RING
    const ringGeo = new THREE.TorusGeometry(s.ringR, 1.8, 10, 40);
    const ringMat = new THREE.MeshBasicMaterial({
      color: s.color, transparent: true, opacity: 0.2,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5 + Math.random() * 0.5;
    ring.rotation.z = Math.random() * Math.PI;
    ring.userData = { type: 'ring', spinSpeed: 0.004 + Math.random() * 0.004 };
    group.add(ring);

    // 5) MICRO SPARKLE DOTS around object
    const dotCount = 40;
    const dPos = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      const r = s.ringR * (0.5 + Math.random() * 0.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      dPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    const dMat = new THREE.PointsMaterial({
      color: s.color, size: 1.8, transparent: true, opacity: 0.3,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const dots = new THREE.Points(dGeo, dMat);
    dots.userData = { type: 'dots' };
    group.add(dots);

    group.userData = {
      section: s.label, sectionIdx,
      baseColor: s.color, baseEmissive: s.emissive,
      baseScale,
      speed: 0.15 + Math.random() * 0.25,
      phase: Math.random() * Math.PI * 2,
      orbitR: s.orbitR, orbitSpeed: 0.0004 + Math.random() * 0.0003,
      orbitAngle: Math.random() * Math.PI * 2,
      floatAmp: 0.3 + Math.random() * 0.4,
      targetOpacity: 1, currentOpacity: 1,
    };
    scene.add(group);
    meshes.push(group);
    if (s.label === 'hero') torusKnot = group;
  });

  orbitData = meshes.map(m => ({ x: 0, y: 0, z: 0 }));

  // NEBULA PARTICLES
  const pCount = isMobile ? 300 : 1200;
  const pos = new Float32Array(pCount * 3);
  const col = new Float32Array(pCount * 3);
  const sizes = new Float32Array(pCount);
  for (let i = 0; i < pCount; i++) {
    const r = 500 + Math.random() * 500;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
    const c = new THREE.Color().setHSL(0.75 + Math.random() * 0.15, 0.8, 0.5 + Math.random() * 0.3);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    sizes[i] = 2 + Math.random() * 3;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  pGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  const pMat = new THREE.PointsMaterial({
    size: isMobile ? 1.8 : 3,
    vertexColors: true, transparent: true, opacity: 0.5,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  particles3d = new THREE.Points(pGeo, pMat);
  scene.add(particles3d);

  // CONSTELLATION
  if (!isMobile) {
    const cCount = 250;
    const cPos = new Float32Array(cCount * 3);
    for (let i = 0; i < cCount; i++) {
      const r = 400 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      cPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      cPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      cPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const cGeo = new THREE.BufferGeometry();
    cGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3));
    const cMat = new THREE.PointsMaterial({
      color: 0x7c3aed, size: 1.5, transparent: true, opacity: 0.35,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    constellation = new THREE.Points(cGeo, cMat);
    scene.add(constellation);

    const threshold = 180;
    const pairs = [];
    for (let i = 0; i < cCount; i++) {
      for (let j = i + 1; j < cCount; j++) {
        const dx = cPos[i * 3] - cPos[j * 3];
        const dy = cPos[i * 3 + 1] - cPos[j * 3 + 1];
        const dz = cPos[i * 3 + 2] - cPos[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < threshold * threshold) {
          pairs.push(cPos[i * 3], cPos[i * 3 + 1], cPos[i * 3 + 2]);
          pairs.push(cPos[j * 3], cPos[j * 3 + 1], cPos[j * 3 + 2]);
        }
      }
    }
    if (pairs.length > 0) {
      const lGeo = new THREE.BufferGeometry();
      lGeo.setAttribute('position', new THREE.Float32BufferAttribute(pairs, 3));
      const lMat = new THREE.LineBasicMaterial({
        color: 0x7c3aed, transparent: true, opacity: 0.08,
        blending: THREE.AdditiveBlending,
      });
      particleLines = new THREE.LineSegments(lGeo, lMat);
      scene.add(particleLines);
    }
  }

  window.addEventListener('resize', onResize);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('scroll', onScroll3d);
  animate3d();
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(e) {
  mouse3d.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse3d.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

function onScroll3d() {
  const docEl = document.documentElement;
  scrollY3d = window.scrollY / (docEl.scrollHeight - window.innerHeight);
  currentSectionIdx = Math.min(Math.floor(scrollY3d * sectionOrder.length), sectionOrder.length - 1);
}

function animate3d() {
  requestAnimationFrame(animate3d);

  const time = Date.now() * 0.0003;
  const pp = mouse3d;

  // Opacity per-section: active=1, adjacent=0.15, others=0
  meshes.forEach(m => {
    const d = m.userData;
    const diff = Math.abs(d.sectionIdx - currentSectionIdx);
    d.targetOpacity = diff === 0 ? 1 : diff === 1 ? 0.18 : 0;
    d.currentOpacity += (d.targetOpacity - d.currentOpacity) * 0.07;
    const op = d.currentOpacity;
    m.children.forEach(child => {
      if (child.material) {
        child.material.opacity = child.userData.type === 'solid' ? op * 0.45 : op;
      }
      if (child.isPoints) child.material.opacity = op * 0.4;
    });
  });

  // MAIN GROUP (hero) — mouse-following, silkier response
  if (torusKnot) {
    const tx = pp.y * 0.3 + scrollY3d * 0.15;
    const ty = pp.x * 0.3 + scrollY3d * 0.25;
    torusKnot.rotation.x += (tx - torusKnot.rotation.x) * 0.05;
    torusKnot.rotation.y += (ty - torusKnot.rotation.y) * 0.05;
    torusKnot.rotation.z += 0.003;
  }

  // ALL GROUPS — orbital motion + rotation + float + breathing
  const timeScale = 0.65;
  meshes.forEach((m, i) => {
    const d = m.userData;
    const orb = orbitData[i];
    if (!orb) return;

    const active = d.targetOpacity > 0.5;
    const speedMul = active ? 1 : 1.8;

    if (d.orbitR > 0) {
      d.orbitAngle += d.orbitSpeed * (1 + scrollY3d * 0.5) * speedMul;
      m.position.x = Math.cos(d.orbitAngle) * d.orbitR * 0.3;
      m.position.z = Math.sin(d.orbitAngle) * d.orbitR * 0.3;
    }

    m.rotation.x += (active ? 0.006 : 0.012) * d.speed * timeScale + scrollY3d * 0.006;
    m.rotation.y += (active ? 0.009 : 0.016) * d.speed * timeScale + scrollY3d * 0.009;
    m.rotation.z += 0.003 * d.speed * timeScale;

    const floatOff = Math.sin(time * d.speed * 1.6 + d.phase) * d.floatAmp * 0.85;
    if (d.orbitR > 0) m.position.y = floatOff;

    // Scale breathing — subtler
    const breatheScale = 1 + 0.05 * Math.sin(time * d.speed * 1.0 + d.phase);
    m.scale.setScalar(d.baseScale * breatheScale);

    // Emissive pulse on solid child
    m.children.forEach(child => {
      if (child.userData.type === 'solid') {
        const ei = 0.35 + 0.35 * Math.sin(time * d.speed * 1.5 + d.phase + 1);
        child.material.emissiveIntensity = ei;
      }
      if (child.userData.type === 'ring') {
        child.rotation.z += child.userData.spinSpeed;
      }
    });
  });

  // Section-based color shift — smoother interpolation
  sceneColors.hue += (targetColors.hue - sceneColors.hue) * 0.035;
  sceneColors.sat += (targetColors.sat - sceneColors.sat) * 0.035;
  sceneColors.light += (targetColors.light - sceneColors.light) * 0.035;

  meshes.forEach(m => {
    const col = new THREE.Color(m.userData.baseColor);
    const hsl = {};
    col.getHSL(hsl);
    const newCol = col.setHSL(hsl.h * 0.5 + sceneColors.hue * 0.5, sceneColors.sat, sceneColors.light);
    m.children.forEach(child => {
      if (child.material && child.material.color) {
        child.material.color.copy(newCol);
        if (child.userData.type === 'solid') {
          child.material.emissive.setHSL(sceneColors.hue, sceneColors.sat, 0.2);
        }
      }
    });
  });

  // NEBULA PARTICLES
  if (particles3d) {
    const pPos = particles3d.geometry.attributes.position.array;
    for (let i = 0; i < pPos.length; i += 3) {
      pPos[i] += pp.x * 0.05 * Math.sin(time * 0.1 + i * 0.1);
      pPos[i + 1] += pp.y * 0.05 * Math.cos(time * 0.1 + i * 0.1);
    }
    particles3d.geometry.attributes.position.needsUpdate = true;
    particles3d.rotation.x += 0.00005;
    particles3d.rotation.y += 0.0002 + scrollY3d * 0.0002;
  }

  if (constellation) {
    constellation.rotation.x = particles3d.rotation.x;
    constellation.rotation.y = particles3d.rotation.y;
  }
  if (particleLines) {
    particleLines.rotation.x = particles3d.rotation.x;
    particleLines.rotation.y = particles3d.rotation.y;
  }

  // Camera — responsive but silky follow
  const zoom = 300 - scrollY3d * 60;
  camera.position.x += (pp.x * 20 - camera.position.x) * 0.015;
  camera.position.y += (-pp.y * 15 - camera.position.y) * 0.015;
  camera.position.z += (zoom - camera.position.z) * 0.04;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

// CURSOR
const cursorDot = document.getElementById('cursor-dot');
const cursorTrail = document.getElementById('cursor-trail');
let trailX = 0, trailY = 0;
let isTouch = false;

document.addEventListener('touchstart', () => { isTouch = true; });
document.addEventListener('mousemove', e => {
  if (isTouch) return;
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';
  trailX += (e.clientX - trailX) * 0.12;
  trailY += (e.clientY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
});
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity = '0';
  cursorTrail.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity = '1';
  cursorTrail.style.opacity = '1';
});

document.querySelectorAll('a, button, .tilt-card, .skill-badge, .contact-item, .cert-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursorDot.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover'));
});
document.querySelectorAll('p, h1, h2, h3, span').forEach(el => {
  el.addEventListener('mouseenter', () => cursorDot.classList.add('text-hover'));
  el.addEventListener('mouseleave', () => cursorDot.classList.remove('text-hover'));
});

// HIDE SCROLL INDICATOR ON FIRST SCROLL
let scrollHidden = false;

// NAVBAR
let lastScroll = 0;
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  const curr = window.scrollY;
  if (curr > lastScroll && curr > 100) navbar.classList.add('hidden-nav');
  else navbar.classList.remove('hidden-nav');
  lastScroll = curr;
  updateActiveNav();
  if (!scrollHidden && curr > 200) {
    const si = document.querySelector('.scroll-indicator');
    if (si) { si.style.opacity = '0'; si.style.transition = 'opacity 0.5s ease'; scrollHidden = true; }
  }
}, { passive: true });

function updateActiveNav() {
  const links = document.querySelectorAll('.nav-links a');
  const sections = ['hero', 'skills', 'projects', 'experience', 'contact'];
  let active = 'hero';
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= 200) active = id;
  }
  links.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + active);
  });
}

// HAMBURGER
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// REVEAL - ALL SECTION-SPECIFIC TYPES + BLUR
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-skills, .reveal-projects, .reveal-timeline, .reveal-cert, .reveal-award, .reveal-contact-left, .reveal-contact-right, .reveal-blur, .reveal-scale-blur');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));

  // Timeline line draw
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    const tObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { timeline.classList.add('timeline-line-draw'); tObs.unobserve(timeline); }
    }, { threshold: 0.2 });
    tObs.observe(timeline);
  }
}

// 5D — MAGNETIC BUTTONS
function initMagnetic() {
  if (isMobile) return;
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// 5D — SCROLL-DRIVEN 3D COLOR SHIFT
function initScrollColors() {
  gsap.registerPlugin(ScrollTrigger);
  const sections = [
    { id: 'skills', hue: 0.55, sat: 0.7, light: 0.55 },
    { id: 'projects', hue: 0.65, sat: 0.8, light: 0.5 },
    { id: 'experience', hue: 0.1, sat: 0.6, light: 0.5 },
    { id: 'contact', hue: 0.0, sat: 0.5, light: 0.5 },
  ];

  sections.forEach(s => {
    const el = document.getElementById(s.id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => { targetColors.hue = s.hue; targetColors.sat = s.sat; targetColors.light = s.light; },
      onEnterBack: () => { targetColors.hue = s.hue; targetColors.sat = s.sat; targetColors.light = s.light; },
    });
  });
}

// 3D TILT CARDS
function initTilt() {
  if (isMobile) return;
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    const glare = card.querySelector('.card-glare');
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1200px) rotateY(${x * 45}deg) rotateX(${-y * 45}deg) translateZ(40px) scale(1.05)`;
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x * 100 + 50}% ${y * 100 + 50}%, rgba(255,255,255,0.15), transparent 60%)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateY(0) rotateX(0) translateZ(0) scale(1)';
      if (glare) glare.style.background = '';
    });
  });
}

// COUNTER ANIMATION — RAF with eased progression
function initCounters() {
  const nums = document.querySelectorAll('.stat-num');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.getAttribute('data-count'));
        let startTime = 0;
        const dur = 1200;
        function tick(now) {
          if (!startTime) startTime = now;
          const t = Math.min((now - startTime) / dur, 1);
          const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          el.textContent = Math.round(eased * target);
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => obs.observe(n));
}

// TYPING ANIMATION — RAF with timestamp interpolation
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const words = ['AI Engineer', 'DevOps Engineer', 'Builder of Things'];
  let idx = 0, charIdx = 0, deleting = false, lastTick = 0;
  const typeSpeed = 70, deleteSpeed = 35;
  function tick(now) {
    if (!lastTick) lastTick = now;
    const dt = now - lastTick;
    const threshold = deleting ? deleteSpeed : typeSpeed;
    if (dt < threshold) { requestAnimationFrame(tick); return; }
    lastTick = now;
    const word = words[idx];
    if (!deleting) {
      el.textContent = word.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === word.length) {
        requestAnimationFrame((t) => { lastTick = t; setTimeout(() => { deleting = true; requestAnimationFrame(tick); }, 1800); });
        return;
      }
    } else {
      el.textContent = word.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) { deleting = false; idx = (idx + 1) % words.length; }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// LANG TOGGLE
const langToggle = document.getElementById('lang-toggle');
const langLabel = document.getElementById('lang-label');
const bio = document.getElementById('hero-bio');
let lang = 'id';
const bios = {
  id: 'Mahasiswa Sistem Informasi UTDI dengan fokus pada AI Engineering dan DevOps, berpengalaman membangun solusi teknologi berbasis Docker, Node.js, TypeScript, dan Python melalui 6+ proyek mandiri. Berorientasi pada lingkungan startup dan remote.',
  en: 'Information Systems student at UTDI focused on AI Engineering and DevOps, experienced in building technology solutions using Docker, Node.js, TypeScript, and Python through 6+ independent projects. Oriented toward startup and remote environments.'
};
langToggle.addEventListener('click', () => {
  lang = lang === 'id' ? 'en' : 'id';
  bio.style.opacity = '0';
  setTimeout(() => {
    bio.textContent = bios[lang];
    langLabel.textContent = lang === 'id' ? 'Indonesia' : 'English';
    bio.style.opacity = '1';
  }, 300);
});

// PARALLAX SCROLL
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const rate = parseFloat(el.getAttribute('data-parallax'));
    el.style.transform = `translateY(${scrolled * rate}px)`;
  });
}, { passive: true });

// LANYARD PHYSICS — drag, elastic bounce + rotation wobble
(function() {
  const photo = document.getElementById('lanyard-photo');
  const scene = document.getElementById('lanyard-scene');
  const canvas = document.getElementById('lanyard-canvas');
  const card = document.getElementById('id-card');
  const heroContent = document.querySelector('.hero-content');
  if (!photo || !scene || !canvas) return;

  const ctx = canvas.getContext('2d');
  let cardHalf = 55;

  const p = {
    x: 0, y: 0, vx: 0, vy: 0,
    rot: 0, rotV: 0,
    ax: 0, ay: 0,
    restDist: 120,
    k: 0.02, damp: 0.993, grav: 0.18,
    drag: false, dx: 0, dy: 0,
    w: 0, h: 0
  };

  function resize() {
    const r = scene.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    p.w = r.width; p.h = r.height;
    canvas.width = p.w * dpr; canvas.height = p.h * dpr;
    canvas.style.width = p.w + 'px'; canvas.style.height = p.h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    p.ax = p.w / 2; p.ay = 30;
    if (card) cardHalf = card.offsetHeight / 2 || 55;
    p.restDist = Math.min(p.h * 0.44, p.h - cardHalf - p.ay - 10);
    if (!p.drag) {
      p.x = p.ax; p.y = Math.max(p.h * 0.4, p.h - cardHalf - 8);
      p.vx = 0; p.vy = 0; p.rot = 0; p.rotV = 0;
    }
  }
  resize();
  window.addEventListener('resize', resize);

  function phys() {
    if (p.drag) return;
    const steps = 3, dt = 1 / steps;
    for (let s = 0; s < steps; s++) {
      const dx = p.ax - p.x, dy = (p.ay + p.restDist) - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let fx = 0, fy = 0;

      if (dist > p.restDist) {
        const f = (dist - p.restDist) * p.k;
        const nx = dx / dist, ny = dy / dist;
        fx += nx * f; fy += ny * f;
      }
      fx += dx * 0.0025;
      fy += dy * 0.006 + p.grav;

      p.vx += fx * dt;
      p.vy += fy * dt;

      p.rotV += (p.vx * 0.008 - p.rot * 0.012) * dt;
      p.rotV *= Math.pow(0.90, dt);
      p.rot += p.rotV * dt;

      p.vx *= Math.pow(p.damp, dt);
      p.vy *= Math.pow(p.damp, dt);

      const mv = 8;
      p.vx = Math.max(-mv, Math.min(mv, p.vx));
      p.vy = Math.max(-mv, Math.min(mv, p.vy));

      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }

    const m = Math.min(80, p.w * 0.3);
    p.x = Math.max(m, Math.min(p.w - m, p.x));
    if (p.y > p.h - cardHalf) { p.y = p.h - cardHalf; p.vy *= -0.5; p.rotV *= -0.15; }
    if (p.y < p.ay + 12) { p.y = p.ay + 12; p.vy *= -0.5; p.rotV *= -0.15; }

    render();
  }

  function render() {
    const cx = p.x, cy = p.y;
    const natX = p.ax, natY = p.h - cardHalf - 8;
    const halfW = (card ? card.offsetWidth : 150) / 2;
    const rotRad = p.rot * Math.PI / 180;
    const clipOff = cardHalf - 4;
    const endX = cx + Math.sin(rotRad) * clipOff;
    const endY = cy - Math.cos(rotRad) * clipOff;

    // Apply transform with rotation
    photo.style.transform = `translate(${cx - natX}px, ${cy - natY}px) rotate(${p.rot}deg)`;

    ctx.clearRect(0, 0, p.w, p.h);

    // TWO lanyard strings (left & right strands like real lanyard)
    const sep = 6 + Math.abs(endX - p.ax) * 0.04; // strands spread at top, converge at clip

    // Left strand
    const lAx = p.ax - sep, lEndX = endX;
    const lCpX = lAx + (lEndX - lAx) * 0.25;
    const lCpY = p.ay + (endY - p.ay) * 0.35 + Math.abs(lEndX - lAx) * 0.1;

    ctx.beginPath();
    ctx.moveTo(lAx, p.ay); ctx.quadraticCurveTo(lCpX, lCpY, lEndX, endY);
    ctx.strokeStyle = 'rgba(124,58,237,0.2)'; ctx.lineWidth = 2; ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(lAx, p.ay); ctx.quadraticCurveTo(lCpX, lCpY, lEndX, endY);
    ctx.strokeStyle = 'rgba(6,182,212,0.1)'; ctx.lineWidth = 0.8; ctx.stroke();

    // Right strand
    const rAx = p.ax + sep, rEndX = endX;
    const rCpX = rAx + (rEndX - rAx) * 0.25;
    const rCpY = p.ay + (endY - p.ay) * 0.35 + Math.abs(rEndX - rAx) * 0.1;

    ctx.beginPath();
    ctx.moveTo(rAx, p.ay); ctx.quadraticCurveTo(rCpX, rCpY, rEndX, endY);
    ctx.strokeStyle = 'rgba(124,58,237,0.2)'; ctx.lineWidth = 2; ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rAx, p.ay); ctx.quadraticCurveTo(rCpX, rCpY, rEndX, endY);
    ctx.strokeStyle = 'rgba(168,85,247,0.08)'; ctx.lineWidth = 0.8; ctx.stroke();

    // Neck loop (extends upward behind navbar)
    const neckDr = Math.min(120, p.w * 0.7);
    ctx.beginPath();
    ctx.arc(p.ax, p.ay - neckDr * 0.7, neckDr, -Math.PI * 0.55, Math.PI * 0.55);
    ctx.strokeStyle = 'rgba(124,58,237,0.15)'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath();
    ctx.arc(p.ax, p.ay - neckDr * 0.7, neckDr, -Math.PI * 0.55, Math.PI * 0.55);
    ctx.strokeStyle = 'rgba(6,182,212,0.06)'; ctx.lineWidth = 1; ctx.stroke();

    // Anchor clip hook
    ctx.beginPath();
    ctx.arc(p.ax, p.ay, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(124,58,237,0.4)'; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(p.ax - 7, p.ay - 4); ctx.lineTo(p.ax + 7, p.ay - 4);
    ctx.strokeStyle = 'rgba(124,58,237,0.3)'; ctx.lineWidth = 2; ctx.stroke();
  }

  function gPos(e) {
    const r = scene.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: cx - r.left, y: cy - r.top };
  }
  function start(e) {
    if (e.cancelable) e.preventDefault();
    p.drag = true; const pos = gPos(e);
    p.dx = p.x - pos.x; p.dy = p.y - pos.y;
    p.vx = 0; p.vy = 0; p.rotV = 0;
    if (card) card.style.transform = 'scale(1.04)';
  }
  function move(e) {
    if (!p.drag) return;
    if (e.cancelable) e.preventDefault();
    const pos = gPos(e);
    p.x = pos.x + p.dx; p.y = pos.y + p.dy;
    render();
  }
  function end() {
    if (!p.drag) return;
    p.drag = false;
    // Boost velocity for elastic launch
    p.vx *= 2.5; p.vy *= 3.0;
    // Add rotational spin based on launch direction
    p.rotV += p.vx * 0.03;
    if (card) card.style.transform = '';
  }

  photo.addEventListener('mousedown', start);
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', end);
  photo.addEventListener('touchstart', start, { passive: false });
  document.addEventListener('touchmove', move, { passive: false });
  document.addEventListener('touchend', end);

  // Hero content tilt (disabled on touch)
  (function(){
    if (isMobile) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      if (heroContent) heroContent.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    hero.addEventListener('mouseleave', () => {
      if (heroContent) heroContent.style.transform = 'rotateY(0) rotateX(0)';
    });
  })();

  function loop() { phys(); requestAnimationFrame(loop); }
  loop();
})();

// ORIENTATION CHANGE — reflow adjustments
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero-glow-ring, .lanyard-scene, .id-card').forEach(el => {
      el.style.transition = 'all 0.3s ease';
    });
  }, 300);
});

// Resize observer for responsive 3D
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    onResize();
    const w = window.innerWidth;
    if (w < 768 || w >= 768) {
      document.querySelectorAll('[data-parallax]').forEach(el => {
        el.removeAttribute('style');
      });
    }
  }, 200);
});

// DL CV
document.getElementById('dl-cv')?.addEventListener('click', e => {
  e.preventDefault();
  const a = document.createElement('a');
  a.href = 'CV_Arrafi_2Halaman.pdf';
  a.download = 'CV_Arrafi_2Halaman.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// FORM
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  btn.innerHTML = '<i class="fa-solid fa-check"></i> Terkirim!';
  setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Pesan'; }, 2500);
});

// GLITCH TOGGLE ON HOVER
const heroName = document.getElementById('hero-name');
heroName.addEventListener('mouseenter', () => heroName.classList.add('glitch'));
heroName.addEventListener('mouseleave', () => heroName.classList.remove('glitch'));

// CERT MODAL
window.openCert = function(src, title, org) {
  const modal = document.getElementById('cert-modal');
  document.getElementById('cert-modal-img').src = src;
  document.getElementById('cert-modal-title').textContent = title;
  document.getElementById('cert-modal-org').textContent = org;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
};
window.closeCert = function() {
  const modal = document.getElementById('cert-modal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
};
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') window.closeCert();
});

})();
