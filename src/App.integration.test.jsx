import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const deeplLangsMock = [{ language: "kl", name: "Klingon" }];
const deeplTranslationMock = [{ text: "klingon funny joke" }];
const jokesDataMock = [{ joke: "funny joke" }];

// eslint-disable-next-line react/prop-types
const WithReactQuery = ({ children }) => (
  <QueryClientProvider
    client={
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            networkMode: "always",
          },
        },
      })
    }
  >
    {children}
  </QueryClientProvider>
);

let fetchJokesMock, fetchLangsMock, fetchTranslationMock;

vi.mock(import("./api/jokes.api"), async (importOriginal) => ({
  ...(await importOriginal()),
  fetchJokes: (...props) => fetchJokesMock(...props),
}));

vi.mock(import("./api/deepl.api"), async (importOriginal) => ({
  ...(await importOriginal()),
  fetchLangs: (...props) => fetchLangsMock(...props),
  fetchTranslation: (...props) => fetchTranslationMock(...props),
}));

describe("App Component Integration", () => {
  let resolveJokes,
    resolveLangs,
    resolveTranslation,
    rejectJokes,
    rejectLangs,
    rejectTranslation;

  beforeEach(() => {
    fetchJokesMock = vi.fn(
      () =>
        new Promise(
          (resolve, reject) => (
            (resolveJokes = resolve), (rejectJokes = reject)
          )
        )
    );
    fetchLangsMock = vi.fn(
      () =>
        new Promise(
          (resolve, reject) => (
            (resolveLangs = resolve), (rejectLangs = reject)
          )
        )
    );
    fetchTranslationMock = vi.fn(
      () =>
        new Promise(
          (resolve, reject) => (
            (resolveTranslation = resolve), (rejectTranslation = reject)
          )
        )
    );
    render(
      <WithReactQuery>
        <App />
      </WithReactQuery>
    );
  });

  it("has title", () =>
    expect(screen.getByText("Just for laughs")).toBeInTheDocument());

  it("indicates loading jokes", () =>
    expect(screen.getByText("Loading jokes...")).toBeInTheDocument());

  it("indicates loading language selector ", () =>
    expect(
      screen.getByRole("combobox", { name: "Select translation", busy: true })
    ).toBeInTheDocument());

  it("requests jokes from api", () =>
    waitFor(() => expect(fetchJokesMock).toHaveBeenCalledOnce()));

  describe("when jokes loaded", () => {
    beforeEach(() => act(() => resolveJokes(jokesDataMock)));

    it("shows jokes", () =>
      waitFor(() =>
        expect(screen.getByText("funny joke")).toBeInTheDocument()
      ));

    it("requests languages from api", () =>
      waitFor(() => expect(fetchLangsMock).toHaveBeenCalledOnce()));

    describe("when languages loaded", () => {
      beforeEach(() => act(() => resolveLangs(deeplLangsMock)));

      it("indicates loaded language selector", () =>
        waitFor(() =>
          expect(
            screen.getByRole("combobox", {
              name: "Select translation",
              busy: false,
            })
          ).toBeInTheDocument()
        ));

      it("shows available languages", () =>
        waitFor(() => expect(screen.getByText("Klingon")).toBeInTheDocument()));

      describe("when language selected", () => {
        beforeEach(async () => {
          await waitFor(() =>
            expect(screen.getByText("Klingon")).toBeInTheDocument()
          );
          await userEvent.selectOptions(
            screen.getByRole("combobox", { name: "Select translation" }),
            "Klingon"
          );
        });

        it("requests translation from api", () =>
          waitFor(() => expect(fetchTranslationMock).toHaveBeenCalledOnce()));

        it("indicates loading translation", () =>
          waitFor(() =>
            expect(screen.getByText("Translating...")).toBeInTheDocument()
          ));

        describe("when translation loaded", () => {
          beforeEach(() => act(() => resolveTranslation(deeplTranslationMock)));

          it("indicates loaded translation", () =>
            waitFor(() =>
              expect(
                screen.queryByText("Translating...")
              ).not.toBeInTheDocument()
            ));

          it("shows translated jokes", () =>
            waitFor(() =>
              expect(screen.getByText("klingon funny joke")).toBeInTheDocument()
            ));
        });

        describe("when translation api request fails", () => {
          beforeEach(() => act(() => rejectTranslation(new Error("oops"))));

          it("shows error message", () =>
            waitFor(() =>
              expect(
                screen.getByText(
                  "Translation service is unavailable. Please try again later."
                )
              ).toBeInTheDocument()
            ));
        });
      });
    });

    describe("when empty languages loaded", () => {
      beforeEach(() => act(() => resolveLangs([])));

      it("shows no available languages", () =>
        waitFor(() =>
          expect(
            screen.getByText(
              "Translation service is unavailable. Please try again later."
            )
          ).toBeInTheDocument()
        ));
    });

    describe("when languages api request fails", () => {
      beforeEach(() => act(() => rejectLangs(new Error("oops"))));

      it("shows error message", () =>
        waitFor(() =>
          expect(
            screen.getByText(
              "Translation service is unavailable. Please try again later."
            )
          ).toBeInTheDocument()
        ));
    });
  });

  describe("when empty jokes loaded", () => {
    beforeEach(() => act(() => resolveJokes([])));

    it("shows no jokes", () =>
      waitFor(() =>
        expect(
          screen.getByText(
            "Jokes could not be retrieved. Please try again later."
          )
        ).toBeInTheDocument()
      ));
  });

  describe("when jokes api request fails", () => {
    beforeEach(() => act(() => rejectJokes(new Error("oops"))));

    it("shows error message", () =>
      waitFor(() =>
        expect(
          screen.getByText(
            "Jokes could not be retrieved. Please try again later."
          )
        ).toBeInTheDocument()
      ));
  });
});
