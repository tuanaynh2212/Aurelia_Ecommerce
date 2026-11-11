import type {
  AppointmentCustomer,
  Clients,
  Measure,
  order,
  Product,
} from "../../../types/type";
import { useContext, useEffect, useState } from "react";
import { AppointmentContext } from "../../../contexts/AppointmentContext";

import { HistoryOrder } from "./RightSideComponent.tsx/HistoryAppointment";
import { Favourite } from "./RightSideComponent.tsx/Favourite";
import { BarprocessTier } from "./RightSideComponent.tsx/BarprocessTier";
import { motion } from "framer-motion";
import Voucher from "./RightSideComponent.tsx/Voucher";
import { RecentActivity } from "./RightSideComponent.tsx/RecentActivity";
import { Stats } from "./RightSideComponent.tsx/Stats";
import { RecentOrder } from "./RightSideComponent.tsx/RecentOrder";
import { MeasureDashBoard } from "./RightSideComponent.tsx/MeasureDashBoard";
import AccountSettings from "./AccountSettings";

type RightProps = {
  dataFavouriteItemUser: Product[];
  userRole?: string;
  tongThuChi: number;
  soLuongDonHang: number;
  donHangChiTiet: order[];
  userString: Clients | null;
  isActive?: string;
  setActiveItem: React.Dispatch<React.SetStateAction<string>>;
  dataMeasure?: Measure;
};

export const RightSide: React.FC<RightProps> = ({
  dataFavouriteItemUser = [],
  userRole,
  tongThuChi = 0,
  soLuongDonHang = 0,
  donHangChiTiet = [],
  userString,
  isActive = "stats",
  setActiveItem,
  dataMeasure,
}) => {
  const { LayDachSachLichHenCuaUser } = useContext(AppointmentContext);
  const [dataAppointment, setDataAppointment] = useState<
    AppointmentCustomer[] | null
  >(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await LayDachSachLichHenCuaUser();
        setDataAppointment(Array.isArray(data) ? data : []);
      } catch {
        setDataAppointment(null);
      }
    };
    load();
  }, [LayDachSachLichHenCuaUser]);

  const lastPurchaseDate = donHangChiTiet?.[0]?.ngayTaoDon || null;
  const userName = userString?.name || "Quý khách";

  const renderContent = () => {
    switch (isActive) {
      case "stats":
        return (
          <div className="space-y-8">
            <header className="pb-5 border-b-2 border-[var(--color-ink)] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
                    [HỒ SƠ TỔNG QUAN]
                  </span>
                </div>
                <h2 className="display-m font-display-safe text-[var(--color-ink)]">
                  Xin chào, {userName}
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[var(--color-ink-muted)] mt-1 max-w-xl">
                  Chào mừng trở lại với Aurelia Atelier. Theo dõi tiến độ đơn hàng, số đo may đo và đặc quyền hội viên của quý khách.
                </p>
              </div>

              <div className="hidden sm:block text-right mono-label text-[var(--color-ink-muted)]">
                <div>ATELIER DOSSIER</div>
                <div className="text-[var(--color-success)] font-extrabold">
                  ● HỆ THỐNG ĐÃ ĐỒNG BỘ
                </div>
              </div>
            </header>

            <BarprocessTier userRole={userRole ?? ""} />

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="mono-label font-extrabold text-[var(--color-ink)]">
                    [CHỈ SỐ HOẠT ĐỘNG]
                  </span>
                </div>
                <Stats
                  tongThuChi={tongThuChi}
                  soLuongDonHang={soLuongDonHang}
                  lastPurchaseDate={lastPurchaseDate}
                  userRole={userRole}
                  dataFavouriteItemUser={dataFavouriteItemUser}
                />
              </div>

              <div>
                <RecentActivity
                  orders={donHangChiTiet}
                  setActiveItem={setActiveItem}
                />
              </div>
            </div>
          </div>
        );

      case "recentOrder":
        return (
          <MotionWrapper>
            <RecentOrder donHangChiTiet={donHangChiTiet} />
          </MotionWrapper>
        );

      case "listAppointment":
        return (
          <MotionWrapper>
            <HistoryOrder dataAppointment={dataAppointment ?? []} />
          </MotionWrapper>
        );

      case "favourite":
        return (
          <MotionWrapper>
            <Favourite dataFavouriteItemUser={dataFavouriteItemUser} />
          </MotionWrapper>
        );

      case "voucher":
        return (
          <MotionWrapper>
            <Voucher />
          </MotionWrapper>
        );

      case "bodyMeasurement":
        return (
          <MotionWrapper>
            <MeasureDashBoard DataMeasure={dataMeasure} />
          </MotionWrapper>
        );

      case "accountSettings":
        return (
          <MotionWrapper>
            <AccountSettings />
          </MotionWrapper>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] p-6 sm:p-8 min-h-[640px]">
      {renderContent()}
    </div>
  );
};

const MotionWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);
