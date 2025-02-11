import {CommentInterface, ShowBookInterface} from "../../../Interfaces.ts";
import ReactStars from "react-stars";
import {FaAngleUp, FaBook} from "react-icons/fa";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {Dispatch, Ref, SetStateAction, useState} from "react";
import apiClient from "../../../ApiClient.ts";
import {enqueueSnackbar} from "notistack";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
interface Props extends CommentInterface {
    setBook_data?: Dispatch<SetStateAction<ShowBookInterface | undefined>>
    ref?: Ref<HTMLDivElement>
    is_review?: boolean
    comments?: CommentInterface[]
    setComments?: Dispatch<SetStateAction<CommentInterface[]>>
}
export default function Comment(props: Props) {
    const {id, user, rating, body, created_at, setBook_data, ref, is_review = false, book, comments, setComments} = props
    const display_name = user ? (user?.first_name[0]?.toUpperCase() + user.first_name.slice(1)) + ' ' + (user?.last_name[0]?.toUpperCase() + user.last_name.slice(1)) : ''
    const auth_user = useSelector((state: RootState) => state.user)
    const translation = useSelector((state: RootState) => state.translationReducer)
    const [is_loading, setIs_loading] = useState(false);

    const deleteComment = () => {
        setIs_loading(true)
        apiClient().delete(`/book/comments/delete/${id}`)
            .then(res => {
                const filtered_data = comments?.filter(comment => comment.id !== id)
                console.log('Before Delete' ,comments)
                console.log('After Delete' ,filtered_data)
                // @ts-ignore
                setBook_data(prevState => ({
                    ...prevState,
                    comments_count: res.data.data.comments_count
                }))
                if (setComments && filtered_data) {
                    setComments(filtered_data)
                }
                enqueueSnackbar(res.data.message, {variant: "success"})
            })
            .catch(err => enqueueSnackbar(err.response.data.errors, {variant: "error"}))
            .finally(() => setIs_loading(false))
    }

    const comment_content =
        <>
            <Link to={`/users/${user.username}`}>
                <img
                    src={user?.avatar ? user?.avatar : '/profile-default-img.svg'}
                    alt="trending-active"
                    className={`min-w-12 min-h-12 size-12 rounded-full`}
                />
            </Link>

            <div className={`bg-main_bg dark:bg-dark_main_color relative px-5 py-2 !grid flex-col gap-y-2 rounded-lg`}>
                <header className={`flex justify-between`}>
                    <Link
                        to={`/users/${user?.username}`}
                        className={`font-roboto-semi-bold text-main_color_darker dark:text-dark_icon_color`}
                    >
                        {display_name}
                    </Link>
                    <span className={`text-sm text-main_color_darker dark:text-dark_icon_color -me-2`}>{created_at}</span>
                </header>
                <div>
                    <h2 className={`font-roboto-semi-bold flex items-center -mt-2 gap-x-2`}>{translation.my_rating}
                        {rating > 0 &&
                            <span className={`font-roboto-medium`}>
                                <ReactStars
                                    count={5}
                                    value={rating}
                                    size={20}
                                    color1={`#d9d9d9`}
                                    color2={`#FFC64BFF`}
                                    className={`-ml-1`}
                                    edit={false}
                                />
                            </span>
                        }
                        {rating === 0 && <span className={`font-roboto-medium text-main_color_darker`}>You haven't rated this yet.</span>}
                    </h2>
                </div>
                <p className={`me-4`}>{body}</p>
                {auth_user.id && auth_user.username === user.username && location.pathname !== '/reviews' &&
                    <div className={`justify-self-end -mt-7 w-fit`}>
                        <Menu>
                            <MenuButton
                                disabled={is_loading}
                                className={`flex gap-x-2 items-center rounded text-white px-3 py-[5px] w-fit hover:opacity-95 transition`}
                            >
                                <FaAngleUp className={`text-main_color_darker dark:text-dark_icon_color absolute ltr:right-2 rtl:left-2 bottom-2`}/>
                            </MenuButton>

                            <MenuItems
                                transition
                                anchor={`top`}
                                className="flex flex-col gap-y-1 mt-2 z-50 w-52 !bg-white dark:!bg-dark_main_color shadow-md origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-md text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                            >
                                <MenuItem>
                                    <button
                                        onClick={deleteComment}
                                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-main_color dark:bg-dark_second_color dark:text-dark_text_color data-[focus]:dark:bg-dark_second_color/80 data-[focus]:text-white bg-white text-text_color"
                                    >
                                        {translation.delete}
                                    </button>
                                </MenuItem>


                            </MenuItems>
                        </Menu>
                    </div>
                }
            </div>
        </>

    return (
        <div
            ref={ref}
            className={`${is_review ? 'p-4 rounded-lg bg-white dark:bg-dark_second_color dark:border dark:border-dark_border_color' : 'grid grid-cols-[0.5fr_2.5fr] xxs:grid-cols-[0.5fr_2.7fr] xs:grid-cols-[0.5fr_3.2fr] sm:grid-cols-[0.5fr_4fr] md:grid-cols-[0.5fr_3fr] lg:grid-cols-[0.5fr_5.5fr] xl:grid-cols-[0.5fr_7fr] 2xl:grid-cols-[0.5fr_9fr]'}`}
        >
            {is_review &&
                <div className={`flex flex-col gap-y-3`}>
                    <div className={`grid grid-cols-[0.5fr_2.5fr] xxs:grid-cols-[0.5fr_2.7fr] xs:grid-cols-[0.5fr_3.2fr] sm:grid-cols-[0.5fr_4fr] md:grid-cols-[0.5fr_3fr] lg:grid-cols-[0.5fr_5.5fr] xl:grid-cols-[0.5fr_7fr] 2xl:grid-cols-[0.5fr_9fr]`}>
                        <span></span>
                        <Link
                            to={`/books/${book?.slug}`}
                            className={`flex items-center gap-x-3 text-lg w-fit`}
                        >
                            <FaBook className={`text-main_color dark:text-dark_text_color`}/>
                            <span className={`text-main_color_darker dark:text-dark_text_color`}>{book?.title}</span>
                        </Link>
                    </div>
                    <div className={`grid grid-cols-[0.5fr_2.5fr] xxs:grid-cols-[0.5fr_2.7fr] xs:grid-cols-[0.5fr_3.2fr] sm:grid-cols-[0.5fr_4fr] md:grid-cols-[0.5fr_3fr] lg:grid-cols-[0.5fr_5.5fr] xl:grid-cols-[0.5fr_7fr] 2xl:grid-cols-[0.5fr_9fr] dark:text-dark_text_color`}>
                        {comment_content}
                    </div>
                </div>

            }
            {!is_review &&
                <>
                    {comment_content}
                </>
            }
        </div>
    )
}
