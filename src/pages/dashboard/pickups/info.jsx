import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import Card from '../../../components/ui/Card';
import BackButton from '../../../components/ui/BackButton';
import Loading from '../../../components/Loading';
import axiosInstance from '../../../configs/axios.config';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

function App() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(`admin/pickup/${id}/info`, {
          signal: controller.signal,
        });
        if (!data.error) {
          setData(data.data);
        } else {
          toast.error(data.message);
        }
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
  }, [id]);

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-blue-500',
      'Assigned': 'bg-orange-500',
      'Pickuped': 'bg-green-500',
      'Intransit': 'bg-purple-500',
      'Returned': 'bg-red-500',
      'Cancelled': 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const StatusBadge = ({ status }) => (
    <span className={`${getStatusColor(status)} text-white text-xs font-medium px-2.5 py-0.5 rounded-full`}>
      {status}
    </span>
  );

  if (!data) return null;

  return (
    <Loading loading={isLoading}>
      <Card title="Pickup Information" headerslot={<BackButton />}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Pickup #{data.pickupCode}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <StatusBadge status={data.pickupStatus} />
                  <div className="flex items-center gap-2 text-gray-600">
                    <Icon icon="mdi:calendar" className="w-4 h-4" />
                    <span className="text-sm">
                      Created: {new Date(data.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Warehouse Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon icon="mdi:warehouse" className="w-6 h-6 text-orange-600" />
                Warehouse Information
              </h2>
              <div className="space-y-3">
                <p className="text-gray-900 font-medium">{data.address.name}</p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Icon icon="mdi:phone" className="w-4 h-4" />
                  {data.address.phone}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Icon icon="mdi:building" className="w-4 h-4" />
                  {data.address.company}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Icon icon="mdi:map-marker" className="w-4 h-4" />
                  {data.address.address}
                </p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon icon="mdi:account" className="w-6 h-6 text-orange-600" />
                Customer Information
              </h2>
              <div className="space-y-3">
                <p className="text-gray-900 font-medium">{data.user.name}</p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Icon icon="mdi:phone" className="w-4 h-4" />
                  {data.user.phoneNumber}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Icon icon="mdi:email" className="w-4 h-4" />
                  {data.user.email}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Icon icon="mdi:map-marker" className="w-4 h-4" />
                  {data.user.address}
                </p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon icon="mdi:package-variant" className="w-6 h-6 text-orange-600" />
                Booking Details
              </h2>
              {data.bookings.map((booking, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tracking Number</p>
                    <p className="font-medium">{booking.qrCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{booking.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dimensions</p>
                    <p className="font-medium">{booking.length}x{booking.width}x{booking.height} cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{booking.weight} kg</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Rider Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon icon="mdi:motorcycle" className="w-6 h-6 text-orange-600" />
                Rider Information
              </h2>
              {data.assignedRider ? (
                <div className="space-y-3">
                  <p className="text-gray-900 font-medium">{data.assignedRider.name}</p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Icon icon="mdi:phone" className="w-4 h-4" />
                    {data.assignedRider.phoneNumber}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Icon icon="mdi:email" className="w-4 h-4" />
                    {data.assignedRider.email}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Icon icon="mdi:motorcycle" className="w-4 h-4" />
                    Vehicle Type: {data.assignedRider.vehicleType}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-600">
                  <Icon icon="mdi:alert-circle" className="w-5 h-5" />
                  <p>Rider not yet assigned</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon icon="mdi:timeline" className="w-6 h-6 text-orange-600" />
              Status Timeline
            </h2>
            <div className="space-y-8">
              {data.status.map((event, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute left-0 w-4 h-4 rounded-full bg-orange-500 ring-4 ring-white" />
                  {index !== data.status.length - 1 && (
                    <div className="absolute left-2 top-4 -bottom-8 w-0.5 bg-gray-200" />
                  )}
                  <div className="space-y-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Loading>
  );
}

export default App;