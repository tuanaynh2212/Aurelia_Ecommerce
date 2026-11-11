import { useNavigate } from "react-router-dom";
import { ScanLine } from "lucide-react";
import { SectionTitle } from "../UI/primitives/SectionTitle";
import { Equalizer, SegmentMeter } from "../UI/primitives/Meter";
import { ReceiptRow } from "../UI/primitives/Receipt";
import { Button } from "../UI/primitives/Button";
import { SceneShell } from "../UI/three/SceneShell";
import { MannequinRig } from "../UI/three/MannequinRig";

const SOUNDCHECK_METERS = [
  { ch: "CH-01", code: "VAI", label: "Vai (Shoulder)", value: 0.78 },
  { ch: "CH-02", code: "NGỰC", label: "Ngực (Chest)", value: 0.84 },
  { ch: "CH-03", code: "EO", label: "Eo (Waist)", value: 0.68 },
  { ch: "CH-04", code: "HÔNG", label: "Hông (Hip)", value: 0.88 },
  { ch: "CH-05", code: "CAO", label: "Chiều cao (Height)", value: 0.92 },
] as const;

export function SoundcheckConsole() {
  const navigate = useNavigate();

  return (
    <section
      aria-label="Soundcheck AI Size Advisor"
      className="stage-grid-dark border-b-[3px] border-ink bg-ink py-14 md:py-20 text-paper"
    >
      <div className="container-atelier">
        <SectionTitle
          tone="dark"
          index="08"
          eyebrow="SOUNDCHECK // MIXING CONSOLE & OPTICAL BODY RIG"
          title="KIỂM ÂM & ĐO SỐ ĐO CƠ THỂ AI"
          subtitle="Quét 5 thông số cơ thể trực tiếp qua camera trước giờ diễn để nhận gợi ý kích cỡ chuẩn xác."
        />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 6 cols: Soundboard chassis + 5-ring wireframe monitor + channel faders */}
          <div className="flex flex-col border-[3px] border-paper/45 bg-ink shadow-hard-volt lg:col-span-6 rounded-[2px] overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-paper/30 bg-ink px-4 py-2.5 mono-label text-[10px] font-bold text-paper">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-flash animate-rec" aria-hidden="true" />
                [SOUNDCHECK CONSOLE // 5-BAND RIG]
              </span>
              <span className="inline-flex items-center gap-2 text-volt">
                <Equalizer bars={6} className="h-3.5 [&>span]:w-1 [&>span]:bg-volt" />
                CALIBRATED
              </span>
            </div>

            {/* Bright oscilloscope bay so black wireframe + neon rings pop */}
            <div className="relative h-[320px] w-full bg-bone">
              <SceneShell
                station="OPTICAL_RIG"
                cameraPosition={[0, 0.2, 4.4]}
                fallbackTitle="OPTICAL RIG"
              >
                <MannequinRig />
              </SceneShell>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-3 border border-ink bg-volt px-2 py-0.5 mono-label text-[9px] font-extrabold text-ink"
              >
                MONITOR A // LIVE RIG
              </span>
            </div>

            {/* Console faceplate for 5 audio/body faders */}
            <div className="border-t-2 border-ink bg-paper p-4 text-ink">
              <div className="mb-3 flex items-center justify-between border-b border-dashed border-ink pb-2 mono-label text-[10px] font-extrabold text-ink-muted">
                <span>CHANNEL FADER BANK (01–05)</span>
                <span className="text-ink">SIGNAL: LOCKED</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {SOUNDCHECK_METERS.map((m) => (
                  <div key={m.code} className="space-y-1">
                    <div className="flex justify-between mono-label text-[10px] font-bold text-ink">
                      <span>[{m.ch} · {m.code}]</span>
                      <span className="text-ink-muted">{m.label}</span>
                    </div>
                    <SegmentMeter value={m.value} segments={10} size="sm" tone="volt" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 6 cols: Stage briefing & CTA */}
          <div className="flex flex-col justify-between border-[3px] border-volt bg-paper p-6 text-ink shadow-hard-flash md:p-8 lg:col-span-6 rounded-[2px]">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-block border-2 border-ink bg-volt px-2.5 py-1 mono-label text-xs font-extrabold text-ink">
                  [AI POSE SOUNDCHECK]
                </span>
                <span className="mono-label text-[10px] font-extrabold text-ink-muted">
                  BOOTH 08 // READY
                </span>
              </div>

              <h3 className="mt-4 display-m font-display-safe text-ink">
                CHỌN ĐÚNG PHOM NGAY TỪ LẦN ĐẦU TIÊN
              </h3>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">
                Hệ thống nhận diện khung xương MediaPipe phân tích 5 chỉ số: vai, ngực, eo, hông và chiều cao theo thời gian thực ngay trên trình duyệt — không lưu trữ hình ảnh cá nhân.
              </p>

              <div className="mt-6 border-2 border-ink bg-bone p-4">
                <ReceiptRow label="01. Khởi động Camera" value="LIVE POSE" />
                <ReceiptRow label="02. Đo 5 vòng tự động" value="VAI · NGỰC · EO · HÔNG · CAO" />
                <ReceiptRow label="03. Áp dụng vào trang sản phẩm" value="XS — XXL" tone="volt" />
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="primary"
                size="lg"
                block
                onClick={() => navigate("/bodyMeasurements")}
                iconLeft={<ScanLine size={18} strokeWidth={2.5} />}
              >
                Mở phòng đo AI (Soundcheck)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

