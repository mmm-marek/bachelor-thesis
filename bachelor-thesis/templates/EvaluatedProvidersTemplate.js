import BasicLayout from "@/layouts/BasicLayout";
import { Dropdown, Checkbox } from "@quality-registry/cruil";
import { EvaluationTable } from "@/components/tables/evaluation-table/EvaluationTable";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { useQueryParam, withDefault, BooleanParam } from "use-query-params";
import { useTranslation } from "next-i18next";
import { Loading } from "@/components/loading/Loading";
import { EvaluationError } from "@/components/error-message/EvaluationError";

const BooleanParamWithDefault = withDefault(BooleanParam, false);

const EvaluatedProvidersTemplate = ({
  dropdownOptions,
  defaultDropdownValue,
  handleDropdownChange,
  headerColumns,
  data,
  handleRowClick,
  links,
  isLoading,
  isError,
}) => {
  const { t } = useTranslation("evaluation");

  const [showSupersededEvaluations, setShowSupersededEvaluations] = useQueryParam(
    "applicable",
    BooleanParamWithDefault,
    {
      removeDefaultsFromUrl: true,
    }
  );
  const filteredData = getFilteredData(data);

  function handleCheckboxChange(e) {
    if (e.target.checked) {
      setShowSupersededEvaluations(true);
    } else {
      setShowSupersededEvaluations(false);
    }
  }

  function getFilteredData(data) {
    if (showSupersededEvaluations) {
      return data;
    }
    return data.filter((row) => row.superseededByEvaluation === null);
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
      <div className="container w-full mb-20px">
        <Breadcrumbs links={links} />
        <div className="flex items-start w-full gap-10px">
          {dropdownOptions.length > 0 && (
            <Dropdown
              options={dropdownOptions}
              defaultValue={defaultDropdownValue}
              className="flex gap-15px mb-20px"
              label={`${t("time_period")}:`}
              isAnyOption={false}
              onChange={handleDropdownChange}
            />
          )}
          <Checkbox
            id="not-applicable"
            name="not-applicable"
            label={t("show_superseded_evaluations")}
            onChange={handleCheckboxChange}
            className="w-max ml-10px pt-8px"
            checked={showSupersededEvaluations}
          />
        </div>
        <EvaluationTable
          headerColumns={headerColumns}
          data={filteredData}
          onRowClick={handleRowClick}
          isMarkedRow={(row) => (row.original.superseededByEvaluation ? true : false)}
          rowMark={t("row_mark")}
        />
      </div>
    </BasicLayout>
  );
};

export default EvaluatedProvidersTemplate;
