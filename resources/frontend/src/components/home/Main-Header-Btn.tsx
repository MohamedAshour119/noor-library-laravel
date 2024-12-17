interface Props {
    src: string,
    content: string
    styles?: string
    onClick: () => void
    width?: number
    img_Style?: string
}
export default function MainHeaderBtn(props: Props) {
    const {src, content, styles, onClick, width = 50, img_Style} = props

    return (
        <div
            onClick={onClick}
            className={`${styles} pb-4 max-[525px]:w-full w-1/3 flex flex-col items-center gap-y-2 cursor-pointer group border-b-2 border-transparent hover:border-main_color transition`}
        >
            <img
                src={src}
                alt={`main-header-img`}
                width={width}
                className={img_Style}
            />

            <span className={`text-lg group-hover:text-main_color transition`}>{content}</span>
        </div>
    )
}
