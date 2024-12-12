import {Link} from "react-router-dom";

interface Props {
    styles?: string
}
export default function Footer(props: Props) {
    const { styles } = props

    return (
        <footer className={`text-main_color p-4 border-t w-full flex justify-center ${styles}`}>
            <div className="container flex justify-center items-center">
                <div className="flex gap-4 flex-wrap justify-center">
                    <Link to={`#`} className="hover:underline underline-offset-2">Terms of Use</Link>
                    <Link to={`#`} className="hover:underline underline-offset-2">Privacy Policy</Link>
                    <Link to={`#`} className="hover:underline underline-offset-2">Copyrights</Link>
                    <Link to={`#`} className="hover:underline underline-offset-2">About Us</Link>
                    <Link to={`#`} className="hover:underline underline-offset-2">Contact Us</Link>
                </div>
            </div>
        </footer>
    )
}

