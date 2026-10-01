'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Calculator,
  Lock,
  Unlock,
  AlertTriangle,
  Sparkles,
  Download,
  Share2,
  Printer,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  DollarSign,
  Users,
  Building2,
  Utensils,
  Music,
  Camera,
  Heart,
  Car,
  Gift,
  Palette,
  Gem,
  Smile,
  Plane,
  Volume2,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Clock,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  TrendingUp,
  Sliders,
  Compass,
  PieChart,
  Star,
  Phone,
  Eye,
  ChevronRight,
  Mic,
  Award
} from 'lucide-react';
import Link from 'next/link';

// ── DEFINICIÓN DE TIPOS S-CLASS ──
export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  isLocked: boolean;
  color: string;
  icon: any;
  apiCategory?: string; // Para match en /api/profiles/search
  routeHref?: string;   // Enlace al catálogo
  lakeCountLabel?: string;
  benchmarkMinPerPax?: number; // Para catering y banquete
  benchmarkMinFixed?: number;  // Para solistas, foto, etc.
  description: string;
}

export interface OfficialPack {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  badge: string;
  description: string;
  features: string[];
  icon: any;
  highlight?: boolean;
}

export interface LiveProviderItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  province?: string;
  address?: string;
  phone?: string | null;
  img?: string;
  gallery?: string[];
  basePrice?: number;
  price?: string;
  rating?: number;
  reviews?: number;
  description?: string;
}

// ── PACKS OFICIALES PRODUCTORA EAR (CACHÉ CANÓNICO CERRADO) ──
export const OFFICIAL_EAR_PACKS: OfficialPack[] = [
  {
    id: 'solista_gala',
    name: 'Solista Lírico S-Class (Edwin Agudelo)',
    subtitle: 'Ceremonia Nupcial, Recepción o Banquete',
    price: 350.00,
    badge: 'Artista Insignia',
    description: 'Voz lírica de alta tesitura para firmas de acta y momentos solemnes. Sonido Bose S1 Pro y microfonía Shure Axient.',
    features: ['Voz lírica en directo', 'Microfonía Shure Axient / Beta 87A', 'Sonido Bose S1 Pro', 'Repertorio sacro & baladas'],
    icon: Mic
  },
  {
    id: 'mariachi_trio',
    name: "Mariachi 'Gala de Oro' (Trío Charro)",
    subtitle: 'Serenata Tradicional o Cóctel de Bienvenida',
    price: 550.00,
    badge: 'Favorito Bodas',
    description: '3 Músicos con auténtico traje de gala charro (voz, guitarra, trompeta). Serenatas sorpresa y momentos de euforia.',
    features: ['3 Músicos de gala', 'Traje charro completo', 'Clásicos mexicanos', 'Acústica equilibrada < 75 dBA'],
    icon: Sparkles
  },
  {
    id: 'mariachi_imperial',
    name: "Mariachi 'Imperial S-Class' (Quinteto)",
    subtitle: 'Edwin Agudelo + 4 Maestros de Gala',
    price: 850.00,
    badge: 'Top Selección',
    description: 'Quinteto estelar: tenor solista, guitarrón, vihuela, violín y trompeta solista. Sonorización Bose F1 Model 812 incluida.',
    features: ['5 Músicos de primer nivel', 'Sonido Bose F1 (12 W/pax)', 'Gran impacto visual', 'Sonoridad sin acoples'],
    icon: Music,
    highlight: true
  },
  {
    id: 'cuarteto_sinfonia',
    name: "Cuarteto de Cuerdas 'Sinfonía Nupcial'",
    subtitle: '2 Violines, Viola & Violonchelo Clásico',
    price: 650.00,
    badge: 'Ceremonias de Gala',
    description: 'Elegancia clásica para ceremonias religiosas y civiles. Piezas sacras, bandas sonoras y adaptaciones pop selectas.',
    features: ['4 Músicos de conservatorio', 'Microfonía DPA 4099', 'Repertorio clásico & bandas sonoras', 'Pureza acústica'],
    icon: Heart
  },
  {
    id: 'pack_boda_completa',
    name: 'Pack Boda Integral S-Class (3 en 1)',
    subtitle: 'Ceremonia Lírica + Mariachi Cóctel + DJ Fiesta',
    price: 1450.00,
    badge: 'Mejor Valor',
    description: 'Cobertura total: Edwin Agudelo en ceremonia, Mariachi en cóctel y DJ profesional con sonido Bose F1 e iluminación en barra libre.',
    features: ['Ceremonia lírica completa', 'Pase de Mariachi en cóctel', 'DJ & iluminación en barra libre', 'Técnico de sonido dedicado'],
    icon: Star,
    highlight: true
  },
  {
    id: 'pack_sonido_finca',
    name: 'Sonorización & Iluminación B2B Finca',
    subtitle: 'Garantía Acústica Certificada < 75 dBA SPL',
    price: 600.00,
    badge: 'Cero Sanciones',
    description: 'Montaje de sonido Bose F1 y microfonía para fincas y espacios de eventos. Protección legal contra denuncias sonométricas.',
    features: ['Columnas Bose F1 Model 812', 'Microfonía inalámbrica Shure', 'Certificado sonométrico < 75 dBA', '10% comisión para la finca'],
    icon: Volume2
  }
];

