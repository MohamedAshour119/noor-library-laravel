import './App.css'
import { Route, Routes, useLocation} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Header from "./components/Header.tsx";
import SignUp from "./pages/auth/SignUp.tsx";
import SignIn from "./pages/auth/SignIn.tsx";
import {useEffect, useState} from "react";
import AuthRoute from "./auth/AuthRoute.tsx";
import AuthRedirect from "./auth/AuthRedirect.tsx";
import AddBook from "./pages/AddBook.tsx";
import Profile from "./pages/Profile.tsx";
import Categories from "./pages/Categories.tsx";
import Category from "./pages/Category.tsx";
import {useDispatch} from "react-redux";
import {setActive} from "../redux/is-location-is-not-in-navlink-slice.ts";
import ShowBook from "./pages/ShowBook.tsx";

function App() {
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

    return (
        <>
            {showHeader && <Header />}
            <Routes>
                <Route path={`/`} element={<Home/>}/>
                <Route path="/categories" element={<Categories />} />
                <Route path="/users/:user" element={<Profile />} />
                <Route path="/categories/:category" element={<Category />} />
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
