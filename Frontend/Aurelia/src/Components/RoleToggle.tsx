import { useContext } from "react";
import { Store, Shield } from "lucide-react";
import { AuthContext } from "../contexts/Author";

const RoleToggle = () => {
  const { tab, setTab } = useContext(AuthContext);
  const activeRole = tab === "ADMIN" ? "ADMIN" : "MANAGER";

  return (
    <div className="space-y-1.5">
      <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ink-muted">
        CHỌN PHÂN QUYỀN TRUY CẬP // ROLE SELECTOR
      </span>
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-bone border-2 border-ink">
        <label
          className={`min-h-[44px] flex cursor-pointer items-center justify-center gap-2 px-3 py-2 border-2 transition-all ${
            activeRole === "MANAGER"
              ? "bg-ink text-paper border-ink shadow-hard-sm"
              : "bg-paper text-ink border-transparent hover:border-ink hover:bg-volt"
          }`}
        >
          <Store size={15} className={activeRole === "MANAGER" ? "text-volt" : "text-ink"} />
          <div className="text-left leading-tight">
            <span className="font-mono text-[11px] font-bold tracking-wider uppercase block">
              CỬA HÀNG
            </span>
            <span
              className={`font-mono text-[9px] uppercase block ${
                activeRole === "MANAGER" ? "text-volt" : "text-ink-muted"
              }`}
            >
              SHOP MANAGER
            </span>
          </div>
          <input
            type="radio"
            name="role-toggle"
            value="MANAGER"
            className="hidden"
            checked={activeRole === "MANAGER"}
            onChange={() => setTab("MANAGER")}
          />
        </label>

        <label
          className={`min-h-[44px] flex cursor-pointer items-center justify-center gap-2 px-3 py-2 border-2 transition-all ${
            activeRole === "ADMIN"
              ? "bg-ink text-paper border-ink shadow-hard-sm"
              : "bg-paper text-ink border-transparent hover:border-ink hover:bg-volt"
          }`}
        >
          <Shield size={15} className={activeRole === "ADMIN" ? "text-volt" : "text-ink"} />
          <div className="text-left leading-tight">
            <span className="font-mono text-[11px] font-bold tracking-wider uppercase block">
              QUẢN TRỊ VIÊN
            </span>
            <span
              className={`font-mono text-[9px] uppercase block ${
                activeRole === "ADMIN" ? "text-volt" : "text-ink-muted"
              }`}
            >
              BRAND ADMIN
            </span>
          </div>
          <input
            type="radio"
            name="role-toggle"
            value="ADMIN"
            className="hidden"
            checked={activeRole === "ADMIN"}
            onChange={() => setTab("ADMIN")}
          />
        </label>
      </div>
    </div>
  );
};

export default RoleToggle;
