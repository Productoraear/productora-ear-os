/**
 * 🔒 SANITIZADOR S-CLASS ANTI-XSS (SIN DEPENDENCIAS EXTERNAS)
 * ============================================================================
 * BLINDAJE P0-3: convierte cualquier contenido HTML no fiable en TEXTO PLANO.
 * - Elimina tags <script>, <style>, <iframe>, <object>, <embed>, <svg>, <link>, <meta>.
 * - Elimina TODOS los tags HTML restantes conservando únicamente el texto visible.
 * - Decodifica entidades HTML básicas.
 * - Neutraliza atributos de eventos (onerror, onload, javascript:, etc.).
 * El resultado se renderiza como texto plano (React escapa automáticamente).
 * ============================================================================
 */

function decodeBasicEntities(input: string): string {
    return input
        .replace(/\u0026amp;/gi, '\u0026')
        .replace(/\u0026lt;/gi, '<')
        .replace(/\u0026gt;/gi, '>')
        .replace(/\u0026quot;/gi, '"')
        .replace(/\u0026apos;|\u0026#39;/gi, "'")
        .replace(/\u0026nbsp;/gi, ' ')
        .replace(/\u0026#(\d+);/g, (_match: string, code: string) => {
            const n = Number.parseInt(code, 10);
            return Number.isFinite(n) && n >= 32 && n <= 0x10ffff ? String.fromCodePoint(n) : '';
        });
}

/**
 * Convierte HTML no fiable en texto plano seguro para renderizado.
 * PROHIBIDO pasar su salida a dangerouslySetInnerHTML: el resultado es texto visible,
 * no markup. React escapará cualquier carácter residual.
 */
export function sanitizeToPlainText(input: string | null | undefined): string {
    if (!input || typeof input !== 'string') return '';

    // 1. Aislar bloques peligrosos que no deben aportar texto visible ni ejecutable.
    let out = input
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
        .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, ' ')
        .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, ' ')
        .replace(/<embed\b[^>]*\/?>/gi, ' ')
        .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ')
        .replace(/<link\b[^>]*\/?>/gi, ' ')
        .replace(/<meta\b[^>]*\/?>/gi, ' ')
        .replace(/<base\b[^>]*\/?>/gi, ' ');

    // 2. Neutralizar handlers de eventos y esquemas javascript: en atributos.
    out = out.replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, ' ');
    out = out.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, ' ');
    out = out.replace(/javascript\s*:/gi, '');

    // 3. Eliminar el resto de tags HTML (conservando separación entre frases).
    out = out.replace(/<br\s*\/?>/gi, '\n');
    out = out.replace(/<\/(p|div|li|h[1-6]|tr|section|article|blockquote|ul|ol|table)>/gi, '\n');
    out = out.replace(/<li\b[^>]*>/gi, '\n\u2022 ');
    out = out.replace(/<[^>]+>/g, ' ');

    // 4. Decodificar entidades y limpiar espacios redundantes.
    out = decodeBasicEntities(out);
    out = out.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

    return out;
}