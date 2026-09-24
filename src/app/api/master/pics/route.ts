import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { 
  collection, 
  getDocs, 
  addDoc,
  query,
  orderBy,
  Timestamp 
} from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const picsRef = collection(db, "pics");
    const q = query(picsRef, orderBy("name", "asc"));
    const snapshot = await getDocs(q);

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ data: items });
  } catch (error: any) {
    console.error("Error fetching PICs:", error);
    return NextResponse.json({ data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, teamId } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const picsRef = collection(db, "pics");
    const newDoc = await addDoc(picsRef, {
      name,
      email,
      teamId: teamId || null,
      active: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({ 
      success: true, 
      id: newDoc.id,
      data: { id: newDoc.id, name, email, teamId, active: true }
    });
  } catch (error: any) {
    console.error("Error creating PIC:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}