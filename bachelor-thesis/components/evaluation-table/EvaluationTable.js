import { useEffect, useState, useRef } from "react";
import { useTable } from "react-table";
import classNames from "classnames";
import { useTranslation } from "next-i18next";

import { MetricsTooltip } from "../../tooltip/MetricsTooltip";
import { Button } from "@quality-registry/cruil";
import { scrollBar } from "./EvaluationTable.module.scss";
import { EvaluationDataCell } from "./evaluation-data-cell/EvaluationDataCell";
import { EvaluationTableHeader } from "./EvaluationTableHeader";

/**
 * Renders a React table component with the provided data and columns
 *
 * @component
 * @param {*} data - Array of rows (objects) with the following properties:
 * - id: the id of the row
 * - proposal: optional object. If this object has a propery called 'superseededByProposal' and this
 * property is not null, the row will be marked with a grey background
 * - ...other data, from which the columns will access the values that will be rendered in the table.
 * @param {*} headerColumns - Array of objects with the following properties:
 * - Header: { string } / The header text
 *
 * - accessor: { string | function } / The name of the property in the row object that will be used to access the value or a function,
 * that will take a row as a parameter and return some value from the row
 *
 * - Cell: { optional function } / A function that will be used to render the cell.
 * It will get the value received from the accessor function as a parameter.
 * If not provided, the default function will render the value of the cell.
 *
 * - cellType: { optional string } / The type of the cell. Can be one of the following: 'basic', 'selectable', 'functional', 'evaluated'.
 * If the value of evaluated cell is string, it will get a background based on the value of this string.
 * If the value is a number, it will get a background based on the value of this number and the criteria provided in the column.
 * If cellType is not provided, the default type is 'basic'.
 *
 * - cellIsHoverable: { optional boolean } / If true, the cell will have a hover effect.
 *  If not provided, the default value is false
 *
 * - criteria: { optional object } / The criteria for the evaluated cell.
 * If the cellType is 'evaluated' and the values accessed by the accesor for this column are numbers, this property is required.
 * It is also used to create a tooltip for the corresponding column.
 * This object has to have these properties: diamondLimit, platinumLimit, goldLimit as numbers,
 * and strings metricName, description and criterionType.
 *
 * - spanFirstCell: { optional boolean } / If true, the first cell will be spanned accross all rows of the corresponding column.
 * If not provided, the default value is false.
 *
 * @param {*} allowApproval - If true, the approval button will be rendered.
 * @param {*} isMarkedRow - Function that will be used to determine if a row should be marked.
 * It will receive the row as a parameter and should return true if the row should be marked.
 * @param {*} rowMark - A letter that will be rendered for the marked rows in the top left corner.
 * @param {*} onRowClick - Function that will be called when a row is clicked.
 *  It will receive the id of the row as a parameter.
 * @param {*} onApproval - Function that will be called when the approval button is clicked.
 *  It will receive an array of IDs of the the selected rows.
 * @param {*} onAddNoteClick - Function that will be called when the add note button is clicked.
 *  It will receive the id of the corresponding row as a parameter.
 * @returns Evaluation table React component
 */
