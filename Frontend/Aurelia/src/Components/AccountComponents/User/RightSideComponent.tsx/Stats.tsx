import React from "react";
import { Clock, Heart, ShieldCheck, ShoppingBag } from "lucide-react";
import { formatVND, formatDateOnly, getRelativeTimeVi } from "../../../../utils/formatters";

type StatsProps = {
  tongThuChi?: number | string | null;
  soLuongDonHang?: number | null;
  lastPurchaseDate?: string | number | Date | null;
  userRole?: string | null;
  dataFavouriteItemUser?: any[] | null;
};

export const Stats: React.FC<StatsProps> = ({
  tongThuChi = 0,
  soLuongDonHang = 0,
  lastPurchaseDate,
  userRole = "Bronze",
  dataFavouriteItemUser = [],
}) => {
  const safeDonHang = Number(soLuongDonHang) || 0;
  const safeFavourites = Array.isArray(dataFavouriteItemUser) ? dataFavouriteItemUser.length : 0;
  const safeSpent = formatVND(tongThuChi);
  const relativeDate = lastPurchaseDate ? getRelativeTimeVi(lastPurchaseDate) : "";

  const stats = [
    {
      title: "Tổng Chi Tiêu",
      value: safeSpent,
      subtitle: `${safeDonHang} đơn hàng`,
      icon: ShoppingBag,
    },
    {
      title: "Mua Gần Nhất",
      value: lastPurchaseDate ? formatDateOnly(lastPurchaseDate) : "Chưa có đơn",
      subtitle: relativeDate ? `Gần đây (${relativeDate})` : "Chưa phát sinh",
      icon: Clock,
    },
    {
      title: "Hạng Thành Viên",
      value: `Hạng ${userRole || "Bronze"}`,
      subtitle: "Tài khoản đang hoạt động",
      icon: ShieldCheck,
    },
    {
      title: "Đã Lưu Yêu Thích",
      value: `${safeFavourites} sản phẩm`,
      subtitle: "Bộ sưu tập cá nhân",
      icon: Heart,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={i}
            className="
              relative
              bg-paper
              border border-rule/80
              rounded-tag
              p-5
              flex flex-col
              justify-between
              min-h-[136px]
              transition-all
              hover:border-ink/30
              hover:shadow-tag
              shadow-sm
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-hole bg-kraft/70 border border-ink/20" />
                <span className="text-[10px] font-mono tracking-widest uppercase text-ink-muted">
                  {s.title}
                </span>
              </div>
              <div className="w-7 h-7 rounded-tag bg-kraft/15 border border-kraft-dark/20 flex items-center justify-center text-ink-muted">
                <Icon size={14} />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xl md:text-2xl font-mono font-semibold text-ink tracking-tight">
                {s.value}
              </p>
              <p className="text-xs font-mono text-ink-muted mt-1.5 flex items-center gap-1">
                {s.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

