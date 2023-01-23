import { Text, TextArea, Radio, Button } from "@quality-registry/cruil";
import { useState } from "react";

const NewNoteCreator = ({ showAwardSelection, handleNewNoteSubmit, handleCancel }) => {
  const [insertedText, setInsertedText] = useState("");
  const [selectedAward, setSelectedAward] = useState("");

  const handleRadioChange = (value) => setSelectedAward(value);

  const handleTextAreaChange = (e) => {
    setInsertedText(e.target.value);
  };

  return (
    <div className="w-full flex flex-col">
      <TextArea label="New note" placeholder="Type..." onChange={handleTextAreaChange} />
      {showAwardSelection && (
        <div className="flex flex-col gap-10px lg:gap-20px lg:flex-row">
          <Text className="w-max text-20px font-semibold">Select Award:</Text>
          <Radio label="Gold" className="w-min" name="award" onChange={() => handleRadioChange("gold")} />
          <Radio label="Platinum" className="w-min" name="award" onChange={() => handleRadioChange("platinum")} />
          <Radio label="Diamond" className="w-min" name="award" onChange={() => handleRadioChange("diamond")} />
        </div>
      )}
      <div className="self-end">
        <Button onClick={handleCancel} className="mr-10px">
          Cancel
        </Button>
        <Button
          className="self-end"
          onClick={() => handleNewNoteSubmit(insertedText, selectedAward)}
          isDisabled={showAwardSelection && (insertedText.length === 0 || selectedAward.length === 0)}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default NewNoteCreator;
