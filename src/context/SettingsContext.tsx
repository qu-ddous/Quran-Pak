/**
 * Settings Context — provides reading preferences throughout the app.
 * Persists to IndexedDB via userDb.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSetting, setSetting } from '../db/userDb';
import { DEFAULT_TRANSLATION_EN } from '../api/quranApi';
import { KNOWN_RECITERS } from '../types/quran';

export interface Settings {
  translationEdition: string;
  arabicFontSize: 'sm' | 'md' | 'lg' | 'xl';
  readingMode: 'both' | 'arabic-only' | 'translation-only';
  showTransliteration: boolean;
  darkMode: boolean;
  reciterIdentifier: string;
}

const DEFAULT_SETTINGS: Settings = {
  translationEdition: DEFAULT_TRANSLATION_EN,
  arabicFontSize: 'lg',
  readingMode: 'both',
  showTransliteration: false,
  darkMode: false,
  reciterIdentifier: KNOWN_RECITERS[0].identifier,
};

interface SettingsContextValue {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
  isLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  updateSetting: async () => {},
  isLoaded: false,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const saved: Settings = {
        translationEdition: await getSetting('translationEdition', DEFAULT_SETTINGS.translationEdition),
        arabicFontSize: await getSetting('arabicFontSize', DEFAULT_SETTINGS.arabicFontSize),
        readingMode: await getSetting('readingMode', DEFAULT_SETTINGS.readingMode),
        showTransliteration: await getSetting('showTransliteration', DEFAULT_SETTINGS.showTransliteration),
        darkMode: await getSetting('darkMode', DEFAULT_SETTINGS.darkMode),
        reciterIdentifier: await getSetting('reciterIdentifier', DEFAULT_SETTINGS.reciterIdentifier),
      };
      setSettings(saved);
      setIsLoaded(true);

      // Apply dark mode immediately
      if (saved.darkMode) {
        document.documentElement.classList.add('dark');
      }
    };
    loadSettings();
  }, []);

  const updateSetting = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      return next;
    });
    await setSetting(key, value);

    if (key === 'darkMode') {
      if (value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
