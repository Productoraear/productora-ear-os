"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/security/adminGuard";

export async function createProviderAction(data: {
  name: string;
  category: string;
  province: string;
  telephone?: string;
  description?: string;
}) {
  const auth = await requireAdmin(new Request("http://localhost"));
  if (!auth.ok) {
    throw new Error("No autorizado");
  }

  // Create a VendorShadowProfile
  const shaHash = `EAR-SHADOW-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const claimToken = `CLAIM-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  try {
    const newProvider = await prisma.vendorShadowProfile.create({
      data: {
        shaHash,
        claimToken,
        name: data.name,
        category: data.category,
        province: data.province,
        telephone: data.telephone,
        description: data.description,
        status: "VERIFIED_ACTIVE",
        rating: 5.0,
        reviewsCount: 0,
      },
    });

    revalidatePath("/admin/proveedores");
    return { success: true, provider: newProvider };
  } catch (err: any) {
    console.error("Error creating provider:", err);
    throw new Error(err.message || "Error al crear el proveedor");
  }
}

export async function updateProviderAction(
  id: string,
  data: {
    name?: string;
    category?: string;
    province?: string;
    telephone?: string;
    status?: string;
  }
) {
  const auth = await requireAdmin(new Request("http://localhost"));
  if (!auth.ok) {
    throw new Error("No autorizado");
  }

  try {
    const updated = await prisma.vendorShadowProfile.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/proveedores");
    return { success: true, provider: updated };
  } catch (err: any) {
    console.error("Error updating provider:", err);
    throw new Error(err.message || "Error al actualizar el proveedor");
  }
}

export async function deleteProviderAction(id: string) {
  const auth = await requireAdmin(new Request("http://localhost"));
  if (!auth.ok) {
    throw new Error("No autorizado");
  }

  try {
    await prisma.vendorShadowProfile.delete({
      where: { id },
    });
    revalidatePath("/admin/proveedores");
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting provider:", err);
    throw new Error(err.message || "Error al eliminar el proveedor");
  }
}
