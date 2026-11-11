import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
} from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";
import type { Product } from "../../../types/type";
import { formatVND } from "../../../utils/formatters";
import {
  getPrimaryProductImage,
  getProductColors,
  getSalePrice,
} from "../../../utils/productHelpers";
import { HEX, MEADOW_HEX, swatchHex } from "./palette";
import {
  BotanicalMeadowStage,
  type MeadowAmbience,
} from "./BotanicalMeadowStage";

export type GalleryAmbience = MeadowAmbience;
export type GalleryBeamTone = "volt" | "flash" | "optic";
export type GalleryViewMode = "overview" | "focus";

export interface ExhibitionGallerySceneProps {
  products: Product[];
  activeIndex: number;
  viewMode: GalleryViewMode;
  ambience: GalleryAmbience;
  beamTone: GalleryBeamTone;
  cameraResetTick: number;
  onSelect: (index: number) => void;
  onUserInteract?: () => void;
}

interface ExhibitSlot {
  index: number;
  product: Product;
  position: [number, number, number];
  rotationY: number;
  railY: number;
  cableLength: number;
}

const RAIL_Y = 2.58;
const FLOOR_Y = -1.85;
const CARD_W = 640;
const CARD_H = 896;

const BEAM_COLORS: Record<GalleryBeamTone, number> = {
  volt: HEX.volt,
  flash: HEX.flash,
  optic: HEX.info,
};

function toCssHex(val: number): string {
  return `#${val.toString(16).padStart(6, "0")}`;
}

function fitCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let clipped = text;
  while (clipped.length > 1 && ctx.measureText(`${clipped}…`).width > maxWidth) {
    clipped = clipped.slice(0, -1);
  }
  return `${clipped}…`;
}

function canAppendQueryHint(url: string): boolean {
  return (
    url.startsWith("http") &&
    !/Signature=|X-Amz-|token=|Policy=/i.test(url)
  );
}

