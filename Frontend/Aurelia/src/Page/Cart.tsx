import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { CartItemRow } from "../Components/CartComponents/CartItemRow";
import { CartSummary } from "../Components/CartComponents/CartSummary";
import { Container } from "../Components/layout/Container";
import { ArrowLeft } from "lucide-react";
import { DynamicMetaTags } from "../Components/SEO/DynamicMetaTags";

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

      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] flex flex-col">
        <Navbar />

        <main id="main-content" className="flex-1 py-8 md:py-12">
          <Container>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--color-rule)] pb-4 mb-8">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
                  ORDER INVENTORY · CART REVIEW
                </div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-ink)] tracking-tight">
                  Giỏ Hàng
                </h1>
                <p className="text-xs font-mono text-[var(--color-ink-muted)] mt-1 uppercase tracking-wide">
                  HIỆN CÓ {count} MẶT HÀNG TRONG DANH SÁCH
                </p>
              </div>

              <button
                onClick={() => navigate("/Fashion/Products")}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors self-start sm:self-auto cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Tiếp tục chọn sản phẩm</span>
              </button>
            </div>

            {count > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Product List */}
                <div className="lg:col-span-7 space-y-3">
                  {CartDataAdd.map((item) => (
                    <CartItemRow key={item.itemid} item={item} />
                  ))}
                </div>

                {/* Right: Summary */}
                <div className="lg:col-span-5 sticky top-24">
                  <CartSummary tax={0} />
                </div>
              </div>
            ) : (
              /* Empty Cart State */
              <div className="py-20 text-center max-w-lg mx-auto bg-[var(--color-surface)] rounded-none border border-[var(--color-rule)] p-8">
                <div className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-muted)] mb-2">
                  LEDGER EMPTY · NO ITEMS
                </div>
                <h2 className="text-xl font-heading font-bold text-[var(--color-ink)] mb-2">
                  Giỏ hàng hiện chưa có mặt hàng nào
                </h2>
                <p className="text-xs font-mono text-[var(--color-ink-muted)] mb-6">
                  Tất cả sản phẩm đã chọn sẽ xuất hiện tại đây kèm theo bảng kiểm tra số lượng và kích cỡ chi tiết.
                </p>
                <button
                  onClick={() => navigate("/Fashion/Products")}
                  className="btn btn-primary px-8 py-3 rounded-none font-mono text-xs uppercase tracking-wider"
                >
                  Xem danh mục sản phẩm
                </button>
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
