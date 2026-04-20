import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations } from '../i18n/translations';

type Language = 'vi' | 'en';

interface I18nContextType {
  lang: Language;
  toggleLang: () => void;
  t: (path: string) => any;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('vi');

  const toggleLang = () => {
    setLang((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  const t = (path: string) => {
    const keys = path.split('.');
    let result: any = translations[lang];
    for (const key of keys) {
      if (result?.[key] === undefined) {
        // Fallback to vi
        let fallback: any = translations['vi'];
        for (const k of keys) {
            fallback = fallback?.[k] !== undefined ? fallback[k] : path;
        }
        return fallback === undefined || fallback === path ? path : fallback;
      }
      result = result[key];
    }
    return result;
  };

  return (
    <I18nContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
