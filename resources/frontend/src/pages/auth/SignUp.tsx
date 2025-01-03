import {enqueueSnackbar} from "notistack";
import {Link, useNavigate} from "react-router-dom";
import TextInputAuth from "../../components/core/TextInputAuth.tsx";
import LoginProviders from "../../components/LoginProviders.tsx";
import Footer from "../../components/Footer.tsx";
import {ChangeEvent, FormEvent, useRef, useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../../../redux/user-slice.ts";
import apiClient from "../../../ApiClient.ts";
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import '../../index.css'
import {Errors, SignUpForm} from "../../../Interfaces.ts";
import {RootState} from "../../../redux/store.ts";

export default function SignUp() {
    const translation = useSelector((state: RootState) => state.translationReducer)
    const dispatch = useDispatch();

    const is_sign_in_page = location.pathname === '/sign-in';
    const navigate = useNavigate()

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [formData, setFormData] = useState<SignUpForm>({
        username: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        country_code: '',
        email: '',
        password: '',
        password_confirmation: '',
        google_recaptcha: '',
        is_vendor: false,
    })
    const [errors, setErrors] = useState<Errors | null>(null)
    const [show_sign_up_as_vendor, setShow_sign_up_as_vendor] = useState(false);

    const handleClickSignUpAsVendor = () => {
        setFormData({})
        setErrors(null)
        setShow_sign_up_as_vendor(true)
        setFormData(prevState => ({
            ...prevState,
            is_vendor: true
        }))
    }
    const handleClickSignUpAsCustomer = () => {
        setFormData({})
        setErrors(null)
        setShow_sign_up_as_vendor(false)
        setFormData(prevState => {
            const { is_vendor, ...rest } = prevState
            return rest
        })
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target)
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handlePhoneChange = (phone: string, country: any) => {
        setFormData({
            ...formData,
            phone_number: phone, // The full phone number with country code
            country_code: country.dialCode, // The country code only
        });
    };

    const handleRecaptchaToken = (token: string | null) => {
        setFormData(prevState => ({
            ...prevState,
            google_recaptcha: token
        }))
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (!formData.google_recaptcha) {
            setErrors(prevErrors => ({ ...prevErrors, recaptcha: 'Please complete the reCAPTCHA.' }))
            return
        }

        const end_point = formData.is_vendor ? '/sign-up-as-vendor' : '/sign-up-as-customer'

        apiClient().post(end_point, formData, {headers: {'Content-Type': 'application/json'}})
            .then(res => {
                dispatch(setUser(res.data.data))
                enqueueSnackbar("Sign up successful! Redirecting...", { variant: "success" });
                setTimeout(() => {
                    navigate('/sign-in')
                }, 2000)
                setErrors({})
            })
            .catch(err => {
                setErrors(err.response.data.errors)
                enqueueSnackbar('Registration process failed!', { variant: "error" });
            })
    }

    const form =
        <form onSubmit={handleSubmit}>
            <div className={`flex flex-col gap-y-5`}>
                <TextInputAuth
                    placeholder={translation.username}
                    id={`username_id`}
                    name={`username`}
                    value={formData.username}
                    onChange={handleInputChange}
                    error={errors?.username}
                />
                <TextInputAuth
                    placeholder={translation.first_name}
                    id={`first_name_id`}
                    name={`first_name`}
                    value={formData.first_name}
                    onChange={handleInputChange}
                    error={errors?.first_name}
                />
                <TextInputAuth
                    placeholder={translation.last_name}
                    id={`last_name_id`}
                    name={`last_name`}
                    value={formData.last_name}
                    onChange={handleInputChange}
                    error={errors?.last_name}
                />
                <TextInputAuth
                    placeholder={translation.email}
                    id={`email_id`}
                    name={`email`}
                    type={`email`}
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors?.email}
                />
                <TextInputAuth
                    placeholder={translation.password}
                    id={`password_id`}
                    type={`password`}
                    name={`password`}
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors?.password}
                />
                <TextInputAuth
                    placeholder={translation.password_confirmation}
                    id={`password_confirmation_id`}
                    type={`password`}
                    name={`password_confirmation`}
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    error={errors?.password_confirmation}
                />
                <PhoneInput
                    country={'eg'}
                    value={formData.phone_number}
                    onChange={handlePhoneChange}
                    enableSearch={true}
                    placeholder={translation.enter_phone_number}
                    inputStyle={{
                        width: '100%',
                        height: '40px',
                        borderRadius: '8px',
                        border: `1px solid ${errors?.phone_number ? 'red' : 'var(--border_color)'}`,
                        padding: document.dir === 'ltr' ? '10px 10px 10px 45px' : '10px 45px 10px 10px',
                    }}
                    containerStyle={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                    }}
                    buttonStyle={{
                        border: `1px solid ${errors?.phone_number ? 'red' : 'var(--border_color)'}`,
                    }}
                />
                {errors?.phone_number && <span className={`text-red-600 -mt-4`}>{errors.phone_number}</span>}

                <div className={`flex flex-col`}>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY!}
                        onChange={handleRecaptchaToken}
                        hl={document.documentElement.lang || "en"}
                    />

                    {errors?.recaptcha && <span className={`text-red-600`}>{errors.recaptcha}</span>}
                </div>

                <button
                    className={`bg-main_color text-white rounded h-[46px] font-roboto-semi-bold text-lg`}
                    type={`submit`}
                >
                    {translation.sign_up}
                </button>
            </div>
        </form>

    return (
        <>
            <img
                src="/home/hero-section-bg.svg"
                alt="Auth background"
                className={`w-screen h-svh min-h-svh absolute !z-10`}
            />

            <div className={`min-h-svh h-svh z-20 relative flex justify-center pt-20 ${is_sign_in_page ? 'custom-scrollbar' : ''} overflow-y-scroll`}>

                <div className={`flex flex-col px-2 items-center`}>
                    <div className={`bg-white rounded-2xl flex flex-col gap-y-5 md:px-40 min-[450px]:px-10 w-full min-[450px]:w-fit max-w-[680px] px-3 py-10 border`}>
                        <div className={`flex flex-col items-center gap-y-4`}>
                            <Link to={`/`}>
                                <img
                                    src={`/logo.svg`}
                                    alt={`logo`}/>
                            </Link>
                            <h1 className={`font-roboto-bold text-xl text-main_color_darker`}>{translation.sign_up}</h1>
                        </div>
                        <div className={`grid grid-cols-2 gap-x-3`}>
                            <button
                                onClick={handleClickSignUpAsCustomer}
                                className={`bg-main_color text-white rounded py-1`}
                            >
                                {translation.sign_up_as_customer}
                            </button>
                            <button
                                onClick={handleClickSignUpAsVendor}
                                className={`bg-main_color text-white rounded py-1`}
                            >
                                {translation.sign_up_as_vendor}
                            </button>
                        </div>
                        {!show_sign_up_as_vendor &&
                            <>
                                {form}
                            </>
                        }
                        {show_sign_up_as_vendor &&
                            <>
                                {form}
                            </>
                        }

                        <div className={`text-text_color/70 text-center`}>
                            {translation.by_signing_up_you_agree_to_our}
                            <Link to={`#`} className={`text-main_color_darker font-roboto-semi-bold hover:underline underline-offset-2 ltr:ml-1 rtl:mr-1`}>{translation.terms_and_conditions}</Link>,
                            <Link to={`#`} className={`text-main_color_darker font-roboto-semi-bold hover:underline underline-offset-2 ltr:ml-1 rtl:mr-1`}>{translation.data_policy}</Link> {translation.and}
                            <Link to={`#`} className={`text-main_color_darker font-roboto-semi-bold hover:underline underline-offset-2 ltr:ml-1 rtl:mr-1`}>{translation.cookies_policy}</Link>.
                        </div>

                        <div className="flex items-center justify-center">
                            <hr className="w-1/2 border-t border-gray-300" />
                            <span className="mx-4 text-gray-500">{translation.or}</span>
                            <hr className="w-1/2 border-t border-gray-300" />
                        </div>

                        <div className={`text-center text-lg`}>
                            {translation.have_an_account} <Link to={`/sign-in`} className={`text-main_color_darker font-bold hover:underline underline-offset-2`}>{translation.sign_in}</Link> <br/>
                            {translation.forgot_password} <Link to={`#`} className={`text-main_color_darker font-bold hover:underline underline-offset-2`}>{translation.reset_password}</Link>
                        </div>

                        <div className="flex items-center justify-center">
                            <hr className="w-1/2 border-t border-gray-300" />
                            <span className="mx-4 text-gray-500">{translation.or}</span>
                            <hr className="w-1/2 border-t border-gray-300" />
                        </div>

                        <LoginProviders/>
                    </div>
                    <Footer styles={`text-white border-none`}/>
                </div>
            </div>
        </>

    )
}
