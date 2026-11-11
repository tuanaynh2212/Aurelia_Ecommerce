import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "../../HomeLayoutComponent/Navbar";
import { LeftSide } from "./LeftSide";
import { RightSide } from "./RightSide";
import { FilterProductContext } from "../../../contexts/FIlterProduct";
import { AuthContext } from "../../../contexts/Author";
import { AiPoseMeasureContext } from "../../../contexts/AIPoseMeasure";

const NAV_ITEMS = [
  { name: "Tổng quan", value: "stats" },
  { name: "Đơn mua", value: "recentOrder" },
  { name: "Sản phẩm yêu thích", value: "favourite" },
  { name: "Lịch đặt hẹn", value: "listAppointment" },
  { name: "Mã giảm giá", value: "voucher" },
  { name: "Số đo cơ thể", value: "bodyMeasurement" },
  { name: "Cài đặt tài khoản", value: "accountSettings" },
];

export const DashBoard = () => {
  const { userData } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [activeItem, setActiveItemState] = useState(
    initialTab && NAV_ITEMS.some((n) => n.value === initialTab) ? initialTab : "stats"
  );

  useEffect(() => {
    const paramTab = searchParams.get("tab");
    if (paramTab && NAV_ITEMS.some((n) => n.value === paramTab)) {
      setActiveItemState(paramTab);
    } else if (!paramTab) {
      setActiveItemState("stats");
    }
  }, [searchParams]);

  const setActiveItem: React.Dispatch<React.SetStateAction<string>> = useCallback(
    (updater) => {
      setActiveItemState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        const nextParams = new URLSearchParams(searchParams);
        if (next === "stats") {
          nextParams.delete("tab");
        } else {
          nextParams.set("tab", next);
        }
        setSearchParams(nextParams, { replace: true });
        return next;
      });
    },
    [searchParams, setSearchParams]
  );

  const { DataMeasure } = useContext(AiPoseMeasureContext);
  const {
    dataFavouriteItemUser,
    soLuongDonHang,
    DonHang,
    TongThuChi,
  } = useContext(FilterProductContext);

  const safeOrderCount =
    typeof soLuongDonHang === "number" ? soLuongDonHang : DonHang?.length || 0;
  const safeFavCount = dataFavouriteItemUser?.length || 0;

  return (
    <div className="min-h-screen bg-[var(--color-bone)]/85 text-[var(--color-ink)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 mb-8 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-[var(--shadow-hard)]">
          <div className="flex items-center gap-2 mono-label text-[var(--color-ink-muted)]">
            <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
              [BACKSTAGE // CLIENT DOSSIER]
            </span>
            <span>/</span>
            <span className="text-[var(--color-ink)] font-extrabold">
              {NAV_ITEMS.find((n) => n.value === activeItem)?.name ||
                "Tổng quan"}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 mono-label text-[var(--color-ink-muted)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
            <span>KẾT NỐI AN TOÀN · 256-BIT SSL</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-20">
            <LeftSide
              userString={userData}
              navItems={NAV_ITEMS}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              orderCount={safeOrderCount}
              favouriteCount={safeFavCount}
            />
          </div>

          <div className="w-full flex-1 min-w-0">
            <RightSide
              setActiveItem={setActiveItem}
              dataFavouriteItemUser={dataFavouriteItemUser}
              userRole={userData?.tier}
              soLuongDonHang={safeOrderCount}
              tongThuChi={TongThuChi}
              donHangChiTiet={DonHang}
              userString={userData}
              isActive={activeItem}
              dataMeasure={DataMeasure}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
