import {ChangeEvent, FormEvent, useEffect, useState} from 'react'
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import TextInputAuth from "../components/core/TextInputAuth.tsx";
import Footer from "../components/Footer.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import apiClient from "../../ApiClient.ts";
import {setUser} from "../../redux/user-slice.ts";

export default function SetPassword() {
    const [searchParams] = useSearchParams();
    const translation = useSelector((state: RootState) => state.translationReducer)
    const dispatch = useDispatch()

    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState('');


    useEffect(() => {
        // Parse the base64-encoded data from the URL
        const encodedData = searchParams.get("data");
        if (encodedData) {
            const decodedData = JSON.parse(atob(encodedData));
            // Save token and is_social_account flag in localStorage
            console.log('token before save: ', decodedData.token)
            localStorage.setItem("token", decodedData.token);
            localStorage.setItem("is_social_account", decodedData.is_social_account ? "true" : "false");

            console.log('token after save: ', decodedData.token)

            dispatch(setUser(decodedData.data))

            // Optionally, redirect after storing the data
        }
    }, []);

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const navigate = useNavigate()
    const handleSubmit = (e: FormEvent) => {
        console.log('token in handleSubmit: ', localStorage.getItem('token'))

        e.preventDefault()
        setIsLoading(true)

        apiClient().post(`/set-password`, {password: password})
            .then(() => {
                localStorage.removeItem('is_social_account')
                navigate('/')
            })
            .catch(err => setErrors(err.response.data.errors.password))
            .finally(() => setIsLoading(false))

    }
    const is_set_password_page = location.pathname === '/set-password';

    return (
        <>
            <img
                src="/home/hero-section-bg.svg"
                alt="Auth background"
                className={`w-screen h-full absolute !z-10`}
            />

            <div className="flex flex-col justify-between max-h-svh text-text_color">

                <div className={`max-h-svh h-svh z-20 px-2 relative flex flex-col items-center pt-20 ${is_set_password_page ? 'custom-scrollbar' : ''} overflow-y-scroll`}>
                    <div className={`bg-white rounded-2xl flex flex-col gap-y-5 sm:px-32 md:px-40 min-[450px]:px-10 w-full min-[450px]:w-fit max-w-[680px] px-3 py-10 border`}>
                        <div className={`flex flex-col items-center gap-y-4`}>
                            <Link to={`/`}>
                                <img
                                    src={`/logo.svg`}
                                    alt={`logo`}/>
                            </Link>
                            <span className={`font-roboto-bold text-xl text-main_color_darker`}></span>
                        </div>
                        <form
                            className={`flex flex-col gap-y-5`}
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <span className={`font-roboto-semi-bold mb-3`}>{translation.set_password_for_your_account}</span>
                                <TextInputAuth
                                    onChange={handleFormChange}
                                    placeholder={translation.password}
                                    id={`password_id`}
                                    type={`password`}
                                    name={`password`}
                                    error={errors}
                                />
                            </div>

                            <button
                                className={`bg-main_color text-white rounded h-[46px] font-roboto-semi-bold text-lg`}
                                type={`submit`}
                            >
                                {isLoading ? `...` : 'Done'}
                            </button>
                        </form>

                    </div>
                </div>

                <Footer styles={`z-50 text-white border-t-0`}/>

            </div>

        </>
    )
}
