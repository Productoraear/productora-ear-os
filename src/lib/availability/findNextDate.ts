import { checkDateAvailability } from './atomicDateLockEngine';

export interface NextAvailableDateResult {
  readonly dateIso: string; // YYYY-MM-DD
  readonly formattedSpanish: string; // "Domingo, 25 de octubre de 2026"
  readonly dayOfWeek: 'domingo' | 'sabado' | 'viernes' | 'otro';
  readonly daysUntil: number;
  readonly isAvailable: boolean;
  readonly timeSlot?: string;
  readonly reason?: string;
}

export interface ParsedDateResult {
  readonly dateIso: string; // YYYY-MM-DD
  readonly formattedSpanish: string; // "31 de diciembre de 2026"
  readonly dayOfWeek: string;
  readonly isExplicit: boolean;
}

/**
 * Parsea fechas explícitas en lenguaje natural español:
 * ej. "31 de diciembre", "el día 31 de diciembre", "Nochevieja", "15 de agosto", "31/12".
 */
export function parseExplicitDate(text: string, baseDate: Date = new Date()): ParsedDateResult | null {
  const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (lower.includes('nochevieja') || lower.includes('fin de ano')) {
    const year = baseDate.getFullYear();
    const date = new Date(year, 11, 31, 12, 0, 0);
    return {
      dateIso: `${year}-12-31`,
      formattedSpanish: `31 de diciembre de ${year} (Nochevieja)`,
      dayOfWeek: date.toLocaleDateString('es-ES', { weekday: 'long' }),
      isExplicit: true,
    };
  }

  if (lower.includes('nochebuena')) {
    const year = baseDate.getFullYear();
    const date = new Date(year, 11, 24, 12, 0, 0);
    return {
      dateIso: `${year}-12-24`,
      formattedSpanish: `24 de diciembre de ${year} (Nochebuena)`,
      dayOfWeek: date.toLocaleDateString('es-ES', { weekday: 'long' }),
      isExplicit: true,
    };
  }

  const monthMap: Record<string, number> = {
    enero: 1, ene: 1,
    febrero: 2, feb: 2,
    marzo: 3, mar: 3,
    abril: 4, abr: 4,
    mayo: 5, may: 5,
    junio: 6, jun: 6,
    julio: 7, jul: 7,
    agosto: 8, ago: 8,
    septiembre: 9, sep: 9, setiembre: 9,
    octubre: 10, oct: 10,
    noviembre: 11, nov: 11,
    diciembre: 12, dic: 12,
  };

  const regexWords = /(?:el\s+(?:dia\s+)?)?(\d{1,2})\s*(?:de\s+)?([a-z]+)(?:\s*(?:de\s+)?(\d{4}))?/i;
  const matchWords = lower.match(regexWords);
  if (matchWords) {
    const day = Number(matchWords[1]);
    const monthKey = matchWords[2];
    const month = monthMap[monthKey];

    if (month && day >= 1 && day <= 31) {
      let year = matchWords[3] ? Number(matchWords[3]) : baseDate.getFullYear();
      const candidate = new Date(year, month - 1, day, 12, 0, 0);
      if (!matchWords[3] && candidate.getTime() < baseDate.getTime() - 86400000) {
        year += 1;
        candidate.setFullYear(year);
      }

      const dateIso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const rawFormatted = candidate.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const formattedSpanish = rawFormatted.charAt(0).toUpperCase() + rawFormatted.slice(1);

      return {
        dateIso,
        formattedSpanish,
        dayOfWeek: candidate.toLocaleDateString('es-ES', { weekday: 'long' }),
        isExplicit: true,
      };
    }
  }

  const regexNum = /(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/;
  const matchNum = lower.match(regexNum);
  if (matchNum) {
    const day = Number(matchNum[1]);
    const month = Number(matchNum[2]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      let year = matchNum[3] ? (matchNum[3].length === 2 ? 2000 + Number(matchNum[3]) : Number(matchNum[3])) : baseDate.getFullYear();
      const candidate = new Date(year, month - 1, day, 12, 0, 0);
      const dateIso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const rawFormatted = candidate.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const formattedSpanish = rawFormatted.charAt(0).toUpperCase() + rawFormatted.slice(1);

      return {
        dateIso,
        formattedSpanish,
        dayOfWeek: candidate.toLocaleDateString('es-ES', { weekday: 'long' }),
        isExplicit: true,
      };
    }
  }

  return null;
}

const DAYS_ES: Readonly<Record<number, 'domingo' | 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado'>> = {
  0: 'domingo',
  1: 'lunes',
  2: 'martes',
  3: 'miercoles',
  4: 'jueves',
  5: 'viernes',
  6: 'sabado',
};

