import { createContext, useContext, useState, useEffect } from "react";
import { t as translate } from "./translations.js";

const SPRACHE_KEY = "fenster-aufmass:sprache";
const I18nContext = createContext(null);

function ermittleAnfangssprache() {
  try {
    return window.localStorage.getItem(SPRACHE_KEY) === "pl" ? "pl" : "de";
  } catch (e) {
    return "de";
  }
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(ermittleAnfangssprache);

  useEffect(() => {
    try {
      window.localStorage.setItem(SPRACHE_KEY, lang);
    } catch (e) {
      /* localStorage nicht verfügbar */
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key, vars) => translate(lang, key, vars);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n muss innerhalb von I18nProvider verwendet werden");
  return ctx;
}
