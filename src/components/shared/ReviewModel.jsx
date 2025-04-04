import PropTypes from 'prop-types';
import Modal from '../ui/Modal';
import Textarea from '../ui/Textarea';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DateFilter from './DateFilter';
import Button from '../ui/Button';

const schema = yup.object({
  review: yup.string().required('Review is Required'),
  startDate: yup.date().required('Start Date is Required').nullable(),
  endDate: yup.date().required('End Date is Required').nullable().min(yup.ref('startDate'), 'End Date cannot be before Start Date'),
});

const ReviewModal = ({ handleClose, active, submitData }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(schema), mode: 'onSubmit' });

  const onSubmit = async (data) => {
    await submitData?.({
      review: data.review,
      startDate,
      endDate,
    });
    setStartDate(null);
    setEndDate(null);
    reset();
    handleClose();
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setValue('startDate', date, { shouldValidate: true });
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setValue('endDate', date, { shouldValidate: true });
  };

  return (
    <Modal title="Review" label="" labelClass="btn-outline-dark" activeModal={active} onClose={handleClose} themeClass="bg-orange-500" centered={true} noFade={false}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className='h-64 grid grid-cols-2'>
          <div>
            <label htmlFor="startDate" className="block capitalize form-label">
              Start Date
            </label>
            <DatePicker selected={startDate} onChange={handleStartDateChange} className="form-input w-full" placeholderText="Select Start Date" dateFormat="yyyy-MM-dd" />
            {errors.startDate && <div className="mt-2 text-danger-500 text-sm">{errors.startDate.message}</div>}
          </div>
          <div>
            <label htmlFor="endDate" className="block capitalize form-label">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              className="form-input w-full"
              placeholderText="Select End Date"
              dateFormat="yyyy-MM-dd"
              minDate={startDate}
            />
            {errors.endDate && <div className="mt-2 text-danger-500 text-sm">{errors.endDate.message}</div>}
          </div>
        </div>
        <Button className="bg-orange-500 text-white" type="submit" isLoading={isSubmitting}>
          Submit
        </Button>
      </form>
    </Modal>
  );
};

export default ReviewModal;

ReviewModal.propTypes = {
  active: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  submitData: PropTypes.func.isRequired,
};
