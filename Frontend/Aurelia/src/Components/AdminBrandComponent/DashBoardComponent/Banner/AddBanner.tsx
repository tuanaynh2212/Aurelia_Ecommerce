import { useContext, useEffect, useState } from "react";
import { ArrowBigLeft, Check, X } from "lucide-react";
import { LayoutPreview } from "./LayoutPreview";
import { AdminContext } from "../../../../contexts/AdminContext";

const styleByLayoutMain: Record<string, any> = {
  A: {
    wrapper:
      "relative flex flex-row-reverse items-center justify-around px-20 gap-4",
    image:
      "w-full h-[65vh]  object-cover brightness-75 hover:brightness-90 transition-transform duration-700 rounded-3xl shadow-2xl",
    text: "w-[45%] flex flex-col gap-4 text-gray-900 ",
    btn: "from-gray-700 to-black text-white hover:from-black hover:to-gray-800 border-gray-400",
  },
  B: {
    wrapper: "relative flex flex-row items-center  justify-around px-20 gap-4 ",
    image:
      "w-full h-[65vh]  object-cover rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-700",
    text: "w-[45%] flex flex-col gap-4 text-gray-900",
    btn: "mt-4 px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition",
  },
  C: {
    wrapper: "relative items-center overflow-hidden",
    image: "absolute  w-full h-full object-cover opacity-80  transition",
    text: "z-10 col-start-1 space-y-6 text-center w-full h-full justify-center items-center flex flex-col",
    btn: "mt-4  bg-white/15 border border-white/30 rounded-full hover:bg-white hover:text-indigo-900 transition",
  },
  D: {
    wrapper:
      "relative  overflow-hidden bg-black text-white flex flex-col items-center justify-center rounded-[3rem]",
    image:
      "absolute inset-0 w-full h-full object-cover opacity-70 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] transition-transform duration-1000 hover:scale-110",
    text: "relative z-10 flex flex-col items-center text-center gap-6 backdrop-blur-sm bg-white/10 px-12 py-10 rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.2)]",
    btn: "mt-6 px-10 py-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white hover:text-black transition-all duration-300",
  },

  E: {
    wrapper:
      "relative overflow-hidden h-[90vh] flex flex-col items-center justify-center bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#334155] text-white rounded-[3rem] ",
    image:
      "absolute inset-0 w-full h-full object-cover opacity-70 [clip-path:polygon(0_0,100%_10%,100%_90%,0_100%)] transition-transform duration-1000 hover:scale-110",
    text: "relative z-10 max-w-3xl text-center space-y-6 transform -skew-y-2 bg-white/10 backdrop-blur-sm rounded-3xl p-12 shadow-[0_0_40px_rgba(255,255,255,0.15)]",
    btn: "mt-4 px-10 py-3 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white rounded-full hover:scale-105 hover:shadow-[0_10px_30px_rgba(192,132,252,0.5)] transition-all duration-300",
  },
};

