'use client';

import {
  CollapseIcon,
  DiscordIcon,
  GlobeIcon,
  LibraryIcon,
  LogoIcon,
  SearchIcon,
  TwitterIcon,
  ManagingUserIcon,
} from '../common/icons';
import LearnMoreButton from '../common-component/buttons/LearnMoreButton';
import NewThreadButton from '../common-component/buttons/NewThreadButton';
import LogOutButton from '../common-component/buttons/LogOutButton';
import DownloadButton from '../common-component/buttons/DownloadButton';
import Link from 'next/link';
import { LogIn, Sparkle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SiGnuprivacyguard } from 'react-icons/si';
import { HiLogout } from 'react-icons/hi';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '@/store/userSlice';

const Sidebar = ({
  setCollapseSidebar,
  collapseSidebar,
}: {
  setCollapseSidebar: (val: boolean) => void;
  collapseSidebar: boolean;
}) => {
  const [auth, useAuth] = useState(false);
  const pathname = usePathname(); // Get the current route
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false); // State for is_admin
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setIsAdmin(parsedData.is_admin || false); // Set is_admin state
    }
  }, []);

  // Function to get is_admin from localStorage
  const getIsAdminFromLocalStorage = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      dispatch(setCurrentUser(userData));
      try {
        const parsedData = JSON.parse(userData);
        console.log(parsedData)
        return parsedData.is_admin || false; // Return is_admin or false if not present
      } catch (error) {
        console.error('Error parsing userData from localStorage:', error);
        return false;
      }
    }
    return false;
  };

  // Update isAdmin state when localStorage changes
  useEffect(() => {
    // Set initial value
    setIsAdmin(getIsAdminFromLocalStorage());

    // Listen for localStorage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userData') {
        setIsAdmin(getIsAdminFromLocalStorage());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Hide the sidebar on specific routes (e.g., /auth)
  const isHidden = pathname === '/auth';

  const LogOutButtonClick = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('authMethod');
    localStorage.removeItem('nextauth.message');
    router.push('/auth'); // Redirect to the /auth page
  };

  return (
    <aside
      id="custom-sidebar"
      className={`w-64 bg-gray-800 text-white h-screen transition-transform duration-300 ${
        isHidden ? 'hidden' : 'block'
      }`}
    >
      <div className="flex flex-col justify-between pb-5 h-full font-sans">
        <div className="flex flex-col gap-6 font-sans">
          <div className="flex flex-row justify-between gap-3 px-2 mt-4 items-center">
            {!collapseSidebar && (
              <LogoIcon className="w-28 md:w-[200px] h-full pl-1" />
            )}
            <div
              className="hover:bg-[#2d3030] text-gray-400 hover:text-white rounded-full p-3 max-lg:hidden"
              onClick={() => setCollapseSidebar(!collapseSidebar)}
            >
              {!collapseSidebar ? (
                <CollapseIcon className="w-3 h-auto " />
              ) : (
                <HiLogout className="h-auto " />
              )}
            </div>
          </div>
          {!collapseSidebar && (
            <div className="px-4 w-full">
              <NewThreadButton />
            </div>
          )}
          <div
            className={`flex flex-col justify-center font-medium space-y-1 pl-1 ${
              !collapseSidebar && 'pr-4'
            }`}
          >
            <Link
              href={'/home'}
              className="text-gray-400 hover:text-gray-200  hover:bg-[#353636] py-2 px-4 rounded cursor-pointer  flex flex-row gap-2 items-center"
            >
              <SearchIcon className="h-4 w-4" />
              {!collapseSidebar && <p>Home</p>}
            </Link>
            <Link
              href={'/discover'}
              className="text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer  flex flex-row gap-1 items-center"
            >
              <GlobeIcon className="h-5 w-5" />
              {!collapseSidebar && <p>Discover</p>}
            </Link>
            <Link
              href={'/space'}
              className="text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer  flex flex-row gap-2 items-center"
            >
              <Sparkle className="h-4 w-4" />
              {!collapseSidebar && <p>Spaces</p>}
            </Link>
            <Link
              href={'/library'}
              className="text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer  flex flex-row gap-2 items-center"
            >
              <LibraryIcon className="h-4 w-4" />
              {!collapseSidebar && <p>Library</p>}
            </Link>
            {isAdmin && (
              <Link
                href={'/admin'}
                className="text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer  flex flex-row gap-2 items-center"
              >
                <ManagingUserIcon className="h-4 w-4" />
                {!collapseSidebar && <p>User Management</p>}
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="w-full" onClick={LogOutButtonClick}>
            {!collapseSidebar ? (
              <div className="px-4">
                <LogOutButton />
              </div>
            ) : (
              <div className="py-2 rounded-sm w-full hover:bg-[#353636]">
                <SiGnuprivacyguard className="text-white m-auto" />
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;