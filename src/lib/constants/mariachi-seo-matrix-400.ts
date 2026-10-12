// MATRIZ SEMÁNTICA CUÁNTICA DE 400 KEYWORDS — EAR OS S-CLASS
// Cobertura completa de intenciones: 100 Transaccionales, 100 Locales/GEO, 100 Por Evento, 100 Informacionales.

export type SearchIntentCategory = "transaccional" | "local" | "evento" | "informacional";

export interface MariachiKeywordNode {
  id: string;
  keyword: string;
  intent: SearchIntentCategory;
  level: number; // Nivel 1 a 100 de profundidad semántica
  targetUrl: string;
  cluster: string;
}

export const MARIACHI_KEYWORDS_400: MariachiKeywordNode[] = [
  {
    "id": "transaccional-1",
    "keyword": "contratar mariachis",
    "intent": "transaccional",
    "level": 1,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-2",
    "keyword": "contratar mariachi online",
    "intent": "transaccional",
    "level": 2,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-3",
    "keyword": "precio mariachi por hora",
    "intent": "transaccional",
    "level": 3,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-4",
    "keyword": "reservar mariachi con fianza",
    "intent": "transaccional",
    "level": 4,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-5",
    "keyword": "contratar mariachi precio cerrado",
    "intent": "transaccional",
    "level": 5,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-6",
    "keyword": "mariachis tarifas oficiales",
    "intent": "transaccional",
    "level": 6,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-7",
    "keyword": "presupuesto mariachi inmediato",
    "intent": "transaccional",
    "level": 7,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-8",
    "keyword": "cuanto cuesta mariachi boda",
    "intent": "transaccional",
    "level": 8,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-9",
    "keyword": "contratar charros a domicilio",
    "intent": "transaccional",
    "level": 9,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-10",
    "keyword": "mariachi economico precio",
    "intent": "transaccional",
    "level": 10,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-11",
    "keyword": "contratar serenata mariachi",
    "intent": "transaccional",
    "level": 11,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-12",
    "keyword": "mariachis baratos precio hora",
    "intent": "transaccional",
    "level": 12,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-13",
    "keyword": "reserva mariachi stripe",
    "intent": "transaccional",
    "level": 13,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-14",
    "keyword": "contratacion directa mariachis",
    "intent": "transaccional",
    "level": 14,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-15",
    "keyword": "mariachi sin intermediarios",
    "intent": "transaccional",
    "level": 15,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-16",
    "keyword": "precio cuarteto mariachi",
    "intent": "transaccional",
    "level": 16,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-17",
    "keyword": "contratar trio mariachi",
    "intent": "transaccional",
    "level": 17,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-18",
    "keyword": "precio mariachi solista",
    "intent": "transaccional",
    "level": 18,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-19",
    "keyword": "contratar mariachi para hoy",
    "intent": "transaccional",
    "level": 19,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-20",
    "keyword": "mariachis 24 horas urgentes",
    "intent": "transaccional",
    "level": 20,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-21",
    "keyword": "contratar mariachi profesional",
    "intent": "transaccional",
    "level": 21,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-22",
    "keyword": "tarifa mariachi serenata domicilio",
    "intent": "transaccional",
    "level": 22,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-23",
    "keyword": "precio actuacion mariachi",
    "intent": "transaccional",
    "level": 23,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-24",
    "keyword": "pagar senal mariachi",
    "intent": "transaccional",
    "level": 24,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-25",
    "keyword": "contratar mariachis espana precio",
    "intent": "transaccional",
    "level": 25,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-26",
    "keyword": "mariachi fianza deducible",
    "intent": "transaccional",
    "level": 26,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-27",
    "keyword": "contratar mariachi con sonido bose",
    "intent": "transaccional",
    "level": 27,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-28",
    "keyword": "precio mariachi fiesta privada",
    "intent": "transaccional",
    "level": 28,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-29",
    "keyword": "contratar grupo mariachis formal",
    "intent": "transaccional",
    "level": 29,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-30",
    "keyword": "mariachi factura oficial",
    "intent": "transaccional",
    "level": 30,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-31",
    "keyword": "contratar mariachi seguro rc",
    "intent": "transaccional",
    "level": 31,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-32",
    "keyword": "precio mariachi misa panamericana",
    "intent": "transaccional",
    "level": 32,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-33",
    "keyword": "contratar cantante ranchero gala",
    "intent": "transaccional",
    "level": 33,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-34",
    "keyword": "mariachi precio cerrado desplazamiento",
    "intent": "transaccional",
    "level": 34,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-35",
    "keyword": "contratar mariachis baratos espana",
    "intent": "transaccional",
    "level": 35,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-36",
    "keyword": "reserva inmediata mariachis",
    "intent": "transaccional",
    "level": 36,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-37",
    "keyword": "mariachi telefono contratacion directa",
    "intent": "transaccional",
    "level": 37,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-38",
    "keyword": "contratar mariachi con tarjeta",
    "intent": "transaccional",
    "level": 38,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-39",
    "keyword": "precio serenata express mariachi",
    "intent": "transaccional",
    "level": 39,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-40",
    "keyword": "contratar mariachi alta seguridad",
    "intent": "transaccional",
    "level": 40,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-41",
    "keyword": "mariachi disponibilidad en tiempo real",
    "intent": "transaccional",
    "level": 41,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-42",
    "keyword": "contratar mariachi calificado",
    "intent": "transaccional",
    "level": 42,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-43",
    "keyword": "precio mariachi 5 musicos",
    "intent": "transaccional",
    "level": 43,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-44",
    "keyword": "contratar mariachi 6 musicos",
    "intent": "transaccional",
    "level": 44,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-45",
    "keyword": "precio mariachi monumental",
    "intent": "transaccional",
    "level": 45,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-46",
    "keyword": "contratar mariachi tenor solista",
    "intent": "transaccional",
    "level": 46,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-47",
    "keyword": "precio cancion mariachi personalizada",
    "intent": "transaccional",
    "level": 47,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-48",
    "keyword": "contratar video dedicatoria mariachi",
    "intent": "transaccional",
    "level": 48,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-49",
    "keyword": "mariachi pago seguro online",
    "intent": "transaccional",
    "level": 49,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-50",
    "keyword": "contratar mariachi sonido profesional",
    "intent": "transaccional",
    "level": 50,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-51",
    "keyword": "precio mariachi por canciones",
    "intent": "transaccional",
    "level": 51,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-52",
    "keyword": "contratar mariachi repertorio completo",
    "intent": "transaccional",
    "level": 52,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-53",
    "keyword": "mariachi presupuesto sin compromiso whatsapp",
    "intent": "transaccional",
    "level": 53,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-54",
    "keyword": "contratar mariachi traje de gala",
    "intent": "transaccional",
    "level": 54,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-55",
    "keyword": "tarifa mariachi kilometraje incluido",
    "intent": "transaccional",
    "level": 55,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-56",
    "keyword": "contratar mariachi fin de semana",
    "intent": "transaccional",
    "level": 56,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-57",
    "keyword": "precio mariachi viernes noche",
    "intent": "transaccional",
    "level": 57,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-58",
    "keyword": "contratar mariachi sabado noche",
    "intent": "transaccional",
    "level": 58,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-59",
    "keyword": "precio hora extra mariachi",
    "intent": "transaccional",
    "level": 59,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-60",
    "keyword": "contratar mariachi sorpresa portal",
    "intent": "transaccional",
    "level": 60,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-61",
    "keyword": "mariachi reserva garantizada fecha",
    "intent": "transaccional",
    "level": 61,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-62",
    "keyword": "contratar mariachi con contrato",
    "intent": "transaccional",
    "level": 62,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-63",
    "keyword": "precio mariachi restaurante privado",
    "intent": "transaccional",
    "level": 63,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-64",
    "keyword": "contratar mariachi chalet particular",
    "intent": "transaccional",
    "level": 64,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-65",
    "keyword": "precio mariachi serenata nocturna",
    "intent": "transaccional",
    "level": 65,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-66",
    "keyword": "contratar mariachi aniversario bodas",
    "intent": "transaccional",
    "level": 66,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-67",
    "keyword": "mariachi descuento reserva anticipada",
    "intent": "transaccional",
    "level": 67,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-68",
    "keyword": "contratar mariachi calidad garantizada",
    "intent": "transaccional",
    "level": 68,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-69",
    "keyword": "precio mariachi para cena empresa",
    "intent": "transaccional",
    "level": 69,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-70",
    "keyword": "contratar mariachi celebracion familiar",
    "intent": "transaccional",
    "level": 70,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-71",
    "keyword": "precio mariachi despedida",
    "intent": "transaccional",
    "level": 71,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-72",
    "keyword": "contratar mariachi entrega flores",
    "intent": "transaccional",
    "level": 72,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-73",
    "keyword": "mariachi reserva confirmada sms",
    "intent": "transaccional",
    "level": 73,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-74",
    "keyword": "contratar mariachi autentico mexicano",
    "intent": "transaccional",
    "level": 74,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-75",
    "keyword": "precio mariachi canciones vicente fernandez",
    "intent": "transaccional",
    "level": 75,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-76",
    "keyword": "contratar mariachi musica en vivo",
    "intent": "transaccional",
    "level": 76,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-77",
    "keyword": "precio mariachi sonido calibrado fincas",
    "intent": "transaccional",
    "level": 77,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-78",
    "keyword": "contratar mariachi sin comisiones agencia",
    "intent": "transaccional",
    "level": 78,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-79",
    "keyword": "mariachi pago senal 100 euros",
    "intent": "transaccional",
    "level": 79,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-80",
    "keyword": "contratar mariachi atencion telefonica 24h",
    "intent": "transaccional",
    "level": 80,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-81",
    "keyword": "precio mariachi recepcion invitados",
    "intent": "transaccional",
    "level": 81,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-82",
    "keyword": "contratar mariachi barra libre boda",
    "intent": "transaccional",
    "level": 82,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-83",
    "keyword": "precio mariachi coctel bienvenida",
    "intent": "transaccional",
    "level": 83,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-84",
    "keyword": "contratar mariachi serenata balcon",
    "intent": "transaccional",
    "level": 84,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-85",
    "keyword": "precio mariachi violin trompeta vihuela",
    "intent": "transaccional",
    "level": 85,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-86",
    "keyword": "contratar mariachi guitarron mexicano",
    "intent": "transaccional",
    "level": 86,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-87",
    "keyword": "precio mariachi sorpresa cumpleanos",
    "intent": "transaccional",
    "level": 87,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-88",
    "keyword": "contratar mariachi jubilacion homenaje",
    "intent": "transaccional",
    "level": 88,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-89",
    "keyword": "precio mariachi graduacion universitaria",
    "intent": "transaccional",
    "level": 89,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-90",
    "keyword": "contratar mariachi show interactivo",
    "intent": "transaccional",
    "level": 90,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-91",
    "keyword": "precio mariachi repertorio boleros rancheros",
    "intent": "transaccional",
    "level": 91,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-92",
    "keyword": "contratar mariachi fiesta mexicana tematica",
    "intent": "transaccional",
    "level": 92,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-93",
    "keyword": "precio mariachi pasacalles patronales",
    "intent": "transaccional",
    "level": 93,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-94",
    "keyword": "contratar mariachi ayuntamiento menor cuantia",
    "intent": "transaccional",
    "level": 94,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-95",
    "keyword": "precio mariachi licitacion municipal",
    "intent": "transaccional",
    "level": 95,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-96",
    "keyword": "contratar mariachi certificado acustico",
    "intent": "transaccional",
    "level": 96,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-97",
    "keyword": "precio mariachi serenata dia de la madre",
    "intent": "transaccional",
    "level": 97,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-98",
    "keyword": "contratar mariachi san valentin",
    "intent": "transaccional",
    "level": 98,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-99",
    "keyword": "precio mariachi dia del padre sorpresa",
    "intent": "transaccional",
    "level": 99,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "transaccional-100",
    "keyword": "contratar mariachi edwin agudelo",
    "intent": "transaccional",
    "level": 100,
    "targetUrl": "/mariachis#precios",
    "cluster": "Contratación y Precios"
  },
  {
    "id": "local-1",
    "keyword": "mariachis en madrid",
    "intent": "local",
    "level": 1,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-2",
    "keyword": "mariachis en barcelona",
    "intent": "local",
    "level": 2,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-3",
    "keyword": "mariachis en valencia",
    "intent": "local",
    "level": 3,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-4",
    "keyword": "mariachis en sevilla",
    "intent": "local",
    "level": 4,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-5",
    "keyword": "mariachis en malaga",
    "intent": "local",
    "level": 5,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-6",
    "keyword": "mariachis en bilbao",
    "intent": "local",
    "level": 6,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-7",
    "keyword": "mariachis en toledo",
    "intent": "local",
    "level": 7,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-8",
    "keyword": "mariachis en zaragoza",
    "intent": "local",
    "level": 8,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-9",
    "keyword": "mariachis en murcia",
    "intent": "local",
    "level": 9,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-10",
    "keyword": "mariachis en palma de mallorca",
    "intent": "local",
    "level": 10,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-11",
    "keyword": "mariachis en las palmas",
    "intent": "local",
    "level": 11,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-12",
    "keyword": "mariachis en alicante",
    "intent": "local",
    "level": 12,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-13",
    "keyword": "mariachis en cordoba",
    "intent": "local",
    "level": 13,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-14",
    "keyword": "mariachis en valladolid",
    "intent": "local",
    "level": 14,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-15",
    "keyword": "mariachis en vigo",
    "intent": "local",
    "level": 15,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-16",
    "keyword": "mariachis en gijon",
    "intent": "local",
    "level": 16,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-17",
    "keyword": "mariachis en granada",
    "intent": "local",
    "level": 17,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-18",
    "keyword": "mariachis en a coruna",
    "intent": "local",
    "level": 18,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-19",
    "keyword": "mariachis en vitoria",
    "intent": "local",
    "level": 19,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-20",
    "keyword": "mariachis en elche",
    "intent": "local",
    "level": 20,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-21",
    "keyword": "mariachis en oviedo",
    "intent": "local",
    "level": 21,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-22",
    "keyword": "mariachis en badalona",
    "intent": "local",
    "level": 22,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-23",
    "keyword": "mariachis en cartagena",
    "intent": "local",
    "level": 23,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-24",
    "keyword": "mariachis en terrassa",
    "intent": "local",
    "level": 24,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-25",
    "keyword": "mariachis en jerez de la frontera",
    "intent": "local",
    "level": 25,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-26",
    "keyword": "mariachis en sabadell",
    "intent": "local",
    "level": 26,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-27",
    "keyword": "mariachis en santa cruz de tenerife",
    "intent": "local",
    "level": 27,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-28",
    "keyword": "mariachis en mostoles",
    "intent": "local",
    "level": 28,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-29",
    "keyword": "mariachis en alcala de henares",
    "intent": "local",
    "level": 29,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-30",
    "keyword": "mariachis en fuenlabrada",
    "intent": "local",
    "level": 30,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-31",
    "keyword": "mariachis en leganes",
    "intent": "local",
    "level": 31,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-32",
    "keyword": "mariachis en getafe",
    "intent": "local",
    "level": 32,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-33",
    "keyword": "mariachis en alcorcon",
    "intent": "local",
    "level": 33,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-34",
    "keyword": "mariachis en marbella",
    "intent": "local",
    "level": 34,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-35",
    "keyword": "mariachis en burgos",
    "intent": "local",
    "level": 35,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-36",
    "keyword": "mariachis en santander",
    "intent": "local",
    "level": 36,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-37",
    "keyword": "mariachis en albacete",
    "intent": "local",
    "level": 37,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-38",
    "keyword": "mariachis en castellon",
    "intent": "local",
    "level": 38,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-39",
    "keyword": "mariachis en logroño",
    "intent": "local",
    "level": 39,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-40",
    "keyword": "mariachis en badajoz",
    "intent": "local",
    "level": 40,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-41",
    "keyword": "mariachis en salamanca",
    "intent": "local",
    "level": 41,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-42",
    "keyword": "mariachis en huelva",
    "intent": "local",
    "level": 42,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-43",
    "keyword": "mariachis en lleida",
    "intent": "local",
    "level": 43,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-44",
    "keyword": "mariachis en tarragona",
    "intent": "local",
    "level": 44,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-45",
    "keyword": "mariachis en leon",
    "intent": "local",
    "level": 45,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-46",
    "keyword": "mariachis en cadiz",
    "intent": "local",
    "level": 46,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-47",
    "keyword": "mariachis en jaen",
    "intent": "local",
    "level": 47,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-48",
    "keyword": "mariachis en ourense",
    "intent": "local",
    "level": 48,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-49",
    "keyword": "mariachis en girona",
    "intent": "local",
    "level": 49,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-50",
    "keyword": "mariachis en lugo",
    "intent": "local",
    "level": 50,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-51",
    "keyword": "mariachis en santiago de compostela",
    "intent": "local",
    "level": 51,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-52",
    "keyword": "mariachis en caceres",
    "intent": "local",
    "level": 52,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-53",
    "keyword": "mariachis en guadalajara espana",
    "intent": "local",
    "level": 53,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-54",
    "keyword": "mariachis en toledo casco historico",
    "intent": "local",
    "level": 54,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-55",
    "keyword": "mariachis en mentrida",
    "intent": "local",
    "level": 55,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-56",
    "keyword": "mariachis en torrijos toledo",
    "intent": "local",
    "level": 56,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-57",
    "keyword": "mariachis en illescas",
    "intent": "local",
    "level": 57,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-58",
    "keyword": "mariachis en talavera de la reina",
    "intent": "local",
    "level": 58,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-59",
    "keyword": "mariachis en aranjuez",
    "intent": "local",
    "level": 59,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-60",
    "keyword": "mariachis en valdemoro",
    "intent": "local",
    "level": 60,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-61",
    "keyword": "mariachis en pinto madrid",
    "intent": "local",
    "level": 61,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-62",
    "keyword": "mariachis en parla",
    "intent": "local",
    "level": 62,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-63",
    "keyword": "mariachis en pozuelo de alarcon",
    "intent": "local",
    "level": 63,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-64",
    "keyword": "mariachis en majadahonda",
    "intent": "local",
    "level": 64,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-65",
    "keyword": "mariachis en las rozas de madrid",
    "intent": "local",
    "level": 65,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-66",
    "keyword": "mariachis en alcobendas",
    "intent": "local",
    "level": 66,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-67",
    "keyword": "mariachis en san sebastian de los reyes",
    "intent": "local",
    "level": 67,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-68",
    "keyword": "mariachis en rivas vaciamadrid",
    "intent": "local",
    "level": 68,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-69",
    "keyword": "mariachis en torrejón de ardoz",
    "intent": "local",
    "level": 69,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-70",
    "keyword": "mariachis en coslada",
    "intent": "local",
    "level": 70,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-71",
    "keyword": "mariachis en collado villalba",
    "intent": "local",
    "level": 71,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-72",
    "keyword": "mariachis en el escorial",
    "intent": "local",
    "level": 72,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-73",
    "keyword": "mariachis en boadilla del monte",
    "intent": "local",
    "level": 73,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-74",
    "keyword": "mariachis en villaviciosa de odon",
    "intent": "local",
    "level": 74,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-75",
    "keyword": "mariachis en san martin de la vega",
    "intent": "local",
    "level": 75,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-76",
    "keyword": "mariachis en navalcarnero",
    "intent": "local",
    "level": 76,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-77",
    "keyword": "mariachis en sant cugat del valles",
    "intent": "local",
    "level": 77,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-78",
    "keyword": "mariachis en hospitalet de llobregat",
    "intent": "local",
    "level": 78,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-79",
    "keyword": "mariachis en sitges masias",
    "intent": "local",
    "level": 79,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-80",
    "keyword": "mariachis en mataró",
    "intent": "local",
    "level": 80,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-81",
    "keyword": "mariachis en girona costa brava",
    "intent": "local",
    "level": 81,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-82",
    "keyword": "mariachis en tarragona salou",
    "intent": "local",
    "level": 82,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-83",
    "keyword": "mariachis en benidorm alicante",
    "intent": "local",
    "level": 83,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-84",
    "keyword": "mariachis en elche torrevieja",
    "intent": "local",
    "level": 84,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-85",
    "keyword": "mariachis en gandia valencia",
    "intent": "local",
    "level": 85,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-86",
    "keyword": "mariachis en dos hermanas sevilla",
    "intent": "local",
    "level": 86,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-87",
    "keyword": "mariachis en alcala de guadaira",
    "intent": "local",
    "level": 87,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-88",
    "keyword": "mariachis en marbella puerto banus",
    "intent": "local",
    "level": 88,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-89",
    "keyword": "mariachis en estepona",
    "intent": "local",
    "level": 89,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-90",
    "keyword": "mariachis en fuengirola",
    "intent": "local",
    "level": 90,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-91",
    "keyword": "mariachis en torremolinos",
    "intent": "local",
    "level": 91,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-92",
    "keyword": "mariachis en mijas",
    "intent": "local",
    "level": 92,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-93",
    "keyword": "mariachis en sotogrande cadiz",
    "intent": "local",
    "level": 93,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-94",
    "keyword": "mariachis en chiclana de la frontera",
    "intent": "local",
    "level": 94,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-95",
    "keyword": "mariachis en el puerto de santa maria",
    "intent": "local",
    "level": 95,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-96",
    "keyword": "mariachis en segovia fincas",
    "intent": "local",
    "level": 96,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-97",
    "keyword": "mariachis en avila bodas",
    "intent": "local",
    "level": 97,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-98",
    "keyword": "mariachis en cuenca espana",
    "intent": "local",
    "level": 98,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-99",
    "keyword": "mariachis en ciudad real",
    "intent": "local",
    "level": 99,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "local-100",
    "keyword": "mariachis en soria y teruel",
    "intent": "local",
    "level": 100,
    "targetUrl": "/mariachis#ciudades",
    "cluster": "Geo-Localización España"
  },
  {
    "id": "evento-1",
    "keyword": "mariachis para bodas",
    "intent": "evento",
    "level": 1,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-2",
    "keyword": "mariachis para bodas en fincas",
    "intent": "evento",
    "level": 2,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-3",
    "keyword": "mariachi entrada de novios",
    "intent": "evento",
    "level": 3,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-4",
    "keyword": "mariachis para coctel de boda",
    "intent": "evento",
    "level": 4,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-5",
    "keyword": "mariachi misa panamericana boda",
    "intent": "evento",
    "level": 5,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-6",
    "keyword": "mariachis sorpresa para la novia",
    "intent": "evento",
    "level": 6,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-7",
    "keyword": "mariachi sorpresa para el novio",
    "intent": "evento",
    "level": 7,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-8",
    "keyword": "mariachis baile nupcial vals",
    "intent": "evento",
    "level": 8,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-9",
    "keyword": "mariachis para barra libre boda",
    "intent": "evento",
    "level": 9,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-10",
    "keyword": "mariachi vals ranchero si nos dejan",
    "intent": "evento",
    "level": 10,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-11",
    "keyword": "mariachis serenatas a domicilio",
    "intent": "evento",
    "level": 11,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-12",
    "keyword": "mariachi serenata bajo el balcon",
    "intent": "evento",
    "level": 12,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-13",
    "keyword": "mariachi serenata pedida de mano",
    "intent": "evento",
    "level": 13,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-14",
    "keyword": "mariachis para declaracion de amor",
    "intent": "evento",
    "level": 14,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-15",
    "keyword": "mariachi pedida de matrimonio sorpresa",
    "intent": "evento",
    "level": 15,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-16",
    "keyword": "mariachis para cumpleanos",
    "intent": "evento",
    "level": 16,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-17",
    "keyword": "mariachi las mananitas a domicilio",
    "intent": "evento",
    "level": 17,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-18",
    "keyword": "mariachis cumpleanos 18 anos",
    "intent": "evento",
    "level": 18,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-19",
    "keyword": "mariachis cumpleanos 30 anos",
    "intent": "evento",
    "level": 19,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-20",
    "keyword": "mariachis cumpleanos 40 anos",
    "intent": "evento",
    "level": 20,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-21",
    "keyword": "mariachis cumpleanos 50 anos",
    "intent": "evento",
    "level": 21,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-22",
    "keyword": "mariachis cumpleanos 60 anos",
    "intent": "evento",
    "level": 22,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-23",
    "keyword": "mariachis cumpleanos 70 anos",
    "intent": "evento",
    "level": 23,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-24",
    "keyword": "mariachis cumpleanos 80 anos",
    "intent": "evento",
    "level": 24,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-25",
    "keyword": "mariachis cumpleanos 90 anos",
    "intent": "evento",
    "level": 25,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-26",
    "keyword": "mariachis para aniversarios",
    "intent": "evento",
    "level": 26,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-27",
    "keyword": "mariachis bodas de plata 25 anos",
    "intent": "evento",
    "level": 27,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-28",
    "keyword": "mariachis bodas de oro 50 anos",
    "intent": "evento",
    "level": 28,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-29",
    "keyword": "mariachis para jubilaciones",
    "intent": "evento",
    "level": 29,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-30",
    "keyword": "mariachi homenaje despedida laboral",
    "intent": "evento",
    "level": 30,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-31",
    "keyword": "mariachis fiesta de jubilacion sorpresa",
    "intent": "evento",
    "level": 31,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-32",
    "keyword": "mariachis para bautizos",
    "intent": "evento",
    "level": 32,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-33",
    "keyword": "mariachis para comuniones",
    "intent": "evento",
    "level": 33,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-34",
    "keyword": "mariachis fiesta de 15 anos quinceanera",
    "intent": "evento",
    "level": 34,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-35",
    "keyword": "mariachi entrada quinceanera vals",
    "intent": "evento",
    "level": 35,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-36",
    "keyword": "mariachis para eventos de empresa",
    "intent": "evento",
    "level": 36,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-37",
    "keyword": "mariachis cena de navidad empresa",
    "intent": "evento",
    "level": 37,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-38",
    "keyword": "mariachis convencion corporativa",
    "intent": "evento",
    "level": 38,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-39",
    "keyword": "mariachis coctel networking tematico",
    "intent": "evento",
    "level": 39,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-40",
    "keyword": "mariachis fiesta de verano empresa",
    "intent": "evento",
    "level": 40,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-41",
    "keyword": "mariachis inauguracion restaurante mexicano",
    "intent": "evento",
    "level": 41,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-42",
    "keyword": "mariachis para fiestas patronales",
    "intent": "evento",
    "level": 42,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-43",
    "keyword": "mariachi fiestas populares plaza",
    "intent": "evento",
    "level": 43,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-44",
    "keyword": "mariachis concierto ayuntamiento",
    "intent": "evento",
    "level": 44,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-45",
    "keyword": "mariachis semana cultural municipal",
    "intent": "evento",
    "level": 45,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-46",
    "keyword": "mariachis verbena municipal",
    "intent": "evento",
    "level": 46,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-47",
    "keyword": "mariachis plaza de toros concierto",
    "intent": "evento",
    "level": 47,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-48",
    "keyword": "mariachis contratacion licitacion menor",
    "intent": "evento",
    "level": 48,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-49",
    "keyword": "mariachis para residencias de mayores",
    "intent": "evento",
    "level": 49,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-50",
    "keyword": "mariachis terapia musical mayores",
    "intent": "evento",
    "level": 50,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-51",
    "keyword": "mariachis homenaje centro de dia",
    "intent": "evento",
    "level": 51,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-52",
    "keyword": "mariachis serenata dia de la madre",
    "intent": "evento",
    "level": 52,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-53",
    "keyword": "mariachis sorpresa dia del padre",
    "intent": "evento",
    "level": 53,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-54",
    "keyword": "mariachis serenata san valentin",
    "intent": "evento",
    "level": 54,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-55",
    "keyword": "mariachis fiesta privada en chalet",
    "intent": "evento",
    "level": 55,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-56",
    "keyword": "mariachis fiesta en terraza atico",
    "intent": "evento",
    "level": 56,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-57",
    "keyword": "mariachis despedida de soltera sorpresa",
    "intent": "evento",
    "level": 57,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-58",
    "keyword": "mariachis para fiestas tematicas mexico",
    "intent": "evento",
    "level": 58,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-59",
    "keyword": "mariachis dia de muertos espana celebracion",
    "intent": "evento",
    "level": 59,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-60",
    "keyword": "mariachis independencia de mexico fiesta espana",
    "intent": "evento",
    "level": 60,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-61",
    "keyword": "mariachis para graduaciones universitarias",
    "intent": "evento",
    "level": 61,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-62",
    "keyword": "mariachis desfile fiesta local",
    "intent": "evento",
    "level": 62,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-63",
    "keyword": "mariachis homenaje sorpresa hospital",
    "intent": "evento",
    "level": 63,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-64",
    "keyword": "mariachis para bodas intimas",
    "intent": "evento",
    "level": 64,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-65",
    "keyword": "mariachis serenata nocturna medianoche",
    "intent": "evento",
    "level": 65,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-66",
    "keyword": "mariachis serenata amanecer",
    "intent": "evento",
    "level": 66,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-67",
    "keyword": "mariachis serenata romántica en jardin",
    "intent": "evento",
    "level": 67,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-68",
    "keyword": "mariachis para banquete nupcial",
    "intent": "evento",
    "level": 68,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-69",
    "keyword": "mariachis bienvenida invitados finca",
    "intent": "evento",
    "level": 69,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-70",
    "keyword": "mariachis animacion banquete boda",
    "intent": "evento",
    "level": 70,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-71",
    "keyword": "mariachis fin de fiesta boda",
    "intent": "evento",
    "level": 71,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-72",
    "keyword": "mariachis para feria de abril caseta",
    "intent": "evento",
    "level": 72,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-73",
    "keyword": "mariachis feria del caballo jerez",
    "intent": "evento",
    "level": 73,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-74",
    "keyword": "mariachis fiestas del pilar zaragoza",
    "intent": "evento",
    "level": 74,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-75",
    "keyword": "mariachis fiestas san isidro madrid",
    "intent": "evento",
    "level": 75,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-76",
    "keyword": "mariachis la merce barcelona",
    "intent": "evento",
    "level": 76,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-77",
    "keyword": "mariachis fallas de valencia actuacion",
    "intent": "evento",
    "level": 77,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-78",
    "keyword": "mariachis feria de malaga",
    "intent": "evento",
    "level": 78,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-79",
    "keyword": "mariachis fiestas patronales toledo",
    "intent": "evento",
    "level": 79,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-80",
    "keyword": "mariachis para hoteles de lujo",
    "intent": "evento",
    "level": 80,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-81",
    "keyword": "mariachis recepcion crucero puerto",
    "intent": "evento",
    "level": 81,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-82",
    "keyword": "mariachis serenata en restaurante privado",
    "intent": "evento",
    "level": 82,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-83",
    "keyword": "mariachis actuacion salon de celebraciones",
    "intent": "evento",
    "level": 83,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-84",
    "keyword": "mariachis para colegios y fiestas fin de curso",
    "intent": "evento",
    "level": 84,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-85",
    "keyword": "mariachis concierto caritativo benéfico",
    "intent": "evento",
    "level": 85,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-86",
    "keyword": "mariachis para centros civicos",
    "intent": "evento",
    "level": 86,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-87",
    "keyword": "mariachis fiesta de asociacion de vecinos",
    "intent": "evento",
    "level": 87,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-88",
    "keyword": "mariachis para pedida en bodega vinicola",
    "intent": "evento",
    "level": 88,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-89",
    "keyword": "mariachis serenata en viñedos toledo",
    "intent": "evento",
    "level": 89,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-90",
    "keyword": "mariachis entrada en carruaje de caballos",
    "intent": "evento",
    "level": 90,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-91",
    "keyword": "mariachis sorpresa a domicilio en furgoneta",
    "intent": "evento",
    "level": 91,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-92",
    "keyword": "mariachis canciones personalizadas homenaje",
    "intent": "evento",
    "level": 92,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-93",
    "keyword": "mariachis misa de difuntos despedida",
    "intent": "evento",
    "level": 93,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-94",
    "keyword": "mariachis recuerdo conmemorativo funeral",
    "intent": "evento",
    "level": 94,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-95",
    "keyword": "mariachis cancion amor eterno homenaje",
    "intent": "evento",
    "level": 95,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-96",
    "keyword": "mariachis cancion el rey fiesta cumpleanos",
    "intent": "evento",
    "level": 96,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-97",
    "keyword": "mariachis serenata motivacional",
    "intent": "evento",
    "level": 97,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-98",
    "keyword": "mariachis musica en directo coctel gala",
    "intent": "evento",
    "level": 98,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-99",
    "keyword": "mariachis evento institucional embajada",
    "intent": "evento",
    "level": 99,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "evento-100",
    "keyword": "mariachis celebracion dia de la hispanidad",
    "intent": "evento",
    "level": 100,
    "targetUrl": "/mariachis#tipos-de-evento",
    "cluster": "Celebraciones y Formatos"
  },
  {
    "id": "informacional-1",
    "keyword": "cuanto cuesta contratar un mariachi en espana",
    "intent": "informacional",
    "level": 1,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-2",
    "keyword": "cuanto dura una actuacion de mariachi",
    "intent": "informacional",
    "level": 2,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-3",
    "keyword": "que instrumentos lleva un mariachi",
    "intent": "informacional",
    "level": 3,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-4",
    "keyword": "diferencia entre charro y mariachi",
    "intent": "informacional",
    "level": 4,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-5",
    "keyword": "origen de la musica de mariachi unesco",
    "intent": "informacional",
    "level": 5,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-6",
    "keyword": "que canciones canta un mariachi en una boda",
    "intent": "informacional",
    "level": 6,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-7",
    "keyword": "letra de las mananitas mariachi completa",
    "intent": "informacional",
    "level": 7,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-8",
    "keyword": "canciones de mariachi para llorar de amor",
    "intent": "informacional",
    "level": 8,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-9",
    "keyword": "mejores boleros rancheros para serenata",
    "intent": "informacional",
    "level": 9,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-10",
    "keyword": "cuantos musicos forman un mariachi",
    "intent": "informacional",
    "level": 10,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-11",
    "keyword": "como contratar un mariachi por primera vez",
    "intent": "informacional",
    "level": 11,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-12",
    "keyword": "normativa de ruido en fincas de bodas",
    "intent": "informacional",
    "level": 12,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-13",
    "keyword": "ley 37 2003 ruido musica en directo decibelios",
    "intent": "informacional",
    "level": 13,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-14",
    "keyword": "limite de decibelios para mariachis en eventos",
    "intent": "informacional",
    "level": 14,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-15",
    "keyword": "que se le regala a un mariachi de propina",
    "intent": "informacional",
    "level": 15,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-16",
    "keyword": "como organizar una serenata sorpresa perfecta",
    "intent": "informacional",
    "level": 16,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-17",
    "keyword": "con cuanta antelacion reservar un mariachi",
    "intent": "informacional",
    "level": 17,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-18",
    "keyword": "que traje usan los mariachis de gala",
    "intent": "informacional",
    "level": 18,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-19",
    "keyword": "que es el sombrero de charro tradicional",
    "intent": "informacional",
    "level": 19,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-20",
    "keyword": "como se llama la guitarra grande del mariachi",
    "intent": "informacional",
    "level": 20,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-21",
    "keyword": "que es la vihuela mexicana sonido",
    "intent": "informacional",
    "level": 21,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-22",
    "keyword": "como se divide un mariachi por secciones",
    "intent": "informacional",
    "level": 22,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-23",
    "keyword": "repertorio clasico de vicente fernandez para mariachi",
    "intent": "informacional",
    "level": 23,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-24",
    "keyword": "mejores canciones de jorge negrete mariachi",
    "intent": "informacional",
    "level": 24,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-25",
    "keyword": "canciones de rocio durcal con mariachi",
    "intent": "informacional",
    "level": 25,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-26",
    "keyword": "canciones de luis miguel con mariachi",
    "intent": "informacional",
    "level": 26,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-27",
    "keyword": "repertorio de mariachi para misa religiosa",
    "intent": "informacional",
    "level": 27,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-28",
    "keyword": "que canciones poner en la entrada de los novios",
    "intent": "informacional",
    "level": 28,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-29",
    "keyword": "vals nupcial mexicano canciones recomendadas",
    "intent": "informacional",
    "level": 29,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-30",
    "keyword": "como funciona el deposito de stripe para reservar mariachi",
    "intent": "informacional",
    "level": 30,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-31",
    "keyword": "es legal poner musica en directo en un chalet",
    "intent": "informacional",
    "level": 31,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-32",
    "keyword": "necesito seguro rc para contratar mariachi",
    "intent": "informacional",
    "level": 32,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-33",
    "keyword": "factura legal contratacion mariachis con iva",
    "intent": "informacional",
    "level": 33,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-34",
    "keyword": "cuanto cobra un musico de mariachi por hora",
    "intent": "informacional",
    "level": 34,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-35",
    "keyword": "como afiliarse a una red de mariachis profesional",
    "intent": "informacional",
    "level": 35,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-36",
    "keyword": "como ganar dinero como musico de mariachi",
    "intent": "informacional",
    "level": 36,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-37",
    "keyword": "donde comprar traje de charro en espana",
    "intent": "informacional",
    "level": 37,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-38",
    "keyword": "como cuidar un sombrerudo charro de fieltro",
    "intent": "informacional",
    "level": 38,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-39",
    "keyword": "que significa dar un grito ranchero tradicional",
    "intent": "informacional",
    "level": 39,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-40",
    "keyword": "como aprender a cantar rancheras voz tenor",
    "intent": "informacional",
    "level": 40,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-41",
    "keyword": "canciones de mariachi para pedir perdon",
    "intent": "informacional",
    "level": 41,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-42",
    "keyword": "canciones de mariachi para pedir matrimonio",
    "intent": "informacional",
    "level": 42,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-43",
    "keyword": "canciones alegres de mariachi para fiesta",
    "intent": "informacional",
    "level": 43,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-44",
    "keyword": "historia del festival internacional del mariachi guadalajara",
    "intent": "informacional",
    "level": 44,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-45",
    "keyword": "mariachi vargas de tecalitlan historia y legado",
    "intent": "informacional",
    "level": 45,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-46",
    "keyword": "mariachi nuevo tecalitlan discografia",
    "intent": "informacional",
    "level": 46,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-47",
    "keyword": "quien fue jose alfredo jimenez compositor",
    "intent": "informacional",
    "level": 47,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-48",
    "keyword": "cancion si nos dejan significado historia",
    "intent": "informacional",
    "level": 48,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-49",
    "keyword": "cancion el rey jose alfredo historia",
    "intent": "informacional",
    "level": 49,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-50",
    "keyword": "cancion volver volver significado",
    "intent": "informacional",
    "level": 50,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-51",
    "keyword": "cancion cielito lindo autor y letra",
    "intent": "informacional",
    "level": 51,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-52",
    "keyword": "cancion la bikina quien la compuso",
    "intent": "informacional",
    "level": 52,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-53",
    "keyword": "cancion amor eterno juan gabriel historia",
    "intent": "informacional",
    "level": 53,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-54",
    "keyword": "cancion cucurrucucu paloma significado",
    "intent": "informacional",
    "level": 54,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-55",
    "keyword": "cancion el jinete jose alfredo jimenez",
    "intent": "informacional",
    "level": 55,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-56",
    "keyword": "cancion ella me canse de rogarle",
    "intent": "informacional",
    "level": 56,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-57",
    "keyword": "cancion media vuelta luis miguel mariachi",
    "intent": "informacional",
    "level": 57,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-58",
    "keyword": "cancion serena de mayo tradiciones",
    "intent": "informacional",
    "level": 58,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-59",
    "keyword": "por que se cantan las mananitas al amanecer",
    "intent": "informacional",
    "level": 59,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-60",
    "keyword": "como se baila el jarabe tapatio",
    "intent": "informacional",
    "level": 60,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-61",
    "keyword": "que es el mariachi tradicional sin trompetas",
    "intent": "informacional",
    "level": 61,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-62",
    "keyword": "mariachi sinfonico que es formacion",
    "intent": "informacional",
    "level": 62,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-63",
    "keyword": "canciones de mariachi para ninos cumpleanos",
    "intent": "informacional",
    "level": 63,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-64",
    "keyword": "canciones de mariachi para el dia de la madre",
    "intent": "informacional",
    "level": 64,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-65",
    "keyword": "canciones de mariachi para el dia del padre",
    "intent": "informacional",
    "level": 65,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-66",
    "keyword": "canciones de mariachi para abuelos homenaje",
    "intent": "informacional",
    "level": 66,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-67",
    "keyword": "como suena un mariachi con sonido bose calibrado",
    "intent": "informacional",
    "level": 67,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-68",
    "keyword": "por que las fincas piden certificado acustico",
    "intent": "informacional",
    "level": 68,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-69",
    "keyword": "que es la microfonia inalambrica uhf para mariachis",
    "intent": "informacional",
    "level": 69,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-70",
    "keyword": "como evitar estafas al contratar mariachis por internet",
    "intent": "informacional",
    "level": 70,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-71",
    "keyword": "por que no contratar mariachis en milanuncios sin fianza",
    "intent": "informacional",
    "level": 71,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-72",
    "keyword": "ventajas de precio cerrado en mariachis",
    "intent": "informacional",
    "level": 72,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-73",
    "keyword": "desglose de kilometraje para desplazamiento de mariachi",
    "intent": "informacional",
    "level": 73,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-74",
    "keyword": "por que se cobra alojamiento a partir de 200 km",
    "intent": "informacional",
    "level": 74,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-75",
    "keyword": "que pasa si llueve durante la serenata mariachi",
    "intent": "informacional",
    "level": 75,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-76",
    "keyword": "se puede cancelar una reserva de mariachi politica de devolucion",
    "intent": "informacional",
    "level": 76,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-77",
    "keyword": "como funciona el bloqueo atomico de fecha en agenda",
    "intent": "informacional",
    "level": 77,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-78",
    "keyword": "que es el split soberano 80 10 10 de productora ear",
    "intent": "informacional",
    "level": 78,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-79",
    "keyword": "como ayuda vimume con la musica en residencias",
    "intent": "informacional",
    "level": 79,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-80",
    "keyword": "que es la terapia 40 hz gamma con musica tradicional",
    "intent": "informacional",
    "level": 80,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-81",
    "keyword": "como desgravar donacion por contratacion musical mecenazgo",
    "intent": "informacional",
    "level": 81,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-82",
    "keyword": "como contratar mariachis para ayuntamiento contrato menor",
    "intent": "informacional",
    "level": 82,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-83",
    "keyword": "requisitos para licitar actuaciones musicales en ayuntamientos",
    "intent": "informacional",
    "level": 83,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-84",
    "keyword": "como facturar en la plataforma face para artistas",
    "intent": "informacional",
    "level": 84,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-85",
    "keyword": "cuantas horas puede tocar un mariachi sin descanso",
    "intent": "informacional",
    "level": 85,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-86",
    "keyword": "que incluye un servicio estandar de mariachis",
    "intent": "informacional",
    "level": 86,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-87",
    "keyword": "diferencia entre trio cuarteto y mariachi completo",
    "intent": "informacional",
    "level": 87,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-88",
    "keyword": "cual es la formacion minima para que suene a mariachi",
    "intent": "informacional",
    "level": 88,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-89",
    "keyword": "que canciones elegir si no conozco musica mexicana",
    "intent": "informacional",
    "level": 89,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-90",
    "keyword": "como preparar el espacio para la llegada del mariachi",
    "intent": "informacional",
    "level": 90,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-91",
    "keyword": "el mariachi necesita toma de corriente electrica para sonido",
    "intent": "informacional",
    "level": 91,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-92",
    "keyword": "bateria portatil bose s1 pro duracion actuacion mariachi",
    "intent": "informacional",
    "level": 92,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-93",
    "keyword": "como coordinar la sorpresa con los musicos sin que se enteren los novios",
    "intent": "informacional",
    "level": 93,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-94",
    "keyword": "se puede pedir canciones fuera de repertorio al mariachi",
    "intent": "informacional",
    "level": 94,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-95",
    "keyword": "como encargar una cancion ranchera personalizada de estudio",
    "intent": "informacional",
    "level": 95,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-96",
    "keyword": "como grabar un video dedicatoria 4k con mariachi",
    "intent": "informacional",
    "level": 96,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-97",
    "keyword": "quien es edwin agudelo trayectoria cantante mariachi espana",
    "intent": "informacional",
    "level": 97,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-98",
    "keyword": "discografia y presentaciones de edwin agudelo",
    "intent": "informacional",
    "level": 98,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-99",
    "keyword": "mariachi imperial espana formacion y calidad",
    "intent": "informacional",
    "level": 99,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  },
  {
    "id": "informacional-100",
    "keyword": "como vestirse para asistir a una fiesta mexicana con mariachi",
    "intent": "informacional",
    "level": 100,
    "targetUrl": "/mariachis#preguntas-frecuentes",
    "cluster": "Cultura y Guías Técnicas"
  }
];

export const KEYWORDS_BY_INTENT: Record<SearchIntentCategory, MariachiKeywordNode[]> = {
  transaccional: MARIACHI_KEYWORDS_400.filter(k => k.intent === "transaccional"),
  local: MARIACHI_KEYWORDS_400.filter(k => k.intent === "local"),
  evento: MARIACHI_KEYWORDS_400.filter(k => k.intent === "evento"),
  informacional: MARIACHI_KEYWORDS_400.filter(k => k.intent === "informacional")
};
