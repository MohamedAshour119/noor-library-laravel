interface Props {
    content: string
    styles?: string
}
export default function HeroSectionBtn({content, styles}: Props) {
    return (
        <div className={`border rounded-lg px-6 py-2 cursor-pointer ${styles}`}>
            {content}
        </div>
    )
}
