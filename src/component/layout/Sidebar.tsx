import {
  CollapseIcon,
  DiscordIcon,
  GlobeIcon,
  LibraryIcon,
  LogoIcon,
  SearchIcon,
  TwitterIcon,
} from '../common/icons';
import LearnMoreButton from '../common-component/buttons/LearnMoreButton';
import NewThreadButton from '../common-component/buttons/NewThreadButton';
import SignUpButton from '../common-component/buttons/SignUpButton';
import DownloadButton from '../common-component/buttons/DownloadButton';
import Link from 'next/link';
import { LogIn, Sparkle } from 'lucide-react';
import { useState } from 'react';
import { SiGnuprivacyguard } from 'react-icons/si';
import { HiLogout } from 'react-icons/hi';

const Sidebar = ({
  setCollapseSidebar,
  collapseSidebar
}: {
  setCollapseSidebar: (val: boolean) => void;
  collapseSidebar: boolean
}) => {
  const [auth, useAuth] = useState(false)
  return (
    <div className='flex flex-col justify-between pb-5 h-full font-sans'>
      <div className='flex flex-col gap-6 font-sans'>
        <div className='flex flex-row justify-between gap-3 px-2 mt-4 items-center'>
          {
            !collapseSidebar &&
            <LogoIcon className='w-28 md:w-[200px] h-full pl-1' />
          }
          <div
            className='hover:bg-[#2d3030] text-gray-400 hover:text-white rounded-full p-3 max-lg:hidden'
            onClick={() => setCollapseSidebar(!collapseSidebar)}
          >
            {!collapseSidebar ? <CollapseIcon className='w-3 h-auto ' /> : <HiLogout className='h-auto ' />}
          </div>
        </div>
        {!collapseSidebar &&
          <div className='px-4 w-full'>
            <NewThreadButton />
          </div>
        }
        <div
          className={`flex flex-col justify-center font-medium space-y-1 pl-1 ${!collapseSidebar && "pr-4"}`}
        >
          <Link href={"/"} className='text-gray-400 hover:text-gray-200  hover:bg-[#353636] py-2 px-4 rounded cursor-pointer  flex flex-row gap-2 items-center' >
            <SearchIcon className='h-4 w-4' />
            {!collapseSidebar && <p>Home</p>}
          </Link>
          <Link href={"/discover"}
            className='text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer  flex flex-row gap-1 items-center'
          >
            <GlobeIcon className='h-5 w-5' />
            {!collapseSidebar && <p>Discover</p>}
          </Link>
          <Link href={"/space"} className='text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer  flex flex-row gap-2 items-center'>
            <Sparkle className='h-4 w-4' />
            {!collapseSidebar && <p>Spaces</p>}
          </Link>
          <Link href={"/library"} className='text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer  flex flex-row gap-2 items-center'>
            <LibraryIcon className='h-4 w-4' />
            {!collapseSidebar && <p>Library</p>}
          </Link>
        </div>
      </div>
      {!auth &&
        <div className='flex flex-col gap-2'>
          <div className='w-full' onClick={() => useAuth(true)}>
            {!collapseSidebar ? <div className='px-4'><SignUpButton /></div> : <div className='py-2 rounded-sm w-full hover:bg-[#353636]'><SiGnuprivacyguard className='text-white m-auto' /></div>}
          </div>
          <div className='w-full'>
            {!collapseSidebar ? <div className='px-4'><SignUpButton text={`Log in`} /></div> : <div className='py-2 rounded-sm w-full hover:bg-[#353636]'><LogIn className=' text-white m-auto' /></div>}
          </div>
        </div>
      }
      {auth && !collapseSidebar &&
        <div className='mt-auto w-full'>
          <div className='flex flex-col px-4 py-1 gap-1 text-white'>
            <div>
              <p className='hover:text-teal-400 font-medium text-sm w-fit cursor-pointer'>
                Try Pro
              </p>
              <p className='text-sm font-sans text-gray-500'>
                Upgrade for image upload, smarter AI, and more Pro Search.
              </p>
            </div>
            <LearnMoreButton />
          </div>
          <div className='w-full h-[1px] bg-[#303131] my-2'></div>
          <div className='flex flex-row mb-6 justify-between px-2 text-gray-400  items-center'>
            <DownloadButton />
            <div className='flex  items-center'>
              <div className='p-2 rounded-full hover:bg-[#353636] hover:text-white'>
                <TwitterIcon className='w-[14px] h-[14px]' />
              </div>
              <div className='p-2 rounded-full hover:bg-[#353636] hover:text-white'>
                <DiscordIcon className='w-4 h-4' />
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default Sidebar;
