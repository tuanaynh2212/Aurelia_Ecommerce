import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import {
  Heart,
  ShoppingBag,
  MapPin,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Box,
  Image as ImageIcon,
} from "lucide-react";
import { ProductViewer } from "../Components/three/ProductViewer";
import {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductRecommend } from "../Components/ProductComponent/ProductRecommend";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { DynamicMetaTags } from "../Components/SEO/DynamicMetaTags";
import dataCollection from "../assets/DataMock/dataSeason.json";
import { FilterProductContext } from "../contexts/FIlterProduct";
import type { Cart, Product } from "../types/type";
import { Toaster } from "../Components/Toaster";
import { api_Config, UseApiUrl } from "../services/api";
import { TimKiemTaiStore } from "../Components/TimKiemTaiStore";
import { CartContext } from "../contexts/CartContext";
import { AiSuggestBox } from "../Components/AISuggest";
import { AuthContext } from "../contexts/Author";
import { api_Response } from "../services/http";
import { Container } from "../Components/layout/Container";
import { PriceTag } from "../Components/product/PriceTag";
import { Rating } from "../Components/ui/Rating";
import { Modal } from "../Components/ui/Modal";
import { cn } from "../utils/cn";

export const MainProduct = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { dataProduct, dataFavouriteItemUser } = useContext(FilterProductContext);
  const { setCartDataAdd, CartDataAdd } = useContext(CartContext);
  const { isSignned } = useContext(AuthContext);

  const [toggleBar, setToggleBar] = useState<"Description" | "Size&Fit" | "Policies">("Description");
  const [heartPopup, setHeartPopup] = useState(false);
  const [findStore, setFindStore] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [is3DMode, setIs3DMode] = useState(false);

  const product = useMemo((): Product | undefined => {
    if (!id) return undefined;
    return (
      (dataProduct.find((a) => a.id === id) as Product) ||
      dataCollection.luxury_women_collections
        .flatMap((item) => item.products)
        .find((a) => a.id === id)
    );
  }, [id, dataProduct]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveImageIndex(0);
    setIs3DMode(false);
    if (product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedColor(product.variants[0].color);
        if (product.variants[0].sizes && product.variants[0].sizes.length > 0) {
          setSelectedSize(product.variants[0].sizes[0].size);
        }
      }
    }
  }, [id, product]);

  const handleToggleFavourite = useCallback(
    async (item: Product) => {
      if (!isSignned) {
        Toaster("Vui lòng đăng nhập để lưu sản phẩm yêu thích", "info");
        return;
      }
      try {
        const res = await api_Response(
          UseApiUrl(api_Config.User.favouriteProduct(item.id)),
          "post"
        );
        if (res.status === 200) {
          setHeartPopup((prev) => !prev);
          Toaster(
            heartPopup ? "Đã xóa khỏi danh sách yêu thích" : "Đã thêm vào yêu thích",
            "success"
          );
        }
      } catch (e) {
        Toaster("Có lỗi xảy ra, vui lòng thử lại", "error");
      }
    },
    [isSignned, heartPopup]
  );

  const AddToCart = useCallback(
    (productItem: Product) => {
      const stored = localStorage.getItem("Cart");
      let currentCart: Cart[] = stored ? JSON.parse(stored) : [];

      const sizeToUse = selectedSize || productItem.variants?.[0]?.sizes?.[0]?.size || "M";
      const colorToUse = selectedColor || productItem.variants?.[0]?.color || "Default";

      const existingIndex = currentCart.findIndex(
        (c) => c.id === productItem.id && c.size === sizeToUse && c.color === colorToUse
      );

      if (existingIndex > -1) {
        currentCart[existingIndex].quantity += 1;
      } else {
        const newItem: Cart = {
          id: productItem.id,
          name: productItem.name,
          price: productItem.price,
          discountValue: productItem.discountValue || 0,
          quantity: 1,
          images: productItem.images || [],
          thumbnail: productItem.thumbnail || "",
          size: sizeToUse,
          color: colorToUse,
          type: productItem.type,
          material: productItem.material,
        };
        currentCart.push(newItem);
      }

      localStorage.setItem("Cart", JSON.stringify(currentCart));
      setCartDataAdd(currentCart);
      Toaster("Đã thêm sản phẩm vào giỏ hàng", "success");
    },
    [selectedSize, selectedColor, setCartDataAdd]
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <Navbar />
        <Container className="py-24 text-center">
          <div className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-muted)] mb-2">
            STATUS 404 · ITEM NOT FOUND
          </div>
          <h2 className="text-2xl font-heading font-bold text-[var(--color-ink)] mb-3">
            Sản phẩm không tồn tại
          </h2>
          <p className="text-sm font-mono text-[var(--color-ink-muted)] mb-6">
            Mã sản phẩm không khả dụng hoặc đã hết lượng tồn kho.
          </p>
          <button
            onClick={() => navigate("/Fashion/Products")}
            className="btn btn-primary"
          >
            Quay lại danh mục
          </button>
        </Container>
        <Footer />
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.thumbnail || ""];

  const currentImage = images[activeImageIndex] || images[0];

  const productTitle = `${product.name} | Aurelia`;
  const productDescription = `${product.description || product.name} - Thông số kỹ thuật và đặt hàng trực tuyến tại Aurelia.`;
  const productImage = images[0] || "/src/assets/aurelia_logo_svg.svg";

  return (
    <>
      <DynamicMetaTags
        title={productTitle}
        description={productDescription}
        keywords={`${product.name}, ${product.brand}, ${product.type}, thời trang, Aurelia`}
        image={productImage}
        url={window.location.href}
        type="product"
      />

      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] flex flex-col">
        <Navbar />

        <Modal
          open={findStore}
          onClose={() => setFindStore(false)}
          title="TÌM SẢN PHẨM TẠI CỬA HÀNG"
          size="lg"
        >
          <TimKiemTaiStore setState={setFindStore} product={product} />
        </Modal>

        <main id="main-content" className="flex-1 py-6 md:py-10">
          <Container>
            <nav className="flex items-center gap-2 text-xs font-mono text-[var(--color-ink-muted)] uppercase tracking-wider mb-6 pb-3 border-b border-[var(--color-rule)]">
              <button onClick={() => navigate("/")} className="hover:text-[var(--color-ink)] transition-colors cursor-pointer">
                INDEX
              </button>
              <span>/</span>
              <button
                onClick={() => navigate("/Fashion/Products")}
                className="hover:text-[var(--color-ink)] transition-colors cursor-pointer"
              >
                PRODUCTS
              </button>
              <span>/</span>
              <span className="text-[var(--color-ink)] font-bold truncate max-w-[240px]">
                {product.name}
              </span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
                {images.length > 1 && (
                  <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[640px] pb-2 md:pb-0 scrollbar-none flex-shrink-0">
                    {images.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={cn(
                          "w-16 h-20 sm:w-20 sm:h-24 rounded-none overflow-hidden border transition-colors flex-shrink-0 cursor-pointer bg-[var(--color-surface)]",
                          activeImageIndex === idx
                            ? "border-[var(--color-ink)] ring-1 ring-[var(--color-ink)]"
                            : "border-[var(--color-rule)] opacity-70 hover:opacity-100 hover:border-[var(--color-ink)]"
                        )}
                      >
                        <img
                          src={src}
                          alt={`${product.name} thumb ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="relative flex-1 aspect-[3/4] rounded-none overflow-hidden bg-[var(--color-surface)] border border-[var(--color-rule)]">
                  {is3DMode ? (
                    <ProductViewer
                      thumbnailUrl={currentImage}
                      productName={product.name}
                      className="w-full h-full"
                    />
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImage}
                        src={currentImage}
                        alt={product.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </AnimatePresence>
                  )}

                  <div className="absolute top-3 right-3 z-20">
                    <button
                      type="button"
                      onClick={() => setIs3DMode((v) => !v)}
                      className="px-3 py-1.5 rounded-none bg-[var(--color-bg)]/95 text-xs font-mono uppercase tracking-wider text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)] border border-[var(--color-rule)] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {is3DMode ? (
                        <>
                          <ImageIcon size={13} />
                          <span>ẢNH 2D</span>
                        </>
                      ) : (
                        <>
                          <Box size={13} className="text-[var(--color-accent)]" />
                          <span>MÔ HÌNH 3D</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                    {product.discountValue > 0 && (
                      <span className="bg-[var(--color-accent)] text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-none uppercase tracking-wider">
                        -{product.discountValue}% GIẢM
                      </span>
                    )}
                    {product.isNew && (
                      <span className="bg-[var(--color-ink)] text-[var(--color-bg)] text-[11px] font-mono font-semibold px-2 py-0.5 rounded-none uppercase tracking-wider">
                        NEW INVENTORY
                      </span>
                    )}
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1
                          )
                        }
                        aria-label="Hình trước"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-none bg-[var(--color-bg)]/90 hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)] border border-[var(--color-rule)] text-[var(--color-ink)] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            (prev + 1) % images.length
                          )
                        }
                        aria-label="Hình kế tiếp"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-none bg-[var(--color-bg)]/90 hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)] border border-[var(--color-rule)] text-[var(--color-ink)] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-5">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--color-ink-muted)] uppercase tracking-wider">
                  <span className="font-bold text-[var(--color-ink)]">
                    {product.brand || "AURELIA"}
                  </span>
                  <span>SKU: {product.id}</span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-ink)] tracking-tight">
                    {product.name}
                  </h1>
                  {product.material && (
                    <p className="text-xs font-mono text-[var(--color-ink-muted)] mt-1.5 uppercase tracking-wide">
                      THÀNH PHẦN: {product.material}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 py-2 border-y border-[var(--color-rule)] font-mono text-xs text-[var(--color-ink-muted)]">
                  <Rating value={product.rating || 4.8} size="sm" showValue />
                  <span className="text-[var(--color-rule)]">|</span>
                  <span className="tabular-nums uppercase tracking-wider">
                    ĐÃ BÁN {product.sold || 48} CHIẾC
                  </span>
                </div>

                <div className="p-3.5 rounded-none bg-[var(--color-surface)] border border-[var(--color-rule)]">
                  <PriceTag
                    price={
                      product.discountValue > 0
                        ? product.price - (product.price * product.discountValue) / 100
                        : product.price
                    }
                    originalPrice={product.discountValue > 0 ? product.price : undefined}
                    discountValue={product.discountValue}
                    size="xl"
                  />
                </div>

                {product.variants && product.variants.length > 0 && (
                  <div>
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-ink)] mb-2 block">
                      MÀU SẮC:{" "}
                      <span className="font-normal text-[var(--color-ink-muted)]">
                        {selectedColor || "CHƯA CHỌN"}
                      </span>
                    </label>
                    <div className="flex gap-1.5 flex-wrap">
                      {product.variants.map((variant, cidx) => {
                        const isSelected = selectedColor === variant.color;
                        return (
                          <button
                            key={cidx}
                            type="button"
                            onClick={() => setSelectedColor(variant.color)}
                            className={cn(
                              "px-3 py-1.5 rounded-none text-xs font-mono uppercase tracking-wider border transition-colors cursor-pointer",
                              isSelected
                                ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)] font-bold"
                                : "bg-[var(--color-bg)] text-[var(--color-ink-muted)] border-[var(--color-rule)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                            )}
                          >
                            {variant.color}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-ink)]">
                      KÍCH THƯỚC:{" "}
                      <span className="font-normal text-[var(--color-ink-muted)]">
                        {selectedSize || "CHƯA CHỌN"}
                      </span>
                    </label>
                    <AiSuggestBox
                      productId={product.id}
                      type={product.type}
                      subcategory={product.subcategory}
                    />
                  </div>

                  {product.variants && (
                    <div className="flex gap-1.5 flex-wrap">
                      {product.variants
                        .find((v) => !selectedColor || v.color === selectedColor)
                        ?.sizes?.map((sz, sidx) => {
                          const isSelected = selectedSize === sz.size;
                          return (
                            <button
                              key={sidx}
                              type="button"
                              onClick={() => setSelectedSize(sz.size)}
                              className={cn(
                                "min-w-[40px] h-9 px-3 rounded-none text-xs font-mono font-semibold border transition-colors cursor-pointer flex items-center justify-center",
                                isSelected
                                  ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)]"
                                  : "bg-[var(--color-bg)] text-[var(--color-ink)] border-[var(--color-rule)] hover:border-[var(--color-ink)]"
                              )}
                            >
                              {sz.size}
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => AddToCart(product)}
                    className="btn btn-primary flex-1 py-3.5 flex items-center justify-center gap-2 rounded-none text-xs font-mono uppercase tracking-wider"
                  >
                    <ShoppingBag size={16} />
                    <span>Thêm Vào Giỏ Hàng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleFavourite(product)}
                    aria-label="Yêu thích sản phẩm"
                    className={cn(
                      "w-12 h-12 rounded-none border flex items-center justify-center transition-colors cursor-pointer flex-shrink-0",
                      heartPopup
                        ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
                        : "bg-[var(--color-bg)] border-[var(--color-rule)] text-[var(--color-ink-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                    )}
                  >
                    <Heart size={18} className={heartPopup ? "fill-current" : ""} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setFindStore(true)}
                  className="w-full py-2.5 rounded-none border border-[var(--color-rule)] text-xs font-mono uppercase tracking-wider text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)] flex items-center justify-center gap-2 transition-colors cursor-pointer bg-[var(--color-surface)]/30"
                >
                  <MapPin size={14} className="text-[var(--color-accent)]" />
                  <span>Tra cứu tồn kho tại cửa hàng vật lý</span>
                </button>

                <div className="grid grid-cols-3 border border-[var(--color-rule)] divide-x divide-[var(--color-rule)] bg-[var(--color-surface)]/40 text-center text-[11px] font-mono text-[var(--color-ink-muted)] py-2.5">
                  <div className="flex flex-col items-center gap-1 px-1">
                    <Truck size={14} className="text-[var(--color-accent)]" />
                    <span>GIAO 2-3 NGÀY</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 px-1">
                    <RotateCcw size={14} className="text-[var(--color-accent)]" />
                    <span>14 NGÀY ĐỔI TRẢ</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 px-1">
                    <ShieldCheck size={14} className="text-[var(--color-accent)]" />
                    <span>XUẤT XỨ CHÍNH HÃNG</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex border-b border-[var(--color-rule)] gap-5 mb-3">
                    {(["Description", "Size&Fit", "Policies"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setToggleBar(tab)}
                        className={cn(
                          "pb-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer relative",
                          toggleBar === tab
                            ? "text-[var(--color-ink)] border-b-2 border-[var(--color-accent)] -mb-[1px]"
                            : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                        )}
                      >
                        {tab === "Description"
                          ? "MÔ TẢ THIẾT KẾ"
                          : tab === "Size&Fit"
                          ? "THÔNG SỐ KÍCH THƯỚC"
                          : "CHÍNH SÁCH ĐỔI TRẢ"}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs sm:text-sm text-[var(--color-ink-muted)] font-body leading-relaxed min-h-[80px]">
                    {toggleBar === "Description" && (
                      <p>{product.description || "Thiết kế may đo với đường cắt chính xác, tôn dáng tự nhiên và đảm bảo độ bền kết cấu khi sử dụng lâu dài."}</p>
                    )}
                    {toggleBar === "Size&Fit" && (
                      <div className="space-y-1.5 font-mono text-xs">
                        <p>• Phom dáng: Regular Fit chuẩn bảng đo may đo Việt Nam.</p>
                        <p>• Chiều cao mẫu tham chiếu: 1m68, cỡ S.</p>
                        <p>• Sử dụng công cụ "AI Gợi Ý Size" để tính toán theo số đo cơ thể.</p>
                      </div>
                    )}
                    {toggleBar === "Policies" && (
                      <div className="space-y-1.5 font-mono text-xs">
                        <p>• Miễn phí giao hàng cho đơn từ 500.000 ₫.</p>
                        <p>• Đổi kích cỡ trong vòng 14 ngày kể từ khi nhận hàng.</p>
                        <p>• Được đồng kiểm số lượng và ngoại quan trước khi thanh toán.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-[var(--color-rule)]">
              <ProductRecommend />
            </div>
          </Container>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MainProduct;
