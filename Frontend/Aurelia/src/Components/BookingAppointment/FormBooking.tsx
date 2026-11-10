import { useContext, useEffect, useState } from "react";
import { type Appointment, type filterSLot, type Shop } from "../../types/type";
import { StoreContext } from "../../contexts/Store";
import { useParams } from "react-router-dom";
import { Clock, MapPin, Phone } from "lucide-react";
import { AppointmentContext } from "../../contexts/AppointmentContext";
import { v4 as uuidv4 } from "uuid";
import { NotifySuccessBooking } from "../NotifySuccessBooking";
import { Navbar } from "../HomeLayoutComponent/Navbar";
import { Footer } from "../HomeLayoutComponent/Footer";
import { LoadingOverlay } from "../LoadingOverlay";
type SlotStatus = { time: string; full: boolean | false };

export default function BookingForm() {
  const { id } = useParams();
  const { GetStoreById, appointmentProduct } = useContext(StoreContext);
  const [dataStore, setDataStore] = useState<Shop>();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<SlotStatus[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [duration, setDuration] = useState(60);
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState("");
  const [dataSlot, setDataSlot] = useState<filterSLot[]>();
  const user = localStorage.getItem("user");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { UpLoadAppointment, UpLoadAppointmentForCustomer, LocSlot } =
    useContext(AppointmentContext);
  useEffect(() => {
    if (id) GetStoreById(id, setDataStore);
  }, [id]);

  const toMinute = (slots: string) => {
    const [h, m] = slots.split(":").map(Number);
    return h * 60 + m;
  };
  useEffect(() => {
    if (!selectedDate || !dataStore || !duration) return;

    const interval = duration ?? 60;
    const [startH, startM] = dataStore.openingHours
      .split(" - ")[0]
      .split(":")
      .map(Number);
    const [endH, endM] = dataStore.openingHours
      .split(" - ")[1]
      .split(":")
      .map(Number);
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    let startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (selectedDate === todayStr) {
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      startMinutes = Math.max(startMinutes, nowMinutes);
    }

    const generatedSlots: SlotStatus[] = [];
    let t = startMinutes;
    while (t + interval <= endMinutes) {
      const h1 = Math.floor(t / 60)
        .toString()
        .padStart(2, "0");
      const m1 = (t % 60).toString().padStart(2, "0");
      const h2 = Math.floor((t + interval) / 60)
        .toString()
        .padStart(2, "0");
      const m2 = ((t + interval) % 60).toString().padStart(2, "0");
      const slotTime = `${h1}:${m1} - ${h2}:${m2}`;
      const slotStart = t;
      const slotEnd = t + interval;

      const isFull = dataSlot?.some((a) => {
        const [start, end] = a.slot.split("-").map(toMinute);
        return !(slotEnd <= start || slotStart > end);
      });
      generatedSlots.push({
        time: slotTime,
        full: isFull ?? false,
      });
      t += interval;
    }
    setSlots(generatedSlots);
  }, [selectedDate, dataStore, duration]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate) return;

      const data = await LocSlot(selectedDate, dataStore?.shopId!);
      setDataSlot(data ?? []);
    };
    fetchSlots();
  }, [selectedDate]);

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    const appointment: Appointment = {
      id: uuidv4(),
      shopId: dataStore?.shopId!,
      itemName: appointmentProduct?.name!,
      itemImage: appointmentProduct?.thumbnail!,
      shopName: dataStore?.shopName!,
      customerId: user ?? undefined,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      service: customerInfo.service,
      date: selectedDate,
      slot: selectedSlot,
      status: "Pending",
      duration: duration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: note,
    };
    try {
      await Promise.all([
        UpLoadAppointment(appointment, dataStore?.shopId!, setNotify),
        UpLoadAppointmentForCustomer(
          {
            id: appointment.id,
            shopName: appointment.shopName,
            Address: dataStore?.address,
            itemImage: appointment.itemImage,
            itemName: appointment.itemName,
            service: appointment.service,
            date: appointment.date,
            slot: appointment.slot,
            status: appointment.status,
            createdAt: appointment.createdAt,
            notes: appointment.notes,
            duration: duration,
          },
          setNotify
        )
      ]);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess===true) {
    return <NotifySuccessBooking data={dataStore?.shopName} status={notify} />;
  }

  return (
    <>
      <LoadingOverlay isLoading={isSubmitting} message="Đang đặt lịch hẹn..." />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Đặt lịch hẹn
            </h1>
            <p className="text-gray-600 text-lg">
              Trải nghiệm dịch vụ thời trang đẳng cấp cùng {dataStore?.shopName}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div className="space-y-8">
              <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Thông tin cửa hàng
                </h2>
                <p className="flex items-center gap-2">
                  <MapPin size={18} /> {dataStore?.address}
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={18} /> {dataStore?.openingHours}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={18} /> {dataStore?.phone}
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Sản phẩm
                </h2>
                <div className="flex gap-4 items-center">
                  <img
                    src={appointmentProduct?.thumbnail}
                    alt=""
                    className="w-24 h-24 rounded-xl object-cover border"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {appointmentProduct?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {appointmentProduct?.size}
                    </p>
                    <p className="text-purple-600 font-bold">
                      {appointmentProduct?.price}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Ngày hẹn
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 text-lg transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Dịch vụ
                  </label>
                  <div className="space-y-3">
                    {dataStore?.appointmentServices?.map((s, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setCustomerInfo({ ...customerInfo, service: s.name });
                          setDuration(parseInt(s.duration));
                          setSelectedSlot("");
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${
                        customerInfo.service === s.name
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-gray-800">
                            {s.name}
                          </h3>
                          <span className="text-purple-600 font-bold">
                            {s.price}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{s.description}</p>
                        <p className="text-xs text-gray-500">
                          Thời lượng: {s.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {slots.length > 0 && (
                <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
                  <label className="block mb-4 text-lg font-bold text-gray-800">
                    Chọn khung giờ
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {slots.map((slot) => (
                      <button
                        disabled={slot.full}
                        key={slot.time}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`p-3 rounded-xl font-semibold text-sm transition-all duration-200
                        ${
                          slot.full
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : selectedSlot === slot.time
                            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105"
                            : "bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:shadow-md"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 bg-white rounded-2xl shadow-lg border border-gray-100 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Thông tin của bạn
              </h2>

              {["name", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    {field === "name"
                      ? "Họ và tên *"
                      : field === "email"
                      ? "Email"
                      : "Số điện thoại *"}
                  </label>
                  <input
                    type={
                      field === "email"
                        ? "email"
                        : field === "phone"
                        ? "tel"
                        : "text"
                    }
                    value={customerInfo[field as keyof typeof customerInfo]}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        [field]: e.target.value,
                      })
                    }
                    placeholder={
                      field === "name"
                        ? "Nhập họ tên"
                        : field === "email"
                        ? "example@email.com"
                        : "0901 234 567"
                    }
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 text-lg transition-all"
                  />
                </div>
              ))}
              <span>
                <h1 className="block mb-2 text-sm font-semibold text-gray-700">
                  Ghi Chú
                </h1>
                <textarea placeholder="Quý Khách Có Thể Ghi Chú Cho Cửa Hàng"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-3 border-1 rounded-2xl border-gray-400 outline-none"
                ></textarea>
              </span>

              <button
                disabled={
                  !customerInfo.name ||
                  !customerInfo.phone ||
                  !selectedDate ||
                  !selectedSlot ||
                  !customerInfo.service
                }
                onClick={() => setShowConfirm(true)}
                className="w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition-all disabled:opacity-40"
              >
                Xác nhận lịch hẹn
              </button>

              <p className="text-xs text-gray-500 text-center mt-6">
                * Thông tin bắt buộc. Chúng tôi sẽ liên hệ xác nhận lịch hẹn
                trong vòng 30 phút.
              </p>
            </div>
          </div>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Xác nhận lịch hẹn
              </h2>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li>
                  <strong>Cửa hàng:</strong> {dataStore?.shopName}
                </li>
                <li>
                  <strong>Địa chỉ:</strong> {dataStore?.address}
                </li>
                <li>
                  <strong>Sản phẩm:</strong> {appointmentProduct?.name}
                </li>
                <li>
                  <strong>Dịch vụ:</strong> {customerInfo.service}
                </li>
                <li>
                  <strong>Ngày:</strong> {selectedDate}
                </li>
                <li>
                  <strong>Giờ:</strong> {selectedSlot}
                </li>
                <li>
                  <strong>Khách hàng:</strong> {customerInfo.name}
                </li>
                <li>
                  <strong>SĐT:</strong> {customerInfo.phone}
                </li>
                {customerInfo.email && (
                  <li>
                    <strong>Email:</strong> {customerInfo.email}
                  </li>
                )}
              </ul>

              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-6 py-3 rounded-xl border font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:opacity-90"
                >
                  Hoàn tất
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}
