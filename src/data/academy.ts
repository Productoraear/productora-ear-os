
import { AcademyLesson, AcademyTool } from '../types';

export const ACADEMY_LESSONS: AcademyLesson[] = [
  { title: "Mentalidad de CEO Artístico", time: "45 min", status: "Completado", progress: 100 },
  { title: "Estructura Legal y Fiscal", time: "60 min", status: "En Progreso", progress: 33 },
  { title: "El Negocio de los Derechos de Autor", time: "90 min", status: "Bloqueado", progress: 0 },
  { title: "Booking: Cómo vender tu show", time: "50 min", status: "Bloqueado", progress: 0 },
];

export const ACADEMY_TOOLS: AcademyTool[] = [
  { name: "Rider Técnico Standard v2.pdf", cat: "Producción" },
  { name: "Contrato de Actuación.docx", cat: "Legal" },
  { name: "Split Sheet Template.xls", cat: "Royalties" },
  { name: "Calculadora de Break-Even.xls", cat: "Finanzas" },
  { name: "Plantilla Pitch Editorial.pdf", cat: "Marketing" },
  { name: "Checklist Pre-Show.pdf", cat: "Producción" },
];
