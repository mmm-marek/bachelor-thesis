import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useQueryClient } from "react-query";

import {
  useProposals,
  usePendingProposals,
  useTimePeriods,
  useProviders,
  usePostEvaluation,
  useChecklists,
} from "@/utils/evaluationQueries";

import { PendingProposalsTemplate } from "@/templates/PendingProposalsTemplate";
import { cellTypes } from "@/components/tables/evaluation-table/evaluation-data-cell/EvaluationDataCell";
import { getProviderName } from "@/utils/evaluationTableData";
import evaluationConfig from "@/configs/evaluation";
import { isNumeric } from "@/utils/isNumeric";

const PendingProposalsOverview = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation("evaluation");

  const groupId = isNumeric(router.query.groupId) ? Number(router.query.groupId) : null;
  const timePeriodId = isNumeric(router.query.timePeriodId) ? Number(router.query.timePeriodId) : null;
  const [selectedTimePeriodId, setSelectedTimePeriodId] = useState(timePeriodId);

  const { timePeriods, isLoadingTimePeriods, isErrorTimePeriods } = useTimePeriods();
  const { providers, isLoadingProviders, isErrorProviders } = useProviders(groupId);
  const { checklists, isLoadingChecklists, isErrorChecklists } = useChecklists(groupId);

  const { pendingProposals, isLoadingPendingProposals, isErrorPendingProposals } = usePendingProposals(groupId);
  const { proposals, isLoadingProposals, isErrorProposals } = useProposals(timePeriodId, groupId);

  const { postEvaluation } = usePostEvaluation();

  useEffect(() => {
    setSelectedTimePeriodId(timePeriodId);
  }, [timePeriodId]);

  const filteredProposals = useMemo(
    () => proposals.filter((proposal) => proposal.evaluation === null && proposal.superseededByProposal === null),
    [proposals]
  );

  const headerColumns = useMemo(
    () => [
      {
        Header: t("provider"),
        accessor: (row) => getProviderName(row.metricSet.provider, providers, "Not found"),
        cellType: cellTypes.selectable,
        cellIsHoverable: true,
      },
      {
        Header: t("proposed_award"),
        accessor: (row) => (row.proposedLevel === "" ? "N/A" : row.proposedLevel),
        Cell: ({ value }) => (value === "N/A" ? value : t(value)),
        cellType: cellTypes.evaluated,
      },
      { Header: t("notes"), accessor: "notes.length", allowAddSign: true, cellType: cellTypes.functional },
      { Header: t("patients"), accessor: "metricSet.caseCount", cellType: cellTypes.basic },
      ...(checklists[0]?.criteria || []).map((criteria) => ({
        Header: criteria.metric.name,
        accessor: (row) => getCriteriaProposal(row, criteria.metric),
        criteria: criteria,
        cellType: cellTypes.evaluated,
      })),
    ],
    [providers, checklists]
  );

  const timePeriodName = timePeriods?.find((timePeriod) => timePeriod.id === selectedTimePeriodId)?.description || null;

  const links = [
    { id: "evaluation", label: t("evaluation"), href: `${evaluationConfig.origin}/overview` },
    {
      id: "pendingproposals",
      label: `${t("pending_proposals")} ${timePeriodName}`,
      href: `${evaluationConfig.origin}/${groupId}/pending-proposals/${selectedTimePeriodId}`,
    },
  ];

  const dropdownOptions = useMemo(
    () => parseProposalsForDropdown(pendingProposals, timePeriods),
    [pendingProposals, timePeriods]
  );

  function getCriteriaProposal(row, metric) {
    const accessorCriteriaProposal = row.criteriaProposals.find((criteriaProposal) => {
      return criteriaProposal.metricValue.metric === metric.id;
    });

    if (!accessorCriteriaProposal?.applicable) {
      return "N/A";
    }
    return accessorCriteriaProposal.metricValue.value;
  }

  function parseProposalsForDropdown(pendingProposals, timePeriods) {
    if (timePeriods.length === 0) {
      return [];
    }

    if (pendingProposals.length === 0) {
      const timePeriod = timePeriods.find((timePeriod) => timePeriod.id === selectedTimePeriodId);
      if (!timePeriod) {
        return [];
      }

      return [
        {
          value: selectedTimePeriodId,
          label: `${timePeriod.description} (${filteredProposals.length})`,
        },
      ];
    }

    return pendingProposals.map((pendingProposal) => {
      const timePeriod = timePeriods.find((timePeriod) => timePeriod.id === pendingProposal.timePeriod);
      return {
        value: timePeriod.id,
        label: `${timePeriod.description} (${pendingProposal.proposals.length})`,
      };
    });
  }

  function handleAddNoteClick(proposalId) {
    router.push({
      pathname: `${evaluationConfig.origin}/proposals/${proposalId}`,
      query: {
        openNoteCreator: true,
      },
    });
  }

  function handleRowClick(proposalId) {
    router.push({
      pathname: `${evaluationConfig.origin}/proposals/${proposalId}`,
    });
  }

  function handleApproval(rows) {
    rows.forEach((row) => {
      postEvaluation(
        {
          proposal: row.original.id,
          evaluatedLevel: row.original.proposedLevel,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries("proposals");
            queryClient.invalidateQueries("pending-proposals");
          },
        }
      );
    });
  }

  function handleDropdownChange(target) {
    setSelectedTimePeriodId(target.value);
    router.push(`${evaluationConfig.origin}/${groupId}/pending-proposals/${target.value}`, undefined, {
      shallow: true,
    });
  }

  return (
    <PendingProposalsTemplate
      isLoading={
        isLoadingTimePeriods ||
        isLoadingProviders ||
        isLoadingPendingProposals ||
        isLoadingProposals ||
        isLoadingChecklists
      }
      isError={
        isErrorTimePeriods ||
        isErrorProviders ||
        isErrorPendingProposals ||
        isErrorProposals ||
        isErrorChecklists ||
        !timePeriodName
      }
      links={links}
      tableData={filteredProposals}
      headerColumns={headerColumns}
      dropdownOptions={dropdownOptions}
      defaultDropdownValue={dropdownOptions.find((option) => option.value === selectedTimePeriodId)}
      onApproval={handleApproval}
      onRowClick={handleRowClick}
      onAddNoteClick={handleAddNoteClick}
      onDropdownChange={handleDropdownChange}
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

export default PendingProposalsOverview;
