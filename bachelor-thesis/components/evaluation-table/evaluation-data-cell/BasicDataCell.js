import classNames from "classnames";

export const BasicDataCell = ({ cell, additionalClassName, cellMark }) => {
  const rowSpan = cell.column.spanFirstCell ? 0 : 1;

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
      {cell.render("Cell")}
    </td>
  );
};
