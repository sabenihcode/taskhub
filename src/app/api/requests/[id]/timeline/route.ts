import { NextRequest } from "next/server";
import { db } from "@/lib/firebase/config";
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from "firebase/firestore";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ id: string }>;
}

// GET: Get timeline for a request
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    
    const timelineRef = collection(db, "timeline");
    const q = query(
      timelineRef,
      where("requestId", "==", id),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const rows = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
      };
    });

    return Response.json(rows);
  } catch (error: any) {
    console.error("Error fetching timeline:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add timeline event/comment
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { message, actorId, actorName, action } = body;

    if (!message?.trim()) {
      return Response.json({ error: "Message required" }, { status: 400 });
    }

    const timelineRef = collection(db, "timeline");
    const newDoc = await addDoc(timelineRef, {
      requestId: id,
      actorId: actorId || "unknown",
      actorName: actorName || "User",
      action: action || "comment",
      message: message.trim(),
      createdAt: Timestamp.now(),
    });

    return Response.json({
      id: newDoc.id,
      requestId: id,
      message: message.trim(),
      action: action || "comment",
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error creating timeline event:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}