function paintExhibitCanvas(
  canvas: HTMLCanvasElement,
  product: Product,
  index: number,
  isActive: boolean,
  isHovered: boolean,
  beamHex: number,
  media: ImageBitmap | HTMLImageElement | null
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const ink = toCssHex(HEX.ink);
  const paper = toCssHex(HEX.paper);
  const bone = toCssHex(HEX.bone);
  const flash = toCssHex(HEX.flash);
  const muted = toCssHex(HEX.inkMuted);
  const beam = toCssHex(beamHex);

  ctx.clearRect(0, 0, CARD_W, CARD_H);

  // Outer card surface & crisp brutalist frame border
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  ctx.strokeStyle = isActive ? beam : isHovered ? ink : muted;
  ctx.lineWidth = isActive ? 14 : 8;
  ctx.strokeRect(4, 4, CARD_W - 8, CARD_H - 8);

  // Top Header Row: Exhibit Badge + Brand
  const badgeW = 205;
  const badgeH = 44;
  ctx.fillStyle = isActive ? beam : ink;
  ctx.fillRect(26, 26, badgeW, badgeH);

  ctx.fillStyle = isActive ? ink : paper;
  ctx.font = '800 22px "JetBrains Mono", monospace';
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(`EXHIBIT ${String(index + 1).padStart(2, "0")}`, 40, 49);

  ctx.fillStyle = muted;
  ctx.font = '800 20px "JetBrains Mono", monospace';
  ctx.textAlign = "right";
  ctx.fillText(
    fitCanvasText(ctx, (product.brand || "AURELIA").toUpperCase(), 340),
    CARD_W - 28,
    49
  );

  // Photo Viewport Region
  const imgX = 26;
  const imgY = 88;
  const imgW = CARD_W - 52;
  const imgH = 612;

  ctx.fillStyle = bone;
  ctx.fillRect(imgX, imgY, imgW, imgH);

  if (media) {
    const mw = "naturalWidth" in media ? media.naturalWidth : media.width;
    const mh = "naturalHeight" in media ? media.naturalHeight : media.height;
    if (mw > 0 && mh > 0) {
      const boxRatio = imgW / imgH;
      const srcRatio = mw / mh;
      let sx = 0;
      let sy = 0;
      let sw = mw;
      let sh = mh;
      if (srcRatio > boxRatio) {
        sw = mh * boxRatio;
        sx = (mw - sw) / 2;
      } else {
        sh = mw / boxRatio;
        sy = (mh - sh) / 2;
      }
      ctx.save();
      ctx.beginPath();
      ctx.rect(imgX, imgY, imgW, imgH);
      ctx.clip();
      ctx.drawImage(media, sx, sy, sw, sh, imgX, imgY, imgW, imgH);
      ctx.restore();
    }
  } else {
    // Architectural grid fallback while loading or on non-CORS host
    ctx.strokeStyle = ink;
    ctx.globalAlpha = 0.12;
    ctx.lineWidth = 2;
    for (let gx = imgX + 48; gx < imgX + imgW; gx += 48) {
      ctx.beginPath();
      ctx.moveTo(gx, imgY);
      ctx.lineTo(gx, imgY + imgH);
      ctx.stroke();
    }
    for (let gy = imgY + 48; gy < imgY + imgH; gy += 48) {
      ctx.beginPath();
      ctx.moveTo(imgX, gy);
      ctx.lineTo(imgX + imgW, gy);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = ink;
    ctx.font = '900 96px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const monogram = (product.brand || "AU").slice(0, 2).toUpperCase();
    ctx.fillText(monogram, imgX + imgW / 2, imgY + imgH / 2 - 14);
    ctx.font = '700 18px "JetBrains Mono", monospace';
    ctx.fillStyle = muted;
    ctx.fillText("ARCHIVE PIECE", imgX + imgW / 2, imgY + imgH / 2 + 54);
  }

  ctx.strokeStyle = ink;
  ctx.lineWidth = 4;
  ctx.strokeRect(imgX, imgY, imgW, imgH);

  // Discount badge overlay
  if (product.discountValue > 0) {
    const tagText = `-${product.discountValue}%`;
    ctx.fillStyle = flash;
    ctx.fillRect(imgX + imgW - 112, imgY + 14, 98, 40);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 3;
    ctx.strokeRect(imgX + imgW - 112, imgY + 14, 98, 40);
    ctx.fillStyle = paper;
    ctx.font = '800 22px "JetBrains Mono", monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tagText, imgX + imgW - 63, imgY + 35);
  }

  // Bottom Museum Plaque Typography
  ctx.fillStyle = ink;
  ctx.font = '800 32px "Be Vietnam Pro", system-ui, sans-serif';
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(fitCanvasText(ctx, product.name, CARD_W - 52), 26, 720);

  const salePrice = getSalePrice(product);
  ctx.fillStyle = ink;
  ctx.font = '800 34px "JetBrains Mono", monospace';
  ctx.textAlign = "left";
  ctx.fillText(formatVND(salePrice ?? product.price), 26, 774);

  // Color swatches aligned on bottom-right
  const colors = getProductColors(product).slice(0, 4);
  let sx = CARD_W - 26;
  for (let i = colors.length - 1; i >= 0; i -= 1) {
    sx -= 30;
    ctx.fillStyle = swatchHex(colors[i]);
    ctx.fillRect(sx, 778, 26, 26);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(sx, 778, 26, 26);
    sx -= 8;
  }

  // Hairline exhibition footer rule & barcode motif
  ctx.strokeStyle = ink;
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(26, 826);
  ctx.lineTo(CARD_W - 26, 826);
  ctx.stroke();

  ctx.globalAlpha = 0.72;
  ctx.fillStyle = ink;
  let bx = 26;
  for (let i = 0; i < 24; i += 1) {
    const bw = (i * 7 + index * 3) % 3 === 0 ? 5 : 2;
    ctx.fillRect(bx, 842, bw, 22);
    bx += bw + ((i + index) % 2 === 0 ? 4 : 3);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = isActive ? ink : muted;
  ctx.font = '800 16px "JetBrains Mono", monospace';
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(
    isActive ? "SELECTED PIECE" : "CLICK TO FOCUS",
    CARD_W - 26,
    854
  );
}

function useExhibitTexture(
  product: Product,
  index: number,
  isActive: boolean,
  isHovered: boolean,
  beamHex: number
): THREE.CanvasTexture {
  const canvas = useMemo(() => {
    const el = document.createElement("canvas");
    el.width = CARD_W;
    el.height = CARD_H;
    return el;
  }, []);

  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [canvas]);

  const [media, setMedia] = useState<HTMLImageElement | null>(null);

  const imgUrl = getPrimaryProductImage(product);

  useEffect(() => {
    if (!imgUrl) {
      setMedia(null);
      return;
    }

    let cancelled = false;
    let pendingObjectUrl: string | null = null;
    const controller = new AbortController();

    const loadViaCorsImgFallback = () => {
      if (cancelled || !canAppendQueryHint(imgUrl)) return;
      const sep = imgUrl.includes("?") ? "&" : "?";
      const fallbackImg = new Image();
      fallbackImg.crossOrigin = "anonymous";
      fallbackImg.onload = () => {
        if (!cancelled) setMedia(fallbackImg);
      };
      fallbackImg.onerror = () => {
        if (!cancelled) setMedia(null);
      };
      fallbackImg.src = `${imgUrl}${sep}aurelia_gl=1`;
    };

    const loadViaCorsFetch = async () => {
      try {
        // cache: "reload" bypasses Chrome's non-CORS <img> disk cache entry
        // while keeping signed/tokenized URLs completely intact.
        const resp = await fetch(imgUrl, {
          mode: "cors",
          cache: "reload",
          signal: controller.signal,
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const blob = await resp.blob();
        if (cancelled) return;
        const objUrl = URL.createObjectURL(blob);
        pendingObjectUrl = objUrl;
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(objUrl);
          if (pendingObjectUrl === objUrl) pendingObjectUrl = null;
          if (!cancelled) setMedia(img);
        };
        img.onerror = () => {
          URL.revokeObjectURL(objUrl);
          if (pendingObjectUrl === objUrl) pendingObjectUrl = null;
          loadViaCorsImgFallback();
        };
        img.src = objUrl;
      } catch {
        loadViaCorsImgFallback();
      }
    };

    void loadViaCorsFetch();

    return () => {
      cancelled = true;
      controller.abort();
      if (pendingObjectUrl) {
        URL.revokeObjectURL(pendingObjectUrl);
        pendingObjectUrl = null;
      }
    };
  }, [imgUrl]);

  useEffect(() => {
    paintExhibitCanvas(
      canvas,
      product,
      index,
      isActive,
      isHovered,
      beamHex,
      media
    );
    texture.needsUpdate = true;
  }, [canvas, texture, product, index, isActive, isHovered, beamHex, media]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return texture;
}

function computeGalleryLayout(products: Product[]): {
  slots: ExhibitSlot[];
  railPoints: THREE.Vector3[];
  trackPoints: THREE.Vector3[];
  overviewCameraPos: [number, number, number];
  overviewTarget: [number, number, number];
  columnPositions: [number, number, number][];
} {
  const total = products.length;
  if (total === 0) {
    return {
      slots: [],
      railPoints: [
        new THREE.Vector3(-2, RAIL_Y, 0),
        new THREE.Vector3(2, RAIL_Y, 0),
      ],
      trackPoints: [
        new THREE.Vector3(-2, RAIL_Y + 0.3, 0.5),
        new THREE.Vector3(2, RAIL_Y + 0.3, 0.5),
      ],
      overviewCameraPos: [0, 1.3, 6.2],
      overviewTarget: [0, 0.1, 0],
      columnPositions: [
        [-2.2, 0, 0],
        [2.2, 0, 0],
      ],
    };
  }

  if (total === 1) {
    const yCenter = 0.2;
    return {
      slots: [
        {
          index: 0,
          product: products[0],
          position: [0, yCenter, 0],
          rotationY: 0,
          railY: RAIL_Y,
          cableLength: RAIL_Y - (yCenter + 0.8),
        },
      ],
      railPoints: [
        new THREE.Vector3(-2.4, RAIL_Y, 0),
        new THREE.Vector3(0, RAIL_Y, 0),
        new THREE.Vector3(2.4, RAIL_Y, 0),
      ],
      trackPoints: [
        new THREE.Vector3(-2.4, RAIL_Y + 0.32, 0.55),
        new THREE.Vector3(0, RAIL_Y + 0.32, 0.55),
        new THREE.Vector3(2.4, RAIL_Y + 0.32, 0.55),
      ],
      overviewCameraPos: [0, 0.6, 5.0],
      overviewTarget: [0, 0.15, 0],
      columnPositions: [
        [-2.35, 0, 0],
        [2.35, 0, 0],
      ],
    };
  }

  const arcChord = 1.92;
  const maxSpan = Math.min(Math.PI * 0.88, (total - 1) * 0.25);
  const dTheta = maxSpan / (total - 1);
  const radius = Math.max(4.6, arcChord / (2 * Math.sin(dTheta / 2)));
  const arcOriginZ = radius - 2.25;

  const slots: ExhibitSlot[] = products.map((product, index) => {
    const theta = -maxSpan / 2 + index * dTheta;
    const x = Math.sin(theta) * radius;
    const z = arcOriginZ - Math.cos(theta) * radius;
    const yStagger = index % 2 === 0 ? 0.2 : 0.02;
    const frameTopY = yStagger + 0.8;

    return {
      index,
      product,
      position: [x, yStagger, z],
      rotationY: -theta,
      railY: RAIL_Y,
      cableLength: Math.max(0.45, RAIL_Y - frameTopY),
    };
  });

  const padAngle = Math.min(0.24, dTheta * 0.72);
  const sampleCount = Math.max(12, total * 3);
  const railPoints: THREE.Vector3[] = [];
  const trackPoints: THREE.Vector3[] = [];
  const startTheta = -maxSpan / 2 - padAngle;
  const endTheta = maxSpan / 2 + padAngle;

  for (let i = 0; i <= sampleCount; i += 1) {
    const t = i / sampleCount;
    const th = startTheta + (endTheta - startTheta) * t;
    railPoints.push(
      new THREE.Vector3(
        Math.sin(th) * radius,
        RAIL_Y,
        arcOriginZ - Math.cos(th) * radius
      )
    );
    const trackRadius = Math.max(3.6, radius - 0.55);
    trackPoints.push(
      new THREE.Vector3(
        Math.sin(th) * trackRadius,
        RAIL_Y + 0.34,
        arcOriginZ - Math.cos(th) * trackRadius
      )
    );
  }

  const colLeft = railPoints[0];
  const colRight = railPoints[railPoints.length - 1];
  const colMid = railPoints[Math.floor(railPoints.length / 2)];
  const columnPositions: [number, number, number][] =
    total >= 5
      ? [
          [colLeft.x, 0, colLeft.z],
          [colMid.x, 0, colMid.z - 0.28],
          [colRight.x, 0, colRight.z],
        ]
      : [
          [colLeft.x, 0, colLeft.z],
          [colRight.x, 0, colRight.z],
        ];

  const halfWidth = Math.max(...slots.map((s) => Math.abs(s.position[0])), 2.6);
  const minZ = Math.min(...slots.map((s) => s.position[2]));
  const overviewDist = Math.max(6.2, halfWidth * 1.48);

  return {
    slots,
    railPoints,
    trackPoints,
    overviewCameraPos: [0, 1.35, minZ + overviewDist],
    overviewTarget: [0, 0.1, minZ * 0.55],
    columnPositions,
  };
}

interface HangingStationProps {
  slot: ExhibitSlot;
  isActive: boolean;
  beamHex: number;
  ambience: GalleryAmbience;
  onSelect: (idx: number) => void;
}

function HangingStation({
  slot,
  isActive,
  beamHex,
  ambience,
  onSelect,
}: HangingStationProps) {
  const swayGroupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  const posterTexture = useExhibitTexture(
    slot.product,
    slot.index,
    isActive,
    hovered,
    beamHex
  );

  const frameColor = MEADOW_HEX.pergolaBronze;
  const trimColor = isActive
    ? beamHex
    : hovered
    ? MEADOW_HEX.stoneCream
    : MEADOW_HEX.foliageMid;

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!swayGroupRef.current) return;

    const targetSwayZ =
      Math.sin(t * 0.9 + slot.index * 1.35) * (isActive ? 0.008 : 0.018);
    const targetSwayX =
      Math.cos(t * 0.65 + slot.index * 0.9) * (isActive ? 0.004 : 0.009);
    swayGroupRef.current.rotation.z +=
      (targetSwayZ - swayGroupRef.current.rotation.z) * 0.08;
    swayGroupRef.current.rotation.x +=
      (targetSwayX - swayGroupRef.current.rotation.x) * 0.08;

    const targetScale = isActive ? 1.045 : hovered ? 1.02 : 1.0;
    const nextScale =
      swayGroupRef.current.scale.x +
      (targetScale - swayGroupRef.current.scale.x) * 0.1;
    swayGroupRef.current.scale.setScalar(nextScale);
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return;
    e.stopPropagation();
    onSelect(slot.index);
  };

  const [x, y, z] = slot.position;

  return (
    <group position={[x, 0, z]}>
      {/* Overhead Rail Brass & Bronze Trolley Collar anchored at rail y = RAIL_Y */}
      <group position={[0, RAIL_Y, 0]} rotation={[0, slot.rotationY, 0]}>
        <mesh>
          <cylinderGeometry args={[0.075, 0.085, 0.14, 14]} />
          <meshStandardMaterial
            color={MEADOW_HEX.pergolaBronze}
            metalness={0.82}
            roughness={0.26}
          />
        </mesh>
        <mesh position={[0, -0.06, 0.08]}>
          <boxGeometry args={[0.14, 0.025, 0.025]} />
          <meshStandardMaterial
            color={isActive ? beamHex : MEADOW_HEX.pergolaBrass}
            emissive={isActive ? beamHex : HEX.ink}
            emissiveIntensity={isActive ? 1.05 : 0.05}
            metalness={0.75}
            roughness={0.3}
          />
        </mesh>

        {/* Overhead Conservatory Luminaire Canister (spotlight beam shown softly in twilight) */}
        <group position={[0, 0.34, 0.55]} rotation={[0.24, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.058, 0.075, 0.2, 14]} />
            <meshStandardMaterial
              color={MEADOW_HEX.pergolaBronze}
              metalness={0.82}
              roughness={0.28}
            />
          </mesh>
          <mesh position={[0, -0.105, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.056, 16]} />
            <meshBasicMaterial
              color={
                ambience === "day"
                  ? isActive
                    ? MEADOW_HEX.sunWarm
                    : MEADOW_HEX.petalCream
                  : isActive
                  ? beamHex
                  : MEADOW_HEX.sunWarm
              }
            />
          </mesh>
          {ambience === "twilight" && (
            <mesh position={[0, -1.42, 0]}>
              <coneGeometry args={[0.85, 2.7, 24, 1, true]} />
              <meshBasicMaterial
                color={isActive ? beamHex : MEADOW_HEX.sunWarm}
                transparent
                opacity={isActive ? 0.11 : hovered ? 0.07 : 0.025}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          )}
        </group>

        {/* Pendulum Sway Pivot at Rail Level */}
        <group ref={swayGroupRef} position={[0, 0, 0]}>
          {/* Twin Stainless Vertical Suspension Cables */}
          <mesh position={[-0.24, -slot.cableLength / 2, 0]}>
            <cylinderGeometry args={[0.008, 0.008, slot.cableLength, 8]} />
            <meshStandardMaterial
              color={isActive ? beamHex : HEX.fog}
              metalness={0.9}
              roughness={0.18}
            />
          </mesh>
          <mesh position={[0.24, -slot.cableLength / 2, 0]}>
            <cylinderGeometry args={[0.008, 0.008, slot.cableLength, 8]} />
            <meshStandardMaterial
              color={isActive ? beamHex : HEX.fog}
              metalness={0.9}
              roughness={0.18}
            />
          </mesh>

          {/* Suspended Coat-Hanger Collar & Exhibition Frame Assembly */}
          <group position={[0, y - RAIL_Y, 0]}>
            {/* Sculpted Steel Hanger Hook & Shoulder Crossbar */}
            <mesh position={[0, 0.91, 0]}>
              <torusGeometry args={[0.065, 0.015, 10, 20, Math.PI]} />
              <meshStandardMaterial color={trimColor} metalness={0.85} roughness={0.22} />
            </mesh>
            <mesh position={[0, 0.855, 0]}>
              <boxGeometry args={[0.64, 0.045, 0.045]} />
              <meshStandardMaterial color={HEX.ink} metalness={0.82} roughness={0.26} />
            </mesh>
            <mesh position={[0, 0.855, 0.03]}>
              <boxGeometry args={[0.16, 0.03, 0.02]} />
              <meshStandardMaterial
                color={isActive ? beamHex : HEX.fog}
                emissive={isActive ? beamHex : HEX.ink}
                emissiveIntensity={isActive ? 1.1 : 0.05}
              />
            </mesh>

            {/* Main Physical Hanging Frame Backing Plate (clickable 3D mesh) */}
            <mesh
              onClick={handleClick}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
              }}
              onPointerOut={() => setHovered(false)}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[1.18, 1.62, 0.05]} />
              <meshStandardMaterial
                color={frameColor}
                metalness={0.55}
                roughness={0.38}
              />
            </mesh>

            {/* Native WebGL Poster Surface locked flush inside front frame bezel */}
            <mesh position={[0, 0, 0.028]} onClick={handleClick}>
              <planeGeometry args={[1.08, 1.512]} />
              <meshBasicMaterial
                map={posterTexture}
                color={isActive || hovered ? HEX.paper : HEX.bone}
                toneMapped={false}
              />
            </mesh>

            {/* Perimeter Metallic Edge Halo */}
            <mesh position={[0, 0, -0.002]}>
              <boxGeometry args={[1.22, 1.66, 0.032]} />
              <meshStandardMaterial
                color={trimColor}
                emissive={isActive ? beamHex : hovered ? HEX.paper : HEX.ink}
                emissiveIntensity={isActive ? 0.95 : hovered ? 0.35 : 0.04}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>

            {/* Rear Exhibition Back Plate & Spine Hardware (visible on 360° orbit) */}
            <mesh position={[0, 0, -0.028]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[1.08, 1.5]} />
              <meshStandardMaterial color={HEX.ink} metalness={0.3} roughness={0.75} />
            </mesh>
            <mesh position={[0, 0.08, -0.04]}>
              <boxGeometry args={[0.07, 1.1, 0.02]} />
              <meshStandardMaterial color={HEX.steel} metalness={0.75} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.62, -0.04]}>
              <boxGeometry args={[0.72, 0.07, 0.02]} />
              <meshStandardMaterial
                color={isActive ? beamHex : HEX.fog}
                emissive={isActive ? beamHex : HEX.ink}
                emissiveIntensity={isActive ? 0.85 : 0}
              />
            </mesh>
          </group>
        </group>
      </group>

      {/* Travertine Stone Plinth & Refined Botanical Collar under Exhibit */}
      <group position={[0, FLOOR_Y, 0]} rotation={[0, slot.rotationY, 0]}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[0.56, 0.66, 0.08, 32]} />
          <meshStandardMaterial
            color={MEADOW_HEX.stoneCream}
            metalness={0.04}
            roughness={0.86}
          />
        </mesh>
        <mesh position={[0, 0.044, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.54, 0.59, 40]} />
          <meshStandardMaterial
            color={
              isActive
                ? beamHex
                : hovered
                ? MEADOW_HEX.pergolaBrass
                : MEADOW_HEX.pergolaBronze
            }
            emissive={isActive ? beamHex : hovered ? MEADOW_HEX.sunWarm : HEX.ink}
            emissiveIntensity={isActive ? 0.65 : hovered ? 0.2 : 0}
            metalness={0.75}
            roughness={0.32}
          />
        </mesh>
        <mesh position={[0, 0.052, 0.66]}>
          <boxGeometry args={[0.36, 0.022, 0.095]} />
          <meshStandardMaterial
            color={isActive ? beamHex : MEADOW_HEX.pergolaBrass}
            emissive={isActive ? beamHex : HEX.ink}
            emissiveIntensity={isActive ? 0.55 : 0}
            metalness={0.8}
            roughness={0.28}
          />
        </mesh>
      </group>
    </group>
  );
}

