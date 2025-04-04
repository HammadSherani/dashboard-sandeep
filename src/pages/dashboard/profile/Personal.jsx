import Textinput from '../../../components/ui/Textinput';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import FormLoader from '../../../components/FormLoader';
import axiosInstance from '../../../configs/axios.config';
import { handleError } from '../../../utils/functions';
import { toast } from 'react-toastify';
import { setUser } from '../../../store/slice/auth';
import SubmitButton from '../../../components/ui/SubmitButton';

const schema = Yup.object().shape({
  name: Yup.string().required('Full Name is required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Phone number must contain only digits')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
});

const Personal = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(schema), mode: 'all' });

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get('/admin/auth/get-admin');

        if (data.error === false) {
          reset(data.data);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const { data: res } = await axiosInstance.put('/admin/auth/update-profile', data);
      if (!res.error) {
        toast.success(res.message);
        dispatch(setUser(res.admin));
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <>
      {isLoading ? (
        <FormLoader />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4  p-6 ">
          <Textinput
            label="Full Name"
            name="name"
            type={'text'}
            register={register}
            error={errors.name}
            className="rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
            placeholder="Enter Your Full Name"
            isRequired
            onChange={(e) => setValue('name', e.target.value)}
          />
          <Textinput
            label="Phone Number"
            name="phoneNumber"
            type={'text'}
            register={register}
            error={errors.phoneNumber}
            className="rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
            placeholder="Enter Your Phone Number"
            isRequired
            onChange={(e) => setValue('phoneNumber', e.target.value)}
          />

          <div className="col-span-full flex justify-end">
            <SubmitButton isSubmitting={isSubmitting}>Update</SubmitButton>
          </div>
        </form>
      )}
    </>
  );
};

export default Personal;
