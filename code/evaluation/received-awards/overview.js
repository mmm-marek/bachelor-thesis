import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { getMetricCriteria } from "@/utils/getMetricCriteria";

import ReceivedAwardsTemplate from "@/templates/ReceivedAwardsTemplate";

import { useEvaluations, useSingleProposal } from "@/utils/evaluationQueries";

const ReceivedAwardsOverview = () => {
  const router = useRouter();

  const { evaluations } = useEvaluations();
  const { singleProposal } = useSingleProposal("TODO");

  const metrics = useSelector((state) => state.evaluation.metrics);
  const timePeriods = useSelector((state) => state.evaluation.timePeriods);
  const criterias = useSelector((state) => state.evaluation.criterias);

  const getTableData = (singleProposal, evaluations) => {
    let tableData = [];
    if (singleProposal) {
      tableData.push({
        proposal: singleProposal,
        evaluatedLevel: "unapproved",
        timePeriodTypeName: getTimePeriodTypeName(singleProposal),
      });
    }
    if (evaluations) {
      tableData = [
        ...tableData,
        ...evaluations.map((evaluation) => ({
          ...evaluation,
          timePeriodTypeName: getTimePeriodTypeName(evaluation.proposal),
        })),
      ];
    }
    return tableData;
  };

  const getCriteriaProposalAccessor = (row, metric) => {
    const accessorCriteriaProposal = row.proposal.criteriaProposals.find((criteriaProposal) => {
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

  const getTimePeriodTypeName = (proposal) => {
    const timePeriodId = proposal.metricSet.timePeriod;
    const timePeriod = timePeriods.find((el) => el.id === timePeriodId);
    return timePeriod ? timePeriod.timePeriodType.name : null;
  };

  const getTimePeriodDescription = (row) => {
    const timePeriodId = row.proposal.metricSet.timePeriod;
    const timePeriod = timePeriods.find((el) => el.id === timePeriodId);
    return timePeriod ? timePeriod.description : "undefined";
  };

  const headerColumns = [
    { Header: "Time Period", accessor: (row) => getTimePeriodDescription(row) },
    { Header: "Proposed Award", accessor: "proposal.proposedLevel" },
    { Header: "Award", accessor: "evaluatedLevel" },
    { Header: "Notes", accessor: (row) => row.proposal.notes.length },
    { Header: "Patients", accessor: "proposal.metricSet.caseCount" },
    ...metrics.map((metric) => ({
      Header: metric.name,
      accessor: (row) => getCriteriaProposalAccessor(row, metric),
      Cell: ({ value }) => getMetricValue(value),
      criteria: getMetricCriteria(metric, criterias),
    })),
  ];

  const handleRowClick = (evaluationId) => {
    router.push({
      pathname: "/evaluation/received-awards/detail",
      query: {
        evaluationId: evaluationId,
      },
    });
  };

  const links = [
    { id: "evaluation", label: "Evaluation", href: "/evaluation/overview" },
    { id: "receivedawards", label: "Received Awards", href: "/evaluation/received-awards/overview" },
    { id: "provider", label: "Provider1", href: "#" },
  ];

  return (
    <ReceivedAwardsTemplate
      providerName="Provider 1" // TODO get current provider
      links={links}
      headerColumns={headerColumns}
      tableData={getTableData(singleProposal, evaluations)}
      handleRowClick={handleRowClick}
    />
  );
};

export default ReceivedAwardsOverview;
