"use server";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "documents");

export async function uploadDocument(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file") as File | null;
  const category = (formData.get("category") as string) || "other";

  if (!file || file.size === 0) {
    return { error: "No file provided" };
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { error: "File too large (max 10MB)" };
  }

  try {
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}-${safeName}`;
    const filePath = join(UPLOAD_DIR, uniqueName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const doc = await prisma.document.create({
      data: {
        name: file.name,
        category,
        fileUrl: `/uploads/documents/${uniqueName}`,
        fileType: file.type,
        fileSize: file.size,
      },
    });

    return { success: true, document: doc };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload document" };
  }
}
