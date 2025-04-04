import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Card from '../../../components/ui/Card';
import BackButton from '../../../components/ui/BackButton';
import Loading from '../../../components/Loading';
import useFetch from '../../../hooks/useFetch';
import { formatDate } from '../../../utils/functions';
import Button from '../../../components/ui/Button';
import ReviewModal from '../../../components/shared/ReviewModel';

const UserDetails = () => {
  const [active, setActive] = useState(false);
  const { id } = useParams();
  const { data, isLoading, error } = useFetch({ url: `/admin/user/${id}` });

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-center">
          <Icon icon="mdi:alert-circle" className="w-5 h-5 text-red-500" />
          <p className="ml-3 text-red-700">An error occurred while fetching data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <Card title="User Details" headerslot={<BackButton />}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-4 bg-orange-600 rounded-full">
                <Icon icon="mdi:account" className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{data?.user?.name}</h1>
                <span
                  className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-medium ${
                    data?.user?.status ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}
                >
                  <Icon
                    icon={data?.user?.status ? 'mdi:check-circle' : 'mdi:close-circle'}
                    className="w-4 h-4 mr-1"
                  />
                  {data?.user?.status ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div>
              <Button text="Create Invoice" className="bg-orange-600"  onClick={() => setActive(true)}/>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 transition hover:shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon icon="mdi:account-details" className="w-6 h-6 text-orange-600" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <InfoRow icon="mdi:email" label="Email" value={data?.user?.email} />
              <InfoRow icon="mdi:phone" label="Phone Number" value={data?.user?.phoneNumber} />
              <InfoRow icon="mdi:calendar" label="Date of Birth" value={formatDate(data?.user?.dob)} />
              <InfoRow icon="mdi:card-account-details" label="NIC Number" value={data?.user?.nic} />
              <InfoRow icon="mdi:calendar-clock" label="Account Created At" value={formatDate(data?.user?.createdAt)} />
            </div>
          </div>

          {/* Address & Banking Info */}
          <div className="bg-white rounded-lg shadow-lg p-6 transition hover:shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon icon="mdi:map-marker" className="w-6 h-6 text-orange-600" />
              Address & Banking Information
            </h2>
            <div className="space-y-4">
              <InfoRow icon="mdi:home" label="Address" value={data?.user?.address} />
              <InfoRow icon="mdi:map-marker" label="State" value={data?.user?.state} />
              <InfoRow icon="tdesign:city-filled" label="City" value={data?.user?.city} />
              <InfoRow icon="mdi:bank" label="Bank Account" value={data?.user?.bankAccount} />
              <InfoRow icon="mdi:bank-transfer" label="Bank Name" value={data?.user?.bankName} />
            </div>
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Icon icon="mdi:briefcase-check" className="w-6 h-6 text-orange-600" />
            Bookings
          </h2>
          <div className="space-y-4">
            {data?.bookings?.map((booking, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="text-lg font-semibold">{booking.name}</h3>
                <p className="text-sm text-gray-500">Phone: {booking.phone}</p>
                <p className="text-sm text-gray-500">Payment Method: {booking.paymentMethod}</p>
                <p className="text-sm text-gray-500">Status: {booking.status ? 'Delivered' : 'Pending'}</p>
                <p className="text-sm text-gray-500">Date: {formatDate(booking.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pickups */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Icon icon="mdi:truck" className="w-6 h-6 text-orange-600" />
            Pickups
          </h2>
          <div className="space-y-4">
            {data?.pickups?.map((pickup, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="text-lg font-semibold">Pickup ID: {pickup._id}</h3>
                <p className="text-sm text-gray-500">Status: {pickup.pickupStatus}</p>
                <p className="text-sm text-gray-500">Address: {pickup.address}</p>
                <p className="text-sm text-gray-500">Date: {formatDate(pickup.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ReviewModal active={active} handleClose={() => setActive(false)}  />
    </Card>
  );
};

const InfoRow = ({ icon, label, value, valueClass = '' }) => (
  <div className="flex items-center gap-3">
    <Icon icon={icon} className="w-5 h-5 text-gray-500" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`font-medium ${valueClass}`}>{value}</p>
    </div>
  </div>
);

export default UserDetails;
