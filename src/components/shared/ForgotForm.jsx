/* eslint-disable react/prop-types */
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Textinput from '../ui/Textinput';
import SubmitButton from '../ui/SubmitButton';

const schema = yup.object().shape({
  email: yup.string().email().required('Email is Required!'),
});

const ForgotForm = ({ onSubmit }) => {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm({ resolver: yupResolver(schema), mode: 'all' });

  return (
    <div className="LoginWrapper">
      <div className="container pt-5 md:px-0 px-10 ">
        <div className="row py-20 justify-center items-center">
          <div className="col-lg-4 col-md-6  bg-white shadow-lg rounded-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h3 className="text-2xl font-semibold text-center mb-6 text-gray-800">Forgot Password</h3>
              <div className="space-y-6">
                {/* Email Input */}
                <Textinput placeholder="Enter Your Email" label="Email" type="email" name={'email'} register={register} error={errors.email} isRequired />
                {/* Submit Button */}
                <div className="flex justify-center">
                  <SubmitButton
                    isSubmitting={isSubmitting}
                    text="Find Account"
                    className="w-full bg-[#d29224] text-white py-3 rounded-lg hover:bg-[#d29224c4]  transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotForm;
