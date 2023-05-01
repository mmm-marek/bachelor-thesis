import classNames from "classnames";
import NextImage from "next/image";
import AddImage from "@/assets/components/accordion/add.svg";

export const FunctionalDataCell = ({ cell, onAddSignClick, additionalClassName, cellMark }) => {
  const rowSpan = cell.column.spanFirstCell ? 0 : 1;

  function handleClick(e) {
    e.stopPropagation();
    onAddSignClick();
  }

  return (
    <td
      className={classNames(
        "not-italic font-semibold text-center capitalize border-4 border-white border-solid text-18px font-titillium text-theme-blue border-box rounded-10px whitespace-nowrap",
        cell.column.cellIsHoverable ? "group-hover:bg-theme-blue group-hover:text-white" : "",
        additionalClassName || "",
        "relative"
      )}
      rowSpan={rowSpan}
    >
      {cellMark && (
        <div className="absolute text-center text-white rounded-full top-2px left-2px w-13px h-14px text-10px bg-theme-light-blue">
          {cellMark}
        </div>
      )}
      <div className="flex items-center justify-center gap-5px">
        {cell.render("Cell")}
        <NextImage src={AddImage} width={15} height={15} onClick={handleClick} />
      </div>
    </td>
  );
};
