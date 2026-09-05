import { useLockOverscroll } from "../hooks/useLockOverscroll";
import {
  releaseNotesMarkdown,
  type ReleaseNotesTabSource,
} from "../lib/releaseNotes";
import { AgentMarkdown } from "./AgentMarkdown";
import { useI18n } from "../lib/i18n";

export function ReleaseNotesSurface({
  source,
}: {
  source: ReleaseNotesTabSource;
}) {
  const { t } = useI18n();
  const lockOverscroll = useLockOverscroll<HTMLDivElement>();
  const markdown = releaseNotesMarkdown(source);

  return (
    <div
      ref={lockOverscroll}
      className="h-full overflow-y-auto overscroll-none"
    >
      <article
        aria-label={t("releaseNotes.title")}
        className="mx-auto w-full max-w-3xl px-8 py-10"
      >
        {markdown ? (
          <AgentMarkdown text={markdown} streaming={false} />
        ) : (
          <p className="text-[13px] text-content/60">
            {t("whatsNew.unavailable")}
          </p>
        )}
      </article>
    </div>
  );
}
