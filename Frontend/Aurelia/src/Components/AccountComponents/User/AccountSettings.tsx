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
  Sparkles,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rule/60 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-tag bg-kraft/15 border border-kraft-dark/20 flex items-center justify-center text-ink">
            <User size={16} />
          </div>
          <div>
            <h1 className="font-heading text-lg font-semibold text-ink">
              Cài Đặt Hồ Sơ & Bảo Mật
            </h1>
            <p className="font-mono text-xs text-ink-muted">
              Quản lý thông tin định danh, địa chỉ giao nhận và ảnh đại diện
            </p>
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-tag bg-paper hover:bg-kraft/15 border border-rule/80 font-mono text-xs uppercase tracking-wider text-ink transition-colors shadow-sm self-start sm:self-auto"
          >
            <Edit2 size={13} />
            <span>Chỉnh sửa thông tin</span>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-tag border border-rule font-mono text-xs text-ink-muted hover:text-ink self-start sm:self-auto"
          >
            Hủy thao tác
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-paper border border-rule/80 rounded-tag p-6 flex flex-col items-center justify-between text-center shadow-tag relative">
          <div className="absolute top-3 left-3 flex items-center gap-1.5 opacity-60">
            <div className="w-2 h-2 rounded-hole bg-kraft border border-ink/20" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">
              ẢNH HỒ SƠ
            </span>
          </div>

          <div className="mt-4 flex flex-col items-center">
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name || "Avatar"}
                  className="w-28 h-28 object-cover rounded-tag border border-rule shadow-sm"
                />
              ) : (
                <div className="w-28 h-28 rounded-tag bg-kraft/30 border border-rule flex items-center justify-center font-heading text-3xl font-bold text-ink">
                  {name ? name.charAt(0).toUpperCase() : "A"}
                </div>
              )}

              {isEditing && (
                <label className="absolute -bottom-2 -right-2 p-2 rounded-tag bg-cobalt hover:bg-cobalt-hover text-white cursor-pointer shadow-md transition-colors" title="Tải ảnh mới">
                  <Camera size={15} />
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

            <h3 className="font-heading text-base font-semibold text-ink mt-4">
              {name || "Quý khách"}
            </h3>
            <p className="font-mono text-xs text-ink-muted mt-0.5">
              {email || "Chưa thiết lập email"}
            </p>
          </div>

          <div className="w-full mt-6 pt-4 border-t border-rule/50 flex items-center justify-between font-mono text-xs">
            <span className="text-ink-muted flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Trạng thái</span>
            </span>
            <span className="px-2 py-0.5 rounded-tag bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] uppercase font-semibold">
              Hoạt động
            </span>
          </div>
        </div>

        <div className="md:col-span-2 bg-paper border border-rule/80 rounded-tag p-6 shadow-tag">
          {!isEditing ? (
            <div className="space-y-4">
              {[
                { icon: User, label: "Họ và tên", value: name },
                { icon: Mail, label: "Địa chỉ Email", value: email },
                { icon: Phone, label: "Số điện thoại", value: phone },
                { icon: MapPin, label: "Địa chỉ nhận hàng", value: address },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-3.5 pb-4 border-b border-rule/50 last:border-b-0"
                >
                  <div className="w-8 h-8 rounded-tag bg-kraft/15 border border-kraft-dark/20 flex items-center justify-center text-ink-muted shrink-0 mt-0.5">
                    <Icon size={15} />
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                      {label}
                    </span>
                    <span className="font-mono text-sm text-ink mt-0.5 block">
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
                onChange={(e: any) => setName(e.target.value)}
              />
              <InputField
                icon={Mail}
                label="Địa chỉ Email"
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
              />
              <InputField
                icon={Phone}
                label="Số điện thoại"
                value={phone}
                onChange={(e: any) => setPhone(e.target.value)}
              />
              <InputField
                icon={MapPin}
                label="Địa chỉ nhận hàng"
                value={address}
                onChange={(e: any) => setAddress(e.target.value)}
              />

              <div className="flex justify-end gap-3 pt-5 border-t border-rule/60 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-tag border border-rule font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-ink transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 rounded-tag bg-cobalt hover:bg-cobalt-hover text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
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

