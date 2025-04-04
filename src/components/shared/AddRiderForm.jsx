/* eslint-disable react/prop-types */
import BackButton from '../../components/ui/BackButton.jsx';
import Textinput from '../../components/ui/Textinput';
import Card from '../../components/ui/Card';
import Label from '../ui/Label';
import ErrorMsg from '../ui/ErrorMsg';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { handleError } from '../../utils/functions.js';
import axiosInstance from '../../configs/axios.config.js';
import Upload from '../../components/ui/upload';
import SubmitButton from '../../components/ui/SubmitButton';
import { toast } from 'react-toastify';
import Select from '../../components/ui/Select.jsx'
import { vehicleTypes } from '../../constant/data.js';

const schema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phoneNumber: yup
        .string()
        .matches(/^\d{11}$/, 'Phone number must be 11 digits')
        .required('Phone number is required'),
    dateOfBirth: yup.date().required('Date of Birth is required'),
    nicNumber: yup
        .string()
        .matches(/^\d{5}-\d{7}-\d{1}$/, 'NIC must follow the format 12345-1234567-1')
        .required('NIC Number is required'),
    licenseNumber: yup.string().required('License Number is required'),
    vehicleType: yup.string().required('Vehicle Type is required'),
    salary: yup.number().typeError("Salary Must Be Number").positive("Salary Must Be Positive").required('Salary is required'),
});

const AddRiderForm = ({ title }) => {
    const [nicFront, setNicFront] = useState([]);
    const [nicBack, setNicBack] = useState([]);
    const [licenseFront, setLicenseFront] = useState([]);
    const [licenseBack, setLicenseBack] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        control,
        setValue,
    } = useForm({ resolver: yupResolver(schema), mode: 'all' });

    const onSubmit = async (data) => {
        try {
            // Validate file uploads
            if (!nicFront.length || !nicBack.length || !licenseFront.length || !licenseBack.length) {
                toast.error('Please upload all required images');
                return;
            }

            // Remove dashes from NIC Number
            const formattedNIC = data.nicNumber.replace(/-/g, '');

            const fd = new FormData();

            fd.append('name', data.name);
            fd.append('email', data.email);
            fd.append('phoneNumber', data.phoneNumber);
            fd.append('dateOfBirth', data.dateOfBirth);
            fd.append('nicNumber', formattedNIC);
            fd.append('licenseNumber', data.licenseNumber);
            fd.append('vehicleType', data.vehicleType);
            fd.append('salary', data.salary);
            fd.append('nicFront', nicFront[0]);
            fd.append('nicBack', nicBack[0]);
            fd.append('licenseFront', licenseFront[0]);
            fd.append('licenseBack', licenseBack[0]);


            const { data: res } = await axiosInstance.post('/admin/riders/create-rider', fd);
            if (!res.error) {
                toast.success(res.message);
                reset();
                setNicFront([]);
                setNicBack([]);
                setLicenseFront([]);
                setLicenseBack([]);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <>
            <Card title={title} headerslot={<BackButton />}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-6">
                            <Textinput
                                isRequired
                                name={'name'}
                                type={'text'}
                                register={register}
                                label={'Name'}
                                error={errors.name}
                                placeholder="Enter Rider's Name"
                                onChange={(e) => setValue("name", e.target.value)}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Textinput
                                isRequired
                                name={'email'}
                                type={'email'}
                                register={register}
                                label={'Email'}
                                error={errors.email}
                                placeholder="Enter Rider's Email"
                                onChange={(e) => setValue("email", e.target.value)}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Textinput
                                isRequired
                                name={'phoneNumber'}
                                type={'text'}
                                register={register}
                                label={'Phone Number'}
                                error={errors.phoneNumber}
                                placeholder="Enter Phone Number"
                                onChange={(e) => setValue("phoneNumber", e.target.value)}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Textinput
                                isRequired
                                name={'dateOfBirth'}
                                type={'date'}
                                register={register}
                                label={'Date of Birth'}
                                error={errors.dateOfBirth}
                                placeholder="Select Date of Birth"
                                onChange={(e) => setValue("dateOfBirth", e.target.value)}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Textinput
                                isRequired
                                name={'nicNumber'}
                                type={'text'}
                                register={register}
                                label={'NIC Number'}
                                error={errors.nicNumber}
                                placeholder="12345-1234567-1"
                                onChange={(e) => setValue("nicNumber", e.target.value)}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Textinput
                                isRequired
                                name={'licenseNumber'}
                                type={'text'}
                                register={register}
                                label={'License Number'}
                                error={errors.licenseNumber}
                                placeholder="Enter License Number"
                                onChange={(e) => setValue("licenseNumber", e.target.value)}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Select name={'vehicleType'} register={register} label={'Vehicle Type'} error={errors.vehicleType} options={vehicleTypes} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Textinput
                                isRequired
                                name={'salary'}
                                type={'number'}
                                register={register}
                                label={'Base Salary'}
                                error={errors.salary}
                                placeholder="Enter Rider Base Salary"
                                onChange={(e) => setValue("salary", e.target.value)}
                            />
                        </div>
                        <div className="col-span-full md:col-span-6 mt-5">
                            <Label label={'NIC Front'} isRequired />
                            <Upload
                                showList
                                draggable
                                fileList={nicFront}
                                accept="image/*"
                                uploadLimit={1}
                                onChange={(file) => setNicFront(file)}
                                onFileRemove={(file) => setNicFront(file)}
                            />
                        </div>
                        <div className="col-span-full md:col-span-6 mt-5">
                            <Label label={'NIC Back'} isRequired />
                            <Upload
                                showList
                                draggable
                                fileList={nicBack}
                                accept="image/*"
                                uploadLimit={1}
                                onChange={(file) => setNicBack(file)}
                                onFileRemove={(file) => setNicBack(file)}
                            />
                        </div>
                        <div className="col-span-full md:col-span-6 mt-5">
                            <Label label={'License Front'} isRequired />
                            <Upload
                                showList
                                draggable
                                fileList={licenseFront}
                                accept="image/*"
                                uploadLimit={1}
                                onChange={(file) => setLicenseFront(file)}
                                onFileRemove={(file) => setLicenseFront(file)}
                            />
                        </div>
                        <div className="col-span-full md:col-span-6 mt-5">
                            <Label label={'License Back'} isRequired />
                            <Upload
                                showList
                                draggable
                                fileList={licenseBack}
                                accept="image/*"
                                uploadLimit={1}
                                onChange={(file) => setLicenseBack(file)}
                                onFileRemove={(file) => setLicenseBack(file)}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <SubmitButton  isSubmitting={isSubmitting}>
                            Submit
                        </SubmitButton>
                    </div>
                </form>
            </Card>
        </>
    );
};

export default AddRiderForm;
