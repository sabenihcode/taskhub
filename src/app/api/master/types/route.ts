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
    const typesRef = collection(db, "requestTypes");
    const q = query(typesRef, orderBy("name", "asc"));
    const snapshot = await getDocs(q);

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ data: items });
  } catch (error: any) {
    console.error("Error fetching request types:", error);
    return NextResponse.json({ data: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category } = body;

    if (!name) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    const typesRef = collection(db, "requestTypes");
    const newDoc = await addDoc(typesRef, {
      name: name.trim(),
      category: category?.trim() || null,
      active: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({ 
      success: true, 
      id: newDoc.id,
      data: { id: newDoc.id, name, category, active: true }
    });
  } catch (error: any) {
    console.error("Error creating request type:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}