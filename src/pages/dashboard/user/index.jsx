import { useEffect, useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import Tooltip from '../../../components/ui/Tooltip';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { useNavigate } from 'react-router-dom';
import DashboardLoader from '../../../components/Loading';
import { formatDate, handleError } from '../../../utils/functions';
import axiosInstance from '../../../configs/axios.config';
import { toast } from 'react-toastify';
import TableBody from '../../../components/shared/TableBody';
import GlobalFilter from '../../../components/partials/Table/GlobalFilter';
import DateFilter from '../../../components/shared/DateFilter';

const Rider = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: (row) => {
      return (
        <div className="flex items-center gap-4">
          <span className="flex-none">{/* <img className="w-12 h-12 rounded-full" src={formatImageName(row.row.original.card)} alt={row?.cell?.value} /> */}</span>{' '}
          {row?.cell?.value.length > 25 ? `${row?.cell?.value.slice(0, 25)}...` : row?.cell?.value}
        </div>
      );
    },
  },
  {
    Header: 'email',
    accessor: 'email',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'Number',
    accessor: 'phoneNumber',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'state',
    accessor: 'state',
    Cell: (row) => {
      return <span>{row?.cell?.value || 0}</span>;
    },
  },
  {
    Header: 'city',
    accessor: 'city',
    Cell: (row) => {
      return <span>{row?.cell?.value || 0}</span>;
    },
  },
  {
    Header: 'Date',
    accessor: (info) => formatDate(info.createdAt),
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'status',
    accessor: 'status',
    Cell: (row) => {
      return (
        <span
          className={` inline-block px-3 min-w-[80px] text-center  py-1 rounded-[999px] bg-opacity-25 ${row?.cell?.value ? 'text-success-500 bg-success-500' : ''} 
              ${!row?.cell?.value ? 'text-danger-500 bg-danger-500' : ''}
              
               `}
        >
          {row?.cell?.value ? 'Public' : 'Private'}
        </span>
      );
    },
  },
];

const RiderManagement = () => {
  const navigate = useNavigate();
  const columns = useMemo(() => Rider, []);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    address: '',
    startDate: '',
    endDate: '',
  });

  const handleStatusChange = async (id) => {
    try {
      const { data } = await axiosInstance.put(`/admin/user/${id}/toggle-status`);
      if (!data.error) {
        setData((prev) => prev.map((item) => (item._id === id ? { ...item, status: !item.status } : item)));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(`/admin/user`, { signal: controller.signal, params: { ...filters } });
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
                  <Tooltip content={row.cell.row.original.status ? 'Private' : 'Public'} placement="top" arrow animation="shift-away" theme="default">
                    <button className="action-btn" type="button" onClick={() => handleStatusChange(row.cell.row.original._id)}>
                      <Icon icon="solar:lock-line-duotone" />
                    </button>
                  </Tooltip>
                  <Tooltip content={'Info'} placement="top" arrow animation="shift-away" theme="primary">
                    <button className="action-btn" type="button" onClick={() => navigate(`${row.cell.row.original._id}/info`)}>
                      <Icon icon="mingcute:information-line" />
                    </button>
                  </Tooltip>
                  <Tooltip content={'Charges'} placement="top" arrow animation="shift-away" theme="primary">
                    <button className="action-btn" type="button" onClick={() => navigate(`${row.cell.row.original._id}/charges`)}>
                      <Icon icon="entypo:price-tag" />
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
    <>
      {isLoading ? (
        <DashboardLoader />
      ) : (
        <>
          <Card noborder>
            <div className="flex justify-between items-center mb-6">
              <h4 className="card-title">Users</h4>
              <div className="flex gap-2">
                <DateFilter setDate={(newValue) => setFilters((prev) => ({ ...prev, ...newValue }))} values={filters} />
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} placeholder="Search Users..." />
              </div>
            </div>
            <TableBody tableInstance={tableInstance} />
          </Card>
        </>
      )}
    </>
  );
};

export default RiderManagement;
