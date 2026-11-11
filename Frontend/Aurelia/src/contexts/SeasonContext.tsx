import axios from "axios";
import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { api_Config, UseApiUrl } from "../services/api";
import { Toaster } from "../Components/Toaster";
import type { Product, Season } from "../types/type";

export interface SeasonCollectionEntry {
  season?: Season;
  products?: Product[];
}

export interface CollectionStats {
  totalCollection?: number;
  totalProduct?: number;
  totalRating?: number;
  totalViews?: number;
}

type CollectionPayload = Omit<Season, "id" | "products"> & {
  id?: string;
  products?: Season["products"] | string[];
};

type CollectionContextType = {
  seasonCollections: SeasonCollectionEntry[] | undefined;
  collectionData: Season[];
  statCollection?: CollectionStats;
  handleAddCollection: (newCollection: CollectionPayload) => Promise<void>;
  fetchData: (id: string) => Promise<void>;
  handleUpdateCollection: (updatedCollection: CollectionPayload) => Promise<void>;
  handleDeleteCollection: (id: string) => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const CollectionContext = createContext<CollectionContextType>({
  seasonCollections: [],
  collectionData: [],
  statCollection: undefined,
  handleAddCollection: async () => {},
  fetchData: async () => {},
  handleUpdateCollection: async () => {},
  handleDeleteCollection: async () => {},
});

export const CollectionProvider = ({ children }: { children: ReactNode }) => {
  const [seasonCollections, setSeasonCollections] = useState<SeasonCollectionEntry[]>();
  const [collectionData, setCollectionData] = useState<Season[]>([]);
  const [statCollection, setStatCollection] = useState<CollectionStats>();
  const [update, setUpdate] = useState(false);

  const handleAddCollection = async (newCollection: CollectionPayload) => {
    try {
      await axios.post(UseApiUrl(api_Config.Collection.AddCollection), newCollection, {
        headers: { "Content-Type": "application/json" },
      });
      setUpdate((prev) => !prev);
      Toaster.success("Đã thêm collection thành công!");
    } catch (error) {
      console.error("Error adding new collection:", error);
      Toaster.error("Không thể thêm collection. Vui lòng thử lại.");
    }
  };

  const handleUpdateCollection = async (updatedCollection: CollectionPayload) => {
    try {
      await axios.put(UseApiUrl(api_Config.Collection.UpdateCollection), updatedCollection, {
        headers: { "Content-Type": "application/json" },
      });
      setUpdate((prev) => !prev);
      Toaster.success("Đã cập nhật collection thành công!");
    } catch (error) {
      console.error("Error updating collection:", error);
      Toaster.error("Không thể cập nhật collection. Vui lòng thử lại.");
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      await axios.delete(`${UseApiUrl(api_Config.Collection.DeleteCollection)}?collectionId=${id}`);
      setUpdate((prev) => !prev);
      Toaster.success("Đã xóa collection thành công!");
    } catch (error) {
      console.error("Error deleting collection:", error);
      Toaster.error("Không thể xóa collection. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    Promise.all([
      axios.get(UseApiUrl(api_Config.Collection.getallcollections)),
      axios.get(UseApiUrl(api_Config.Collection.GetStat)),
    ])
      .then(([collectionsResponse, statResponse]) => {
        setCollectionData(collectionsResponse.data);
        setStatCollection(statResponse.data);
      })
      .catch((error) => {
        console.error("Error fetching collection data:", error);
      });
  }, [update]);

  const fetchData = useCallback(async (id: string) => {
    try {
      const response = await axios.get(
        `${UseApiUrl(api_Config.Collection.getCollectionsById)}?id=${id}`
      );
      setSeasonCollections(response.data.seasonCollectionsWithProducts);
    } catch (error) {
      console.error("Error fetching season collections:", error);
    }
  }, []);

  return (
    <CollectionContext.Provider
      value={{
        seasonCollections,
        fetchData,
        collectionData,
        statCollection,
        handleAddCollection,
        handleUpdateCollection,
        handleDeleteCollection,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};
