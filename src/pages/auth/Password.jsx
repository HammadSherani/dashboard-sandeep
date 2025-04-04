import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axiosInstance from '../../configs/axios.config';
import Textinput from '../../components/ui/Textinput';
import SubmitButton from '../../components/ui/SubmitButton';
import logo from '../../assets/images/logo/logo-dark.png';
import { handleError } from '../../utils/functions';
import { useNavigate, useSearchParams } from 'react-router-dom';

const schema = Yup.object().shape({
  password: Yup.string()
    .required('Password is Required')
    .matches(/^(?=.*[a-z])/, 'Must Contain One Lowercase Character')
    .matches(/^(?=.*[A-Z])/, 'Must Contain One Uppercase Character')
    .matches(/^(?=.*[0-9])/, 'Must Contain One Number Character')
    .matches(/^(?=.*[!@#$%^&*])/, 'Must Contain One Special Case Character')
    .min(8, 'Password must be at least 8 characters long'),
  cPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Password must Match')
    .required('Confirm Password is Required'),
});

function CreatePassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const {
    handleSubmit,
    register,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({ resolver: yupResolver(schema), mode: 'all' });

  const onSubmit = async (data) => {
    try {
      const { data: res } = await axiosInstance.post('/admin/auth/forgot-password', { ...data, token });
      if (!res.error) {
        toast.success(res.message);
        navigate('/auth/login');
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className={`min-h-screen bg-[#fafafa] flex items-center justify-center bg-[url(../../assets/images/main-slider/slider2/slide1.jpg)]`}>
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white  rounded-lg shadow-lg p-8">
          <h2 className="text-center text-2xl font-semibold mb-4 text-gray-800">Create Password</h2>
          <Textinput
            label="Password"
            name="password"
            type={'password'}
            register={register}
            error={errors.password}
            className="rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
            placeholder="Enter Your Password"
            isRequired
            onChange={(e) => setValue('password', e.target.value)}
            hasicon
          />
          <Textinput
            label="Confirm Password"
            name="cPassword"
            type={'password'}
            register={register}
            error={errors.cPassword}
            className="rounded-md border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
            placeholder="Confirm Your Your Password"
            isRequired
            onChange={(e) => setValue('cPassword', e.target.value)}
            hasicon
          />
          <SubmitButton isSubmitting={isSubmitting} className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
            Create
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}

export default CreatePassword;
