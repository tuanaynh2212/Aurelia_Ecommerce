import { useParams, useNavigate } from "react-router-dom";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { useContext, useEffect, useState } from "react";
import { CollectionContext } from "../contexts/SeasonContext";
import { LoadingOverlay } from "../Components/LoadingOverlay";
import { Container } from "../Components/layout/Container";
import { ProductGrid } from "../Components/product/ProductGrid";
import { ArrowLeft } from "lucide-react";
import { DynamicMetaTags } from "../Components/SEO/DynamicMetaTags";

export const Collection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { seasonCollections, fetchData } = useContext(CollectionContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id)
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [id, fetchData]);

  if (!seasonCollections || seasonCollections.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <Navbar />
        <Container className="py-24 text-center">
          <div className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-muted)] mb-2">
            COLLECTION RECORD NOT FOUND
          </div>
          <p className="text-sm font-mono text-[var(--color-ink-muted)] mb-6">
            Mã bộ sưu tập không tồn tại hoặc dữ liệu đang được đồng bộ.
          </p>
          <button onClick={() => navigate("/Collection")} className="btn btn-primary rounded-none font-mono text-xs uppercase tracking-wider">
            Quay lại mục lục bộ sưu tập
          </button>
        </Container>
        <Footer />
      </div>
    );
  }

  const collection = seasonCollections.map((item: any) => item.season)[0];
  const products = seasonCollections.map((item: any) => item.products).flat();

  return (
    <>
      <DynamicMetaTags
        title={`${collection?.name || "Bộ Sưu Tập"} | Aurelia`}
        description={collection?.description || "Danh mục bộ sưu tập thời trang Aurelia."}
        url={window.location.href}
      />

      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] flex flex-col">
        <Navbar />
        {isLoading && <LoadingOverlay isLoading={true} message="Đang tải dữ liệu bộ sưu tập..." />}

        <main id="main-content" className="flex-1">
          {/* Hero Banner */}
          <section className="relative min-h-[380px] md:min-h-[460px] flex items-center justify-center text-center overflow-hidden bg-[var(--color-surface)] border-b border-[var(--color-rule)]">
            <div className="absolute inset-0">
              <img
                src={collection?.banner}
                alt={collection?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[var(--color-ink)]/70" />
            </div>

            <Container className="relative z-10 text-[var(--color-bg)] max-w-3xl py-14">
              <div className="inline-block border border-[var(--color-bg)]/40 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--color-bg)] mb-4">
                SEASON CATALOGUE · {collection?.name}
              </div>

              <h1 className="text-3xl sm:text-5xl font-heading font-bold mb-3 tracking-tight">
                {collection?.name}
              </h1>

              {collection?.slogan && (
                <p className="text-sm sm:text-base text-[var(--color-bg)]/90 font-mono mb-4 uppercase tracking-wider">
                  {collection?.slogan}
                </p>
              )}

              {collection?.description && (
                <p className="text-xs sm:text-sm max-w-xl mx-auto text-[var(--color-bg)]/80 font-body leading-relaxed">
                  {collection?.description}
                </p>
              )}
            </Container>
          </section>

          {/* Product Listing */}
          <section className="py-10 md:py-16">
            <Container>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--color-rule)]">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                    INVENTORY LIST
                  </div>
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-[var(--color-ink)] uppercase tracking-tight">
                    Sản Phẩm Trong Bộ Sưu Tập
                  </h2>
                  <p className="text-xs font-mono text-[var(--color-ink-muted)] mt-1 uppercase tracking-wider tabular-nums">
                    {products?.length || 0} MẶT HÀNG ĐANG LƯU HÀNH
                  </p>
                </div>

                <button
                  onClick={() => navigate("/Collection")}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Tất cả BST</span>
                </button>
              </div>

              <ProductGrid
                products={products}
                isLoading={isLoading}
                columns={4}
              />
            </Container>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Collection;
