import {useDispatch, useSelector} from "react-redux";
import MainHeaderBtn from "../home/Main-Header-Btn.tsx";
import {RootState} from "../../../redux/store.ts";
import {setUsersActive} from "../../../redux/users-profile-is-active-slice.ts";
import {setVendorsActive} from "../../../redux/vendors-profile-is-active-slice.ts";
import {Dispatch, SetStateAction} from "react";
import {Errors} from "../../../Interfaces.ts";

interface Props {
    books_count: number
    setErrors: Dispatch<SetStateAction<Errors | null>>
}
export default function Sections(props: Props) {
    const { books_count, setErrors } = props
    const user_state = useSelector((state: RootState) => state.user)

    const usersIsActive = useSelector((state: RootState) => state.usersProfileIsActiveReducer);
    const vendorsIsActive = useSelector((state: RootState) => state.vendorsProfileIsActiveReducer);
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
                {!user_state.is_vendor &&
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
                            src={usersIsActive.order_history ? '/profile/purchased-books-active.svg' : '/profile/purchased-books-not-active.svg'}
                            content={`Orders History`}
                        />
                    </>
                }
                {user_state.is_vendor &&
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
            </header>
        </>
    )
}
