import './App.css'
import { Route, Routes, useLocation} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Header from "./components/Header.tsx";
import SignUp from "./pages/auth/SignUp.tsx";
import SignIn from "./pages/auth/SignIn.tsx";
import {useEffect, useRef, useState} from "react";
import AuthRoute from "./auth/AuthRoute.tsx";
import AuthRedirect from "./auth/AuthRedirect.tsx";
import AddBook from "./pages/AddBook.tsx";
import Profile from "./pages/Profile.tsx";
import Categories from "./pages/Categories.tsx";
import Category from "./pages/Category.tsx";
import {useDispatch, useSelector} from "react-redux";
import {setActive} from "../redux/is-location-is-not-in-navlink-slice.ts";
import ShowBook from "./pages/ShowBook.tsx";
import {SnackbarProvider} from "notistack";
import Reviews from "./pages/Reviews.tsx";
import {RootState} from "../redux/store.ts";
import SearchModal from "./components/SearchModal.tsx";
import {setIsSearchModalOpenSlice} from "../redux/is_search_modal_open.ts";

function App() {
    const isSearchModalOpenSlice = useSelector((state: RootState) => state.isSearchModalOpenReducer.is_open)
    const dispatch = useDispatch()

    const [showHeader, setShowHeader] = useState(true);
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === '/sign-up' || location.pathname === '/sign-in')
            setShowHeader(false)
        else
            setShowHeader(true)

        const nav_links = ['/', '/home', '/categories', '/authors'];
        if (!nav_links.includes(location.pathname)) {
            dispatch(setActive(true))
        }else {
            dispatch(setActive(false))
        }
    }, [location.pathname]);

    const modalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!modalRef.current?.contains(e.target as Node)) {
                dispatch(setIsSearchModalOpenSlice(false))
            }
        }

        window.addEventListener('mousedown', handleClickOutside)
        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);

    return (
        <>
            {isSearchModalOpenSlice && <div className={`left-0 top-0 w-screen h-screen fixed z-20 bg-black/70 `}></div>}
            {isSearchModalOpenSlice && <SearchModal/>}
            <SnackbarProvider
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            />
            {showHeader && <Header />}
            <Routes>
                <Route path={`/`} element={<Home/>}/>
                <Route path="/categories" element={<Categories />} />
                <Route path="/users/:user" element={<Profile />} />
                <Route path="/categories/:category" element={<Category />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/books/:slug" element={<ShowBook/>}/>

                <Route element={<AuthRoute />}>
                    <Route path="/add-book" element={<AddBook />} />
                </Route>

                <Route element={<AuthRedirect />}>
                    <Route path={`/sign-up`} element={<SignUp/>}/>
                    <Route path={`/sign-in`} element={<SignIn/>}/>
                </Route>
            </Routes>
        </>
  )
}

export default App
