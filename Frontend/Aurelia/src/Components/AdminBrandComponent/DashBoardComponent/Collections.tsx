import { useContext, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  Star,
  Shirt,
  ArrowRight,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { CollectionContext } from "../../../contexts/SeasonContext";
import { useNavigate } from "react-router-dom";
import AddCollectionForm from "./CollectionComponent/AddCollectionForm";

export default function Collections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeAddCollection, setActiveAddCollection] = useState(false);
  const [status, setStatus] = useState<string>("Add");
  const [dataEdit, setDataEdit] = useState<any>(null);

  const { collectionData, statCollection, handleDeleteCollection } =
    useContext(CollectionContext);

  const navigate = useNavigate();

  const filteredCollections = collectionData?.filter(
    (collection) =>
      collection.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleclick = (id: string) => navigate(`/Collection/${id}`);

  return (
    <div className="h-[110vh] overflow-y-auto  text-[#1d1d1f] p-3 md:p-8 md:w-full   relative">

      {activeAddCollection && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center z-50">
          <AddCollectionForm
            status={status}
            season={dataEdit}
            setState={setActiveAddCollection}
          />
        </div>
      )}
      <div className="w-full mx-auto">
        <div className="mb-8    p-6 sm:p-8">

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl sm:text-5xl  serif">
                  Collections
                </h1>
              </div>
              <p className="text-slate-500 text-base">
                Curated and refined in a minimalist silver aesthetic.
              </p>
            </div>

            <button
              onClick={() => setActiveAddCollection(true)}
              className="px-6 py-3 bg-black text-white  font-semibold hover:bg-slate-700 transition"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New
              </div>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Collections",
                value: statCollection?.totalCollection || 0,
                icon: Package,
              },
              {
                label: "Products",
                value: statCollection?.totalProduct || 0,
                icon: Shirt,
              },
              {
                label: "Rating",
                value: statCollection?.totalRating || 0,
                icon: Star,
              },
              {
                label: "Views",
                value: statCollection?.totalViews || 0,
                icon: Eye,
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white/70 shadow rounded-xl border border-slate-200 p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex justify-center items-center">
                    <s.icon className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{s.value}</h3>
                <p className="text-slate-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 bg-white/70 backdrop-blur border border-slate-200 shadow rounded-xl p-4">
          <div className="flex items-center gap-3 flex-wrap">

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-500 outline-none"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
              <Filter className="w-5 h-5 text-slate-700" />
            </button>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-slate-800 text-white"
                    : "hover:bg-slate-200"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-lg ${
                  viewMode === "list"
                    ? "bg-slate-800 text-white"
                    : "hover:bg-slate-200"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filteredCollections?.map((collection) => (
            <div
              key={collection.id}
              className="group relative bg-white/80 shadow border border-slate-200  overflow-hidden hover:shadow-xl transition"
            >
              <div className="h-64 sm:h-72 relative">
                <img
                  src={collection.banner}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => {
                      setStatus("edit");
                      setDataEdit(collection);
                      setActiveAddCollection(true);
                    }}
                    className="p-2 bg-white shadow rounded-lg hover:bg-slate-100"
                  >
                    <Edit className="w-4 h-4 text-slate-700" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this collection?"
                        )
                      )
                        handleDeleteCollection(collection.id);
                    }}
                    className="p-2 bg-white shadow rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  {collection.name}
                </span>
                <h3 className="text-xl font-bold mt-1 mb-2">
                  {collection.slogan || collection.name}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                  {collection.description}
                </p>

                <button
                  onClick={() => handleclick(collection.id)}
                  className="w-full py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 flex items-center justify-center gap-2"
                >
                  Explore <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <div
            className="h-[350px] bg-white/70 border border-slate-300 rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:bg-slate-100 transition"
            onClick={() => setActiveAddCollection(true)}
          >
            <div className="w-16 h-16 bg-slate-800 text-white rounded-2xl flex justify-center items-center">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-700">
              Create New
            </h3>
            <p className="text-slate-500 text-sm">Start a new collection</p>
          </div>
        </div>
      </div>
    </div>
  );
}
