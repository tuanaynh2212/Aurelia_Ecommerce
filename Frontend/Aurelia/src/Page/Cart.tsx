import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { CartItemRow } from "../Components/CartComponents/CartItemRow";
import { CartSummary } from "../Components/CartComponents/CartSummary";
import { Container } from "../Components/layout/Container";
import { ArrowLeft, Ticket as TicketIcon, ShoppingBag } from "lucide-react";
import { DynamicMetaTags } from "../Components/SEO/DynamicMetaTags";
import { Ticket, Button } from "../Components/UI";

export const Cart = () => {
  const { CartDataAdd } = useContext(CartContext);
  const navigate = useNavigate();
  const count = CartDataAdd?.length || 0;

  return (
    <>
      <DynamicMetaTags
        title="Giỏ Hàng | Aurelia"
        description="Quản lý giỏ hàng và danh mục đặt hàng trực tuyến tại Aurelia."
        url={window.location.href}
      />

      <div className="min-h-screen bg-[var(--color-bone)]/85 text-[var(--color-ink)] flex flex-col">
        <Navbar />

        <main id="main-content" className="flex-1 py-8 md:py-12">
          <Container>
            {/* Brutalist Top Dossier Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[var(--color-ink)] pb-5 mb-8 bg-[var(--color-paper)] p-6 shadow-[var(--shadow-hard)] border-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
                    [CASHIER-DESK]
                  </span>
                  <span className="mono-label text-[var(--color-ink-muted)]">
                    ORDER INVENTORY · CART REVIEW
                  </span>
                </div>
                <h1 className="display-l font-display-safe text-[var(--color-ink)]">
                  Giỏ Hàng
                </h1>
                <p className="mono-label text-[var(--color-ink-muted)] mt-1">
                  HIỆN CÓ{" "}
                  <span className="bg-[var(--color-volt)] text-[var(--color-ink)] px-1.5 py-0.5 font-extrabold">
                    {count}
                  </span>{" "}
                  MẶT HÀNG TRONG DANH SÁCH
                </p>
              </div>

              <button
                onClick={() => navigate("/Fashion/Products")}
                className="min-h-[44px] px-4 py-2 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-volt)] inline-flex items-center gap-2 mono-label text-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] transition-colors self-start sm:self-auto cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Tiếp tục chọn sản phẩm</span>
              </button>
            </div>

            {count > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* 8-col 2px-ruled item rows + horizontal notched Ticket voucher rail */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="border-2 border-[var(--color-ink)] bg-[var(--color-paper)] shadow-[var(--shadow-hard)] divide-y-2 divide-[var(--color-ink)]">
                    <div className="px-4 py-2.5 bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-between">
                      <span className="mono-label text-[var(--color-paper)]">
                        [MANIFEST ITEMS // {count} UNITS]
                      </span>
                      <span className="mono-label text-[var(--color-volt)]">
                        CALIBRATED SPEC
                      </span>
                    </div>
                    {CartDataAdd.map((item) => (
                      <CartItemRow key={item.itemid} item={item} />
                    ))}
                  </div>

                  {/* Horizontal notched Ticket voucher rail */}
                  <div className="border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-5 shadow-[var(--shadow-hard)]">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-[var(--color-ink)]">
                      <div className="flex items-center gap-2">
                        <TicketIcon size={15} className="text-[var(--color-flash)]" />
                        <span className="mono-label text-[var(--color-ink)]">
                          ATELIER VOUCHER RAIL · ÁP DỤNG TẠI BƯỚC THANH TOÁN
                        </span>
                      </div>
                      <span className="mono-label text-[var(--color-ink-muted)]">
                        [ADMIT ONE]
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Ticket
                        serial="VCH-SHIP-01"
                        header="FREESHIP VOUCHER"
                        stampText="READY"
                        stub={
                          <button
                            type="button"
                            onClick={() => navigate("/payment")}
                            className="min-h-[44px] px-3 py-1.5 border-2 border-[var(--color-ink)] bg-[var(--color-volt)] mono-label text-[var(--color-ink)] cursor-pointer"
                          >
                            DÙNG MÃ
                          </button>
                        }
                      >
                        <p className="font-bold text-xs uppercase text-[var(--color-ink)]">
                          Miễn phí vận chuyển tiêu chuẩn
                        </p>
                        <p className="mono-label text-[var(--color-ink-muted)] mt-1">
                          Đơn hàng từ 500.000 ₫ hoặc chọn mã tại Checkout
                        </p>
                      </Ticket>

                      <Ticket
                        serial="VCH-ATELIER-02"
                        header="MEMBER TIER PRIVILEGE"
                        stampText="ACTIVE"
                        stub={
                          <button
                            type="button"
                            onClick={() => navigate("/payment")}
                            className="min-h-[44px] px-3 py-1.5 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-volt)] mono-label text-[var(--color-ink)] cursor-pointer"
                          >
                            KIỂM TRA
                          </button>
                        }
                      >
                        <p className="font-bold text-xs uppercase text-[var(--color-ink)]">
                          Ưu đãi hạng thẻ & Coupon đơn hàng
                        </p>
                        <p className="mono-label text-[var(--color-ink-muted)] mt-1">
                          Tự động khấu trừ theo hạng thành viên tại quầy thu ngân
                        </p>
                      </Ticket>
                    </div>
                  </div>
                </div>

                {/* 4-col sticky Receipt summary */}
                <div className="lg:col-span-4 sticky top-20">
                  <CartSummary tax={0} />
                </div>
              </div>
            ) : (
              <div className="py-16 text-center max-w-xl mx-auto bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-lg)] p-8">
                <div className="w-12 h-12 mx-auto mb-4 border-2 border-[var(--color-ink)] bg-[var(--color-volt)] flex items-center justify-center shadow-[var(--shadow-hard-sm)]">
                  <ShoppingBag size={20} className="text-[var(--color-ink)]" />
                </div>
                <div className="mono-label text-[var(--color-ink-muted)] mb-2">
                  [LEDGER EMPTY · 00 ITEMS]
                </div>
                <h2 className="display-m font-display-safe text-[var(--color-ink)] mb-3">
                  Giỏ hàng hiện chưa có mặt hàng nào
                </h2>
                <p className="text-xs font-mono text-[var(--color-ink-muted)] mb-6">
                  Tất cả sản phẩm đã chọn sẽ xuất hiện tại đây kèm theo bảng kiểm tra số lượng và kích cỡ chi tiết.
                </p>
                <Button
                  variant="accent"
                  onClick={() => navigate("/Fashion/Products")}
                >
                  Xem danh mục sản phẩm
                </Button>
              </div>
            )}
          </Container>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Cart;
