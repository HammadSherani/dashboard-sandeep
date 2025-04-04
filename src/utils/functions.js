import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
export function handleError(error) {
  if (isAxiosError(error)) {
    if (error.message === 'canceled') {
      return;
    }
    if (error.response?.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error(error.message);
    }
  } else {
    console.error('Error:', error);
  }
}

export const formatImageName = (value) => {
  if (!value) {
    return null;
  }

  const prod = import.meta.env.PROD;

  return prod ? `http://192.168.100.203:2000/uploads/${value}` : `http://localhost:2000/uploads/${value}`;
};

export function formatPrice(price) {
  return parseFloat(price).toLocaleString('en-US', { style: 'currency', currency: 'AED', maximumFractionDigits: 2 });
}

/**
 *
 * @param {number} price
 * @param {number} discount
 * @returns {number}
 */
export function calculateDiscountPrice(price, discount) {
  return price - price * (discount / 100);
}

export function getGreeting() {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
}

export const formatDate = (value, format = 'DD/MM/YYYY hh:mm:A') => {
  return dayjs(value).format(format);
};

export function formatSessionTime(minutes) {
  if (minutes < 0) return 'Invalid time';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let formattedTime = '';

  if (hours > 0) {
    if (hours === 1 && remainingMinutes > 0) {
      formattedTime += '1 and Half Hour Session';
    } else {
      formattedTime += `${hours} Hour${hours > 1 ? 's' : ''}`;
    }
  }

  if (remainingMinutes > 0) {
    formattedTime += hours > 0 ? ` and ${remainingMinutes} Minute${remainingMinutes > 1 ? 's' : ''}` : `${remainingMinutes} Minute${remainingMinutes > 1 ? 's' : ''}`;
  }

  if (formattedTime === '') {
    formattedTime = '0 Minutes Session';
  } else {
    formattedTime += ' Session';
  }

  return formattedTime;
}


export const formatTimeTo12Hour = (time) => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':');
  const parsedHours = parseInt(hours, 10);
  
  const period = parsedHours >= 12 ? 'PM' : 'AM';
  const formattedHours = parsedHours % 12 || 12; // Convert 0 to 12
  
  return `${formattedHours}:${minutes} ${period}`;
};

// Format time keeping 24-hour format (e.g., "22:14 hrs")
export const formatTime24Hour = (time) => {
  if (!time) return '';
  return `${time} hrs`;
};