export const EvaluationTable = ({
  data,
  headerColumns,
  allowApproval = false,
  isMarkedRow = () => false,
  rowMark = "",
  onRowClick = () => {},
  onApproval = () => {},
  onAddNoteClick = () => {},
}) => {
  const { t } = useTranslation("evaluation");

  const [selectedAwardsIds, setSelectedAwardsIds] = useState([]);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  const tooltipContainerRef = useRef(null);

  useEffect(() => {
    setSelectedAwardsIds([]);
  }, [data]);

  useEffect(() => {
    getTooltipHeight();
  }, [tooltipData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    data,
    columns: headerColumns,
  });

  function isRowSelected(row) {
    return selectedAwardsIds.includes(row);
  }

  function handleCheckboxChange(event, row) {
    event.stopPropagation();

    if (isRowSelected(row)) {
      setSelectedAwardsIds((oldSelectedAwards) => oldSelectedAwards.filter((selectedRow) => selectedRow !== row));
      return;
    }
    setSelectedAwardsIds((oldSelectedAwards) => [...oldSelectedAwards, row]);
  }

  function handleSelectAll() {
    if (areAllRowsSelected()) {
      handleClearSelection();
      return;
    }
    setSelectedAwardsIds(rows);
  }

  function handleOnMouseEnter(column, event) {
    if (!column.criteria) {
      return;
    }

    const { x, y } = event.target.getBoundingClientRect();

    setTooltipData({
      x,
      y,
      criterionType: column.criteria.criterionType,
      goldLimit: column.criteria.goldLimit,
      platinumLimit: column.criteria.platinumLimit,
      diamondLimit: column.criteria.diamondLimit,
      metricName: column.criteria.metric.name,
      metricDescription: column.criteria.metric.description,
    });
  }

  function handleClearSelection() {
    setSelectedAwardsIds([]);
  }

  function isAnyRowSelected() {
    return selectedAwardsIds.length > 0;
  }

  function areAllRowsSelected() {
    return selectedAwardsIds.length === rows.length && rows.length > 0;
  }

  function getRowClassNames(row) {
    if (!isMarkedRow(row)) {
      return "";
    }
    return "bg-gray";
  }

  function getTooltipHeight() {
    if (!tooltipContainerRef.current) {
      return 0;
    }
    setTooltipHeight(tooltipContainerRef.current.getBoundingClientRect().height);
  }

  return (
    <div className="w-full overflow-hidden">
      {tooltipData && (
        <div
          className="fixed z-10"
          style={{
            top: tooltipData.y - tooltipHeight, // vertical offset of the tooltip
            left: tooltipData.x - 300, // horizontal offset of the tooltip to the corresponding column
          }}
          ref={tooltipContainerRef}
        >
          <MetricsTooltip
            criterionType={tooltipData.criterionType}
            goldLimit={tooltipData.goldLimit}
            platinumLimit={tooltipData.platinumLimit}
            diamondLimit={tooltipData.diamondLimit}
            metricName={tooltipData.metricName}
            metricDescription={tooltipData.metricDescription}
          />
        </div>
      )}
      {allowApproval && (
        <div className="flex items-center w-full pl-5px">
          <input
            className="cursor-pointer w-20px h-20px ml-10px mr-10px"
            type="checkbox"
            onClick={handleSelectAll}
            checked={areAllRowsSelected()}
            onChange={() => {}}
          />
          <label className="font-semibold cursor-pointer text-18px font-titillium text-theme-blue">
            {t("select_all")}
          </label>
        </div>
      )}
      <div className={classNames("w-full overflow-x-auto  mb-10px", scrollBar)}>
        <table {...getTableProps()} className="w-full border-collapse">
          <EvaluationTableHeader
            headerGroups={headerGroups}
            onMouseLeave={() => setTooltipData(null)}
            onMouseEnter={(column, e) => handleOnMouseEnter(column, e)}
          />
          <tbody {...getTableBodyProps()}>
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  onClick={() => onRowClick(row.original.id)}
                  className={classNames("cursor-pointer group", getRowClassNames(row))}
                >
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <EvaluationDataCell
                        key={`${rowIndex}-${cellIndex}-${row.original.id}}`}
                        cell={cell}
                        isRowSelected={isRowSelected(row)}
                        onCheckboxChange={handleCheckboxChange}
                        onAddSignClick={onAddNoteClick}
                        cellMark={isMarkedRow(row) && cellIndex === 0 ? rowMark : undefined}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {allowApproval && (
        <Button
          className="mr-auto mt-10px"
          onClick={() => onApproval(selectedAwardsIds)}
          isDisabled={!isAnyRowSelected()}
        >
          {t("approve")}
        </Button>
      )}
    </div>
  );
};
