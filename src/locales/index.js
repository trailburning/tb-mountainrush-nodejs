import en from "./en.json";
import de from "./de.json";
import fr from "./fr.json";

const langs = {
  en,
  de,
  fr
};

export default function (lang = "en") {
  return langs[lang];
};