import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const bodies = [
  { id: "sun", name: "太阳", type: "恒星", radius: 4.2, orbit: 0, speed: 0, color: 0xffc857, fact: "太阳是太阳系的中心恒星，靠核聚变释放光和热。", distance: "太阳系中心", moons: "0" },
  { id: "mercury", name: "水星", type: "行星", radius: 0.62, orbit: 8, speed: 1.65, color: 0xb8a08a, fact: "水星离太阳最近，昼夜温差非常大。", distance: "约 5790 万千米", moons: "0" },
  { id: "venus", name: "金星", type: "行星", radius: 0.95, orbit: 11, speed: 1.25, color: 0xd9a84f, fact: "金星大气层很厚，是太阳系最热的行星。", distance: "约 1.082 亿千米", moons: "0" },
  { id: "earth", name: "地球", type: "行星", radius: 1, orbit: 14.5, speed: 1, color: 0x3d9cff, fact: "地球表面约 71% 被水覆盖，是我们的家园。", distance: "约 1.496 亿千米", moons: "1" },
  { id: "moon", name: "月亮", type: "卫星", parent: "earth", radius: 0.28, orbit: 2.35, speed: 2.75, color: 0xd8d6cc, fact: "月亮是地球唯一的天然卫星，会反射太阳光。", distance: "距地球约 38.4 万千米", moons: "0" },
  { id: "mars", name: "火星", type: "行星", radius: 0.78, orbit: 18, speed: 0.82, color: 0xd96a45, fact: "火星有红色尘土和巨大的奥林匹斯山。", distance: "约 2.279 亿千米", moons: "2" },
  { id: "jupiter", name: "木星", type: "行星", radius: 2.2, orbit: 24, speed: 0.45, color: 0xd6b185, fact: "木星是太阳系最大的行星，大红斑是一场巨大风暴。", distance: "约 7.785 亿千米", moons: "95+" },
  { id: "saturn", name: "土星", type: "行星", radius: 1.9, orbit: 31, speed: 0.34, color: 0xd7bd79, ring: true, fact: "土星的光环由冰粒和岩石碎片组成。", distance: "约 14.33 亿千米", moons: "146+" },
  { id: "uranus", name: "天王星", type: "行星", radius: 1.35, orbit: 38, speed: 0.24, color: 0x7be3dd, fact: "天王星几乎是躺着自转，自转轴倾斜约 98 度。", distance: "约 28.72 亿千米", moons: "27" },
  { id: "neptune", name: "海王星", type: "行星", radius: 1.3, orbit: 45, speed: 0.18, color: 0x3a67df, fact: "海王星有太阳系最猛烈的风。", distance: "约 44.95 亿千米", moons: "14" },
  { id: "pluto", name: "冥王星", type: "矮行星", radius: 0.5, orbit: 53, speed: 0.11, color: 0xbda58e, fact: "冥王星曾被称为第九大行星，2006 年后被归类为矮行星。", distance: "平均距太阳约 59 亿千米", moons: "5" },
  { id: "ceres", name: "谷神星", type: "矮行星", extra: true, radius: 0.36, orbit: 21, speed: 0.62, color: 0xa9a194, fact: "谷神星位于小行星带，是小行星带中最大的天体。", distance: "火星和木星之间", moons: "0" },
  { id: "makemake", name: "鸟神星", type: "矮行星", extra: true, radius: 0.48, orbit: 61, speed: 0.085, color: 0xc28c68, fact: "鸟神星是柯伊伯带中的矮行星，表面很寒冷。", distance: "海王星外侧", moons: "1" },
  { id: "haumea", name: "妊神星", type: "矮行星", extra: true, radius: 0.46, orbit: 66, speed: 0.078, color: 0xd7d5c8, fact: "妊神星自转很快，形状被拉得像椭球。", distance: "海王星外侧", moons: "2" },
  { id: "eris", name: "阋神星", type: "矮行星", extra: true, radius: 0.52, orbit: 72, speed: 0.065, color: 0xdedbd2, fact: "阋神星非常遥远，发现它推动了行星定义的重新讨论。", distance: "太阳系外缘", moons: "1" },
  { id: "comet", name: "彗星", type: "彗星", extra: true, radius: 0.34, orbit: 0, speed: 0.42, color: 0x9df4ff, comet: true, fact: "彗星由冰、尘埃和岩石组成，靠近太阳时会拖出明亮彗尾。", distance: "椭圆轨道", moons: "0" },
];

