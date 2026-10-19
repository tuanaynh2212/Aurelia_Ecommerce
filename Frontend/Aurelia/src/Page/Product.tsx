import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { BannerTitle } from "../Components/ProductComponent/BannerTitle";
import { FilterType } from "../Components/ProductComponent/FilterType";
import { ListProduct } from "../Components/ProductComponent/ListProduct";
import { DynamicMetaTags } from "../Components/SEO/DynamicMetaTags";

export const Product = () => {
  return (
    <>
      <DynamicMetaTags
        title="Danh Mục Sản Phẩm Thời Trang | Aurelia"
        description="Danh mục sản phẩm thời trang Aurelia: váy đầm, áo thiết kế, trang sức, đồng hồ và phụ kiện hoàn thiện."
        keywords="thời trang, váy đầm, trang sức, đồng hồ, phụ kiện, Aurelia"
        url={window.location.href}
      />
      <div className="min-h-screen bg-[var(--color-cream-50)] text-[var(--color-ink)] flex flex-col">
        <Navbar />
        <main id="main-content" className="flex-1 pb-16">
          <BannerTitle />
          <FilterType />
          <ListProduct />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Product;
