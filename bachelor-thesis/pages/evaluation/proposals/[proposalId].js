import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import {
  useNotes,
  usePostNote,
  useSingleProvider,
  useSingleProposal,
  useTimePeriods,
  usePostEvaluation,
  useSingleChecklist,
} from "@/utils/evaluationQueries";

import AwardDetailTemplate from "@/templates/AwardDetailTemplate";
import { useAwardDetailTableData } from "@/utils/parseAwardDetailData";
import evaluationConfig from "@/configs/evaluation";

const ProposalsDetail = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation("evaluation");

  const { timePeriods, isLoadingTimePeriods, isErrorTimePeriods } = useTimePeriods();

  const { notes, isLoadingNotes, isErrorNotes } = useNotes(router.query.proposalId);
  const { singleProposal, isLoadingSingleProposal, isErrorSingleProposal } = useSingleProposal(router.query.proposalId);
  const { singleProvider, isLoadingSingleProvider, isErrorSingleProvider } = useSingleProvider(
    singleProposal?.metricSet?.provider
  );
  const { singleChecklist, isLoadingSingleChecklist, isErrorSingleChecklist } = useSingleChecklist(
    singleProposal?.checklist
  );

  const openNoteCreator = router.query.openNoteCreator;

  const { postNote } = usePostNote({
    onSuccess: () => {
      queryClient.invalidateQueries("notes");
    },
  });
  const { postEvaluation } = usePostEvaluation({
    onSuccess: () => {
      router.push(`${evaluationConfig.origin}/1/pending-proposals/${singleProposal?.metricSet.timePeriod}`);
    },
  });

  const { tableData, headerCols } = useAwardDetailTableData(singleProposal, "unapproved", singleChecklist?.criteria);

  const timePeriodName =
    timePeriods.find((timePeriod) => timePeriod.id === singleProposal?.metricSet.timePeriod)?.description || null;

  const links = [
    { id: "evaluation", label: t("evaluation"), href: `${evaluationConfig.origin}/overview` },
    {
      id: "pendingproposals",
      label: `${t("pending_proposals")} ${timePeriodName}`,
      href: `${evaluationConfig.origin}/1/pending-proposals/${singleProposal?.metricSet.timePeriod}`,
    },
    { id: "award", label: singleProvider?.nameEnglish ?? "not found", href: "#" },
  ];

  function handleApprove() {
    postEvaluation({ evaluatedLevel: singleProposal.proposedLevel, proposal: singleProposal.id });
  }

  return (
    <AwardDetailTemplate
      isLoading={
        isLoadingSingleProvider ||
        isLoadingTimePeriods ||
        isLoadingNotes ||
        isLoadingSingleProposal ||
        isLoadingSingleChecklist
      }
      isError={
        isErrorSingleProvider ||
        isErrorTimePeriods ||
        isErrorNotes ||
        isErrorSingleProposal ||
        isErrorSingleChecklist ||
        !timePeriodName
      }
      proposalId={router.query.proposalId}
      providerName={singleProvider?.nameEnglish ?? "not found"}
      timePeriodDescription={timePeriodName}
      allowNoteAddition
      allowApproval
      allowAwardChange
      headerCols={headerCols}
      tableData={tableData || []}
      notes={notes}
      links={links}
      openNoteCreatorOnMount={openNoteCreator !== undefined}
      handleApprove={handleApprove}
      postNote={postNote}
      postEvaluation={postEvaluation}
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

export default ProposalsDetail;
