import { useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ReceivedAwardsTemplate from "@/templates/ReceivedAwardsTemplate";
import { useEvaluations, useTimePeriods, useSingleProvider, useChecklists } from "@/utils/evaluationQueries";
import { cellTypes } from "@/components/tables/evaluation-table/evaluation-data-cell/EvaluationDataCell";
import evaluationConfig from "@/configs/evaluation";
import { isNumeric } from "@/utils/isNumeric";

const ReceivedAwardsOverview = () => {
  const router = useRouter();
  const { t } = useTranslation("evaluation");

  const providerId = isNumeric(router.query.providerId) ? Number(router.query.providerId) : null;

  const { evaluations, isLoadingEvaluations, isErrorEvaluations } = useEvaluations(null, providerId, null);

  const { timePeriods, isLoadingTimePeriods, isErrorTimePeriods } = useTimePeriods();
  const { singleProvider, isLoadingSingleProvider, isErrorSingleProvider } = useSingleProvider(providerId);
  const { checklists, isLoadingChecklists, isErrorChecklists } = useChecklists(evaluations?.[0]?.proposal?.checklist);

  const headerColumns = useMemo(
    () => [
      {
        Header: t("time_period"),
        accessor: (row) => getTimePeriodDescription(row),
        cellType: cellTypes.basic,
        cellIsHoverable: true,
      },
      {
        Header: t("proposed_award"),
        accessor: (row) => (row.proposal.proposedLevel === "" ? "N/A" : row.proposal.proposedLevel),
        Cell: ({ value }) => (value === "N/A" ? value : t(value)),
        cellType: cellTypes.evaluated,
      },
      {
        Header: t("award"),
        accessor: (row) => (row.evaluatedLevel === "" ? "N/A" : row.evaluatedLevel),
        Cell: ({ value }) => (value === "N/A" ? value : t(value)),
        cellType: cellTypes.evaluated,
      },
      { Header: t("notes"), accessor: (row) => row.proposal.notes.length },
      { Header: t("patients"), accessor: "proposal.metricSet.caseCount" },
      ...(checklists[0]?.criteria || []).map((criteria) => ({
        Header: criteria.metric.name,
        accessor: (row) => getCriteriaProposalAccessor(row, criteria.metric),
        criteria: criteria,
        cellType: cellTypes.evaluated,
      })),
    ],
    [checklists]
  );

  const links = [
    { id: "evaluation", label: t("evaluation"), href: `${evaluationConfig.origin}/overview` },
    {
      id: "receivedawards",
      label: t("received_awards"),
      href: `${evaluationConfig.origin}/received-awards/${providerId || "undefined"}`,
    },
  ];

  function getTableData(evaluations) {
    return evaluations
      .filter((evaluation) => evaluation.superseededByEvaluation === null)
      .map((evaluation) => ({
        ...evaluation,
        timePeriodTypeName: getTimePeriodTypeName(evaluation.proposal, timePeriods),
      }));
  }

  function getCriteriaProposalAccessor(row, metric) {
    const accessorCriteriaProposal = row.proposal.criteriaProposals.find((criteriaProposal) => {
      return criteriaProposal.metricValue.metric === metric.id;
    });

    if (!accessorCriteriaProposal?.applicable) {
      return "N/A";
    }
    return accessorCriteriaProposal.metricValue.value;
  }

  function getTimePeriodTypeName(proposal, timePeriods) {
    if (!proposal || !timePeriods) {
      return null;
    }
    const timePeriodId = proposal.metricSet.timePeriod;
    const timePeriod = timePeriods.find((el) => el.id === timePeriodId);
    return timePeriod ? timePeriod.timePeriodType.name : null;
  }

  function getTimePeriodDescription(row) {
    if (!row || !timePeriods) {
      return null;
    }
    const timePeriodId = row.proposal.metricSet.timePeriod;
    const timePeriod = timePeriods.find((el) => el.id === timePeriodId);
    return timePeriod ? timePeriod.description : "undefined";
  }

  function handleRowClick(evaluationId) {
    router.push({
      pathname: `${evaluationConfig.origin}/received-awards/evaluation/${evaluationId}`,
    });
  }

  return (
    <ReceivedAwardsTemplate
      isLoading={isLoadingEvaluations || isLoadingTimePeriods || isLoadingSingleProvider || isLoadingChecklists}
      isError={isErrorEvaluations || isErrorTimePeriods || isErrorSingleProvider || isErrorChecklists}
      providerName={singleProvider.nameEnglish}
      links={links}
      headerColumns={headerColumns}
      tableData={getTableData(evaluations)}
      onRowClick={handleRowClick}
    />
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["evaluation"])),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default ReceivedAwardsOverview;
