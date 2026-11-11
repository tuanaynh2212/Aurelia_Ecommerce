import React, { useContext } from "react";
import { Crown, Gift, Sparkles, Star, Shield, Award } from "lucide-react";
import { AuthContext } from "../../../../contexts/Author";
import { SegmentMeter, DottedLeaderRow } from "../../../UI";
import { Canvas } from "@react-three/fiber";
import { StudioLights } from "../../../UI/three/StudioLights";
import { FloatingPass } from "../../../UI/three/FloatingPass";
import { toTierKey } from "../../../UI/three/palette";

type TierDefinition = {
  name: string;
  max: number;
  icon: React.ElementType;
  benefits: string[];
};

const TIERS: Record<string, TierDefinition> = {
  Bronze: {
    name: "Đồng (Bronze)",
    max: 500,
    icon: Star,
    benefits: ["Ưu đãi sinh nhật 3%", "Tích điểm 1% mỗi đơn hàng"],
  },
  Silver: {
    name: "Bạc (Silver)",
    max: 1000,
    icon: Shield,
    benefits: ["Miễn phí vận chuyển đơn đầu tiên", "Ưu đãi sinh nhật 5%"],
  },
  Gold: {
    name: "Vàng (Gold)",
    max: 5000,
    icon: Award,
    benefits: ["Giảm 10% tất cả sản phẩm", "Ưu tiên may đo & hỗ trợ 1-1"],
  },
  Diamond: {
    name: "Kim Cương (Diamond)",
    max: 10000,
    icon: Sparkles,
    benefits: ["Giảm 15% trọn đời", "Quà tri ân mỗi quý & tư vấn stylist"],
  },
  Royal: {
    name: "Hoàng Gia (Royal)",
    max: 20000,
    icon: Crown,
    benefits: ["Giảm 20%", "Hỗ trợ riêng 24/7", "Lời mời sự kiện VIP kín"],
  },
  "Royal Plus": {
    name: "Thượng Hạng (Royal Plus)",
    max: 999999,
    icon: Gift,
    benefits: ["Giảm 30%", "Bộ sưu tập may đo bespoke giới hạn"],
  },
};

export const BarprocessTier: React.FC<{ userRole?: string }> = ({
  userRole,
}) => {
  const { userData } = useContext(AuthContext);

  const currentPoints =
    typeof userData?.point === "number" ? userData.point : 0;
  const currentTier = userRole || userData?.tier || "Bronze";

  const nextTierKey =
    currentPoints < 500
      ? "Silver"
      : currentPoints < 1000
      ? "Gold"
      : currentPoints < 5000
      ? "Diamond"
      : currentPoints < 10000
      ? "Royal"
      : "Royal Plus";

  const nextTierInfo = TIERS[nextTierKey] || TIERS["Silver"];
  const currentTierInfo = TIERS[currentTier] || TIERS["Bronze"];
  const CurrentIcon = currentTierInfo.icon;
  const NextIcon = nextTierInfo.icon;

  const percent = Math.min(
    Math.max((currentPoints / nextTierInfo.max) * 100, 4),
    100
  );
  const pointsRemaining = Math.max(nextTierInfo.max - currentPoints, 0);

  return (
    <section className="bg-[var(--color-bone)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] p-6 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Desktop 3D FloatingPass Loyalty Lanyard */}
        <div className="lg:col-span-5 h-56 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] relative overflow-hidden">
          <span className="absolute top-2 left-2 z-10 hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
            [ACRYLIC PASS // {currentTier.toUpperCase()}]
          </span>
          <Canvas camera={{ position: [0, 0, 3.8], fov: 42 }}>
            <StudioLights />
            <FloatingPass
              tier={toTierKey(currentTier)}
              holderName={userData?.name || "AURELIA MEMBER"}
              pointsText={`${currentPoints} PTS`}
            />
          </Canvas>
        </div>

        {/* Tier Progress & Dotted Leader Perks */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b-2 border-[var(--color-ink)] pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[var(--color-volt)] border-2 border-[var(--color-ink)] text-[var(--color-ink)]">
                <CurrentIcon size={16} />
              </span>
              <div>
                <h3 className="font-display-safe text-lg font-extrabold uppercase text-[var(--color-ink)]">
                  Thành Viên Hạng {currentTier}
                </h3>
                <p className="mono-label text-[var(--color-ink-muted)]">
                  Mã thẻ cá nhân · Tiến trình tích lũy điểm thưởng
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="font-mono text-2xl font-extrabold text-[var(--color-flash)] tabular-nums">
                {currentPoints.toLocaleString("vi-VN")}
              </span>
              <span className="mono-label text-[var(--color-ink-muted)] ml-1">
                ĐIỂM
              </span>
            </div>
          </div>

          <SegmentMeter
            value={percent}
            max={100}
            segments={20}
            accent="volt"
            label={`TIẾN ĐỘ LÊN HẠNG ${nextTierInfo.name.toUpperCase()}`}
          />

          <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-3.5 space-y-2">
            <DottedLeaderRow
              label="HẠNG TIẾP THEO"
              value={
                <span className="inline-flex items-center gap-1">
                  <NextIcon size={12} className="text-[var(--color-flash)]" />
                  {nextTierInfo.name}
                </span>
              }
            />
            <DottedLeaderRow
              label="ĐIỂM CẦN TÍCH LŨY THÊM"
              value={`${pointsRemaining.toLocaleString("vi-VN")} PTS`}
            />
            <DottedLeaderRow
              label="ĐẶC QUYỀN KẾ TIẾP"
              value={nextTierInfo.benefits[0]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
