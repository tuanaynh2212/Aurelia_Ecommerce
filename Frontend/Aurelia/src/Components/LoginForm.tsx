import React, { useContext, useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, LogIn, UserPlus } from "lucide-react";
import { InputGroup } from "./InputGroup";
import { AuthContext } from "../contexts/Author";
import { AuthForShopContext } from "../contexts/AuthorForShop";
import { AuthorForAdminContext } from "../contexts/AuthorForAdmin";
import RoleToggle from "./RoleToggle";

export const LoginForm = ({ type }: { type: string }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const {
    tab,
    setTab,
    logInWIthGoogle,
    logIn,
    register,
    errorMessage: clientError,
    setErrorMessage: setClientError,
  } = useContext(AuthContext);

  const { logIn: loginforShop, errorMessage: shopError } =
    useContext(AuthForShopContext);

  const {
    Login,
    errorMessages: adminError,
    setErrorMessage: setAdminError,
  } = useContext(AuthorForAdminContext);

  // Ensure `tab` is always valid for the active portal ("client" vs "ADMIN")
  useEffect(() => {
    if (type === "ADMIN") {
      if (tab !== "ADMIN" && tab !== "MANAGER") {
        setTab("MANAGER");
      }
    } else if (type === "client") {
      if (tab !== "login" && tab !== "register") {
        setTab("login");
      }
    }
  }, [type, tab, setTab]);

  const activeError =
    type === "client"
      ? clientError
      : tab === "ADMIN"
        ? adminError
        : shopError || adminError;

  const clearErrors = () => {
    if (clientError) setClientError("");
    if (adminError) setAdminError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();

    switch (type) {
      case "client":
        setIsLoading(true);
        try {
          if (tab === "register") {
            await register(
              formData.userName.trim(),
              formData.email.trim(),
              formData.password,
            );
          } else {
            await logIn(formData.email.trim(), formData.password);
          }
        } finally {
          setIsLoading(false);
        }
        break;

      case "ADMIN":
        setIsLoading(true);
        try {
          if (tab === "ADMIN") {
            await Login(formData.email.trim(), formData.password);
          } else {
            await loginforShop(formData.email.trim(), formData.password);
          }
        } finally {
          setIsLoading(false);
        }
        break;

      default:
        break;
    }
  };

  const isRegister = type === "client" && tab === "register";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Mode Switcher: RoleToggle for Staff/Admin, Login/Register tabs for Client */}
      {type === "ADMIN" ? (
        <RoleToggle />
      ) : (
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-bone border-2 border-ink">
          <button
            type="button"
            onClick={() => {
              clearErrors();
              setTab("login");
            }}
            className={`min-h-[42px] flex items-center justify-center gap-2 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider border-2 transition-all cursor-pointer ${
              !isRegister
                ? "bg-ink text-paper border-ink shadow-hard-sm"
                : "bg-paper text-ink border-transparent hover:border-ink hover:bg-volt"
            }`}
          >
            <LogIn size={14} className={!isRegister ? "text-volt" : "text-ink"} />
            <span>Đăng Nhập</span>
          </button>

          <button
            type="button"
            onClick={() => {
              clearErrors();
              setTab("register");
            }}
            className={`min-h-[42px] flex items-center justify-center gap-2 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider border-2 transition-all cursor-pointer ${
              isRegister
                ? "bg-ink text-paper border-ink shadow-hard-sm"
                : "bg-paper text-ink border-transparent hover:border-ink hover:bg-volt"
            }`}
          >
            <UserPlus
              size={14}
              className={isRegister ? "text-volt" : "text-ink"}
            />
            <span>Đăng Ký</span>
          </button>
        </div>
      )}

      {/* Error Alert Banner */}
      {activeError && (
        <div
          role="alert"
          className="flex items-start gap-3 p-3.5 bg-paper border-2 border-danger text-danger shadow-hard-flash"
        >
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider block">
              [AUTH ERROR // XÁC THỰC THẤT BẠI]
            </span>
            <p className="font-sans text-xs font-semibold text-ink mt-0.5">
              {activeError}
            </p>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        {isRegister && (
          <InputGroup
            id="username"
            type="text"
            label="Họ tên / Tên hiển thị"
            value={formData.userName}
            onChange={(e) =>
              setFormData({ ...formData, userName: e.target.value })
            }
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            required
          />
        )}

        <InputGroup
          id="email"
          type="email"
          label="Địa chỉ Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder={
            type === "ADMIN" ? "staff@aurelia.com" : "client@aurelia.com"
          }
          autoComplete="email"
          required
        />

        <InputGroup
          id="password"
          type="password"
          label="Mật khẩu"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="••••••••"
          autoComplete={isRegister ? "new-password" : "current-password"}
          required
          actionLink={
            !isRegister
              ? {
                  text: "Quên mật khẩu?",
                  href: "/Forgot-PassWord",
                }
              : undefined
          }
        />
      </div>

      {/* Primary Action & OAuth Controls */}
      <div className="pt-2 space-y-3">
        <button
          type="submit"
          disabled={isLoading}
          className="press-collapse w-full min-h-[48px] bg-flash text-paper border-2 border-ink shadow-hard py-3 px-5 font-mono text-xs font-bold tracking-widest uppercase hover:bg-ink disabled:opacity-60 transition-colors flex justify-center items-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <span className="animate-pulse">Đang xác thực...</span>
          ) : isRegister ? (
            <>
              <span>Tạo Tài Khoản Hội Viên</span>
              <ArrowRight size={15} />
            </>
          ) : (
            <>
              <span>
                {type === "ADMIN"
                  ? `Đăng Nhập ${tab === "ADMIN" ? "Admin" : "Cửa Hàng"}`
                  : "Đăng Nhập // Sign In"}
              </span>
              <ArrowRight size={15} />
            </>
          )}
        </button>

        {type === "client" && (
          <>
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-dashed border-ink" />
              <span className="shrink-0 mx-3 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                HOẶC TIẾP TỤC VỚI
              </span>
              <div className="flex-grow border-t border-dashed border-ink" />
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={logInWIthGoogle}
              className="press-collapse w-full min-h-[48px] bg-paper text-ink border-2 border-ink shadow-hard-sm py-3 px-5 font-mono text-xs font-bold tracking-wider uppercase hover:bg-volt disabled:opacity-60 transition-colors flex justify-center items-center gap-3 cursor-pointer"
            >
              <span className="w-5 h-5 bg-ink text-paper font-mono text-xs font-black flex items-center justify-center">
                G
              </span>
              <span>
                {isLoading
                  ? "Đang kết nối..."
                  : "Đăng nhập nhanh với Google"}
              </span>
            </button>
          </>
        )}
      </div>
    </form>
  );
};
