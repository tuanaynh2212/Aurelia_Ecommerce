import { useEffect } from "react";
import { AuthPanel } from "./AuthPanel";
import { EditorialPanel } from "./EditorialPanel";
import { Navbar } from "./HomeLayoutComponent/Navbar";
import { spatialActions } from "./UI/three/SpatialStore";

export const FormAuthor = () => {
  useEffect(() => {
    spatialActions.setStation("TICKET_BOOTH");
  }, []);

  return (
    <div className="min-h-screen bg-bone text-ink flex flex-col">
      <Navbar />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-4rem)] w-full border-b-2 border-ink">
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7">
          <EditorialPanel role="USER" />
        </div>
        <div className="lg:col-span-6 xl:col-span-5 flex">
          <AuthPanel type="client" />
        </div>
      </main>
    </div>
  );
};
