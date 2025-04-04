import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { handleError } from '../../../utils/functions.js';
import axiosInstance from '../../../configs/axios.config.js';
import SubmitButton from '../../../components/ui/SubmitButton';
import { toast } from 'react-toastify';
import Textinput from '../../../components/ui/Textinput.jsx';
import Card from '../../../components/ui/Card.jsx';
import Select from '../../../components/ui/Select.jsx';
import BackButton from '../../../components/ui/BackButton.jsx';

// Validation schema using Yup for City Name and State
const schema = yup.object({
    name: yup.string().required('City Name is required'),
    state: yup.string().required('State is required'),
});

const AddCity = () => {
    const [states, setStates] = useState([]); // Store states fetched from API
    const [isLoading, setIsLoading] = useState(true); // Loading state

    // Initialize React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
    });

    // Fetch states from the API
    useEffect(() => {
        const fetchStates = async () => {
            setIsLoading(true); // Set loading true before fetching
            try {
                const { data } = await axiosInstance.get('/admin/state'); // API endpoint for fetching states
                if (!data.error) {
                    setStates(
                        data.data.map((state) => ({
                            value: state._id, // State ID
                            label: state.name, // State name
                        }))
                    ); // Map states to value/label format for Select component
                } else {
                    toast.error('Failed to fetch states');
                }
            } catch (error) {
                handleError(error);
            } finally {
                setIsLoading(false); // Stop loading after fetching
            }
        };

        fetchStates();
    }, []);

    // Handle form submission
    const onSubmit = async (formData) => {
        try {
            const { name, state } = formData; // Extract state ID and city name
            const response = await axiosInstance.post('/admin/city', {
                name,
                stateId : state, // Send the selected state's ID
            });
            if (!response.data.error) {
                toast.success(response.data.message || 'City added successfully!');
                reset(); // Reset form after successful submission
            } else {
                toast.error(response.data.message || 'Failed to add city');
            }
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <Card title="Add City" headerslot={<BackButton />}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-4">
                    {/* State Select Dropdown */}
                    <div className="col-span-12 lg:col-span-6">
                        <label className="capitalize flex text-[16px] items-center gap-1 form-label">
                            State <span className="text-red-500">*</span>
                        </label>
                        <Select
                            name="state"
                            register={register}
                            error={errors.state}
                            options={states}
                            placeholder={isLoading ? 'Loading states...' : 'Select a state'}
                            isRequired
                        />
                    </div>

                    {/* City Name Field */}
                    <div className="col-span-12 lg:col-span-6">
                        <Textinput
                            isRequired
                            name="name"
                            type="text"
                            register={register}
                            label="City Name"
                            error={errors.name}
                            placeholder="Enter City Name"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-4 flex justify-end">
                    <SubmitButton className="btn-default" isSubmitting={isSubmitting}>
                        Submit
                    </SubmitButton>
                </div>
            </form>
        </Card>
    );
};

export default AddCity;
