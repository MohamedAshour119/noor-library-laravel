
import {FC, ReactNode, useRef} from 'react'
import ReCAPTCHA from "react-google-recaptcha"

interface RecaptchaProviderProps {
    children: ReactNode
}

const RecaptchaGoogleV2Provider: FC<RecaptchaProviderProps> = ({ children }) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    return (
        <>
            {children}
            <ReCAPTCHA
                ref={recaptchaRef}
                // sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                sitekey={``}
                size="invisible" // Or "normal" if you’re using the checkbox
            />
        </>
    )
}

export default RecaptchaGoogleV2Provider
