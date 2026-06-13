/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LanguageSetting } from "../types";

export const SUPPORTED_LANGUAGES: LanguageSetting[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളம்", flag: "🇮🇳" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nativeName: "اُردُو", flag: "🇵🇰" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्", flag: "🇮🇳" },
  { code: "kok", name: "Konkani", nativeName: "कोंकणी", flag: "🇮🇳" },
  { code: "mni", name: "Manipuri", nativeName: "মণিপুরী", flag: "🇮🇳" },
  { code: "ks", name: "Kashmiri", nativeName: "कश्मीरी", flag: "🇮🇳" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", flag: "🇳🇵" },
  { code: "brx", name: "Bodo", nativeName: "बड़ो", flag: "🇮🇳" },
  { code: "sat", name: "Santali", nativeName: "संताली", flag: "🇮🇳" },
  { code: "doi", name: "Dogri", nativeName: "डोगरी", flag: "🇮🇳" },
  { code: "mai", name: "Maithili", nativeName: "मैथिली", flag: "🇮🇳" }
];

export const getSpeakLanguageTag = (code: string): string => {
  const mapping: { [key: string]: string } = {
    en: "en-US",
    hi: "hi-IN",
    mr: "mr-IN",
    gu: "gu-IN",
    pa: "pa-IN",
    bn: "bn-IN",
    ta: "ta-IN",
    te: "te-IN",
    kn: "kn-IN",
    ml: "ml-IN",
    or: "or-IN",
    ur: "ur-PK",
    sa: "sa-IN",
    ne: "ne-NP",
  };
  return mapping[code] || "en-US";
};
