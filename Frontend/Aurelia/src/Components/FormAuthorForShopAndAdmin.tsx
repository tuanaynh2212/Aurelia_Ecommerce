import { useEffect } from "react";
import { Navbar } from "./HomeLayoutComponent/Navbar";
import { Footer } from "./HomeLayoutComponent/Footer";
import { EditorialPanel } from "./EditorialPanel";
import { AuthPanel } from "./AuthPanel";
import { spatialActions } from "./UI/three/SpatialStore";

export default function FormAuthorForShopAndAdmin() {
  useEffect(() => {
    spatialActions.setStation("TICKET_BOOTH");
  }, []);

  return (
    <div className="min-h-screen bg-bone text-ink flex flex-col">
      <Navbar />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-4rem)] w-full border-b-2 border-ink">
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7">
          <EditorialPanel role="MANAGER" />
        </div>
        <div className="lg:col-span-6 xl:col-span-5 flex">
          <AuthPanel type="ADMIN" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
