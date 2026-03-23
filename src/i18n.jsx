import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import uz from "./messages/uz.json";
import en from "./messages/en.json";
import ru from "./messages/ru.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "uz",
    supportedLngs: ["uz", "en", "ru"],
    interpolation: {
      escapeValue: false
    },
    resources: {
      uz: {
        translation: uz
      },
      en: {
        translation: en
      },
      ru: {
        translation: ru
      }
    }
  });

export default i18n;