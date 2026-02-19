import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveEntryToStorage = async (entry: any) => {
  const existingData = await AsyncStorage.getItem("entries");
  const entries = existingData ? JSON.parse(existingData) : [];
  entries.push(entry);
  await AsyncStorage.setItem("entries", JSON.stringify(entries));
};
