import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { type order, type Cart } from "../types/type";
import { Toaster } from "../Components/Toaster";
import { api_Config, UseApiUrl } from "../services/api";
import { api_Response } from "../services/http";
import { formatVND } from "../utils/formatters";
import { AdminContext } from "./AdminContext";
import { AuthContext } from "./Author";

type CartContexts = {
  CartDataAdd: Cart[];
  dataOrder: order | undefined;
  handleClickPayment: () => Promise<void>;
  setDataOrder: React.Dispatch<React.SetStateAction<order | undefined>>;
  setCartDataAdd: React.Dispatch<React.SetStateAction<Cart[]>>;
  LayToaDo: (address: string) => Promise<{ lat: number; lon: number } | null>;
  phiVanChuyen: string;
  distance?: number | string;
  LayPhiVanCHuyen: (DuLieuDauRa: boolean) => Promise<void>;
  formatPrice?: (num: number) => string;
};

const JSON_HEADERS = { "Content-Type": "application/json" } as const;

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext<CartContexts>({
  CartDataAdd: [],
  dataOrder: undefined,
  handleClickPayment: async () => {},
  LayToaDo: async () => null,
  setDataOrder: () => {},
  setCartDataAdd: () => {},
  phiVanChuyen: "",
  distance: undefined,
  LayPhiVanCHuyen: async () => {},
  formatPrice: formatVND,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { userData } = useContext(AuthContext);
  const { setSelectvoucher } = useContext(AdminContext);
  const [CartDataAdd, setCartDataAdd] = useState<Cart[]>(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : userData?.gioHangCuaBan || [];
    } catch {
      return userData?.gioHangCuaBan || [];
    }
  });
  const [dataOrder, setDataOrder] = useState<order | undefined>();
  const [phiVanChuyen, setPhiVanChuyen] = useState("");
  const [distance, setDistance] = useState<number | string | undefined>();
  const [shopId, setShopId] = useState<string>("");

  const handleClickPayment = useCallback(async () => {
    if (!dataOrder || shopId === "") return;

    try {
      setSelectvoucher([]);
      await api_Response(
        `${UseApiUrl(api_Config.User.SuccessPayAddOrder)}?shopId=${shopId}`,
        "POST",
        dataOrder,
        JSON_HEADERS
      );
      await Promise.all([
        api_Response(
          UseApiUrl(api_Config.Product.UpdateQuantityProduct),
          "PUT",
          dataOrder.product.map((item) => ({
            productId: item.itemid,
            quantity: item.quantity,
          }))
        ),
        api_Response(UseApiUrl(api_Config.User.UpdateTier), "POST", {}, JSON_HEADERS),
        api_Response(UseApiUrl(api_Config.User.XoaGioHang), "DELETE", {}, {}),
      ]);
      localStorage.removeItem("cartItems");
      setCartDataAdd([]);
      Toaster.success("Thanh toán thành công! Đơn hàng đã được tạo.");
    } catch {
      Toaster.error("Thanh toán không thành công! Vui lòng thử lại.");
    }
  }, [dataOrder, shopId, setSelectvoucher]);

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
      } catch {
        return null;
      }
    },
    []
  );

  const LayPhiVanCHuyen = useCallback(
    async (DuLieuDauRa: boolean) => {
      try {
        const data = await api_Response<{
          shippingFee: string;
          storeId: string;
          distance?: number | string;
        }>(
          `${UseApiUrl(api_Config.Shop.SapXepDon)}?nana=${DuLieuDauRa}`,
          "POST",
          dataOrder,
          JSON_HEADERS
        );
        setPhiVanChuyen(data.shippingFee);
        setShopId(data.storeId);
        setDistance(data.distance);
      } catch {
        // Ignore transient shipping quote failures while typing address
      }
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
      distance,
      formatPrice: formatVND,
    }),
    [
      CartDataAdd,
      dataOrder,
      handleClickPayment,
      LayToaDo,
      LayPhiVanCHuyen,
      phiVanChuyen,
      distance,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
