const URL = "https://v2.jokeapi.dev/joke/Any";
const SAFE_MODE = true;
const BLACKLIST_FLAGS = "nsfw,religious,political,racist,sexist,explicit";
const TYPE = "single";
export const JOKES_AMOUNT = 10;
export const ORIGINAL_LANG = "EN";

const parseJokes = (response) => response.jokes;

export const fetchJokes = async () => {
  const params = new URLSearchParams({
    "safe-mode": SAFE_MODE,
    blacklistFlags: BLACKLIST_FLAGS,
    type: TYPE,
    amount: JOKES_AMOUNT,
    lang: ORIGINAL_LANG,
  });

  const response = await fetch(`${URL}?${params.toString()}`);
  return parseJokes(await response.json());
};
