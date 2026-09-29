/**
 * ORGANIC B2B OUTREACH ENGINE (EAR OS 2050)
 * Generador de despachos de alta conversión para WhatsApp y Correo Directo
 * basado en los leads extraídos por Mailerfind MCP de Google Maps e Instagram.
 * CERO GASTO EN PUBLICIDAD DE PAGO · DOMINANCIA PURAMENTE ORGÁNICA.
 */

import { MailerfindLead } from '@/lib/mcp/mailerfind-connector';

export interface OutreachDispatch {
  leadId: string;
  leadName: string;
  whatsappMessage: string;
  whatsappUrl: string;
  emailSubject: string;
  emailBody: string;
  claimUrl: string;
}

export function generateOrganicOutreach(lead: MailerfindLead): OutreachDispatch {
  const claimUrl = `https://productoraear.com/proveedores/${lead.claimedProfileSlug || 'alianza-sclass'}`;
  const isSovereign = lead.phoneVerifiedType === 'SOVEREIGN_CENTRALITA';

  // 1. Mensaje de WhatsApp Orgánico (Directo, Respetuoso, de Altísimo Valor)
  const whatsappMessage = isSovereign
    ? `[PERFIL OFICIAL PRODUCTORA EAR]\nFicha matriz central de Edwin Agudelo / Centralita S-Class.\nEnlace canónico: ${claimUrl}`
    : `Hola equipo de ${lead.name}, le saluda Edwin Agudelo de Productora EAR (Gobernanza Cultural & Bodas de Gala en ${lead.province}).

Le contactamos directamente porque hemos auditado su trayectoria en ${lead.location} y cuenta con una contrastada solvencia técnica.

En Productora EAR hemos habilitado una landing pública verificada para su negocio dentro de nuestro ecosistema nacional:
🔗 ${claimUrl}

A diferencia de los portales tradicionales que cobran cuotas mensuales de 150€/mes o comisiones del 25%-40%:
1. 80% ARTISTA / PROVEEDOR: Su retribución íntegra y directa.
2. 10% INFRAESTRUCTURA EAR OS: Cero cuotas de entrada. Pasarela blindada con depósito inmutable de 100€ (Stripe Price-Lock).
3. 10% IMPACTO SOCIAL VIMUME: Con deducción fiscal directa (Ley 49/2002) para sus clientes y sesiones de neuro-musicoterapia para mayores en ${lead.province}.

Puede verificar y reclamar su ficha sin coste alguno respondiendo a este mensaje o directamente desde el enlace anterior.

Quedamos a su disposición para coordinar eventos y producciones conjuntas.
Atentamente,
Edwin Agudelo // Dirección Artística & Alianzas B2B
Productora EAR
Centralita: +34 693 693 048 | Web: https://productoraear.com`;

  const encodedWhatsapp = encodeURIComponent(whatsappMessage);
  const cleanPhone = lead.whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = isSovereign ? claimUrl : `https://wa.me/${cleanPhone}?text=${encodedWhatsapp}`;

  // 2. Correo Electrónico B2B (Elegante, Institucional)
  const emailSubject = `Invitación Alianza B2B y Ficha Verificada en ${lead.location} · Productora EAR (Split 80/10/10)`;

  const emailBody = `Estimado equipo de ${lead.name}:

Nos dirigimos a ustedes desde la Dirección de Alianzas de Productora EAR tras haber auditado su trayectoria y presencia en ${lead.location} (${lead.province}).

Con el fin de centralizar la contratación de servicios de alta gama para bodas, festejos y eventos exclusivos en su comarca, hemos generado una landing canónica verificada para ${lead.name} dentro de nuestra red nacional:

🔗 Enlace de Ficha Oficial: ${claimUrl}

Nuestra doctrina comercial elimina intermediarios parásitos mediante el SPLIT SOBERANO 80/10/10:
- El 80% del caché o presupuesto es percibido íntegramente por ustedes sin ningún descuento.
- Cero cuotas de suscripción o alta: Solo cobramos el 10% de infraestructura técnica cuando el cliente cierra una reserva formal con depósito de 100,00 € en Stripe (Price-Lock).
- El 10% restante financia el programa VIMUME de estimulación cognitiva en residencias de mayores, otorgando a sus clientes una deducción fiscal de hasta el 80% en IRPF o 40%-50% en Sociedades (Ley 49/2002).

Pueden acceder a su enlace para revisar su información de contacto o responder a este correo para validar su incorporación prioritaria a la red de proveedores homologados de ${lead.province}.

Atentamente,

Edwin Agudelo
Dirección Artística & Alianzas Institucionales
Productora EAR — Madrid // Méntrida
Centralita: +34 693 693 048 | Web: https://productoraear.com`;

  return {
    leadId: lead.id,
    leadName: lead.name,
    whatsappMessage,
    whatsappUrl,
    emailSubject,
    emailBody,
    claimUrl
  };
}
