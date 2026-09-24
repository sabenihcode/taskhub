import { NextRequest } from "next/server";
import { db } from "@/lib/firebase/config";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const activeStatuses = [
      "New", 
      "Acknowledged", 
      "Waiting Document", 
      "Processing", 
      "Submitted", 
      "Waiting Approval", 
      "Follow Up", 
      "On Hold"
    ];

    const requestsRef = collection(db, "requests");
    
    // Get requests where user is PIC, backup, or supervisor
    const queries = [
      query(
        requestsRef,
        where("picId", "==", userId),
        where("status", "in", activeStatuses),
        orderBy("dueDate", "desc")
      ),
      // Note: Firebase doesn't allow multiple 'in' or inequality filters
      // So we'll do client-side filtering for backup and supervisor
    ];

    const allRequests: any[] = [];

    // Fetch by picId
    const picSnapshot = await getDocs(queries[0]);
    picSnapshot.forEach((doc) => {
      const data = doc.data();
      allRequests.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
        dueDate: data.dueDate?.toDate?.()?.toISOString() || null,
        lastUpdateAt: data.lastUpdateAt?.toDate?.()?.toISOString() || null,
      });
    });

    // Fetch all active requests and filter by backupPicId or supervisorId
    const allActiveQuery = query(
      requestsRef,
      where("status", "in", activeStatuses)
    );
    const allActiveSnapshot = await getDocs(allActiveQuery);
    
    allActiveSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Skip if already added (as PIC)
      if (data.picId === userId) return;
      
      // Add if user is backup or supervisor
      if (data.backupPicId === userId || data.supervisorId === userId) {
        allRequests.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
          dueDate: data.dueDate?.toDate?.()?.toISOString() || null,
          lastUpdateAt: data.lastUpdateAt?.toDate?.()?.toISOString() || null,
        });
      }
    });

    return Response.json(allRequests);
  } catch (error: any) {
    console.error("Error fetching my work:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}