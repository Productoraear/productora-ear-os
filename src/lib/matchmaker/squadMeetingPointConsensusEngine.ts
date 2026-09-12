/**
 * SQUAD MEETING POINT CONSENSUS ENGINE // S-CLASS
 * Motor de Acuerdo Democrático y Votación del Punto de Salida
 * 
 * Permite que los integrantes de una cuadrilla (Mariachis / Músicos / Técnicos)
 * propongan y voten el punto de encuentro óptimo para un evento específico.
 * El punto consensuado sustituye dinámicamente el origen de despacho en el cálculo de km y GPS.
 */

export interface MeetingPointProposal {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  proposedBy: string;
  reason: string;
  votesCount: number;
  voterIds: string[];
}

export interface SquadVote {
  voterId: string;
  voterName: string;
  role: string; // ej. "Director / Primer Trompeta", "Voz y Guitarrón"
  proposalId: string;
  timestamp: string;
}

export interface MeetingPointConsensusSession {
  id: string;
  squadId: string;
  squadName: string;
  eventDestination: string;
  destinationCoords: { lat: number; lng: number };
  status: 'OPEN' | 'RESOLVED';
  proposals: MeetingPointProposal[];
  votes: SquadVote[];
  winningPoint?: MeetingPointProposal;
  consensusPercentage: number;
  resolvedAt?: string;
}

export const STRATEGIC_MEETING_POINTS_BY_REGION: Record<string, MeetingPointProposal[]> = {
  Madrid: [
    {
      id: 'mad-elip',
      name: 'Plaza Elíptica (Hub Sur - A-42 / M-40)',
      address: 'Intercambiador Plaza Elíptica, 28025 Madrid',
      lat: 40.3847,
      lng: -3.7183,
      proposedBy: 'Sistema SSOT',
      reason: 'Salida directa a autovías del sur y facilidad de carga de instrumental.',
      votesCount: 0,
      voterIds: []
    },
    {
      id: 'mad-atocha',
      name: 'Estación de Atocha (Hub Central)',
      address: 'Plaza del Emperador Carlos V, 28045 Madrid',
      lat: 40.4065,
      lng: -3.6896,
      proposedBy: 'Sistema SSOT',
      reason: 'Conexión ferroviaria central y proximidad para músicos del centro y este.',
      votesCount: 0,
      voterIds: []
    },
    {
      id: 'mad-moncloa',
      name: 'Moncloa (Hub Noroeste - A-6)',
      address: 'Paseo de Moret s/n, 28008 Madrid',
      lat: 40.4354,
      lng: -3.7196,
      proposedBy: 'Sistema SSOT',
      reason: 'Ideal para bolos en Pozuelo, Majadahonda, Las Rozas y Guadarrama.',
      votesCount: 0,
      voterIds: []
    },
    {
      id: 'mad-ensayo-carabanchel',
      name: 'Local de Ensayo Carabanchel Alto',
      address: 'Calle del Aguacate 41, 28044 Madrid',
      lat: 40.3712,
      lng: -3.7501,
      proposedBy: 'Director Musical',
      reason: 'Donde se guarda el equipo de sonido amplificado Bose y trajes de charro.',
      votesCount: 0,
      voterIds: []
    }
  ],
  Valencia: [
    {
      id: 'val-ayto',
      name: 'Plaza del Ayuntamiento (Hub Centro)',
      address: 'Plaça de l\'Ajuntament 1, 46002 València',
      lat: 39.4699,
      lng: -0.3763,
      proposedBy: 'Sistema SSOT',
      reason: 'Punto de encuentro céntrico accesible en metro y autobús.',
      votesCount: 0,
      voterIds: []
    },
    {
      id: 'val-pista-silla',
      name: 'Pista de Silla (V-31 / Salida Sur)',
      address: 'Avinguda d\'Ausiàs March, 46026 València',
      lat: 39.4452,
      lng: -0.3741,
      proposedBy: 'Jefe Logístico',
      reason: 'Salida directa para eventos en l\'Horta Sud y La Ribera.',
      votesCount: 0,
      voterIds: []
    }
  ],
  Toledo: [
    {
      id: 'tol-zafada',
      name: 'Estación de Autobuses de Toledo (Safont)',
      address: 'Avenida de Castilla-La Mancha s/n, 45003 Toledo',
      lat: 39.8661,
      lng: -4.0189,
      proposedBy: 'Sistema SSOT',
      reason: 'Acceso directo a rondas y aparcamiento de furgonetas.',
      votesCount: 0,
      voterIds: []
    }
  ]
};

/**
 * Inicia una sesión de votación democrática para una cuadrilla
 */
export function createMeetingPointConsensusSession(params: {
  squadId: string;
  squadName: string;
  eventDestination: string;
  destinationCoords: { lat: number; lng: number };
  region?: string;
  customProposals?: MeetingPointProposal[];
}): MeetingPointConsensusSession {
  const regionKey = params.region || 'Madrid';
  const defaultList = STRATEGIC_MEETING_POINTS_BY_REGION[regionKey] || STRATEGIC_MEETING_POINTS_BY_REGION['Madrid'];
  
  // Clonar para que cada sesión tenga conteo independiente
  const initialProposals = (params.customProposals || defaultList).map(p => ({
    ...p,
    votesCount: 0,
    voterIds: []
  }));

  return {
    id: `consensus-${params.squadId}-${Date.now()}`,
    squadId: params.squadId,
    squadName: params.squadName,
    eventDestination: params.eventDestination,
    destinationCoords: params.destinationCoords,
    status: 'OPEN',
    proposals: initialProposals,
    votes: [],
    consensusPercentage: 0
  };
}

/**
 * Emite un voto por parte de un miembro de la cuadrilla
 */
export function castSquadVote(
  session: MeetingPointConsensusSession, 
  vote: SquadVote
): MeetingPointConsensusSession {
  if (session.status === 'RESOLVED') {
    return session;
  }

  // Si ya votó, actualizar el voto
  const filteredVotes = session.votes.filter(v => v.voterId !== vote.voterId);
  const updatedVotes = [...filteredVotes, vote];

  // Recalcular conteo en propuestas
  const updatedProposals = session.proposals.map(prop => {
    const matchingVotes = updatedVotes.filter(v => v.proposalId === prop.id);
    return {
      ...prop,
      votesCount: matchingVotes.length,
      voterIds: matchingVotes.map(v => v.voterId)
    };
  });

  return {
    ...session,
    proposals: updatedProposals,
    votes: updatedVotes
  };
}

/**
 * Resuelve y formaliza el punto ganador por mayoría o consenso
 */
export function resolveWinningMeetingPoint(
  session: MeetingPointConsensusSession
): MeetingPointConsensusSession {
  if (session.proposals.length === 0) {
    return session;
  }

  // Ordenar propuestas por votos descendente
  const sorted = [...session.proposals].sort((a, b) => b.votesCount - a.votesCount);
  const winner = sorted[0];
  const totalVotes = session.votes.length;

  const consensusPercentage = totalVotes > 0 
    ? Math.round((winner.votesCount / totalVotes) * 100) 
    : 100;

  return {
    ...session,
    status: 'RESOLVED',
    winningPoint: winner,
    consensusPercentage,
    resolvedAt: new Date().toISOString()
  };
}
