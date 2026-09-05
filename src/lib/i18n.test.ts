import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  DEFAULT_LANGUAGE,
  detectSystemLanguage,
  LANGUAGE_CHANGE_EVENT,
  loadLanguage,
  saveLanguage,
  t,
} from "./i18n";

const KEY = "monocode.language";

describe("i18n module", () => {
  beforeEach(mockLocalStorage);
  afterEach(() => {
    localStorage.removeItem(KEY);
  });

  it("defaults to en or detected language", () => {
    expect(DEFAULT_LANGUAGE).toBe("en");
    expect(["en", "zh-CN"]).toContain(loadLanguage());
  });

  it("persists language selection", () => {
    saveLanguage("zh-CN");
    expect(loadLanguage()).toBe("zh-CN");
    saveLanguage("en");
    expect(loadLanguage()).toBe("en");
  });

  it("translates keys for english and chinese", () => {
    expect(t("common.settings", undefined, "en")).toBe("Settings");
    expect(t("common.settings", undefined, "zh-CN")).toBe("设置");

    expect(t("rail.projects", undefined, "en")).toBe("Projects");
    expect(t("rail.projects", undefined, "zh-CN")).toBe("项目列表");

    expect(t("sidebar.tabSessions", undefined, "en")).toBe("Sessions");
    expect(t("sidebar.tabSessions", undefined, "zh-CN")).toBe("会话");
  });

  it("interpolates parameters in translation strings", () => {
    expect(t("emptySession.workOnProject", { project: "my-app" }, "en")).toBe(
      "What should we work on in my-app?",
    );
    expect(
      t("emptySession.workOnProject", { project: "my-app" }, "zh-CN"),
    ).toBe("接下来要在 my-app 中做什么？");

    expect(t("tabs.sessionsCount", { count: 3 }, "en")).toBe("3 sessions");
    expect(t("tabs.sessionsCount", { count: 3 }, "zh-CN")).toBe("3 个会话");
  });

  it("falls back to english or key if missing", () => {
    expect(t("non.existent.key", undefined, "zh-CN")).toBe("non.existent.key");
  });
});

function mockLocalStorage() {
  const data = new Map<string, string>();
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
    clear: () => {
      data.clear();
    },
    get length() {
      return data.size;
    },
    key: (index: number) => Array.from(data.keys())[index] ?? null,
  };
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
    writable: true,
  });
}
