const templates = ['AURA_ONYX', 'KINETIC_GOLD', 'INSTITUTIONAL_BLUE', 'MINIMAL_GLASS'];

function getTemplateForProvince(province) {
  const hash = province.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return templates[hash % templates.length];
}

const provincias = [
  "alava", "albacete", "alicante", "almeria", "asturias", "avila", "badajoz", "baleares", 
  "barcelona", "burgos", "caceres", "cadiz", "cantabria", "castellon", "ciudad-real", 
  "cordoba", "cuenca", "gerona", "granada", "guadalajara", "guipuzcoa", "huelva", "huesca", 
  "jaen", "leon", "lerida", "lugo", "madrid", "malaga", "murcia", "navarra", "orense", 
  "palencia", "las-palmas", "pontevedra", "la-rio_ja", "salamanca", "segovia", "sevilla", 
  "soria", "tarragona", "santa-cruz-de-tenerife", "teruel", "toledo", "valencia", 
  "valladolid", "vizcaya", "zamora", "zaragoza", "ceuta", "melilla"
];

const results = {};
provincias.forEach(p => {
  const t = getTemplateForProvince(p);
  if (!results[t]) results[t] = p;
});

console.log(JSON.stringify(results, null, 2));
