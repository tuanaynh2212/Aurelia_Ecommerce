import * as THREE from "three";
import { MEADOW_HEX } from "./palette";

export type AtelierAmbience = "day" | "twilight";

export interface MeadowSlotPoint {
  position: [number, number, number];
  rotationY: number;
}

export const POOL_CENTER_X = 0;
export const POOL_CENTER_Z = 0.85;
export const POOL_RADIUS_X = 2.75;
export const POOL_RADIUS_Z = 1.48;

export function toCssHex(val: number): string {
  return `#${val.toString(16).padStart(6, "0")}`;
}

export function toRgba(hex: number, alpha: number): string {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

export function createSeededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Deterministic layered organic harmonic FBM noise in [-1, 1]. */
export function meadowFbm(x: number, z: number): number {
  const f1 = Math.sin(x * 0.14 + 0.4) * Math.cos(z * 0.12 - 0.3);
  const f2 = 0.52 * Math.sin(x * 0.29 - z * 0.22 + 1.1);
  const f3 = 0.28 * Math.cos(x * 0.58 + z * 0.51 + 2.3);
  const f4 = 0.14 * Math.sin(x * 1.15 - z * 0.96);
  return (f1 + f2 + f3 + f4) / 1.94;
}

/**
 * Evaluates natural terrain relief height relative to `floorY`:
 * - Shallow smooth crescent hollow beneath the reflecting pond
 * - Flat gentle clearing under plinths & exhibition arc
 * - Sweeping rolling hills & sheltered amphitheater perimeter
 */
export function getMeadowHeightOffset(
  x: number,
  z: number,
  slots: MeadowSlotPoint[]
): number {
  // 1. Reflecting water basin depression
  const px = (x - POOL_CENTER_X) / POOL_RADIUS_X;
  const pz = (z - POOL_CENTER_Z) / POOL_RADIUS_Z;
  const poolDist = Math.sqrt(px * px + pz * pz);
  const basinDepth = (1 - smoothstep(0.68, 1.18, poolDist)) * -0.14;

  // 2. Keep slot stepping stones cleanly grounded near floorY
  let slotFlatMask = 1;
  for (let i = 0; i < slots.length; i += 1) {
    const dx = x - slots[i].position[0];
    const dz = z - slots[i].position[2];
    const d = Math.sqrt(dx * dx + dz * dz);
    slotFlatMask = Math.min(slotFlatMask, smoothstep(0.95, 2.5, d));
  }

  // 3. Courtyard glade clearance -> gently rising meadow hills in rear & flanks
  const radial = Math.sqrt(x * x + (z + 0.8) * (z + 0.8));
  const courtyardMask = smoothstep(5.8, 15.5, radial);

  const noise = meadowFbm(x, z);
  const rearBias = smoothstep(2.0, -18.0, z) * 2.25;
  const amphitheaterRise =
    courtyardMask * (1.2 + rearBias + noise * 1.85) +
    smoothstep(14.0, 32.0, radial) * (1.45 + Math.max(0, noise) * 2.3);

  // Subtle organic earth ripple even across glade edges
  const microWave =
    (1 - (1 - slotFlatMask) * 0.85) *
    smoothstep(0.95, 1.45, poolDist) *
    (meadowFbm(x * 2.4, z * 2.4) * 0.045);

  return basinDepth + amphitheaterRise * slotFlatMask + microWave;
}

/**
 * Sculpted Meadow Amphitheater Terrain Geometry with rich humus, emerald slope,
 * sunlit ridge, and misty perimeter vertex color blending.
 */
export function buildSculptedMeadowTerrainGeometry(
  floorY: number,
  slots: MeadowSlotPoint[],
  size = 76,
  segments = 112
): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(size, size, segments, segments);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position as THREE.BufferAttribute;
  const count = pos.count;
  const colors = new Float32Array(count * 3);

  const cSoil = new THREE.Color(MEADOW_HEX.soilRich);
  const cMoss = new THREE.Color(MEADOW_HEX.soilMoss);
  const cLawnMid = new THREE.Color(MEADOW_HEX.lawnMid);
  const cLawnLit = new THREE.Color(MEADOW_HEX.lawnLight);
  const cHillFar = new THREE.Color(MEADOW_HEX.hillFar);
  const tmpColor = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const h = getMeadowHeightOffset(x, z, slots);
    pos.setY(i, floorY + h);

    const radial = Math.sqrt(x * x + (z + 0.8) * (z + 0.8));
    const n = meadowFbm(x * 1.7 + 4.1, z * 1.7 - 2.6) * 0.5 + 0.5;

    if (h < -0.02) {
      tmpColor.copy(cSoil).lerp(cMoss, smoothstep(-0.14, 0.0, h));
    } else {
      tmpColor.copy(cLawnMid).lerp(cMoss, n * 0.42);
      const ridgeSun = smoothstep(0.4, 3.2, h) * (0.35 + 0.45 * n);
      tmpColor.lerp(cLawnLit, Math.min(0.68, ridgeSun));
      const farFade = smoothstep(18, 34, radial);
      tmpColor.lerp(cHillFar, farFade * 0.72);
    }

    colors[i * 3] = tmpColor.r;
    colors[i * 3 + 1] = tmpColor.g;
    colors[i * 3 + 2] = tmpColor.b;
  }

  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

