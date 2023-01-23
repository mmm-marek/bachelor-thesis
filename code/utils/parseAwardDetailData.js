import { getMetricCriteria } from "./getMetricCriteria";

const getCriteriaProposal = (row, metric) => {
  const accessorCriteriaProposal = row.criteriaProposals.find((criteriaProposal) => {
    return criteriaProposal.metricId === metric.id;
  });

  if (!accessorCriteriaProposal) return null;
  return accessorCriteriaProposal;
};

const getMetricValue = (criteriaProposal) => {
  if (!criteriaProposal) {
    return "";
  }
  return criteriaProposal.value;
};

const getAwardAccessor = (proposedLevel) => {
  return {
    proposedLevel,
    shouldRowSpan: true,
  };
};

const getPatientsAccessor = (numberOfPatients) => {
  return {
    numberOfPatients,
    shouldRowSpan: true,
  };
};

const generateNewCriteriaProposals = (oldCriteriaProposals, isResult) => {
  return oldCriteriaProposals.map((criteriaProposal) => ({
    ...criteriaProposal,
    metricId: criteriaProposal.metricValue.metric,
    value: isResult
      ? `${criteriaProposal.metricValue.value}`
      : `${criteriaProposal.metricValue.count}/${criteriaProposal.metricValue.totalCount}`,
    proposedLevel: criteriaProposal.proposedLevel,
  }));
};

export const getAwardDetailTableData = (proposal, award, metrics, criterias) => {
  if (!proposal) return { tableData: [], headerCols: [] };

  const results = {
    title: "results",
    criteriaProposals: generateNewCriteriaProposals(proposal.criteriaProposals, true),
    patients: proposal.metricSet.caseCount,
    proposedLevel: proposal.proposedLevel,
    award,
  };
  const statistics = {
    title: "statistics",
    criteriaProposals: generateNewCriteriaProposals(proposal.criteriaProposals, false),
    patients: proposal.metricSet.caseCount,
    proposedLevel: proposal.proposedLevel,
    award,
  };

  const headerCols = [
    { Header: "", accessor: "title" },
    {
      Header: "Proposed Award",
      accessor: (row) => getAwardAccessor(row.proposedLevel),
      Cell: ({ value }) => value.proposedLevel,
    },
    {
      Header: "Award",
      accessor: (row) => getAwardAccessor(row.award),
      Cell: ({ value }) => value.proposedLevel,
    },
    {
      Header: "Patients",
      accessor: (row) => getPatientsAccessor(row.patients),
      Cell: ({ value }) => value.numberOfPatients,
    },
    ...metrics.map((metric) => ({
      Header: metric.name,
      accessor: (row) => getCriteriaProposal(row, metric),
      Cell: ({ value }) => getMetricValue(value),
      criteria: getMetricCriteria(metric, criterias),
    })),
  ];

  const tableData = [results, statistics];

  return { tableData, headerCols };
};
