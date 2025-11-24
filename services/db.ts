import { Evaluation } from '../types';

// ============================================================================
// CONFIGURACIÓN DE GOOGLE SHEETS
// ============================================================================
// URL configurada por defecto para todos los usuarios
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhEXXBJ8Z4Yp2WJSdMS6MlvohiOpX2x_Hn8z4x8n4HWgeU90-0tmLS5Dnjtcpp-tc/exec"; 

// ============================================================================

const LOCAL_STORAGE_KEY = 'expotecmi_evaluations_v1';
const SHEET_URL_STORAGE_KEY = 'expotecmi_sheet_url';

// --- Local Storage Helpers ---

const getLocalData = (): Evaluation[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading local storage", e);
    return [];
  }
};

const setLocalData = (data: Evaluation[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('local-storage-update'));
  } catch (e) {
    console.error("Error writing to local storage", e);
  }
};

const getSheetUrl = (): string => {
  // 1. Prioridad: URL personalizada guardada en el dispositivo (si el admin la cambió)
  const customUrl = localStorage.getItem(SHEET_URL_STORAGE_KEY);
  if (customUrl && customUrl.trim() !== "") return customUrl;
  
  // 2. Fallback: URL por defecto (hardcoded)
  return GOOGLE_SCRIPT_URL;
};

export const setSheetUrl = (url: string) => {
  localStorage.setItem(SHEET_URL_STORAGE_KEY, url);
  window.location.reload(); // Recargar para aplicar cambios
};

// --- Database Service (Google Sheets Version) ---

export const db = {
  
  // Simula suscripción usando Polling (consulta cada X segundos)
  subscribeToEvaluations: (callback: (data: Evaluation[]) => void) => {
    
    // 1. Cargar local inmediato
    const localData = getLocalData();
    callback(localData);

    const scriptUrl = getSheetUrl();
    
    if (!scriptUrl) {
      window.dispatchEvent(new CustomEvent('sheet-status', { detail: { connected: false, error: "Falta URL del Script" } }));
      return () => {};
    }

    // Función para traer datos de la hoja
    const fetchData = async () => {
      try {
        const response = await fetch(scriptUrl);
        if (!response.ok) throw new Error("Error en red");
        
        const cloudData: Evaluation[] = await response.json();
        
        // Ordenar por fecha descendente
        cloudData.sort((a, b) => b.timestamp - a.timestamp);

        setLocalData(cloudData); // Guardar respaldo
        callback(cloudData); // Actualizar UI
        
        window.dispatchEvent(new CustomEvent('sheet-status', { detail: { connected: true, error: null } }));
      } catch (error) {
        console.warn("Error fetching Google Sheets:", error);
        window.dispatchEvent(new CustomEvent('sheet-status', { detail: { connected: false, error: "Error conectando con Google Sheet" } }));
      }
    };

    // Primera carga
    fetchData();

    // Polling cada 5 segundos para simular tiempo real
    const intervalId = setInterval(fetchData, 5000);

    // Listener de cambios locales
    const handleLocalChange = () => {
      callback(getLocalData());
    };
    window.addEventListener('local-storage-update', handleLocalChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('local-storage-update', handleLocalChange);
    };
  },

  // Añadir evaluación (POST a Google Sheets)
  addEvaluation: async (evaluation: Evaluation): Promise<void> => {
    // 1. Optimistic UI: Guardar localmente primero
    const currentData = getLocalData();
    const updatedData = [evaluation, ...currentData];
    setLocalData(updatedData);

    const scriptUrl = getSheetUrl();

    if (!scriptUrl) {
      console.warn("No Google Sheet URL configured, saving locally only.");
      return;
    }

    // 2. Enviar a Google Sheets
    // Usamos 'no-cors' mode si hay problemas simples, pero para Apps Script
    // lo ideal es enviar un stringify en el body y usar text/plain para evitar preflight complex
    try {
        await fetch(scriptUrl, {
            method: "POST",
            body: JSON.stringify(evaluation)
        });
    } catch (e) {
        console.error("Error enviando a Google Sheets", e);
        throw e;
    }
  },

  // Limpiar base de datos (En sheets esto es complejo sin borrar el archivo, 
  // así que solo limpiaremos local y advertiremos)
  clearDatabase: async (): Promise<void> => {
    setLocalData([]);
    // Nota: No podemos borrar filas de Sheet vía POST simple con este script básico.
    // El usuario debería borrar las filas en el Excel manualmente.
    alert("Los datos se han borrado de la vista local.\n\nPara borrarlos definitivamente, ve a tu Google Sheet y elimina las filas manualmente.");
  },
  
  exportData: async (): Promise<void> => {
    const data = getLocalData();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `expotecmi_resultados_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
};