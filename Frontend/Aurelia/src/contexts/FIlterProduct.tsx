/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { order, Product } from "../types/type";
import axios from "axios";
import { api_Config, UseApiUrl } from "../services/api";
import { useLocation } from "react-router-dom";
import { Toaster } from "../Components/Toaster";
import { AuthContext } from "./Author";

function normalizeFavouriteItems(raw: unknown): Product[] {
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object" && Array.isArray((raw as { data?: unknown }).data)
      ? (raw as { data: unknown[] }).data
      : [];

  const seen = new Set<string>();
  const normalized: Product[] = [];

  for (const entry of list) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry as Product;
    if (!item.id && !item.name) continue;
    const key = item.id || item.name;
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push(item);
  }

  return normalized;
}

function isArrayPayload(raw: unknown): boolean {
  return (
    Array.isArray(raw) ||
    (Boolean(raw) && typeof raw === "object" && Array.isArray((raw as { data?: unknown }).data))
  );
}

function toApiProductPayload(item: Product): Product {
  const nowIso = new Date().toISOString();
  return {
    id: item.id || "",
    name: item.name || "",
    type: item.type || "",
    subcategory: item.subcategory || "",
    brand: item.brand || "",
    origin: item.origin || "",
    price: Number(item.price) || 0,
    description: item.description || "",
    rating: Number(item.rating) || 0,
    stock: Number(item.stock) || 0,
    createdAt: item.createdAt || nowIso,
    updatedAt: item.updatedAt || nowIso,
    thumbnail: item.thumbnail || "",
    images: Array.isArray(item.images) ? item.images : [],
    material: item.material || "",
    variants: Array.isArray(item.variants) ? item.variants : [],
    sold: Number(item.sold) || 0,
    discountValue: Number(item.discountValue) || 0,
    discountType: item.discountType || "",
    season: item.season || "",
  };
}

