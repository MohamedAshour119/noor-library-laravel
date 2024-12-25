
export default function Comment() {
    return (
        <div className={`bg-white grid grid-cols-[5%_95%]`}>
            <img
                src="/home/trending-active.svg"
                alt="trending-active"
                className={`size-12 rounded-full`}
            />
            <div className={`bg-main_bg px-5 py-2 flex flex-col gap-y-2 rounded-lg`}>
                <header className={`flex justify-between`}>
                    <h1>Customer Name</h1>
                    <span>Created at</span>
                </header>
                <div>
                    <h1>My Rating: <span>Rate here</span></h1>
                </div>
                <p>Comment Description Here</p>
            </div>
        </div>
    )
}
