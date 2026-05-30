export type MealTime = 'desayuno' | 'comida' | 'cena' | 'snack';
export type DrinkType = 'refresco' | 'cerveza' | 'cerveza-preparada' | 'tragos' | 'agua' | 'otro';

export interface MealItem {
  group: string;
  subgroup: string;
  food: string;
  portion: 'pequeña' | 'mediana' | 'grande';
}

export interface DrinkItem {
  type: DrinkType;
  name: string;
  portion: 'pequeña' | 'mediana' | 'grande';
}

export const FOOD_HIERARCHY = {
  proteinas: { icon: '🥩', label: 'Proteínas', subgroups: {
    carnesRojas: { label: 'Carnes Rojas', items: ['Res', 'Cerdo', 'Cordero', 'Jabalí', 'Venado'] },
    aves: { label: 'Aves', items: ['Pollo', 'Pavo', 'Pato', 'Codorniz'] },
    pescadosMariscos: { label: 'Pescados y Mariscos', items: ['Salmón', 'Atún', 'Camarón', 'Pulpo', 'Sardinas'] },
    huevosClaras: { label: 'Huevos y Claras', items: ['Enteros', 'Claras', 'Preparados'] },
    embutidos: { label: 'Embutidos y Procesados', items: ['Jamón', 'Salchicha', 'Longaniza', 'Tocino', 'Cecina'] },
    origenVegetal: { label: 'Origen Vegetal', items: ['Tofu', 'Tempeh', 'Seitán', 'Legumbres', 'Proteína en polvo'] }
  }},
  grasas: { icon: '🥑', label: 'Grasas', subgroups: {
    aceites: { label: 'Aceites y Mantecas', items: ['Oliva', 'Coco', 'Aguacate', 'Ghee', 'Manteca'] },
    frutosSecos: { label: 'Frutos Secos y Semillas', items: ['Almendras', 'Nueces', 'Chía', 'Linaza', 'Calabaza'] },
    aguacateCremas: { label: 'Aguacate y Cremas', items: ['Aguacate', 'Crema ácida', 'Crema para batir'] },
    mantequillasQuesos: { label: 'Mantequillas y Quesos Grasos', items: ['Mantequilla', 'Queso crema', 'Manchego', 'Gouda'] }
  }},
  carbohidratos: { icon: '🍚', label: 'Carbohidratos', subgroups: {
    cereales: { label: 'Cereales y Granos', items: ['Arroz', 'Avena', 'Quinoa', 'Trigo', 'Maíz'] },
    tuberculos: { label: 'Tubérculos y Raíces', items: ['Papa', 'Camote', 'Yuca', 'Zanahoria', 'Betabel'] },
    frutas: { label: 'Frutas', items: ['Fresa', 'Plátano', 'Manzana', 'Mango', 'Uva', 'Frutos rojos'] },
    panaderia: { label: 'Panadería y Snacks', items: ['Pan', 'Tortillas', 'Galletas', 'Barras', 'Cereales'] }
  }},
  verduras: { icon: '🥬', label: 'Verduras y Fibra', subgroups: {
    hojasVerdes: { label: 'Hojas Verdes', items: ['Espinaca', 'Lechuga', 'Kale', 'Acelga', 'Arúgula'] },
    cruciferas: { label: 'Crucíferas y Hortalizas', items: ['Brócoli', 'Coliflor', 'Repollo', 'Chayote', 'Calabacita'] },
    hongos: { label: 'Hongos y Setas', items: ['Champignon', 'Portobello', 'Shiitake', 'Setas silvestres'] },
    bajasCarb: { label: 'Verduras bajas en carb', items: ['Pepino', 'Apio', 'Ejote', 'Pimiento', 'Rábano'] }
  }},
  lacteos: { icon: '🥛', label: 'Lácteos y Alternativas', subgroups: {
    lecheYogures: { label: 'Leche y Yogures', items: ['Entera', 'Deslactosada', 'Griego', 'Natural'] },
    quesosFrescos: { label: 'Quesos Frescos/Curados', items: ['Panela', 'Cottage', 'Oaxaca', 'Parmesano'] },
    alternativas: { label: 'Alternativas Vegetales', items: ['Leche de almendra', 'Yogurt de coco', 'Queso vegano'] }
  }},
  bebidas: { icon: '🍹', label: 'Bebidas y Extras', subgroups: {
    aguasInfusiones: { label: 'Aguas e Infusiones', items: ['Natural', 'Mineral', 'Té', 'Agua de hierbas'] },
    cafesTes: { label: 'Cafés y Tés', items: ['Negro', 'Espresso', 'Matcha', 'Infusiones sin azúcar'] },
    alcohol: { label: 'Alcohol y Bebidas', items: ['Cerveza', 'Vino', 'Destilados', 'Mixers'] },
    salsasCondimentos: { label: 'Salsas y Condimentos', items: ['Mayonesa', 'Mostaza', 'Salsa de soya', 'Especias', 'Aderezos'] }
  }},
  postres: { icon: '🍰', label: 'Postres', subgroups: {
    pasteles: { label: 'Pasteles y Pan dulce', items: ['Rebanada de pastel', 'Concha', 'Cuernos', 'Pay'] },
    helados: { label: 'Helados y Paletas', items: ['Helado de vaso', 'Paleta de agua', 'Paleta de crema', 'Nieve'] },
    flanes: { label: 'Flanes y Natillas', items: ['Flan', 'Natilla', 'Arroz con leche', 'Gelatina'] },
    galletasDulces: { label: 'Galletas y Dulces', items: ['Galletas', 'Chocolates', 'Gomitas', 'Mazapán'] }
  }}
};