interface ExhibitionCameraControllerProps {
  slots: ExhibitSlot[];
  activeIndex: number;
  viewMode: GalleryViewMode;
  overviewCameraPos: [number, number, number];
  overviewTarget: [number, number, number];
  cameraResetTick: number;
  onUserInteract?: () => void;
}

function ExhibitionCameraController({
  slots,
  activeIndex,
  viewMode,
  overviewCameraPos,
  overviewTarget,
  cameraResetTick,
  onUserInteract,
}: ExhibitionCameraControllerProps) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const isFlyingRef = useRef(true);
  const desiredPosVec = useMemo(() => new THREE.Vector3(), []);
  const desiredTargetVec = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    isFlyingRef.current = true;
  }, [activeIndex, viewMode, cameraResetTick, slots.length]);

  useFrame((_, delta) => {
    if (!isFlyingRef.current || !controlsRef.current) return;

    if (viewMode === "overview" || !slots[activeIndex]) {
      desiredPosVec.set(...overviewCameraPos);
      desiredTargetVec.set(...overviewTarget);
    } else {
      const targetSlot = slots[activeIndex];
      const [sx, sy, sz] = targetSlot.position;
      const forwardX = Math.sin(targetSlot.rotationY);
      const forwardZ = Math.cos(targetSlot.rotationY);
      const viewDist = 2.85;
      desiredPosVec.set(
        sx + forwardX * viewDist,
        sy + 0.12,
        sz + forwardZ * viewDist
      );
      desiredTargetVec.set(sx, sy - 0.02, sz);
    }

    const alpha = 1 - Math.exp(-Math.min(delta, 0.1) * 5.2);
    controlsRef.current.object.position.lerp(desiredPosVec, alpha);
    controlsRef.current.target.lerp(desiredTargetVec, alpha);
    controlsRef.current.update();

    if (
      controlsRef.current.object.position.distanceTo(desiredPosVec) < 0.035 &&
      controlsRef.current.target.distanceTo(desiredTargetVec) < 0.035
    ) {
      isFlyingRef.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.075}
      enablePan={false}
      minDistance={2.2}
      maxDistance={15}
      minPolarAngle={Math.PI * 0.14}
      maxPolarAngle={Math.PI * 0.56}
      onStart={() => {
        isFlyingRef.current = false;
        onUserInteract?.();
      }}
    />
  );
}

