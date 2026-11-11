import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../contexts/NotifycationContext";
import { AuthContext } from "../../contexts/Author";

export const PopupSetting = () => {
  const { logOutShop } = useContext(NotificationContext);
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOutShop();
    logOut({ typeAccount: "shop" });
    localStorage.removeItem("shop");
    navigate("/login");
  };

  return (
    <div className="absolute bottom-20 left-4 z-50 bg-[var(--color-paper)] text-[var(--color-ink)] p-3 border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] w-48 flex flex-col gap-2">
      <div className="mono-label px-3 py-2 bg-[var(--color-bone)] border border-[var(--color-ink)] text-center">
        Setting
      </div>
      <button
        className="min-h-[40px] bg-[var(--color-danger)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] px-4 py-2 mono-label font-extrabold cursor-pointer"
        onClick={handleLogOut}
      >
        Log out
      </button>
    </div>
  );
};
