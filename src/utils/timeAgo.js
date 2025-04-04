import dayjs from 'dayjs';

// Custom function to format time differences
const timeAgo = (date) => {
  const now = dayjs();
  const targetDate = dayjs(date);

  const diffInSeconds = now.diff(targetDate, 'second');
  const diffInMinutes = now.diff(targetDate, 'minute');
  const diffInHours = now.diff(targetDate, 'hour');
  const diffInDays = now.diff(targetDate, 'day');
  const diffInMonths = now.diff(targetDate, 'month');
  const diffInYears = now.diff(targetDate, 'year');

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  }
};

export default timeAgo;
