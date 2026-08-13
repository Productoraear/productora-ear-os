import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface IntentMapping {
  canonicalCategory: string;
  targetSubfolder: string;
  synonyms: string[];
  isProviderFunnel?: boolean;
}

export const TARGET_SEARCH_ROOTS = [
  "L:\\COPIA DE SEGURIDAD DE PROVEEDORES BODAS",
  "D:\\00_SILICON_VALLEY_MASTER_ARCHIVE",
  "D:\\01_VERTICAL_EVENTOS",
  "D:\\02_VERTICAL_VIMUME",
  "D:\\COPIAS_DE_SEGURIDAD",
  "D:\\EAR_AUDITORIA_ARCHIVOS",
  "D:\\EAR_AUDITORIA_HARDWARE",
  "D:\\EAR_AUDITORIA_SOFTWARE",
  "D:\\EAR_OS_INTEL_BUNKER",
  "D:\\EAR_VAULT",
  "D:\\OS AZUL",
  "D:\\VAMPIRIZADOS"
];

export const EAR_OS_ONTOLOGY: IntentMapping[] = [
  {
    canonicalCategory: "PROVEEDOR_BODA_CLAIM",
    targetSubfolder: "01_VERTICAL_EVENTOS\\PROVEEDORES_CLAIM_3M",
    synonyms: ["proveedor", "proveedores", "finca", "catering", "fotografo", "videografo", "floristeria", "musica_boda", "wedding_vendor", "bodas_net"],
    isProviderFunnel: true
  },
  {
    canonicalCategory: "B2C_BODAS",
    targetSubfolder: "01_VERTICAL_EVENTOS\\B2C_BODAS",
    synonyms: ["boda", "bodas", "wedding", "marriage", "novios", "particulares", "deposito_100", "reserva_boda", "wedding_protocol"]
  },
  {
    canonicalCategory: "EDWIN_AGUDELO_PATIENT_ZERO",
    targetSubfolder: "03_ARTISTAS_PATIENT_ZERO\\edwin_agudelo",
    synonyms: ["edwin", "agudelo", "patient_zero", "tenor", "cantante", "compositor", "rider", "ana_gabriel", "dossier", "vocal_chain", "master_audio"]
  },
  {
    canonicalCategory: "B2G_VIMUME",
    targetSubfolder: "02_VERTICAL_VIMUME\\B2G_LICITACIONES",
    synonyms: ["vimume", "b2g", "licitacion", "ayuntamiento", "pliego", "concurso_publico", "estimulacion_sensorial", "reminiscencia", "silver_economy", "hermes"]
  },
  {
    canonicalCategory: "ANTIGRAVITY_IA_CHATS",
    targetSubfolder: "00_IA_ANTIGRAVITY_ARCHIVE",
    synonyms: ["antigravity", "chat_log", "system_prompt", "prompt", "json_flow", "workflow", "vampirizado", "agentic_loop", "ollama", "qwen"]
  },
  {
    canonicalCategory: "FLEET_OPERATIONS",
    targetSubfolder: "04_OPERACIONES_Y_FLOTA",
    synonyms: ["fleet", "flota", "waybill", "hoja_de_ruta", "aurawallet", "ledger", "commissionledger", "smartcontract", "telemetry"]
  }
];

export class DeepSemanticArchivist {
  private baseVaultPath: string;

  constructor(baseVaultPath: string = "D:\\EAR_VAULT") {
    this.baseVaultPath = baseVaultPath;
  }

  public computeSHA256(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(fileBuffer).digest("hex");
  }

  public classifyDeepContent(filePath: string): { category: string; targetFolder: string; isProvider: boolean } {
    const fileName = path.basename(filePath).toLowerCase();
    let fileContent = "";

    try {
      const fd = fs.openSync(filePath, "r");
      const buffer = Buffer.alloc(65536);
      const bytesRead = fs.readSync(fd, buffer, 0, 65536, 0);
      fs.closeSync(fd);
      fileContent = buffer.toString("utf8", 0, bytesRead).toLowerCase();
    } catch {
      fileContent = "";
    }

    const combinedText = `${filePath.toLowerCase()} ${fileName} ${fileContent}`;

    if (filePath.toUpperCase().includes("PROVEEDORES BODAS")) {
      return {
        category: "PROVEEDOR_BODA_CLAIM",
        targetFolder: path.join(this.baseVaultPath, "01_VERTICAL_EVENTOS\\PROVEEDORES_CLAIM_3M"),
        isProvider: true
      };
    }

    for (const mapping of EAR_OS_ONTOLOGY) {
      for (const synonym of mapping.synonyms) {
        if (combinedText.includes(synonym)) {
          return {
            category: mapping.canonicalCategory,
            targetFolder: path.join(this.baseVaultPath, mapping.targetSubfolder),
            isProvider: !!mapping.isProviderFunnel
          };
        }
      }
    }

    return {
      category: "UNCATEGORIZED",
      targetFolder: path.join(this.baseVaultPath, "99_UNCATEGORIZED"),
      isProvider: false
    };
  }

  public relocateFile(sourcePath: string): { success: boolean; newPath: string; hash: string } | null {
    if (!fs.existsSync(sourcePath)) return null;

    const hash = this.computeSHA256(sourcePath);
    const { targetFolder } = this.classifyDeepContent(sourcePath);

    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const fileName = path.basename(sourcePath);
    const destinationPath = path.join(targetFolder, fileName);

    // Estrategia ADITIVA: Copia segura sin borrar el archivo original
    fs.copyFileSync(sourcePath, destinationPath);

    return {
      success: true,
      newPath: destinationPath,
      hash
    };
  }
}