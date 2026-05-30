import type { DailyLog } from './offlineStorage';

type ReportRange = 7 | 30;

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', { 
    weekday: 'short', day: 'numeric', month: 'short' 
  });
}

function formatMealItems(items: any[]): string {
  if (!items?.length) return '—';
  // Agrupar por subgrupo para resumen limpio
  const grouped: Record<string, string[]> = {};
  items.forEach(item => {
    const key = item.subgroup || item.group || 'Otros';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(`${item.food}(${item.portion})`);
  });
  return Object.entries(grouped)
    .map(([sub, foods]) => `${sub}: ${foods.join(', ')}`)
    .join(' | ');
}

export function generateReport(logs: DailyLog[], userName: string = 'Paciente', range: ReportRange = 7): string {
  if (!logs.length) return 'No hay registros disponibles.';

  // Filtrar por rango de días
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - range);
  
  const filtered = logs
    .filter(l => new Date(l.date) >= cutoff)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!filtered.length) return `No hay registros en los últimos ${range} días.`;

  // HEADER
  let report = `📋 REPORTE DE SEGUIMIENTO - SALUD & DISCIPLINA\n`;
  report += `👤 ${userName} | 📅 Últimos ${range} días\n`;
  report += `📊 Días con registro: ${filtered.length}\n`;
  report += `🗓️ Periodo: ${formatDate(filtered[0].date)} al ${formatDate(filtered[filtered.length - 1].date)}\n\n`;

  // 📈 RESUMEN GENERAL DEL PERIODO
  const totalActivities = filtered.reduce((sum, l) => sum + (l.activities?.reduce((a, act) => a + (act.minutes || 0), 0) || 0), 0);
  const avgEnergy = filtered.reduce((sum, l) => sum + (l.wellness?.energy || 0), 0) / filtered.length;
  const avgSleep = filtered.reduce((sum, l) => sum + (l.sleep?.hours || 0), 0) / filtered.length;
  const withMetrics = filtered.filter(l => l.metrics?.weight || l.metrics?.glucose || l.metrics?.bpSystolic);

  report += `📈 TENDENCIAS GENERALES\n`;
  report += `• Actividad total: ${totalActivities} min\n`;
  report += `• Energía promedio: ${avgEnergy.toFixed(1)}/5\n`;
  report += `• Sueño promedio: ${avgSleep.toFixed(1)}h\n`;
  if (withMetrics.length > 0) {
    const weights = withMetrics.map(l => l.metrics?.weight).filter(Boolean) as number[];
    const glucoses = withMetrics.map(l => l.metrics?.glucose).filter(Boolean) as number[];
    report += `• Peso registrado: ${weights.length > 0 ? `${Math.min(...weights)} → ${Math.max(...weights)} kg` : '—'}\n`;
    report += `• Glucosa registrada: ${glucoses.length > 0 ? `${Math.min(...glucoses)} → ${Math.max(...glucoses)} mg/dL` : '—'}\n`;
  }
  report += `\n`;

  // 📅 DETALLE POR DÍA
  report += `📅 DETALLE DIARIO\n`;
  report += `═`.repeat(60) + `\n\n`;

  filtered.forEach(log => {
    report += `🗓️ ${formatDate(log.date)} (${log.date})\n`;
    report += `─`.repeat(40) + `\n`;

    // 🍽️ Alimentos por tiempo de comida
    report += `🍽️ ALIMENTOS:\n`;
    (['desayuno', 'comida', 'cena', 'snack'] as const).forEach(mealTime => {
      const items = log.meals?.[mealTime] || [];
      const label = mealTime === 'snack' ? '🍿 Snack' : mealTime.charAt(0).toUpperCase() + mealTime.slice(1);
      report += `  • ${label}: ${formatMealItems(items)}\n`;
    });

    // 🥤 Bebidas
    if (log.drinks?.length) {
      report += `🥤 BEBIDAS: ${log.drinks.map(d => `${d.name}(${d.portion})`).join(', ')}\n`;
    }

    // 🏃 Actividad
    if (log.activities?.length) {
      const totalMin = log.activities.reduce((sum, a) => sum + a.minutes, 0);
      report += `🏃 ACTIVIDAD: ${log.activities.map(a => `${a.type}(${a.minutes}min)`).join(', ')} [Total: ${totalMin}min]\n`;
    }

    // 😴 Sueño
    if (log.sleep?.hours) {
      report += `😴 SUEÑO: ${log.sleep.hours}h | Calidad: ${log.sleep.quality}/5\n`;
    }

    // 📏 Métricas de salud (si existen)
    if (log.metrics && Object.keys(log.metrics).length > 0) {
      report += `📏 MÉTRICAS:\n`;
      if (log.metrics.weight) report += `  • Peso: ${log.metrics.weight} kg\n`;
      if (log.metrics.glucose) report += `  • Glucosa: ${log.metrics.glucose} mg/dL\n`;
      if (log.metrics.bpSystolic && log.metrics.bpDiastolic) report += `  • Presión: ${log.metrics.bpSystolic}/${log.metrics.bpDiastolic} mmHg\n`;
      if (log.metrics.note) report += `  • Nota: "${log.metrics.note}"\n`;
    }

    // 😊 Bienestar
    report += `😊 BIENESTAR: Energía ${log.wellness?.energy}/5 | Saciedad ${log.wellness?.satiety}/5\n`;
    report += `\n`;
  });

  // 📝 NOTAS FINALES
  report += `💡 NOTAS:\n`;
  report += `• Reporte generado automáticamente desde PWA Salud & Disciplina.\n`;
  report += `• Los valores reflejan autocuidado, no diagnóstico clínico.\n`;
  report += `• Para ajustes, contactar al profesional tratante.\n`;

  return report;
}

export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}
