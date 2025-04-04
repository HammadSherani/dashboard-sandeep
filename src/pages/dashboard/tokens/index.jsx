import { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import DashboardLoader from '../../../components/Loading';
import { formatDate, handleError } from '../../../utils/functions';
import axiosInstance from '../../../configs/axios.config';
import TableBody from '../../../components/shared/TableBody';
import GlobalFilter from '../../../components/partials/Table/GlobalFilter';
import { Icon } from '@iconify/react/dist/iconify.js';
import { toast } from 'react-toastify';
import Tooltip from '../../../components/ui/Tooltip';
import { useNavigate } from 'react-router-dom';
import DateFilter from '../../../components/shared/DateFilter';
import { Controller } from 'react-hook-form';

const COLUMNS = [
  {
    Header: 'User',
    accessor: 'userId.name',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'Token Type',
    accessor: () => 'Auto Generated Token',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'Created At',
    accessor: (info) => formatDate(info?.createdAt),
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'Expires At',
    accessor: (info) => formatDate(info?.expiresAt),
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'API Token',
    accessor: 'token',
    Cell: (row) => {
      const [isShow, setIsShow] = useState();
      return (
        <div className="flex items-center gap-2">
          <span>{isShow ? `${row?.cell?.value.slice(0, 25)}...` : '************'} </span>
          <button onClick={() => setIsShow((prev) => !prev)}>
            <Icon icon="mdi:eye-outline" width="18" height="18" />
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(row?.cell?.value);
              toast.success('Token Copied to Clipboard');
            }}
            title="Copy to Clipboard"
          >
            <Icon icon="tabler:copy" width="24" height="24" />
          </button>
        </div>
      );
    },
  },
  {
    Header: 'status',
    accessor: (info) => (info.status ? 'Active' : 'Revoked'),
    Cell: (row) => {
      return (
        <span className="block w-full">
          <span
            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              row?.cell?.value === 'Active' ? 'text-success-500 bg-success-500' : ''
            } 
            ${row?.cell?.value === 'Revoked' ? 'text-danger-500 bg-danger-500' : ''}
            
             `}
          >
            {row?.cell?.value}
          </span>
        </span>
      );
    },
  },
];

const BookingListings = () => {
  const navigate = useNavigate();
  const columns = useMemo(() => COLUMNS, []);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });
  const getData = useCallback(async (loading = true) => {
    try {
      setIsLoading(loading);
      const { data } = await axiosInstance.get(`/admin/token`, { signal: Controller.signal, params: { ...filters } });
      if (!data.error) {
        setData(data.data);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    getData();
  }, [getData, filters]);

  const handleStatus = async (id) => {
    try {
      const { data } = await axiosInstance.put(`/admin/token/${id}/toggle-status`);
      if (!data.error) {
        getData(false);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

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
              <div className="flex space-x-3 rtl:space-x-reverse">
                <Tooltip content={row.cell.row.original.status ? 'Revoke' : 'Active'} placement="top" arrow animation="shift-away">
                  <button className="action-btn" type="button" onClick={() => handleStatus(row.cell.row.original._id)}>
                    <Icon icon="solar:lock-bold" />
                  </button>
                </Tooltip>
                <Tooltip content={'Info'} placement="top" arrow animation="shift-away" theme="primary">
                  <button className="action-btn" type="button" onClick={() => navigate(`${row.cell.row.original._id}/details`)}>
                    <Icon icon="mingcute:information-line" />
                  </button>
                </Tooltip>
              </div>
            );
          },
        },
      ]);
    },
  );

  const { state, setGlobalFilter } = tableInstance;

  const { globalFilter } = state;
  const [isActive, setIsActive] = useState(false);

  return (
    <DashboardLoader loading={isLoading}>
      <Card noborder>
        <div className="flex justify-between items-center mb-6">
          <h4 className="card-title">API Token Management</h4>
          <div className="flex gap-2">
            <DateFilter setDate={(newValue) => setFilters((prev) => ({ ...prev, ...newValue }))} values={filters} />
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} placeholder="Search Tokens..." />
          </div>
        </div>
        <TableBody tableInstance={tableInstance} />
      </Card>
    </DashboardLoader>
  );
};

export default BookingListings;
