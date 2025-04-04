import PropTypes from 'prop-types';
import Modal from '../ui/Modal';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import Textinput from '../ui/Textinput';
import Button from '../ui/Button';

const schema = yup.object({
  baseSalary: yup.number().typeError('Base Salary must be a number').positive('Base Salary must be positive').required('Base Salary is required'),
  paidSalary: yup.number().typeError('Paid Salary must be a number').positive('Paid Salary must be positive').required('Paid Salary is required'),
});

const SalaryModel = ({ handleClose, active, submitData, data }) => {
  
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const onSubmit = async (formData) => {
    await submitData({
      baseSalary: formData.baseSalary,
      paidSalary: formData.paidSalary,
    });
    reset();
    handleClose();
  };

  useEffect(() => {
    if (data) {
      reset({ baseSalary: data.salary, paidSalary: data.paidSalary || '' });
    }
  }, [active, data, reset]);

  return (
    <Modal title="Salary" activeModal={active} onClose={handleClose} themeClass="bg-orange-500" centered>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Textinput name="baseSalary" type="number" label="Base Salary" register={register} error={errors.baseSalary} placeholder="Enter Base Salary" disabled />
        </div>
        <div>
          <Textinput name="paidSalary" type="number" label="Paid Salary" register={register} error={errors.paidSalary} placeholder="Enter Paid Salary" />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" text="Close" onClick={handleClose} className="btn-outline-secondary" />
          <Button type="submit" text={isSubmitting ? 'Submitting...' : 'Submit'} isLoading={isSubmitting} className="btn-primary" />
        </div>
      </form>
    </Modal>
  );
};

SalaryModel.propTypes = {
  active: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  submitData: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default SalaryModel;
