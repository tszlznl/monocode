import {
  ArrowDownCircle,
  Check,
  ChevronDown,
  Loader,
  RefreshCw,
  RotateCcw,
  Search,
} from "../chrome/icons";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { HarnessIcon } from "../chrome/HarnessIcon";
import { InboxProviderMark } from "../chrome/InboxProviderMark";
import { Popover } from "../chrome/Popover";
import { RemoveProjectDialog } from "../chrome/RemoveProjectDialog";
import { WindowControls } from "../chrome/WindowControls";
import { useLockOverscroll } from "../hooks/useLockOverscroll";
import {
  applyBodyGlass,
  applyThemePreference,
  applySidebarBlur,
  applySidebarOpacity,
  applyThemeTint,
  BODY_GLASS_DEFAULT,
  THEME_PREFERENCE_DEFAULT,
  loadBodyGlass,
  loadThemePreference,
  loadSidebarBlur,
  loadSidebarOpacity,
  loadThemeHue,
  loadThemeSaturation,
  loadTranscriptLayout,
  loadTranscriptAnchor,
  saveBodyGlass,
  saveThemePreference,
  saveSidebarBlur,
  saveSidebarOpacity,
  saveThemeHue,
  saveThemeSaturation,
  saveTranscriptLayout,
  saveTranscriptAnchor,
  TRANSCRIPT_ANCHOR_CHANGE_EVENT,
  SIDEBAR_BLUR_DEFAULT,
  SIDEBAR_BLUR_MAX,
  SIDEBAR_BLUR_MIN,
  SIDEBAR_OPACITY_DEFAULT,
  SIDEBAR_OPACITY_MAX,
  SIDEBAR_OPACITY_MIN,
  THEME_HUE_DEFAULT,
  THEME_HUE_MAX,
  THEME_HUE_MIN,
  THEME_SATURATION_DEFAULT,
  THEME_SATURATION_MAX,
  THEME_SATURATION_MIN,
  type ThemePreference,
  type TranscriptLayout,
} from "../lib/appearance";
import {
  getHarnessAvailabilitySnapshot,
  harnessUnavailableHint,
  isHarnessAvailable,
  probeHarnessAvailability,
  subscribeHarnessAvailability,
} from "../lib/harness/availability";
import { refreshHarnessCatalogs } from "../lib/harness/registry";
import {
  defaultModelId,
  getModelSnapshot,
  isPickerProviderVisible,
  loadDefaultModels,
  loadLastModelChoice,
  modelsFor,
  resolveModel,
  saveDefaultModel,
  saveLastModelChoice,
  savePickerProviderVisible,
  subscribeModels,
} from "../lib/models";
import { prettyCwd, projectName } from "../lib/paths";
import { IS_MAC } from "../lib/platform";
import {
  loadArchivedProjects,
  looksLikeProject,
  subscribeArchivedProjects,
  type ArchivedProject,
} from "../lib/recents";
import {
  HARNESSES,
  HARNESS_TITLE,
  sessionDisplayTitle,
  type HarnessId,
} from "../lib/session";
import {
  loadSessionSidebarFilters,
  saveSessionSidebarFilters,
} from "../lib/sessionFilters";
import type { SessionSummary } from "../lib/sessionStore";
import { clearInboxCache } from "../lib/githubTasks";
import {
  disconnectLinear,
  linearConnected,
  listLinearTeams,
  loadHiddenLinearTeamIds,
  notifyLinearChange,
  saveHiddenLinearTeamIds,
  saveLinearToken,
  type LinearTeam,
} from "../lib/linear";
import { loadTabGroupLabels, resolveTabGroupLabel } from "../lib/tabGroups";
import {
  filterKeybindings,
  KEYBINDINGS,
  loadClaudeHooks,
  loadComposerRunner,
  loadDiffViewer,
  loadFollowUpBehavior,
  loadGridArcadeEnabled,
  loadLiveAgentsEnabled,
  loadNotesEnabled,
  saveClaudeHooks,
  saveComposerRunner,
  saveDiffViewer,
  saveFollowUpBehavior,
  saveGridArcadeEnabled,
  saveLiveAgentsEnabled,
  saveNotesEnabled,
  settingsSectionDescription,
  settingsSectionLabel,
  type DiffViewer,
  type FollowUpBehavior,
  type SettingsSectionId,
} from "../lib/settings";
import { useI18n } from "../lib/i18n";
import { loadSoundsEnabled, playCue, saveSoundsEnabled } from "../lib/sounds";
import {
  installPendingUpdate,
  readAppVersion,
  runUpdateFlow,
  type UpdaterSnapshot,
} from "../lib/updater";

type Props = {
  section: SettingsSectionId;
  cwd: string;
  sessions: SessionSummary[];
  besideRail?: boolean;
  onClose: () => void;
  onOpenSession: (sessionId: string) => void;
  onArchiveSession: (sessionId: string, archived: boolean) => void;
  onDeleteSession: (sessionId: string) => void;
  onRestoreProject?: (path: string) => void;
  onDeleteProject?: (path: string) => void;
  onOpenWhatsNew: (version: string) => void;
};

