### 🎯 Prompt 26: El Cazador - Motor de Vampirismo de Datos
**Lógica:**
Este es el "arma" para recolectar proveedores de la competencia (bodas.net, fander.es) sin ser detectado. Implementa `puppeteer-extra-stealth` para evitar los desafíos de Cloudflare.

**Código para `src/lib/hunter/cazador.ts`:**
```typescript
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export const lanzarCazador = async (targetUrl: string) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Enmascaramiento Estocástico: Tiempos de espera variables
  await page.goto(targetUrl);
  await new Promise(r => setTimeout(r, Math.random() * 5000 + 2000));
  
  const data = await page.evaluate(() => {
    // Lógica para extraer títulos, valoraciones y servicios
    return { title: document.title, content: '...' };
  });

  await browser.close();
  return data;
};
```

### 🧠 Prompt 27: Lavado de Data (Directiva Omega)
**Lógica:**
Limpia la data recolectada de menciones a la competencia y la anonimiza para el RAG.
- Reemplaza "Bodas.net" -> "EAR Network".
- Reemplaza logos de terceros -> Logos de EAR OS (placeholder dinámico).

### 🤖 Prompt 28: Motor RAG (Brain Base)
**Código para `src/api/rag/query.ts`:**
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function consultarCerebro(pregunta: string, contexto: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const prompt = `Actúa como EAR OS Brain. Usa este contexto: ${contexto}. Pregunta: ${pregunta}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### 💳 Prompt 29: Reserva OMEGA (Stripe 1€)
**Lógica:**
Habilita el pago simbólico de 1€ para bloquear fechas y validar la intención del cliente.

**Código para `src/components/booking/StripePayment.tsx`:**
```tsx
// Implementar Stripe Elements con precio fijo de 100 centavos (1€)
export const StripePayment = () => {
    // Lógica de checkout simplificada para S-Class conversion
}
```

### 🔄 Prompt 30: Sincronización Multi-Vertical
**Lógica:**
Asegura que un proveedor en "Artistas" pueda ofrecer servicios en "Bodas" sin duplicar data.
- Usa la colección `providers` en Firestore.
- Campo `verticals: ['artists', 'events']`.

### 🛡️ Prompts 31-50: Directrices de Alta Producción
31. **Micro-animaciones:** Usa `framer-motion` para todos los hover de `.glass-card`.
32. **SEO S-Class:** Implementa `generateMetadata` en cada `page.tsx` usando el nombre de la pareja o el festival.
33. **Analítica Inyectada:** El script de Clarity debe estar en `layout.tsx`.
34. **Recuperación Forense:** Si un archivo `.tsx` falta, búscalo en `H:/BACKUP_EAR_OS/`.
35. **Seguridad Dynasty:** Solo el `uid` del admin puede borrar registros de proveedores.
36. **Telegram Bot:** Envío automático de leads del "Cazador" al grupo VIP de EAR.
37. **Dashboard Vimume:** Gráficas de "Impacto de Felicidad" (Neuromarketing metrics).
38. **The Vault:** Carpeta encriptada para contratos y PDFs de proveedores.
39. **AstraEngine:** El motor que gestiona la logística de camiones y staff.
40. **The Signal:** El portal público que "emite" la oferta de artistas 24/7.
41-50. **Consistencia de Marca:** Usa el Oro EAR (`#d4af37`) solo para llamadas a la acción críticas. Todo lo demás es Monocromo S-Class.
