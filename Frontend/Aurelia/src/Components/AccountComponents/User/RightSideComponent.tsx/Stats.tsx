import React from "react";
import { Clock, Heart, ShieldCheck, ShoppingBag } from "lucide-react";
import {
  formatVND,
  formatDateOnly,
  getRelativeTimeVi,
} from "../../../../utils/formatters";
import type { Product } from "../../../../types/type";
import { SplitFlap } from "../../../UI";

type StatsProps = {
  tongThuChi?: number | string | null;
  soLuongDonHang?: number | null;
  lastPurchaseDate?: string | number | Date | null;
  userRole?: string | null;
  dataFavouriteItemUser?: Product[] | null;
};

export const Stats: React.FC<StatsProps> = ({
  tongThuChi = 0,
  soLuongDonHang = 0,
  lastPurchaseDate,
  userRole = "Bronze",
  dataFavouriteItemUser = [],
}) => {
  const safeDonHang = Number(soLuongDonHang) || 0;
  const safeFavourites = Array.isArray(dataFavouriteItemUser)
    ? dataFavouriteItemUser.length
    : 0;
  const safeSpent = formatVND(tongThuChi);
  const relativeDate = lastPurchaseDate
    ? getRelativeTimeVi(lastPurchaseDate)
    : "";

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
            className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] p-5 flex flex-col justify-between min-h-[136px]"
          >
            <div className="flex items-center justify-between border-b-2 border-dashed border-[var(--color-ink)] pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-volt)] border border-[var(--color-ink)]" />
                <span className="mono-label text-[var(--color-ink)]">
                  {s.title}
                </span>
              </div>
              <div className="w-7 h-7 bg-[var(--color-bone)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-flash)]">
                <Icon size={14} />
              </div>
            </div>

            <div className="mt-4">
              <SplitFlap value={s.value} size="sm" />
              <p className="mono-label text-[10px] text-[var(--color-ink-muted)] mt-2">
                {s.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