// ── LAS 14 PARTIDAS CARDINALES DEL EVENTO (INTEGRACIÓN MULTI-GREMIO TOTAL) ──
const INITIAL_CATEGORIES: BudgetCategory[] = [
  {
    id: 'banquete',
    name: 'Espacios & Fincas de Gala',
    allocated: 0,
    isLocked: false,
    color: '#ecb613', // Oro Imperial
    icon: Building2,
    apiCategory: 'finca',
    routeHref: '/fincas',
    lakeCountLabel: '9.978 Fincas',
    benchmarkMinPerPax: 85,
    benchmarkMinFixed: 2500,
    description: 'Alquiler de recinto, palacio histórico, cortijo, masía o dehesa exclusiva.'
  },
  {
    id: 'catering',
    name: 'Gastronomía de Gala & Catering',
    allocated: 0,
    isLocked: false,
    color: '#f59e0b', // Ámbar Gastronómico
    icon: Utensils,
    apiCategory: 'catering',
    routeHref: '/proveedores-servicios?category=catering',
    lakeCountLabel: '4.494 Caterings',
    benchmarkMinPerPax: 75,
    benchmarkMinFixed: 2000,
    description: 'Banquete de gala, cóctel de bienvenida, córners gourmet y barra libre premium.'
  },
  {
    id: 'musica',
    name: 'Música en Directo & Shows S-Class',
    allocated: 0,
    isLocked: false,
    color: '#FF2B44', // Rubí Diamante
    icon: Music,
    apiCategory: 'musica',
    routeHref: '/artistas',
    lakeCountLabel: '6.710 Artistas',
    benchmarkMinFixed: 350,
    description: 'Solista Edwin Agudelo (350€), Mariachis, Cuartetos de cuerda, DJs y sonido Bose F1.'
  },
  {
    id: 'foto_video',
    name: 'Fotografía & Cinematografía',
    allocated: 0,
    isLocked: false,
    color: '#00E5FF', // Cyan Eléctrico
    icon: Camera,
    apiCategory: 'foto',
    routeHref: '/proveedores-servicios?category=foto',
    lakeCountLabel: '36.517 Fotógrafos',
    benchmarkMinFixed: 900,
    description: 'Reportaje completo de autor, documental cinematográfico 4K y tomas aéreas con dron.'
  },
  {
    id: 'flores_decoracion',
    name: 'Arte Floral, Floristería & Escenografía',
    allocated: 0,
    isLocked: false,
    color: '#a855f7', // Violeta
    icon: Palette,
    apiCategory: 'decoracion',
    routeHref: '/proveedores-servicios?category=decoracion',
    lakeCountLabel: '1.750 Diseñadores',
    benchmarkMinFixed: 500,
    description: 'Ramo de novia de autor, arcos de ceremonia, centros de mesa y ambientación con velas.'
  },
  {
    id: 'ceremonia',
    name: 'Ceremonia, Oficiantes & Protocolo',
    allocated: 0,
    isLocked: false,
    color: '#f43f5e', // Rosa gala
    icon: Heart,
    apiCategory: 'servicios',
    routeHref: '/proveedores-servicios?category=servicios',
    lakeCountLabel: '9.350 Profesionales',
    benchmarkMinFixed: 200,
    description: 'Maestros de ceremonia bilingües, oficiantes civiles, actores de enlace y protocolo.'
  },
  {
    id: 'novia',
    name: 'Novia de Alta Costura & Atelier',
    allocated: 0,
    isLocked: false,
    color: '#fb7185',
    icon: Sparkles,
    apiCategory: 'moda',
    routeHref: '/proveedores-servicios?category=moda',
    lakeCountLabel: '8.985 Boutiques',
    benchmarkMinFixed: 1200,
    description: 'Vestido nupcial artesanal, velo bordado a mano, calzado de gala y tiaras exclusivas.'
  },
  {
    id: 'novio',
    name: 'Novio & Sastrería de Gala',
    allocated: 0,
    isLocked: false,
    color: '#38bdf8',
    icon: Sparkles,
    apiCategory: 'moda',
    routeHref: '/proveedores-servicios?category=moda',
    lakeCountLabel: '8.985 Boutiques',
    benchmarkMinFixed: 600,
    description: 'Traje de ceremonia, chaqué a medida, chaleco artesanal, calzado y gemelos.'
  },
  {
    id: 'transporte',
    name: 'Logística, Autobuses & Flota VIP',
    allocated: 0,
    isLocked: false,
    color: '#fbbf24',
    icon: Car,
    apiCategory: 'transporte',
    routeHref: '/proveedores-servicios?category=transporte',
    lakeCountLabel: '2.116 Flotas',
    benchmarkMinFixed: 400,
    description: 'Autobuses VIP para traslado de invitados y vehículos de época o deportivos para novios.'
  },
  {
    id: 'sonido_audiovisual',
    name: 'Sonorización, Iluminación & Pantallas LED',
    allocated: 0,
    isLocked: false,
    color: '#3b82f6',
    icon: Volume2,
    apiCategory: 'sonido',
    routeHref: '/alquiler-equipos-sonido-audiovisuales',
    lakeCountLabel: '11.078 Empresas',
    benchmarkMinFixed: 450,
    description: 'Sistemas Bose/L-Acoustics, iluminación robotizada, microfonía y pantallas gigantes.'
  },
  {
    id: 'joyeria',
    name: 'Alianzas & Joyería de Enlace',
    allocated: 0,
    isLocked: false,
    color: '#eab308',
    icon: Gem,
    benchmarkMinFixed: 350,
    description: 'Alianzas en oro de 18k, arras históricas y grabado conmemorativo personalizado.'
  },
  {
    id: 'belleza',
    name: 'Estilismo, Peluquería & Spa Nupcial',
    allocated: 0,
    isLocked: false,
    color: '#f472b6',
    icon: Smile,
    benchmarkMinFixed: 250,
    description: 'Pruebas de peinado, maquillaje profesional waterproof de larga duración y ritual spa.'
  },
  {
    id: 'invitaciones',
    name: 'Papelería, Web Nupcial & Minutas',
    allocated: 0,
    isLocked: false,
    color: '#34d399',
    icon: Gift,
    benchmarkMinFixed: 150,
    description: 'Invitaciones caligrafiadas a mano, sobres lacrados, minutas impresas y web con RSVP.'
  },
  {
    id: 'luna_miel',
    name: 'Viaje de Novios (Luna de Miel)',
    allocated: 0,
    isLocked: false,
    color: '#06b6d4',
    icon: Plane,
    benchmarkMinFixed: 2000,
    description: 'Vuelos internacionales, resorts de cinco estrellas, safaris y experiencias VIP.'
  }
];

// ── PESTAÑAS DEL RADAR NEURAL MULTI-GREMIO ──
const RADAR_TRADES = [
  { key: 'finca', label: 'Espacios & Fincas', icon: Building2, count: '9.978', color: '#ecb613' },
  { key: 'catering', label: 'Catering & Gastro', icon: Utensils, count: '4.494', color: '#f59e0b' },
  { key: 'musica', label: 'Música & Artistas', icon: Music, count: '6.710', color: '#FF2B44' },
  { key: 'foto', label: 'Foto & Vídeo', icon: Camera, count: '36.517', color: '#00E5FF' },
  { key: 'decoracion', label: 'Flores & Decoración', icon: Palette, count: '1.750', color: '#a855f7' },
  { key: 'servicios', label: 'Ceremonia & Planners', icon: Heart, count: '9.350', color: '#f43f5e' },
  { key: 'moda', label: 'Moda Nupcial', icon: Sparkles, count: '8.985', color: '#fb7185' },
  { key: 'transporte', label: 'Autobuses & Flotas', icon: Car, count: '2.116', color: '#fbbf24' },
  { key: 'sonido', label: 'Audiovisuales & Luces', icon: Volume2, count: '11.078', color: '#3b82f6' }
];

