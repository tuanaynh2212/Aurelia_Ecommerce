import * as React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import logo from "../../assets/aurelia_logo_svg.svg";

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-[var(--color-rule)] mt-16 bg-[var(--color-bg)]">

      {/* Value props strip */}
      <div className="border-b border-[var(--color-rule)] py-6">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            {[
              { icon: Truck,       title: "Miễn phí vận chuyển", sub: "Đơn hàng từ 500.000 ₫" },
              { icon: RotateCcw,   title: "Đổi trả 30 ngày",    sub: "Miễn phí tận nơi" },
              { icon: ShieldCheck, title: "Chất lượng cam kết",  sub: "Bảo hành 1 năm" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 justify-center md:justify-start">
                <item.icon size={18} className="text-[var(--color-ink-muted)] flex-shrink-0" />
                <div>
                  <span className="font-heading font-semibold text-sm text-[var(--color-ink)]">{item.title}</span>
                  <span className="text-xs text-[var(--color-ink-muted)] ml-1.5">— {item.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="py-12">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

            {/* Brand + Newsletter (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="inline-block">
                <img src={logo} alt="Aurelia" className="h-8 w-auto" />
              </Link>
              <p className="text-sm text-[var(--color-ink-muted)] max-w-sm font-body leading-relaxed">
                Thời trang hiện đại, thanh lịch cho phong cách sống năng động mỗi ngày.
              </p>

              {/* Newsletter */}
              <div className="pt-1">
                <h5 className="font-heading font-semibold text-xs uppercase tracking-wider text-[var(--color-ink)] mb-2">
                  Nhận tin & ưu đãi
                </h5>
                {subscribed ? (
                  <p className="text-sm text-[var(--color-accent)] font-medium">
                    ✓ Đăng ký thành công!
                  </p>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-0 max-w-sm">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email của bạn"
                      required
                      className="input flex-1 text-xs border-r-0"
                    />
                    <button
                      type="submit"
                      aria-label="Đăng ký"
                      className="px-3 bg-[var(--color-ink)] text-[var(--color-bg)] hover:bg-[var(--color-accent)] transition-colors cursor-pointer"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </form>
                )}
              </div>

              {/* Social — minimal text links */}
              <div className="flex items-center gap-4 pt-1">
                {[
                  { icon: Facebook,  label: "Facebook",  href: "https://facebook.com" },
                  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
                  { icon: Twitter,   label: "Twitter",   href: "https://twitter.com" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
                  >
                    <s.icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Col: Products */}
            <div>
              <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-[var(--color-ink)] mb-4 pb-2 border-b border-[var(--color-rule)]">
                Sản phẩm
              </h4>
              <ul className="space-y-2 text-sm text-[var(--color-ink-muted)]">
                <li><Link to="/Fashion/Products" className="hover:text-[var(--color-ink)] transition-colors">Tất cả sản phẩm</Link></li>
                <li><Link to="/Collection" className="hover:text-[var(--color-ink)] transition-colors">Bộ sưu tập</Link></li>
                <li><Link to="/bodyMeasurements" className="hover:text-[var(--color-ink)] transition-colors">AI Tư vấn dáng người</Link></li>
                <li><Link to="/Fashion/Products?tag=sale" className="hover:text-[var(--color-ink)] transition-colors">Ưu đãi</Link></li>
              </ul>
            </div>

            {/* Col: About */}
            <div>
              <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-[var(--color-ink)] mb-4 pb-2 border-b border-[var(--color-rule)]">
                Về Aurelia
              </h4>
              <ul className="space-y-2 text-sm text-[var(--color-ink-muted)]">
                <li><Link to="/about" className="hover:text-[var(--color-ink)] transition-colors">Câu chuyện</Link></li>
                <li><Link to="/about#sustainability" className="hover:text-[var(--color-ink)] transition-colors">Bền vững</Link></li>
                <li><Link to="/account" className="hover:text-[var(--color-ink)] transition-colors">Tài khoản</Link></li>
                <li><Link to="/about#stores" className="hover:text-[var(--color-ink)] transition-colors">Cửa hàng</Link></li>
              </ul>
            </div>

            {/* Col: Contact */}
            <div>
              <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-[var(--color-ink)] mb-4 pb-2 border-b border-[var(--color-rule)]">
                Liên hệ
              </h4>
              <ul className="space-y-2.5 text-sm text-[var(--color-ink-muted)]">
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  <span>123 Lê Lợi, Q.1, TP.HCM</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={14} className="flex-shrink-0" />
                  <a href="mailto:support@aurelia.vn" className="hover:text-[var(--color-ink)]">support@aurelia.vn</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={14} className="flex-shrink-0" />
                  <a href="tel:1900123456" className="hover:text-[var(--color-ink)]">1900 123 456</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-[var(--color-rule)] py-5 text-xs text-[var(--color-ink-muted)]">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} Aurelia Fashion</p>
            <div className="flex items-center gap-4">
              <Link to="/about" className="hover:text-[var(--color-ink)] transition-colors">Điều khoản</Link>
              <span className="text-[var(--color-rule)]">·</span>
              <Link to="/about" className="hover:text-[var(--color-ink)] transition-colors">Bảo mật</Link>
              <span className="text-[var(--color-rule)]">·</span>
              <Link to="/about" className="hover:text-[var(--color-ink)] transition-colors">Đổi trả</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
