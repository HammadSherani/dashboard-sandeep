import { useEffect, useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import Tooltip from '../../../components/ui/Tooltip';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { useNavigate } from 'react-router-dom';
import DashboardLoader from '../../../components/Loading';
import { formatDate, handleError } from '../../../utils/functions';
import TableBody from '../../../components/shared/TableBody';
import AddButton from '../../../components/ui/AddButton';
import GlobalFilter from '../../../components/partials/Table/GlobalFilter';
import DateFilter from '../../../components/shared/DateFilter';
import SalaryModel from '../../../components/shared/salaryModel';
import { analyticalData } from '../../../constant/data';

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

const RiderManagement = () => {
  const [selectedRider, setSelectedRider] = useState(null);
  const navigate = useNavigate();
  const columns = useMemo(() => Rider, []);
  const [data, setData] = useState(analyticalData);
  console.log(data)
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });
  

  const handleStatusChange = async (id) => {
  
  };

  const PaySalary = async (data) => {
   
  };
  

  // useEffect(() => {
  //  
  // }, []);

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
        <>
          <Card noborder>
            <div className="flex justify-between items-center mb-6">
              <h4 className="card-title">Analytics</h4>
              <div className="flex gap-2">
                <DateFilter setDate={(newValue) => setFilters((prev) => ({ ...prev, ...newValue }))} values={filters} />
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} placeholder="Search Riders..." />
                <AddButton />
              </div>
            </div>
            <TableBody tableInstance={tableInstance} />
          </Card>
        </>

      <SalaryModel active={!!selectedRider} handleClose={() => setSelectedRider(null)} submitData={PaySalary} data={selectedRider} />
    </>
  );
};

export default RiderManagement;
