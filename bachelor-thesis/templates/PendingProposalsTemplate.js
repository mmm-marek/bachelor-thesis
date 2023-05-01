import { useQueryParam, BooleanParam, withDefault } from "use-query-params";
import BasicLayout from "@/layouts/BasicLayout";
import { EvaluationTable } from "@/components/tables/evaluation-table/EvaluationTable";
import { Dropdown, Checkbox } from "@quality-registry/cruil";
import { useTranslation } from "next-i18next";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { Loading } from "@/components/loading/Loading";
import { EvaluationError } from "@/components/error-message/EvaluationError";

const BooleanParamWithDefault = withDefault(BooleanParam, false);

export const PendingProposalsTemplate = ({
  defaultDropdownValue,
  dropdownOptions,
  onDropdownChange,
  tableData,
  headerColumns,
  links,
  onApproval,
  onRowClick,
  onAddNoteClick,
  isLoading,
  isError,
}) => {
  const { t } = useTranslation("evaluation");

  const [showNotApplicable, setShowNotApplicable] = useQueryParam("applicable", BooleanParamWithDefault, {
    removeDefaultsFromUrl: true,
  });

  function getFilteredData(tableData) {
    if (showNotApplicable) {
      return tableData;
    }
    return tableData.filter((row) => row.proposedLevel !== "");
  }

  function handleCheckboxChange(e) {
    if (e.target.checked) {
      setShowNotApplicable(true);
    } else {
      setShowNotApplicable(false);
    }
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
              onChange={onDropdownChange}
            />
          )}
          <Checkbox
            id="not-applicable"
            name="not-applicable"
            label={t("show_not_applicable_proposals")}
            onChange={handleCheckboxChange}
            className="w-max ml-10px pt-8px"
            checked={showNotApplicable}
          />
        </div>
        <EvaluationTable
          allowApproval
          data={getFilteredData(tableData)}
          headerColumns={headerColumns}
          onApproval={onApproval}
          onRowClick={onRowClick}
          onAddNoteClick={onAddNoteClick}
          isMarkedRow={(row) => row.original.proposedLevel === ""}
          rowMark={t("row_mark")}
        />
      </div>
    </BasicLayout>
  );
};
