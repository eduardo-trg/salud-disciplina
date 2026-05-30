/**
 * Devuelve la fecha actual en formato YYYY-MM-DD usando la zona horaria LOCAL del usuario.
 * Evita el problema de toISOString() que convierte a UTC y puede desplazar el día.
 * @param date - Fecha opcional (por defect: new Date())
 * @returns string en formato "YYYY-MM-DD"
 */
export const getLocalDateISO = (date: Date = new Date()): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };