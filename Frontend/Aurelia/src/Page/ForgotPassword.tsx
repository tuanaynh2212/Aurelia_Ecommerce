import React, { useState, useEffect } from "react";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { motion } from "framer-motion";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { MethodForgotPassword } from "../services/EmailService";
import { Ticket } from "../Components/UI/primitives/Ticket";
import { Barcode } from "../Components/UI/primitives/Barcode";
import { spatialActions } from "../Components/UI/three/SpatialStore";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    spatialActions.setStation("TICKET_BOOTH");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    MethodForgotPassword(email);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
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
                  [RECOVERY DISPATCH // ADMIT ONE]
                </span>
                <Barcode value="RECOVERY-01" height={22} />
              </div>
            }
          >
            {!submitted ? (
              <div className="space-y-5">
                <div className="border-b-2 border-ink pb-3">
                  <span className="mono-label text-[10px] text-flash block mb-1">
                    [CREDENTIAL RECOVERY]
                  </span>
                  <h1 className="font-display-safe text-2xl font-black uppercase text-ink">
                    Quên mật khẩu
                  </h1>
                  <p className="mt-1 font-sans text-xs text-ink-muted">
                    Nhập email đã đăng ký. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="recovery-email"
                      className="block font-mono text-[11px] font-bold uppercase text-ink mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="recovery-email"
                      type="email"
                      required
                      placeholder="Email của bạn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 border-2 border-ink bg-bone px-3.5 font-mono text-xs text-ink placeholder:text-ink-muted/60 focus:bg-paper outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[48px] bg-flash text-paper border-2 border-ink shadow-hard-sm font-mono text-xs font-bold uppercase tracking-wider hover:bg-ink transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? "Đang gửi..." : "Gửi email xác nhận"}
                  </button>
                </form>

                <div className="pt-3 border-t border-dashed border-ink text-center">
                  <a
                    href="/account"
                    className="font-mono text-xs font-bold uppercase text-ink hover:text-flash transition-colors"
                  >
                    ← Quay lại đăng nhập
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="border-b-2 border-ink pb-3">
                  <span className="px-2 py-0.5 bg-volt border border-ink font-mono text-[10px] font-bold uppercase text-ink inline-block mb-2">
                    DISPATCHED
                  </span>
                  <h1 className="font-display-safe text-2xl font-black uppercase text-ink">
                    Kiểm tra email
                  </h1>
                </div>
                <p className="font-sans text-xs text-ink-muted leading-relaxed">
                  Nếu email{" "}
                  <span className="font-mono font-bold text-ink">{email}</span>{" "}
                  tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật
                  khẩu trong vài phút.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="w-full min-h-[48px] bg-ink text-paper border-2 border-ink font-mono text-xs font-bold uppercase tracking-wider hover:bg-flash transition-colors cursor-pointer"
                >
                  Gửi lại
                </button>
              </div>
            )}
          </Ticket>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};
