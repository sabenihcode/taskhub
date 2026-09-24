import { adminAuth, adminDb } from "@/lib/firebase/admin"; // ✅ Sekarang ada

async function createAdminUser() {
  const adminEmail = "admin@yourcompany.com";
  const adminPassword = "Admin123!";
  const adminName = "Admin User";

  try {
    const userRecord = await adminAuth.createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: adminName,
    });

    console.log("✅ User created:", userRecord.uid);

    await adminAuth.setCustomUserClaims(userRecord.uid, {
      role: "admin",
      admin: true,
    });

    await adminDb.collection("users").doc(userRecord.uid).set({
      name: adminName,
      email: adminEmail,
      role: "admin",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Admin created successfully!");
  } catch (error: any) {
    if (error.code === "auth/email-already-exists") {
      console.log("⚠️ User exists, updating role...");
      const user = await adminAuth.getUserByEmail(adminEmail);
      await adminAuth.setCustomUserClaims(user.uid, { role: "admin" });
      await adminDb.collection("users").doc(user.uid).update({ role: "admin" });
      console.log("✅ Promoted to admin");
    } else {
      console.error("❌ Error:", error);
    }
  }
}

createAdminUser()
  .then(() => process.exit(0))
  .catch(console.error);