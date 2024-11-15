import { createContext, useContext, useState, ReactNode } from 'react';

// Créer le contexte de la langue
const LanguageContext = createContext({
  selectedLang: 'fr',  // Langue par défaut
  changeLanguage: (lang: string) => {}, // Fonction pour changer la langue
});

// Créer un provider pour partager l'état de la langue
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLang, setSelectedLang] = useState<string>('fr');

  const changeLanguage = (lang: string) => {
    setSelectedLang(lang);
  };

  return (
    <LanguageContext.Provider value={{ selectedLang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook pour accéder facilement à la langue dans les composants
export const useLanguage = () => useContext(LanguageContext);