import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, MapPin } from "lucide-react";
import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { ProductRecommend } from "../Components/ProductComponent/ProductRecommend";
import { ProductGallery } from "../Components/ProductComponent/ProductGallery";
import {
  ProductDeliveryInfo,
  ProductQualityAndRatings,
  ProductSpecTabs,
} from "../Components/ProductComponent/ProductSpecsPanel";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { DynamicMetaTags } from "../Components/SEO/DynamicMetaTags";
import dataCollection from "../assets/DataMock/dataSeason.json";
import { FilterProductContext } from "../contexts/FIlterProduct";
import type { Cart, Product } from "../types/type";
import { Toaster } from "../Components/Toaster";
import { TimKiemTaiStore } from "../Components/TimKiemTaiStore";
import { CartContext } from "../contexts/CartContext";
import { AiSuggestBox } from "../Components/AISuggest";
import { Container } from "../Components/layout/Container";
import { PriceTag } from "../Components/product/PriceTag";
import { RatingStars } from "../Components/UI/primitives/Meter";
import { Modal } from "../Components/UI/primitives/Overlays";
import { QuantityStepper } from "../Components/UI/primitives/Controls";
import { EmptyState } from "../Components/UI/primitives/Feedback";
import { Button } from "../Components/UI/primitives/Button";
import { swatchHex } from "../Components/UI/three/palette";
import { sizeTileClass } from "../Components/UI/primitives/recipes";
import { cn } from "../utils/cn";
import {
  getPercentageDiscountPrice,
  getProductImages,
} from "../utils/productHelpers";

