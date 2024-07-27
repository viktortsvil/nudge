import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useStorageState(key: string) {
  const [state, setState] = useState<[boolean, string | null]>([true, null]);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        setState([false, storedValue]);
      } catch (error) {
        console.error('Failed to load storage data', error);
        setState([false, null]);
      }
    };

    loadStorageData();
  }, [key]);

  const setStorageState = async (value: string | null) => {
    try {
      if (value === null) {
        await AsyncStorage.removeItem(key);
      } else {
        await AsyncStorage.setItem(key, value);
      }
      setState([false, value]);
    } catch (error) {
      console.error('Failed to set storage data', error);
    }
  };

  return [state, setStorageState] as const;
}
