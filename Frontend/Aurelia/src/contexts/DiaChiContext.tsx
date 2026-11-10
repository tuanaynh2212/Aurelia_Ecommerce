import React, { createContext, useContext, useEffect, useState } from "react";
import { api_Config, UseApiUrl } from "../services/api";
import { Toaster } from "../Components/Toaster";
import type { DiaChi } from "../types/type";
import { AuthContext } from "./Author";
import { api_Response } from "../services/http";

interface DiaChiContextType {
  savedAddress: DiaChi[];
  fetchDiaChi: () => void;
  SaveDiaChi: (data: Partial<DiaChi>) => Promise<void>;
  XoaDiaChi: (data: DiaChi) => Promise<void>;
}

export const DiaChiContext = createContext<DiaChiContextType>({
  savedAddress: [],
  fetchDiaChi: async () => {},
  SaveDiaChi: async () => {},
  XoaDiaChi: async () => {},
});

export const DiaChiProvider = ({ children }: { children: React.ReactNode }) => {
  const { userData } = useContext(AuthContext);
  const [savedAddress, setSaveAddress] = useState<DiaChi[]>([]);

  const fetchDiaChi = async () => {
    if (!userData) return;
    try {
      const response: any = api_Response(
        UseApiUrl(api_Config.User.LayDiaChi),
        "GET",
        undefined,
        {
          withCredentials: true,
        }
      );
      setSaveAddress(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDiaChi();
  }, []);

  const SaveDiaChi = async (data: Partial<DiaChi>) => {
    if (!userData) return;
    try {
      api_Response(UseApiUrl(api_Config.User.LuuDiaChi), "POST", data, {
        withCredentials: true,
        "Content-Type": "application/json",
      });

      fetchDiaChi();
      Toaster.success("Đã lưu địa chỉ thành công!");
    } catch (error) {
      Toaster.error("Không thể lưu địa chỉ. Vui lòng thử lại.");
      console.error(error);
    }
  };

  const XoaDiaChi = async (data: DiaChi) => {
    if (!userData) return;
    try {
      api_Response(UseApiUrl(api_Config.User.XoaDiaChi), "POST", data, {
        withCredentials: true,
        "Content-Type": "application/json",
      });

      fetchDiaChi();
      Toaster.success("Đã xóa địa chỉ thành công!");
    } catch (error) {
      Toaster.error("Không thể xóa địa chỉ. Vui lòng thử lại.");
      console.error(error);
    }
  };

  return (
    <DiaChiContext.Provider
      value={{ savedAddress, fetchDiaChi, SaveDiaChi, XoaDiaChi }}
    >
      {children}
    </DiaChiContext.Provider>
  );
};
