import { useEffect, useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import DashboardLoader from '../../../components/Loading';
import { formatDate, formatPrice, handleError } from '../../../utils/functions';
import axiosInstance from '../../../configs/axios.config';
import TableBody from '../../../components/shared/TableBody';
import GlobalFilter from '../../../components/table/react-tables/GlobalFilter';
import DateFilter from '../../../components/shared/DateFilter';
import Tooltip from '../../../components/ui/Tooltip';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useNavigate } from 'react-router-dom';
const Booking = [
  {
    Header: 'Booking Code',
    accessor: 'qrCode',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'Booked BY',
    accessor: 'user.name',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },

  {
    Header: 'Booked For',
    accessor: 'name',
    Cell: (row) => {
      return (
        <div className="flex items-center gap-4">
          <span className="flex-none"></span> {row?.cell?.value.length > 25 ? `${row?.cell?.value.slice(0, 25)}...` : row?.cell?.value}
        </div>
      );
    },
  },
  {
    Header: 'company',
    accessor: 'company',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },

  {
    Header: 'phone',
    accessor: 'phone',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'Payment',
    accessor: 'paymentMethod',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'Charges',
    accessor: 'charges',
    Cell: (row) => {
      return <span>{formatPrice(row?.cell?.value)}</span>;
    },
  },
  {
    Header: 'State',
    accessor: 'state',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'City',
    accessor: 'city',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'Postal Code',
    accessor: 'postalCode',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'Date',
    accessor: 'createdAt',
    Cell: (row) => {
      return <span>{formatDate(row?.cell?.value)}</span>;
    },
  },

  {
    Header: 'status',
    accessor: 'status',
    Cell: (row) => {
      return (
        <span className="flex gap-2 w-full flex-wrap">
          <>
            <span
              className={` inline-block px-3 min-w-[80px] text-center  py-1 rounded-[999px] bg-opacity-25 ${row?.cell?.value ? 'text-success-500 bg-success-500' : ''} 
              ${!row?.cell?.value ? 'text-danger-500 bg-danger-500' : ''}
              
              `}
            >
              {row?.cell?.value ? 'Public' : 'Private'}
            </span>
          </>
        </span>
      );
    },
  },
];

const BookingListings = () => {
  const columns = useMemo(() => Booking, []);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(`/admin/booking`, { signal: controller.signal, params: { ...filters } });
        setData(data.data);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();

    return () => {
      controller.abort();
    };
  }, [filters]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        ...columns,
        {
          Header: 'action',
          accessor: 'action',
          Cell: (row) => {
            return (
              <>
                <div className="flex space-x-2">
                  <Tooltip content={'Invoice'} placement="top" arrow animation="shift-away" theme="primary">
                    <button className="action-btn" type="button" onClick={() => navigate(`${row.cell.row.original.qrCode}/invoice`)}>
                      <Icon icon="vaadin:invoice" />
                    </button>
                  </Tooltip>
                  <Tooltip content={'Details'} placement="top" arrow animation="shift-away" theme="secondary">
                    <button className="action-btn" type="button" onClick={() => navigate(`${row.cell.row.original.qrCode}/history`)}>
                      <Icon icon="pajamas:details-block" />
                    </button>
                  </Tooltip>
                </div>
              </>
            );
          },
        },
      ]);
    },
  );

  const { state, setGlobalFilter } = tableInstance;

  const { globalFilter } = state;

  return (
    <DashboardLoader loading={isLoading}>
      <Card noborder>
        <div className="flex justify-between items-center mb-6">
          <h4 className="card-title">Bookings</h4>
          <div className="flex gap-2">
            <DateFilter setDate={(newValue) => setFilters((prev) => ({ ...prev, ...newValue }))} values={filters} />
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} placeholder="Search Bookings..." />
          </div>
        </div>
        <TableBody tableInstance={tableInstance} />
      </Card>
    </DashboardLoader>
  );
};

export default BookingListings;
