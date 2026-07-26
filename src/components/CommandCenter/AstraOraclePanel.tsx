"use client";
import React, { useState } from "react";
import { runAstraPrediction } from "@/app/actions/commandCenterActions";
import { AstraPredictionOutput } from "@/lib/ai/astra/predictive-engine";
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  BrainCircuit, 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
interface AstraOraclePanelProps {
  userEmail: string;
  isAdmin: boolean;
}
export default function AstraOraclePanel({ userEmail, isAdmin }: AstraOraclePanelProps) {
  const [origin, setOrigin] = useState("Madrid, España");
  const [destination, setDestination] = useState("Ibiza, Islas Baleares");
  const [eventDate, setEventDate] = useState(() => {
    const future = new Date();
    future.setMonth(future.getMonth() + 1);
    return future.toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<AstraPredictionOutput | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await runAstraPrediction(userEmail, { origin, destination, eventDate });
      setPrediction(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Fallo en ejecución del oráculo ASTRA.");
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(val);
  };
  return (
    // Renders custom form, beautiful motion-div card, score indicators and warnings.
  );
}