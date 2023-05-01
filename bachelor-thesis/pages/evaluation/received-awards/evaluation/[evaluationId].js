import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import AwardDetailTemplate from "@/templates/AwardDetailTemplate";

import {
  useNotes,
  usePostRecalculate,
  useSingleProvider,
  useSingleEvaluation,
  useTimePeriods,
  useSingleChecklist,
} from "@/utils/evaluationQueries";
import { useAwardDetailTableData } from "@/utils/parseAwardDetailData";
import evaluationConfig from "@/configs/evaluation";

const ReceivedAwardDetail = () => {
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
  const { postRecalculate } = usePostRecalculate();

  const providerId = singleEvaluation?.proposal.metricSet.provider || null;

  const handleRecalculate = () => {
    postRecalculate(singleEvaluation.proposal.id, {
      onSuccess: () => {
        router.push(`${evaluationConfig.origin}/received-awards/${providerId}`);
      },
    });
  };

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
      id: "receivedawards",
      label: t("received_awards"),
      href: `${evaluationConfig.origin}/received-awards/${providerId}`,
    },
    { id: "timePeriod", label: timePeriodName, href: "#" },
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
        isLoadingTimePeriods ||
        isLoadingSingleProvider ||
        isLoadingNotes ||
        isLoadingSingleEvaluation ||
        isLoadingSingleChecklist
      }
      isError={
        isErrorTimePeriods ||
        isErrorSingleProvider ||
        isErrorNotes ||
        isErrorSingleEvaluation ||
        isErrorSingleChecklist ||
        !timePeriodName
      }
      providerName={singleProvider?.nameEnglish ?? "not found"}
      timePeriodDescription={timePeriodName}
      allowRecalculation
      handleRecalculate={handleRecalculate}
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

export default ReceivedAwardDetail;
