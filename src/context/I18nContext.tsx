import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations } from '../i18n/translations';

type Language = 'vi' | 'en';

interface I18nContextType {
  lang: Language;
  toggleLang: () => void;
  t: (path: string) => any;
  updateTranslation: (newContent: any) => void;
  translations: any;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('preferred_lang') as Language) || 'vi';
  });

  const [customTranslations, setCustomTranslations] = useState(() => {
    const saved = localStorage.getItem('site_content');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleLang = () => {
    setLang((prev) => {
      const newLang = prev === 'vi' ? 'en' : 'vi';
      localStorage.setItem('preferred_lang', newLang);
      return newLang;
    });
  };

  const updateTranslation = (newContent: any) => {
    setCustomTranslations(newContent);
    localStorage.setItem('site_content', JSON.stringify(newContent));
  };

  const t = (path: string) => {
    const keys = path.split('.');
    
    // Check custom translations first
    let customResult: any = customTranslations[lang];
    let foundCustom = true;
    for (const key of keys) {
      if (customResult?.[key] === undefined) {
        foundCustom = false;
        break;
      }
      customResult = customResult[key];
    }
    if (foundCustom) return customResult;

    // Fallback to static translations
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
    <I18nContext.Provider value={{ lang, toggleLang, t, updateTranslation, translations: { ...translations, ...customTranslations } }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
