import { useContext, useState } from "react";
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
  const [activeItem, setActiveItem] = useState("stats");
  const { DataMeasure } = useContext(AiPoseMeasureContext);
  const {
    dataFavouriteItemUser,
    soLuongDonHang,
    DonHang,
    TongThuChi,
  } = useContext(FilterProductContext);

  const safeOrderCount = typeof soLuongDonHang === "number" ? soLuongDonHang : (DonHang?.length || 0);
  const safeFavCount = dataFavouriteItemUser?.length || 0;

  return (
    <div className="min-h-screen bg-[var(--color-bg,#FBF8F2)] text-[var(--color-ink,#2A211B)] flex flex-col">
      <Navbar />

      {/* Main atelier workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Atelier Dossier Bar */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-rule/70">
          <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
            <span className="text-cobalt font-bold">AURELIA</span>
            <span>/</span>
            <span className="uppercase tracking-wider">HỒ SƠ KHÁCH HÀNG</span>
            <span>/</span>
            <span className="text-ink font-semibold uppercase">
              {NAV_ITEMS.find((n) => n.value === activeItem)?.name || "Tổng quan"}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-ink-faint">
            <span className="w-1.5 h-1.5 rounded-hole bg-emerald-500 animate-pulse" />
            <span>KẾT NỐI AN TOÀN · 256-BIT SSL</span>
          </div>
        </div>

        {/* 2-Column Atelier Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: Atelier Dossier Spine / Menu */}
          <div className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-24">
            <LeftSide
              userString={userData}
              navItems={NAV_ITEMS}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              orderCount={safeOrderCount}
              favouriteCount={safeFavCount}
            />
          </div>

          {/* Right: Atelier Working Surface */}
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

