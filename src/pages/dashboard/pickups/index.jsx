import { useEffect, useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import DashboardLoader from '../../../components/Loading';
import { formatDate, handleError } from '../../../utils/functions';
import axiosInstance from '../../../configs/axios.config';
import TableBody from '../../../components/shared/TableBody';
import Button from '../../../components/ui/Button';
import GlobalFilter from '../../../components/partials/Table/GlobalFilter';
import Tooltip from '../../../components/ui/Tooltip';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useNavigate } from 'react-router-dom';
import DateFilter from '../../../components/shared/DateFilter';


const Pickup = [
  {
    Header: 'Pickup Code',
    accessor: 'pickupCode',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'Pickup Address',
    accessor: 'address.name',
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: 'Assigned Rider',
    accessor: 'assignedRider.name',
    Cell: (row) => {
      return <span>{row?.cell?.value || "Rider Not Assigned"}</span>;
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
    accessor: 'pickupStatus',
    Cell: (row) => {
      return (
        <span
          className={` inline-block px-3 min-w-[80px] text-center  py-1 rounded-[999px] bg-opacity-25 
            ${row?.cell?.value === "Pending" ? 'text-warning-500 bg-warning-500' : ''} 
            ${row?.cell?.value === "Assigned" ? 'text-secondary-500 bg-secondary-500' : ''} 
            ${row?.cell?.value === "Pickuped" ? 'text-primary-500 bg-primary-500' : ''} 
            ${row?.cell?.value === "Intransit" ? 'text-orange-500 bg-orange-500' : ''} 
              ${row?.cell?.value === "Returned" ? 'text-danger-500 bg-danger-500' : ''}
              ${row?.cell?.value === "Delivered" ? 'text-success-500  bg-success-500' : ''}
              
               `}
        >
          {row?.cell?.value}
        </span>
      );
    },
  },
];

const PickupListings = () => {
  const navigate = useNavigate();
  const columns = useMemo(() => Pickup, []);
  const [data, setData] = useState([]);
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
        const { data } = await axiosInstance.get(`/admin/pickup`, { signal: controller.signal, params: { ...filters } });
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
    // (hooks) => {
    //   hooks.visibleColumns.push((columns) => [...columns]);
    // },
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
                  {row.cell.row.original.pickupStatus === "Pending" && (<Tooltip content={'Assign Rider'} placement="top" arrow animation="shift-away" theme="primary">
                    <button className="action-btn" type="button" onClick={() => navigate(`/dashboard/pickups/${row.cell.row.original._id}/assign-rider`)}>
                      <Icon icon="humbleicons:bike" width="30" height="30" />
                    </button>
                  </Tooltip>)}
                  <Tooltip content={'Info'} placement="top" arrow animation="shift-away" theme="primary">
                    <button className="action-btn" type="button" onClick={() => navigate(`${row.cell.row.original._id}/info`)}>
                      <Icon icon="mingcute:information-line" />
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
          <h4 className="card-title">Pickups</h4>
          <div className="flex gap-2">
            <DateFilter setDate={(newValue) => setFilters((prev) => ({ ...prev, ...newValue }))} values={filters} />
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} placeholder="Search Pickup..." />
          </div>
        </div>
        <TableBody tableInstance={tableInstance} />
      </Card>
    </DashboardLoader>
  );
};

export default PickupListings;
