import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Package, 
  MapPin, 
  Phone, 
  Building2, 
  Truck, 
  Calendar,
  Mail,
  Building,
  Weight,
  Ruler,
  QrCode,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import BackButton from '../../../components/ui/BackButton';
import axiosInstance from '../../../configs/axios.config';
import { formatDate, handleError } from '../../../utils/functions';
import { toast } from 'react-toastify';
import Loading from '../../../components/Loading';

const getStatusColor = (status) => {
  const colors = {
    'Active': 'bg-blue-500',
    'Assigned': 'bg-yellow-500',
    'Pickuped': 'bg-purple-500',
    'Intransit': 'bg-orange-500',
    'Delivered': 'bg-green-500',
  };
  return colors[status] || 'bg-gray-500';
};

const BookingHistory = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(`/admin/booking/invoice/${id}`, { 
          signal: controller.signal 
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

  if (!data) return null;

  return (
    <Loading loading={isLoading}>
      <Card title="Booking Details" headerslot={<BackButton />}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                Shipment Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Tracking Number</p>
                  <p className="font-medium flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-gray-600" />
                    {data.qrCode}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    {data.paymentMethod}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Dimensions</p>
                  <p className="font-medium flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-gray-600" />
                    {data.length}x{data.width}x{data.height} cm
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium flex items-center gap-2">
                    <Weight className="w-4 h-4 text-gray-600" />
                    {data.weight} kg
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-500" />
                Company Information
              </h2>
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">{data.company}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span>{data.address}, {data.city}, {data.state}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span>{data.phone}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Shipment Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-500" />
              Shipment Timeline
            </h2>
            <div className="space-y-8">
              {data.history.map((event, index) => (
                <div key={index} className="relative pl-8">
                  <div className={`absolute left-0 w-4 h-4 rounded-full ${getStatusColor(event.status)} ring-4 ring-white`} />
                  {index !== data.history.length - 1 && (
                    <div className="absolute left-2 top-4 -bottom-8 w-0.5 bg-gray-200" />
                  )}
                  <div className="space-y-1">
                    <p className="font-medium">{event.title}</p>
                    {event.location && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(event.createdAt)}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)} text-white`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {data.remarks && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              Additional Notes
            </h2>
            <p className="text-gray-700">{data.remarks}</p>
          </div>
        )}
      </Card>
    </Loading>
  );
};

export default BookingHistory;