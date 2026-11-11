import type { filterSLot } from "../types/type";

export type SlotStatus = {
  time: string;
  full: boolean;
};

function toMinutes(slotStr: string): number {
  const [hours, minutes] = slotStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (totalMinutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function generateAppointmentSlots(
  openingHours: string,
  selectedDate: string,
  duration: number,
  bookedSlots: filterSLot[] | undefined
): SlotStatus[] {
  const interval = duration || 60;
  const [openStart, openEnd] = openingHours.split(" - ");
  let startMinutes = toMinutes(openStart);
  const endMinutes = toMinutes(openEnd);

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  if (selectedDate === todayStr) {
    startMinutes = Math.max(
      startMinutes,
      now.getHours() * 60 + now.getMinutes()
    );
  }

  const slots: SlotStatus[] = [];
  for (let t = startMinutes; t + interval <= endMinutes; t += interval) {
    const slotStart = t;
    const slotEnd = t + interval;
    const isFull =
      bookedSlots?.some((a) => {
        const [start, end] = a.slot.split("-").map(toMinutes);
        return !(slotEnd <= start || slotStart > end);
      }) ?? false;

    slots.push({
      time: `${formatMinutes(slotStart)} - ${formatMinutes(slotEnd)}`,
      full: isFull,
    });
  }

  return slots;
}

