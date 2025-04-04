import { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import DashboardLoader from '../../../components/Loading';
import { formatDate } from '../../../utils/functions';
import TableBody from '../../../components/shared/TableBody';
import GlobalFilter from '../../../components/partials/Table/GlobalFilter'



const Booking = [
  {
    Header: 'Invoice',
    accessor: 'code',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'Start Data',
    accessor: 'startDate',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },

  {
    Header: 'End Data',
    accessor: 'endDate',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },

  //   {
  //     Header: 'Date',
  //     accessor: 'createdAt',
  //     Cell: (row) => {
  //       return <span>{formatDate(row?.cell?.value)}</span>;
  //     },
  //   },

  {
    Header: 'status',
    accessor: 'status',
    Cell: (row) => {
      return (
        <span className="flex gap-2 w-full flex-wrap">
          <>
            <span
              className={` inline-block px-3 min-w-[80px] text-center  py-1 rounded-[999px] bg-opacity-25 ${row?.cell?.value === 'PAID' ? 'text-success-500 bg-success-500' : ''} 
              ${row?.cell?.value === 'UNPAID' ? 'text-danger-500 bg-danger-500' : ''}
              
              `}
            >
              {row?.cell?.value}
            </span>
          </>
        </span>
      );
    },
  },
];

const BookingListings = () => {
  const columns = useMemo(() => Booking, []);
  const [data, setData] = useState([
    { code: 'AFZ24-09-010', startDate: '01-Sep-2024', endDate: '30-Sep-2024', status: 'UNPAID' },
    { code: 'AFZ24-09-015', startDate: '01-Aug-2024', endDate: '30-Aug-2024', status: 'PAID' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [...columns]);
    },
  );

  const { state, setGlobalFilter } = tableInstance;

  const { globalFilter } = state;

  return (
    <DashboardLoader loading={isLoading}>
      <Card noborder>
        <div className="flex justify-between items-center mb-6">
          <h4 className="card-title">Invoices</h4>
          <div className="flex gap-2">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} placeholder="Search Invoices..." />
          </div>
        </div>
        <TableBody tableInstance={tableInstance} />
      </Card>
    </DashboardLoader>
  );
};

export default BookingListings;
