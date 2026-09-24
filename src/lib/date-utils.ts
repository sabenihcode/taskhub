export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function timeAgo(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay < 7) return `${diffDay} hari lalu`;
  if (diffWeek < 4) return `${diffWeek} minggu lalu`;
  if (diffMonth < 12) return `${diffMonth} bulan lalu`;
  
  return formatDate(date);
}

export function dueDateStatus(date: Date | string | null | undefined): {
  text: string;
  variant: "default" | "warning" | "danger";
} {
  if (!date) {
    return { text: "Tidak ada deadline", variant: "default" };
  }

  const dueDate = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { 
      text: `Terlambat ${Math.abs(diffDays)} hari`, 
      variant: "danger" 
    };
  }

  if (diffDays === 0) {
    return { text: "Jatuh tempo hari ini", variant: "danger" };
  }

  if (diffDays === 1) {
    return { text: "Jatuh tempo besok", variant: "warning" };
  }

  if (diffDays <= 3) {
    return { text: `${diffDays} hari lagi`, variant: "warning" };
  }

  if (diffDays <= 7) {
    return { text: `${diffDays} hari lagi`, variant: "default" };
  }

  return { text: formatDate(date), variant: "default" };
}

export function isOverdue(date: Date | string | null | undefined): boolean {
  if (!date) return false;
  const dueDate = typeof date === "string" ? new Date(date) : date;
  return dueDate < new Date();
}