import i18n from "i18next";
import { useMemo } from "react";
import { JOKES_AMOUNT } from "./api/jokes.api";

const placeholderPatterns = [
  <>
    <span className="placeholder col-6"></span>{" "}
    <span className="placeholder col-5"></span>
  </>,
  <>
    <span className="placeholder col-2"></span>{" "}
    <span className="placeholder col-7"></span>{" "}
    <span className="placeholder col-2"></span>
  </>,
  <>
    <span className="placeholder col-3"></span>{" "}
    <span className="placeholder col-2"></span>{" "}
    <span className="placeholder col-3"></span>{" "}
    <span className="placeholder col-2"></span>
  </>,
];

export const JokesLoadingIndicator = () => {
  const placeholders = useMemo(
    () =>
      Array.from({ length: JOKES_AMOUNT }).map((_, i) => (
        <li key={i} className="placeholder-glow">
          {placeholderPatterns[Math.floor(Math.random() * 3)]}
        </li>
      )),
    []
  );

  return (
    <>
      <ul
        className="list-unstyled"
        style={{ maxWidth: 1280 }}
        aria-hidden="true"
      >
        {placeholders}
      </ul>
      <span role="status" className="visually-hidden">
        {i18n.t("jokes-loading")}
      </span>
    </>
  );
};
