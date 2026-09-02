import { db } from '../firebase';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    updateDoc, 
    doc, 
    serverTimestamp 
} from 'firebase/firestore';
import { astraService } from './ai/AstraService';

/**
 * 🧛 VAMPIRE SERVICE - DATA INGESTION & TRANSMUTATION
 * The heart of the EAR OS "Absorción" protocol.
 */

export class VampireService {
    /**
     * Inicia el proceso de transmutación para todos los leads con status 'NEW'.
     */
    async processNewLeads() {
        
        try {
            const leadsRef = collection(db, 'ear_leads');
            const q = query(leadsRef, where('status', '==', 'NEW'));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                return { success: true, processed: 0, message: "No hay leads nuevos para procesar." };
            }

            let processedCount = 0;

            for (const leadDoc of snapshot.docs) {
                const leadData = leadDoc.data();
                
                // 1. Transmutación mediante Astra (Gemini)
                const intel = await astraService.transmuteLead(leadData);

                if (intel.error) {
                    console.error(`❌ Fallo al procesar lead ${leadDoc.id}:`, intel.message);
                    continue;
                }

                // 2. Ingestión en Vendors (DNA EAR)
                await addDoc(collection(db, 'ear_vendors'), {
                    ...intel,
                    originalLeadId: leadDoc.id,
                    source: leadData.source || 'VAMPIRE_INGESTION',
                    ingestedAt: serverTimestamp()
                });

                // 3. Marcar lead original como procesado (VAMPIRED)
                await updateDoc(doc(db, 'ear_leads', leadDoc.id), {
                    status: 'VAMPIRED',
                    processedAt: serverTimestamp()
                });

                processedCount++;
            }

            return { 
                success: true, 
                processed: processedCount, 
                message: `${processedCount} leads transmutados con éxito.` 
            };

        } catch (error: any) {
            console.error("❌ VAMPIRE_ERROR:", error);
            return { success: false, error: error.message };
        }
    }
}

export const vampireService = new VampireService();
