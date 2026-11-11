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
import { Marquee } from "../UI/primitives/Marquee";
import { Ticket } from "../UI/primitives/Ticket";
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
    <footer className="mt-16 border-t-2 border-ink bg-paper text-ink">
      {/* Top kinetic marquee strip */}
      <Marquee
        tone="volt"
        items={[
          "[ATELIER-01] MIỄN PHÍ VẬN CHUYỂN ĐƠN TỪ 500.000 ₫",
          "ĐỔI TRẢ 30 NGÀY TẬN NƠI",
          "CHẤT LƯỢNG CAM KẾT // BẢO HÀNH 1 NĂM",
          "ADMIT ONE // SOUNDCHECK AI BODY RIG",
        ]}
      />

      {/* Policy band */}
      <div className="border-b-2 border-ink bg-bone py-6">
        <div className="container-atelier">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { code: "01", icon: Truck, title: "Miễn phí vận chuyển", sub: "Đơn hàng từ 500.000 ₫" },
              { code: "02", icon: RotateCcw, title: "Đổi trả 30 ngày", sub: "Miễn phí tận nơi" },
              { code: "03", icon: ShieldCheck, title: "Chất lượng cam kết", sub: "Bảo hành 1 năm" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 border-2 border-ink bg-paper p-3.5 shadow-hard-sm rounded-[2px]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-volt text-ink">
                  <item.icon size={18} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <div>
                  <span className="mono-label block text-[10px] font-bold text-ink-muted">
                    [{item.code} // POLICY]
                  </span>
                  <span className="font-display text-sm font-extrabold uppercase text-ink diacritic-safe">
                    {item.title}
                  </span>
                  <span className="ml-1.5 text-xs text-ink-muted">— {item.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 mono-titled link columns + ticket-shaped newsletter */}
      <div className="py-12 md:py-16">
        <div className="container-atelier">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
            {/* Ticket-shaped newsletter block */}
            <div className="lg:col-span-5">
              <Ticket notchClassName="bg-paper" className="bg-bone">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Link to="/" className="inline-flex items-center gap-2">
                      <img src={logo} alt="Aurelia" className="h-8 w-auto" />
                    </Link>
                    <span className="border-2 border-ink bg-volt px-2 py-0.5 mono-label text-[10px] font-extrabold text-ink">
                      ADMIT ONE
                    </span>
                  </div>

                  <p className="text-sm text-ink-muted">
                    Thời trang hiện đại, thanh lịch cho phong cách sống năng động mỗi ngày.
                  </p>

                  <div>
                    <h5 className="mono-label mb-2 text-xs font-extrabold text-ink">
                      [NHẬN TIN & ƯU ĐÃI]
                    </h5>
                    {subscribed ? (
                      <p className="inline-block border-2 border-ink bg-volt px-3 py-1.5 mono-label text-xs font-extrabold text-ink">
                        ✓ Đăng ký thành công!
                      </p>
                    ) : (
                      <form onSubmit={handleSubscribe} className="flex gap-0">
                        <label htmlFor="footer-newsletter-email" className="sr-only">
                          Email của bạn
                        </label>
                        <input
                          id="footer-newsletter-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email của bạn"
                          required
                          className="min-h-[48px] flex-1 border-2 border-r-0 border-ink bg-paper px-3.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                        />
                        <button
                          type="submit"
                          aria-label="Đăng ký"
                          className="press-collapse flex min-h-[48px] min-w-[52px] items-center justify-center border-2 border-ink bg-ink px-4 text-paper hover:bg-flash cursor-pointer"
                        >
                          <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {[
                      { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
                      { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
                      { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.label}
                        className="press-collapse flex h-11 w-11 items-center justify-center border-2 border-ink bg-paper text-ink shadow-hard-sm hover:bg-volt"
                      >
                        <s.icon size={16} strokeWidth={2.5} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              </Ticket>
            </div>

            {/* 4 mono-titled columns */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:col-span-7">
              <div>
                <h4 className="mono-label mb-3 border-b-2 border-ink pb-2 text-xs font-extrabold text-ink">
                  [01 // SẢN PHẨM]
                </h4>
                <ul className="space-y-2.5 text-sm font-medium text-ink-muted">
                  <li>
                    <Link to="/Fashion/Products" className="hover:text-ink underline-offset-4 hover:underline">
                      Tất cả sản phẩm
                    </Link>
                  </li>
                  <li>
                    <Link to="/Collection" className="hover:text-ink underline-offset-4 hover:underline">
                      Bộ sưu tập
                    </Link>
                  </li>
                  <li>
                    <Link to="/bodyMeasurements" className="hover:text-ink underline-offset-4 hover:underline">
                      AI Tư vấn dáng người
                    </Link>
                  </li>
                  <li>
                    <Link to="/Fashion/Products?tag=sale" className="hover:text-ink underline-offset-4 hover:underline">
                      Ưu đãi
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mono-label mb-3 border-b-2 border-ink pb-2 text-xs font-extrabold text-ink">
                  [02 // VỀ AURELIA]
                </h4>
                <ul className="space-y-2.5 text-sm font-medium text-ink-muted">
                  <li>
                    <Link to="/about" className="hover:text-ink underline-offset-4 hover:underline">
                      Câu chuyện
                    </Link>
                  </li>
                  <li>
                    <Link to="/about#sustainability" className="hover:text-ink underline-offset-4 hover:underline">
                      Bền vững
                    </Link>
                  </li>
                  <li>
                    <Link to="/account" className="hover:text-ink underline-offset-4 hover:underline">
                      Tài khoản
                    </Link>
                  </li>
                  <li>
                    <Link to="/about#stores" className="hover:text-ink underline-offset-4 hover:underline">
                      Cửa hàng
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mono-label mb-3 border-b-2 border-ink pb-2 text-xs font-extrabold text-ink">
                  [03 // DỊCH VỤ]
                </h4>
                <ul className="space-y-2.5 text-sm font-medium text-ink-muted">
                  <li>
                    <Link to="/bodyMeasurements" className="hover:text-ink underline-offset-4 hover:underline">
                      Soundcheck AI
                    </Link>
                  </li>
                  <li>
                    <Link to="/cart" className="hover:text-ink underline-offset-4 hover:underline">
                      Giỏ hàng
                    </Link>
                  </li>
                  <li>
                    <Link to="/search" className="hover:text-ink underline-offset-4 hover:underline">
                      Tra cứu mẫu
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mono-label mb-3 border-b-2 border-ink pb-2 text-xs font-extrabold text-ink">
                  [04 // LIÊN HỆ]
                </h4>
                <ul className="space-y-2.5 text-sm text-ink-muted">
                  <li className="flex items-start gap-2">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-ink" />
                    <span>123 Lê Lợi, Q.1, TP.HCM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail size={15} className="shrink-0 text-ink" />
                    <a href="mailto:support@aurelia.vn" className="hover:text-ink break-all">
                      support@aurelia.vn
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone size={15} className="shrink-0 text-ink" />
                    <a href="tel:1900123456" className="font-mono font-bold text-ink hover:underline">
                      1900 123 456
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Giant cropped AURELIA brutalist wordmark */}
      <div className="overflow-hidden border-t-2 border-ink bg-ink text-paper select-none">
        <div className="container-atelier">
          <p
            aria-hidden="true"
            className="font-display text-[clamp(5rem,22vw,22rem)] font-black uppercase leading-[0.82] tracking-tighter text-paper"
          >
            AURELIA
          </p>
        </div>
      </div>

      {/* Barcode strip + copyright */}
      <div className="border-t-2 border-ink bg-bone py-4 text-xs text-ink">
        <div className="container-atelier flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="barcode w-36" aria-hidden="true" />
            <p className="mono-label text-[11px] font-bold">
              © {new Date().getFullYear()} AURELIA FASHION // ALL RIGHTS RESERVED
            </p>
          </div>
          <div className="flex items-center gap-4 mono-label text-[11px] font-bold">
            <Link to="/about" className="hover:underline">
              Điều khoản
            </Link>
            <span>·</span>
            <Link to="/about" className="hover:underline">
              Bảo mật
            </Link>
            <span>·</span>
            <Link to="/about" className="hover:underline">
              Đổi trả
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
