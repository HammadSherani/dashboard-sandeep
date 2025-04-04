import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button className="btn btn-primary py-2 px-3" type="button" onClick={() => navigate(-1)}>
      <Icon icon={'lucide:arrow-left'} width={24} />
    </button>
  );
};

export default BackButton;
