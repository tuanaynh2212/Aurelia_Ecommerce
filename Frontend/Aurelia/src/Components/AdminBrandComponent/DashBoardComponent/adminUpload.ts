import { CSS } from "../../UI/three/palette";

export const ADMIN_COLOR_SWATCHES: { name: string; value: string }[] = [
  { name: "Đen Ink", value: CSS.ink },
  { name: "Trắng Paper", value: CSS.paper },
  { name: "Kem Bone", value: CSS.bone },
  { name: "Vàng Volt", value: CSS.volt },
  { name: "Cam Flash", value: CSS.flash },
];

/** Upload a single image file to ImgBB and return its hosted URL. */
export async function uploadImageToImgbb(file: File): Promise<string> {
  const apiKey = "0d1c3d8a0af15e271bc8154578e71620";
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = (await res.json()) as {
    success?: boolean;
    error?: { message?: string };
    data?: { image?: { url?: string }; url?: string };
  };

  if (!data.success) {
    throw new Error(data.error?.message || "Tải ảnh thất bại");
  }

  const url = data.data?.image?.url || data.data?.url || "";
  if (!url) {
    throw new Error("Không nhận được đường dẫn ảnh");
  }
  return url;
}

/** Convert Vietnamese title into URL-friendly ASCII slug. */
export function toVietnameseSlug(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
