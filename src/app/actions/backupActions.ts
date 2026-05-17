"use server";

import { BackupReader, Finca, LegacyProvider, ArsenalEnriched, ArsenalCompleto } from "@/lib/services/backupReader";

export async function fetchFincasAction(query: string = "", provincia?: string) {
  try {
    return BackupReader.searchFincas(query, provincia);
  } catch (error) {
    console.error("[backupActions] Error fetching fincas:", error);
    return [];
  }
}

export async function fetchProvidersAction(query: string = "", categoria?: string) {
  try {
    return BackupReader.searchProviders(query, categoria);
  } catch (error) {
    console.error("[backupActions] Error fetching providers:", error);
    return [];
  }
}

export async function fetchArsenalEnrichedAction() {
  try {
    return BackupReader.getArsenalEnriched();
  } catch (error) {
    console.error("[backupActions] Error fetching enriched arsenal:", error);
    return [];
  }
}

export async function fetchArsenalCompletoAction() {
  try {
    return BackupReader.getArsenalCompleto();
  } catch (error) {
    console.error("[backupActions] Error fetching complete arsenal:", error);
    return [];
  }
}

export async function fetchKnowledgeGraphAction() {
  try {
    return BackupReader.getKnowledgeGraph();
  } catch (error) {
    console.error("[backupActions] Error fetching knowledge graph:", error);
    return [];
  }
}
