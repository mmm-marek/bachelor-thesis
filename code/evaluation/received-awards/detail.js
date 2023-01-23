import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import AwardDetailTemplate from "@/templates/AwardDetailTemplate";

import { useNotes, useSingleEvaluation } from "@/utils/evaluationQueries";
import { getAwardDetailTableData } from "@/utils/parseAwardDetailData";

const ReceivedAwardsDetail = () => {
  const router = useRouter();

  const metrics = useSelector((state) => state.evaluation.metrics);
  const criterias = useSelector((state) => state.evaluation.criterias);

  const { notes } = useNotes();
  const { singleEvaluation } = useSingleEvaluation(router.query.evaluationId);

  const handleRecalculate = () => {
    // TODO replace with API call
    console.log("recalculate");
  };

  const { tableData, headerCols } = getAwardDetailTableData(
    singleEvaluation?.proposal,
    singleEvaluation?.evaluatedLevel || "unapproved",
    metrics,
    criterias
  );

  const links = [
    { id: "evaluation", label: "Evaluation", href: "/evaluation/overview" },
    { id: "receivedawards", label: "Received Awards", href: "/evaluation/received-awards/overview" },
    { id: "provider", label: "Provider1, H1 2020 Award", href: "#" },
  ];

  const awardDetailProps = {
    providerName: "Provider 1",
    timePeriodDescription: "H1 2020",
    allowRecalculation: true,
    handleRecalculate: handleRecalculate,
    notes: notes || [],
    tableData,
    headerCols,
    links,
  };

  return <AwardDetailTemplate {...awardDetailProps} />;
};

export default ReceivedAwardsDetail;
