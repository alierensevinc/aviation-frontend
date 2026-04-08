import { StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export const mmkvStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name),
};
