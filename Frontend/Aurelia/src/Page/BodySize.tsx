import { useContext, useState, useEffect } from "react";
import { DashBoardMeasures } from "../Components/AiModelBodySize/DashBoardMesuares";
import { Main } from "../Components/AiModelBodySize/Main";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { AiPoseMeasureContext } from "../contexts/AIPoseMeasure";

export const BodySize = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const { DataMeasure, postMeasureToDB } = useContext(AiPoseMeasureContext);
  const [safeData, setSafeData] = useState(false);

  useEffect(() => {
    if (safeData) {
      postMeasureToDB();
      setSafeData(false);
    }
  }, [safeData, postMeasureToDB]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--color-bone)]/85 text-[var(--color-ink)] py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Top Soundcheck Optical Header */}
          <div className="mb-6 p-5 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
                  [OPTICAL RIG // SOUNDCHECK-06]
                </span>
                <span className="mono-label text-[var(--color-ink-muted)]">
                  MEDIAPIPE 3D POSE CALIBRATION
                </span>
              </div>
              <h1 className="display-m font-display-safe text-[var(--color-ink)]">
                Buồng Đo Quang Học AI
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  isCameraOn
                    ? "bg-[var(--color-flash)] animate-pulse"
                    : "bg-[var(--color-ink-muted)]"
                }`}
              />
              <span className="mono-label text-[var(--color-ink)]">
                {isCameraOn ? "OPTICAL SENSOR LIVE" : "STANDBY MODE"}
              </span>
            </div>
          </div>

          {/* 12-col Grid: 7-col Flat Camera Frame + 5-col Measurement Rig */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <Main isCameraOn={isCameraOn} setIsCameraOn={setIsCameraOn} />
            </div>
            <div className="lg:col-span-5">
              <DashBoardMeasures
                setIsCameraOn={setIsCameraOn}
                iscameraOn={isCameraOn}
                datas={DataMeasure}
                setDatas={setSafeData}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
