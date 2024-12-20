import {useDispatch, useSelector} from "react-redux";
import MainHeaderBtn from "../home/Main-Header-Btn.tsx";
import {RootState} from "../../../redux/store.ts";
import {setUsersActive} from "../../../redux/users-profile-is-active-slice.ts";
import {setVendorsActive} from "../../../redux/vendors-profile-is-active-slice.ts";
import {Dispatch, SetStateAction, useState} from "react";
import {Errors, User} from "../../../Interfaces.ts";
import {useParams} from "react-router-dom";
import {setIsVisitedUserSectionsActive} from "../../../redux/is_visited_user_sections_active.ts";
import {setIsVisitedVendorSectionsActive} from "../../../redux/is_visited_vendor_sections_active.ts";

interface Props {
    books_count: number
    setErrors: Dispatch<SetStateAction<Errors | null>>
}
export default function Sections(props: Props) {
    const { books_count, setErrors } = props
    const { user } = useParams()
    const user_state = useSelector((state: RootState) => state.user)
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

    return (
        <>
            <header className={`flex bg-white sm:pt-6 border border-border_color w-full max-[525px]:flex-col`}>
                {!user_state.is_vendor && user === user_state.username &&
                    <>
                        <MainHeaderBtn
                            onClick={() => handleUsersActiveChange(`personal_info`)}
                            styles={`${usersIsActive.personal_info ? 'text-main_color border-b-main_color' : ''} !border-r-main_color max-sm:pt-4 w-full`}
                            src={usersIsActive.personal_info ? '/profile/personal-info-active.svg' : '/profile/personal-info-not-active.svg'}
                            content={`Personal Info`}
                        />
                        <MainHeaderBtn
                            onClick={() => handleUsersActiveChange(`wishlist`)}
                            styles={`${usersIsActive.wishlist ? 'text-main_color border-b-main_color' : ''} !border-r-main_color max-sm:pt-4 w-full`}
                            src={usersIsActive.wishlist ? '/profile/wishlist-active.svg' : '/profile/wishlist-not-active.svg'}
                            content={`Wishlist (0)`}
                        />
                        <MainHeaderBtn
                            onClick={() => handleUsersActiveChange(`order_history`)}
                            styles={`${usersIsActive.order_history ? 'text-main_color !border-main_color' : ''} !border-r-main_color max-sm:pt-4 w-full`}
                            src={usersIsActive.order_history ? '/profile/order-history-active.svg' : '/profile/order-history-not-active.svg'}
                            content={`Orders History`}
                        />
                    </>
                }
                {user_state.is_vendor && user === user_state.username &&
                    <>
                        <MainHeaderBtn
                            onClick={() => handleVendorsActiveChange(`personal_info`)}
                            styles={`${vendorsIsActive.personal_info ? 'text-main_color border-b-main_color' : ''} !border-r-main_color max-sm:pt-4 w-full`}
                            src={vendorsIsActive.personal_info ? '/profile/personal-info-active.svg' : '/profile/personal-info-not-active.svg'}
                            content={`Personal Info`}
                        />
                        <MainHeaderBtn
                            onClick={() => handleVendorsActiveChange(`reviews`)}
                            styles={`${vendorsIsActive.reviews ? 'text-main_color border-b-main_color' : ''} !border-r-main_color max-sm:pt-4 w-full`}
                            src={vendorsIsActive.reviews ? '/profile/reviews-active.svg' : '/profile/reviews-not-active.svg'}
                            content={`Reviews`}
                        />
                    </>
                }
                {/* User visit User profile */}
                {!user_info?.is_vendor && user !== user_state.username &&
                    <>
                        <MainHeaderBtn
                            onClick={() => dispatch(setIsVisitedUserSectionsActive(`wishlist`))}
                            styles={`${is_visited_user_sections_active.wishlist ? 'text-main_color border-b-main_color' : ''} !border-r-main_color max-sm:pt-4 w-full`}
                            src={is_visited_user_sections_active.wishlist ? '/profile/wishlist-active.svg' : '/profile/wishlist-not-active.svg'}
                            content={`Wishlist`}
                        />
                        <MainHeaderBtn
                            onClick={() => dispatch(setIsVisitedUserSectionsActive(`reviews`))}
                            styles={`${is_visited_user_sections_active.reviews ? 'text-main_color !border-b-main_color' : ''} !border-r-main_color max-sm:pt-4 w-full`}
                            src={is_visited_user_sections_active.reviews ? '/profile/reviews-active.svg' : '/profile/reviews-not-active.svg'}
                            content={`Reviews`}
                        />
                    </>
                }
                {/* User visit Vendor profile */}
                {user_info?.is_vendor && user !== user_state.username &&
                    <>
                        <MainHeaderBtn
                            onClick={() => dispatch(setIsVisitedVendorSectionsActive(`books`))}
                            styles={`${is_visited_vendor_sections_active.books ? 'text-main_color border-b-main_color' : ''} !border-r-main_color max-sm:pt-4 w-full`}
                            src={is_visited_vendor_sections_active.books ? '/profile/books-active.svg' : '/profile/books-not-active.svg'}
                            content={`Books`}
                        />
                        <MainHeaderBtn
                            onClick={() => dispatch(setIsVisitedVendorSectionsActive(`reviews`))}
                            styles={`${is_visited_vendor_sections_active.reviews ? 'text-main_color border-b-main_color' : ''} !border-r-main_color max-sm:pt-4 w-full`}
                            src={is_visited_vendor_sections_active.reviews ? '/profile/reviews-active.svg' : '/profile/reviews-not-active.svg'}
                            content={`Reviews`}
                        />
                    </>
                }
            </header>
        </>
    )
}
