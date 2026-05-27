export interface ProgramWeek {
    week: number;
    title: string;
    focus: string;
    routine: {
      duration: string;
      frequency: string;
      activities: string[];
      intensity: 'suave' | 'moderada' | 'progresiva';
    };
    nutritionTip: string;
    reminder: string;
    milestone?: string;
  }
  
  export const PROGRAM_TEMPLATES: Record<string, ProgramWeek[]> = {
    default: [
      {
        week: 1,
        title: 'Fundamentos: Reconectar',
        focus: 'Movilidad articular + respiración consciente',
        routine: {
          duration: '10-15 min',
          frequency: 'Diario',
          activities: [
            'Rotaciones de cuello y hombros (2 min)',
            'Respiración diafragmática (3 min)',
            'Caminata ligera en casa (5-10 min)',
            'Estiramientos suaves de espalda (2 min)'
          ],
          intensity: 'suave'
        },
        nutritionTip: 'Enfócate en hidratación: 1.5-2L de agua al día. Reduce azúcares añadidos en bebidas.',
        reminder: 'No necesitas equipo. Solo 10 minutos y ganas de empezar.',
        milestone: '✅ Completar 5 días de registro'
      },
      {
        week: 2,
        title: 'Constancia: Pequeños hábitos',
        focus: 'Establecer rutina matutina + registro consciente',
        routine: {
          duration: '12-18 min',
          frequency: '5-6 días',
          activities: [
            'Movilidad de cadera y rodillas (3 min)',
            'Caminata al aire libre o en sitio (8-12 min)',
            'Ejercicios de postura contra pared (3 min)',
            'Relajación final (2 min)'
          ],
          intensity: 'suave'
        },
        nutritionTip: 'Prueba incluir proteína en el desayuno: huevo, yogur griego o aguacate para mayor saciedad.',
        reminder: 'La perfección no es la meta. La consistencia sí.',
        milestone: '✅ Registrar 4 días consecutivos'
      },
      {
        week: 3,
        title: 'Progresión: Añadir fuerza ligera',
        focus: 'Introducir resistencia mínima + conciencia corporal',
        routine: {
          duration: '15-20 min',
          frequency: '5 días',
          activities: [
            'Sentadillas asistidas (con silla) 2x8',
            'Flexiones de pared 2x10',
            'Caminata con variación de ritmo (10 min)',
            'Estiramientos de piernas y brazos (3 min)'
          ],
          intensity: 'moderada'
        },
        nutritionTip: 'Reduce carbohidratos refinados en la cena. Opta por verduras + proteína para mejor descanso.',
        reminder: 'Escucha tu cuerpo. Si duele (no molesta), para y ajusta.',
        milestone: '✅ Completar 3 sesiones de fuerza ligera'
      },
      {
        week: 4,
        title: 'Integración: Ritmo personal',
        focus: 'Combinar movilidad + fuerza + descanso activo',
        routine: {
          duration: '18-22 min',
          frequency: '5-6 días',
          activities: [
            'Circuito suave: sentadilla, pared, caminata (12 min)',
            'Movilidad de columna (4 min)',
            'Respiración + visualización (3 min)'
          ],
          intensity: 'moderada'
        },
        nutritionTip: 'Prueba el ayuno intermitente suave: 12h entre cena y desayuno. Sin presión.',
        reminder: 'Mitad del camino. Celebra lo que ya lograste.',
        milestone: '✅ 4 semanas de registro continuo'
      },
      {
        week: 5,
        title: 'Confianza: Autonomía en movimiento',
        focus: 'Realizar rutina sin guía paso a paso',
        routine: {
          duration: '20-25 min',
          frequency: '5 días',
          activities: [
            'Rutina libre: elige 3 ejercicios de semanas anteriores',
            'Caminata con propósito (15 min)',
            'Enfriamiento consciente (3 min)'
          ],
          intensity: 'moderada'
        },
        nutritionTip: 'Identifica 1 alimento "desencadenante" y prueba sustituirlo por una opción Low-Carb.',
        reminder: 'Ya sabes cómo. Ahora confía en tu criterio.',
        milestone: '✅ Completar 2 sesiones autónomas'
      },
      {
        week: 6,
        title: 'Resiliencia: Adaptar, no abandonar',
        focus: 'Ajustar rutina según energía del día',
        routine: {
          duration: '15-25 min (flexible)',
          frequency: '4-6 días',
          activities: [
            'Días de alta energía: circuito completo (20 min)',
            'Días de baja energía: movilidad + respiración (10 min)',
            'Caminata consciente (siempre)'
          ],
          intensity: 'progresiva'
        },
        nutritionTip: 'En días de baja energía, prioriza proteína y grasas saludables. Evita decidir con hambre.',
        reminder: 'Un día "mínimo" sigue siendo progreso. No borres la racha.',
        milestone: '✅ Adaptar rutina 2 veces según tu energía'
      },
      {
        week: 7,
        title: 'Consolidación: Hábitos automáticos',
        focus: 'Movimiento como parte natural del día',
        routine: {
          duration: '20-30 min',
          frequency: '5-6 días',
          activities: [
            'Rutina personalizada (elige tu favorita)',
            'Caminata con variación de terreno (si es posible)',
            'Estiramientos profundos (5 min)'
          ],
          intensity: 'progresiva'
        },
        nutritionTip: 'Revisa tu registro: ¿qué patrón alimenticio te da más energía? Repítelo.',
        reminder: 'Ya no es "tarea". Es tu nuevo ritmo.',
        milestone: '✅ 6 días de registro en la semana'
      },
      {
        week: 8,
        title: 'Cierre: Tu nueva línea base',
        focus: 'Reflexión + planificación del siguiente ciclo',
        routine: {
          duration: '25-30 min',
          frequency: '5 días + 1 día de reflexión',
          activities: [
            'Rutina favorita (20 min)',
            'Caminata de celebración (10 min)',
            'Journaling: ¿qué cambié? ¿qué mantengo? (5 min)'
          ],
          intensity: 'progresiva'
        },
        nutritionTip: 'Celebra con una comida consciente. No "premio", sino integración.',
        reminder: 'Terminar no es abandonar. Es elegir continuar con más claridad.',
        milestone: '🎉 Ciclo 1 completado'
      }
    ]
  };
  
  export function getCurrentWeekTemplate(track: string, cycle: number, startDate: string | null): ProgramWeek | null {
    if (!startDate) return PROGRAM_TEMPLATES.default[0];
    
    const start = new Date(startDate);
    const now = new Date();
    const diffWeeks = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7));
    
    // Ajustar por ciclo (cada ciclo son 8 semanas)
    const weekIndex = Math.min(diffWeeks, 7);
    
    return PROGRAM_TEMPLATES.default[weekIndex] || PROGRAM_TEMPLATES.default[7];
  }