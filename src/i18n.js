import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./locales/en.json";
import ruTranslation from "./locales/ru.json";

i18n.use(LanguageDetector).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    ru: {
      translation: ruTranslation,
    },
  },
  detection: {
    order: ["navigator"],
  },
  fallbackLng: "en",
});

export default i18n;