const canvas = document.querySelector("#spaceCanvas");
const labelLayer = document.querySelector("#labelLayer");
const objectName = document.querySelector("#objectName");
const objectFact = document.querySelector("#objectFact");
const objectType = document.querySelector("#objectType");
const objectDistance = document.querySelector("#objectDistance");
const objectMoons = document.querySelector("#objectMoons");
const objectPicker = document.querySelector("#objectPicker");
const pauseButton = document.querySelector("#pauseButton");
const extendedButton = document.querySelector("#extendedButton");
const flightButton = document.querySelector("#flightButton");
const flightTarget = document.querySelector("#flightTarget");
const motionState = document.querySelector("#motionState");
const speedControl = document.querySelector("#speedControl");
const resetCamera = document.querySelector("#resetCamera");
const collapsePanel = document.querySelector("#collapsePanel");
const observatory = document.querySelector("#observatory");

let paused = false;
let extended = false;
let flightMode = false;
let flightProgress = 0;
let speedScale = 1;
let selectedId = "sun";

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x07101c, 0.011);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const camera = new THREE.PerspectiveCamera(56, 1, 0.1, 600);
camera.position.set(0, 42, 74);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 12;
controls.maxDistance = 135;
controls.target.set(0, 0, 0);

scene.add(new THREE.AmbientLight(0xbfd8ff, 1.16));
const sunLight = new THREE.PointLight(0xffe0a3, 1050, 210, 1.35);
scene.add(sunLight);
const fillLight = new THREE.DirectionalLight(0xd9ecff, 1.05);
fillLight.position.set(-35, 44, 30);
scene.add(fillLight);

const solarGroup = new THREE.Group();
scene.add(solarGroup);
const flightGroup = new THREE.Group();
scene.add(flightGroup);
const bodyViews = new Map();
const clickable = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  g.addColorStop(0, "rgba(255,226,140,1)");
  g.addColorStop(0.36, "rgba(255,165,55,0.46)");
  g.addColorStop(1, "rgba(255,130,30,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function makeOrbitLine(radius, extra = false) {
  const points = [];
  for (let i = 0; i <= 240; i += 1) {
    const angle = (i / 240) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: extra ? 0x74e5ff : 0x9fc4dd, transparent: true, opacity: extra ? 0.18 : 0.26 }),
  );
}

function makePlanetTexture(baseColor, bands = false) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = `#${baseColor.toString(16).padStart(6, "0")}`;
  ctx.fillRect(0, 0, c.width, c.height);
  for (let y = 0; y < c.height; y += bands ? 10 : 18) {
    ctx.fillStyle = bands ? `rgba(255,245,220,${0.1 + Math.random() * 0.18})` : `rgba(255,255,255,${0.05 + Math.random() * 0.1})`;
    ctx.fillRect(0, y + Math.random() * 8, c.width, bands ? 5 : 2);
  }
  return new THREE.CanvasTexture(c);
}

function makeStarField() {
  const positions = [];
  const colors = [];
  const color = new THREE.Color();
  for (let i = 0; i < 1700; i += 1) {
    const radius = 100 + Math.random() * 220;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
    positions.push(radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
    color.setHSL(0.56 + Math.random() * 0.12, 0.55, 0.72 + Math.random() * 0.25);
    colors.push(color.r, color.g, color.b);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const stars = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.48, vertexColors: true, transparent: true, opacity: 1, depthWrite: false }));
  scene.add(stars);
  return stars;
}

function makeBelt(name, inner, outer, count, color, opacity) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const r = THREE.MathUtils.randFloat(inner, outer);
    const a = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(0.55);
    positions[i * 3 + 2] = Math.sin(a) * r;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({ color, size: 0.13, transparent: true, opacity }));
  points.name = name;
  points.userData.extra = true;
  solarGroup.add(points);
}

function makeCometTail(mesh) {
  const tail = new THREE.Mesh(
    new THREE.ConeGeometry(0.28, 4.8, 24, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x9df4ff, transparent: true, opacity: 0.38, side: THREE.DoubleSide, depthWrite: false }),
  );
  tail.rotation.z = Math.PI / 2;
  tail.position.x = 2.35;
  mesh.add(tail);
}

function makeShipTrailTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, c.width, 0);
  gradient.addColorStop(0, "rgba(110,231,255,0)");
  gradient.addColorStop(0.5, "rgba(110,231,255,0.38)");
  gradient.addColorStop(1, "rgba(255,209,102,0.92)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, c.width, c.height);
  return new THREE.CanvasTexture(c);
}

function makeSpaceship() {
  const group = new THREE.Group();
  group.visible = false;

  const body = new THREE.Mesh(
    new THREE.ConeGeometry(0.42, 1.65, 32),
    new THREE.MeshStandardMaterial({ color: 0xdff7ff, emissive: 0x6ee7ff, emissiveIntensity: 0.28, roughness: 0.32 }),
  );
  body.rotation.x = Math.PI / 2;
  group.add(body);

  const cabin = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 24, 16),
    new THREE.MeshStandardMaterial({ color: 0x73d9ff, emissive: 0x47bfff, emissiveIntensity: 0.45, roughness: 0.2 }),
  );
  cabin.position.z = -0.18;
  group.add(cabin);

  const wingMaterial = new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xff9d3a, emissiveIntensity: 0.25, roughness: 0.45 });
  [-1, 1].forEach((side) => {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.62, 0.52), wingMaterial);
    wing.position.set(side * 0.42, -0.08, -0.2);
    wing.rotation.z = side * 0.45;
    group.add(wing);
  });

  const flame = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: makeShipTrailTexture(),
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  flame.position.z = -1.05;
  flame.scale.set(4.8, 1.2, 1);
  group.add(flame);

  const light = new THREE.PointLight(0x6ee7ff, 12, 12, 1.8);
  light.position.z = -0.5;
  group.add(light);

  flightGroup.add(group);
  return { group, flame };
}

function getFlightPoint(progress) {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  const earthView = bodyViews.get("earth");
  const earth = new THREE.Vector3(14.5, 0, 0);
  if (earthView) earthView.mesh.getWorldPosition(earth);

  const start = new THREE.Vector3(5.8, 1.2, 4.5);
  const approach = earth.clone().add(new THREE.Vector3(-8, 3.5, 7));
  const close = earth.clone().add(new THREE.Vector3(-4.8, 2.1, 4.6));

  if (p < 0.78) {
    const t = p / 0.78;
    const curve = t * t * (3 - 2 * t);
    const point = start.clone().lerp(approach, curve);
    point.y += Math.sin(t * Math.PI) * 4.2;
    point.z += Math.sin(t * Math.PI * 2.1) * 2.4;
    return point;
  }

  const t = (p - 0.78) / 0.22;
  const angle = -0.9 + t * Math.PI * 1.45;
  const radius = THREE.MathUtils.lerp(6.2, 4.8, t);
  return close.lerp(earth.clone().add(new THREE.Vector3(Math.cos(angle) * radius, 1.8 + Math.sin(t * Math.PI) * 1.2, Math.sin(angle) * radius)), t);
}

function getEarthPosition() {
  const earth = new THREE.Vector3(14.5, 0, 0);
  const earthView = bodyViews.get("earth");
  if (earthView) earthView.mesh.getWorldPosition(earth);
  return earth;
}

function nearestFlightBody(position) {
  let nearest = null;
  let best = Infinity;
  bodyViews.forEach(({ body, mesh }) => {
    if (body.extra && !extended) return;
    const world = new THREE.Vector3();
    mesh.getWorldPosition(world);
    const distance = world.distanceTo(position);
    if (distance < best) {
      best = distance;
      nearest = body;
    }
  });
  return nearest;
}

