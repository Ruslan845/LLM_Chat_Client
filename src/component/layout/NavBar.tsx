import {
  AIIcon,
  ArtsIcon,
  EntertainmentIcon,
  FinanceIcon,
  SportsIcon,
  StartIcon,
} from '../common/icons';

const NavBar = () => {
  return (
    <div className='sticky z-50 px-0.5 top-2 flex flex-row md:gap-1.5  py-3 text-xs font-medium bg-[#181b1ae0] backdrop-blur-md items-center overflow-auto '>
      <div className='p-2 md:p-3 h-fit rounded cursor-pointer bg-blue-400 text-gray-200 hover:text-gray-500 w-fit flex items-center justify-center gap-1.5'>
        <StartIcon className='w-4 h-4' />
        <p>Top</p>
      </div>
      <div className='p-2 md:p-3 h-fit  rounded cursor-pointer text-gray-200 hover:text-gray-500 w-fit flex items-center justify-center gap-1.5'>
        <AIIcon className='w-4 h-4' />
        <p>Tech & Science</p>
      </div>
      <div className='p-2 md:p-3 h-fit  rounded cursor-pointer text-gray-200 hover:text-gray-500 w-fit flex items-center justify-center gap-1.5'>
        <FinanceIcon className='w-4 h-4' />
        <p>Finance</p>
      </div>
      <div className='p-2 md:p-3 h-fit  rounded cursor-pointer text-gray-200 hover:text-gray-500 w-fit flex items-center justify-center gap-1.5'>
        <ArtsIcon className='w-4 h-4' />
        <p>Art & Culture</p>
      </div>
      <div className='p-2 md:p-3 h-fit  rounded cursor-pointer text-gray-200 hover:text-gray-500 w-fit flex items-center justify-center gap-1.5'>
        <SportsIcon className='w-4 h-4' />
        <p>Sports</p>
      </div>
      <div className='p-2 md:p-3 h-fit  rounded cursor-pointer text-gray-200 hover:text-gray-500 w-fit flex items-center justify-center gap-1.5'>
        <EntertainmentIcon className='w-4 h-4' />
        <p>Entertainment</p>
      </div>
    </div>
  );
};

export default NavBar;
