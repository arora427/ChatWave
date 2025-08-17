import useAuthUser from '../hooks/useAuthUser.js'
import { useLocation, Link } from 'react-router';
import Logo from '../asset/Logo.png';
import { BellIcon, LogOutIcon, UsersRound } from 'lucide-react';
import ThemeSelector from './ThemeSelector.jsx';
import useLogout from '../hooks/useLogout.js';

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();

  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
      <div className="container mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full gap-1/2 sm:gap-4">
          
          {/* only in chat page */}
          {isChatPage && (
            <div className="pl-0 mr-auto">
              <Link to="/" className="flex items-center gap-2.5 ">
                <img src={Logo} className="  max-sm:w-8 sm:w-10" />
                <span className="max-sm:text-xl sm:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-400 tracking-wider">
                  ChatWave
                </span>
              </Link>
            </div>
          )}

          {/* Notification Icon */}
          <Link to={"/notifications"}>
            <button className='btn btn-ghost btn-circle flex items-center justify-center'>
              <BellIcon className='h-5 w-5 sm:size-6 text-base-content opacity-70' />
            </button>
          </Link>

          <Link to={"/friends"}>
          <button className='btn btn-ghost btn-circle flex items-center justify-center'>
            <UsersRound className='h-5 w-5 sm:size-6 text-base-content opacity-70' />
          </button>
          </Link>

          {/* Theme Selector */}
          <ThemeSelector />


          {/* Avatar */}
          <div className="avatar flex items-center justify-center">
            <div className=" w-8 sm:w-9  rounded-full">
              <img src={authUser?.profilepic} alt="user avatar" rel='noreference' />
            </div>
          </div>

          {/* Logout Button */}
          <button className='btn btn-ghost btn-circle flex items-center justify-center' onClick={logoutMutation}>
            <LogOutIcon className='h-5 w-5 sm:size-6 text-base-content opacity-70' />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
