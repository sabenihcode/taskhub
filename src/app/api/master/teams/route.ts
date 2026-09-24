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
    const teamsRef = collection(db, "teams");
    const q = query(teamsRef, orderBy("name", "asc"));
    const snapshot = await getDocs(q);

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // PENTING: Return dengan wrapper { data: [...] }
    return NextResponse.json({ data: items });
  } catch (error: any) {
    console.error("Error fetching teams:", error);
    return NextResponse.json({ data: [] }); // Empty array juga di-wrap
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, code } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const teamsRef = collection(db, "teams");
    const newDoc = await addDoc(teamsRef, {
      name: name.trim(),
      code: code?.trim() || null,
      active: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({ 
      success: true, 
      id: newDoc.id,
      data: { id: newDoc.id, name, code, active: true }
    });
  } catch (error: any) {
    console.error("Error creating team:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}