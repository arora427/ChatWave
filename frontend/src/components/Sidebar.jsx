import React from 'react';
import useAuthUser from '../hooks/useAuthUser.js'; // This seems to be unused in this component.
import { useLocation, Link } from 'react-router';
import Logo from '../asset/Logo.png'
import { BellIcon, HomeIcon, Users } from 'lucide-react';

const Sidebar = () => {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
            <div className="p-3.5 border-b border-base-300">
                <Link to="/" className='flex items-center gap-2.5 '>
                    <img src={Logo} className="w-auto h-9" />
                    <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-400 tracking-wider" >
                        ChatWave
                    </span>
                </Link>
            </div>
            <nav className='flex-1 p-1 space-y-1'>
                <Link
                    to="/"
                    className={`btn btn-ghost border-0 btn-circle justify-start w-full gap-3 px-5  normal-case  ${currentPath === "/" ? "btn-active" : ""
                        }`}
                >
                    <HomeIcon className="size-5  text-base-content opacity-70" />
                    <span>Home</span>
                </Link>

                <Link
                    to="/friends"
                    className={`btn btn-ghost border-0 btn-circle justify-start w-full gap-3 px-5   normal-case  ${currentPath === "/friends" ? "btn-active" : ""
                        }`}
                >
                    <Users className="size-5  text-base-content opacity-70" />
                    <span>Friends</span>
                </Link>

                <Link
                    to="/notifications"
                    className={`btn btn-ghost border-0 btn-circle justify-start w-full gap-3 px-5  normal-case  ${currentPath === "/notifications" ? "btn-active" : ""
                        }`}
                >
                    <BellIcon className="size-5  text-base-content opacity-70" />
                    <span>Notifications</span>
                </Link>
            </nav>
            {/* User Profile */}
            <div className="p-4 border border-base-300 mt-auto ">
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            <img src={authUser?.profilepic} alt="User Avatar" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <p className="font-semibold text-sm">{authUser?.fullname}</p>
                        <p className="text-xs text-success flex items-center gap-1">
                            <span className="size-2 rounded-full bg-success inline-block" />
                            Online
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
