import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/Author";
import type { Clients } from "../../../types/type";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Calendar,
  Ticket,
  Ruler,
  Settings,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../contexts/CartContext";
import { logOutFireBase } from "../../../services/auth.service";

type LeftSides = {
  userString: Clients | null;
  navItems: Array<{ name: string; value: string; [key: string]: any }>;
  activeItem: string;
  setActiveItem: React.Dispatch<React.SetStateAction<any>>;
  orderCount?: number;
  favouriteCount?: number;
};

const NAV_ICONS: Record<string, React.ElementType> = {
  stats: LayoutDashboard,
  recentOrder: ShoppingBag,
  favourite: Heart,
  listAppointment: Calendar,
  voucher: Ticket,
  bodyMeasurement: Ruler,
  accountSettings: Settings,
};

export const LeftSide: React.FC<LeftSides> = ({
  userString,
  navItems,
  activeItem,
  setActiveItem,
  orderCount,
  favouriteCount,
}) => {
  const { setIsignned, logOut } = useContext(AuthContext);
  const { setCartDataAdd } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut({ typeAccount: "client" });
    localStorage.clear();
    setIsignned(false);
    setCartDataAdd([]);
    navigate("/");
    logOutFireBase();
  };

  const memberTier = userString?.tier || "Thành viên";
  const userName = userString?.name || "Quý khách";
  const userEmail = userString?.email || "";
  const avatarUrl = userString?.avatar;

  return (
    <aside className="w-full bg-paper border border-rule/80 rounded-tag shadow-tag p-6 flex flex-col justify-between">
      {/* ── Hang Tag Header / Client Profile ── */}
      <div>
        {/* Atelier Grommet eyelet */}
        <div className="flex items-center justify-between pb-4 border-b border-rule/60">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-hole bg-kraft/80 border border-ink/20 shadow-inner ring-2 ring-white" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              HỒ SƠ KHÁCH HÀNG
            </span>
          </div>
          <span className="font-mono text-[10px] text-ink-faint">
            AURELIA · ATELIER
          </span>
        </div>

        {/* Member profile snippet */}
        <div className="pt-6 pb-6 border-b border-rule/60">
          <div className="flex items-center gap-4">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-14 h-14 rounded-tag object-cover border border-rule shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-tag bg-kraft/30 border border-rule flex items-center justify-center font-heading text-xl font-bold text-ink">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-hole bg-cobalt flex items-center justify-center text-[9px] text-white" title="Đã xác thực">
                ✓
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-heading text-lg font-semibold text-ink truncate leading-snug">
                {userName}
              </h2>
              {userEmail && (
                <p className="font-mono text-[11px] text-ink-muted truncate">
                  {userEmail}
                </p>
              )}
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-tag bg-kraft/25 border border-kraft-dark/30 font-mono text-[10px] uppercase tracking-wider text-ink">
                <Sparkles size={11} className="text-cobalt" />
                <span>Hạng {memberTier}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation List ── */}
        <nav className="mt-6 flex flex-col space-y-1">
          {navItems.map((item) => {
            const isActive = activeItem === item.value;
            const Icon = NAV_ICONS[item.value] || ChevronRight;

            return (
              <button
                key={item.value}
                onClick={() => setActiveItem(item.value)}
                className={`group flex items-center justify-between px-3.5 py-3 rounded-tag text-xs tracking-wider transition-all w-full text-left font-mono ${
                  isActive
                    ? "bg-kraft/20 text-ink font-semibold border-l-2 border-cobalt shadow-sm"
                    : "text-ink-muted hover:text-ink hover:bg-black/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={16}
                    className={`transition-colors ${
                      isActive ? "text-cobalt" : "text-ink-muted group-hover:text-ink"
                    }`}
                  />
                  <span className="uppercase text-[11px]">{item.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.value === "recentOrder" && typeof orderCount === "number" && orderCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-kraft/30 text-ink rounded-tag">
                      {orderCount}
                    </span>
                  )}
                  {item.value === "favourite" && typeof favouriteCount === "number" && favouriteCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-kraft/30 text-ink rounded-tag">
                      {favouriteCount}
                    </span>
                  )}
                  <ChevronRight
                    size={14}
                    className={`transition-transform ${
                      isActive ? "text-cobalt translate-x-0.5" : "text-ink-faint opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Footer: Logout ── */}
      <div className="mt-10 pt-4 border-t border-rule/60">
        <button
          onClick={handleLogOut}
          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-tag font-mono text-[11px] uppercase tracking-wider text-ink-muted hover:text-red-700 hover:bg-red-50/60 transition-colors"
        >
          <LogOut size={15} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

