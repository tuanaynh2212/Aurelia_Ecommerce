import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Phone } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { type Appointment, type filterSLot, type Shop } from "../../types/type";
import { StoreContext } from "../../contexts/Store";
import { AppointmentContext } from "../../contexts/AppointmentContext";
import {
  generateAppointmentSlots,
  type SlotStatus,
} from "../../utils/appointmentSlots";
import { NotifySuccessBooking } from "../NotifySuccessBooking";
import { Navbar } from "../HomeLayoutComponent/Navbar";
import { Footer } from "../HomeLayoutComponent/Footer";
import { LoadingOverlay } from "../LoadingOverlay";
import {
  BookingMobileConfirmModal,
  BookingTicketPreview,
} from "./BookingTicketPreview";

const INPUT_CLASS =
  "w-full min-h-[48px] p-3.5 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] font-mono text-xs text-[var(--color-ink)] focus:bg-[var(--color-volt)]/15 focus:shadow-[var(--shadow-hard-sm)] outline-none transition-all";

const CUSTOMER_FIELDS = [
  { key: "name", label: "Họ và tên *", type: "text", placeholder: "Nhập họ tên" },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "example@email.com",
  },
  {
    key: "phone",
    label: "Số điện thoại *",
    type: "tel",
    placeholder: "0901 234 567",
  },
] as const;

