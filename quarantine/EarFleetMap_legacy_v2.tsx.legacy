import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";

interface FleetMember {
  id: string;
  name: string;
  location: string;
  status: "available" | "busy" | "offline";
  latitude: number;
  longitude: number;
  genre: string;
}

export default function EarFleetMap() {
  const [selectedMember, setSelectedMember] = useState<FleetMember | null>(null);

  const fleetMembers: FleetMember[] = [
    {
      id: "1",
      name: "DJ Carlos",
      location: "Madrid Centro",
      status: "available",
      latitude: 40.4168,
      longitude: -3.7038,
      genre: "Electrónica",
    },
    {
      id: "2",
      name: "Orquesta Sinfónica",
      location: "Barcelona",
      status: "busy",
      latitude: 41.3851,
      longitude: 2.1734,
      genre: "Clásica",
    },
    {
      id: "3",
      name: "Banda Clásica",
      location: "Valencia",
      status: "available",
      latitude: 39.4699,
      longitude: -0.3763,
      genre: "Pop",
    },
  ];

  const statusColors = {
    available: "bg-green-600",
    busy: "bg-yellow-600",
    offline: "bg-gray-600",
  };

  const statusLabels = {
    available: "Disponible",
    busy: "Ocupado",
    offline: "Offline",
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2" style={{ color: "#C4A300" }}>
          🗺️ EAR FLEET MAP
        </h1>
        <p className="text-gray-400 mb-8">Mapa en Tiempo Real de Artistas Disponibles</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-700 p-6 h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4" style={{ color: "#C4A300" }} />
                <p className="text-gray-400">Mapa interactivo de artistas</p>
                <p className="text-sm text-gray-500 mt-2">Integración con Google Maps</p>
              </div>
            </Card>
          </div>

          {/* Fleet List */}
          <div>
            <Card className="bg-gray-900 border-gray-700 p-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: "#C4A300" }}>
                Flota Activa
              </h2>
              <div className="space-y-3">
                {fleetMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedMember?.id === member.id
                        ? "bg-yellow-600 text-black"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{member.name}</div>
                        <div className="text-sm text-gray-400 mt-1">{member.location}</div>
                        <div className="text-xs text-gray-500 mt-1">{member.genre}</div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${statusColors[member.status]}`}></div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Details */}
        {selectedMember && (
          <Card className="bg-gray-900 border-gray-700 p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#C4A300" }}>
              {selectedMember.name}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-sm">Ubicación</div>
                <div className="text-lg font-semibold mt-1">{selectedMember.location}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Estado</div>
                <div className="text-lg font-semibold mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm ${statusColors[selectedMember.status]} text-white`}>
                    {statusLabels[selectedMember.status]}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Género</div>
                <div className="text-lg font-semibold mt-1">{selectedMember.genre}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Coordenadas</div>
                <div className="text-sm font-mono mt-1">
                  {selectedMember.latitude.toFixed(4)}, {selectedMember.longitude.toFixed(4)}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
