import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { PendingProposalsTemplate } from "@/templates/PendingProposalsTemplate";

import { getMetricCriteria } from "@/utils/getMetricCriteria";
import { useProposalsQuery, usePendingProposals } from "@/utils/evaluationQueries";

const PendingProposalsOverview = () => {
  const router = useRouter();
  const { proposals } = useProposalsQuery();
  const { pendingProposals } = usePendingProposals();

  const metrics = useSelector((state) => state.evaluation.metrics);
  const timePeriods = useSelector((state) => state.evaluation.timePeriods);
  const criterias = useSelector((state) => state.evaluation.criterias);

  const headerColumns = [
    { Header: "Provider", accessor: (row) => getProviderAccessor(row), Cell: ({ value }) => value.providerName },
    { Header: "Proposed Award", accessor: "proposedLevel" },
    { Header: "Notes", accessor: (row) => getNotesAccessor(row), Cell: ({ value }) => value.numberOfNotes },
    { Header: "Patients", accessor: "metricSet.caseCount" },
    ...metrics.map((metric) => ({
      Header: metric.name,
      accessor: (row) => getCriteriaProposalAccessor(row, metric),
      Cell: ({ value }) => getMetricValue(value),
      criteria: getMetricCriteria(metric, criterias),
    })),
  ];

  const parseProposalsForDropdown = (pendingProposals) => {
    if (!pendingProposals) return [];

    return pendingProposals.map((pendingProposal) => {
      const timePeriod = timePeriods.find((timePeriod) => timePeriod.id === pendingProposal.timePeriod);
      if (!timePeriod) return;

      return {
        value: pendingProposal.timePeriod,
        label: `${timePeriod.description} (${pendingProposal.proposals.length})`,
      };
    });
  };

  const getCriteriaProposalAccessor = (row, metric) => {
    const accessorCriteriaProposal = row.criteriaProposals.find((criteriaProposal) => {
      return criteriaProposal.metricValue.metric === metric.id;
    });

    if (!accessorCriteriaProposal) return null;
    return accessorCriteriaProposal;
  };

  const getMetricValue = (criteriaProposal) => {
    if (!criteriaProposal) {
      return "";
    }
    return criteriaProposal.metricValue.value;
  };

  const getProviderAccessor = (row) => {
    return {
      providerName: row.metricSet.provider.name,
      isCheckable: true,
    };
  };

  const getNotesAccessor = (row) => {
    return {
      numberOfNotes: row.notes.length,
      allowAddNote: true,
    };
  };

  const onAddNoteClick = (proposalId) => {
    router.push({
      pathname: "/evaluation/pending-proposals/detail",
      query: {
        proposalId: proposalId,
        openNoteCreator: true,
      },
    });
  };

  const onRowClick = (proposalId) => {
    router.push({
      pathname: "/evaluation/pending-proposals/detail",
      query: {
        proposalId: proposalId,
      },
    });
  };

  const onApproval = (proposalIds) => {
    // TODO call API
    console.log("approve clicked", proposalIds);
  };

  const onDropdownChange = (target) => {
    // TODO call API to fetch different table data
    console.log(target.value);
  };

  const links = [
    { id: "evaluation", label: "Evaluation", href: "/evaluation/overview" },
    { id: "pendingproposals", label: "Pending Proposals", href: "/evaluation/pending-proposals/overview" },
    { id: "group", label: "Group1", href: "#" },
  ];

  return (
    <PendingProposalsTemplate
      tableData={proposals || []}
      headerColumns={headerColumns}
      dropdownOptions={parseProposalsForDropdown(pendingProposals)}
      onDropdownChange={onDropdownChange}
      links={links}
      onApproval={onApproval}
      onRowClick={onRowClick}
      onAddNoteClick={onAddNoteClick}
    />
  );
};

export default PendingProposalsOverview;