/**
 * Natural 3-blade curved arched meadow grass tuft (18+ segments per instance)
 * with custom attributes (`aTip`, `aBladeSeed`) for smooth wind-wave propagation
 * and root-to-tip lighting.
 */
export function buildCurvedGrassTuftGeometry(): THREE.BufferGeometry {
  const segments = 4;
  const blades: { yaw: number; lean: number; width: number; height: number; seed: number }[] = [
    { yaw: 0.15, lean: 0.14, width: 0.026, height: 0.44, seed: 0.18 },
    { yaw: 2.25, lean: 0.19, width: 0.022, height: 0.37, seed: 0.54 },
    { yaw: 4.35, lean: 0.16, width: 0.024, height: 0.41, seed: 0.89 },
  ];

  const positions: number[] = [];
  const normals: number[] = [];
  const tips: number[] = [];
  const bladeSeeds: number[] = [];
  const indices: number[] = [];

  let vertexOffset = 0;

  blades.forEach((b) => {
    const cosY = Math.cos(b.yaw);
    const sinY = Math.sin(b.yaw);

    for (let s = 0; s <= segments; s += 1) {
      const t = s / segments;
      const halfW = b.width * 0.5 * (1 - t * 0.92);
      const y = b.height * (t - 0.08 * t * t);
      const arch = b.lean * (t * t);

      // Local right vector across blade width
      const rx = cosY;
      const rz = -sinY;
      // Local forward curve vector along blade arch
      const fx = sinY * arch;
      const fz = cosY * arch;

      // Approximate bent surface normal facing upward & outward
      const ny = 0.25 + 0.75 * (1 - t);
      const nx = sinY * (0.4 + 0.4 * t);
      const nz = cosY * (0.4 + 0.4 * t);
      const len = Math.hypot(nx, ny, nz) || 1;

      // Left edge vertex
      positions.push(fx - rx * halfW, y, fz - rz * halfW);
      normals.push(nx / len, ny / len, nz / len);
      tips.push(t);
      bladeSeeds.push(b.seed);

      // Right edge vertex
      positions.push(fx + rx * halfW, y, fz + rz * halfW);
      normals.push(nx / len, ny / len, nz / len);
      tips.push(t);
      bladeSeeds.push(b.seed);
    }

    for (let s = 0; s < segments; s += 1) {
      const i0 = vertexOffset + s * 2;
      const i1 = i0 + 1;
      const i2 = i0 + 2;
      const i3 = i0 + 3;
      indices.push(i0, i1, i2, i1, i3, i2);
    }

    vertexOffset += (segments + 1) * 2;
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("aTip", new THREE.Float32BufferAttribute(tips, 1));
  geo.setAttribute("aBladeSeed", new THREE.Float32BufferAttribute(bladeSeeds, 1));
  geo.setIndex(indices);
  return geo;
}

/**
 * Multi-plane curved botanical foil geometry (`planes` vertical bowed strips at evenly
 * spaced golden angles) so flower sprays, pampas plumes, and ferns read cleanly 3D
 * from any orbit angle while bending organically in the vertex wind shader.
 */
export function buildCrossedBotanicalClusterGeometry(
  planes = 3,
  width = 0.85,
  height = 0.95,
  bow = 0.08
): THREE.BufferGeometry {
  const segY = 4;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  let vOffset = 0;

  for (let p = 0; p < planes; p += 1) {
    const angle = (p * Math.PI) / planes;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const bendDir = p % 2 === 0 ? 1 : -1;

    for (let iy = 0; iy <= segY; iy += 1) {
      const v = iy / segY;
      const y = v * height;
      const archOffset = bow * (v * v) * bendDir;
      const tiltSpread = 0.04 * v * bendDir;

      for (let ix = 0; ix <= 1; ix += 1) {
        const u = ix;
        const lx = (u - 0.5) * width;
        const wx = lx * cosA - (archOffset + tiltSpread) * sinA;
        const wz = lx * sinA + (archOffset + tiltSpread) * cosA;

        positions.push(wx, y, wz);
        normals.push(-sinA, 0.35 + v * 0.45, cosA);
        uvs.push(u, v);
      }
    }

    for (let iy = 0; iy < segY; iy += 1) {
      const a = vOffset + iy * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, c, b, d, c);
    }
    vOffset += (segY + 1) * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/** Natural carved undulating travertine / fieldstone slab geometry. */
export function buildOrganicFlagstoneGeometry(
  seed: number,
  rx = 0.54,
  rz = 0.46,
  thickness = 0.08
): THREE.BufferGeometry {
  const rng = createSeededRng(seed);
  const sides = 16;
  const shape = new THREE.Shape();
  const phase1 = rng() * Math.PI * 2;
  const phase2 = rng() * Math.PI * 2;

  for (let i = 0; i <= sides; i += 1) {
    const th = (i / sides) * Math.PI * 2;
    const wobble =
      1 +
      0.11 * Math.sin(th * 3 + phase1) +
      0.07 * Math.cos(th * 5 + phase2) +
      (rng() - 0.5) * 0.04;
    const x = Math.cos(th) * rx * wobble;
    const y = Math.sin(th) * rz * wobble;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.022,
  });
  geo.rotateX(-Math.PI / 2);
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

/** Organic reflecting pond horizontal shape in XY plane (rotated [-PI/2, 0, 0]). */
export function buildReflectingBasinShapeGeometry(): THREE.ShapeGeometry {
  const segments = 56;
  const shape = new THREE.Shape();
  for (let i = 0; i <= segments; i += 1) {
    const th = (i / segments) * Math.PI * 2;
    const organic =
      1 +
      0.09 * Math.sin(th * 2 + 0.6) +
      0.05 * Math.cos(th * 3 - 0.9) +
      0.03 * Math.sin(th * 5 + 1.2);
    const x = Math.cos(th) * POOL_RADIUS_X * organic;
    const y = Math.sin(th) * POOL_RADIUS_Z * organic;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  return new THREE.ShapeGeometry(shape, 24);
}

/** Hand-blown teardrop glass lantern vessel geometry. */
export function buildTeardropLanternGeometry(): THREE.LatheGeometry {
  const pts = [
    new THREE.Vector2(0.001, -0.11),
    new THREE.Vector2(0.038, -0.095),
    new THREE.Vector2(0.068, -0.055),
    new THREE.Vector2(0.072, -0.01),
    new THREE.Vector2(0.054, 0.045),
    new THREE.Vector2(0.026, 0.095),
    new THREE.Vector2(0.02, 0.12),
  ];
  return new THREE.LatheGeometry(pts, 18);
}

// ---------------------------------------------------------------------------
// High-Resolution Painterly & Botanical Canvas Texture Atelier
// ---------------------------------------------------------------------------

export function createMeadowTerrainTexture(
  ambience: AtelierAmbience
): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle =
      ambience === "day"
        ? toCssHex(MEADOW_HEX.lawnMid)
        : toCssHex(MEADOW_HEX.lawnDeep);
    ctx.fillRect(0, 0, size, size);

    const rng = createSeededRng(41029);

    // 1. Soft painterly humus & moss mottling clouds
    for (let i = 0; i < 420; i += 1) {
      const px = rng() * size;
      const py = rng() * size;
      const rad = 18 + rng() * 54;
      const grad = ctx.createRadialGradient(px, py, 2, px, py, rad);
      const tone =
        rng() > 0.52
          ? MEADOW_HEX.lawnLight
          : rng() > 0.35
          ? MEADOW_HEX.soilMoss
          : MEADOW_HEX.soilRich;
      grad.addColorStop(0, toRgba(tone, ambience === "day" ? 0.24 : 0.28));
      grad.addColorStop(1, toRgba(tone, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Thousands of organic layered turf brush-strokes & dry straw threads
    ctx.lineCap = "round";
    for (let i = 0; i < 9500; i += 1) {
      const x = rng() * size;
      const y = rng() * size;
      const len = 4 + rng() * 14;
      const ang = (rng() - 0.5) * Math.PI * 1.4;
      const pick = rng();
      const col =
        pick > 0.84
          ? MEADOW_HEX.strawGold
          : pick > 0.45
          ? MEADOW_HEX.lawnLight
          : pick > 0.16
          ? MEADOW_HEX.foliageMid
          : MEADOW_HEX.soilRich;
      ctx.strokeStyle = toRgba(col, ambience === "day" ? 0.22 + rng() * 0.22 : 0.18);
      ctx.lineWidth = 0.7 + rng() * 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(
        x + Math.cos(ang + 0.3) * len * 0.5,
        y + Math.sin(ang + 0.3) * len * 0.5,
        x + Math.cos(ang) * len,
        y + Math.sin(ang) * len
      );
      ctx.stroke();
    }

    // 3. Scattered tiny wild clover clusters & fallen flower petals
    for (let i = 0; i < 620; i += 1) {
      const px = rng() * size;
      const py = rng() * size;
      const petal = i % 7 === 0;
      ctx.fillStyle = petal
        ? toRgba(
            rng() > 0.5 ? MEADOW_HEX.petalPink : MEADOW_HEX.petalCream,
            ambience === "day" ? 0.38 : 0.18
          )
        : toRgba(MEADOW_HEX.foliageSage, ambience === "day" ? 0.3 : 0.22);
      ctx.beginPath();
      ctx.ellipse(px, py, 1.5 + rng() * 2.5, 1 + rng() * 1.6, rng() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(9, 9);
  tex.anisotropy = 8;
  return tex;
}

export function createMeadowBumpTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = toCssHex(MEADOW_HEX.stoneWarm);
    ctx.fillRect(0, 0, size, size);
    const rng = createSeededRng(7331);
    for (let i = 0; i < 4200; i += 1) {
      const x = rng() * size;
      const y = rng() * size;
      const r = 1 + rng() * 4.5;
      ctx.fillStyle =
        rng() > 0.5
          ? toRgba(MEADOW_HEX.petalCream, 0.22)
          : toRgba(MEADOW_HEX.soilRich, 0.24);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(9, 9);
  return tex;
}

export function createTravertineStoneTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = toCssHex(MEADOW_HEX.stoneCream);
    ctx.fillRect(0, 0, size, size);
    const rng = createSeededRng(5521);

    // Sedimentary limestone strata & pores
    for (let i = 0; i < 240; i += 1) {
      const y = rng() * size;
      const h = 3 + rng() * 14;
      ctx.fillStyle = toRgba(
        rng() > 0.5 ? MEADOW_HEX.stoneWarm : MEADOW_HEX.stoneRim,
        0.14 + rng() * 0.16
      );
      ctx.fillRect(0, y, size, h);
    }
    for (let i = 0; i < 1200; i += 1) {
      const x = rng() * size;
      const y = rng() * size;
      ctx.fillStyle = toRgba(
        i % 9 === 0 ? MEADOW_HEX.soilMoss : MEADOW_HEX.stoneRim,
        i % 9 === 0 ? 0.22 : 0.26
      );
      ctx.beginPath();
      ctx.ellipse(x, y, 1 + rng() * 4, 0.8 + rng() * 1.8, rng() * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

/** Paints one translucent striated botanical flower blossom onto ctx. */
function drawCosmosBloom(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  tiltX: number,
  tiltRot: number,
  outerHex: number,
  innerHex: number,
  centerHex: number
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tiltRot);
  ctx.scale(1, tiltX);

  const petals = 8;
  for (let p = 0; p < petals; p += 1) {
    const a = (p / petals) * Math.PI * 2;
    ctx.save();
    ctx.rotate(a);

    const grad = ctx.createLinearGradient(0, 0, 0, -radius);
    grad.addColorStop(0, toCssHex(innerHex));
    grad.addColorStop(0.65, toCssHex(outerHex));
    grad.addColorStop(1, toRgba(MEADOW_HEX.petalCream, 0.94));

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-radius * 0.34, -radius * 0.38, -radius * 0.28, -radius * 0.94, 0, -radius);
    ctx.bezierCurveTo(radius * 0.28, -radius * 0.94, radius * 0.34, -radius * 0.38, 0, 0);
    ctx.fill();

    // Fine delicate petal vein highlight
    ctx.strokeStyle = toRgba(MEADOW_HEX.petalPollenDark, 0.16);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.12);
    ctx.lineTo(0, -radius * 0.78);
    ctx.stroke();

    ctx.restore();
  }

  // Velvety dark calyx shadow + golden stamen center
  ctx.fillStyle = toCssHex(MEADOW_HEX.petalPollenDark);
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.21, 0, Math.PI * 2);
  ctx.fill();

  const stamenGrad = ctx.createRadialGradient(-2, -2, 1, 0, 0, radius * 0.18);
  stamenGrad.addColorStop(0, toCssHex(MEADOW_HEX.petalCream));
  stamenGrad.addColorStop(0.55, toCssHex(centerHex));
  stamenGrad.addColorStop(1, toCssHex(MEADOW_HEX.petalPollenDark));
  ctx.fillStyle = stamenGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.17, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** Botanical Specimen A: Branching Wild Cosmos & Anemone Bouquet (512×512 RGBA). */
export function createCosmosSprayTexture(ambience: AtelierAmbience): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    const rng = createSeededRng(10472);
    const stemCol = ambience === "day" ? MEADOW_HEX.foliageMid : MEADOW_HEX.lawnDeep;
    const leafLit = ambience === "day" ? MEADOW_HEX.foliageLight : MEADOW_HEX.foliageSage;

    // Fine stems rising from bottom root center
    const stems = [
      { cx: 215, cy: 295, tx: 145, ty: 150, r: 46, scaleY: 0.85, rot: -0.2 },
      { cx: 256, cy: 260, tx: 258, ty: 108, r: 58, scaleY: 0.92, rot: 0.1 },
      { cx: 295, cy: 280, tx: 372, ty: 165, r: 48, scaleY: 0.78, rot: 0.3 },
      { cx: 235, cy: 330, tx: 196, ty: 246, r: 36, scaleY: 0.96, rot: -0.4 },
      { cx: 282, cy: 320, tx: 332, ty: 254, r: 38, scaleY: 0.86, rot: 0.25 },
    ];

    stems.forEach((s) => {
      ctx.strokeStyle = toCssHex(stemCol);
      ctx.lineWidth = 4.2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(256, 508);
      ctx.quadraticCurveTo(s.cx, s.cy, s.tx, s.ty);
      ctx.stroke();

      // Delicate feathery foliage sprigs off lower stem
      for (let f = 0; f < 5; f += 1) {
        const ly = 325 + f * 34;
        const lx = 256 + (s.tx - 256) * ((508 - ly) / (508 - s.ty)) * 0.45;
        const dir = (f % 2 === 0 ? -1 : 1) * (24 + rng() * 28);
        ctx.strokeStyle = toCssHex(f % 2 === 0 ? leafLit : stemCol);
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.quadraticCurveTo(lx + dir * 0.6, ly - 16, lx + dir, ly - 8 - rng() * 14);
        ctx.stroke();
      }
    });

    // Lower meadow grass collar for clean soil grounding
    for (let g = 0; g < 18; g += 1) {
      const gx = 200 + rng() * 112;
      const tipX = gx + (rng() - 0.5) * 90;
      const tipY = 390 + rng() * 55;
      ctx.strokeStyle = toRgba(g % 2 === 0 ? stemCol : leafLit, 0.9);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(gx, 512);
      ctx.quadraticCurveTo((gx + tipX) * 0.5, 455, tipX, tipY);
      ctx.stroke();
    }

    // Layered multi-petal blossoms (white/ivory base so per-instance tint reads true & luminous!)
    drawCosmosBloom(ctx, 145, 150, 48, 0.86, -0.25, MEADOW_HEX.petalCream, MEADOW_HEX.petalPink, MEADOW_HEX.petalGold);
    drawCosmosBloom(ctx, 372, 165, 46, 0.82, 0.35, MEADOW_HEX.petalCream, MEADOW_HEX.petalPink, MEADOW_HEX.petalGold);
    drawCosmosBloom(ctx, 258, 108, 56, 0.94, 0.08, MEADOW_HEX.petalCream, MEADOW_HEX.petalCream, MEADOW_HEX.petalGold);
    drawCosmosBloom(ctx, 196, 246, 36, 0.92, -0.4, MEADOW_HEX.petalPink, MEADOW_HEX.petalRose, MEADOW_HEX.petalGold);
    drawCosmosBloom(ctx, 332, 254, 38, 0.88, 0.25, MEADOW_HEX.petalCream, MEADOW_HEX.petalCoral, MEADOW_HEX.petalGold);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Botanical Specimen B: Provence Lavender & Delphinium Spires (512×512 RGBA). */
export function createLavenderSpireTexture(ambience: AtelierAmbience): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    const rng = createSeededRng(22341);
    const sageCol = ambience === "day" ? MEADOW_HEX.foliageSage : MEADOW_HEX.foliageMid;
    const stemCol = ambience === "day" ? MEADOW_HEX.foliageMid : MEADOW_HEX.lawnDeep;

    // Silvery sage basal rosette blades
    for (let i = 0; i < 24; i += 1) {
      const gx = 195 + rng() * 122;
      const tipX = gx + (gx - 256) * 0.95 + (rng() - 0.5) * 28;
      const tipY = 305 + rng() * 90;
      ctx.strokeStyle = toCssHex(i % 2 === 0 ? sageCol : stemCol);
      ctx.lineWidth = 4.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(256 + (gx - 256) * 0.3, 512);
      ctx.quadraticCurveTo(gx, 415, tipX, tipY);
      ctx.stroke();
    }

    // 7 slender flowering spikes
    const spikes = [
      { bx: 236, tx: 168, ty: 155, len: 130 },
      { bx: 246, tx: 214, ty: 102, len: 145 },
      { bx: 256, tx: 256, ty: 68, len: 165 },
      { bx: 266, tx: 300, ty: 112, len: 140 },
      { bx: 276, tx: 344, ty: 166, len: 122 },
    ];

    spikes.forEach((sp, si) => {
      ctx.strokeStyle = toCssHex(stemCol);
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(sp.bx, 498);
      ctx.quadraticCurveTo((sp.bx + sp.tx) * 0.5, 300, sp.tx, sp.ty);
      ctx.stroke();

      // Clusters of lavender florets cascading down upper spire
      const steps = 16;
      for (let k = 0; k < steps; k += 1) {
        const u = k / steps;
        const fy = sp.ty + u * sp.len;
        const fx = sp.tx + (sp.bx - sp.tx) * (u * 0.35);
        const taper = Math.sin(u * Math.PI * 0.85) * 0.65 + 0.35;
        for (let side = -1; side <= 1; side += 1) {
          const ox = side * (3 + rng() * 8) * taper;
          const oy = (rng() - 0.5) * 6;
          const flCol =
            u < 0.35
              ? MEADOW_HEX.petalLavender
              : si % 2 === 0
              ? MEADOW_HEX.petalViolet
              : MEADOW_HEX.petalLavender;
          ctx.fillStyle = toRgba(flCol, 0.94);
          ctx.beginPath();
          ctx.ellipse(fx + ox, fy + oy, 6.2 * taper, 8.2 * taper, side * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Botanical Specimen C: Silky Editorial Pampas Grass & Feather Reed (512×512 RGBA). */
export function createPampasPlumeTexture(ambience: AtelierAmbience): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    const rng = createSeededRng(33019);
    const reedStem = ambience === "day" ? MEADOW_HEX.pampasTaupe : MEADOW_HEX.foliageMid;
    const reedLeaf = ambience === "day" ? MEADOW_HEX.foliageSage : MEADOW_HEX.lawnDeep;

    // Arching narrow basal reed leaves
    for (let i = 0; i < 18; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const tipX = 256 + side * (85 + rng() * 115);
      const tipY = 260 + rng() * 145;
      ctx.strokeStyle = toCssHex(i % 3 === 0 ? MEADOW_HEX.strawGold : reedLeaf);
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(256 + (rng() - 0.5) * 28, 512);
      ctx.quadraticCurveTo(256 + side * 42, 340, tipX, tipY);
      ctx.stroke();
    }

    // 3 Silky Feathered Plumes arcing in the breeze
    const plumes = [
      { bx: 242, cx: 215, tx: 175, ty: 108, curve: -0.22 },
      { bx: 256, cx: 262, tx: 274, ty: 54, curve: 0.12 },
      { bx: 268, cx: 306, tx: 356, ty: 126, curve: 0.28 },
    ];

    plumes.forEach((p) => {
      // Bamboo reed stalk
      ctx.strokeStyle = toCssHex(reedStem);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(p.bx, 510);
      ctx.quadraticCurveTo(p.cx, 290, p.tx, p.ty);
      ctx.stroke();

      // Hundreds of backlit champagne silk plume fibers along upper 45%
      for (let f = 0; f < 170; f += 1) {
        const t = rng();
        const py = p.ty + t * 175;
        const px = p.tx + (p.cx - p.tx) * (t * 0.55) + p.curve * (1 - t) * 18;
        const spread = Math.sin(t * Math.PI * 0.92) * 34 + 6;
        const dir = rng() > 0.5 ? 1 : -1;
        const fLen = spread * (0.65 + rng() * 0.55);
        const fCol =
          rng() > 0.38
            ? MEADOW_HEX.pampasCream
            : rng() > 0.2
            ? MEADOW_HEX.pampasGold
            : MEADOW_HEX.pampasTaupe;
        ctx.strokeStyle = toRgba(fCol, ambience === "day" ? 0.58 : 0.42);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.quadraticCurveTo(
          px + dir * fLen * 0.5,
          py - 12,
          px + dir * fLen,
          py - 22 - rng() * 14
        );
        ctx.stroke();
      }
    });
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Botanical Specimen D: Lush Woodland Bracken Fern Frond Rosette (512×512 RGBA). */
export function createFernFrondTexture(ambience: AtelierAmbience): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    const frondMain = ambience === "day" ? MEADOW_HEX.foliageMid : MEADOW_HEX.lawnDeep;
    const frondTip = ambience === "day" ? MEADOW_HEX.foliageLight : MEADOW_HEX.foliageSage;
    const frondShade = MEADOW_HEX.foliageDark;

    const fronds = [
      { tipX: 98, tipY: 245, midX: 168, midY: 325, scale: 0.85 },
      { tipX: 168, tipY: 122, midX: 205, midY: 270, scale: 0.96 },
      { tipX: 256, tipY: 74, midX: 254, midY: 250, scale: 1.05 },
      { tipX: 350, tipY: 132, midX: 306, midY: 272, scale: 0.94 },
      { tipX: 416, tipY: 250, midX: 344, midY: 328, scale: 0.84 },
    ];

    fronds.forEach((fr, fi) => {
      const steps = 22;
      // Central frond stem
      ctx.strokeStyle = toCssHex(frondShade);
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(256, 510);
      ctx.quadraticCurveTo(fr.midX, fr.midY, fr.tipX, fr.tipY);
      ctx.stroke();

      for (let k = 3; k < steps; k += 1) {
        const t = k / steps;
        const u = 1 - t;
        const sx = u * u * 256 + 2 * u * t * fr.midX + t * t * fr.tipX;
        const sy = u * u * 510 + 2 * u * t * fr.midY + t * t * fr.tipY;
        const dx = 2 * u * (fr.midX - 256) + 2 * t * (fr.tipX - fr.midX);
        const dy = 2 * u * (fr.midY - 510) + 2 * t * (fr.tipY - fr.midY);
        const ang = Math.atan2(dy, dx);
        const pinnaLen = Math.sin(t * Math.PI * 0.95) * 44 * fr.scale;

        for (const side of [-1, 1]) {
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(ang + side * 1.12);
          const col =
            t > 0.7 || fi === 2 ? frondTip : fi % 2 === 0 ? frondMain : frondShade;
          ctx.fillStyle = toCssHex(col);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(pinnaLen * 0.35, -5.5, pinnaLen * 0.78, -4.5, pinnaLen, 0);
          ctx.bezierCurveTo(pinnaLen * 0.78, 4.5, pinnaLen * 0.35, 5.5, 0, 0);
          ctx.fill();
          ctx.restore();
        }
      }
    });
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Cascading Conservatory Vine & Jasmine Garland (512×512 RGBA, anchored at TOP edge). */
export function createTrailingVineTexture(ambience: AtelierAmbience): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    const rng = createSeededRng(44921);
    const leafDark = MEADOW_HEX.foliageDark;
    const leafMid = ambience === "day" ? MEADOW_HEX.foliageMid : MEADOW_HEX.lawnDeep;
    const leafLit = ambience === "day" ? MEADOW_HEX.foliageLight : MEADOW_HEX.foliageSage;

    const tendrils = [
      { sx: 110, ex: 138, len: 360 },
      { sx: 196, ex: 185, len: 460 },
      { sx: 268, ex: 276, len: 495 },
      { sx: 348, ex: 332, len: 410 },
      { sx: 415, ex: 398, len: 320 },
    ];

    tendrils.forEach((tr) => {
      ctx.strokeStyle = toCssHex(leafDark);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tr.sx, 0);
      ctx.bezierCurveTo(
        tr.sx - 18,
        tr.len * 0.35,
        tr.ex + 22,
        tr.len * 0.7,
        tr.ex,
        tr.len
      );
      ctx.stroke();

      const leafCount = Math.floor(tr.len / 22);
      for (let i = 0; i < leafCount; i += 1) {
        const u = i / leafCount;
        const y = u * tr.len;
        const x = tr.sx + (tr.ex - tr.sx) * u + Math.sin(u * 6.5) * 14;
        const side = i % 2 === 0 ? -1 : 1;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(side * (0.45 + rng() * 0.5));
        ctx.fillStyle = toCssHex(
          i % 3 === 0 ? leafLit : i % 2 === 0 ? leafMid : leafDark
        );
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(side * 16, -6, side * 26, 6, side * 24, 16);
        ctx.bezierCurveTo(side * 12, 16, side * 4, 8, 0, 0);
        ctx.fill();
        ctx.restore();

        // Occasional starry white jasmine flower
        if (i % 4 === 2) {
          drawCosmosBloom(
            ctx,
            x + side * 12,
            y + 4,
            13,
            1.0,
            rng() * Math.PI,
            MEADOW_HEX.petalCream,
            MEADOW_HEX.petalPink,
            MEADOW_HEX.petalGold
          );
        }
      }
    });
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Sunlit Silver-Olive / Birch Tree Leaf Canopy Card (512×512 RGBA). */
export function createCanopyClusterTexture(ambience: AtelierAmbience): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    const rng = createSeededRng(88421);

    // Fine organic twig skeleton inside crown
    ctx.strokeStyle = toCssHex(MEADOW_HEX.barkDark);
    ctx.lineCap = "round";
    for (let b = 0; b < 7; b += 1) {
      const ang = -Math.PI * 0.85 + (b / 6) * Math.PI * 0.7;
      ctx.lineWidth = 4 - Math.abs(b - 3) * 0.5;
      ctx.beginPath();
      ctx.moveTo(256, 460);
      ctx.quadraticCurveTo(
        256 + Math.cos(ang) * 95,
        295,
        256 + Math.cos(ang) * 185,
        250 + Math.sin(ang) * 165
      );
      ctx.stroke();
    }

    // Dappled airy clusters of oval olive/birch leaves
    for (let i = 0; i < 420; i += 1) {
      const a = rng() * Math.PI * 2;
      const dist = Math.sqrt(rng()) * 195;
      const x = 256 + Math.cos(a) * dist * 1.05;
      const y = 248 + Math.sin(a) * dist * 0.88;
      if (y > 460 || x < 24 || x > 488 || y < 24) continue;

      const isTopLit = y < 235;
      const col = isTopLit
        ? ambience === "day"
          ? rng() > 0.35
            ? MEADOW_HEX.foliageLight
            : MEADOW_HEX.foliageSage
          : MEADOW_HEX.foliageMid
        : rng() > 0.45
        ? MEADOW_HEX.foliageMid
        : MEADOW_HEX.foliageDark;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rng() * Math.PI * 2);
      ctx.fillStyle = toRgba(col, 0.92);
      ctx.beginPath();
      ctx.ellipse(0, 0, 11 + rng() * 9, 5 + rng() * 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Soft Painterly Translucent Horizon Cloud Veil (1024×512 RGBA). */
export function createCloudVeilTexture(ambience: AtelierAmbience): THREE.CanvasTexture {
  const w = 1024;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, w, h);
    const rng = createSeededRng(66109);
    const puffs = 74;
    for (let i = 0; i < puffs; i += 1) {
      const u = i / puffs;
      const cx = 140 + u * 744 + (rng() - 0.5) * 60;
      const cy = 265 - Math.sin(u * Math.PI) * 90 + (rng() - 0.5) * 48;
      const rx = 65 + Math.sin(u * Math.PI) * 75 + rng() * 45;
      const ry = 35 + Math.sin(u * Math.PI) * 44 + rng() * 24;

      const grad = ctx.createRadialGradient(cx, cy - ry * 0.25, 4, cx, cy, Math.max(rx, ry));
      if (ambience === "day") {
        grad.addColorStop(0, toRgba(MEADOW_HEX.cloudLit, 0.44));
        grad.addColorStop(0.55, toRgba(MEADOW_HEX.sunWarm, 0.2));
        grad.addColorStop(1, toRgba(MEADOW_HEX.cloudShadow, 0));
      } else {
        grad.addColorStop(0, toRgba(MEADOW_HEX.cloudShadow, 0.22));
        grad.addColorStop(0.6, toRgba(MEADOW_HEX.skyNightHorizon, 0.1));
        grad.addColorStop(1, toRgba(MEADOW_HEX.skyNight, 0));
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Organic Calm Water Breeze Ripple Map for Reflecting Basin. */
export function createWaterNormalRipplesTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = toCssHex(MEADOW_HEX.stoneWarm);
    ctx.fillRect(0, 0, size, size);
    const rng = createSeededRng(91827);
    for (let i = 0; i < 620; i += 1) {
      const y = rng() * size;
      const x = rng() * size;
      const rw = 26 + rng() * 72;
      const rh = 1.2 + rng() * 2.4;
      ctx.fillStyle = toRgba(
        rng() > 0.5 ? MEADOW_HEX.petalCream : MEADOW_HEX.skyDay,
        0.16
      );
      ctx.beginPath();
      ctx.ellipse(x, y, rw, rh, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  return tex;
}

