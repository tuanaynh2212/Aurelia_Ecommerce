
import React, { useContext } from "react";
import { Crown, Gift, Sparkles, Star, Shield, Award } from "lucide-react";
import { AuthContext } from "../../../../contexts/Author";

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

export const BarprocessTier: React.FC<{ userRole?: string }> = ({ userRole }) => {
  const { userData } = useContext(AuthContext);

  const currentPoints = typeof userData?.point === "number" ? userData.point : 0;
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

  const percent = Math.min(Math.max((currentPoints / nextTierInfo.max) * 100, 4), 100);
  const pointsRemaining = Math.max(nextTierInfo.max - currentPoints, 0);

  return (
    <section className="bg-paper border border-rule/80 rounded-tag shadow-tag p-6 mb-8 relative overflow-hidden">
      {/* Grommet punch corner */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-60">
        <div className="w-2.5 h-2.5 rounded-hole bg-kraft border border-ink/20 shadow-inner" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">
          THẺ HỘI VIÊN
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-tag bg-kraft/20 text-ink">
              <CurrentIcon size={16} className="text-cobalt" />
            </span>
            <h3 className="font-heading text-lg font-semibold text-ink">
              Thành Viên Hạng {currentTier}
            </h3>
          </div>
          <p className="font-mono text-xs text-ink-muted mt-1">
            Mã thẻ cá nhân · Tiến trình tích lũy điểm thưởng may đo
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="font-mono text-xl font-bold text-ink">
            {currentPoints.toLocaleString("vi-VN")}
          </span>
          <span className="font-mono text-xs text-ink-muted ml-1">điểm</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative h-2.5 w-full bg-kraft/25 rounded-tag overflow-hidden border border-rule mb-3">
        <div
          className="h-full bg-cobalt transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Bottom stats & next perk */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-ink-muted gap-2 pt-2 border-t border-rule/40">
        <div className="flex items-center gap-1.5">
          <span>Tiếp theo:</span>
          <span className="font-semibold text-ink flex items-center gap-1">
            <NextIcon size={13} className="text-cobalt" />
            {nextTierInfo.name}
          </span>
          <span>(còn {pointsRemaining.toLocaleString("vi-VN")} điểm)</span>
        </div>

        <div className="text-ink-muted flex items-center gap-1">
          <span className="text-cobalt">✦</span>
          <span>Đặc quyền kế tiếp: {nextTierInfo.benefits[0]}</span>
        </div>
      </div>
    </section>
  );
};

