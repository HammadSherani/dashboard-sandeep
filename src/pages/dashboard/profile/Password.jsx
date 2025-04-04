import Textinput from '../../../components/ui/Textinput';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { handleError } from '../../../utils/functions';
import axiosInstance from '../../../configs/axios.config';
import { toast } from 'react-toastify';
import SubmitButton from '../../../components/ui/SubmitButton';

const schema = yup.object({
  oldPassword: yup.string().required('Current password is Required'),
  newPassword: yup
    .string()
    .required('New Password is Required')
    .matches(/^(?=.*[a-z])/, 'Must Contain One Lowercase Character')
    .matches(/^(?=.*[A-Z])/, 'Must Contain One Uppercase Character')
    .matches(/^(?=.*[0-9])/, 'Must Contain One Number Character')
    .matches(/^(?=.*[!@#$%^&*])/, 'Must Contain One Special Case Character')
    .min(8, 'Password must be at least 8 characters long'),
  cpassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});
const Password = () => {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({ resolver: yupResolver(schema), mode: 'all' });

  const onSubmit = async (data) => {
    try {
      const { data: res } = await axiosInstance.post('/admin/auth/change-password', data);
      if (!res.error) {
        toast.success(res.message);
        reset();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-2 md:p-4 ">
      <div className="input-area">
        <div className="input-item mb-3 md:mb-5 flex-1 ">
          <Textinput
            placeholder="Enter Your Current Password"
            label="Current Password"
            type="password"
            name={'oldPassword'}
            register={register}
            error={errors.oldPassword}
            hasicon
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="input-item mb-3 md:mb-5 flex-1 ">
            <Textinput placeholder="Enter Your Password" label="New Password" type="password" name={'newPassword'} register={register} error={errors.newPassword} hasicon />
          </div>
          <div className="input-item mb-3 md:mb-5 flex-1">
            <Textinput placeholder="Confirm Your Password" label="Confirm Passoword" type="password" name={'cpassword'} register={register} error={errors.cpassword} hasicon />
          </div>
        </div>

        <div className="signin-area mb-3.5">
          <div className="flex justify-end">
            <SubmitButton isSubmitting={isSubmitting}>Change Password</SubmitButton>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Password;