function buildSystem() {
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  glow.scale.set(18, 18, 1);
  solarGroup.add(glow);

  bodies.forEach((body) => {
    const parentView = body.parent ? bodyViews.get(body.parent) : null;
    const orbitParent = parentView?.anchor ?? solarGroup;
    const pivot = new THREE.Group();
    pivot.rotation.y = Math.random() * Math.PI * 2;
    pivot.userData.extra = Boolean(body.extra);
    orbitParent.add(pivot);

    if (body.orbit) {
      const orbitLine = makeOrbitLine(body.orbit, body.extra);
      orbitLine.userData.extra = Boolean(body.extra);
      orbitParent.add(orbitLine);
    }

    const material = body.id === "sun"
      ? new THREE.MeshBasicMaterial({ color: body.color })
      : new THREE.MeshStandardMaterial({ color: body.color, emissive: body.color, emissiveIntensity: 0.18, roughness: 0.58, map: makePlanetTexture(body.color, body.id === "jupiter" || body.id === "saturn") });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(body.radius, 48, 28), material);
    mesh.position.set(body.comet ? 66 : body.orbit, 0, 0);
    mesh.userData.bodyId = body.id;
    mesh.userData.extra = Boolean(body.extra);
    pivot.add(mesh);
    clickable.push(mesh);

    const anchor = new THREE.Group();
    mesh.add(anchor);

    if (body.ring) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(body.radius * 1.35, body.radius * 2.2, 96), new THREE.MeshBasicMaterial({ color: 0xe8d6a3, transparent: true, opacity: 0.58, side: THREE.DoubleSide }));
      ring.rotation.x = Math.PI * 0.5;
      ring.rotation.z = Math.PI * 0.08;
      mesh.add(ring);
    }
    if (body.id === "earth") {
      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(body.radius * 1.18, 48, 28),
        new THREE.MeshBasicMaterial({
          color: 0x5ecbff,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      mesh.add(atmosphere);
    }
    if (body.comet) makeCometTail(mesh);

    const label = document.createElement("div");
    label.className = "planet-label";
    label.textContent = body.name;
    labelLayer.appendChild(label);
    bodyViews.set(body.id, { body, pivot, mesh, anchor, label });
  });

  makeBelt("小行星带", 19.7, 22.9, 720, 0xb8aa90, 0.65);
  makeBelt("柯伊伯带", 55, 78, 1150, 0x86e7ff, 0.42);
}

function buildPicker() {
  objectPicker.innerHTML = "";
  bodies.filter((body) => extended || !body.extra).forEach((body) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = body.name;
    button.className = body.extra ? "extra" : "";
    button.setAttribute("aria-label", `观察${body.name}`);
    button.addEventListener("click", () => selectBody(body.id));
    objectPicker.appendChild(button);
  });
}

function applyExtendedVisibility() {
  bodyViews.forEach(({ body, pivot, mesh, label }) => {
    const visible = extended || !body.extra;
    pivot.visible = visible;
    mesh.visible = visible;
    label.style.display = visible ? "block" : "none";
  });
  solarGroup.traverse((item) => {
    if (item.userData.extra) item.visible = extended;
  });
  buildPicker();
  if (!extended && bodyViews.get(selectedId)?.body.extra) selectBody("sun");
  extendedButton.textContent = extended ? "基础模式" : "扩展模式";
}

function selectBody(id) {
  const view = bodyViews.get(id);
  if (!view) return;
  selectedId = id;
  const { body, mesh } = view;
  objectName.textContent = body.name;
  objectFact.textContent = body.fact;
  objectType.textContent = `类型：${body.type}`;
  objectDistance.textContent = `位置：${body.distance}`;
  objectMoons.textContent = `卫星：${body.moons}`;
  document.querySelectorAll("#objectPicker button").forEach((button) => button.classList.toggle("active", button.textContent === body.name));
  document.querySelectorAll(".planet-label").forEach((label) => label.classList.toggle("active", label.textContent === body.name));
  bodyViews.forEach(({ mesh: itemMesh }) => itemMesh.scale.setScalar(1));
  mesh.scale.setScalar(body.id === "sun" ? 1.08 : 1.45);
}

