import { HistoryItem } from "../types/History";

// --- History helpers ---
 export const getHistoryFromLocalStorage = (): HistoryItem[] => {
    if (typeof window === "undefined") return [];
    try {
        const data = localStorage.getItem("calculator_history");
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const saveHistoryToLocalStorage = (history: HistoryItem[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("calculator_history", JSON.stringify(history));
};

export const addToHistory = (expression: string, result: string) => {
    const history = getHistoryFromLocalStorage();
    const newItem = {
        expression,
        result,
        timestamp: Date.now()
    };
    // Keep only the last 10 items
    const updatedHistory = [newItem, ...history].slice(0, 10);
    saveHistoryToLocalStorage(updatedHistory);
    return updatedHistory;
};

export const clearHistory = (): HistoryItem[] => {  // Add explicit return type
    if (typeof window === "undefined") return [];
    localStorage.removeItem("calculator_history");
    return [];
};