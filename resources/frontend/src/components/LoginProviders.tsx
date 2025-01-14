import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";

interface Props {
    googleSignIn: () => void
    twitterSignIn: () => void
}
export default function LoginProviders({googleSignIn, twitterSignIn}: Props) {
    const translation = useSelector((state: RootState) => state.translationReducer)
    return (
        <div className="flex flex-col space-y-2">
            <button
                onClick={googleSignIn}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded"
            >
                {translation.login_via_google}
            </button>
            <button
                onClick={twitterSignIn}
                className="bg-black text-white font-bold py-2 px-4 rounded"
            >
                {translation.login_via_x}
            </button>
        </div>
    )
}
