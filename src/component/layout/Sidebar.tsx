'use client';

import {
  CollapseIcon,
  DiscordIcon,
  GlobeIcon,
  LibraryIcon,
  LogoIcon,
  SearchIcon,
  ManagingUserIcon,
  AdministratorIcon,
  ChatHistoryIcon,
  ApiKeyIcon,
  ChatBotIcon,
} from '../common/icons';
import NewThreadButton from '../common-component/buttons/NewThreadButton';
import LogOutButton from '../common-component/buttons/LogOutButton';
import Link from 'next/link';
import { LogIn, Sparkle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SiGnuprivacyguard } from 'react-icons/si';
import { HiLogout } from 'react-icons/hi';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '@/store/userSlice';
import { setTitleList } from '@/store/chatSlice';
import { gettitlelist, deletethread } from '@/store/apis';

const Sidebar = ({
  setCollapseSidebar,
  collapseSidebar,
}: {
  setCollapseSidebar: (val: boolean) => void;
  collapseSidebar: boolean;
}) => {
  const [auth, useAuth] = useState(false);
  const [adminbutton, setAdminbutton] = useState(false);
  const [librarybutton, setLibrarybutton] = useState(false);
  const [deletingThreadId, setDeletingThreadId] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const isAdmin = useSelector((state: any) =>
    state.users.currentuser !== undefined ? state.users.currentuser.is_admin : null
  );
  const user = useSelector((state: any) => state.users.currentuser);
  const titlelist = useSelector((state: any) => state.chats.titlelist);

  useEffect(() => {
    const data = async () => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        dispatch(setCurrentUser(parsedData));
      }
      try {
        const response = await gettitlelist(user.id, dispatch);
        dispatch(setTitleList(response.title_list));
      } catch (error) {
        console.error('Error:', error);
      }
    };
    data();
  }, [isAdmin]);

  useEffect(() => {
    const data = async () => {
      try {
        const response = await gettitlelist(user.id, dispatch);
        dispatch(setTitleList(response.title_list));
      } catch (error) {
        console.error('Error:', error);
      }
    };
    data();
  }, [librarybutton]);

  const isHidden = pathname === '/auth';

  const LogOutButtonClick = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('authMethod');
    localStorage.removeItem('nextauth.message');
    router.push('/auth');
  };

  return (
    <aside
      id="custom-sidebar"
      className={`transition-width duration-300 bg-gray-800 text-white h-screen 
        ${isHidden ? 'hidden' : ''}
        ${collapseSidebar ? 'w-16' : 'w-64'} xm:w-64 overflow-y-auto`} /* Add overflow-y-auto */
    >
      <div className="flex flex-col justify-between pb-5 h-full font-sans">
        <div className="flex flex-col gap-6">
          <div className="flex flex-row justify-between gap-3 px-2 mt-4 items-center">
            {!collapseSidebar && (
              <LogoIcon className="w-28 md:w-[200px] h-full pl-1" />
            )}
            <div
              className="hover:bg-[#2d3030] text-gray-400 hover:text-white rounded-full p-3"
              onClick={() => setCollapseSidebar(!collapseSidebar)}
            >
              {!collapseSidebar ? (
                <CollapseIcon className="w-3 h-auto" />
              ) : (
                <HiLogout className="h-auto" />
              )}
            </div>
          </div>
          {!collapseSidebar && (
            <div className="px-4 w-full">
              <NewThreadButton />
            </div>
          )}
          <div className={`flex flex-col justify-center font-medium space-y-1 pl-1 ${collapseSidebar ? 'pr-0' : 'pr-4'}`}>
            <Link
              href={'/home'}
              className="text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer flex flex-row gap-2 items-center"
            >
              <SearchIcon className="h-4 w-4" />
              {!collapseSidebar && <p>Home</p>}
            </Link>
            <Link
              href={'/discover'}
              className="text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer flex flex-row gap-1 items-center"
            >
              <GlobeIcon className="h-5 w-5" />
              {!collapseSidebar && <p>Discover</p>}
            </Link>
            <Link
              href={'/space'}
              className="text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer flex flex-row gap-2 items-center"
            >
              <Sparkle className="h-4 w-4" />
              {!collapseSidebar && <p>Spaces</p>}
            </Link>
            <Link
              href={'/library'}
              className="text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer flex flex-row gap-2 items-center"
              onClick={() => setLibrarybutton(!librarybutton)}
            >
              <LibraryIcon className="h-4 w-4" />
              {!collapseSidebar && <p>Library {isAdmin}</p>}
            </Link>

            {librarybutton && Array.isArray(titlelist) && titlelist.length > 0 && (
              titlelist.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-row justify-between items-center text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer pl-10"
                >
                  <Link
                    href={`/chat/${item.chat_id}`}
                    className="flex flex-row gap-2 items-center w-full"
                  >
                    <ChatBotIcon className="h-4 w-4" />
                    {!collapseSidebar && <p>{item.chat_title}</p>}
                  </Link>

                  {!collapseSidebar && (
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeletingThreadId(item.chat_id);
                        const confirmed = window.confirm('Are you sure you want to delete this chat?');
                        if (confirmed) {
                          try {
                            await deletethread(item.chat_id, dispatch, titlelist);
                            const response = await gettitlelist(user.id, dispatch);
                            dispatch(setTitleList(response.title_list));
                          } catch (err) {
                            console.error('Failed to delete thread', err);
                          } finally {
                            setDeletingThreadId(null);
                          }
                        }
                      }}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      {deletingThreadId === item.chat_id ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 011-1h6a1 1 0 011 1v1h4a1 1 0 110 2h-1v11a2 2 0 01-2 2H5a2 2 0 01-2-2V5H2a1 1 0 110-2h4V2zm2 5a1 1 0 10-2 0v8a1 1 0 102 0V7zm4 0a1 1 0 10-2 0v8a1 1 0 102 0V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              ))
            )}

            {isAdmin && (
              <>
                <div
                  className="text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer flex flex-row gap-2 items-center"
                  onClick={() => setAdminbutton(!adminbutton)}
                >
                  <AdministratorIcon className="h-4 w-4" />
                  {!collapseSidebar && <p>Administrator</p>}
                </div>
                {adminbutton && (
                  <>
                    <Link
                      href={'/admin/users'}
                      className="text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer flex flex-row gap-2 items-center pl-10"
                    >
                      <ManagingUserIcon className="h-4 w-4" />
                      {!collapseSidebar && <p>User management</p>}
                    </Link>
                    <Link
                      href={'/admin/chats'}
                      className="text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer flex flex-row gap-2 items-center pl-10"
                    >
                      <ChatHistoryIcon className="h-4 w-4" />
                      {!collapseSidebar && <p>Chat history</p>}
                    </Link>
                    <Link
                      href={'/admin/apikeys'}
                      className="text-gray-400 hover:text-gray-200 hover:bg-[#353636] py-2 px-4 rounded cursor-pointer flex flex-row gap-2 items-center pl-10"
                    >
                      <ApiKeyIcon className="h-4 w-4" />
                      {!collapseSidebar && <p>API key management</p>}
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="w-full" onClick={LogOutButtonClick}>
            {!collapseSidebar ? (
              <div className="px-4">
                <div className="mx-2 bg-[#20b8cd] rounded-sm hover:opacity-80 flex justify-center text-white p-2">
                  <button className='w-full flex flex-row font-medium text-gray-800 font-sans justify-center cursor-pointer'>
                    Log out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
