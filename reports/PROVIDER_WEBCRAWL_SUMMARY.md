# FASE 1 — Deep web-crawl de dominios propios

Generado: 2026-10-25T21:14:16.569Z
Fuente: `reports/PROVIDER_ENRICHMENT.json` (overture:2026-10-21.0)

| Métrica | Valor |
|---|---:|
| Proveedores evaluados | 6700 |
| Webs descubiertas | 5312 |
| Dominios objetivo | 4910 |
| Dominios rastreados | 4910 |
| Dominios con contacto | 2863 |
| **Teléfonos reales** | **2535** |
| WhatsApps | 669 |
| Emails | 2445 |
| Redes sociales | 2501 |
| CIF válidos (checksum) | 814 |
| Razón social | 1636 |
| Dominios compartidos (contacto retenido) | 91 |
| Identidad no confirmada | 1655 |
| Dominios aparcados / en venta | 158 |
| Teléfonos en conflicto (retirados) | 24 |
| Peticiones HTTP | 0 (0 OK, 0 errores) |
| Fallback TLS (cadena rota) | 0 |

## Distribución de estados

- `ok`: 2867
- `identity_unconfirmed`: 1655
- `parked`: 158
- `ok_no_contact`: 138
- `shared_domain`: 91
- `crawl_error`: 1

## Por gremio

| Gremio | Proveedores con teléfono |
|---|---:|
| servicios | 922 / 1105 |
| foto | 687 / 835 |
| moda | 310 / 369 |
| finca | 221 / 248 |
| decoracion | 178 / 200 |
| catering | 79 / 92 |
| musica | 54 / 60 |
| transporte | 53 / 59 |
| wedding | 22 / 27 |
| sonido | 9 / 10 |

> Doctrina: solo se atribuye contacto cuando la página confirma la identidad del proveedor.
> Dominios compartidos, aparcados o con identidad ajena no publican contacto. Un teléfono
> presente en dos dominios se retira de ambos. Cada dato lleva `provenance` SHA-256 y URL de origen.

