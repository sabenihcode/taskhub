import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { 
  collection, 
  getDocs,
  query,
  orderBy 
} from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("name", "asc"));
    const snapshot = await getDocs(q);

    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        role: data.role || "user",
        teamId: data.teamId || null,
        position: data.position || null,
        active: data.active !== false,
      };
    });

    return NextResponse.json({ data: items });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ data: [] });
  }
}