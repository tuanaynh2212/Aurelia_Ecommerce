import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import ArchivesSection from "../Components/Collection/ArchiveService";
import SeasonGrid from "../Components/Collection/SeasonGrid";
import Hero from "../Components/Collection/Hero";
import { DynamicMetaTags } from "../Components/SEO/DynamicMetaTags";

export const AllCollection = () => {
  return (
    <>
      <DynamicMetaTags
        title="Mục Lục Bộ Sưu Tập | Aurelia"
        description="Mục lục lưu trữ và phân loại các bộ sưu tập thời trang theo niên độ tại Aurelia."
        url={window.location.href}
      />
      <div className="flex flex-col min-h-screen bg-bone text-ink">
        <Navbar />
        <main id="main-content" className="container-atelier flex-grow pb-20">
          <Hero />
          <SeasonGrid />
          <ArchivesSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AllCollection;
