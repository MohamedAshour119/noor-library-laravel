import {CommentInterface} from "../../../Interfaces.ts";
import ReactStars from "react-stars";
interface Props extends CommentInterface {}
export default function Comment(props: Props) {
    const {user, rating, body, created_at} = props
    const display_name = user ? (user?.first_name[0]?.toUpperCase() + user.first_name.slice(1)) + ' ' + (user?.last_name[0]?.toUpperCase() + user.last_name.slice(1)) : ''

    return (
        <div className={`bg-white grid grid-cols-[0.5fr_2.5fr] xxs:grid-cols-[0.5fr_2.7fr] xs:grid-cols-[0.5fr_3.2fr] sm:grid-cols-[0.5fr_4fr] md:grid-cols-[0.5fr_3fr] lg:grid-cols-[0.5fr_5.5fr] xl:grid-cols-[0.5fr_7fr] 2xl:grid-cols-[0.5fr_9fr]`}>
            <img
                src={user.avatar ? user.avatar : '/profile-default-img.svg'}
                alt="trending-active"
                className={`min-w-12 min-h-12 size-12 rounded-full`}
            />
            <div className={`bg-main_bg px-5 py-2 flex flex-col gap-y-2 rounded-lg`}>
                <header className={`flex justify-between`}>
                    <h1 className={`font-roboto-semi-bold text-main_color_darker`}>{display_name}</h1>
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
            </div>
        </div>
    )
}
