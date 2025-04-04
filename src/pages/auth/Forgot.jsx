import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axiosInstance from '../../configs/axios.config';
import Textinput from '../../components/ui/Textinput';
import SubmitButton from '../../components/ui/SubmitButton';
import logo from '../../assets/images/logo/logo-dark.png';
import { handleError } from '../../utils/functions';

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
});

function Login() {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({ resolver: yupResolver(schema), mode: 'all' });

  const onSubmit = async (data) => {
    try {
      const { data: res } = await axiosInstance.post('/admin/auth/find-user', data);
      if (!res.error) {
        toast.success(res.message);
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
          <h2 className="text-center text-2xl font-semibold mb-4 text-gray-800">Find Account</h2>
          <Textinput
            placeholder="Enter Your Email"
            label="Email"
            type="email"
            name={'email'}
            register={register}
            error={errors.email}
            onChange={(e) => setValue('email', e.target.value)}
            isRequired
          />

          <SubmitButton isSubmitting={isSubmitting} className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
            Find
          </SubmitButton>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Back To?{' '}
              <Link to="/auth/login" className="text-orange-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
