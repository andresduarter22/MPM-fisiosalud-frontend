import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import XHR from "i18next-xhr-backend";

import translationEng from "../locales/en/translation.json";
import translationEsp from "../locales/es/translation.json";

i18n
    .use(XHR)
    .use(LanguageDetector)
    .init({
        detection: { order: ["path", "navigator"] },
        debug: true,
        fallbackLng: "en",
        react: {
            useSuspense: false
        },
        keySeparator: false,

        resources: {
            en: {
                translations: translationEng
            },
            es: {
                translations: translationEsp
            }
        },
        ns: ["translations"],
        defaultNS: "translations"
    });

export default i18n;