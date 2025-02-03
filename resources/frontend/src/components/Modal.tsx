import {ReactNode, Ref, useEffect, useState} from "react"
import { createPortal } from "react-dom"
import {MdClose} from "react-icons/md";

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    header?: string
    ref: Ref<HTMLDivElement>
    parent_styles?: string
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, header='', ref, parent_styles }) => {
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose()
            }
        }

        if (isOpen) {
            setIsAnimating(true)
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden"
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300) // Match this with the animation duration
            return () => clearTimeout(timer)
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, onClose])

    if (!isOpen && !isAnimating) return null

    return createPortal(
        <div
            ref={ref}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out animate-fade-in ${
                isOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={onClose}
        >
            <div
                className={`bg-white dark:bg-dark_main_color rounded-lg shadow-xl w-[40rem] transform transition-all duration-300 ease-in-out ${
                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <header className={`flex items-center justify-between p-4 dark:border-dark_border_color border-b `}>
                    <h3 className="text-red-600 dark:text-dark_text_color/70 text-xl font-medium">{header}</h3>
                    <div
                        onClick={onClose}
                        className={`bg-main_bg dark:bg-dark_second_color dark:text-dark_text_color dark:hover:bg-dark_border_color transition p-2 rounded-lg cursor-pointer`}
                    >
                        <MdClose/>
                    </div>
                </header>
                <div className={`p-4 ${parent_styles ? parent_styles : ''}`}>
                    {children}
                </div>
            </div>
        </div>,
        document.body,
    )
}

