import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // firebase-admin requires Node.js runtime

// GET: List requests with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const teamId = searchParams.get("teamId");
    const companyId = searchParams.get("companyId");
    const picId = searchParams.get("picId");
    const search = searchParams.get("search");

    // ✅ Verify auth token
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    await auth.verifyIdToken(token);

    // ✅ Use type any for query to avoid TypeScript issues
    let query: any = db.collection("requests");

    // Apply filters
    if (status && status !== "ALL") {
      query = query.where("status", "==", status);
    }
    if (priority && priority !== "ALL") {
      query = query.where("priority", "==", priority);
    }
    if (teamId && teamId !== "ALL") {
      query = query.where("teamId", "==", teamId);
    }
    if (companyId && companyId !== "ALL") {
      query = query.where("companyId", "==", companyId);
    }
    if (picId && picId !== "ALL") {
      query = query.where("picId", "==", picId);
    }

    // Order by createdAt descending
    query = query.orderBy("createdAt", "desc").limit(50);

    const snapshot = await query.get();

    // ✅ Type cast items to any to avoid strict typing
    let items: any[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
        dueDate: data.dueDate?.toDate?.()?.toISOString() || null,
        arrivalDate: data.arrivalDate?.toDate?.()?.toISOString() || null,
        lastUpdateAt: data.lastUpdateAt?.toDate?.()?.toISOString() || null,
      };
    });

    // Client-side search filter
    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter((r: any) =>
        r.title?.toLowerCase().includes(searchLower) ||
        r.requestId?.toLowerCase().includes(searchLower) ||
        r.applicantName?.toLowerCase().includes(searchLower)
      );
    }

    // Fetch related data in parallel
    const enriched = await Promise.all(
      items.map(async (item: any) => {
        const result: any = { ...item };

        try {
          if (item.teamId) {
            const teamDoc = await db.collection("teams").doc(item.teamId).get();
            if (teamDoc.exists) {
              result.team = { id: teamDoc.id, ...teamDoc.data() };
            }
          }

          if (item.companyId) {
            const companyDoc = await db.collection("companies").doc(item.companyId).get();
            if (companyDoc.exists) {
              result.company = { id: companyDoc.id, ...companyDoc.data() };
            }
          }

          if (item.picId) {
            const picDoc = await db.collection("users").doc(item.picId).get();
            if (picDoc.exists) {
              result.pic = { id: picDoc.id, ...picDoc.data() };
            }
          }

          if (item.requestTypeId) {
            const typeDoc = await db.collection("requestTypes").doc(item.requestTypeId).get();
            if (typeDoc.exists) {
              result.requestType = { id: typeDoc.id, ...typeDoc.data() };
            }
          }
        } catch (error) {
          console.error("Error fetching related data:", error);
        }

        return result;
      })
    );

    return NextResponse.json({ items: enriched, total: enriched.length });
  } catch (error: any) {
    console.error("Requests GET error:", error);
    return NextResponse.json({ items: [], total: 0, error: error.message }, { status: 500 });
  }
}

// POST: Create new request
export async function POST(req: NextRequest) {
  try {
    // Verify auth
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await auth.verifyIdToken(token);

    const body = await req.json();

    const newDoc = await db.collection("requests").add({
      ...body,
      status: body.status || "New",
      requesterId: decoded.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastUpdateAt: new Date(),
    });

    // Create timeline event
    await db.collection("timeline").add({
      requestId: newDoc.id,
      actorId: decoded.uid,
      actorName: decoded.name || decoded.email,
      action: "created",
      message: `Request dibuat`,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: newDoc.id,
      message: "Request created successfully",
    });
  } catch (error: any) {
    console.error("Requests POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}