export const MainProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { dataProduct, isFavouriteProduct, toggleFavourite } =
    useContext(FilterProductContext);
  const { setCartDataAdd } = useContext(CartContext);

  const [findStore, setFindStore] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [is3DMode, setIs3DMode] = useState(false);
  const [qty, setQty] = useState(1);

  const product = useMemo((): Product | undefined => {
    if (!id) return undefined;
    return (
      (dataProduct.find((a) => a.id === id) as Product) ||
      (dataCollection.luxury_women_collections
        .flatMap((item) => item.products)
        .find((a) => a.id === id) as unknown as Product | undefined)
    );
  }, [id, dataProduct]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveImageIndex(0);
    setIs3DMode(false);
    if (product?.variants && product.variants.length > 0) {
      setSelectedColor(product.variants[0].color);
      if (product.variants[0].sizes && product.variants[0].sizes.length > 0) {
        setSelectedSize(product.variants[0].sizes[0].size);
      }
    }
  }, [id, product]);

  const isFav = product ? isFavouriteProduct(product.id) : false;

  const handleToggleFavourite = useCallback(
    (item: Product) => {
      void toggleFavourite(item);
    },
    [toggleFavourite]
  );

  const addToCart = useCallback(
    (productItem: Product) => {
      const stored = localStorage.getItem("Cart");
      const currentCart: (Cart & Record<string, unknown>)[] = stored
        ? JSON.parse(stored)
        : [];

      const sizeToUse =
        selectedSize || productItem.variants?.[0]?.sizes?.[0]?.size || "M";
      const colorToUse =
        selectedColor || productItem.variants?.[0]?.color || "Default";

      const existingIndex = currentCart.findIndex(
        (c) =>
          (c.id === productItem.id || c.itemid === productItem.id) &&
          c.size === sizeToUse &&
          c.color === colorToUse
      );

      if (existingIndex > -1) {
        currentCart[existingIndex].quantity += qty;
      } else {
        const newItem: Cart & Record<string, unknown> = {
          id: productItem.id,
          itemid: productItem.id,
          name: productItem.name,
          price: productItem.price,
          discountValue: productItem.discountValue || 0,
          quantity: qty,
          images: productItem.images || [],
          thumbnail: productItem.thumbnail || "",
          thumnail: productItem.thumbnail || productItem.images?.[0] || "",
          size: sizeToUse,
          color: colorToUse,
          type: productItem.type,
          material: productItem.material,
          dateBuy: new Date().toISOString(),
        };
        currentCart.push(newItem);
      }

      localStorage.setItem("Cart", JSON.stringify(currentCart));
      setCartDataAdd(currentCart as Cart[]);
      Toaster("Đã thêm sản phẩm vào giỏ hàng", "success");
    },
    [selectedSize, selectedColor, qty, setCartDataAdd]
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-bone">
        <Navbar />
        <Container className="py-20">
          <EmptyState
            code="[STATUS 404 · ITEM NOT FOUND]"
            title="Sản phẩm không tồn tại"
            description="Mã sản phẩm không khả dụng hoặc đã hết lượng tồn kho."
            action={
              <Button variant="primary" onClick={() => navigate("/Fashion/Products")}>
                Quay lại danh mục
              </Button>
            }
          />
        </Container>
        <Footer />
      </div>
    );
  }

  const images = getProductImages(product);
  const effectivePrice = getPercentageDiscountPrice(
    product.price,
    product.discountValue
  );
  const originalPrice = product.discountValue > 0 ? product.price : undefined;
  const activeVariantSizes = product.variants?.find(
    (v) => !selectedColor || v.color === selectedColor
  )?.sizes;

  return (
    <>
      <DynamicMetaTags
        title={`${product.name} | Aurelia`}
        description={`${product.description || product.name} - Thông số kỹ thuật và đặt hàng trực tuyến tại Aurelia.`}
        keywords={`${product.name}, ${product.brand}, ${product.type}, thời trang, Aurelia`}
        image={images[0] || "/src/assets/aurelia_logo_svg.svg"}
        url={window.location.href}
        type="product"
      />

      <div className="min-h-screen bg-bone text-ink flex flex-col pb-20 md:pb-0">
        <Navbar />

        <Modal
          open={findStore}
          onClose={() => setFindStore(false)}
          title="TÌM SẢN PHẨM TẠI CỬA HÀNG"
          code="[STORE LOCATOR]"
          size="lg"
        >
          <TimKiemTaiStore setState={setFindStore} product={product} />
        </Modal>

        <main id="main-content" className="flex-1 py-6 md:py-10">
          <Container>
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex items-center gap-2 border-b-2 border-ink pb-3 mono-label text-xs font-bold text-ink-muted"
            >
              <button
                type="button"
                onClick={() => navigate("/")}
                className="hover:text-ink underline-offset-4 hover:underline cursor-pointer"
              >
                INDEX
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => navigate("/Fashion/Products")}
                className="hover:text-ink underline-offset-4 hover:underline cursor-pointer"
              >
                PRODUCTS
              </button>
              <span>/</span>
              <span className="truncate max-w-[260px] text-ink">
                {product.name}
              </span>
            </nav>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
              <ProductGallery
                productId={product.id}
                productName={product.name}
                images={images}
                activeImageIndex={activeImageIndex}
                is3DMode={is3DMode}
                discountValue={product.discountValue}
                onSelectImage={setActiveImageIndex}
                onToggle3D={setIs3DMode}
              />

              <div className="flex flex-col gap-5 border-2 border-ink bg-paper p-6 shadow-hard lg:sticky lg:top-20 lg:col-span-5 rounded-[2px]">
                <div className="flex items-center justify-between border-b-2 border-dashed border-ink pb-2.5 mono-label text-xs font-extrabold text-ink-muted">
                  <span className="text-ink">
                    [{product.brand || "AURELIA"} // {product.type || "GARMENT"}]
                  </span>
                  <span>SKU: {product.id}</span>
                </div>

                <div>
                  <h1 className="display-m font-display-safe text-ink">
                    {product.name}
                  </h1>
                  {product.material && (
                    <p className="mono-label mt-1.5 text-xs font-bold text-ink-muted">
                      THÀNH PHẦN: {product.material}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 border-y-2 border-ink py-2.5 mono-label text-xs font-bold text-ink">
                  <RatingStars value={product.rating || 4.8} showValue />
                  <span>|</span>
                  <span className="tabular">ĐÃ BÁN {product.sold || 48} CHIẾC</span>
                </div>

                <div className="border-2 border-ink bg-bone p-4 rounded-[2px]">
                  <PriceTag
                    price={effectivePrice}
                    originalPrice={originalPrice}
                    discountValue={product.discountValue}
                    size="xl"
                  />
                </div>

                {product.variants && product.variants.length > 0 && (
                  <div>
                    <label className="mono-label mb-2 block text-xs font-extrabold text-ink">
                      MÀU SẮC:{" "}
                      <span className="font-normal text-ink-muted">
                        {selectedColor || "CHƯA CHỌN"}
                      </span>
                    </label>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {product.variants.map((variant, cidx) => {
                        const isSelected = selectedColor === variant.color;
                        return (
                          <button
                            key={cidx}
                            type="button"
                            onClick={() => setSelectedColor(variant.color)}
                            className={cn(
                              "press-collapse inline-flex min-h-[44px] items-center gap-2 border-2 border-ink px-3 py-1.5 mono-label text-xs font-bold cursor-pointer rounded-[2px]",
                              isSelected
                                ? "bg-volt text-ink shadow-hard-sm"
                                : "bg-paper text-ink hover:bg-bone"
                            )}
                          >
                            <span
                              className="h-5 w-5 rounded-full border-2 border-ink"
                              style={{ backgroundColor: swatchHex(variant.color) }}
                            />
                            <span>{variant.color}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="mono-label text-xs font-extrabold text-ink">
                      KÍCH THƯỚC:{" "}
                      <span className="font-normal text-ink-muted">
                        {selectedSize || "CHƯA CHỌN"}
                      </span>
                    </label>
                  </div>

                  {activeVariantSizes && (
                    <div className="flex flex-wrap gap-2">
                      {activeVariantSizes.map((sz, sidx) => {
                        const isSelected = selectedSize === sz.size;
                        const unavailable = (sz.quantity ?? 1) <= 0;
                        return (
                          <button
                            key={sidx}
                            type="button"
                            disabled={unavailable}
                            aria-disabled={unavailable}
                            onClick={() => setSelectedSize(sz.size)}
                            className={sizeTileClass(isSelected, unavailable)}
                          >
                            {sz.size}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <AiSuggestBox
                    productId={product.id}
                    type={product.type}
                    subcategory={product.subcategory}
                    onApplySize={(sz) => setSelectedSize(sz)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <QuantityStepper
                    value={qty}
                    onDecrement={() => setQty((q) => Math.max(1, q - 1))}
                    onIncrement={() => setQty((q) => q + 1)}
                  />

                  <Button
                    variant="accent"
                    size="lg"
                    onClick={() => addToCart(product)}
                    className="flex-1 min-w-[180px]"
                    iconLeft={<ShoppingBag size={18} strokeWidth={2.5} />}
                  >
                    Thêm Vào Giỏ Hàng
                  </Button>

                  <button
                    type="button"
                    onClick={() => handleToggleFavourite(product)}
                    aria-pressed={isFav}
                    aria-label={isFav ? "Bỏ yêu thích sản phẩm" : "Yêu thích sản phẩm"}
                    className={cn(
                      "press-collapse flex h-14 w-14 shrink-0 items-center justify-center border-2 border-ink shadow-hard cursor-pointer rounded-[2px]",
                      isFav
                        ? "bg-flash text-paper"
                        : "bg-paper text-ink hover:bg-volt"
                    )}
                  >
                    <Heart
                      size={20}
                      strokeWidth={2.5}
                      className={isFav ? "fill-current" : ""}
                    />
                  </button>
                </div>

                <Button
                  variant="secondary"
                  block
                  onClick={() => setFindStore(true)}
                  iconLeft={<MapPin size={16} strokeWidth={2.5} />}
                >
                  Tra cứu tồn kho tại cửa hàng vật lý
                </Button>

                <ProductDeliveryInfo />
                <ProductSpecTabs description={product.description} />
              </div>
            </div>

            <ProductQualityAndRatings
              material={product.material}
              rating={product.rating || 4.8}
            />

            <div className="mt-14 border-t-2 border-ink pt-10">
              <ProductRecommend />
            </div>
          </Container>
        </main>

        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t-2 border-ink bg-paper px-4 py-3 shadow-hard-lg safe-bottom md:hidden">
          <div>
            <p className="mono-label text-[10px] font-bold text-ink-muted">
              SIZE: {selectedSize || "M"}
            </p>
            <PriceTag price={effectivePrice} size="md" />
          </div>
          <Button
            variant="accent"
            onClick={() => addToCart(product)}
            iconLeft={<ShoppingBag size={16} />}
          >
            Thêm Vào Giỏ
          </Button>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default MainProduct;
