import classNames from "classnames";
import { Button, Text } from "@quality-registry/cruil";

export const ConfirmationDialog = ({ text, agreeText, disagreeText, onAgree, onDisagree, className }) => {
  return (
    <div
      className={classNames(
        "flex flex-col items-center justify-center w-max p-15px border-2 border-theme-blue rounded-16px bg-white",
        className
      )}
    >
      <Text className="font-semibold text-center text-24px lg:text-30px pb-15px">{text}</Text>
      <div className="flex justify-center w-full gap-15px">
        <Button onClick={onDisagree} className="" variants="red">
          {disagreeText}
        </Button>
        <Button onClick={onAgree} className="">
          {agreeText}
        </Button>
      </div>
    </div>
  );
};
