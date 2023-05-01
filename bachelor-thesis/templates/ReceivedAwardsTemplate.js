import { useMemo } from "react";
import { useQueryParams, BooleanParam, withDefault } from "use-query-params";
import { Text, Checkbox } from "@quality-registry/cruil";
import { useTranslation } from "next-i18next";
import BasicLayout from "@/layouts/BasicLayout";
import { EvaluationTable } from "@/components/tables/evaluation-table/EvaluationTable";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { Loading } from "@/components/loading/Loading";
import { EvaluationError } from "@/components/error-message/EvaluationError";

const ReceivedAwardsTemplate = ({ providerName, headerColumns, tableData, onRowClick, links, isLoading, isError }) => {
  const { t } = useTranslation("evaluation");

  const [filters, setFilters] = useQueryParams(
    {
      superseded: useDefaultBooleanParam(false),
      quarter: useDefaultBooleanParam(true),
      biannual: useDefaultBooleanParam(true),
      annual: useDefaultBooleanParam(true),
    },
    { removeDefaultsFromUrl: true }
  );

  const filteredTableData = useMemo(() => filterTableData(tableData, filters), [tableData, filters]);

  function filterTableData(tableData, filters) {
    if (!filters.quarter && !filters.biannual && !filters.annual) {
      return [];
    }

    let resultTableData = [];

    if (filters.superseded) {
      resultTableData = [...tableData];
    } else {
      resultTableData = tableData.filter((row) => row.proposal.superseededByProposal === null);
    }

    return resultTableData.filter((row) => {
      switch (row.timePeriodTypeName) {
        case "quarter":
          return filters.quarter;
        case "biannual":
          return filters.biannual;
        case "annual":
          return filters.annual;
        default:
          return false;
      }
    });
  }

  function isMarkedRow(row) {
    if (!row.original.proposal) {
      return false;
    }

    if (row.original.proposal?.superseededByProposal !== null) {
      return true;
    }
    return false;
  }

  if (isLoading) {
    return (
      <BasicLayout>
        <Loading text={t("loading")} />
      </BasicLayout>
    );
  }

  if (isError) {
    return (
      <BasicLayout>
        <EvaluationError text={t("something_went_wrong")} />
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <div className="container">
        <Breadcrumbs links={links} />
        <div className="flex flex-col items-start justify-start w-full lg:flex-row lg:items-center mb-20px">
          <Text typography="h3" text={providerName} className="float-left mr-20px" />
          <div className="grid gap-10px sm:grid-cols-1 md:grid-cols-2 lg:flex lg:gap-20px lg:items-center">
            <div className="flex items-center gap-5px">
              <Checkbox
                id="superseded"
                name="superseded"
                label={t("invalidated_proposals")}
                onChange={() =>
                  setFilters((prevFilters) => ({ ...prevFilters, superseded: !prevFilters.superseded }), "push")
                }
                className="whitespace-nowrap h-24px"
                checked={filters.superseded}
              />
              <div className="text-center text-white rounded-full mt-2px w-13px h-14px text-10px bg-theme-light-blue">
                {t("row_mark")}
              </div>
            </div>
            <Checkbox
              id="quarter"
              name="quarter"
              label={t("quarter")}
              onChange={() => setFilters((prevFilters) => ({ ...prevFilters, quarter: !prevFilters.quarter }), "push")}
              className="w-24px h-24px"
              checked={filters.quarter}
            />
            <Checkbox
              id="biannual"
              name="biannual"
              label={t("biannual")}
              onChange={() =>
                setFilters((prevFilters) => ({ ...prevFilters, biannual: !prevFilters.biannual }), "push")
              }
              className="w-24px h-24px"
              checked={filters.biannual}
            />
            <Checkbox
              id="annual"
              name="annual"
              label={t("annual")}
              onChange={() => setFilters((prevFilters) => ({ ...prevFilters, annual: !prevFilters.annual }), "push")}
              className="w-24px h-24px"
              checked={filters.annual}
            />
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <EvaluationTable
            headerColumns={headerColumns}
            data={filteredTableData}
            onRowClick={onRowClick}
            isMarkedRow={isMarkedRow}
            rowMark={t("row_mark")}
          />
        </div>
      </div>
    </BasicLayout>
  );
};

function useDefaultBooleanParam(defaultBooleanValue) {
  return withDefault(BooleanParam, defaultBooleanValue);
}

export default ReceivedAwardsTemplate;