/**
 * Architectural 3D Hanging Garment Exhibition Gallery:
 * - Curved brushed-steel ceiling suspension rail + secondary lighting track + columns
 * - Spaced hanging exhibit stations rendered natively in WebGL (`CanvasTexture`) for zero DPI/CSS3D drift
 * - Dedicated floor plinths & volumetric spotlight pools under every exhibit
 * - Full 360 OrbitControls walkthrough + smooth click-to-focus camera glides
 */
export function ExhibitionGalleryScene({
  products,
  activeIndex,
  viewMode,
  ambience,
  beamTone,
  cameraResetTick,
  onSelect,
  onUserInteract,
}: ExhibitionGallerySceneProps) {
  const beamHex = BEAM_COLORS[beamTone];
  const {
    slots,
    railPoints,
    trackPoints,
    overviewCameraPos,
    overviewTarget,
    columnPositions,
  } = useMemo(() => computeGalleryLayout(products), [products]);

  const railGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(railPoints);
    return new THREE.TubeGeometry(curve, 64, 0.045, 12, false);
  }, [railPoints]);

  const trackGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(trackPoints);
    return new THREE.TubeGeometry(curve, 64, 0.03, 10, false);
  }, [trackPoints]);

  useEffect(() => {
    return () => {
      railGeo.dispose();
      trackGeo.dispose();
    };
  }, [railGeo, trackGeo]);

  const fogHex = ambience === "day" ? MEADOW_HEX.mistDay : MEADOW_HEX.mistNight;
  const fogDensity = ambience === "day" ? 0.02 : 0.025;

  return (
    <>
      <color attach="background" args={[fogHex]} />
      <fogExp2 attach="fog" args={[fogHex, fogDensity]} />

      {/* Local Procedural IBL Environment Reflections (zero network dependency) */}
      <Environment resolution={256} frames={1}>
        <color
          attach="background"
          args={[ambience === "day" ? MEADOW_HEX.skyDayMid : MEADOW_HEX.skyNight]}
        />
        <Lightformer
          form="circle"
          intensity={ambience === "day" ? 3.8 : 1.1}
          color={ambience === "day" ? MEADOW_HEX.sunWarm : MEADOW_HEX.cloudShadow}
          position={[9, 6, -15]}
          scale={7}
        />
        <Lightformer
          form="rect"
          intensity={ambience === "day" ? 1.25 : 0.55}
          color={ambience === "day" ? MEADOW_HEX.skyDayHorizon : MEADOW_HEX.skyNightHorizon}
          position={[0, 9, 2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[24, 14, 1]}
        />
        <Lightformer
          form="rect"
          intensity={ambience === "day" ? 0.85 : 0.3}
          color={ambience === "day" ? MEADOW_HEX.lawnMid : MEADOW_HEX.lawnDeep}
          position={[0, -5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[22, 22, 1]}
        />
      </Environment>

      {/* Natural Botanical Golden-Hour & Twilight Lighting Rig */}
      <hemisphereLight
        args={[
          ambience === "day" ? MEADOW_HEX.skyDay : MEADOW_HEX.skyNightHorizon,
          ambience === "day" ? MEADOW_HEX.lawnMid : MEADOW_HEX.skyNight,
          ambience === "day" ? 0.95 : 0.62,
        ]}
      />
      <ambientLight intensity={ambience === "day" ? 0.28 : 0.24} />
      <directionalLight
        position={[9.5, 6.2, -14.5]}
        intensity={ambience === "day" ? 2.35 : 0.95}
        color={ambience === "day" ? MEADOW_HEX.sunWarm : MEADOW_HEX.cloudShadow}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-near={1}
        shadow-camera-far={42}
        shadow-bias={-0.0005}
        shadow-normalBias={0.035}
      />
      <directionalLight
        position={[-4.5, 5.5, 9.0]}
        intensity={ambience === "day" ? 0.82 : 0.65}
        color={ambience === "day" ? MEADOW_HEX.petalCream : beamHex}
      />
      <pointLight
        position={[0, 2.2, 1.8]}
        intensity={ambience === "day" ? 0.65 : 1.95}
        distance={18}
        color={ambience === "day" ? MEADOW_HEX.sunWarm : MEADOW_HEX.petalGold}
      />

      {/* Overhead Botanical Wrought-Bronze Pergola Rail & Lighting Track */}
      <mesh geometry={railGeo} castShadow>
        <meshStandardMaterial
          color={MEADOW_HEX.pergolaBronze}
          metalness={0.72}
          roughness={0.28}
        />
      </mesh>
      <mesh geometry={trackGeo} castShadow>
        <meshStandardMaterial
          color={MEADOW_HEX.pergolaCedar}
          metalness={0.35}
          roughness={0.55}
        />
      </mesh>

      {/* Fluted Botanical Bronze Stanchions Rooted in Limestone Bases */}
      {columnPositions.map(([cx, , cz], i) => (
        <group key={`col-${i}`} position={[cx, 0, cz]}>
          <mesh position={[0, (RAIL_Y + 0.35 + FLOOR_Y) / 2, 0]} castShadow>
            <cylinderGeometry
              args={[0.05, 0.068, RAIL_Y + 0.35 - FLOOR_Y, 16]}
            />
            <meshStandardMaterial
              color={MEADOW_HEX.pergolaBronze}
              metalness={0.68}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, FLOOR_Y + 0.075, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.15, 0.21, 0.16, 20]} />
            <meshStandardMaterial
              color={MEADOW_HEX.stoneWarm}
              roughness={0.86}
            />
          </mesh>
          <mesh position={[0, RAIL_Y + 0.37, 0]}>
            <cylinderGeometry args={[0.085, 0.11, 0.09, 16]} />
            <meshStandardMaterial
              color={MEADOW_HEX.pergolaBrass}
              metalness={0.85}
              roughness={0.24}
            />
          </mesh>
        </group>
      ))}

      {/* Drifting Sunlit Golden Pollen Motes / Twilight Garden Fireflies */}
      <Sparkles
        count={ambience === "day" ? 38 : 62}
        scale={[15, 4.6, 10]}
        position={[0, 0.6, -0.5]}
        size={ambience === "day" ? 1.65 : 1.95}
        speed={0.22}
        opacity={ambience === "day" ? 0.48 : 0.78}
        color={ambience === "day" ? MEADOW_HEX.sunWarm : MEADOW_HEX.petalGold}
      />

      {/* Lush Green Meadow Grass, Blooming Flowers, Ivy Vines & Garden Stepping Path */}
      <BotanicalMeadowStage
        slots={slots}
        railPoints={railPoints}
        columnPositions={columnPositions}
        floorY={FLOOR_Y}
        railY={RAIL_Y}
        ambience={ambience}
        beamHex={beamHex}
      />

      {/* Suspended Hanging Garment Stations */}
      {slots.map((slot) => (
        <HangingStation
          key={slot.product.id}
          slot={slot}
          isActive={slot.index === activeIndex}
          beamHex={beamHex}
          ambience={ambience}
          onSelect={onSelect}
        />
      ))}

      {/* OrbitControls + Smooth Gallery Fly-To Controller */}
      <ExhibitionCameraController
        slots={slots}
        activeIndex={activeIndex}
        viewMode={viewMode}
        overviewCameraPos={overviewCameraPos}
        overviewTarget={overviewTarget}
        cameraResetTick={cameraResetTick}
        onUserInteract={onUserInteract}
      />
    </>
  );
}
