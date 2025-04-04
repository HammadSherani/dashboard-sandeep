  import { useEffect, useMemo, useState } from 'react';
  import Card from '@/components/ui/Card';
  import Icon from '@/components/ui/Icon';

  import Tooltip from '../../../components/ui/Tooltip';

  import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
  import { useNavigate } from 'react-router-dom';
  import DashboardLoader from '../../../components/Loading';
  import { formatDate, handleError } from '../../../utils/functions';
  import axiosInstance from '../../../configs/axios.config';
  import { toast } from 'react-toastify'
  import TableBody from '../../../components/shared/TableBody';
  import AddButton from '../../../components/ui/AddButton';
  import timeAgo from '../../../utils/timeAgo';

  const City = [
    {
      Header: 'City Name',
      accessor: 'name',
      Cell: (row) => {
        return (
          <div className="flex items-center gap-4">
            <span className="flex-none">
            </span>{' '}
            {row?.cell?.value.length > 25 ? `${row?.cell?.value.slice(0, 25)}...` : row?.cell?.value}
          </div>
        );
      },
    },
    {
      Header: 'State Name',
      accessor: 'stateId.name',
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

  const CityListings = () => {
    
    const navigate = useNavigate();
    const columns = useMemo(() => City, []);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleStatusChange = async (id) => {
      try {
        const { data } = await axiosInstance.put(`/admin/city/${id}/toggle-status`);
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

    const handleDelete = async (id) => {
      try {
        const { data } = await axiosInstance.delete(`/admin/city/${id}/delete`);
        if (!data.error) {
          setData((prev) => prev.filter((item) => item._id !== id));
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
          const { data } = await axiosInstance.get(`/admin/city`, { signal: controller.signal });
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
            Header: 'action',
            accessor: 'action',
            Cell: (row) => {
              return (
                <>
                  <div className="flex space-x-2">
                    <Tooltip content={row.cell.row.original.status ? 'Private' : 'Public'} placement="top" arrow animation="shift-away" theme="primary">
                      <button className="action-btn" type="button" onClick={() => handleStatusChange(row.cell.row.original._id)}>
                        <Icon icon="solar:lock-line-duotone" />
                      </button>
                    </Tooltip>
                    {/* <Tooltip content={'Edit'} placement="top" arrow animation="shift-away" theme="primary">
                      <button className="action-btn" type="button" onClick={() => navigate(`${row.cell.row.original.url}/edit`)}>
                        <Icon icon="mingcute:edit-line" />
                      </button>
                    </Tooltip> */}

                    <Tooltip content={'Delete'} placement="top" arrow animation="shift-away" theme="primary">
                      <button className="action-btn" type="button" onClick={() => handleDelete(row.cell.row.original._id)}>
                        <Icon icon="heroicons-outline:trash" />
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


    return (
      <>
        {isLoading ? (
          <DashboardLoader />
        ) : (
          <>
            <Card noborder>
              <div className="flex justify-between items-center mb-6">
                <h4 className="card-title">City Management</h4>
                <AddButton/>
              </div>
              <TableBody tableInstance={tableInstance} />
            </Card>
          </>
        )}
      </>
    );
  };

  export default CityListings;