import BackButton from '../../../components/ui/BackButton';
import Card from '../../../components/ui/Card';

import { useEffect, useState } from 'react';
import { handleError } from '../../../utils/functions';
import axiosInstance from '../../../configs/axios.config';
import SubmitButton from '../../../components/ui/SubmitButton';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

const AssignRider = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [riders, setRiders] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [selected, setSelected] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchAddresses = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(`/common/riders`, { signal: controller.signal });
        if (data) {
          setRiders(data.data);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selected) {
        toast.error('Please Select A Rider');
        return;
      }
      setIsSubmitting(true);
      const { data } = await axiosInstance.put(`admin/pickup/${id}/assign`, { riders: selected.value });
      if (!data.error) {
        toast.success(data.message || 'Form submitted successfully!');
        navigate(-1);
      } else {
        toast.error(data.message || 'Submission failed!');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Loading loading={isLoading}>
      <Card title="Add Booking" headerslot={<BackButton />}>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <label htmlFor="form-label">
                Select Rider <span className="text-danger-500">*</span>
              </label>
              <Select
                name="rider"
                options={riders}
                value={selected}
                onChange={(newValue) => setSelected(newValue)}
                placeholder={'Please Select Rider to Assign the Pickup'}
                isSearchable={'true'}
              />
            </div>
            <div className="col-span-full flex justify-end">
              <SubmitButton isSubmitting={isSubmitting}>Submit</SubmitButton>
            </div>
          </div>
        </form>
      </Card>
    </Loading>
  );
};

export default AssignRider;

// export default assignRider
