import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import AwardDetailTemplate from "@/templates/AwardDetailTemplate";

import { getAwardDetailTableData } from "@/utils/parseAwardDetailData";
import { useNotes, useSingleProposal } from "@/utils/evaluationQueries";

const PendingProposalsDetail = () => {
  const router = useRouter();

  const metrics = useSelector((state) => state.evaluation.metrics);
  const criterias = useSelector((state) => state.evaluation.criterias);

  const openNoteCreator = router.query.openNoteCreator;

  const { notes } = useNotes();
  const { singleProposal } = useSingleProposal(router.query.proposalId);

  const handleApprove = () => {
    // TODO replace with API call
    console.log("approved");
  };

  const handleNewNoteSubmit = (text, selectedOption) => {
    // TODO call API with the provided text and selected option
    console.log(text);
    console.log(selectedOption);
  };

  const { tableData, headerCols } = getAwardDetailTableData(singleProposal, "unapproved", metrics, criterias);

  const links = [
    { id: "evaluation", label: "Evaluation", href: "/evaluation/overview" },
    { id: "pendingproposals", label: "Pending Proposals", href: "/evaluation/pending-proposals/overview" },
    { id: "award", label: "Provider1, H1 2020 Award", href: "#" },
  ];

  const awardDetailProps = {
    providerName: "Provider 1",
    timePeriodDescription: "H1 2020",
    allowNoteAddition: true,
    allowApproval: true,
    allowAwardChange: true,
    notes: notes || [],
    tableData,
    headerCols,
    links,
    openNoteCreatorOnMount: openNoteCreator !== undefined,
    handleNewNoteSubmit: handleNewNoteSubmit,
    handleApprove: handleApprove,
  };

  return <AwardDetailTemplate {...awardDetailProps} />;
};

export default PendingProposalsDetail;
