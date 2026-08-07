# 🎯 EAR OS — FILTERS & MATCHING RECOMMENDATION ENGINE

> **Motor de Recomendación Inteligente:** Algoritmo para guiar al comprador hacia el formato musical idóneo según número de asistentes, tipo de espacio y presupuesto.

---

## 1. Algoritmo de Recomendación de Formato

```typescript
export function recommendFormat(params: {
  attendeesCount: number;
  isOutdoor: boolean;
  budgetCategory: 'impulsive' | 'standard' | 'high_ticket' | 'vip';
}): 'solista' | 'duo_trio' | 'cuarteto' | 'gran_show' {
  if (params.attendeesCount > 150 || params.budgetCategory === 'vip') {
    return 'gran_show'; // Ensamble 6-8 músicos + PA S-Class
  }
  if (params.attendeesCount > 60 || params.isOutdoor) {
    return 'cuarteto'; // 4 Músicos con sonorización propia
  }
  if (params.attendeesCount > 20) {
    return 'duo_trio'; // 2-3 Músicos acústicos/amplificados
  }
  return 'solista'; // Serenata intimista
}
```
