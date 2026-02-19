import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "entries";

/**
 * Save a new entry
 */
const saveEntryToStorage = async (entry: any) => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const entries = existingData ? JSON.parse(existingData) : [];

    entries.push(entry);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving entry:", error);
  }
};

/**
 * Get all entries
 */
const getEntriesFromStorage = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting entries:", error);
    return [];
  }
};

/**
 * Update an entry
 */
const updateEntryInStorage = async (updatedEntry: any) => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const entries = existingData ? JSON.parse(existingData) : [];

    const updatedEntries = entries.map((entry: any) =>
      entry.id === updatedEntry.id ? updatedEntry : entry,
    );

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  } catch (error) {
    console.error("Error updating entry:", error);
  }
};

/**
 * Delete an entry
 */
const deleteEntryFromStorage = async (id: string) => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const entries = existingData ? JSON.parse(existingData) : [];

    const filteredEntries = entries.filter((entry: any) => entry.id !== id);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
  } catch (error) {
    console.error("Error deleting entry:", error);
  }
};

/**
 * Clear all data (for testing or reset)
 */
const clearAllEntries = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing entries:", error);
  }
};

export {
  clearAllEntries, deleteEntryFromStorage, getEntriesFromStorage, saveEntryToStorage, updateEntryInStorage
};

