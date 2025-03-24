import {
  AIIcon,
  ArtsIcon,
  EntertainmentIcon,
  FinanceIcon,
  SportsIcon,
} from '@/component/common/icons';
import SignUpButton from '../buttons/SignUpButton';

const InterestCard = () => {
  return (
    <div className='lg:ml-6 mt-[64px] w-[20rem] rounded-lg bg-[#08676c6d] h-fit p-3'>
      <div className='flex flex-col gap-2 text-gray-200'>
        <div className='flex flex-row justify-between text-base font-sans items-center font-medium'>
          <p>Make it yours</p>
          <p className='font-light'>x</p>
        </div>
        <div className='text-sm  text-gray-400'>
          Select topics and interests to <br /> customize your Discover
          experience
        </div>
        <div className='flex flex-col md:grid md:grid-cols-2 gap-x-0 gap-y-2 text-sm'>
          <div className='p-1.5 bg-[#08676c8f] h-fit  rounded cursor-pointer text-gray-200 hover:text-gray-500 w-fit flex items-center  gap-1.5'>
            <AIIcon className='w-4 h-4' />
            <p>Tech & Science</p>
          </div>
          <div className='p-1.5 bg-[#08676c8f] h-fit  rounded cursor-pointer text-gray-200 hover:text-gray-500 w-fit flex items-center  gap-1.5'>
            <FinanceIcon className='w-4 h-4' />
            <p>Finance</p>
          </div>
          <div className='p-1.5 bg-[#08676c8f] h-fit  rounded cursor-pointer text-gray-200 hover:text-gray-500 w-fit flex items-center  gap-1.5'>
            <ArtsIcon className='w-4 h-4' />
            <p>Art & Culture</p>
          </div>
          <div className='p-1.5 bg-[#08676c8f] h-fit  rounded cursor-pointer text-gray-200 hover:text-gray-500 w-fit flex items-center  gap-1.5'>
            <SportsIcon className='w-4 h-4' />
            <p>Sports</p>
          </div>
          <div className='p-1.5 bg-[#08676c8f] h-fit  rounded cursor-pointer text-gray-200 hover:text-gray-500 w-fit flex items-center  gap-1.5'>
            <EntertainmentIcon className='w-4 h-4' />
            <p>Entertainment</p>
          </div>
        </div>
      </div>
      <div className='h-[0.4px] my-4 bg-gray-600 w-full'></div>
      <SignUpButton text='Save Interests' />
    </div>
  );
};

export default InterestCard;