export default function SovereignBudgetPlanner() {
  // Estado limpio partiendo de 0 € (mandato expreso del CEO)
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [paxCount, setPaxCount] = useState<number>(100);
  const [province, setProvince] = useState<string>('Madrid');
  const [categories, setCategories] = useState<BudgetCategory[]>(INITIAL_CATEGORIES);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // 🎯 Estado del Radar Neural de Proveedores Reales en Vivo
  const [activeRadarTrade, setActiveRadarTrade] = useState<string>('catering');
  const [radarProviders, setRadarProviders] = useState<LiveProviderItem[]>([]);
  const [radarLoading, setRadarLoading] = useState(false);
  const [radarTotal, setRadarTotal] = useState<number>(0);

  // 💳 Estado de Checkout Stripe Price-Lock (100 €)
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);

  // 🎵 Estado de Pack Oficial EAR seleccionado
  const [selectedOfficialPack, setSelectedOfficialPack] = useState<string | null>(null);

  // Inicialización o lectura de Hash de URL (Enlace Mágico Compartible)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      try {
        const rawHash = window.location.hash.replace('#plan=', '');
        if (rawHash) {
          const decoded = JSON.parse(decodeURIComponent(atob(rawHash)));
          if (decoded.totalBudget) setTotalBudget(Number(decoded.totalBudget));
          if (decoded.paxCount) setPaxCount(Number(decoded.paxCount));
          if (decoded.province) setProvince(decoded.province);
          if (Array.isArray(decoded.categories)) {
            const hydrated = decoded.categories.map((c: any) => {
              const base = INITIAL_CATEGORIES.find((b) => b.id === c.id);
              return {
                ...c,
                color: base?.color || '#ecb613',
                icon: base?.icon || Sparkles,
                apiCategory: base?.apiCategory,
                routeHref: base?.routeHref,
                lakeCountLabel: base?.lakeCountLabel
              };
            });
            setCategories(hydrated);
          }
        }
      } catch (e) {
        console.error('Error restaurando plan desde URL:', e);
      }
    }
  }, []);

  // 🧠 Carga en Vivo de Proveedores Reales según Gremio y Provincia
  useEffect(() => {
    let isCancelled = false;
    async function fetchLiveTradeProviders() {
      setRadarLoading(true);
      try {
        const res = await fetch(
          `/api/profiles/search?category=${encodeURIComponent(activeRadarTrade)}&province=${encodeURIComponent(province)}&limit=6`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!isCancelled) {
          const list: LiveProviderItem[] = data.providers || data.items || [];
          setRadarProviders(list);
          setRadarTotal(data.total || list.length);
        }
      } catch (err) {
        console.warn('Radar fetch notice:', err);
        if (!isCancelled) {
          setRadarProviders([]);
        }
      } finally {
        if (!isCancelled) setRadarLoading(false);
      }
    }

    fetchLiveTradeProviders();
    return () => {
      isCancelled = true;
    };
  }, [activeRadarTrade, province]);

  // Suma total calculada
  const totalAllocated = useMemo(() => {
    return categories.reduce((sum, cat) => sum + (Number(cat.allocated) || 0), 0);
  }, [categories]);

  const remainingBudget = totalBudget - totalAllocated;
  const allocationPercent = totalBudget > 0 ? Math.min(100, Math.round((totalAllocated / totalBudget) * 100)) : 0;

  // Split Soberano 80/10/10 Canónico
  const artistSplit = useMemo(() => totalAllocated * 0.80, [totalAllocated]);
  const infraSplit = useMemo(() => totalAllocated * 0.10, [totalAllocated]);
  const vimumeSplit = useMemo(() => totalAllocated * 0.10, [totalAllocated]);
  const fiscalDeductionMax = useMemo(() => vimumeSplit * 0.80, [vimumeSplit]);

  // Toggle candado
  const toggleLock = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isLocked: !c.isLocked } : c))
    );
  };

  // Cambio de importe en una categoría
  const handleAllocatedChange = (id: string, newVal: number) => {
    const val = Math.max(0, newVal);
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, allocated: val } : c))
    );
  };

  // 1-Click: Asignar Pack Oficial Productora EAR
  const handleSelectOfficialPack = (pack: OfficialPack) => {
    setSelectedOfficialPack(pack.id);
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === 'musica') {
          return {
            ...c,
            allocated: pack.price,
            isLocked: true // Bloquea con candado para proteger el caché oficial
          };
        }
        return c;
      })
    );
  };

  // Presets de escenarios maestros
  const applyPresetScenario = (scenarioBudget: number, scenarioPax: number) => {
    setTotalBudget(scenarioBudget);
    setPaxCount(scenarioPax);

    const weights: Record<string, number> = {
      banquete: 0.28,
      catering: 0.24,
      musica: 0.08,
      foto_video: 0.09,
      flores_decoracion: 0.04,
      ceremonia: 0.02,
      novia: 0.07,
      novio: 0.03,
      transporte: 0.03,
      sonido_audiovisual: 0.04,
      joyeria: 0.02,
      belleza: 0.01,
      invitaciones: 0.01,
      luna_miel: 0.04
    };

    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        isLocked: false,
        allocated: Math.round(scenarioBudget * (weights[c.id] || 0.02))
      }))
    );
  };

  // Distribución automática proporcional respetando candados
  const handleAutoDistribute = () => {
    if (totalBudget <= 0) return;

    const weights: Record<string, number> = {
      banquete: 0.28,
      catering: 0.24,
      musica: 0.08,
      foto_video: 0.09,
      flores_decoracion: 0.04,
      ceremonia: 0.02,
      novia: 0.07,
      novio: 0.03,
      transporte: 0.03,
      sonido_audiovisual: 0.04,
      joyeria: 0.02,
      belleza: 0.01,
      invitaciones: 0.01,
      luna_miel: 0.04
    };

    setCategories((prev) => {
      const lockedSum = prev
        .filter((c) => c.isLocked)
        .reduce((sum, c) => sum + c.allocated, 0);

      const availableToDistribute = Math.max(0, totalBudget - lockedSum);
      const unlockedCats = prev.filter((c) => !c.isLocked);
      const sumUnlockedWeights = unlockedCats.reduce(
        (sum, c) => sum + (weights[c.id] || 0.02),
        0
      );

      return prev.map((c) => {
        if (c.isLocked) return c;
        const w = weights[c.id] || 0.02;
        const normalizedWeight = sumUnlockedWeights > 0 ? w / sumUnlockedWeights : 1 / unlockedCats.length;
        return {
          ...c,
          allocated: Math.round(availableToDistribute * normalizedWeight)
        };
      });
    });
  };

  // Añadir nueva categoría
  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: BudgetCategory = {
      id: `custom_${Date.now()}`,
      name: newCatName.trim(),
      allocated: 0,
      isLocked: false,
      color: '#e2e8f0',
      icon: Plus,
      description: 'Partida personalizada incorporada a tu evento.'
    };
    setCategories((prev) => [...prev, newCat]);
    setNewCatName('');
    setShowAddModal(false);
  };

  // Eliminar categoría
  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // 🧠 ORÁCULO ASTRA DE REALIDAD (Auditoría de viabilidad)
  const realityAudit = useMemo(() => {
    const issues: { text: string; severity: 'critical' | 'warning' | 'optimal' }[] = [];
    let score = 100;

    // 1. Chequeo Banquete & Espacio
    const banqueteCat = categories.find((c) => c.id === 'banquete');
    if (banqueteCat && banqueteCat.allocated > 0 && banqueteCat.allocated < 2000) {
      score -= 15;
      issues.push({
        text: `Espacio/Finca: En ${province}, el alquiler de una finca de gala parte habitualmente de 2.000 € - 3.500 €. Con ${banqueteCat.allocated.toLocaleString()} € la partida requiere ajuste.`,
        severity: 'warning'
      });
    }

    // 2. Chequeo Catering
    const cateringCat = categories.find((c) => c.id === 'catering');
    if (cateringCat && cateringCat.allocated > 0) {
      const minEstimatedCatering = paxCount * (cateringCat.benchmarkMinPerPax || 75);
      if (cateringCat.allocated < minEstimatedCatering) {
        score -= 25;
        issues.push({
          text: `Catering: Para ${paxCount} comensales, un menú nupcial completo con cóctel y barra libre requiere mínimo ${minEstimatedCatering.toLocaleString()} € (${cateringCat.benchmarkMinPerPax} €/pax). Con ${cateringCat.allocated.toLocaleString()} € la media es de ${(cateringCat.allocated / paxCount).toFixed(0)} €/pax.`,
          severity: 'warning'
        });
      }
    }

    // 3. Chequeo Música S-Class
    const musicaCat = categories.find((c) => c.id === 'musica');
    if (musicaCat && musicaCat.allocated > 0 && musicaCat.allocated < 350) {
      score -= 15;
      issues.push({
        text: `Música: El caché mínimo oficial de un solista acústico lírico con sonido Bose es de 350 €. Con ${musicaCat.allocated} € la partida queda por debajo del umbral profesional.`,
        severity: 'warning'
      });
    }

    // 4. Chequeo Desfase Presupuestario
    if (totalBudget > 0 && totalAllocated > totalBudget) {
      score -= 35;
      issues.push({
        text: `Desfase Financiero: Asignación de ${totalAllocated.toLocaleString()} € excede tu presupuesto objetivo de ${totalBudget.toLocaleString()} € en ${(totalAllocated - totalBudget).toLocaleString()} €.`,
        severity: 'critical'
      });
    }

    if (totalBudget > 0 && issues.length === 0 && totalAllocated > 0) {
      issues.push({
        text: `Equilibrio S-Class: Tu distribución financiera entre las 14 partidas es armónica y perfectamente ejecutable en ${province}.`,
        severity: 'optimal'
      });
    }

    return { score: Math.max(0, score), issues };
  }, [categories, paxCount, totalBudget, totalAllocated, province]);

  // Generador de Enlace Mágico
  const generateMagicShareLink = useCallback(() => {
    const payload = {
      totalBudget,
      paxCount,
      province,
      categories: categories.map(({ id, name, allocated, isLocked, description }) => ({
        id,
        name,
        allocated,
        isLocked,
        description
      }))
    };
    const jsonStr = JSON.stringify(payload);
    const b64 = btoa(encodeURIComponent(jsonStr));
    const fullUrl = `${window.location.origin}/calculadora#plan=${b64}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  }, [totalBudget, paxCount, province, categories]);

  // Mensaje WhatsApp Concierge
  const whatsappBudgetShare = useMemo(() => {
    const text = encodeURIComponent(
      `🏛️ *Plan Maestro de Evento S-Class · Productora EAR*\n` +
      `Demarcación: ${province} | Invitados: ${paxCount} pax\n` +
      `Presupuesto Objetivo: ${totalBudget.toLocaleString()} €\n` +
      `Total Asignado: ${totalAllocated.toLocaleString()} €\n\n` +
      `*Desglose por Partidas:*\n` +
      categories
        .filter((c) => c.allocated > 0)
        .map((c) => `• ${c.name}: ${c.allocated.toLocaleString()} €`)
        .join('\n') +
      `\n\n*Split Soberano Ético 80/10/10:*\n` +
      `• Proveedores (80%): ${artistSplit.toLocaleString()} €\n` +
      `• EAR OS (10%): ${infraSplit.toLocaleString()} €\n` +
      `• VIMUME Retorno Social (10%): ${vimumeSplit.toLocaleString()} € (Deducción fiscal IRPF/Soc. hasta ${fiscalDeductionMax.toFixed(0)} €)\n\n` +
      `Quiero verificar disponibilidad con este presupuesto cerrado y coordinar los 100 € de Price-Lock.`
    );
    return `https://wa.me/34693693048?text=${text}`;
  }, [province, paxCount, totalBudget, totalAllocated, categories, artistSplit, infraSplit, vimumeSplit, fiscalDeductionMax]);

  // Stripe Price-Lock Checkout (100 €)
  const handleStripeDepositCheckout = async () => {
    setDepositError(null);
    setDepositLoading(true);
    try {
      const selectedMusica = categories.find((c) => c.id === 'musica')?.allocated || 350;
      const res = await fetch('/api/reservar/solista/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
          formato: selectedOfficialPack
            ? OFFICIAL_EAR_PACKS.find((p) => p.id === selectedOfficialPack)?.name
            : `Presupuesto Integral S-Class (${province})`,
          distanciaKm: province.toLowerCase() === 'madrid' ? 46 : 60,
          horaFin: '02:00',
          totalEstimado: totalAllocated > 0 ? totalAllocated : 1000
        })
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'No se pudo generar la sesión de pago.');
      }
      window.location.href = data.url;
    } catch (err: any) {
      setDepositError(err.message || 'Error al conectar con Stripe.');
      setDepositLoading(false);
    }
  };

  return (
    <div className="w-full space-y-12 font-sans text-slate-100 selection:bg-[#ecb613] selection:text-black">
      
      {/* ── ESCENARIOS PREDEFINIDOS RÁPIDOS (1-CLICK LUXURY SEED) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-[#09090e]/90 border border-white/10 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ecb613] uppercase tracking-wider">
          <Sparkles size={14} className="text-[#ecb613]" />
          <span>Escenarios Maestros 1-Clic:</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPresetScenario(18000, 70)}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition flex items-center gap-1.5"
          >
            <span>💎 Íntima (18.000 € · 70 pax)</span>
          </button>

          <button
            type="button"
            onClick={() => applyPresetScenario(35000, 130)}
            className="px-3.5 py-1.5 rounded-xl bg-[#ecb613]/15 hover:bg-[#ecb613]/25 border border-[#ecb613]/40 text-xs font-mono text-[#ecb613] font-bold transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(236,182,19,0.2)]"
          >
            <span>👑 Imperial (35.000 € · 130 pax)</span>
          </button>

          <button
            type="button"
            onClick={() => applyPresetScenario(65000, 250)}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition flex items-center gap-1.5"
          >
            <span>🏛️ Gran Gala (65.000 € · 250 pax)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTotalBudget(0);
              setCategories(INITIAL_CATEGORIES);
              setSelectedOfficialPack(null);
            }}
            className="px-3 py-1.5 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-xs font-mono text-red-300 transition flex items-center gap-1"
            title="Restablecer presupuesto a cero"
          >
            <RefreshCw size={12} />
            <span>Limpiar a 0 €</span>
          </button>
        </div>
      </div>

      {/* ── PANEL HUD MAESTRO DE 7 CIFRAS (OLED ONYX & GOLDEN AURA) ── */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-b from-[#0c0c14] via-[#07070b] to-[#040407] border border-white/15 p-6 sm:p-10 lg:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Glow de Aura Imperial */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-gradient-radial from-[#ecb613]/15 via-transparent to-transparent blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-radial from-[#00E5FF]/10 via-transparent to-transparent blur-[120px]" />

        <div className="relative z-10 space-y-8">
          
          {/* Fila Superior: Título + Acciones Pro */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-white/10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[11px] font-mono font-black uppercase tracking-[0.2em]">
                <ShieldCheck size={13} className="text-[#ecb613]" />
                <span>TERMINAL SOBERANO MULTI-GREMIO // S-CLASS OMEGA</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-syne uppercase tracking-tight text-white leading-none">
                Calculadora <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">de Riqueza Nupcial</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-normal max-w-2xl leading-relaxed">
                Control absoluto sobre todos los gremios del evento: Fincas, Catering, Artistas, Fotografía, Flores, Protocolo, Moda y Logística. Conecta tus partidas con más de 90.000 proveedores en tiempo real.
              </p>
            </div>

            {/* BOTONES DE EXPORTACIÓN */}
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <button
                type="button"
                onClick={generateMagicShareLink}
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white flex items-center gap-2 transition shadow-lg active:scale-95"
              >
                {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-[#ecb613]" />}
                <span className="font-bold">{copiedLink ? '¡Enlace Guardado!' : 'Copiar Hash'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white flex items-center gap-2 transition"
              >
                <Printer size={14} className="text-zinc-400" />
                <span className="font-bold">PDF / Imprimir</span>
              </button>

              <a
                href={whatsappBudgetShare}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-emerald-400 text-black font-black uppercase text-xs flex items-center gap-2 transition shadow-[0_0_25px_rgba(37,211,102,0.3)] active:scale-95"
              >
                <MessageSquare size={14} className="fill-black" />
                <span>Enviar a Concierge</span>
              </a>
            </div>
          </div>

          {/* KPI GRID DE 4 COLUMNAS DE ALTA PRECISIÓN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1: PRESUPUESTO MAESTRO */}
            <div className="p-5 rounded-3xl bg-[#0e0e17] border border-white/10 space-y-2 hover:border-[#ecb613]/50 transition group">
              <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                <span className="uppercase font-bold tracking-wider">Presupuesto Objetivo</span>
                <DollarSign size={14} className="text-[#ecb613]" />
              </div>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={totalBudget === 0 ? '' : totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value) || 0)}
                  placeholder="0 €"
                  className="w-full bg-transparent text-2xl sm:text-3xl font-black font-mono text-white outline-none focus:text-[#ecb613] transition"
                />
              </div>
              <button
                type="button"
                onClick={handleAutoDistribute}
                disabled={totalBudget <= 0}
                className="text-[10px] font-mono text-[#ecb613] hover:underline flex items-center gap-1 font-bold disabled:opacity-30 pt-1"
              >
                <RefreshCw size={11} /> Auto-distribuir proporcionalmente
              </button>
            </div>

            {/* KPI 2: INVITADOS & DEMOGRAFÍA */}
            <div className="p-5 rounded-3xl bg-[#0e0e17] border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                <span className="uppercase font-bold tracking-wider">Invitados (Aforo Pax)</span>
                <Users size={14} className="text-[#00E5FF]" />
              </div>
              <input
                type="number"
                min={10}
                max={1500}
                value={paxCount}
                onChange={(e) => setPaxCount(Math.max(1, Number(e.target.value)))}
                className="w-full bg-transparent text-2xl sm:text-3xl font-black font-mono text-white outline-none focus:text-[#00E5FF] transition"
              />
              <span className="text-[10px] font-mono text-zinc-500 block pt-1">
                Coste medio: {totalBudget > 0 && paxCount > 0 ? `${(totalBudget / paxCount).toFixed(0)} € / invitado` : '0 €/pax'}
              </span>
            </div>

            {/* KPI 3: PROVINCIA & LOGÍSTICA */}
            <div className="p-5 rounded-3xl bg-[#0e0e17] border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                <span className="uppercase font-bold tracking-wider">Demarcación</span>
                <Compass size={14} className="text-[#a855f7]" />
              </div>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full bg-transparent text-lg sm:text-xl font-black font-mono text-white outline-none cursor-pointer"
              >
                {['Madrid', 'Toledo', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga', 'Alicante', 'Cádiz', 'Segovia', 'Ávila', 'Guadalajara', 'Zaragoza', 'A Coruña', 'Baleares', 'Granada', 'Murcia', 'Valladolid'].map((p) => (
                  <option key={p} value={p} className="bg-[#0e0e17] text-white">{p}</option>
                ))}
              </select>
              <span className="text-[10px] font-mono text-zinc-500 block pt-1">
                Base logística oficial en {province}
              </span>
            </div>

            {/* KPI 4: BALANCE RESTANTE & PRECISIÓN */}
            <div className="p-5 rounded-3xl bg-[#0e0e17] border border-white/10 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                <span className="uppercase font-bold tracking-wider">Balance Restante</span>
                <PieChart size={14} className={remainingBudget < 0 ? 'text-red-400' : 'text-emerald-400'} />
              </div>
              <div>
                <span className={`text-2xl sm:text-3xl font-black font-mono ${remainingBudget < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {remainingBudget > 0 ? `+${remainingBudget.toLocaleString()} €` : `${remainingBudget.toLocaleString()} €`}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 block mt-1">
                  Asignado: {totalAllocated.toLocaleString()} € ({allocationPercent}%)
                </span>
              </div>
            </div>

          </div>

          {/* ── BARRA DINÁMICA DEL ESPECTRO DE DISTRIBUCIÓN (SPECTRUM ALLOCATOR) ── */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <TrendingUp size={13} className="text-[#ecb613]" /> Espectro de Asignación Financiera
              </span>
              <span className="text-white font-mono font-bold">
                {totalAllocated.toLocaleString()} € de {totalBudget.toLocaleString()} €
              </span>
            </div>

            {/* Barra Segmentada */}
            <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden flex border border-white/10 p-0.5">
              {categories
                .filter((c) => c.allocated > 0)
                .map((cat) => {
                  const pct = totalAllocated > 0 ? (cat.allocated / totalAllocated) * 100 : 0;
                  return (
                    <div
                      key={cat.id}
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                      className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300 relative group cursor-pointer"
                      title={`${cat.name}: ${cat.allocated.toLocaleString()} € (${pct.toFixed(1)}%)`}
                    />
                  );
                })}
            </div>

            {/* Píldoras Rápidas de Leyenda */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px]">
              {categories
                .filter((c) => c.allocated > 0)
                .slice(0, 8)
                .map((cat) => (
                  <div key={cat.id} className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-zinc-300 truncate max-w-[120px]">{cat.name.split(' ')[0]}</span>
                    <span className="font-bold text-white">{cat.allocated.toLocaleString()}€</span>
                  </div>
                ))}
              {categories.filter((c) => c.allocated > 0).length > 8 && (
                <span className="text-zinc-500 font-mono text-[10px] pl-1">
                  +{categories.filter((c) => c.allocated > 0).length - 8} más
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── PACKS CANÓNICOS OFICIALES DE PRODUCTORA EAR (1-CLIC INTEGRADO) ── */}
      <div className="space-y-4 rounded-3xl bg-[#090910] border border-[#ecb613]/30 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono font-bold uppercase tracking-widest">
              <Award size={12} />
              <span>Formatos Canónicos Productora EAR · Caché Oficial</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-syne uppercase text-white mt-1">
              Packs de Producción Directa en 1 Clic
            </h3>
            <p className="text-xs text-zinc-400 font-normal">
              Selecciona un formato oficial para incorporarlo de inmediato a tu partida de música con rider acústico Bose incluido.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {OFFICIAL_EAR_PACKS.map((pack) => {
            const Icon = pack.icon;
            const isSelected = selectedOfficialPack === pack.id;

            return (
              <div
                key={pack.id}
                onClick={() => handleSelectOfficialPack(pack)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'bg-[#ecb613]/15 border-[#ecb613] shadow-[0_0_25px_rgba(236,182,19,0.2)] ring-1 ring-[#ecb613]'
                    : 'bg-[#06060a] border-white/10 hover:border-white/20 hover:bg-[#0c0c14]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-[#ecb613] border border-[#ecb613]/30">
                      {pack.badge}
                    </span>
                    <span className="text-lg font-black font-mono text-white">
                      {pack.price.toFixed(2)} €
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white font-syne leading-tight">
                    {pack.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-normal">
                    {pack.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono">
                  <span className="text-zinc-500 flex items-center gap-1">
                    <Icon size={13} className="text-[#ecb613]" /> Sonido Bose Oficial
                  </span>
                  <span className={`font-bold ${isSelected ? 'text-[#ecb613]' : 'text-zinc-400 group-hover:text-white'}`}>
                    {isSelected ? '✓ Seleccionado' : 'Asignar Pack →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ORÁCULO ASTRA: AUDITORÍA DE VIABILIDAD Y BAÑO DE REALIDAD ── */}
      <div className={`p-6 sm:p-8 rounded-[2rem] border transition-all ${
        realityAudit.score < 70
          ? 'bg-red-950/20 border-red-500/40'
          : realityAudit.score < 90
            ? 'bg-amber-950/20 border-amber-500/40'
            : 'bg-emerald-950/20 border-emerald-500/30'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${
              realityAudit.score < 70 ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-[#ecb613]/20 border-[#ecb613]/40 text-[#ecb613]'
            }`}>
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                Inteligencia Predictiva Financiera
              </span>
              <h3 className="text-lg font-black font-syne uppercase text-white">
                Oráculo de Viabilidad en Tiempo Real
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-zinc-400">Puntuación de Coherencia:</span>
            <span className={`px-3 py-1 rounded-full font-black text-xs border ${
              realityAudit.score < 70
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : realityAudit.score < 90
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
            }`}>
              {realityAudit.score} / 100
            </span>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          {realityAudit.issues.map((issue, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs font-mono leading-relaxed">
              <span className={`shrink-0 mt-0.5 ${
                issue.severity === 'critical' ? 'text-red-400' : issue.severity === 'warning' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {issue.severity === 'optimal' ? '✓' : '▲'}
              </span>
              <span className="text-zinc-300">{issue.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MATRIZ DE LAS 14 CATEGORÍAS CARDINALES (BENTO CARDS S-CLASS) ── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-black block">
              Desglose Exhaustivo Multi-Gremio
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-syne uppercase text-white">
              Las 14 Partidas Cardinales de tu Evento
            </h2>
            <p className="text-xs text-zinc-400 font-normal mt-0.5">
              Bloquea con el candado 🔒 las partidas fijas para que no se alteren al auto-distribuir.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono font-bold text-white flex items-center gap-2 transition"
          >
            <Plus size={15} className="text-[#ecb613]" />
            <span>+ Nueva Partida</span>
          </button>
        </div>

        {/* Grilla de Tarjetas Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon || Sparkles;
            const isCustom = cat.id.startsWith('custom_');

            return (
              <div
                key={cat.id}
                className={`p-6 rounded-[2rem] border transition-all flex flex-col justify-between gap-4 group ${
                  cat.isLocked
                    ? 'bg-[#0e0e18] border-[#ecb613]/70 shadow-[0_10px_35px_rgba(236,182,19,0.15)] ring-1 ring-[#ecb613]/30'
                    : 'bg-[#08080d] border-white/10 hover:border-white/25 hover:bg-[#0c0c14]'
                }`}
              >
                {/* Cabecera Tarjeta: Icono + Nombre + Lock Button */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 shadow-lg"
                      style={{
                        backgroundColor: `${cat.color}15`,
                        borderColor: `${cat.color}40`,
                        color: cat.color
                      }}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold font-syne text-sm text-white truncate" title={cat.name}>
                        {cat.name}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-mono truncate">
                        {cat.lakeCountLabel || cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleLock(cat.id)}
                      className={`p-2 rounded-xl border font-mono text-[10px] font-bold uppercase transition flex items-center gap-1 ${
                        cat.isLocked
                          ? 'bg-[#ecb613] text-black border-[#ecb613] shadow-md'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                      title={cat.isLocked ? 'Fijado: No se altera en auto-distribución' : 'Libre: Se adapta al presupuesto'}
                    >
                      {cat.isLocked ? <Lock size={13} className="fill-black" /> : <Unlock size={13} />}
                    </button>

                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 text-zinc-600 hover:text-red-400 transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Input de Importe + Slider */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                      {totalBudget > 0 ? `${((cat.allocated / totalBudget) * 100).toFixed(1)}% del total` : '0%'}
                    </span>

                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min={0}
                        step={50}
                        value={cat.allocated === 0 ? '' : cat.allocated}
                        onChange={(e) => handleAllocatedChange(cat.id, Number(e.target.value))}
                        placeholder="0"
                        className="w-32 text-right bg-[#050508] border border-white/15 focus:border-[#ecb613] rounded-xl px-3 py-1.5 text-lg font-black font-mono text-white outline-none transition"
                      />
                      <span className="ml-1.5 font-mono text-xs text-[#ecb613] font-bold">€</span>
                    </div>
                  </div>

                  {/* Slider táctil */}
                  <input
                    type="range"
                    min={0}
                    max={Math.max(5000, totalBudget > 0 ? totalBudget : 35000)}
                    step={50}
                    value={cat.allocated}
                    disabled={cat.isLocked}
                    onChange={(e) => handleAllocatedChange(cat.id, Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer accent-[#ecb613] disabled:opacity-30"
                  />
                </div>

                {/* Acciones directas de la categoría */}
                {cat.apiCategory && (
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveRadarTrade(cat.apiCategory!);
                        const el = document.getElementById('radar-neural-proveedores');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-[#ecb613] hover:underline flex items-center gap-1 font-bold"
                    >
                      <Eye size={12} /> Ver en Radar en Vivo
                    </button>

                    {cat.routeHref && (
                      <Link
                        href={`${cat.routeHref}${cat.routeHref.includes('?') ? '&' : '?'}province=${encodeURIComponent(province)}&maxBudget=${cat.allocated || 5000}`}
                        className="text-zinc-400 hover:text-white flex items-center gap-1 transition"
                      >
                        Catálogo <ChevronRight size={12} />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 🛰️ RADAR NEURAL MULTI-GREMIO DE PROVEEDORES REALES EN DIRECTO ── */}
      <div id="radar-neural-proveedores" className="space-y-6 pt-4">
        <div className="rounded-[2.5rem] bg-gradient-to-b from-[#0c0c16] via-[#07070d] to-[#040407] border border-white/15 p-6 sm:p-10 shadow-2xl space-y-6">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono font-bold uppercase tracking-widest">
                <Zap size={12} />
                <span>DIRECTORIO CANÓNICO NACIONAL EN VIVO</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-syne uppercase text-white mt-1">
                Radar de Proveedores Reales en {province}
              </h3>
              <p className="text-xs text-zinc-400 font-normal">
                Explora los mejores proveedores verificados de cada gremio que encajan con tu presupuesto actual.
              </p>
            </div>

            <div className="text-xs font-mono text-zinc-400 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
              Gremio Activo: <strong className="text-[#ecb613]">{radarTotal.toLocaleString()}</strong> profesionales indexados
            </div>
          </div>

          {/* Pestañas de Selección de Gremio */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
            {RADAR_TRADES.map((trade) => {
              const Icon = trade.icon;
              const isActive = activeRadarTrade === trade.key;

              return (
                <button
                  key={trade.key}
                  type="button"
                  onClick={() => setActiveRadarTrade(trade.key)}
                  className={`px-4 py-2.5 rounded-2xl border transition-all shrink-0 flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#ecb613] text-black border-[#ecb613] font-black shadow-lg shadow-[#ecb613]/20'
                      : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-black' : 'text-[#ecb613]'} />
                  <span>{trade.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? 'bg-black/20 text-black' : 'bg-white/5 text-zinc-400'}`}>
                    {trade.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Grilla de Proveedores Reales del Gremio */}
          {radarLoading ? (
            <div className="py-20 text-center font-mono text-xs text-zinc-500">
              <div className="inline-block animate-spin mr-2">⚙️</div>
              Consultando red de {activeRadarTrade} en {province}…
            </div>
          ) : radarProviders.length === 0 ? (
            <div className="py-16 text-center text-xs font-mono text-zinc-400 bg-white/5 rounded-2xl border border-white/10 p-6">
              No hay registros directos en este filtro local. Consulta con el Concierge oficial al +34 693 693 048 para asignación personalizada en {province}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {radarProviders.map((p) => {
                const assignedForTrade = categories.find((c) => c.apiCategory === activeRadarTrade)?.allocated || 0;
                const contactUrl = `https://wa.me/34693693048?text=${encodeURIComponent(
                  `Hola Concierge EAR, he visto a *${p.name}* en el catálogo de *${activeRadarTrade}* para mi evento en *${province}* (mi presupuesto asignado a esta partida es de ${assignedForTrade.toLocaleString()} €). Quiero verificar disponibilidad y condiciones.`
                )}`;

                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-3xl bg-[#08080f] border border-white/10 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between gap-4 group"
                  >
                    <div className="space-y-3">
                      {/* Imagen Real */}
                      <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
                        {p.img ? (
                          <img
                            src={p.img}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-xs">
                            Imagen en Alta Definición
                          </div>
                        )}
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono font-bold text-[#ecb613] flex items-center gap-1">
                          <Star size={11} className="fill-[#ecb613]" />
                          <span>{p.rating ? p.rating.toFixed(1) : '5.0'}</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                          {p.province || province} · {activeRadarTrade.toUpperCase()}
                        </span>
                        <h4 className="font-bold text-base text-white font-syne truncate group-hover:text-[#ecb613] transition" title={p.name}>
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-zinc-400 font-normal line-clamp-2 mt-1">
                          {p.description || 'Proveedor verificado con solvencia técnica y disponibilidad para bodas y eventos de alta gala.'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-500">Partida Asignada:</span>
                        <span className="font-bold text-white">
                          {assignedForTrade > 0 ? `${assignedForTrade.toLocaleString()} €` : 'Sin asignar'}
                        </span>
                      </div>

                      <div className="flex gap-2 font-mono text-xs">
                        <a
                          href={contactUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-[#25D366] hover:text-black border border-white/10 text-white font-bold transition text-center flex items-center justify-center gap-1.5"
                        >
                          <Phone size={12} /> Contactar
                        </a>

                        <Link
                          href={`/proveedores-servicios?category=${activeRadarTrade}&province=${encodeURIComponent(province)}`}
                          className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white transition flex items-center justify-center"
                          title="Explorar más de este gremio"
                        >
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── TERMINAL DE CIERRE SOBERANO & STRIPE PRICE-LOCK (100 €) ── */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-[#0d0d18] via-[#090910] to-[#0d0d18] border-2 border-[#ecb613]/70 p-8 sm:p-12 shadow-[0_20px_70px_rgba(236,182,19,0.25)] space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/20 border border-[#ecb613]/40 text-[#ecb613] text-[10px] font-mono font-black uppercase tracking-widest">
              <ShieldCheck size={13} className="text-[#ecb613]" />
              <span>CIERRE VINCULANTE // FIANZA INMUTABLE 100 €</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black font-syne uppercase text-white leading-tight">
              Formaliza tu Reserva con Fianza Protegida
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-normal max-w-xl leading-relaxed">
              El depósito de 100,00 € mediante Stripe formaliza la fianza inmutable (custodia garantizada 72h). El resto se liquida el día del evento con cada proveedor.
            </p>
          </div>

          <div className="text-right font-mono space-y-1">
            <span className="text-xs text-zinc-400 uppercase tracking-wider block">Fianza de Bloqueo Oficial</span>
            <span className="text-4xl sm:text-5xl font-black text-[#ecb613]">100,00 €</span>
            <span className="text-[10px] text-zinc-500 block">Stripe Price-Lock SHA-256</span>
          </div>
        </div>

        {/* Desglose Split Soberano 80/10/10 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-zinc-400">80% Proveedores & Artistas</span>
            <span className="text-xl font-black text-white block">{artistSplit.toLocaleString()} €</span>
            <span className="text-[10px] text-zinc-500">Retribución neta directa</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-zinc-400">10% Plataforma EAR OS</span>
            <span className="text-xl font-black text-[#ecb613] block">{infraSplit.toLocaleString()} €</span>
            <span className="text-[10px] text-zinc-500">Telemetría, soporte & Edge</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-zinc-400">10% Retorno Social VIMUME</span>
            <span className="text-xl font-black text-[#00E5FF] block">{vimumeSplit.toLocaleString()} €</span>
            <span className="text-[10px] text-zinc-400">
              Deducción fiscal de hasta <strong>{fiscalDeductionMax.toFixed(0)} €</strong> (Ley 49/2002)
            </span>
          </div>
        </div>

        {/* Botones de Cierre */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleStripeDepositCheckout}
              disabled={depositLoading}
              className="px-8 py-4 rounded-2xl bg-[#ecb613] hover:bg-white text-black font-black uppercase text-xs font-mono transition flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(236,182,19,0.4)] active:scale-95 disabled:opacity-50"
            >
              <ShieldCheck size={16} className="fill-black" />
              <span>{depositLoading ? 'Conectando con Stripe…' : 'Bloquear Fecha con 100 € en Stripe'}</span>
            </button>

            <a
              href={whatsappBudgetShare}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold uppercase text-xs font-mono transition flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} className="text-[#ecb613]" />
              <span>Enviar Presupuesto a WhatsApp Oficial</span>
            </a>
          </div>

          <div className="text-right text-[11px] font-mono text-zinc-400">
            Atención telefónica oficial: <strong className="text-white">+34 693 693 048</strong>
          </div>
        </div>

        {depositError && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs font-mono text-red-300">
            {depositError}
          </div>
        )}

        <div className="pt-4 border-t border-white/5 text-[11px] text-zinc-400 font-normal leading-relaxed">
          <strong>Transparencia Contractual:</strong> Cada proveedor homologado opera bajo su propia solvencia, acreditación y póliza de seguro reglamentaria de origen. Productora EAR garantiza la cobertura técnica y rider acústico Bose F1 en sus producciones directas.
        </div>
      </div>

      {/* ── MODAL AÑADIR NUEVA PARTIDA ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0b12] border border-white/15 rounded-3xl p-8 max-w-md w-full space-y-5 shadow-2xl">
            <h3 className="text-xl font-black text-white font-syne uppercase">
              Añadir Nueva Partida de Gasto
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Escribe el nombre del concepto que deseas incorporar a tu presupuesto.
            </p>
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Ej: Candy Bar, Carpas Gigantes, Fuegos Artificiales..."
              className="w-full bg-[#050508] border border-white/15 rounded-2xl px-4 py-3 text-sm text-white font-mono focus:border-[#ecb613] outline-none"
            />
            <div className="flex justify-end gap-2.5 pt-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-3 bg-white/5 text-zinc-400 hover:text-white rounded-xl border border-white/10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-5 py-3 bg-[#ecb613] text-black font-black uppercase rounded-xl shadow-lg"
              >
                Crear Partida
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
