import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PROVINCES = [
  { id: "ALAVA", name: "Álava", priceMultiplier: 1.0 },
  { id: "ALBACETE", name: "Albacete", priceMultiplier: 0.9 },
  { id: "ALICANTE", name: "Alicante", priceMultiplier: 1.1 },
  { id: "ALMERIA", name: "Almería", priceMultiplier: 1.0 },
  { id: "ASTURIAS", name: "Asturias", priceMultiplier: 1.0 },
  { id: "AVILA", name: "Ávila", priceMultiplier: 0.9 },
  { id: "BADAJOZ", name: "Badajoz", priceMultiplier: 0.9 },
  { id: "BALEARES", name: "Baleares", priceMultiplier: 1.3 },
  { id: "BARCELONA", name: "Barcelona", priceMultiplier: 1.25 },
  { id: "BURGOS", name: "Burgos", priceMultiplier: 1.0 },
  { id: "CACERES", name: "Cáceres", priceMultiplier: 0.9 },
  { id: "CADIZ", name: "Cádiz", priceMultiplier: 1.1 },
  { id: "CANTABRIA", name: "Cantabria", priceMultiplier: 1.0 },
  { id: "CASTELLON", name: "Castellón", priceMultiplier: 1.0 },
  { id: "CIUDADREAL", name: "Ciudad Real", priceMultiplier: 0.9 },
  { id: "CORDOBA", name: "Córdoba", priceMultiplier: 1.0 },
  { id: "CORUNA", name: "A Coruña", priceMultiplier: 1.1 },
  { id: "CUENCA", name: "Cuenca", priceMultiplier: 0.9 },
  { id: "GIRONA", name: "Girona", priceMultiplier: 1.2 },
  { id: "GRANADA", name: "Granada", priceMultiplier: 1.0 },
  { id: "GUADALAJARA", name: "Guadalajara", priceMultiplier: 1.0 },
  { id: "GUIPUZCOA", name: "Guipúzcoa", priceMultiplier: 1.2 },
  { id: "HUELVA", name: "Huelva", priceMultiplier: 1.0 },
  { id: "HUESCA", name: "Huesca", priceMultiplier: 1.0 },
  { id: "JAEN", name: "Jaén", priceMultiplier: 0.9 },
  { id: "LEON", name: "León", priceMultiplier: 1.0 },
  { id: "LLEIDA", name: "Lleida", priceMultiplier: 1.1 },
  { id: "LUGO", name: "Lugo", priceMultiplier: 0.9 },
  { id: "MADRID", name: "Madrid", priceMultiplier: 1.3 },
  { id: "MALAGA", name: "Málaga", priceMultiplier: 1.2 },
  { id: "MURCIA", name: "Murcia", priceMultiplier: 1.0 },
  { id: "NAVARRA", name: "Navarra", priceMultiplier: 1.2 },
  { id: "OURENSE", name: "Ourense", priceMultiplier: 0.9 },
  { id: "PALENCIA", name: "Palencia", priceMultiplier: 0.9 },
  { id: "PALMAS", name: "Las Palmas", priceMultiplier: 1.2 },
  { id: "PONTEVEDRA", name: "Pontevedra", priceMultiplier: 1.1 },
  { id: "LA_RIOJA", name: "La Rioja", priceMultiplier: 1.1 },
  { id: "SALAMANCA", name: "Salamanca", priceMultiplier: 1.0 },
  { id: "TENERIFE", name: "Santa Cruz de Tenerife", priceMultiplier: 1.2 },
  { id: "SEGOVIA", name: "Segovia", priceMultiplier: 1.0 },
  { id: "SEVILLA", name: "Sevilla", priceMultiplier: 1.2 },
  { id: "SORIA", name: "Soria", priceMultiplier: 0.9 },
  { id: "TARRAGONA", name: "Tarragona", priceMultiplier: 1.1 },
  { id: "TERUEL", name: "Teruel", priceMultiplier: 0.9 },
  { id: "TOLEDO", name: "Toledo", priceMultiplier: 1.0 },
  { id: "VALENCIA", name: "Valencia", priceMultiplier: 1.2 },
  { id: "VALLADOLID", name: "Valladolid", priceMultiplier: 1.1 },
  { id: "VIZCAYA", name: "Vizcaya", priceMultiplier: 1.2 },
  { id: "ZAMORA", name: "Zamora", priceMultiplier: 0.9 },
  { id: "ZARAGOZA", name: "Zaragoza", priceMultiplier: 1.1 },
  { id: "CEUTA", name: "Ceuta", priceMultiplier: 1.0 },
  { id: "MELILLA", name: "Melilla", priceMultiplier: 1.0 }
];

async function main() {
  console.log("🌍 Inyectando 52 provincias en el Marketplace Soberano...");
  
  for (const p of PROVINCES) {
    await prisma.province.upsert({
      where: { id: p.id },
      update: { priceMultiplier: p.priceMultiplier },
      create: p
    });
  }
  
  console.log("✅ Dominancia Geográfica establecida.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
