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
import GlobalFilter from '../../../components/partials/Table/GlobalFilter';
import DateFilter from '../../../components/shared/DateFilter';
import SalaryModel from '../../../components/shared/salaryModel';

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
    Header: 'nicNumber',
    accessor: 'nicNumber',
    Cell: (row) => {
      return <span>{row?.cell?.value || 0}</span>;
    },
  },
  {
    Header: 'license',
    accessor: 'licenseNumber',
    Cell: (row) => {
      return <span>{row?.cell?.value || 0}</span>;
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
  {
    Header: 'Salary',
    accessor: 'salary',
    Cell: (row) => {
      return (
        <span
          className={` inline-block px-3 min-w-[80px] text-center  py-1 rounded-[999px] bg-opacity-25 ${row?.cell?.value ? 'text-success-500 bg-success-500' : ''} 
              ${!row?.cell?.value ? 'text-danger-500 bg-danger-500' : ''}
              
               `}
        >
          {row?.cell?.value ? 'Paid' : 'Unpaid'}
        </span>
      );
    },
  },
];

const Analytics = () => {
  const [selectedRider, setSelectedRider] = useState(null);
  const navigate = useNavigate();
  const columns = useMemo(() => Rider, []);
  const [data, setData] = useState([]);
  console.log(data)
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });
//   const openSalaryModel = (rider) => {
//     setSelectedRider(rider);
//   };

//   const handleStatusChange = async (id) => {
//     try {
//       const { data } = await axiosInstance.put(`/admin/riders/toggle-status/${id}`);
//       if (!data.error) {
//         setData((prev) => prev.map((item) => (item._id === id ? { ...item, status: !item.status } : item)));
//         toast.success(data.message);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       handleError(error);
//     }
//   };

//   const PaySalary = async (data) => {
//     try {
//       if (data) {
//         console.log(data);
//         // Ensure you send a properly formatted request body
//         const response = await axiosInstance.put(
//           `/admin/riders/${selectedRider._id}/pay-salary`,
//           {
//             baseSalary: data.baseSalary,
//             paidSalary: data.paidSalary,
//           }
//         );
        
//         // Axios returns the response payload in `response.data`
//         const res = response.data;
        
//         if (!res.error) {
//           toast.success(res.message);
//           setSelectedRider(null);
//         } else {
//           toast.error(res.message);
//         }
//       } else {
//         toast.error("Invalid data provided");
//       }
//     } catch (error) {
//       handleError(error);
//     }
//   };
  

//   useEffect(() => {
//     const controller = new AbortController();
//     const getData = async () => {
//       try {
//         setIsLoading(true);
//         const { data } = await axiosInstance.get(`/admin/riders/get-riders`, { signal: controller.signal, params: { ...filters } });
//         setData(data.data);
//       } catch (error) {
//         handleError(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     getData();

//     return () => {
//       controller.abort();
//     };
//   }, [filters]);

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
                  <Tooltip content={'Info'} placement="top" arrow animation="shift-away" theme="warning">
                    <button className="action-btn" type="button" onClick={() => navigate(`${row.cell.row.original._id}/info`)}>
                      <Icon icon="mingcute:information-line" />
                    </button>
                  </Tooltip>
                  <Tooltip content={'Details'} placement="top" arrow animation="shift-away" theme="success">
                    <button className="action-btn" type="button" onClick={() => navigate(`${row.cell.row.original._id}/track`)}>
                      <Icon icon="pajamas:details-block" />
                    </button>
                  </Tooltip>
                  <Tooltip content={'Settlements'} placement="top" arrow animation="shift-away" theme="secondary">
                    <button className="action-btn" type="button" onClick={() => navigate(`${row.cell.row.original._id}/settlement`)}>
                      <Icon icon="ph:cash-register-light" />
                    </button>
                  </Tooltip>
                  <Tooltip content={'Pay Salary'} placement="top" arrow animation="shift-away" theme="dark">
                    <button className="action-btn" type="button" onClick={() => openSalaryModel(row.cell.row.original)}>
                      <Icon icon="tdesign:money-filled" />
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
              <h4 className="card-title">Riders</h4>
              <div className="flex gap-2">
                <DateFilter setDate={(newValue) => setFilters((prev) => ({ ...prev, ...newValue }))} values={filters} />
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} placeholder="Search Riders..." />
                <AddButton />
              </div>
            </div>
            <TableBody tableInstance={tableInstance} />
          </Card>
        </>
      )}

      <SalaryModel active={!!selectedRider} handleClose={() => setSelectedRider(null)} submitData={PaySalary} data={selectedRider} />
    </>
  );
};

export default Analytics;
