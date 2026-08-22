import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc, updateDoc, increment, arrayUnion, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
const referralServiceStub = {
    getReferralCode: () => null
};
const analyticsServiceStub = {};
export const earOpsService = {
    /**
     * Registra una acción táctica en el log operacional
     */
    async logAction(data) {
        try {
            if (!db)
                return;
            await addDoc(collection(db, 'ear_ops_logs'), {
                ...data,
                timestamp: serverTimestamp()
            });
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('ear-new-log', { detail: data }));
            }
        }
        catch (error) {
            console.error("[EAR OPS] Error al registrar log", error);
        }
    },
    /**
     * Obtiene el progreso de la academia para un usuario
     */
    async getAcademyProgress(userId) {
        try {
            if (!db)
                return null;
            const docRef = doc(db, 'academy_progress', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            }
            return null;
        }
        catch (error) {
            console.error("[EAR ACADEMY] Error al obtener progreso", error);
            return null;
        }
    },
    /**
     * Actualiza el progreso de la academia
     */
    async completeMission(userId, lessonId, xpReward) {
        try {
            if (!db)
                return;
            const docRef = doc(db, 'academy_progress', userId);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    totalXp: xpReward,
                    completedLessons: [lessonId],
                    currentLessonId: lessonId,
                    lastActivity: serverTimestamp()
                });
            }
            else {
                await updateDoc(docRef, {
                    totalXp: increment(xpReward),
                    completedLessons: arrayUnion(lessonId),
                    currentLessonId: lessonId,
                    lastActivity: serverTimestamp()
                });
            }
            await this.logAction({
                userId,
                userName: 'Admin',
                action: 'academy_mission_complete',
                detail: `Completada lección: ${lessonId}. +${xpReward} XP`,
                type: 'ACADEMY'
            });
        }
        catch (error) {
            console.error("[EAR ACADEMY] Error al completar misión", error);
        }
    },
    /**
     * Obtiene la cola de despacho en tiempo real (Polling for V1 Next.js stability)
     */
    async getDispatchQueue() {
        if (!db)
            return [];
        let items = [];
        try {
            const leadsRef = collection(db, 'ear_leads');
            const qLeads = query(leadsRef, where('status', 'not-in', ['CUALIFICADO', 'NO_CUALIFICADO']), orderBy('status'), limit(20));
            const leadsSnap = await getDocs(qLeads);
            leadsSnap.forEach(doc => {
                const data = doc.data();
                items.push({
                    id: doc.id,
                    type: 'LEAD',
                    priority: data.priority || 'NORMAL',
                    status: this.mapLeadStatusToWorkItem(data.status),
                    title: `Lead: ${data.name || 'Desconocido'}`,
                    description: `Interés: ${data.service || 'General'}`,
                    createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
                    slaDeadline: this.calculateSLA(data.createdAt?.toDate?.() || new Date(), 'LEAD', data.priority || 'NORMAL'),
                    slaStatus: 'ON_TIME',
                    actions: ['CALL', 'EMAIL', 'QUALIFY'],
                    metadata: { clientName: data.name, location: data.location || 'Madrid' }
                });
            });
            return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        catch (error) {
            console.error("[EAR DISPATCH] Error fetching queue", error);
            return [];
        }
    },
    mapLeadStatusToWorkItem(status) {
        if (!status || status === 'NEW')
            return 'NEW';
        if (status === 'ASIGNADO')
            return 'ASSIGNED';
        if (status === 'INTENTO_CONTACTO' || status === 'CONECTADO')
            return 'IN_PROGRESS';
        if (status === 'CUALIFICADO' || status === 'NO_CUALIFICADO')
            return 'RESOLVED';
        return 'NEW';
    },
    calculateSLA(createdAt, type, priority) {
        const created = createdAt.getTime();
        let hoursToAdd = 24;
        if (priority === 'CRITICAL')
            hoursToAdd = 0.25;
        else if (priority === 'HIGH')
            hoursToAdd = 2;
        return new Date(created + hoursToAdd * 60 * 60 * 1000).toISOString();
    }
};