export function SettingsView({
  section,
  cwd,
  sessions,
  besideRail = false,
  onClose,
  onOpenSession,
  onArchiveSession,
  onDeleteSession,
  onRestoreProject,
  onDeleteProject,
  onOpenWhatsNew,
}: Props) {
  const { t } = useI18n();
  const lockOverscroll = useLockOverscroll<HTMLDivElement>();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const appearance = useAppearanceSettings();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      onCloseRef.current();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  return (
    <div
      role="region"
      aria-label={t("settings.title")}
      data-app-settings
      className="flex min-h-0 min-w-0 flex-1 flex-col text-content"
    >
      <div
        className="flex h-10 shrink-0 select-none items-center border-b border-content/10"
        data-tauri-drag-region="deep"
      >
        {IS_MAC && !besideRail ? <div className="w-[78px] shrink-0" /> : null}
        <div className="flex min-w-0 flex-1 items-center gap-2 px-3 text-[13px]">
          <span className="shrink-0 text-content/45">{t("settings.title")}</span>
          <span aria-hidden className="shrink-0 text-content/25">
            /
          </span>
          <span className="min-w-0 truncate text-content">
            {settingsSectionLabel(section)}
          </span>
        </div>
        {section === "appearance" ? (
          <button
            type="button"
            data-tauri-drag-region="false"
            onClick={appearance.restoreDefaults}
            className="mr-2 flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-content/50 hover:bg-content/10 hover:text-content"
          >
            <RotateCcw className="size-3.5" strokeWidth={1.75} />
            {t("settings.restoreDefaults")}
          </button>
        ) : null}
        {IS_MAC ? null : <WindowControls />}
      </div>

      <div
        ref={lockOverscroll}
        className="min-h-0 flex-1 overflow-y-auto overscroll-none"
      >
        <div className="mx-auto w-full max-w-5xl px-8 py-8">
          <PageHeader
            title={settingsSectionLabel(section)}
            description={settingsSectionDescription(section)}
          />
          {section === "general" ? (
            <GeneralPage onOpenWhatsNew={onOpenWhatsNew} />
          ) : null}
          {section === "appearance" ? (
            <AppearancePage appearance={appearance} />
          ) : null}
          {section === "keybindings" ? <KeybindingsPage /> : null}
          {section === "providers" ? <ProvidersPage /> : null}
          {section === "archive" ? (
            <ArchivePage
              cwd={cwd}
              sessions={sessions}
              onOpenSession={onOpenSession}
              onArchiveSession={onArchiveSession}
              onDeleteSession={onDeleteSession}
              onRestoreProject={onRestoreProject}
              onDeleteProject={onDeleteProject}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function GeneralPage({
  onOpenWhatsNew,
}: {
  onOpenWhatsNew: (version: string) => void;
}) {
  const { t, language, setLanguage } = useI18n();
  const [transcriptLayout, setTranscriptLayout] =
    useState<TranscriptLayout>(loadTranscriptLayout);
  const [transcriptAnchor, setTranscriptAnchor] =
    useState(loadTranscriptAnchor);
  const [diffViewer, setDiffViewer] = useState<DiffViewer>(loadDiffViewer);
  const [followUpBehavior, setFollowUpBehavior] =
    useState<FollowUpBehavior>(loadFollowUpBehavior);
  const [composerRunner, setComposerRunner] = useState(loadComposerRunner);
  const [gridArcadeEnabled, setGridArcadeEnabled] = useState(
    loadGridArcadeEnabled,
  );
  const [notesEnabled, setNotesEnabled] = useState(loadNotesEnabled);
  const [liveAgentsEnabled, setLiveAgentsEnabled] = useState(
    loadLiveAgentsEnabled,
  );
  const [soundsEnabled, setSoundsEnabled] = useState(loadSoundsEnabled);
  const [claudeHooks, setClaudeHooks] = useState(loadClaudeHooks);

  useEffect(() => {
    const onAnchor = (event: Event) => {
      setTranscriptAnchor((event as CustomEvent<boolean>).detail === true);
    };
    window.addEventListener(TRANSCRIPT_ANCHOR_CHANGE_EVENT, onAnchor);
    return () => {
      window.removeEventListener(TRANSCRIPT_ANCHOR_CHANGE_EVENT, onAnchor);
    };
  }, []);

  const onTranscriptLayout = (next: TranscriptLayout) => {
    saveTranscriptLayout(next);
    setTranscriptLayout(next);
  };

  const onTranscriptAnchor = (next: boolean) => {
    saveTranscriptAnchor(next);
    setTranscriptAnchor(next);
  };

  const onDiffViewer = (next: DiffViewer) => {
    saveDiffViewer(next);
    setDiffViewer(next);
  };

  const onFollowUpBehavior = (next: FollowUpBehavior) => {
    saveFollowUpBehavior(next);
    setFollowUpBehavior(next);
  };

  const onComposerRunner = (next: boolean) => {
    saveComposerRunner(next);
    setComposerRunner(next);
  };

  const onGridArcadeEnabled = (next: boolean) => {
    saveGridArcadeEnabled(next);
    setGridArcadeEnabled(next);
  };

  const onNotesEnabled = (next: boolean) => {
    saveNotesEnabled(next);
    setNotesEnabled(next);
  };

  const onLiveAgentsEnabled = (next: boolean) => {
    saveLiveAgentsEnabled(next);
    setLiveAgentsEnabled(next);
  };

  const onSoundsEnabled = (next: boolean) => {
    saveSoundsEnabled(next);
    setSoundsEnabled(next);
  };

  const onClaudeHooks = (next: boolean) => {
    saveClaudeHooks(next);
    setClaudeHooks(next);
  };

  return (
    <>
      <Row
        label={t("settings.general.language")}
        description={t("settings.general.languageDescription")}
      >
        <Segmented
          label={t("settings.general.language")}
          value={language}
          options={[
            { value: "zh-CN", label: "简体中文" },
            { value: "en", label: "English" },
          ]}
          onChange={setLanguage}
        />
      </Row>
      <Row
        label={t("settings.general.transcriptLayout")}
        description={t("settings.general.transcriptLayoutDesc")}
      >
        <Segmented
          label={t("settings.general.transcriptLayout")}
          value={transcriptLayout}
          options={[
            { value: "full", label: t("settings.general.fullWidth") },
            { value: "chat", label: t("settings.general.chat") },
          ]}
          onChange={onTranscriptLayout}
        />
      </Row>
      <Row
        label={t("settings.general.diffView")}
        description={t("settings.general.diffViewDesc")}
      >
        <Segmented
          label={t("settings.general.diffView")}
          value={diffViewer}
          options={[
            { value: "editor", label: t("settings.general.editor") },
            { value: "unified", label: t("settings.general.unified") },
          ]}
          onChange={onDiffViewer}
        />
      </Row>
      <Row
        label={t("settings.general.followUpBehavior")}
        description={t("settings.general.followUpBehaviorDesc")}
      >
        <Segmented
          label={t("settings.general.followUpBehavior")}
          value={followUpBehavior}
          options={[
            { value: "queue", label: t("settings.general.queue") },
            { value: "steer", label: t("settings.general.steer") },
          ]}
          onChange={onFollowUpBehavior}
        />
      </Row>
      <Row
        label={t("settings.general.anchorPrompts")}
        description={t("settings.general.anchorPromptsDesc")}
      >
        <Toggle
          label={t("settings.general.anchorPrompts")}
          on={transcriptAnchor}
          onChange={onTranscriptAnchor}
        />
      </Row>
      <Row
        label={t("settings.general.composerMascot")}
        description={t("settings.general.composerMascotDesc")}
      >
        <Toggle
          label={t("settings.general.composerMascot")}
          on={composerRunner}
          onChange={onComposerRunner}
        />
      </Row>
      <Row
        label={t("settings.general.emptySessionGames")}
        description={t("settings.general.emptySessionGamesDesc")}
      >
        <Toggle
          label={t("settings.general.emptySessionGames")}
          on={gridArcadeEnabled}
          onChange={onGridArcadeEnabled}
        />
      </Row>
      <Row
        label={t("settings.general.notesUi")}
        description={t("settings.general.notesUiDesc")}
      >
        <Toggle label={t("settings.general.notesUi")} on={notesEnabled} onChange={onNotesEnabled} />
      </Row>
      <Row
        label={t("settings.general.liveAgents")}
        description={t("settings.general.liveAgentsDesc")}
      >
        <Toggle
          label={t("settings.general.liveAgents")}
          on={liveAgentsEnabled}
          onChange={onLiveAgentsEnabled}
        />
      </Row>
      <Row
        label={t("settings.general.soundEffects")}
        description={t("settings.general.soundEffectsDesc")}
      >
        <Toggle label={t("settings.general.soundEffects")} on={soundsEnabled} onChange={onSoundsEnabled} />
      </Row>
      <Row
        label={t("settings.general.claudeHooks")}
        description={t("settings.general.claudeHooksDesc")}
      >
        <Toggle
          label={t("settings.general.claudeHooks")}
          on={claudeHooks}
          onChange={onClaudeHooks}
        />
      </Row>

      <Heading title="Linear" />
      <LinearSettings />

      <Heading title={t("settings.general.version")} />
      <UpdateRow onOpenWhatsNew={onOpenWhatsNew} />
    </>
  );
}

function LinearSettings() {
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<LinearTeam[]>([]);
  const [hiddenTeamIds, setHiddenTeamIds] = useState(loadHiddenLinearTeamIds);

  const loadTeams = useCallback(async () => {
    try {
      const next = await listLinearTeams();
      setTeams(next);
    } catch {
      setTeams([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void linearConnected().then((status) => {
      if (cancelled) return;
      setConnected(status.connected);
      if (status.connected) void loadTeams();
    });
    return () => {
      cancelled = true;
    };
  }, [loadTeams]);

  const onSave = async () => {
    if (!token.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      await saveLinearToken(token);
      setToken("");
      setConnected(true);
      clearInboxCache();
      notifyLinearChange();
      await loadTeams();
    } catch (err: unknown) {
      setConnected(false);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const onDisconnect = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await disconnectLinear();
      setConnected(false);
      setTeams([]);
      clearInboxCache();
      notifyLinearChange();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const toggleTeam = (id: string) => {
    const next = new Set(hiddenTeamIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    const ids = [...next];
    setHiddenTeamIds(ids);
    saveHiddenLinearTeamIds(ids);
    clearInboxCache();
  };

  const { t } = useI18n();

  return (
    <>
      <Row
        label={
          <span className="flex items-center gap-2">
            <InboxProviderMark provider="linear" className="size-4 shrink-0" />
            {t("settings.linear.apiKey")}
          </span>
        }
        description={t("settings.linear.apiKeyDesc")}
      >
        {connected ? (
          <SecondaryButton onClick={() => void onDisconnect()} disabled={busy}>
            {t("settings.linear.disconnect")}
          </SecondaryButton>
        ) : (
          <div className="flex items-center gap-2">
            <label className="flex h-7 w-52 shrink-0 items-center rounded-md border border-content/10 px-2 focus-within:border-content/20">
              <input
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void onSave();
                }}
                placeholder="lin_api_…"
                aria-label={t("settings.linear.apiKey")}
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-[12px] text-content outline-none placeholder:text-content/35"
              />
            </label>
            <SecondaryButton
              onClick={() => void onSave()}
              disabled={busy || !token.trim()}
            >
              {busy ? t("settings.linear.saving") : t("settings.linear.connect")}
            </SecondaryButton>
          </div>
        )}
      </Row>
      {error ? (
        <p className="pb-2 text-[12px] text-red-400/90">{error}</p>
      ) : null}
      {connected && teams.length > 0 ? (
        <div className="border-b border-content/5 py-4">
          <div className="text-[13px] font-medium text-content">
            {t("settings.linear.teams")}
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-content/45">
            {t("settings.linear.teamsDesc")}
          </p>
          <div className="mt-3 flex flex-col gap-0.5 -mx-2">
            {teams.map((team) => {
              const checked = !hiddenTeamIds.includes(team.id);
              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => toggleTeam(team.id)}
                  className="flex h-7 items-center gap-2 rounded-md px-2 text-left text-[13px] text-content hover:bg-content/5"
                >
                  <span className="min-w-0 flex-1 truncate">
                    {team.name}
                    {team.key ? (
                      <span className="ml-1.5 text-content/40">{team.key}</span>
                    ) : null}
                  </span>
                  {checked ? (
                    <Check className="size-3.5 shrink-0" strokeWidth={2.25} />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}

function UpdateRow({
  onOpenWhatsNew,
}: {
  onOpenWhatsNew: (version: string) => void;
}) {
  const { t } = useI18n();
  const [snapshot, setSnapshot] = useState<UpdaterSnapshot>({
    phase: "idle",
    currentVersion: "…",
  });

  useEffect(() => {
    let cancelled = false;
    void readAppVersion().then((currentVersion) => {
      if (cancelled) return;
      setSnapshot((current) => ({ ...current, currentVersion }));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const busy =
    snapshot.phase === "checking" || snapshot.phase === "downloading";
  const hasUpdate = snapshot.phase === "available";

  const onClick = async () => {
    if (busy) return;
    if (hasUpdate) {
      await installPendingUpdate(setSnapshot);
      return;
    }
    await runUpdateFlow(true, setSnapshot);
  };

  const status =
    snapshot.phase === "available"
      ? t("settings.update.versionAvailable", { version: snapshot.availableVersion ?? "" })
      : snapshot.phase === "downloading"
        ? t("settings.update.downloading", {
            progress: snapshot.progress != null ? ` ${snapshot.progress}%` : "…",
          })
        : snapshot.phase === "checking"
          ? t("settings.update.checking")
          : snapshot.phase === "current"
            ? t("settings.update.latest")
            : snapshot.phase === "error"
              ? (snapshot.error ?? "Update check failed.")
              : t("settings.update.feedDesc");

  return (
    <Row
      label={
        <span className="flex items-baseline gap-2">
          {t("settings.general.version")}
          <span className="font-mono text-[12px] text-content/45">
            {snapshot.currentVersion}
          </span>
        </span>
      }
      description={status}
    >
      <div className="flex items-center gap-2">
        <SecondaryButton
          onClick={() => onOpenWhatsNew(snapshot.currentVersion)}
          disabled={snapshot.currentVersion === "…"}
        >
          {t("settings.general.whatsNew")}
        </SecondaryButton>
        <SecondaryButton onClick={() => void onClick()} disabled={busy}>
          {busy ? (
          <Loader className="size-3.5 animate-spin" aria-hidden />
        ) : hasUpdate ? (
          <ArrowDownCircle className="size-3.5 text-accent" aria-hidden />
        ) : (
          <RefreshCw className="size-3.5" strokeWidth={1.75} aria-hidden />
        )}
          {hasUpdate ? t("settings.update.download") : t("settings.general.checkForUpdates")}
        </SecondaryButton>
      </div>
    </Row>
  );
}

type AppearanceSettings = ReturnType<typeof useAppearanceSettings>;

function useAppearanceSettings() {
  const [themePreference, setThemePreference] =
    useState<ThemePreference>(loadThemePreference);
  const [opacity, setOpacity] = useState(loadSidebarOpacity);
  const [blur, setBlur] = useState(loadSidebarBlur);
  const [themeHue, setThemeHue] = useState(loadThemeHue);
  const [themeSaturation, setThemeSaturation] = useState(loadThemeSaturation);
  const [bodyGlass, setBodyGlass] = useState(loadBodyGlass);

  const onThemePreference = useCallback((next: ThemePreference) => {
    applyThemePreference(next);
    saveThemePreference(next);
    setThemePreference(next);
  }, []);

  const onOpacity = useCallback((percent: number) => {
    const next = applySidebarOpacity(percent / 100);
    saveSidebarOpacity(next);
    setOpacity(next);
  }, []);

  const onBlur = useCallback((radius: number) => {
    const next = applySidebarBlur(radius);
    saveSidebarBlur(next);
    setBlur(next);
  }, []);

  const onTint = useCallback((hue: number, saturation: number) => {
    const next = applyThemeTint(hue, saturation);
    saveThemeHue(next.hue);
    saveThemeSaturation(next.saturation);
    setThemeHue(next.hue);
    setThemeSaturation(next.saturation);
  }, []);

  const onBodyGlass = useCallback((next: boolean) => {
    applyBodyGlass(next);
    saveBodyGlass(next);
    setBodyGlass(next);
  }, []);

  const restoreDefaults = useCallback(() => {
    onThemePreference(THEME_PREFERENCE_DEFAULT);
    onOpacity(Math.round(SIDEBAR_OPACITY_DEFAULT * 100));
    onBlur(SIDEBAR_BLUR_DEFAULT);
    onTint(THEME_HUE_DEFAULT, THEME_SATURATION_DEFAULT);
    onBodyGlass(BODY_GLASS_DEFAULT);
  }, [onBlur, onBodyGlass, onThemePreference, onOpacity, onTint]);

  return {
    themePreference,
    opacity,
    blur,
    themeHue,
    themeSaturation,
    bodyGlass,
    onThemePreference,
    onOpacity,
    onBlur,
    onTint,
    onBodyGlass,
    restoreDefaults,
  };
}

function AppearancePage({ appearance }: { appearance: AppearanceSettings }) {
  const { t } = useI18n();
  const percent = Math.round(appearance.opacity * 100);

  return (
    <>
      <Row
        label={t("settings.appearance.theme")}
        description={t("settings.appearance.themeDesc")}
      >
        <Segmented
          label={t("settings.appearance.theme")}
          value={appearance.themePreference}
          options={[
            { value: "system", label: t("settings.appearance.themeSystem") },
            { value: "dark", label: t("settings.appearance.themeDark") },
            { value: "light", label: t("settings.appearance.themeLight") },
          ]}
          onChange={appearance.onThemePreference}
        />
      </Row>
      <Row
        label={t("settings.appearance.sidebarOpacity")}
        description={t("settings.appearance.sidebarOpacityDesc")}
      >
        <Slider
          label={t("settings.appearance.sidebarOpacity")}
          value={percent}
          display={`${percent}%`}
          min={Math.round(SIDEBAR_OPACITY_MIN * 100)}
          max={Math.round(SIDEBAR_OPACITY_MAX * 100)}
          onChange={appearance.onOpacity}
        />
      </Row>
      <Row
        label={t("settings.appearance.sidebarBlur")}
        description={t("settings.appearance.sidebarBlurDesc")}
      >
        <Slider
          label={t("settings.appearance.sidebarBlur")}
          value={appearance.blur}
          display={String(appearance.blur)}
          min={SIDEBAR_BLUR_MIN}
          max={SIDEBAR_BLUR_MAX}
          onChange={appearance.onBlur}
        />
      </Row>
      <Row
        label={t("settings.appearance.hue")}
        description={t("settings.appearance.hueDesc")}
      >
        <Slider
          label={t("settings.appearance.hue")}
          value={appearance.themeHue}
          display={`${appearance.themeHue}°`}
          min={THEME_HUE_MIN}
          max={THEME_HUE_MAX}
          onChange={(value) =>
            appearance.onTint(value, appearance.themeSaturation)
          }
        />
      </Row>
      <Row
        label={t("settings.appearance.saturation")}
        description={t("settings.appearance.saturationDesc")}
      >
        <Slider
          label={t("settings.appearance.saturation")}
          value={appearance.themeSaturation}
          display={`${appearance.themeSaturation}%`}
          min={THEME_SATURATION_MIN}
          max={THEME_SATURATION_MAX}
          onChange={(value) => appearance.onTint(appearance.themeHue, value)}
        />
      </Row>
      <Row
        label={t("settings.appearance.mainPaneGlass")}
        description={t("settings.appearance.mainPaneGlassDesc")}
      >
        <Toggle
          label={t("settings.appearance.mainPaneGlass")}
          on={appearance.bodyGlass}
          onChange={appearance.onBodyGlass}
        />
      </Row>
    </>
  );
}

function KeybindingsPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const rows = useMemo(() => filterKeybindings(KEYBINDINGS, query), [query]);

  return (
    <>
      <div className="flex items-center justify-end gap-3 pb-3">
        <span className="shrink-0 text-[12px] text-content/40 tabular-nums">
          {t("settings.keybindings.bindingCount", { count: rows.length })}
        </span>
        <label className="flex h-7 w-52 shrink-0 items-center gap-2 rounded-md border border-content/10 px-2 text-content/45 focus-within:border-content/20">
          <Search className="size-3.5 shrink-0" strokeWidth={1.75} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("settings.keybindings.filter")}
            aria-label={t("settings.keybindings.filter")}
            spellCheck={false}
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-[12px] text-content outline-none placeholder:text-content/35"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-lg border border-content/10">
        <div className="flex items-center border-b border-content/10 bg-content/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-content/40">
          <span className="min-w-0 flex-1">{t("settings.keybindings.command")}</span>
          <span className="w-40 shrink-0">{t("settings.keybindings.shortcut")}</span>
          <span className="w-28 shrink-0">{t("settings.keybindings.when")}</span>
        </div>
        {rows.length === 0 ? (
          <p className="px-3 py-3 text-[12px] text-content/45">
            {t("settings.keybindings.noMatchingBindings")}
          </p>
        ) : (
          rows.map((row) => (
            <div
              key={`${row.command}-${row.keys}`}
              className="flex items-center border-b border-content/5 px-3 py-2 text-[12px] last:border-b-0"
            >
              <span className="min-w-0 flex-1 truncate">{row.command}</span>
              <span className="w-40 shrink-0 font-mono text-[12px] text-content/80">
                {row.keys}
              </span>
              <span className="w-28 shrink-0 font-mono text-[11px] text-content/40">
                {row.when}
              </span>
            </div>
          ))
        )}
      </div>

      <p className="pt-3 text-[12px] text-content/40">
        {t("settings.keybindings.note")}
      </p>
    </>
  );
}

function ProvidersPage() {
  useSyncExternalStore(subscribeModels, getModelSnapshot, getModelSnapshot);
  useSyncExternalStore(
    subscribeHarnessAvailability,
    getHarnessAvailabilitySnapshot,
    getHarnessAvailabilitySnapshot,
  );
  const [choice, setChoice] = useState(loadLastModelChoice);
  const [defaultModels, setDefaultModels] = useState(loadDefaultModels);

  useEffect(() => {
    void probeHarnessAvailability();
  }, []);

  const onModelChange = (harness: HarnessId, model: string) => {
    saveDefaultModel(harness, model);
    setDefaultModels((prev) => ({ ...prev, [harness]: model }));
    if (choice?.harness === harness) {
      saveLastModelChoice(harness, model);
      setChoice({ harness, model });
    }
  };

  const { t } = useI18n();
  const onDefault = (harness: HarnessId, model: string) => {
    saveLastModelChoice(harness, model);
    setDefaultModels((prev) => ({ ...prev, [harness]: model }));
    setChoice({ harness, model });
  };

  return (
    <>
      <p className="pb-2 text-[12px] leading-relaxed text-content/45">
        {t("settings.providers.desc")}
      </p>
      {HARNESSES.map((harness) => (
        <ProviderRow
          key={harness}
          harness={harness}
          selectedModel={
            defaultModels[harness] ??
            (choice?.harness === harness
              ? choice.model
              : defaultModelId(harness))
          }
          isDefault={choice?.harness === harness}
          onDefault={onDefault}
          onModelChange={onModelChange}
        />
      ))}
    </>
  );
}

function ProviderRow({
  harness,
  selectedModel,
  isDefault,
  onDefault,
  onModelChange,
}: {
  harness: HarnessId;
  selectedModel: string;
  isDefault: boolean;
  onDefault: (harness: HarnessId, model: string) => void;
  onModelChange: (harness: HarnessId, model: string) => void;
}) {
  const { t } = useI18n();
  const models = modelsFor(harness);
  const available = isHarnessAvailable(harness);
  const current =
    models.length > 0 ? resolveModel(harness, selectedModel) : null;
  const [inPicker, setInPicker] = useState(() =>
    isPickerProviderVisible(harness),
  );

  useEffect(() => {
    if (!available || models.length > 0) return;
    void refreshHarnessCatalogs([harness]);
  }, [available, harness, models.length]);

  const onPickerVisible = (visible: boolean) => {
    savePickerProviderVisible(harness, visible);
    setInPicker(visible);
  };

  return (
    <Row
      label={
        <span className="flex items-center gap-2">
          <HarnessIcon harness={harness} className="size-4 shrink-0" />
          {HARNESS_TITLE[harness]}
          {isDefault ? (
            <span className="rounded-full bg-content/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-content/60">
              {t("settings.providers.defaultBadge")}
            </span>
          ) : null}
        </span>
      }
      description={
        available
          ? t("settings.providers.modelsAvailable", { count: models.length })
          : harnessUnavailableHint(harness)
      }
    >
      {current ? (
        <Select
          label={`${HARNESS_TITLE[harness]} model`}
          value={current.id}
          onChange={(next) => onModelChange(harness, next)}
          options={models.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        />
      ) : null}
      <SecondaryButton
        onClick={() => current && onDefault(harness, current.id)}
        disabled={isDefault || !current}
      >
        {isDefault ? t("settings.providers.defaultBadge") : t("settings.providers.useByDefault")}
      </SecondaryButton>
      {available ? (
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-content/50">{t("settings.providers.showInPicker")}</span>
          <Toggle
            label={`Show ${HARNESS_TITLE[harness]} in the model picker`}
            on={inPicker}
            onChange={onPickerVisible}
          />
        </div>
      ) : null}
    </Row>
  );
}

function useArchivedProjects(): ArchivedProject[] {
  const [items, setItems] = useState(loadArchivedProjects);
  useEffect(
    () => subscribeArchivedProjects(() => setItems(loadArchivedProjects())),
    [],
  );
  return items;
}

function archivedProjectLabel(path: string): string {
  return resolveTabGroupLabel(
    projectName(path),
    loadTabGroupLabels(),
    projectName(path),
  );
}

function ArchivePage({
  cwd,
  sessions,
  onOpenSession,
  onArchiveSession,
  onDeleteSession,
  onRestoreProject,
  onDeleteProject,
}: {
  cwd: string;
  sessions: SessionSummary[];
  onOpenSession: (sessionId: string) => void;
  onArchiveSession: (sessionId: string, archived: boolean) => void;
  onDeleteSession: (sessionId: string) => void;
  onRestoreProject?: (path: string) => void;
  onDeleteProject?: (path: string) => void;
}) {
  const { t } = useI18n();
  const [filters, setFilters] = useState(loadSessionSidebarFilters);
  const [deleting, setDeleting] = useState<ArchivedProject | null>(null);
  const archivedProjects = useArchivedProjects();
  const archived = useMemo(
    () =>
      sessions
        .filter((session) => session.archived)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [sessions],
  );

  const onShowArchived = (showArchived: boolean) => {
    const next = { ...filters, showArchived };
    saveSessionSidebarFilters(next);
    setFilters(next);
  };

  return (
    <>
      <Heading title={t("settings.archive.projects")} first />
      {archivedProjects.length === 0 ? (
        <p className="py-3 text-[12px] text-content/45">
          {t("settings.archive.projectsDesc")}
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-content/10">
          {archivedProjects.map((project) => (
            <div
              key={project.path}
              className="flex items-center gap-3 border-b border-content/5 px-3 py-2 last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px]">
                  {archivedProjectLabel(project.path)}
                </div>
                <div className="truncate text-[11px] text-content/40">
                  {prettyCwd(project.path)}
                </div>
              </div>
              {onRestoreProject ? (
                <SecondaryButton onClick={() => onRestoreProject(project.path)}>
                  {t("settings.archive.restore")}
                </SecondaryButton>
              ) : null}
              {onDeleteProject ? (
                <SecondaryButton danger onClick={() => setDeleting(project)}>
                  {t("settings.archive.delete")}
                </SecondaryButton>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <Row
        label={t("settings.archive.showArchivedInSidebar")}
        description={t("settings.archive.showArchivedInSidebarDesc")}
      >
        <Toggle
          label={t("settings.archive.showArchivedInSidebar")}
          on={filters.showArchived}
          onChange={onShowArchived}
        />
      </Row>

      <Heading
        title={
          looksLikeProject(cwd)
            ? t("settings.archive.archivedInProject", { project: projectName(cwd) })
            : t("settings.archive.sessions")
        }
      />

      {!looksLikeProject(cwd) ? (
        <p className="py-3 text-[12px] text-content/45">
          {t("settings.archive.openProjectHint")}
        </p>
      ) : archived.length === 0 ? (
        <p className="py-3 text-[12px] text-content/45">
          {t("settings.archive.noArchivedInProject")}
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-content/10">
          {archived.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-3 border-b border-content/5 px-3 py-2 last:border-b-0"
            >
              <HarnessIcon
                harness={session.harness}
                className="size-3.5 shrink-0"
              />
              <button
                type="button"
                onClick={() => onOpenSession(session.id)}
                className="min-w-0 flex-1 truncate text-left text-[13px] hover:text-content"
              >
                {sessionDisplayTitle(session.title, session.harness)}
              </button>
              <span className="shrink-0 text-[11px] text-content/35 tabular-nums">
                {formatDate(session.updatedAt)}
              </span>
              <SecondaryButton
                onClick={() => onArchiveSession(session.id, false)}
              >
                {t("settings.archive.unarchive")}
              </SecondaryButton>
              <SecondaryButton
                danger
                onClick={() => onDeleteSession(session.id)}
              >
                {t("settings.archive.delete")}
              </SecondaryButton>
            </div>
          ))}
        </div>
      )}

      {deleting ? (
        <RemoveProjectDialog
          name={archivedProjectLabel(deleting.path)}
          path={deleting.path}
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            onDeleteProject?.(deleting.path);
            setDeleting(null);
          }}
        />
      ) : null}
    </>
  );
}

function formatDate(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="pb-4">
      <h1 className="text-[20px] font-semibold leading-tight text-content">
        {title}
      </h1>
      {description ? (
        <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-content/45">
          {description}
        </p>
      ) : null}
    </header>
  );
}

function Heading({ title, first = false }: { title: string; first?: boolean }) {
  return (
    <h2
      className={`pb-1 text-[15px] font-semibold text-content ${
        first ? "" : "pt-8"
      }`}
    >
      {title}
    </h2>
  );
}

function Row({
  label,
  description,
  children,
}: {
  label: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-6 border-b border-content/5 py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium text-content">{label}</div>
        {description ? (
          <p className="mt-1 text-[12px] leading-relaxed text-content/45">
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        {children}
      </div>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid w-40 gap-0.5 rounded-md border border-content/10 p-0.5 text-[12px]"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`min-w-0 rounded-[5px] px-1.5 py-1 ${
            value === option.value
              ? "bg-content/10 text-content"
              : "text-content/50 hover:text-content"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Slider({
  label,
  value,
  display,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex w-56 items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        className="sidebar-opacity-slider min-w-0 flex-1"
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="w-10 shrink-0 text-right text-[12px] text-content tabular-nums">
        {display}
      </span>
    </div>
  );
}

function Toggle({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={on}
      onClick={() => {
        playCue("switch");
        onChange(!on);
      }}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        on ? "bg-accent" : "bg-content/20"
      }`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-white transition-[left] ${
          on ? "left-4.5" : "left-0.5"
        }`}
      />
    </button>
  );
}

const SELECT_WIDTH = 240;
const SELECT_MAX_HEIGHT = 280;

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() =>
    Math.max(
      0,
      options.findIndex((option) => option.value === value),
    ),
  );
  const root = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const current = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    setActive(
      Math.max(
        0,
        options.findIndex((option) => option.value === value),
      ),
    );
  }, [open, options, value]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const pick = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  const onTriggerKey = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActive((i) =>
        event.key === "ArrowDown"
          ? Math.min(options.length - 1, i + 1)
          : Math.max(0, i - 1),
      );
      return;
    }
    if (event.key === "Enter" && open) {
      event.preventDefault();
      const option = options[active];
      if (option) pick(option.value);
    }
  };

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKey}
        className="flex h-6.5 max-w-52 items-center gap-1 rounded-md px-1.5 bg-content/10 text-content hover:bg-content/15"
      >
        <span className="min-w-0 truncate text-[12px]">
          {current?.label ?? label}
        </span>
        <ChevronDown
          className={`size-3 shrink-0 text-content/50 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.75}
        />
      </button>
      {open ? (
        <Popover
          anchor={root}
          side="bottom"
          width={SELECT_WIDTH}
          maxHeight={SELECT_MAX_HEIGHT}
          onDismiss={() => setOpen(false)}
          role="listbox"
          aria-label={label}
          className="flex flex-col overflow-hidden"
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-none px-1.5 py-1.5">
            {options.map((option, index) => {
              const selected = option.value === value;
              const highlighted = index === active;
              return (
                <div
                  key={option.value}
                  ref={highlighted ? activeRef : undefined}
                  onMouseEnter={() => setActive(index)}
                  className={`flex w-full items-center rounded-lg px-1 ${
                    highlighted || selected ? "bg-content/10" : "hover:bg-content/5"
                  }`}
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(option.value)}
                    className="flex min-w-0 flex-1 items-center justify-between gap-2 px-1.5 py-2 text-left text-[12px] text-content"
                  >
                    <span className="min-w-0 truncate">{option.label}</span>
                    {selected ? (
                      <Check
                        className="size-3.5 shrink-0 text-content"
                        strokeWidth={1.75}
                      />
                    ) : null}
                  </button>
                </div>
              );
            })}
          </div>
        </Popover>
      ) : null}
    </div>
  );
}

function SecondaryButton({
  onClick,
  disabled = false,
  danger = false,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex shrink-0 items-center gap-1.5 rounded-md border border-content/10 px-2.5 py-1 text-[12px] ${
        danger
          ? "text-red-400 hover:border-red-400/40 hover:bg-red-400/10"
          : "text-content/70 hover:bg-content/10 hover:text-content"
      } disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent`}
    >
      {children}
    </button>
  );
}
