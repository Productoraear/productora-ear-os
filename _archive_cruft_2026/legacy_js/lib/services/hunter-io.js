/**
 * 🎯 HUNTER.IO SERVICE
 * Enriquecimiento de leads corporativos mediante Hunter.io API.
 */
const HUNTER_API_KEY = process.env.HUNTER_API_KEY;
export async function domainSearch(domain) {
    if (!HUNTER_API_KEY) {
        return { error: 'HUNTER_API_KEY no configurada.' };
    }
    const url = `https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${HUNTER_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
            return { error: data.errors?.[0]?.details || 'Error en Hunter.io API' };
        }
        return { data: data.data };
    }
    catch (error) {
        console.error('❌ HUNTER_IO_ERROR:', error);
        return { error: error.message };
    }
}
