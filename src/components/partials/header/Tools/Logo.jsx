import React from 'react';
import useDarkMode from '@/hooks/useDarkMode';
import { Link } from 'react-router-dom';
import useWidth from '@/hooks/useWidth';

import MobileLogo from '../../../../assets/images/logo/Mobile2.png';
const Logo = () => {
  const [isDark] = useDarkMode();
  const { width, breakpoints } = useWidth();

  return (
    <div>
      <Link to="/dashboard">{width >= breakpoints.xl ? <img src={MobileLogo} alt="" className="w-12" /> : <img src={MobileLogo} alt="" className="w-12" />}</Link>
    </div>
  );
};

export default Logo;
