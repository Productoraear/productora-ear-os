import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.productoraear.com';
const CHUNK_SIZE = 1000;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString().split('T')[0];

  // Entradas estructurales
  const entries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/vimume`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog/auditoria-fincas-b2b`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog/lcsp-ayuntamientos-118`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog/vimume-evidencia-clinica`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    // Rutas protegidas (por diseño, a veces se indexa la home del admin si no está deshabilitado por robots.txt, 
    // pero aquí solo ponemos las públicas)
  ];

  // Particiones dinámicas de proveedores
  try {
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'vampirized_providers.json');
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf-8');
      const list: any[] = JSON.parse(raw);
      const totalProviders = list.length;
      
      // En un entorno de producción masivo, esto debería iterar sobre los slugs
      // Para Next.js 14, si superan 50.000, se usa generateSitemaps
      // Añadimos solo una muestra para el sitemap maestro local
      list.slice(0, 100).forEach(provider => {
        entries.push({
          url: `${BASE_URL}/proveedor/${provider.slug || provider.id}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.7
        });
      });
    }
  } catch (err) {
    console.warn('[SITEMAP] Error leyendo proveedores:', err);
  }

  return entries;
}
