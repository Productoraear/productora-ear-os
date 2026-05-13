
import { LucideIcon } from 'lucide-react';

export interface Domain {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  slug: string;
  icon: LucideIcon;
  color: string;
  navLabel: string;
}

export interface MasterService {
  id: string;
  domain: string;
  icon: LucideIcon;
  title: string;
  slug: string;
  desc: string;
  category: string;
}

export interface BlogArticle {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  image: string;
  icon: LucideIcon;
  featured?: boolean;
}

export interface AcademyLesson {
  title: string;
  time: string;
  status: 'Completado' | 'En Progreso' | 'Bloqueado';
  progress: number;
}

export interface AcademyTool {
  name: string;
  cat: string;
}

export interface ExpertiseService {
  title: string;
  subtitle: string;
  description: string;
  items: string[];
  icon: LucideIcon;
  color: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  image: string;
}
