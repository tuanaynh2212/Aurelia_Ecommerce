import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CSS, HEX } from "./palette";
import { spatialStore } from "./SpatialStore";

export interface HangingGarmentProps {
  imageUrl?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  index?: number;
  accentColor?: number;
}

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uPointerX;
  uniform float uSeed;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    // Pin top edge (uv.y near 1.0) to hanger, wave increases toward hem (uv.y -> 0.0)
    float hangFactor = clamp(1.0 - uv.y, 0.0, 1.0);
    float wave = sin(uTime * 2.1 + pos.x * 2.8 + uSeed) * 0.065 * hangFactor;
    float sway = uPointerX * 0.14 * hangFactor * hangFactor;
    pos.z += wave + sway;
    pos.x += sin(uTime * 1.3 + uSeed) * 0.025 * hangFactor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uHasTexture;
  varying vec2 vUv;

  void main() {
    if (uHasTexture > 0.5) {
      vec4 tex = texture2D(uMap, vUv);
      gl_FragColor = vec4(tex.rgb, 1.0);
    } else {
      // Brutalist bone + architectural grid fallback
      vec3 bone = vec3(0.953, 0.941, 0.902);
      vec3 ink = vec3(0.035, 0.035, 0.043);
      float gx = step(0.94, fract(vUv.x * 8.0));
      float gy = step(0.94, fract(vUv.y * 10.0));
      float grid = max(gx, gy);
      vec3 col = mix(bone, ink, grid * 0.28);
      gl_FragColor = vec4(col, 1.0);
    }
  }
`;

function createFallbackDataTexture(): THREE.DataTexture {
  const data = new Uint8Array([243, 240, 230, 255]);
  const tex = new THREE.DataTexture(data, 1, 1);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Cloth-simulated hanging garment plane with custom wind/pointer vertex shader
 * and safe CORS texture loader fallback to `HEX.bone` + geometric grid pattern.
 */
export function HangingGarment({
  imageUrl,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 1.25,
  height = 1.75,
  index = 0,
  accentColor = HEX.volt,
}: HangingGarmentProps) {
  const fallbackTex = useMemo(() => createFallbackDataTexture(), []);
  const [loadedTex, setLoadedTex] = useState<THREE.Texture | null>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  useEffect(() => {
    if (!imageUrl) {
      setLoadedTex(null);
      return;
    }
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      imageUrl,
      (tex) => {
        if (cancelled) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        setLoadedTex(tex);
      },
      undefined,
      () => {
        if (!cancelled) setLoadedTex(null);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  useEffect(() => {
    return () => {
      fallbackTex.dispose();
      loadedTex?.dispose();
    };
  }, [fallbackTex, loadedTex]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointerX: { value: 0 },
      uSeed: { value: index * 1.7 },
      uMap: { value: fallbackTex },
      uHasTexture: { value: 0 },
    }),
    [fallbackTex, index]
  );

  useEffect(() => {
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uMap.value = loadedTex ?? fallbackTex;
    shaderRef.current.uniforms.uHasTexture.value = loadedTex ? 1 : 0;
  }, [loadedTex, fallbackTex]);

  useFrame(({ clock }) => {
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
    shaderRef.current.uniforms.uPointerX.value = spatialStore.getState().pointer.x;
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Steel hanger hook + shoulder bar */}
      <mesh position={[0, height / 2 + 0.16, 0]}>
        <torusGeometry args={[0.08, 0.015, 8, 18, Math.PI * 1.2]} />
        <meshStandardMaterial color={HEX.ink} metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, height / 2 + 0.04, 0]}>
        <boxGeometry args={[width * 0.85, 0.04, 0.04]} />
        <meshStandardMaterial color={HEX.ink} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Top hang-tag badge on hanger */}
      <mesh position={[width * 0.32, height / 2 - 0.08, 0.04]}>
        <boxGeometry args={[0.24, 0.34, 0.02]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Subdivided cloth plane */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, height, 18, 24]} />
        <shaderMaterial
          ref={shaderRef}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          uniforms={uniforms}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Crisp ink border frame */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(width + 0.04, height + 0.04)]} />
        <lineBasicMaterial color={CSS.ink} />
      </lineSegments>
    </group>
  );
}
