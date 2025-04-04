/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import axiosInstance from '../../configs/axios.config';
import { handleError } from '../../utils/functions';
import Select from '../ui/Select';

const AddressFilter = ({ defaultValue, setFilter }) => {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(defaultValue || '');

  useEffect(() => {
    const controller = new AbortController();
    const fetchAddresses = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/address/user-address`, { signal: controller.signal });
        if (data) {
          setOptions(data.data);
        }
      } catch (error) {
        handleError(error);
      }
    };
    fetchAddresses();
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
    setFilter?.(event.target.value);
  };

  return (
    <>
      <Select id={'address'} options={options} value={value} onChange={handleChange} placeholder="Select the Address to Filter" classGroup="min-w-[200px]" />
    </>
  );
};

export default AddressFilter;
