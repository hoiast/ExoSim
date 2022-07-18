/* 
If you wish to expand languages, create new .json files under 
the i18n folder, import them here and include it under the 
messages property. Remember to update the language 
CascadeSelect component to display the new language options.

To change the default language to a specific option, update the
locale property of the i18n instance.
*/

import { createI18n } from "vue-i18n";
import ptBR from "./pt-BR.json";

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: navigator.language || navigator.userLanguage, // . Default locale
  fallbackLocale: "en",
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: {}, // Translation Keys are defined in english. Therefore, locale messages for "en" may be empty.
    "pt-BR": ptBR,
  },
});

export default i18n;
