import classNames from "classnames";
import { tableHeaderCell } from "./EvaluationTable.module.scss";

/**
 * A component that renders the header of the Evaluation table
 * @param {object} headerGroups - Array of header groups.
 * @param {function} onMouseEnter - Function that will be called when the mouse enters a cell.
 * It will receive the column and an event triggered when the mouse entered this column as a parameter.
 * @param {function} onMouseLeave - Function that will be called when the mouse leaves a cell.
 * It will receive the column and an event triggered when the mouse left this column as a parameter.
 * @returns Evaluation table header React component
 */
export const EvaluationTableHeader = ({ headerGroups, onMouseLeave, onMouseEnter }) => {
  return (
    <thead>
      {headerGroups.map((headerGroup) => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => {
            return (
              <th
                {...column.getHeaderProps()}
                className={classNames(
                  "text-18px font-titillium font-semibold text-white whitespace-pre-wrap",
                  "bg-theme-blue border-4 border-solid border-white px-10px",
                  tableHeaderCell
                )}
                onMouseEnter={(e) => onMouseEnter(column, e)}
                onMouseLeave={(e) => onMouseLeave(column, e)}
              >
                {column.render("Header")}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
};
