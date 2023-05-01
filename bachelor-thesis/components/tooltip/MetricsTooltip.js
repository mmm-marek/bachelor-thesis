import classNames from "classnames";
import { useTranslation } from "next-i18next";

const MetricPair = ({ label, value, valueClassName }) => (
  <>
    <span className="flex items-center justify-center col-span-1 font-bold text-center text-white bg-theme-blue bold px-10px">
      {label}
    </span>
    <span
      className={classNames(
        "col-span-2 bg-white text-center text-award-table-head font-bold px-10px",
        valueClassName || ""
      )}
    >
      {value}
    </span>
  </>
);

export const MetricsTooltip = ({
  metricName,
  goldLimit,
  platinumLimit,
  diamondLimit,
  criterionType,
  metricDescription,
}) => {
  const { t } = useTranslation("evaluation");

  let compareType = criterionType === "increasing" ? ">" : "<";

  return (
    <div className="grid grid-cols-3 border-2 border-award-table-head max-w-362px text-16px font-titillium bold gap-2px bg-award-table-head">
      <MetricPair label={t("metric")} value={metricName} />
      <MetricPair label={t("description")} value={metricDescription} />
      <MetricPair label={t("gold")} value={`${compareType}${goldLimit}`} />
      <MetricPair label={t("platinum")} value={`${compareType}${platinumLimit}`} />
      <MetricPair label={t("diamond")} value={`${compareType}${diamondLimit}`} />
    </div>
  );
};
