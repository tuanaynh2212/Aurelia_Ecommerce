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
  navItems: Array<{ name: string; value: string }>;
  activeItem: string;
  setActiveItem: React.Dispatch<React.SetStateAction<string>>;
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
    <aside className="w-full bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] p-5 flex flex-col justify-between">
      <div>
        {/* Hangtag Top Header with Punched Hole */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--color-ink)]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--color-bone)] border-2 border-[var(--color-ink)]" />
            <span className="mono-label text-[var(--color-ink)]">
              HỒ SƠ KHÁCH HÀNG
            </span>
          </div>
          <span className="mono-label text-[10px] text-[var(--color-ink-muted)]">
            [ID-PASS]
          </span>
        </div>

        {/* Identity Block */}
        <div className="py-5 border-b-2 border-[var(--color-ink)]">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-14 h-14 object-cover border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)]"
                />
              ) : (
                <div className="w-14 h-14 bg-[var(--color-volt)] border-2 border-[var(--color-ink)] flex items-center justify-center font-display-safe text-xl font-extrabold text-[var(--color-ink)]">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--color-success)] border border-[var(--color-ink)] flex items-center justify-center text-[9px] text-[var(--color-paper)]"
                title="Đã xác thực"
              >
                ✓
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-display-safe text-base font-extrabold uppercase text-[var(--color-ink)] truncate">
                {userName}
              </h2>
              {userEmail && (
                <p className="font-mono text-[11px] text-[var(--color-ink-muted)] truncate">
                  {userEmail}
                </p>
              )}
              <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-volt)] border border-[var(--color-ink)] mono-label text-[10px] text-[var(--color-ink)]">
                <Sparkles size={11} className="text-[var(--color-flash)]" />
                <span>Hạng {memberTier}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Numbered Setlist Navigation */}
        <nav className="mt-4 flex flex-col space-y-1.5">
          {navItems.map((item, idx) => {
            const isActive = activeItem === item.value;
            const Icon = NAV_ICONS[item.value] || ChevronRight;

            return (
              <button
                key={item.value}
                onClick={() => setActiveItem(item.value)}
                className={`min-h-[44px] group flex items-center justify-between px-3 py-2.5 border-2 transition-all w-full text-left font-mono cursor-pointer ${
                  isActive
                    ? "bg-[var(--color-volt)] text-[var(--color-ink)] font-extrabold border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)]"
                    : "border-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bone)] hover:border-[var(--color-ink)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                    0{idx + 1}
                  </span>
                  <Icon
                    size={15}
                    className={
                      isActive
                        ? "text-[var(--color-flash)]"
                        : "text-[var(--color-ink-muted)] group-hover:text-[var(--color-ink)]"
                    }
                  />
                  <span className="uppercase text-[11px]">{item.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.value === "recentOrder" &&
                    typeof orderCount === "number" &&
                    orderCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-[var(--color-ink)] text-[var(--color-paper)] font-extrabold">
                        {orderCount}
                      </span>
                    )}
                  {item.value === "favourite" &&
                    typeof favouriteCount === "number" &&
                    favouriteCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-[var(--color-ink)] text-[var(--color-paper)] font-extrabold">
                        {favouriteCount}
                      </span>
                    )}
                  <ChevronRight size={14} />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 pt-4 border-t-2 border-[var(--color-ink)]">
        <button
          onClick={handleLogOut}
          className="min-h-[44px] flex items-center justify-center gap-2 w-full px-3.5 py-2.5 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-danger)] hover:text-[var(--color-paper)] mono-label text-[var(--color-ink)] transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};
