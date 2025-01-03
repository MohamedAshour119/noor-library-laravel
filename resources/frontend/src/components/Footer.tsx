import {Link} from "react-router-dom";
import {RootState} from "../../redux/store.ts";
import {useSelector} from "react-redux";

interface Props {
    styles?: string
}
export default function Footer(props: Props) {
    const { styles } = props
    const translation = useSelector((state: RootState) => state.translationReducer)
    return (
        <footer className={`text-main_color p-4 border-t w-full flex justify-center ${styles}`}>
            <div className="container flex justify-center items-center">
                <div className="flex gap-4 flex-wrap justify-center">
                    <Link to={`#`} className="hover:underline underline-offset-2">{translation.terms_of_use}</Link>
                    <Link to={`#`} className="hover:underline underline-offset-2">{translation.privacy_policy}</Link>
                    <Link to={`#`} className="hover:underline underline-offset-2">{translation.copyrights}</Link>
                    <Link to={`#`} className="hover:underline underline-offset-2">{translation.about_us}</Link>
                    <Link to={`#`} className="hover:underline underline-offset-2">{translation.contact_us}</Link>
                </div>
            </div>
        </footer>
    )
}

