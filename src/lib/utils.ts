import type { Request } from "@/types";

const DAY_MS = 24 * 60 * 60 * 1000;
const PLAIN_DATE = /^\d{4}-\d{2}-\d{2}$/;

const pad = (n: number) => String(n).padStart(2, "0");

function localYmd(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Hari ini dalam format YYYY-MM-DD (zona waktu lokal) */
export function todayIsoDate(): string {
  return localYmd(new Date());
}

/** Hari ini + N hari, format YYYY-MM-DD */
export function addDaysIsoDate(days: number): string {
  return localYmd(new Date(Date.now() + days * DAY_MS));
}

/** ISO string / "YYYY-MM-DD" -> "YYYY-MM-DD" (aman untuk <input type="date">) */
export function toDateInputValue(iso?: string | null): string {
  if (!iso) return "";
  if (PLAIN_DATE.test(iso)) return iso;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : localYmd(d);
}

/** Untuk tampilan tanggal di tabel / detail */
export function formatDate(iso?: string | null): string {
  return toDateInputValue(iso) || "-";
}

/** Untuk tampilan timeline: "YYYY-MM-DD HH:mm" */
export function formatDateTime(iso?: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${localYmd(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function isClosed(r: Pick<Request, "status">): boolean {
  return r.status === "Completed" || r.status === "Cancelled";
}

/** Lewat due date (dihitung sampai akhir hari due date) dan belum ditutup */
export function isOverdue(r: Request): boolean {
  if (isClosed(r) || !r.dueDate) return false;
  const due = new Date(r.dueDate);
  if (Number.isNaN(due.getTime())) return false;
  due.setHours(23, 59, 59, 999);
  return due.getTime() < Date.now();
}

/** Belum ada update > 3 hari dan belum ditutup */
export function isNoUpdate(r: Request): boolean {
  if (isClosed(r)) return false;
  const last = r.lastUpdateAt ?? r.updatedAt ?? r.createdAt;
  if (!last) return false;
  const t = new Date(last).getTime();
  return !Number.isNaN(t) && Date.now() - t > 3 * DAY_MS;
}