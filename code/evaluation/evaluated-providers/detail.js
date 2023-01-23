import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import AwardDetailTemplate from "@/templates/AwardDetailTemplate";
import { getAwardDetailTableData } from "@/utils/parseAwardDetailData";

import { useNotes, useSingleEvaluation } from "@/utils/evaluationQueries";

const EvaluatedProvidersDetail = () => {
  const router = useRouter();

  const metrics = useSelector((state) => state.evaluation.metrics);
  const criterias = useSelector((state) => state.evaluation.criterias);

  const { notes } = useNotes();
  const { singleEvaluation } = useSingleEvaluation(router.query.evaluationId);

  const { tableData, headerCols } = getAwardDetailTableData(
    singleEvaluation?.proposal,
    singleEvaluation?.evaluatedLevel || "unapproved",
    metrics,
    criterias
  );

  const links = [
    { id: "evaluation", label: "Evaluation", href: "/evaluation/overview" },
    { id: "evaluatedproviders", label: "Evaluated Providers", href: "/evaluation/evaluated-providers/overview" },
    { id: "award", label: "Provider1, H1 2020 Award", href: "#" },
  ];

  const awardDetailProps = {
    providerName: "Provider1",
    timePeriodDescription: "H1 2020",
    allowAwardChange: true,
    notes: notes || [],
    tableData,
    headerCols,
    links,
  };

  return <AwardDetailTemplate {...awardDetailProps} />;
};

export default EvaluatedProvidersDetail;
