import { Text } from "@quality-registry/cruil";

const Note = ({ author, date, text, isHighlighted }) => {
  if (isHighlighted) {
    return (
      <div className="flex justify-between w-full font-bold border-b-2 text-20px font-titillium border-text-area-border p-10px">
        <Text>{text}</Text>
        <Text>{date}</Text>
      </div>
    );
  }

  return (
    <div className="w-full border-b-2 font-titillium border-text-area-border p-10px">
      <div className="flex justify-between font-semibold text-20px text-theme-blue">
        <Text>{author}</Text>
        <Text>{date}</Text>
      </div>
      {author && <Text className="text-18px px-30px">{text}</Text>}
    </div>
  );
};

export default Note;
