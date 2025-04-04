import { useEffect, useState } from 'react';
import { handleError } from '../utils/functions';
import axiosInstance from '../configs/axios.config';
import { toast } from 'react-toastify';

const useFetch = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(url);
        if (!data.error) {
          setData(data.data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [url]);

  return { isLoading, data };
};

export default useFetch;
