# ENRIQUECIMIENTO REAL DE PROVEEDORES — OVERTURE MAPS

**Dataset:** overture:2026-10-21.0 · **Licencia:** CDLA-Permissive-2.0
**Generado:** 2026-10-25T19:42:41.212Z

## Cobertura conseguida

| Métrica | Valor |
|---|---:|
| Proveedores evaluados | 78498 |
| Filas candidatas analizadas | 23307 |
| Proveedores con candidato | 11780 |
| **Enriquecidos aceptados** | **6700** |
| Con teléfono real | 5686 |
| Con web propia | 5312 |
| Con email | 2895 |
| Con redes sociales | 3438 |
| Con GPS verificado | 5913 |
| Verified blindados | 5578 |
| Ambiguos (contacto retenido) | 787 |
| Teléfonos disputados (compartidos) | 32 |

## Por modo de emparejamiento

- Exacto (nombre normalizado idéntico): **6306**
- Fuzzy (Jaro-Winkler + provincia + categoría + dominio): **394**

## Por gremio

| Gremio | Proveedores | Teléfono | Web | Email |
|---|---:|---:|---:|---:|
| servicios | 2441 | 2063 | 2065 | 1152 |
| catering | 203 | 156 | 164 | 103 |
| foto | 1574 | 1373 | 1276 | 537 |
| transporte | 109 | 83 | 97 | 45 |
| moda | 1141 | 1002 | 770 | 477 |
| finca | 513 | 387 | 405 | 293 |
| musica | 124 | 110 | 93 | 44 |
| sonido | 22 | 14 | 18 | 8 |
| decoracion | 524 | 457 | 385 | 221 |
| wedding | 49 | 41 | 39 | 15 |

## Rechazos (trazabilidad)

- `no_candidate`: 26843
- `exact_geo_mismatch`: 3427
- `fuzzy_low_name_score`: 1102
- `ambiguous_contact_withheld`: 787
- `fuzzy_geo_mismatch`: 223
- `fuzzy_category_mismatch`: 147
- `fuzzy_weak_evidence`: 82
- `exact_unknown_province_ambiguous`: 77
- `exact_unknown_province_generic`: 12
- `exact_unknown_province_weak`: 10

> Doctrina: ningún teléfono se atribuye si hay más de una sede posible; un número compartido
> entre proveedores se retira de todos. Cada dato lleva `evidence.dataset`, `evidence.rule` y
> `matched.id` (POI de Overture) para auditoría.
