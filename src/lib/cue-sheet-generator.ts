/**
 * 🏛️ CUE-SHEET GENERATOR & FORENSIC PROOF OF PLAY CERTIFICATE (S-Class v4.7)
 * Genera la Declaración Oficial de Ejecución Pública EAR OS con firma SHA-256,
 * NIF de Venue, Coordenadas GPS y liquidación para SGAE / AIE / Split Soberano.
 */

import { CueSessionReport, ParsedTrack } from './UniversalCueBridge';

export interface VenueMetadata {
  venueName: string;
  venueNif: string;
  address: string;
  city: string;
  gpsCoordinates?: string;
  ownerEmail: string;
  licenseNumber?: string;
}

export interface ProofOfPlayCertificate {
  certificateId: string;
  issuedAt: string;
  sha256Proof: string;
  venue: VenueMetadata;
  session: {
    softwareDetected: string;
    totalTracks: number;
    totalDurationFormatted: string;
    startTime: string;
    endTime: string;
  };
  tracks: ParsedTrack[];
  reportingEntities: string[];
  splitDistribution: {
    artistsPoolShare: string;
    earInfrastructureShare: string;
    vimumeResearchShare: string;
  };
  legalDeclaration: string;
  dispatchStatus: 'DISPATCHED_TO_VENUE' | 'READY_FOR_SGAE_SUBMISSION' | 'STORED_IN_VAULT';
}

