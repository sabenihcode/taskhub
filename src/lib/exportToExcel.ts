// src/lib/exportToExcel.ts
import * as XLSX from "xlsx";
import type { Request } from "@/types";
import { formatDate } from "@/lib/utils";

interface LookupMaps {
  companyName: (id?: string | null) => string;
  teamName: (id?: string | null) => string;
  picName: (id?: string | null) => string;
  typeName: (id?: string | null) => string;
}

/**
 * Export requests ke file Excel (.xlsx)
 * @param requests - Array of requests to export
 * @param lookups - Helper functions untuk convert ID ke nama
 * @param filename - Nama file (tanpa .xlsx)
 */
export function exportRequestsToExcel(
  requests: Request[],
  lookups: LookupMaps,
  filename: string = "requests"
): void {
  if (requests.length === 0) {
    alert("No data to export");
    return;
  }

  // ✅ Ubah requests ke format yang bisa di-export
  const data = requests.map((req) => ({
    "Request ID": req.requestId ?? req.id,
    Company: lookups.companyName(req.companyId),
    Team: lookups.teamName(req.teamId),
    "Request Type": lookups.typeName(req.requestTypeId),
    "Subject Email": req.subjectEmail ?? req.applicantName ?? "-",
    "Detail Email": req.detailEmail ?? req.passportNumber ?? "-",
    "PIC Email": lookups.picName(req.picEmailUserId || req.picId),
    Status: req.status,
    Priority: req.priority,
    "Due Date": formatDate(req.dueDate),
    "Current Action": req.currentAction ?? "-",
    "Next Action": req.nextAction ?? "-",
    "Waiting For": req.waitingFor ?? "-",
    "Created At": formatDate(req.createdAt),
    "Last Update": formatDate(req.lastUpdateAt ?? req.updatedAt),
  }));

  // ✅ Buat workbook & worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // ✅ Set column widths untuk readability
  const columnWidths = [
    { wch: 15 }, // Request ID
    { wch: 20 }, // Company
    { wch: 15 }, // Team
    { wch: 15 }, // Request Type
    { wch: 25 }, // Subject Email
    { wch: 25 }, // Detail Email
    { wch: 20 }, // PIC Email
    { wch: 15 }, // Status
    { wch: 10 }, // Priority
    { wch: 12 }, // Due Date
    { wch: 25 }, // Current Action
    { wch: 25 }, // Next Action
    { wch: 15 }, // Waiting For
    { wch: 12 }, // Created At
    { wch: 12 }, // Last Update
  ];
  worksheet["!cols"] = columnWidths;

  // ✅ Style header row (bold, background color)
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "000000" } },
    alignment: { horizontal: "center", vertical: "center" },
  };

  for (let i = 0; i < data.length + 1; i++) {
    const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: i })];
    if (cell) {
      cell.s = headerStyle;
    }
  }

  // ✅ Buat workbook dan export
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");

  // ✅ Generate filename dengan timestamp
  const timestamp = new Date().toISOString().split("T")[0];
  const finalFilename = `${filename}_${timestamp}.xlsx`;

  XLSX.writeFile(workbook, finalFilename);
}

/**
 * Export requests dengan summary stats
 * Membuat 2 sheet: "Summary" dan "Detailed"
 */
export function exportRequestsWithSummary(
  requests: Request[],
  lookups: LookupMaps,
  filename: string = "requests_report"
): void {
  if (requests.length === 0) {
    alert("No data to export");
    return;
  }

  // ✅ SHEET 1: Summary Stats
  const summaryData = [
    { Metric: "Total Requests", Value: requests.length },
    {
      Metric: "By Status",
      Value: "",
    },
    ...Array.from(
      new Map(requests.map((r) => [r.status, 0])).entries()
    ).map(([status]) => ({
      Metric: `  - ${status}`,
      Value: requests.filter((r) => r.status === status).length,
    })),
    { Metric: "", Value: "" },
    {
      Metric: "By Priority",
      Value: "",
    },
    ...Array.from(
      new Map(requests.map((r) => [r.priority, 0])).entries()
    ).map(([priority]) => ({
      Metric: `  - ${priority}`,
      Value: requests.filter((r) => r.priority === priority).length,
    })),
    { Metric: "", Value: "" },
    {
      Metric: "By Company",
      Value: "",
    },
    ...Array.from(
      new Map(requests.map((r) => [r.companyId, 0])).entries()
    ).map(([compId]) => ({
      Metric: `  - ${lookups.companyName(compId)}`,
      Value: requests.filter((r) => r.companyId === compId).length,
    })),
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet["!cols"] = [{ wch: 25 }, { wch: 15 }];

  // ✅ SHEET 2: Detailed
  const detailedData = requests.map((req) => ({
    "Request ID": req.requestId ?? req.id,
    Company: lookups.companyName(req.companyId),
    Team: lookups.teamName(req.teamId),
    "Request Type": lookups.typeName(req.requestTypeId),
    "Subject Email": req.subjectEmail ?? req.applicantName ?? "-",
    "Detail Email": req.detailEmail ?? req.passportNumber ?? "-",
    "PIC Email": lookups.picName(req.picEmailUserId || req.picId),
    Status: req.status,
    Priority: req.priority,
    "Due Date": formatDate(req.dueDate),
    "Current Action": req.currentAction ?? "-",
    "Next Action": req.nextAction ?? "-",
    "Waiting For": req.waitingFor ?? "-",
    "Created At": formatDate(req.createdAt),
    "Last Update": formatDate(req.lastUpdateAt ?? req.updatedAt),
  }));

  const detailedSheet = XLSX.utils.json_to_sheet(detailedData);
  const columnWidths = [
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 25 },
    { wch: 25 },
    { wch: 20 },
    { wch: 15 },
    { wch: 10 },
    { wch: 12 },
    { wch: 25 },
    { wch: 25 },
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
  ];
  detailedSheet["!cols"] = columnWidths;

  // ✅ Buat workbook dengan 2 sheets
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
  XLSX.utils.book_append_sheet(workbook, detailedSheet, "Detailed");

  const timestamp = new Date().toISOString().split("T")[0];
  const finalFilename = `${filename}_${timestamp}.xlsx`;

  XLSX.writeFile(workbook, finalFilename);
}