import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/Card';
import { formatDate, handleError } from '../../../utils/functions';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../configs/axios.config';
import DashboardLoader from '../../../components/Loading';
import BackButton from '../../../components/ui/BackButton';
import { toast } from 'react-toastify';

const details = () => {
    const { id } = useParams();
    const [isShow, setIsShow] = useState(false)
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const controller = new AbortController();
        const getData = async () => {
          try {
            setIsLoading(true);
            const { data } = await axiosInstance.get(`/admin/token/${id}`, { signal: controller.signal });

            if(!data.error){
              setData(data.data);
            }
          } catch (error) {
            handleError(error);
          } finally {
            setIsLoading(false);
          }
        };
        getData();
    
        return () => {
          controller.abort();
        };
      }, []);

    return (
        <DashboardLoader loading={isLoading}>
            <Card className="mt-4" title="Api Token Details" headerslot={<BackButton />}>
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-6">
                        <h5 className='px-2 mb-3'>Project Configuration</h5>
                        <div className='bg-gray-100 rounded-xl py-4 px-5'>
                            <div className='flex items-center justify-between mb-2'>
                                <h6 className='text-base'>Auto Generated</h6>
                                <h6 className='text-base text-[#ff5e14] cursor-pointer hover:text-[#ff5e60]'>View All</h6>
                            </div>

                            <div className='flex items-center gap-2 mb-1'>
                            <span>{isShow ? `${data?.token?.split('').slice(0, 50).join('')}` : "*****************************************************"}</span>
                                <Icon icon="mdi:eye-outline" className='cursor-pointer' width="20" height="20" onClick={() => setIsShow(!isShow)} />
                                <Icon onClick={() => {
                                    navigator.clipboard.writeText(data?.token);
                                    toast.success('Token Copied to Clipboard')}} 
                                    icon="tabler:copy" className='cursor-pointer' width="20" height="20" 
                                />
                            </div>
                            <span><strong>Last Updated on:</strong> 20 Dec 2024 07:00 AM</span>
                        </div>
                    </div>

                    <div className="col-span-6 ">
                        <h5 className='px-2 mb-3'>Technical Support</h5>
                        <div className='bg-gray-100 rounded-xl py-4 px-5'>
                            <div>
                                <h6 className='text-2xl mb-1'>Talk With Our Solution Team</h6>
                                <p className='text-base'>
                                    For any technical queries, please contact our support team at <a href="mailto:info@afzdelivery" className='text-[#ff5e14]'>info@afzdelivery</a>.
                                </p>
                            </div>

                            <div className='flex items-center gap-2 mb-1 mt-[20px] justify-end'>
                                <button className='btn btn-primary py-[6px] px-4'>Ask Your Query</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 flex items-center justify-between px-2">
                        <h6 className=''>Usage</h6>
                        <span><strong>Last Updated on:</strong> 20 Dec 2024 07:00 AM</span>
                    </div>
                    <div className="col-span-6">
                        <div className="flex justify-between items-center px-6 py-8 bg-gray-100 text- rounded-lg shadow-sm w-full max-w-4xl">
                            {/* Left Section */}
                            <div className="flex flex-col gap-8">
                                {/* First Row */}
                                <div className="">
                                    <p className="text-xl font-semibold">0 mins</p>
                                    <p className="text-sm text-gray-400">Recording</p>
                                </div>
                                <div className="">
                                    <p className="text-xl font-semibold">0 mins</p>
                                    <p className="text-sm text-gray-400">RTMP Simulcast</p>
                                </div>

                            </div>

                            {/* Right Section */}
                            <div className="flex flex-col items-center justify-center border-l-2 px-6 border-gray-300">
                                <div className="relative w-20 h-20">
                                    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
                                        <circle
                                            className="text-[#ff5e14]"
                                            strokeWidth="3.8"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="15.915"
                                            cx="18"
                                            cy="18"
                                        />
                                        <circle
                                            className="text-[#ff5e14]"
                                            strokeWidth="3.8"
                                            strokeLinecap="round"
                                            strokeDasharray="100, 100"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="15.915"
                                            cx="18"
                                            cy="18"
                                            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-xl font-semibold">100%</p>
                                    </div>
                                </div>
                                <p className="text-sm mt-2 text-center">
                                    <span className="font-bold">300 mins left</span> / 300 free minutes
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-6">
                        <div className="flex justify-between items-center px-6 py-8 bg-gray-100 rounded-lg shadow-sm w-full max-w-4xl">
                            {/* Left Section */}
                            <div className="grid grid-cols-3 gap-4 flex-grow">
                                {/* First Row */}
                                <div className="">
                                    <p className="text-xl font-semibold">0 mins</p>
                                    <p className="text-sm text-gray-400">Recording</p>
                                </div>
                                <div className="">
                                    <p className="text-xl font-semibold">0 mins</p>
                                    <p className="text-sm text-gray-400">RTMP Simulcast</p>
                                </div>
                                {/* Second Row */}
                                <div className="">
                                    <p className="text-xl font-semibold">0 mins</p>
                                    <p className="text-sm text-gray-400">Transcription</p>
                                </div>
                                <div className="">
                                    <p className="text-xl font-semibold">0 mins</p>
                                    <p className="text-sm text-gray-400">Cloud Storage</p>
                                </div>
                                {/* Third Row */}
                                <div className="">
                                    <p className="text-xl font-semibold">0 mins</p>
                                    <p className="text-sm text-gray-400">Livestream Encoding</p>
                                </div>
                                <div className="">
                                    <p className="text-xl font-semibold">0 mins</p>
                                    <p className="text-sm text-gray-400">Summary</p>
                                </div>
                            </div>

                            {/* Right Section */}
                            <div className="flex flex-col items-center justify-center border-l-2 border-gray-300">
                                <div className="relative w-20 h-20">
                                    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
                                        <circle
                                            className="text-[#ff5e14]"
                                            strokeWidth="3.8"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="15.915"
                                            cx="18"
                                            cy="18"
                                        />
                                        <circle
                                            className="text-[#ff5e14]"
                                            strokeWidth="3.8"
                                            strokeLinecap="round"
                                            strokeDasharray="100, 100"
                                            stroke="currentColor"
                                            fill="transparent"
                                            r="15.915"
                                            cx="18"
                                            cy="18"
                                            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-xl font-semibold">100%</p>
                                    </div>
                                </div>
                                <p className="text-sm mt-2 text-center">
                                    <span className="font-bold">300 mins left</span> / 300 free minutes
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </DashboardLoader>
    )
}

export default details