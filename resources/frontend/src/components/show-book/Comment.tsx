import {CommentInterface, ShowBookInterface} from "../../../Interfaces.ts";
import ReactStars from "react-stars";
import {FaAngleUp} from "react-icons/fa";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {Dispatch, SetStateAction, useState} from "react";
import apiClient from "../../../ApiClient.ts";
import {enqueueSnackbar} from "notistack";
import {Link} from "react-router-dom";
interface Props extends CommentInterface {
    book_data: ShowBookInterface | undefined
    setBook_data: Dispatch<SetStateAction<ShowBookInterface | undefined>>
}
export default function Comment(props: Props) {
    const {id, user, rating, body, created_at, setBook_data, book_data} = props
    const display_name = user ? (user?.first_name[0]?.toUpperCase() + user.first_name.slice(1)) + ' ' + (user?.last_name[0]?.toUpperCase() + user.last_name.slice(1)) : ''
    const [is_loading, setIs_loading] = useState(false);

    const deleteComment = () => {
        setIs_loading(true)
        apiClient().delete(`/book/comments/delete/${id}`)
            .then(res => {
                const filtered_data = book_data?.comments?.filter(comment => comment.id !== id)
                // @ts-ignore
                setBook_data(prevState => ({
                    ...prevState,
                    comments: filtered_data,
                }))
                enqueueSnackbar(res.data.message, {variant: "success"})
            })
            .catch(err => enqueueSnackbar(err.response.data.errors, {variant: "error"}))
            .finally(() => setIs_loading(false))
    }

    return (
        <div className={`bg-white grid grid-cols-[0.5fr_2.5fr] xxs:grid-cols-[0.5fr_2.7fr] xs:grid-cols-[0.5fr_3.2fr] sm:grid-cols-[0.5fr_4fr] md:grid-cols-[0.5fr_3fr] lg:grid-cols-[0.5fr_5.5fr] xl:grid-cols-[0.5fr_7fr] 2xl:grid-cols-[0.5fr_9fr]`}>
            <img
                src={user?.avatar ? user?.avatar : '/profile-default-img.svg'}
                alt="trending-active"
                className={`min-w-12 min-h-12 size-12 rounded-full`}
            />
            <div className={`relative bg-main_bg px-5 py-2 !grid flex-col gap-y-2 rounded-lg`}>
                <header className={`flex justify-between`}>
                    <Link
                        to={`/users/${user.username}`}
                        className={`font-roboto-semi-bold text-main_color_darker`}
                    >
                        {display_name}
                    </Link>
                    <span className={`text-sm text-main_color_darker -me-2`}>{created_at}</span>
                </header>
                <div>
                    <h1 className={`font-roboto-semi-bold flex items-center -mt-2 gap-x-2`}>My Rating:
                        {rating > 0 &&
                            <span className={`font-roboto-medium`}>
                                <ReactStars
                                    count={5}
                                    value={rating}
                                    size={20}
                                    color1={`#d9d9d9`}
                                    color2={`#ffe34b`}
                                    className={`-ml-1`}
                                    edit={false}
                                />
                            </span>
                        }
                        {rating === 0 && <span className={`font-roboto-medium text-main_color_darker`}>You haven't rated this yet.</span>}
                    </h1>
                </div>
                <p className={`me-4`}>{body}</p>
                <div className={`justify-self-end -mt-7 w-fit`}>
                    <Menu>
                        <MenuButton
                            disabled={is_loading}
                            className={`flex gap-x-2 items-center rounded text-white px-3 py-[5px] w-fit hover:opacity-95 transition`}
                        >
                            <FaAngleUp className={`text-main_color_darker absolute right-2 bottom-2`}/>
                        </MenuButton>

                        <MenuItems
                            transition
                            anchor={`top`}
                            className="flex flex-col gap-y-1 mt-2 z-50 w-52 !bg-white shadow-md origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-md text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                        >
                            <MenuItem>
                                <button
                                    onClick={deleteComment}
                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-main_color data-[focus]:text-white bg-white text-text_color"
                                >
                                    Delete
                                </button>
                            </MenuItem>


                        </MenuItems>
                    </Menu>
                </div>
            </div>
        </div>
    )
}
