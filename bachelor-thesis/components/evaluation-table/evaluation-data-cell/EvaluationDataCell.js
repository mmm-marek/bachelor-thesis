import { BasicDataCell } from "./BasicDataCell";
import { FunctionalDataCell } from "./FunctionalDataCell";
import { SelectableDataCell } from "./SelectableDataCell";
import { EvaluatedDataCell } from "./EvaluatedDataCell";

export const cellTypes = {
  basic: "basic",
  functional: "functional",
  selectable: "selectable",
  evaluated: "evaluated",
};

/**
 * Creates one cell of the EvaluationTable, based on the cellType provided in the column.
 * This cell type can be accessed via cell.column.cellType.
 *
 * @component
 * @param {*} cell - Created by react-table. Contains the cell data.
 * @param {*} onAddSignClick - Callback function that is called when the user clicks on the add note button.
 * It receives the id of the row as a parameter.
 * @param {*} onCheckboxChange - Callback function that is called when the user clicks on the checkbox.
 * It receives the event and the row as parameters.
 * @param {*} isRowSelected - boolean determines whether the row in which the cell is placed was selected.
 * @param {*} cellMark - string that is displayed in the top left corner of the cell.
 * @returns One cell of the EvaluationTable.
 */
export const EvaluationDataCell = ({ cell, onAddSignClick, onCheckboxChange, isRowSelected, cellMark }) => {
  const row = cell.row;
  const rowIndex = cell.row.index;

  if (cell.column.spanFirstCell && rowIndex > 0) {
    return null;
  }
  switch (cell.column.cellType) {
    case cellTypes.selectable:
      return (
        <SelectableDataCell
          cell={cell}
          onCheckboxChange={(event) => onCheckboxChange(event, row)}
          checked={isRowSelected}
          cellMark={cellMark}
        />
      );
    case cellTypes.functional:
      return (
        <FunctionalDataCell cell={cell} onAddSignClick={() => onAddSignClick(row.original.id)} cellMark={cellMark} />
      );
    case cellTypes.evaluated:
      return (
        <EvaluatedDataCell
          cell={cell}
          value={typeof cell.value === "string" ? cell.value : getEvaluatedLevel(cell.value, cell.column.criteria)}
          cellMark={cellMark}
        />
      );
    default:
      return (
        <BasicDataCell
          cell={cell}
          text={cell.render("Cell")}
          hoverable={cell.column.cellIsHoverable}
          rowSpan={cell.column.spanFirstCell ? 0 : 1}
          cellMark={cellMark}
        />
      );
  }

  /**
   * Calculates the level of the evaluated cell based on the value and the criteria
   * @param {number} value
   * @param {{
   *  diamondLimit: number,
   *  platinumLimit: number,
   *  goldLimit: number
   * }} criteria
   * @returns
   */
  function getEvaluatedLevel(value, criteria) {
    if (!criteria) {
      return "";
    }

    if (value >= criteria.diamondLimit) {
      return "diamond";
    }
    if (value >= criteria.platinumLimit) {
      return "platinum";
    }
    if (value >= criteria.goldLimit) {
      return "gold";
    }
  }
};