function onPointerDown(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(clickable.filter((item) => item.visible), false)[0];
  if (hit?.object?.userData.bodyId) selectBody(hit.object.userData.bodyId);
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function updateLabels() {
  const rect = renderer.domElement.getBoundingClientRect();
  const projected = new THREE.Vector3();
  const worldPosition = new THREE.Vector3();
  bodyViews.forEach(({ body, mesh, label }) => {
    if (!mesh.visible) return;
    mesh.getWorldPosition(worldPosition);
    worldPosition.y += body.radius + 0.65;
    projected.copy(worldPosition).project(camera);
    const visible = projected.z > -1 && projected.z < 1 && projected.x > -1.08 && projected.x < 1.08 && projected.y > -1.08 && projected.y < 1.08;
    label.style.opacity = visible ? "1" : "0";
    label.style.left = `${((projected.x + 1) / 2) * rect.width}px`;
    label.style.top = `${((-projected.y + 1) / 2) * rect.height}px`;
  });
}

const stars = makeStarField();
buildSystem();
const spaceship = makeSpaceship();
buildPicker();
applyExtendedVisibility();
selectBody("sun");

function setFlightMode(active) {
  flightMode = active;
  spaceship.group.visible = active;
  observatory.classList.toggle("flight-active", active);
  flightButton.textContent = active ? "自由观察" : "飞船穿越";
  controls.enabled = !active;
  if (active) {
    extended = true;
    applyExtendedVisibility();
    flightProgress = 0;
    flightTarget.textContent = "从太阳出发";
    motionState.textContent = "飞船巡航";
  } else {
    motionState.textContent = paused ? "已暂停" : "运行中";
  }
}

function updateFlight(delta, elapsed) {
  if (!flightMode) return;
  flightProgress += delta * 0.055 * speedScale;
  if (flightProgress > 1) flightProgress = 1;

  const current = getFlightPoint(flightProgress);
  const next = getFlightPoint(Math.min(flightProgress + 0.008, 1));
  const direction = next.clone().sub(current).normalize();
  const earth = getEarthPosition();
  const lookAhead = flightProgress > 0.62 ? earth : current.clone().add(direction.clone().multiplyScalar(8));

  spaceship.group.position.copy(current);
  spaceship.group.lookAt(lookAhead);
  spaceship.flame.scale.x = 4.6 + Math.sin(elapsed * 18) * 0.6;

  if (flightProgress > 0.72) {
    const side = new THREE.Vector3(-5.8, 2.6, 6.6);
    camera.position.copy(earth).add(side);
    camera.lookAt(earth);
  } else {
    camera.position.copy(current).add(direction.clone().multiplyScalar(-6.8)).add(new THREE.Vector3(0, 2.2, 4.2));
    camera.lookAt(lookAhead);
  }
  controls.target.copy(lookAhead);

  if (flightProgress >= 1) {
    flightTarget.textContent = "抵达：蓝色地球与深空星海";
    if (selectedId !== "earth") selectBody("earth");
  } else {
    const nearest = nearestFlightBody(current);
    if (nearest) {
      flightTarget.textContent = flightProgress > 0.62 ? "接近：蓝色地球" : `接近：${nearest.name}`;
      if (nearest.id !== selectedId) selectBody(nearest.id);
    }
  }
}

pauseButton.addEventListener("click", () => {
  paused = !paused;
  pauseButton.textContent = paused ? "继续" : "暂停";
  motionState.textContent = paused ? "已暂停" : "运行中";
});

extendedButton.addEventListener("click", () => {
  extended = !extended;
  applyExtendedVisibility();
});

flightButton.addEventListener("click", () => {
  setFlightMode(!flightMode);
});

speedControl.addEventListener("input", (event) => {
  speedScale = Number(event.target.value);
});

resetCamera.addEventListener("click", () => {
  setFlightMode(false);
  camera.position.set(0, 42, 74);
  controls.target.set(0, 0, 0);
});

collapsePanel.addEventListener("click", () => {
  observatory.classList.toggle("panel-collapsed");
  collapsePanel.textContent = observatory.classList.contains("panel-collapsed") ? "展开" : "收起";
  window.setTimeout(resize, 240);
});

canvas.addEventListener("pointerdown", onPointerDown);
window.addEventListener("resize", resize);
resize();

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;
  if (!paused) {
    stars.rotation.y += delta * 0.014;
    bodyViews.forEach(({ body, pivot, mesh }) => {
      if (body.comet) {
        const t = elapsed * body.speed * speedScale;
        mesh.position.set(Math.cos(t) * 62, Math.sin(t * 0.55) * 5, Math.sin(t) * 28);
        mesh.lookAt(0, 0, 0);
      } else if (body.speed) {
        pivot.rotation.y += delta * body.speed * speedScale;
      }
      mesh.rotation.y += delta * (body.id === "sun" ? 0.25 : 0.65);
      if (body.id === selectedId) {
        const base = body.id === "sun" ? 1.08 : 1.45;
        mesh.scale.setScalar(base * (1 + Math.sin(elapsed * 3.2) * 0.035));
      }
    });
    updateFlight(delta, elapsed);
  }
  if (!flightMode) controls.update();
  renderer.render(scene, camera);
  updateLabels();
}

animate();
