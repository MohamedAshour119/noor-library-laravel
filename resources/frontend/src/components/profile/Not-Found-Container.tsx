import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import {useParams} from "react-router-dom";
import vendorsProfileIsActiveSlice from "../../../redux/vendors-profile-is-active-slice.ts";

interface Props {
    src: string
    content: string
    is_book_section_active?: boolean
    is_review_section_active?: boolean
    is_purchased_books_active?: boolean
    content_style?: string
    visited_user?: string
}

export default function NotFoundContainer(props: Props) {
    const {src, content, is_book_section_active = true, is_purchased_books_active = false, content_style, visited_user} = props

    const user_state = useSelector((state: RootState) => state.user)
    const user_info = useSelector((state: RootState) => state.userProfileInfoReducer)
    const is_visited_user_sections_active = useSelector((state: RootState) => state.isVisitedUserSectionsActive);
    const is_visited_vendor_sections_active = useSelector((state: RootState) => state.isVisitedVendorSectionsActive);
    const user_isActive = useSelector((state: RootState) => state.usersProfileIsActiveReducer);

    const { user } = useParams()

    return (
        <div className={`flex flex-col items-center gap-y-4 bg-white w-full p-10 border border-border_color rounded text-xl`}>
            <img
                src={src}
                alt={`not-found`}
                width={100}
            />
            <div className={`flex gap-x-2`}>
                <span>
                    <span className={`${content_style ? content_style : ''}`}>{visited_user}</span> {`${content} `}
                    {user_state.username === user && user_isActive.wishlist &&
                        <Link
                            to={`/`}
                            className={`text-main_color_darker`}
                        >
                            Browse Books
                        </Link>
                    }
                    {is_purchased_books_active &&
                        <Link
                            to={`/`}
                            className={`text-main_color_darker`}
                        >
                            Explore Books
                        </Link>
                    }
                </span>
            </div>
        </div>
    )
}
