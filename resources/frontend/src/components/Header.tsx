
import {useState} from 'react'
import {MdGTranslate} from "react-icons/md";
import {IoLogInOutline} from "react-icons/io5";
import {FaBook, FaUser} from "react-icons/fa";
import {RiMenuLine} from "react-icons/ri";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {Link} from "react-router-dom";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {IoIosArrowDown} from "react-icons/io";
import {GoBell} from "react-icons/go";
import {TbLogout2} from "react-icons/tb";
import NavbarList from "./home/Navbar-List.tsx";
import {enqueueSnackbar} from "notistack";
import {clearUser} from "../../redux/user-slice.ts";
import apiClient from "../../ApiClient.ts";

export default function Header() {

    const user = useSelector((state: RootState) => state.user)
    const checkIsLocationIsNotInNavlinkSlice = useSelector((state: RootState) => state.checkIsLocationIsNotInNavlinkSlice)
    const dispatch = useDispatch()

    const [isActive, setIsActive] = useState({
        home: true,
        categories: false,
        authors: false
    });
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }
    const handleActiveLink = (type: string) => {
        setIsActive({
            home: false,
            categories: false,
            authors: false,
            [type]: true
        })
    }

    const singOut = () => {
        apiClient().post('/sign-out', {},
            {headers: {'Content-Type': 'application/json', 'Authorization':'Bearer ' + localStorage.getItem('token')}})
            .then(() => {
                localStorage.removeItem('token')
                localStorage.removeItem('expires_at')
                dispatch(clearUser())
            }).catch(err => {
                enqueueSnackbar(err.response.data.message, {variant: "error"})
        })
    }


    return (
        <header className={`${location.pathname === '/add-book-to-store' ? 'shadow-sm' : ''} z-10 border-t-[3px] border-main_color text-text_color flex flex-col items-center gap-y-6`}>
            <div className={`container w-full relative`}>
                <div>
                    <button className={`absolute right-2 sm:right-0 top-0 flex items-center gap-x-2 bg-main_color text-white px-3 py-1 rounded-b font-tajawal-semibold`}>
                        العربية<MdGTranslate />
                    </button>
                    <Link
                        to={`/`}
                        className={`block w-fit`}
                    >
                        <img
                            src={`/logo.svg`}
                            alt={`logo`}
                            className={`mt-10 ml-2 sm:ml-0`}
                        />
                    </Link>
                </div>
            </div>
            <div className={`border-t w-full flex flex-col items-center gap-y-0 sm:gap-y-3 lg:gap-y-0`}>
                <nav className={`w-full flex flex-col items-center border-b border-border_color`}>
                    <div className={`w-full container flex justify-between items-center font-roboto-bold max-sm:px-2`}>
                        <div className={`flex items-center gap-x-4 h-[53px]`}>
                            <Link
                                to={`/`}
                                className={`px-4 border-x w-fit hidden sm:block`}
                            >
                                <img
                                    src={`/nav-logo.svg`}
                                    alt={`nav-logo`}
                                    className={`py-1`}
                                    width={45}
                                />
                            </Link>
                            <ul className={`hidden sm:flex gap-x-7 h-full pt-3`}>
                                <NavbarList
                                    isActive={isActive}
                                    handleActiveLink={handleActiveLink}
                                    checkIsLocationIsNotInNavlinkSlice={checkIsLocationIsNotInNavlinkSlice}
                                />
                            </ul>
                            {/*  Menu Icon  */}
                            <div
                                onClick={toggleMenu}
                                className={`border p-2 rounded sm:hidden`}
                            >
                                <RiMenuLine className={`size-5`}/>
                            </div>
                        </div>
                        <div className={`sm:hidden flex lg:flex font-roboto-bold gap-x-2`}>
                            {!user?.id &&
                                <>
                                    <Link
                                        to={`/sign-in`}
                                        className={`flex gap-x-2 items-center rounded border border-main_color text-main_color px-3 py-[5px] hover:bg-main_color hover:text-white transition`}
                                    >
                                        <IoLogInOutline className={`text-lg`}/>Sign in
                                    </Link>
                                    <Link
                                        to={`/sign-up`}
                                        className={`flex gap-x-2 items-center rounded border border-main_color text-white px-3 py-[5px] bg-main_color hover:opacity-95 transition`}
                                    >
                                        <FaUser className={`text-md`}/>Sign up
                                    </Link>
                                </>
                            }
                            {user?.id &&
                                <div className={`flex items-center gap-x-2`}>
                                    <span className={`border border-main_color h-full w-12 flex items-center justify-center rounded hover:bg-main_color group transition cursor-pointer`}>
                                        <GoBell className={`size-6 text-main_color group-hover:text-white transition`}/>
                                    </span>
                                    <Menu>
                                        <MenuButton className={`flex gap-x-2 items-center rounded border border-main_color text-white px-3 py-[5px] bg-main_color hover:opacity-95 transition`}>
                                            My Account
                                            <IoIosArrowDown />
                                        </MenuButton>

                                        <MenuItems
                                            transition
                                            anchor={`bottom`}
                                            className="flex flex-col gap-y-1 mt-2 z-50 w-52 !bg-white origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-md text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                                        >

                                            <MenuItem>
                                                <Link
                                                    to={`/users/${user.username}`}
                                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-main_color data-[focus]:text-white bg-white text-text_color"
                                                >
                                                    <img
                                                        src={`/profile-default-img.svg`}
                                                        alt={`profile-default-img`}
                                                        width={30}
                                                    />
                                                    Profile
                                                </Link>
                                            </MenuItem>
                                            <MenuItem >
                                                <Link
                                                    to={`/add-book`}
                                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-4 data-[focus]:bg-main_color data-[focus]:text-white bg-white text-text_color"
                                                >
                                                    <FaBook className={`size-5`}/>
                                                    Upload Book
                                                </Link>
                                            </MenuItem>
                                            <MenuItem >
                                                <button
                                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-main_color data-[focus]:text-white bg-white text-text_color"
                                                    onClick={singOut}
                                                >
                                                    <TbLogout2 className={`size-6`}/>
                                                    Logout
                                                </button>
                                            </MenuItem>


                                        </MenuItems>
                                    </Menu>


                                </div>
                            }

                        </div>
                    </div>
                </nav>
                <div className={`lg:hidden hidden sm:flex font-roboto-bold gap-x-2`}>
                    {!user?.id &&
                        <>
                            <button
                                className={`flex gap-x-2 items-center rounded border border-main_color text-main_color px-3 py-[5px] hover:bg-main_color hover:text-white transition`}>
                                <IoLogInOutline className={`text-lg`}/>Sign in
                            </button>
                            <button className={`flex gap-x-2 items-center rounded border border-main_color text-white px-3 py-[5px] bg-main_color hover:opacity-95 transition`}>
                                <FaUser className={`text-md`}/>Sign up
                            </button>
                        </>
                    }
                    {user?.id &&
                        <div className={`flex items-center gap-x-2`}>
                                    <span className={`border border-main_color h-full w-12 flex items-center justify-center rounded hover:bg-main_color group transition cursor-pointer`}>
                                        <GoBell className={`size-6 text-main_color group-hover:text-white transition`}/>
                                    </span>
                            <Menu>
                                <MenuButton className={`flex gap-x-2 items-center rounded border border-main_color text-white px-3 py-[5px] bg-main_color hover:opacity-95 transition`}>
                                    My Account
                                    <IoIosArrowDown />
                                </MenuButton>

                                <MenuItems
                                    transition
                                    anchor={`bottom`}
                                    className="flex flex-col gap-y-1 mt-2 z-50 w-52 !bg-white origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-md text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                                >

                                    <MenuItem>
                                        <Link
                                            to={`/users/${user.username}`}
                                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-main_color data-[focus]:text-white bg-white text-text_color"
                                        >
                                            <img
                                                src={`/profile-default-img.svg`}
                                                alt={`profile-default-img`}
                                                width={30}
                                            />
                                            Profile
                                        </Link>
                                    </MenuItem>
                                    <MenuItem >
                                        <Link
                                            to={`/add-book`}
                                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-4 data-[focus]:bg-main_color data-[focus]:text-white bg-white text-text_color"
                                        >
                                            <FaBook className={`size-5`}/>
                                            Upload Book
                                        </Link>
                                    </MenuItem>
                                    <MenuItem >
                                        <button
                                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-main_color data-[focus]:text-white bg-white text-text_color"
                                            onClick={singOut}
                                        >
                                            <TbLogout2 className={`size-6`}/>
                                            Logout
                                        </button>
                                    </MenuItem>


                                </MenuItems>
                            </Menu>


                        </div>
                    }
                </div>
                {/*  Dropdown Menu  */}
                <menu
                    className={`${isOpen ? 'max-h-[20rem] p-2' : 'max-h-0 p-0'} overflow-hidden w-full flex flex-col items-start gap-y-4 shadow-2xl shadow-green-400/20 transition-all duration-300 ease-in-out`}
                >
                    <NavbarList
                        isActive={isActive}
                        handleActiveLink={handleActiveLink}
                        styles={`!pb-0 px-4 text-xl`}
                        is_small_screens_menu={true}
                        checkIsLocationIsNotInNavlinkSlice={checkIsLocationIsNotInNavlinkSlice}
                    />
                </menu>

            </div>
        </header>
    )

}
