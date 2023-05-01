import classNames from "classnames";

export const EvaluatedDataCell = ({ cell, value, additionalClassName, cellMark }) => {
  const rowSpan = cell.column.spanFirstCell ? 0 : 1;

  function getCellClassname(value) {
    if (value === "diamond") {
      return "diamond-award-gradient text-white";
    } else if (value === "platinum") {
      return "platinum-award-gradient text-white";
    } else if (value === "gold") {
      return "gold-award-gradient text-white";
    }
    return "";
  }

  return (
    <td
      rowSpan={rowSpan}
      className={classNames(
        "not-italic font-semibold text-center capitalize border-4 border-white border-solid text-18px font-titillium text-theme-blue border-box rounded-10px whitespace-nowrap",
        cell.column.cellIsHoverable ? "group-hover:bg-theme-blue group-hover:text-white" : "",
        additionalClassName || "",
        getCellClassname(value),
        "relative"
      )}
    >
      {cellMark && (
        <div className="absolute text-center text-white rounded-full top-2px left-2px w-13px h-14px text-10px bg-theme-light-blue">
          {cellMark}
        </div>
      )}
      {cell.render("Cell")}
    </td>
  );
};
