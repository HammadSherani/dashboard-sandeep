import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Barcode from 'react-barcode';
import Loading from '../../../components/Loading';
import { formatDate, handleError } from '../../../utils/functions';
import BackButton from '../../../components/ui/BackButton';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Logo from '../../../assets/images/logo/logo-light.png';
import axiosInstance from '../../../configs/axios.config';

const Invoice = () => {
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

  const handleDownloadPDF = async () => {
    const input = document.getElementById('invoice-content');
    if (!input) return;

    try {
      const canvas = await html2canvas(input, { 
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1400, 610]
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${data?.qrCode}.pdf`);
      
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error('PDF generation error:', error);
    }
  };

  if (!data) return null;

  return (
    <Loading loading={isLoading}>
      <Card 
        title="Logistics Invoice" 
        headerslot={
          <div className="flex items-center gap-4">
            <BackButton />
            <Button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2"
            >
              Print Invoice
            </Button>
          </div>
        }
      >
        <div id="invoice-content" className="bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Logo */}
              <div className="border p-4">
                <img src={Logo} alt="Company Logo" className="h-20 w-auto" />
              </div>

              {/* Sender Information */}
              <div className="border p-6 space-y-4">
                <h2 className="text-xl font-semibold">Sender Information</h2>
                <div className="space-y-3">
                  <InfoRow label="Name" value={data?.warehouse?.name} />
                  <InfoRow label="Address" value={data?.warehouse?.address} />
                  <InfoRow label="Company" value={data?.warehouse?.company || '---'} />
                  <InfoRow label="Mobile" value={data?.warehouse?.phone} />
                  <InfoRow label="Landline" value={data?.warehouse?.landLine || '---'} />
                  <InfoRow label="City" value={data?.warehouse?.city} />
                  <InfoRow label="State" value={data?.warehouse?.state} />
                  <InfoRow label="Postal Code" value={data?.warehouse?.postalCode} />
                </div>

                {/* Package Dimensions */}
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  <div className="border p-3">
                    <div className="flex items-center justify-between text-lg">
                      <span className="font-semibold">Weight:</span>
                      <span className="border px-3">{data.weight || '0.0'}</span>
                      <span>KG</span>
                    </div>
                  </div>
                  <div className="border p-3">
                    <div className="flex items-center justify-between text-lg space-x-2">
                      <span className="border px-2 bg-gray-100">L</span>
                      <span>{data?.length}</span>
                      <span className="border px-2 bg-gray-100">W</span>
                      <span>{data?.width}</span>
                      <span className="border px-2 bg-gray-100">H</span>
                      <span>{data?.height}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Barcode Section */}
              <div className="border p-4 grid grid-cols-3">
                <div className="flex items-center">
                  <span className="text-4xl font-bold">{data.paymentMethod}</span>
                </div>
                <div className="col-span-2">
                  <Barcode value={data.qrCode} height={40} width={1.5} />
                </div>
              </div>

              {/* Receiver Information */}
              <div className="border p-6 space-y-4">
                <h2 className="text-xl font-semibold">Receiver Information</h2>
                <div className="space-y-3">
                  <InfoRow label="Name" value={data?.name} />
                  <InfoRow label="Address" value={data?.address} />
                  <InfoRow label="Company" value={data?.company || '---'} />
                  <InfoRow label="Mobile" value={data?.phone} />
                  <InfoRow label="Landline" value={data?.landline || '---'} />
                  <InfoRow label="City" value={data?.city} />
                  <InfoRow label="State" value={data?.state} />
                  <InfoRow label="Postal Code" value={data?.postalCode} />
                </div>

                {/* Additional Details */}
                <div className="mt-4 pt-4 border-t space-y-3">
                  <InfoRow label="Remarks" value={data?.remarks || '---'} />
                  <InfoRow 
                    label="Booking Date/Time" 
                    value={formatDate(data?.createdAt)} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Loading>
  );
};

// Helper component for consistent info row display
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
    <span className="text-sm font-medium text-gray-600 min-w-[120px]">
      {label}:
    </span>
    <span className="text-gray-800">{value}</span>
  </div>
);

export default Invoice;