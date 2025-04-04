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
import AddButton from '../../../components/ui/AddButton';

const StateColumns = [
  {
    Header: 'State Name',
    accessor: 'name',
    Cell: (row) => (
      <span>
        {row?.cell?.value.length > 25 ? `${row?.cell?.value.slice(0, 25)}...` : row?.cell?.value}
      </span>
    ),
  },
  {
    Header: 'Date Created',
    accessor: 'createdAt',
    Cell: (row) => <span>{formatDate(row?.cell?.value)}</span>,
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: (row) => (
      <span
        className={`inline-block px-3 min-w-[80px] text-center py-1 rounded-full ${
          row?.cell?.value ? 'bg-success-500 text-white' : 'bg-danger-500 text-white'
        }`}
      >
        {row?.cell?.value ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];

const StateListings = () => {
  const navigate = useNavigate();
  const columns = useMemo(() => StateColumns, []);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleStatusChange = async (id) => {
    try {
      const { data } = await axiosInstance.put(`/admin/state/${id}/toggle-status`);
      if (!data.error) {
        setData((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: !item.status } : item))
        );
        toast.success(data.message || 'Status updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/admin/state/${id}/delete`);
      if (!data.error) {
        setData((prev) => prev.filter((item) => item._id !== id));
        toast.success(data.message || 'Deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get('/admin/state', { signal: controller.signal });
        setData(data.data);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    return () => controller.abort();
  }, []);

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
          Header: 'Actions',
          accessor: 'action',
          Cell: (row) => (
            <div className="flex space-x-2">
              <Tooltip
                content={row.cell.row.original.status ? 'Deactivate' : 'Activate'}
                placement="top"
                arrow
                animation="shift-away"
                theme="primary"
              >
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => handleStatusChange(row.cell.row.original._id)}
                >
                  <Icon icon="solar:lock-line-duotone" />
                </button>
              </Tooltip>
              <Tooltip content="Delete" placement="top" arrow animation="shift-away" theme="primary">
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => handleDelete(row.cell.row.original._id)}
                >
                  <Icon icon="heroicons-outline:trash" />
                </button>
              </Tooltip>
              {/* <Tooltip content="Info" placement="top" arrow animation="shift-away" theme="primary">
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => navigate(`${row.cell.row.original._id}/info`)}
                >
                  <Icon icon="mingcute:information-line" />
                </button>
              </Tooltip> */}
            </div>
          ),
        },
      ]);
    }
  );

  return (
    <>
      {isLoading ? (
        <DashboardLoader />
      ) : (
        <Card noborder>
          <div className="flex justify-between items-center mb-6">
            <h4 className="card-title">State Management</h4>
            <AddButton />
          </div>
          <TableBody tableInstance={tableInstance} />
        </Card>
      )}
    </>
  );
};

export default StateListings;
