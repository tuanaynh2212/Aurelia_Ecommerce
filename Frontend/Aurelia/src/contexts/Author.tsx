import axios, { AxiosError } from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useLocation } from "react-router-dom";
import { api_Config, UseApiUrl } from "../services/api";
import { api_Response } from "../services/http";
import { LogginWithFireBase } from "../services/auth.service";
import type { Cart } from "../types/type";
import { Toaster } from "../Components/Toaster";
import { CartContext } from "./CartContext";

export interface AuthUserData {
  id?: string;
  name?: string;
  email?: string;
  soDt?: string;
  diaChi?: string;
  avatar?: string;
  point?: number;
  tier?: string;
  gioHangCuaBan?: Cart[];
  passWord?: string;
  [key: string]: unknown;
}

type AuthContextType = {
  isSignned: boolean;
  errorMessage: string;
  userData: AuthUserData | null;
  setIsignned: React.Dispatch<SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<SetStateAction<string>>;
  logIn: (Email: string, Password: string) => Promise<void>;
  logOut: ({ typeAccount }: { typeAccount: string }) => Promise<void>;
  register: (
    UserName: string,
    Email: string,
    Password: string
  ) => Promise<void>;
  UpdateProfile: (
    name: string,
    email: string,
    phone: string,
    address: string,
    avatar: string
  ) => Promise<void>;
  fetchData: () => Promise<void>;
  logInWIthGoogle: () => Promise<void>;
  tab: string;
  setTab: React.Dispatch<SetStateAction<string>>;
};

const JSON_HEADERS = { "Content-Type": "application/json" } as const;

function getAccountType(pathname: string): "client" | "shop" | "admin" {
  if (pathname.startsWith("/DashBoardShop")) return "shop";
  if (pathname.startsWith("/Admin")) return "admin";
  return "client";
}

function getErrorMessage(error: unknown, fallback: string): string {
  const axiosErr = error as AxiosError<{ message?: string }>;
  return axiosErr.response?.data?.message || fallback;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({
  isSignned: false,
  errorMessage: "",
  userData: null,
  setErrorMessage: () => {},
  setIsignned: () => {},
  logIn: async () => {},
  register: async () => {},
  UpdateProfile: async () => {},
  fetchData: async () => {},
  logOut: async () => {},
  logInWIthGoogle: async () => {},
  tab: "login",
  setTab: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tab, setTab] = useState<string>("login");
  const [isSignned, setIsignned] = useState(false);
  const [doneWork, setDoneWork] = useState(false);
  const { CartDataAdd } = useContext(CartContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState<AuthUserData | null>(null);
  const location = useLocation();

  const fetchData = useCallback(async () => {
    const type = getAccountType(location.pathname);

    try {
      const data = await api_Response<AuthUserData>(
        `${UseApiUrl(api_Config.authentication.getInfoUser)}?typeAccount=${type}`,
        "GET"
      );

      setIsignned(true);
      setUserData(data);
      const safeUser = { ...data };
      delete safeUser.passWord;
      if (type === "client") {
        localStorage.setItem("userData", JSON.stringify(safeUser));
      } else if (type === "shop") {
        localStorage.setItem("shopData", JSON.stringify(safeUser));
      }
    } catch {
      setIsignned(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const load = async () => {
      await fetchData();
      setDoneWork(false);
    };
    void load();
  }, [location.pathname, doneWork, isSignned, fetchData]);

  const logIn = useCallback(
    async (Email: string, Password: string) => {
      try {
        await api_Response(
          UseApiUrl(api_Config.authentication.login),
          "POST",
          { Email, Password },
          JSON_HEADERS
        );
        setIsignned(true);
        Toaster.success("Đăng nhập thành công!");
        await api_Response(
          UseApiUrl(api_Config.User.AutoAddGioHang),
          "POST",
          CartDataAdd,
          JSON_HEADERS
        );
        setDoneWork(true);
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Đã xảy ra lỗi."));
      }
    },
    [CartDataAdd]
  );

  const register = useCallback(
    async (UserName: string, Email: string, Password: string) => {
      try {
        await api_Response(
          UseApiUrl(api_Config.authentication.signUp),
          "POST",
          { UserName, Email, Password },
          JSON_HEADERS
        );
        setIsignned(true);
        Toaster.success("Đăng ký thành công! Chào mừng bạn đến với Aurelia!");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          setErrorMessage(error.response.data?.message || "");
        }
      }
    },
    []
  );

  const logInWIthGoogle = useCallback(async () => {
    try {
      await LogginWithFireBase();
      await fetchData();
      setIsignned(true);
      Toaster.success("Đăng nhập Google thành công!");
    } catch {
      Toaster.error("Đăng nhập Google thất bại.");
    }
  }, [fetchData]);

  const UpdateProfile = useCallback(
    async (
      name: string,
      email: string,
      phone: string,
      address: string,
      avatar: string
    ) => {
      try {
        const res = await api_Response<{ user?: AuthUserData } & AuthUserData>(
          UseApiUrl(api_Config.User.updateprofile),
          "POST",
          { name, email, phone, address, avatar },
          JSON_HEADERS
        );
        setUserData(res?.user ?? res);
        Toaster.success("Đã cập nhật thông tin cá nhân thành công!");
      } catch {
        Toaster.error("Không thể cập nhật thông tin. Vui lòng thử lại.");
      }
    },
    []
  );

  const logOut = useCallback(
    async ({ typeAccount }: { typeAccount: string }) => {
      try {
        await api_Response(
          UseApiUrl(
            `${api_Config.authentication.Logout}?typeAccount=${typeAccount}`
          ),
          "DELETE"
        );
        setIsignned(false);
        setUserData(null);
        Toaster.success("Đăng xuất thành công!");
      } catch {
        Toaster.error("Đăng xuất thất bại. Vui lòng thử lại.");
      }
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      logInWIthGoogle,
      isSignned,
      setIsignned,
      logIn,
      register,
      UpdateProfile,
      errorMessage,
      setErrorMessage,
      fetchData,
      userData,
      logOut,
      tab,
      setTab,
    }),
    [
      logInWIthGoogle,
      isSignned,
      logIn,
      register,
      UpdateProfile,
      errorMessage,
      fetchData,
      userData,
      logOut,
      tab,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