export default function BookingForm() {
  const { id } = useParams();
  const { GetStoreById, appointmentProduct } = useContext(StoreContext);
  const { UpLoadAppointment, UpLoadAppointmentForCustomer, LocSlot } =
    useContext(AppointmentContext);

  const [dataStore, setDataStore] = useState<Shop>();
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<SlotStatus[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [duration, setDuration] = useState(60);
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState("");
  const [dataSlot, setDataSlot] = useState<filterSLot[]>();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = localStorage.getItem("user");

  useEffect(() => {
    if (id) GetStoreById(id, setDataStore);
  }, [id, GetStoreById]);

  useEffect(() => {
    if (!selectedDate || !dataStore || !duration) return;
    setSlots(
      generateAppointmentSlots(
        dataStore.openingHours,
        selectedDate,
        duration,
        dataSlot
      )
    );
  }, [selectedDate, dataStore, duration, dataSlot]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || !dataStore?.shopId) return;
      const data = await LocSlot(selectedDate, dataStore.shopId);
      setDataSlot(data ?? []);
    };
    fetchSlots();
  }, [selectedDate, dataStore?.shopId, LocSlot]);

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    const nowIso = new Date().toISOString();
    const appointment: Appointment = {
      id: uuidv4(),
      shopId: dataStore?.shopId || "",
      itemName: appointmentProduct?.name || "",
      itemImage: appointmentProduct?.thumbnail || "",
      shopName: dataStore?.shopName || "",
      customerId: user ?? undefined,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      service: customerInfo.service,
      date: selectedDate,
      slot: selectedSlot,
      status: "Pending",
      duration,
      createdAt: nowIso,
      updatedAt: nowIso,
      notes: note,
    };

    try {
      await Promise.all([
        UpLoadAppointment(appointment, dataStore?.shopId || "", setNotify),
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
            duration,
          },
          setNotify
        ),
      ]);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <NotifySuccessBooking data={dataStore?.shopName} status={notify} />;
  }

  const previewProps = {
    showConfirm,
    shopName: dataStore?.shopName,
    address: dataStore?.address,
    productName: appointmentProduct?.name,
    service: customerInfo.service,
    selectedDate,
    selectedSlot,
    duration,
    customerName: customerInfo.name,
    customerPhone: customerInfo.phone,
    customerEmail: customerInfo.email,
    onBack: () => setShowConfirm(false),
    onConfirm: handleConfirm,
  };

  return (
    <>
      <LoadingOverlay
        isLoading={isSubmitting}
        message="Đang đặt lịch hẹn..."
      />
      <Navbar />
      <div className="min-h-screen bg-[var(--color-bone)]/85 text-[var(--color-ink)] py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
          <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] p-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
                  [TICKET BOOTH // MEET & GREET]
                </span>
                <span className="mono-label text-[var(--color-ink-muted)]">
                  PRIVATE FITTING APPOINTMENT
                </span>
              </div>
              <h1 className="display-l font-display-safe text-[var(--color-ink)]">
                Đặt lịch hẹn
              </h1>
              <p className="text-xs font-mono text-[var(--color-ink-muted)] mt-1">
                Trải nghiệm dịch vụ thời trang đẳng cấp cùng{" "}
                <strong className="text-[var(--color-ink)]">
                  {dataStore?.shopName}
                </strong>
              </p>
            </div>
            <div className="text-left md:text-right mono-label text-[var(--color-ink-muted)] space-y-1">
              <p className="flex items-center md:justify-end gap-2 text-[var(--color-ink)]">
                <MapPin size={14} className="text-[var(--color-flash)]" />{" "}
                {dataStore?.address}
              </p>
              <p className="flex items-center md:justify-end gap-2">
                <Clock size={14} /> {dataStore?.openingHours} ·{" "}
                <Phone size={14} /> {dataStore?.phone}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <section className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] p-6 space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[var(--color-ink)] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[var(--color-ink)] text-[var(--color-paper)] mono-label">
                      01
                    </span>
                    <h2 className="font-display-safe font-extrabold text-base uppercase">
                      Dịch vụ & Sản phẩm thử
                    </h2>
                  </div>
                  <span className="mono-label text-[var(--color-ink-muted)]">
                    [SERVICE TIER]
                  </span>
                </div>

                {appointmentProduct && (
                  <div className="flex gap-4 items-center p-3 border-2 border-[var(--color-ink)] bg-[var(--color-bone)]">
                    <img
                      src={appointmentProduct?.thumbnail}
                      alt={appointmentProduct?.name || ""}
                      className="w-20 h-24 object-cover border-2 border-[var(--color-ink)] bg-[var(--color-paper)]"
                    />
                    <div>
                      <span className="mono-label text-[var(--color-ink-muted)]">
                        [RESERVED GARMENT]
                      </span>
                      <h3 className="font-display-safe font-extrabold text-sm uppercase text-[var(--color-ink)]">
                        {appointmentProduct?.name}
                      </h3>
                      <p className="mono-label text-[var(--color-ink-muted)] mt-0.5">
                        CỠ: {appointmentProduct?.size}
                      </p>
                      <p className="font-mono font-extrabold text-sm text-[var(--color-flash)] mt-1">
                        {appointmentProduct?.price}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {dataStore?.appointmentServices?.map((s, i) => {
                    const active = customerInfo.service === s.name;
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          setCustomerInfo({ ...customerInfo, service: s.name });
                          setDuration(parseInt(s.duration));
                          setSelectedSlot("");
                        }}
                        className={`min-h-[64px] p-4 border-2 border-[var(--color-ink)] cursor-pointer transition-all ${
                          active
                            ? "bg-[var(--color-volt)]/35 shadow-[var(--shadow-hard)]"
                            : "bg-[var(--color-paper)] hover:bg-[var(--color-bone)]"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-display-safe font-extrabold text-sm uppercase text-[var(--color-ink)]">
                            {s.name}
                          </h3>
                          <span className="px-2 py-0.5 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] font-mono font-extrabold text-xs text-[var(--color-flash)]">
                            {s.price}
                          </span>
                        </div>
                        <p className="text-xs font-sans text-[var(--color-ink-muted)] mt-1">
                          {s.description}
                        </p>
                        <p className="mono-label text-[10px] text-[var(--color-ink)] mt-1.5">
                          THỜI LƯỢNG: {s.duration}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] p-6 space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[var(--color-ink)] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[var(--color-ink)] text-[var(--color-paper)] mono-label">
                      02
                    </span>
                    <h2 className="font-display-safe font-extrabold text-base uppercase">
                      Ngày hẹn · Calendar Grid
                    </h2>
                  </div>
                  <Calendar size={16} className="text-[var(--color-flash)]" />
                </div>

                <div>
                  <label className="block mb-1.5 mono-label text-[var(--color-ink)]">
                    CHỌN NGÀY THỬ ĐỒ TẠI STUDIO
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
              </section>

              <section className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] p-6 space-y-5">
                <div className="flex items-center justify-between border-b-2 border-[var(--color-ink)] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[var(--color-ink)] text-[var(--color-paper)] mono-label">
                      03
                    </span>
                    <h2 className="font-display-safe font-extrabold text-base uppercase">
                      Khung Giờ & Thông Tin Khách Hàng
                    </h2>
                  </div>
                  <span className="mono-label text-[var(--color-ink-muted)]">
                    [SEAT MAP]
                  </span>
                </div>

                {slots.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="mono-label text-[var(--color-ink)]">
                        CHỌN KHUNG GIỜ TRỐNG
                      </label>
                      <div className="flex items-center gap-3 mono-label text-[10px]">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-3 h-3 border border-[var(--color-ink)] bg-[var(--color-paper)] inline-block" />
                          TRỐNG
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="w-3 h-3 border border-[var(--color-ink)] bg-[var(--color-volt)] inline-block" />
                          ĐANG CHỌN
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="w-3 h-3 border border-[var(--color-ink)] bg-[var(--color-fog)] inline-block" />
                          ĐÃ ĐẦY
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {slots.map((slot) => (
                        <button
                          type="button"
                          disabled={slot.full}
                          key={slot.time}
                          onClick={() => setSelectedSlot(slot.time)}
                          className={`min-h-[48px] px-3 py-2 border-2 border-[var(--color-ink)] font-mono font-extrabold text-xs transition-all cursor-pointer ${
                            slot.full
                              ? "bg-[var(--color-fog)] text-[var(--color-ink-muted)] strike-diagonal cursor-not-allowed"
                              : selectedSlot === slot.time
                              ? "bg-[var(--color-volt)] text-[var(--color-ink)] shadow-[var(--shadow-hard-sm)]"
                              : "bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-bone)]"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-2 border-t-2 border-dashed border-[var(--color-ink)]">
                  {CUSTOMER_FIELDS.map((field) => (
                    <div key={field.key}>
                      <label className="block mb-1.5 mono-label text-[var(--color-ink)]">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={customerInfo[field.key]}
                        onChange={(e) =>
                          setCustomerInfo({
                            ...customerInfo,
                            [field.key]: e.target.value,
                          })
                        }
                        placeholder={field.placeholder}
                        className={INPUT_CLASS}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block mb-1.5 mono-label text-[var(--color-ink)]">
                      Ghi Chú
                    </label>
                    <textarea
                      placeholder="Quý Khách Có Thể Ghi Chú Cho Cửa Hàng"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      className="w-full p-3.5 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] font-mono text-xs text-[var(--color-ink)] outline-none focus:bg-[var(--color-volt)]/15"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={
                      !customerInfo.name ||
                      !customerInfo.phone ||
                      !selectedDate ||
                      !selectedSlot ||
                      !customerInfo.service
                    }
                    onClick={() => setShowConfirm(true)}
                    className="w-full min-h-[52px] px-6 py-4 border-2 border-[var(--color-ink)] bg-[var(--color-flash)] text-[var(--color-paper)] shadow-[var(--shadow-hard)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[var(--shadow-hard-lg)] font-mono font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Xác nhận lịch hẹn
                  </button>

                  <p className="mono-label text-[10px] text-[var(--color-ink-muted)] text-center">
                    * Thông tin bắt buộc. Chúng tôi sẽ liên hệ xác nhận lịch hẹn
                    trong vòng 30 phút.
                  </p>
                </div>
              </section>
            </div>

            <BookingTicketPreview {...previewProps} />
          </div>
        </div>

        <BookingMobileConfirmModal {...previewProps} />
      </div>
      <Footer />
    </>
  );
}
