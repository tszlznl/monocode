import { ChevronRight } from "./icons";
import { useI18n } from "../lib/i18n";
import { HARNESS_TITLE, type SecondOpinionMeta } from "../lib/session";
import { HarnessIcon } from "./HarnessIcon";

type Props = {
  card: SecondOpinionMeta;
};

export function SecondOpinionCard({ card }: Props) {
  const { t } = useI18n();
  const files =
    card.files != null && card.files > 0
      ? t("secondOpinion.filesCount", { count: card.files })
      : null;

  return (
    <div className="min-w-0 font-sans">
      <div className="text-[13px] font-medium leading-snug text-content">
        {card.kind === "handoff"
          ? t("secondOpinion.handoff")
          : t("secondOpinion.secondOpinion")}
      </div>
      <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] leading-4 text-content/50">
        <HarnessIcon harness={card.from} className="size-3 shrink-0" />
        <span className="truncate">{HARNESS_TITLE[card.from]}</span>
        <ChevronRight
          className="size-3 shrink-0 text-content/35"
          strokeWidth={1.75}
        />
        <HarnessIcon harness={card.to} className="size-3 shrink-0" />
        <span className="truncate">{HARNESS_TITLE[card.to]}</span>
      </div>
      {files ? (
        <div className="mt-1 text-[11px] leading-4 text-content/45">
          {files}
        </div>
      ) : null}
    </div>
  );
}
