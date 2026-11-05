const fs = require("fs");
let c = fs.readFileSync("src/features/finance/ui/MultiPricer.tsx", "utf8");

// Reemplazar la definición de 'BOOKING ARTÍSTICO DE GALA' para que use IDs únicos
const oldBlock = `  'BOOKING ARTÍSTICO DE GALA': [
    { id: PRICING_CATALOG['clasico-esencial'].id, name: PRICING_CATALOG['clasico-esencial'].name, price: PRICING_CATALOG['clasico-esencial'].basePrice, icon: <Sparkles size={20} />, desc: PRICING_CATALOG['clasico-esencial'].description, category: 'BOOKING' },
    { id: PRICING_CATALOG['premium-gala'].id, name: PRICING_CATALOG['premium-gala'].name, price: PRICING_CATALOG['premium-gala'].basePrice, icon: <Users size={20} />, desc: PRICING_CATALOG['premium-gala'].description, category: 'BOOKING' },
    { id: PRICING_CATALOG['cuarteto-imperial'].id, name: PRICING_CATALOG['cuarteto-imperial'].name, price: PRICING_CATALOG['cuarteto-imperial'].basePrice, icon: <Award size={20} />, desc: PRICING_CATALOG['cuarteto-imperial'].description, category: 'BOOKING' },
    { id: PRICING_CATALOG['quinteto-honor'].id, name: PRICING_CATALOG['quinteto-honor'].name, price: PRICING_CATALOG['quinteto-honor'].basePrice, icon: <Activity size={20} />, desc: PRICING_CATALOG['quinteto-honor'].description, category: 'BOOKING' },
    { id: PRICING_CATALOG['sinfonico-royal'].id, name: PRICING_CATALOG['sinfonico-royal'].name, price: PRICING_CATALOG['sinfonico-royal'].basePrice, icon: <Activity size={20} />, desc: PRICING_CATALOG['sinfonico-royal'].description, category: 'BOOKING' },
    { id: PRICING_CATALOG['octeto-magistral'].id, name: PRICING_CATALOG['octeto-magistral'].name, price: PRICING_CATALOG['octeto-magistral'].basePrice, icon: <Activity size={20} />, desc: PRICING_CATALOG['octeto-magistral'].description, category: 'BOOKING' },
    { id: PRICING_CATALOG['banda-monumental'].id, name: PRICING_CATALOG['banda-monumental'].name, price: PRICING_CATALOG['banda-monumental'].basePrice, icon: <Boxes size={20} />, desc: PRICING_CATALOG['banda-monumental'].description, category: 'BOOKING' }
  ],`;

const newBlock = `  'BOOKING ARTÍSTICO DE GALA': [
    { id: 'booking-solista', name: PRICING_CATALOG['clasico-esencial'].name, price: PRICING_CATALOG['clasico-esencial'].basePrice, icon: <Sparkles size={20} />, desc: PRICING_CATALOG['clasico-esencial'].description, category: 'BOOKING' },
    { id: 'booking-gran-ensamble', name: PRICING_CATALOG['premium-gala'].name, price: PRICING_CATALOG['premium-gala'].basePrice, icon: <Users size={20} />, desc: PRICING_CATALOG['premium-gala'].description, category: 'BOOKING' },
    { id: 'booking-cuarteto', name: PRICING_CATALOG['cuarteto-imperial'].name, price: PRICING_CATALOG['cuarteto-imperial'].basePrice, icon: <Award size={20} />, desc: PRICING_CATALOG['cuarteto-imperial'].description, category: 'BOOKING' },
    { id: 'booking-quinteto', name: PRICING_CATALOG['quinteto-honor'].name, price: PRICING_CATALOG['quinteto-honor'].basePrice, icon: <Activity size={20} />, desc: PRICING_CATALOG['quinteto-honor'].description, category: 'BOOKING' },
    { id: 'booking-sinfonico', name: PRICING_CATALOG['sinfonico-royal'].name, price: PRICING_CATALOG['sinfonico-royal'].basePrice, icon: <Activity size={20} />, desc: PRICING_CATALOG['sinfonico-royal'].description, category: 'BOOKING' },
    { id: 'booking-octeto', name: PRICING_CATALOG['octeto-magistral'].name, price: PRICING_CATALOG['octeto-magistral'].basePrice, icon: <Activity size={20} />, desc: PRICING_CATALOG['octeto-magistral'].description, category: 'BOOKING' },
    { id: 'booking-banda', name: PRICING_CATALOG['banda-monumental'].name, price: PRICING_CATALOG['banda-monumental'].basePrice, icon: <Boxes size={20} />, desc: PRICING_CATALOG['banda-monumental'].description, category: 'BOOKING' }
  ],`;

c = c.replace(oldBlock.replace(/\r\n/g, "\n"), newBlock);
c = c.replace(oldBlock.replace(/\n/g, "\r\n"), newBlock);
fs.writeFileSync("src/features/finance/ui/MultiPricer.tsx", c, "utf8");
console.log("Fix de keys duplicadas aplicado en MultiPricer.tsx");

