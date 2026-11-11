import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { Pose, type Results } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { ArrowBigLeftDashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiPoseMeasureContext } from "../../contexts/AIPoseMeasure";
import {
  createMeasurementBuffer,
  drawPoseLandmarks,
  updateMeasurementBuffer,
} from "./poseMeasurement";

type MainCamera = {
  isCameraOn: boolean;
  setIsCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Main: React.FC<MainCamera> = ({ isCameraOn, setIsCameraOn }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { setDataMeasure } = useContext(AiPoseMeasureContext);
  const [popUp, setPopup] = useState(false);
  const [number, setNumber] = useState(3);
  const [appearText, setAppearText] = useState(false);
  const isCountingDownRef = useRef(false);
  const countdownIntervalRef = useRef<number | null>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraInstanceRef = useRef<Camera | null>(null);
  const measurementBufferRef = useRef(createMeasurementBuffer());
  const isMobile = window.innerWidth < 768;

  const navigate = useNavigate();

  const stopCountdown = useCallback(() => {
    if (countdownIntervalRef.current !== null) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    isCountingDownRef.current = false;
    setPopup(false);
  }, []);

  const handleResults = useCallback(
    (results: Results) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !video || !ctx) return;

      const { width, height } = canvas;
      requestAnimationFrame(() => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(video, 0, 0, width, height);
        if (!results.poseWorldLandmarks?.length || !results.poseLandmarks) {
          return;
        }
        drawPoseLandmarks(
          ctx,
          results.poseWorldLandmarks,
          results.poseLandmarks,
          width,
          height
        );

        const rightHand = results.poseLandmarks[16];
        if (!rightHand) return;

        const handInBox = rightHand.y < 0.45;
        if (isCountingDownRef.current && !handInBox) {
          stopCountdown();
          return;
        }
        if (isCountingDownRef.current || !handInBox) return;

        isCountingDownRef.current = true;
        setNumber(3);
        setPopup(true);

        const landmarks = results.poseWorldLandmarks;
        countdownIntervalRef.current = window.setInterval(() => {
          setNumber((prev) => {
            if (prev <= 1) {
              stopCountdown();
              setDataMeasure(
                updateMeasurementBuffer(measurementBufferRef.current, landmarks)
              );
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      });
    },
    [setDataMeasure, stopCountdown]
  );

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!isCameraOn || !videoEl || !canvasRef.current) return;

    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    pose.setOptions({
      modelComplexity: isMobile ? 0 : 2,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(handleResults);
    poseRef.current = pose;

    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: isMobile ? 640 : 1280,
          height: isMobile ? 480 : 720,
          frameRate: { ideal: isMobile ? 24 : 30 },
        },
        audio: false,
      })
      .then((stream) => {
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && poseRef.current) {
              await poseRef.current.send({ image: videoRef.current });
            }
          },
          width: 1280,
          height: 720,
        });
        cameraInstanceRef.current = camera;
        camera.start();
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });

    return () => {
      stopCountdown();
      cameraInstanceRef.current?.stop();
      cameraInstanceRef.current = null;

      const stream = videoEl.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        videoEl.srcObject = null;
      }

      poseRef.current?.close();
      poseRef.current = null;
    };
  }, [isCameraOn, handleResults, isMobile, stopCountdown]);

  return (
    <>
      <div className="fixed top-20 left-3 z-50">
        <motion.button
          transition={{ type: "spring", stiffness: 300 }}
          onHoverStart={() => setAppearText(true)}
          onHoverEnd={() => setAppearText(false)}
          onClick={() => navigate(-1)}
          className="min-h-[44px] min-w-[44px] flex items-center gap-2 px-4 py-2 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-[var(--shadow-hard)] text-[var(--color-ink)] mono-label hover:bg-[var(--color-volt)] cursor-pointer"
        >
          <ArrowBigLeftDashIcon className="w-5 h-5" />
          {appearText && <span>Quay Lại</span>}
        </motion.button>
      </div>

      <div className="flex flex-col items-center text-center justify-center md:hidden mb-4 w-full">
        <h2 className="display-m font-display-safe text-[var(--color-ink)]">
          Bảng Thông Số Cơ Thể
        </h2>
        <p className="mono-label text-[var(--color-ink-muted)] mt-1">
          Vui lòng đứng trước khung hình
        </p>
      </div>

      <div className="relative w-full h-[420px] md:h-[780px] border-2 border-[var(--color-ink)] bg-[var(--color-ink)] shadow-[var(--shadow-hard-lg)] overflow-hidden">
        <video
          ref={videoRef}
          className="hidden"
          autoPlay
          playsInline
          width={isMobile ? 400 : 2000}
          height={isMobile ? 400 : 2000}
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          width={isMobile ? 400 : 2000}
          height={isMobile ? 400 : 2000}
        />

        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[var(--color-volt)]" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[var(--color-volt)]" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[var(--color-volt)]" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[var(--color-volt)]" />

          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-25">
            <div className="border-r border-b border-[var(--color-paper)]" />
            <div className="border-r border-b border-[var(--color-paper)]" />
            <div className="border-b border-[var(--color-paper)]" />
            <div className="border-r border-b border-[var(--color-paper)]" />
            <div className="border-r border-b border-[var(--color-paper)]" />
            <div className="border-b border-[var(--color-paper)]" />
            <div className="border-r border-[var(--color-paper)]" />
            <div className="border-r border-[var(--color-paper)]" />
            <div />
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] border-2 border-[var(--color-paper)] px-3 py-1">
            <span
              className={`w-2.5 h-2.5 rounded-full bg-[var(--color-flash)] ${
                isCameraOn ? "animate-pulse" : "opacity-40"
              }`}
            />
            <span className="mono-label text-[10px]">
              {isCameraOn ? "REC // POSE-3D" : "CAM OFF"}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
            <span className="hud-chip">OPTICAL RIG · 2.0M STANDOFF</span>
            <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
              RAISE RIGHT HAND TO TRIGGER
            </span>
          </div>
        </div>

        <div className="flex w-full items-center justify-center md:hidden absolute bottom-14 left-0 z-40 right-0">
          <button
            onClick={() => setIsCameraOn(true)}
            className="min-h-[44px] px-5 py-2 border-2 border-[var(--color-ink)] bg-[var(--color-volt)] text-[var(--color-ink)] mono-label font-extrabold shadow-[var(--shadow-hard-sm)] cursor-pointer"
          >
            Bắt Đầu Đo
          </button>
        </div>

        <div className="absolute top-4 left-4 z-30">
          <button
            onClick={() => setIsCameraOn((prev) => !prev)}
            className="min-h-[44px] px-4 py-2 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-volt)] text-[var(--color-ink)] mono-label font-extrabold shadow-[var(--shadow-hard-sm)] cursor-pointer"
          >
            {isCameraOn ? "Tắt Camera" : "Bật Camera"}
          </button>
        </div>

        {popUp && (
          <div className="absolute inset-0 bg-[var(--color-ink)]/75 flex flex-col items-center justify-center z-40">
            <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)] mb-3">
              [HOLD STILL · CALIBRATING]
            </span>
            <h1 className="text-[var(--color-paper)] font-mono text-7xl font-extrabold tabular-nums">
              0{number}
            </h1>
          </div>
        )}
      </div>
    </>
  );
};
