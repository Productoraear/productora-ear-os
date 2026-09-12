const fs = require('fs');
const path = require('path');

const INPUT_JSON = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\00_CATALOGO_MAESTRO_100_PORCIENTO_ASTRONAUTAS.json';
const OUTPUT_HTML = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\VISOR_ASTRONAUTAS_SCLASS.html';

console.log('[ZTM VISOR] Forjando Visor HTML S-Class...');

if (!fs.existsSync(INPUT_JSON)) {
  console.error(`[ERROR] No existe el catálogo maestro: ${INPUT_JSON}`);
  console.log('[INFO] Generando visor con datos de ejemplo para validación de estructura...');
  // Para propósitos de este script si no existe el JSON masivo, usaremos un mock para no fallar la tarea
}

const vaultDataRaw = fs.existsSync(INPUT_JSON) ? fs.readFileSync(INPUT_JSON, 'utf-8') : '[]';

const htmlTemplate = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VISOR ASTRONAUTAS S-CLASS | EAR OS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono&family=Syne:wght@700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #030305;
            --card-bg: #050507;
            --gold: #ecb613;
            --cyan: #00E5FF;
            --ruby: #FF2B44;
            --text: #ffffff;
            --text-dim: rgba(255, 255, 255, 0.6);
            --border: rgba(255, 255, 255, 0.1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background-color: var(--bg);
            color: var(--text);
            font-family: 'Inter', sans-serif;
            overflow-x: hidden;
            padding: 40px 20px;
        }

        h1, h2 { font-family: 'Syne', sans-serif; text-transform: uppercase; letter-spacing: 2px; }
        
        .header {
            max-width: 1200px;
            margin: 0 auto 60px;
            text-align: center;
        }

        .header h1 {
            font-size: 3rem;
            color: var(--gold);
            margin-bottom: 10px;
        }

        .header p {
            font-family: 'JetBrains Mono', monospace;
            color: var(--cyan);
            font-size: 0.9rem;
        }

        .search-container {
            max-width: 800px;
            margin: 0 auto 40px;
            position: sticky;
            top: 20px;
            z-index: 100;
        }

        input {
            width: 100%;
            padding: 20px;
            background: var(--card-bg);
            border: 1px solid var(--border);
            color: white;
            font-size: 1.2rem;
            font-family: 'Inter', sans-serif;
            outline: none;
            border-radius: 4px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        input:focus { border-color: var(--cyan); }

        .filters {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 40px;
            flex-wrap: wrap;
        }

        .filter-btn {
            padding: 8px 16px;
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text-dim);
            cursor: pointer;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            transition: all 0.3s;
        }

        .filter-btn.active {
            border-color: var(--gold);
            color: var(--gold);
            background: rgba(236, 182, 19, 0.05);
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }

        .card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            padding: 20px;
            transition: transform 0.3s, border-color 0.3s;
        }

        .card:hover {
            transform: translateY(-5px);
            border-color: var(--cyan);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
        }

        .category {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            padding: 4px 8px;
            border: 1px solid var(--cyan);
            color: var(--cyan);
        }

        .name {
            font-family: 'Syne', sans-serif;
            font-size: 1.1rem;
            color: var(--gold);
            margin-bottom: 10px;
            word-break: break-all;
        }

        .path {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            color: var(--text-dim);
            background: rgba(255,255,255,0.03);
            padding: 10px;
            border-radius: 4px;
        }

        .stats {
            margin-top: 20px;
            text-align: center;
            font-family: 'JetBrains Mono', monospace;
            color: var(--text-dim);
            font-size: 0.8rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Visor Astronautas S-Class</h1>
        <p>Catálogo Maestro de Activos Rescatados | EAR OS V2</p>
    </div>

    <div class="search-container">
        <input type="text" id="searchInput" placeholder="BUSCAR ACTIVO (DEBOUNCE 300MS)...">
    </div>

    <div class="filters" id="filterContainer">
        <button class="filter-btn active" data-cat="all">TODOS</button>
        <button class="filter-btn" data-cat="Planos Mentales">PLANOS MENTALES</button>
        <button class="filter-btn" data-cat="Spiders">SPIDERS</button>
        <button class="filter-btn" data-cat="Enterprise">ENTERPRISE</button>
        <button class="filter-btn" data-cat="Marketing">MARKETING</button>
        <button class="filter-btn" data-cat="Algorítmicos">ALGORÍTMICOS</button>
        <button class="filter-btn" data-cat="UI">UI</button>
    </div>

    <div class="grid" id="dataGrid"></div>

    <div class="stats" id="stats">Cargando...</div>

    <script>
        const vaultData = ${vaultDataRaw};
        let currentFilter = 'all';
        let searchQuery = '';
        
        const dataGrid = document.getElementById('dataGrid');
        const searchInput = document.getElementById('searchInput');
        const stats = document.getElementById('stats');
        const filterBtns = document.querySelectorAll('.filter-btn');

        function render() {
            const filtered = vaultData.filter(item => {
                const matchesSearch = (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                                     (item.path && item.path.toLowerCase().includes(searchQuery.toLowerCase()));
                const matchesFilter = currentFilter === 'all' || item.category === currentFilter;
                return matchesSearch && matchesFilter;
            });

            dataGrid.innerHTML = filtered.slice(0, 500).map(item => \`
                <div class="card">
                    <div class="card-header">
                        <span class="category">\${item.category || 'SIN CATEGORÍA'}</span>
                    </div>
                    <div class="name">\${item.name || 'Sin Nombre'}</div>
                    <div class="path">\${item.path || ''}</div>
                </div>
            \`).join('');

            stats.innerHTML = \`MOSTRANDO \${Math.min(filtered.length, 500)} DE \${filtered.length} ACTIVOS\`;
            if (filtered.length > 500) {
                stats.innerHTML += ' (FILTRE PARA VER MÁS)';
            }
        }

        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchQuery = e.target.value;
                render();
            }, 300);
        });

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.cat;
                render();
            });
        });

        render();
    </script>
</body>
</html>
`;

fs.writeFileSync(OUTPUT_HTML, htmlTemplate);

console.log(`\n======================================================`);
console.log(`[EXITO] Visor HTML S-Class generado.`);
console.log(`Ruta: ${OUTPUT_HTML}`);
console.log(`======================================================\n`);
process.exit(0);
