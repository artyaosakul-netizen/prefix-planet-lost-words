/* =========================================================
   Prefix Planet — Progressive Three.js scenes
   The website remains fully usable when this enhancement fails.
   ========================================================= */

const containers = [...document.querySelectorAll('[data-scene]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const compactDevice = window.matchMedia('(max-width: 720px)').matches;

if (containers.length) {
  import('https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js')
    .then((THREE) => containers.forEach((container) => {
      if (container.dataset.scene === 'home') createHomeScene(THREE, container);
      if (container.dataset.scene === 'mission') createMissionScene(THREE, container);
    }))
    .catch(() => {
      containers.forEach((container) => container.classList.add('scene-css-fallback'));
    });
}

function makeTextSprite(THREE, text, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = options.background || 'rgba(31, 28, 73, .76)';
  roundRect(context, 18, 28, 476, 136, 55);
  context.fill();
  context.strokeStyle = options.border || 'rgba(255,255,255,.45)';
  context.lineWidth = 5;
  roundRect(context, 18, 28, 476, 136, 55);
  context.stroke();
  context.fillStyle = options.color || '#ffffff';
  context.font = `900 ${options.size || 68}px Nunito, Arial, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 256, 98);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(options.width || 1.8, options.height || 0.67, 1);
  return sprite;
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function baseRenderer(THREE, container) {
  const renderer = new THREE.WebGLRenderer({ antialias: !compactDevice, alpha: true, powerPreference: compactDevice ? 'low-power' : 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compactDevice ? 1.25 : 1.7));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.prepend(renderer.domElement);
  const fallback = container.querySelector('.scene-fallback');
  if (fallback) fallback.hidden = true;
  return renderer;
}

function addStars(THREE, scene, count) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xffffff, size: compactDevice ? 0.035 : 0.05, transparent: true, opacity: 0.78 });
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
  return stars;
}

function setupResize(THREE, container, camera, renderer, renderOnce) {
  const resize = () => {
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (renderOnce) renderOnce();
  };
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(container);
  else window.addEventListener('resize', resize, { passive: true });
  resize();
}

function createHomeScene(THREE, container) {
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0, 0.2, 7.1);
    const renderer = baseRenderer(THREE, container);

    scene.add(new THREE.AmbientLight(0xded8ff, 2.2));
    const key = new THREE.DirectionalLight(0xffffff, 3.1);
    key.position.set(4, 5, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0x5dc8e8, 24, 12);
    rim.position.set(-3, 0, 4);
    scene.add(rim);

    const world = new THREE.Group();
    scene.add(world);
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(1.62, compactDevice ? 28 : 48, compactDevice ? 20 : 36),
      new THREE.MeshStandardMaterial({ color: 0x8469ec, roughness: 0.58, metalness: 0.05, emissive: 0x211451, emissiveIntensity: 0.38 })
    );
    world.add(planet);

    const cloudMaterial = new THREE.MeshStandardMaterial({ color: 0xbfefff, roughness: 0.8, transparent: true, opacity: 0.38 });
    for (let i = 0; i < (compactDevice ? 5 : 8); i += 1) {
      const cloud = new THREE.Mesh(new THREE.SphereGeometry(0.3 + Math.random() * 0.28, 16, 12), cloudMaterial);
      const angle = (i / 8) * Math.PI * 2;
      cloud.position.set(Math.cos(angle) * 1.42, (Math.random() - 0.5) * 2.2, Math.sin(angle) * 1.42);
      cloud.scale.set(1.7, 0.5, 0.7);
      world.add(cloud);
    }

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.25, 0.10, 14, compactDevice ? 72 : 120),
      new THREE.MeshStandardMaterial({ color: 0xf7bd3e, roughness: 0.42, metalness: 0.22, emissive: 0x8f5a00, emissiveIntensity: 0.3 })
    );
    ring.rotation.x = Math.PI * 0.47;
    ring.rotation.y = Math.PI * 0.09;
    world.add(ring);

    const prefixes = ['un-', 're-', 'pre-', 'dis-', 'mis-', 'over-', 'under-', 'inter-'];
    const orbiters = [];
    prefixes.forEach((prefix, index) => {
      if (compactDevice && index > 5) return;
      const sprite = makeTextSprite(THREE, prefix, { width: 1.3, height: 0.49, size: 72 });
      sprite.userData.angle = (index / prefixes.length) * Math.PI * 2;
      sprite.userData.radius = 2.65 + (index % 2) * 0.25;
      sprite.userData.speed = 0.12 + (index % 3) * 0.018;
      world.add(sprite);
      orbiters.push(sprite);
    });

    const stars = addStars(THREE, scene, compactDevice ? 170 : 380);
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let targetY = 0;
    let targetX = 0;
    container.addEventListener('pointerdown', (event) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      container.setPointerCapture?.(event.pointerId);
    });
    container.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      targetY += (event.clientX - lastX) * 0.008;
      targetX += (event.clientY - lastY) * 0.004;
      targetX = Math.max(-0.45, Math.min(0.45, targetX));
      lastX = event.clientX;
      lastY = event.clientY;
    });
    const stopDrag = () => { dragging = false; };
    container.addEventListener('pointerup', stopDrag);
    container.addEventListener('pointercancel', stopDrag);

    let visible = !document.hidden;
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
    const clock = new THREE.Clock();
    const render = () => renderer.render(scene, camera);
    const animate = () => {
      requestAnimationFrame(animate);
      if (!visible || container.offsetParent === null) return;
      const time = clock.getElapsedTime();
      if (!dragging) targetY += 0.0014;
      world.rotation.y += (targetY - world.rotation.y) * 0.045;
      world.rotation.x += (targetX - world.rotation.x) * 0.045;
      planet.rotation.y = time * 0.09;
      ring.rotation.z = time * 0.035;
      orbiters.forEach((sprite) => {
        const angle = sprite.userData.angle + time * sprite.userData.speed;
        sprite.position.set(Math.cos(angle) * sprite.userData.radius, Math.sin(angle * 1.3) * 1.1, Math.sin(angle) * 0.75 + 1.15);
      });
      stars.rotation.y = time * 0.008;
      render();
    };
    setupResize(THREE, container, camera, renderer, render);
    if (reducedMotion) render(); else animate();
  } catch (_error) {
    const fallback = container.querySelector('.scene-fallback');
    if (fallback) fallback.hidden = false;
  }
}

function createMissionScene(THREE, container) {
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 1.2, 11);
    const renderer = baseRenderer(THREE, container);
    scene.add(new THREE.AmbientLight(0xb8b4ff, 1.8));
    const light = new THREE.PointLight(0xffffff, 70, 22);
    light.position.set(0, 5, 7);
    scene.add(light);
    addStars(THREE, scene, compactDevice ? 160 : 320);

    const colors = [0x987cf3, 0x5dc8e8, 0xf47fb2, 0xf7bd3e, 0x49c68a];
    const positions = [
      [-4.2, -1.1, 0],
      [-2.2, 1.1, -0.3],
      [0, -0.6, 0],
      [2.2, 1.25, -0.3],
      [4.25, -0.4, 0]
    ];
    const planetGroups = [];
    positions.forEach((position, index) => {
      const group = new THREE.Group();
      group.position.set(...position);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(compactDevice ? 0.52 : 0.65, compactDevice ? 20 : 32, compactDevice ? 14 : 24),
        new THREE.MeshStandardMaterial({ color: colors[index], roughness: 0.6, emissive: colors[index], emissiveIntensity: index === 0 ? 0.28 : 0.06 })
      );
      group.add(mesh);
      const label = makeTextSprite(THREE, index === 0 ? '1' : `LOCK ${index + 1}`, { width: index === 0 ? 0.74 : 1.25, height: 0.32, size: index === 0 ? 96 : 56, background: 'rgba(16,19,52,.82)' });
      label.position.set(0, -1.05, 0.4);
      group.add(label);
      group.userData.label = label;
      group.userData.labelStatus = index === 0 ? '1' : `LOCK ${index + 1}`;
      scene.add(group);
      planetGroups.push(group);
    });

    const pathMaterial = new THREE.LineDashedMaterial({ color: 0xc9c0ff, dashSize: 0.18, gapSize: 0.12, transparent: true, opacity: 0.52 });
    const curve = new THREE.CatmullRomCurve3(positions.map((position) => new THREE.Vector3(...position)));
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(90));
    const path = new THREE.Line(pathGeometry, pathMaterial);
    path.computeLineDistances();
    scene.add(path);

    const ship = new THREE.Group();
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.23, 0.75, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x5dc8e8, emissiveIntensity: 0.2 }));
    body.rotation.z = -Math.PI / 2;
    ship.add(body);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.38, 12), new THREE.MeshBasicMaterial({ color: 0xf7bd3e }));
    flame.rotation.z = Math.PI / 2;
    flame.position.x = -0.48;
    ship.add(flame);
    ship.position.copy(curve.getPoint(0));
    ship.position.y += 0.8;
    scene.add(ship);

    let targetProgress = 0;
    let progress = 0;
    let currentPlanet = 1;
    const updateFromEvent = (event) => {
      targetProgress = Math.min(1, Math.max(0, event.detail.answered / 45));
      currentPlanet = event.detail.currentPlanet;
      planetGroups.forEach((group, index) => {
        const material = group.children[0].material;
        const completed = event.detail.crystals.includes(index + 1);
        material.emissiveIntensity = completed ? 0.48 : (index + 1 === currentPlanet ? 0.30 : 0.05);
        group.scale.setScalar(completed ? 1.12 : 1);
        const desiredLabel = completed ? `DONE ${index + 1}` : (index + 1 === currentPlanet ? `${index + 1}` : `LOCK ${index + 1}`);
        if (group.userData.labelStatus !== desiredLabel) {
          const oldLabel = group.userData.label;
          const newLabel = makeTextSprite(THREE, desiredLabel, { width: desiredLabel.length > 2 ? 1.25 : 0.74, height: 0.32, size: desiredLabel.length > 2 ? 56 : 96, background: 'rgba(16,19,52,.82)' });
          newLabel.position.set(0, -1.05, 0.4);
          group.remove(oldLabel);
          oldLabel.material.map?.dispose();
          oldLabel.material.dispose();
          group.add(newLabel);
          group.userData.label = newLabel;
          group.userData.labelStatus = desiredLabel;
        }
      });
    };
    document.addEventListener('prefixplanet:mission-progress', updateFromEvent);

    let visible = !document.hidden;
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
    const clock = new THREE.Clock();
    const render = () => renderer.render(scene, camera);
    const animate = () => {
      requestAnimationFrame(animate);
      if (!visible || container.offsetParent === null) return;
      const time = clock.getElapsedTime();
      progress += (targetProgress - progress) * 0.035;
      const point = curve.getPoint(progress);
      ship.position.set(point.x, point.y + 0.85, point.z + 0.25);
      flame.scale.y = 0.82 + Math.sin(time * 12) * 0.2;
      planetGroups.forEach((group, index) => {
        group.children[0].rotation.y = time * (0.12 + index * 0.015);
        group.position.y = positions[index][1] + Math.sin(time * 0.65 + index) * 0.08;
      });
      render();
    };
    setupResize(THREE, container, camera, renderer, render);
    if (reducedMotion) render(); else animate();
  } catch (_error) {
    const fallback = container.querySelector('.scene-fallback');
    if (fallback) fallback.hidden = false;
  }
}