const styleByLayoutStory: Record<string, any> = {
  A: {
    wrapper:
      "relative flex flex-col justify-center items-center text-center h-[750px] bg-black text-white overflow-hidden",
    image:
      "absolute inset-0 w-full h-full object-cover brightness-[0.45] scale-110 hover:scale-115 transition-transform duration-[1200ms] ease-[cubic-bezier(.4,0,.2,1)]",
    text: "relative z-10 max-w-3xl space-y-6 backdrop-blur-sm bg-white/5 px-10 py-8 rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.1)]",
  },
  B: {
    wrapper:
      "relative flex flex-col items-center gap-24 py-40 px-10 bg-gradient-to-b from-white to-gray-50 rounded-[3rem] overflow-hidden",
    image:
      "w-full md:w-[60%] h-[450px] object-cover rounded-[2rem] shadow-xl hover:scale-105 transition-transform duration-700",
    text: "max-w-3xl text-center md:text-left space-y-4 bg-white/80 backdrop-blur-sm p-10 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)]",
  },
  C: {
    wrapper:
      "relative flex flex-col justify-end items-start h-[750px] text-white overflow-hidden",
    image:
      "absolute inset-0 w-full h-full object-cover brightness-[0.4] hover:brightness-[0.5] transition duration-700",
    text: "relative z-10 p-20 max-w-2xl space-y-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-[3rem]",
  },
  D: {
    wrapper:
      "relative  bg-white overflow-hidden rounded-[3rem] flex items-center justify-center bg-black ",
    image:
      "absolute w-[60%] h-[80%] object-cover rounded-[2rem] shadow-[0_20px_80px_rgba(0,0,0,0.25)] left-[10%] top-[10%] rotate-[-3deg] hover:rotate-0 transition-all duration-700",
    text: "absolute right-[8%] bottom-[15%] max-w-md bg-black text-white px-10 py-8 rounded-[2rem] shadow-[0_0_60px_rgba(0,0,0,0.3)] leading-relaxed space-y-4",
  },
};
export const AddBanner = ({
  setPopupAddBanner,
}: {
  SetBanner: React.Dispatch<React.SetStateAction<any>>;
  setPopupAddBanner: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {uptodatabase}=useContext(AdminContext)
  const [typeBanner, setTypeBanner] = useState("MainBanner");
  const [selectedLayout, setSelectedLayout] = useState<string>("A");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle1, setSubtitle1] = useState("");
  const [subtitle2, setSubtitle2] = useState("");
  const [slogan, setSlogan] = useState("");
  const [linkButton, setLinkButton] = useState("");
  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#000000");
  const [current, setCurrent] = useState<any>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [PreviewLayout, setPreviewLayout] = useState<boolean>(false);
  useEffect(() => {
    const newBanner =
      typeBanner === "MainBanner"
        ? {
            id: "",
            linkUrl: linkUrl,
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
            id: "",
            linkUrl: linkUrl,
            mainTitle: title,
            h1: subtitle1,
            h2: subtitle2,
            pagaraph: slogan,
            active: true,
            layout: selectedLayout,
            colorMainTitle: titleColor,
            colorText: subtitleColor,
          };
    setCurrent(newBanner);
  }, [
    typeBanner,
    selectedLayout,
    linkUrl,
    title,
    subtitle1,
    subtitle2,
    slogan,
    linkButton,
    titleColor,
    subtitleColor,
  ]);
  const uploadImage = async (file: File[]) => {
    try {
      const apiKey = "0d1c3d8a0af15e271bc8154578e71620";
      const formData = new FormData();
      file.forEach((f) => {
        formData.append("image", f);
      });

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Upload failed");
      }

      return data.data.image.url;
    } catch (err) {
      console.error("Upload error:", err);
      return "";
    }
  };
  useEffect(() => {
    uploadImage(imageFile ? [imageFile] : []).then((url) => {
      if (url) {
        setLinkUrl(url);
      }
    });
  }, [imageFile]);
  const handleSubmit = async (type:string,data:any) => {
    if (!current) return;
    uptodatabase(type,data);
    setPopupAddBanner(false);
  };

  const layouts =
    typeBanner === "MainBanner" ? styleByLayoutMain : styleByLayoutStory;

  return (
    <div className=" p-6 bg-white shadow-lg rounded-xl relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <X
        className="absolute top-4 right-4 cursor-pointer"
        onClick={() => setPopupAddBanner(false)}
      />
      <h1 className="text-2xl font-bold mb-4">Thêm Banner</h1>
      {PreviewLayout && current && (
        <div className="mb-6">
          <ArrowBigLeft
            className="mb-4 cursor-pointer"
            onClick={() => setPreviewLayout(false)}
          />
          <LayoutPreview current={current} statusState={typeBanner} />
        </div>
      )}
      {PreviewLayout == false && (
        <div>
          <div>
            <form className="space-y-4">
              <div className="flex  justify-between flex-row gap-6">
                <div className="w-2/4">
                  <div>
                    <label htmlFor="image" className="block font-semibold mb-1">
                      Hình ảnh
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="title" className="block font-semibold mb-1">
                      Tiêu đề
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subtitle1"
                      className="block font-semibold mb-1"
                    >
                      Tiêu đề phụ 1
                    </label>
                    <input
                      type="text"
                      id="subtitle1"
                      name="subtitle1"
                      value={subtitle1}
                      onChange={(e) => setSubtitle1(e.target.value)}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>

                  {typeBanner === "StoryBanner" && (
                    <div>
                      <label
                        htmlFor="subtitle2"
                        className="block font-semibold mb-1"
                      >
                        Tiêu đề phụ 2
                      </label>
                      <input
                        type="text"
                        id="subtitle2"
                        name="subtitle2"
                        value={subtitle2}
                        onChange={(e) => setSubtitle2(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full"
                      />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="slogan"
                      className="block font-semibold mb-1"
                    >
                      Slogan
                    </label>
                    <input
                      type="text"
                      id="slogan"
                      name="slogan"
                      value={slogan}
                      onChange={(e) => setSlogan(e.target.value)}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>
                </div>
                <div className="w-2/4 space-y-4">
                  {typeBanner === "MainBanner" && (
                    <div>
                      <label
                        htmlFor="linkButton"
                        className="block font-semibold mb-1"
                      >
                        Chữ Nút
                      </label>
                      <input
                        type="text"
                        id="linkButton"
                        name="linkButton"
                        value={linkButton}
                        onChange={(e) => setLinkButton(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold mb-1">
                      Màu Tiêu Đề Chính
                    </label>
                    <input
                      type="color"
                      value={titleColor}
                      onChange={(e) => setTitleColor(e.target.value)}
                      className="w-16 h-8 rounded"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Màu Tiêu Đề Phụ
                    </label>
                    <input
                      type="color"
                      value={subtitleColor}
                      onChange={(e) => setSubtitleColor(e.target.value)}
                      className="w-16 h-8 rounded"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Thể loại</label>
                    <select
                      value={typeBanner}
                      onChange={(e) => {
                        setTypeBanner(e.target.value);
                        setSelectedLayout("A");
                      }}
                      className="border border-gray-300 p-2 rounded w-full"
                    >
                      <option value="MainBanner">Main Banner</option>
                      <option value="StoryBanner">Story Banner</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Chọn Layout</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.entries(layouts).map(([key, value]: any) => (
                    <div
                      key={key}
                      onClick={() => setSelectedLayout(key)}
                      className={`relative h-24 rounded-lg cursor-pointer border-2 transition-all duration-200 flex items-center justify-center text-sm font-medium text-gray-700 ${
                        selectedLayout === key
                          ? "border-blue-500 ring-2 ring-blue-300"
                          : "border-gray-200"
                      } ${value.bg}`}
                    >
                      {selectedLayout === key && (
                        <Check className="absolute top-2 right-2 text-blue-600 w-5 h-5" />
                      )}
                      <div className="text-center p-2">
                        <p className="font-semibold mb-1">Layout {key}</p>
                        <p className="text-xs text-gray-600">{value.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <h1
                className="text-sm bold hover:text-blue-600 cursor-pointer transition   "
                onClick={() => setPreviewLayout(!PreviewLayout)}
              >
                View Layout
              </h1>
              <button
                onClick={()=>handleSubmit(typeBanner,current)}
                type="button"
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Thêm Banner
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
