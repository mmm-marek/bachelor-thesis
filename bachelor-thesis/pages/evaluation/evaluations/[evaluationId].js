import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import {
  useNotes,
  usePostEvaluation,
  usePostNote,
  useSingleProvider,
  useSingleEvaluation,
  useTimePeriods,
  useSingleChecklist,
} from "@/utils/evaluationQueries";

import AwardDetailTemplate from "@/templates/AwardDetailTemplate";
import { useAwardDetailTableData } from "@/utils/parseAwardDetailData";
import evaluationConfig from "@/configs/evaluation";

const EvaluationDetail = () => {
  const router = useRouter();

  const { t } = useTranslation("evaluation");

  const { timePeriods, isLoadingTimePeriods, isErrorTimePeriods } = useTimePeriods();

  const { singleEvaluation, isLoadingSingleEvaluation, isErrorSingleEvaluation } = useSingleEvaluation(
    router.query.evaluationId
  );
  const { notes, isLoadingNotes, isErrorNotes } = useNotes(singleEvaluation?.proposal?.id);
  const { singleProvider, isLoadingSingleProvider, isErrorSingleProvider } = useSingleProvider(
    singleEvaluation?.proposal?.metricSet?.provider
  );
  const { singleChecklist, isLoadingSingleChecklist, isErrorSingleChecklist } = useSingleChecklist(
    singleEvaluation?.proposal?.checklist
  );

  const { postNote } = usePostNote();
  const { postEvaluation } = usePostEvaluation({
    onSuccess: (res) => {
      router.push(`${evaluationConfig.origin}/evaluations/${res.id}`);
    },
  });

  const { tableData, headerCols } = useAwardDetailTableData(
    singleEvaluation?.proposal,
    singleEvaluation?.evaluatedLevel || "unapproved",
    singleChecklist?.criteria
  );

  const timePeriodId = singleEvaluation?.proposal.metricSet.timePeriod || null;
  const timePeriodName = timePeriods.find((timePeriod) => timePeriod.id === timePeriodId)?.description || null;

  const links = [
    { id: "evaluation", label: t("evaluation"), href: `${evaluationConfig.origin}/overview` },
    {
      id: "evaluatedproviders",
      label: `${t("evaluated_providers")} ${timePeriodName}`,
      href: `${evaluationConfig.origin}/1/evaluated-providers/${timePeriodId}`,
    },
    {
      id: "provider",
      label: singleProvider?.nameEnglish ?? "not found",
      href: "#",
    },
  ];

  const authorName = `${singleEvaluation?.author.firstName} ${singleEvaluation?.author.lastName}`;

  const notesWithApprovedNote = [
    ...notes,
    {
      author: singleEvaluation?.author,
      createdAt: singleEvaluation?.evaluatedAt,
      id: "coordinatorApprovedNote",
      text: `${authorName} ${t("note-approved")} ${t(`note-${singleEvaluation?.evaluatedLevel}`)} ${t("note-award")}`,
      isHighlighted: true,
    },
  ];

  return (
    <AwardDetailTemplate
      isLoading={
        isLoadingSingleProvider ||
        isLoadingTimePeriods ||
        isLoadingNotes ||
        isLoadingSingleEvaluation ||
        isLoadingSingleChecklist
      }
      isError={
        isErrorSingleProvider ||
        isErrorTimePeriods ||
        isErrorNotes ||
        isErrorSingleEvaluation ||
        isErrorSingleChecklist ||
        !timePeriodName
      }
      providerName={singleProvider?.nameEnglish ?? "not found"}
      timePeriodDescription={timePeriodName}
      allowAwardChange
      proposalId={singleEvaluation?.proposal?.id || ""}
      postNote={postNote}
      postEvaluation={postEvaluation}
      notes={notesWithApprovedNote}
      tableData={tableData}
      headerCols={headerCols}
      links={links}
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

export default EvaluationDetail;
