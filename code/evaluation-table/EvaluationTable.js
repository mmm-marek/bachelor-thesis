import { useState } from "react";
import { useTable } from "react-table";
import NextImage from "next/image";
import classNames from "classnames";

import { Button } from "@quality-registry/cruil";
import MetricsTooltip from "../tooltip/MetricsTooltip";

import { scrollBar } from "./EvaluationTable.module.scss";
import { tableHeaderCell } from "./EvaluationTable.module.scss";
import AddImage from "@/assets/components/accordion/add.svg";

const EvaluationDataCell = ({
  cell,
  cellIndex,
  row,
  rowIndex,
  onAddNoteClick,
  handleCheckboxChange,
  isRowSelected,
  allowApproval,
  allowRowspan,
}) => {
  const handleAddNoteClick = (event, rowId) => {
    event.stopPropagation();

    onAddNoteClick(rowId);
  };

  const isDupplicateCell = (cell, rowIndex) => {
    return rowIndex >= 1 && cell.value.shouldRowSpan;
  };

  const calcRowSpan = (cell) => {
    return cell.value.shouldRowSpan ? 0 : 1;
  };

  const getCellClassName = (cell, cellIndex) => {
    if (cellIndex === 0) {
      return "group-hover:bg-theme-blue group-hover:text-white whitespace-nowrap";
    }

    if (!cell.value || cell.value.applicable === false) {
      return "";
    }

    let finalClassName = "";

    if (cell.value === "gold" || cell.value.proposedLevel === "gold") {
      finalClassName += "gold-award-gradient text-white";
    } else if (cell.value === "platinum" || cell.value.proposedLevel === "platinum") {
      finalClassName += "platinum-award-gradient text-white";
    } else if (cell.value === "diamond" || cell.value.proposedLevel === "diamond") {
      finalClassName += "diamond-award-gradient text-white";
    }

    return finalClassName;
  };

  const getDataContent = () => {
    if (allowApproval && cell.value?.isCheckable) {
      return (
        <div className="w-full flex items-center mr-10px">
          <input
            id={row.original.id}
            className="cursor-pointer w-20px h-20px ml-10px mr-10px"
            type="checkbox"
            onClick={(event) => handleCheckboxChange(event, row.original.id)}
            checked={isRowSelected(row.original.id)}
            onChange={() => {}}
          />
          <label className="cursor-pointer">{cell.render("Cell")}</label>
        </div>
      );
    }
    if (cell.value?.allowAddNote) {
      return (
        <div className="flex justify-center items-center gap-5px">
          {cell.render("Cell")}
          <NextImage
            src={AddImage}
            width={15}
            height={15}
            onClick={(event) => handleAddNoteClick(event, row.original.id)}
          />
        </div>
      );
    }
    return cell.value?.applicable === false ? "N/A" : cell.render("Cell");
  };

  if (allowRowspan && isDupplicateCell(cell, rowIndex)) {
    return null;
  }

  return (
    <td
      {...cell.getCellProps()}
      rowSpan={allowRowspan ? calcRowSpan(cell) : 1}
      className={classNames(
        "text-center text-18px font-titillium font-semibold not-italic text-theme-blue",
        "border-4 border-box border-white border-solid capitalize rounded-10px",
        getCellClassName(cell, cellIndex)
      )}
    >
      {getDataContent()}
    </td>
  );
};

const EvaluationTable = ({
  data = [],
  headerColumns = [],
  onApproval = () => {},
  onRowClick = () => {},
  onAddNoteClick = () => {},
  allowApproval = false,
  allowRowspan = false,
}) => {
  const [selectedAwardsIds, setSelectedAwardsIds] = useState([]);

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipData, setTooltipData] = useState({
    x: 0,
    y: 0,
    criterionType: "",
    goldLimit: 0,
    platinumLimit: 0,
    diamondLimit: 0,
    metricName: "",
    description: "",
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    data: data,
    columns: headerColumns,
  });

  const isRowSelected = (rowId) => selectedAwardsIds.includes(rowId);

  const handleCheckboxChange = (event, rowId) => {
    event.stopPropagation();

    if (isRowSelected(rowId)) {
      setSelectedAwardsIds(selectedAwardsIds.filter((selectedRowId) => selectedRowId !== rowId));
      return;
    }
    setSelectedAwardsIds([...selectedAwardsIds, rowId]);
  };

  const handleSelectAll = () => {
    if (areAllRowsSelected()) {
      handleClearSelection();
      return;
    }
    setSelectedAwardsIds(rows.map((row) => row.original.id));
  };

  const handleOnMouseEnter = (column, event) => {
    if (!column.criteria) return;

    const { x, y } = event.target.getBoundingClientRect();

    setTooltipData({
      x: x + 60,
      y: y - 135,
      criterionType: column.criteria.criterionType,
      goldLimit: column.criteria.goldLimit,
      platinumLimit: column.criteria.platinumLimit,
      diamondLimit: column.criteria.diamondLimit,
      metricName: column.criteria.metricName,
      metricDescription: column.criteria.metricDescription,
    });
    setIsTooltipOpen(true);
  };

  const handleClearSelection = () => setSelectedAwardsIds([]);

  const isAnyRowSelected = () => selectedAwardsIds.length > 0;

  const areAllRowsSelected = () => selectedAwardsIds.length === rows.length;

  const getRowClassNames = (row) => {
    if (row.original.proposal && row.original.proposal?.superseededByproposal !== null) {
      return "opacity-60";
    }
    if (row.original.superseededByproposal) {
      return "opacity-60";
    }
    return "";
  };

  return (
    <div className="w-full overflow-hidden">
      <div
        className="fixed z-10"
        style={{ top: tooltipData.y, left: tooltipData.x, display: isTooltipOpen ? "block" : "none" }}
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
      {allowApproval && (
        <div className="w-full flex items-center pl-5px">
          <input
            className="cursor-pointer w-20px h-20px ml-10px mr-10px"
            type="checkbox"
            onClick={handleSelectAll}
            checked={areAllRowsSelected()}
            onChange={() => {}}
          />
          <label className="cursor-pointer text-18px font-titillium font-semibold text-theme-blue">Select All</label>
        </div>
      )}
      <div className={classNames("w-full overflow-x-auto  mb-10px", scrollBar)}>
        <table {...getTableProps()} className="w-full border-collapse">
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
                      onMouseEnter={(e) => handleOnMouseEnter(column, e)}
                      onMouseLeave={() => setIsTooltipOpen(false)}
                    >
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
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
                        key={`${rowIndex}-${cellIndex}`}
                        cell={cell}
                        cellIndex={cellIndex}
                        row={row}
                        rowIndex={rowIndex}
                        allowApproval={allowApproval}
                        allowRowspan={allowRowspan}
                        isRowSelected={isRowSelected}
                        handleCheckboxChange={handleCheckboxChange}
                        onAddNoteClick={onAddNoteClick}
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
          Approve
        </Button>
      )}
    </div>
  );
};

export default EvaluationTable;
