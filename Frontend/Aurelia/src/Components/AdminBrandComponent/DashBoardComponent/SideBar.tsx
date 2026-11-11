import React, { useContext, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { AuthContext } from "../../../contexts/Author";
import { AdminContext } from "../../../contexts/AdminContext";
import { CollectionContext } from "../../../contexts/SeasonContext";
import { FilterProductContext } from "../../../contexts/FIlterProduct";
import Icon from "./icon";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftCircle, ArrowRightCircle, LogOut, Menu, X } from "lucide-react";

export const SideBar = ({
  onClick,
  status,
  type,
}: {
  onClick: React.Dispatch<React.SetStateAction<string>>;
  status: string;
  type: string;
}) => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-40 min-w-[44px] min-h-[44px] p-2.5 bg-paper border-2 border-ink shadow-hard-sm flex items-center justify-center text-ink cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-ink/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.25 }}
              className="fixed left-0 top-0 h-screen w-64 bg-paper border-r-2 border-ink z-50 lg:hidden flex flex-col shadow-hard-lg"
            >
              <SidebarContent
                expanded={true}
                setExpanded={setExpanded}
                status={status}
                onClick={onClick}
                navigate={navigate}
                logOut={logOut}
                closeMobile={() => setMobileOpen(false)}
                type={type}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <aside
        className={`hidden lg:flex sticky left-0 top-0 h-screen ${
          expanded ? "w-64" : "w-20"
        } bg-paper border-r-2 border-ink z-20 flex-col transition-all duration-200`}
      >
        <SidebarContent
          expanded={expanded}
          setExpanded={setExpanded}
          status={status}
          onClick={onClick}
          navigate={navigate}
          logOut={logOut}
          type={type}
        />
      </aside>
    </>
  );
};

interface SidebarContentProps {
  expanded: boolean;
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
  status: string;
  onClick: React.Dispatch<React.SetStateAction<string>>;
  navigate: NavigateFunction;
  logOut: (args: { typeAccount: string }) => void;
  closeMobile?: () => void;
  type?: string;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  expanded,
  setExpanded,
  status,
  onClick,
  navigate,
  logOut,
  closeMobile,
  type,
}) => {
  const { MainBanner, StoryBanner, coupons, dataShop } = useContext(AdminContext);
  const { collectionData } = useContext(CollectionContext);
  const { dataProduct } = useContext(FilterProductContext);

  const bannerTotal = (MainBanner?.length || 0) + (StoryBanner?.length || 0);
  const couponTotal = coupons?.length || 0;
  const shopTotal = dataShop?.length || 0;
  const collectionTotal = collectionData?.length || 0;
  const productTotal = dataProduct?.length || 0;

  const NAV_ITEMS =
    type === "admin"
      ? [
          { id: "Dashboard", label: "Dashboard", icon: "LayoutDashboard" },
          { id: "banner", label: "Banner", icon: "Image", badge: bannerTotal },
          { id: "discount", label: "Mã giảm giá", icon: "Tag", badge: couponTotal },
          { id: "store", label: "Cửa hàng", icon: "Store", badge: shopTotal },
          { id: "revenue", label: "Doanh thu", icon: "Wallet" },
          { id: "collections", label: "Collections", icon: "Layers", badge: collectionTotal },
          { id: "products", label: "Sản phẩm", icon: "Package", badge: productTotal },
        ]
      : [
          { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
          { id: "orders", label: "Đơn hàng", icon: "ShoppingCart" },
          { id: "appointments", label: "Lịch hẹn", icon: "Calendar" },
          { id: "products", label: "Sản phẩm", icon: "Package" },
          { id: "customers", label: "Khách hàng", icon: "Users" },
        ];

  return (
    <>
      <div className="p-5 border-b-2 border-ink bg-bone flex justify-between items-center">
        {expanded && (
          <div>
            <span className="mono-label text-[10px] text-flash block">
              [CONTROL ROOM // ADMIN]
            </span>
            <h1 className="font-display-safe text-xl font-black uppercase tracking-tight text-ink">
              Aurelia
            </h1>
            <p className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">
              Management System
            </p>
          </div>
        )}

        {closeMobile ? (
          <button
            type="button"
            onClick={closeMobile}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center border-2 border-ink bg-paper text-ink cursor-pointer"
          >
            <X size={18} />
          </button>
        ) : (
          setExpanded && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="hidden lg:flex min-w-[44px] min-h-[44px] items-center justify-center border-2 border-ink bg-paper hover:bg-volt transition-colors cursor-pointer"
              aria-label="Toggle sidebar"
            >
              {expanded ? <ArrowLeftCircle size={18} /> : <ArrowRightCircle size={18} />}
            </button>
          )
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            type === "admin" ? item.label === status : item.id === status;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                onClick(type === "admin" ? item.label : item.id);
                if (closeMobile) closeMobile();
              }}
              className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2.5 font-mono text-xs font-bold uppercase tracking-wider border-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-ink text-paper border-ink shadow-hard-sm"
                  : "bg-paper text-ink border-transparent hover:border-ink hover:bg-bone"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon name={item.icon} size={18} />
                {expanded && <span className="truncate">{item.label}</span>}
              </div>

              {typeof item.badge === "number" && item.badge > 0 && expanded && (
                <span
                  className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border ${
                    isActive
                      ? "bg-volt text-ink border-paper"
                      : "bg-bone text-ink border-ink"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t-2 border-ink bg-bone">
        <button
          type="button"
          onClick={() => {
            navigate("/login");
            localStorage.removeItem("AdminToken");
            logOut({ typeAccount: "admin" });
          }}
          className="w-full min-h-[44px] flex items-center justify-center gap-3 px-4 py-2.5 bg-paper border-2 border-ink text-danger font-mono text-xs font-bold uppercase tracking-wider hover:bg-danger hover:text-paper transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          {expanded && <span>Đăng xuất</span>}
        </button>
      </div>
    </>
  );
};
