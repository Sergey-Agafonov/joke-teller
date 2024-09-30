import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState, useTransition } from "react";
import JokesList from "./JokesList";
import LanguageSelect from "./LanguageSelect";
import i18n from "./i18n";

function App() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationLanguage, setTranslationLanguage] = useState("");
  const [, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const handleLanguageChange = useCallback(
    (lang) => {
      startTransition(() => setTranslationLanguage(lang)); // transition prevents flicker of "reset to original" btn
    },
    [startTransition]
  );

  return (
    <>
      <h1 className="text-center mb-5">{i18n.t("title")}</h1>

      <div className="d-flex justify-content-between align-items-center">
        <div>
          <LanguageSelect
            onChange={handleLanguageChange}
            language={translationLanguage}
          />
          {isTranslating && (
            <>
              <span
                className="spinner-border spinner-grow text-primary mx-2"
                aria-hidden="true"
                style={{ verticalAlign: -6 }}
              ></span>
              <span role="status">{i18n.t("translating")}</span>
            </>
          )}
        </div>
        <div>
          {translationLanguage && !isTranslating && (
            <button
              className="btn btn-link"
              onClick={() => setTranslationLanguage("")}
            >
              {i18n.t("reset")}
            </button>
          )}
          <button
            className="btn btn-primary text-nowrap"
            onClick={() => queryClient.refetchQueries({ queryKey: ["jokes"] })}
            disabled={isTranslating}
          >
            {i18n.t("more")}
          </button>
        </div>
      </div>

      <JokesList
        {...{ translationLanguage, setIsTranslating }}
        className="mt-4"
      />
    </>
  );
}

export default App;
