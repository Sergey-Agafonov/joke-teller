const TRANSLATE_API_URL = "/api/deepl/translate";
const LANGUAGES_API_URL = "/api/deepl/languages";

const parseTranslations = (response) => response.translations;

export const fetchTranslation = async (strings, targetLang) => {
  const params = new URLSearchParams({
    target_lang: targetLang,
  });
  strings.forEach((text) => params.append("text", text));

  const response = await fetch(TRANSLATE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  return parseTranslations(await response.json());
};

export const fetchLangs = async () => {
  const response = await fetch(LANGUAGES_API_URL);
  return response.json();
};
