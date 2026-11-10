import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api_Config, UseApiUrl } from "../services/api";
import axios from "axios";
import type { Coupon, order } from "../types/type";
import { Toaster } from "../Components/Toaster";
import { AuthContext } from "./Author";
import { api_Response } from "../services/http";

type AdminContextType = {
  dataRevenue: any;
  dataUser: any;
  doanhThuCuaHang: any[];
  bestSellingProducts: any[];
  MainBanner: any[];
  StoryBanner: any[];
  dataShop: any[];
  coupons: Coupon[];
  revenueData: any[];
  categoryData: any[];
  ServiceData: any[];
  dataVoucher: Coupon[];
  selectvoucher: Coupon[];
  setSelectvoucher: React.Dispatch<React.SetStateAction<Coupon[]>>;
  handleClick: (type: string, data: any) => void;
  uptodatabase: (type: string, data: any) => void;
  handleDeleteCoupon: (couponId: string) => void;
  handleAddCoupon: (couponData: any) => void;
  handleUpdateCoupon: (couponData: any) => void;
  handleToggleCouponStatus: (couponId: string, bool: boolean) => void;
  suggestVoucher: (order: order | undefined) => void;
};
export const AdminContext = createContext({
  dataRevenue: null,
  dataUser: null,
  doanhThuCuaHang: [],
  bestSellingProducts: [],
  MainBanner: [],
  StoryBanner: [],
  dataShop: [],
  coupons: [] as Coupon[],
  revenueData: [],
  categoryData: [],
  ServiceData: [],
  dataVoucher: [] as Coupon[],
  selectvoucher: [] as Coupon[],
  setSelectvoucher: () => {},
  handleClick: () => {},
  uptodatabase: () => {},
  handleDeleteCoupon: () => {},
  handleAddCoupon: () => {},
  handleUpdateCoupon: () => {},
  handleToggleCouponStatus: () => {},
  suggestVoucher: () => {},
} as AdminContextType);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  {
    const location = useLocation();
    const [dataRevenue, setDataRevenue] = useState<any>(null);
    const [dataUser, setDataUser] = useState<any>(null);
    const [doanhThuCuaHang, setDoanhThuCuaHang] = useState<any[]>([]);
    const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
    const [MainBanner, setMainBanner] = useState<any[]>([]);
    const [StoryBanner, setStoryBanner] = useState<any[]>([]);
    const [dataShop, setDataShop] = useState<any[]>([]);
    const [revenueData, setRevenueData] = useState<any>(null);
    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [ServiceData, setServiceData] = useState<any[]>([]);
    const [dataVoucher, setDataVoucher] = useState<Coupon[]>([]);
    const [selectvoucher, setSelectvoucher] = useState<Coupon[]>([]);
    const { userData } = useContext(AuthContext);
    const handleClick = async (type: string, data: any) => {
      try {
        if (type === "Main") {
          api_Response(
            UseApiUrl(api_Config.Banner.AdjustMainBanner),
            "POST",
            data
          );
          Toaster.success("✅ Banner updated successfully!");
        } else {
          api_Response(
            UseApiUrl(api_Config.Banner.AdjustStoryBanner),
            "POST",
            data
          );
          Toaster.success("✅ Banner updated successfully!");
        }
      } catch (error) {
        Toaster.error("❌ Error updating banner:");
      }
    };
    const uptodatabase = async (type: string, data: any) => {
      try {
        if (type === "Main" || type.includes("Main")) {
          api_Response(
            UseApiUrl(api_Config.Banner.AddMainBanner),
            "POST",
            data
          );
        } else {
          api_Response(
            UseApiUrl(api_Config.Banner.AddStoryBanner),
            "POST",
            data
          );
        }
      } catch (error) {
        console.error("❌ Error updating banner:", error);
      }
    };
    const fetchDataRevenue = async () => {
      try {
        const [
          bannerRes,
          revenueRes,
          userRes,
          shopRes,
          bestSellingRes,
          dataShopRes,
          revenueDataRes,
        ] = await Promise.all([
          axios.get(UseApiUrl(api_Config.Banner.Getbanner)),
          axios.get(UseApiUrl(api_Config.Admin.RevenueData)),
          axios.get(UseApiUrl(api_Config.Admin.UserDataAndDiscount)),
          axios.get(UseApiUrl(api_Config.Admin.DoanhThuCuaHang)),
          axios.get(UseApiUrl(api_Config.Admin.DanhSachSanPhamBanChay)),
          axios.get(UseApiUrl(api_Config.Admin.GetShopInfo)),
          axios.get(UseApiUrl(api_Config.Admin.GetDoanhThuCaNam)),
        ]);
        setMainBanner(bannerRes.data.mainBanner);
        setStoryBanner(bannerRes.data.storyBanner || []);
        setDataRevenue(revenueRes.data);
        setDataUser(userRes.data);
        setDoanhThuCuaHang(shopRes.data.dataShop || []);
        setBestSellingProducts(bestSellingRes.data.listSold || []);
        setDataShop(dataShopRes.data || []);
        setRevenueData(revenueDataRes.data.revenue || []);
        setCategoryData(revenueDataRes.data.stockByType || []);
        setServiceData(revenueDataRes.data.appointMent || []);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    useEffect(() => {
      fetchDataRevenue();
    }, [location]);
    useEffect(() => {
      const Current = new Date().getMonth() + 1;
      const currentDate = new Date().getDate();
      const nextMonth = new Date().getMonth() + 2;
      if (Current < nextMonth && currentDate === 1) {
        axios.get(UseApiUrl(api_Config.Admin.ResetSoldProduct));
      }
    });
    {
      {

        const [coupons, setCoupons] = useState<Coupon[]>([]);
        const fetchCoupons = async () => {
          try {
            const data = await api_Response(
              UseApiUrl(api_Config.Coupon.getCoupons),
              "GET"
            );
            setCoupons(data as Coupon[]);
          } catch (error) {
            console.error("❌ Error fetching coupons:", error);
          }
        };

        useEffect(() => {
          fetchCoupons();
        }, []);
        const handleAddCoupon = async (couponData: any) => {
          try {
            await api_Response(
              UseApiUrl(api_Config.Coupon.addCoupon),
              "POST",
              couponData
            );
            Toaster.success("✅ Coupon added successfully!");
            fetchCoupons();
          } catch (error) {
            Toaster.error("Failed to add coupon");
          }
        };
        const handleUpdateCoupon = async (couponData: any) => {
          try {
            await axios.post(
              UseApiUrl(api_Config.Coupon.updateCoupon),
              couponData,
              { headers: { "Content-Type": "application/json" } }
            );
            Toaster.success("✅ Coupon updated successfully!");
            fetchCoupons();
          } catch (error) {
            Toaster.error("Failed to update coupon");
          }
        };
        const handleDeleteCoupon = async (voucherId: string) => {
          try {
            await axios.delete(
              `${UseApiUrl(
                api_Config.Coupon.deleteCoupon
              )}?voucherId=${voucherId}`
            );
            Toaster.success("✅ Coupon deleted successfully!");
            fetchCoupons();
          } catch (error) {
            Toaster.error("Failed to delete coupon");
          }
        };
        const handleToggleCouponStatus = async (id: string, bool: boolean) => {
          try {
            await axios.post(
              UseApiUrl(api_Config.Coupon.toggleCouponStatus),
              { id, active: bool },
              { headers: { "Content-Type": "application/json" } }
            );
            Toaster.success("✅ Coupon status toggled successfully!");
            fetchCoupons();
          } catch (error) {
            Toaster.error("Failed to toggle coupon status");
          }
        };

        const suggestVoucher = async (order: order | undefined) => {
          try {
            const response = await axios.post(
              `${UseApiUrl(api_Config.Coupon.suggestVoucher)}?id=${
                userData.id
              }`,
              order,
              { headers: { "Content-Type": "application/json" } }
            );
            setDataVoucher(response.data);
            fetchCoupons();
          } catch (error) {}
        };

        return (
          <AdminContext.Provider
            value={{
              categoryData,
              revenueData,
              dataRevenue,
              dataUser,
              doanhThuCuaHang,
              bestSellingProducts,
              MainBanner,
              StoryBanner,
              coupons,
              dataShop,
              ServiceData,
              dataVoucher,
              selectvoucher,
              setSelectvoucher,
              handleClick,
              uptodatabase,
              handleDeleteCoupon,
              handleAddCoupon,
              handleUpdateCoupon,
              handleToggleCouponStatus,
              suggestVoucher,
            }}
          >
            {children}
          </AdminContext.Provider>
        );
      }
    }
  }
};
