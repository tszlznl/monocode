import { Check, CircleDot, GitPullRequest } from "./icons";
import { type ReactNode } from "react";
import type { InboxKind } from "../lib/githubTasks";
import {
  DEFAULT_INBOX_FILTERS,
  hasActiveInboxFilters,
  type InboxFilters,
  type InboxSource,
  type InboxTimeFilter,
} from "../lib/inboxFilters";
import { Popover } from "./Popover";
import { ProjectLogoIcon } from "./ProjectLogoIcon";
import { useI18n } from "../lib/i18n";

export const INBOX_FILTER_MENU_WIDTH = 228;

type ProjectOption = {
  path: string;
  name: string;
  logoPath: string | null;
};

type Props = {
  x: number;
  y: number;
  projects: ProjectOption[];
  source: InboxSource;
  filters: InboxFilters;
  onChange: (filters: InboxFilters) => void;
  onClose: () => void;
};

export function InboxFiltersMenu({
  x,
  y,
  projects,
  source,
  filters,
  onChange,
  onClose,
}: Props) {
  const { t } = useI18n();

  const timeOptions: { id: InboxTimeFilter; label: string }[] = [
    { id: "all", label: t("inbox.allTime") },
    { id: "today", label: t("inbox.today") },
    { id: "7d", label: t("inbox.last7Days") },
    { id: "30d", label: t("inbox.last30Days") },
  ];

  const kindOptions: {
    id: InboxKind;
    label: string;
    icon: ReactNode;
  }[] = [
    {
      id: "issue",
      label: t("inbox.issues"),
      icon: <CircleDot className="size-3.5 shrink-0" strokeWidth={1.75} />,
    },
    {
      id: "pr",
      label: t("inbox.pullRequests"),
      icon: <GitPullRequest className="size-3.5 shrink-0" strokeWidth={1.75} />,
    },
  ];

  const hiddenProjects = new Set(filters.hiddenProjects);
  const hiddenKinds = new Set(filters.hiddenKinds);

  const toggleAssigned = () => {
    onChange({ ...filters, assignedToMe: !filters.assignedToMe });
  };

  const toggleKind = (kind: InboxKind) => {
    const next = new Set(hiddenKinds);
    if (next.has(kind)) next.delete(kind);
    else next.add(kind);
    onChange({ ...filters, hiddenKinds: [...next] });
  };

  const toggleProject = (path: string) => {
    const next = new Set(hiddenProjects);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    onChange({ ...filters, hiddenProjects: [...next] });
  };

  const setTime = (time: InboxTimeFilter) => {
    onChange({ ...filters, time });
  };

  const toggleStatus = (key: keyof InboxFilters["status"]) => {
    onChange({
      ...filters,
      status: { ...filters.status, [key]: !filters.status[key] },
    });
  };

  return (
    <Popover
      anchor={{ x, y }}
      gap={0}
      width={INBOX_FILTER_MENU_WIDTH}
      maxHeight={480}
      onDismiss={onClose}
      role="menu"
      aria-label={t("inbox.filterInbox")}
      onContextMenu={(event) => event.preventDefault()}
      className="overflow-y-auto overscroll-none p-1"
    >
      <FilterItem
        label={t("inbox.assignedToMe")}
        checked={filters.assignedToMe}
        onClick={toggleAssigned}
      />

      <SectionLabel>{t("inbox.status")}</SectionLabel>
      <FilterItem
        label={t("inbox.statusOpen")}
        checked={filters.status.open}
        onClick={() => toggleStatus("open")}
      />
      {source === "github" ? (
        <FilterItem
          label={t("inbox.statusDraft")}
          checked={filters.status.draft}
          onClick={() => toggleStatus("draft")}
        />
      ) : null}
      <FilterItem
        label={t("inbox.statusClosed")}
        checked={filters.status.closed}
        onClick={() => toggleStatus("closed")}
      />
      {source === "github" ? (
        <FilterItem
          label={t("inbox.statusMerged")}
          checked={filters.status.merged}
          onClick={() => toggleStatus("merged")}
        />
      ) : null}

      <SectionLabel>{t("inbox.time")}</SectionLabel>
      {timeOptions.map((option) => (
        <FilterItem
          key={option.id}
          label={option.label}
          checked={filters.time === option.id}
          onClick={() => setTime(option.id)}
        />
      ))}

      {source === "github" ? (
        <>
          <SectionLabel>{t("inbox.type")}</SectionLabel>
          {kindOptions.map((option) => (
            <FilterItem
              key={option.id}
              label={option.label}
              checked={!hiddenKinds.has(option.id)}
              icon={option.icon}
              onClick={() => toggleKind(option.id)}
            />
          ))}
        </>
      ) : null}

      {source === "github" && projects.length > 0 ? (
        <>
          <SectionLabel>{t("inbox.projects")}</SectionLabel>
          {projects.map((project) => (
            <FilterItem
              key={project.path}
              label={project.name}
              checked={!hiddenProjects.has(project.path)}
              icon={
                project.logoPath ? (
                  <ProjectLogoIcon
                    path={project.logoPath}
                    className="size-3.5 shrink-0 rounded-sm"
                    imageClassName="size-3.5"
                  />
                ) : undefined
              }
              onClick={() => toggleProject(project.path)}
            />
          ))}
        </>
      ) : null}

      {hasActiveInboxFilters(filters, source) ? (
        <>
          <div role="separator" className="my-1 h-px bg-content/10" />
          <button
            type="button"
            role="menuitem"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onChange(DEFAULT_INBOX_FILTERS)}
            className="flex h-7 w-full items-center rounded-lg px-2 text-left text-[13px] leading-none text-content/70 hover:bg-content/5 hover:text-content"
          >
            {t("inbox.clearFilters")}
          </button>
        </>
      ) : null}
    </Popover>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="px-2 pb-0.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-content/40">
      {children}
    </div>
  );
}

function FilterItem({
  label,
  checked,
  icon,
  onClick,
}: {
  label: string;
  checked: boolean;
  icon?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="flex h-7 w-full items-center gap-2 rounded-lg px-2 text-left text-[13px] leading-none text-content hover:bg-content/5"
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {checked ? (
        <Check className="size-3.5 shrink-0" strokeWidth={2.25} />
      ) : null}
    </button>
  );
}