export const SNACK_HIERARCHY = {
  frituras: { icon: '🥔', label: 'Frituras', subgroups: {
    papasTotopos: { label: 'Papas y Totopos', items: ['Papas fritas', 'Totopos', 'Doritos', 'Cheetos', 'Fritos'] },
    maizChicharron: { label: 'Chicharrones y Maíz', items: ['Chicharrón', 'Ruedas de maíz', 'Palomitas saladas', 'Chicharrón de queso'] }
  }},
  botanas: { icon: '🥜', label: 'Botanas', subgroups: {
    frutosSecos: { label: 'Frutos Secos', items: ['Almendras', 'Nueces', 'Cacahuates', 'Mix de frutos secos'] },
    semillas: { label: 'Semillas y Legumbres', items: ['Semillas de calabaza', 'Chicharrones de soya', 'Garbanzos tostados', 'Pepitas'] }
  }},
  pastelitos: { icon: '🧁', label: 'Pastelitos y Pan', subgroups: {
    industrial: { label: 'Pastelitos Industriales', items: ['Suavecito', 'Pingüinos', 'Gansito', 'Mantecadas', 'Conchas'] },
    reposteria: { label: 'Repostería Casera', items: ['Rebanada de pastel', 'Cupcake', 'Brownie', 'Cookie'] }
  }},
  dulces: { icon: '🍬', label: 'Dulces y Chocolates', subgroups: {
    chocolates: { label: 'Chocolates', items: ['Tableta', 'Bombones', 'Chocolate amargo', 'Chocolate con leche'] },
    gomitasCaramelos: { label: 'Gomitas y Caramelos', items: ['Gomitas', 'Caramelos', 'Paletas', 'Mazapán'] }
  }},
  bebidasSnack: { icon: '🥤', label: 'Bebidas para Snack', subgroups: {
    refrescosJugos: { label: 'Refrescos y Jugos', items: ['Refresco', 'Jugo envasado', 'Agua saborizada', 'Bebida energética'] },
    cafeTe: { label: 'Café y Té', items: ['Café preparado', 'Té helado', 'Latte', 'Capuchino'] }
  }}
};

export interface DailyLog {
  date: string;
  sleep: { hours: number; quality: 1 | 2 | 3 | 4 | 5 };
  mealTimes?: { first: string; last: string }; // ✅ NUEVO
  meals: Record<MealTime, MealItem[]>;
  drinks: DrinkItem[];
  activities: { type: string; minutes: number }[];
  wellness: { energy: number; satiety: number; sleep: number };
  metrics?: {
    weight?: number;
    bpSystolic?: number;
    bpDiastolic?: number;
    glucose?: number;
    note?: string;
  };
}

export interface PendingLog extends DailyLog {
  id: string;
  synced: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'salud-disciplina:pending-logs';
export const saveOffline = (log: DailyLog): PendingLog => {
  const pending: PendingLog = { ...log, id: `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, synced: false, createdAt: Date.now() };
  const existing = getPendingLogs();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, pending]));
  return pending;
};
export const getPendingLogs = (): PendingLog[] => {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
};
export const markAsSynced = (tempId: string) => {
  const pending = getPendingLogs();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pending.filter(l => l.id !== tempId)));
};
export const clearPending = () => localStorage.removeItem(STORAGE_KEY);
export const onOnline = (cb: () => void) => { window.addEventListener('online', cb); return () => window.removeEventListener('online', cb); };
export const isOnline = () => navigator.onLine;
