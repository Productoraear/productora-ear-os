-- ════════════════════════════════════════════════════════════════════════════════
-- OVERTURE_EXACT.SQL — Candidatos por nombre normalizado idéntico
-- ════════════════════════════════════════════════════════════════════════════════
SET lambda_syntax = 'ENABLE_SINGLE_ARROW';
INSTALL spatial;
LOAD spatial;
SET threads = 4;
SET memory_limit = '2GB';
SET temp_directory = 'reports/.duckdb_tmp';
SET preserve_insertion_order = false;
SET enable_progress_bar = false;

CREATE OR REPLACE MACRO norm_region(r) AS
    CASE
        WHEN r IS NULL THEN NULL
        WHEN lower(strip_accents(r)) IN ('vizcaya', 'bizkaia') THEN 'bizkaia'
        WHEN lower(strip_accents(r)) IN ('girona', 'gerona') THEN 'girona'
        WHEN lower(strip_accents(r)) IN ('alicante', 'alacant') THEN 'alicante'
        WHEN lower(strip_accents(r)) IN ('islas baleares', 'baleares', 'illes balears', 'balears') THEN 'balears'
        WHEN lower(strip_accents(r)) IN ('a coruna', 'la coruna') THEN 'a coruna'
        WHEN lower(strip_accents(r)) IN ('ourense', 'orense') THEN 'ourense'
        WHEN lower(strip_accents(r)) IN ('castellon', 'castello') THEN 'castellon'
        ELSE lower(strip_accents(r))
    END;

CREATE OR REPLACE MACRO cat_score(pcat, ocat) AS
    CASE
        WHEN ocat IS NULL THEN 0.5
        WHEN pcat = 'finca' AND regexp_matches(lower(ocat), 'event|wedding|hotel|resort|winery|castle|farm|banquet|restaurant|holiday_rental|venue|garden|museum|estate') THEN 1.0
        WHEN pcat = 'catering' AND regexp_matches(lower(ocat), 'cater|restaurant|food|bakery|party|event|wine') THEN 1.0
        WHEN pcat = 'musica' AND regexp_matches(lower(ocat), 'dj|music|band|orchestra|performing|arts|entertainment|event|party') THEN 1.0
        WHEN pcat = 'foto' AND regexp_matches(lower(ocat), 'photo|video|film|camera|studio') THEN 1.0
        WHEN pcat = 'decoracion' AND regexp_matches(lower(ocat), 'florist|flor|decor|furniture|party|supplies|event|interior') THEN 1.0
        WHEN pcat = 'moda' AND regexp_matches(lower(ocat), 'clothing|bridal|fashion|tailor|jewelry|shoe|boutique|wedding') THEN 1.0
        WHEN pcat = 'transporte' AND regexp_matches(lower(ocat), 'transport|limousine|bus|car_rental|taxi|charter|travel') THEN 1.0
        WHEN pcat = 'sonido' AND regexp_matches(lower(ocat), 'audio|lighting|sound|av_|equipment|rental|party|event') THEN 1.0
        WHEN pcat = 'wedding' AND regexp_matches(lower(ocat), 'wedding|event|party|planner|venue') THEN 1.0
        WHEN pcat = 'servicios' AND regexp_matches(lower(ocat), 'event|party|entertainment|service|rental|photo|music|travel') THEN 1.0
        ELSE 0.3
    END;

CREATE OR REPLACE TABLE prov AS
SELECT vendorId, name, province, category, lower(strip_accents(name)) AS n,
       CASE WHEN province IS NULL OR lower(strip_accents(province)) = 'espana' THEN '' ELSE norm_region(province) END AS prov_norm
FROM read_json('reports/providers_for_match.json', format = 'array',
  columns = {vendorId: 'VARCHAR', key: 'VARCHAR', name: 'VARCHAR', province: 'VARCHAR', category: 'VARCHAR', phone: 'VARCHAR', web: 'VARCHAR'})
WHERE name IS NOT NULL AND length(trim(name)) >= 3;

CREATE OR REPLACE TABLE ov AS
SELECT id, name, category, region, locality, phones, websites, emails, socials, street, lat, lon, confidence,
       lower(strip_accents(name)) AS n, lower(strip_accents(coalesce(locality, ''))) AS loc_norm
FROM read_parquet('reports/overture_places_es_contactable.parquet')
WHERE name IS NOT NULL AND length(trim(name)) >= 3;

CREATE OR REPLACE TABLE loc_prov AS
SELECT loc_norm, prov_norm FROM (
    SELECT loc_norm, norm_region(region) AS prov_norm, count(*) AS n,
           row_number() OVER (PARTITION BY loc_norm ORDER BY count(*) DESC) AS rn
    FROM ov WHERE loc_norm <> '' AND region IS NOT NULL AND length(region) > 3
    GROUP BY 1, 2
) WHERE rn = 1;

CREATE OR REPLACE TABLE ov2 AS
SELECT o.*, coalesce(
    CASE WHEN o.region IS NOT NULL AND length(o.region) > 3 THEN norm_region(o.region) END,
    l.prov_norm
) AS prov_norm
FROM ov o LEFT JOIN loc_prov l ON l.loc_norm = o.loc_norm;

