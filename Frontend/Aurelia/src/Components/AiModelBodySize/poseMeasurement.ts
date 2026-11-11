import type { NormalizedLandmarkList } from "@mediapipe/pose";
import { CSS } from "../UI/three/palette";

type Point3D = { x: number; y: number; z: number };

export interface MeasurementBuffer {
  vai: number[];
  nguc: number[];
  eo: number[];
  hong: number[];
  chieuCao: number[];
}

export interface BodyMeasurements {
  vai: string;
  nguc: string;
  eo: string;
  hong: string;
  chieuCao: string;
}

const BUFFER_SIZE = 20;

export function createMeasurementBuffer(): MeasurementBuffer {
  return { vai: [], nguc: [], eo: [], hong: [], chieuCao: [] };
}

function calculate3DDistance(p1: Point3D, p2: Point3D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = p1.z - p2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function calculateDepthFromZ(
  leftZ: number,
  rightZ: number,
  baseWidth: number
): number {
  const zDiff = Math.abs(leftZ - rightZ);
  const ratio = Math.max(0.7, Math.min(1.0, 0.8 + (zDiff > 0.03 ? zDiff * 2 : 0)));
  return baseWidth * ratio;
}

function calculateEllipseCircumference(width: number, depth: number): number {
  const a = width / 2;
  const b = depth / 2;
  const h = Math.pow((a - b) / (a + b), 2);
  return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
}

function interpolatePoint(a: Point3D, b: Point3D, weightB: number): Point3D {
  const weightA = 1 - weightB;
  return {
    x: a.x * weightA + b.x * weightB,
    y: a.y * weightA + b.y * weightB,
    z: a.z * weightA + b.z * weightB,
  };
}

function estimateCircumferenceCm(
  left: Point3D,
  right: Point3D,
  scaleFactor = 1
): number {
  const width = calculate3DDistance(left, right);
  const depth = calculateDepthFromZ(left.z, right.z, width);
  return calculateEllipseCircumference(width, depth) * 100 * scaleFactor;
}

export function drawPoseLandmarks(
  ctx: CanvasRenderingContext2D,
  worldLandmarks: NormalizedLandmarkList,
  poseLandmarks: NormalizedLandmarkList,
  width: number,
  height: number
): void {
  worldLandmarks.forEach((l, i) => {
    const p = poseLandmarks[i];
    if (!p || !l) return;
    ctx.beginPath();
    ctx.arc(p.x * width, p.y * height, 5, 0, 2 * Math.PI);
    ctx.fillStyle =
      l.z > 0.02 ? CSS.flash : l.z < -0.02 ? CSS.info : CSS.success;
    ctx.globalAlpha = Math.max(0.3, l.visibility || 0);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

export function updateMeasurementBuffer(
  buffer: MeasurementBuffer,
  worldLandmarks: NormalizedLandmarkList
): BodyMeasurements {
  const head = worldLandmarks[0];
  const shoulderLeft = worldLandmarks[11];
  const shoulderRight = worldLandmarks[12];
  const leftHip = worldLandmarks[23];
  const rightHip = worldLandmarks[24];
  const leftFoot = worldLandmarks[31];
  const rightFoot = worldLandmarks[32];

  const shoulderWidth = calculate3DDistance(shoulderLeft, shoulderRight);
  const leftWaist = interpolatePoint(shoulderLeft, leftHip, 0.7);
  const rightWaist = interpolatePoint(shoulderRight, rightHip, 0.7);

  const sample: Record<keyof MeasurementBuffer, number> = {
    vai: shoulderWidth * 1.38 * 100,
    nguc: estimateCircumferenceCm(shoulderLeft, shoulderRight),
    eo: estimateCircumferenceCm(leftWaist, rightWaist, 1.44),
    hong: estimateCircumferenceCm(leftHip, rightHip, 1.62),
    chieuCao: (Math.max(leftFoot.y, rightFoot.y) - head.y) * 100,
  };

  const keys = Object.keys(sample) as (keyof MeasurementBuffer)[];
  for (const key of keys) {
    if (buffer[key].length >= BUFFER_SIZE) {
      buffer[key].shift();
    }
    buffer[key].push(sample[key]);
  }

  const avg = (values: number[]) =>
    Math.round(values.reduce((a, b) => a + b, 0) / values.length).toString();

  return {
    vai: avg(buffer.vai),
    nguc: avg(buffer.nguc),
    eo: avg(buffer.eo),
    hong: avg(buffer.hong),
    chieuCao: avg(buffer.chieuCao),
  };
}

