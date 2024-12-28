import {Modal} from "flowbite-react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {setIsSearchModalOpenSlice} from "../../redux/is_search_modal_open.ts";
import {useRef} from "react";

export default function SearchModal() {
    const isSearchModalOpenSlice = useSelector((state: RootState) => state.isSearchModalOpenReducer.is_open)
    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(setIsSearchModalOpenSlice(false))
    }

    const modalRef = useRef(null)
    return (
        <Modal
            show={isSearchModalOpenSlice}
            onClose={handleClose}
            className={`w-[40rem] !absolute !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 animate-fade-in`}
            ref={modalRef}
        >
            <Modal.Header className={`!border-b modal-header`}>
                <h3 className="text-xl text-main_color_darker font-medium">Search</h3>
            </Modal.Header>
            <Modal.Body>
                <form className="space-y-6">

                </form>
            </Modal.Body>
        </Modal>
    )
}
