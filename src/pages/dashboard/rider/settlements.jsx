import { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import Tooltip from '../../../components/ui/Tooltip';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLoader from '../../../components/Loading';
import { formatDate, handleError } from '../../../utils/functions';
import axiosInstance from '../../../configs/axios.config';
import { toast } from 'react-toastify';
import TableBody from '../../../components/shared/TableBody';
import AddButton from '../../../components/ui/AddButton';
import GlobalFilter from '../../../components/partials/Table/GlobalFilter';
import DateFilter from '../../../components/shared/DateFilter';

const Transactions = [
    {
        Header: 'Booking Code',
        accessor: 'booking.qrCode',
        Cell: (row) => {
            return (
                <div className="flex items-center gap-4">
                    {row?.cell?.value}
                </div>
            );
        },
    },
    {
        Header: 'amount',
        accessor: 'amount',
        Cell: (row) => {
            return <span>{row?.cell?.value}</span>;
        },
    },
    {
        Header: 'Type',
        accessor: 'type',
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
                    className={` inline-block px-3 min-w-[80px] text-center  py-1 rounded-[999px] bg-opacity-25 
                        ${row?.cell?.value === "COMPLETED" ? 'text-success-500 bg-success-500' : ''} 
                        ${row?.cell?.value === "PENDING" ? 'text-warning-500 bg-warning-500' : ''}
                        ${row?.cell?.value === "FAILED" ? 'text-danger-500 bg-danger-500' : ''}
                    `}
                >
                    {row?.cell?.value}
                </span>
            );
        },
    },
];

const Settlements = () => {
    const { id } = useParams()
    const navigate = useNavigate();
    const columns = useMemo(() => Transactions, []);
    const [data, setData] = useState([]);
    const [wallet, setWallet] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [settlementAmount, setSettlementAmount] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const getData = useCallback(
        async () => {
            try {
                setIsLoading(true);
                const { data } = await axiosInstance.get(`/admin/riders/${id}/settlement`);
                setData(data.data.transactions);
                setWallet(data.data.wallet);
            } catch (error) {
                handleError(error);
            } finally {
                setIsLoading(false);
            }
        },
        [id],
    );

    useEffect(() => {
        getData();
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

    const calculateSettlement = () => {
        try {
            // Filter transactions based on date range and pending status
            const filteredTransactions = data.filter(transaction => {
                const transactionDate = new Date(transaction.createdAt);
                const start = new Date(startDate);
                const end = new Date(endDate);
                // Set end date to end of day
                end.setHours(23, 59, 59, 999);

                return (
                    transaction.status === "PENDING" &&
                    transactionDate >= start &&
                    transactionDate <= end
                );
            });

            // Calculate total amount from filtered transactions
            const totalAmount = filteredTransactions.reduce((sum, transaction) => {
                return sum + (transaction.amount || 0);
            }, 0);

            setSettlementAmount(totalAmount);
            toast.success(totalAmount === 0 ? "Settlement Amount is Zero" : 'Settlement calculated successfully');
        } catch (error) {
            handleError(error);
            setSettlementAmount(0);
        }
    };

    const processPayment = async () => {
        try {
            const { data } = await axiosInstance.put(`/admin/riders/settlement`, {
                startDate,
                endDate,
                riderId: id,
            });
            if (!data.error) {
                toast.success(data.message)
                getData();
            }
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <>
            {isLoading ? (
                <DashboardLoader />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-500">Rider</span>
                                <span className="text-2xl font-semibold">{wallet?.rider?.name} <span className='text-sm'>({wallet?.rider?.email})</span></span>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-500">Pending Balance</span>
                                <span className="text-2xl font-semibold">${wallet?.pendingBalance || 0}</span>
                            </div>
                        </Card>
                        {wallet?.lastSettlementDate && (<Card>
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-500">Last Settlement</span>
                                <span className="text-2xl font-semibold">{formatDate(wallet?.lastSettlementDate, "MMMM DD YYYY hh:mm A")}</span>
                            </div>
                        </Card>)}
                    </div>

                    <Card className="mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="form-label">Start Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="form-label">End Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end gap-3">
                                <button
                                    className="btn btn-primary"
                                    onClick={calculateSettlement}
                                    disabled={!startDate || !endDate}
                                >
                                    Calculate Settlement
                                </button>
                                {settlementAmount > 0 && (
                                    <button
                                        className="btn btn-success"
                                        onClick={processPayment}
                                    >
                                        Process Payment (${settlementAmount})
                                    </button>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card noborder>
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="card-title">Transactions History</h4>
                            <div className="flex gap-2">
                                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} placeholder="Search Transactions History..." />
                            </div>
                        </div>
                        <TableBody tableInstance={tableInstance} />
                    </Card>
                </>
            )}
        </>
    );
};

export default Settlements;
