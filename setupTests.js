import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll } from "vitest";
import i18n from "./src/i18n";

beforeAll(() => i18n.changeLanguage("en"));
afterEach(() => cleanup());
