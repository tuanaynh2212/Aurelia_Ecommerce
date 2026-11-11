import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import {
  buildCrossedBotanicalClusterGeometry,
  buildCurvedGrassTuftGeometry,
  buildOrganicFlagstoneGeometry,
  buildReflectingBasinShapeGeometry,
  buildSculptedMeadowTerrainGeometry,
  buildTeardropLanternGeometry,
  createCanopyClusterTexture,
  createCloudVeilTexture,
  createCosmosSprayTexture,
  createFernFrondTexture,
  createLavenderSpireTexture,
  createMeadowBumpTexture,
  createMeadowTerrainTexture,
  createPampasPlumeTexture,
  createSeededRng,
  createTrailingVineTexture,
  createTravertineStoneTexture,
  createWaterNormalRipplesTexture,
  getMeadowHeightOffset,
  POOL_CENTER_X,
  POOL_CENTER_Z,
  POOL_RADIUS_X,
  POOL_RADIUS_Z,
  type AtelierAmbience,
} from "./botanicalAtelier";
import { HEX, MEADOW_HEX } from "./palette";

export type MeadowAmbience = AtelierAmbience;

export interface MeadowSlotAnchor {
  position: [number, number, number];
  rotationY: number;
}

export interface BotanicalMeadowStageProps {
  slots: MeadowSlotAnchor[];
  railPoints: THREE.Vector3[];
  columnPositions: [number, number, number][];
  floorY: number;
  railY: number;
  ambience: MeadowAmbience;
  beamHex: number;
}

interface GrassPlacement {
  x: number;
  y: number;
  z: number;
  rotY: number;
  scaleY: number;
  scaleXZ: number;
}

interface FloraPlacement {
  x: number;
  y: number;
  z: number;
  rotY: number;
  tiltX: number;
  tiltZ: number;
  scaleXZ: number;
  scaleY: number;
  tintHex: number;
}

interface VinePlacement {
  x: number;
  y: number;
  z: number;
  rotY: number;
  scaleX: number;
  scaleY: number;
}

interface BankStonePlacement {
  x: number;
  y: number;
  z: number;
  rotY: number;
  tiltZ: number;
  scale: [number, number, number];
  toneHex: number;
}

interface MeadowTreeSpec {
  id: string;
  base: [number, number, number];
  rotY: number;
  scale: number;
}

const SKY_VERTEX_SHADER = /* glsl */ `
  varying vec3 vLocalDir;
  void main() {
    vLocalDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uZenith;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  uniform vec3 uSunColor;
  uniform vec3 uSunHalo;
  uniform vec3 uSunDir;
  uniform float uIsDay;
  uniform float uTime;
  varying vec3 vLocalDir;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    vec3 dir = normalize(vLocalDir);
    float y = clamp(dir.y, -0.15, 1.0);
    float hBlend = smoothstep(-0.04, 0.24, y);
    float zBlend = smoothstep(0.18, 0.85, y);

    vec3 sky = mix(uHorizon, uMid, hBlend);
    sky = mix(sky, uZenith, zBlend);

    // Soft Rayleigh-Mie solar bloom toward the sun direction
    float sunCos = max(0.0, dot(dir, normalize(uSunDir)));
    float wideHalo = pow(sunCos, 5.0) * (uIsDay > 0.5 ? 0.36 : 0.14);
    float innerHalo = pow(sunCos, 38.0) * (uIsDay > 0.5 ? 0.45 : 0.12);
    float sunDisc = smoothstep(0.9965, 0.9992, sunCos) * (uIsDay > 0.5 ? 1.1 : 0.28);

    sky += uSunHalo * (wideHalo + innerHalo);
    sky += uSunColor * sunDisc;

    // Gentle twilight stars above horizon
    if (uIsDay < 0.5 && y > 0.12) {
      vec2 grid = floor(vec2(atan(dir.z, dir.x), y) * 145.0);
      float starNoise = hash12(grid);
      if (starNoise > 0.9935) {
        float twinkle = 0.55 + 0.45 * sin(uTime * 2.2 + starNoise * 60.0);
        sky += uSunColor * smoothstep(0.12, 0.45, y) * twinkle * 0.65;
      }
    }

    gl_FragColor = vec4(sky, 1.0);
  }
`;

const MIST_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const MIST_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uMistColor;
  uniform float uOpacity;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 centered = (vUv - 0.5) * 2.0;
    float r = length(centered);
    float ringAlpha = smoothstep(0.26, 0.52, r) * (1.0 - smoothstep(0.68, 0.98, r));
    float ripple = 0.78 + 0.22 * sin(vUv.x * 16.0 + uTime * 0.25) * cos(vUv.y * 14.0 - uTime * 0.18);
    gl_FragColor = vec4(uMistColor, ringAlpha * ripple * uOpacity);
  }