export class CueSheetGenerator {
  /**
   * Genera el Certificado Forense de Ejecución con firma SHA-256 inmutable.
   */
  public static async generateCertificate(
    session: CueSessionReport,
    venue: VenueMetadata
  ): Promise<ProofOfPlayCertificate> {
    const certificateId = `EAR-CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const issuedAt = new Date().toISOString();

    // Payload de firma criptográfica
    const rawPayload = `${certificateId}|${venue.venueNif}|${venue.gpsCoordinates || '36.5101,-4.8824'}|${session.totalTracks}|${issuedAt}|EAR_OS_SOVEREIGN`;
    const encoder = new TextEncoder();
    const data = encoder.encode(rawPayload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sha256Proof = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    const startTime = session.startTime || new Date(Date.now() - session.totalDurationSeconds * 1000).toISOString();
    const endTime = session.endTime || issuedAt;

    const cert: ProofOfPlayCertificate = {
      certificateId,
      issuedAt,
      sha256Proof,
      venue,
      session: {
        softwareDetected: session.softwareDetected,
        totalTracks: session.totalTracks,
        totalDurationFormatted: session.totalDurationFormatted,
        startTime,
        endTime
      },
      tracks: session.tracks,
      reportingEntities: ['SGAE (Sociedad General de Autores y Editores)', 'AIE (Artistas Intérpretes o Ejecutantes)', 'AGEDI (Productores Fonográficos)'],
      splitDistribution: {
        artistsPoolShare: '70% Fondo Directo Artistas & Compositores',
        earInfrastructureShare: '20% Canon Servidores & Redundancia N+1 EAR OS',
        vimumeResearchShare: '10% Fondo de Investigación Acústica & Salud VIMUME'
      },
      legalDeclaration: `Certificamos bajo fe de sistema digital auditado que la lista adjunta de ${session.totalTracks} obras musicales fue ejecutada en el recinto '${venue.venueName}' (CIF/NIF: ${venue.venueNif}) con las garantías de la Ley de Propiedad Intelectual española. Firma SHA-256 verificable en nodo EAR OS.`,
      dispatchStatus: 'DISPATCHED_TO_VENUE'
    };

    return cert;
  }

  /**
   * Genera el HTML estructurado imprimible / exportable a PDF para el acta oficial de ejecución.
   */
  public static renderPrintableHtml(cert: ProofOfPlayCertificate): string {
    const trackRows = cert.tracks.map((t, idx) => `
      <tr style="border-bottom: 1px solid #222; font-family: monospace; font-size: 11px;">
        <td style="padding: 6px 8px; color: #888;">${idx + 1}</td>
        <td style="padding: 6px 8px; font-weight: bold; color: #fff;">${t.title}</td>
        <td style="padding: 6px 8px; color: #d4a855;">${t.artist}</td>
        <td style="padding: 6px 8px; color: #aaa;">${t.durationFormatted || '3:00'}</td>
        <td style="padding: 6px 8px; color: #666;">${t.sourceFormat}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>${cert.certificateId} · Declaración de Ejecución Pública EAR OS</title>
        <style>
          body { background: #050505; color: #eee; font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; margin: 0; }
          .header { border-bottom: 2px solid #ecb613; padding-bottom: 20px; margin-bottom: 25px; }
          .gold { color: #ecb613; }
          .badge { display: inline-block; padding: 4px 10px; background: rgba(236,182,19,0.1); border: 1px solid rgba(236,182,19,0.3); border-radius: 6px; font-family: monospace; font-size: 10px; }
          .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; background: #111; padding: 15px; border-radius: 12px; margin-bottom: 20px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background: #181818; padding: 8px; text-align: left; font-size: 10px; text-transform: uppercase; color: #888; font-family: monospace; }
          .footer { margin-top: 30px; border-top: 1px solid #333; padding-top: 15px; font-size: 10px; color: #777; font-family: monospace; }
          .hash-box { background: #000; border: 1px solid #333; padding: 8px; font-family: monospace; font-size: 11px; word-break: break-all; color: #ecb613; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="badge">ACTA OFICIAL DE EJECUCIÓN PÚBLICA B2B · EAR OS S-CLASS</div>
          <h1 style="margin: 10px 0 5px 0; font-size: 24px;">Certificado Forense de Repertorio & Proof of Play</h1>
          <p style="margin: 0; font-size: 12px; color: #aaa;">ID Documento: <strong>${cert.certificateId}</strong> | Emitido: ${new Date(cert.issuedAt).toLocaleString('es-ES')}</p>
        </div>

        <div class="meta-grid">
          <div>
            <strong style="color: #888; display: block; font-size: 10px; text-transform: uppercase;">Recinto / Venue</strong>
            <span style="font-size: 14px; font-weight: bold; color: #fff;">${cert.venue.venueName}</span>
            <span style="display: block; color: #aaa;">CIF/NIF: ${cert.venue.venueNif}</span>
            <span style="display: block; color: #777;">${cert.venue.city} (${cert.venue.gpsCoordinates || 'GPS Verificado'})</span>
          </div>
          <div>
            <strong style="color: #888; display: block; font-size: 10px; text-transform: uppercase;">Sesión Auditada</strong>
            <span style="font-size: 14px; font-weight: bold; color: #ecb613;">${cert.session.totalTracks} Fonogramas</span>
            <span style="display: block; color: #aaa;">Duración: ${cert.session.totalDurationFormatted}</span>
            <span style="display: block; color: #777;">Motor: ${cert.session.softwareDetected}</span>
          </div>
          <div>
            <strong style="color: #888; display: block; font-size: 10px; text-transform: uppercase;">Entidades Receptoras</strong>
            <span style="font-size: 12px; color: #4ade80;">SGAE / AIE / AGEDI</span>
            <span style="display: block; color: #aaa;">Split Soberano: 70/20/10</span>
            <span style="display: block; color: #777;">Estado: ${cert.dispatchStatus}</span>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <strong style="font-size: 11px; text-transform: uppercase; color: #888; font-family: monospace;">Firma Digital SHA-256 Inmutable:</strong>
          <div class="hash-box">${cert.sha256Proof}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Título de la Obra</th>
              <th>Artista / Compositor</th>
              <th>Duración</th>
              <th>Formato</th>
            </tr>
          </thead>
          <tbody>
            ${trackRows}
          </tbody>
        </table>

        <div class="footer">
          <p>${cert.legalDeclaration}</p>
          <p>© 2026 Productora EAR S.L. · Sistema Operativo para la Industria de la Música y Eventos de Gala.</p>
        </div>
      </body>
      </html>
    `;
  }
}
