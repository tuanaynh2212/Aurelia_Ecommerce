import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  ImagePlus,
  Edit2,
  Type,
  Palette,
  RotateCcw,
  Save,
  Loader2,
  Link as LinkIcon,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  AdminContext,
  type AdminBannerRecord,
} from "../../../../contexts/AdminContext";
import { AddBanner } from "./AddBanner";
import { LayoutPreview } from "./LayoutPreview";
import { ADMIN_COLOR_SWATCHES, uploadImageToImgbb } from "../adminUpload";
import { Toaster } from "../../../Toaster";

const LAYOUT_OPTIONS = [
  { id: "A", title: "Layout A", desc: "Chia đôi ngang" },
  { id: "B", title: "Layout B", desc: "Tâm điểm toàn khung" },
  { id: "C", title: "Layout C", desc: "Poster tập trung" },
  { id: "D", title: "Layout D", desc: "Khung tối giản" },
];

type EditorTab = "content" | "media" | "style";

export const BannerSetting = () => {
  const { MainBanner, StoryBanner, handleClick } = useContext(AdminContext);
  const [statusState, setStatusState] = useState<"Main" | "Story">("Main");
  const [selected, setSelected] = useState(0);
  const [activeTab, setActiveTab] = useState<EditorTab>("content");
  const [popupAddBanner, setPopupAddBanner] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [, setBannerState] = useState<unknown>();

  const [localMainBanner, setLocalMainBanner] =
    useState<AdminBannerRecord[]>(MainBanner);
  const [localStoryBanner, setLocalStoryBanner] =
    useState<AdminBannerRecord[]>(StoryBanner);

  useEffect(() => {
    setLocalMainBanner(MainBanner);
  }, [MainBanner]);

  useEffect(() => {
    setLocalStoryBanner(StoryBanner);
  }, [StoryBanner]);

  const banners = statusState === "Main" ? localMainBanner : localStoryBanner;
  const serverBanners = statusState === "Main" ? MainBanner : StoryBanner;

  const safeSelected =
    banners.length > 0 ? Math.min(selected, banners.length - 1) : 0;
  const current = banners[safeSelected];
  const savedSnapshot = serverBanners[safeSelected];

  const isDirty = useMemo(() => {
    if (!current || !savedSnapshot) return false;
    return JSON.stringify(current) !== JSON.stringify(savedSnapshot);
  }, [current, savedSnapshot]);

  const handleSwitchType = (nextType: "Main" | "Story") => {
    setStatusState(nextType);
    setSelected(0);
  };

  const updateBannerField = useCallback(
    (field: string, value: unknown) => {
      const updater = (prev: AdminBannerRecord[]) =>
        prev.map((b, i) => (i === safeSelected ? { ...b, [field]: value } : b));

      if (statusState === "Main") {
        setLocalMainBanner(updater);
      } else {
        setLocalStoryBanner(updater);
      }
    },
    [safeSelected, statusState]
  );

  const handleResetCurrent = () => {
    if (!savedSnapshot) return;
    const updater = (prev: AdminBannerRecord[]) =>
      prev.map((b, i) => (i === safeSelected ? { ...savedSnapshot } : b));
    if (statusState === "Main") {
      setLocalMainBanner(updater);
    } else {
      setLocalStoryBanner(updater);
    }
    Toaster.info("Đã khôi phục nội dung trước khi chỉnh sửa");
  };

  const handleSave = async () => {
    if (!current) return;
    setIsSaving(true);
    try {
      await handleClick(statusState, current);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadFile = async (selectedFile: File | null) => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const url = await uploadImageToImgbb(selectedFile);
      updateBannerField("linkUrl", url);
      Toaster.success("Đã tải ảnh mới lên!");
    } catch (err) {
      console.error(err);
      Toaster.error("Tải ảnh thất bại, vui lòng thử dán link ảnh trực tiếp.");
    } finally {
      setIsUploading(false);
    }
  };

  const bannerBodyText =
    current?.pagaraph ??
    (current as Record<string, string | undefined> | undefined)?.paragraph ??
    "";

  return (
    <div className="p-4 md:p-8 w-full space-y-6 overflow-y-auto min-h-screen bg-bone">
      {popupAddBanner && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center z-50 w-full h-full p-4">
          <AddBanner
            SetBanner={setBannerState}
            setPopupAddBanner={setPopupAddBanner}
            initialType={statusState === "Main" ? "MainBanner" : "StoryBanner"}
          />
        </div>
      )}

      {/* Header + Type Switcher Always Accessible */}
      <div className="bg-paper border-2 border-ink shadow-hard p-5 md:p-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <span className="mono-label text-[10px] text-flash block mb-1">
            [STAGE GRAPHICS // BANNER STUDIO]
          </span>
          <h1 className="font-display-safe text-2xl md:text-3xl font-black uppercase text-ink">
            Quản lý Banner & Hình ảnh
          </h1>
          <p className="font-mono text-xs text-ink-muted mt-1">
            Chọn vị trí hiển thị, xem trước trực tiếp và chỉnh sửa nhanh chóng.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSwitchType("Main")}
            className={`min-h-[44px] px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-ink transition-colors cursor-pointer ${
              statusState === "Main"
                ? "bg-ink text-paper shadow-hard-sm"
                : "bg-paper text-ink hover:bg-volt"
            }`}
          >
            Main Banner ({localMainBanner.length})
          </button>

          <button
            type="button"
            onClick={() => handleSwitchType("Story")}
            className={`min-h-[44px] px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-ink transition-colors cursor-pointer ${
              statusState === "Story"
                ? "bg-ink text-paper shadow-hard-sm"
                : "bg-paper text-ink hover:bg-volt"
            }`}
          >
            Story Banner ({localStoryBanner.length})
          </button>

          <button
            type="button"
            onClick={() => setPopupAddBanner(true)}
            className="min-h-[44px] flex items-center gap-2 bg-flash text-paper border-2 border-ink shadow-hard-sm px-4 py-2 font-mono text-xs font-bold uppercase hover:bg-ink transition-colors cursor-pointer"
          >
            <Plus size={16} /> Thêm Banner
          </button>
        </div>
      </div>

      {!current ? (
        <div className="bg-paper border-2 border-dashed border-ink p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto bg-volt border-2 border-ink flex items-center justify-center shadow-hard-sm">
            <Sparkles size={24} className="text-ink" />
          </div>
          <div>
            <h2 className="font-display-safe text-xl font-black uppercase text-ink">
              Chưa có {statusState === "Main" ? "Main Banner" : "Story Banner"} nào
            </h2>
            <p className="font-mono text-xs text-ink-muted mt-1">
              Tạo banner đầu tiên để hiển thị trên trang chủ.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPopupAddBanner(true)}
            className="min-h-[44px] inline-flex items-center gap-2 bg-flash text-paper border-2 border-ink shadow-hard-sm px-6 py-2.5 font-mono text-xs font-bold uppercase hover:bg-ink transition-colors cursor-pointer"
          >
            <Plus size={16} /> Tạo Banner Đầu Tiên
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col lg:flex-row gap-6">
          {/* Left: Live Preview + Quick Selector */}
          <div className="w-full lg:w-[64%] flex flex-col gap-6">
            <div className="bg-paper border-2 border-ink shadow-hard overflow-hidden">
              <div className="px-4 py-2.5 bg-ink text-paper border-b-2 border-ink flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 mono-label text-[10px] font-bold">
                  <span className="bg-volt text-ink px-1.5 py-0.5 font-extrabold">
                    LIVE PREVIEW
                  </span>
                  <span>
                    {statusState === "Main" ? "HERO" : "STORY"} #{safeSelected + 1} · Layout{" "}
                    {current.layout || "A"}
                  </span>
                </div>
                {isDirty ? (
                  <span className="bg-flash text-paper px-2 py-0.5 mono-label text-[10px] font-extrabold">
                    CHƯA LƯU THAY ĐỔI
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-volt mono-label text-[10px] font-bold">
                    <CheckCircle2 size={12} /> ĐÃ ĐỒNG BỘ
                  </span>
                )}
              </div>

              <LayoutPreview current={current} statusState={statusState} />
            </div>

            <div className="bg-paper border-2 border-ink shadow-hard p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-xs font-bold uppercase text-ink">
                  Danh sách ({banners.length} banner)
                </h3>
                <span className="mono-label text-[10px] text-ink-muted">
                  Click vào thẻ để chuyển banner chỉnh sửa
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                {banners.map((b, i: number) => {
                  const isCurrent = i === safeSelected;
                  return (
                    <motion.button
                      type="button"
                      key={b.id ?? i}
                      onClick={() => setSelected(i)}
                      className={`relative min-w-[200px] snap-start cursor-pointer overflow-hidden border-2 text-left transition ${
                        isCurrent
                          ? "border-flash shadow-hard-flash"
                          : "border-ink opacity-80 hover:opacity-100"
                      }`}
                    >
                      {b.linkUrl ? (
                        <img
                          src={b.linkUrl}
                          alt={b.mainTitle || "Banner"}
                          className="w-full h-28 object-cover"
                        />
                      ) : (
                        <div className="studio-grid-bg w-full h-28" />
                      )}

                      <div className="absolute top-1.5 left-1.5 flex gap-1">
                        <span className="bg-ink text-paper px-1.5 py-0.5 mono-label text-[9px] font-bold">
                          #{i + 1}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 mono-label text-[9px] font-bold border border-ink ${
                            b.active ? "bg-volt text-ink" : "bg-fog text-ink-muted"
                          }`}
                        >
                          {b.active ? "BẬT" : "ẨN"}
                        </span>
                      </div>

                      <div className="bg-ink text-paper font-mono text-[10px] font-bold uppercase px-3 py-1.5 truncate">
                        {b.mainTitle || "(Chưa đặt tiêu đề)"}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Organized Friendly Editor Inspector */}
          <div className="w-full lg:w-[36%] bg-paper border-2 border-ink shadow-hard flex flex-col h-fit lg:sticky lg:top-6">
            <div className="p-5 pb-3 border-b-2 border-ink bg-bone">
              <h3 className="font-display-safe text-lg font-black uppercase text-ink">
                Chỉnh sửa Banner #{safeSelected + 1}
              </h3>

              {/* 3 Focused Editor Tabs */}
              <div className="grid grid-cols-3 gap-1.5 mt-3">
                {[
                  { id: "content" as const, label: "1. Nội dung", icon: Type },
                  { id: "media" as const, label: "2. Ảnh & Bố cục", icon: ImagePlus },
                  { id: "style" as const, label: "3. Màu & Bật/Tắt", icon: Palette },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`min-h-[38px] px-2 py-1.5 border-2 border-ink font-mono text-[10px] font-extrabold uppercase flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        active
                          ? "bg-volt text-ink shadow-hard-sm"
                          : "bg-paper text-ink hover:bg-fog"
                      }`}
                    >
                      <Icon size={12} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-5 space-y-4">
              {activeTab === "content" && (
                <>
                  <div>
                    <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-ink mb-1.5">
                      <Type size={14} /> Tiêu đề chính
                    </label>
                    <input
                      value={current.mainTitle || ""}
                      onChange={(e) => updateBannerField("mainTitle", e.target.value)}
                      placeholder="VD: BỘ SƯU TẬP XUÂN HÈ"
                      className="w-full h-11 bg-bone border-2 border-ink px-3 font-sans text-sm text-ink focus:bg-paper outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-ink mb-1.5">
                      <Edit2 size={14} /> Nhãn phụ (Tagline)
                    </label>
                    <input
                      value={current.h1 || ""}
                      onChange={(e) => updateBannerField("h1", e.target.value)}
                      placeholder="VD: TỰ TIN THỂ HIỆN BẢN THÂN"
                      className="w-full h-11 bg-bone border-2 border-ink px-3 font-sans text-sm text-ink focus:bg-paper outline-none"
                    />
                  </div>

                  {statusState === "Story" ? (
                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-ink mb-1.5">
                        <Edit2 size={14} /> Nhãn phụ 2 (Tùy chọn)
                      </label>
                      <input
                        value={current.h2 || ""}
                        onChange={(e) => updateBannerField("h2", e.target.value)}
                        placeholder="VD: CAM-01 // HẬU TRƯỜNG"
                        className="w-full h-11 bg-bone border-2 border-ink px-3 font-sans text-sm text-ink focus:bg-paper outline-none"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-ink mb-1.5">
                        <Edit2 size={14} /> Chữ trên nút hành động (CTA)
                      </label>
                      <input
                        value={current.textInButton || ""}
                        onChange={(e) => updateBannerField("textInButton", e.target.value)}
                        placeholder="VD: Khám phá ngay"
                        className="w-full h-11 bg-bone border-2 border-ink px-3 font-sans text-sm text-ink focus:bg-paper outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-ink mb-1.5">
                      <Edit2 size={14} /> Slogan / Mô tả chi tiết
                    </label>
                    <textarea
                      value={bannerBodyText}
                      onChange={(e) => updateBannerField("pagaraph", e.target.value)}
                      placeholder="Nhập thông điệp mô tả hiển thị trên banner..."
                      className="w-full bg-bone border-2 border-ink p-3 font-sans text-sm text-ink h-28 resize-none focus:bg-paper outline-none"
                    />
                  </div>
                </>
              )}

              {activeTab === "media" && (
                <>
                  <div className="space-y-2">
                    <label className="block font-mono text-xs font-bold uppercase text-ink">
                      Tải ảnh mới từ thiết bị
                    </label>
                    <div className="border-dashed border-2 border-ink p-5 text-center hover:bg-volt/20 cursor-pointer bg-bone transition relative">
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2 text-ink">
                          <Loader2 className="animate-spin" size={24} />
                          <span className="font-mono text-xs font-bold">
                            Đang tải ảnh lên...
                          </span>
                        </div>
                      ) : (
                        <>
                          <ImagePlus className="mx-auto text-ink mb-1.5" size={24} />
                          <p className="font-mono text-xs text-ink-muted">
                            Nhấn để chọn ảnh (JPG, PNG, WEBP)
                          </p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={(e) => {
                          const picked = e.target.files?.[0] || null;
                          void handleUploadFile(picked);
                          e.target.value = "";
                        }}
                        className="absolute inset-0 w-full h-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-ink mb-1.5">
                      <LinkIcon size={13} /> Hoặc dán đường dẫn ảnh (URL)
                    </label>
                    <input
                      value={current.linkUrl || ""}
                      onChange={(e) => updateBannerField("linkUrl", e.target.value)}
                      placeholder="https://..."
                      className="w-full h-11 bg-bone border-2 border-ink px-3 font-mono text-xs text-ink focus:bg-paper outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-ink mb-2">
                      Kiểu bố cục hiển thị
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {LAYOUT_OPTIONS.map((opt) => {
                        const isPicked = (current.layout || "A") === opt.id;
                        return (
                          <button
                            type="button"
                            key={opt.id}
                            onClick={() => updateBannerField("layout", opt.id)}
                            className={`p-2.5 border-2 border-ink text-left transition cursor-pointer ${
                              isPicked
                                ? "bg-ink text-paper shadow-hard-sm"
                                : "bg-bone text-ink hover:bg-volt"
                            }`}
                          >
                            <p className="font-mono text-xs font-extrabold uppercase">
                              {opt.title}
                            </p>
                            <p
                              className={`font-sans text-[11px] ${
                                isPicked ? "text-volt" : "text-ink-muted"
                              }`}
                            >
                              {opt.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "style" && (
                <>
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-ink">
                      <Palette size={14} /> Màu tiêu đề chính
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {ADMIN_COLOR_SWATCHES.map((sw) => (
                        <button
                          key={`title-${sw.name}`}
                          type="button"
                          title={sw.name}
                          onClick={() => updateBannerField("colorMainTitle", sw.value)}
                          className={`w-8 h-8 border-2 cursor-pointer ${
                            current.colorMainTitle === sw.value
                              ? "border-flash scale-110 shadow-hard-sm"
                              : "border-ink"
                          }`}
                          style={{ backgroundColor: sw.value }}
                        />
                      ))}
                      <input
                        type="color"
                        value={current.colorMainTitle || ADMIN_COLOR_SWATCHES[0].value}
                        onChange={(e) =>
                          updateBannerField("colorMainTitle", e.target.value)
                        }
                        className="h-8 w-12 border-2 border-ink bg-bone cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-ink">
                      <Palette size={14} /> Màu mô tả & nhãn phụ
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {ADMIN_COLOR_SWATCHES.map((sw) => (
                        <button
                          key={`text-${sw.name}`}
                          type="button"
                          title={sw.name}
                          onClick={() => updateBannerField("colorText", sw.value)}
                          className={`w-8 h-8 border-2 cursor-pointer ${
                            current.colorText === sw.value
                              ? "border-flash scale-110 shadow-hard-sm"
                              : "border-ink"
                          }`}
                          style={{ backgroundColor: sw.value }}
                        />
                      ))}
                      <input
                        type="color"
                        value={current.colorText || ADMIN_COLOR_SWATCHES[0].value}
                        onChange={(e) => updateBannerField("colorText", e.target.value)}
                        className="h-8 w-12 border-2 border-ink bg-bone cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t-2 border-dashed border-ink space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase text-ink">
                        Trạng thái hiển thị:
                      </span>
                      {current.active ? (
                        <span className="bg-volt text-ink border border-ink font-mono text-[10px] font-bold uppercase px-2.5 py-0.5">
                          Đang bật
                        </span>
                      ) : (
                        <span className="bg-fog text-ink-muted border border-ink font-mono text-[10px] font-bold uppercase px-2.5 py-0.5">
                          Đang ẩn
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => updateBannerField("active", !current.active)}
                      className={`w-full min-h-[42px] px-3 py-2 border-2 border-ink font-mono text-xs font-bold uppercase cursor-pointer transition-colors ${
                        current.active
                          ? "bg-bone text-danger hover:bg-danger hover:text-paper"
                          : "bg-volt text-ink"
                      }`}
                    >
                      {current.active ? "Tạm ẩn banner này" : "Kích hoạt banner này"}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="p-5 pt-3 border-t-2 border-ink bg-bone flex gap-2">
              {isDirty && (
                <button
                  type="button"
                  onClick={handleResetCurrent}
                  className="min-h-[48px] px-3.5 bg-paper border-2 border-ink text-ink font-mono text-xs font-bold uppercase hover:bg-fog transition cursor-pointer flex items-center gap-1.5"
                  title="Hoàn tác thay đổi chưa lưu"
                >
                  <RotateCcw size={14} /> Hoàn tác
                </button>
              )}

              <button
                type="button"
                disabled={isSaving || isUploading}
                onClick={handleSave}
                className="flex-1 min-h-[48px] bg-flash text-paper border-2 border-ink shadow-hard-sm font-mono text-xs font-bold uppercase tracking-widest py-2.5 hover:bg-ink transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
