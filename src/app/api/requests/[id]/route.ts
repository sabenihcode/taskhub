import { NextRequest } from "next/server";
import { db } from "@/lib/firebase/config";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  addDoc,
  Timestamp 
} from "firebase/firestore";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ id: string }>;
}

// Helper: Fetch related data (same as in route.ts)
async function fetchRelatedData(requestData: any) {
  const result: any = { ...requestData };
  
  try {
    // Fetch requester
    if (requestData.requesterId) {
      const userDoc = await getDoc(doc(db, "users", requestData.requesterId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        result.requester = {
          id: userDoc.id,
          name: data.name,
          email: data.email,
          role: data.role,
        };
      }
    }
    
    // Fetch PIC
    if (requestData.picId) {
      const userDoc = await getDoc(doc(db, "users", requestData.picId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        result.pic = {
          id: userDoc.id,
          name: data.name,
          email: data.email,
          role: data.role,
          teamId: data.teamId,
        };
      }
    }
    
    // Fetch backup PIC
    if (requestData.backupPicId) {
      const userDoc = await getDoc(doc(db, "users", requestData.backupPicId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        result.backupPic = {
          id: userDoc.id,
          name: data.name,
          email: data.email,
          role: data.role,
        };
      }
    }
    
    // Fetch supervisor
    if (requestData.supervisorId) {
      const userDoc = await getDoc(doc(db, "users", requestData.supervisorId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        result.supervisor = {
          id: userDoc.id,
          name: data.name,
          email: data.email,
          role: data.role,
        };
      }
    }
    
    // Fetch company
    if (requestData.companyId) {
      const companyDoc = await getDoc(doc(db, "companies", requestData.companyId));
      if (companyDoc.exists()) {
        const data = companyDoc.data();
        result.company = {
          id: companyDoc.id,
          name: data.name,
          code: data.code,
          teamId: data.teamId,
        };
      }
    }
    
    // Fetch request type
    if (requestData.requestTypeId) {
      const typeDoc = await getDoc(doc(db, "requestTypes", requestData.requestTypeId));
      if (typeDoc.exists()) {
        const data = typeDoc.data();
        result.requestType = {
          id: typeDoc.id,
          name: data.name,
          category: data.category,
        };
      }
    }
    
    // Fetch team
    if (requestData.teamId) {
      const teamDoc = await getDoc(doc(db, "teams", requestData.teamId));
      if (teamDoc.exists()) {
        const data = teamDoc.data();
        result.team = {
          id: teamDoc.id,
          code: data.code,
          name: data.name,
        };
      }
    }
  } catch (error) {
    console.error("Error fetching related data:", error);
  }
  
  return result;
}

// GET: Get single request with related data
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const docRef = doc(db, "requests", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const data = docSnap.data();
    const requestData = {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
      dueDate: data.dueDate?.toDate?.()?.toISOString() || null,
      arrivalDate: data.arrivalDate?.toDate?.()?.toISOString() || null,
      lastUpdateAt: data.lastUpdateAt?.toDate?.()?.toISOString() || null,
    };

    // Fetch related data
    const result = await fetchRelatedData(requestData);

    return Response.json(result);
  } catch (error: any) {
    console.error("Request GET error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update request
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();

    const docRef = doc(db, "requests", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const oldData = docSnap.data();
    const oldStatus = oldData.status;
    const oldPicId = oldData.picId;

    // Prepare update data
    const updateData: any = {
      updatedAt: Timestamp.now(),
      lastUpdateAt: Timestamp.now(),
    };

    // String fields
    const stringFields = [
      "title",
      "description",
      "applicantName",
      "passportNumber",
      "nationality",
      "applicantPosition",
      "department",
      "currentImmigrationStatus",
      "currentAction",
      "nextAction",
      "missingDocument",
    ];

    for (const field of stringFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]?.trim() || null;
      }
    }

    // ID fields
    const idFields = [
      "companyId",
      "requestTypeId",
      "teamId",
      "picId",
      "backupPicId",
      "supervisorId",
    ];

    for (const field of idFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field] || null;
      }
    }

    // Other fields
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.waitingFor !== undefined) updateData.waitingFor = body.waitingFor || null;

    // Date fields
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? Timestamp.fromDate(new Date(body.dueDate)) : null;
    }
    if (body.arrivalDate !== undefined) {
      updateData.arrivalDate = body.arrivalDate ? Timestamp.fromDate(new Date(body.arrivalDate)) : null;
    }

    // Update request
    await updateDoc(docRef, updateData);

    // Create timeline events
    const timelineRef = collection(db, "timeline");
    const actorId = body.actorId || "system";
    const actorName = body.actorName || "System";

    // Status change event
    if (body.status && body.status !== oldStatus) {
      await addDoc(timelineRef, {
        requestId: id,
        actorId,
        actorName,
        action: "status_changed",
        message: `Status berubah dari ${oldStatus} menjadi ${body.status}`,
        createdAt: Timestamp.now(),
      });
    }

    // PIC assignment change event
    const newPicId = body.picId === undefined ? oldPicId : body.picId;
    if (body.picId !== undefined && newPicId !== oldPicId) {
      let picName = "Unknown";
      if (newPicId) {
        const picDoc = await getDoc(doc(db, "users", newPicId));
        if (picDoc.exists()) {
          picName = picDoc.data().name;
        }
      }

      await addDoc(timelineRef, {
        requestId: id,
        actorId,
        actorName,
        action: "assigned",
        message: newPicId ? `Ditugaskan ke ${picName}` : "Penugasan PIC dihapus",
        createdAt: Timestamp.now(),
      });
    }

    return Response.json({
      id,
      ...updateData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Request PATCH error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete request
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const docRef = doc(db, "requests", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await deleteDoc(docRef);

    return Response.json({ ok: true });
  } catch (error: any) {
    console.error("Request DELETE error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}