import { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import DashboardLoader from '../../../components/Loading';
import { formatDate, formatPrice, handleError } from '../../../utils/functions';
import axiosInstance from '../../../configs/axios.config';
import TableBody from '../../../components/shared/TableBody';
import GlobalFilter from '../../../components/partials/Table/GlobalFilter';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';
import Tooltip from '../../../components/ui/Tooltip';
import Select from '../../../components/ui/Select';
import { toast } from 'react-toastify';


const Salary = [
    {
        Header: 'Rider Name',
        accessor: 'rider.name',
        Cell: (row) => {
            return <span>{row?.cell?.value}</span>;
        },
    },
    {
        Header: 'Rider Email',
        accessor: 'rider.email',
        Cell: (row) => {
            return <span>{row?.cell?.value}</span>;
        },
    },
    {
        Header: 'Salary',
        accessor: 'baseSalary',
        Cell: (row) => {
            return <span>{formatPrice(row?.cell?.value)}</span>;
        },
    },
    {
        Header: 'From',
        accessor: 'startDate',
        Cell: (row) => {
            return <span>{formatDate(row?.cell?.value)}</span>;
        },
    },
    {
        Header: 'To',
        accessor: 'endDate',
        Cell: (row) => {
            return <span>{formatDate(row?.cell?.value)}</span>;
        },
    },
    {
        Header: 'Paid At',
        accessor: 'paidAt',
        Cell: (row) => {
            return <span>{row?.cell?.value? formatDate(row?.cell?.value) : "Not Paid"}</span>;
        },
    },
    {
        Header: 'status',
        accessor: 'status',
        Cell: (row) => {
            return (
                <span
                    className={` inline-block px-3 min-w-[80px] text-center  py-1 rounded-[999px] bg-opacity-25 
                ${row?.cell?.value === "PENDING" ? 'text-warning-500 bg-warning-500' : ''} 
                ${row?.cell?.value === "PROCESSING" ? 'text-primary-500 bg-primary-500' : ''} 
                ${row?.cell?.value === "FAILED" ? 'text-danger-500 bg-danger-500' : ''}
                ${row?.cell?.value === "PAID" ? 'text-success-500  bg-success-500' : ''}
              
               `}
                >
                    {row?.cell?.value}
                </span>
            );
        },
    },
];

// Array of months
const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
]

// Array of years from 2020 to the current year
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i);


const SalaryListings = () => {
    const navigate = useNavigate();
    const columns = useMemo(() => Salary, []);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        year: '',
        month: '',
    });

    const getData = useCallback(
        async (loading = true) => {
            try {
                setIsLoading(loading);
                const { data } = await axiosInstance.get(`/admin/salary`, { params: { ...filters } });
                setData(data.data);
            } catch (error) {
                handleError(error);
            } finally {
                setIsLoading(false);
            }
        },
        [filters],
    );



    useEffect(() => {
        getData();
    }, [getData]);


    const handlePaid = async (id) => {
        try {
            const isConfirmed = confirm("Are You Sure?")
            if (!isConfirmed) return;
            const { data } = await axiosInstance.put(`/admin/salary/${id}`)
            if (!data.error) {
                getData(false)
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            handleError(error)
        }
    }

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
                                    {row.cell.row.original.status === "PENDING" && (
                                        <Tooltip content={'Mark Paid'} placement="top" arrow animation="shift-away" theme="primary">
                                            <button className="action-btn" type="button" onClick={() => handlePaid(row.cell.row.original._id)}>
                                                <Icon icon="flat-color-icons:paid" width="30" height="30" />
                                            </button>
                                        </Tooltip>
                                    )}
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
                    <h4 className="card-title">Rider Salaries</h4>
                    <div className="flex gap-2">
                        <Select options={years} id={"Years"} placeholder='Select Year' value={filters.year} onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))} />
                        <Select options={months} id={"Months"} placeholder='Select Month' value={filters.month} onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))} />
                        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} placeholder="Search Rider Salaries..." />
                    </div>
                </div>
                <TableBody tableInstance={tableInstance} />
            </Card>
        </DashboardLoader>
    );
};

export default SalaryListings;
