import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { handleError } from '../../../utils/functions.js';
import axiosInstance from '../../../configs/axios.config.js';
import SubmitButton from '../../../components/ui/SubmitButton';
import { toast } from 'react-toastify';
import Textinput from '../../../components/ui/Textinput.jsx';
import Card from '../../../components/ui/Card.jsx';
import BackButton from '../../../components/ui/BackButton.jsx';

// Validation schema using Yup
const schema = yup.object({
    name: yup.string().required('State is required'),
});

const AddState = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({ resolver: yupResolver(schema), mode: 'all' });
    console.log(errors)

    // Handle form submission
    const onSubmit = async (data) => {
        
        try {
            const { name, } = data;
            const body = {
                name,
            };
            const response = await axiosInstance.post('/admin/state', body);
            if (!response.data.error) {
                toast.success(response.data.message);
                reset();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <Card title={'Add State'} headerslot={<BackButton />}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-12 gap-6">

                    {/* State Name Field */}
                    <div className="col-span-12">
                        <label className="capitalize text-lg font-medium flex items-center gap-1 text-gray-700">
                            State Name <span className="text-red-500">*</span>
                        </label>
                        <Textinput
                            isRequired
                            name={'name'}
                            type={'text'}
                            register={register}
                            error={errors.name}
                            placeholder="Enter State Name"
                            className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                        {errors.state && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
                    <SubmitButton
                        className="btn-default px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                        isSubmitting={isSubmitting}
                    >
                        Submit
                    </SubmitButton>
                </div>
            </form>
        </Card>
    );
};

export default AddState;
