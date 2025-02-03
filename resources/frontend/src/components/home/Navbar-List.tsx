import {Dispatch, SetStateAction} from 'react'
import {IoHome} from "react-icons/io5";
import {BiCategoryAlt} from "react-icons/bi";
import {FaStar} from "react-icons/fa";
import {BsSearch} from "react-icons/bs";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import {setIsSearchModalOpenSlice} from "../../../redux/is_search_modal_open.ts";

interface Props {
    isActive: {
        home: boolean
        categories: boolean
        reviews: boolean
    }
    handleActiveLink: (home: string) => void
    styles?: string
    is_small_screens_menu?: boolean
    checkIsLocationIsNotInNavlinkSlice: boolean
    setIsOpen?: Dispatch<SetStateAction<boolean>>
}
export default function NavbarList({isActive, handleActiveLink, styles, is_small_screens_menu = false, checkIsLocationIsNotInNavlinkSlice}: Props) {
    const isSearchModalOpenSlice = useSelector((state: RootState) => state.isSearchModalOpenReducer.is_open)
    const translation = useSelector((state: RootState) => state.translationReducer)
    const dispatch = useDispatch()

    const handleSearchOpen = () => {
        dispatch(setIsSearchModalOpenSlice(!isSearchModalOpenSlice))
    }

    return (
        <>
            <li className={`relative ${styles} dark:text-dark_text_color`}>
                <div className={`${isActive.home && !checkIsLocationIsNotInNavlinkSlice ? 'active' : ''}`}></div>
                <Link
                    className={`flex items-center gap-x-2 cursor-pointer`}
                    to={`/`}
                    onClick={() => {
                        if (is_small_screens_menu) {
                            handleActiveLink(`home`)
                        } else {
                            handleActiveLink(`home`)
                        }

                    }}
                >
                    <IoHome />{translation.home}
                </Link>
            </li>
            <li className={`relative ${styles} dark:text-dark_text_color`}>
                <div className={`${isActive.categories && !checkIsLocationIsNotInNavlinkSlice ? 'active' : ''}`}></div>
                <Link
                    className={`flex items-center gap-x-2 cursor-pointer`}
                    to={'/categories'}
                    onClick={() => {
                        if (is_small_screens_menu) {
                            handleActiveLink(`categories`)
                        } else {
                            handleActiveLink(`categories`)
                        }

                    }}
                >
                    <BiCategoryAlt />{translation.categories}
                </Link>
            </li>
            <li className={`relative ${styles} dark:text-dark_text_color`}>
                <div className={`${isActive.reviews && !checkIsLocationIsNotInNavlinkSlice ? 'active' : ''}`}></div>
                <Link
                    className={`flex items-center gap-x-2 cursor-pointer`}
                    to={'/reviews'}
                    onClick={() => {
                        if (is_small_screens_menu) {
                            handleActiveLink(`reviews`)
                        } else {
                            handleActiveLink(`reviews`)
                        }

                    }}
                >
                    <FaStar />{translation.reviews}
                </Link>
            </li>
            <li
                className={`dark:text-dark_text_color flex items-center gap-x-2 cursor-pointer pb-4 ${styles}`}
                onClick={handleSearchOpen}
            >
                <BsSearch />{translation.search}
            </li>
        </>

    )
}
