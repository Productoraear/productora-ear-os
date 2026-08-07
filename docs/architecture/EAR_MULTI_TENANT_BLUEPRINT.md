# 🏢 EAR OS — MULTI-TENANT & BRAND SCALING BLUEPRINT

> **Escalabilidad Multi-Vertical:** Arquitectura fundacional para crecer EAR OS más allá de Edwin Agudelo (Nuevos Artistas, Nuevos Países, Marcas Blancas).

## 1. Separación de Datos (Prisma & Vector DB)
- **Tenant ID Obligatorio:** Toda tabla en Prisma (Bookings, Leads, ArtistProfiles) y toda colección en Vector DB debe tener el campo `tenant_id`.
- **Ejemplo:** `tenant_id: "edwin_agudelo"`, `tenant_id: "mariachi_imperial"`, `tenant_id: "orquesta_salsa_bcn"`.

## 2. Aislamiento Físico y Lógico (RBAC)
- **Row-Level Security (RLS) en Supabase:** Garantiza que un operador asignado al Tenant A no pueda ver los bookings ni la facturación del Tenant B.
- **Namespaces en Vector DB:** Cada tenant tiene su propio namespace. Una query en el sitio de Edwin nunca recuperará precios de la Orquesta Salsa BCN.

## 3. Despliegue de Marca Blanca (White-labeling)
- Variables de entorno dictan el tema UI (Stitch Design System) y el dominio. El mismo codebase EAR OS se despliega para distintos Tenants cambiando `NEXT_PUBLIC_TENANT_ID`.
