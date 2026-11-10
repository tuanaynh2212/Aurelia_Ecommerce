import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, ImagePlus, Edit2, Type, Palette } from "lucide-react";
import { AdminContext } from "../../../../contexts/AdminContext";
import { AddBanner } from "./AddBanner";
import { LayoutPreview } from "./LayoutPreview";

export const BannerSetting = () => {
  const { MainBanner, StoryBanner, handleClick } = useContext(AdminContext);
  const [statusState, setStatusState] = useState<"Main" | "Story">("Main");
  const [selected, setSelected] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [popupAddBanner, setPopupAddBanner] = useState(false);
  const [, setBannerState] = useState<any>();

  const [localMainBanner, setLocalMainBanner] = useState(MainBanner);
  const [localStoryBanner, setLocalStoryBanner] = useState(StoryBanner);

  const banners = statusState === "Main" ? localMainBanner : localStoryBanner;
  const current = banners?.[selected];

  const ListStyle = useMemo(
    () => (statusState === "Main" ? ["A", "B", "C", "D"] : ["A", "B", "C", "D"]),
    [statusState]
  );

  const updateBannerField = useCallback(
    (field: string, value: any) => {
      const updater = (prev: any[]) =>
        prev.map((b, i) => (i === selected ? { ...b, [field]: value } : b));

      statusState === "Main"
        ? setLocalMainBanner(updater)
        : setLocalStoryBanner(updater);
    },
    [selected, statusState]
  );

  const SaveChangeValue = () => {
    handleClick(statusState, current);
  };
  const uploadImage = async (fileList: File[]) => {
    try {
      const apiKey = "0d1c3d8a0af15e271bc8154578e71620";
      const formData = new FormData();
      fileList.forEach((f) => formData.append("image", f));

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.success) throw new Error("Upload failed");

      return data.data.image.url;
    } catch (err) {
      console.error(err);
      return "";
    }
  };

  useEffect(() => {
    if (!file) return;
    uploadImage([file]).then((url) => {
      if (url) updateBannerField("linkUrl", url);
    });
  }, [file]);

  if (!current)
    return (
      <div className="text-center py-20 text-gray-500">
        Không có banner nào.
      </div>
    );

  return (
    <div className=" p-3 md:p-8 w-[300px] md:w-full space-y-8 overflow-y-auto max-h-screen">
      {popupAddBanner && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 w-full h-full">
          <AddBanner
            SetBanner={setBannerState}
            setPopupAddBanner={setPopupAddBanner}
          />
        </div>
      )}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-5xl serif   text-gray-800">
          Quản lý Banner
        </h1>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusState("Main")}
            className={`px-4 py-2  font-medium transition ${
              statusState === "Main"
                ? "bg-black text-white"
                : "bg-white border text-gray-700"
            }`}
          >
            Main Banner
          </button>

          <button
            onClick={() => setStatusState("Story")}
            className={`px-4 py-2  font-medium transition ${
              statusState === "Story"
                ? "bg-black text-white"
                : "bg-white border text-gray-700"
            }`}
          >
            Story Banner
          </button>

          <button
            onClick={() => setPopupAddBanner(true)}
            className="flex items-center gap-2 bg-red-400 text-white px-4 py-2 shadow hover:opacity-90"
          >
            <Plus size={18} /> Thêm Banner
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-6 md:gap-8">

        <div className="w-full md:w-[70%] flex flex-col gap-7 pr-0 md:pr-4">

          <LayoutPreview
            current={current}
            setFile={setFile}
            selected={selected}
            statusState={statusState}
            setLocalMainBanner={setLocalMainBanner}
            setLocalStoryBanner={setLocalStoryBanner}
            banners={banners}
            setSelected={setSelected}
          />

          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Danh sách Banner
            </h3>

            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
              {banners.map((b: any, i: number) => (
                <motion.div
                  key={b.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setSelected(i)}
                  className={`relative min-w-[180px] snap-start rounded-2xl cursor-pointer overflow-hidden shadow-md transition ${
                    i === selected
                      ? "ring-2 ring-blue-400"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={b.linkUrl}
                    alt={b.mainTitle}
                    className="w-full h-28 object-cover"
                  />

                  <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-sm px-3 py-1 truncate">
                    {b.mainTitle}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-[30%] bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-xl space-y-6 h-fit md:sticky md:top-8">

          <h3 className="text-xl font-semibold text-gray-800">
            Chỉnh sửa Banner
          </h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              Ảnh chính
            </label>

            <div className="border-dashed border-2 border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 cursor-pointer bg-white/50 transition relative">
              <ImagePlus className="mx-auto text-gray-400 mb-2" size={28} />

              <p className="text-sm text-gray-500">Kéo thả hoặc chọn ảnh mới</p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
              />
            </div>
          </div>
          <div>
            {ListStyle.map((style, idx) => (
              <button
                key={idx}
                onClick={() => updateBannerField("layout", style)}
                className="mr-2 mb-2 px-4 py-2  border text-gray-700 hover:bg-gray-100 transition"
              >
                Layout {style}
              </button>
            ))}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Type size={16} /> Tiêu đề chính
            </label>

            <input
              value={current.mainTitle}
              onChange={(e) => updateBannerField("mainTitle", e.target.value)}
              className="w-full mt-1 bg-white/60 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Edit2 size={16} /> Tiêu đề phụ 1
            </label>
            <input
              value={current.h1 || ""}
              onChange={(e) => updateBannerField("h1", e.target.value)}
              className="w-full mt-1 bg-white/60 border border-gray-200 rounded-xl px-4 py-2"
            />
          </div>

          {statusState === "Story" && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Edit2 size={16} /> Tiêu đề phụ 2
              </label>
              <input
                value={current.h2 || ""}
                onChange={(e) => updateBannerField("h2", e.target.value)}
                className="w-full mt-1 bg-white/60 border border-gray-200 rounded-xl px-4 py-2"
              />
            </div>
          )}

          {statusState === "Main" && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Edit2 size={16} /> Chữ Trên Nút
              </label>
              <input
                value={current.textInButton || ""}
                onChange={(e) =>
                  updateBannerField("textInButton", e.target.value)
                }
                className="w-full mt-1 bg-white/60 border border-gray-200 rounded-xl px-4 py-2"
              />
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Edit2 size={16} /> Slogan / Thông điệp
            </label>

            <textarea
              value={current.paragraph || ""}
              onChange={(e) => updateBannerField("paragraph", e.target.value)}
              className="w-full mt-1 bg-white/60 border border-gray-200 rounded-xl px-4 py-2 h-24 resize-none"
            />
          </div>

          <div className="flex flex-row gap-5 items-center justify-around">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Palette size={16} /> Màu chữ tiêu đề
              </label>

              <input
                type="color"
                value={current.colorMainTitle}
                onChange={(e) =>
                  updateBannerField("colorMainTitle", e.target.value)
                }
                className="w-16 h-8 rounded-lg border cursor-pointer"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Palette size={16} /> Màu chữ phụ
              </label>

              <input
                type="color"
                value={current.colorText}
                onChange={(e) =>
                  updateBannerField("colorText", e.target.value)
                }
                className="w-16 h-8 rounded-lg border cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="flex flex-col gap-2 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <h1>Trạng Thái:</h1>
                {current.active ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 ">
                    Hoạt động
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-3 py-1">
                    Ngừng hoạt động
                  </span>
                )}
              </div>

              <motion.button
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateBannerField("active", !current.active)}
                className={`px-2 py-1 rounded font-medium cursor-pointer ${
                  current.active
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {current.active ? "Ngừng hoạt động" : "Kích hoạt"}
              </motion.button>
            </label>
          </div>
          <button
            onClick={SaveChangeValue}
            className="w-full bg-black text-white font-semibold py-2.5 hover:opacity-90 transition"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};
