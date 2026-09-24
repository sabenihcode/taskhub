import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const requestsRef = collection(db, "requests");
    const querySnapshot = await getDocs(requestsRef);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const terminalStatuses = ["Completed", "Cancelled"];

    let total = 0;
    let newCount = 0;
    let waitingDocument = 0;
    let processing = 0;
    let submitted = 0;
    let waitingApproval = 0;
    let followUp = 0;
    let completed = 0;
    let cancelled = 0;
    let onHold = 0;
    let overdue = 0;
    let noUpdate3Days = 0;
    let completedThisMonth = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const status = data.status || "New";
      total++;

      switch (status) {
        case "New": newCount++; break;
        case "Waiting Document": waitingDocument++; break;
        case "Processing": processing++; break;
        case "Submitted": submitted++; break;
        case "Waiting Approval": waitingApproval++; break;
        case "Follow Up": followUp++; break;
        case "Completed": completed++; break;
        case "Cancelled": cancelled++; break;
        case "On Hold": onHold++; break;
      }

      // Overdue check
      const dueDate = data.dueDate?.toDate?.() || (data.dueDate ? new Date(data.dueDate) : null);
      if (dueDate && dueDate < now && !terminalStatuses.includes(status)) {
        overdue++;
      }

      // No update 3 days check
      const lastUpdate = data.lastUpdateAt?.toDate?.() || data.updatedAt?.toDate?.();
      if (lastUpdate && lastUpdate < threeDaysAgo && !terminalStatuses.includes(status)) {
        noUpdate3Days++;
      }

      // Completed this month
      if (status === "Completed" && lastUpdate && lastUpdate >= startOfMonth) {
        completedThisMonth++;
      }
    });

    return NextResponse.json({
      total,
      new: newCount,
      waitingDocument,
      processing,
      submitted,
      waitingApproval,
      followUp,
      completed,
      cancelled,
      onHold,
      overdue,
      noUpdate3Days,
      completedThisMonth,
    });
  } catch (error: any) {
    console.error("Stats error:", error);
    return NextResponse.json({
      total: 0,
      new: 0,
      waitingDocument: 0,
      processing: 0,
      submitted: 0,
      waitingApproval: 0,
      followUp: 0,
      completed: 0,
      cancelled: 0,
      onHold: 0,
      overdue: 0,
      noUpdate3Days: 0,
      completedThisMonth: 0,
    });
  }
}