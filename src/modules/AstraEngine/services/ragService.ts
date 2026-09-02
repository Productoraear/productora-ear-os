
import { Session, Project, ImpactNugget, VectorMemoryItem, ContentItem } from '../types';

/**
 * Astra OS "Neural Memory" Engine (Vector DB Simulator).
 * In a production Next.js environment, this would call Vercel Edge Functions
 * to query Pinecone or Weaviate. Here, we simulate vector similarity scoring locally.
 */
class RAGService {
    private getLocalData<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            return null;
        }
    }

    private tokenize(text: string): string[] {
        return text.toLowerCase()
            .replace(/[^\w\s]|_/g, "")
            .replace(/\s+/g, " ")
            .split(" ")
            .filter(w => w.length > 3);
    }

    // Simulates cosine similarity between query and content vectors
    private calculateSimulatedSimilarity(query: string, itemContent: string): number {
        const queryTokens = this.tokenize(query);
        const contentTokens = this.tokenize(itemContent);
        
        if (queryTokens.length === 0 || contentTokens.length === 0) return 0;

        let matches = 0;
        queryTokens.forEach(token => {
            if (contentTokens.includes(token)) matches++;
        });

        // Simple Jaccard index as a proxy for vector similarity
        return matches / (queryTokens.length + contentTokens.length - matches);
    }

    /**
     * Retrieves relevant context (Simulating Vector DB Query).
     * @param query The current dilemma, prompt, or context string.
     * @param limit Max number of items to retrieve.
     */
    public getContext(query: string, limit: number = 5): string {
        // In Next.js: const vectors = await pinecone.query({ vector: await embed(query), topK: limit });
        
        const sessions = this.getLocalData<Session[]>('astra-sessions') || [];
        const projects = this.getLocalData<Project[]>('astra-projects') || [];
        const nuggets = this.getLocalData<ImpactNugget[]>('astra-userNuggets') || [];
        const marketingContent = this.getLocalData<ContentItem[]>('astra-marketing-content') || [];
        const profile = this.getLocalData<string>('astra-discProfile');

        const items: VectorMemoryItem[] = [];

        // Vectorize & Index Sessions
        sessions.forEach(s => {
            const synthesis = s.synthesis ? `Verdicto: ${s.synthesis.strategicRecommendation.strategy}. Resumen: ${s.synthesis.executiveSummary}` : '';
            items.push({
                id: s.id,
                content: `Sesión "${s.title}": Problema: ${s.params?.problem || 'N/A'}. ${synthesis}`,
                metadata: { type: 'SESSION', timestamp: s.timestamp }
            });
        });

        // Vectorize & Index Projects
        projects.forEach(p => {
            items.push({
                id: p.id,
                content: `Proyecto Activo: "${p.name}". Estado: ${p.status}. Descripción: ${p.description}`,
                metadata: { type: 'PROJECT', timestamp: Date.now() }
            });
        });

        // Vectorize & Index Nuggets
        nuggets.forEach((n, index) => {
            items.push({
                id: `nugget_${index}`,
                content: `Lección Aprendida (${n.category}): ${n.title} - ${n.insight}`,
                metadata: { type: 'NUGGET', timestamp: Date.now() }
            });
        });

        // Vectorize & Index Marketing Content
        marketingContent.forEach((c) => {
            items.push({
                id: c.id,
                content: `Contenido de Marketing (${c.plataforma}): "${c.titulo}". Cuerpo: ${c.cuerpo.substring(0, 300)}...`,
                metadata: { type: 'PROJECT', timestamp: new Date(c.fecha_creacion).getTime() } // Reusing PROJECT type for simplicity or define CONTENT
            });
        });

        // Vectorize & Index Profile
        if (profile) {
            items.push({
                id: 'profile',
                content: `Perfil DISC del Usuario: ${profile}`,
                metadata: { type: 'PROFILE', timestamp: Date.now() }
            });
        }

        // Semantic Search Simulation
        const scoredItems = items.map(item => ({
            ...item,
            score: this.calculateSimulatedSimilarity(query, item.content)
        })).sort((a, b) => (b.score || 0) - (a.score || 0));

        const relevantItems = scoredItems.filter(i => (i.score || 0) > 0.05).slice(0, limit);

        if (relevantItems.length === 0) return "";

        return relevantItems.map(item => `[MEMORIA NEURAL: ${item.metadata.type}] ${item.content}`).join('\n\n');
    }
}

export const ragService = new RAGService();