`;

const GRASS_VERTEX_SHADER = /* glsl */ `
  attribute float aTip;
  attribute float aBladeSeed;
  uniform float uTime;
  uniform vec3 uSunDir;
  varying float vTip;
  varying float vSeed;
  varying float vSunFacing;
  varying float vFogDist;

  void main() {
    vec3 pos = position;
    vTip = aTip;

    vec4 worldRoot = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    float phase = worldRoot.x * 0.48 + worldRoot.z * 0.36 + aBladeSeed * 6.2831;

    // Rolling diagonal meadow breeze + high-frequency flutter
    float mainWave = sin(uTime * 1.45 + phase);
    float microWave = 0.36 * cos(uTime * 2.9 + worldRoot.z * 0.92 - worldRoot.x * 0.41 + aBladeSeed * 4.0);
    float bend = aTip * aTip * 0.2;

    pos.x += (mainWave + microWave) * bend;
    pos.z += (mainWave * 0.65 - microWave * 0.4) * bend;
    pos.y -= aTip * aTip * abs(mainWave) * 0.032;

    vSeed = fract(sin(dot(worldRoot.xz, vec2(12.9898, 78.233)) + aBladeSeed * 17.0) * 43758.5453);

    vec3 wNorm = normalize(mat3(instanceMatrix) * normal);
    vSunFacing = clamp(dot(wNorm, normalize(uSunDir)) * 0.5 + 0.5, 0.0, 1.0);

    vec4 mvPos = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
    vFogDist = -mvPos.z;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const GRASS_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColorRoot;
  uniform vec3 uColorMid;
  uniform vec3 uColorTip;
  uniform vec3 uColorSun;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  varying float vTip;
  varying float vSeed;
  varying float vSunFacing;
  varying float vFogDist;

  void main() {
    vec3 col = mix(uColorRoot, uColorMid, smoothstep(0.0, 0.52, vTip));
    col = mix(col, uColorTip, smoothstep(0.42, 1.0, vTip));

    // Organic dry-straw variation + golden backlit dew sheen along blade tips
    float sunGlow = pow(vTip, 1.4) * (0.18 + 0.48 * vSunFacing) * (0.45 + 0.55 * vSeed);
    col = mix(col, uColorSun, clamp(sunGlow, 0.0, 0.65));

    // Root ambient occlusion into soil
    col *= 0.68 + 0.38 * smoothstep(0.0, 0.38, vTip);

    float fogFactor = 1.0 - exp(-uFogDensity * uFogDensity * vFogDist * vFogDist);
    col = mix(col, uFogColor, clamp(fogFactor, 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
  }
`;

function createWindBotanicalMaterial(
  map: THREE.Texture,
  timeUniform: { value: number },
  sunColorHex: number,
  options: {
    anchorTop?: boolean;
    swayAmp?: number;
    alphaTest?: number;
    roughness?: number;
    backlitStrength?: number;
  } = {}
): THREE.MeshStandardMaterial {
  const {
    anchorTop = false,
    swayAmp = 0.085,
    alphaTest = 0.32,
    roughness = 0.72,
    backlitStrength = 0.24,
  } = options;

  const mat = new THREE.MeshStandardMaterial({
    map,
    alphaTest,
    side: THREE.DoubleSide,
    roughness,
    metalness: 0.02,
    color: HEX.paper,
  });

  const sunCol = new THREE.Color(sunColorHex);

  mat.customProgramCacheKey = () =>
    `aurelia-botanical-${anchorTop ? "top" : "root"}-${swayAmp.toFixed(2)}`;

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uWindTime = timeUniform;
    shader.uniforms.uSwayAmp = { value: swayAmp };
    shader.uniforms.uAnchorTop = { value: anchorTop ? 1.0 : 0.0 };
    shader.uniforms.uSunTrans = { value: sunCol };
    shader.uniforms.uBacklitStrength = { value: backlitStrength };

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        /* glsl */ `
        #include <common>
        uniform float uWindTime;
        uniform float uSwayAmp;
        uniform float uAnchorTop;
        varying float vWindWeight;
        `
      )
      .replace(
        "#include <begin_vertex>",
        /* glsl */ `
        #include <begin_vertex>
        float rawV = clamp(uv.y, 0.0, 1.0);
        float wFlex = mix(rawV, 1.0 - rawV, uAnchorTop);
        vWindWeight = wFlex;
        vec3 instOrigin = vec3(0.0);
        #ifdef USE_INSTANCING
          instOrigin = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        #endif
        float gustA = sin(uWindTime * 1.45 + instOrigin.x * 0.65 + instOrigin.z * 0.45);
        float gustB = 0.45 * cos(uWindTime * 2.55 - instOrigin.x * 0.4 + instOrigin.z * 0.85);
        float sway = (gustA + gustB) * pow(wFlex, 1.45) * uSwayAmp;
        transformed.x += sway;
        transformed.z += sway * 0.55;
        `
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        /* glsl */ `
        #include <common>
        uniform vec3 uSunTrans;
        uniform float uBacklitStrength;
        varying float vWindWeight;
        `
      )
      .replace(
        "#include <emissivemap_fragment>",
        /* glsl */ `
        #include <emissivemap_fragment>
        totalEmissiveRadiance += uSunTrans * (pow(vWindWeight, 1.2) * uBacklitStrength);
        `
      );
  };

  return mat;
}

/** Multi-branch gnarled Silver-Birch / Wild-Olive Meadow Tree with dappled canopy shadow. */
function BotanicalMeadowTree({
  spec,
  canopyTexture,
  timeUniform,
  ambience,
}: {
  spec: MeadowTreeSpec;
  canopyTexture: THREE.Texture;
  timeUniform: { value: number };
  ambience: MeadowAmbience;
}) {
  const { trunkGeo, limbGeos, canopyGeo, canopyMat, canopyDepthMat, clusters } =
    useMemo(() => {
      const trunkCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.12, 1.15, -0.06),
        new THREE.Vector3(-0.08, 2.35, 0.08),
        new THREE.Vector3(0.18, 3.45, -0.05),
      ]);
      const trunkGeo = new THREE.TubeGeometry(trunkCurve, 18, 0.12, 10, false);

      const limbs = [
        [
          new THREE.Vector3(0.02, 1.9, 0.02),
          new THREE.Vector3(-0.65, 2.75, 0.42),
          new THREE.Vector3(-1.35, 3.45, 0.65),
        ],
        [
          new THREE.Vector3(0.05, 2.25, -0.02),
          new THREE.Vector3(0.78, 3.05, -0.38),
          new THREE.Vector3(1.42, 3.68, -0.58),
        ],
        [
          new THREE.Vector3(0.12, 2.8, 0.04),
          new THREE.Vector3(0.15, 3.65, 0.68),
          new THREE.Vector3(0.32, 4.18, 1.05),
        ],
      ];
      const limbGeos = limbs.map(
        (pts) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.058, 8, false)
      );

      const canopyGeo = buildCrossedBotanicalClusterGeometry(3, 2.3, 1.95, 0.14);
      const canopyMat = createWindBotanicalMaterial(
        canopyTexture,
        timeUniform,
        ambience === "day" ? MEADOW_HEX.sunWarm : MEADOW_HEX.skyNightHorizon,
        {
          swayAmp: 0.055,
          alphaTest: 0.36,
          roughness: 0.78,
          backlitStrength: ambience === "day" ? 0.2 : 0.05,
        }
      );
      const canopyDepthMat = new THREE.MeshDepthMaterial({
        depthPacking: THREE.RGBADepthPacking,
        map: canopyTexture,
        alphaTest: 0.36,
      });

      const clusters = [
        { pos: [-1.2, 3.15, 0.58] as [number, number, number], scale: 1.05, rotY: 0.2 },
        { pos: [1.3, 3.35, -0.52] as [number, number, number], scale: 0.98, rotY: 1.4 },
        { pos: [0.18, 3.62, 0.12] as [number, number, number], scale: 1.24, rotY: 2.3 },
        { pos: [0.25, 3.9, 0.85] as [number, number, number], scale: 0.9, rotY: 0.85 },
      ];

      return { trunkGeo, limbGeos, canopyGeo, canopyMat, canopyDepthMat, clusters };
    }, [canopyTexture, timeUniform, ambience]);

  useEffect(() => {
    return () => {
      trunkGeo.dispose();
      limbGeos.forEach((g) => g.dispose());
      canopyGeo.dispose();
      canopyMat.dispose();
      canopyDepthMat.dispose();
    };
  }, [trunkGeo, limbGeos, canopyGeo, canopyMat, canopyDepthMat]);

  return (
    <group position={spec.base} rotation={[0, spec.rotY, 0]} scale={spec.scale}>
      <mesh geometry={trunkGeo} castShadow receiveShadow>
        <meshStandardMaterial color={MEADOW_HEX.barkBirch} roughness={0.92} />
      </mesh>
      {limbGeos.map((geo, idx) => (
        <mesh key={`${spec.id}-limb-${idx}`} geometry={geo} castShadow receiveShadow>
          <meshStandardMaterial color={MEADOW_HEX.barkDark} roughness={0.9} />
        </mesh>
      ))}
      {clusters.map((cl, idx) => (
        <mesh
          key={`${spec.id}-canopy-${idx}`}
          position={cl.pos}
          rotation={[0, cl.rotY, 0]}
          scale={cl.scale}
          geometry={canopyGeo}
          material={canopyMat}
          customDepthMaterial={canopyDepthMat}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

/**
 * Artistic Photorealistic Meadow Sanctuary Backdrop:
 * - Custom Atmospheric Rayleigh-Mie Sky Dome & Drifting Horizon Cloud Ribbons
 * - FBM Sculpted Amphitheater Terrain blended into atmospheric valley mist
 * - Reflecting Dew-Mirror Pond bordered by natural mossy flagstones & lakeside reeds
 * - 2,200 instanced multi-blade curved grass tufts (6,600 tapering blades) in traveling wind waves
 * - Hybrid alpha-cutout 3D crossed botanical specimens (Cosmos, Provence Lavender, Silk Pampas, Ferns)
 * - Sculptural Birch-Olive Meadow Trees casting dappled sunlight + Hand-blown Glass Lanterns
 */
export function BotanicalMeadowStage({
  slots,
  railPoints,
  columnPositions,
  floorY,
  railY,
  ambience,
  beamHex,
}: BotanicalMeadowStageProps) {
  const grassMeshRef = useRef<THREE.InstancedMesh>(null);
  const cosmosMeshRef = useRef<THREE.InstancedMesh>(null);
  const lavenderMeshRef = useRef<THREE.InstancedMesh>(null);
  const pampasMeshRef = useRef<THREE.InstancedMesh>(null);
  const fernMeshRef = useRef<THREE.InstancedMesh>(null);
  const vineMeshRef = useRef<THREE.InstancedMesh>(null);
  const cloudsGroupRef = useRef<THREE.Group>(null);
  const lanternsGroupRef = useRef<THREE.Group>(null);
  const windTimeRef = useRef({ value: 0 });

  // Painterly & Photorealistic Procedural Textures
  const textures = useMemo(() => {
    return {
      terrainAlbedo: createMeadowTerrainTexture(ambience),
      terrainBump: createMeadowBumpTexture(),
      travertine: createTravertineStoneTexture(),
      cosmos: createCosmosSprayTexture(ambience),
      lavender: createLavenderSpireTexture(ambience),
      pampas: createPampasPlumeTexture(ambience),
      fern: createFernFrondTexture(ambience),
      vine: createTrailingVineTexture(ambience),
      canopy: createCanopyClusterTexture(ambience),
      cloud: createCloudVeilTexture(ambience),
      waterRipples: createWaterNormalRipplesTexture(),
    };
  }, [ambience]);

  useEffect(() => {
    return () => {
      Object.values(textures).forEach((t) => t.dispose());
    };
  }, [textures]);

  // Geometries
  const geos = useMemo(() => {
    return {
      terrain: buildSculptedMeadowTerrainGeometry(floorY, slots),
      grass: buildCurvedGrassTuftGeometry(),
      cosmos: buildCrossedBotanicalClusterGeometry(3, 0.72, 0.76, 0.06),
      lavender: buildCrossedBotanicalClusterGeometry(3, 0.62, 0.96, 0.05),
      pampas: buildCrossedBotanicalClusterGeometry(3, 0.78, 1.38, 0.14),
      fern: buildCrossedBotanicalClusterGeometry(3, 0.88, 0.62, 0.1),
      vine: buildCrossedBotanicalClusterGeometry(2, 0.85, 0.56, 0.04),
      pond: buildReflectingBasinShapeGeometry(),
      stoneA: buildOrganicFlagstoneGeometry(101, 0.34, 0.28, 0.06),
      stoneB: buildOrganicFlagstoneGeometry(202, 0.42, 0.34, 0.075),
      lantern: buildTeardropLanternGeometry(),
    };
  }, [floorY, slots]);

  useEffect(() => {
    return () => {
      Object.values(geos).forEach((g) => g.dispose());
    };
  }, [geos]);

  // Custom Shaders (Sky Dome, Mist Veil, Wind Grass, Subsurface Foliage)
  const skyMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uZenith: { value: new THREE.Color(MEADOW_HEX.skyDay) },
          uMid: { value: new THREE.Color(MEADOW_HEX.skyDayMid) },
          uHorizon: { value: new THREE.Color(MEADOW_HEX.skyDayHorizon) },
          uSunColor: { value: new THREE.Color(MEADOW_HEX.sunDisc) },
          uSunHalo: { value: new THREE.Color(MEADOW_HEX.sunHalo) },
          uSunDir: { value: new THREE.Vector3(0.45, 0.27, -0.85).normalize() },
          uIsDay: { value: 1.0 },
          uTime: { value: 0.0 },
        },
        vertexShader: SKY_VERTEX_SHADER,
        fragmentShader: SKY_FRAGMENT_SHADER,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
      }),
    []
  );

  const mistMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uMistColor: { value: new THREE.Color(MEADOW_HEX.mistDay) },
          uOpacity: { value: 0.36 },
          uTime: { value: 0.0 },
        },
        vertexShader: MIST_VERTEX_SHADER,
        fragmentShader: MIST_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  const grassMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSunDir: { value: new THREE.Vector3(0.45, 0.27, -0.85).normalize() },
          uColorRoot: { value: new THREE.Color(MEADOW_HEX.soilRich) },
          uColorMid: { value: new THREE.Color(MEADOW_HEX.lawnMid) },
          uColorTip: { value: new THREE.Color(MEADOW_HEX.lawnLight) },
          uColorSun: { value: new THREE.Color(MEADOW_HEX.strawGold) },
          uFogColor: { value: new THREE.Color(MEADOW_HEX.mistDay) },
          uFogDensity: { value: 0.022 },
        },
        vertexShader: GRASS_VERTEX_SHADER,
        fragmentShader: GRASS_FRAGMENT_SHADER,
        side: THREE.DoubleSide,
      }),
    []
  );

  useEffect(() => {
    if (ambience === "day") {
      skyMat.uniforms.uZenith.value.setHex(MEADOW_HEX.skyDay);
      skyMat.uniforms.uMid.value.setHex(MEADOW_HEX.skyDayMid);
      skyMat.uniforms.uHorizon.value.setHex(MEADOW_HEX.skyDayHorizon);
      skyMat.uniforms.uSunColor.value.setHex(MEADOW_HEX.sunDisc);
      skyMat.uniforms.uSunHalo.value.setHex(MEADOW_HEX.sunHalo);
      skyMat.uniforms.uIsDay.value = 1.0;

      mistMat.uniforms.uMistColor.value.setHex(MEADOW_HEX.mistDay);
      mistMat.uniforms.uOpacity.value = 0.34;

      grassMat.uniforms.uColorRoot.value.setHex(MEADOW_HEX.soilRich);
      grassMat.uniforms.uColorMid.value.setHex(MEADOW_HEX.lawnMid);
      grassMat.uniforms.uColorTip.value.setHex(MEADOW_HEX.lawnLight);
      grassMat.uniforms.uColorSun.value.setHex(MEADOW_HEX.sunWarm);
      grassMat.uniforms.uFogColor.value.setHex(MEADOW_HEX.mistDay);
      grassMat.uniforms.uFogDensity.value = 0.02;
    } else {
      skyMat.uniforms.uZenith.value.setHex(MEADOW_HEX.skyNightZenith);
      skyMat.uniforms.uMid.value.setHex(MEADOW_HEX.skyNight);
      skyMat.uniforms.uHorizon.value.setHex(MEADOW_HEX.skyNightHorizon);
      skyMat.uniforms.uSunColor.value.setHex(MEADOW_HEX.sunWarm);
      skyMat.uniforms.uSunHalo.value.setHex(MEADOW_HEX.cloudShadow);
      skyMat.uniforms.uIsDay.value = 0.0;

      mistMat.uniforms.uMistColor.value.setHex(MEADOW_HEX.mistNight);
      mistMat.uniforms.uOpacity.value = 0.44;

      grassMat.uniforms.uColorRoot.value.setHex(MEADOW_HEX.skyNight);
      grassMat.uniforms.uColorMid.value.setHex(MEADOW_HEX.lawnDeep);
      grassMat.uniforms.uColorTip.value.setHex(MEADOW_HEX.foliageSage);
      grassMat.uniforms.uColorSun.value.setHex(MEADOW_HEX.foliageLight);
      grassMat.uniforms.uFogColor.value.setHex(MEADOW_HEX.mistNight);
      grassMat.uniforms.uFogDensity.value = 0.025;
    }
  }, [ambience, skyMat, mistMat, grassMat]);

  const floraMats = useMemo(() => {
    const t = windTimeRef.current;
    const sunCol = ambience === "day" ? MEADOW_HEX.sunWarm : MEADOW_HEX.mistNight;
    return {
      cosmos: createWindBotanicalMaterial(textures.cosmos, t, sunCol, {
        swayAmp: 0.085,
        backlitStrength: ambience === "day" ? 0.24 : 0.05,
      }),
      lavender: createWindBotanicalMaterial(textures.lavender, t, sunCol, {
        swayAmp: 0.095,
        backlitStrength: ambience === "day" ? 0.2 : 0.06,
      }),
      pampas: createWindBotanicalMaterial(textures.pampas, t, sunCol, {
        swayAmp: 0.145,
        backlitStrength: ambience === "day" ? 0.34 : 0.08,
      }),
      fern: createWindBotanicalMaterial(textures.fern, t, sunCol, {
        swayAmp: 0.05,
        backlitStrength: ambience === "day" ? 0.16 : 0.04,
      }),
      vine: createWindBotanicalMaterial(textures.vine, t, sunCol, {
        anchorTop: true,
        swayAmp: 0.065,
        backlitStrength: ambience === "day" ? 0.2 : 0.05,
      }),
    };
  }, [textures, ambience]);

  useEffect(() => {
    return () => {
      skyMat.dispose();
      mistMat.dispose();
      grassMat.dispose();
      Object.values(floraMats).forEach((m) => m.dispose());
    };
  }, [skyMat, mistMat, grassMat, floraMats]);

  // Organic Scatter Placement Across Undulating Meadow & Plinths
  const {
    grassList,
    cosmosList,
    lavenderList,
    pampasList,
    fernList,
    vineList,
    bankStones,
    floatingPetals,
    lanternPositions,
    trees,
    clouds,
  } = useMemo(() => {
    const rng = createSeededRng(20261114);

    const isInsideSteppingStone = (x: number, z: number, margin: number) =>
      slots.some((s) => {
        const dx = x - s.position[0];
        const dz = z - s.position[2];
        return dx * dx + dz * dz < margin * margin;
      });

    const isInsidePond = (x: number, z: number, padFactor = 1.0) => {
      const px = (x - POOL_CENTER_X) / (POOL_RADIUS_X * padFactor);
      const pz = (z - POOL_CENTER_Z) / (POOL_RADIUS_Z * padFactor);
      return px * px + pz * pz < 1;
    };

    // 1. 2,150 instanced multi-blade tufts (= 6,450 blades across glade & rolling hills)
    const grassList: GrassPlacement[] = [];
    for (let i = 0; i < 2150; i += 1) {
      let gx = 0;
      let gz = 0;
      if (i < 320 && slots.length > 0) {
        const s = slots[i % slots.length];
        const ang = rng() * Math.PI * 2;
        const r = 0.66 + rng() * 0.95;
        gx = s.position[0] + Math.cos(ang) * r;
        gz = s.position[2] + Math.sin(ang) * r;
      } else if (i < 600) {
        // Lush perimeter around reflecting water basin
        const ang = rng() * Math.PI * 2;
        const rBump = 1.04 + rng() * 0.38;
        gx = POOL_CENTER_X + Math.cos(ang) * POOL_RADIUS_X * rBump;
        gz = POOL_CENTER_Z + Math.sin(ang) * POOL_RADIUS_Z * rBump;
      } else {
        const r = 1.4 + Math.sqrt(rng()) * 17.8;
        const ang = rng() * Math.PI * 2;
        gx = Math.cos(ang) * r;
        gz = Math.sin(ang) * r - 1.4;
      }
      if (isInsideSteppingStone(gx, gz, 0.68) || isInsidePond(gx, gz, 1.03)) continue;
      const gy = floorY + getMeadowHeightOffset(gx, gz, slots) - 0.012;
      grassList.push({
        x: gx,
        y: gy,
        z: gz,
        rotY: rng() * Math.PI * 2,
        scaleY: 0.72 + rng() * 0.98,
        scaleXZ: 0.8 + rng() * 0.68,
      });
    }

    // 2. Blooming Wild Cosmos & Peony Drifts
    const cosmosTints = [
      MEADOW_HEX.petalCream,
      MEADOW_HEX.petalPink,
      MEADOW_HEX.petalCoral,
      MEADOW_HEX.petalCream,
      MEADOW_HEX.petalRose,
    ];
    const cosmosList: FloraPlacement[] = [];
    for (let i = 0; i < 165; i += 1) {
      let fx = 0;
      let fz = 0;
      if (i < 55 && slots.length > 0) {
        const s = slots[i % slots.length];
        const ang = rng() * Math.PI * 2;
        const r = 0.74 + rng() * 0.82;
        fx = s.position[0] + Math.cos(ang) * r;
        fz = s.position[2] + Math.sin(ang) * r;
      } else {
        const r = 2.6 + Math.sqrt(rng()) * 13.5;
        const ang = rng() * Math.PI * 2;
        fx = Math.cos(ang) * r;
        fz = Math.sin(ang) * r - 1.6;
      }
      if (isInsideSteppingStone(fx, fz, 0.74) || isInsidePond(fx, fz, 1.06)) continue;
      const fy = floorY + getMeadowHeightOffset(fx, fz, slots) - 0.02;
      cosmosList.push({
        x: fx,
        y: fy,
        z: fz,
        rotY: rng() * Math.PI * 2,
        tiltX: (rng() - 0.5) * 0.14,
        tiltZ: (rng() - 0.5) * 0.14,
        scaleXZ: 0.72 + rng() * 0.58,
        scaleY: 0.7 + rng() * 0.55,
        tintHex: cosmosTints[Math.floor(rng() * cosmosTints.length)],
      });
    }

    // 3. Tall Provence Lavender Spires along gentle embankments & column flowerbeds
    const lavenderList: FloraPlacement[] = [];
    for (let i = 0; i < 105; i += 1) {
      let lx = 0;
      let lz = 0;
      if (i < 30 && columnPositions.length > 0) {
        const c = columnPositions[i % columnPositions.length];
        const ang = rng() * Math.PI * 2;
        const r = 0.45 + rng() * 0.95;
        lx = c[0] + Math.cos(ang) * r;
        lz = c[2] + Math.sin(ang) * r;
      } else {
        const r = 4.2 + Math.sqrt(rng()) * 12.2;
        const ang = rng() * Math.PI * 2;
        lx = Math.cos(ang) * r;
        lz = Math.sin(ang) * r - 1.8;
      }
      if (isInsideSteppingStone(lx, lz, 0.85) || isInsidePond(lx, lz, 1.1)) continue;
      const ly = floorY + getMeadowHeightOffset(lx, lz, slots) - 0.02;
      lavenderList.push({
        x: lx,
        y: ly,
        z: lz,
        rotY: rng() * Math.PI * 2,
        tiltX: (rng() - 0.5) * 0.12,
        tiltZ: (rng() - 0.5) * 0.12,
        scaleXZ: 0.82 + rng() * 0.48,
        scaleY: 0.78 + rng() * 0.52,
        tintHex: HEX.paper,
      });
    }

    // 4. Silky Champagne Pampas Plumes framing the reflecting pool edges & outer meadow hills
    const pampasList: FloraPlacement[] = [];
    for (let i = 0; i < 82; i += 1) {
      let px = 0;
      let pz = 0;
      if (i < 20) {
        // Flanks beside the pond edge away from central camera view corridor
        const side = i % 2 === 0 ? -1 : 1;
        px = POOL_CENTER_X + side * (POOL_RADIUS_X + 0.15 + rng() * 0.85);
        pz = POOL_CENTER_Z + (rng() - 0.45) * POOL_RADIUS_Z * 1.45;
      } else {
        const r = 6.8 + Math.sqrt(rng()) * 12.5;
        const ang = -Math.PI * 0.95 + rng() * Math.PI * 1.9;
        px = Math.sin(ang) * r;
        pz = -Math.cos(ang) * r - 1.8;
      }
      if (isInsideSteppingStone(px, pz, 1.1) || isInsidePond(px, pz, 1.05)) continue;
      const py = floorY + getMeadowHeightOffset(px, pz, slots) - 0.02;
      pampasList.push({
        x: px,
        y: py,
        z: pz,
        rotY: rng() * Math.PI * 2,
        tiltX: (rng() - 0.5) * 0.1,
        tiltZ: (rng() - 0.5) * 0.1,
        scaleXZ: 0.78 + rng() * 0.55,
        scaleY: 0.76 + rng() * 0.58,
        tintHex: rng() > 0.45 ? HEX.paper : MEADOW_HEX.pampasCream,
      });
    }

    // 5. Lush Woodland Bracken Ferns replacing old boxy dodecahedron bushes
    const fernList: FloraPlacement[] = [];
    for (let i = 0; i < 128; i += 1) {
      let fx = 0;
      let fz = 0;
      if (i < 36 && columnPositions.length > 0) {
        const c = columnPositions[i % columnPositions.length];
        const ang = rng() * Math.PI * 2;
        const r = 0.24 + rng() * 0.75;
        fx = c[0] + Math.cos(ang) * r;
        fz = c[2] + Math.sin(ang) * r;
      } else if (i < 72) {
        const ang = rng() * Math.PI * 2;
        const edge = 0.98 + rng() * 0.22;
        fx = POOL_CENTER_X + Math.cos(ang) * POOL_RADIUS_X * edge;
        fz = POOL_CENTER_Z + Math.sin(ang) * POOL_RADIUS_Z * edge;
      } else {
        const r = 3.5 + Math.sqrt(rng()) * 13.0;
        const ang = rng() * Math.PI * 2;
        fx = Math.cos(ang) * r;
        fz = Math.sin(ang) * r - 1.5;
      }
      if (isInsideSteppingStone(fx, fz, 0.75) || isInsidePond(fx, fz, 0.97)) continue;
      const fy = floorY + getMeadowHeightOffset(fx, fz, slots) - 0.025;
      fernList.push({
        x: fx,
        y: fy,
        z: fz,
        rotY: rng() * Math.PI * 2,
        tiltX: (rng() - 0.5) * 0.1,
        tiltZ: (rng() - 0.5) * 0.1,
        scaleXZ: 0.75 + rng() * 0.65,
        scaleY: 0.65 + rng() * 0.55,
        tintHex: HEX.paper,
      });
    }

    // 6. Cascading Jasmine Conservatory Vines hanging from overhead rail & climbing columns
    const vineList: VinePlacement[] = [];
    const lanternPositions: [number, number, number][] = [];
    railPoints.forEach((pt, idx) => {
      if (idx % 2 === 0) {
        vineList.push({
          x: pt.x + (rng() - 0.5) * 0.18,
          y: pt.y + 0.04,
          z: pt.z + (rng() - 0.5) * 0.18,
          rotY: rng() * Math.PI,
          scaleX: 0.78 + rng() * 0.42,
          scaleY: 0.68 + rng() * 0.36,
        });
      }
      if (idx % 3 === 1 && idx < railPoints.length - 1) {
        lanternPositions.push([pt.x, pt.y - 0.2 - (idx % 2) * 0.16, pt.z]);
      }
    });

    // Climbing jasmine drapes twining down each conservatory column
    columnPositions.forEach(([cx, , cz], cIdx) => {
      for (let tier = 0; tier < 3; tier += 1) {
        const yAnchor = railY - 0.28 * tier - rng() * 0.35;
        if (yAnchor < floorY + 1.1) continue;
        vineList.push({
          x: cx + (rng() - 0.5) * 0.14,
          y: yAnchor,
          z: cz + (rng() - 0.5) * 0.14,
          rotY: cIdx * 0.9 + tier * 1.4,
          scaleX: 0.46 + rng() * 0.2,
          scaleY: 0.85 + rng() * 0.35,
        });
      }
    });

    // 7. Weathered Natural Lakeside Fieldstones & Floating Rose Petals
    const bankStones: BankStonePlacement[] = [];
    const stoneCount = 26;
    for (let i = 0; i < stoneCount; i += 1) {
      const ang = (i / stoneCount) * Math.PI * 2 + (rng() - 0.5) * 0.16;
      const organic =
        1 +
        0.09 * Math.sin(ang * 2 + 0.6) +
        0.05 * Math.cos(ang * 3 - 0.9) +
        0.03 * Math.sin(ang * 5 + 1.2);
      const bx = POOL_CENTER_X + Math.cos(ang) * POOL_RADIUS_X * organic * 1.02;
      const bz = POOL_CENTER_Z + Math.sin(ang) * POOL_RADIUS_Z * organic * 1.02;
      const by = floorY + getMeadowHeightOffset(bx, bz, slots) + 0.015;
      bankStones.push({
        x: bx,
        y: by,
        z: bz,
        rotY: rng() * Math.PI * 2,
        tiltZ: (rng() - 0.5) * 0.14,
        scale: [0.75 + rng() * 0.65, 0.65 + rng() * 0.7, 0.75 + rng() * 0.65],
        toneHex: i % 3 === 0 ? MEADOW_HEX.stoneRim : MEADOW_HEX.stoneWarm,
      });
    }

    const floatingPetals = Array.from({ length: 12 }, (_, idx) => {
      const a = (idx / 12) * Math.PI * 2 + rng() * 0.4;
      const r = 0.25 + rng() * 0.62;
      return {
        pos: [
          POOL_CENTER_X + Math.cos(a) * POOL_RADIUS_X * r,
          floorY - 0.022,
          POOL_CENTER_Z + Math.sin(a) * POOL_RADIUS_Z * r,
        ] as [number, number, number],
        rotY: rng() * Math.PI * 2,
        scale: 0.7 + rng() * 0.5,
        hex: idx % 2 === 0 ? MEADOW_HEX.petalCream : MEADOW_HEX.petalPink,
      };
    });

    // 8. 3 Sculptural Meadow Silver-Birch / Olive Trees framing the pergola flanks
    const trees: MeadowTreeSpec[] = [
      {
        id: "birch-left",
        base: [-8.6, floorY + getMeadowHeightOffset(-8.6, -4.4, slots) - 0.1, -4.4],
        rotY: 0.45,
        scale: 1.08,
      },
      {
        id: "birch-right",
        base: [8.9, floorY + getMeadowHeightOffset(8.9, -4.1, slots) - 0.1, -4.1],
        rotY: -0.62,
        scale: 1.14,
      },
      {
        id: "birch-distant",
        base: [-2.4, floorY + getMeadowHeightOffset(-2.4, -10.8, slots) - 0.15, -10.8],
        rotY: 1.85,
        scale: 1.28,
      },
    ];

    // 9. Panoramic Drifting Cloud Cards
    const clouds = [
      { base: [-24, 12.5, -42] as [number, number, number], scale: [26, 12, 1] as [number, number, number], speed: 0.18 },
      { base: [6, 14.5, -48] as [number, number, number], scale: [32, 14, 1] as [number, number, number], speed: 0.12 },
      { base: [30, 11.8, -38] as [number, number, number], scale: [24, 11, 1] as [number, number, number], speed: 0.22 },
      { base: [-36, 10.5, -24] as [number, number, number], scale: [22, 10, 1] as [number, number, number], speed: 0.15 },
    ];

    return {
      grassList,
      cosmosList,
      lavenderList,
      pampasList,
      fernList,
      vineList,
      bankStones,
      floatingPetals,
      lanternPositions,
      trees,
      clouds,
    };
  }, [slots, railPoints, columnPositions, floorY, railY]);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    if (grassMeshRef.current) {
      grassList.forEach((g, i) => {
        dummy.position.set(g.x, g.y, g.z);
        dummy.rotation.set(0, g.rotY, 0);
        dummy.scale.set(g.scaleXZ, g.scaleY, g.scaleXZ);
        dummy.updateMatrix();
        grassMeshRef.current?.setMatrixAt(i, dummy.matrix);
      });
      grassMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    const applyFloraInstances = (
      mesh: THREE.InstancedMesh | null,
      list: FloraPlacement[],
      useColor = false
    ) => {
      if (!mesh) return;
      list.forEach((f, i) => {
        dummy.position.set(f.x, f.y, f.z);
        dummy.rotation.set(f.tiltX, f.rotY, f.tiltZ);
        dummy.scale.set(f.scaleXZ, f.scaleY, f.scaleXZ);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        if (useColor) {
          color.setHex(f.tintHex);
          mesh.setColorAt(i, color);
        }
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (useColor && mesh.instanceColor) {
        mesh.instanceColor.needsUpdate = true;
        (mesh.material as THREE.Material).needsUpdate = true;
      }
    };

    applyFloraInstances(cosmosMeshRef.current, cosmosList, true);
    applyFloraInstances(lavenderMeshRef.current, lavenderList, false);
    applyFloraInstances(pampasMeshRef.current, pampasList, true);
    applyFloraInstances(fernMeshRef.current, fernList, false);

    if (vineMeshRef.current) {
      vineList.forEach((v, i) => {
        // Anchor top at railY: crossed geo extends [0..height], shift down by scaled height
        dummy.position.set(v.x, v.y - 0.56 * v.scaleY, v.z);
        dummy.rotation.set(0, v.rotY, 0);
        dummy.scale.set(v.scaleX, v.scaleY, v.scaleX);
        dummy.updateMatrix();
        vineMeshRef.current?.setMatrixAt(i, dummy.matrix);
      });
      vineMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [grassList, cosmosList, lavenderList, pampasList, fernList, vineList]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    windTimeRef.current.value = t;
    skyMat.uniforms.uTime.value = t;
    mistMat.uniforms.uTime.value = t;
    grassMat.uniforms.uTime.value = t;

    if (cloudsGroupRef.current) {
      cloudsGroupRef.current.children.forEach((child, idx) => {
        const c = clouds[idx];
        if (!c) return;
        const drift = ((t * c.speed + idx * 14) % 90) - 45;
        child.position.x = c.base[0] * 0.4 + drift;
      });
    }

    if (lanternsGroupRef.current) {
      lanternsGroupRef.current.children.forEach((child, idx) => {
        child.rotation.z = Math.sin(t * 1.15 + idx * 1.6) * 0.045;
        child.rotation.x = Math.cos(t * 0.9 + idx * 1.1) * 0.03;
      });
    }
  });

  // Natural Carved Travertine Stepping Stones linking Exhibition Plinths
  const walkwayStones = useMemo(
    () =>
      slots.slice(0, -1).map((slot, i) => {
        const next = slots[i + 1];
        const midX = (slot.position[0] + next.position[0]) / 2;
        const midZ = (slot.position[2] + next.position[2]) / 2;
        const midY = floorY + getMeadowHeightOffset(midX, midZ, slots) + 0.015;
        return {
          key: `walkstone-${i}`,
          pos: [midX, midY, midZ] as [number, number, number],
          rotY: (slot.rotationY + next.rotationY) / 2 + (i % 2 === 0 ? 0.28 : -0.22),
          geo: i % 2 === 0 ? geos.stoneA : geos.stoneB,
        };
      }),
    [slots, floorY, geos.stoneA, geos.stoneB]
  );

  return (
    <group>
      {/* Atmospheric Rayleigh-Mie Sky Dome & Solar Halo */}
      <mesh material={skyMat} renderOrder={-10}>
        <sphereGeometry args={[92, 48, 32]} />
      </mesh>

      {/* Panoramic Painterly Drifting Sky Clouds */}
      <group ref={cloudsGroupRef}>
        {clouds.map((c, idx) => (
          <mesh key={`cloud-${idx}`} position={c.base} scale={c.scale} renderOrder={-5}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={textures.cloud}
              transparent
              depthWrite={false}
              opacity={ambience === "day" ? 0.78 : 0.42}
            />
          </mesh>
        ))}
      </group>

      {/* Soft Valley Morning Mist Veil Blending Hills into Horizon */}
      <mesh
        position={[0, floorY + 0.42, -2]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={mistMat}
        renderOrder={2}
      >
        <planeGeometry args={[72, 72]} />
      </mesh>

      {/* Sculpted Undulating Meadow Amphitheater Terrain */}
      <mesh geometry={geos.terrain} receiveShadow>
        <meshStandardMaterial
          map={textures.terrainAlbedo}
          bumpMap={textures.terrainBump}
          bumpScale={0.075}
          vertexColors
          roughness={0.94}
          metalness={0.01}
        />
      </mesh>

      {/* Courtyard Still Mirror Reflecting Pool ("Hồ Gương Sương Mai") */}
      <mesh
        position={[POOL_CENTER_X, floorY - 0.032, POOL_CENTER_Z]}
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={geos.pond}
        receiveShadow
      >
        <MeshReflectorMaterial
          resolution={512}
          blur={[180, 48]}
          mixBlur={0.9}
          mixStrength={ambience === "day" ? 0.65 : 1.05}
          mirror={0.76}
          depthScale={0.35}
          minDepthThreshold={0.45}
          maxDepthThreshold={1.35}
          roughness={0.24}
          roughnessMap={textures.waterRipples}
          metalness={0.38}
          color={ambience === "day" ? MEADOW_HEX.waterDay : MEADOW_HEX.waterNight}
        />
      </mesh>

      {/* Floating Rose & Cream Blossom Petals on Mirror Pond */}
      {floatingPetals.map((pt, idx) => (
        <mesh
          key={`petal-${idx}`}
          position={pt.pos}
          rotation={[-Math.PI / 2, 0, pt.rotY]}
          scale={pt.scale}
        >
          <circleGeometry args={[0.042, 7]} />
          <meshStandardMaterial
            color={pt.hex}
            roughness={0.55}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Weathered Natural Riverbank Fieldstones Framing Water Basin */}
      {bankStones.map((bs, idx) => (
        <mesh
          key={`bank-stone-${idx}`}
          position={[bs.x, bs.y, bs.z]}
          rotation={[0, bs.rotY, bs.tiltZ]}
          scale={bs.scale}
          geometry={idx % 2 === 0 ? geos.stoneA : geos.stoneB}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            map={textures.travertine}
            color={bs.toneHex}
            roughness={0.88}
          />
        </mesh>
      ))}

      {/* Carved Organic Travertine Stepping Stones Linking Plinths */}
      {walkwayStones.map((ws) => (
        <mesh
          key={ws.key}
          position={ws.pos}
          rotation={[0, ws.rotY, 0]}
          geometry={ws.geo}
          receiveShadow
        >
          <meshStandardMaterial
            map={textures.travertine}
            color={MEADOW_HEX.stoneCream}
            roughness={0.86}
          />
        </mesh>
      ))}

      {/* 2,150 Wind-Waved Curved 3D Grass Tufts (6,450 Blades) */}
      {grassList.length > 0 && (
        <instancedMesh
          ref={grassMeshRef}
          args={[geos.grass, grassMat, grassList.length]}
          frustumCulled={false}
        />
      )}

      {/* Wildflower Specimen A: Branching Cosmos & Peony Bouquets */}
      {cosmosList.length > 0 && (
        <instancedMesh
          ref={cosmosMeshRef}
          args={[geos.cosmos, floraMats.cosmos, cosmosList.length]}
          frustumCulled={false}
          receiveShadow
        />
      )}

      {/* Wildflower Specimen B: Tall Provence Lavender Spires */}
      {lavenderList.length > 0 && (
        <instancedMesh
          ref={lavenderMeshRef}
          args={[geos.lavender, floraMats.lavender, lavenderList.length]}
          frustumCulled={false}
          receiveShadow
        />
      )}

      {/* Botanical Specimen C: Silky Champagne Pampas & Reed Plumes */}
      {pampasList.length > 0 && (
        <instancedMesh
          ref={pampasMeshRef}
          args={[geos.pampas, floraMats.pampas, pampasList.length]}
          frustumCulled={false}
          receiveShadow
        />
      )}

      {/* Botanical Specimen D: Woodland Bracken Fern Rosettes */}
      {fernList.length > 0 && (
        <instancedMesh
          ref={fernMeshRef}
          args={[geos.fern, floraMats.fern, fernList.length]}
          frustumCulled={false}
          receiveShadow
        />
      )}

      {/* Cascading Jasmine & Ivy Vines Draped from Overhead Conservatory Rail */}
      {vineList.length > 0 && (
        <instancedMesh
          ref={vineMeshRef}
          args={[geos.vine, floraMats.vine, vineList.length]}
          frustumCulled={false}
        />
      )}

      {/* Sculptural Silver-Birch / Wild-Olive Trees Framing Horizon */}
      {trees.map((spec) => (
        <BotanicalMeadowTree
          key={spec.id}
          spec={spec}
          canopyTexture={textures.canopy}
          timeUniform={windTimeRef.current}
          ambience={ambience}
        />
      ))}

      {/* Hand-Blown Teardrop Glass Dew Lanterns Gently Swaying */}
      <group ref={lanternsGroupRef}>
        {lanternPositions.map(([lx, ly, lz], idx) => (
          <group key={`dew-orb-${idx}`} position={[lx, ly + 0.16, lz]}>
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.14, 6]} />
              <meshStandardMaterial
                color={MEADOW_HEX.pergolaBronze}
                metalness={0.75}
                roughness={0.3}
              />
            </mesh>
            {/* Brass Collar Ring */}
            <mesh position={[0, -0.115, 0]}>
              <cylinderGeometry args={[0.025, 0.028, 0.024, 12]} />
              <meshStandardMaterial
                color={MEADOW_HEX.pergolaBrass}
                metalness={0.85}
                roughness={0.25}
              />
            </mesh>
            {/* Teardrop Crystal Vessel */}
            <mesh position={[0, -0.225, 0]} geometry={geos.lantern}>
              <meshPhysicalMaterial
                color={ambience === "day" ? MEADOW_HEX.petalCream : beamHex}
                emissive={ambience === "day" ? MEADOW_HEX.sunWarm : beamHex}
                emissiveIntensity={ambience === "day" ? 0.35 : 1.15}
                roughness={0.12}
                metalness={0.05}
                transmission={0.55}
                transparent
                opacity={0.92}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
