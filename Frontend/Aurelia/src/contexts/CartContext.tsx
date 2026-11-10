import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { type order, type Cart } from "../types/type";
import axios from "axios";
import { Toaster } from "../Components/Toaster";
import { api_Config, UseApiUrl } from "../services/api";
import { AdminContext } from "./AdminContext";
import { api_Response } from "../services/http";
import { AuthContext } from "./Author";

type CartContexts = {
  CartDataAdd: Cart[];
  dataOrder: order | undefined;
  handleClickPayment: () => Promise<void>;
  setDataOrder: React.Dispatch<React.SetStateAction<order | undefined>>;
  setCartDataAdd: React.Dispatch<React.SetStateAction<Cart[]>>;
  LayToaDo: (address: string) => Promise<{ lat: number; lon: number } | null>;
  phiVanChuyen: string;
  LayPhiVanCHuyen: (DuLieuDauRa: boolean) => Promise<void>;
  formatPrice?: (num: number) => string;
};

export const CartContext = createContext<CartContexts>({
  CartDataAdd: [],
  dataOrder: undefined,
  handleClickPayment: async () => {},
  LayToaDo: async () => null,
  setDataOrder: () => {},
  setCartDataAdd: () => {},
  phiVanChuyen: "",
  LayPhiVanCHuyen: async () => {},
  formatPrice: (num: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num),
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { userData } = useContext(AuthContext);
  const { setSelectvoucher } = useContext(AdminContext);
  const [CartDataAdd, setCartDataAdd] = useState<Cart[]>(
    JSON.parse(localStorage.getItem("cartItems") || "[]")
      ? JSON.parse(localStorage.getItem("cartItems") || "[]")
      : userData?.gioHangCuaBan || []
  );
  const [dataOrder, setDataOrder] = useState<order | undefined>();
  const [phiVanChuyen, setPhiVanChuyen] = useState("");
  const [shopId, setShopId] = useState<string>("");
  const token = useMemo(() => localStorage.getItem("token"), []);
   const formatPrice = (num: number) =>
     new Intl.NumberFormat("vi-VN", {
       style: "currency",
       currency: "VND",
     }).format(num);
  const handleClickPayment = useCallback(async () => {
    if (!dataOrder) return;

    try {
      if (shopId === "") {
        return;
      }
      console.log("Data Order:", dataOrder);
      setSelectvoucher([]);
      api_Response(
        `${UseApiUrl(api_Config.User.SuccessPayAddOrder)}?shopId=${shopId}`,
        "POST",
        dataOrder,
        { "Content-Type": "application/json" ,withCredentials: true}
      );
      await axios.put(
        UseApiUrl(api_Config.Product.UpdateQuantityProduct),
        dataOrder.product.map((item) => ({
          productId: item.itemid,
          quantity: item.quantity,
        }))
      );
      api_Response(
        UseApiUrl(api_Config.User.UpdateTier),
        "POST",
        {},
        { "Content-Type": "application/json",withCredentials: true }
      );
      localStorage.removeItem("cartItems");
      setCartDataAdd([]);
      api_Response(UseApiUrl(api_Config.User.XoaGioHang), "DELETE", {}, {});
      Toaster.success("Thanh toán thành công! Đơn hàng đã được tạo.");
    } catch (error) {
      console.error(error);
      Toaster.error("Thanh toán không thành công! Vui lòng thử lại.");
    }
  }, [dataOrder, shopId, token, setSelectvoucher]);

  const LayToaDo = useCallback(
    async (address: string): Promise<{ lat: number; lon: number } | null> => {
      try {
        const response = await axios.get(
          "https://us1.locationiq.com/v1/search",
          {
            params: {
              key: import.meta.env.VITE_LOCATIONIQ_KEY,
              q: address,
              format: "json",
              limit: 1,
            },
          }
        );

        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          return { lat, lon };
        }
        return null;
      } catch (err) {
        console.error("Lỗi khi gọi LocationIQ:", err);
        return null;
      }
    },
    []
  );

  const LayPhiVanCHuyen = useCallback(
    async (DuLieuDauRa: boolean) => {
      try {
        const data = await axios.post(
          `${UseApiUrl(api_Config.Shop.SapXepDon)}?nana=${DuLieuDauRa}`,
          dataOrder,
          { headers: { "Content-Type": "application/json" } }
        );
        setPhiVanChuyen(data.data.shippingFee);
        setShopId(data.data.storeId);
      } catch {}
    },
    [dataOrder]
  );

  const contextValue = useMemo(
    () => ({
      CartDataAdd,
      setCartDataAdd,
      dataOrder,
      setDataOrder,
      handleClickPayment,
      LayToaDo,
      LayPhiVanCHuyen,
      phiVanChuyen,
      formatPrice
    }),
    [
      CartDataAdd,
      dataOrder,
      handleClickPayment,
      LayToaDo,
      LayPhiVanCHuyen,
      phiVanChuyen,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
