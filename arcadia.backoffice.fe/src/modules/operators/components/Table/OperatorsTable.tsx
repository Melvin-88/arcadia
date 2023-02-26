import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ExpandBtn,
  useTableSortingWithRouting,
  useExpand,
  convertDataToJSON,
} from 'arcadia-common-fe';
import {
  IOperators, OperatorAction, OperatorId, IOperator,
} from '../../types';
import { OperatorsStatus } from './OperatorsStatus/OperatorsStatus';
import { OperatorDetails } from './OperatorDetails/OperatorDetails';
import { setOperatorDialogForm, setOperatorsDialogAction } from '../../state/actions';
import { OperatorDialogAction } from './OperatorDialogAction/OperatorDialogAction';
import { setDialogJSONViewer } from '../../../DialogJSONViewer/actions';
import { HistoryDialog } from '../../../history/HistoryDialog/HistoryDialog';
import { getHistoryData } from '../../../history/state/actions';
import { HistoryType } from '../../../history/types';

interface IOperatorsTableProps {
  isLoading: boolean
  total: number
  offset: number
  operators: IOperators
}

const headCells = [
  { key: 'status', label: 'Status' },
  { key: 'id', label: 'Operator ID' },
  { key: 'name', label: 'Operator Name' },
];

export const OperatorsTable: React.FC<IOperatorsTableProps> = ({
  isLoading,
  total,
  offset,
  operators,
}) => {
  const dispatch = useDispatch();
  const { sortBy, sortOrder, createSortHandler } = useTableSortingWithRouting();
  const {
    handleExpand, handleResetExpand, isExpanded,
  } = useExpand();

  useEffect(() => {
    handleResetExpand();
  }, [operators]);

  const handleEdit = useCallback((id: number) => {
    const operator = operators.find((item) => item.id === id);

    dispatch(setOperatorDialogForm({
      isOpen: true,
      initialValues: operator,
    }));
  }, [operators]);

  const handleSetDialogAction = useCallback((id: number, action: OperatorAction) => {
    dispatch(setOperatorsDialogAction({
      id,
      action,
      isOpen: true,
    }));
  }, []);

  const handleEnable = useCallback((id: number) => {
    handleSetDialogAction(id, OperatorAction.enable);
  }, [handleSetDialogAction]);

  const handleDisable = useCallback((id: number) => {
    handleSetDialogAction(id, OperatorAction.disable);
  }, [handleSetDialogAction]);

  const handleRemove = useCallback((id: number) => {
    handleSetDialogAction(id, OperatorAction.remove);
  }, [handleSetDialogAction]);

  const handleOpenRegulationJSON = useCallback((id: OperatorId) => {
    const currentOperator = operators.find((operator: IOperator) => operator.id === id);

    dispatch(setDialogJSONViewer({
      isOpen: true,
      JSON: convertDataToJSON(currentOperator?.regulation),
    }));
  }, [operators]);

  const handleOpenHistory = useCallback((id) => {
    dispatch(getHistoryData({
      id,
      historyType: HistoryType.operators,
    }));
  }, []);

  return (
    <>
      <Table
        isLoading={isLoading}
        count={total}
      >
        <TableHead>
          <TableRow>
            <TableCell isContentWidth />
            <TableCell isContentWidth />
            { headCells.map(({ key, label }) => (
              <TableCell
                key={key}
                sortOrder={sortBy === key ? sortOrder : undefined}
                onClick={createSortHandler(key)}
              >
                { label }
              </TableCell>
            )) }
          </TableRow>
        </TableHead>

        <TableBody>
          {
            operators.map((operator, i) => (
              <TableRow
                key={operator.id}
                isExpand={isExpanded(operator.id)}
                expandComponent={(
                  <>
                    <TableCell colSpan={2} />
                    <TableCell className="groups-table__details-cell" colSpan={3}>
                      <OperatorDetails
                        {...operator}
                        onEdit={handleEdit}
                        onEnable={handleEnable}
                        onDisable={handleDisable}
                        onRemove={handleRemove}
                        onOpenRegulationJSON={handleOpenRegulationJSON}
                        onOpenHistory={handleOpenHistory}
                      />
                    </TableCell>
                  </>
                )}
                onExpand={() => handleExpand(operator.id)}
              >
                <TableCell>{offset + i + 1}</TableCell>
                <TableCell>
                  <ExpandBtn isActive={isExpanded(operator.id)} />
                </TableCell>
                <TableCell>
                  <OperatorsStatus status={operator.status} />
                </TableCell>
                <TableCell>{operator.id}</TableCell>
                <TableCell>{operator.name}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <OperatorDialogAction />
      <HistoryDialog />
    </>
  );
};
