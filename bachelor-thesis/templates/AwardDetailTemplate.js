import { useRef, useState, useEffect, useMemo } from "react";
import { useTranslation } from "next-i18next";
import BasicLayout from "@/layouts/BasicLayout";
import Note from "@/components/notes/Note";
import NewNoteCreator from "@/components/notes/NewNoteCreator";
import { Button, Text } from "@quality-registry/cruil";
import { DateTime } from "luxon";
import { EvaluationTable } from "@/components/tables/evaluation-table/EvaluationTable";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { ConfirmationDialog } from "@/components/dialog/ConfirmationDialog";
import { Loading } from "@/components/loading/Loading";
import { EvaluationError } from "@/components/error-message/EvaluationError";

const AwardDetailTemplate = ({
  isLoading,
  isError,
  providerName = "",
  proposalId = "",
  timePeriodDescription = "",
  notes = [],
  headerCols = [],
  tableData = [],
  links = [],
  allowRecalculation = false,
  allowNoteAddition = false,
  allowApproval = false,
  allowAwardChange = false,
  openNoteCreatorOnMount = false,
  handleApprove = () => {},
  handleRecalculate = () => {},
  postNote = () => {},
  postEvaluation = () => {},
}) => {
  const { t } = useTranslation("evaluation");

  const [showNoteCreator, setShowNoteCreator] = useState(false);
  const [showAwardSelection, setShowAwardSelection] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const noteCreatorContainerRef = useRef();
  const pageContainerRef = useRef();

  useEffect(() => {
    if (openNoteCreatorOnMount) {
      handleShowNoteCreator(false);
    }
  }, [openNoteCreatorOnMount, isLoading]);

  const parsedNotes = useMemo(
    () =>
      notes.map((note) => {
        const date = DateTime.fromISO(note.createdAt);
        const parsedNoteDate = date.toLocaleString();
        return {
          ...note,
          author: `${note?.author?.firstName} ${note?.author?.lastName}`,
          createdAt: parsedNoteDate,
        };
      }),
    [notes]
  );

  function handleShowNoteCreator(allowAwardSelection) {
    if (showNoteCreator) {
      if (!pageContainerRef.current) {
        return;
      }
      pageContainerRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      if (!noteCreatorContainerRef.current) {
        return;
      }
      noteCreatorContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setShowNoteCreator(!showNoteCreator);
    setShowAwardSelection(allowAwardSelection);
  }

  function handleNewNoteSubmit(text, selectedOption) {
    if (selectedOption) {
      postNote({ text, proposal: proposalId });
      postEvaluation({ evaluatedLevel: selectedOption, proposal: proposalId });
      setShowNoteCreator(false);
      return;
    }
    postNote(
      {
        text,
        proposal: proposalId,
      },
      {
        onSuccess: () => {
          setShowNoteCreator(false);
        },
      }
    );
  }

  if (isLoading) {
    return (
      <BasicLayout>
        <Loading text={t("loading")} />
      </BasicLayout>
    );
  }

  if (isError) {
    return (
      <BasicLayout>
        <EvaluationError text={t("something_went_wrong")} />
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <div className="container mb-110px" ref={pageContainerRef}>
        <Breadcrumbs links={links} />
        <div className="flex items-center w-full">
          <Text className="font-bold capitalize text-30px">{`${providerName}, ${timePeriodDescription} ${t(
            "award"
          )}`}</Text>
        </div>
        <div className="relative flex flex-col justify-between w-full md:flex-row mb-10px">
          <Text className="mr-auto font-bold text-30px py-5px text-theme-blue">{t("metrics")}</Text>
          {showConfirmDialog && (
            <ConfirmationDialog
              text="Confirm Recalculation"
              agreeText="Confirm"
              disagreeText="Cancel"
              className="absolute right-0px bottom-0px"
              onAgree={handleRecalculate}
              onDisagree={() => setShowConfirmDialog(false)}
            />
          )}
          {allowRecalculation && <Button onClick={() => setShowConfirmDialog(true)}>{t("recalculate")}</Button>}
        </div>
        <EvaluationTable headerColumns={headerCols} data={tableData} allowRowspan />
        <div className="flex flex-col ml-auto gap-10px lg:flex-row">
          {allowApproval && (
            <Button isDisabled={showNoteCreator && showAwardSelection} onClick={handleApprove}>
              {t("approve_proposal")}
            </Button>
          )}
          {allowAwardChange && (
            <Button isDisabled={showNoteCreator} onClick={() => handleShowNoteCreator(true)}>
              {t("change_award")}
            </Button>
          )}
        </div>
        {parsedNotes.length > 0 && (
          <div className="w-full">
            <Text className="mr-auto font-bold text-30px text-theme-blue ">{t("notes")}</Text>
            {parsedNotes.map(({ author, createdAt, text, id, isHighlighted }) => (
              <Note author={author} date={createdAt} text={text} key={id} isHighlighted={isHighlighted} />
            ))}
          </div>
        )}
        {allowNoteAddition && !showNoteCreator && (
          <Button className="ml-auto mt-10px" onClick={() => handleShowNoteCreator(false)}>
            {t("add_note")}
          </Button>
        )}
        <div className="w-full" ref={noteCreatorContainerRef}>
          {showNoteCreator && (
            <NewNoteCreator
              onNewNoteSubmit={handleNewNoteSubmit}
              showAwardSelection={showAwardSelection}
              onCancel={handleShowNoteCreator}
              confirmOnSave={showAwardSelection}
              translateFunction={t}
            />
          )}
        </div>
      </div>
    </BasicLayout>
  );
};

export default AwardDetailTemplate;
