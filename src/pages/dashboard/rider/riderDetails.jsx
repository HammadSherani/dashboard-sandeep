import React from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Card from '../../../components/ui/Card';
import BackButton from '../../../components/ui/BackButton';
import Loading from '../../../components/Loading';
import useFetch from '../../../hooks/useFetch';
import { formatImageName } from '../../../utils/functions';

function RiderDetails() {
  const { id } = useParams();
  const { data, isLoading, error } = useFetch({ url: `/admin/riders/get-rider/${id}` });

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

  const riderDocuments = [
    { label: 'NIC Front', image: formatImageName(data?.nicFront), icon: 'mdi:card-account-details' },
    { label: 'NIC Back', image: formatImageName(data?.nicBack), icon: 'mdi:card-account-details-outline' },
    { label: 'License Front', image: formatImageName(data?.licenseFront), icon: 'mdi:license' },
    { label: 'License Back', image: formatImageName(data?.licenseBack), icon: 'mdi:license-outline' },
  ];

  return (
    <Card title="Rider Details" headerslot={<BackButton />}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-4 bg-orange-600 rounded-full">
                <Icon icon="mdi:account" className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{data?.name}</h1>
                <span
                  className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-medium ${
                    data?.status ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}
                >
                  <Icon
                    icon={data?.status ? 'mdi:check-circle' : 'mdi:close-circle'}
                    className="w-4 h-4 mr-1"
                  />
                  {data?.status ? 'Active' : 'Inactive'}
                </span>
              </div>
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
              <InfoRow icon="mdi:email" label="Email" value={data?.email} />
              <InfoRow icon="mdi:phone" label="Phone Number" value={data?.phoneNumber} />
              <InfoRow icon="mdi:calendar" label="Date of Birth" value={new Date(data?.dateOfBirth).toLocaleDateString()} />
              <InfoRow icon="mdi:card-account-details" label="NIC Number" value={data?.nicNumber} />
              <InfoRow icon="mdi:license" label="License Number" value={data?.licenseNumber} />
              <InfoRow
                icon="mdi:clock-outline"
                label="Account Created At"
                value={new Date(data?.createdAt).toLocaleString()}
              />
              <InfoRow
                icon="mdi:calendar-refresh"
                label="Last Updated At"
                value={new Date(data?.updatedAt).toLocaleString()}
              />
            </div>
          </div>

          {/* Vehicle & Location */}
          <div className="bg-white rounded-lg shadow-lg p-6 transition hover:shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon icon="mdi:motorcycle" className="w-6 h-6 text-orange-600" />
              Vehicle & Location
            </h2>
            <div className="space-y-4">
              <InfoRow icon="mdi:motorcycle-electric" label="Vehicle Type" value={data?.vehicleType} />
              <InfoRow
                icon="mdi:map-marker"
                label="Current Location"
                value={`${data?.location?.coordinates[0]}, ${data?.location?.coordinates[1]}`}
              />
              <InfoRow
                icon="mdi:shield-check"
                label="Verification Status"
                value={data?.verified ? 'Verified' : 'Pending Verification'}
                valueClass={data?.verified ? 'text-green-600' : 'text-yellow-600'}
              />
            </div>
          </div>

          {/* Documents */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon icon="mdi:file-document" className="w-6 h-6 text-orange-600" />
              Documents
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {riderDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition"
                >
                  <div className="aspect-[3/2] rounded-lg overflow-hidden bg-gray-100">
                    {doc.image ? (
                      <img
                        src={doc.image}
                        alt={doc.label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon icon={doc.icon} className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-2">{doc.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

const InfoRow = ({ icon, label, value, valueClass = '' }) => (
  <div className="flex items-center gap-3">
    <Icon icon={icon} className="w-5 h-5 text-gray-500" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`font-medium ${valueClass}`}>{value}</p>
    </div>
  </div>
);

export default RiderDetails;
