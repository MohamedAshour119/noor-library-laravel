import {useDispatch, useSelector} from "react-redux";
import MainHeaderBtn from "../home/Main-Header-Btn.tsx";
import {RootState} from "../../../redux/store.ts";
import {setActive} from "../../../redux/profile-is-active-slice.ts";

interface Props {
    books_count: number
}
export default function Sections(props: Props) {
    const {books_count} = props

    const isActive = useSelector((state: RootState) => state.profileIsActiveReducer);
    const dispatch = useDispatch()

    const handleActiveChange = (section: "books" | "reviews" | "purchased_books") => {
        dispatch(setActive(section))
    }

    return (
        <>
            <header className={`flex bg-white sm:pt-6 border border-border_color w-full max-[525px]:flex-col`}>
                <MainHeaderBtn
                    onClick={() => handleActiveChange(`books`)}
                    styles={`${isActive.books ? 'text-main_color border-b-main_color' : ''} !border-r-main_color max-sm:pt-4 w-full`}
                    src={isActive.books ? '/home/trending-active.svg' : '/home/trending-not-active.svg'}
                    content={`Books (${books_count})`}
                />
                <MainHeaderBtn
                    onClick={() => handleActiveChange(`reviews`)}
                    styles={`${isActive.reviews ? 'text-main_color border-b-main_color' : ''} !border-r-main_color max-sm:pt-4 w-full`}
                    src={isActive.reviews ? '/profile/review-active.svg' : '/profile/review-not-active.svg'}
                    content={`Reviews (0)`}
                />
                <MainHeaderBtn
                    onClick={() => handleActiveChange(`purchased_books`)}
                    styles={`${isActive.purchased_books ? 'text-main_color border-main_color' : ''} max-sm:pt-4 w-full`}
                    src={isActive.purchased_books ? '/profile/purchased-books-active.svg' : '/profile/purchased-books-not-active.svg'}
                    content={`Purchased Books (0)`}
                />
            </header>
        </>
    )
}
