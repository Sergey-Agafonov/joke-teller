import { useQuery } from "@tanstack/react-query";
import i18n from "i18next";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { fetchTranslation } from "./api/deepl.api";
import { fetchJokes } from "./api/jokes.api";
import { JokesLoadingIndicator } from "./JokesLoadingIndicator";

const jokeFormatter = ({ joke }) => joke;
const translationFormatter = ({ text }) => text;

/**
 * @public
 * @export
 * @component
 * Renders a list of jokes, optionally translating them into a specified language.
 * Displays a loading placeholder when loading jokes, and accepts optional callback to indicate if translation is underway.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.translationLanguage] - The target language code for translation (e.g., "DE", "FR" as per {@link https://developers.deepl.com/docs/api-reference/languages|DeepL API Languages}). If not provided, jokes will be displayed in their original language.
 * @param {function} [props.setIsTranslating] - Optional callback to indicate if translation is underway (sets boolean `true`) or not (sets boolean `false`).
 * @param {Object} [props.rest] - Remaining props to be spread on the root `<ul>` element.
 * @returns {JSX.Element} The rendered component displaying the list of jokes, with translation if applicable.
 */
const JokesList = ({ translationLanguage, setIsTranslating, ...props }) => {
  const {
    data: jokes,
    isFetching: isFetchingJokes,
    error: errorFetchingJokes,
  } = useQuery({
    queryKey: ["jokes"],
    queryFn: fetchJokes,
  });

  const {
    data: translatedJokes,
    isFetching: isTranslating,
    error: errorTranslating,
  } = useQuery({
    queryKey: ["translatedJokes", jokes, translationLanguage],
    queryFn: () =>
      fetchTranslation(jokes.map(jokeFormatter), translationLanguage),
    enabled: !!translationLanguage && jokes?.length > 0,
  });

  const [displayedJokes, setDisplayedJokes] = useState([]);

  useEffect(() => {
    if (isTranslating || (isFetchingJokes && translationLanguage)) return; // avoids flash of EN jokes

    let displayedJokes = [];
    if (translatedJokes) {
      displayedJokes = translatedJokes.map(translationFormatter);
    } else if (jokes) {
      displayedJokes = jokes.map(jokeFormatter);
    }

    setDisplayedJokes(displayedJokes);
  }, [
    isFetchingJokes,
    isTranslating,
    jokes,
    translatedJokes,
    translationLanguage,
  ]);

  useEffect(() => {
    setIsTranslating?.(isTranslating);
  }, [isTranslating, setIsTranslating]);

  if (isFetchingJokes) return <JokesLoadingIndicator />;

  if (displayedJokes.length === 0 || errorFetchingJokes)
    return (
      <div className="alert alert-warning mt-3" role="alert">
        {i18n.t("jokes-error")}
      </div>
    );

  return (
    <>
      {errorTranslating && (
        <div className="alert alert-warning mt-3" role="alert">
          {i18n.t("translation-error")}
        </div>
      )}
      <ul aria-label="List of jokes" {...props}>
        {displayedJokes.map((joke, i) => (
          <li key={i}>{joke}</li>
        ))}
      </ul>
    </>
  );
};

JokesList.propTypes = {
  translationLanguage: PropTypes.string,
  setIsTranslating: PropTypes.func,
};

export default JokesList;
