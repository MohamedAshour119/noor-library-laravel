import {Dispatch, SetStateAction} from 'react'
import {IoHome} from "react-icons/io5";
import {BiCategoryAlt} from "react-icons/bi";
import {FaStar} from "react-icons/fa";
import {BsSearch} from "react-icons/bs";
import {Link} from "react-router-dom";

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

    return (
        <>
            <li className={`relative ${styles}`}>
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
                    <IoHome />Home
                </Link>
            </li>
            <li className={`relative ${styles}`}>
                <div className={`${isActive.categories && !checkIsLocationIsNotInNavlinkSlice ? 'active' : ''}`}></div>
                <Link
                    className={`flex items-center gap-x-2 cursor-pointer`}
                    to={`/categories`}
                    onClick={() => {
                        if (is_small_screens_menu) {
                            handleActiveLink(`categories`)
                        } else {
                            handleActiveLink(`categories`)
                        }

                    }}
                >
                    <BiCategoryAlt />Categories
                </Link>
            </li>
            <li className={`relative ${styles}`}>
                <div className={`${isActive.reviews && !checkIsLocationIsNotInNavlinkSlice ? 'active' : ''}`}></div>
                <Link
                    className={`flex items-center gap-x-2 cursor-pointer`}
                    to={`/reviews`}
                    onClick={() => {
                        if (is_small_screens_menu) {
                            handleActiveLink(`reviews`)
                        } else {
                            handleActiveLink(`reviews`)
                        }

                    }}
                >
                    <FaStar />Reviews
                </Link>
            </li>
            <li className={`flex items-center gap-x-2 cursor-pointer pb-4 ${styles}`}>
                <BsSearch />Search
            </li>
        </>

    )
}
