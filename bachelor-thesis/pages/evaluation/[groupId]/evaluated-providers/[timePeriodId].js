import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import {
  useEvaluationsPerTimePeriod,
  useEvaluations,
  useTimePeriods,
  useProviders,
  useChecklists,
} from "@/utils/evaluationQueries";

import EvaluatedProvidersTemplate from "@/templates/EvaluatedProvidersTemplate";
import { getProviderName } from "@/utils/evaluationTableData";
import { cellTypes } from "@/components/tables/evaluation-table/evaluation-data-cell/EvaluationDataCell";
import evaluationConfig from "@/configs/evaluation";
import { isNumeric } from "@/utils/isNumeric";

const EvaluatedProvidersOverview = () => {
  const router = useRouter();
  const { t } = useTranslation("evaluation");

  const timePeriodId = isNumeric(router.query.timePeriodId) ? Number(router.query.timePeriodId) : null;
  const groupId = isNumeric(router.query.groupId) ? Number(router.query.groupId) : null;

  const [selectedTimePeriodId, setSelectedTimePeriodId] = useState(timePeriodId);

  useEffect(() => {
    setSelectedTimePeriodId(timePeriodId);
  }, [timePeriodId]);

  const { evaluations, isLoadingEvaluations, isErrorEvaluations } = useEvaluations(selectedTimePeriodId, null, groupId);
  const { evaluationsPerTimePeriod, isLoadingEvaluationsPerTimePeriod, isErrorEvaluationsPerTimePeriod } =
    useEvaluationsPerTimePeriod(groupId);

  const { timePeriods, isLoadingTimePeriods, isErrorTimePeriods } = useTimePeriods();
  const { providers, isLoadingProviders, isErrorProviders } = useProviders(groupId);
  const { checklists, isLoadingChecklists, isErrorChecklists } = useChecklists(groupId);

  const timePeriodName = timePeriods.find((timePeriod) => timePeriod.id === selectedTimePeriodId)?.description || null;

  const links = [
    { id: "evaluation", label: t("evaluation"), href: `${evaluationConfig.origin}/overview` },
    {
      id: "evaluatedproviders",
      label: `${t("evaluated_providers")} ${timePeriodName}`,
      href: `${evaluationConfig.origin}/${groupId}/evaluated-providers/${selectedTimePeriodId}`,
    },
  ];

  const headerColumns = useMemo(
    () => [
      {
        Header: t("provider"),
        accessor: (row) => getProviderName(row.proposal?.metricSet.provider, providers, "not found"),
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
      { Header: t("notes"), accessor: (row) => row.proposal.notes.length, cellType: cellTypes.basic },
      { Header: t("patients"), accessor: "proposal.metricSet.caseCount", cellType: cellTypes.basic },
      ...(checklists[0]?.criteria || []).map((criteria) => ({
        Header: criteria.metric.name,
        accessor: (row) => getCriteriaProposalAccessor(row, criteria.metric),
        criteria: criteria,
        cellType: cellTypes.evaluated,
      })),
    ],
    [providers, checklists]
  );

  const dropdownOptions = useMemo(
    () => parseEvaluatedProvidersForDropdown(evaluationsPerTimePeriod, timePeriods),
    [evaluationsPerTimePeriod, timePeriods]
  );

  function getCriteriaProposalAccessor(row, metric) {
    const accessorCriteriaProposal = row.proposal.criteriaProposals.find((criteriaProposal) => {
      return criteriaProposal.metricValue.metric === metric.id;
    });

    if (!accessorCriteriaProposal?.applicable) {
      return "N/A";
    }
    return accessorCriteriaProposal.metricValue.value;
  }

  function handleDropdownChange(dropdownItem) {
    setSelectedTimePeriodId(dropdownItem.value);
    router.push(`${evaluationConfig.origin}/${groupId}/evaluated-providers/${dropdownItem.value}`, undefined, {
      shallow: true,
    });
  }

  function handleRowClick(evaluationId) {
    router.push({
      pathname: `${evaluationConfig.origin}/evaluations/${evaluationId}`,
    });
  }

  function parseEvaluatedProvidersForDropdown(evaluationsPerTimePeriod, timePeriods) {
    if (!evaluationsPerTimePeriod || !timePeriods) {
      return [];
    }

    return evaluationsPerTimePeriod.map((evaluation) => {
      const timePeriod = timePeriods.find((timePeriod) => timePeriod.id === evaluation.timePeriod);
      if (!timePeriod) {
        return { value: "", label: "" };
      }

      return {
        value: timePeriod.id,
        label: `${timePeriod.description} (${evaluation.evaluations.length})`,
      };
    });
  }

  return (
    <EvaluatedProvidersTemplate
      dropdownOptions={dropdownOptions}
      defaultDropdownValue={dropdownOptions.find((option) => option.value === selectedTimePeriodId)}
      handleDropdownChange={handleDropdownChange}
      headerColumns={headerColumns}
      data={evaluations}
      links={links}
      handleRowClick={(evaluationId) => handleRowClick(evaluationId)}
      isLoading={
        isLoadingEvaluations ||
        isLoadingEvaluationsPerTimePeriod ||
        isLoadingTimePeriods ||
        isLoadingProviders ||
        isLoadingChecklists
      }
      isError={
        isErrorEvaluations ||
        isErrorEvaluationsPerTimePeriod ||
        isErrorTimePeriods ||
        isErrorProviders ||
        isErrorChecklists ||
        !timePeriodName
      }
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

export default EvaluatedProvidersOverview;
