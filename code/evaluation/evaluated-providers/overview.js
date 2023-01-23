import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import EvaluatedProvidersTemplate from "@/templates/EvaluatedProvidersTemplate";
import { getMetricCriteria } from "@/utils/getMetricCriteria";

import { useEvaluatedProviders, useEvaluations } from "@/utils/evaluationQueries";

const EvaluatedProvidersOverview = () => {
  const router = useRouter();

  const { evaluations } = useEvaluations();
  const { evaluatedProviders } = useEvaluatedProviders();

  const metrics = useSelector((state) => state.evaluation.metrics);
  const timePeriods = useSelector((state) => state.evaluation.timePeriods);
  const criterias = useSelector((state) => state.evaluation.criterias);

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

  const parseEvaluatedProvidersForDropdown = (evaluatedProviders) => {
    if (!evaluatedProviders) return [];

    return evaluatedProviders.map((evaluation) => {
      const timePeriod = timePeriods.find((timePeriod) => timePeriod.id === evaluation.timePeriod);
      if (!timePeriod) return;

      return {
        value: evaluation.timePeriod,
        label: `${timePeriod.description} (${evaluation.evaluations.length})`,
      };
    });
  };

  const handleDropdownChange = (dropdownItem) => {
    // TODO call API
    console.log("dropdown change: ", dropdownItem);
  };

  const handleRowClick = (evaluationId) => {
    router.push({
      pathname: "/evaluation/evaluated-providers/detail",
      query: {
        evaluationId: evaluationId,
      },
    });
  };

  const links = [
    { id: "evaluation", label: "Evaluation", href: "/evaluation/overview" },
    { id: "evaluatedproviders", label: "Evaluated Providers", href: "/evaluation/evaluated-providers/overview" },
    { id: "group", label: "Group1", href: "#" },
  ];

  const headerColumns = [
    { Header: "Provider", accessor: "proposal.metricSet.provider.name" },
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

  return (
    <EvaluatedProvidersTemplate
      dropdownOptions={parseEvaluatedProvidersForDropdown(evaluatedProviders)}
      handleDropdownChange={handleDropdownChange}
      headerColumns={headerColumns}
      data={evaluations || []}
      links={links}
      handleRowClick={(evaluationId) => handleRowClick(evaluationId)}
    />
  );
};

export default EvaluatedProvidersOverview;
