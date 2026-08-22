"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
/**
 * 🧪 EAR OS / FLEET SEEDING ENGINE
 * Populates the system with high-fidelity mock units and waybills for testing.
 */
export async function seedFleetData() {
    try {
        // 1. Create a Default Workspace
        const workspace = await prisma.workspace.upsert({
            where: { slug: "ear-global-fleet" },
            update: {},
            create: {
                name: "EAR Global Fleet Hub",
                slug: "ear-global-fleet",
                description: "Principal S-Class Logistics Hub",
            }
        });
        // 2. Create S-Class Units
        const units = [
            { code: "RIDER-ALPHA", label: "Edwin Agudelo Elite 1" },
            { code: "RIDER-BETA", label: "Fleet Support 07" },
            { code: "RIDER-GAMMA", label: "Logistic Vanguard 22" },
        ];
        for (const unit of units) {
            await prisma.fleetUnit.upsert({
                where: { code: unit.code },
                update: { workspaceId: workspace.id },
                create: {
                    code: unit.code,
                    label: unit.label,
                    workspaceId: workspace.id,
                    status: "IDLE",
                    lastLatitude: 40.4168,
                    lastLongitude: -3.7038,
                }
            });
        }
        // 3. Create Active Waybills
        const waybill = await prisma.waybill.upsert({
            where: { referenceCode: "WB-EAR-2026-001" },
            update: {},
            create: {
                workspaceId: workspace.id,
                referenceCode: "WB-EAR-2026-001",
                status: "IN_TRANSIT",
                originLabel: "Méntrida Hub",
                destinationLabel: "Leganés P3",
                originLat: 40.2378,
                originLng: -4.1951,
                destinationLat: 40.3271,
                destinationLng: -3.7634,
                notes: "Mission: VIMUME Deployment",
            }
        });
        console.log("✅ Fleet Seeded Successfully");
        revalidatePath("/admin/fleet");
        return { success: true, workspaceId: workspace.id };
    }
    catch (error) {
        console.error("[SEED_ERROR]", error);
        return { success: false, error: "Seeding failed" };
    }
}
