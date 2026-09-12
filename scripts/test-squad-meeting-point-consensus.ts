import { 
  createMeetingPointConsensusSession, 
  castSquadVote, 
  resolveWinningMeetingPoint 
} from '../src/lib/matchmaker/squadMeetingPointConsensusEngine';

console.log('🚀 [TEST] Iniciando verificación del Motor de Votación y Consenso del Punto de Partida...');

// 1. Iniciar sesión para la cuadrilla Mariachi Squad #1 con destino en Finca La Alquería (Alcorcón)
const session = createMeetingPointConsensusSession({
  squadId: 'squad-01-mariachis',
  squadName: 'Mariachi S-Class Squad #1',
  eventDestination: 'Finca La Alquería (Alcorcón)',
  destinationCoords: { lat: 40.3458, lng: -3.8249 },
  region: 'Madrid'
});

console.log(`✅ Sesión creada: ${session.id} con ${session.proposals.length} puntos estratégicos propuestos.`);

// 2. Simular votación de los 6 integrantes de la cuadrilla
const squadMembers = [
  { id: 'mus-01', name: 'Mateo Villalobos', role: 'Director / Voz' },
  { id: 'mus-02', name: 'Valentín Silva', role: 'Primer Trompeta' },
  { id: 'mus-03', name: 'Ignacio Peña', role: 'Guitarrón' },
  { id: 'mus-04', name: 'Santiago Reyes', role: 'Vihuela' },
  { id: 'mus-05', name: 'Emilio Cárdenas', role: 'Segunda Trompeta' },
  { id: 'mus-06', name: 'Lucas Miranda', role: 'Violín' },
];

// 4 votan por Plaza Elíptica (salida directa A-42), 2 por Local de Ensayo Carabanchel
let activeSession = session;
activeSession = castSquadVote(activeSession, { voterId: squadMembers[0].id, voterName: squadMembers[0].name, role: squadMembers[0].role, proposalId: 'mad-elip', timestamp: new Date().toISOString() });
activeSession = castSquadVote(activeSession, { voterId: squadMembers[1].id, voterName: squadMembers[1].name, role: squadMembers[1].role, proposalId: 'mad-elip', timestamp: new Date().toISOString() });
activeSession = castSquadVote(activeSession, { voterId: squadMembers[2].id, voterName: squadMembers[2].name, role: squadMembers[2].role, proposalId: 'mad-ensayo-carabanchel', timestamp: new Date().toISOString() });
activeSession = castSquadVote(activeSession, { voterId: squadMembers[3].id, voterName: squadMembers[3].name, role: squadMembers[3].role, proposalId: 'mad-elip', timestamp: new Date().toISOString() });
activeSession = castSquadVote(activeSession, { voterId: squadMembers[4].id, voterName: squadMembers[4].name, role: squadMembers[4].role, proposalId: 'mad-ensayo-carabanchel', timestamp: new Date().toISOString() });
activeSession = castSquadVote(activeSession, { voterId: squadMembers[5].id, voterName: squadMembers[5].name, role: squadMembers[5].role, proposalId: 'mad-elip', timestamp: new Date().toISOString() });

console.log(`🗳️ Votos emitidos: ${activeSession.votes.length} de ${squadMembers.length} músicos.`);

// 3. Resolver punto ganador
const resolvedSession = resolveWinningMeetingPoint(activeSession);

console.log(`🏆 Punto de Partida Ganador: ${resolvedSession.winningPoint?.name}`);
console.log(`📍 Coordenadas Oficiales: [${resolvedSession.winningPoint?.lat}, ${resolvedSession.winningPoint?.lng}]`);
console.log(`📊 Nivel de Consenso: ${resolvedSession.consensusPercentage}% (${resolvedSession.winningPoint?.votesCount} votos)`);

if (resolvedSession.winningPoint?.id === 'mad-elip' && resolvedSession.consensusPercentage === 67) {
  console.log('✅ TEST PASSED: Motor de Votación Democático validado con éxito. Exit Code 0.');
  process.exit(0);
} else {
  console.error('❌ TEST FAILED: Conteo o resolución incorrecta.');
  process.exit(1);
}
