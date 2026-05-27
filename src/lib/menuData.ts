export interface MenuItem {
    id: string;
    name: string;
    category: 'proteína' | 'vegetariano' | 'rápido' | 'completo';
    tags: string[];
    prepTime: number; // minutos
    description: string;
    macros?: { protein: string; fat: string; carbs: string };
    bestFor: ('explorer' | 'program' | 'bridal' | 'general')[];
  }
  
  export const MENU_ITEMS: MenuItem[] = [
    { id: '1', name: 'Huevos revueltos con aguacate', category: 'proteína', tags: ['Desayuno', 'Keto'], prepTime: 10, description: '2 huevos, 1/4 aguacate, espinacas salteadas en aceite de oliva.', macros: { protein: '14g', fat: '22g', carbs: '4g' }, bestFor: ['explorer', 'program', 'general'] },
    { id: '2', name: 'Salmón al horno con brócoli', category: 'proteína', tags: ['Comida/Cena', 'Omega 3'], prepTime: 25, description: '150g salmón, brócoli al vapor, limón y hierbas.', macros: { protein: '30g', fat: '18g', carbs: '6g' }, bestFor: ['bridal', 'program', 'general'] },
    { id: '3', name: 'Ensalada César Low-Carb', category: 'rápido', tags: ['Sin cocción', 'Ligero'], prepTime: 5, description: 'Lechuga romana, pollo a la plancha, parmesano, aderezo casero sin azúcar.', macros: { protein: '25g', fat: '12g', carbs: '5g' }, bestFor: ['explorer', 'bridal', 'general'] },
    { id: '4', name: 'Tofu salteado con vegetales', category: 'vegetariano', tags: ['Vegano', 'Fibra'], prepTime: 15, description: 'Tofu firme, pimiento, calabacín, salsa de soja baja en sodio y sésamo.', macros: { protein: '18g', fat: '10g', carbs: '8g' }, bestFor: ['explorer', 'general'] },
    { id: '5', name: 'Bowl de atún y aguacate', category: 'rápido', tags: ['Snack', 'Saciante'], prepTime: 5, description: 'Atún en agua, 1/2 aguacate, tomate cherry, pepino y limón.', macros: { protein: '20g', fat: '15g', carbs: '3g' }, bestFor: ['bridal', 'explorer', 'general'] },
    { id: '6', name: 'Pollo al curry con coliflor', category: 'completo', tags: ['Cena', 'Antiinflamatorio'], prepTime: 20, description: 'Pechuga en leche de coco y curry suave, arroz de coliflor.', macros: { protein: '28g', fat: '14g', carbs: '7g' }, bestFor: ['program', 'bridal', 'general'] },
    { id: '7', name: 'Yogur griego con nueces', category: 'vegetariano', tags: ['Snack', 'Probiótico'], prepTime: 2, description: '1 yogur griego natural sin azúcar, 10 nueces, canela.', macros: { protein: '15g', fat: '18g', carbs: '6g' }, bestFor: ['explorer', 'program', 'general'] },
    { id: '8', name: 'Filete de res con espárragos', category: 'proteína', tags: ['Cena', 'Hierro'], prepTime: 15, description: '150g res magra, espárragos a la plancha, mantequilla de hierbas.', macros: { protein: '32g', fat: '20g', carbs: '4g' }, bestFor: ['bridal', 'program', 'general'] }
  ];