type FilterProductContextType = {
  key: string;
  DonHang: order[];
  handleToggleFavourite: boolean;
  donhangMoiNhat: unknown;
  isLoading: boolean;
  isFavouriteLoading: boolean;
  favouriteError: string | null;
  soLuongDonHang: number;
  TongThuChi: number;
  dataProduct: Product[];
  dataFilter: Product[];
  dataFavouriteItemUser: Product[];
  setDataProduct: React.Dispatch<React.SetStateAction<Product[]>>;
  setKey: React.Dispatch<React.SetStateAction<string>>;
  setHandleToggleFavourite: React.Dispatch<React.SetStateAction<boolean>>;
  huyDonHang: (orderId: string) => Promise<void>;
  refreshFavourites: () => Promise<void>;
  toggleFavourite: (product: Product) => Promise<boolean>;
  isFavouriteProduct: (productId: string) => boolean;
};
export const FilterProductContext = createContext<FilterProductContextType>({
  key: "",
  DonHang: [],
  donhangMoiNhat: null,
  handleToggleFavourite: false,
  isLoading: false,
  isFavouriteLoading: false,
  favouriteError: null,
  soLuongDonHang: 0,
  TongThuChi: 0,
  dataProduct: [],
  dataFilter: [],
  dataFavouriteItemUser: [],
  setDataProduct: () => {},
  setKey: () => {},
  setHandleToggleFavourite: () => {},
  huyDonHang: async () => {},
  refreshFavourites: async () => {},
  toggleFavourite: async () => false,
  isFavouriteProduct: () => false,
});

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const { isSignned, userData } = useContext(AuthContext);
  const [handleToggleFavourite, setHandleToggleFavourite] = useState(false);
  const location = useLocation();
  const [key, setKey] = useState<string>("");
  const [dataProduct, setDataProduct] = useState<Product[]>([]);
  const [dataFilter, setDataFilter] = useState<Product[]>([]);
  const [dataFavouriteItemUser, setDataFavouriteItemUser] = useState<Product[]>([]);
  const [DonHang, setDonHang] = useState<order[]>([]);
  const [donhangMoiNhat, setDonhangMoiNhat] = useState<unknown>(null);
  const [soLuongDonHang, setSoLuongDonHang] = useState(0);
  const [TongThuChi, setTongThuChi] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavouriteLoading, setIsFavouriteLoading] = useState(false);
  const [favouriteError, setFavouriteError] = useState<string | null>(null);
  const [huyDonHangs, setHuyDonHangs] = useState(false);
  const favAuthoritativeRef = useRef(false);

  const huyDonHang = async (orderId: string) => {
    if (!isSignned) return;
    try {
      await axios.post(`${UseApiUrl(api_Config.User.HuyDon)}?orderId=${orderId}`, {}, {
        withCredentials: true,
      });
      setHuyDonHangs(!huyDonHangs);
      Toaster.success("Đã hủy đơn hàng thành công!");
    } catch (error) {
      console.error(error);
      Toaster.error("Hủy đơn hàng không thành công! Vui lòng thử lại.");
    }
  };

  const refreshFavourites = useCallback(async () => {
    if (!isSignned) {
      favAuthoritativeRef.current = false;
      setDataFavouriteItemUser([]);
      setFavouriteError(null);
      setIsFavouriteLoading(false);
      return;
    }

    setIsFavouriteLoading(true);
    setFavouriteError(null);
    try {
      const res = await axios.get(UseApiUrl(api_Config.User.GetItemsFavourite), {
        withCredentials: true,
      });
      if (isArrayPayload(res.data)) {
        favAuthoritativeRef.current = true;
        setDataFavouriteItemUser(normalizeFavouriteItems(res.data));
      } else {
        setDataFavouriteItemUser(normalizeFavouriteItems(userData?.sanPhamYeuThich));
      }
    } catch (error) {
      console.error("Fetch lỗi sản phẩm yêu thích:", error);
      const fallbackFav = normalizeFavouriteItems(userData?.sanPhamYeuThich);
      if (fallbackFav.length > 0) {
        setDataFavouriteItemUser(fallbackFav);
      } else {
        setFavouriteError("Không thể tải danh sách sản phẩm yêu thích. Vui lòng thử lại.");
      }
    } finally {
      setIsFavouriteLoading(false);
    }
  }, [isSignned, userData?.sanPhamYeuThich]);

  const toggleFavourite = useCallback(
    async (product: Product): Promise<boolean> => {
      if (!isSignned) {
        Toaster.info("Vui lòng đăng nhập để lưu sản phẩm yêu thích");
        return false;
      }
      if (!product?.id) return false;

      const currentlySaved = dataFavouriteItemUser.some((item) => item.id === product.id);
      const previousItems = dataFavouriteItemUser;

      if (currentlySaved) {
        favAuthoritativeRef.current = true;
        setDataFavouriteItemUser((prev) => prev.filter((item) => item.id !== product.id));
        try {
          await axios.delete(
            `${UseApiUrl(api_Config.User.RemoveFavouriteItems)}/${encodeURIComponent(product.id)}`,
            { withCredentials: true }
          );
          setHandleToggleFavourite((prev) => !prev);
          Toaster.success("Đã xóa khỏi danh sách yêu thích");
          return true;
        } catch (error) {
          const axiosErr = error as { response?: { status?: number } };
          const status = axiosErr?.response?.status;
          if (status === 404 || status === 405) {
            setHandleToggleFavourite((prev) => !prev);
            Toaster.success("Đã xóa khỏi danh sách yêu thích");
            return true;
          }
          console.error("Lỗi xóa sản phẩm yêu thích:", error);
          setDataFavouriteItemUser(previousItems);
          Toaster.error("Không thể cập nhật yêu thích, vui lòng thử lại");
          return false;
        }
      }

      const payload = toApiProductPayload(product);
      favAuthoritativeRef.current = true;
      setDataFavouriteItemUser((prev) =>
        prev.some((item) => item.id === payload.id) ? prev : [...prev, payload]
      );
      try {
        await axios.post(UseApiUrl(api_Config.User.AddFavouriteItems), payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setHandleToggleFavourite((prev) => !prev);
        Toaster.success("Đã thêm vào sản phẩm yêu thích");
        return true;
      } catch (error) {
        console.error("Lỗi thêm sản phẩm yêu thích:", error);
        setDataFavouriteItemUser(previousItems);
        Toaster.error("Không thể thêm vào yêu thích, vui lòng thử lại");
        return false;
      }
    },
    [isSignned, dataFavouriteItemUser]
  );

  const isFavouriteProduct = useCallback(
    (productId: string) =>
      Boolean(productId) && dataFavouriteItemUser.some((item) => item.id === productId),
    [dataFavouriteItemUser]
  );

  const fetchAllData = useCallback(async () => {
    if (!isSignned) {
      favAuthoritativeRef.current = false;
      setDataFavouriteItemUser([]);
      setDonHang([]);
      setSoLuongDonHang(0);
      setTongThuChi(0);
      setDonhangMoiNhat(null);
      setFavouriteError(null);
      setIsFavouriteLoading(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsFavouriteLoading(true);
    setFavouriteError(null);

    const allProductsCached = localStorage.getItem("allProducts");
    if (allProductsCached) {
      try {
        const parsed = JSON.parse(allProductsCached);
        if (Array.isArray(parsed)) setDataProduct(parsed);
      } catch {
        localStorage.removeItem("allProducts");
      }
    }

    const promises = [
      axios.get(`${UseApiUrl(api_Config.User.GetItemsFavourite)}`, { withCredentials: true }),
      axios.get(`${UseApiUrl(api_Config.User.LayDonHang)}`, { withCredentials: true }),
      axios.get(`${UseApiUrl(api_Config.User.SoLuongDonVaTongThuChi)}`, { withCredentials: true }),
      axios.get(`${UseApiUrl(api_Config.User.DonHangGanDay)}`, { withCredentials: true }),
    ];

    const results = await Promise.allSettled(promises);

    results.forEach((res, idx) => {
      if (res.status === "fulfilled") {
        switch (idx) {
          case 0: {
            const rawFav = res.value?.data;
            if (isArrayPayload(rawFav)) {
              favAuthoritativeRef.current = true;
              setDataFavouriteItemUser(normalizeFavouriteItems(rawFav));
            } else {
              setDataFavouriteItemUser(normalizeFavouriteItems(userData?.sanPhamYeuThich));
            }
            setFavouriteError(null);
            break;
          }
          case 1:
            setDonHang(Array.isArray(res.value?.data) ? res.value.data : []);
            break;
          case 2:
            setSoLuongDonHang(res.value?.data?.soLuongDon ?? 0);
            setTongThuChi(res.value?.data?.tongTien ?? 0);
            break;
          case 3:
            setDonhangMoiNhat(res.value?.data?.ngayMoiNhat ?? null);
            break;
        }
      } else {
        console.error(`Fetch lỗi tại index ${idx}:`, res.reason);
        if (idx === 0) {
          const fallbackFav = normalizeFavouriteItems(userData?.sanPhamYeuThich);
          if (fallbackFav.length > 0) {
            setDataFavouriteItemUser(fallbackFav);
            setFavouriteError(null);
          } else {
            setFavouriteError("Không thể tải danh sách sản phẩm yêu thích. Vui lòng thử lại.");
          }
        }
      }
    });
    setIsFavouriteLoading(false);
    setIsLoading(false);
  }, [isSignned, userData?.sanPhamYeuThich]);
  const fetchProducts = async () => {
    try {
      const dataCached = localStorage.getItem("allProducts");
      if (dataCached) {
        try {
          const parsed = JSON.parse(dataCached);
          if (Array.isArray(parsed)) {
            setDataProduct(parsed);
            return;
          }
        } catch {
          localStorage.removeItem("allProducts");
        }
      }
      const response = await axios.get<{ data: Product[] }>(UseApiUrl(api_Config.Product.GetProduct));
      const list = Array.isArray(response.data?.data) ? response.data.data : [];
      setDataProduct(list);
      localStorage.setItem("allProducts", JSON.stringify(list));
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [location.pathname]);
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, huyDonHangs, location.pathname]);

  useEffect(() => {
    if (!isSignned || favAuthoritativeRef.current) return;
    const fallbackFav = normalizeFavouriteItems(userData?.sanPhamYeuThich);
    if (fallbackFav.length > 0) {
      setDataFavouriteItemUser(fallbackFav);
      setFavouriteError(null);
    }
  }, [isSignned, userData?.sanPhamYeuThich]);

  useEffect(() => {
    if (!key) {
      setDataFilter(dataProduct);
      return;
    }
    const filtered = dataProduct.filter(p =>
      p.name.toLowerCase().includes(key.toLowerCase()) ||
      p.brand.toLowerCase().includes(key.toLowerCase())
    );
    setDataFilter(filtered);
  }, [key, location.pathname, dataProduct]);

  return (
    <FilterProductContext.Provider
      value={{
        key,
        setKey,
        dataProduct,
        setDataProduct,
        dataFilter,
        dataFavouriteItemUser,
        soLuongDonHang,
        TongThuChi,
        DonHang,
        donhangMoiNhat,
        isLoading,
        isFavouriteLoading,
        favouriteError,
        huyDonHang,
        refreshFavourites,
        toggleFavourite,
        isFavouriteProduct,
        handleToggleFavourite,
        setHandleToggleFavourite,
      }}
    >
      {children}
    </FilterProductContext.Provider>
  );
};
