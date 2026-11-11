import React, { useContext, useMemo, useState } from "react";
import { Check, ImagePlus, Link as LinkIcon, Loader2, Sparkles, X } from "lucide-react";
import { LayoutPreview } from "./LayoutPreview";
import { AdminContext } from "../../../../contexts/AdminContext";
import { CSS } from "../../../UI/three/palette";
import { ADMIN_COLOR_SWATCHES, uploadImageToImgbb } from "../adminUpload";
import { Toaster } from "../../../Toaster";

const LAYOUT_OPTIONS_MAIN = [
  { id: "A", desc: "Chia đôi ngược" },
  { id: "B", desc: "Tâm điểm" },
  { id: "C", desc: "Poster lớn" },
  { id: "D", desc: "Khung tối giản" },
];

const LAYOUT_OPTIONS_STORY = [
  { id: "A", desc: "Toàn khung tối" },
  { id: "B", desc: "Chia đôi hồ sơ" },
  { id: "C", desc: "Chữ góc dưới" },
  { id: "D", desc: "Thẻ đôi Atelier" },
];

export const AddBanner = ({
  setPopupAddBanner,
  initialType = "MainBanner",
}: {
  SetBanner?: React.Dispatch<React.SetStateAction<unknown>>;
  setPopupAddBanner: React.Dispatch<React.SetStateAction<boolean>>;
  initialType?: "MainBanner" | "StoryBanner";
}) => {
  const { uptodatabase } = useContext(AdminContext);
  const [typeBanner, setTypeBanner] = useState<"MainBanner" | "StoryBanner">(
    initialType
  );
  const [selectedLayout, setSelectedLayout] = useState<string>("A");
  const [title, setTitle] = useState("");
  const [subtitle1, setSubtitle1] = useState("");
  const [subtitle2, setSubtitle2] = useState("");
  const [slogan, setSlogan] = useState("");
  const [linkButton, setLinkButton] = useState("Khám phá ngay");
  const [titleColor, setTitleColor] = useState<string>(CSS.ink);
  const [subtitleColor, setSubtitleColor] = useState<string>(CSS.ink);
  const [linkUrl, setLinkUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewBanner = useMemo(
    () =>
      typeBanner === "MainBanner"
        ? {
            id: "preview",
            linkUrl,
            mainTitle: title,
            h1: subtitle1,
            pagaraph: slogan,
            textInButton: linkButton,
            active: true,
            layout: selectedLayout,
            colorMainTitle: titleColor,
            colorText: subtitleColor,
          }
        : {
            id: "preview",
            linkUrl,
            mainTitle: title,
            h1: subtitle1,
            h2: subtitle2,
            pagaraph: slogan,
            active: true,
            layout: selectedLayout,
            colorMainTitle: titleColor,
            colorText: subtitleColor,
          },
    [
      typeBanner,
      linkUrl,
      title,
      subtitle1,
      subtitle2,
      slogan,
      linkButton,
      selectedLayout,
      titleColor,
      subtitleColor,
    ]
  );

  const handleUploadFile = async (picked: File | null) => {
    if (!picked) return;
    setIsUploading(true);
    try {
      const url = await uploadImageToImgbb(picked);
      setLinkUrl(url);
      Toaster.success("Tải ảnh lên thành công!");
    } catch (err) {
      console.error(err);
      Toaster.error("Tải ảnh thất bại, thử dán trực tiếp đường dẫn ảnh.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFillSample = () => {
    if (typeBanner === "MainBanner") {
      setTitle("BỘ SƯU TẬP XUÂN HÈ");
      setSubtitle1("NEW SEASON DROP");
      setSlogan("Chất liệu linen thoáng nhẹ kết hợp phom cắt sắc nét chuẩn xưởng may.");
      setLinkButton("Xem bộ sưu tập");
      setTitleColor(CSS.ink);
      setSubtitleColor(CSS.ink);
    } else {
      setTitle("GÓC PHÒNG THỬ ĐỒ");
      setSubtitle1("TỰ TIN THỂ HIỆN BẢN THÂN");
      setSubtitle2("CAM-02 // BACKSTAGE");
      setSlogan("Từng đường kim mũi chỉ được chỉnh tay trước khi lên ánh đèn sân khấu.");
      setTitleColor(CSS.paper);
      setSubtitleColor(CSS.volt);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Toaster.error("Vui lòng nhập tiêu đề chính cho banner");
      return;
    }
    if (!linkUrl.trim()) {
      Toaster.error("Vui lòng tải ảnh lên hoặc dán đường dẫn ảnh");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...previewBanner, id: "" };
      const ok = await uptodatabase(typeBanner, payload);
      if (ok) {
        setPopupAddBanner(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const layouts =
    typeBanner === "MainBanner" ? LAYOUT_OPTIONS_MAIN : LAYOUT_OPTIONS_STORY;

  return (
    <div className="bg-paper border-2 border-ink shadow-hard-lg relative w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
      <div className="bg-ink text-paper px-6 py-4 flex items-center justify-between border-b-2 border-ink">
        <div>
          <span className="mono-label text-[10px] text-volt block">
            [STAGE GRAPHICS // TẠO BANNER MỚI]
          </span>
          <h1 className="font-display-safe text-xl font-black uppercase text-paper">
            Thêm Banner & Xem Trước Trực Tiếp
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillSample}
            className="min-h-[40px] px-3 bg-volt text-ink border-2 border-ink font-mono text-[11px] font-extrabold uppercase flex items-center gap-1.5 hover:bg-paper cursor-pointer"
          >
            <Sparkles size={14} /> Điền mẫu nhanh
          </button>
          <button
            type="button"
            onClick={() => setPopupAddBanner(false)}
            className="min-w-[40px] min-h-[40px] bg-paper text-ink border-2 border-ink flex items-center justify-center hover:bg-flash hover:text-paper transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Compact Friendly Form */}
        <div className="lg:col-span-6 p-6 space-y-4 border-b-2 lg:border-b-0 lg:border-r-2 border-ink bg-bone">
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
              Vị trí hiển thị
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: "MainBanner" as const, label: "Main Banner (Hero)" },
                { val: "StoryBanner" as const, label: "Story Banner (Hậu trường)" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => {
                    setTypeBanner(opt.val);
                    setSelectedLayout("A");
                  }}
                  className={`min-h-[42px] px-3 py-2 border-2 border-ink font-mono text-xs font-bold uppercase cursor-pointer transition ${
                    typeBanner === opt.val
                      ? "bg-ink text-paper shadow-hard-sm"
                      : "bg-paper text-ink hover:bg-volt"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Tải ảnh lên
              </label>
              <label className="flex items-center justify-center gap-2 h-11 px-3 border-2 border-dashed border-ink bg-paper hover:bg-volt/30 cursor-pointer font-mono text-xs font-bold">
                {isUploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Đang tải...</span>
                  </>
                ) : (
                  <>
                    <ImagePlus size={14} />
                    <span>Chọn file ảnh</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={(e) => {
                    void handleUploadFile(e.target.files?.[0] || null);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="flex items-center gap-1 font-mono text-xs font-bold uppercase text-ink mb-1">
                <LinkIcon size={12} /> Hoặc dán URL ảnh
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="border-2 border-ink bg-paper h-11 px-3 font-mono text-xs w-full outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Tiêu đề chính *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: XUÂN HÈ 2026"
                className="border-2 border-ink bg-paper h-11 px-3 font-sans text-sm w-full outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Nhãn phụ
              </label>
              <input
                type="text"
                value={subtitle1}
                onChange={(e) => setSubtitle1(e.target.value)}
                placeholder="VD: PHIÊN BẢN GIỚI HẠN"
                className="border-2 border-ink bg-paper h-11 px-3 font-sans text-sm w-full outline-none"
              />
            </div>
          </div>

          {typeBanner === "StoryBanner" ? (
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Nhãn phụ 2 (Tùy chọn)
              </label>
              <input
                type="text"
                value={subtitle2}
                onChange={(e) => setSubtitle2(e.target.value)}
                placeholder="VD: BACKSTAGE STUDIO"
                className="border-2 border-ink bg-paper h-11 px-3 font-sans text-sm w-full outline-none"
              />
            </div>
          ) : (
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                Chữ trên nút
              </label>
              <input
                type="text"
                value={linkButton}
                onChange={(e) => setLinkButton(e.target.value)}
                className="border-2 border-ink bg-paper h-11 px-3 font-sans text-sm w-full outline-none"
              />
            </div>
          )}

          <div>
            <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
              Slogan / Mô tả
            </label>
            <textarea
              rows={2}
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="Mô tả ngắn gọn xuất hiện trên banner..."
              className="border-2 border-ink bg-paper p-3 font-sans text-sm w-full outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-1">
                Màu tiêu đề
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {ADMIN_COLOR_SWATCHES.map((sw) => (
                  <button
                    key={`new-t-${sw.name}`}
                    type="button"
                    title={sw.name}
                    onClick={() => setTitleColor(sw.value)}
                    className={`w-7 h-7 border-2 cursor-pointer ${
                      titleColor === sw.value ? "border-flash scale-110" : "border-ink"
                    }`}
                    style={{ backgroundColor: sw.value }}
                  />
                ))}
                <input
                  type="color"
                  value={titleColor}
                  onChange={(e) => setTitleColor(e.target.value)}
                  className="w-9 h-7 border-2 border-ink bg-paper cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-bold uppercase text-ink mb-1">
                Màu mô tả
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {ADMIN_COLOR_SWATCHES.map((sw) => (
                  <button
                    key={`new-s-${sw.name}`}
                    type="button"
                    title={sw.name}
                    onClick={() => setSubtitleColor(sw.value)}
                    className={`w-7 h-7 border-2 cursor-pointer ${
                      subtitleColor === sw.value ? "border-flash scale-110" : "border-ink"
                    }`}
                    style={{ backgroundColor: sw.value }}
                  />
                ))}
                <input
                  type="color"
                  value={subtitleColor}
                  onChange={(e) => setSubtitleColor(e.target.value)}
                  className="w-9 h-7 border-2 border-ink bg-paper cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
              Chọn Bố Cục
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {layouts.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setSelectedLayout(opt.id)}
                  className={`relative p-2 cursor-pointer border-2 border-ink text-left transition-colors ${
                    selectedLayout === opt.id
                      ? "bg-volt text-ink shadow-hard-sm"
                      : "bg-paper text-ink hover:bg-fog"
                  }`}
                >
                  {selectedLayout === opt.id && (
                    <Check className="absolute top-1.5 right-1.5 text-ink w-3.5 h-3.5" />
                  )}
                  <p className="font-mono text-xs font-extrabold uppercase">
                    Layout {opt.id}
                  </p>
                  <p className="font-sans text-[10px] text-ink-muted truncate">
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Always-visible Live Preview */}
        <div className="lg:col-span-6 p-6 bg-paper flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="mono-label text-[10px] font-extrabold bg-volt text-ink border border-ink px-2 py-0.5">
                XEM TRƯỚC TRỰC TIẾP · LAYOUT {selectedLayout}
              </span>
              <span className="mono-label text-[10px] text-ink-muted">
                Cập nhật theo từng ký tự bạn gõ
              </span>
            </div>
            <div className="border-2 border-ink shadow-hard overflow-hidden">
              <LayoutPreview
                current={previewBanner}
                statusState={typeBanner === "MainBanner" ? "Main" : "Story"}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-ink">
            <button
              type="button"
              onClick={() => setPopupAddBanner(false)}
              className="min-h-[44px] px-5 py-2.5 bg-bone border-2 border-ink font-mono text-xs font-bold uppercase text-ink hover:bg-fog transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={isSubmitting || isUploading}
              onClick={handleSubmit}
              className="min-h-[44px] bg-flash text-paper border-2 border-ink shadow-hard-sm px-6 py-2.5 font-mono text-xs font-bold uppercase hover:bg-ink transition cursor-pointer disabled:opacity-60 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              <span>{isSubmitting ? "Đang lưu..." : "Tạo Banner"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
