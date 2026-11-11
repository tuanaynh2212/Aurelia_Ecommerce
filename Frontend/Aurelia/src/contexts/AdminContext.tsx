import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { api_Config, UseApiUrl } from "../services/api";
import { api_Response } from "../services/http";
import type { Coupon, order } from "../types/type";
import { Toaster } from "../Components/Toaster";
import { AuthContext } from "./Author";

export interface AdminRevenueSummary {
  totalRevenue: number;
  growthRateRevenue: number;
  totalOrders: number;
  growthRateOrders: number;
}

export interface AdminUserSummary {
  soLuongKhachDangKy: number;
  tyLeKhachHang: number;
  tyLeKhachHangMoi?: number;
  soLuongCoupon: number;
  tyLeCoupon: number;
}

export interface StoreRevenuePoint {
  shopName: string;
  revenue: number;
}

export interface BestSellingProduct {
  id: string | number;
  name: string;
  price?: string | number;
  sales?: number;
  type?: string;
  sold?: number;
}

export interface AdminBannerRecord {
  id?: string;
  linkUrl?: string;
  mainTitle?: string;
  h1?: string;
  h2?: string;
  subtitle?: string;
  pagaraph?: string;
  textInButton?: string;
  textButton?: string;
  active?: boolean;
  layout?: string;
  colorMainTitle?: string;
  colorText?: string;
  [key: string]: unknown;
}

export interface AdminShopSummary {
  id: string;
  name: string;
  city: string;
  revenue: number;
  growth?: string;
  rating?: number;
  phone?: string;
}

export interface MonthlyRevenuePoint {
  thang: string;
  revenue: number;
  orders: number;
}

export interface CategoryStockPoint {
  type: string;
  value: number;
}

export interface ServiceUsagePoint {
  service: string;
  totalUse: number;
}

type AdminContextType = {
  dataRevenue: AdminRevenueSummary | null;
  dataUser: AdminUserSummary | null;
  doanhThuCuaHang: StoreRevenuePoint[];
  bestSellingProducts: BestSellingProduct[];
  MainBanner: AdminBannerRecord[];
  StoryBanner: AdminBannerRecord[];
  dataShop: AdminShopSummary[];
  coupons: Coupon[];
  revenueData: MonthlyRevenuePoint[];
  categoryData: CategoryStockPoint[];
  ServiceData: ServiceUsagePoint[];
  dataVoucher: Coupon[];
  selectvoucher: Coupon[];
  setSelectvoucher: React.Dispatch<React.SetStateAction<Coupon[]>>;
  handleClick: (type: string, data: unknown) => Promise<boolean>;
  uptodatabase: (type: string, data: unknown) => Promise<boolean>;
  handleDeleteCoupon: (couponId: string) => Promise<void>;
  handleAddCoupon: (couponData: unknown) => Promise<void>;
  handleUpdateCoupon: (couponData: unknown) => Promise<void>;
  handleToggleCouponStatus: (couponId: string, bool: boolean) => Promise<void>;
  suggestVoucher: (order: order | undefined) => Promise<void>;
};

const JSON_HEADERS = { "Content-Type": "application/json" } as const;

// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext = createContext<AdminContextType>({
  dataRevenue: null,
  dataUser: null,
  doanhThuCuaHang: [],
  bestSellingProducts: [],
  MainBanner: [],
  StoryBanner: [],
  dataShop: [],
  coupons: [],
  revenueData: [],
  categoryData: [],
  ServiceData: [],
  dataVoucher: [],
  selectvoucher: [],
  setSelectvoucher: () => {},
  handleClick: async () => false,
  uptodatabase: async () => false,
  handleDeleteCoupon: async () => {},
  handleAddCoupon: async () => {},
  handleUpdateCoupon: async () => {},
  handleToggleCouponStatus: async () => {},
  suggestVoucher: async () => {},
});

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { userData } = useContext(AuthContext);

  const [dataRevenue, setDataRevenue] = useState<AdminRevenueSummary | null>(null);
  const [dataUser, setDataUser] = useState<AdminUserSummary | null>(null);
  const [doanhThuCuaHang, setDoanhThuCuaHang] = useState<StoreRevenuePoint[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<BestSellingProduct[]>([]);
  const [MainBanner, setMainBanner] = useState<AdminBannerRecord[]>([]);
  const [StoryBanner, setStoryBanner] = useState<AdminBannerRecord[]>([]);
  const [dataShop, setDataShop] = useState<AdminShopSummary[]>([]);
  const [revenueData, setRevenueData] = useState<MonthlyRevenuePoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryStockPoint[]>([]);
  const [ServiceData, setServiceData] = useState<ServiceUsagePoint[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [dataVoucher, setDataVoucher] = useState<Coupon[]>([]);
  const [selectvoucher, setSelectvoucher] = useState<Coupon[]>([]);

  const fetchDataRevenue = useCallback(async () => {
    try {
      const [
        bannerRes,
        revenueRes,
        userRes,
        shopRes,
        bestSellingRes,
        dataShopRes,
        annualRevenueRes,
      ] = await Promise.all([
        api_Response<{
          mainBanner?: AdminBannerRecord[];
          storyBanner?: AdminBannerRecord[];
        }>(UseApiUrl(api_Config.Banner.Getbanner), "GET"),
        api_Response<AdminRevenueSummary>(
          UseApiUrl(api_Config.Admin.RevenueData),
          "GET"
        ),
        api_Response<AdminUserSummary>(
          UseApiUrl(api_Config.Admin.UserDataAndDiscount),
          "GET"
        ),
        api_Response<{ dataShop?: StoreRevenuePoint[] }>(
          UseApiUrl(api_Config.Admin.DoanhThuCuaHang),
          "GET"
        ),
        api_Response<{ listSold?: BestSellingProduct[] }>(
          UseApiUrl(api_Config.Admin.DanhSachSanPhamBanChay),
          "GET"
        ),
        api_Response<AdminShopSummary[]>(
          UseApiUrl(api_Config.Admin.GetShopInfo),
          "GET"
        ),
        api_Response<{
          revenue?: MonthlyRevenuePoint[];
          stockByType?: CategoryStockPoint[];
          appointMent?: ServiceUsagePoint[];
        }>(UseApiUrl(api_Config.Admin.GetDoanhThuCaNam), "GET"),
      ]);

      setMainBanner(bannerRes?.mainBanner || []);
      setStoryBanner(bannerRes?.storyBanner || []);
      setDataRevenue(revenueRes);
      setDataUser(userRes);
      setDoanhThuCuaHang(shopRes?.dataShop || []);
      setBestSellingProducts(bestSellingRes?.listSold || []);
      setDataShop(dataShopRes || []);
      setRevenueData(annualRevenueRes?.revenue || []);
      setCategoryData(annualRevenueRes?.stockByType || []);
      setServiceData(annualRevenueRes?.appointMent || []);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    }
  }, []);

  const handleClick = useCallback(
    async (type: string, data: unknown): Promise<boolean> => {
      try {
        const endpoint =
          type === "Main"
            ? api_Config.Banner.AdjustMainBanner
            : api_Config.Banner.AdjustStoryBanner;
        await api_Response(UseApiUrl(endpoint), "POST", data, JSON_HEADERS);
        Toaster.success("Đã cập nhật banner thành công!");
        await fetchDataRevenue();
        return true;
      } catch {
        Toaster.error("Không thể cập nhật banner. Vui lòng thử lại!");
        return false;
      }
    },
    [fetchDataRevenue]
  );

  const uptodatabase = useCallback(
    async (type: string, data: unknown): Promise<boolean> => {
      try {
        const isMain = type === "Main" || type.includes("Main");
        const endpoint = isMain
          ? api_Config.Banner.AddMainBanner
          : api_Config.Banner.AddStoryBanner;
        await api_Response(UseApiUrl(endpoint), "POST", data, JSON_HEADERS);
        Toaster.success("Đã thêm banner mới thành công!");
        await fetchDataRevenue();
        return true;
      } catch (error) {
        console.error("❌ Error adding banner:", error);
        Toaster.error("Không thể thêm banner mới. Vui lòng thử lại!");
        return false;
      }
    },
    [fetchDataRevenue]
  );

  const fetchCoupons = useCallback(async () => {
    try {
      const data = await api_Response<Coupon[]>(
        UseApiUrl(api_Config.Coupon.getCoupons),
        "GET"
      );
      setCoupons(data || []);
    } catch (error) {
      console.error("❌ Error fetching coupons:", error);
    }
  }, []);

  useEffect(() => {
    void fetchDataRevenue();
  }, [location, fetchDataRevenue]);

  useEffect(() => {
    if (new Date().getDate() === 1) {
      void api_Response(
        UseApiUrl(api_Config.Admin.ResetSoldProduct),
        "GET"
      ).catch(() => {});
    }
  }, []);

  useEffect(() => {
    void fetchCoupons();
  }, [fetchCoupons]);

  const handleAddCoupon = useCallback(
    async (couponData: unknown) => {
      try {
        await api_Response(
          UseApiUrl(api_Config.Coupon.addCoupon),
          "POST",
          couponData,
          JSON_HEADERS
        );
        Toaster.success("✅ Coupon added successfully!");
        await fetchCoupons();
      } catch {
        Toaster.error("Failed to add coupon");
      }
    },
    [fetchCoupons]
  );

  const handleUpdateCoupon = useCallback(
    async (couponData: unknown) => {
      try {
        await api_Response(
          UseApiUrl(api_Config.Coupon.updateCoupon),
          "POST",
          couponData,
          JSON_HEADERS
        );
        Toaster.success("✅ Coupon updated successfully!");
        await fetchCoupons();
      } catch {
        Toaster.error("Failed to update coupon");
      }
    },
    [fetchCoupons]
  );

  const handleDeleteCoupon = useCallback(
    async (voucherId: string) => {
      try {
        await api_Response(
          `${UseApiUrl(api_Config.Coupon.deleteCoupon)}?voucherId=${voucherId}`,
          "DELETE"
        );
        Toaster.success("✅ Coupon deleted successfully!");
        await fetchCoupons();
      } catch {
        Toaster.error("Failed to delete coupon");
      }
    },
    [fetchCoupons]
  );

  const handleToggleCouponStatus = useCallback(
    async (id: string, bool: boolean) => {
      try {
        await api_Response(
          UseApiUrl(api_Config.Coupon.toggleCouponStatus),
          "POST",
          { id, active: bool },
          JSON_HEADERS
        );
        Toaster.success("✅ Coupon status toggled successfully!");
        await fetchCoupons();
      } catch {
        Toaster.error("Failed to toggle coupon status");
      }
    },
    [fetchCoupons]
  );

  const suggestVoucher = useCallback(
    async (order: order | undefined) => {
      if (!userData?.id) return;
      try {
        const data = await api_Response<Coupon[]>(
          `${UseApiUrl(api_Config.Coupon.suggestVoucher)}?id=${userData.id}`,
          "POST",
          order,
          JSON_HEADERS
        );
        setDataVoucher(data || []);
        await fetchCoupons();
      } catch {
        // Ignore suggestion errors when order payload is incomplete
      }
    },
    [userData?.id, fetchCoupons]
  );

  const contextValue = useMemo(
    () => ({
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
    }),
    [
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
      handleClick,
      uptodatabase,
      handleDeleteCoupon,
      handleAddCoupon,
      handleUpdateCoupon,
      handleToggleCouponStatus,
      suggestVoucher,
    ]
  );

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};
