
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from 'react';
import { FaBook, FaUser } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { IoLogInOutline } from "react-icons/io5";
import { MdGTranslate } from "react-icons/md";
import { RiMenuLine } from "react-icons/ri";
import { TbLogout2 } from "react-icons/tb";
import { TfiShoppingCart } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../ApiClient.ts";
import { setIsAddToCartSidebarOpenSlice } from "../../redux/is_add_to_card_sidebar_open.ts";
import { RootState } from "../../redux/store.ts";
import { clearUserProfileInfo } from "../../redux/user-profile-info-slice.ts";
import { clearUser } from "../../redux/user-slice.ts";
import { setResetUsersActive } from "../../redux/users-profile-is-active-slice.ts";
import { setResetVendorsActive } from "../../redux/vendors-profile-is-active-slice.ts";
import { useDarkMode } from "../hooks/UseDarkMode.ts";
import DarkMode from "./DarkMode.tsx";
import NavbarList from "./home/Navbar-List.tsx";
import Modal from "./Modal.tsx";

export default function Header() {

    const auth_user = useSelector((state: RootState) => state.user)
    const checkIsLocationIsNotInNavlinkSlice = useSelector((state: RootState) => state.checkIsLocationIsNotInNavlinkSlice)
    const addToCartItemsCount = useSelector((state: RootState) => state.addToCartItemsCountReducer)
    const translation = useSelector((state: RootState) => state.translationReducer)
    const dispatch = useDispatch()

    const [isActive, setIsActive] = useState({
        home: true,
        categories: false,
        reviews: false
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }
    const handleActiveLink = (type: string) => {
        setIsActive({
            home: false,
            categories: false,
            reviews: false,
            [type]: true
        })
    }
    const navigate = useNavigate()
    const signOut = () => {
        apiClient().post('/sign-out', {},
            {headers: {'Content-Type': 'application/json', 'Authorization':'Bearer ' + localStorage.getItem('token')}})
            .then(() => {
                localStorage.removeItem('token')
                localStorage.removeItem('expires_at')
                dispatch(clearUser())
                dispatch(clearUserProfileInfo())
                dispatch(setResetUsersActive())
                dispatch(setResetVendorsActive())
                localStorage.removeItem('book')
                localStorage.removeItem('total_price')
                navigate('/')
            }).catch(err => {
                enqueueSnackbar(err.response.data.message, {variant: "error"})
        })
    }

    const body_el = document.body;
    const handleOpen = () => {
        setIsFocused(true)
    }
    const handleClose = () => {
        setIsFocused(false)
    }
    useEffect(() => {
        if (isFocused) {
            body_el.classList.add('search-input-active');
        } else {
            body_el.classList.remove('search-input-active');
        }
    }, [isFocused]);

    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!modalRef.current?.contains(e.target as Node)) {
                setIsFocused(false)
            }
        }

        window.addEventListener('mousedown', handleClickOutside)
        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);

    const openAddToCartSidebar = () => {
        dispatch(setIsAddToCartSidebarOpenSlice(true))
    }
    


    const is_dark_mode = useDarkMode()
    return (
        <>
            {isFocused && <div className={`left-0 top-0 w-screen h-screen fixed z-20 bg-black/70 `}></div>}
            <header className={`${location.pathname === '/add-book-to-store' ? 'shadow-sm' : ''} max-h-auto z-10 border-t-[3px] border-main_color dark:border-dark_second_color text-text_color flex flex-col justify-between items-center gap-y-6`}>
            {!auth_user.is_vendor &&
                <Modal
                    isOpen={isFocused}
                    onClose={handleClose}
                    header={translation.unauthorized}
                    ref={modalRef}
                >
                    <main className={`p-4 text-gray-500 dark:text-dark_text_color`}>
                        {translation.unauthorized_customer_message}
                    </main>

                </Modal>
            }
            <div className={`container w-full relative`}>
                <div>
                    <Menu>
                        <div className={`flex flex-row-reverse gap-x-3`}>
                            <MenuButton className={`flex justify-self-end gap-x-2 items-center rounded-b border border-main_color dark:border-dark_second_color text-white dark:text-dark_text_color px-3 py-[5px] bg-main_color dark:bg-dark_second_color hover:opacity-95 transition`}>
                                {translation.languages}<MdGTranslate />
                            </MenuButton>
                            <DarkMode/>
                        </div>



                        <MenuItems
                            transition
                            anchor={`bottom`}
                            className="flex flex-col gap-y-1 mt-1 z-50 w-52 !bg-main_color dark:!bg-dark_main_color shadow-md origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-md text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                        >

                            <MenuItem>
                                <a
                                    // onClick={() => handleSelectLanguage('ar')}
                                    href={`/locale/ar`}
                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 bg-main_color dark:bg-dark_second_color text-white dark:text-dark_text_color border dark:border-transparent"
                                >
                                    {translation.languages_list?.arabic}
                                </a>
                            </MenuItem>
                            <MenuItem>
                                <a
                                    // onClick={() => handleSelectLanguage('en')}
                                    href={`/locale/en`}
                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 bg-main_color dark:bg-dark_second_color text-white dark:text-dark_text_color border dark:border-transparent"
                                >
                                    {translation.languages_list?.english}
                                </a>
                            </MenuItem>
                            <MenuItem>
                                <a
                                    // onClick={() => handleSelectLanguage('fr')}
                                    href={`/locale/fr`}
                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 bg-main_color dark:bg-dark_second_color text-white dark:text-dark_text_color border dark:border-transparent"
                                >
                                    {translation.languages_list?.french}
                                </a>
                            </MenuItem>


                        </MenuItems>
                    </Menu>

                    <Link
                        to={`/`}
                        className={`block w-fit`}
                    >
                        <img
                            src={is_dark_mode ? '/dark-logo.svg' : '/logo.svg'}
                            alt={`logo`}
                            className={`mt-10 ml-2 sm:ml-0 min-h-[120px] min-w-[114px]`}
                        />
                    </Link>
                </div>
            </div>
            <div className={`border-t dark:border-dark_border_color w-full flex flex-col items-center gap-y-0 sm:gap-y-3 lg:gap-y-0`}>
                <nav className={`w-full flex flex-col items-center border-b border-border_color dark:border-b-dark_border_color`}>
                    <div className={`w-full container flex justify-between items-center font-roboto-bold max-sm:px-2`}>
                        <div className={`flex items-center gap-x-4 h-[53px]`}>
                            <Link
                                to={`/`}
                                className={`px-4 border-x dark:border-dark_border_color w-fit hidden sm:block`}
                            >
                                <img
                                    src={is_dark_mode ? '/dark-nav-logo.svg' : '/nav-logo.svg'}
                                    alt={`nav-logo`}
                                    className={`py-1`}
                                    width={45}
                                />
                            </Link>
                            <ul className={`hidden sm:flex gap-x-7 h-full pt-3`}>
                                <NavbarList
                                    setIsOpen={setIsOpen}
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
                            {!auth_user?.id &&
                                <>
                                    <Link
                                        to={`/sign-in`}
                                        className={`flex gap-x-2 items-center rounded border border-main_color dark:border-dark_border_color text-main_color dark:text-dark_text_color px-3 py-[5px] hover:bg-main_color hover:text-white dark:hover:bg-dark_second_color transition`}
                                    >
                                        <IoLogInOutline className={`text-lg`}/>{translation.sign_in}
                                    </Link>
                                    <Link
                                        to={`/sign-up`}
                                        className={`flex gap-x-2 items-center rounded border border-main_color dark:border-dark_border_color text-white px-3 py-[5px] bg-main_color dark:bg-dark_second_color hover:opacity-95 dark:hover:bg-dark_second_color transition`}
                                    >
                                        <FaUser className={`text-md`}/>{translation.sign_up}
                                    </Link>
                                </>
                            }
                            {auth_user?.id &&
                                <div className={`flex items-center gap-x-2`}>
                                    <span
                                        className={`relative border border-main_color dark:border-dark_border_color h-full w-12 flex items-center justify-center rounded hover:bg-main_color dark:hover:bg-dark_second_color group transition cursor-pointer`}
                                        onClick={openAddToCartSidebar}
                                    >
                                    {addToCartItemsCount > 0 &&
                                        <span className={`absolute -top-2 ltr:-left-3 rtl:-right-3 bg-second_main_color dark:bg-dark_border_color text-white dark:text-dark_text_color size-5 flex justify-center items-center rounded`}>
                                            {addToCartItemsCount}
                                        </span>
                                    }
                                        <TfiShoppingCart className={`size-6 text-main_color dark:text-dark_text_color group-hover:text-white transition`}/>
                                    </span>
                                    <span className={`border border-main_color dark:border-dark_border_color h-full w-12 flex items-center justify-center rounded hover:bg-main_color dark:hover:bg-dark_second_color group transition cursor-pointer`}>
                                        <GoBell className={`size-6 text-main_color dark:text-dark_text_color group-hover:text-white transition`}/>
                                    </span>
                                    <Menu>
                                        <MenuButton className={`flex gap-x-2 items-center rounded border border-main_color dark:border-dark_border_color text-white dark:text-dark_text_color px-3 py-[5px] bg-main_color dark:bg-dark_second_color hover:opacity-95 transition`}>
                                            {translation.my_account}
                                            <IoIosArrowDown />
                                        </MenuButton>

                                        <MenuItems
                                            transition
                                            anchor={`bottom`}
                                            className="flex flex-col gap-y-1 mt-2 z-50 w-52 !bg-white dark:!bg-dark_main_color shadow-md origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-md text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                                        >

                                            <MenuItem>
                                                <Link
                                                    to={`/users/${auth_user.username}`}
                                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-main_color data-[focus]:text-white bg-white dark:bg-dark_second_color dark:text-dark_text_color text-text_color"
                                                >
                                                    <img
                                                        src={auth_user.avatar ? auth_user.avatar : '/profile-default-img.svg'}
                                                        alt={`profile-default-img`}
                                                        className={`rounded-full size-8`}
                                                    />
                                                    {translation.profile}
                                                </Link>
                                            </MenuItem>
                                            {auth_user?.is_vendor &&
                                                <MenuItem>
                                                    <Link
                                                        to={`/add-book`}
                                                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-main_color data-[focus]:text-white bg-white dark:bg-dark_second_color dark:text-dark_text_color text-text_color"
                                                    >
                                                        <FaBook className={`size-5`}/>
                                                        {translation.upload_book}
                                                    </Link>
                                                </MenuItem>
                                            }
                                            {!auth_user?.is_vendor &&
                                                <MenuItem>
                                                    <button
                                                        onClick={handleOpen}
                                                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-main_color data-[focus]:text-white bg-white dark:bg-dark_second_color dark:text-dark_text_color text-text_color"
                                                    >
                                                        <FaBook className={`size-5`}/>
                                                        {translation.upload_book}
                                                    </button>
                                                </MenuItem>
                                            }
                                            <MenuItem>
                                                <button
                                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-main_color data-[focus]:text-white bg-white dark:bg-dark_second_color dark:text-dark_text_color text-text_color"
                                                    onClick={signOut}
                                                >
                                                    <TbLogout2 className={`size-6`}/>
                                                    {translation.logout}
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
                    {!auth_user?.id &&
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
                    {auth_user?.id &&
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
                                            to={`/users/${auth_user.username}`}
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
                                            onClick={signOut}
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
        </>
    )

}
