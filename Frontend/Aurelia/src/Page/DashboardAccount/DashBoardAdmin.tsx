import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { OverView } from "../../Components/AdminBrandComponent/DashBoardComponent/OverView";
import { BannerSetting } from "../../Components/AdminBrandComponent/DashBoardComponent/Banner/BannerSetting";
import { SideBar } from "../../Components/AdminBrandComponent/DashBoardComponent/SideBar";
import { Stores } from "../../Components/AdminBrandComponent/DashBoardComponent/Store";
import Coupon from "../../Components/AdminBrandComponent/DashBoardComponent/Coupon";
import { Revenue } from "../../Components/AdminBrandComponent/DashBoardComponent/Revenue";
import Collections from "../../Components/AdminBrandComponent/DashBoardComponent/Collections";
import ProductManagement from "../../Components/AdminBrandComponent/DashBoardComponent/ProductManagement";
import { spatialActions } from "../../Components/UI/three/SpatialStore";

export const AdminDashboard = () => {
  const [status, setStatus] = useState("Dashboard");

  useEffect(() => {
    spatialActions.setStation("CONTROL_ROOM");
  }, []);

  const statusComponent = (status: string) => {
    switch (status) {
      case "Dashboard":
        return <OverView />;
      case "Banner":
        return <BannerSetting />;
      case "Mã giảm giá":
        return <Coupon />;
      case "Cửa hàng":
        return <Stores />;
      case "Doanh thu":
        return <Revenue />;
      case "Collections":
        return <Collections />;
      case "Cài đặt":
        return <Settings />;
      case "Sản phẩm":
        return <ProductManagement />;
      default:
    }
  };

  return (
    <div className="flex bg-bone text-ink flex-row min-h-screen w-full">
      <div className="shrink-0">
        <SideBar onClick={setStatus} status={status} type="admin" />
      </div>
      <div className="flex-1 min-w-0 min-h-screen bg-bone">
        {statusComponent(status)}
      </div>
    </div>
  );
};
