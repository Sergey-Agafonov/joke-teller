import { useQuery } from "@tanstack/react-query";
import i18n from "i18next";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { fetchLangs } from "./api/deepl.api";
import { ORIGINAL_LANG } from "./api/jokes.api";

const isNotOriginal = ({ language }) =>
  language.toLowerCase() !== ORIGINAL_LANG.toLowerCase();

const LanguageSelect = ({ onChange: propsOnChange, language }) => {
  const {
    data: deeplLangs,
    isPending,
    error,
  } = useQuery({
    queryKey: ["deeplLangs"],
    queryFn: fetchLangs,
  });

  const deeplLangOptions = useMemo(() => {
    if (isPending || !deeplLangs) return [];

    return deeplLangs.filter(isNotOriginal).map(({ language, name }) => (
      <option key={language} value={language}>
        {name}
      </option>
    ));
  }, [deeplLangs, isPending]);

  if (!isPending && (deeplLangOptions?.length === 0 || error))
    return (
      <div className="alert alert-warning mt-3" role="alert" aria-live="polite">
        {i18n.t("translation-error")}
      </div>
    );

  return (
    <select
      value={language}
      onChange={({ target }) => propsOnChange(target.value)}
      aria-label="Select translation"
      className="form-control form-select-lg d-inline-block"
      style={{ width: "max-content" }}
      disabled={isPending}
      aria-busy={isPending}
    >
      <option disabled hidden value="">
        {i18n.t("select-translation")}
      </option>
      {deeplLangOptions}
    </select>
  );
};

LanguageSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};

export default LanguageSelect;
