import { NextRequest } from "next/server";
import { db } from "@/lib/firebase/config";
import { 
  doc, 
  getDoc,
  updateDoc, 
  collection,
  addDoc,
  Timestamp 
} from "firebase/firestore";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { picId, backupPicId, supervisorId, teamId, companyId, actorId, actorName } = body;

    const docRef = doc(db, "requests", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const oldData = docSnap.data();
    const updateData: any = {
      updatedAt: Timestamp.now(),
      lastUpdateAt: Timestamp.now(),
    };

    if (picId !== undefined) updateData.picId = picId || null;
    if (backupPicId !== undefined) updateData.backupPicId = backupPicId || null;
    if (supervisorId !== undefined) updateData.supervisorId = supervisorId || null;
    if (teamId !== undefined) updateData.teamId = teamId || null;
    if (companyId !== undefined) updateData.companyId = companyId || null;

    await updateDoc(docRef, updateData);

    // Create timeline event
    if (picId !== undefined && picId !== oldData.picId) {
      let picName = "Unknown";
      if (picId) {
        const picDoc = await getDoc(doc(db, "users", picId));
        if (picDoc.exists()) {
          picName = picDoc.data().name;
        }
      }

      const timelineRef = collection(db, "timeline");
      await addDoc(timelineRef, {
        requestId: id,
        actorId: actorId || "system",
        actorName: actorName || "System",
        action: "assigned",
        message: picId ? `Ditugaskan ke ${picName}` : "Penugasan PIC dihapus",
        createdAt: Timestamp.now(),
      });
    }

    return Response.json({
      success: true,
      message: "Assignment updated successfully",
    });
  } catch (error: any) {
    console.error("Error assigning request:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}