interface Props {
    src: string,
    content: string
    styles?: string
    onClick: () => void
}
export default function MainHeaderBtn({src, content, styles, onClick}: Props) {
    return (
        <div
            onClick={onClick}
            className={`${styles} pb-4 w-1/3 flex flex-col items-center gap-y-2 cursor-pointer group border-b-2 border-transparent hover:border-main_color transition`}
        >
            <img
                src={src}
                alt={`main-header-img`}
            />
            <span className={`text-lg group-hover:text-main_color transition`}>{content}</span>
        </div>
    )
}
