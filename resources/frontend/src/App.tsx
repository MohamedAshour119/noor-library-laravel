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
import {useDispatch, useSelector} from "react-redux";
import {setActive} from "../redux/is-location-is-not-in-navlink-slice.ts";
import ShowBook from "./pages/ShowBook.tsx";
import {enqueueSnackbar, SnackbarProvider} from "notistack";
import Reviews from "./pages/Reviews.tsx";
import {RootState} from "../redux/store.ts";
import SearchModal from "./components/SearchModal.tsx";
import SearchBookResults from "./pages/SearchBookResults.tsx";
import apiClient from "../ApiClient.ts";
import {setTranslation} from "../redux/translation-slice.ts";
import AddToCartSidebar from "./components/AddToCartSidebar.tsx";

function App() {
    const isSearchModalOpenSlice = useSelector((state: RootState) => state.isSearchModalOpenReducer.is_open)
    const isUnauthorizedMessageOpenSlice = useSelector((state: RootState) => state.isUnauthorizedMessageOpenReducer.is_open)
    // const isTranslationTriggeredSlice = useSelector((state: RootState) => state.isTranslationTriggeredReducer)
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

    const getTranslation = (namespace: string) => {
        // Decode only when necessary
        const decodedNamespace = decodeURIComponent(namespace);

        // Define a pattern matching system to map namespaces
        const namespaceMapping: { [key: string]: string } = {
            home: 'home', // For the home page
            books: 'books', // Static books page
            categories: 'categories', // Static categories page
            users: 'users', // Static users page
            'sign-up': 'sign-up',
            // Add more static namespaces if needed
        };

        // Check if the namespace matches any static mapping
        if (namespaceMapping[decodedNamespace]) {
            if (namespaceMapping[decodedNamespace] === 'sign-up' || namespaceMapping[decodedNamespace] === 'sign-in') {
                return 'auth';
            }else {
                return namespaceMapping[decodedNamespace];
            }
        }

        // Handle dynamic slugs for specific namespaces
        if (decodedNamespace.startsWith('category_')) {
            return decodedNamespace; // Category page with slug
        }
        if (decodedNamespace.startsWith('user_')) {
            return decodedNamespace; // User page with username
        }
        if (decodedNamespace.startsWith('book_')) {
            return decodedNamespace; // Book page with slug
        }

        // Return null if no match found
        return null;
    };

    useEffect(() => {
        const pathSegments = location.pathname.split('/').filter(Boolean); // Remove empty segments
        let namespace = pathSegments[0] || 'home'; // Default to home if no path

        // Handle dynamic routes based on the pattern
        const dynamicRoutePatterns: { [key: string]: string } = {
            categories: 'category_',
            users: 'user_',
            books: 'book_',
            // Add more dynamic routes as needed
        };

        if (pathSegments.length === 2 && dynamicRoutePatterns[pathSegments[0]]) {
            namespace = dynamicRoutePatterns[pathSegments[0]] + decodeURIComponent(pathSegments[1]);
        }

        // Get the valid namespace for the current page
        const validNamespace = getTranslation(namespace);
        if (validNamespace) {
            // Make the API call only once with the valid namespace
            apiClient()
                .get(`/translation/${validNamespace}`)
                .then((res) => {
                    dispatch(setTranslation(res.data.data));
                })
                .catch((err) => {
                    enqueueSnackbar(err.response.data.errors || 'An error occurred');
                });
        }
    }, [location.pathname]); // Trigger when pathname changes



    return (
        <>
            {(isSearchModalOpenSlice || isUnauthorizedMessageOpenSlice) && <div className={`left-0 top-0 w-screen h-screen fixed z-20 bg-black/70 `}></div>}
            {isSearchModalOpenSlice && <SearchModal/>}
            <SnackbarProvider
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            />
            <div className={`relative`}>
                <AddToCartSidebar/>
                {/*{showHeader && <Header handleSelectLanguage={handleSelectLanguage}/>}*/}
                {showHeader && <Header/>}
                <Routes>
                    <Route path={`/`} element={<Home/>}/>
                    <Route path={'/categories'} element={<Categories />}/>
                    <Route path="/users/:user" element={<Profile />} />
                    <Route path={'/categories/:category_slug'} element={<Category />}/>
                    <Route path={'/reviews'} element={<Reviews />}/>
                    <Route path="/books/:slug" element={<ShowBook/>}/>
                    <Route path="/search-books-results" element={<SearchBookResults/>}/>

                    <Route element={<AuthRoute />}>
                        <Route path="/add-book" element={<AddBook />} />
                    </Route>

                    <Route element={<AuthRedirect />}>
                        <Route path={`/sign-up`} element={<SignUp/>}/>
                        <Route path={`/sign-in`} element={<SignIn/>}/>
                    </Route>
                </Routes>
            </div>
        </>
  )
}

export default App
