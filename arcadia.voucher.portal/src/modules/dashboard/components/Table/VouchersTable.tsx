import React, { useEffect } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTableSortingWithRouting,
  getDateTimeFormatted,
  ITEMS_PER_PAGE,
  TableFooter,
  usePagination,
  VouchersStatus,
  useSearchParams,
} from 'arcadia-common-fe';
import { useDispatch, useSelector } from 'react-redux';
import { dashboardReducerSelector } from '../../state/selectors';
import { getVouchers } from '../../state/actions';

interface IVouchersTableProps {
}

const headCells = [
  { key: 'status', label: 'Status' },
  { key: 'id', label: 'Voucher ID' },
  { key: 'operatorName', label: 'Operator Name' },
  { key: 'playerCid', label: 'Player CID' },
  { key: 'groupName', label: 'Group Name' },
  { key: 'grantedDate', label: 'Granted' },
  { key: 'expirationDate', label: 'Expiration' },
];

export const VouchersTable: React.FC<IVouchersTableProps> = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { sortBy, sortOrder, createSortHandler } = useTableSortingWithRouting();
  const { forcePage, handlePageChange } = usePagination();
  const { offset = '0' } = searchParams;
  const {
    total, isVouchersLoading, vouchers,
  } = useSelector(dashboardReducerSelector);

  useEffect(() => {
    dispatch(getVouchers({
      ...searchParams,
      take: ITEMS_PER_PAGE,
    }));
  }, [searchParams]);

  return (
    <>
      <Table
        isLoading={isVouchersLoading}
        count={total}
      >
        <TableHead>
          <TableRow>
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
            vouchers.map((voucher, i) => (
              <TableRow
                key={voucher.id}
              >
                <TableCell>{Number(offset) + (i + 1)}</TableCell>
                <TableCell>
                  <VouchersStatus status={voucher.status} />
                </TableCell>
                <TableCell>
                  {voucher.id}
                </TableCell>
                <TableCell>
                  {voucher.operatorName}
                </TableCell>
                <TableCell>
                  {voucher.playerCid}
                </TableCell>
                <TableCell>
                  {voucher.groupName}
                </TableCell>
                <TableCell>
                  {getDateTimeFormatted(voucher.grantedDate)}
                </TableCell>
                <TableCell>
                  {getDateTimeFormatted(voucher.expirationDate)}
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <TableFooter
        total={total}
        itemsPerPage={ITEMS_PER_PAGE}
        paginationProps={{
          forcePage,
          onPageChange: handlePageChange,
        }}
      />
    </>
  );
};
