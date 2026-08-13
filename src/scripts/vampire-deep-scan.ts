import fs from "fs";
import path from "path";
import crypto from "crypto";
import { PrismaClient, ClaimStatus, VendorCategory } from "@prisma/client";
import { DeepSemanticArchivist, TARGET_SEARCH_ROOTS } from "../lib/services/vampire/SynonymOntology";

const prisma = new PrismaClient();

interface IngestedVendorJSON {
  nombre?: string;
  name?: string;
  companyName?: string;
  categoria?: string;
  category?: string;
  telefono?: string;
  phone?: string;
  provincia?: string;
  ciudad?: string;
  city?: string;
  email?: string;
}

function getAllFilesRecursively(dirPath: string, fileList: string[] = []): string[] {
  try {
    if (!fs.existsSync(dirPath)) return fileList;
    const entries = fs.readdirSync(dirPath);

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry);
      try {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          getAllFilesRecursively(fullPath, fileList);
        } else if (stats.isFile()) {
          fileList.push(fullPath);
        }
      } catch {
        // Ignorar archivos con restricciones de acceso
      }
    }
  } catch {
    // Ignorar directorios protegidos
  }
  return fileList;
}

async function runRecursiveDeepScan() {
  console.log("=================================================================");
  console.log("🛡️ [EAR OS V2] INICIANDO BARRIDO RECURSIVO PROFUNDO Y EXTRACCIÓN ADN");
  console.log("=================================================================\n");

  const archivist = new DeepSemanticArchivist("D:\\EAR_VAULT");
  let totalAnalyzed = 0;
  let totalCataloged = 0;
  let totalProvidersIngested = 0;

  for (const rootPath of TARGET_SEARCH_ROOTS) {
    if (!fs.existsSync(rootPath)) {
      console.log(`⚠️ [OMITIDA] Ruta no montada: ${rootPath}`);
      continue;
    }

    console.log(`🔍 [ESCANEO RECURSIVO] Inspeccionando árbol completo: ${rootPath}`);
    const allFiles = getAllFilesRecursively(rootPath);
    console.log(`   └─ Localizados ${allFiles.length} archivos en el subárbol.`);

    for (const fullPath of allFiles) {
      totalAnalyzed++;
      const fileName = path.basename(fullPath);

      // 1. Análisis Semántico y Hash SHA-256
      const classification = archivist.classifyDeepContent(fullPath);

      // 2. Ingestión Aditiva de Proveedores (JSONs, listas y datos estructurados)
      if (classification.isProvider || fullPath.toUpperCase().includes("PROVEEDORES BODAS")) {
        if (fileName.toLowerCase().endsWith(".json")) {
          try {
            const rawData = fs.readFileSync(fullPath, "utf-8");
            const parsed = JSON.parse(rawData) as IngestedVendorJSON | IngestedVendorJSON[];
            const vendors = Array.isArray(parsed) ? parsed : [parsed];

            for (const v of vendors) {
              const vendorName = v.nombre || v.name || v.companyName;
              if (!vendorName || typeof vendorName !== "string") continue;

              const slug = vendorName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
              if (!slug) continue;

              await prisma.providerProfile.upsert({
                where: { slug },
                update: {
                  phone: v.telefono || v.phone || null,
                  email: v.email || null,
                  city: v.provincia || v.ciudad || v.city || "España"
                },
                create: {
                  slug,
                  companyName: vendorName,
                  name: vendorName,
                  category: VendorCategory.FINCA_ALQUILER,
                  city: v.provincia || v.ciudad || v.city || "España",
                  phone: v.telefono || v.phone || null,
                  email: v.email || null,
                  claimStatus: ClaimStatus.GHOST_UNCLAIMED,
                  claimToken: `claim-${crypto.randomBytes(8).toString("hex")}`
                }
              });
              totalProvidersIngested++;
            }
          } catch {
            // Ignorar JSONs no estructurados como proveedores
          }
        }
      }

      // 3. Copia aditiva hacia la Bóveda Soberana (D:\EAR_VAULT)
      const targetFolder = classification.targetFolder;
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }

      const destinationPath = path.join(targetFolder, fileName);
      if (!fs.existsSync(destinationPath)) {
        try {
          fs.copyFileSync(fullPath, destinationPath);
          totalCataloged++;
        } catch {
          // Ignorar archivos bloqueados por el sistema operativo
        }
      }
    }
  }

  console.log("\n=================================================================");
  console.log("📊 RESUMEN EJECUTIVO BARRIDO RECURSIVO:");
  console.log(`   - Total Archivos Rastreados en Subárboles: ${totalAnalyzed}`);
  console.log(`   - Archivos Copiados a Bóveda Soberana: ${totalCataloged}`);
  console.log(`   - Perfiles B2B Registrados (Claim 3M Gratis): ${totalProvidersIngested}`);
  console.log("=================================================================\n");
}

runRecursiveDeepScan()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error en la ejecución del escaneo recursivo:", e);
    await prisma.$disconnect();
    process.exit(1);
  });