CREATE OR REPLACE TABLE prov_neigh_base(a VARCHAR, b VARCHAR);
INSERT INTO prov_neigh_base VALUES
    ('a coruna', 'pontevedra'),
    ('alava', 'burgos'),
    ('alava', 'la rioja'),
    ('albacete', 'alicante'),
    ('albacete', 'ciudad real'),
    ('albacete', 'jaen'),
    ('albacete', 'murcia'),
    ('albacete', 'valencia'),
    ('alicante', 'murcia'),
    ('alicante', 'valencia'),
    ('almeria', 'murcia'),
    ('asturias', 'cantabria'),
    ('asturias', 'lugo'),
    ('avila', 'caceres'),
    ('avila', 'salamanca'),
    ('avila', 'valladolid'),
    ('badajoz', 'ciudad real'),
    ('badajoz', 'cordoba'),
    ('badajoz', 'huelva'),
    ('badajoz', 'sevilla'),
    ('barcelona', 'girona'),
    ('barcelona', 'tarragona'),
    ('bizkaia', 'alava'),
    ('bizkaia', 'burgos'),
    ('bizkaia', 'cantabria'),
    ('burgos', 'cantabria'),
    ('burgos', 'palencia'),
    ('burgos', 'soria'),
    ('burgos', 'valladolid'),
    ('caceres', 'badajoz'),
    ('cadiz', 'malaga'),
    ('castellon', 'tarragona'),
    ('castellon', 'teruel'),
    ('cordoba', 'ciudad real'),
    ('cordoba', 'granada'),
    ('cordoba', 'jaen'),
    ('cuenca', 'albacete'),
    ('cuenca', 'ciudad real'),
    ('cuenca', 'teruel'),
    ('cuenca', 'valencia'),
    ('gipuzkoa', 'alava'),
    ('gipuzkoa', 'bizkaia'),
    ('granada', 'almeria'),
    ('granada', 'murcia'),
    ('guadalajara', 'cuenca'),
    ('guadalajara', 'segovia'),
    ('guadalajara', 'soria'),
    ('guadalajara', 'teruel'),
    ('guadalajara', 'zaragoza'),
    ('huelva', 'cadiz'),
    ('huelva', 'sevilla'),
    ('huesca', 'lleida'),
    ('huesca', 'navarra'),
    ('jaen', 'ciudad real'),
    ('jaen', 'granada'),
    ('la rioja', 'burgos'),
    ('la rioja', 'soria'),
    ('leon', 'asturias'),
    ('leon', 'cantabria'),
    ('leon', 'lugo'),
    ('leon', 'ourense'),
    ('leon', 'zamora'),
    ('lleida', 'barcelona'),
    ('lleida', 'girona'),
    ('lleida', 'tarragona'),
    ('lugo', 'a coruna'),
    ('lugo', 'ourense'),
    ('lugo', 'pontevedra'),
    ('madrid', 'avila'),
    ('madrid', 'cuenca'),
    ('madrid', 'guadalajara'),
    ('madrid', 'segovia'),
    ('madrid', 'toledo'),
    ('malaga', 'cordoba'),
    ('malaga', 'granada'),
    ('navarra', 'alava'),
    ('navarra', 'gipuzkoa'),
    ('navarra', 'la rioja'),
    ('ourense', 'zamora'),
    ('palencia', 'cantabria'),
    ('palencia', 'leon'),
    ('pontevedra', 'ourense'),
    ('salamanca', 'caceres'),
    ('segovia', 'avila'),
    ('segovia', 'burgos'),
    ('segovia', 'soria'),
    ('segovia', 'valladolid'),
    ('sevilla', 'cadiz'),
    ('sevilla', 'cordoba'),
    ('sevilla', 'malaga'),
    ('teruel', 'tarragona'),
    ('teruel', 'zaragoza'),
    ('toledo', 'avila'),
    ('toledo', 'badajoz'),
    ('toledo', 'caceres'),
    ('toledo', 'ciudad real'),
    ('toledo', 'cuenca'),
    ('valencia', 'castellon'),
    ('valencia', 'teruel'),
    ('valladolid', 'leon'),
    ('valladolid', 'palencia'),
    ('valladolid', 'salamanca'),
    ('valladolid', 'zamora'),
    ('zamora', 'salamanca'),
    ('zaragoza', 'huesca'),
    ('zaragoza', 'la rioja'),
    ('zaragoza', 'lleida'),
    ('zaragoza', 'navarra'),
    ('zaragoza', 'soria'),
    ('zaragoza', 'tarragona');
CREATE OR REPLACE TABLE prov_neigh AS
SELECT a, b FROM prov_neigh_base UNION SELECT b, a FROM prov_neigh_base;

CREATE OR REPLACE TABLE exact AS
SELECT
    p.vendorId, p.name AS prov_name, p.category AS prov_category, p.prov_norm AS prov_prov,
    o.id AS ov_id, o.name AS ov_name, o.category AS ov_category, o.prov_norm AS ov_prov,
    o.region, o.locality, o.phones, o.websites, o.emails, o.socials, o.street, o.lat, o.lon,
    o.confidence,
    1.0 AS jw,
    CASE WHEN p.prov_norm <> '' AND o.prov_norm IS NOT NULL AND p.prov_norm = o.prov_norm THEN 1.0
         WHEN p.prov_norm = '' OR o.prov_norm IS NULL THEN 0.5 ELSE 0.0 END AS geo,
    cat_score(p.category, o.category) AS cat,
    CASE WHEN pn.a IS NOT NULL THEN TRUE ELSE FALSE END AS adjacent,
    'exact' AS mode
FROM prov p
JOIN ov2 o ON p.n = o.n
LEFT JOIN prov_neigh pn ON pn.a = p.prov_norm AND pn.b = o.prov_norm;

CREATE OR REPLACE TABLE ranked AS
SELECT *, row_number() OVER (
    PARTITION BY vendorId
    ORDER BY geo DESC, (len(phones) > 0) DESC, (len(websites) > 0) DESC, confidence DESC, length(ov_name)
) AS rn
FROM exact;

COPY (SELECT * FROM ranked WHERE rn <= 12)
TO 'reports/overture_exact_pairs.jsonl' (FORMAT JSON);

SELECT count(*) AS pares, count(DISTINCT vendorId) AS proveedores FROM exact;
