import React, { createContext, useEffect, useState, type ReactNode, useContext} from "react";
import type { order, Product } from "../types/type";
import axios from "axios";
import { api_Config, UseApiUrl } from "../services/api";
import { useLocation } from "react-router-dom";
import { Toaster } from "../Components/Toaster";
import { AuthContext } from "./Author";

type FilterProductContextType = {
  key: string;
  DonHang: order[];
  handleToggleFavourite: boolean;
  donhangMoiNhat: any;
  isLoading: boolean;
  soLuongDonHang: number;
  TongThuChi: number;
  dataProduct: Product[];
  dataFilter: Product[];
  dataFavouriteItemUser: Product[];
  setDataProduct: React.Dispatch<React.SetStateAction<Product[]>>;
  setKey: React.Dispatch<React.SetStateAction<string>>;
  setHandleToggleFavourite: React.Dispatch<React.SetStateAction<boolean>>;
  huyDonHang: (orderId: string) => Promise<void>;
};
export const FilterProductContext = createContext<FilterProductContextType>({
  key: "",
  DonHang: [],
  donhangMoiNhat: [],
  handleToggleFavourite: false,
  isLoading: false,
  soLuongDonHang: 0,
  TongThuChi: 0,
  dataProduct: [],
  dataFilter: [],
  dataFavouriteItemUser: [],
  setDataProduct: () => {},
  setKey: () => {},
  setHandleToggleFavourite: () => {},
  huyDonHang: async () => {},
});

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const {  isSignned } = useContext(AuthContext);
  const [handleToggleFavourite, setHandleToggleFavourite] = useState(false);
  const location = useLocation();
  const [key, setKey] = useState<string>("");
  const [dataProduct, setDataProduct] = useState<Product[]>([]);
  const [dataFilter, setDataFilter] = useState<Product[]>([]);
  const [dataFavouriteItemUser, setDataFavouriteItemUser] = useState<Product[]>([]);
  const [DonHang, setDonHang] = useState<order[]>([]);
  const [donhangMoiNhat, setDonhangMoiNhat] = useState<any>(null);
  const [soLuongDonHang, setSoLuongDonHang] = useState(0);
  const [TongThuChi, setTongThuChi] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [huyDonHangs, setHuyDonHangs] = useState(false);

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

  const fetchAllData = async () => {
    if ( !isSignned) return;
    setIsLoading(true);

    const allProductsCached = localStorage.getItem("allProducts");
    if (allProductsCached) {
      setDataProduct(JSON.parse(allProductsCached));
    }

    const promises = [
      axios.get(`${UseApiUrl(api_Config.User.GetItemsFavourite)}`, {withCredentials: true }),
      axios.get(`${UseApiUrl(api_Config.User.LayDonHang)}`, { withCredentials: true}),
      axios.get(`${UseApiUrl(api_Config.User.SoLuongDonVaTongThuChi)}`, { withCredentials: true}),
      axios.get(`${UseApiUrl(api_Config.User.DonHangGanDay)}`, { withCredentials: true }),
    ];

    const results = await Promise.allSettled(promises);

    results.forEach((res, idx) => {
      if (res.status === "fulfilled") {
        switch (idx) {
          case 0:
            setDataFavouriteItemUser(res.value?.data);
            break;
          case 1:
            setDonHang(res.value?.data);
            break;
          case 2:
            setSoLuongDonHang(res.value?.data.soLuongDon);
            setTongThuChi(res.value?.data.tongTien);
            break;
          case 3:
            setDonhangMoiNhat(res.value?.data.ngayMoiNhat);
            break;
        }
      } else {
        console.error(`Fetch lỗi tại index ${idx}:`, res.reason);
      }
    });
    setIsLoading(false);
  };
  const fetchProducts = async () => {
    try {
      const dataCached = localStorage.getItem("allProducts");
      if (dataCached) {
        setDataProduct(JSON.parse(dataCached));
        return;
      }
      const response = await axios.get<{ data: Product[] }>(UseApiUrl(api_Config.Product.GetProduct));
      setDataProduct(response.data.data);
      localStorage.setItem("allProducts", JSON.stringify(response.data.data));
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [location.pathname]);
  useEffect(() => {
    fetchAllData();

  }, [isSignned, huyDonHangs,location.pathname]);

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
  }, [key,  location.pathname]);

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
        huyDonHang,
        handleToggleFavourite,
        setHandleToggleFavourite,
      }}
    >
      {children}
    </FilterProductContext.Provider>
  );
};
