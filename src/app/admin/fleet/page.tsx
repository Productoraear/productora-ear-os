import React from 'react';
import { prisma } from "@/lib/prisma";
import FleetDashboardClient from "./fleet-dashboard-client";

export const dynamic = 'force-dynamic';

/**
 * 🛰️ EAR OS / FLEET COMMAND HUB (V5 ELITE SERVER)
 * Orchestrates server-side data fetching for the dispatcher interface.
 */

export default async function FleetPage() {
  // 1. Get/Create default Workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: "ear-global-fleet" },
    update: {},
    create: {
      name: "EAR Global Fleet Hub",
      slug: "ear-global-fleet",
      description: "Principal S-Class Logistics Hub",
    }
  });

  // 2. Fetch live mission and unit data from Prisma
  const waybills = await prisma.waybill.findMany({
    where: { 
      workspaceId: workspace.id,
      status: { not: "COMPLETED" } 
    },
    include: {
      unit: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const units = await prisma.fleetUnit.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { code: 'asc' },
  });

  return (
    <div className="bg-[#090909] min-h-screen">
      <FleetDashboardClient 
        workspace={JSON.parse(JSON.stringify(workspace))}
        initialWaybills={JSON.parse(JSON.stringify(waybills))} 
        initialUnits={JSON.parse(JSON.stringify(units))} 
      />
    </div>
  );
}
