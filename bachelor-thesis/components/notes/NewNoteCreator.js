import { useState } from "react";
import { Text, TextArea, Radio, Button } from "@quality-registry/cruil";
import { ConfirmationDialog } from "../dialog/ConfirmationDialog";
import { useTranslation } from "next-i18next";

const NewNoteCreator = ({ onNewNoteSubmit, onCancel, confirmOnSave, showAwardSelection }) => {
  const { t } = useTranslation("evaluation");

  const [insertedText, setInsertedText] = useState("");
  const [selectedAward, setSelectedAward] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  function handleRadioChange(value) {
    setSelectedAward(value);
  }

  function handleTextAreaChange(e) {
    setInsertedText(e.target.value);
  }

  function handleSaveClick(text, award) {
    if (confirmOnSave) {
      setShowConfirmDialog(true);
      return;
    }
    onNewNoteSubmit(text, award);
  }

  function handleAgree(insertedText, selectedAward) {
    setShowConfirmDialog(false);
    onNewNoteSubmit(insertedText, selectedAward);
  }

  function handleDisagree() {
    setShowConfirmDialog(false);
  }

  return (
    <div className="flex flex-col w-full">
      <TextArea label={t("new_note")} placeholder={`${t("type")}...`} onChange={handleTextAreaChange} />
      {showAwardSelection && (
        <div className="flex flex-col gap-10px lg:gap-20px lg:flex-row">
          <Text className="font-semibold w-max text-20px">{t("select_award")}:</Text>
          <Radio
            label={t("gold")}
            className="w-min"
            name="award"
            id="gold-checkbox"
            onChange={() => handleRadioChange("gold")}
          />
          <Radio
            label={t("platinum")}
            className="w-min"
            name="award"
            id="platinum-checkbox"
            onChange={() => handleRadioChange("platinum")}
          />
          <Radio
            label={t("diamond")}
            className="w-min"
            name="award"
            id="diamond-checkbox"
            onChange={() => handleRadioChange("diamond")}
          />
        </div>
      )}
      <div className="relative self-end py-10px">
        <Button onClick={onCancel} className="mr-10px">
          {t("cancel")}
        </Button>
        <Button
          className="self-end"
          onClick={() => handleSaveClick(insertedText, selectedAward)}
          isDisabled={!insertedText.trim() || (showAwardSelection && !selectedAward)}
        >
          {t("save")}
        </Button>
        {showConfirmDialog && (
          <ConfirmationDialog
            text="Confirm Award Change"
            agreeText={t("confirm")}
            disagreeText={t("cancel")}
            className="absolute right-0px bottom-0px w-342px"
            onAgree={() => handleAgree(insertedText, selectedAward)}
            onDisagree={() => handleDisagree()}
          />
        )}
      </div>
    </div>
  );
};

export default NewNoteCreator;
