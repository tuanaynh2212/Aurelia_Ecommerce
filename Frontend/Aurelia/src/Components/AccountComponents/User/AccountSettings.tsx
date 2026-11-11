import React, { useContext, useEffect, useState } from "react";
import {
  Camera,
  Save,
  Mail,
  Phone,
  User,
  MapPin,
  Check,
  Edit2,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../../contexts/Author";
import { InputField } from "./RightSideComponent.tsx/InputField";

export default function AccountSettings() {
  const { UpdateProfile } = useContext(AuthContext);
  const userString = localStorage.getItem("user");
  const userData = userString ? JSON.parse(userString) : {};

  const [user, setUser] = useState({
    name: userData.name || "",
    email: userData.email || "",
    phone: userData.soDt || "",
    address: userData.diaChi || "",
    avatar: userData.avatar || "",
  });

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [avatar, setAvatar] = useState(user.avatar);
  const [files, setFiles] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const updatedImage = async () => {
    const apiKey = "0d1c3d8a0af15e271bc8154578e71620";
    const formData = new FormData();
    formData.append("image", files as Blob);
    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData
      );
      setImageUrl(response.data.data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  useEffect(() => {
    if (files) {
      updatedImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  useEffect(() => {
    if (imageUrl) {
      setUser((prev) => ({ ...prev, avatar: imageUrl }));
      setAvatar(imageUrl);
    }
  }, [imageUrl]);

  const handleSave = () => {
    UpdateProfile(name, email, phone, address, avatar);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-[var(--color-ink)] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-volt)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-ink)] shadow-[var(--shadow-hard-sm)]">
            <User size={18} />
          </div>
          <div>
            <h1 className="font-display-safe text-lg font-extrabold uppercase text-[var(--color-ink)]">
              Cài Đặt Hồ Sơ & Bảo Mật
            </h1>
            <p className="mono-label text-[var(--color-ink-muted)]">
              Quản lý thông tin định danh, địa chỉ giao nhận và ảnh đại diện
            </p>
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-paper)] hover:bg-[var(--color-volt)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] mono-label font-extrabold text-[var(--color-ink)] transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Edit2 size={14} />
            <span>Chỉnh sửa thông tin</span>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] mono-label text-[var(--color-ink)] self-start sm:self-auto cursor-pointer"
          >
            Hủy thao tác
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-bone)] border-2 border-[var(--color-ink)] p-6 flex flex-col items-center justify-between text-center shadow-[var(--shadow-hard-sm)] relative">
          <div className="w-full flex items-center justify-between pb-3 border-b-2 border-[var(--color-ink)]">
            <span className="mono-label text-[10px] text-[var(--color-ink)]">
              [ẢNH HỒ SƠ]
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-paper)] border-2 border-[var(--color-ink)]" />
          </div>

          <div className="my-6 flex flex-col items-center">
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name || "Avatar"}
                  className="w-28 h-28 object-cover border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)]"
                />
              ) : (
                <div className="w-28 h-28 bg-[var(--color-volt)] border-2 border-[var(--color-ink)] flex items-center justify-center font-display-safe text-3xl font-extrabold text-[var(--color-ink)]">
                  {name ? name.charAt(0).toUpperCase() : "A"}
                </div>
              )}

              {isEditing && (
                <label
                  className="absolute -bottom-2 -right-2 min-w-[40px] min-h-[40px] inline-flex items-center justify-center bg-[var(--color-flash)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] cursor-pointer shadow-[var(--shadow-hard-sm)]"
                  title="Tải ảnh mới"
                >
                  <Camera size={16} />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      setFiles(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </label>
              )}
            </div>

            <h3 className="font-display-safe text-base font-extrabold uppercase text-[var(--color-ink)] mt-4">
              {name || "Quý khách"}
            </h3>
            <p className="font-mono text-xs text-[var(--color-ink-muted)] mt-0.5">
              {email || "Chưa thiết lập email"}
            </p>
          </div>

          <div className="w-full pt-3 border-t-2 border-[var(--color-ink)] flex items-center justify-between mono-label">
            <span className="text-[var(--color-ink)] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[var(--color-success)]" />
              <span>Trạng thái</span>
            </span>
            <span className="px-2 py-0.5 bg-[var(--color-volt)] text-[var(--color-ink)] border border-[var(--color-ink)] font-extrabold">
              Hoạt động
            </span>
          </div>
        </div>

        <div className="md:col-span-2 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-6 shadow-[var(--shadow-hard-sm)]">
          {!isEditing ? (
            <div className="divide-y-2 divide-dashed divide-[var(--color-ink)]">
              {[
                { icon: User, label: "Họ và tên", value: name },
                { icon: Mail, label: "Địa chỉ Email", value: email },
                { icon: Phone, label: "Số điện thoại", value: phone },
                { icon: MapPin, label: "Địa chỉ nhận hàng", value: address },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-3.5 py-4 first:pt-0 last:pb-0"
                >
                  <div className="w-9 h-9 bg-[var(--color-bone)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-ink)] shrink-0 mt-0.5">
                    <Icon size={15} />
                  </div>
                  <div>
                    <span className="block mono-label text-[var(--color-ink-muted)]">
                      {label}
                    </span>
                    <span className="font-mono text-sm font-bold text-[var(--color-ink)] mt-0.5 block">
                      {value || "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <InputField
                icon={User}
                label="Họ và tên"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
              <InputField
                icon={Mail}
                label="Địa chỉ Email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
              <InputField
                icon={Phone}
                label="Số điện thoại"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPhone(e.target.value)
                }
              />
              <InputField
                icon={MapPin}
                label="Địa chỉ nhận hàng"
                value={address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAddress(e.target.value)
                }
              />

              <div className="flex justify-end gap-3 pt-5 border-t-2 border-[var(--color-ink)] mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="min-h-[44px] px-4 py-2 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] mono-label text-[var(--color-ink)] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="min-h-[44px] px-5 py-2 bg-[var(--color-flash)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] mono-label font-extrabold flex items-center gap-2 cursor-pointer"
                >
                  {saved ? <Check size={14} /> : <Save size={14} />}
                  <span>{saved ? "Đã lưu thành công" : "Lưu thay đổi"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
