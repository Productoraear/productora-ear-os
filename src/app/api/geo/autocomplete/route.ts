import { NextRequest, NextResponse } from 'next/server';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';

export interface GeoSuggestion {
  id: string | number;
  label: string;
  sublabel?: string;
  fullAddress: string;
  lat: number;
  lng: number;
  type: 'finca' | 'calle' | 'municipio' | 'venue';
  province?: string;
}

// Fincas y venues de bodas premium adicionales frecuentes en la zona centro
const POPULAR_WEDDING_ESTATES: Array<{
  name: string;
  location: string;
  province: string;
  lat: number;
  lng: number;
}> = [
  { name: 'Finca La Romanée', location: 'Griñón (Madrid)', province: 'Madrid', lat: 40.2185, lng: -3.8524 },
  { name: 'La Posta Real', location: 'Rivas-Vaciamadrid (Madrid)', province: 'Madrid', lat: 40.3541, lng: -3.5278 },
  { name: 'Finca El Tomillar', location: 'Guadarrama (Madrid)', province: 'Madrid', lat: 40.6721, lng: -4.0894 },
  { name: 'Finca Feligrés', location: 'Arganda del Rey (Madrid)', province: 'Madrid', lat: 40.2989, lng: -3.4391 },
  { name: 'Monasterio de Lupiana', location: 'Lupiana (Guadalajara)', province: 'Guadalajara', lat: 40.6124, lng: -3.0532 },
  { name: 'Finca Las Jarillas', location: 'Alcobendas (Madrid)', province: 'Madrid', lat: 40.5489, lng: -3.6425 },
  { name: 'Palacio de Aldovea', location: 'San Fernando de Henares (Madrid)', province: 'Madrid', lat: 40.4412, lng: -3.4891 },
  { name: 'Finca El Campillo', location: 'San Lorenzo de El Escorial (Madrid)', province: 'Madrid', lat: 40.5891, lng: -4.1482 },
  { name: 'Finca Monteviejo', location: 'Chinchón (Madrid)', province: 'Madrid', lat: 40.1389, lng: -3.4211 },
  { name: 'Finca San Antonio', location: 'Hoyos de Manzanares (Madrid)', province: 'Madrid', lat: 40.6214, lng: -3.9082 },
];

function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const normQuery = normalizeText(query);
    const suggestions: GeoSuggestion[] = [];

    // 1. Coincidencias en Fincas Homologadas S-Class
    for (const finca of SCLASS_12_FINCAS_HOMOLOGADAS) {
      const normName = normalizeText(finca.name);
      const normLoc = normalizeText(finca.location);
      if (normName.includes(normQuery) || normLoc.includes(normQuery)) {
        // Coordenadas aproximadas según ubicación o Hub Méntrida
        suggestions.push({
          id: `finca-${finca.id}`,
          label: finca.name,
          sublabel: `${finca.location} • Homologada S-Class`,
          fullAddress: `${finca.name}, ${finca.location}`,
          lat: 40.2383, // fallback referencial
          lng: -4.1956,
          type: 'finca',
          province: finca.provincia,
        });
      }
    }

    // 2. Coincidencias en Estates Populares (ej: Finca La Romanée)
    for (const estate of POPULAR_WEDDING_ESTATES) {
      const normName = normalizeText(estate.name);
      const normLoc = normalizeText(estate.location);
      if (normName.includes(normQuery) || normLoc.includes(normQuery)) {
        suggestions.push({
          id: `estate-${estate.name}`,
          label: estate.name,
          sublabel: `${estate.location} • Espacio de Eventos`,
          fullAddress: `${estate.name}, ${estate.location}`,
          lat: estate.lat,
          lng: estate.lng,
          type: 'finca',
          province: estate.province,
        });
      }
    }

    // 3. Consulta a Nominatim OpenStreetMap (filtrado a España)
    try {
      const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&countrycodes=es&addressdetails=1&limit=6`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout defensivo

      const res = await fetch(osmUrl, {
        headers: {
          'User-Agent': 'EAR-OS-Dispatch/2.0 (productoraear@gmail.com)',
          'Accept-Language': 'es-ES,es;q=0.9',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const osmItems = await res.json();
        if (Array.isArray(osmItems)) {
          for (const item of osmItems) {
            const addr = item.address || {};
            const road = addr.road || addr.pedestrian || addr.suburb || item.name;
            const city = addr.city || addr.town || addr.village || addr.municipality || '';
            const prov = addr.province || addr.state_district || addr.state || '';
            const labelParts = [road, city, prov].filter(Boolean);
            const label = labelParts.length > 0 ? labelParts.join(', ') : item.display_name.split(',').slice(0, 3).join(',');

            const isStreet = !!addr.road || item.type === 'residential' || item.type === 'highway';

            suggestions.push({
              id: item.osm_id || Math.random(),
              label: label,
              sublabel: item.display_name,
              fullAddress: item.display_name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              type: isStreet ? 'calle' : 'municipio',
              province: prov,
            });
          }
        }
      }
    } catch {
      // Si la llamada externa falla o timeout, las sugerencias locales de fincas ya cubren el retorno
    }

    // Limitar a las 6 sugerencias más relevantes
    return NextResponse.json({
      suggestions: suggestions.slice(0, 6),
    });
  } catch (error: unknown) {
    console.error('API_GEO_AUTOCOMPLETE_ERROR:', error);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
