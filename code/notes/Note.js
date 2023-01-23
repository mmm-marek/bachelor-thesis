import { Text } from "@quality-registry/cruil";

const Note = ({ author, date, text }) => {
  // TODO might need to rework this piece based on the API, especially the "Coordinator approved award" type

  return (
    <div
      className="w-full font-titillium
                 border-b-2 border-text-area-border
                 p-10px"
    >
      <div className="flex justify-between text-20px">
        <Text color="text-theme-blue font-semibold">{author || text}</Text>
        <Text color="text-theme-blue font-semibold">{date}</Text>
      </div>
      {author && <Text className="text-18px px-30px">{text}</Text>}
    </div>
  );
};

export default Note;
