import {useDispatch, useSelector} from "react-redux";
import MainHeaderBtn from "../home/Main-Header-Btn.tsx";
import {RootState} from "../../../redux/store.ts";
import {setUsersActive} from "../../../redux/users-profile-is-active-slice.ts";
import {setVendorsActive} from "../../../redux/vendors-profile-is-active-slice.ts";
import {Dispatch, SetStateAction} from "react";
import {Errors} from "../../../Interfaces.ts";
import {useParams} from "react-router-dom";
import {setIsVisitedUserSectionsActive} from "../../../redux/is_visited_user_sections_active.ts";
import {setIsVisitedVendorSectionsActive} from "../../../redux/is_visited_vendor_sections_active.ts";
import {useDarkMode} from "../../hooks/UseDarkMode.ts";

interface Props {
    books_count: number
    setErrors: Dispatch<SetStateAction<Errors | null>>
    reviews_count: number | undefined
}
export default function Sections(props: Props) {
    const { books_count, setErrors, reviews_count } = props
    const { user } = useParams()
    const translation = useSelector((state: RootState) => state.translationReducer)
    const auth_user = useSelector((state: RootState) => state.user)
    const user_info = useSelector((state: RootState) => state.userProfileInfoReducer)
    const usersIsActive = useSelector((state: RootState) => state.usersProfileIsActiveReducer);
    const vendorsIsActive = useSelector((state: RootState) => state.vendorsProfileIsActiveReducer);
    const is_visited_user_sections_active = useSelector((state: RootState) => state.isVisitedUserSectionsActive);
    const is_visited_vendor_sections_active = useSelector((state: RootState) => state.isVisitedVendorSectionsActive);
    const dispatch = useDispatch()

    const handleUsersActiveChange = (section: "personal_info" | "wishlist" | "order_history") => {
        setErrors({})
        dispatch(setUsersActive(section))
    }
    const handleVendorsActiveChange = (section: "personal_info" | "reviews") => {
        setErrors({})
        dispatch(setVendorsActive(section))
    }

    const is_dark_mode = useDarkMode()

    const personal_info_src = is_dark_mode ? '/profile/dark-personal-info-active.svg' : '/profile/personal-info-active.svg'
    const reviews_src = is_dark_mode ? '/profile/dark-reviews-active.svg' : '/profile/reviews-active.svg'
    const wishlists_src = is_dark_mode ? '/profile/dark-wishlist-active.svg' : '/profile/wishlist-active.svg'
    const orders_history_src = is_dark_mode ? '/profile/dark-order-history-active.svg' : '/profile/order-history-active.svg'
    const books_src = is_dark_mode ? '/profile/dark-books-active.svg' : '/profile/books-active.svg'

    return (
        <>
            <header className={`flex bg-white dark:bg-dark_main_color dark:border-dark_border_color sm:pt-6 border border-border_color w-full flex-col sm:flex-row py-8 sm:py-0 gap-y-8 sm:gap-y-0`}>
                {!auth_user.is_vendor && user === auth_user.username &&
                    <>
                        <MainHeaderBtn
                            onClick={() => handleUsersActiveChange(`personal_info`)}
                            styles={`${usersIsActive.personal_info ? 'text-main_color dark:!border-dark_icon_color text-main_color dark:text-dark_text_color border-b-main_color' : 'dark:!text-white'} !border-r-main_color max-sm:pt-4 w-full`}
                            src={usersIsActive.personal_info ? personal_info_src : '/profile/personal-info-not-active.svg'}
                            content={translation.personal_info}
                        />
                        <MainHeaderBtn
                            onClick={() => handleUsersActiveChange(`wishlist`)}
                            styles={`${usersIsActive.wishlist ? 'text-main_color dark:!border-dark_icon_color text-main_color dark:text-dark_text_color border-b-main_color' : 'dark:!text-white'} !border-r-main_color max-sm:pt-4 w-full`}
                            src={usersIsActive.wishlist ? wishlists_src : '/profile/wishlist-not-active.svg'}
                            content={`${translation.wishlist} (${user_info.wishlists_count})`}
                        />
                        <MainHeaderBtn
                            onClick={() => handleUsersActiveChange(`order_history`)}
                            styles={`${usersIsActive.order_history ? 'text-main_color dark:!border-dark_icon_color text-main_color dark:text-dark_text_color !border-main_color' : 'dark:!text-white'} !border-r-main_color max-sm:pt-4 w-full`}
                            src={usersIsActive.order_history ? orders_history_src : '/profile/order-history-not-active.svg'}
                            content={translation.orders_history}
                        />
                    </>
                }
                {auth_user.is_vendor && user === auth_user.username &&
                    <>
                        <MainHeaderBtn
                            onClick={() => handleVendorsActiveChange(`personal_info`)}
                            styles={`${vendorsIsActive.personal_info ? 'text-main_color dark:!border-dark_icon_color text-main_color dark:text-dark_text_color border-b-main_color' : 'dark:!text-white'} !border-r-main_color max-sm:pt-4 w-full`}
                            src={vendorsIsActive.personal_info ? personal_info_src : '/profile/personal-info-not-active.svg'}
                            content={translation.personal_info}
                        />
                        <MainHeaderBtn
                            onClick={() => handleVendorsActiveChange(`reviews`)}
                            styles={`${vendorsIsActive.reviews ? 'text-main_color dark:!border-dark_icon_color text-main_color dark:text-dark_text_color border-b-main_color' : 'dark:!text-white'} !border-r-main_color max-sm:pt-4 w-full`}
                            src={vendorsIsActive.reviews ? reviews_src : '/profile/reviews-not-active.svg'}
                            content={translation.reviews + ` (${reviews_count})`}
                        />
                    </>
                }
                {/* User visit User profile */}
                {!user_info?.is_vendor && user !== auth_user.username &&
                    <>
                        <MainHeaderBtn
                            onClick={() => dispatch(setIsVisitedUserSectionsActive(`wishlist`))}
                            styles={`${is_visited_user_sections_active.wishlist ? 'text-main_color dark:!border-dark_icon_color text-main_color dark:text-dark_text_color border-b-main_color' : 'dark:!text-white'} !border-r-main_color max-sm:pt-4 w-full`}
                            src={is_visited_user_sections_active.wishlist ? wishlists_src : '/profile/wishlist-not-active.svg'}
                            content={`${translation.wishlist} (${user_info.wishlists_count})`}
                        />
                        <MainHeaderBtn
                            onClick={() => dispatch(setIsVisitedUserSectionsActive(`reviews`))}
                            styles={`${is_visited_user_sections_active.reviews ? 'text-main_color dark:!border-dark_icon_color text-main_color dark:text-dark_text_color !border-b-main_color' : 'dark:!text-white'} !border-r-main_color max-sm:pt-4 w-full`}
                            src={is_visited_user_sections_active.reviews ? reviews_src : '/profile/reviews-not-active.svg'}
                            content={translation.reviews}
                        />
                    </>
                }
                {/* User visit Vendor profile */}
                {user_info?.is_vendor && user !== auth_user.username &&
                    <>
                        <MainHeaderBtn
                            onClick={() => dispatch(setIsVisitedVendorSectionsActive(`books`))}
                            styles={`${is_visited_vendor_sections_active.books ? 'text-main_color dark:!border-dark_icon_color text-main_color dark:text-dark_text_color border-b-main_color' : 'dark:!text-white'} !border-r-main_color max-sm:pt-4 w-full`}
                            src={is_visited_vendor_sections_active.books ? books_src : '/profile/books-not-active.svg'}
                            content={`${translation.books} (${books_count})`}
                        />
                        <MainHeaderBtn
                            onClick={() => dispatch(setIsVisitedVendorSectionsActive(`reviews`))}
                            styles={`${is_visited_vendor_sections_active.reviews ? 'text-main_color dark:!border-dark_icon_color text-main_color dark:text-dark_text_color border-b-main_color' : 'dark:!text-white'} !border-r-main_color max-sm:pt-4 w-full`}
                            src={is_visited_vendor_sections_active.reviews ? reviews_src : '/profile/reviews-not-active.svg'}
                                content={translation.reviews + ` (${reviews_count})`}
                        />
                    </>
                }
            </header>
        </>
    )
}
