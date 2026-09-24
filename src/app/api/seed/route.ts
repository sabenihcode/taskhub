import { NextRequest } from "next/server";
import { db } from "@/lib/firebase/config";
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  Timestamp 
} from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  try {
    // 1. Seed Teams
    const teamsRef = collection(db, "teams");
    const teamData = [
      { code: "VDNI", name: "VDNI/GNI", active: true },
      { code: "NNI", name: "NNI & Others", active: true },
    ];
    const teamRows: any[] = [];

    for (const t of teamData) {
      const q = query(teamsRef, where("code", "==", t.code));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        teamRows.push({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        const newDoc = await addDoc(teamsRef, {
          ...t,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        teamRows.push({ id: newDoc.id, ...t });
      }
    }

    // 2. Seed Companies
    const companiesRef = collection(db, "companies");
    const companyData = [
      { name: "PT VDNI", code: "VDNI", teamId: teamRows[0].id, active: true },
      { name: "PT GNI", code: "GNI", teamId: teamRows[0].id, active: true },
      { name: "PT NNI", code: "NNI", teamId: teamRows[1].id, active: true },
    ];
    const companyRows: any[] = [];

    for (const c of companyData) {
      const q = query(companiesRef, where("name", "==", c.name));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        companyRows.push({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        const newDoc = await addDoc(companiesRef, {
          ...c,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        companyRows.push({ id: newDoc.id, ...c });
      }
    }

    // 3. Seed Request Types
    const typesRef = collection(db, "requestTypes");
    const typeNames = [
      "Visa", "ITK", "ITAS", "KITAS", "IMTA", "RPTKA", "Extension",
      "Change of Sponsor", "Cancellation", "Reporting", "Exit Permit",
      "Re-entry Permit", "Other",
    ];
    const typesRows: any[] = [];

    for (const name of typeNames) {
      const q = query(typesRef, where("name", "==", name));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        typesRows.push({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        const newDoc = await addDoc(typesRef, {
          name,
          category: null,
          active: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        typesRows.push({ id: newDoc.id, name });
      }
    }

    // 4. Seed Sample Requests
    const requestsRef = collection(db, "requests");
    const existingRequests = await getDocs(requestsRef);

    if (existingRequests.empty) {
      // Get admin user (assumes already registered via /register)
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      const adminUser = usersSnapshot.docs.find(doc => 
        doc.data().email === "admin@example.com" || 
        doc.data().role === "admin"
      );

      const sampleRequests = [
        {
          requestId: "VDNI-2024-001",
          title: "ITAS Extension - Zhang Wei",
          description: "Permohonan perpanjangan ITAS karyawan",
          companyId: companyRows[2].id,
          requestTypeId: typesRows.find((t) => t.name === "Extension")?.id || null,
          teamId: teamRows[1].id,
          priority: "Normal",
          status: "Processing",
          dueDate: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
          picId: adminUser?.id || null,
          applicantName: "Zhang Wei",
          passportNumber: "E1234567",
          nationality: "China",
          currentAction: "Menyiapkan dokumen pengajuan",
          nextAction: "Submit ke Immigration",
          requesterId: adminUser?.id || null,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          lastUpdateAt: Timestamp.now(),
        },
        {
          requestId: "VDNI-2024-002",
          title: "New KITAS - Andi Wijaya",
          description: "Pembuatan KITAS baru",
          companyId: companyRows[0].id,
          requestTypeId: typesRows.find((t) => t.name === "KITAS")?.id || null,
          teamId: teamRows[0].id,
          priority: "Urgent",
          status: "Waiting Document",
          dueDate: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
          picId: adminUser?.id || null,
          applicantName: "Andi Wijaya",
          passportNumber: "A9876543",
          nationality: "Indonesia",
          currentAction: "Menunggu passport copy",
          nextAction: "Proses setelah dokumen lengkap",
          waitingFor: "Applicant",
          missingDocument: "Passport copy terbaru",
          requesterId: adminUser?.id || null,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          lastUpdateAt: Timestamp.now(),
        },
        {
          requestId: "VDNI-2024-003",
          title: "Visa Approval - Sari",
          description: "Pengajuan visa untuk meeting",
          companyId: companyRows[1].id,
          requestTypeId: typesRows.find((t) => t.name === "Visa")?.id || null,
          teamId: teamRows[0].id,
          priority: "Normal",
          status: "Completed",
          dueDate: Timestamp.fromDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
          picId: adminUser?.id || null,
          applicantName: "Sari",
          passportNumber: "B3456789",
          nationality: "Indonesia",
          requesterId: adminUser?.id || null,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          lastUpdateAt: Timestamp.now(),
        },
      ];

      for (const r of sampleRequests) {
        const newDoc = await addDoc(requestsRef, r);
        
        // Add timeline event
        const timelineRef = collection(db, "timeline");
        await addDoc(timelineRef, {
          requestId: newDoc.id,
          actorId: adminUser?.id || "system",
          actorName: adminUser?.data().name || "System",
          action: "created",
          message: `Request ${r.requestId} dibuat`,
          createdAt: Timestamp.now(),
        });
      }
    }

    return Response.json({ 
      ok: true, 
      message: "Seed data created successfully",
      teams: teamRows.length,
      companies: companyRows.length,
      requestTypes: typesRows.length,
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return Response.json({ error: error.message || "Seed failed" }, { status: 500 });
  }
}