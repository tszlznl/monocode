import { useSyncExternalStore } from "react";

export type Language = "en" | "zh-CN";

const LANGUAGE_KEY = "monocode.language";
export const LANGUAGE_CHANGE_EVENT = "monocode:language-change";

export const DEFAULT_LANGUAGE: Language = "en";

export function detectSystemLanguage(): Language {
  if (typeof navigator !== "undefined" && navigator.language) {
    if (navigator.language.toLowerCase().startsWith("zh")) {
      return "zh-CN";
    }
  }
  return "en";
}

export function loadLanguage(): Language {
  try {
    const raw = localStorage.getItem(LANGUAGE_KEY);
    if (raw === "zh-CN" || raw === "en") return raw;
  } catch {
    // localStorage unavailable
  }
  return detectSystemLanguage();
}

export function saveLanguage(lang: Language) {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch {
    // private mode / quota
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<Language>(LANGUAGE_CHANGE_EVENT, { detail: lang }),
    );
  }
}

export function subscribeLanguage(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
}

export function useLanguage(): Language {
  return useSyncExternalStore(
    subscribeLanguage,
    loadLanguage,
    () => DEFAULT_LANGUAGE,
  );
}

const TRANSLATIONS = {
  en: {
    // Common
    "common.close": "Close",
    "common.back": "Back",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.archive": "Archive",
    "common.restore": "Restore",
    "common.rename": "Rename",
    "common.pin": "Pin",
    "common.unpin": "Unpin",
    "common.remove": "Remove",
    "common.retry": "Retry",
    "common.open": "Open",
    "common.search": "Search",
    "common.settings": "Settings",
    "common.loading": "Loading...",

    // Window controls
    "window.minimize": "Minimize",
    "window.maximize": "Maximize",
    "window.restore": "Restore",
    "window.close": "Close",

    // Project Rail
    "rail.search": "Search",
    "rail.inbox": "Inbox",
    "rail.inboxNew": "Inbox, new items",
    "rail.notes": "Notes",
    "rail.pinned": "Pinned",
    "rail.projects": "Projects",
    "rail.noProjects": "No projects yet",
    "rail.settings": "Settings",
    "rail.unpinProject": "Unpin project",
    "rail.pinProject": "Pin project",
    "rail.revealFinder": "Reveal in Finder",
    "rail.revealExplorer": "Reveal in File Explorer",
    "rail.revealFolder": "Open Containing Folder",

    // Sidebar
    "sidebar.workspace": "Workspace",
    "sidebar.noProjectFolder": "No project folder",
    "sidebar.tabSessions": "Sessions",
    "sidebar.tabInbox": "Inbox",
    "sidebar.tabFiles": "Explorer",
    "sidebar.tabChanges": "Changes",
    "sidebar.searchConversations": "Search conversations...",
    "sidebar.filterSessions": "Filter sessions",
    "sidebar.newSession": "New Session",
    "sidebar.goToFile": "Go to File",
    "sidebar.emptySessions": "Sessions you start will show up here",
    "sidebar.noMatchingSessions": "No matching sessions",
    "sidebar.noFilterSessions": "No sessions match these filters",
    "sidebar.loadError": "Couldn’t load sessions",
    "sidebar.ungroup": "Ungroup",
    "sidebar.newFolder": "New folder",
    "sidebar.addToFolder": "Add to {folder}",
    "sidebar.removeFromFolder": "Remove from folder",
    "sidebar.unarchive": "Unarchive",
    "sidebar.filters.archived": "Archived",
    "sidebar.filters.status": "Status",
    "sidebar.filters.working": "Working",
    "sidebar.filters.needsApproval": "Needs approval",
    "sidebar.filters.done": "Done",
    "sidebar.filters.time": "Time",
    "sidebar.filters.allTime": "All time",
    "sidebar.filters.today": "Today",
    "sidebar.filters.last7Days": "Last 7 days",
    "sidebar.filters.last30Days": "Last 30 days",
    "sidebar.filters.provider": "Provider",
    "sidebar.filters.clearFilters": "Clear filters",

    // Tabs
    "tabs.newSession": "New session",
    "tabs.sessionsCount": "{count} sessions",
    "tabs.newTab": "New tab",
    "tabs.toggleSidebar": "Toggle sidebar",
    "tabs.openSettings": "Open settings",
    "tabs.terminal": "Terminal",

    // Runtime mode
    "runtimeMode.title": "Access",
    "runtimeMode.supervised.label": "Supervised",
    "runtimeMode.supervised.hint": "Commands and edits require explicit approval.",
    "runtimeMode.autoAcceptEdits.label": "Auto-accept edits",
    "runtimeMode.autoAcceptEdits.hint": "Edits applied automatically. Commands still require approval.",
    "runtimeMode.auto.label": "Auto",
    "runtimeMode.auto.hint": "Routine actions proceed. Unsafe commands or tricky edits require approval.",
    "runtimeMode.fullAccess.label": "Full access",
    "runtimeMode.fullAccess.hint": "Commands run and files edit without prompting.",

    // Settings
    "settings.title": "Settings",
    "settings.restoreDefaults": "Restore defaults",
    "settings.section.general.label": "General",
    "settings.section.general.description":
      "App-wide behavior and the build you are running.",
    "settings.section.appearance.label": "Appearance",
    "settings.section.appearance.description":
      "Theme, translucency, and the tint applied to the chrome.",
    "settings.section.keybindings.label": "Keybindings",
    "settings.section.keybindings.description":
      "Every shortcut the workspace handles, from the app menu and the key handler.",
    "settings.section.providers.label": "Providers",
    "settings.section.providers.description":
      "Agent CLIs MonoCode can drive, and the model new sessions start with.",
    "settings.section.archive.label": "Archive",
    "settings.section.archive.description":
      "Projects and conversations you have archived.",

    // Settings: General
    "settings.general.language": "Language",
    "settings.general.languageDescription":
      "Choose the display language for the MonoCode interface.",
    "settings.general.transcriptLayout": "Transcript layout",
    "settings.general.transcriptLayoutDesc":
      "Full width keeps user prompts as a spanning card. Chat aligns them to the right with a max width, like a messaging app.",
    "settings.general.fullWidth": "Full width",
    "settings.general.chat": "Chat",
    "settings.general.diffView": "Diff view",
    "settings.general.diffViewDesc":
      "Editor keeps working-tree changes in the file. Unified stacks every changed file in one review, with sticky headers and collapsed unchanged lines.",
    "settings.general.editor": "Editor",
    "settings.general.unified": "Unified",
    "settings.general.followUpBehavior": "Follow-up behavior",
    "settings.general.followUpBehaviorDesc":
      "Queue follow-ups until the active turn finishes, or steer the active turn immediately.",
    "settings.general.queue": "Queue",
    "settings.general.steer": "Steer",
    "settings.general.anchorPrompts": "Anchor prompts to top",
    "settings.general.anchorPromptsDesc":
      "When you send, the new prompt sits at the top of the transcript and the reply grows into the space below. Turn this off to keep the classic layout, with the latest message resting on the composer.",
    "settings.general.composerMascot": "Composer mascot",
    "settings.general.composerMascotDesc":
      "When a turn is running, the project mascot runs along the composer, bonks the scroll-to-latest button the first time, then jumps it, and sometimes grabs a coin.",
    "settings.general.emptySessionGames": "Empty session games",
    "settings.general.emptySessionGamesDesc":
      "Pac-man and snake idle on the empty-session grid. Hover the band to take control of whichever is on screen. Turn this off to keep the pane still.",
    "settings.general.notesUi": "Notes UI",
    "settings.general.notesUiDesc":
      "Keep scratchpad notes alongside your projects and conversations.",
    "settings.general.liveAgents": "Live agents rail card",
    "settings.general.liveAgentsDesc":
      "Preview running background tasks and active sessions in the rail.",
    "settings.general.soundEffects": "Sound effects",
    "settings.general.soundEffectsDesc":
      "Audio cues when turns finish or need approval.",
    "settings.general.claudeHooks": "Claude hooks",
    "settings.general.claudeHooksDesc":
      "Allow Claude hooks to run during session lifecycle.",
    "settings.general.version": "Version",
    "settings.general.upToDate": "MonoCode is up to date",
    "settings.general.checkForUpdates": "Check for updates",
    "settings.general.checkingForUpdates": "Checking for updates...",
    "settings.general.installUpdate": "Install update and restart",
    "settings.general.whatsNew": "What's new",

    // Settings: Appearance
    "settings.appearance.theme": "Theme",
    "settings.appearance.themeDesc":
      "Choose how MonoCode handles light and dark mode.",
    "settings.appearance.themeSystem": "System",
    "settings.appearance.themeDark": "Dark",
    "settings.appearance.themeLight": "Light",
    "settings.appearance.tint": "Interface tint",
    "settings.appearance.tintDesc":
      "Subtle color applied across chrome borders and highlights.",
    "settings.appearance.sidebarOpacity": "Sidebar opacity",
    "settings.appearance.sidebarOpacityDesc":
      "How much of the desktop shows through the sidebar and the project rail.",
    "settings.appearance.sidebarBlur": "Sidebar blur",
    "settings.appearance.sidebarBlurDesc":
      "Background blur behind the window. Higher values cost more to composite.",
    "settings.appearance.translucency": "Window translucency",
    "settings.appearance.hue": "Hue",
    "settings.appearance.hueDesc": "Base hue for accents and tinted surfaces.",
    "settings.appearance.saturation": "Saturation",
    "settings.appearance.saturationDesc":
      "How strongly the hue tints the interface. Zero keeps it neutral.",
    "settings.appearance.mainPaneGlass": "Main pane glass",
    "settings.appearance.mainPaneGlassDesc":
      "Extend the translucent treatment to the main pane behind sessions and editors.",

    // Settings: Keybindings
    "settings.keybindings.filter": "Filter keybindings...",
    "settings.keybindings.command": "Command",
    "settings.keybindings.shortcut": "Shortcut",
    "settings.keybindings.when": "When",
    "settings.keybindings.bindingCount": "{count} bindings",
    "settings.keybindings.noMatchingBindings": "No matching bindings",
    "settings.keybindings.note":
      "Bindings come from the app menu and the workspace key handler; they aren’t customizable yet.",

    // Settings: Providers
    "settings.providers.desc":
      "A provider is listed as installed once its CLI is found on your PATH. Uninstalled CLIs stay listed here but are omitted from the model picker. Turn off Show in picker to hide an installed provider from those tabs. The model beside each provider is what new conversations use when that provider is selected; Use by default picks the provider itself.",
    "settings.providers.defaultBadge": "Default",
    "settings.providers.useByDefault": "Use by default",
    "settings.providers.modelsAvailable": "{count} models available.",
    "settings.providers.showInPicker": "Show in picker",

    // Settings: Archive
    "settings.archive.projects": "Archived Projects",
    "settings.archive.projectsDesc":
      "Archive a project from the rail to keep its chats without listing it in the sidebar.",
    "settings.archive.showArchivedInSidebar": "Show archived in the sidebar",
    "settings.archive.showArchivedInSidebarDesc":
      "Keep archived conversations listed alongside the active ones.",
    "settings.archive.sessions": "Archived Conversations",
    "settings.archive.archivedInProject": "Archived in {project}",
    "settings.archive.openProjectHint": "Open a project to see its archived conversations.",
    "settings.archive.noArchivedInProject": "No archived conversations in this project.",
    "settings.archive.noProjects": "No archived projects",
    "settings.archive.noSessions": "No archived conversations",
    "settings.archive.restore": "Restore",
    "settings.archive.unarchive": "Unarchive",
    "settings.archive.delete": "Delete permanently",

    // Settings: Linear
    "settings.linear.apiKey": "API key",
    "settings.linear.apiKeyDesc":
      "Create a personal API key in Linear → Settings → Security & Access. Disconnect deletes it.",
    "settings.linear.disconnect": "Disconnect",
    "settings.linear.connect": "Connect",
    "settings.linear.saving": "Saving",
    "settings.linear.teams": "Linear Teams",
    "settings.linear.teamsDesc": "Unchecked teams stay out of the inbox.",

    // Settings: Update
    "settings.update.versionAvailable": "Version {version} is available.",
    "settings.update.downloading": "Downloading{progress}",
    "settings.update.checking": "Checking for updates…",
    "settings.update.latest": "You're on the latest version.",
    "settings.update.feedDesc": "MonoCode updates itself from the release feed.",
    "settings.update.download": "Download",

    // Composer
    "composer.placeholderShell": "How can I help you today?",
    "composer.placeholderNormal":
      "Ask, build, / for commands, @ for references... ",
    "composer.placeholderInbox": "Add a note, or send to start…",
    "composer.placeholderNote": "Add a message, or send…",
    "composer.placeholderHandoff": "Add context, or send to continue…",
    "composer.send": "Send message",
    "composer.stop": "Stop",
    "composer.addFilesOrMode": "Add files or choose a mode",

    // Git
    "git.changes": "Changes",
    "git.stagedChanges": "Staged Changes",
    "git.stageAll": "Stage All",
    "git.unstageAll": "Unstage All",
    "git.discardAll": "Discard All Changes",
    "git.stageAllChanges": "Stage All Changes",
    "git.unstageAllChanges": "Unstage All Changes",
    "git.discardAllChanges": "Discard All Changes",
    "git.commit": "Commit",
    "git.commitMessage": "Commit message",
    "git.commitShortcutHint": "Message ({shortcut} to commit)",
    "git.generateMessage": "Generate commit message",
    "git.commitOptions": "Commit options",
    "git.commitAndPush": "Commit & Push",
    "git.commitPushPr": "Commit, Push & Create PR",
    "git.noUncommitted": "No uncommitted changes",
    "git.loadingChanges": "Loading changes…",
    "git.sync": "Sync",
    "git.publish": "Publish Branch",
    "git.publishBranch": "Publish Branch",
    "git.synchronizing": "Synchronizing Changes...",
    "git.createPr": "Create pull request",
    "git.viewPr": "View pull request",
    "git.uncommittedChanges": "Uncommitted changes",
    "git.overwriteWarningCreate":
      "Creating “{branch}” would overwrite your local changes. Stash them for later, or commit them on this branch first.",
    "git.overwriteWarningSwitch":
      "Switching to “{branch}” would overwrite your local changes. Stash them for later, or commit them on this branch first.",
    "git.commitAndSwitch": "Commit & switch",
    "git.stashAndSwitch": "Stash & switch",
    "git.noRepo": "No repo",
    "git.noGitRepo": "No git repository",
    "git.loadingBranch": "Loading branch…",
    "git.branchPicker": "Branch picker",
    "git.searchOrCreateBranch": "Search or create a branch...",
    "git.noMatchingBranches": "No matching branches",
    "git.noBranches": "No branches",
    "git.branches": "Branches",
    "git.createAndCheckout": "Create and checkout {name}",
    "git.hideChanges": "Hide changes",
    "git.showChanges": "Show changes",
    "git.filesChanged": "{files} files changed",
    "git.createBranch": "Create {branch}",
    "git.switchBranch": "Switch to {branch}",

    // Explorer
    "explorer.newFile": "New File",
    "explorer.newFolder": "New Folder",
    "explorer.collapseAll": "Collapse All",
    "explorer.searchInFiles": "Search in files",
    "explorer.cut": "Cut",
    "explorer.copy": "Copy",
    "explorer.paste": "Paste",
    "explorer.duplicate": "Duplicate",
    "explorer.copyPath": "Copy Path",
    "explorer.copyRelativePath": "Copy Relative Path",
    "explorer.openInTerminal": "Open in Terminal",

    // Empty Session
    "emptySession.workOnProject": "What should we work on in {project}?",
    "emptySession.workOn": "What should we work on?",

    // Cwd Picker
    "cwdPicker.currentProject": "Current project",
    "cwdPicker.recentProjects": "Recent projects",
    "cwdPicker.moreRecents": "More recent projects",
    "cwdPicker.newTerminal": "Open terminal here",

    // Search
    "search.all": "All",
    "search.conversations": "Conversations",
    "search.files": "Files",
    "search.projects": "Projects",
    "search.searchEverything": "Search everything...",
    "search.noResults": "No results",
    "search.emptyPrompt": "Find files, conversations, messages, and projects.",
    "search.backToFiles": "Back to files",
    "search.searchInFiles": "Search in files",
    "search.matchCase": "Match case",
    "search.matchWholeWord": "Match whole word",
    "search.useRegex": "Use regular expression",
    "search.filesToInclude": "files to include",
    "search.filesToExclude": "files to exclude",
    "search.searching": "Searching…",
    "search.matchSummary": "{matches} results in {files} files",
    "search.limited": " (limited)",
    "search.typeToSearch": "Type to search across the project",

    // Notes
    "notes.title": "Notes",
    "notes.newNote": "New note",
    "notes.searchNotes": "Search notes...",
    "notes.filterNotes": "Filter notes...",
    "notes.noNotes": "No notes yet",
    "notes.noMatchingNotes": "No matching notes",
    "notes.noNotesDesc":
      "No notes yet. Save a turn from the transcript, or create one here.",
    "notes.deleteNote": "Delete note",
    "notes.addToChat": "Add to chat",
    "notes.preview": "Preview",
    "notes.source": "Source",
    "notes.noDescription": "No description",
    "notes.writeMarkdown": "Write markdown…",
    "notes.untitled": "Untitled",
    "notes.selectNote": "Select a note",
    "notes.singleNote": "Note",
    "notes.updatedAt": "Updated {time}",

    // Approval
    "approval.question": "Question",
    "approval.approval": "Approval",
    "approval.allow": "Allow",
    "approval.deny": "Deny",

    // Questions
    "question.skip": "Skip",
    "question.continue": "Continue",
    "question.stepProgress": "{current} of {total}",
    "question.selectAllThatApply": "Select all that apply",
    "question.typeYourAnswer": "Type your answer",
    "question.other": "Other",

    // File Picker
    "filePicker.title": "Go to File",
    "filePicker.openProjectHint": "Open a project to search files",
    "filePicker.indexing": "Indexing files…",
    "filePicker.noFiles": "No files found",
    "filePicker.noMatching": "No matching files",
    "filePicker.typeToSearch": "Type a file name to search",

    // Model Picker
    "modelPicker.title": "Model picker",
    "modelPicker.providers": "Providers",
    "modelPicker.searchModels": "Search models...",
    "modelPicker.favorites": "Favorites",
    "modelPicker.noFavorites": "No favorite models",
    "modelPicker.loadingCodex": "Loading Codex models…",
    "modelPicker.noMatchingModels": "No matching models",
    "modelPicker.models": "Models",
    "modelPicker.favorite": "Add to favorites",
    "modelPicker.unfavorite": "Remove from favorites",

    // Composer
    "composer.queuePaused": "Queue paused because you interrupted",
    "composer.resume": "Resume",
    "composer.steer": "Steer",
    "composer.editQueued": "Edit queued message",
    "composer.saveQueued": "Save queued message",
    "composer.cancelQueued": "Cancel queued message edit",
    "composer.removeQueued": "Remove queued message",
    "composer.attachmentCount": "{count} attachment",
    "composer.attachmentsCount": "{count} attachments",
    "composer.addToMessage": "Add to message",
    "composer.uploadFile": "Upload file",
    "composer.uploadFileDesc": "Attach files or images to this message",
    "composer.uploadFileUnsupported": "{harness} does not support attachments",
    "composer.planMode": "Plan mode",
    "composer.planModeDesc": "Create a plan to review before building",
    "composer.turnOffPlanMode": "Turn off Plan mode",
    "composer.plan": "Plan",

    // Git
    "git.discardChanges": "Discard Changes",
    "git.unstageChanges": "Unstage Changes",
    "git.stageChanges": "Stage Changes",
    "git.syncingChanges": "Synchronizing Changes...",
    "git.publishBranchNamed": 'Publish Branch "{branch}"',
    "git.pullPushCommits": "Pull {pull} and push {push} commits between {remote}",
    "git.pullCommits": "Pull {count} commit(s) from {remote}",
    "git.pushCommits": "Push {count} commit(s) to {remote}",
    "git.createPrInto": "Create a pull request into {branch}",
    "git.viewPrNamed": "View PR #{number}: {title}",
    "git.divergedFrom": "Diverged from {upstream}",
    "git.unpushedCommits": "{count} unpushed commit(s)",
    "git.incomingCommits": "{count} incoming commit(s)",
    "git.deleteUntrackedConfirm": "Delete untracked file {name}?",
    "git.discardFileConfirm": "Discard changes in {name}? This cannot be undone.",
    "git.discardAllConfirm": "Discard all unstaged changes in {count} files? This cannot be undone.",

    // Skill Picker
    "skillPicker.newSkill": "New skill",
    "skillPicker.noMatching": "No matching commands or skills",
    "skillPicker.noCommands": "No commands yet",
    "skillPicker.ariaLabel": "Commands and skills",
    "skillPicker.starterDesc": "Writes a starter SKILL.md you can edit.",
    "skillPicker.namePlaceholder": "skill-name",
    "skillPicker.nameLabel": "Skill name",
    "skillPicker.projectScope": "Project",
    "skillPicker.personalScope": "Personal",
    "skillPicker.nameValidationHint": "Use lowercase letters, numbers, and hyphens.",
    "skillPicker.creating": "Creating…",
    "skillPicker.create": "Create",
    "skillPicker.personal": "personal",
    "skillPicker.project": "project",

    // Remove Project
    "removeProject.deleteNamed": "Delete {name}",
    "removeProject.title": "Delete “{name}”?",
    "removeProject.description": "All conversations for this project will be deleted. It also leaves the sidebar. The folder on disk stays put, and opening it again brings the project back empty.",
    "removeProject.sessionsRemoved": "{count} saved conversation(s) will be removed.",

    // Inbox
    "inbox.title": "Inbox",
    "inbox.filterInbox": "Filter inbox",
    "inbox.markAllRead": "Mark all as read",
    "inbox.refresh": "Refresh",
    "inbox.resizeList": "Resize inbox list",
    "inbox.assignedToMe": "Assigned to me",
    "inbox.status": "Status",
    "inbox.statusOpen": "Open",
    "inbox.statusDraft": "Draft",
    "inbox.statusClosed": "Closed",
    "inbox.statusMerged": "Merged",
    "inbox.time": "Time",
    "inbox.type": "Type",
    "inbox.projects": "Projects",
    "inbox.clearFilters": "Clear filters",
    "inbox.issues": "Issues",
    "inbox.pullRequests": "Pull requests",
    "inbox.allTime": "All time",
    "inbox.today": "Today",
    "inbox.last7Days": "Last 7 days",
    "inbox.last30Days": "Last 30 days",
    "inbox.noMatchingLinearIssues": "No matching Linear issues",
    "inbox.noMatchingGithubIssues": "No matching issues or pull requests",
    "inbox.noFilteredLinearIssues": "No Linear issues match these filters",
    "inbox.noFilteredGithubIssues": "No issues or pull requests match these filters",
    "inbox.noLinearIssues": "No Linear issues",
    "inbox.openProjectToFill": "Open a project to fill the inbox",
    "inbox.pullRequest": "Pull request",
    "inbox.issue": "Issue",
    "inbox.unassigned": "Unassigned",
    "inbox.updated": "Updated {time}",
    "inbox.sending": "Sending...",
    "inbox.sendToAgent": "Send to agent",
    "inbox.reviewOnGithub": "Review on GitHub",
    "inbox.openInLinear": "Open in Linear",
    "inbox.openOnGithub": "Open on GitHub",
    "inbox.summary": "Summary",
    "inbox.code": "Code",
    "inbox.sections": "Pull request sections",
    "inbox.selectIssueOrPr": "Select an issue or pull request",
    "inbox.noFileChanges": "No file changes",
    "inbox.noDescription": "No description",
    "inbox.chooseProject": "Choose project",
    "inbox.replyingTo": "Replying to {author}",
    "inbox.cancelReply": "Cancel reply",
    "inbox.writeReply": "Write a reply ({mod}↩)",
    "inbox.leaveComment": "Leave a comment ({mod}↩)",
    "inbox.posting": "Posting...",
    "inbox.reply": "Reply",
    "inbox.comment": "Comment",
    "inbox.loadingComments": "Loading comments",
    "inbox.resolved": "Resolved",
    "inbox.patchTooLarge": "Patch unavailable because this pull request is too large",
    "inbox.noTextualDiff": "No textual diff",

    // Menu Bar
    "menuBar.file": "File",
    "menuBar.view": "View",
    "menuBar.terminal": "Terminal",
    "menuBar.newTab": "New Tab",
    "menuBar.newTerminal": "New Terminal",
    "menuBar.newWindow": "New Window",
    "menuBar.openProject": "Open Project…",
    "menuBar.search": "Search…",
    "menuBar.goToFile": "Go to File…",
    "menuBar.findInFiles": "Find in Files…",
    "menuBar.closePane": "Close Pane",
    "menuBar.closeOtherTabs": "Close Other Tabs",
    "menuBar.checkForUpdates": "Check for Updates…",
    "menuBar.toggleSidebar": "Toggle Sidebar",
    "menuBar.inbox": "Inbox",
    "menuBar.notes": "Notes",
    "menuBar.toggleTerminal": "Toggle Terminal",
    "menuBar.switchModel": "Switch Model…",
    "menuBar.toggleChanges": "Toggle Changes",

    // Diff
    "diff.couldNotLoadChanges": "Couldn’t load changes",
    "diff.singleFile": "1 file",
    "diff.fileCount": "{count} files",
    "diff.expandAll": "Expand all files",
    "diff.collapseAll": "Collapse all files",
    "diff.tooLarge": "Diff is too large to display in full. File list is shown without patches.",
    "diff.discardFile": "Discard file",
    "diff.stageFile": "Stage file",
    "diff.expandUpward": "Expand upward",
    "diff.expandUpwardLabel": "Expand unmodified lines upward",
    "diff.expandDownward": "Expand downward",
    "diff.expandDownwardLabel": "Expand unmodified lines downward",
    "diff.unmodifiedLines": "{count} unmodified line(s)",
    "diff.stageHunk": "Stage hunk",
    "diff.commentOnLine": "Comment on line {line}",
    "diff.commentOnLocation": "Comment on {location}",
    "diff.cancelComment": "Cancel comment",
    "diff.leaveComment": "Leave a comment…",
    "diff.shortcutToAdd": "{shortcut} to add",
    "diff.addToChat": "Add to chat",
    "diff.stagedNoUnstaged": "Staged — no unstaged changes",
    "diff.noUnstaged": "No unstaged changes",
    "diff.tooLargeDisplay": "Diff is too large to display",

    // Tabs
    "tabs.changes": "Changes",
    "tabs.workingTreeChanges": "Working tree changes",
    "tabs.sessionChanges": "Session Changes",
    "tabs.sessionChangesDesc": "Changes captured for this session only",
    "tabs.workingTreeSuffix": " (Working Tree)",
    "tabs.dragToReorder": "Drag to reorder pane",
    "tabs.unsavedChanges": "Unsaved changes",
    "tabs.closeTab": "Close Tab",
    "tabs.closeNamed": "Close {name}",
    "tabs.scrollLeft": "Scroll tabs left",
    "tabs.scrollRight": "Scroll tabs right",
    "tabs.problems": "{count} problem(s)",

    // Editor
    "editor.jumpChanges": "Jump between changes",
    "editor.previousChange": "Previous change",
    "editor.nextChange": "Next change",
    "editor.saving": "Saving…",
    "editor.saved": "Saved",
    "editor.saveFailed": "Save failed: {message}",
    "editor.couldNotOpen": "Couldn’t open {name}",

    // Markdown
    "markdown.view": "Markdown view",
    "markdown.preview": "Preview",
    "markdown.source": "Source",

    // Binary
    "binary.opening": "Opening {name}…",
    "binary.couldNotOpen": "Couldn’t open {name}",
    "binary.notReadableImage": "not a readable image",
    "binary.zoomOut": "Zoom out",
    "binary.fitToWindow": "Fit to window",
    "binary.fit": "Fit",
    "binary.zoomIn": "Zoom in",
    "binary.retry": "Retry",
    "binary.reveal": "Reveal",
    "binary.copyPath": "Copy path",
    "binary.changed": "Binary file changed",

    // Transcript
    "transcript.selectedTextActions": "Selected text actions",
    "transcript.addToChat": "Add to chat",
    "transcript.copied": "Copied",
    "transcript.copyResponse": "Copy response",
    "transcript.savedToNotes": "Saved to Notes",
    "transcript.saveAsNote": "Save as note",
    "transcript.hideThinking": "Hide thinking",
    "transcript.showThinking": "Show thinking: {text}",
    "transcript.agentWorking": "Agent is working",
    "transcript.subagentRunning": "Subagent is running",
    "transcript.worked": "Worked",
    "transcript.workedFor": "Worked for {elapsed}",
    "transcript.working": "Working",
    "transcript.workingFor": "Working for {elapsed}",
    "transcript.subagentRunningFor": "Subagent running for {elapsed}",
    "transcript.waitingForApproval": "Waiting for approval",
    "transcript.preparingHandoff": "Preparing a handoff",
    "transcript.preparingHandoffTo": "Preparing a handoff to {to}",
    "transcript.continuedWith": "Continued with {label}",

    // Plan
    "plan.building": "Building…",
    "plan.built": "Built",
    "plan.build": "Build",
    "plan.openInPane": "Open in pane",
    "plan.openPlanInPane": "Open plan in pane",
    "plan.buildThisPlan": "Build this plan",

    // Tasks
    "tasks.progress": "Task progress",
    "tasks.title": "Tasks",
    "tasks.completed": "Completed",
    "tasks.inProgress": "In progress",
    "tasks.cancelled": "Cancelled",
    "tasks.pending": "Pending",

    // Second Opinion
    "secondOpinion.handoff": "Handoff",
    "secondOpinion.secondOpinion": "Second opinion",
    "secondOpinion.filesCount": "{count} file(s)",
    "secondOpinion.handoffTitle": "Handoff",
    "secondOpinion.handoffDisabled": "Install another provider to hand off",
    "secondOpinion.handoffDesc": "Hand this session to another agent to continue the work.",
    "secondOpinion.handoffMenuLabel": "Hand this session to another agent",
    "secondOpinion.buildAnotherModel": "Build with another model",
    "secondOpinion.buildDisabled": "No build providers are available",
    "secondOpinion.buildDesc": "Choose the model and provider that should build this plan.",
    "secondOpinion.buildMenuLabel": "Build this plan with another model or provider",
    "secondOpinion.title": "Second opinion",
    "secondOpinion.disabled": "Install another provider for a second opinion",
    "secondOpinion.desc": "Send this turn to another agent to review the work.",
    "secondOpinion.menuLabel": "Send this turn to another agent",
    "secondOpinion.removeHandoff": "Remove handoff",

    // Tab Group
    "tabGroup.actions": "Tab group actions",
    "tabGroup.name": "Group name",
    "tabGroup.changeLogo": "Change project logo",
    "tabGroup.addLogo": "Add project logo",
    "tabGroup.logo": "Project logo",
    "tabGroup.logoDesc": "Shown in tabs and composer",
    "tabGroup.logoDescEmpty": "Optional — replaces folder icon",
    "tabGroup.removeLogo": "Remove project logo",
    "tabGroup.mascot": "Mascot",
    "tabGroup.newTab": "New tab in group",
    "tabGroup.newWindow": "Move group to new window",
    "tabGroup.closeGroup": "Close group",
    "tabGroup.ungroup": "Ungroup",
    "tabGroup.deleteGroup": "Delete group",

    // Terminal
    "terminal.resize": "Resize terminal",
    "terminal.terminals": "Terminals",
    "terminal.newTerminalShortcut": "New Terminal ({shortcut})",
    "terminal.moveTerminal": "Move Terminal",
    "terminal.hideTerminalShortcut": "Hide Terminal ({shortcut})",
    "terminal.dockBottom": "Dock Bottom",
    "terminal.dockTop": "Dock Top",
    "terminal.dockLeft": "Dock Left",
    "terminal.dockRight": "Dock Right",

    // What's new / Release notes
    "whatsNew.title": "What's new",
    "whatsNew.unavailable": "Release notes for this version are not available in this build.",
    "releaseNotes.title": "Release notes",

    // Cwd Picker
    "cwdPicker.title": "Project picker",
    "cwdPicker.projectLabel": "Project {name}",

    // Rail
    "rail.openProject": "Open project",
    "rail.projectOptions": "Project options",
    "rail.uncommittedDiff": "{label} uncommitted",

    // Settings
    "settings.linear.title": "Linear",

    // Sidebar
    "sidebar.resizeSidebar": "Resize sidebar",
    "sidebar.update.updateTo": "Update to {version}",
    "sidebar.update.downloadingProgress": "Downloading {progress}%",
    "sidebar.update.downloading": "Downloading…",
    "sidebar.update.checking": "Checking…",
    "sidebar.update.checkForUpdates": "Check for updates",
    "sidebar.update.updatedTo": "Updated to {version}",
    "sidebar.update.dismissNotification": "Dismiss update notification",
    "sidebar.statusNeedApproval": "Need approval",
    "sidebar.statusWorking": "Working...",
    "sidebar.statusDone": "Done",

    // Session Review
    "sessionReview.undoAll": "Undo All",
    "sessionReview.keepAll": "Keep All",
    "sessionReview.review": "Review",
    "sessionReview.undoAllTitle": "Undo all session changes",
    "sessionReview.undoUnavailableRunning": "Undo is unavailable while another session is running in this project",
    "sessionReview.undoUnavailableExternal": "Undo is unavailable because a file changed outside this session",
    "sessionReview.keepAllTitle": "Keep all session changes",
    "sessionReview.reviewChanges": "Review changes",
    "sessionReview.sharedFile": "Shared file",
    "sessionReview.collapseFiles": "Collapse files",
    "sessionReview.expandFiles": "Expand files",
    "sessionReview.filesCount": "{count} Files",
    "sessionReview.loadError": "Couldn’t load session changes",
    "sessionReview.noChanges": "No session changes",

    // Composer
    "composer.dropFilesToAttach": "Drop files to attach",

    // Context Meter
    "contextMeter.title": "Context usage",
    "contextMeter.contextUsed": "Context used",
    "contextMeter.percentUsed": "{percent}% context used",
    "contextMeter.tokenCountWithWindow": "{used} / {window} tokens",
    "contextMeter.tokenCount": "{used} tokens",
    "contextMeter.waitRunning": "Wait for the current operation to finish",
    "contextMeter.compactContext": "Compact this conversation's context",
    "contextMeter.compactNow": "Compact now",
    "contextMeter.ariaLabel": "{headline}, {detail}. Open context actions",

    // File Tree
    "fileTree.cannotPasteIntoSelf": "Cannot paste a folder into itself.",
    "fileTree.nameInputAria": "Type file name. Press Enter to confirm or Escape to cancel.",
    "fileTree.nameEmpty": "A file or folder name must be provided.",
    "fileTree.nameSlash": "A file or folder name cannot start with a slash.",
    "fileTree.nameExists": "A file or folder {name} already exists at this location. Please choose a different name.",
    "fileTree.nameInvalid": "The name {name} is not valid as a file or folder name. Please choose a different name.",
    "fileTree.nameWhitespace": "Leading or trailing whitespace detected in file or folder name.",

    // Git
    "git.graph": "Graph",
    "git.collapseGraph": "Collapse graph",
    "git.expandGraph": "Expand graph",
    "git.noCommits": "No commits yet",
    "git.resizeGraph": "Resize graph",
    "git.loadCommitError": "Couldn’t load commit",
    "git.detachedAt": "detached {branch}",
    "git.branchLabel": "Branch {branch}",

    // Color Picker
    "colorPicker.customColor": "Custom color",
    "colorPicker.saturationAndBrightness": "Saturation and brightness",
    "colorPicker.hue": "Hue",
    "colorPicker.hexColor": "Hex color",

    // Usage & Terminal
    "usage.refresh": "Refresh usage",
    "terminal.runningTerminals": "Running terminals",

    // Surface Tabs
    "tabs.openFiles": "Open files",

    // TitleBar
    "titleBar.devBuild": "Development build",
    "titleBar.development": "Development",

    // Inbox
    "inbox.source": "Inbox source",
    "inbox.openInProvider": "Open in {provider}",
    "inbox.openItemInProvider": "Open {kind} {identifier} in {provider}",
    "inbox.removeItem": "Remove {kind} {identifier}",

    // File Mention
    "fileMention.noMatchingFilesOrNotes": "No matching files or notes",
    "fileMention.noMatchingFilesOrFolders": "No matching files or folders",
    "fileMention.noFilesOrNotes": "No files or notes found",
    "fileMention.noFilesOrFolders": "No files or folders found",
    "fileMention.filesAndNotes": "Files and notes",
    "fileMention.filesAndFolders": "Files and folders",

    // Transcript
    "transcript.loadEarlier": "Load earlier messages",

    // Plan
    "plan.noLongerInSession": "This plan is no longer in the session.",
    "plan.markdown": "Plan markdown",

    // Notes
    "notes.resizeList": "Resize notes list",
    "notes.sections": "Note sections",

    // Session
    "session.closePane": "Close Pane",
    "session.jumpToLatest": "Jump to latest",

    // FS
    "fs.openProject": "Open project",
    "fs.attachFiles": "Attach files",

    // Remaining audit items
    "search.results": "Search results",
    "git.couldNotPreparePr": "Could not prepare pull request content",
    "inbox.missingLinearIssue": "Missing Linear issue",
    "inbox.unknownInboxItem": "Unknown inbox item",
  },
  "zh-CN": {
    // Common
    "common.close": "关闭",
    "common.back": "返回",
    "common.save": "保存",
    "common.cancel": "取消",
    "common.delete": "删除",
    "common.archive": "归档",
    "common.restore": "恢复",
    "common.rename": "重命名",
    "common.pin": "置顶",
    "common.unpin": "取消置顶",
    "common.remove": "移除",
    "common.retry": "重试",
    "common.open": "打开",
    "common.search": "搜索",
    "common.settings": "设置",
    "common.loading": "加载中...",

    // Window controls
    "window.minimize": "最小化",
    "window.maximize": "最大化",
    "window.restore": "还原",
    "window.close": "关闭",

    // Project Rail
    "rail.search": "搜索",
    "rail.inbox": "收件箱",
    "rail.inboxNew": "收件箱，有新内容",
    "rail.notes": "便签",
    "rail.pinned": "已置顶",
    "rail.projects": "项目列表",
    "rail.noProjects": "暂无项目",
    "rail.settings": "设置",
    "rail.unpinProject": "取消置顶项目",
    "rail.pinProject": "置顶项目",
    "rail.revealFinder": "在访达中显示",
    "rail.revealExplorer": "在文件资源管理器中显示",
    "rail.revealFolder": "打开所在文件夹",

    // Sidebar
    "sidebar.workspace": "工作区",
    "sidebar.noProjectFolder": "未打开项目文件夹",
    "sidebar.tabSessions": "会话",
    "sidebar.tabInbox": "收件箱",
    "sidebar.tabFiles": "资源管理器",
    "sidebar.tabChanges": "更改",
    "sidebar.searchConversations": "搜索会话...",
    "sidebar.filterSessions": "过滤会话",
    "sidebar.newSession": "新建会话",
    "sidebar.goToFile": "转到文件",
    "sidebar.emptySessions": "开启的会话将显示在这里",
    "sidebar.noMatchingSessions": "未找到匹配的会话",
    "sidebar.noFilterSessions": "没有符合过滤条件的会话",
    "sidebar.loadError": "无法加载会话",
    "sidebar.ungroup": "取消分组",
    "sidebar.newFolder": "新建文件夹",
    "sidebar.addToFolder": "移动到 {folder}",
    "sidebar.removeFromFolder": "从文件夹中移出",
    "sidebar.unarchive": "取消归档",
    "sidebar.filters.archived": "已归档",
    "sidebar.filters.status": "状态",
    "sidebar.filters.working": "运行中",
    "sidebar.filters.needsApproval": "待审批",
    "sidebar.filters.done": "已完成",
    "sidebar.filters.time": "时间",
    "sidebar.filters.allTime": "所有时间",
    "sidebar.filters.today": "今天",
    "sidebar.filters.last7Days": "最近 7 天",
    "sidebar.filters.last30Days": "最近 30 天",
    "sidebar.filters.provider": "模型提供商",
    "sidebar.filters.clearFilters": "重置过滤条件",

    // Tabs
    "tabs.newSession": "新建会话",
    "tabs.sessionsCount": "{count} 个会话",
    "tabs.newTab": "新建标签页",
    "tabs.toggleSidebar": "切换侧边栏",
    "tabs.openSettings": "打开设置",
    "tabs.terminal": "终端",

    // Runtime mode
    "runtimeMode.title": "权限模式",
    "runtimeMode.supervised.label": "人工审批",
    "runtimeMode.supervised.hint": "执行命令和修改文件前均需人工确认。",
    "runtimeMode.autoAcceptEdits.label": "自动接受编辑",
    "runtimeMode.autoAcceptEdits.hint": "自动接受代码编辑，命令执行仍需人工审批。",
    "runtimeMode.auto.label": "智能自动",
    "runtimeMode.auto.hint": "常规操作自动执行，高风险命令或复杂编辑需人工审批。",
    "runtimeMode.fullAccess.label": "完全信任",
    "runtimeMode.fullAccess.hint": "命令与代码编辑直接运行，无需审批弹窗。",

    // Settings
    "settings.title": "设置",
    "settings.restoreDefaults": "恢复默认设置",
    "settings.section.general.label": "通用",
    "settings.section.general.description": "全局应用行为与当前版本。",
    "settings.section.appearance.label": "外观",
    "settings.section.appearance.description":
      "主题、毛玻璃透明度与界面色调。",
    "settings.section.keybindings.label": "快捷键",
    "settings.section.keybindings.description":
      "工作区处理的所有快捷键，包含应用菜单和键盘处理器。",
    "settings.section.providers.label": "模型提供商",
    "settings.section.providers.description":
      "MonoCode 支持调度的 Agent CLI，以及新会话默认使用的模型。",
    "settings.section.archive.label": "归档",
    "settings.section.archive.description": "您归档的项目和会话记录。",

    // Settings: General
    "settings.general.language": "界面语言",
    "settings.general.languageDescription":
      "选择 MonoCode 用户界面的显示语言。",
    "settings.general.transcriptLayout": "对话排版布局",
    "settings.general.transcriptLayoutDesc":
      "全宽模式下提示词将以宽卡片呈现；聊天模式下右对齐并限制最大宽度，类似即时通讯软件。",
    "settings.general.fullWidth": "全宽卡片",
    "settings.general.chat": "气泡聊天",
    "settings.general.diffView": "代码差异视图",
    "settings.general.diffViewDesc":
      "行内编辑器直接在文件中展示变更；统一对比视图将所有变更文件集中一处，带有固定标题栏并折叠未更改行。",
    "settings.general.editor": "行内编辑器",
    "settings.general.unified": "统一对比",
    "settings.general.followUpBehavior": "追问行为",
    "settings.general.followUpBehaviorDesc":
      "追问是在当前回复执行完毕后排队发送，还是立即干预正在运行的轮次。",
    "settings.general.queue": "排队等候",
    "settings.general.steer": "立即干预",
    "settings.general.anchorPrompts": "提示词置顶固定",
    "settings.general.anchorPromptsDesc":
      "发送后，新提示词固定在对话流顶部，回复在下方展开。关闭此项可恢复传统布局，最新消息靠紧底部输入框。",
    "settings.general.composerMascot": "输入框吉祥物动画",
    "settings.general.composerMascotDesc":
      "运行生成时，项目吉祥物会在输入框边缘奔跑跳跃。",
    "settings.general.emptySessionGames": "空会话彩蛋小游戏",
    "settings.general.emptySessionGamesDesc":
      "空会话界面背景中的吃豆人和贪吃蛇游戏。关闭此项可保持背景完全静止。",
    "settings.general.notesUi": "便签功能",
    "settings.general.notesUiDesc": "在项目和会话旁保留随手便签。",
    "settings.general.liveAgents": "实时 Agent 状态卡片",
    "settings.general.liveAgentsDesc":
      "在侧边导轨中预览后台任务和活跃会话的运行状态。",
    "settings.general.soundEffects": "操作提示音效",
    "settings.general.soundEffectsDesc":
      "当模型轮次完成或需要人工审批时播放提示音。",
    "settings.general.claudeHooks": "Claude 钩子集成",
    "settings.general.claudeHooksDesc":
      "允许在会话生命周期中执行 Claude 钩子脚本。",
    "settings.general.version": "当前版本",
    "settings.general.upToDate": "MonoCode 已是最新版本",
    "settings.general.checkForUpdates": "检查更新",
    "settings.general.checkingForUpdates": "正在检查更新...",
    "settings.general.installUpdate": "安装更新并重启",
    "settings.general.whatsNew": "更新日志",

    // Settings: Appearance
    "settings.appearance.theme": "界面主题",
    "settings.appearance.themeDesc":
      "选择 MonoCode 的浅色或深色主题模式。",
    "settings.appearance.themeSystem": "跟随系统",
    "settings.appearance.themeDark": "深色模式",
    "settings.appearance.themeLight": "浅色模式",
    "settings.appearance.tint": "界面色调",
    "settings.appearance.tintDesc": "应用到窗口边框与高亮区域的细微色调。",
    "settings.appearance.sidebarOpacity": "侧边栏不透明度",
    "settings.appearance.sidebarOpacityDesc":
      "侧边栏和项目导轨透出桌面的透明程度。",
    "settings.appearance.sidebarBlur": "侧边栏毛玻璃模糊度",
    "settings.appearance.sidebarBlurDesc":
      "窗口背后的毛玻璃模糊度。较高数值需要更多合成资源。",
    "settings.appearance.translucency": "窗口背景毛玻璃半透明",
    "settings.appearance.hue": "色相",
    "settings.appearance.hueDesc": "强调色和界面色调的基础色相。",
    "settings.appearance.saturation": "饱和度",
    "settings.appearance.saturationDesc":
      "界面色调的浓淡程度。设为 0 保持纯黑白灰中性。",
    "settings.appearance.mainPaneGlass": "主面板毛玻璃半透明",
    "settings.appearance.mainPaneGlassDesc":
      "将半透明毛玻璃质感延伸到会话与编辑器所在的主工作区。",

    // Settings: Keybindings
    "settings.keybindings.filter": "搜索快捷键...",
    "settings.keybindings.command": "命令",
    "settings.keybindings.shortcut": "快捷键",
    "settings.keybindings.when": "触发时机",
    "settings.keybindings.bindingCount": "{count} 个快捷键",
    "settings.keybindings.noMatchingBindings": "未找到匹配的快捷键",
    "settings.keybindings.note":
      "快捷键来源于应用菜单和工作区快捷键处理器，暂不支持自定义。",

    // Settings: Providers
    "settings.providers.desc":
      "在 PATH 中找到对应 CLI 即视为已安装。未安装的 CLI 仍显示在此处，但不会出现在模型选择器中。关闭“在选择器中显示”可隐藏已安装的提供商。每个提供商旁的模型是选择该提供商时新会话默认使用的模型；“设为默认”则将该提供商作为全局默认。",
    "settings.providers.defaultBadge": "默认",
    "settings.providers.useByDefault": "设为默认",
    "settings.providers.modelsAvailable": "{count} 个模型可用。",
    "settings.providers.showInPicker": "在选择器中显示",

    // Settings: Archive
    "settings.archive.projects": "已归档项目",
    "settings.archive.projectsDesc":
      "从导轨归档项目可保留其对话记录，且不在侧边栏显示。",
    "settings.archive.showArchivedInSidebar": "在侧边栏中显示归档内容",
    "settings.archive.showArchivedInSidebarDesc":
      "在侧边栏中将归档会话与活跃会话一同列出。",
    "settings.archive.sessions": "已归档会话",
    "settings.archive.archivedInProject": "已归档于 {project}",
    "settings.archive.openProjectHint": "打开项目以查看其已归档会话。",
    "settings.archive.noArchivedInProject": "此项目中没有已归档会话。",
    "settings.archive.noProjects": "暂无已归档项目",
    "settings.archive.noSessions": "暂无已归档会话",
    "settings.archive.restore": "恢复",
    "settings.archive.unarchive": "取消归档",
    "settings.archive.delete": "永久删除",

    // Settings: Linear
    "settings.linear.apiKey": "API 密钥",
    "settings.linear.apiKeyDesc":
      "在 Linear → Settings → Security & Access 中创建个人 API 密钥。断开连接将删除密钥。",
    "settings.linear.disconnect": "断开连接",
    "settings.linear.connect": "连接",
    "settings.linear.saving": "保存中",
    "settings.linear.teams": "Linear 团队",
    "settings.linear.teamsDesc": "未勾选的团队任务不会出现在收件箱中。",

    // Settings: Update
    "settings.update.versionAvailable": "新版本 {version} 可用。",
    "settings.update.downloading": "正在下载{progress}",
    "settings.update.checking": "正在检查更新…",
    "settings.update.latest": "已是最新版本。",
    "settings.update.feedDesc": "MonoCode 会通过发布源自动获取更新。",
    "settings.update.download": "下载更新",

    // Composer
    "composer.placeholderShell": "今天有什么我可以协助您的？",
    "composer.placeholderNormal":
      "提问、构建、输入 / 执行命令、@ 引用文件... ",
    "composer.placeholderInbox": "添加备注，或直接发送以开始…",
    "composer.placeholderNote": "输入消息，或直接发送…",
    "composer.placeholderHandoff": "补充上下文，或直接发送以继续…",
    "composer.send": "发送消息",
    "composer.stop": "停止生成",
    "composer.addFilesOrMode": "添加文件或选择模式",

    // Git
    "git.changes": "更改",
    "git.stagedChanges": "已暂存的更改",
    "git.stageAll": "全部暂存",
    "git.unstageAll": "全部取消暂存",
    "git.discardAll": "放弃所有更改",
    "git.stageAllChanges": "全部暂存",
    "git.unstageAllChanges": "全部取消暂存",
    "git.discardAllChanges": "放弃所有更改",
    "git.commit": "提交",
    "git.commitMessage": "提交信息",
    "git.commitShortcutHint": "提交信息（{shortcut} 提交）",
    "git.generateMessage": "智能生成提交信息",
    "git.commitOptions": "提交选项",
    "git.commitAndPush": "提交并推送",
    "git.commitPushPr": "提交、推送并创建 PR",
    "git.noUncommitted": "没有未提交的更改",
    "git.loadingChanges": "正在加载更改…",
    "git.sync": "同步",
    "git.publish": "发布分支",
    "git.publishBranch": "发布分支",
    "git.synchronizing": "正在同步更改...",
    "git.createPr": "创建拉取请求 (PR)",
    "git.viewPr": "查看拉取请求 (PR)",
    "git.uncommittedChanges": "存在未提交的更改",
    "git.overwriteWarningCreate":
      "创建分支“{branch}”将覆盖您的本地更改。您可以先贮藏（Stash）稍后恢复，或先在此分支提交更改。",
    "git.overwriteWarningSwitch":
      "切换到分支“{branch}”将覆盖您的本地更改。您可以先贮藏（Stash）稍后恢复，或先在此分支提交更改。",
    "git.commitAndSwitch": "提交并切换",
    "git.stashAndSwitch": "贮藏并切换",
    "git.noRepo": "无 Git 仓库",
    "git.noGitRepo": "非 Git 仓库",
    "git.loadingBranch": "正在加载分支…",
    "git.branchPicker": "分支选择器",
    "git.searchOrCreateBranch": "搜索或创建分支...",
    "git.noMatchingBranches": "未找到匹配的分支",
    "git.noBranches": "暂无分支",
    "git.branches": "分支列表",
    "git.createAndCheckout": "创建并检出 {name}",
    "git.hideChanges": "隐藏更改",
    "git.showChanges": "显示更改",
    "git.filesChanged": "{files} 个文件发生更改",
    "git.createBranch": "创建分支 {branch}",
    "git.switchBranch": "切换到分支 {branch}",

    // Explorer
    "explorer.newFile": "新建文件",
    "explorer.newFolder": "新建文件夹",
    "explorer.collapseAll": "折叠全部",
    "explorer.searchInFiles": "在文件中搜索",
    "explorer.cut": "剪切",
    "explorer.copy": "复制",
    "explorer.paste": "粘贴",
    "explorer.duplicate": "创建副本",
    "explorer.copyPath": "复制完整路径",
    "explorer.copyRelativePath": "复制相对路径",
    "explorer.openInTerminal": "在终端中打开",

    // Empty Session
    "emptySession.workOnProject": "接下来要在 {project} 中做什么？",
    "emptySession.workOn": "接下来要做什么？",

    // Cwd Picker
    "cwdPicker.currentProject": "当前项目",
    "cwdPicker.recentProjects": "最近打开的项目",
    "cwdPicker.moreRecents": "更多最近项目",
    "cwdPicker.newTerminal": "在此打开终端",

    // Search
    "search.all": "全部",
    "search.conversations": "会话",
    "search.files": "文件",
    "search.projects": "项目",
    "search.searchEverything": "全局搜索...",
    "search.noResults": "未找到结果",
    "search.emptyPrompt": "查找文件、会话、消息和项目。",
    "search.backToFiles": "返回文件列表",
    "search.searchInFiles": "在文件中搜索",
    "search.matchCase": "区分大小写",
    "search.matchWholeWord": "全字匹配",
    "search.useRegex": "使用正则表达式",
    "search.filesToInclude": "包含的文件 (例: *.ts)",
    "search.filesToExclude": "排除的文件",
    "search.searching": "正在搜索…",
    "search.matchSummary": "在 {files} 个文件中找到 {matches} 处结果",
    "search.limited": " (达到上限)",
    "search.typeToSearch": "输入内容以在整个项目中搜索",

    // Notes
    "notes.title": "便签",
    "notes.newNote": "新建便签",
    "notes.searchNotes": "搜索便签...",
    "notes.filterNotes": "过滤便签...",
    "notes.noNotes": "暂无便签",
    "notes.noMatchingNotes": "未找到匹配的便签",
    "notes.noNotesDesc":
      "暂无便签。您可以从对话记录中保存轮次，或在此新建便签。",
    "notes.deleteNote": "删除便签",
    "notes.addToChat": "添加到对话",
    "notes.preview": "预览",
    "notes.source": "源码",
    "notes.noDescription": "暂无内容",
    "notes.writeMarkdown": "编写 Markdown…",
    "notes.untitled": "无标题便签",
    "notes.selectNote": "选择便签",
    "notes.singleNote": "便签",
    "notes.updatedAt": "更新于 {time}",

    // Approval
    "approval.question": "提问",
    "approval.approval": "待审批",
    "approval.allow": "允许",
    "approval.deny": "拒绝",

    // Questions
    "question.skip": "跳过",
    "question.continue": "继续",
    "question.stepProgress": "第 {current} / {total} 题",
    "question.selectAllThatApply": "可多选",
    "question.typeYourAnswer": "输入您的回答",
    "question.other": "其他",

    // File Picker
    "filePicker.title": "转到文件",
    "filePicker.openProjectHint": "打开项目以搜索文件",
    "filePicker.indexing": "正在建立文件索引…",
    "filePicker.noFiles": "未找到文件",
    "filePicker.noMatching": "未找到匹配的文件",
    "filePicker.typeToSearch": "输入文件名进行搜索",

    // Model Picker
    "modelPicker.title": "模型选择器",
    "modelPicker.providers": "模型提供商",
    "modelPicker.searchModels": "搜索模型...",
    "modelPicker.favorites": "收藏",
    "modelPicker.noFavorites": "暂无收藏模型",
    "modelPicker.loadingCodex": "正在加载 Codex 模型…",
    "modelPicker.noMatchingModels": "未找到匹配的模型",
    "modelPicker.models": "模型列表",
    "modelPicker.favorite": "添加到收藏",
    "modelPicker.unfavorite": "从收藏中移除",

    // Composer
    "composer.queuePaused": "因用户中断，队列已暂停",
    "composer.resume": "继续",
    "composer.steer": "引导",
    "composer.editQueued": "编辑排队消息",
    "composer.saveQueued": "保存排队消息",
    "composer.cancelQueued": "取消编辑排队消息",
    "composer.removeQueued": "移除排队消息",
    "composer.attachmentCount": "{count} 个附件",
    "composer.attachmentsCount": "{count} 个附件",
    "composer.addToMessage": "添加到消息",
    "composer.uploadFile": "上传文件",
    "composer.uploadFileDesc": "为此消息附加文件或图片",
    "composer.uploadFileUnsupported": "{harness} 不支持附件",
    "composer.planMode": "计划模式",
    "composer.planModeDesc": "在构建前先制定计划以供审查",
    "composer.turnOffPlanMode": "关闭计划模式",
    "composer.plan": "计划",

    // Git
    "git.discardChanges": "放弃更改",
    "git.unstageChanges": "取消暂存更改",
    "git.stageChanges": "暂存更改",
    "git.syncingChanges": "正在同步更改...",
    "git.publishBranchNamed": '发布分支 "{branch}"',
    "git.pullPushCommits": "在 {remote} 之间拉取 {pull} 个并推送 {push} 个提交",
    "git.pullCommits": "从 {remote} 拉取 {count} 个提交",
    "git.pushCommits": "向 {remote} 推送 {count} 个提交",
    "git.createPrInto": "创建合并到 {branch} 的 Pull Request",
    "git.viewPrNamed": "查看 PR #{number}: {title}",
    "git.divergedFrom": "与 {upstream} 产生分叉",
    "git.unpushedCommits": "{count} 个未推送的提交",
    "git.incomingCommits": "{count} 个拉取提交",
    "git.deleteUntrackedConfirm": "确认删除未跟踪文件 {name}？",
    "git.discardFileConfirm": "确认放弃 {name} 的更改？此操作不可撤销。",
    "git.discardAllConfirm": "确认放弃 {count} 个文件中的所有未暂存更改？此操作不可撤销。",

    // Skill Picker
    "skillPicker.newSkill": "新建技能",
    "skillPicker.noMatching": "未找到匹配的命令或技能",
    "skillPicker.noCommands": "暂无命令",
    "skillPicker.ariaLabel": "命令和技能",
    "skillPicker.starterDesc": "生成初始 SKILL.md 模板供您编辑。",
    "skillPicker.namePlaceholder": "技能名称",
    "skillPicker.nameLabel": "技能名称",
    "skillPicker.projectScope": "项目级",
    "skillPicker.personalScope": "个人级",
    "skillPicker.nameValidationHint": "请使用小写字母、数字和连字符。",
    "skillPicker.creating": "创建中…",
    "skillPicker.create": "创建",
    "skillPicker.personal": "个人",
    "skillPicker.project": "项目",

    // Remove Project
    "removeProject.deleteNamed": "删除 {name}",
    "removeProject.title": "删除“{name}”？",
    "removeProject.description": "该项目的所有对话都将被删除，同时移出侧边栏。磁盘上的文件夹将保留，重新打开时会作为空项目。",
    "removeProject.sessionsRemoved": "将移除 {count} 个已保存的对话。",

    // Inbox
    "inbox.title": "收件箱",
    "inbox.filterInbox": "筛选收件箱",
    "inbox.markAllRead": "全部标记为已读",
    "inbox.refresh": "刷新",
    "inbox.resizeList": "调整收件箱列表大小",
    "inbox.assignedToMe": "指派给我",
    "inbox.status": "状态",
    "inbox.statusOpen": "开启",
    "inbox.statusDraft": "草稿",
    "inbox.statusClosed": "已关闭",
    "inbox.statusMerged": "已合并",
    "inbox.time": "时间",
    "inbox.type": "类型",
    "inbox.projects": "项目",
    "inbox.clearFilters": "清除筛选",
    "inbox.issues": "Issues",
    "inbox.pullRequests": "Pull Requests",
    "inbox.allTime": "全部时间",
    "inbox.today": "今天",
    "inbox.last7Days": "最近 7 天",
    "inbox.last30Days": "最近 30 天",
    "inbox.noMatchingLinearIssues": "未找到匹配的 Linear issue",
    "inbox.noMatchingGithubIssues": "未找到匹配的 issue 或 pull request",
    "inbox.noFilteredLinearIssues": "没有符合这些筛选条件的 Linear issue",
    "inbox.noFilteredGithubIssues": "没有符合这些筛选条件的 issue 或 pull request",
    "inbox.noLinearIssues": "暂无 Linear issue",
    "inbox.openProjectToFill": "打开项目以填充收件箱",
    "inbox.pullRequest": "Pull Request",
    "inbox.issue": "Issue",
    "inbox.unassigned": "未指派",
    "inbox.updated": "更新于 {time}",
    "inbox.sending": "发送中...",
    "inbox.sendToAgent": "发送给 Agent",
    "inbox.reviewOnGithub": "在 GitHub 上审查",
    "inbox.openInLinear": "在 Linear 中打开",
    "inbox.openOnGithub": "在 GitHub 上打开",
    "inbox.summary": "摘要",
    "inbox.code": "代码",
    "inbox.sections": "Pull Request 部分",
    "inbox.selectIssueOrPr": "选择一个 issue 或 pull request",
    "inbox.noFileChanges": "暂无文件变更",
    "inbox.noDescription": "无描述",
    "inbox.chooseProject": "选择项目",
    "inbox.replyingTo": "回复 {author}",
    "inbox.cancelReply": "取消回复",
    "inbox.writeReply": "编写回复 ({mod}↩)",
    "inbox.leaveComment": "发表评论 ({mod}↩)",
    "inbox.posting": "发表中...",
    "inbox.reply": "回复",
    "inbox.comment": "评论",
    "inbox.loadingComments": "正在加载评论",
    "inbox.resolved": "已解决",
    "inbox.patchTooLarge": "由于此 Pull Request 过大，无法显示补丁",
    "inbox.noTextualDiff": "无文本差异",

    // Menu Bar
    "menuBar.file": "文件",
    "menuBar.view": "视图",
    "menuBar.terminal": "终端",
    "menuBar.newTab": "新建标签页",
    "menuBar.newTerminal": "新建终端",
    "menuBar.newWindow": "新建窗口",
    "menuBar.openProject": "打开项目…",
    "menuBar.search": "搜索…",
    "menuBar.goToFile": "转到文件…",
    "menuBar.findInFiles": "在文件中查找…",
    "menuBar.closePane": "关闭窗格",
    "menuBar.closeOtherTabs": "关闭其他标签页",
    "menuBar.checkForUpdates": "检查更新…",
    "menuBar.toggleSidebar": "切换侧边栏",
    "menuBar.inbox": "收件箱",
    "menuBar.notes": "便签",
    "menuBar.toggleTerminal": "切换终端",
    "menuBar.switchModel": "切换模型…",
    "menuBar.toggleChanges": "切换代码更改",

    // Diff
    "diff.couldNotLoadChanges": "无法加载代码更改",
    "diff.singleFile": "1 个文件",
    "diff.fileCount": "{count} 个文件",
    "diff.expandAll": "展开所有文件",
    "diff.collapseAll": "折叠所有文件",
    "diff.tooLarge": "差异过大，无法完整显示。仅显示文件列表，不包含补丁。",
    "diff.discardFile": "放弃文件更改",
    "diff.stageFile": "暂存文件",
    "diff.expandUpward": "向上展开",
    "diff.expandUpwardLabel": "向上展开未修改行",
    "diff.expandDownward": "向下展开",
    "diff.expandDownwardLabel": "向下展开未修改行",
    "diff.unmodifiedLines": "{count} 行未修改的内容",
    "diff.stageHunk": "暂存此代码块",
    "diff.commentOnLine": "在第 {line} 行添加评论",
    "diff.commentOnLocation": "在 {location} 添加评论",
    "diff.cancelComment": "取消评论",
    "diff.leaveComment": "添加评论…",
    "diff.shortcutToAdd": "按 {shortcut} 添加",
    "diff.addToChat": "添加到对话",
    "diff.stagedNoUnstaged": "已暂存 — 暂无未暂存的更改",
    "diff.noUnstaged": "暂无未暂存的更改",
    "diff.tooLargeDisplay": "差异过大，无法显示",

    // Tabs
    "tabs.changes": "代码更改",
    "tabs.workingTreeChanges": "工作区代码更改",
    "tabs.sessionChanges": "本轮更改",
    "tabs.sessionChangesDesc": "仅包含当前会话捕获的代码更改",
    "tabs.workingTreeSuffix": " (工作区)",
    "tabs.dragToReorder": "拖动以重排窗格",
    "tabs.unsavedChanges": "未保存的更改",
    "tabs.closeTab": "关闭标签页",
    "tabs.closeNamed": "关闭 {name}",
    "tabs.scrollLeft": "向左滚动标签页",
    "tabs.scrollRight": "向右滚动标签页",
    "tabs.problems": "{count} 个问题",

    // Editor
    "editor.jumpChanges": "在更改间跳转",
    "editor.previousChange": "上一个更改",
    "editor.nextChange": "下一个更改",
    "editor.saving": "保存中…",
    "editor.saved": "已保存",
    "editor.saveFailed": "保存失败: {message}",
    "editor.couldNotOpen": "无法打开 {name}",

    // Markdown
    "markdown.view": "Markdown 视图",
    "markdown.preview": "预览",
    "markdown.source": "源码",

    // Binary
    "binary.opening": "正在打开 {name}…",
    "binary.couldNotOpen": "无法打开 {name}",
    "binary.notReadableImage": "不是可读取的图片",
    "binary.zoomOut": "缩小",
    "binary.fitToWindow": "适应窗口",
    "binary.fit": "适应",
    "binary.zoomIn": "放大",
    "binary.retry": "重试",
    "binary.reveal": "显示文件",
    "binary.copyPath": "复制路径",
    "binary.changed": "二进制文件已更改",

    // Transcript
    "transcript.selectedTextActions": "选中文本操作",
    "transcript.addToChat": "添加到对话",
    "transcript.copied": "已复制",
    "transcript.copyResponse": "复制回复",
    "transcript.savedToNotes": "已保存至便签",
    "transcript.saveAsNote": "保存为便签",
    "transcript.hideThinking": "隐藏思考过程",
    "transcript.showThinking": "展开思考过程",
    "transcript.agentWorking": "Agent 正在工作",
    "transcript.subagentRunning": "子 Agent 正在运行",
    "transcript.worked": "已完成",
    "transcript.workedFor": "已运行 {elapsed}",
    "transcript.working": "正在运行",
    "transcript.workingFor": "正在运行 {elapsed}",
    "transcript.subagentRunningFor": "子 Agent 正在运行 {elapsed}",
    "transcript.waitingForApproval": "等待审批",
    "transcript.preparingHandoff": "正在准备转交",
    "transcript.preparingHandoffTo": "正在准备转交给 {to}",
    "transcript.continuedWith": "已由 {label} 继续执行",

    // Plan
    "plan.building": "构建中…",
    "plan.built": "已构建",
    "plan.build": "构建",
    "plan.openInPane": "在窗格中打开",
    "plan.openPlanInPane": "在窗格中打开计划",
    "plan.buildThisPlan": "构建此计划",

    // Tasks
    "tasks.progress": "任务进度",
    "tasks.title": "任务列表",
    "tasks.completed": "已完成",
    "tasks.inProgress": "进行中",
    "tasks.cancelled": "已取消",
    "tasks.pending": "待处理",

    // Second Opinion
    "secondOpinion.handoff": "接力交接",
    "secondOpinion.secondOpinion": "第二意见",
    "secondOpinion.filesCount": "{count} 个文件",
    "secondOpinion.handoffTitle": "接力交接",
    "secondOpinion.handoffDisabled": "安装其他供应商以进行交接",
    "secondOpinion.handoffDesc": "将此会话交接给其他 Agent 继续工作。",
    "secondOpinion.handoffMenuLabel": "将此会话交接给其他 Agent",
    "secondOpinion.buildAnotherModel": "使用其他模型构建",
    "secondOpinion.buildDisabled": "没有可用的构建供应商",
    "secondOpinion.buildDesc": "选择用于构建此计划的模型和供应商。",
    "secondOpinion.buildMenuLabel": "使用其他模型或供应商构建此计划",
    "secondOpinion.title": "第二意见",
    "secondOpinion.disabled": "安装其他供应商以获取第二意见",
    "secondOpinion.desc": "将此轮对话发送给其他 Agent 进行审查。",
    "secondOpinion.menuLabel": "发送此轮对话给其他 Agent",
    "secondOpinion.removeHandoff": "移除交接",

    // Tab Group
    "tabGroup.actions": "标签页分组操作",
    "tabGroup.name": "分组名称",
    "tabGroup.changeLogo": "更改项目图标",
    "tabGroup.addLogo": "添加项目图标",
    "tabGroup.logo": "项目图标",
    "tabGroup.logoDesc": "显示在标签页和输入框中",
    "tabGroup.logoDescEmpty": "可选 — 替代文件夹图标",
    "tabGroup.removeLogo": "移除项目图标",
    "tabGroup.mascot": "吉祥物",
    "tabGroup.newTab": "在分组中新建标签页",
    "tabGroup.newWindow": "将分组移至新窗口",
    "tabGroup.closeGroup": "关闭分组",
    "tabGroup.ungroup": "取消分组",
    "tabGroup.deleteGroup": "删除分组",

    // Terminal
    "terminal.resize": "调整终端大小",
    "terminal.terminals": "终端列表",
    "terminal.newTerminalShortcut": "新建终端 ({shortcut})",
    "terminal.moveTerminal": "移动终端",
    "terminal.hideTerminalShortcut": "隐藏终端 ({shortcut})",
    "terminal.dockBottom": "底部停靠",
    "terminal.dockTop": "顶部停靠",
    "terminal.dockLeft": "左侧停靠",
    "terminal.dockRight": "右侧停靠",

    // What's New & Release Notes
    "whatsNew.title": "更新日志",
    "whatsNew.unavailable": "此版本的发行说明在当前构建中不可用。",
    "releaseNotes.title": "发行说明",

    // Cwd Picker
    "cwdPicker.title": "选择项目",
    "cwdPicker.projectLabel": "项目 {name}",

    // Rail
    "rail.openProject": "打开项目",
    "rail.projectOptions": "项目选项",
    "rail.uncommittedDiff": "{label} 未提交的更改",

    // Settings
    "settings.linear.title": "Linear",

    // Sidebar
    "sidebar.resizeSidebar": "调整侧边栏大小",
    "sidebar.update.updateTo": "更新至 {version}",
    "sidebar.update.downloadingProgress": "下载中 {progress}%",
    "sidebar.update.downloading": "下载中…",
    "sidebar.update.checking": "检查更新中…",
    "sidebar.update.checkForUpdates": "检查更新",
    "sidebar.update.updatedTo": "已更新至 {version}",
    "sidebar.update.dismissNotification": "忽略更新通知",
    "sidebar.statusNeedApproval": "需要批准",
    "sidebar.statusWorking": "运行中…",
    "sidebar.statusDone": "已完成",

    // Session Review
    "sessionReview.undoAll": "全部撤销",
    "sessionReview.keepAll": "全部保留",
    "sessionReview.review": "审查",
    "sessionReview.undoAllTitle": "撤销本次会话的所有更改",
    "sessionReview.undoUnavailableRunning": "当前项目有其他会话正在运行时无法撤销",
    "sessionReview.undoUnavailableExternal": "由于文件在会话外部被修改，无法撤销",
    "sessionReview.keepAllTitle": "保留本次会话的所有更改",
    "sessionReview.reviewChanges": "审查更改",
    "sessionReview.sharedFile": "共享文件",
    "sessionReview.collapseFiles": "折叠文件列表",
    "sessionReview.expandFiles": "展开文件列表",
    "sessionReview.filesCount": "{count} 个文件",
    "sessionReview.loadError": "无法加载会话更改",
    "sessionReview.noChanges": "本次会话没有更改",

    // Composer
    "composer.dropFilesToAttach": "拖放文件以添加附件",

    // Context Meter
    "contextMeter.title": "上下文用量",
    "contextMeter.contextUsed": "已用上下文",
    "contextMeter.percentUsed": "已使用 {percent}% 上下文",
    "contextMeter.tokenCountWithWindow": "{used} / {window} Token",
    "contextMeter.tokenCount": "{used} Token",
    "contextMeter.waitRunning": "等待当前操作完成",
    "contextMeter.compactContext": "压缩此会话的上下文",
    "contextMeter.compactNow": "立即压缩",
    "contextMeter.ariaLabel": "{headline}，{detail}。打开上下文操作",

    // File Tree
    "fileTree.cannotPasteIntoSelf": "无法将文件夹粘贴到自身内部。",
    "fileTree.nameInputAria": "输入文件名。按 Enter 确认或 Escape 取消。",
    "fileTree.nameEmpty": "必须提供文件或文件夹名称。",
    "fileTree.nameSlash": "文件或文件夹名称不能以斜杠开头。",
    "fileTree.nameExists": "此位置已存在文件或文件夹 {name}。请选择其他名称。",
    "fileTree.nameInvalid": "名称 {name} 无效，不能用作文件或文件夹名称。请选择其他名称。",
    "fileTree.nameWhitespace": "文件或文件夹名称开头或结尾检测到空格。",

    // Git
    "git.graph": "提交图",
    "git.collapseGraph": "折叠提交图",
    "git.expandGraph": "展开提交图",
    "git.noCommits": "暂无提交",
    "git.resizeGraph": "调整提交图大小",
    "git.loadCommitError": "无法加载提交",
    "git.detachedAt": "游离在 {branch}",
    "git.branchLabel": "分支 {branch}",

    // Color Picker
    "colorPicker.customColor": "自定义颜色",
    "colorPicker.saturationAndBrightness": "饱和度与亮度",
    "colorPicker.hue": "色相",
    "colorPicker.hexColor": "十六进制颜色值",

    // Usage & Terminal
    "usage.refresh": "刷新用量",
    "terminal.runningTerminals": "运行中的终端",

    // Surface Tabs
    "tabs.openFiles": "打开的文件",

    // TitleBar
    "titleBar.devBuild": "开发版本",
    "titleBar.development": "开发版",

    // Inbox
    "inbox.source": "收件箱来源",
    "inbox.openInProvider": "在 {provider} 中打开",
    "inbox.openItemInProvider": "在 {provider} 中打开{kind} {identifier}",
    "inbox.removeItem": "移除{kind} {identifier}",

    // File Mention
    "fileMention.noMatchingFilesOrNotes": "未找到匹配的文件或便签",
    "fileMention.noMatchingFilesOrFolders": "未找到匹配的文件或文件夹",
    "fileMention.noFilesOrNotes": "暂无文件或便签",
    "fileMention.noFilesOrFolders": "暂无文件或文件夹",
    "fileMention.filesAndNotes": "文件与便签",
    "fileMention.filesAndFolders": "文件与文件夹",

    // Transcript
    "transcript.loadEarlier": "加载更早的消息",

    // Plan
    "plan.noLongerInSession": "此计划已不在当前会话中。",
    "plan.markdown": "计划 Markdown",

    // Notes
    "notes.resizeList": "调整便签列表大小",
    "notes.sections": "便签区块",

    // Session
    "session.closePane": "关闭窗格",
    "session.jumpToLatest": "跳转至最新",

    // FS
    "fs.openProject": "打开项目",
    "fs.attachFiles": "添加附件",

    // Remaining audit items
    "search.results": "搜索结果",
    "git.couldNotPreparePr": "无法准备拉取请求内容",
    "inbox.missingLinearIssue": "缺少 Linear 议题",
    "inbox.unknownInboxItem": "未知的收件箱项目",
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;

export function t(
  key: TranslationKey | string,
  params?: Record<string, string | number>,
  languageOverride?: Language,
): string {
  const lang = languageOverride ?? loadLanguage();
  const dict = TRANSLATIONS[lang] as Record<string, string> | undefined;
  const enDict = TRANSLATIONS.en as Record<string, string>;

  let text = dict?.[key] ?? enDict[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return text;
}

export function useI18n() {
  const language = useLanguage();
  const translate = (
    key: TranslationKey | string,
    params?: Record<string, string | number>,
  ) => t(key, params, language);

  return {
    t: translate,
    language,
    setLanguage: saveLanguage,
  };
}
