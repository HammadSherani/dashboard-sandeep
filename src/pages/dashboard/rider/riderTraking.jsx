import { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import DashboardLoader from '../../../components/Loading';
import { formatDate } from '../../../utils/functions';
import { toast } from 'react-toastify';
import GlobalFilter from '../../../components/partials/Table/GlobalFilter';
import TableBody from '../../../components/shared/TableBody';
import { 
  Clock, AlertTriangle, CheckCircle, XCircle, 
  MapPin, Search, Filter, MoreVertical,
  ChevronLeft, ChevronRight, Plus, Navigation 
} from 'lucide-react';
import BackButton from '../../../components/ui/BackButton';

const RiderTracking = () => {
  const rider = {
        initials: 'AG',
        name: 'Anna Gasperlin',
        role: 'RIDER',
        email: 'anna@example.com',
        id: '8008831105',
        connections: [
          { name: 'Email Connected', status: true },
          { name: 'Calendar Connected', status: true },
          { name: 'Two Factor Authentication', status: false },
          { name: 'Time & Billing', status: true },
        ],
      };
    
      const stats = [
        { label: 'Total Rides', value: '156' },
        { label: 'Completed', value: '145' },
        { label: 'Cancelled', value: '11' },
        { label: 'Rating', value: '4.8' },
      ];
    
      // Dummy Data for the table
      const dummyData = [
        {
          date: '2024-12-01',
          time: '10:00 AM',
          from: 'Location A',
          to: 'Location B',
          status: 'Completed',
          amount: '$20.00',
        },
        {
          date: '2024-12-02',
          time: '11:30 AM',
          from: 'Location C',
          to: 'Location D',
          status: 'Cancelled',
          amount: '$0.00',
        },
        {
          date: '2024-12-03',
          time: '2:00 PM',
          from: 'Location E',
          to: 'Location F',
          status: 'Completed',
          amount: '$25.00',
        },
        {
          date: '2024-12-04',
          time: '5:30 PM',
          from: 'Location G',
          to: 'Location H',
          status: 'Completed',
          amount: '$30.00',
        },
      ];
    
      // Backlogs Data
      const backlogsData = [
        {
          id: 'BL001',
          issue: 'Vehicle Maintenance Required',
          priority: 'High',
          status: 'Pending',
          dueDate: '2024-03-20',
          description: 'Regular maintenance check-up needed for vehicle safety compliance.',
        },
        {
          id: 'BL002',
          issue: 'Route Optimization Review',
          priority: 'Medium',
          status: 'In Progress',
          dueDate: '2024-03-22',
          description: 'Analysis of current routes to improve efficiency and reduce fuel consumption.',
        },
        {
          id: 'BL003',
          issue: 'Customer Feedback Resolution',
          priority: 'Low',
          status: 'Completed',
          dueDate: '2024-03-18',
          description: 'Address customer feedback regarding ride experience and service quality.',
        },
      ];
    
      const riderColumns = [
        {
          Header: 'Date',
          accessor: 'date',
          Cell: ({ value }) => <span>{formatDate(value)}</span>,
        },
        {
          Header: 'Time',
          accessor: 'time',
        },
        {
          Header: 'From',
          accessor: 'from',
        },
        {
          Header: 'To',
          accessor: 'to',
        },
        {
          Header: 'Status',
          accessor: 'status',
          Cell: ({ value }) => (
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                value === 'Completed' ? 'bg-green-100 text-green-700' : value === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {value}
            </span>
          ),
        },
        {
          Header: 'Amount',
          accessor: 'amount',
        },
      ];
    
      const [data, setData] = useState(dummyData);
      const [isLoading, setIsLoading] = useState(false);
    
      const tableInstance = useTable(
        {
          columns: useMemo(() => riderColumns, []),
          data,
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
      );
    
      const { state, setGlobalFilter } = tableInstance;
      const { globalFilter } = state;
    
      const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
          case 'high':
            return 'text-red-600 bg-red-50';
          case 'medium':
            return 'text-yellow-600 bg-yellow-50';
          case 'low':
            return 'text-green-600 bg-green-50';
          default:
            return 'text-gray-600 bg-gray-50';
        }
      };
    
      const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
          case 'pending':
            return <Clock className="w-4 h-4 text-yellow-500" />;
          case 'in progress':
            return <AlertTriangle className="w-4 h-4 text-orange-500" />;
          case 'completed':
            return <CheckCircle className="w-4 h-4 text-green-500" />;
          default:
            return <XCircle className="w-4 h-4 text-gray-500" />;
        }
      };
    

  return (
    <Card title="Rider Location" headerslot={<BackButton />}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Rider Tracking</h2>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors">
                <Navigation className="w-4 h-4 mr-2" />
                Live Track
              </button>
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </button>
            </div>
          </div>

          {/* Rider Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex-shrink-0 flex items-center justify-center">
                <span className="text-white text-xl font-semibold">{rider.initials}</span>
              </div>
              <div className="flex-grow space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{rider.name}</h3>
                    <span className="px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-orange-600 to-orange-700 rounded-full shadow-sm">
                      {rider.role}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{rider.email}</p>
                    <p className="font-medium">ID: {rider.id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rider.connections.map((connection) => (
                    <div
                      key={connection.name}
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                        connection.status ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          connection.status ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                      <span className={`text-sm font-medium ${
                        connection.status ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {connection.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-800">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Map and Backlogs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Current Location</h3>
                  <button className="p-2 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors">
                    <Navigation className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="aspect-video bg-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-orange-600 animate-bounce" />
                </div>
              </div>
              <div className="p-4 bg-gray-50">
                <p className="text-sm text-gray-500">Last Updated: 2 mins ago</p>
                <p className="mt-1 text-sm font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  123 Main Street, New York, NY 10001
                </p>
              </div>
            </div>

            {/* Backlogs Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Backlogs</h3>
                    <p className="text-sm text-gray-500 mt-1">Manage rider tasks and issues</p>
                  </div>
                  <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:orange-orange-500 focus:ring-offset-2 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {backlogsData.map((backlog) => (
                  <div key={backlog.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm font-medium text-gray-500">#{backlog.id}</span>
                          <h4 className="text-base font-medium text-gray-900 truncate">{backlog.issue}</h4>
                          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(backlog.priority)}`}>
                            {backlog.priority}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{backlog.description}</p>
                        <div className="mt-3 flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(backlog.status)}
                            <span className="text-sm text-gray-600">{backlog.status}</span>
                          </div>
                          <span className="text-sm text-gray-500">Due: {formatDate(backlog.dueDate)}</span>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ride History Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Ride History</h3>
                  <p className="mt-1 text-sm text-gray-500">View all past rides and their details</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 sm:min-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <GlobalFilter
                      filter={globalFilter}
                      setFilter={setGlobalFilter}
                      placeholder="Search rides..."
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <DashboardLoader />
              ) : (
                <TableBody tableInstance={tableInstance} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RiderTracking;