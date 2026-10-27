-- ════════════════════════════════════════════════════════════════════════════════
-- OVERTURE_EXTRACT_ES.SQL — Extrae los POIs españoles contactables a Parquet
-- ════════════════════════════════════════════════════════════════════════════════
-- Fuente: s3://overturemaps-us-west-2/release/2026-10-21.0/theme=places/type=place
-- Salida: reports/overture_places_es_contactable.parquet (≈194 MB)
-- ════════════════════════════════════════════════════════════════════════════════
INSTALL httpfs;
LOAD httpfs;
INSTALL spatial;
LOAD spatial;
SET s3_region = 'us-west-2';
SET threads = 8;
SET enable_progress_bar = false;

CREATE OR REPLACE TABLE es AS
SELECT
    id,
    names.primary AS name,
    names.common AS alt_names,
    basic_category,
    taxonomy.primary AS category,
    confidence,
    phones,
    websites,
    socials,
    emails,
    addresses[1].freeform AS street,
    addresses[1].locality AS locality,
    addresses[1].region AS region,
    addresses[1].postcode AS postcode,
    addresses[1].country AS country,
    ST_X(geometry) AS lon,
    ST_Y(geometry) AS lat
FROM read_parquet('s3://overturemaps-us-west-2/release/2026-10-21.0/theme=places/type=place/*.zstd.parquet')
WHERE bbox.xmin BETWEEN -18.4 AND 4.7
  AND bbox.xmax BETWEEN -18.4 AND 4.7
  AND bbox.ymin BETWEEN 27.4 AND 44.2
  AND bbox.ymax BETWEEN 27.4 AND 44.2
  AND addresses[1].country = 'ES';

COPY (
    SELECT * FROM es
    WHERE len(phones) > 0 OR len(websites) > 0 OR len(emails) > 0 OR len(socials) > 0
    ORDER BY name
) TO 'reports/overture_places_es_contactable.parquet' (FORMAT PARQUET, COMPRESSION ZSTD);

SELECT
    count(*) AS total_es,
    count_if(len(phones) > 0) AS con_telefono,
    count_if(len(websites) > 0) AS con_web,
    count_if(len(emails) > 0) AS con_email,
    count_if(len(socials) > 0) AS con_redes,
    count_if(len(phones) > 0 OR len(websites) > 0 OR len(emails) > 0 OR len(socials) > 0) AS contactables
FROM es;
