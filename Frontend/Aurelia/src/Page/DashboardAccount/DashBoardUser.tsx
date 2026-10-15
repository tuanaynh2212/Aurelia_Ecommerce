
import { useContext } from "react";
import { AuthContext } from "../../contexts/Author";
import { DashBoard } from "../../Components/AccountComponents/User/DashBoard";
import { FormAuthor } from "../../Components/FormAuthorForUser";
import { Footer } from "../../Components/HomeLayoutComponent/Footer";




export const Account = () => {

const {isSignned}=useContext(AuthContext)
  return (
    <>
       {isSignned?
       <DashBoard/>
      :
      <FormAuthor/>
      }
      <div className="mt-40">
      <Footer />
      </div>

    </>
  );
};
