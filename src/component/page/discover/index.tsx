"use client"

import Header from '@/component/layout/Header';
import MainContent from './MainContent';
import { GlobeIcon } from '@/component/common/icons';

const Discover = () => {
  return (
    <div className='flex flex-col'>
      <div className='xl:mx-20'>
        <Header header='Discover' Icon={GlobeIcon} />
      </div>

      <div className='w-full h-[1px] bg-[#303131] '></div>
      <MainContent />
    </div>
  );
};

export default Discover;