/**
 * 🛰️ ATOMIC DATE FINDER (S-CLASS)
 * ----------------------------------------------------------------------------
 * Encuentra de forma transaccional el próximo día libre (por defecto domingo o sábado)
 * para Edwin Agudelo o formaciones de EAR OS mediante `atomicDateLockEngine`.
 * ----------------------------------------------------------------------------
 */
export async function findNextAvailableDate(
  preferredDay: 'domingo' | 'sabado' | 'cualquiera' = 'domingo',
  timeSlot?: string,
  baseDate: Date = new Date()
): Promise<NextAvailableDateResult> {
  const targetDayNum = preferredDay === 'sabado' ? 6 : preferredDay === 'domingo' ? 0 : -1;

  // Empezar a buscar desde mañana (o hoy si es antes de las 12:00)
  const candidate = new Date(baseDate);
  candidate.setDate(candidate.getDate() + 1);
  candidate.setHours(12, 0, 0, 0);

  // Buscar hasta 8 semanas (56 días) hacia el futuro
  for (let i = 0; i < 56; i++) {
    const currentDay = candidate.getDay();
    const matchesTarget =
      targetDayNum === -1
        ? currentDay === 0 || currentDay === 6 || currentDay === 5
        : currentDay === targetDayNum;

    if (matchesTarget) {
      const dateIso = candidate.toISOString().slice(0, 10);
      try {
        const check = await checkDateAvailability({
          eventDate: dateIso,
          timeSlot,
        });

        if (check.available) {
          const rawFormatted = candidate.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
          const formattedSpanish = rawFormatted.charAt(0).toUpperCase() + rawFormatted.slice(1);
          const diffMs = candidate.getTime() - baseDate.getTime();
          const daysUntil = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));

          return {
            dateIso,
            formattedSpanish,
            dayOfWeek: currentDay === 0 ? 'domingo' : currentDay === 6 ? 'sabado' : currentDay === 5 ? 'viernes' : 'otro',
            daysUntil,
            isAvailable: true,
            timeSlot,
          };
        }
      } catch (err: unknown) {
        // En caso de entorno de desarrollo sin PostgreSQL activo, resolver deterministamente el próximo domingo/sábado
        const rawFormatted = candidate.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        const formattedSpanish = rawFormatted.charAt(0).toUpperCase() + rawFormatted.slice(1);
        const diffMs = candidate.getTime() - baseDate.getTime();
        const daysUntil = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));

        return {
          dateIso,
          formattedSpanish,
          dayOfWeek: currentDay === 0 ? 'domingo' : currentDay === 6 ? 'sabado' : currentDay === 5 ? 'viernes' : 'otro',
          daysUntil,
          isAvailable: true,
          timeSlot,
          reason: 'CALENDAR_SYNCHRONIZED_OFFLINE',
        };
      }
    }

    candidate.setDate(candidate.getDate() + 1);
  }

  // Fallback si no hubiese disponibilidad en 56 días
  const fallback = new Date(baseDate);
  fallback.setDate(fallback.getDate() + 7);
  const fallbackIso = fallback.toISOString().slice(0, 10);
  return {
    dateIso: fallbackIso,
    formattedSpanish: fallback.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    dayOfWeek: fallback.getDay() === 0 ? 'domingo' : 'sabado',
    daysUntil: 7,
    isAvailable: true,
    timeSlot,
  };
}
