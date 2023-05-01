import { useMemo } from "react";
import { cellTypes } from "@/components/tables/evaluation-table/evaluation-data-cell/EvaluationDataCell";
import { useTranslation } from "next-i18next";

function getCriteriaProposal(row, metric) {
  const accessorCriteriaProposal = row.criteriaProposals.find((criteriaProposal) => {
    return criteriaProposal.metricId === metric.id;
  });

  if (!accessorCriteriaProposal?.applicable) return "N/A";
  return accessorCriteriaProposal.value;
}

function generateNewCriteriaProposals(oldCriteriaProposals, isResult) {
  return oldCriteriaProposals.map((criteriaProposal) => ({
    ...criteriaProposal,
    metricId: criteriaProposal.metricValue.metric,
    value: isResult
      ? criteriaProposal.metricValue.value
      : `${criteriaProposal.metricValue.count}/${criteriaProposal.metricValue.totalCount}`,
    proposedLevel: criteriaProposal.proposedLevel,
  }));
}

function getTableData(proposal, award, resultsTitle, statisticsTitle) {
  if (!proposal) {
    return [];
  }

  const results = {
    title: resultsTitle,
    criteriaProposals: generateNewCriteriaProposals(proposal.criteriaProposals, true),
    patients: proposal.metricSet.caseCount,
    proposedLevel: proposal.proposedLevel,
    award: award,
  };

  const statistics = {
    title: statisticsTitle,
    criteriaProposals: generateNewCriteriaProposals(proposal.criteriaProposals, false),
    patients: proposal.metricSet.caseCount,
    proposedLevel: proposal.proposedLevel,
    award: award,
  };

  return [results, statistics];
}

export function useAwardDetailTableData(proposal, award, criteria = []) {
  const { t } = useTranslation("evaluation");

  const headerCols = useMemo(
    () => [
      { Header: "", accessor: "title", cellType: cellTypes.basic, cellIsHoverable: true },
      {
        Header: t("proposed_award"),
        accessor: "proposedLevel",
        spanFirstCell: true,
        cellType: cellTypes.evaluated,
        Cell: ({ value }) => (value === "" ? t("none") : t(value)),
      },
      {
        Header: t("award"),
        accessor: "award",
        spanFirstCell: true,
        cellType: cellTypes.evaluated,
        Cell: ({ value }) => (value === "" ? t("none") : t(value)),
      },
      {
        Header: t("patients"),
        accessor: "patients",
        cellType: cellTypes.basic,
        spanFirstCell: true,
      },
      ...(criteria || []).map((criterion) => ({
        Header: criterion.metric.name,
        accessor: (row) => getCriteriaProposal(row, criterion.metric),
        criteria: criterion,
        cellType: cellTypes.evaluated,
      })),
    ],
    [criteria]
  );

  const tableData = useMemo(() => getTableData(proposal, award, t("results"), t("statistics")), [proposal, award, t]);

  return { tableData, headerCols };
}
