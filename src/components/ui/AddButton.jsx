import { useNavigate } from 'react-router-dom';

/* eslint-disable react/prop-types */
const AddButton = ({ className = 'btn btn-primary py-[6px] px-4', type = 'button', title = 'Add', children, link = 'add' }) => {
  const navigate = useNavigate();
  return (
    <button className={className} type={type} onClick={() => navigate(link)}>
      {children ? children : title}
    </button>
  );
};

export default AddButton;
