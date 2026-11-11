import { useContext } from "react";
import { AuthContext } from "../../contexts/Author";
import { DashBoard } from "../../Components/AccountComponents/User/DashBoard";
import { FormAuthor } from "../../Components/FormAuthorForUser";
import { Footer } from "../../Components/HomeLayoutComponent/Footer";
import { DynamicMetaTags } from "../../Components/SEO/DynamicMetaTags";

export const Account = () => {
  const { isSignned } = useContext(AuthContext);

  return (
    <>
      <DynamicMetaTags
        title="Tài Khoản & Hồ Sơ Khách Hàng | Aurelia Atelier"
        description="Quản lý hồ sơ may đo cá nhân, lịch sử đơn hàng, số đo bespoke và đặc quyền hội viên tại Aurelia Atelier."
        url={window.location.href}
      />
      {isSignned ? <DashBoard /> : <FormAuthor />}
      <Footer />
    </>
  );
};
