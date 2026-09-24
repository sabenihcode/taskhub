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
    const companiesRef = collection(db, "companies");
    const q = query(companiesRef, orderBy("name", "asc"));
    const snapshot = await getDocs(q);

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ data: items });
  } catch (error: any) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, code, teamId } = body;

    if (!name) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    const companiesRef = collection(db, "companies");
    const newDoc = await addDoc(companiesRef, {
      name: name.trim(),
      code: code?.trim() || null,
      teamId: teamId || null,
      active: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({ 
      success: true, 
      id: newDoc.id,
      data: { id: newDoc.id, name, code, teamId, active: true }
    });
  } catch (error: any) {
    console.error("Error creating company:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}