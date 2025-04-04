/* eslint-disable react/prop-types */
import BackButton from '../../../components/ui/BackButton.jsx';
import Textinput from '../../../components/ui/Textinput';
import Card from '../../../components/ui/Card';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { handleError } from '../../../utils/functions.js';
import axiosInstance from '../../../configs/axios.config.js';
import SubmitButton from '../../../components/ui/SubmitButton';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../../components/Loading.jsx';

const schema = yup.object({
    vatCharges: yup.number().typeError("VAT Charges Must Be Number").positive("VAT Charges Must Be Positive").required('VAT Charges is required'),
    baseCharges: yup.number().typeError("Base Charges Must Be Number").positive("Base Charges Must Be Positive").required('Base Charges is required'),
    additionalCharges: yup.number().typeError("Additional Charges Must Be Number").positive("Additional Charges Must Be Positive").required('Additional Charges is required'),
});

const UpdateCharges = () => {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(true)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({ resolver: yupResolver(schema), mode: 'all' });

    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoading(true);
                const { data } = await axiosInstance.get(`/admin/user/${id}/charges`)
                if (!data.error) {
                    reset(data.data);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                handleError(error)
            } finally {
                setIsLoading(false);
            }
        }
        getData()
    }, [id])



    const onSubmit = async (data) => {
        try {
            const { data: res } = await axiosInstance.put(`/admin/user/${id}/charges`, data);
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
        <Loading loading={isLoading}>
            <Card title={"Charges"} headerslot={<BackButton />}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-6">
                            <Textinput
                                isRequired
                                name={'vatCharges'}
                                type={'number'}
                                register={register}
                                label={'VAT Charges'}
                                error={errors.vatCharges}
                                placeholder="Enter VAT Charges"
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Textinput
                                isRequired
                                name={'baseCharges'}
                                type={'number'}
                                register={register}
                                label={'Base Charges'}
                                error={errors.baseCharges}
                                placeholder="Enter Base Charges"
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Textinput
                                isRequired
                                name={'additionalCharges'}
                                type={'number'}
                                register={register}
                                label={'Additional Charges'}
                                error={errors.additionalCharges}
                                placeholder="Enter Additional Charges"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <SubmitButton isSubmitting={isSubmitting}>
                            Update Charges
                        </SubmitButton>
                    </div>
                </form>
            </Card>
        </Loading>
    );
};

export default UpdateCharges;
