import React, { useState, useEffect } from "react";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { motion } from "framer-motion";
import { MethodChangePassWord } from "../services/EmailService";
import { useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Ticket } from "../Components/UI/primitives/Ticket";
import { Barcode } from "../Components/UI/primitives/Barcode";
import { spatialActions } from "../Components/UI/three/SpatialStore";

export const ChangePassWord = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || undefined;
  const token = searchParams.get("token") || undefined;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    spatialActions.setStation("TICKET_BOOTH");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) return;
    setLoading(true);
    MethodChangePassWord(email, token, password);
    await new Promise((r) => setTimeout(r, 1200));

    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-bone text-ink flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          <Ticket
            stubPosition="bottom"
            notchClassName="bg-bone"
            stub={
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-[10px] font-bold uppercase text-ink">
                  [RESET KEY // ADMIT ONE]
                </span>
                <Barcode value="KEY-RESET-01" height={22} />
              </div>
            }
          >
            {!success ? (
              <div className="space-y-5">
                <div className="border-b-2 border-ink pb-3">
                  <span className="mono-label text-[10px] text-flash block mb-1">
                    [CREDENTIAL OVERRIDE]
                  </span>
                  <h1 className="font-display-safe text-2xl font-black uppercase text-ink">
                    Đặt lại mật khẩu
                  </h1>
                  <p className="mt-1 font-sans text-xs text-ink-muted">
                    Nhập mật khẩu mới cho tài khoản của bạn.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="new-password"
                      className="block font-mono text-[11px] font-bold uppercase text-ink mb-1.5"
                    >
                      Mật khẩu mới
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="new-password"
                        type={showPass ? "text" : "password"}
                        required
                        placeholder="Mật khẩu mới"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 border-2 border-ink bg-bone px-3.5 pr-12 font-mono text-xs text-ink placeholder:text-ink-muted/60 focus:bg-paper outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-0.5 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block font-mono text-[11px] font-bold uppercase text-ink mb-1.5"
                    >
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="confirm-password"
                        type={showConfirm ? "text" : "password"}
                        required
                        placeholder="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-12 border-2 border-ink bg-bone px-3.5 pr-12 font-mono text-xs text-ink placeholder:text-ink-muted/60 focus:bg-paper outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-0.5 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {password &&
                    confirmPassword &&
                    password !== confirmPassword && (
                      <p className="font-mono text-xs font-bold text-danger">
                        Mật khẩu xác nhận không khớp
                      </p>
                    )}

                  <button
                    type="submit"
                    disabled={loading || password !== confirmPassword}
                    className="w-full min-h-[48px] bg-flash text-paper border-2 border-ink shadow-hard-sm font-mono text-xs font-bold uppercase tracking-wider hover:bg-ink transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="border-b-2 border-ink pb-3">
                  <span className="px-2 py-0.5 bg-volt border border-ink font-mono text-[10px] font-bold uppercase text-ink inline-block mb-2">
                    CALIBRATED
                  </span>
                  <h1 className="font-display-safe text-2xl font-black uppercase text-ink">
                    Thành công
                  </h1>
                </div>
                <p className="font-sans text-xs text-ink-muted leading-relaxed">
                  Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập lại
                  bằng mật khẩu mới.
                </p>

                <a
                  href="/account"
                  className="inline-flex w-full min-h-[48px] items-center justify-center bg-ink text-paper border-2 border-ink font-mono text-xs font-bold uppercase tracking-wider hover:bg-flash transition-colors"
                >
                  Đi đến đăng nhập
                </a>
              </div>
            )}
          </Ticket>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};
