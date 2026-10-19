

import * as React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/aurelia_logo_svg.svg";

export function HangTagFooter() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer
      className="w-full border-t border-[rgba(42,33,27,0.18)]"
      style={{ background: "var(--color-kraft)" }}
    >
      <div className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">

          <div className="space-y-5 md:col-span-4">
            <Link to="/" className="inline-block" aria-label="Aurellia — Trang chủ">
              <img src={logo} alt="Aurellia" className="w-auto h-8" />
            </Link>

            <p className="max-w-xs text-sm leading-relaxed font-body text-ink-muted">
              Quần áo may đo chuẩn phom Việt. Giá niêm yết minh bạch trên từng chiếc mác.
            </p>

            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-3">
                Nhận thông tin sản phẩm mới
              </p>
              {subscribed ? (
                <p className="font-mono text-sm text-ink">
                  ✓ Đã đăng ký thành công.
                </p>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex max-w-xs gap-0"
                  aria-label="Đăng ký nhận tin"
                >
                  <label htmlFor="footer-email" className="sr-only">
                    Địa chỉ email
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    className="flex-1 bg-transparent input border-ink-muted/40 text-ink placeholder:text-ink-faint focus:border-ink"
                    style={{ borderRadius: 0 }}
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 px-4 font-mono text-xs tracking-wider uppercase btn btn-ink"
                    style={{ borderRadius: 0 }}
                  >
                    Đăng ký
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-8 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-4">
                Cửa hàng
              </p>
              <ul className="space-y-2.5">
                {[
                  { label: "Sản phẩm", to: "/Fashion/Products" },
                  { label: "Bộ sưu tập", to: "/Collection" },
                  { label: "Hàng mới về", to: "/Fashion/Products" },
                  { label: "Đang giảm giá", to: "/Fashion/Products" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm transition-colors font-body text-ink-muted hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-4">
                Hỗ trợ
              </p>
              <ul className="space-y-2.5">
                {[
                  { label: "Đổi trả & hoàn tiền", to: "/about" },
                  { label: "Hướng dẫn chọn size", to: "/BodySize" },
                  { label: "Đo size bằng AI", to: "/BodySize" },
                  { label: "Theo dõi đơn hàng", to: "/account" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm transition-colors font-body text-ink-muted hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-4">
                Về chúng tôi
              </p>
              <ul className="space-y-2.5">
                {[
                  { label: "Câu chuyện Aurellia", to: "/about" },
                  { label: "Chất liệu & sản xuất", to: "/about" },
                  { label: "Liên hệ", to: "/about" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm transition-colors font-body text-ink-muted hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[rgba(42,33,27,0.18)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[10px] text-ink-faint tracking-wide">
            © 2026 Aurellia. Bảo lưu mọi quyền.
          </p>
          <div className="flex items-center gap-4">
            {["Điều khoản", "Riêng tư", "Cookie"].map((label) => (
              <Link
                key={label}
                to="/about"
                className="font-mono text-[10px] text-ink-faint hover:text-ink transition-colors tracking-wide"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
