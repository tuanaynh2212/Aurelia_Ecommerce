import { useContext } from "react";
import { Link } from "react-router-dom";
import { KeyRound, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { Ticket, Stamp } from "./UI/primitives/Ticket";
import { Barcode } from "./UI/primitives/Barcode";
import { AuthContext } from "../contexts/Author";

export const AuthPanel = ({ type }: { type: string }) => {
  const { tab, setTab } = useContext(AuthContext);
  const isAdminPortal = type === "ADMIN";
  const isRegisterMode = !isAdminPortal && tab === "register";

  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center px-4 sm:px-8 md:px-10 py-10 bg-bone studio-grid-bg">
      <div className="w-full max-w-[500px] flex flex-col gap-4">
        {/* Top Mobile/Tablet Status Strip */}
        <div className="flex items-center justify-between bg-ink text-paper border-2 border-ink px-4 py-2 shadow-hard-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-volt" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
              {isAdminPortal
                ? "[STATION // STAFF CREDENTIAL GATE]"
                : "[STATION // CLIENT CREDENTIAL PASS]"}
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase text-volt">
            SIDE A
          </span>
        </div>

        {/* Main Perforated Admission Ticket (stubPosition="bottom" for full-width form) */}
        <Ticket
          stubPosition="bottom"
          notchClassName="bg-bone"
          stamp={
            <Stamp tone={isAdminPortal ? "flash" : "volt"} size="sm">
              {isAdminPortal ? "RESTRICTED" : "ADMIT ONE"}
            </Stamp>
          }
          stub={
            <div className="space-y-4">
              {!isAdminPortal ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bone border-2 border-ink p-3.5">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase text-ink-muted">
                      {isRegisterMode
                        ? "ĐÃ CÓ TÀI KHOẢN HỘI VIÊN?"
                        : "CHƯA CÓ THẺ HỘI VIÊN AURELIA?"}
                    </p>
                    <p className="font-sans text-xs font-semibold text-ink mt-0.5">
                      {isRegisterMode
                        ? "Chuyển sang đăng nhập bằng email hoặc Google."
                        : "Đăng ký miễn phí để lưu số đo AI & tích điểm."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setTab(isRegisterMode ? "login" : "register")
                    }
                    className="min-h-[42px] px-4 py-2 bg-paper border-2 border-ink shadow-hard-sm font-mono text-[11px] font-bold uppercase tracking-wider text-ink hover:bg-volt transition-colors inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>{isRegisterMode ? "Đăng nhập" : "Đăng ký ngay"}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-bone border-2 border-ink p-3">
                  <ShieldAlert size={18} className="text-flash shrink-0" />
                  <p className="font-mono text-[11px] text-ink leading-snug">
                    Cổng đăng nhập nội bộ dành riêng cho <b>Quản lý Cửa hàng</b>{" "}
                    và <b>Quản trị viên</b>.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-4 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  <Link
                    to={isAdminPortal ? "/account" : "/login"}
                    className="text-ink underline decoration-2 underline-offset-4 hover:text-flash transition-colors"
                  >
                    {isAdminPortal
                      ? "← Về cổng Khách hàng"
                      : "Cổng Nhân sự / Admin →"}
                  </Link>
                  <span>•</span>
                  <Link
                    to="/Forgot-PassWord"
                    className="hover:text-ink transition-colors"
                  >
                    Khôi phục mật khẩu
                  </Link>
                </div>

                <Barcode
                  value={
                    isAdminPortal
                      ? `STAFF-${tab.toUpperCase()}`
                      : `CLIENT-${tab.toUpperCase()}`
                  }
                  height={22}
                />
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Ticket Header */}
            <div className="border-b-2 border-ink pb-4 pr-20">
              <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-flash mb-1">
                {isAdminPortal ? (
                  <>
                    <KeyRound size={12} />
                    <span>[CONTROL ROOM // AUTHORIZATION]</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={12} />
                    <span>[TICKET BOOTH // CLIENT ACCESS]</span>
                  </>
                )}
              </div>

              <h1 className="font-display-safe text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink">
                {isAdminPortal
                  ? "Cổng Quản Trị Aurelia"
                  : isRegisterMode
                    ? "Đăng Ký Hội Viên"
                    : "Đăng Nhập Aurelia"}
              </h1>

              <p className="font-sans text-xs text-ink-muted mt-1">
                {isAdminPortal
                  ? "Chọn phân quyền Cửa hàng hoặc Admin và nhập thông tin định danh."
                  : isRegisterMode
                    ? "Khởi tạo thẻ hội viên cá nhân để lưu trữ số đo & đơn hàng."
                    : "Nhập thông tin tài khoản để truy cập không gian mua sắm cá nhân."}
              </p>
            </div>

            {/* Login / Register Form */}
            <LoginForm type={type} />
          </div>
        </Ticket>
      </div>
    </div>
  );
};
