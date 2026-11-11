import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api_Config, UseApiUrl } from "../../services/api";
import { api_Response } from "../../services/http";
import type { order } from "../../types/type";
import { Navbar } from "../HomeLayoutComponent/Navbar";
import RightSiteMap from "./RightSiteMap";
import Sidebar from "./SideBar";

export const MainPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<order>();

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const res = await api_Response<order>(
          `${UseApiUrl(api_Config.Shop.LayDonHangTheoID)}?id=${id}`,
          "GET"
        );
        setData(res);
      } catch {
        setData(undefined);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <div className="min-h-screen bg-[var(--color-bone)] text-[var(--color-ink)] flex flex-col">
      <Navbar />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 relative">
        <div className="lg:col-span-8 min-h-[60vh] lg:min-h-[calc(100vh-4rem)] border-b-2 lg:border-b-0 lg:border-r-2 border-[var(--color-ink)]">
          <RightSiteMap data={data as never} id={id} />
        </div>
        <div className="lg:col-span-4 bg-[var(--color-paper)]">
          <Sidebar data={data as never} />
        </div>
      </main>
    </div>
  );
};
